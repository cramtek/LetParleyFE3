import { Box, Card, CardContent, Chip, LinearProgress, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { getChannelColor, getChannelIcon } from '../../../services/letparley/dashboardService';
import IconifyIcon from '../../base/IconifyIcon';

const ChannelCard = ({ channel, isLoading = false }) => {
  const theme = useTheme();

  if (isLoading) {
    return (
      <Card
        sx={{
          p: 2,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          height: '100%',
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Box
              sx={{
                width: 40,
                height: 40,
                borderRadius: '50%',
                backgroundColor: theme.palette.grey[200],
                mr: 2,
              }}
            />
            <Box sx={{ flex: 1 }}>
              <Box
                sx={{
                  width: '60%',
                  height: 16,
                  backgroundColor: theme.palette.grey[200],
                  borderRadius: 1,
                  mb: 1,
                }}
              />
              <Box
                sx={{
                  width: '40%',
                  height: 12,
                  backgroundColor: theme.palette.grey[100],
                  borderRadius: 1,
                }}
              />
            </Box>
          </Box>

          <Box sx={{ mb: 2 }}>
            <Box
              sx={{
                width: '80%',
                height: 20,
                backgroundColor: theme.palette.grey[200],
                borderRadius: 1,
                mb: 1,
              }}
            />
            <Box
              sx={{
                width: '100%',
                height: 4,
                backgroundColor: theme.palette.grey[100],
                borderRadius: 2,
              }}
            />
          </Box>

          <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
            <Box
              sx={{
                width: '30%',
                height: 12,
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1,
              }}
            />
            <Box
              sx={{
                width: '30%',
                height: 12,
                backgroundColor: theme.palette.grey[100],
                borderRadius: 1,
              }}
            />
          </Box>
        </CardContent>
      </Card>
    );
  }

  const iconName = getChannelIcon(channel.contact_type);
  const colorVariant = getChannelColor(channel.contact_type);

  const getColorFromVariant = (variant) => {
    switch (variant) {
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'primary':
        return theme.palette.primary.main;
      default:
        return theme.palette.grey[500];
    }
  };

  const channelColor = getColorFromVariant(colorVariant);
  const progress =
    channel.total_conversations > 0
      ? (channel.conversations_today / channel.total_conversations) * 100
      : 0;

  return (
    <Card
      sx={{
        p: 2,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        transition: 'all 0.3s ease-in-out',
        height: '100%',
        '&:hover': {
          boxShadow: theme.shadows[3],
          transform: 'translateY(-1px)',
        },
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Header with channel icon and name */}
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box
            sx={{
              width: 40,
              height: 40,
              borderRadius: '50%',
              backgroundColor: alpha(channelColor, 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              mr: 2,
            }}
          >
            <IconifyIcon
              icon={iconName}
              sx={{
                fontSize: 20,
                color: channelColor,
              }}
            />
          </Box>

          <Box sx={{ flex: 1 }}>
            <Typography
              variant="subtitle2"
              sx={{
                fontWeight: 600,
                textTransform: 'capitalize',
                color: theme.palette.text.primary,
              }}
            >
              {channel.contact_type}
            </Typography>
            <Chip
              label={`${channel.total_conversations} conversaciones`}
              size="small"
              variant="outlined"
              sx={{
                height: 20,
                fontSize: '0.7rem',
                borderColor: alpha(channelColor, 0.3),
                color: channelColor,
              }}
            />
          </Box>
        </Box>

        {/* Progress section */}
        <Box sx={{ mb: 2 }}>
          <Box
            sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}
          >
            <Typography variant="body2" color="text.secondary">
              Actividad hoy
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: channelColor }}>
              {channel.conversations_today}
            </Typography>
          </Box>

          <LinearProgress
            variant="determinate"
            value={Math.min(progress, 100)}
            sx={{
              height: 6,
              borderRadius: 3,
              backgroundColor: alpha(channelColor, 0.1),
              '& .MuiLinearProgress-bar': {
                backgroundColor: channelColor,
                borderRadius: 3,
              },
            }}
          />
        </Box>

        {/* Stats */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
              Esta semana
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {channel.conversations_this_week}
            </Typography>
          </Box>

          <Box sx={{ textAlign: 'center' }}>
            <Typography variant="caption" color="text.disabled" sx={{ display: 'block' }}>
              Mensajes
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 600, color: theme.palette.text.primary }}>
              {channel.total_messages}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ChannelCard;
