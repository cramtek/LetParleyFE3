import { Box, CircularProgress, Typography, alpha } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const LoadingScreen = ({ message = 'Cargando...' }) => {
  const theme = useTheme();

  return (
    <Box
      sx={{
        minHeight: '100vh',
        background: `linear-gradient(135deg, ${alpha(theme.palette.primary.main, 0.08)} 0%, ${alpha(theme.palette.background.default, 1)} 50%, ${alpha(theme.palette.secondary.main, 0.08)} 100%)`,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 2,
      }}
    >
      {/* Logo */}
      <Box
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: 80,
          height: 80,
          borderRadius: 3,
          background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
          mb: 3,
          boxShadow: theme.shadows[4],
          animation: 'pulse 2s ease-in-out infinite',
          '@keyframes pulse': {
            '0%': { transform: 'scale(1)' },
            '50%': { transform: 'scale(1.05)' },
            '100%': { transform: 'scale(1)' },
          },
        }}
      >
        <Typography variant="h3" sx={{ color: 'white', fontWeight: 700 }}>
          LP
        </Typography>
      </Box>

      {/* Loading Spinner */}
      <CircularProgress
        size={40}
        thickness={4}
        sx={{
          color: theme.palette.primary.main,
          mb: 2,
          animation: 'spin 1s linear infinite',
          '@keyframes spin': {
            '0%': { transform: 'rotate(0deg)' },
            '100%': { transform: 'rotate(360deg)' },
          },
        }}
      />

      {/* Message */}
      <Typography
        variant="body1"
        sx={{
          color: theme.palette.text.secondary,
          textAlign: 'center',
          maxWidth: 300,
        }}
      >
        {message}
      </Typography>
    </Box>
  );
};

export default LoadingScreen;
