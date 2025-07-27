import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

// Types for assistant control
export interface AssistantStatus {
  oai_assistant_id: number;
  assistant_id: string;
  business_id: number;
  is_active: boolean;
  is_responding: boolean;
  total_threads: number;
  active_responding_threads: number;
  status: {
    can_respond: boolean;
    reason: string;
  };
}

export interface ConversationStatus {
  thread_id: string;
  contact_id: string;
  contact_type: string;
  assistant_id: string;
  message_count: number;
  thread_status: {
    is_active: boolean;
    is_responding: boolean;
  };
  assistant_status: {
    is_active: boolean;
    is_responding: boolean;
  };
  overall_status: {
    can_respond: boolean;
    reason: string;
  };
}

export interface ToggleResponse {
  success: boolean;
  message: string;
  new_status: boolean;
}

// Types for Make Assistants
export interface MakeAssistant {
  oai_assistant_id: number;
  openai_id: string;
  name: string;
  ai_avatar_id: number;
  business_id: number;
  is_active: boolean;
  is_responding: boolean;
}

export interface AssistantTraining {
  training_id: number;
  oai_assistant_id: number;
  training_content: string;
  title: string;
  description: string;
  language: string;
  date_created: string;
  date_modified: string;
  created_by: string;
  is_active: boolean;
}

export interface AssistantDetail {
  assistant: MakeAssistant;
  training: AssistantTraining | null;
}

export interface CreateAssistantRequest {
  name: string;
  business_id: number;
  ai_avatar_id?: number;
  training_content: string;
  title?: string;
  description?: string;
  language?: string;
  created_by?: string;
}

export interface UpdateAssistantRequest {
  name: string;
  ai_avatar_id?: number;
  training_content: string;
  title?: string;
  description?: string;
  language?: string;
  created_by?: string;
}

// Helper function for API requests
const assistantRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
): Promise<T> => {
  const { sessionToken, signOut } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

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
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);

    if (response.status === 401) {
      signOut();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Assistant API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Assistant API functions
export const assistantApi = {
  // Toggle assistant on/off (legacy endpoint for OpenAI assistants)
  toggleAssistant: async (assistantId: string, isResponding: boolean): Promise<ToggleResponse> => {
    return assistantRequest<ToggleResponse>(`/lpmobile/assistant/${assistantId}/toggle`, 'PUT', {
      is_responding: isResponding,
    });
  },

  // Toggle Make assistant on/off (new endpoint using oai_assistant_id)
  toggleMakeAssistant: async (
    oaiAssistantId: number,
    isResponding: boolean,
  ): Promise<ToggleResponse> => {
    return assistantRequest<ToggleResponse>(
      `/lpmobile/assistant/id/${oaiAssistantId}/toggle`,
      'PUT',
      {
        is_responding: isResponding,
      },
    );
  },

  // Get assistant status (legacy endpoint for OpenAI assistants)
  getAssistantStatus: async (
    assistantId: string,
  ): Promise<{ success: boolean; data: AssistantStatus }> => {
    return assistantRequest<{ success: boolean; data: AssistantStatus }>(
      `/lpmobile/assistant/${assistantId}/status`,
    );
  },

  // Get Make assistant status (new endpoint using oai_assistant_id)
  getMakeAssistantStatus: async (
    oaiAssistantId: number,
  ): Promise<{ success: boolean; data: AssistantStatus }> => {
    return assistantRequest<{ success: boolean; data: AssistantStatus }>(
      `/lpmobile/assistant/id/${oaiAssistantId}/status`,
    );
  },

  // Toggle conversation on/off
  toggleConversation: async (threadId: string, isResponding: boolean): Promise<ToggleResponse> => {
    return assistantRequest<ToggleResponse>(`/lpmobile/conversation/${threadId}/toggle`, 'PUT', {
      is_responding: isResponding,
    });
  },

  // Get conversation status
  getConversationStatus: async (
    threadId: string,
  ): Promise<{ success: boolean; data: ConversationStatus }> => {
    return assistantRequest<{ success: boolean; data: ConversationStatus }>(
      `/lpmobile/conversation/${threadId}/status`,
    );
  },

  // Make Assistants API

  // Create a new Make Assistant
  createMakeAssistant: async (data: CreateAssistantRequest): Promise<MakeAssistant> => {
    return assistantRequest<MakeAssistant>('/lpmobile/make/assistants', 'POST', data);
  },

  // List all Make Assistants for a business
  listMakeAssistants: async (businessId: string): Promise<MakeAssistant[]> => {
    return assistantRequest<MakeAssistant[]>(
      `/lpmobile/make/assistants/list?business_id=${businessId}`,
    );
  },

  // Get detailed information about a Make Assistant
  getMakeAssistantDetail: async (assistantId: number): Promise<AssistantDetail> => {
    return assistantRequest<AssistantDetail>(`/lpmobile/make/assistants/${assistantId}/detail`);
  },

  // Update a Make Assistant
  updateMakeAssistant: async (
    assistantId: number,
    data: UpdateAssistantRequest,
  ): Promise<{ message: string }> => {
    return assistantRequest<{ message: string }>(
      `/lpmobile/make/assistants/${assistantId}`,
      'PUT',
      data,
    );
  },

  // Delete a Make Assistant
  deleteMakeAssistant: async (assistantId: number): Promise<{ message: string }> => {
    return assistantRequest<{ message: string }>(
      `/lpmobile/make/assistants/${assistantId}`,
      'DELETE',
    );
  },
};

// Utility functions
export const getStatusColor = (reason: string): string => {
  switch (reason) {
    case 'Ready to Respond':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'Assistant Turned Off':
    case 'Thread Turned Off':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'Assistant Deleted':
    case 'Thread Deleted':
    case 'Thread Not Found':
      return 'text-red-600 bg-red-50 border-red-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getStatusIcon = (reason: string): string => {
  switch (reason) {
    case 'Ready to Respond':
      return '✅';
    case 'Assistant Turned Off':
    case 'Thread Turned Off':
      return '🔕';
    case 'Assistant Deleted':
    case 'Thread Deleted':
    case 'Thread Not Found':
      return '❌';
    default:
      return '❓';
  }
};

export const getStatusMessage = (reason: string): string => {
  switch (reason) {
    case 'Ready to Respond':
      return 'Asistente activado y respondiendo automáticamente';
    case 'Assistant Turned Off':
      return 'Asistente desactivado - Requiere atención humana';
    case 'Thread Turned Off':
      return 'Conversación Manual - Requiere atención humana';
    case 'Assistant Deleted':
      return 'Asistente eliminado';
    case 'Thread Deleted':
      return 'Conversación eliminada';
    case 'Thread Not Found':
      return 'Conversación no encontrada';
    default:
      return 'Estado desconocido';
  }
};

// Avatar options for assistants
export const ASSISTANT_AVATARS = [
  {
    id: 1,
    name: 'Avatar Profesional',
    imageUrl: 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png',
  },
  {
    id: 2,
    name: 'Avatar Amigable',
    imageUrl: 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png',
  },
  {
    id: 3,
    name: 'Avatar Tecnológico',
    imageUrl: 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png',
  },
  {
    id: 4,
    name: 'Avatar Corporativo',
    imageUrl: 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png',
  },
  {
    id: 5,
    name: 'Avatar Femenino',
    imageUrl: 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png',
  },
  {
    id: 6,
    name: 'Avatar Masculino',
    imageUrl: 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png',
  },
];

// Language options
export const LANGUAGE_OPTIONS = [
  { value: 'es', label: 'Español' },
  { value: 'en', label: 'Inglés' },
  { value: 'pt', label: 'Portugués' },
  { value: 'fr', label: 'Francés' },
];

// Get avatar by ID
export const getAvatarById = (id: number): { id: number; name: string; imageUrl: string } => {
  return ASSISTANT_AVATARS.find((avatar) => avatar.id === id) || ASSISTANT_AVATARS[0];
};

// Get language label
export const getLanguageLabel = (code: string): string => {
  return LANGUAGE_OPTIONS.find((lang) => lang.value === code)?.label || 'Español';
};

// Helper function to determine if assistant is advanced (has OpenAI ID)
export const isAdvancedAssistant = (assistant: MakeAssistant): boolean => {
  return Boolean(assistant.openai_id && assistant.openai_id.trim() !== '');
};
