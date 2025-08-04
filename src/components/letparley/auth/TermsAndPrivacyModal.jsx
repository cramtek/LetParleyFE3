import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  Link,
  Paper,
  Typography,
  alpha,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from '../../base/IconifyIcon';

const TermsAndPrivacyModal = ({ open = false, onClose }) => {
  const theme = useTheme();

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          maxHeight: '90vh',
          background: alpha(theme.palette.background.paper, 0.98),
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          pb: 2,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconifyIcon
              icon="solar:document-text-bold"
              sx={{ fontSize: 20, color: theme.palette.primary.main }}
            />
          </Box>
          <Typography variant="h5" sx={{ fontWeight: 600 }}>
            Términos y Políticas de Privacidad
          </Typography>
        </Box>

        <IconButton
          onClick={onClose}
          sx={{
            color: theme.palette.text.secondary,
            '&:hover': {
              backgroundColor: alpha(theme.palette.text.secondary, 0.04),
            },
          }}
        >
          <IconifyIcon icon="solar:close-circle-outline" sx={{ fontSize: 24 }} />
        </IconButton>
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ py: 3 }}>
        <Box sx={{ space: 3 }}>
          {/* Terms and Conditions Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.primary.main, 0.03),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconifyIcon
                icon="solar:document-bold"
                sx={{ fontSize: 24, color: theme.palette.primary.main }}
              />
              <Typography variant="h6" sx={{ fontWeight: 600, color: theme.palette.primary.main }}>
                Términos y Condiciones
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}
            >
              Al utilizar LetParley, aceptas cumplir con nuestros términos y condiciones que rigen
              el uso de nuestra plataforma. Estos términos establecen las reglas para el uso del
              servicio, las responsabilidades de los usuarios, y las limitaciones de
              responsabilidad.
            </Typography>

            <Link
              href="https://letparley.com/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.primary.main,
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.primary.dark,
                },
              }}
            >
              <IconifyIcon icon="solar:external-link-outline" sx={{ fontSize: 16 }} />
              Ver Términos y Condiciones completos
            </Link>
          </Paper>

          {/* Privacy Policy Section */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.secondary.main, 0.03),
              border: `1px solid ${alpha(theme.palette.secondary.main, 0.1)}`,
              mb: 3,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
              <IconifyIcon
                icon="solar:shield-check-bold"
                sx={{ fontSize: 24, color: theme.palette.secondary.main }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, color: theme.palette.secondary.main }}
              >
                Política de Privacidad
              </Typography>
            </Box>

            <Typography
              variant="body2"
              sx={{ color: theme.palette.text.secondary, mb: 2, lineHeight: 1.6 }}
            >
              Nuestra política de privacidad describe cómo recopilamos, usamos y protegemos tu
              información personal. Respetamos tu privacidad y nos comprometemos a proteger tus
              datos personales de acuerdo con las leyes y regulaciones aplicables.
            </Typography>

            <Link
              href="https://letparley.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 1,
                color: theme.palette.secondary.main,
                textDecoration: 'none',
                fontWeight: 500,
                '&:hover': {
                  textDecoration: 'underline',
                  color: theme.palette.secondary.dark,
                },
              }}
            >
              <IconifyIcon icon="solar:external-link-outline" sx={{ fontSize: 16 }} />
              Ver Política de Privacidad completa
            </Link>
          </Paper>

          {/* Important Notice */}
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              backgroundColor: alpha(theme.palette.info.main, 0.05),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`,
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 2 }}>
              <IconifyIcon
                icon="solar:info-circle-bold"
                sx={{
                  fontSize: 24,
                  color: theme.palette.info.main,
                  flexShrink: 0,
                  mt: 0.5,
                }}
              />
              <Box>
                <Typography
                  variant="subtitle2"
                  sx={{ fontWeight: 600, color: theme.palette.info.main, mb: 1 }}
                >
                  Información Importante
                </Typography>
                <Typography
                  variant="body2"
                  sx={{ color: theme.palette.text.secondary, lineHeight: 1.6 }}
                >
                  Al marcar la casilla de aceptación, confirmas que has leído, entendido y aceptado
                  nuestros Términos y Condiciones y nuestra Política de Privacidad. Esta aceptación
                  es necesaria para utilizar LetParley y cumplir con los requisitos de Meta y las
                  regulaciones legales aplicables.
                </Typography>
              </Box>
            </Box>
          </Paper>

          <Divider sx={{ my: 3 }} />

          {/* Additional Information */}
          <Box sx={{ textAlign: 'center' }}>
            <Typography
              variant="caption"
              sx={{ color: theme.palette.text.disabled, mb: 2, display: 'block' }}
            >
              Última actualización: Enero 2024
            </Typography>

            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 2,
                flexWrap: 'wrap',
              }}
            >
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconifyIcon
                  icon="solar:check-circle-bold"
                  sx={{ fontSize: 16, color: theme.palette.success.main }}
                />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Cumplimiento GDPR
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconifyIcon
                  icon="solar:shield-check-bold"
                  sx={{ fontSize: 16, color: theme.palette.success.main }}
                />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Datos Protegidos
                </Typography>
              </Box>

              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <IconifyIcon
                  icon="solar:global-bold"
                  sx={{ fontSize: 16, color: theme.palette.success.main }}
                />
                <Typography variant="caption" sx={{ color: theme.palette.text.secondary }}>
                  Estándares Internacionales
                </Typography>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          px: 3,
          py: 2,
          borderTop: `1px solid ${theme.palette.divider}`,
          backgroundColor: alpha(theme.palette.background.default, 0.5),
        }}
      >
        <Button
          onClick={onClose}
          variant="contained"
          size="large"
          sx={{
            borderRadius: 2,
            textTransform: 'none',
            fontWeight: 600,
            px: 4,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            '&:hover': {
              background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
              transform: 'translateY(-1px)',
              boxShadow: theme.shadows[4],
            },
          }}
          startIcon={<IconifyIcon icon="solar:check-circle-outline" />}
        >
          Entendido
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default TermsAndPrivacyModal;
