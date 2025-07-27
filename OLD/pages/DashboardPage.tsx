import { useEffect, useState } from 'react';
import {
  Activity,
  AlertCircle,
  BarChart2,
  Calendar,
  Clock,
  Globe,
  MessageSquare,
  RefreshCw,
  Target,
  TrendingUp,
  Users,
  Zap,
} from 'lucide-react';
import ChannelCard from '../components/dashboard/ChannelCard';
import SimpleChart from '../components/dashboard/SimpleChart';
import StatCard from '../components/dashboard/StatCard';
import { formatNumber, formatPercentage, formatResponseTime } from '../services/dashboardService';
import { useAuthStore } from '../store/authStore';
import { useDashboardStore } from '../store/dashboardStore';

const DashboardPage = () => {
  const { selectedBusinessId } = useAuthStore();
  const {
    basicData,
    messageTrends,
    conversationTrends,
    channelStats,
    topConversations,
    metrics,
    isLoading,
    error,
    lastUpdated,
    isAutoRefreshEnabled,
    fetchSummary,
    fetchMetrics,
    refreshData,
    clearData,
    clearErrors,
    startAutoRefresh,
    stopAutoRefresh,
    setAutoRefreshEnabled,
  } = useDashboardStore();

  const [autoRefresh, setAutoRefresh] = useState(true);

  // Clear data when business changes
  useEffect(() => {
    clearData();
  }, [selectedBusinessId, clearData]);

  // Load data when component mounts and business is selected
  useEffect(() => {
    if (selectedBusinessId) {
      console.log('📊 Dashboard mounted - loading data for business:', selectedBusinessId);
      fetchSummary();
      fetchMetrics();
    }
  }, [selectedBusinessId, fetchSummary, fetchMetrics]);

  // Handle auto-refresh when component mounts/unmounts
  useEffect(() => {
    if (selectedBusinessId && autoRefresh) {
      console.log('📊 Dashboard page opened - starting auto-refresh');
      startAutoRefresh();
    }

    // Cleanup: stop auto-refresh when component unmounts
    return () => {
      console.log('📊 Dashboard page closed - stopping auto-refresh');
      stopAutoRefresh();
    };
  }, [selectedBusinessId, autoRefresh, startAutoRefresh, stopAutoRefresh]);

  // Sync local auto-refresh state with store
  useEffect(() => {
    setAutoRefreshEnabled(autoRefresh);
  }, [autoRefresh, setAutoRefreshEnabled]);

  const handleRefresh = () => {
    clearErrors();
    refreshData();
  };

  const handleAutoRefreshToggle = (enabled: boolean) => {
    setAutoRefresh(enabled);
    console.log(`📊 Auto-refresh ${enabled ? 'enabled' : 'disabled'} by user`);
  };

  // Prepare chart data
  const messageChartData = messageTrends.map((trend) => ({
    date: trend.date,
    value: trend.total_messages,
    label: `${trend.total_messages} mensajes`,
  }));

  const conversationChartData = conversationTrends.map((trend) => ({
    date: trend.date,
    value: trend.total_conversations,
    label: `${trend.total_conversations} conversaciones`,
  }));

  // Calculate growth percentages
  const getGrowthPercentage = (current: number, previous: number) => {
    if (previous === 0) return current > 0 ? '+100%' : '0%';
    const growth = ((current - previous) / previous) * 100;
    return `${growth >= 0 ? '+' : ''}${growth.toFixed(1)}%`;
  };

  const getGrowthType = (
    current: number,
    previous: number,
  ): 'positive' | 'negative' | 'neutral' => {
    if (previous === 0) return current > 0 ? 'positive' : 'neutral';
    return current > previous ? 'positive' : current < previous ? 'negative' : 'neutral';
  };

  // Calculate some derived metrics
  const totalMessages = basicData ? basicData.client_messages + basicData.business_messages : 0;
  const totalChannels = basicData
    ? basicData.whatsapp_channels + basicData.widget_channels + basicData.instagram_channels
    : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Panel de Control</h1>
          <p className="text-gray-600">
            Resumen de la actividad de tu negocio
            {lastUpdated && (
              <span className="ml-2 text-sm text-gray-500">
                • Actualizado {new Date(lastUpdated).toLocaleTimeString('es-ES')}
              </span>
            )}
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <label className="flex items-center space-x-2 text-sm text-gray-600">
            <input
              type="checkbox"
              checked={autoRefresh}
              onChange={(e) => handleAutoRefreshToggle(e.target.checked)}
              className="rounded border-gray-300 text-primary focus:ring-primary"
            />
            <span>Auto-actualizar</span>
            {isAutoRefreshEnabled && (
              <span className="inline-flex items-center px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-medium">
                Activo
              </span>
            )}
          </label>

          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Actualizar
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={clearErrors} className="text-red-500 hover:text-red-700">
            ×
          </button>
        </div>
      )}

      {/* Main Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Conversaciones Hoy"
          value={basicData?.conversations_today || 0}
          change={
            basicData
              ? getGrowthPercentage(
                  basicData.conversations_today,
                  basicData.conversations_this_week - basicData.conversations_today,
                )
              : undefined
          }
          changeType={
            basicData
              ? getGrowthType(
                  basicData.conversations_today,
                  basicData.conversations_this_week - basicData.conversations_today,
                )
              : 'neutral'
          }
          icon={MessageSquare}
          iconColor="text-blue-600"
          isLoading={isLoading}
        />

        <StatCard
          title="Total Conversaciones"
          value={basicData?.total_conversations || 0}
          subtitle="Todas las conversaciones"
          icon={Users}
          iconColor="text-green-600"
          isLoading={isLoading}
        />

        <StatCard
          title="Mensajes Totales"
          value={formatNumber(totalMessages)}
          subtitle={`${formatNumber(basicData?.client_messages || 0)} clientes • ${formatNumber(basicData?.business_messages || 0)} empresa`}
          icon={Activity}
          iconColor="text-purple-600"
          isLoading={isLoading}
        />

        <StatCard
          title="Tiempo de Respuesta"
          value={basicData ? formatResponseTime(basicData.avg_response_time_seconds) : '0s'}
          subtitle="Promedio de respuesta"
          icon={Clock}
          iconColor="text-amber-600"
          isLoading={isLoading}
        />
      </div>

      {/* Secondary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Clientes Activos"
          value={basicData?.active_clients || 0}
          icon={Target}
          iconColor="text-indigo-600"
          isLoading={isLoading}
        />

        <StatCard
          title="Canales Activos"
          value={totalChannels}
          subtitle={`${basicData?.whatsapp_channels || 0} WhatsApp • ${basicData?.widget_channels || 0} Web • ${basicData?.instagram_channels || 0} Instagram`}
          icon={Globe}
          iconColor="text-teal-600"
          isLoading={isLoading}
        />

        <StatCard
          title="Tasa de Respuesta"
          value={metrics ? formatPercentage(metrics.response_rate_percent) : '0%'}
          change={
            metrics
              ? `${formatPercentage(metrics.conversation_growth_percent)} crecimiento`
              : undefined
          }
          changeType={metrics && metrics.conversation_growth_percent > 0 ? 'positive' : 'neutral'}
          icon={Zap}
          iconColor="text-rose-600"
          isLoading={isLoading}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Messages Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Tendencia de Mensajes</h2>
              <p className="text-sm text-gray-600">Últimos 7 días</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-primary rounded-full"></div>
              <span className="text-sm text-gray-600">Mensajes totales</span>
            </div>
          </div>

          <SimpleChart data={messageChartData} height={250} color="#3B82F6" isLoading={isLoading} />

          {messageTrends.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Promedio diario:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {Math.round(
                    messageTrends.reduce((sum, day) => sum + day.total_messages, 0) /
                      messageTrends.length,
                  )}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Pico máximo:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {Math.max(...messageTrends.map((day) => day.total_messages))}
                </span>
              </div>
            </div>
          )}
        </div>

        {/* Conversations Trend */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Nuevas Conversaciones</h2>
              <p className="text-sm text-gray-600">Últimos 30 días</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-sm text-gray-600">Conversaciones</span>
            </div>
          </div>

          <SimpleChart
            data={conversationChartData}
            height={250}
            color="#10B981"
            isLoading={isLoading}
          />

          {conversationTrends.length > 0 && (
            <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Promedio diario:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {Math.round(
                    conversationTrends.reduce((sum, day) => sum + day.total_conversations, 0) /
                      conversationTrends.length,
                  )}
                </span>
              </div>
              <div>
                <span className="text-gray-600">Total del mes:</span>
                <span className="ml-2 font-semibold text-gray-900">
                  {conversationTrends.reduce((sum, day) => sum + day.total_conversations, 0)}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Channels and Top Conversations */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Channel Stats */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Estadísticas por Canal</h2>
                <p className="text-sm text-gray-600">Rendimiento de cada canal de comunicación</p>
              </div>
            </div>

            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <ChannelCard key={i} channel={{} as any} isLoading={true} />
                ))}
              </div>
            ) : channelStats.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Globe className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p>No hay datos de canales disponibles</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {channelStats.map((channel, index) => (
                  <ChannelCard key={index} channel={channel} />
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Top Conversations */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Conversaciones Activas</h2>
              <p className="text-sm text-gray-600">Las más activas</p>
            </div>
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="animate-pulse">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 bg-gray-200 rounded-full"></div>
                    <div className="flex-1">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-1"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : topConversations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MessageSquare className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No hay conversaciones activas</p>
            </div>
          ) : (
            <div className="space-y-4">
              {topConversations.map((conversation, index) => (
                <div
                  key={conversation.thread_id}
                  className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-shrink-0">
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                        conversation.contact_type.toLowerCase() === 'whatsapp'
                          ? 'bg-green-500'
                          : conversation.contact_type.toLowerCase() === 'instagram'
                            ? 'bg-pink-500'
                            : 'bg-blue-500'
                      }`}
                    >
                      {index + 1}
                    </div>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {conversation.contact_id}
                      </p>
                      <span className="text-xs text-gray-500">
                        {conversation.message_count} msgs
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <p className="text-xs text-gray-500">{conversation.contact_type}</p>
                      <p className="text-xs text-gray-500">
                        {conversation.conversation_days}d activa
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Additional Metrics */}
      {metrics && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Métricas Adicionales</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-primary mb-1">
                {metrics.active_conversations}
              </div>
              <div className="text-sm text-gray-600">Conversaciones Activas</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {metrics.avg_messages_per_conversation.toFixed(1)}
              </div>
              <div className="text-sm text-gray-600">Mensajes por Conversación</div>
            </div>

            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {formatPercentage(metrics.response_rate_percent)}
              </div>
              <div className="text-sm text-gray-600">Tasa de Respuesta</div>
            </div>

            <div className="text-center">
              <div
                className={`text-2xl font-bold mb-1 ${
                  metrics.conversation_growth_percent >= 0 ? 'text-green-600' : 'text-red-600'
                }`}
              >
                {metrics.conversation_growth_percent >= 0 ? '+' : ''}
                {formatPercentage(metrics.conversation_growth_percent)}
              </div>
              <div className="text-sm text-gray-600">Crecimiento de Conversaciones</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardPage;
