import { createContext, useCallback, useContext, useEffect, useMemo, useReducer } from 'react';
import { AuthStorage } from '../services/letparley/authService';

// Initial state
const initialState = {
  // Authentication data
  sessionToken: null,
  userEmail: null,
  selectedBusinessId: null,
  userId: null,
  isNewUser: false,
  isAuthenticated: false,

  // Business data
  businesses: [],
  selectedBusinessName: null,

  // Loading states
  isLoading: true,
  isAuthenticating: false,

  // UI state
  verificationEmail: null, // Email for which verification is pending

  // Error state
  error: null,
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_AUTHENTICATING: 'SET_AUTHENTICATING',
  SET_SESSION_TOKEN: 'SET_SESSION_TOKEN',
  SET_USER_EMAIL: 'SET_USER_EMAIL',
  SET_SELECTED_BUSINESS_ID: 'SET_SELECTED_BUSINESS_ID',
  SET_USER_ID: 'SET_USER_ID',
  SET_IS_NEW_USER: 'SET_IS_NEW_USER',
  SET_VERIFICATION_EMAIL: 'SET_VERIFICATION_EMAIL',
  SET_ERROR: 'SET_ERROR',
  SET_BUSINESSES: 'SET_BUSINESSES',
  SET_SELECTED_BUSINESS_NAME: 'SET_SELECTED_BUSINESS_NAME',
  SIGN_IN: 'SIGN_IN',
  SIGN_OUT: 'SIGN_OUT',
  LOAD_FROM_STORAGE: 'LOAD_FROM_STORAGE',
};

// Reducer
const authReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_AUTHENTICATING:
      return { ...state, isAuthenticating: action.payload };

    case ACTIONS.SET_SESSION_TOKEN:
      return {
        ...state,
        sessionToken: action.payload,
        isAuthenticated: !!action.payload,
      };

    case ACTIONS.SET_USER_EMAIL:
      return { ...state, userEmail: action.payload };

    case ACTIONS.SET_SELECTED_BUSINESS_ID:
      return { ...state, selectedBusinessId: action.payload };

    case ACTIONS.SET_USER_ID:
      return { ...state, userId: action.payload };

    case ACTIONS.SET_IS_NEW_USER:
      return { ...state, isNewUser: action.payload };

    case ACTIONS.SET_VERIFICATION_EMAIL:
      return { ...state, verificationEmail: action.payload };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload };

    case ACTIONS.SET_BUSINESSES:
      return { ...state, businesses: action.payload };

    case ACTIONS.SET_SELECTED_BUSINESS_NAME:
      return { ...state, selectedBusinessName: action.payload };

    case ACTIONS.SIGN_IN:
      return {
        ...state,
        sessionToken: action.payload.token,
        userEmail: action.payload.email,
        userId: action.payload.userId || null,
        isNewUser: action.payload.isNewUser || false,
        isAuthenticated: true,
        isAuthenticating: false,
        verificationEmail: null,
        error: null,
      };

    case ACTIONS.SIGN_OUT:
      return {
        ...initialState,
        isLoading: false,
      };

    case ACTIONS.LOAD_FROM_STORAGE:
      return {
        ...state,
        ...action.payload,
        isLoading: false,
      };

    default:
      return state;
  }
};

// Context
const LetParleyAuthContext = createContext();

// Provider component
export const LetParleyAuthProvider = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setAuthenticating = useCallback((authenticating) => {
    dispatch({ type: ACTIONS.SET_AUTHENTICATING, payload: authenticating });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const clearError = useCallback(() => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: null });
  }, []);

  const setVerificationEmail = useCallback((email) => {
    dispatch({ type: ACTIONS.SET_VERIFICATION_EMAIL, payload: email });
  }, []);

  const setSessionToken = useCallback((token) => {
    dispatch({ type: ACTIONS.SET_SESSION_TOKEN, payload: token });
    AuthStorage.setSessionToken(token);
  }, []);

  const setUserEmail = useCallback((email) => {
    dispatch({ type: ACTIONS.SET_USER_EMAIL, payload: email });
    AuthStorage.setUserEmail(email);
  }, []);

  const setSelectedBusinessId = useCallback((businessId) => {
    dispatch({ type: ACTIONS.SET_SELECTED_BUSINESS_ID, payload: businessId });
    AuthStorage.setSelectedBusinessId(businessId);
  }, []);

  const setUserId = useCallback((userId) => {
    dispatch({ type: ACTIONS.SET_USER_ID, payload: userId });
    AuthStorage.setUserId(userId);
  }, []);

  const setIsNewUser = useCallback((isNewUser) => {
    dispatch({ type: ACTIONS.SET_IS_NEW_USER, payload: isNewUser });
    AuthStorage.setIsNewUser(isNewUser);
  }, []);

  const setBusinesses = useCallback((businesses) => {
    dispatch({ type: ACTIONS.SET_BUSINESSES, payload: businesses });
  }, []);

  const setSelectedBusinessName = useCallback((name) => {
    dispatch({ type: ACTIONS.SET_SELECTED_BUSINESS_NAME, payload: name });
    AuthStorage.setSelectedBusinessName(name);
  }, []);

  // Main authentication actions
  const signIn = useCallback((token, email, userId, isNewUser = false) => {
    dispatch({
      type: ACTIONS.SIGN_IN,
      payload: { token, email, userId, isNewUser },
    });

    // Store in localStorage
    AuthStorage.setSessionToken(token);
    AuthStorage.setUserEmail(email);
    if (userId) {
      AuthStorage.setUserId(userId);
    }
    AuthStorage.setIsNewUser(isNewUser);

    console.log('✅ User signed in:', { email, isNewUser });
  }, []);

  const signOut = useCallback(() => {
    dispatch({ type: ACTIONS.SIGN_OUT });
    AuthStorage.clearAll();
    console.log('👋 User signed out');
  }, []);

  const loadFromStorage = useCallback(() => {
    try {
      const authData = AuthStorage.loadAll();

      console.log('Loading auth state from storage:', {
        hasToken: !!authData.sessionToken,
        hasEmail: !!authData.userEmail,
        hasBusinessId: !!authData.selectedBusinessId,
        hasUserId: !!authData.userId,
        isNewUser: authData.isNewUser,
        isAuthenticated: authData.isAuthenticated,
      });

      dispatch({
        type: ACTIONS.LOAD_FROM_STORAGE,
        payload: authData,
      });
    } catch (error) {
      console.error('Error loading auth state from storage:', error);
      dispatch({
        type: ACTIONS.LOAD_FROM_STORAGE,
        payload: {
          sessionToken: null,
          userEmail: null,
          selectedBusinessId: null,
          userId: null,
          isNewUser: false,
          isAuthenticated: false,
        },
      });
    }
  }, []);

  // Load auth state from storage on mount
  useEffect(() => {
    loadFromStorage();
  }, []); // Remove loadFromStorage from dependencies - it should only run on mount

  // Create auth context value (memoized to prevent infinite loops)
  const authContextValue = useMemo(
    () => ({
      sessionToken: state.sessionToken,
      selectedBusinessId: state.selectedBusinessId,
      signOut,
    }),
    [state.sessionToken, state.selectedBusinessId, signOut],
  );

  const value = {
    // State
    ...state,

    // Actions
    setLoading,
    setAuthenticating,
    setError,
    clearError,
    setVerificationEmail,
    setSessionToken,
    setUserEmail,
    setSelectedBusinessId,
    setUserId,
    setIsNewUser,
    signIn,
    signOut,
    loadFromStorage,

    // Business management
    setBusinesses,
    setSelectedBusinessName,

    // Auth context for services
    authContext: authContextValue,
  };

  return <LetParleyAuthContext.Provider value={value}>{children}</LetParleyAuthContext.Provider>;
};

// Hook to use auth context
export const useLetParleyAuth = () => {
  const context = useContext(LetParleyAuthContext);
  if (!context) {
    throw new Error('useLetParleyAuth must be used within a LetParleyAuthProvider');
  }
  return context;
};
