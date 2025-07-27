import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bot,
  Calendar,
  CheckCircle,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Info,
  MessageSquare,
  Pause,
  Play,
  Plus,
  Trash2,
  User,
  Users,
  X,
  XCircle,
} from 'lucide-react';
import {
  AssistantDetail,
  assistantApi,
  getAvatarById,
  getLanguageLabel,
  isAdvancedAssistant,
} from '../../services/assistantService';
import { useAuthStore } from '../../store/authStore';
import { formatToUserTimezone } from '../../utils/timezone';

interface AssistantDetailModalProps {
  assistantDetail: AssistantDetail;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  onToggleActive: (isActive: boolean) => void;
  isLoading: boolean;
}

const AssistantDetailModal = ({
  assistantDetail,
  onClose,
  onEdit,
  onDelete,
  onToggleActive,
  isLoading,
}: AssistantDetailModalProps) => {
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'training'>('overview');
  const [assistantStatus, setAssistantStatus] = useState<any>(null);
  const [isLoadingStatus, setIsLoadingStatus] = useState(false);
  const [statusError, setStatusError] = useState<string | null>(null);

  const { assistant, training } = assistantDetail;
  const avatar = getAvatarById(assistant.ai_avatar_id);
  const isAdvanced = isAdvancedAssistant(assistant);
  const hasTraining = training !== null;

  // Fetch assistant status
  useEffect(() => {
    const fetchAssistantStatus = async () => {
      setIsLoadingStatus(true);
      setStatusError(null);

      try {
        const response = await assistantApi.getMakeAssistantStatus(assistant.oai_assistant_id);
        if (response.success) {
          setAssistantStatus(response.data);
        }
      } catch (error) {
        console.error('Error fetching assistant status:', error);
        setStatusError(
          error instanceof Error ? error.message : 'Error al cargar estado del asistente',
        );
      } finally {
        setIsLoadingStatus(false);
      }
    };

    fetchAssistantStatus();
  }, [assistant.oai_assistant_id]);

  const handleDeleteClick = () => {
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = () => {
    setIsConfirmingDelete(false);
    onDelete();
  };

  const handleCancelDelete = () => {
    setIsConfirmingDelete(false);
  };

  const handleToggleActive = () => {
    onToggleActive(!assistant.is_responding);
  };

  const formatDate = (dateString: string) => {
    return formatToUserTimezone(dateString, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Detalles del Asistente</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-6">
            <button
              onClick={() => setActiveTab('overview')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'overview'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Bot className="h-4 w-4 inline mr-2" />
              Información General
            </button>
            <button
              onClick={() => setActiveTab('training')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'training'
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <FileText className="h-4 w-4 inline mr-2" />
              Contenido de Entrenamiento
            </button>
          </nav>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto">
          {activeTab === 'overview' ? (
            <div className="p-6 space-y-8">
              {/* Assistant Info */}
              <div className="flex flex-col md:flex-row md:items-start gap-6">
                <div className="flex-shrink-0">
                  <div className="h-32 w-32 rounded-full border-4 border-blue-100 p-1 mx-auto md:mx-0">
                    <img
                      src={avatar.imageUrl}
                      alt={avatar.name}
                      className="h-full w-full rounded-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src =
                          'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png';
                      }}
                    />
                  </div>
                </div>

                <div className="flex-1 text-center md:text-left">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-2xl font-bold text-gray-900 mb-2">{assistant.name}</h3>
                      <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mb-2">
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            assistant.is_responding
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}
                        >
                          {assistant.is_responding ? 'Activo' : 'Inactivo'}
                        </span>
                        <span
                          className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                            isAdvanced
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-blue-800'
                          }`}
                        >
                          {isAdvanced ? 'Avanzado' : 'Básico'}
                        </span>
                        {hasTraining && training.language && (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
                            <Globe className="h-4 w-4 mr-1" />
                            {getLanguageLabel(training.language)}
                          </span>
                        )}
                      </div>
                      {hasTraining && training.title && (
                        <p className="text-lg text-gray-700 font-medium">{training.title}</p>
                      )}
                    </div>

                    <div className="flex items-center justify-center md:justify-end space-x-3 mt-4 md:mt-0">
                      <button
                        onClick={onEdit}
                        disabled={isLoading}
                        className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center disabled:opacity-50"
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </button>
                      <button
                        onClick={handleToggleActive}
                        disabled={isLoading}
                        className={`px-4 py-2 rounded-lg transition-colors text-sm flex items-center disabled:opacity-50 ${
                          assistant.is_responding
                            ? 'bg-red-100 text-red-700 hover:bg-red-200'
                            : 'bg-green-100 text-green-700 hover:bg-green-200'
                        }`}
                      >
                        {assistant.is_responding ? (
                          <>
                            <Pause className="h-4 w-4 mr-2" />
                            Desactivar
                          </>
                        ) : (
                          <>
                            <Play className="h-4 w-4 mr-2" />
                            Activar
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {hasTraining && training.description && (
                    <p className="text-gray-600 mb-4">{training.description}</p>
                  )}

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                    {hasTraining ? (
                      <>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">
                            Creado: {formatDate(training.date_created)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">
                            Actualizado: {formatDate(training.date_modified)}
                          </span>
                        </div>
                        <div className="flex items-center">
                          <User className="h-4 w-4 text-gray-500 mr-2" />
                          <span className="text-gray-700">Creado por: {training.created_by}</span>
                        </div>
                      </>
                    ) : (
                      <div className="col-span-2 text-center text-gray-500">
                        <Info className="h-5 w-5 mx-auto mb-2" />
                        <p>Información de entrenamiento no disponible</p>
                      </div>
                    )}
                    <div className="flex items-center">
                      <Bot className="h-4 w-4 text-gray-500 mr-2" />
                      <span className="text-gray-700">ID: {assistant.oai_assistant_id}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Status and Capabilities */}
              <div className="bg-gray-50 rounded-xl p-6">
                <h4 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <Info className="h-5 w-5 mr-2 text-blue-600" />
                  Estado y Capacidades
                </h4>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                          assistant.is_active ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        {assistant.is_active ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Estado del Asistente</p>
                        <p className="text-sm text-gray-600">
                          {assistant.is_active
                            ? 'Activo y disponible para uso'
                            : 'Inactivo - no está disponible para uso'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                          assistant.is_responding ? 'bg-green-100' : 'bg-gray-100'
                        }`}
                      >
                        {assistant.is_responding ? (
                          <CheckCircle className="h-4 w-4 text-green-600" />
                        ) : (
                          <XCircle className="h-4 w-4 text-gray-500" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Respuesta Automática</p>
                        <p className="text-sm text-gray-600">
                          {assistant.is_responding
                            ? 'Respondiendo automáticamente a mensajes'
                            : 'No está respondiendo automáticamente'}
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {hasTraining && training.language && (
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0 w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center mt-0.5">
                          <Globe className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">Idioma Principal</p>
                          <p className="text-sm text-gray-600">
                            {getLanguageLabel(training.language)}
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="flex items-start space-x-3">
                      <div
                        className={`flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center mt-0.5 ${
                          isAdvanced ? 'bg-purple-100' : 'bg-blue-100'
                        }`}
                      >
                        <Bot
                          className={`h-4 w-4 ${isAdvanced ? 'text-purple-600' : 'text-blue-600'}`}
                        />
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">Tipo de Asistente</p>
                        <p className="text-sm text-gray-600">
                          {isAdvanced ? 'Asistente Avanzado' : 'Asistente Básico'}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Assistant Status Information */}
              {assistantStatus && (
                <div className="bg-blue-50 rounded-xl p-6">
                  <h4 className="text-lg font-medium text-blue-900 mb-4 flex items-center">
                    <Info className="h-5 w-5 mr-2 text-blue-600" />
                    Estadísticas del Asistente
                  </h4>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Conversaciones Totales</span>
                        <span className="text-lg font-bold text-blue-600">
                          {assistantStatus.total_threads}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <MessageSquare className="h-4 w-4 text-blue-500 mr-2" />
                        <span className="text-xs text-gray-500">Todas las conversaciones</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Conversaciones Activas</span>
                        <span className="text-lg font-bold text-green-600">
                          {assistantStatus.active_responding_threads}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-green-500 mr-2" />
                        <span className="text-xs text-gray-500">Con respuesta automática</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-lg p-4 shadow-sm">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">Estado</span>
                        <span
                          className={`text-sm font-medium px-2 py-1 rounded-full ${
                            assistantStatus.status.can_respond
                              ? 'bg-green-100 text-green-800'
                              : 'bg-yellow-100 text-yellow-800'
                          }`}
                        >
                          {assistantStatus.status.can_respond ? 'Disponible' : 'No Disponible'}
                        </span>
                      </div>
                      <div className="flex items-center">
                        <Info className="h-4 w-4 text-gray-500 mr-2" />
                        <span className="text-xs text-gray-500">
                          {assistantStatus.status.reason}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Delete Section */}
              <div className="border-t border-gray-200 pt-6">
                <div className="bg-red-50 rounded-lg p-4">
                  <h4 className="text-lg font-medium text-red-800 mb-2">Zona de Peligro</h4>
                  <p className="text-sm text-red-700 mb-4">
                    Eliminar un asistente es una acción permanente y no se puede deshacer.
                  </p>
                  <button
                    onClick={handleDeleteClick}
                    disabled={isLoading}
                    className="inline-flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    Eliminar Asistente
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-medium text-gray-900">Contenido de Entrenamiento</h3>
                {hasTraining && !isAdvanced && (
                  <button
                    onClick={onEdit}
                    disabled={isLoading}
                    className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center disabled:opacity-50"
                  >
                    <Edit className="h-4 w-4 mr-1" />
                    Editar
                  </button>
                )}
              </div>

              {!hasTraining ? (
                <div className="text-center py-12">
                  {isAdvanced ? (
                    // Advanced assistant - no training details available
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <ExternalLink className="h-8 w-8 text-purple-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">Asistente Avanzado</h3>
                      <p className="text-gray-600 mb-4">
                        Este asistente avanzado es gestionado por LetParley. Los detalles de
                        entrenamiento no están disponibles.
                      </p>
                      <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                        <p className="text-sm text-purple-800">
                          <strong>Nota:</strong> Para modificar el comportamiento de este asistente,
                          solicitarlo a un agente de LetParley.
                        </p>
                      </div>
                    </div>
                  ) : (
                    // Basic assistant - can add training details
                    <div className="max-w-md mx-auto">
                      <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Plus className="h-8 w-8 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-900 mb-2">
                        Sin Detalles de Entrenamiento
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Este asistente básico no tiene detalles de entrenamiento configurados.
                        Agrega contenido de entrenamiento para personalizar su comportamiento y
                        respuestas.
                      </p>
                      <button
                        onClick={onEdit}
                        disabled={isLoading}
                        className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                      >
                        <Plus className="h-5 w-5 mr-2" />
                        Agregar Detalles de Entrenamiento
                      </button>
                      <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-800">
                          <strong>Sugerencia:</strong> El contenido de entrenamiento define la
                          personalidad, conocimientos y estilo de respuesta del asistente.
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                // Has training data
                <div className="bg-gray-50 rounded-xl p-6">
                  <div className="flex items-start space-x-3 mb-4">
                    <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                    <div className="text-sm text-gray-700">
                      <p className="font-medium mb-1">Sobre el contenido de entrenamiento:</p>
                      <p>
                        Este texto define el comportamiento, conocimientos y personalidad del
                        asistente.
                      </p>
                    </div>
                  </div>

                  <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
                    {training.training_content}
                  </div>

                  <div className="mt-6 bg-blue-50 rounded-xl p-6">
                    <h4 className="text-lg font-medium text-blue-900 mb-4">Información Técnica</h4>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="font-medium text-blue-800">ID de Entrenamiento:</span>
                        <span className="ml-2 text-blue-700">{training.training_id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">ID de Asistente:</span>
                        <span className="ml-2 text-blue-700">{assistant.oai_assistant_id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">OpenAI ID:</span>
                        <span className="ml-2 text-blue-700">{assistant.openai_id}</span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Fecha de Creación:</span>
                        <span className="ml-2 text-blue-700">
                          {formatDate(training.date_created)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Última Modificación:</span>
                        <span className="ml-2 text-blue-700">
                          {formatDate(training.date_modified)}
                        </span>
                      </div>
                      <div>
                        <span className="font-medium text-blue-800">Creado por:</span>
                        <span className="ml-2 text-blue-700">{training.created_by}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertCircle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-bold">Confirmar eliminación</h3>
            </div>

            <p className="text-gray-700 mb-6">
              ¿Estás seguro de que deseas eliminar el asistente{' '}
              <span className="font-semibold">{assistant.name}</span>? Esta acción no se puede
              deshacer.
            </p>

            <div className="flex justify-end space-x-3">
              <button
                onClick={handleCancelDelete}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Eliminando...
                  </div>
                ) : (
                  'Eliminar'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantDetailModal;
