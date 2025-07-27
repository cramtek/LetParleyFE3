import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bot,
  CheckCircle,
  ExternalLink,
  Loader2,
  MessageSquare,
  RefreshCw,
  X,
} from 'lucide-react';
import {
  ConversationStatus,
  assistantApi,
  getStatusColor,
  getStatusIcon,
  getStatusMessage,
} from '../../services/assistantService';
import { useNavigationStore } from '../../store/navigationStore';

interface AssistantControlsProps {
  threadId: string;
  onStatusChange?: (status: ConversationStatus) => void;
  onRefreshConversation?: () => void;
}

const AssistantControls = ({
  threadId,
  onStatusChange,
  onRefreshConversation,
}: AssistantControlsProps) => {
  const [status, setStatus] = useState<ConversationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isToggling, setIsToggling] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showAssistantWarning, setShowAssistantWarning] = useState(true);
  const { navigateTo } = useNavigationStore();

  // Load status when component mounts or threadId changes
  useEffect(() => {
    if (threadId) {
      loadStatus();
    }
  }, [threadId]);

  const loadStatus = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await assistantApi.getConversationStatus(threadId);
      if (response.success) {
        setStatus(response.data);
        onStatusChange?.(response.data);
      }
    } catch (error) {
      console.error('Error loading conversation status:', error);
      setError(error instanceof Error ? error.message : 'Error al cargar estado');
    } finally {
      setIsLoading(false);
    }
  };

  const handleToggleConversation = async () => {
    if (!status || isToggling) return;

    setIsToggling(true);
    setError(null);

    try {
      const newStatus = !status.thread_status.is_responding;
      const response = await assistantApi.toggleConversation(threadId, newStatus);

      if (response.success) {
        // Reload status to get updated data
        await loadStatus();
      }
    } catch (error) {
      console.error('Error toggling conversation:', error);
      setError(error instanceof Error ? error.message : 'Error al cambiar estado');
    } finally {
      setIsToggling(false);
    }
  };

  const handleRefreshConversation = async () => {
    if (isRefreshing) return;

    setIsRefreshing(true);

    try {
      // Call the parent's refresh function to reload messages
      onRefreshConversation?.();

      // Also reload the status
      await loadStatus();
    } catch (error) {
      console.error('Error refreshing conversation:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleNavigateToAssistants = () => {
    navigateTo('assistants');
  };

  if (isLoading) {
    return (
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex items-center justify-center">
          <Loader2 className="h-5 w-5 animate-spin text-gray-400" />
          <span className="ml-2 text-sm text-gray-600">Cargando estado...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border-b border-red-200 p-4">
        <div className="flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-sm text-red-700">{error}</span>
          <button
            onClick={loadStatus}
            className="ml-auto text-sm text-red-600 hover:text-red-800 underline"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  if (!status) {
    return null;
  }

  const { overall_status, thread_status, assistant_status } = status;
  const statusColorClass = getStatusColor(overall_status.reason);
  const statusIcon = getStatusIcon(overall_status.reason);
  const statusMessage = getStatusMessage(overall_status.reason);

  // Check if assistant is turned off
  const isAssistantTurnedOff =
    !assistant_status.is_responding || overall_status.reason === 'Assistant Turned Off';

  return (
    <div className="bg-white border-b border-gray-200">
      {/* Status Banner */}
      <div className={`px-4 py-2 border-l-4 ${statusColorClass}`}>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <span className="text-lg mr-2">{statusIcon}</span>
            <p className="text-sm font-medium">{statusMessage}</p>
          </div>

          {overall_status.can_respond && <CheckCircle className="h-4 w-4 text-green-500" />}
        </div>
      </div>

      {/* Assistant Turned Off Warning - Compact Version */}
      {isAssistantTurnedOff && showAssistantWarning && (
        <div className="px-3 py-2 bg-yellow-50 border-b border-yellow-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <AlertCircle className="h-4 w-4 text-yellow-500 flex-shrink-0" />
              <p className="text-xs text-yellow-800">
                Asistente desactivado.
                <button
                  onClick={handleNavigateToAssistants}
                  className="ml-1 font-medium text-yellow-800 hover:text-yellow-900 underline inline-flex items-center"
                >
                  Activar
                  <ExternalLink className="h-3 w-3 ml-0.5" />
                </button>
              </p>
            </div>
            <button
              onClick={() => setShowAssistantWarning(false)}
              className="text-yellow-500 hover:text-yellow-700"
              aria-label="Cerrar"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      {/* Controls */}
      <div className="px-4 py-2 bg-gray-50">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-8">
            {/* Conversation Toggle */}
            <div className="flex items-center space-x-3">
              <MessageSquare className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-700">Conversación IA</span>
              <button
                onClick={handleToggleConversation}
                disabled={isToggling}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${thread_status.is_responding ? 'bg-green-600' : 'bg-gray-300'}
                  ${isToggling ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${thread_status.is_responding ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>
          </div>

          {/* Refresh Button */}
          <button
            onClick={handleRefreshConversation}
            disabled={isRefreshing}
            className={`
              p-1 rounded-full transition-colors
              ${
                isRefreshing
                  ? 'text-gray-400 cursor-not-allowed'
                  : 'text-gray-500 hover:text-gray-700 hover:bg-gray-200'
              }
            `}
            title="Recargar conversación"
          >
            <RefreshCw className={`h-3 w-3 ${isRefreshing ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssistantControls;
