import { useEffect, useState } from 'react';
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  FormControlLabel,
  Grid,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Switch,
  Typography,
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from '../../components/base/IconifyIcon';
import ChannelCard from '../../components/letparley/dashboard/ChannelCard';
import SimpleChart from '../../components/letparley/dashboard/SimpleChart';
import StatCard from '../../components/letparley/dashboard/StatCard';
import { useLetParleyAuth } from '../../providers/LetParleyAuthProvider';
import { useLetParleyDashboard } from '../../providers/LetParleyDashboardProvider';
import {
  formatNumber,
  formatPercentage,
  formatResponseTime,
  getChannelColor,
  getChannelIcon,
} from '../../services/letparley/dashboardService';

const DashboardPage = () => {
  const theme = useTheme();
  const [autoRefresh, setAutoRefresh] = useState(true);
  const { authContext } = useLetParleyAuth();

  const {
    // Data
    basicData,
    messageTrends,
    conversationTrends,
    channelStats,
    topConversations,
    metrics,

    // Loading states
    isLoading,

    // Error states
    error,

    // Metadata
    lastUpdated,
    isAutoRefreshEnabled,

    // Actions
    fetchSummary,
    fetchMetrics,
    refreshData,
    clearErrors,
    toggleAutoRefresh,
  } = useLetParleyDashboard();

  // Load data when component mounts
  useEffect(() => {
    if (authContext?.selectedBusinessId) {
      console.log(
        '📊 Dashboard mounted - loading data for business:',
        authContext.selectedBusinessId,
      );
      fetchSummary();
      fetchMetrics();
    }
  }, [authContext?.selectedBusinessId]); // Remove function dependencies

  // Handle auto-refresh
  useEffect(() => {
    toggleAutoRefresh(autoRefresh);
  }, [autoRefresh]); // Remove function dependency

  const handleRefresh = () => {
    clearErrors();
    refreshData();
  };

  const handleAutoRefreshToggle = (event) => {
    setAutoRefresh(event.target.checked);
  };

  // Prepare chart data
  const messageChartData = messageTrends.map((trend) => ({
    x: trend.date,
    y: trend.total_messages,
    label: `${trend.total_messages} mensajes`,
  }));

  const conversationChartData = conversationTrends.map((trend) => ({
    x: trend.date,
    y: trend.total_conversations,
    label: `${trend.total_conversations} conversaciones`,
  }));

  // Calculate derived metrics
  const totalMessages = basicData ? basicData.client_messages + basicData.business_messages : 0;
  const totalChannels = basicData
    ? basicData.whatsapp_channels + basicData.widget_channels + basicData.instagram_channels
    : 0;

  return (
    <Box sx={{ p: 3 }}>
      {/* Header */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
          <Box>
            <Typography
              variant="h4"
              sx={{ fontWeight: 700, color: theme.palette.text.primary, mb: 1 }}
            >
              Panel de Control
            </Typography>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography variant="body2" color="text.secondary">
                Resumen de la actividad de tu negocio
              </Typography>
              {lastUpdated && (
                <>
                  <Typography variant="body2" color="text.disabled">
                    •
                  </Typography>
                  <Typography variant="body2" color="text.disabled">
                    Actualizado {new Date(lastUpdated).toLocaleTimeString('es-ES')}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <FormControlLabel
              control={
                <Switch checked={autoRefresh} onChange={handleAutoRefreshToggle} size="small" />
              }
              label={
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Typography variant="body2" color="text.secondary">
                    Auto-actualizar
                  </Typography>
                  {isAutoRefreshEnabled && (
                    <Chip
                      label="Activo"
                      size="small"
                      color="success"
                      variant="outlined"
                      sx={{ height: 20, fontSize: '0.7rem' }}
                    />
                  )}
                </Box>
              }
            />

            <Button
              variant="contained"
              startIcon={
                <IconifyIcon
                  icon="solar:refresh-outline"
                  sx={{
                    fontSize: 18,
                    ...(isLoading && {
                      animation: 'spin 1s linear infinite',
                      '@keyframes spin': {
                        '0%': { transform: 'rotate(0deg)' },
                        '100%': { transform: 'rotate(360deg)' },
                      },
                    }),
                  }}
                />
              }
              onClick={handleRefresh}
              disabled={isLoading}
              sx={{ borderRadius: 2 }}
            >
              Actualizar
            </Button>
          </Box>
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert severity="error" onClose={clearErrors} sx={{ borderRadius: 2 }}>
            {error}
          </Alert>
        )}
      </Box>

      {/* Main Stats Grid */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Conversaciones Hoy"
            value={basicData?.conversations_today || 0}
            icon="solar:chat-round-outline"
            iconColor="primary"
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Conversaciones"
            value={basicData?.total_conversations || 0}
            subtitle="Todas las conversaciones"
            icon="solar:users-group-rounded-outline"
            iconColor="success"
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Mensajes Totales"
            value={formatNumber(totalMessages)}
            subtitle={`${formatNumber(basicData?.client_messages || 0)} clientes • ${formatNumber(basicData?.business_messages || 0)} empresa`}
            icon="solar:chat-dots-outline"
            iconColor="info"
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Tiempo de Respuesta"
            value={basicData ? formatResponseTime(basicData.avg_response_time_seconds) : '0s'}
            subtitle="Promedio de respuesta"
            icon="solar:clock-circle-outline"
            iconColor="warning"
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Secondary Stats */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={4}>
          <StatCard
            title="Clientes Activos"
            value={basicData?.active_clients || 0}
            icon="solar:user-check-outline"
            iconColor="secondary"
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Canales Activos"
            value={totalChannels}
            subtitle={`${basicData?.whatsapp_channels || 0} WhatsApp • ${basicData?.widget_channels || 0} Web • ${basicData?.instagram_channels || 0} Instagram`}
            icon="solar:global-outline"
            iconColor="info"
            isLoading={isLoading}
          />
        </Grid>

        <Grid item xs={12} md={4}>
          <StatCard
            title="Tasa de Respuesta"
            value={metrics ? formatPercentage(metrics.response_rate_percent) : '0%'}
            change={
              metrics
                ? `${formatPercentage(metrics.conversation_growth_percent)} crecimiento`
                : undefined
            }
            changeType={metrics && metrics.conversation_growth_percent > 0 ? 'positive' : 'neutral'}
            icon="solar:chart-2-outline"
            iconColor="error"
            isLoading={isLoading}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Messages Trend */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Tendencia de Mensajes
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Últimos 7 días
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.primary.main,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Mensajes totales
                  </Typography>
                </Box>
              </Box>

              <SimpleChart
                data={messageChartData}
                height={200}
                color={theme.palette.primary.main}
                isLoading={isLoading}
              />

              {messageTrends.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Promedio diario
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {Math.round(
                        messageTrends.reduce((sum, day) => sum + day.total_messages, 0) /
                          messageTrends.length,
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Pico máximo
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {Math.max(...messageTrends.map((day) => day.total_messages))}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>

        {/* Conversations Trend */}
        <Grid item xs={12} lg={6}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 3,
                }}
              >
                <Box>
                  <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                    Nuevas Conversaciones
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Últimos 30 días
                  </Typography>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 12,
                      height: 12,
                      borderRadius: '50%',
                      backgroundColor: theme.palette.success.main,
                    }}
                  />
                  <Typography variant="caption" color="text.secondary">
                    Conversaciones
                  </Typography>
                </Box>
              </Box>

              <SimpleChart
                data={conversationChartData}
                height={200}
                color={theme.palette.success.main}
                isLoading={isLoading}
              />

              {conversationTrends.length > 0 && (
                <Box sx={{ mt: 3, display: 'flex', justifyContent: 'space-around' }}>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Promedio diario
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {Math.round(
                        conversationTrends.reduce((sum, day) => sum + day.total_conversations, 0) /
                          conversationTrends.length,
                      )}
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'center' }}>
                    <Typography variant="body2" color="text.secondary">
                      Total del mes
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                      {conversationTrends.reduce((sum, day) => sum + day.total_conversations, 0)}
                    </Typography>
                  </Box>
                </Box>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Channels and Top Conversations */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {/* Channel Stats */}
        <Grid item xs={12} lg={8}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Estadísticas por Canal
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Rendimiento de cada canal de comunicación
              </Typography>

              <Grid container spacing={2}>
                {isLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <ChannelCard channel={{}} isLoading={true} />
                    </Grid>
                  ))
                ) : channelStats.length === 0 ? (
                  <Grid item xs={12}>
                    <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                      <IconifyIcon
                        icon="solar:global-outline"
                        sx={{ fontSize: 48, mb: 2, opacity: 0.3 }}
                      />
                      <Typography>No hay datos de canales disponibles</Typography>
                    </Box>
                  </Grid>
                ) : (
                  channelStats.map((channel, index) => (
                    <Grid item xs={12} md={6} key={index}>
                      <ChannelCard channel={channel} />
                    </Grid>
                  ))
                )}
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        {/* Top Conversations */}
        <Grid item xs={12} lg={4}>
          <Card sx={{ borderRadius: 2, height: '100%' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                Conversaciones Activas
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Las más activas
              </Typography>

              {isLoading ? (
                <List sx={{ py: 0 }}>
                  {Array.from({ length: 5 }).map((_, index) => (
                    <ListItem key={index} sx={{ px: 0 }}>
                      <ListItemAvatar>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            borderRadius: '50%',
                            backgroundColor: 'grey.200',
                          }}
                        />
                      </ListItemAvatar>
                      <ListItemText
                        primary={
                          <Box
                            sx={{
                              width: '60%',
                              height: 16,
                              backgroundColor: 'grey.200',
                              borderRadius: 1,
                            }}
                          />
                        }
                        secondary={
                          <Box
                            sx={{
                              width: '40%',
                              height: 12,
                              backgroundColor: 'grey.100',
                              borderRadius: 1,
                              mt: 1,
                            }}
                          />
                        }
                      />
                    </ListItem>
                  ))}
                </List>
              ) : topConversations.length === 0 ? (
                <Box sx={{ textAlign: 'center', py: 4, color: 'text.secondary' }}>
                  <IconifyIcon
                    icon="solar:chat-round-outline"
                    sx={{ fontSize: 48, mb: 2, opacity: 0.3 }}
                  />
                  <Typography>No hay conversaciones activas</Typography>
                </Box>
              ) : (
                <List sx={{ py: 0 }}>
                  {topConversations.map((conversation, index) => {
                    const channelColor = getChannelColor(conversation.contact_type);
                    const channelIcon = getChannelIcon(conversation.contact_type);

                    return (
                      <ListItem key={conversation.thread_id} sx={{ px: 0, py: 1 }}>
                        <ListItemAvatar>
                          <Avatar
                            sx={{
                              bgcolor: `${channelColor}.main`,
                              width: 32,
                              height: 32,
                              fontSize: '0.8rem',
                              fontWeight: 600,
                            }}
                          >
                            {index + 1}
                          </Avatar>
                        </ListItemAvatar>
                        <ListItemText
                          primary={
                            <Typography variant="body2" sx={{ fontWeight: 500 }}>
                              {conversation.contact_id}
                            </Typography>
                          }
                          secondary={
                            <Box
                              sx={{
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                mt: 0.5,
                              }}
                            >
                              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                                <IconifyIcon icon={channelIcon} sx={{ fontSize: 14 }} />
                                <Typography variant="caption" color="text.secondary">
                                  {conversation.contact_type}
                                </Typography>
                              </Box>
                              <Typography variant="caption" color="text.secondary">
                                {conversation.message_count} msgs
                              </Typography>
                            </Box>
                          }
                        />
                      </ListItem>
                    );
                  })}
                </List>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Additional Metrics */}
      {metrics && (
        <Card sx={{ borderRadius: 2 }}>
          <CardContent sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
              Métricas Adicionales
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main', mb: 1 }}>
                    {metrics.active_conversations}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Conversaciones Activas
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main', mb: 1 }}>
                    {metrics.avg_messages_per_conversation.toFixed(1)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Mensajes por Conversación
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography variant="h4" sx={{ fontWeight: 700, color: 'info.main', mb: 1 }}>
                    {formatPercentage(metrics.response_rate_percent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Tasa de Respuesta
                  </Typography>
                </Box>
              </Grid>

              <Grid item xs={6} md={3}>
                <Box sx={{ textAlign: 'center' }}>
                  <Typography
                    variant="h4"
                    sx={{
                      fontWeight: 700,
                      color:
                        metrics.conversation_growth_percent >= 0 ? 'success.main' : 'error.main',
                      mb: 1,
                    }}
                  >
                    {metrics.conversation_growth_percent >= 0 ? '+' : ''}
                    {formatPercentage(metrics.conversation_growth_percent)}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    Crecimiento de Conversaciones
                  </Typography>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default DashboardPage;
