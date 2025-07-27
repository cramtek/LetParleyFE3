import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

// Types
export interface Client {
  client_profile_id: number;
  client_name: string;
  email?: string;
  phone_number?: string;
  birth_date?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  social_media_profiles?: string;
  profile_image_url?: string;
  client_status: 'Active' | 'Inactive';
  date_registered: string;
  last_updated: string;
  last_interaction?: string;
  business_id: number;
  tags?: string;
  tag_count?: number;
}

export interface ClientNote {
  note_id: number;
  note_title?: string;
  note_content: string;
  note_type?: 'General' | 'Call' | 'Meeting' | 'Email';
  priority?: 'Low' | 'Normal' | 'High';
  created_at: string;
  created_by?: string;
}

export interface Tag {
  tag_id: number;
  tag_name: string;
  tag_color?: string;
  usage_count?: number;
}

export interface ClientsResponse {
  clients: Client[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

export interface CreateClientRequest {
  client_name: string;
  email?: string;
  phone_number?: string;
  birth_date?: string;
  address?: string;
  city?: string;
  country?: string;
  postal_code?: string;
  social_media_profiles?: string;
  profile_image_url?: string;
  client_status?: 'Active' | 'Inactive';
}

export interface UpdateClientRequest extends Partial<CreateClientRequest> {}

export interface CreateNoteRequest {
  note_title?: string;
  note_content: string;
  note_type?: 'General' | 'Call' | 'Meeting' | 'Email';
  priority?: 'Low' | 'Normal' | 'High';
}

export interface CreateTagRequest {
  tag_name: string;
  tag_color?: string;
}

// Helper function for API requests
const apiRequest = async <T>(endpoint: string, method: string = 'GET', data?: any): Promise<T> => {
  const { sessionToken, selectedBusinessId, signOut } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  if (!selectedBusinessId) {
    throw new Error('No business selected');
  }

  // Fix URL construction to properly handle query parameters
  const baseUrl = `${API_BASE_URL}${endpoint}`;
  const url = new URL(baseUrl);
  url.searchParams.set('business_id', selectedBusinessId.toString());

  const options: RequestInit = {
    method,
    headers: {
      Authorization: `Bearer ${sessionToken}`,
      'Content-Type': 'application/json',
    },
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  try {
    const response = await fetch(url.toString(), options);

    if (response.status === 401) {
      signOut();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    // Handle no content responses
    if (response.status === 204) {
      return {} as T;
    }

    // Get response text first to handle non-JSON responses
    const responseText = await response.text();

    // Check if response is empty
    if (!responseText.trim()) {
      return {} as T;
    }

    // Try to parse as JSON, handle non-JSON responses gracefully
    try {
      return JSON.parse(responseText);
    } catch (parseError) {
      console.warn(`Non-JSON response received from ${endpoint}:`, responseText);

      // If the response is just "OK" or similar simple text, treat as success
      if (
        responseText.trim().toLowerCase() === 'ok' ||
        responseText.trim().toLowerCase() === 'success'
      ) {
        return {} as T;
      }

      // For other non-JSON responses, throw a more informative error
      throw new Error(
        `Server returned non-JSON response: "${responseText}". Expected JSON format.`,
      );
    }
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Client API functions
export const clientApi = {
  // Get all clients with optional filters
  getClients: async (params?: {
    search?: string;
    status?: 'Active' | 'Inactive';
    tags?: string;
    city?: string;
    country?: string;
    date_from?: string;
    date_to?: string;
    sort_by?: string;
    sort_order?: 'asc' | 'desc';
    page?: number;
    page_size?: number;
  }): Promise<ClientsResponse> => {
    let endpoint = '/lpmobile/clients';

    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });

      if (queryParams.toString()) {
        endpoint += `?${queryParams.toString()}`;
      }
    }

    return apiRequest<ClientsResponse>(endpoint);
  },

  // Get client by ID
  getClientById: async (clientId: number): Promise<Client> => {
    return apiRequest<Client>(`/lpmobile/clients/${clientId}`);
  },

  // Create new client
  createClient: async (
    clientData: CreateClientRequest,
  ): Promise<{ client_id: number; message: string }> => {
    return apiRequest<{ client_id: number; message: string }>(
      '/lpmobile/clients',
      'POST',
      clientData,
    );
  },

  // Update client
  updateClient: async (
    clientId: number,
    clientData: UpdateClientRequest,
  ): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/lpmobile/clients/${clientId}`, 'PUT', clientData);
  },

  // Get client notes
  getClientNotes: async (clientId: number): Promise<ClientNote[]> => {
    return apiRequest<ClientNote[]>(`/lpmobile/clients/${clientId}/notes`);
  },

  // Add note to client
  addClientNote: async (
    clientId: number,
    noteData: CreateNoteRequest,
  ): Promise<{ note_id: number; message: string }> => {
    return apiRequest<{ note_id: number; message: string }>(
      `/lpmobile/clients/${clientId}/notes`,
      'POST',
      noteData,
    );
  },

  // Get business tags
  getTags: async (): Promise<Tag[]> => {
    return apiRequest<Tag[]>('/lpmobile/tags');
  },

  // Assign tag to client
  assignTag: async (clientId: number, tagData: CreateTagRequest): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/lpmobile/clients/${clientId}/tags`, 'POST', tagData);
  },

  // Remove tag from client
  removeTag: async (clientId: number, tagId: number): Promise<{ message: string }> => {
    return apiRequest<{ message: string }>(`/lpmobile/clients/${clientId}/tags`, 'DELETE', {
      tag_id: tagId,
    });
  },
};

// Helper functions with null safety
export const parseClientTags = (tagsString?: string): string[] => {
  if (!tagsString) return [];
  return tagsString
    .split(',')
    .map((tag) => tag.trim())
    .filter((tag) => tag.length > 0);
};

export const parseSocialMediaProfiles = (profilesString?: string): Record<string, string> => {
  if (!profilesString) return {};
  try {
    return JSON.parse(profilesString);
  } catch {
    return {};
  }
};

export const formatSocialMediaProfiles = (profiles: Record<string, string>): string => {
  return JSON.stringify(profiles);
};

export const getClientDisplayName = (client: Client | null): string => {
  if (!client) return 'Cliente sin nombre';
  return client.client_name || 'Cliente sin nombre';
};

export const getClientContactInfo = (client: Client | null): string => {
  if (!client) return 'Sin información de contacto';

  const contacts = [];
  if (client.email) contacts.push(client.email);
  if (client.phone_number) contacts.push(client.phone_number);
  return contacts.join(' • ') || 'Sin información de contacto';
};

export const formatClientAddress = (client: Client | null): string => {
  if (!client) return 'Sin dirección registrada';

  const addressParts = [];
  if (client.address) addressParts.push(client.address);
  if (client.city) addressParts.push(client.city);
  if (client.country) addressParts.push(client.country);
  if (client.postal_code) addressParts.push(client.postal_code);
  return addressParts.join(', ') || 'Sin dirección registrada';
};
