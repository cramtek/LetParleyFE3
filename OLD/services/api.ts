import { useAuthStore } from '../store/authStore';

export const API_URL = 'https://api3.letparley.com';
export const WEBSOCKET_URL = 'wss://api3.letparley.com/ws/lpmobile';

interface ApiOptions {
  method?: string;
  body?: any;
  headers?: Record<string, string>;
}

/**
 * Base API client with authentication
 */
export async function apiClient<T>(endpoint: string, options: ApiOptions = {}): Promise<T> {
  const { sessionToken } = useAuthStore.getState();

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  if (sessionToken) {
    headers['Authorization'] = `Bearer ${sessionToken}`;
  }

  const config: RequestInit = {
    method: options.method || 'GET',
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, config);

    if (!response.ok) {
      // Handle different error status codes
      if (response.status === 401) {
        // Token expired or invalid
        useAuthStore.getState().signOut();
        throw new Error('Authentication required. Please log in again.');
      }

      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `API error: ${response.status}`);
    }

    // Handle no content responses
    if (response.status === 204) {
      return {} as T;
    }

    return await response.json();
  } catch (error) {
    console.error(`API request failed for ${endpoint}:`, error);
    throw error;
  }
}

/**
 * Auth-related API functions
 */
export const authApi = {
  requestVerificationCode: (email: string) => {
    return apiClient('/auth/request-code', {
      method: 'POST',
      body: { email },
    });
  },

  verifyCode: (email: string, code: string) => {
    return apiClient<{ token: string }>('/auth/verify-code', {
      method: 'POST',
      body: { email, code },
    });
  },
};

/**
 * Business-related API functions
 */
export const businessApi = {
  getBusinesses: () => {
    return apiClient<{ businesses: any[] }>('/business/list');
  },

  selectBusiness: (businessId: string) => {
    return apiClient('/business/select', {
      method: 'POST',
      body: { businessId },
    });
  },
};

/**
 * Conversation-related API functions
 */
export const conversationApi = {
  getConversations: () => {
    return apiClient<{ conversations: any[] }>('/conversations');
  },

  getConversationById: (conversationId: string) => {
    return apiClient<{ conversation: any }>(`/conversations/${conversationId}`);
  },

  sendMessage: (conversationId: string, message: string) => {
    return apiClient(`/conversations/${conversationId}/messages`, {
      method: 'POST',
      body: { message },
    });
  },
};
