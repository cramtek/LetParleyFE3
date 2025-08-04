import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Fade,
  Paper,
  Typography,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from '../../components/base/IconifyIcon';
import LetParleyLogo from '../../components/letparley/common/LetParleyLogo';
// import CreateBusinessWizard from '../../components/letparley/business/CreateBusinessWizard';
import LoadingScreen from '../../components/letparley/common/LoadingScreen';
import { useLetParleyAuth } from '../../providers/LetParleyAuthProvider';
import { fetchBusinesses, formatBusinessData } from '../../services/letparley/businessService';

const SelectBusinessPage = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const { setSelectedBusinessId, setSelectedBusinessName, authContext } = useLetParleyAuth();

  const [businesses, setBusinesses] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showCreateWizard, setShowCreateWizard] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!authContext?.sessionToken) {
      console.log('⏸️ No authContext available, redirecting to login...');
      navigate('/letparley/auth/login', { replace: true });
      return;
    }

    // Fetch businesses when component mounts
    console.log('🚀 Loading businesses...');
    const loadBusinesses = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const data = await fetchBusinesses(authContext);
        setBusinesses(data);
        console.log(`📊 Loaded ${data.length} businesses`);
      } catch (err) {
        console.error('❌ Error loading businesses:', err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    loadBusinesses();
  }, [authContext?.sessionToken, navigate]);

  // Auto-select if only one business - separate useEffect like OLD project
  useEffect(() => {
    if (businesses.length === 1 && !isLoading && !error) {
      console.log('🔄 Auto-selecting single business:', businesses[0].business_id);
      setSelectedBusinessId(businesses[0].business_id.toString());
      setSelectedBusinessName(businesses[0].name);
      navigate('/letparley/dashboard', { replace: true });
    }
  }, [businesses, isLoading, error, setSelectedBusinessId, setSelectedBusinessName, navigate]);

  const handleSelectBusiness = (business) => {
    console.log('🏢 Selecting business:', business.business_id, business.name);
    setSelectedBusinessId(business.business_id.toString());
    setSelectedBusinessName(business.name);
    navigate('/letparley/dashboard', { replace: true });
  };

  const handleCreateSuccess = (businessId) => {
    console.log('✅ Business created successfully:', businessId);
    setShowCreateWizard(false);
    setSelectedBusinessId(businessId.toString());
    navigate('/letparley/dashboard', { replace: true });
  };

  const handleRetry = async () => {
    if (!authContext?.sessionToken) {
      console.log('⏸️ No authContext available, waiting...');
      return;
    }

    console.log('🚀 Retrying to load businesses...');
    setIsLoading(true);
    setError(null);

    try {
      const data = await fetchBusinesses(authContext);
      setBusinesses(data);


      console.log(`📊 Loaded ${data.length} businesses`);
    } catch (err) {
      console.error('❌ Error loading businesses:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Show loading screen
  if (isLoading) {
    return <LoadingScreen message="Cargando tus negocios..." />;
  }

  // Show error screen
  if (error) {
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
          <Paper
            elevation={4}
            sx={{
              p: 4,
              borderRadius: 3,
              textAlign: 'center',
              background: alpha(theme.palette.background.paper, 0.95),
              backdropFilter: 'blur(10px)',
            }}
          >
            <Box sx={{ mb: 3 }}>
              <LetParleyLogo showName={true} showFullName={false} sx={{ justifyContent: 'center' }} />
            </Box>

            <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
              {error}
            </Alert>

            <Button
              variant="contained"
              onClick={handleRetry}
              sx={{
                borderRadius: 2,
                textTransform: 'none',
                fontWeight: 600,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
              startIcon={<IconifyIcon icon="solar:refresh-outline" />}
            >
              Intentar de nuevo
            </Button>
          </Paper>
        </Container>
      </Box>
    );
  }

  // No businesses - show create wizard prompt
  if (businesses.length === 0) {
    return (
      <Box
        sx={{
          minHeight: '100vh',
          background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.default, 1)} 50%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
          py: 4,
          px: 2,
        }}
      >
        <Container maxWidth="lg">
          {/* Header */}
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Box sx={{ mb: 3 }}>
              <LetParleyLogo showName={true} showFullName={false} sx={{ justifyContent: 'center' }} />
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 3 }}>
              <IconifyIcon
                icon="solar:star-bold"
                sx={{ fontSize: 32, color: theme.palette.warning.main, mr: 2 }}
              />
              <Typography variant="h3" sx={{ fontWeight: 700 }}>
                ¡Bienvenido a LetParley!
              </Typography>
              <IconifyIcon
                icon="solar:star-bold"
                sx={{ fontSize: 32, color: theme.palette.warning.main, ml: 2 }}
              />
            </Box>

            <Typography variant="h5" sx={{ color: theme.palette.text.secondary, mb: 2 }}>
              Para comenzar, necesitas crear tu primer negocio
            </Typography>

            <Typography variant="body1" color="text.secondary">
              Esto te permitirá gestionar conversaciones y conectar con tus clientes
            </Typography>
          </Box>

          {/* Create Business Card */}
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            <Fade in={true} timeout={800}>
              <Card
                elevation={4}
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  background: alpha(theme.palette.background.paper, 0.95),
                  backdropFilter: 'blur(10px)',
                  transition: 'all 0.3s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: theme.shadows[6],
                  },
                }}
              >
                <Box
                  sx={{
                    background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                    color: 'white',
                    p: 4,
                    textAlign: 'center',
                  }}
                >
                  <IconifyIcon
                    icon="solar:buildings-2-bold"
                    sx={{
                      fontSize: 48,
                      mb: 2,
                      animation: 'bounce 2s ease-in-out infinite',
                      '@keyframes bounce': {
                        '0%, 20%, 50%, 80%, 100%': { transform: 'translateY(0)' },
                        '40%': { transform: 'translateY(-8px)' },
                        '60%': { transform: 'translateY(-4px)' },
                      },
                    }}
                  />
                  <Typography variant="h4" sx={{ fontWeight: 700 }}>
                    Crear Mi Primer Negocio
                  </Typography>
                </Box>

                <CardContent sx={{ p: 4 }}>
                  <Box sx={{ textAlign: 'center', mb: 4 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                      Configura tu negocio en minutos
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                      Te guiaremos paso a paso para configurar toda la información de tu empresa
                    </Typography>
                  </Box>

                  <Button
                    fullWidth
                    variant="contained"
                    size="large"
                    disabled
                    sx={{
                      py: 2,
                      borderRadius: 2,
                      textTransform: 'none',
                      fontSize: '1.1rem',
                      fontWeight: 600,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      boxShadow: theme.shadows[4],
                      '&:hover': {
                        background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                        boxShadow: theme.shadows[4],
                        transform: 'translateY(-1px)',
                      },
                    }}
                    startIcon={<IconifyIcon icon="solar:add-circle-bold" />}
                  >
                    Crear Mi Negocio (Temporalmente deshabilitado)
                  </Button>
                </CardContent>
              </Card>
            </Fade>
          </Box>
        </Container>

        {/* Create Business Wizard - temporarily disabled */}
        {/* <CreateBusinessWizard
          open={showCreateWizard}
          onClose={() => setShowCreateWizard(false)}
          onSuccess={handleCreateSuccess}
        /> */}
      </Box>
    );
  }

  // Multiple businesses - show selection
  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.default, 1)} 50%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        py: 4,
        px: 2,
      }}
    >
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ textAlign: 'center', mb: 6 }}>
          <Box sx={{ mb: 3 }}>
            <LetParleyLogo showName={true} showFullName={false} sx={{ justifyContent: 'center' }} />
          </Box>

          <Typography variant="h3" sx={{ fontWeight: 700, mb: 2 }}>
            Selecciona un Negocio
          </Typography>

          <Typography variant="h6" sx={{ color: theme.palette.text.secondary, mb: 4 }}>
            Elige el negocio que quieres gestionar
          </Typography>

          <Button
            variant="contained"
            disabled
            sx={{
              borderRadius: 2,
              textTransform: 'none',
              fontWeight: 600,
              px: 4,
              py: 1.5,
              background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
              '&:hover': {
                background: `linear-gradient(135deg, ${theme.palette.success.dark}, ${theme.palette.primary.dark})`,
                transform: 'translateY(-1px)',
                boxShadow: theme.shadows[4],
              },
            }}
            startIcon={<IconifyIcon icon="solar:add-circle-bold" />}
          >
            Agregar Nuevo Negocio (Deshabilitado)
          </Button>
        </Box>

        {/* Business Cards */}
        <Grid container spacing={3}>
          {businesses.map((business, index) => {
            const formattedBusiness = formatBusinessData(business);

            return (
              <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={business.business_id}>
                <Fade in={true} timeout={600 + index * 100}>
                  <Card
                    elevation={4}
                    sx={{
                      borderRadius: 3,
                      overflow: 'hidden',
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      background: alpha(theme.palette.background.paper, 0.95),
                      backdropFilter: 'blur(10px)',
                      transition: 'all 0.3s ease-in-out',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: theme.shadows[6],
                      },
                    }}
                  >
                    {/* Logo Section */}
                    <Box
                      sx={{
                        height: 160,
                        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.1)}, ${alpha(theme.palette.secondary.main, 0.1)})`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        p: 3,
                        position: 'relative',
                      }}
                    >
                      {business.logo ? (
                        <img
                          src={business.logo}
                          alt={`${business.name} logo`}
                          style={{
                            maxHeight: '100%',
                            maxWidth: '100%',
                            objectFit: 'contain',
                            borderRadius: 8,
                          }}
                        />
                      ) : (
                        <Box
                          sx={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            width: '100%',
                            height: '100%',
                            flexDirection: 'column',
                          }}
                        >
                          <IconifyIcon
                            icon="solar:buildings-2-outline"
                            sx={{
                              fontSize: 48,
                              color: alpha(theme.palette.text.disabled, 0.3),
                              mb: 1,
                            }}
                          />
                          <Typography variant="caption" color="text.disabled">
                            Sin logo
                          </Typography>
                        </Box>
                      )}

                      <Chip
                        label={formattedBusiness.isActive ? 'Activo' : 'Inactivo'}
                        size="small"
                        color={formattedBusiness.isActive ? 'success' : 'default'}
                        sx={{
                          position: 'absolute',
                          top: 16,
                          right: 16,
                          fontWeight: 600,
                        }}
                      />
                    </Box>

                    <CardContent
                      sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}
                    >
                      <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        {business.name}
                      </Typography>

                      <Box sx={{ flexGrow: 1, mb: 3 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                          <IconifyIcon
                            icon="solar:case-minimalistic-outline"
                            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {formattedBusiness.displayIndustry}
                          </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                          <IconifyIcon
                            icon="solar:calendar-outline"
                            sx={{ fontSize: 16, color: theme.palette.text.secondary }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Registrado: {formattedBusiness.formattedDate}
                          </Typography>
                        </Box>
                      </Box>

                      <Button
                        fullWidth
                        variant="contained"
                        onClick={() => handleSelectBusiness(business)}
                        sx={{
                          borderRadius: 2,
                          textTransform: 'none',
                          fontWeight: 600,
                          py: 1.5,
                          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                          '&:hover': {
                            background: `linear-gradient(135deg, ${theme.palette.primary.dark}, ${theme.palette.secondary.dark})`,
                            transform: 'translateY(-1px)',
                            boxShadow: theme.shadows[6],
                          },
                        }}
                        startIcon={<IconifyIcon icon="solar:login-3-outline" />}
                      >
                        Seleccionar Negocio
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            );
          })}
        </Grid>
      </Container>

      {/* Create Business Wizard - temporarily disabled */}
      {/* <CreateBusinessWizard
        open={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onSuccess={handleCreateSuccess}
      /> */}
    </Box>
  );
};

export default SelectBusinessPage;
