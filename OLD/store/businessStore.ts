import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Business {
  business_id: number;
  name: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  phone_number?: string;
  email: string;
  website?: string;
  logo?: string;
  industry?: string;
  description?: string;
  date_registered: string;
  is_active: boolean;
  business_credits_id?: number;
}

interface CreateBusinessRequest {
  name: string;
  email: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  phone_number?: string;
  website?: string;
  tax_id?: string;
  logo?: string;
  industry?: string;
  number_of_employees?: number;
  date_established?: string;
  description?: string;
}

interface BusinessState {
  businesses: Business[];
  isLoading: boolean;
  isCreating: boolean;
  error: string | null;
  createError: string | null;

  // Actions
  setBusinesses: (businesses: Business[]) => void;
  setIsLoading: (loading: boolean) => void;
  setIsCreating: (creating: boolean) => void;
  setError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  fetchBusinesses: () => Promise<void>;
  createBusiness: (
    businessData: CreateBusinessRequest,
  ) => Promise<{ success: boolean; businessId?: number; error?: string }>;
  clearBusinesses: () => void;
  clearErrors: () => void;
}

export const useBusinessStore = create<BusinessState>((set, get) => ({
  businesses: [],
  isLoading: false,
  isCreating: false,
  error: null,
  createError: null,

  setBusinesses: (businesses) => set({ businesses }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsCreating: (creating) => set({ isCreating: creating }),
  setError: (error) => set({ error }),
  setCreateError: (error) => set({ createError: error }),

  clearBusinesses: () => set({ businesses: [], error: null }),
  clearErrors: () => set({ error: null, createError: null }),

  fetchBusinesses: async () => {
    const { sessionToken, signOut } = useAuthStore.getState();

    if (!sessionToken) {
      set({ error: 'No session token found' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('https://api3.letparley.com/lpmobile/businesses', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          signOut();
          throw new Error('Session expired. Please log in again.');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      // Handle case where user has no businesses (empty array or invalid format)
      if (!data || !Array.isArray(data) || data.length === 0) {
        console.log('No businesses found for user');
        set({ businesses: [] });
        return;
      }

      set({ businesses: data });
    } catch (error) {
      console.error('Error fetching businesses:', error);

      // Check if this is the "invalid response format" case (no businesses)
      if (error instanceof Error && error.message.includes('Invalid response format')) {
        set({ businesses: [], error: null });
      } else {
        set({ error: error instanceof Error ? error.message : 'Failed to load businesses' });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  createBusiness: async (businessData: CreateBusinessRequest) => {
    const { sessionToken, signOut } = useAuthStore.getState();

    if (!sessionToken) {
      set({ createError: 'No session token found' });
      return { success: false, error: 'No session token found' };
    }

    set({ isCreating: true, createError: null });

    try {
      const response = await fetch('https://api3.letparley.com/lpmobile/business', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify(businessData),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 401) {
          signOut();
          throw new Error('Session expired. Please log in again.');
        }

        // Handle specific business creation errors
        if (response.status === 409) {
          throw new Error(data.error || 'Ya existe un negocio con ese nombre o email');
        }

        if (response.status === 400) {
          throw new Error(data.error || 'Datos inválidos. Verifica los campos requeridos.');
        }

        throw new Error(data.error || `Error ${response.status}: ${response.statusText}`);
      }

      if (data.success && data.business_id) {
        // Refresh businesses list after successful creation
        await get().fetchBusinesses();

        return {
          success: true,
          businessId: data.business_id,
        };
      } else {
        throw new Error(data.message || 'Error creating business');
      }
    } catch (error) {
      console.error('Error creating business:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to create business';
      set({ createError: errorMessage });
      return {
        success: false,
        error: errorMessage,
      };
    } finally {
      set({ isCreating: false });
    }
  },
}));
