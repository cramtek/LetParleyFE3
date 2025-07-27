import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

export interface UploadImageResponse {
  success: boolean;
  message?: string;
  message?: string;
  file_url?: string;
}

export const uploadImage = async (file: File): Promise<UploadImageResponse> => {
  const { sessionToken, selectedBusinessId, signOut } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  const formData = new FormData();
  formData.append('file', file);
  if (selectedBusinessId) {
    formData.append('business_id', selectedBusinessId.toString());
  }

  try {
    const response = await fetch(`${API_BASE_URL}/lpmobile/files/upload-image`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionToken}`,
      },
      body: formData,
    });

    if (response.status === 401) {
      // First get the response as text to handle non-JSON responses
      const responseText = await response.text();

      // Check if it's a simple success message
      if (responseText === 'OK' || responseText === 'success') {
        return {
          success: true,
          message: 'Image uploaded successfully',
        };
      }

      // Try to parse as JSON
      try {
        return JSON.parse(responseText);
      } catch (parseError) {
        // If JSON parsing fails, treat as error
        throw new Error(`Invalid response format: ${responseText}`);
      }
      throw new Error('Session expired. Please log in again.');
    }

    // First get the response as text to handle non-JSON responses
    const responseText = await response.text();

    // Check if it's a simple success message
    if (responseText === 'OK' || responseText === 'success') {
      return {
        success: true,
        message: 'Image uploaded successfully',
      };
    }

    // Try to parse as JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (parseError) {
      // If JSON parsing fails, treat as error
      throw new Error(`Invalid response format: ${responseText}`);
    }

    if (!response.ok || !data.success) {
      throw new Error(data.message || 'Failed to upload image');
    }

    return data;
  } catch (error) {
    console.error('Image upload failed:', error);
    throw error;
  }
};
