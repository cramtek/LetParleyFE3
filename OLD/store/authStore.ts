import { create } from 'zustand';

interface AuthState {
  sessionToken: string | null;
  userEmail: string | null;
  selectedBusinessId: string | null;
  userId: string | null;
  isNewUser: boolean;
  isAuthenticated: boolean;
  isLoading: boolean;

  // Actions
  setSessionToken: (token: string | null) => void;
  setUserEmail: (email: string | null) => void;
  setSelectedBusinessId: (id: string | null) => void;
  setUserId: (id: string | null) => void;
  setIsNewUser: (isNew: boolean) => void;
  signIn: (token: string, email: string, userId?: string, isNewUser?: boolean) => void;
  signOut: () => void;
  loadFromStorage: () => void;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  sessionToken: null,
  userEmail: null,
  selectedBusinessId: null,
  userId: null,
  isNewUser: false,
  isAuthenticated: false,
  isLoading: true,

  setSessionToken: (token) => {
    set({
      sessionToken: token,
      isAuthenticated: !!token,
    });

    if (token) {
      localStorage.setItem('session_token', token);
    } else {
      localStorage.removeItem('session_token');
    }
  },

  setUserEmail: (email) => {
    const prevEmail = get().userEmail;
    set({ userEmail: email });

    if (email) {
      localStorage.setItem('user_email', email);
    } else {
      localStorage.removeItem('user_email');
    }

    // Update notification context when email changes
    if (prevEmail !== email) {
      updateNotificationContext();
    }
  },

  setSelectedBusinessId: (id) => {
    const prevBusinessId = get().selectedBusinessId;
    set({ selectedBusinessId: id });

    if (id) {
      localStorage.setItem('selected_business_id', id);
    } else {
      localStorage.removeItem('selected_business_id');
    }

    // Update notification context when business changes
    if (prevBusinessId !== id) {
      updateNotificationContext();
    }
  },

  setUserId: (id) => {
    set({ userId: id });
    if (id) {
      localStorage.setItem('user_id', id);
    } else {
      localStorage.removeItem('user_id');
    }
  },

  setIsNewUser: (isNew) => {
    set({ isNewUser: isNew });
    localStorage.setItem('is_new_user', isNew.toString());
  },

  signIn: (token, email, userId, isNewUser = false) => {
    set({
      sessionToken: token,
      userEmail: email,
      userId: userId || null,
      isNewUser,
      isAuthenticated: true,
      isLoading: false,
    });
    localStorage.setItem('session_token', token);
    localStorage.setItem('user_email', email);
    if (userId) {
      localStorage.setItem('user_id', userId);
    }
    localStorage.setItem('is_new_user', isNewUser.toString());

    // Update notification context after sign in
    updateNotificationContext();
  },

  signOut: () => {
    // Clear notification context before signing out
    clearNotificationContext();

    set({
      sessionToken: null,
      userEmail: null,
      selectedBusinessId: null,
      userId: null,
      isNewUser: false,
      isAuthenticated: false,
      isLoading: false,
    });
    localStorage.removeItem('session_token');
    localStorage.removeItem('user_email');
    localStorage.removeItem('selected_business_id');
    localStorage.removeItem('user_id');
    localStorage.removeItem('is_new_user');
  },

  loadFromStorage: () => {
    try {
      const token = localStorage.getItem('session_token');
      const email = localStorage.getItem('user_email');
      const businessId = localStorage.getItem('selected_business_id');
      const userId = localStorage.getItem('user_id');
      const isNewUser = localStorage.getItem('is_new_user') === 'true';

      // Validate token exists and is not empty
      const isValidToken = token && token.trim().length > 0;

      console.log('Loading auth state from storage:', {
        hasToken: !!isValidToken,
        hasEmail: !!email,
        hasBusinessId: !!businessId,
        hasUserId: !!userId,
        isNewUser,
      });

      set({
        sessionToken: isValidToken ? token : null,
        userEmail: email,
        selectedBusinessId: businessId,
        userId: userId,
        isNewUser,
        isAuthenticated: !!isValidToken,
        isLoading: false,
      });

      // Update notification context after loading from storage
      updateNotificationContext();
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
      // If there's an error reading from localStorage, reset to safe state
      set({
        sessionToken: null,
        userEmail: null,
        selectedBusinessId: null,
        userId: null,
        isNewUser: false,
        isAuthenticated: false,
        isLoading: false,
      });
    }
  },
}));

// Helper functions to manage notification context
const updateNotificationContext = () => {
  // Import dynamically to avoid circular dependency
  import('./notificationStore').then(({ useNotificationStore }) => {
    const { userEmail, selectedBusinessId } = useAuthStore.getState();
    useNotificationStore.getState().setUserContext(userEmail, selectedBusinessId);
  });
};

const clearNotificationContext = () => {
  // Import dynamically to avoid circular dependency
  import('./notificationStore').then(({ useNotificationStore }) => {
    useNotificationStore.getState().clearUserContext();
  });
};
