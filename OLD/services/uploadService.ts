import { useAuthStore } from '../store/authStore';
import { API_URL } from './api';

export interface UploadResponse {
  file_url: string;
}

export async function uploadImage(file: File): Promise<UploadResponse> {
  const { sessionToken } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch(`${API_URL}/lpmobile/files/upload`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${sessionToken}`,
    },
    body: formData,
  });

  if (!response.ok) {
    const text = await response.text();
    throw new Error(text || 'Error uploading image');
  }

  return response.json();
}
