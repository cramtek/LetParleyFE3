// LetParley Business Service - Adapted for Aurora
const API_BASE_URL = 'https://api3.letparley.com';

/**
 * Fetch all businesses for the authenticated user
 * @param {Object} authContext - Authentication context with sessionToken and signOut
 * @returns {Promise<Array>} Array of business objects
 */
export const fetchBusinesses = async (authContext) => {
  const { sessionToken, signOut } = authContext;

  if (!sessionToken) {
    throw new Error('No session token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lpmobile/businesses`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        throw new Error('Session expired. Please log in again.');
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();

    // Handle case where user has no businesses (empty array or invalid format)
    if (!data || !Array.isArray(data) || data.length === 0) {
      console.log('No businesses found for user');
      return [];
    }

    return data;
  } catch (error) {
    console.error('Error fetching businesses:', error);

    // Check if this is the "invalid response format" case (no businesses)
    if (error.message.includes('Invalid response format')) {
      return [];
    }

    throw error;
  }
};

/**
 * Create a new business
 * @param {Object} businessData - Business data to create
 * @param {Object} authContext - Authentication context
 * @returns {Promise<{success: boolean, businessId?: number, error?: string}>}
 */
export const createBusiness = async (businessData, authContext) => {
  const { sessionToken, signOut } = authContext;

  if (!sessionToken) {
    throw new Error('No session token found');
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lpmobile/business`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${sessionToken}`,
      },
      body: JSON.stringify(businessData),
    });

    const data = await response.json();

    if (!response.ok) {
      if (response.status === 401) {
        signOut();
        throw new Error('Session expired. Please log in again.');
      }

      // Handle specific business creation errors
      if (response.status === 409) {
        throw new Error(data.error || 'Ya existe un negocio con ese nombre o email');
      }

      if (response.status === 400) {
        throw new Error(data.error || 'Datos inválidos. Verifica los campos requeridos.');
      }

      throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
    }

    if (data.success && data.business_id) {
      return {
        success: true,
        businessId: data.business_id,
      };
    } else {
      throw new Error(data.message || 'Error creating business');
    }
  } catch (error) {
    console.error('Error creating business:', error);
    const errorMessage = error.message || 'Failed to create business';
    throw new Error(errorMessage);
  }
};

/**
 * Validate business data before creation
 * @param {Object} businessData - Business data to validate
 * @returns {Object} Validation result with isValid and errors
 */
export const validateBusinessData = (businessData) => {
  const errors = {};

  // Required fields
  if (!businessData.name || businessData.name.trim().length === 0) {
    errors.name = 'El nombre del negocio es requerido';
  }

  if (!businessData.email || businessData.email.trim().length === 0) {
    errors.email = 'El email es requerido';
  } else {
    // Email format validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(businessData.email)) {
      errors.email = 'El formato del email no es válido';
    }
  }

  // Optional field validations
  if (businessData.website && businessData.website.trim().length > 0) {
    const urlRegex = /^https?:\/\/.+/;
    if (!urlRegex.test(businessData.website)) {
      errors.website = 'El sitio web debe incluir http:// o https://';
    }
  }

  if (businessData.phone_number && businessData.phone_number.trim().length > 0) {
    const phoneRegex = /^[+]?[\d\s\-()]{7,}$/;
    if (!phoneRegex.test(businessData.phone_number)) {
      errors.phone_number = 'El formato del teléfono no es válido';
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Get default business data structure
 * @returns {Object} Default business data object
 */
export const getDefaultBusinessData = () => ({
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
  number_of_employees: null,
  date_established: '',
  description: '',
});

/**
 * Format business data for display
 * @param {Object} business - Business object
 * @returns {Object} Formatted business data
 */
export const formatBusinessData = (business) => ({
  ...business,
  formattedDate: business.date_registered
    ? new Date(business.date_registered).toLocaleDateString('es-ES')
    : 'No disponible',
  displayIndustry: business.industry || 'No especificada',
  hasLogo: !!(business.logo && business.logo.trim().length > 0),
  isActive: business.is_active !== false, // Default to true if not specified
});

/**
 * Business industry options
 */
export const BUSINESS_INDUSTRIES = [
  'Tecnología',
  'Retail/E-commerce',
  'Servicios Financieros',
  'Salud y Medicina',
  'Educación',
  'Restaurantes y Alimentación',
  'Inmobiliaria',
  'Construcción',
  'Turismo y Hospitalidad',
  'Transporte y Logística',
  'Manufactura',
  'Consultoría',
  'Marketing y Publicidad',
  'Belleza y Cuidado Personal',
  'Deportes y Fitness',
  'Entretenimiento',
  'Agricultura',
  'Energía',
  'Telecomunicaciones',
  'Otros',
];
