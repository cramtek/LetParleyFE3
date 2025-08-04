import { useState } from 'react';
import {
  Box,
  Button,
  Card,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogTitle,
  Fade,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
  alpha,
} from '@mui/material';
import Grid from '@mui/material/Grid';
import { useTheme } from '@mui/material/styles';
import { useLetParleyAuth } from '../../../providers/LetParleyAuthProvider';
import {
  BUSINESS_INDUSTRIES,
  createBusiness,
  getDefaultBusinessData,
  validateBusinessData,
} from '../../../services/letparley/businessService';
import IconifyIcon from '../../base/IconifyIcon';

// Static constants - never change
const WIZARD_STEPS = [
  {
    label: 'Información Básica',
    icon: 'solar:buildings-2-bold',
    description: 'Nombre y email del negocio',
  },
  { label: 'Ubicación', icon: 'solar:map-point-bold', description: 'Dirección y contacto' },
  {
    label: 'Detalles',
    icon: 'solar:users-group-two-rounded-bold',
    description: 'Industria y descripción',
  },
  { label: 'Logo', icon: 'solar:gallery-bold', description: 'Imagen corporativa' },
];

const EMPLOYEE_RANGES = [
  { value: 1, label: '1-10 empleados' },
  { value: 25, label: '11-50 empleados' },
  { value: 75, label: '51-100 empleados' },
  { value: 250, label: '101-500 empleados' },
  { value: 1000, label: '500+ empleados' },
];

const CreateBusinessWizard = ({ open, onClose, onSuccess }) => {
  const theme = useTheme();
  const { authContext } = useLetParleyAuth();

  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState(() => getDefaultBusinessData());
  const [errors, setErrors] = useState({});
  const [isCreating, setIsCreating] = useState(false);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoError, setLogoError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  // Simple form update function
  const updateField = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: '' }));
    }
  };

  // Simple validation function
  const validateStep = () => {
    const validation = validateBusinessData(formData);
    setErrors(validation.errors);

    if (currentStep === 0) {
      return (
        formData.name.trim() &&
        formData.email.trim() &&
        !validation.errors.name &&
        !validation.errors.email
      );
    }
    return true;
  };

  // Navigation functions
  const goNext = () => {
    if (validateStep() && currentStep < WIZARD_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goPrevious = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  // Close handler
  const closeWizard = () => {
    setCurrentStep(0);
    setFormData(getDefaultBusinessData());
    setErrors({});
    setLogoPreview('');
    setLogoError('');
    setIsCreating(false);
    onClose();
  };

  // Logo handling
  const handleLogoFile = async (file) => {
    if (!file.type.startsWith('image/')) {
      setLogoError('Solo se permiten archivos de imagen');
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setLogoError('El archivo debe pesar 5MB o menos');
      return;
    }
    setLogoError('');
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);
    updateField('logo', localUrl);
  };

  // Submit handler
  const submitForm = async () => {
    if (!validateStep()) return;

    setIsCreating(true);
    try {
      const submitData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== '' && value !== null),
      );

      console.log('🚀 Submitting business data:', submitData);
      const result = await createBusiness(submitData, authContext);

      if (result.success && result.businessId) {
        onSuccess(result.businessId);
        closeWizard();
      }
    } catch (error) {
      console.error('❌ Error creating business:', error);
      setErrors({ submit: error.message });
    } finally {
      setIsCreating(false);
    }
  };

  // Step renderers
  const renderStep0 = () => (
    <Box sx={{ space: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: theme.shadows[4],
          }}
        >
          <IconifyIcon icon="solar:buildings-2-bold" sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Información Básica
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Comencemos con los datos esenciales de tu negocio
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Nombre del Negocio"
            placeholder="Mi Empresa S.A."
            value={formData.name}
            onChange={(e) => updateField('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:buildings-outline" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Email del Negocio"
            type="email"
            placeholder="contacto@miempresa.com"
            value={formData.email}
            onChange={(e) => updateField('email', e.target.value)}
            error={!!errors.email}
            helperText={errors.email}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:letter-outline" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep1 = () => (
    <Box sx={{ space: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.info.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: theme.shadows[4],
          }}
        >
          <IconifyIcon icon="solar:map-point-bold" sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Ubicación
        </Typography>
        <Typography variant="body1" color="text.secondary">
          ¿Dónde se encuentra tu negocio? (Opcional)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Dirección"
            placeholder="Calle 123, Edificio ABC"
            value={formData.address}
            onChange={(e) => updateField('address', e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:home-outline" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Ciudad"
            placeholder="San José"
            value={formData.city}
            onChange={(e) => updateField('city', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="País"
            placeholder="Costa Rica"
            value={formData.country}
            onChange={(e) => updateField('country', e.target.value)}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Teléfono"
            placeholder="+506 1234 5678"
            value={formData.phone_number}
            onChange={(e) => updateField('phone_number', e.target.value)}
            error={!!errors.phone_number}
            helperText={errors.phone_number}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:phone-outline" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6 }}>
          <TextField
            fullWidth
            label="Sitio Web"
            placeholder="https://miempresa.com"
            value={formData.website}
            onChange={(e) => updateField('website', e.target.value)}
            error={!!errors.website}
            helperText={errors.website}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <IconifyIcon icon="solar:global-outline" />
                </InputAdornment>
              ),
            }}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep2 = () => (
    <Box sx={{ space: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.error.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: theme.shadows[4],
          }}
        >
          <IconifyIcon
            icon="solar:users-group-two-rounded-bold"
            sx={{ fontSize: 40, color: 'white' }}
          />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Detalles del Negocio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Información adicional sobre tu empresa (Opcional)
        </Typography>
      </Box>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Industria</InputLabel>
            <Select
              value={formData.industry}
              label="Industria"
              onChange={(e) => updateField('industry', e.target.value)}
            >
              {BUSINESS_INDUSTRIES.map((industry) => (
                <MenuItem key={industry} value={industry}>
                  {industry}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <FormControl fullWidth>
            <InputLabel>Número de Empleados</InputLabel>
            <Select
              value={formData.number_of_employees || ''}
              label="Número de Empleados"
              onChange={(e) => updateField('number_of_employees', e.target.value)}
            >
              {EMPLOYEE_RANGES.map((range) => (
                <MenuItem key={range.value} value={range.value}>
                  {range.label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            label="Descripción"
            placeholder="Describe brevemente tu negocio..."
            multiline
            rows={4}
            value={formData.description}
            onChange={(e) => updateField('description', e.target.value)}
          />
        </Grid>
      </Grid>
    </Box>
  );

  const renderStep3 = () => (
    <Box sx={{ space: 3 }}>
      <Box sx={{ textAlign: 'center', mb: 4 }}>
        <Box
          sx={{
            width: 80,
            height: 80,
            borderRadius: 3,
            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.primary.main})`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            mx: 'auto',
            mb: 3,
            boxShadow: theme.shadows[4],
          }}
        >
          <IconifyIcon icon="solar:gallery-bold" sx={{ fontSize: 40, color: 'white' }} />
        </Box>
        <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
          Logo del Negocio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Agrega tu logo corporativo (Opcional)
        </Typography>
      </Box>

      <Card
        sx={{
          border: `2px dashed ${dragOver ? theme.palette.primary.main : theme.palette.divider}`,
          backgroundColor: dragOver ? alpha(theme.palette.primary.main, 0.04) : 'transparent',
          transition: 'all 0.3s ease',
          cursor: 'pointer',
          p: 3,
          textAlign: 'center',
          minHeight: 200,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setDragOver(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleLogoFile(file);
        }}
        onClick={() => document.getElementById('logo-input')?.click()}
      >
        {logoPreview ? (
          <Box>
            <img
              src={logoPreview}
              alt="Logo preview"
              style={{
                maxHeight: 120,
                maxWidth: '100%',
                objectFit: 'contain',
                borderRadius: 8,
              }}
            />
            <Button
              size="small"
              onClick={(e) => {
                e.stopPropagation();
                setLogoPreview('');
                updateField('logo', '');
              }}
              sx={{ mt: 2 }}
            >
              Remover Logo
            </Button>
          </Box>
        ) : (
          <Box>
            <IconifyIcon
              icon="solar:gallery-add-bold"
              sx={{ fontSize: 48, color: theme.palette.text.disabled, mb: 2 }}
            />
            <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
              Arrastra tu logo aquí
            </Typography>
            <Typography variant="body2" color="text.disabled">
              o haz clic para seleccionar un archivo
            </Typography>
          </Box>
        )}

        <input
          id="logo-input"
          type="file"
          accept="image/*"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleLogoFile(file);
            e.target.value = '';
          }}
          style={{ display: 'none' }}
        />
      </Card>

      {logoError && (
        <FormHelperText error sx={{ mt: 1 }}>
          {logoError}
        </FormHelperText>
      )}
    </Box>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderStep0();
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      default:
        return renderStep0();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={closeWizard}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          background: alpha(theme.palette.background.paper, 0.95),
          backdropFilter: 'blur(10px)',
        },
      }}
    >
      <DialogTitle sx={{ pb: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: 2,
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <IconifyIcon icon="solar:add-circle-bold" sx={{ fontSize: 24, color: 'white' }} />
            </Box>
            <Box>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Crear Nuevo Negocio
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Paso {currentStep + 1} de {WIZARD_STEPS.length}: {WIZARD_STEPS[currentStep].label}
              </Typography>
            </Box>
          </Box>

          <IconButton onClick={closeWizard} size="small">
            <IconifyIcon icon="solar:close-circle-outline" />
          </IconButton>
        </Box>
      </DialogTitle>

      <DialogContent sx={{ px: 3, pb: 3 }}>
        {/* Step Indicator */}
        <Stepper activeStep={currentStep} alternativeLabel sx={{ mb: 4 }}>
          {WIZARD_STEPS.map((step) => (
            <Step key={step.label}>
              <StepLabel
                StepIconComponent={({ active, completed }) => (
                  <Box
                    sx={{
                      width: 40,
                      height: 40,
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background:
                        completed || active
                          ? `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`
                          : theme.palette.grey[300],
                      color: completed || active ? 'white' : theme.palette.grey[600],
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {completed ? (
                      <IconifyIcon icon="solar:check-circle-bold" sx={{ fontSize: 20 }} />
                    ) : (
                      <IconifyIcon icon={step.icon} sx={{ fontSize: 20 }} />
                    )}
                  </Box>
                )}
              >
                <Typography variant="caption" sx={{ mt: 1, display: 'block' }}>
                  {step.label}
                </Typography>
              </StepLabel>
            </Step>
          ))}
        </Stepper>

        {/* Error Message */}
        {errors.submit && (
          <Box sx={{ mb: 3 }}>
            <Typography color="error" variant="body2">
              {errors.submit}
            </Typography>
          </Box>
        )}

        {/* Step Content */}
        <Fade in key={currentStep}>
          <Box>{renderCurrentStep()}</Box>
        </Fade>

        {/* Navigation Buttons */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            mt: 4,
            pt: 3,
            borderTop: `1px solid ${theme.palette.divider}`,
          }}
        >
          <Button
            onClick={goPrevious}
            disabled={currentStep === 0}
            startIcon={<IconifyIcon icon="solar:arrow-left-outline" />}
          >
            Anterior
          </Button>

          <Typography variant="caption" color="text.secondary" sx={{ alignSelf: 'center' }}>
            {currentStep === 0 ? '* Campos requeridos' : 'Todos los campos son opcionales'}
          </Typography>

          {currentStep < WIZARD_STEPS.length - 1 ? (
            <Button
              variant="contained"
              onClick={goNext}
              disabled={!validateStep()}
              endIcon={<IconifyIcon icon="solar:arrow-right-outline" />}
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              }}
            >
              Siguiente
            </Button>
          ) : (
            <Button
              variant="contained"
              onClick={submitForm}
              disabled={!validateStep() || isCreating}
              endIcon={
                isCreating ? (
                  <CircularProgress size={16} color="inherit" />
                ) : (
                  <IconifyIcon icon="solar:check-circle-bold" />
                )
              }
              sx={{
                background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.primary.main})`,
              }}
            >
              {isCreating ? 'Creando...' : 'Crear Negocio'}
            </Button>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
};

export default CreateBusinessWizard;
