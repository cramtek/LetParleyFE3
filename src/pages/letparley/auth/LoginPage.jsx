import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Fade,
  InputAdornment,
  Link,
  Paper,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from '../../../components/base/IconifyIcon';
import LetParleyLogo from '../../../components/letparley/common/LetParleyLogo';
import { useLetParleyAuth } from '../../../providers/LetParleyAuthProvider';
import { checkTermsAcceptance, isValidEmail } from '../../../services/letparley/authService';

const LoginPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setVerificationEmail, setError, clearError, error } = useLetParleyAuth();

  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(false);
  const [_showTermsModal, setShowTermsModal] = useState(false);

  // Check terms acceptance when email changes
  useEffect(() => {
    const checkUserTerms = async () => {
      if (!email || !isValidEmail(email)) return;

      setIsCheckingTerms(true);
      try {
        const { accepted } = await checkTermsAcceptance(email);
        setHasAcceptedTerms(accepted);
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        setHasAcceptedTerms(false);
      } finally {
        setIsCheckingTerms(false);
      }
    };

    // Debounce the API call
    const timeoutId = setTimeout(checkUserTerms, 500);
    return () => clearTimeout(timeoutId);
  }, [email]);

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
    clearError();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('🚀 Login form submitted with email:', email);

    if (!email) {
      setError('El email es requerido');
      return;
    }

    if (!isValidEmail(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    clearError();

    try {
      console.log('📧 Sending verification code to:', email);

      // Direct fetch call for debugging
      console.log('🌐 Making direct API call...');
      const response = await fetch('https://api3.letparley.com/lpmobile/sendcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      console.log('📡 Response status:', response.status);
      console.log('📡 Response ok:', response.ok);

      const data = await response.json();
      console.log('📊 Response data:', data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al enviar el código de verificación');
      }

      // Store email for verification page
      setVerificationEmail(email);

      // Show success state briefly before navigating
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/letparley/auth/verify');
      }, 1500);
    } catch (err) {
      console.error('❌ Error sending verification code:', err);
      setError(err.message || 'Error de red. Verifica tu conexión.');
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)} 0%, ${alpha(theme.palette.secondary.main, 0.1)} 50%, ${alpha(theme.palette.success.main, 0.1)} 100%)`,
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
              maxWidth: 400,
              width: '100%',
              textAlign: 'center',
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box
              sx={{
                width: 64,
                height: 64,
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
                icon="solar:letter-bold"
                sx={{
                  fontSize: 32,
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

            <Typography
              variant="h5"
              sx={{ fontWeight: 700, mb: 2, color: theme.palette.text.primary }}
            >
              ¡Código Enviado!
            </Typography>

            <Typography variant="body1" sx={{ mb: 3, color: theme.palette.text.secondary }}>
              Hemos enviado un código de verificación a{' '}
              <Typography
                component="span"
                sx={{ fontWeight: 600, color: theme.palette.primary.main }}
              >
                {email}
              </Typography>
            </Typography>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}>
              <CircularProgress size={20} sx={{ color: theme.palette.primary.main }} />
              <Typography variant="body2" color="text.secondary">
                Redirigiendo...
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
          <Box sx={{ mb: 3 }}>
            <LetParleyLogo showName={true} showFullName={false} sx={{ justifyContent: 'center' }} />
          </Box>

          <Typography
            variant="h3"
            sx={{
              fontWeight: 700,
              mb: 1,
              background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              display: 'inline-block',
            }}
          >
            Bienvenido a LetParley
          </Typography>

          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 1 }}>
            Mensajería, Automatización y Desarrollo
          </Typography>

          <Box
            sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, mb: 3 }}
          >
            <IconifyIcon
              icon="solar:star-bold"
              sx={{ fontSize: 16, color: theme.palette.warning.main }}
            />
            <Typography variant="body2" color="text.secondary">
              Ingresa tu email para comenzar
            </Typography>
            <IconifyIcon
              icon="solar:star-bold"
              sx={{ fontSize: 16, color: theme.palette.warning.main }}
            />
          </Box>
        </Box>

        {/* Form Section */}
        <Paper
          elevation={8}
          sx={{
            p: 4,
            borderRadius: 3,
            background: alpha(theme.palette.background.paper, 0.95),
            backdropFilter: 'blur(10px)',
            border: `1px solid ${alpha(theme.palette.divider, 0.1)}`,
          }}
        >
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <TextField
              fullWidth
              id="email"
              name="email"
              type="email"
              label="Dirección de email"
              value={email}
              onChange={handleEmailChange}
              disabled={isLoading}
              error={!!error && !isLoading}
              size="large"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <IconifyIcon
                      icon="solar:letter-outline"
                      sx={{ color: theme.palette.text.secondary }}
                    />
                  </InputAdornment>
                ),
                endAdornment: isCheckingTerms && (
                  <InputAdornment position="end">
                    <CircularProgress size={20} />
                  </InputAdornment>
                ),
                sx: {
                  borderRadius: 2,
                  '& .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.divider, 0.3),
                  },
                  '&:hover .MuiOutlinedInput-notchedOutline': {
                    borderColor: alpha(theme.palette.primary.main, 0.5),
                  },
                  '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                    borderColor: theme.palette.primary.main,
                    borderWidth: 2,
                  },
                },
              }}
              sx={{ mb: 3 }}
            />

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
              disabled={isLoading || !email || !isValidEmail(email)}
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
                isLoading ? (
                  <CircularProgress size={20} sx={{ color: 'inherit' }} />
                ) : (
                  <IconifyIcon icon="solar:arrow-right-outline" />
                )
              }
            >
              {isLoading ? 'Enviando código...' : 'Continuar'}
            </Button>

            {/* Terms Status */}
            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                Te enviaremos un código de verificación por email.
                <br />
                Si no tienes cuenta, la crearemos automáticamente.
              </Typography>

              {hasAcceptedTerms ? (
                <Box
                  sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1 }}
                >
                  <IconifyIcon
                    icon="solar:check-circle-bold"
                    sx={{ fontSize: 16, color: theme.palette.success.main }}
                  />
                  <Typography variant="caption" sx={{ color: theme.palette.success.main }}>
                    Ya has aceptado nuestros términos y políticas de privacidad
                  </Typography>
                </Box>
              ) : (
                <Typography variant="caption" color="text.secondary">
                  Al continuar, aceptas nuestros{' '}
                  <Link
                    component="button"
                    type="button"
                    variant="caption"
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
              )}
            </Box>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default LoginPage;
