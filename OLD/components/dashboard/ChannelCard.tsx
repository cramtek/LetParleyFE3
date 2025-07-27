import { getChannelColor, getChannelIcon } from '../../services/dashboardService';
import { ChannelStats } from '../../services/dashboardService';

interface ChannelCardProps {
  channel: ChannelStats;
  isLoading?: boolean;
}

const ChannelCard = ({ channel, isLoading = false }: ChannelCardProps) => {
  if (isLoading) {
    return (
      <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
        <div className="flex items-center space-x-3 mb-3">
          <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-20 mb-1"></div>
            <div className="h-3 bg-gray-200 rounded w-16"></div>
          </div>
        </div>
        <div className="space-y-2">
          <div className="h-3 bg-gray-200 rounded w-full"></div>
          <div className="h-3 bg-gray-200 rounded w-3/4"></div>
        </div>
      </div>
    );
  }

  const growthRate =
    channel.conversations_this_week > 0
      ? ((channel.conversations_today / channel.conversations_this_week) * 100).toFixed(1)
      : '0';

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center space-x-3 mb-3">
        <div
          className={`w-10 h-10 ${getChannelColor(channel.contact_type)} rounded-lg flex items-center justify-center text-white text-lg`}
        >
          {getChannelIcon(channel.contact_type)}
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-gray-900">{channel.contact_type}</h3>
          <p className="text-sm text-gray-500">Canal de comunicación</p>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Total conversaciones</span>
          <span className="font-semibold text-gray-900">
            {channel.total_conversations.toLocaleString()}
          </span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Hoy</span>
          <span className="font-semibold text-primary">{channel.conversations_today}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Esta semana</span>
          <span className="font-semibold text-gray-900">{channel.conversations_this_week}</span>
        </div>

        <div className="flex justify-between items-center">
          <span className="text-sm text-gray-600">Mensajes totales</span>
          <span className="font-semibold text-gray-900">
            {channel.total_messages.toLocaleString()}
          </span>
        </div>

        <div className="pt-2 border-t border-gray-100">
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-500">Tasa de crecimiento diaria</span>
            <span
              className={`text-xs font-medium ${
                parseFloat(growthRate) > 0 ? 'text-green-600' : 'text-gray-500'
              }`}
            >
              {growthRate}%
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChannelCard;
