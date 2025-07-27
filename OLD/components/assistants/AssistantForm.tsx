import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bot,
  Check,
  FileText,
  Globe,
  Info,
  Loader,
  Save,
  Sparkles,
  User,
  X,
} from 'lucide-react';
import {
  ASSISTANT_AVATARS,
  AssistantDetail,
  CreateAssistantRequest,
  LANGUAGE_OPTIONS,
  UpdateAssistantRequest,
} from '../../services/assistantService';
import { useAuthStore } from '../../store/authStore';

interface AssistantFormProps {
  assistantDetail?: AssistantDetail;
  onClose: () => void;
  onSubmit: (data: CreateAssistantRequest | UpdateAssistantRequest) => Promise<void>;
  isSubmitting: boolean;
  error: string | null;
  isEditMode: boolean;
}

const AssistantForm = ({
  assistantDetail,
  onClose,
  onSubmit,
  isSubmitting,
  error,
  isEditMode,
}: AssistantFormProps) => {
  const { selectedBusinessId, userEmail } = useAuthStore();

  const [formData, setFormData] = useState<CreateAssistantRequest | UpdateAssistantRequest>({
    name: '',
    business_id: parseInt(selectedBusinessId || '0', 10),
    ai_avatar_id: 1,
    training_content: '',
    title: '',
    description: '',
    language: 'es',
    created_by: userEmail || '',
  });

  const [selectedAvatar, setSelectedAvatar] = useState(1);
  const [showAvatarSelector, setShowAvatarSelector] = useState(false);
  const [isGeneratingProposal, setIsGeneratingProposal] = useState(false);
  const [proposalPreview, setProposalPreview] = useState<string | null>(null);
  const [showProposalModal, setShowProposalModal] = useState(false);

  // Load existing data if in edit mode
  useEffect(() => {
    if (isEditMode && assistantDetail) {
      const { assistant, training } = assistantDetail;

      setFormData({
        name: assistant?.name || '',
        ai_avatar_id: assistant?.ai_avatar_id || 1,
        training_content: training?.training_content || '',
        title: training?.title || '',
        description: training?.description || '',
        language: training?.language || 'es',
        created_by: training?.created_by || userEmail || '',
      });

      setSelectedAvatar(assistant?.ai_avatar_id || 1);
    }
  }, [isEditMode, assistantDetail, userEmail]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate required fields
    if (!formData.name.trim()) {
      alert('El nombre del asistente es obligatorio');
      return;
    }

    if (!formData.training_content.trim()) {
      alert('El contenido de entrenamiento es obligatorio');
      return;
    }

    await onSubmit(formData);
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAvatarSelect = (avatarId: number) => {
    setSelectedAvatar(avatarId);
    setFormData((prev) => ({ ...prev, ai_avatar_id: avatarId }));
    setShowAvatarSelector(false);
  };

  const handleGenerateProposal = async () => {
    if (!formData.training_content.trim()) {
      alert('Por favor escribe algo sobre el asistente que necesitas para generar una propuesta');
      return;
    }

    setIsGeneratingProposal(true);

    try {
      const response = await fetch(
        'https://make.letparley.com/webhook/bc0d2427-f19e-4437-a282-40863c559216',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            training_text: formData.training_content,
          }),
        },
      );

      if (!response.ok) {
        throw new Error('Error al generar la propuesta');
      }

      const data = await response.json();

      if (data.training_proposal) {
        setProposalPreview(data.training_proposal);
        setShowProposalModal(true);
        // Scroll to top to ensure modal is visible
        window.scrollTo(0, 0);
      } else {
        throw new Error('Formato de respuesta inválido');
      }
    } catch (error) {
      console.error('Error generating proposal:', error);
      alert('Error al generar la propuesta. Por favor intenta de nuevo.');
    } finally {
      setIsGeneratingProposal(false);
    }
  };

  const handleAcceptProposal = () => {
    if (proposalPreview) {
      setFormData((prev) => ({ ...prev, training_content: proposalPreview }));
      setShowProposalModal(false);
      setProposalPreview(null);
    }
  };

  const handleCancelProposal = () => {
    setShowProposalModal(false);
    setProposalPreview(null);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      {/* Loading Overlay */}
      {isGeneratingProposal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center">
          <div className="bg-white rounded-lg p-8 shadow-xl max-w-md w-full text-center">
            <Loader className="h-12 w-12 text-purple-600 animate-spin mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Generando Propuesta</h3>
            <p className="text-gray-600">
              Estamos creando una propuesta de entrenamiento basada en tu descripción...
            </p>
          </div>
        </div>
      )}

      {/* Proposal Modal */}
      {showProposalModal && proposalPreview && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-[60] flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-purple-50">
              <div className="flex items-center">
                <div className="bg-purple-100 p-2 rounded-full mr-3">
                  <Sparkles className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="text-xl font-bold text-gray-900">Propuesta de Entrenamiento</h3>
              </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6">
              <div className="bg-purple-50 rounded-lg p-4 mb-4">
                <p className="text-sm text-purple-800">
                  Hemos generado una propuesta de entrenamiento basada en tu descripción. Puedes
                  aceptarla o continuar con tu versión original.
                </p>
              </div>

              <div className="bg-white border border-gray-200 rounded-lg p-4 font-mono text-sm whitespace-pre-wrap text-gray-700 max-h-[50vh] overflow-y-auto">
                {proposalPreview}
              </div>
            </div>

            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-3">
              <button
                type="button"
                onClick={handleCancelProposal}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleAcceptProposal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Aceptar Propuesta
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {isEditMode ? 'Editar Asistente' : 'Crear Nuevo Asistente'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {/* Error Message */}
          {error && (
            <div className="mb-6 bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
              <div className="flex">
                <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <Bot className="h-5 w-5 mr-2 text-blue-600" />
                Información Básica
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Asistente *
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Ej: Asistente de Ventas"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Idioma Principal
                  </label>
                  <select
                    name="language"
                    value={formData.language}
                    onChange={handleChange}
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    {LANGUAGE_OPTIONS.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Título del Asistente
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Especialista en Atención al Cliente"
                />
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Descripción</label>
                <input
                  type="text"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Ej: Asistente especializado en resolver consultas de clientes"
                />
              </div>
            </div>

            {/* Avatar Selection */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <User className="h-5 w-5 mr-2 text-purple-600" />
                Avatar del Asistente
              </h3>

              <div className="relative">
                <div className="flex items-center space-x-4">
                  <div className="h-20 w-20 rounded-full border-2 border-blue-500 p-1">
                    <img
                      src={
                        ASSISTANT_AVATARS.find((a) => a.id === selectedAvatar)?.imageUrl ||
                        ASSISTANT_AVATARS[0].imageUrl
                      }
                      alt="Avatar seleccionado"
                      className="h-full w-full rounded-full object-cover"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowAvatarSelector(!showAvatarSelector)}
                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Cambiar Avatar
                  </button>
                </div>

                {showAvatarSelector && (
                  <div className="absolute mt-2 p-4 bg-white rounded-xl shadow-lg border border-gray-200 z-10">
                    <div className="grid grid-cols-3 gap-4">
                      {ASSISTANT_AVATARS.map((avatar) => (
                        <button
                          key={avatar.id}
                          type="button"
                          onClick={() => handleAvatarSelect(avatar.id)}
                          className={`p-2 rounded-lg transition-colors ${
                            selectedAvatar === avatar.id
                              ? 'bg-blue-100 ring-2 ring-blue-500'
                              : 'hover:bg-gray-100'
                          }`}
                        >
                          <div className="relative">
                            <img
                              src={avatar.imageUrl}
                              alt={avatar.name}
                              className="h-16 w-16 rounded-full object-cover mx-auto"
                            />
                            {selectedAvatar === avatar.id && (
                              <div className="absolute -top-1 -right-1 bg-blue-500 rounded-full p-1">
                                <Check className="h-3 w-3 text-white" />
                              </div>
                            )}
                          </div>
                          <p className="text-xs text-center mt-1 text-gray-700">{avatar.name}</p>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Training Content */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <FileText className="h-5 w-5 mr-2 text-green-600" />
                Contenido de Entrenamiento *
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="flex items-start space-x-2">
                  <Info className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm text-gray-700">
                    <p className="font-medium mb-1">Instrucciones para el entrenamiento:</p>
                    <ul className="list-disc pl-5 space-y-1">
                      <li>Describe claramente el rol y propósito del asistente</li>
                      <li>Incluye el tono de comunicación deseado (formal, amigable, etc.)</li>
                      <li>Especifica cómo debe manejar diferentes tipos de consultas</li>
                      <li>Añade información específica sobre productos o servicios</li>
                    </ul>
                  </div>
                </div>
              </div>

              <textarea
                name="training_content"
                value={formData.training_content}
                onChange={handleChange}
                rows={10}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 font-mono text-sm"
                placeholder="Eres un asistente especializado en atención al cliente para nuestra empresa. Tu objetivo es proporcionar respuestas claras y precisas a las consultas de los clientes..."
                required
              />

              <p className="text-sm text-gray-500 mt-2">
                Este contenido será utilizado para entrenar al asistente y definir su
                comportamiento.
              </p>

              {/* Generate Proposal Button */}
              <div className="mt-4 flex justify-end">
                <button
                  type="button"
                  onClick={handleGenerateProposal}
                  disabled={isGeneratingProposal || !formData.training_content.trim()}
                  className="inline-flex items-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generar Propuesta
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                  {isEditMode ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  {isEditMode ? 'Actualizar Asistente' : 'Crear Asistente'}
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssistantForm;
