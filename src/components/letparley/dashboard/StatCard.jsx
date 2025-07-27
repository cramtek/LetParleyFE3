import { Box, Card, CardContent, Chip, Skeleton, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';
import IconifyIcon from '../../base/IconifyIcon';

const StatCard = ({
  title,
  value,
  subtitle,
  icon,
  iconColor = 'primary',
  change,
  changeType = 'neutral',
  isLoading = false,
  lastUpdated,
}) => {
  const theme = useTheme();

  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return theme.palette.success.main;
      case 'negative':
        return theme.palette.error.main;
      default:
        return theme.palette.text.secondary;
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return 'solar:arrow-up-outline';
      case 'negative':
        return 'solar:arrow-down-outline';
      default:
        return 'solar:arrow-right-outline';
    }
  };

  const getIconColorValue = () => {
    switch (iconColor) {
      case 'primary':
        return theme.palette.primary.main;
      case 'secondary':
        return theme.palette.secondary.main;
      case 'success':
        return theme.palette.success.main;
      case 'error':
        return theme.palette.error.main;
      case 'warning':
        return theme.palette.warning.main;
      case 'info':
        return theme.palette.info.main;
      default:
        return theme.palette.primary.main;
    }
  };

  if (isLoading) {
    return (
      <Card
        sx={{
          p: 3,
          borderRadius: 2,
          boxShadow: theme.shadows[1],
          transition: 'all 0.3s ease-in-out',
          '&:hover': {
            boxShadow: theme.shadows[4],
            transform: 'translateY(-2px)',
          },
        }}
      >
        <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
          <Box
            sx={{
              display: 'flex',
              alignItems: 'flex-start',
              justifyContent: 'space-between',
              mb: 2,
            }}
          >
            <Skeleton variant="rounded" width={48} height={48} />
            <Skeleton variant="rounded" width={80} height={24} />
          </Box>

          <Box sx={{ mb: 1 }}>
            <Skeleton variant="text" width="60%" height={40} />
          </Box>

          <Skeleton variant="text" width="80%" height={20} />
          <Skeleton variant="text" width="70%" height={16} sx={{ mt: 1 }} />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card
      sx={{
        p: 3,
        borderRadius: 2,
        boxShadow: theme.shadows[1],
        transition: 'all 0.3s ease-in-out',
        position: 'relative',
        overflow: 'visible',
        '&:hover': {
          boxShadow: theme.shadows[4],
          transform: 'translateY(-2px)',
        },
      }}
    >
      <CardContent sx={{ p: 0, '&:last-child': { pb: 0 } }}>
        {/* Header with icon and change indicator */}
        <Box
          sx={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', mb: 2 }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              borderRadius: 2,
              backgroundColor: alpha(getIconColorValue(), 0.1),
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <IconifyIcon
              icon={icon}
              sx={{
                fontSize: 24,
                color: getIconColorValue(),
              }}
            />
          </Box>

          {change && (
            <Chip
              icon={<IconifyIcon icon={getChangeIcon()} sx={{ fontSize: 14 }} />}
              label={change}
              size="small"
              sx={{
                backgroundColor: alpha(getChangeColor(), 0.1),
                color: getChangeColor(),
                fontWeight: 600,
                '& .MuiChip-icon': {
                  color: getChangeColor(),
                },
              }}
            />
          )}
        </Box>

        {/* Main value */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 700,
            color: theme.palette.text.primary,
            mb: 0.5,
            lineHeight: 1.2,
          }}
        >
          {typeof value === 'number' ? value.toLocaleString() : value}
        </Typography>

        {/* Title */}
        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: subtitle ? 0.5 : 0,
          }}
        >
          {title}
        </Typography>

        {/* Subtitle */}
        {subtitle && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              display: 'block',
            }}
          >
            {subtitle}
          </Typography>
        )}

        {/* Last updated */}
        {lastUpdated && (
          <Typography
            variant="caption"
            sx={{
              color: theme.palette.text.disabled,
              display: 'block',
              mt: 1,
            }}
          >
            Actualizado:{' '}
            {new Date(lastUpdated).toLocaleTimeString('es-ES', {
              hour: '2-digit',
              minute: '2-digit',
            })}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default StatCard;
