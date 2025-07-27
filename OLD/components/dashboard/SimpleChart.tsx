import { useMemo } from 'react';

interface ChartDataPoint {
  date: string;
  value: number;
  label?: string;
}

interface SimpleChartProps {
  data: ChartDataPoint[];
  height?: number;
  color?: string;
  showDots?: boolean;
  showGrid?: boolean;
  isLoading?: boolean;
}

const SimpleChart = ({
  data,
  height = 200,
  color = '#3B82F6',
  showDots = true,
  showGrid = true,
  isLoading = false,
}: SimpleChartProps) => {
  const { points, maxValue, minValue, svgWidth, svgHeight } = useMemo(() => {
    if (!data || data.length === 0) {
      return { points: [], maxValue: 0, minValue: 0, svgWidth: 400, svgHeight: height };
    }

    const values = data.map((d) => d.value);
    const max = Math.max(...values);
    const min = Math.min(...values);

    // Add padding to the chart
    const range = max - min;
    const padding = range > 0 ? range * 0.15 : max > 0 ? max * 0.15 : 1;
    const adjustedMax = max + padding;
    const adjustedMin = Math.max(0, min - padding);

    // Fixed SVG dimensions
    const svgWidth = 400;
    const svgHeight = height;
    const chartPadding = 40;
    const chartWidth = svgWidth - chartPadding * 2;
    const chartHeight = svgHeight - 80; // Space for labels

    const points = data.map((point, index) => {
      // Calculate X position
      const x =
        data.length === 1 ? svgWidth / 2 : chartPadding + (index / (data.length - 1)) * chartWidth;

      // Calculate Y position
      const y =
        adjustedMax === adjustedMin
          ? svgHeight / 2
          : chartPadding +
            (chartHeight -
              ((point.value - adjustedMin) / (adjustedMax - adjustedMin)) * chartHeight);

      return { x, y, ...point };
    });

    return { points, maxValue: adjustedMax, minValue: adjustedMin, svgWidth, svgHeight };
  }, [data, height]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center" style={{ height }}>
        <div className="animate-pulse flex space-x-4 w-full">
          <div className="flex-1 space-y-2">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center text-gray-500" style={{ height }}>
        No hay datos disponibles
      </div>
    );
  }

  // Create SVG path for line
  const pathData = points
    .map((point, index) => {
      const command = index === 0 ? 'M' : 'L';
      return `${command} ${point.x} ${point.y}`;
    })
    .join(' ');

  // Create area path for gradient fill
  const areaPath = `${pathData} L ${points[points.length - 1].x} ${svgHeight - 40} L ${points[0].x} ${svgHeight - 40} Z`;

  // Format date for display
  const formatDateLabel = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Generate unique gradient ID
  const gradientId = `chartGradient-${Math.random().toString(36).substr(2, 9)}`;

  return (
    <div className="relative w-full" style={{ height }}>
      <svg
        width="100%"
        height="100%"
        viewBox={`0 0 ${svgWidth} ${svgHeight}`}
        preserveAspectRatio="xMidYMid meet"
        className="overflow-visible"
      >
        {/* Grid lines */}
        {showGrid && (
          <g className="opacity-20">
            {[0, 25, 50, 75, 100].map((percentage) => {
              const y = 40 + (percentage / 100) * (svgHeight - 80);
              return (
                <line
                  key={percentage}
                  x1="40"
                  y1={y}
                  x2={svgWidth - 40}
                  y2={y}
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
              );
            })}
          </g>
        )}

        {/* Gradient definition */}
        <defs>
          <linearGradient id={gradientId} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={color} stopOpacity="0.3" />
            <stop offset="100%" stopColor={color} stopOpacity="0.05" />
          </linearGradient>
        </defs>

        {/* Area fill */}
        {points.length > 1 && (
          <path d={areaPath} fill={`url(#${gradientId})`} className="transition-all duration-300" />
        )}

        {/* Line */}
        {points.length > 1 ? (
          <path
            d={pathData}
            fill="none"
            stroke={color}
            strokeWidth="3"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-all duration-300"
          />
        ) : (
          // Single point - show as a circle
          <circle
            cx={points[0].x}
            cy={points[0].y}
            r="6"
            fill={color}
            className="transition-all duration-300"
          />
        )}

        {/* Data points */}
        {showDots &&
          points.map((point, index) => (
            <g key={index}>
              <circle
                cx={point.x}
                cy={point.y}
                r="5"
                fill="white"
                stroke={color}
                strokeWidth="3"
                className="transition-all duration-300 hover:r-6"
              />
              {/* Tooltip on hover */}
              <title>{`${formatDateLabel(point.date)}: ${point.value} mensajes`}</title>
            </g>
          ))}

        {/* Date labels */}
        {points.map((point, index) => (
          <text
            key={index}
            x={point.x}
            y={svgHeight - 10}
            textAnchor="middle"
            className="text-xs fill-gray-500"
            fontSize="12"
          >
            {formatDateLabel(point.date)}
          </text>
        ))}
      </svg>
    </div>
  );
};

export default SimpleChart;
