import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

// Types for WhatsApp Integration
export interface WhatsAppIntegration {
  oaia_whatsapp_id: number;
  oai_assistant_id: number;
  business_id: number;
  meta_access_token: string;
  meta_phone_number_id: string;
  phone_number: string;
  name: string;
  date_registered: string;
  is_active: boolean;
  assistant_name?: string;
}

export interface CreateWhatsAppIntegrationRequest {
  oai_assistant_id: number;
  business_id: number;
  meta_access_token: string;
  meta_phone_number_id: string;
  phone_number: string;
  name: string;
}

export interface UpdateWhatsAppIntegrationRequest {
  oai_assistant_id?: number | null;
  meta_access_token?: string;
  meta_phone_number_id?: string;
  phone_number?: string;
  name?: string;
  is_active?: boolean;
}

// Types for Instagram Integration
export interface InstagramIntegration {
  tbl_oaia_instagram_account_id: number;
  oai_assistant_id: number | null;
  business_id: number;
  meta_access_token: string;
  instagram_account_id: string;
  name: string;
  date_registered: string;
  is_active: boolean;
  assistant_name?: string;
}

export interface CreateInstagramIntegrationRequest {
  oai_assistant_id: number | null;
  business_id: number;
  meta_access_token: string;
  instagram_account_id: string;
  name: string;
}

export interface UpdateInstagramIntegrationRequest {
  oai_assistant_id?: number | null;
  meta_access_token?: string;
  instagram_account_id?: string;
  name?: string;
  is_active?: boolean;
}

// Types for Widget Integration
export interface WidgetIntegration {
  oaia_widget_id: number;
  oai_assistant_id: number;
  business_id: number;
  widget_name: string;
  minimizable: boolean;
  desktop_minimized_type: string;
  mobile_minimized_type: string;
  top_radius: number;
  bottom_radius: number;
  box_size_width: number;
  box_size_height: number;
  minimized_width: number;
  minimized_height: number;
  desktop_screen_position: string;
  mobile_screen_position: string;
  attention_getter: boolean;
  attention_getter_image?: string;
  oaiaw_attention_getter_gallery_id?: number;
  header_color: string;
  agent_text_color: string;
  header_text_color: string;
  visitor_message_color: string;
  agent_message_color: string;
  visitor_text_color: string;
  logo_image_url?: string;
  welcome_message: string;
  powered_by_message: string;
  date_registered: string;
  is_active: boolean;
  assistant_name?: string;
  embed_code?: string;
}

export interface CreateWidgetIntegrationRequest {
  oai_assistant_id: number;
  business_id: number;
  widget_name: string;
  minimizable?: boolean;
  desktop_minimized_type?: string;
  mobile_minimized_type?: string;
  top_radius?: number;
  bottom_radius?: number;
  box_size_width?: number;
  box_size_height?: number;
  minimized_width?: number;
  minimized_height?: number;
  desktop_screen_position?: string;
  mobile_screen_position?: string;
  attention_getter?: boolean;
  attention_getter_image?: string;
  header_color?: string;
  agent_text_color?: string;
  header_text_color?: string;
  visitor_message_color?: string;
  agent_message_color?: string;
  visitor_text_color?: string;
  logo_image_url?: string;
  welcome_message?: string;
  powered_by_message?: string;
  is_active?: boolean;
}

export interface UpdateWidgetIntegrationRequest {
  oai_assistant_id?: number | null;
  widget_name?: string;
  minimizable?: boolean;
  desktop_minimized_type?: string;
  mobile_minimized_type?: string;
  top_radius?: number;
  bottom_radius?: number;
  box_size_width?: number;
  box_size_height?: number;
  minimized_width?: number;
  minimized_height?: number;
  desktop_screen_position?: string;
  mobile_screen_position?: string;
  attention_getter?: boolean;
  attention_getter_image?: string;
  header_color?: string;
  agent_text_color?: string;
  header_text_color?: string;
  visitor_message_color?: string;
  agent_message_color?: string;
  visitor_text_color?: string;
  logo_image_url?: string;
  welcome_message?: string;
  powered_by_message?: string;
  is_active?: boolean;
}

// Types for Store Integration
export type StoreProvider = 'Nidux' | 'Shopify' | 'WooCommerce';

export interface StoreIntegration {
  oaia_store_id: number;
  oai_assistant_id: number;
  business_id: number;
  store: StoreProvider;
  name: string;
  store_url: string;
  store_id?: string;
  base_url?: string;
  username?: string;
  password?: string;
  shop_name?: string;
  access_token?: string;
  consumer_key?: string;
  consumer_secret?: string;
  date_registered: string;
  is_active: boolean;
  assistant_name?: string;
}

export interface CreateStoreIntegrationRequest {
  oai_assistant_id: number;
  business_id: number;
  store: StoreProvider;
  name: string;
  store_url: string;
  store_id?: string;
  base_url?: string;
  username?: string;
  password?: string;
  shop_name?: string;
  access_token?: string;
  consumer_key?: string;
  consumer_secret?: string;
  is_active?: boolean;
}

export interface UpdateStoreIntegrationRequest {
  oai_assistant_id?: number | null;
  name?: string;
  store_url?: string;
  store_id?: string;
  base_url?: string;
  username?: string;
  password?: string;
  shop_name?: string;
  access_token?: string;
  consumer_key?: string;
  consumer_secret?: string;
  is_active?: boolean;
}

export interface AssignAssistantRequest {
  assistant_id: number;
}

// Helper function for API requests
const integrationRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
): Promise<T> => {
  const { sessionToken, selectedBusinessId, signOut } = useAuthStore.getState();

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
    console.error(`Integration API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Integration API functions
export const integrationApi = {
  // WhatsApp Integration
  getWhatsAppIntegrations: async (): Promise<{
    success: boolean;
    message: string;
    data: WhatsAppIntegration[];
  }> => {
    const { selectedBusinessId } = useAuthStore.getState();
    return integrationRequest<{ success: boolean; message: string; data: WhatsAppIntegration[] }>(
      `/lpmobile/integrations/whatsapp?business_id=${selectedBusinessId}`,
    );
  },

  createWhatsAppIntegration: async (
    data: CreateWhatsAppIntegrationRequest,
  ): Promise<{ success: boolean; message: string; data: WhatsAppIntegration }> => {
    return integrationRequest<{ success: boolean; message: string; data: WhatsAppIntegration }>(
      '/lpmobile/integrations/whatsapp',
      'POST',
      data,
    );
  },

  updateWhatsAppIntegration: async (
    id: number,
    data: UpdateWhatsAppIntegrationRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/whatsapp/${id}`,
      'PUT',
      data,
    );
  },

  deleteWhatsAppIntegration: async (id: number): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/whatsapp/${id}`,
      'DELETE',
    );
  },

  assignAssistantToWhatsApp: async (
    whatsappId: number,
    assistantId: number | null,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      '/lpmobile/integrations/whatsapp/assign-assistant',
      'POST',
      {
        whatsapp_id: whatsappId,
        assistant_id: assistantId,
      },
    );
  },

  // Instagram Integration
  getInstagramIntegrations: async (): Promise<{
    success: boolean;
    message: string;
    data: InstagramIntegration[];
  }> => {
    const { selectedBusinessId } = useAuthStore.getState();
    return integrationRequest<{ success: boolean; message: string; data: InstagramIntegration[] }>(
      `/lpmobile/integrations/instagram?business_id=${selectedBusinessId}`,
    );
  },

  createInstagramIntegration: async (
    data: CreateInstagramIntegrationRequest,
  ): Promise<{ success: boolean; message: string; data: InstagramIntegration }> => {
    return integrationRequest<{ success: boolean; message: string; data: InstagramIntegration }>(
      '/lpmobile/integrations/instagram',
      'POST',
      data,
    );
  },

  updateInstagramIntegration: async (
    id: number,
    data: UpdateInstagramIntegrationRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/instagram/${id}`,
      'PUT',
      data,
    );
  },

  deleteInstagramIntegration: async (
    id: number,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/instagram/${id}`,
      'DELETE',
    );
  },

  assignAssistantToInstagram: async (
    connectionId: number,
    assistantId: number | null,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      '/lpmobile/integrations/instagram/assign-assistant',
      'POST',
      {
        instagram_connection_id: connectionId,
        assistant_id: assistantId,
      },
    );
  },

  // Widget Integration
  getWidgetIntegrations: async (): Promise<{
    success: boolean;
    message: string;
    data: WidgetIntegration[];
  }> => {
    const { selectedBusinessId } = useAuthStore.getState();
    return integrationRequest<{ success: boolean; message: string; data: WidgetIntegration[] }>(
      `/lpmobile/integrations/widget?business_id=${selectedBusinessId}`,
    );
  },

  createWidgetIntegration: async (
    data: CreateWidgetIntegrationRequest,
  ): Promise<{ success: boolean; message: string; data: WidgetIntegration }> => {
    return integrationRequest<{ success: boolean; message: string; data: WidgetIntegration }>(
      '/lpmobile/integrations/widget',
      'POST',
      data,
    );
  },

  updateWidgetIntegration: async (
    id: number,
    data: UpdateWidgetIntegrationRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/widget/${id}`,
      'PUT',
      data,
    );
  },

  deleteWidgetIntegration: async (id: number): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/widget/${id}`,
      'DELETE',
    );
  },

  assignAssistantToWidget: async (
    widgetId: number,
    assistantId: number | null,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      '/lpmobile/integrations/widget/assign-assistant',
      'POST',
      {
        widget_id: widgetId,
        assistant_id: assistantId,
      },
    );
  },

  // Store Integration
  getStoreIntegrations: async (
    provider?: StoreProvider,
  ): Promise<{ success: boolean; message: string; data: StoreIntegration[] }> => {
    const { selectedBusinessId } = useAuthStore.getState();
    let endpoint = `/lpmobile/integrations/stores?business_id=${selectedBusinessId}`;

    if (provider) {
      endpoint += `&store=${provider}`;
    }

    return integrationRequest<{ success: boolean; message: string; data: StoreIntegration[] }>(
      endpoint,
    );
  },

  createStoreIntegration: async (
    data: CreateStoreIntegrationRequest,
  ): Promise<{ success: boolean; message: string; data: StoreIntegration }> => {
    return integrationRequest<{ success: boolean; message: string; data: StoreIntegration }>(
      '/lpmobile/integrations/stores',
      'POST',
      data,
    );
  },

  updateStoreIntegration: async (
    id: number,
    data: UpdateStoreIntegrationRequest,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/stores/${id}`,
      'PUT',
      data,
    );
  },

  deleteStoreIntegration: async (id: number): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      `/lpmobile/integrations/stores/${id}`,
      'DELETE',
    );
  },

  assignAssistantToStore: async (
    storeId: number,
    assistantId: number | null,
  ): Promise<{ success: boolean; message: string }> => {
    return integrationRequest<{ success: boolean; message: string }>(
      '/lpmobile/integrations/stores/assign-assistant',
      'POST',
      {
        store_id: storeId,
        assistant_id: assistantId,
      },
    );
  },
};

// Utility functions
export const getIntegrationStatusColor = (isActive: boolean): string => {
  return isActive
    ? 'bg-green-100 text-green-800 border-green-200'
    : 'bg-gray-100 text-gray-800 border-gray-200';
};

export const getIntegrationStatusText = (isActive: boolean): string => {
  return isActive ? 'Activo' : 'Inactivo';
};

export const getStoreProviderColor = (provider: StoreProvider): string => {
  switch (provider) {
    case 'Nidux':
      return 'bg-blue-100 text-blue-800 border-blue-200';
    case 'Shopify':
      return 'bg-green-100 text-green-800 border-green-200';
    case 'WooCommerce':
      return 'bg-purple-100 text-purple-800 border-purple-200';
    default:
      return 'bg-gray-100 text-gray-800 border-gray-200';
  }
};

export const getRequiredFieldsForStoreProvider = (provider: StoreProvider): string[] => {
  const commonFields = ['name', 'store_url'];

  switch (provider) {
    case 'Nidux':
      return [...commonFields, 'username', 'password'];
    case 'Shopify':
      return [...commonFields, 'access_token'];
    case 'WooCommerce':
      return [...commonFields, 'consumer_key', 'consumer_secret'];
    default:
      return commonFields;
  }
};

export const getFieldsForStoreProvider = (provider: StoreProvider): string[] => {
  const commonFields = ['name', 'store_url', 'oai_assistant_id'];

  switch (provider) {
    case 'Nidux':
      return [...commonFields, 'store_id', 'base_url', 'username', 'password'];
    case 'Shopify':
      return [...commonFields, 'shop_name', 'access_token'];
    case 'WooCommerce':
      return [...commonFields, 'consumer_key', 'consumer_secret'];
    default:
      return commonFields;
  }
};

export const getWidgetPositionOptions = () => {
  return [
    { value: 'bottom-right', label: 'Abajo Derecha' },
    { value: 'bottom-left', label: 'Abajo Izquierda' },
    { value: 'bottom-center', label: 'Abajo Centro' },
    { value: 'top-right', label: 'Arriba Derecha' },
    { value: 'top-left', label: 'Arriba Izquierda' },
    { value: 'top-center', label: 'Arriba Centro' },
  ];
};

export const getWidgetMinimizedTypeOptions = () => {
  return [
    { value: 'icon', label: 'Icono' },
    { value: 'tab', label: 'Pestaña' },
    { value: 'bubble', label: 'Burbuja' },
  ];
};
