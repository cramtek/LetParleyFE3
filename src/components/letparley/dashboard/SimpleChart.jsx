import { useMemo } from 'react';
import { Box, Skeleton } from '@mui/material';
import { useTheme } from '@mui/material/styles';

const SimpleChart = ({ data = [], height = 200, color, isLoading = false }) => {
  const theme = useTheme();

  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];

    const maxValue = Math.max(...data.map((d) => d.y || d.value || 0));
    const minValue = Math.min(...data.map((d) => d.y || d.value || 0));
    const range = maxValue - minValue || 1;

    return data.map((point, index) => {
      const value = point.y || point.value || 0;
      const normalizedHeight = range > 0 ? ((value - minValue) / range) * 0.8 + 0.1 : 0.5;

      return {
        ...point,
        normalizedHeight,
        index,
      };
    });
  }, [data]);

  const chartColor = color || theme.palette.primary.main;

  if (isLoading) {
    return (
      <Box sx={{ height, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Skeleton variant="rounded" width="100%" height="80%" sx={{ borderRadius: 2 }} />
      </Box>
    );
  }

  if (!chartData || chartData.length === 0) {
    return (
      <Box
        sx={{
          height,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: theme.palette.grey[50],
          borderRadius: 2,
          border: `1px dashed ${theme.palette.grey[300]}`,
        }}
      >
        <Box sx={{ textAlign: 'center', color: theme.palette.text.disabled }}>
          No hay datos disponibles
        </Box>
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height,
        position: 'relative',
        overflow: 'hidden',
        borderRadius: 1,
      }}
    >
      <svg
        width="100%"
        height="100%"
        viewBox="0 0 100 100"
        preserveAspectRatio="none"
        style={{ display: 'block' }}
      >
        {/* Grid lines */}
        <defs>
          <pattern id="grid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path
              d="M 10 0 L 0 0 0 10"
              fill="none"
              stroke={theme.palette.grey[200]}
              strokeWidth="0.2"
            />
          </pattern>
        </defs>

        <rect width="100" height="100" fill="url(#grid)" />

        {/* Chart bars */}
        {chartData.map((point, index) => {
          const barWidth = 80 / chartData.length;
          const x = 10 + index * barWidth + barWidth * 0.1;
          const barHeight = point.normalizedHeight * 80;
          const y = 90 - barHeight;

          return (
            <rect
              key={index}
              x={x}
              y={y}
              width={barWidth * 0.8}
              height={barHeight}
              fill={chartColor}
              rx="1"
              opacity={0.8}
              style={{
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <title>{point.label || `${point.y || point.value}`}</title>
            </rect>
          );
        })}

        {/* Chart line */}
        <path
          d={`M ${10 + (80 / chartData.length) * 0.5} ${90 - chartData[0].normalizedHeight * 80} ${chartData
            .map((point, index) => {
              const x = 10 + index * (80 / chartData.length) + (80 / chartData.length) * 0.5;
              const y = 90 - point.normalizedHeight * 80;
              return `L ${x} ${y}`;
            })
            .join(' ')}`}
          fill="none"
          stroke={chartColor}
          strokeWidth="0.8"
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={0.9}
        />

        {/* Data points */}
        {chartData.map((point, index) => {
          const x = 10 + index * (80 / chartData.length) + (80 / chartData.length) * 0.5;
          const y = 90 - point.normalizedHeight * 80;

          return (
            <circle
              key={`point-${index}`}
              cx={x}
              cy={y}
              r="1"
              fill={chartColor}
              stroke="white"
              strokeWidth="0.5"
              style={{
                transition: 'all 0.3s ease-in-out',
              }}
            >
              <title>{point.label || `${point.y || point.value}`}</title>
            </circle>
          );
        })}
      </svg>

      {/* Hover overlay for better UX */}
      <Box
        sx={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'transparent',
          cursor: 'default',
        }}
      />
    </Box>
  );
};

export default SimpleChart;
