import { API_URL } from './api';

/**
 * Check if a user has already accepted terms and privacy policy
 * @param email User email
 * @returns Promise resolving to {accepted: boolean}
 */
export const checkTermsAcceptance = async (email: string): Promise<{ accepted: boolean }> => {
  try {
    const response = await fetch(
      `${API_URL}/lpmobile/checkterms?email=${encodeURIComponent(email)}`,
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
 * @param email User email
 * @returns Promise resolving to {success: boolean, message: string}
 */
export const acceptTerms = async (
  email: string,
): Promise<{ success: boolean; message: string }> => {
  try {
    const response = await fetch(`${API_URL}/lpmobile/acceptterms`, {
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
      message: error instanceof Error ? error.message : 'Error al aceptar términos y políticas',
    };
  }
};
