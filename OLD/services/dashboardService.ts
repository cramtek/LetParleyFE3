import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

// Types for dashboard data
export interface BasicDashboardData {
  business_id: number;
  conversations_today: number;
  conversations_this_week: number;
  total_conversations: number;
  client_messages: number;
  business_messages: number;
  avg_response_time_seconds: number;
  whatsapp_channels: number;
  widget_channels: number;
  instagram_channels: number;
  active_clients: number;
}

export interface MessageTrendData {
  business_id: number;
  date: string;
  total_messages: number;
  client_messages: number;
  business_messages: number;
}

export interface ConversationTrendData {
  business_id: number;
  date: string;
  total_conversations: number;
}

export interface ChannelStats {
  business_id: number;
  contact_type: string;
  total_conversations: number;
  conversations_today: number;
  conversations_this_week: number;
  total_messages: number;
}

export interface TopConversation {
  business_id: number;
  thread_id: string;
  contact_id: string;
  contact_type: string;
  message_count: number;
  last_message_date: string;
  conversation_days: number;
}

export interface DashboardMetrics {
  active_conversations: number;
  avg_messages_per_conversation: number;
  response_rate_percent: number;
  conversation_growth_percent: number;
  generated_at: string;
}

export interface DashboardSummary {
  basic_data: BasicDashboardData;
  messages_7_days: MessageTrendData[];
  channel_stats: ChannelStats[];
  top_conversations: TopConversation[];
  generated_at: string;
}

// Helper function for API requests
const dashboardRequest = async <T>(endpoint: string): Promise<T> => {
  const { sessionToken, selectedBusinessId, signOut } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  if (!selectedBusinessId) {
    throw new Error('No business selected');
  }

  const url = `${API_BASE_URL}/lpmobile/dashboard/${endpoint}?business_id=${selectedBusinessId}`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (response.status === 401) {
      signOut();
      throw new Error('Session expired. Please log in again.');
    }

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`API error: ${response.status} - ${errorText}`);
    }

    const data = await response.json();

    if (!data.success) {
      throw new Error(data.message || 'API request failed');
    }

    return data.data;
  } catch (error) {
    console.error(`Dashboard API request failed for ${endpoint}:`, error);
    throw error;
  }
};

// Dashboard API functions
export const dashboardApi = {
  // Get basic dashboard data
  getBasicData: (): Promise<BasicDashboardData> => {
    return dashboardRequest<BasicDashboardData>('basic');
  },

  // Get message trends for last 7 days
  getMessageTrends: (): Promise<MessageTrendData[]> => {
    return dashboardRequest<MessageTrendData[]>('messages/7d');
  },

  // Get conversation trends for last 30 days
  getConversationTrends: (): Promise<ConversationTrendData[]> => {
    return dashboardRequest<ConversationTrendData[]>('conversations/30d');
  },

  // Get channel statistics
  getChannelStats: (): Promise<ChannelStats[]> => {
    return dashboardRequest<ChannelStats[]>('channels');
  },

  // Get top conversations
  getTopConversations: (limit?: number): Promise<TopConversation[]> => {
    const endpoint = limit ? `top-conversations&limit=${limit}` : 'top-conversations';
    return dashboardRequest<TopConversation[]>(endpoint);
  },

  // Get additional metrics
  getMetrics: (): Promise<DashboardMetrics> => {
    return dashboardRequest<DashboardMetrics>('metrics');
  },

  // Get complete dashboard summary
  getSummary: (): Promise<DashboardSummary> => {
    return dashboardRequest<DashboardSummary>('summary');
  },
};

// Utility functions
export const formatResponseTime = (seconds: number): string => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  } else {
    return `${Math.round(seconds / 3600)}h`;
  }
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value: number): string => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const getChannelIcon = (contactType: string): string => {
  switch (contactType.toLowerCase()) {
    case 'whatsapp':
      return '💬';
    case 'instagram':
      return '📷';
    case 'widget':
    case 'webchat':
      return '🌐';
    default:
      return '📱';
  }
};

export const getChannelColor = (contactType: string): string => {
  switch (contactType.toLowerCase()) {
    case 'whatsapp':
      return 'bg-green-500';
    case 'instagram':
      return 'bg-pink-500';
    case 'widget':
    case 'webchat':
      return 'bg-blue-500';
    default:
      return 'bg-gray-500';
  }
};
