import { createContext, useCallback, useContext, useEffect, useReducer, useRef } from 'react';
import { dashboardApi } from '../services/letparley/dashboardService';
import { useLetParleyAuth } from './LetParleyAuthProvider';

// Initial state
const initialState = {
  // Data
  basicData: null,
  messageTrends: [],
  conversationTrends: [],
  channelStats: [],
  topConversations: [],
  metrics: null,

  // Loading states
  isLoading: false,
  isLoadingBasic: false,
  isLoadingTrends: false,
  isLoadingChannels: false,
  isLoadingConversations: false,
  isLoadingMetrics: false,

  // Error states
  error: null,
  basicError: null,
  trendsError: null,
  channelsError: null,
  conversationsError: null,
  metricsError: null,

  // Metadata
  lastUpdated: null,
  isAutoRefreshEnabled: false,
};

// Action types
const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_LOADING_SPECIFIC: 'SET_LOADING_SPECIFIC',
  SET_BASIC_DATA: 'SET_BASIC_DATA',
  SET_MESSAGE_TRENDS: 'SET_MESSAGE_TRENDS',
  SET_CONVERSATION_TRENDS: 'SET_CONVERSATION_TRENDS',
  SET_CHANNEL_STATS: 'SET_CHANNEL_STATS',
  SET_TOP_CONVERSATIONS: 'SET_TOP_CONVERSATIONS',
  SET_METRICS: 'SET_METRICS',
  SET_ERROR: 'SET_ERROR',
  SET_ERROR_SPECIFIC: 'SET_ERROR_SPECIFIC',
  CLEAR_ERRORS: 'CLEAR_ERRORS',
  CLEAR_DATA: 'CLEAR_DATA',
  SET_AUTO_REFRESH: 'SET_AUTO_REFRESH',
  SET_LAST_UPDATED: 'SET_LAST_UPDATED',
};

// Reducer
const dashboardReducer = (state, action) => {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, isLoading: action.payload };

    case ACTIONS.SET_LOADING_SPECIFIC:
      return { ...state, [action.key]: action.payload };

    case ACTIONS.SET_BASIC_DATA:
      return {
        ...state,
        basicData: action.payload,
        lastUpdated: new Date().toISOString(),
        isLoadingBasic: false,
        basicError: null,
      };

    case ACTIONS.SET_MESSAGE_TRENDS:
      return {
        ...state,
        messageTrends: action.payload || [],
        isLoadingTrends: false,
        trendsError: null,
      };

    case ACTIONS.SET_CONVERSATION_TRENDS:
      return {
        ...state,
        conversationTrends: action.payload || [],
        isLoadingTrends: false,
        trendsError: null,
      };

    case ACTIONS.SET_CHANNEL_STATS:
      return {
        ...state,
        channelStats: action.payload || [],
        isLoadingChannels: false,
        channelsError: null,
      };

    case ACTIONS.SET_TOP_CONVERSATIONS:
      return {
        ...state,
        topConversations: action.payload || [],
        isLoadingConversations: false,
        conversationsError: null,
      };

    case ACTIONS.SET_METRICS:
      return {
        ...state,
        metrics: action.payload,
        isLoadingMetrics: false,
        metricsError: null,
      };

    case ACTIONS.SET_ERROR:
      return { ...state, error: action.payload, isLoading: false };

    case ACTIONS.SET_ERROR_SPECIFIC:
      return {
        ...state,
        [action.key]: action.payload,
        [`isLoading${action.key.charAt(0).toUpperCase() + action.key.slice(1).replace('Error', '')}`]: false,
      };

    case ACTIONS.CLEAR_ERRORS:
      return {
        ...state,
        error: null,
        basicError: null,
        trendsError: null,
        channelsError: null,
        conversationsError: null,
        metricsError: null,
      };

    case ACTIONS.CLEAR_DATA:
      return {
        ...initialState,
        isAutoRefreshEnabled: state.isAutoRefreshEnabled,
      };

    case ACTIONS.SET_AUTO_REFRESH:
      return { ...state, isAutoRefreshEnabled: action.payload };

    case ACTIONS.SET_LAST_UPDATED:
      return { ...state, lastUpdated: action.payload };

    default:
      return state;
  }
};

// Context
const DashboardContext = createContext();

// Provider component
export const LetParleyDashboardProvider = ({ children, authContext }) => {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const autoRefreshInterval = useRef(null);
  const authContextRef = useRef(authContext);

  // Update auth context ref when it changes
  useEffect(() => {
    authContextRef.current = authContext;
  }, [authContext]);

  // Action creators
  const setLoading = useCallback((loading) => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: loading });
  }, []);

  const setLoadingSpecific = useCallback((key, loading) => {
    dispatch({ type: ACTIONS.SET_LOADING_SPECIFIC, key, payload: loading });
  }, []);

  const setError = useCallback((error) => {
    dispatch({ type: ACTIONS.SET_ERROR, payload: error });
  }, []);

  const setErrorSpecific = useCallback((key, error) => {
    dispatch({ type: ACTIONS.SET_ERROR_SPECIFIC, key, payload: error });
  }, []);

  const clearErrors = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_ERRORS });
  }, []);

  const clearData = useCallback(() => {
    dispatch({ type: ACTIONS.CLEAR_DATA });
  }, []);

  // API actions
  const fetchBasicData = useCallback(async () => {
    const currentAuthContext = authContextRef.current;
    if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

    setLoadingSpecific('isLoadingBasic', true);
    try {
      const data = await dashboardApi.getBasicData(currentAuthContext);
      dispatch({ type: ACTIONS.SET_BASIC_DATA, payload: data });
    } catch (error) {
      console.error('Error fetching basic data:', error);
      setErrorSpecific('basicError', error.message || 'Error al cargar datos básicos');
    }
  }, [setLoadingSpecific, setErrorSpecific]);

  const fetchMessageTrends = useCallback(async () => {
    const currentAuthContext = authContextRef.current;
    if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

    setLoadingSpecific('isLoadingTrends', true);
    try {
      const data = await dashboardApi.getMessageTrends(currentAuthContext);
      dispatch({ type: ACTIONS.SET_MESSAGE_TRENDS, payload: data });
    } catch (error) {
      console.error('Error fetching message trends:', error);
      setErrorSpecific('trendsError', error.message || 'Error al cargar tendencias de mensajes');
    }
  }, [setLoadingSpecific, setErrorSpecific]);

  const fetchConversationTrends = useCallback(async () => {
    const currentAuthContext = authContextRef.current;
    if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

    setLoadingSpecific('isLoadingTrends', true);
    try {
      const data = await dashboardApi.getConversationTrends(currentAuthContext);
      dispatch({ type: ACTIONS.SET_CONVERSATION_TRENDS, payload: data });
    } catch (error) {
      console.error('Error fetching conversation trends:', error);
      setErrorSpecific(
        'trendsError',
        error.message || 'Error al cargar tendencias de conversaciones',
      );
    }
  }, [setLoadingSpecific, setErrorSpecific]);

  const fetchChannelStats = useCallback(async () => {
    const currentAuthContext = authContextRef.current;
    if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

    setLoadingSpecific('isLoadingChannels', true);
    try {
      const data = await dashboardApi.getChannelStats(currentAuthContext);
      dispatch({ type: ACTIONS.SET_CHANNEL_STATS, payload: data });
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      setErrorSpecific('channelsError', error.message || 'Error al cargar estadísticas de canales');
    }
  }, [setLoadingSpecific, setErrorSpecific]);

  const fetchTopConversations = useCallback(
    async (limit = 5) => {
      const currentAuthContext = authContextRef.current;
      if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

      setLoadingSpecific('isLoadingConversations', true);
      try {
        const data = await dashboardApi.getTopConversations(currentAuthContext, limit);
        dispatch({ type: ACTIONS.SET_TOP_CONVERSATIONS, payload: data });
      } catch (error) {
        console.error('Error fetching top conversations:', error);
        setErrorSpecific(
          'conversationsError',
          error.message || 'Error al cargar conversaciones principales',
        );
      }
    },
    [setLoadingSpecific, setErrorSpecific],
  );

  const fetchMetrics = useCallback(async () => {
    const currentAuthContext = authContextRef.current;
    if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

    setLoadingSpecific('isLoadingMetrics', true);
    try {
      const data = await dashboardApi.getMetrics(currentAuthContext);
      dispatch({ type: ACTIONS.SET_METRICS, payload: data });
    } catch (error) {
      console.error('Error fetching metrics:', error);
      setErrorSpecific('metricsError', error.message || 'Error al cargar métricas');
    }
  }, [setLoadingSpecific, setErrorSpecific]);

  const fetchSummary = useCallback(async () => {
    const currentAuthContext = authContextRef.current;
    if (!currentAuthContext?.sessionToken || !currentAuthContext?.selectedBusinessId) return;

    setLoading(true);
    clearErrors();

    try {
      const summary = await dashboardApi.getSummary(currentAuthContext);

      // Set all data from summary
      if (summary?.basic_data) {
        dispatch({ type: ACTIONS.SET_BASIC_DATA, payload: summary.basic_data });
      }
      dispatch({ type: ACTIONS.SET_MESSAGE_TRENDS, payload: summary?.messages_7_days || [] });
      dispatch({ type: ACTIONS.SET_CHANNEL_STATS, payload: summary?.channel_stats || [] });
      dispatch({ type: ACTIONS.SET_TOP_CONVERSATIONS, payload: summary?.top_conversations || [] });

      dispatch({
        type: ACTIONS.SET_LAST_UPDATED,
        payload: summary?.generated_at || new Date().toISOString(),
      });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);

      const errorMessage = error.message || '';
      if (
        errorMessage.includes('500') &&
        errorMessage.includes('Error obteniendo resumen del dashboard')
      ) {
        clearData();
        setError(
          'No hay datos disponibles para este negocio. Comience enviando algunos mensajes para ver las estadísticas.',
        );
      } else {
        setError(errorMessage || 'Error al cargar resumen del dashboard');
      }
    } finally {
      setLoading(false);
    }
  }, [setLoading, clearErrors, clearData, setError]);

  const refreshData = useCallback(async () => {
    await fetchSummary();
    await fetchMetrics();
  }, [fetchSummary, fetchMetrics]);

  // Auto-refresh functionality
  const startAutoRefresh = useCallback(() => {
    if (autoRefreshInterval.current) return;

    console.log('🔄 Starting dashboard auto-refresh (5 minutes interval)');
    autoRefreshInterval.current = setInterval(
      () => {
        console.log('🔄 Auto-refreshing dashboard data...');
        refreshData();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    dispatch({ type: ACTIONS.SET_AUTO_REFRESH, payload: true });
  }, [refreshData]);

  const stopAutoRefresh = useCallback(() => {
    if (autoRefreshInterval.current) {
      console.log('⏹️ Stopping dashboard auto-refresh');
      clearInterval(autoRefreshInterval.current);
      autoRefreshInterval.current = null;
      dispatch({ type: ACTIONS.SET_AUTO_REFRESH, payload: false });
    }
  }, []);

  const toggleAutoRefresh = useCallback(
    (enabled) => {
      if (enabled) {
        startAutoRefresh();
      } else {
        stopAutoRefresh();
      }
    },
    [startAutoRefresh, stopAutoRefresh],
  );

  // Cleanup auto-refresh on unmount
  useEffect(() => {
    return () => {
      if (autoRefreshInterval.current) {
        clearInterval(autoRefreshInterval.current);
      }
    };
  }, []);

  // Clear data when business changes
  useEffect(() => {
    if (authContext?.selectedBusinessId) {
      clearData();
    }
  }, [authContext?.selectedBusinessId, clearData]); // Restore clearData as dependency since it has no dependencies

  const value = {
    // State
    ...state,

    // Actions
    fetchBasicData,
    fetchMessageTrends,
    fetchConversationTrends,
    fetchChannelStats,
    fetchTopConversations,
    fetchMetrics,
    fetchSummary,
    refreshData,
    clearData,
    clearErrors,

    // Auto-refresh
    startAutoRefresh,
    stopAutoRefresh,
    toggleAutoRefresh,
  };

  return <DashboardContext.Provider value={value}>{children}</DashboardContext.Provider>;
};

// Hook to use dashboard context
export const useLetParleyDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useLetParleyDashboard must be used within a LetParleyDashboardProvider');
  }
  return context;
};

// Wrapper that gets authContext from AuthProvider
export const DashboardProviderWrapper = ({ children }) => {
  const { authContext } = useLetParleyAuth();

  return (
    <LetParleyDashboardProvider authContext={authContext}>{children}</LetParleyDashboardProvider>
  );
};
