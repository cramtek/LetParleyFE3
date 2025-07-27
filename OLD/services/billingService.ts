import { useAuthStore } from '../store/authStore';

const API_BASE_URL = 'https://api3.letparley.com';

// Types for billing
export interface Plan {
  plan_id: number;
  plan_name: string;
  plan_description: string;
  features_json: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface PlanVariant {
  variant_id: number;
  plan_id: number;
  credit_amount: number;
  monthly_price_usd: number;
  annual_price_usd: number;
  onvo_monthly_price_id: string;
  onvo_annual_price_id: string;
  is_active: boolean;
}

export interface PlanWithVariants {
  plan: Plan;
  variants: PlanVariant[];
}

export interface Subscription {
  subscription_id: number;
  business_id: number;
  user_id: string;
  variant_id: number;
  onvo_subscription_id: string;
  onvo_customer_id: string;
  status: 'incomplete' | 'active' | 'past_due' | 'cancelled' | 'trialing';
  billing_period: 'monthly' | 'annual';
  credits_included: number;
  credits_used: number;
  current_period_start: string;
  current_period_end: string;
  next_billing_date: string;
  plan_name: string;
  plan_description: string;
  credit_amount: number;
  monthly_price: number;
  annual_price: number;
  business_name: string;
}

export interface UsageStats {
  credits_included: number;
  credits_used: number;
  credits_remaining: number;
  usage_percentage: number;
  period_start: string;
  period_end: string;
  next_billing_date: string;
}

export interface CreateSubscriptionRequest {
  plan_id?: number;
  variant_id: number;
  billing_period: 'monthly' | 'annual';
}

export interface CreateSubscriptionResponse {
  subscription_id: number;
  payment_intent_id: string;
  public_key: string;
  requires_payment: boolean;
  message: string;
}

export interface UpgradeSubscriptionRequest {
  new_variant_id: number;
  billing_period: 'monthly' | 'annual';
}

export interface TopupRequest {
  credit_amount: number;
  amount_usd: number;
}

export interface Transaction {
  transaction_id: number;
  subscription_id: number;
  transaction_type: 'topup' | 'usage' | 'subscription' | 'refund';
  credit_amount: number;
  description: string;
  created_at: string;
}

export interface TransactionsResponse {
  transactions: Transaction[];
  count: number;
}

// Custom error class for connection issues
export class ConnectionError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'ConnectionError';
  }
}

// Helper function to detect connection errors
const isConnectionError = (error: any): boolean => {
  if (error instanceof TypeError && error.message === 'Failed to fetch') {
    return true;
  }

  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    return (
      message.includes('failed to fetch') ||
      message.includes('networkerror') ||
      message.includes('network error') ||
      message.includes('connection') ||
      message.includes('timeout') ||
      message.includes('cors') ||
      message.includes('net::')
    );
  }

  return false;
};

// Helper function for API requests with improved error handling
const billingRequest = async <T>(
  endpoint: string,
  method: string = 'GET',
  data?: any,
): Promise<T> => {
  const { sessionToken, selectedBusinessId, signOut } = useAuthStore.getState();

  if (!sessionToken) {
    throw new Error('No session token available');
  }

  if (!selectedBusinessId) {
    throw new Error('No business selected');
  }

  const headers: Record<string, string> = {
    Authorization: `Bearer ${sessionToken}`,
    'Content-Type': 'application/json',
    'X-Business-ID': selectedBusinessId,
  };

  const options: RequestInit = {
    method,
    headers,
    // Add timeout and other fetch options for better error handling
    signal: AbortSignal.timeout(30000), // 30 second timeout
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
      let errorMessage = `API error: ${response.status}`;

      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.error || errorData.message || errorMessage;
      } catch {
        errorMessage = errorText || errorMessage;
      }

      throw new Error(errorMessage);
    }

    return await response.json();
  } catch (error) {
    console.error(`Billing API request failed for ${endpoint}:`, error);

    // Check if it's a connection-related error
    if (isConnectionError(error)) {
      throw new ConnectionError(
        'No se pudo conectar con el servidor de facturación. Verifica tu conexión a internet e inténtalo de nuevo.',
      );
    }

    // Handle timeout errors
    if (error instanceof Error && error.name === 'AbortError') {
      throw new ConnectionError(
        'La conexión con el servidor tardó demasiado. Verifica tu conexión a internet e inténtalo de nuevo.',
      );
    }

    throw error;
  }
};

// Billing API functions
export const billingApi = {
  // Get available plans
  getPlans: (): Promise<{ success: boolean; plans: PlanWithVariants[] }> => {
    return billingRequest<{ success: boolean; plans: PlanWithVariants[] }>('/api/v1/billing/plans');
  },

  // Create subscription
  createSubscription: (
    data: CreateSubscriptionRequest,
  ): Promise<{ success: boolean; data: CreateSubscriptionResponse }> => {
    return billingRequest<{ success: boolean; data: CreateSubscriptionResponse }>(
      '/api/v1/billing/subscription',
      'POST',
      data,
    );
  },

  // Get current subscription
  getSubscription: (): Promise<{ success: boolean; subscription: Subscription }> => {
    return billingRequest<{ success: boolean; subscription: Subscription }>(
      '/api/v1/billing/subscription',
    );
  },

  // Get usage statistics
  getUsage: (): Promise<{ success: boolean; usage: UsageStats }> => {
    return billingRequest<{ success: boolean; usage: UsageStats }>('/api/v1/billing/usage');
  },

  // Upgrade/downgrade subscription
  upgradeSubscription: (
    data: UpgradeSubscriptionRequest,
  ): Promise<{ success: boolean; data: CreateSubscriptionResponse }> => {
    return billingRequest<{ success: boolean; data: CreateSubscriptionResponse }>(
      '/api/v1/billing/upgrade',
      'POST',
      data,
    );
  },

  // Top-up credits
  topupCredits: (
    data: TopupRequest,
  ): Promise<{ success: boolean; data: CreateSubscriptionResponse }> => {
    return billingRequest<{ success: boolean; data: CreateSubscriptionResponse }>(
      '/api/v1/billing/topup',
      'POST',
      data,
    );
  },

  // Cancel subscription
  cancelSubscription: (): Promise<{ success: boolean; message: string }> => {
    return billingRequest<{ success: boolean; message: string }>('/api/v1/billing/cancel', 'POST');
  },

  // Get transaction history
  getTransactions: (
    limit?: number,
  ): Promise<{ success: boolean; transactions: Transaction[]; count: number }> => {
    const endpoint = limit
      ? `/api/v1/billing/transactions?limit=${limit}`
      : '/api/v1/billing/transactions';
    return billingRequest<{ success: boolean; transactions: Transaction[]; count: number }>(
      endpoint,
    );
  },
};

// Utility functions
export const formatCredits = (credits: number): string => {
  if (credits >= 1000000) {
    return `${(credits / 1000000).toFixed(1)}M`;
  } else if (credits >= 1000) {
    return `${(credits / 1000).toFixed(0)}K`;
  }
  return credits.toString();
};

export const formatPrice = (price: number): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(price);
};

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'active':
      return 'text-green-600 bg-green-50 border-green-200';
    case 'trialing':
      return 'text-blue-600 bg-blue-50 border-blue-200';
    case 'past_due':
      return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    case 'cancelled':
      return 'text-red-600 bg-red-50 border-red-200';
    case 'incomplete':
      return 'text-gray-600 bg-gray-50 border-gray-200';
    default:
      return 'text-gray-600 bg-gray-50 border-gray-200';
  }
};

export const getStatusText = (status: string): string => {
  switch (status) {
    case 'active':
      return 'Activa';
    case 'trialing':
      return 'Período de Prueba';
    case 'past_due':
      return 'Pago Atrasado';
    case 'cancelled':
      return 'Cancelada';
    case 'incomplete':
      return 'Pendiente de Pago';
    default:
      return 'Desconocido';
  }
};

export const parsePlanFeatures = (featuresJson: string): Record<string, any> => {
  try {
    return JSON.parse(featuresJson);
  } catch {
    return {};
  }
};

export const calculateSavings = (monthlyPrice: number, annualPrice: number): number => {
  const annualMonthly = monthlyPrice * 12;
  return ((annualMonthly - annualPrice) / annualMonthly) * 100;
};
