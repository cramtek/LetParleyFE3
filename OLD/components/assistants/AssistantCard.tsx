import { useState } from 'react';
import { AlertCircle, Bot, Edit, Eye, MoreVertical, Pause, Play, Trash2 } from 'lucide-react';
import { MakeAssistant, getAvatarById, getLanguageLabel } from '../../services/assistantService';
import { formatToUserTimezone } from '../../utils/timezone';

interface AssistantCardProps {
  assistant: MakeAssistant;
  onView: (assistant: MakeAssistant) => void;
  onEdit: (assistant: MakeAssistant) => void;
  onDelete: (assistant: MakeAssistant) => void;
  onToggleActive: (assistant: MakeAssistant, isActive: boolean) => void;
}

const AssistantCard = ({
  assistant,
  onView,
  onEdit,
  onDelete,
  onToggleActive,
}: AssistantCardProps) => {
  const [showMenu, setShowMenu] = useState(false);
  const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);

  const avatar = getAvatarById(assistant.ai_avatar_id);

  const handleToggleMenu = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(!showMenu);
  };

  const handleView = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onView(assistant);
  };

  const handleEdit = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    onEdit(assistant);
  };

  const handleDeleteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setShowMenu(false);
    setIsConfirmingDelete(true);
  };

  const handleConfirmDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
    onDelete(assistant);
  };

  const handleCancelDelete = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsConfirmingDelete(false);
  };

  const handleToggleActive = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleActive(assistant, !assistant.is_responding);
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-all duration-300">
      {/* Header with avatar */}
      <div className="relative h-32 bg-gradient-to-r from-blue-500 to-purple-600 rounded-t-xl flex items-center justify-center">
        <div className="absolute top-3 right-3 z-10">
          <div className="relative">
            <button
              onClick={handleToggleMenu}
              className="p-2 bg-white/20 hover:bg-white/30 rounded-full text-white transition-colors"
            >
              <MoreVertical className="h-5 w-5" />
            </button>

            {showMenu && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-20">
                <button
                  onClick={handleView}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Eye className="h-4 w-4 mr-2" />
                  Ver detalles
                </button>
                <button
                  onClick={handleEdit}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center"
                >
                  <Edit className="h-4 w-4 mr-2" />
                  Editar
                </button>
                <button
                  onClick={handleDeleteClick}
                  className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-2" />
                  Eliminar
                </button>
              </div>
            )}
          </div>
        </div>

        <div className="h-20 w-20 rounded-full bg-white p-1 shadow-lg">
          <img
            src={avatar.imageUrl}
            alt={avatar.name}
            className="h-full w-full rounded-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.src = 'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png';
            }}
          />
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        <div className="text-center mb-4">
          <h3 className="text-xl font-bold text-gray-900 mb-1">{assistant.name}</h3>
          <div className="flex items-center justify-center space-x-2">
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                assistant.is_responding
                  ? 'bg-green-100 text-green-800'
                  : 'bg-gray-100 text-gray-800'
              }`}
            >
              {assistant.is_responding ? 'Activo' : 'Inactivo'}
            </span>
            <span className="text-xs text-gray-500">ID: {assistant.oai_assistant_id}</span>
          </div>
        </div>

        <div className="flex justify-center space-x-3 mb-4">
          <button
            onClick={handleView}
            className="px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center"
          >
            <Eye className="h-4 w-4 mr-2" />
            Ver
          </button>
          <button
            onClick={handleEdit}
            className="px-3 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm flex items-center"
          >
            <Edit className="h-4 w-4 mr-2" />
            Editar
          </button>
          <button
            onClick={handleToggleActive}
            className={`px-3 py-2 rounded-lg transition-colors text-sm flex items-center ${
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

        <div className="border-t border-gray-100 pt-4 text-center">
          <div className="flex items-center justify-center">
            <Bot className="h-4 w-4 text-gray-500 mr-2" />
            <span className="text-sm text-gray-600">Asistente IA</span>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {isConfirmingDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
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
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AssistantCard;
