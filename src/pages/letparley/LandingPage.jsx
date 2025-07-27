import { useNavigate } from 'react-router-dom';
import { AppBar, Box, Button, Container, Grid, Toolbar, Typography, useTheme } from '@mui/material';
import IconifyIcon from '../../components/base/IconifyIcon';

const LandingPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate('/letparley/auth/login');
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${theme.palette.grey[900]} 0%, ${theme.palette.primary.dark} 50%, ${theme.palette.grey[900]} 100%)`,
        color: theme.palette.common.white,
      }}
    >
      {/* Navigation Bar */}
      <AppBar
        position="static"
        elevation={0}
        sx={{
          backgroundColor: 'transparent',
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Container maxWidth="lg">
          <Toolbar sx={{ justifyContent: 'space-between', py: 2 }}>
            {/* Logo */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: 40,
                  height: 40,
                  borderRadius: 2,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  fontWeight: 700,
                }}
              >
                <Typography variant="h6" sx={{ color: theme.palette.common.white }}>
                  LP
                </Typography>
              </Box>
              <Typography variant="h5" sx={{ fontWeight: 700, color: theme.palette.common.white }}>
                LetParley
              </Typography>
            </Box>

            {/* Navigation Links */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Button
                color="inherit"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Inicio
              </Button>
              <Button
                color="inherit"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Servicios
              </Button>
              <Button
                color="inherit"
                sx={{
                  textTransform: 'none',
                  fontWeight: 500,
                  '&:hover': {
                    backgroundColor: theme.palette.action.hover,
                    color: theme.palette.primary.main,
                  },
                }}
              >
                Contacto
              </Button>

              {/* Login Button */}
              <Button
                variant="contained"
                onClick={handleLoginClick}
                sx={{
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  py: 1,
                  borderRadius: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  '&:hover': {
                    background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                    transform: 'translateY(-1px)',
                    boxShadow: theme.shadows[4],
                  },
                }}
                startIcon={<IconifyIcon icon="solar:login-3-bold" />}
              >
                Iniciar Sesión
              </Button>
            </Box>
          </Toolbar>
        </Container>
      </AppBar>

      {/* Hero Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={6} alignItems="center" sx={{ minHeight: '70vh' }}>
          {/* Left Content */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box>
              <Typography
                variant="h2"
                sx={{
                  fontWeight: 700,
                  mb: 3,
                  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                  backgroundClip: 'text',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  lineHeight: 1.2,
                }}
              >
                Automatiza los Procesos de tu Negocio con LetParley
              </Typography>

              <Typography
                variant="h5"
                sx={{
                  color: theme.palette.text.secondary,
                  mb: 4,
                  fontWeight: 400,
                  lineHeight: 1.5,
                }}
              >
                Potencia tu empresa con inteligencia artificial para llamadas de voz, mensajería y
                automatización de procesos empresariales.
              </Typography>

              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleLoginClick}
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                      transform: 'translateY(-2px)',
                      boxShadow: theme.shadows[6],
                    },
                  }}
                  startIcon={<IconifyIcon icon="solar:rocket-bold" />}
                >
                  Comenzar Prueba Gratuita
                </Button>

                <Button
                  variant="outlined"
                  size="large"
                  sx={{
                    textTransform: 'none',
                    fontWeight: 600,
                    px: 4,
                    py: 2,
                    borderRadius: 3,
                    fontSize: '1.1rem',
                    borderColor: theme.palette.primary.main,
                    color: theme.palette.primary.main,
                    '&:hover': {
                      borderColor: theme.palette.primary.light,
                      backgroundColor: theme.palette.action.hover,
                      transform: 'translateY(-1px)',
                    },
                  }}
                  startIcon={<IconifyIcon icon="solar:chat-dots-bold" />}
                >
                  Ver Demo
                </Button>
              </Box>
            </Box>
          </Grid>

          {/* Right Content - Visual */}
          <Grid size={{ xs: 12, md: 6 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                position: 'relative',
              }}
            >
              {/* Main Visual Container */}
              <Box
                sx={{
                  width: 400,
                  height: 300,
                  backgroundColor: theme.palette.background.paper,
                  borderRadius: 4,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backdropFilter: 'blur(10px)',
                  border: `1px solid ${theme.palette.divider}`,
                  boxShadow: theme.shadows[3],
                  position: 'relative',
                  overflow: 'hidden',
                }}
              >
                {/* Floating Icons */}
                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    left: 20,
                    animation: 'float 3s ease-in-out infinite',
                    '@keyframes float': {
                      '0%, 100%': { transform: 'translateY(0px)' },
                      '50%': { transform: 'translateY(-10px)' },
                    },
                  }}
                >
                  <IconifyIcon
                    icon="solar:phone-calling-bold"
                    sx={{ fontSize: 40, color: theme.palette.primary.main }}
                  />
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    top: 20,
                    right: 20,
                    animation: 'float 3s ease-in-out infinite 1s',
                  }}
                >
                  <IconifyIcon
                    icon="solar:chat-dots-bold"
                    sx={{ fontSize: 40, color: theme.palette.secondary.main }}
                  />
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    left: 30,
                    animation: 'float 3s ease-in-out infinite 2s',
                  }}
                >
                  <IconifyIcon
                    icon="solar:cpu-bolt-bold"
                    sx={{ fontSize: 40, color: theme.palette.success.main }}
                  />
                </Box>

                <Box
                  sx={{
                    position: 'absolute',
                    bottom: 20,
                    right: 30,
                    animation: 'float 3s ease-in-out infinite 0.5s',
                  }}
                >
                  <IconifyIcon
                    icon="solar:settings-bold"
                    sx={{ fontSize: 40, color: theme.palette.warning.main }}
                  />
                </Box>

                {/* Central Logo/Icon */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: 100,
                    height: 100,
                    borderRadius: 3,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    mb: 2,
                    boxShadow: theme.shadows[4],
                  }}
                >
                  <Typography
                    variant="h3"
                    sx={{ color: theme.palette.common.white, fontWeight: 700 }}
                  >
                    LP
                  </Typography>
                </Box>

                <Typography
                  variant="h6"
                  sx={{
                    color: theme.palette.primary.main,
                    fontWeight: 600,
                    textAlign: 'center',
                  }}
                >
                  Inteligencia Artificial
                  <br />
                  para Empresas
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Typography
          variant="h4"
          sx={{
            textAlign: 'center',
            fontWeight: 700,
            mb: 6,
            color: theme.palette.primary.main,
          }}
        >
          Características Principales
        </Typography>

        <Grid container spacing={4}>
          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <IconifyIcon
                icon="solar:phone-calling-bold"
                sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
              >
                Llamadas de Voz con IA
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Automatiza las llamadas de ventas y servicio al cliente con inteligencia artificial
                avanzada.
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <IconifyIcon
                icon="solar:chat-dots-bold"
                sx={{ fontSize: 48, color: theme.palette.secondary.main, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
              >
                Mensajería Inteligente
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Gestiona conversaciones automáticas por WhatsApp, SMS y otros canales de mensajería.
              </Typography>
            </Box>
          </Grid>

          <Grid size={{ xs: 12, md: 4 }}>
            <Box
              sx={{
                textAlign: 'center',
                p: 3,
                borderRadius: 3,
                backgroundColor: theme.palette.background.paper,
                border: `1px solid ${theme.palette.divider}`,
                height: '100%',
              }}
            >
              <IconifyIcon
                icon="solar:settings-bold"
                sx={{ fontSize: 48, color: theme.palette.success.main, mb: 2 }}
              />
              <Typography
                variant="h6"
                sx={{ fontWeight: 600, mb: 2, color: theme.palette.text.primary }}
              >
                Automatización
              </Typography>
              <Typography variant="body2" sx={{ color: theme.palette.text.secondary }}>
                Optimiza procesos empresariales con flujos de trabajo automatizados y
                personalizables.
              </Typography>
            </Box>
          </Grid>
        </Grid>
      </Container>

      {/* Footer */}
      <Box
        sx={{
          borderTop: `1px solid ${theme.palette.divider}`,
          py: 3,
          mt: 6,
        }}
      >
        <Container maxWidth="lg">
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: 2,
            }}
          >
            <Typography variant="body2" sx={{ color: theme.palette.text.disabled }}>
              © 2024 LetParley. Todos los derechos reservados.
            </Typography>
            <Box sx={{ display: 'flex', gap: 2 }}>
              <Button
                color="inherit"
                size="small"
                sx={{
                  textTransform: 'none',
                  color: theme.palette.text.disabled,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                Privacidad
              </Button>
              <Button
                color="inherit"
                size="small"
                sx={{
                  textTransform: 'none',
                  color: theme.palette.text.disabled,
                  '&:hover': { color: theme.palette.primary.main },
                }}
              >
                Términos
              </Button>
            </Box>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default LandingPage;
