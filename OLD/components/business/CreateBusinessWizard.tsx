import { useEffect, useRef, useState } from 'react';
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Calendar,
  Check,
  FileText,
  Globe,
  Mail,
  MapPin,
  Phone,
  Sparkles,
  Users,
  X,
} from 'lucide-react';
import { uploadImage } from '../../services/uploadService';
import { useBusinessStore } from '../../store/businessStore';

interface CreateBusinessWizardProps {
  onClose: () => void;
  onSuccess: (businessId: number) => void;
}

interface BusinessFormData {
  name: string;
  email: string;
  address: string;
  city: string;
  state: string;
  country: string;
  postal_code: string;
  phone_number: string;
  website: string;
  tax_id: string;
  logo: string;
  industry: string;
  number_of_employees: number | '';
  date_established: string;
  description: string;
}

const CreateBusinessWizard = ({ onClose, onSuccess }: CreateBusinessWizardProps) => {
  const { createBusiness, isCreating, createError, clearErrors } = useBusinessStore();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<BusinessFormData>({
    name: '',
    email: '',
    address: '',
    city: '',
    state: '',
    country: '',
    postal_code: '',
    phone_number: '',
    website: '',
    tax_id: '',
    logo: '',
    industry: '',
    number_of_employees: '',
    date_established: '',
    description: '',
  });

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [logoError, setLogoError] = useState('');
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    setLogoPreview(formData.logo);
  }, [formData.logo]);

  const totalSteps = 4;

  const industries = [
    'Tecnología',
    'Retail/Comercio',
    'Servicios Financieros',
    'Salud',
    'Educación',
    'Manufactura',
    'Inmobiliaria',
    'Turismo y Hospitalidad',
    'Alimentación y Bebidas',
    'Consultoría',
    'Marketing y Publicidad',
    'Transporte y Logística',
    'Construcción',
    'Entretenimiento',
    'Otro',
  ];

  const employeeRanges = [
    { value: 1, label: '1-10 empleados' },
    { value: 25, label: '11-50 empleados' },
    { value: 75, label: '51-100 empleados' },
    { value: 250, label: '101-500 empleados' },
    { value: 1000, label: '500+ empleados' },
  ];

  const updateFormData = (field: keyof BusinessFormData, value: string | number) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (createError) clearErrors();
  };

  const handleLogoFile = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      setLogoError('Formato de imagen no soportado');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setLogoError('El archivo debe pesar 5MB o menos');
      return;
    }

    setLogoError('');
    const localUrl = URL.createObjectURL(file);
    setLogoPreview(localUrl);

    try {
      const { file_url } = await uploadImage(file);
      updateFormData('logo', file_url);
    } catch (err) {
      console.error('Error uploading image', err);
      setLogoError('Error al subir la imagen');
    } finally {
      URL.revokeObjectURL(localUrl);
    }
  };

  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      void handleLogoFile(file);
      e.target.value = '';
    }
  };

  const onDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(true);
  };

  const onDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
  };

  const onDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      void handleLogoFile(file);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return formData.name.trim() !== '' && formData.email.trim() !== '';
      case 2:
        return true; // Optional fields
      case 3:
        return true; // Optional fields
      case 4:
        return true; // Optional fields
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (validateStep(currentStep) && currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    // Prepare data for submission
    const submitData = {
      name: formData.name.trim(),
      email: formData.email.trim(),
      ...(formData.address && { address: formData.address.trim() }),
      ...(formData.city && { city: formData.city.trim() }),
      ...(formData.state && { state: formData.state.trim() }),
      ...(formData.country && { country: formData.country.trim() }),
      ...(formData.postal_code && { postal_code: formData.postal_code.trim() }),
      ...(formData.phone_number && { phone_number: formData.phone_number.trim() }),
      ...(formData.website && { website: formData.website.trim() }),
      ...(formData.tax_id && { tax_id: formData.tax_id.trim() }),
      ...(formData.logo && { logo: formData.logo.trim() }),
      ...(formData.industry && { industry: formData.industry }),
      ...(formData.number_of_employees && {
        number_of_employees: Number(formData.number_of_employees),
      }),
      ...(formData.date_established && { date_established: formData.date_established }),
      ...(formData.description && { description: formData.description.trim() }),
    };

    const result = await createBusiness(submitData);

    if (result.success && result.businessId) {
      onSuccess(result.businessId);
    }
  };

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
        <div key={step} className="flex items-center">
          <div
            className={`
              w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium
              ${step <= currentStep ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
              ${step < currentStep ? 'bg-green-600' : ''}
            `}
          >
            {step < currentStep ? <Check className="h-5 w-5" /> : step}
          </div>
          {step < totalSteps && (
            <div
              className={`
                w-12 h-1 mx-2
                ${step < currentStep ? 'bg-green-600' : 'bg-gray-200'}
              `}
            />
          )}
        </div>
      ))}
    </div>
  );

  const renderStep1 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-blue-100 mb-4">
          <Building2 className="h-8 w-8 text-blue-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Información Básica</h3>
        <p className="text-gray-600">Comencemos con los datos esenciales de tu negocio</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre del Negocio *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => updateFormData('name', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Mi Empresa S.A."
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email del Negocio *
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Mail className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => updateFormData('email', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="contacto@miempresa.com"
              required
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
          <MapPin className="h-8 w-8 text-green-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Ubicación</h3>
        <p className="text-gray-600">¿Dónde se encuentra tu negocio?</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Dirección</label>
          <input
            type="text"
            value={formData.address}
            onChange={(e) => updateFormData('address', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Calle 123, Edificio ABC"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Ciudad</label>
            <input
              type="text"
              value={formData.city}
              onChange={(e) => updateFormData('city', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="San José"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Estado/Provincia</label>
            <input
              type="text"
              value={formData.state}
              onChange={(e) => updateFormData('state', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="San José"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">País</label>
            <input
              type="text"
              value={formData.country}
              onChange={(e) => updateFormData('country', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Costa Rica"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Código Postal</label>
            <input
              type="text"
              value={formData.postal_code}
              onChange={(e) => updateFormData('postal_code', e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="10101"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-purple-100 mb-4">
          <Phone className="h-8 w-8 text-purple-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Contacto y Web</h3>
        <p className="text-gray-600">Información de contacto y presencia online</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Teléfono</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Phone className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="tel"
              value={formData.phone_number}
              onChange={(e) => updateFormData('phone_number', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="+506 1234 5678"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Sitio Web</label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Globe className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="url"
              value={formData.website}
              onChange={(e) => updateFormData('website', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="https://miempresa.com"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">ID Fiscal/RUC</label>
          <input
            type="text"
            value={formData.tax_id}
            onChange={(e) => updateFormData('tax_id', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="3-101-123456"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Logo</label>
          <div
            className={`w-full p-4 border-2 border-dashed rounded-xl text-center cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'}`}
            onDragOver={onDragOver}
            onDragLeave={onDragLeave}
            onDrop={onDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            {logoPreview ? (
              <img
                src={logoPreview}
                alt="Logo preview"
                className="max-h-32 mx-auto object-contain"
              />
            ) : (
              <p className="text-sm text-gray-500">Arrastra tu logo o haz clic para seleccionar</p>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={onFileChange}
              className="hidden"
            />
          </div>
          {logoError && <p className="text-sm text-red-600 mt-2">{logoError}</p>}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-orange-100 mb-4">
          <Users className="h-8 w-8 text-orange-600" />
        </div>
        <h3 className="text-2xl font-bold text-gray-900 mb-2">Detalles del Negocio</h3>
        <p className="text-gray-600">Información adicional sobre tu empresa</p>
      </div>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Industria</label>
          <select
            value={formData.industry}
            onChange={(e) => updateFormData('industry', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona una industria</option>
            {industries.map((industry) => (
              <option key={industry} value={industry}>
                {industry}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Empleados
          </label>
          <select
            value={formData.number_of_employees}
            onChange={(e) => updateFormData('number_of_employees', e.target.value)}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecciona el tamaño</option>
            {employeeRanges.map((range) => (
              <option key={range.value} value={range.value}>
                {range.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Fecha de Establecimiento
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Calendar className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="date"
              value={formData.date_established}
              onChange={(e) => updateFormData('date_established', e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
          <div className="relative">
            <div className="absolute top-3 left-3 pointer-events-none">
              <FileText className="h-5 w-5 text-gray-400" />
            </div>
            <textarea
              value={formData.description}
              onChange={(e) => updateFormData('description', e.target.value)}
              rows={4}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Describe brevemente tu negocio..."
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="flex items-center justify-center h-10 w-10 rounded-full bg-blue-100">
              <Sparkles className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-900">Crear Nuevo Negocio</h2>
              <p className="text-sm text-gray-600">
                Paso {currentStep} de {totalSteps}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {renderStepIndicator()}

          {/* Error Message */}
          {createError && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <div className="ml-3">
                  <p className="text-sm text-red-700">{createError}</p>
                </div>
              </div>
            </div>
          )}

          {renderCurrentStep()}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-6 border-t border-gray-200 bg-gray-50 rounded-b-2xl">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className={`
              flex items-center px-4 py-2 rounded-xl font-medium transition-all duration-200
              ${
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-700 hover:bg-gray-200'
              }
            `}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </button>

          <div className="text-sm text-gray-500">
            {currentStep === 1 && '* Campos requeridos'}
            {currentStep > 1 && 'Todos los campos son opcionales'}
          </div>

          {currentStep < totalSteps ? (
            <button
              onClick={handleNext}
              disabled={!validateStep(currentStep)}
              className={`
                flex items-center px-6 py-2 rounded-xl font-medium transition-all duration-200
                ${
                  validateStep(currentStep)
                    ? 'bg-blue-600 text-white hover:bg-blue-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              Siguiente
              <ArrowRight className="h-4 w-4 ml-2" />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!validateStep(currentStep) || isCreating}
              className={`
                flex items-center px-6 py-2 rounded-xl font-medium transition-all duration-200
                ${
                  validateStep(currentStep) && !isCreating
                    ? 'bg-green-600 text-white hover:bg-green-700 transform hover:scale-105'
                    : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                }
              `}
            >
              {isCreating ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  Creando...
                </>
              ) : (
                <>
                  <Check className="h-4 w-4 mr-2" />
                  Crear Negocio
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default CreateBusinessWizard;
