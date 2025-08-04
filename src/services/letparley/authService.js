// LetParley Authentication Service - Adapted for Aurora
const API_BASE_URL = 'https://api3.letparley.com';

/**
 * Send verification code to email
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const sendVerificationCode = async (email) => {
  try {
    console.log('🌐 Making API call to send verification code:', {
      url: `${API_BASE_URL}/lpmobile/sendcode`,
      email,
    });

    const response = await fetch(`${API_BASE_URL}/lpmobile/sendcode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    console.log('📡 API Response received:', {
      status: response.status,
      statusText: response.statusText,
      ok: response.ok,
    });

    const data = await response.json();
    console.log('📊 API Response data:', data);

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Error al enviar el código de verificación');
    }

    return {
      success: true,
      message: 'Código enviado exitosamente',
    };
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw new Error(
      error.message || 'Error al enviar el código de verificación. Inténtalo de nuevo.',
    );
  }
};

/**
 * Verify the code and authenticate user
 * @param {string} email - User email
 * @param {string} code - Verification code
 * @returns {Promise<{success: boolean, session_token?: string, message: string, is_new_user: boolean, user_id?: string}>}
 */
export const verifyCode = async (email, code) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lpmobile/verifycode`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email,
        code,
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Error al verificar el código');
    }

    return data;
  } catch (error) {
    console.error('Error verifying code:', error);
    throw new Error(error.message || 'Error al verificar el código. Inténtalo de nuevo.');
  }
};

/**
 * Check if a user has already accepted terms and privacy policy
 * @param {string} email - User email
 * @returns {Promise<{accepted: boolean}>}
 */
export const checkTermsAcceptance = async (email) => {
  try {
    const response = await fetch(
      `${API_BASE_URL}/lpmobile/checkterms?email=${encodeURIComponent(email)}`,
      {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      },
    );

    if (!response.ok) {
      throw new Error(`Error checking terms acceptance: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error checking terms acceptance:', error);
    // If there's an error, assume terms haven't been accepted
    return { accepted: false };
  }
};

/**
 * Mark terms and privacy policy as accepted for a user
 * @param {string} email - User email
 * @returns {Promise<{success: boolean, message: string}>}
 */
export const acceptTerms = async (email) => {
  try {
    const response = await fetch(`${API_BASE_URL}/lpmobile/acceptterms`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `Error accepting terms: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error accepting terms:', error);
    return {
      success: false,
      message: error.message || 'Error al aceptar términos y políticas',
    };
  }
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate verification code format
 * @param {string} code - Code to validate
 * @returns {boolean}
 */
export const isValidCode = (code) => {
  return /^\d{4}$/.test(code);
};

/**
 * Format phone number for display (used in success messages)
 * @param {string} phone - Phone number
 * @returns {string}
 */
export const formatPhoneDisplay = (phone) => {
  if (!phone) return '';
  // Simple formatting for display
  return phone.replace(/(\d{2})(\d{2})(\d{3})(\d{2})(\d{2})/, '+$1 ** *** ***$4$5');
};

// Authentication state management helpers
export const AuthStorage = {
  // Session token
  setSessionToken: (token) => {
    if (token) {
      localStorage.setItem('session_token', token);
    } else {
      localStorage.removeItem('session_token');
    }
  },

  getSessionToken: () => {
    return localStorage.getItem('session_token');
  },

  // User email
  setUserEmail: (email) => {
    if (email) {
      localStorage.setItem('user_email', email);
    } else {
      localStorage.removeItem('user_email');
    }
  },

  getUserEmail: () => {
    return localStorage.getItem('user_email');
  },

  // Selected business ID - CRITICAL: use exact OLD project name
  setSelectedBusinessId: (id) => {
    if (id) {
      localStorage.setItem('selected_business_id', id);
    } else {
      localStorage.removeItem('selected_business_id');
    }
  },

  getSelectedBusinessId: () => {
    return localStorage.getItem('selected_business_id');
  },

  // Selected business name
  setSelectedBusinessName: (name) => {
    if (name) {
      localStorage.setItem('selected_business_name', name);
    } else {
      localStorage.removeItem('selected_business_name');
    }
  },

  getSelectedBusinessName: () => {
    return localStorage.getItem('selected_business_name');
  },

  // User ID
  setUserId: (id) => {
    if (id) {
      localStorage.setItem('user_id', id);
    } else {
      localStorage.removeItem('user_id');
    }
  },

  getUserId: () => {
    return localStorage.getItem('user_id');
  },

  // Is new user flag
  setIsNewUser: (isNew) => {
    localStorage.setItem('is_new_user', isNew.toString());
  },

  getIsNewUser: () => {
    return localStorage.getItem('is_new_user') === 'true';
  },

  // Clear all auth data
  clearAll: () => {
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('selected_business_id');
    localStorage.removeItem('selected_business_name');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_new_user');
  },

  // Load all auth data
  loadAll: () => {
    try {
      const token = localStorage.getItem('session_token');
      const email = localStorage.getItem('user_email');
      const businessId = localStorage.getItem('selected_business_id');
      const businessName = localStorage.getItem('selected_business_name');
      const userId = localStorage.getItem('user_id');
      const isNewUser = localStorage.getItem('is_new_user') === 'true';

      // Validate token exists and is not empty
      const isValidToken = token && token.trim().length > 0;

      return {
        sessionToken: isValidToken ? token : null,
        userEmail: email,
        selectedBusinessId: businessId,
        selectedBusinessName: businessName,
        userId: userId,
        isNewUser,
        isAuthenticated: !!isValidToken,
      };
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
      return {
        sessionToken: null,
        userEmail: null,
        selectedBusinessId: null,
        selectedBusinessName: null,
        userId: null,
        isNewUser: false,
        isAuthenticated: false,
      };
    }
  },
};
