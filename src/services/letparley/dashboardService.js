// LetParley Dashboard Service - Adapted for Aurora
const API_BASE_URL = 'https://api3.letparley.com';

// Helper function for API requests with proper error handling
const dashboardRequest = async (endpoint, authContext) => {
  const { sessionToken, selectedBusinessId, signOut } = authContext;

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
  getBasicData: (authContext) => {
    return dashboardRequest('basic', authContext);
  },

  // Get message trends for last 7 days
  getMessageTrends: (authContext) => {
    return dashboardRequest('messages/7d', authContext);
  },

  // Get conversation trends for last 30 days
  getConversationTrends: (authContext) => {
    return dashboardRequest('conversations/30d', authContext);
  },

  // Get channel statistics
  getChannelStats: (authContext) => {
    return dashboardRequest('channels', authContext);
  },

  // Get top conversations
  getTopConversations: (authContext, limit) => {
    const endpoint = limit ? `top-conversations&limit=${limit}` : 'top-conversations';
    return dashboardRequest(endpoint, authContext);
  },

  // Get additional metrics
  getMetrics: (authContext) => {
    return dashboardRequest('metrics', authContext);
  },

  // Get complete dashboard summary
  getSummary: (authContext) => {
    return dashboardRequest('summary', authContext);
  },
};

// Utility functions
export const formatResponseTime = (seconds) => {
  if (seconds < 60) {
    return `${Math.round(seconds)}s`;
  } else if (seconds < 3600) {
    return `${Math.round(seconds / 60)}m`;
  } else {
    return `${Math.round(seconds / 3600)}h`;
  }
};

export const formatPercentage = (value) => {
  return `${value.toFixed(1)}%`;
};

export const formatNumber = (value) => {
  if (value >= 1000000) {
    return `${(value / 1000000).toFixed(1)}M`;
  } else if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }
  return value.toString();
};

export const getChannelIcon = (contactType) => {
  switch (contactType.toLowerCase()) {
    case 'whatsapp':
      return 'whatsapp';
    case 'instagram':
      return 'instagram';
    case 'widget':
    case 'webchat':
      return 'language';
    default:
      return 'chat';
  }
};

export const getChannelColor = (contactType) => {
  switch (contactType.toLowerCase()) {
    case 'whatsapp':
      return 'success';
    case 'instagram':
      return 'error';
    case 'widget':
    case 'webchat':
      return 'primary';
    default:
      return 'grey';
  }
};

// Chart data formatters
export const formatChartData = (data, valueKey, labelKey) => {
  return data.map((item) => ({
    x: item.date,
    y: item[valueKey],
    label: item[labelKey] || `${item[valueKey]} ${labelKey}`,
  }));
};

// Growth calculation helpers
export const calculateGrowth = (current, previous) => {
  if (previous === 0) return current > 0 ? 100 : 0;
  return ((current - previous) / previous) * 100;
};

export const getGrowthDisplay = (current, previous) => {
  const growth = calculateGrowth(current, previous);
  return {
    value: `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`,
    type: growth > 0 ? 'positive' : growth < 0 ? 'negative' : 'neutral',
  };
};
