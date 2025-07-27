import { create } from 'zustand';
import {
  BasicDashboardData,
  ChannelStats,
  ConversationTrendData,
  DashboardMetrics,
  DashboardSummary,
  MessageTrendData,
  TopConversation,
  dashboardApi,
} from '../services/dashboardService';

interface DashboardState {
  // Data
  basicData: BasicDashboardData | null;
  messageTrends: MessageTrendData[];
  conversationTrends: ConversationTrendData[];
  channelStats: ChannelStats[];
  topConversations: TopConversation[];
  metrics: DashboardMetrics | null;

  // Loading states
  isLoading: boolean;
  isLoadingBasic: boolean;
  isLoadingTrends: boolean;
  isLoadingChannels: boolean;
  isLoadingConversations: boolean;
  isLoadingMetrics: boolean;

  // Error states
  error: string | null;
  basicError: string | null;
  trendsError: string | null;
  channelsError: string | null;
  conversationsError: string | null;
  metricsError: string | null;

  // Last updated
  lastUpdated: string | null;

  // Auto-refresh control
  autoRefreshInterval: NodeJS.Timeout | null;
  isAutoRefreshEnabled: boolean;

  // Actions
  setBasicData: (data: BasicDashboardData) => void;
  setMessageTrends: (data: MessageTrendData[]) => void;
  setConversationTrends: (data: ConversationTrendData[]) => void;
  setChannelStats: (data: ChannelStats[]) => void;
  setTopConversations: (data: TopConversation[]) => void;
  setMetrics: (data: DashboardMetrics) => void;
  setError: (error: string | null) => void;
  clearErrors: () => void;

  // Auto-refresh control
  startAutoRefresh: () => void;
  stopAutoRefresh: () => void;
  setAutoRefreshEnabled: (enabled: boolean) => void;

  // API actions
  fetchBasicData: () => Promise<void>;
  fetchMessageTrends: () => Promise<void>;
  fetchConversationTrends: () => Promise<void>;
  fetchChannelStats: () => Promise<void>;
  fetchTopConversations: (limit?: number) => Promise<void>;
  fetchMetrics: () => Promise<void>;
  fetchAllData: () => Promise<void>;
  fetchSummary: () => Promise<void>;

  // Utility actions
  refreshData: () => Promise<void>;
  clearData: () => void;
}

export const useDashboardStore = create<DashboardState>((set, get) => ({
  // Initial state
  basicData: null,
  messageTrends: [],
  conversationTrends: [],
  channelStats: [],
  topConversations: [],
  metrics: null,
  isLoading: false,
  isLoadingBasic: false,
  isLoadingTrends: false,
  isLoadingChannels: false,
  isLoadingConversations: false,
  isLoadingMetrics: false,
  error: null,
  basicError: null,
  trendsError: null,
  channelsError: null,
  conversationsError: null,
  metricsError: null,
  lastUpdated: null,
  autoRefreshInterval: null,
  isAutoRefreshEnabled: false,

  // Setters
  setBasicData: (data) => set({ basicData: data, lastUpdated: new Date().toISOString() }),
  setMessageTrends: (data) => set({ messageTrends: data || [] }),
  setConversationTrends: (data) => set({ conversationTrends: data || [] }),
  setChannelStats: (data) => set({ channelStats: data || [] }),
  setTopConversations: (data) => set({ topConversations: data || [] }),
  setMetrics: (data) => set({ metrics: data }),
  setError: (error) => set({ error }),
  clearErrors: () =>
    set({
      error: null,
      basicError: null,
      trendsError: null,
      channelsError: null,
      conversationsError: null,
      metricsError: null,
    }),

  // Auto-refresh control
  startAutoRefresh: () => {
    const state = get();

    // Don't start if already running
    if (state.autoRefreshInterval) {
      return;
    }

    console.log('🔄 Starting dashboard auto-refresh (5 minutes interval)');

    const interval = setInterval(
      () => {
        console.log('🔄 Auto-refreshing dashboard data...');
        state.refreshData();
      },
      5 * 60 * 1000,
    ); // 5 minutes

    set({
      autoRefreshInterval: interval,
      isAutoRefreshEnabled: true,
    });
  },

  stopAutoRefresh: () => {
    const state = get();

    if (state.autoRefreshInterval) {
      console.log('⏹️ Stopping dashboard auto-refresh');
      clearInterval(state.autoRefreshInterval);
      set({
        autoRefreshInterval: null,
        isAutoRefreshEnabled: false,
      });
    }
  },

  setAutoRefreshEnabled: (enabled) => {
    const state = get();

    if (enabled && !state.autoRefreshInterval) {
      state.startAutoRefresh();
    } else if (!enabled && state.autoRefreshInterval) {
      state.stopAutoRefresh();
    }
  },

  // API actions
  fetchBasicData: async () => {
    set({ isLoadingBasic: true, basicError: null });
    try {
      const data = await dashboardApi.getBasicData();
      get().setBasicData(data);
    } catch (error) {
      console.error('Error fetching basic data:', error);
      set({ basicError: error instanceof Error ? error.message : 'Error al cargar datos básicos' });
    } finally {
      set({ isLoadingBasic: false });
    }
  },

  fetchMessageTrends: async () => {
    set({ isLoadingTrends: true, trendsError: null });
    try {
      const data = await dashboardApi.getMessageTrends();
      get().setMessageTrends(data);
    } catch (error) {
      console.error('Error fetching message trends:', error);
      set({
        trendsError:
          error instanceof Error ? error.message : 'Error al cargar tendencias de mensajes',
      });
    } finally {
      set({ isLoadingTrends: false });
    }
  },

  fetchConversationTrends: async () => {
    set({ isLoadingTrends: true, trendsError: null });
    try {
      const data = await dashboardApi.getConversationTrends();
      get().setConversationTrends(data);
    } catch (error) {
      console.error('Error fetching conversation trends:', error);
      set({
        trendsError:
          error instanceof Error ? error.message : 'Error al cargar tendencias de conversaciones',
      });
    } finally {
      set({ isLoadingTrends: false });
    }
  },

  fetchChannelStats: async () => {
    set({ isLoadingChannels: true, channelsError: null });
    try {
      const data = await dashboardApi.getChannelStats();
      get().setChannelStats(data);
    } catch (error) {
      console.error('Error fetching channel stats:', error);
      set({
        channelsError:
          error instanceof Error ? error.message : 'Error al cargar estadísticas de canales',
      });
    } finally {
      set({ isLoadingChannels: false });
    }
  },

  fetchTopConversations: async (limit) => {
    set({ isLoadingConversations: true, conversationsError: null });
    try {
      const data = await dashboardApi.getTopConversations(limit);
      get().setTopConversations(data);
    } catch (error) {
      console.error('Error fetching top conversations:', error);
      set({
        conversationsError:
          error instanceof Error ? error.message : 'Error al cargar conversaciones principales',
      });
    } finally {
      set({ isLoadingConversations: false });
    }
  },

  fetchMetrics: async () => {
    set({ isLoadingMetrics: true, metricsError: null });
    try {
      const data = await dashboardApi.getMetrics();
      get().setMetrics(data);
    } catch (error) {
      console.error('Error fetching metrics:', error);
      set({ metricsError: error instanceof Error ? error.message : 'Error al cargar métricas' });
    } finally {
      set({ isLoadingMetrics: false });
    }
  },

  fetchAllData: async () => {
    set({ isLoading: true, error: null });
    try {
      await Promise.all([
        get().fetchBasicData(),
        get().fetchMessageTrends(),
        get().fetchConversationTrends(),
        get().fetchChannelStats(),
        get().fetchTopConversations(5),
        get().fetchMetrics(),
      ]);
    } catch (error) {
      console.error('Error fetching all dashboard data:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar datos del dashboard',
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchSummary: async () => {
    set({ isLoading: true, error: null });
    try {
      const summary = await dashboardApi.getSummary();

      // Set all data from summary, ensuring arrays are never null
      if (summary?.basic_data) {
        get().setBasicData(summary.basic_data);
      }
      get().setMessageTrends(summary?.messages_7_days || []);
      get().setChannelStats(summary?.channel_stats || []);
      get().setTopConversations(summary?.top_conversations || []);

      set({ lastUpdated: summary?.generated_at || new Date().toISOString() });
    } catch (error) {
      console.error('Error fetching dashboard summary:', error);

      // Check if this is the specific "no data" error with more flexible matching
      const errorMessage = error instanceof Error ? error.message : '';
      if (
        errorMessage.includes('500') &&
        errorMessage.includes('Error obteniendo resumen del dashboard')
      ) {
        // Clear existing data and set a user-friendly message
        get().clearData();
        set({
          error:
            'No hay datos disponibles para este negocio. Comience enviando algunos mensajes para ver las estadísticas.',
        });
      } else {
        // Handle other errors normally
        set({ error: errorMessage || 'Error al cargar resumen del dashboard' });
      }
    } finally {
      set({ isLoading: false });
    }
  },

  refreshData: async () => {
    await get().fetchSummary();
    await get().fetchMetrics();
  },

  clearData: () => {
    const state = get();

    // Stop auto-refresh when clearing data
    state.stopAutoRefresh();

    set({
      basicData: null,
      messageTrends: [],
      conversationTrends: [],
      channelStats: [],
      topConversations: [],
      metrics: null,
      lastUpdated: null,
      error: null,
      basicError: null,
      trendsError: null,
      channelsError: null,
      conversationsError: null,
      metricsError: null,
    });
  },
}));
