import { DivideIcon as LucideIcon } from 'lucide-react';
import { formatToUserTimezone } from '../../utils/timezone';

interface StatCardProps {
  title: string;
  value: string | number;
  change?: string;
  changeType?: 'positive' | 'negative' | 'neutral';
  icon: LucideIcon;
  iconColor?: string;
  isLoading?: boolean;
  subtitle?: string;
  lastUpdated?: string;
}

const StatCard = ({
  title,
  value,
  change,
  changeType = 'neutral',
  icon: Icon,
  iconColor = 'text-primary',
  isLoading = false,
  subtitle,
  lastUpdated,
}: StatCardProps) => {
  const getChangeColor = () => {
    switch (changeType) {
      case 'positive':
        return 'text-green-600';
      case 'negative':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getChangeIcon = () => {
    switch (changeType) {
      case 'positive':
        return '↗';
      case 'negative':
        return '↘';
      default:
        return '→';
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-lg bg-gray-50`}>
          <Icon className={`h-6 w-6 ${iconColor}`} />
        </div>
        {change && (
          <div className={`text-sm font-medium ${getChangeColor()} flex items-center`}>
            <span className="mr-1">{getChangeIcon()}</span>
            {change}
          </div>
        )}
      </div>

      <div className="space-y-1">
        {isLoading ? (
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        ) : (
          <>
            <div className="text-2xl font-bold text-gray-900">
              {typeof value === 'number' ? value.toLocaleString() : value}
            </div>
            <div className="text-sm text-gray-600">{title}</div>
            {subtitle && <div className="text-xs text-gray-500">{subtitle}</div>}
            {lastUpdated && (
              <div className="text-xs text-gray-400 mt-2">
                Actualizado:{' '}
                {formatToUserTimezone(lastUpdated, {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StatCard;
