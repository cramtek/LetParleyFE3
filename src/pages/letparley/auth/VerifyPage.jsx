import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  Container,
  Divider,
  Fade,
  FormControlLabel,
  Grid,
  Link,
  Paper,
  Typography,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from '../../../components/base/IconifyIcon';
import LetParleyLogo from '../../../components/letparley/common/LetParleyLogo';
import StyledTextField from '../../../components/styled/StyledTextField';
import { useLetParleyAuth } from '../../../providers/LetParleyAuthProvider';
import {
  acceptTerms,
  checkTermsAcceptance,
  isValidCode,
  verifyCode,
} from '../../../services/letparley/authService';

const totalInputLength = 4; // LetParley uses 4-digit codes

const VerifyPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const inputRefs = useRef([]);

  const {
    verificationEmail,
    signIn,
    setError,
    clearError,
    error,
    setAuthenticating,
    isAuthenticating,
  } = useLetParleyAuth();

  const [verificationCode, setVerificationCode] = useState(Array(totalInputLength).fill(''));
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(true);
  const [_showTermsModal, setShowTermsModal] = useState(false);
  const [termsCheckboxValue, setTermsCheckboxValue] = useState(false);

  // Redirect to login if email is not set
  useEffect(() => {
    if (!verificationEmail) {
      navigate('/letparley/auth/login');
    }
  }, [verificationEmail, navigate]);

  // Check if user has already accepted terms
  useEffect(() => {
    const checkUserTerms = async () => {
      if (!verificationEmail) return;

      setIsCheckingTerms(true);
      try {
        const { accepted } = await checkTermsAcceptance(verificationEmail);
        setHasAcceptedTerms(accepted);
        setTermsCheckboxValue(accepted); // Pre-check if already accepted
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        setHasAcceptedTerms(false);
        setTermsCheckboxValue(false);
      } finally {
        setIsCheckingTerms(false);
      }
    };

    checkUserTerms();
  }, [verificationEmail]);

  const handleInputChange = (e, index) => {
    const { value } = e.target;

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }

    if (value) {
      // Handle paste or multi-character input
      [...value].slice(0, totalInputLength).forEach((char, charIndex) => {
        if (inputRefs.current && inputRefs.current[index + charIndex]) {
          inputRefs.current[index + charIndex].value = char;
          inputRefs.current[index + charIndex + 1]?.focus();
        }
      });

      // Update state
      const updatedCode = inputRefs.current.reduce((acc, input) => acc + (input?.value || ''), '');
      const newCodeArray = updatedCode.split('').slice(0, totalInputLength);
      while (newCodeArray.length < totalInputLength) {
        newCodeArray.push('');
      }
      setVerificationCode(newCodeArray);

      // Auto-submit if code is complete and terms are accepted
      if (updatedCode.length === totalInputLength) {
        const shouldAutoSubmit = hasAcceptedTerms || termsCheckboxValue;
        if (shouldAutoSubmit) {
          console.log('✅ Auto-submit allowed - terms accepted');
          setTimeout(() => {
            submitCode(updatedCode);
          }, 100);
        } else {
          console.log('⏸️ Auto-submit blocked - terms not accepted');
        }
      }
    }
  };

  const handleKeyDown = (event, index) => {
    if (event.key === 'Backspace') {
      inputRefs.current[index].value = '';
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();

      const updatedCode = inputRefs.current.reduce((acc, input) => acc + (input?.value || ''), '');
      const newCodeArray = updatedCode.split('').slice(0, totalInputLength);
      while (newCodeArray.length < totalInputLength) {
        newCodeArray.push('');
      }
      setVerificationCode(newCodeArray);
    }
    if (event.key === 'ArrowLeft') {
      inputRefs.current[index - 1]?.focus();
      inputRefs.current[index - 1]?.select();
    }
    if (event.key === 'ArrowRight') {
      inputRefs.current[index + 1]?.focus();
      inputRefs.current[index + 1]?.select();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);

      // Set values in inputs
      newCode.forEach((digit, index) => {
        if (inputRefs.current[index]) {
          inputRefs.current[index].value = digit;
        }
      });

      // Focus the last input
      inputRefs.current[totalInputLength - 1]?.focus();

      // Auto-submit if terms are accepted
      const shouldAutoSubmit = hasAcceptedTerms || termsCheckboxValue;
      if (shouldAutoSubmit) {
        console.log('✅ Auto-submit (paste) allowed - terms accepted');
        setTimeout(() => {
          submitCode(pastedData);
        }, 100);
      } else {
        console.log('⏸️ Auto-submit (paste) blocked - terms not accepted');
      }
    }
  };

  const submitCode = async (code) => {
    const codeToVerify = code || verificationCode.join('');

    if (!isValidCode(codeToVerify)) {
      setError('Por favor ingresa un código válido de 4 dígitos');
      return;
    }

    // Check terms acceptance
    const shouldProceed = hasAcceptedTerms || termsCheckboxValue;
    if (!shouldProceed && !isCheckingTerms) {
      setError('Debes aceptar los términos y políticas de privacidad para continuar');
      return;
    }

    setAuthenticating(true);
    clearError();

    try {
      // Step 1: Verify code
      const data = await verifyCode(verificationEmail, codeToVerify);

      if (data.success && data.session_token) {
        console.log('✅ Verification successful:', data);

        // Step 2: If user accepted terms via checkbox, register it
        if (termsCheckboxValue && !hasAcceptedTerms) {
          try {
            console.log('📝 Registering terms acceptance...');
            const termsResult = await acceptTerms(verificationEmail);

            if (termsResult.success) {
              console.log('✅ Terms accepted and registered');
            } else {
              console.error('❌ Error registering terms:', termsResult.message);
            }
          } catch (acceptError) {
            console.error('❌ Error in acceptTerms:', acceptError);
          }
        }

        // Step 3: Store success data and show animation
        setSuccessData(data);
        setIsSuccess(true);

        // Step 4: Sign in (synchronous) and then navigate
        signIn(data.session_token, verificationEmail, data.user_id, data.is_new_user);
        console.log('✅ SignIn completed successfully');

        // Navigate after success animation - let the auth guards handle the redirect logic
        setTimeout(() => {
          navigate('/letparley');
        }, 2500);
      } else {
        setError(data.message || 'Error al verificar el código');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setAuthenticating(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await submitCode();
  };

  const handleTermsCheckboxChange = (e) => {
    const isChecked = e.target.checked;
    setTermsCheckboxValue(isChecked);

    if (error) clearError();

    // If just accepted terms and code is complete, enable auto-submit
    if (isChecked && verificationCode.join('').length === totalInputLength) {
      console.log('✅ Terms accepted with complete code - enabling submit');
    }
  };

  const handleResendCode = () => {
    navigate('/letparley/auth/login');
  };

  // Show loading state while checking terms acceptance
  if (isCheckingTerms) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.default, 1)} 50%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            maxWidth: 400,
            width: '100%',
            textAlign: 'center',
          }}
        >
          <CircularProgress size={40} sx={{ mb: 2 }} />
          <Typography variant="body1" color="text.secondary">
            Cargando...
          </Typography>
        </Paper>
      </Box>
    );
  }

  // Success animation component
  if (isSuccess && successData) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.success.main, 0.1)} 0%, ${alpha(theme.palette.primary.main, 0.1)} 50%, ${alpha(theme.palette.secondary.main, 0.1)} 100%)`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          p: 2,
        }}
      >
        <Fade in={true} timeout={500}>
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              maxWidth: 500,
              width: '100%',
              textAlign: 'center',
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            }}
          >
            {/* Success Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                backgroundColor: alpha(theme.palette.success.main, 0.1),
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                mx: 'auto',
                mb: 3,
                animation: 'pulse 2s ease-in-out infinite',
                '@keyframes pulse': {
                  '0%': { transform: 'scale(1)' },
                  '50%': { transform: 'scale(1.05)' },
                  '100%': { transform: 'scale(1)' },
                },
              }}
            >
              <IconifyIcon
                icon="solar:check-circle-bold"
                sx={{
                  fontSize: 48,
                  color: theme.palette.success.main,
                  animation: 'bounce 1s ease-in-out infinite',
                  '@keyframes bounce': {
                    '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                    '40%': { transform: 'translateY(-8px)' },
                    '60%': { transform: 'translateY(-4px)' },
                  },
                }}
              />
            </Box>

            {/* Welcome Message */}
            <Box sx={{ mb: 3 }}>
              {successData.is_new_user ? (
                <>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}
                  >
                    <IconifyIcon
                      icon="solar:star-bold"
                      sx={{ fontSize: 24, color: theme.palette.warning.main, mr: 1 }}
                    />
                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                      ¡Bienvenido a LetParley!
                    </Typography>
                    <IconifyIcon
                      icon="solar:star-bold"
                      sx={{ fontSize: 24, color: theme.palette.warning.main, ml: 1 }}
                    />
                  </Box>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {successData.message}
                    </Typography>
                  </Paper>
                </>
              ) : (
                <>
                  <Typography variant="h4" sx={{ fontWeight: 700, mb: 2 }}>
                    ¡Bienvenido de vuelta!
                  </Typography>
                  <Paper
                    sx={{
                      p: 2,
                      borderRadius: 2,
                      backgroundColor: alpha(theme.palette.primary.main, 0.1),
                      border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
                    }}
                  >
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      {successData.message}
                    </Typography>
                  </Paper>
                </>
              )}
            </Box>

            {/* Loading indicator */}
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary">
                Preparando tu experiencia...
              </Typography>
              <IconifyIcon
                icon="solar:arrow-right-outline"
                sx={{
                  fontSize: 16,
                  color: theme.palette.text.secondary,
                  animation: 'pulse 1s ease-in-out infinite',
                }}
              />
            </Box>
          </Paper>
        </Fade>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.default, 1)} 50%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        {/* Logo Section */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <Box sx={{ mb: 2 }}>
            <LetParleyLogo showName={true} showFullName={false} sx={{ justifyContent: 'center' }} />
          </Box>

          <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
            Código de Verificación
          </Typography>

          <Typography variant="body1" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Hemos enviado un código de 4 dígitos a
          </Typography>

          <Typography variant="body1" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
            {verificationEmail}
          </Typography>
        </Box>

        {/* Form Section */}
        <Paper
          elevation={4}
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Typography
              variant="body2"
              sx={{ textAlign: 'center', mb: 3, color: theme.palette.text.secondary }}
            >
              Ingresa el código de verificación
            </Typography>

            {/* Code Input */}
            <Grid
              container
              spacing={2}
              sx={{
                justifyContent: 'center',
                mb: 3,
              }}
            >
              {Array(totalInputLength)
                .fill('')
                .map((_, index) => (
                  <Grid key={index}>
                    <StyledTextField
                      inputRef={(el) => {
                        inputRefs.current[index] = el;
                      }}
                      type="number"
                      disabledSpinButton
                      disabled={isAuthenticating}
                      sx={{
                        width: '60px',
                        '& .MuiInputBase-input': {
                          textAlign: 'center',
                          fontSize: '1.5rem',
                          fontWeight: 600,
                          py: 2,
                        },
                      }}
                      slotProps={{
                        input: {
                          sx: {
                            borderRadius: 2,
                            '& .MuiInputBase-input': {
                              textAlign: 'center',
                              px: '12px !important',
                            },
                          },
                        },
                      }}
                      onClick={() => inputRefs.current[index]?.select()}
                      onFocus={() => inputRefs.current[index]?.select()}
                      onKeyUp={(e) => handleKeyDown(e, index)}
                      onChange={(e) => handleInputChange(e, index)}
                      onPaste={index === 0 ? handlePaste : undefined}
                      size="large"
                    />
                  </Grid>
                ))}
            </Grid>

            <Typography
              variant="caption"
              sx={{
                display: 'block',
                textAlign: 'center',
                mb: 3,
                color: theme.palette.text.disabled,
              }}
            >
              Revisa tu bandeja de entrada y carpeta de spam
            </Typography>

            {/* Terms and Conditions Checkbox - Only show if not already accepted */}
            {!hasAcceptedTerms && (
              <>
                <Divider sx={{ my: 3 }} />
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={termsCheckboxValue}
                      onChange={handleTermsCheckboxChange}
                      size="small"
                      sx={{
                        color: theme.palette.primary.main,
                        '&.Mui-checked': {
                          color: theme.palette.primary.main,
                        },
                      }}
                    />
                  }
                  label={
                    <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                      Acepto los{' '}
                      <Link
                        component="button"
                        type="button"
                        variant="body2"
                        onClick={() => setShowTermsModal(true)}
                        sx={{
                          color: theme.palette.primary.main,
                          textDecoration: 'underline',
                          '&:hover': {
                            color: theme.palette.primary.dark,
                          },
                        }}
                      >
                        Términos y Condiciones y Políticas de Privacidad
                      </Link>
                    </Typography>
                  }
                  sx={{ mb: 2 }}
                />
                <Typography
                  variant="caption"
                  sx={{ display: 'block', color: theme.palette.text.disabled, mb: 3 }}
                >
                  Requerido para usar LetParley
                </Typography>
              </>
            )}

            {/* Error Alert */}
            {error && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={clearError}>
                {error}
              </Alert>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={
                isAuthenticating ||
                verificationCode.join('').length !== totalInputLength ||
                (!hasAcceptedTerms && !termsCheckboxValue)
              }
              sx={{
                py: 1.5,
                borderRadius: 2,
                textTransform: 'none',
                fontSize: '1rem',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                boxShadow: theme.shadows[4],
                '&:hover': {
                  background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                  boxShadow: theme.shadows[4],
                  transform: 'translateY(-1px)',
                },
                '&:disabled': {
                  background: alpha(theme.palette.action.disabled, 0.12),
                  color: theme.palette.action.disabled,
                },
                mb: 3,
              }}
              startIcon={
                isAuthenticating ? (
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                ) : (
                  <IconifyIcon icon="solar:check-circle-outline" />
                )
              }
            >
              {isAuthenticating
                ? 'Verificando...'
                : !hasAcceptedTerms && !termsCheckboxValue
                  ? 'Acepta términos para continuar'
                  : 'Verificar Código'}
            </Button>

            {/* Resend Code */}
            <Box sx={{ textAlign: 'center' }}>
              <Button
                variant="text"
                onClick={handleResendCode}
                disabled={isAuthenticating}
                sx={{
                  textTransform: 'none',
                  color: theme.palette.primary.main,
                  '&:hover': {
                    backgroundColor: alpha(theme.palette.primary.main, 0.04),
                  },
                }}
              >
                ¿No recibiste el código? Enviar de nuevo
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default VerifyPage;
