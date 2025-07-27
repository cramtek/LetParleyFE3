import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bot,
  Brain,
  Calendar,
  Filter,
  Loader2,
  MessageSquare,
  Plus,
  RefreshCw,
  Search,
  Settings,
  Users,
  X,
  Zap,
} from 'lucide-react';
import AssistantCard from '../components/assistants/AssistantCard';
import AssistantDetailModal from '../components/assistants/AssistantDetailModal';
import AssistantForm from '../components/assistants/AssistantForm';
import {
  AssistantDetail,
  CreateAssistantRequest,
  MakeAssistant,
  UpdateAssistantRequest,
  assistantApi,
} from '../services/assistantService';
import { useAssistantStore } from '../store/assistantStore';
import { useAuthStore } from '../store/authStore';

const AssistantsPage = () => {
  const { selectedBusinessId } = useAuthStore();
  const {
    assistants,
    selectedAssistant,
    isLoading,
    isLoadingDetail,
    isCreating,
    isUpdating,
    isDeleting,
    error,
    createError,
    updateError,
    deleteError,
    fetchAssistants,
    fetchAssistantDetail,
    createAssistant,
    updateAssistant,
    deleteAssistant,
    clearErrors,
    clearSelectedAssistant,
  } = useAssistantStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedAssistantForAction, setSelectedAssistantForAction] =
    useState<MakeAssistant | null>(null);
  const [isTogglingActive, setIsTogglingActive] = useState(false);

  // Load assistants when component mounts
  useEffect(() => {
    if (selectedBusinessId) {
      fetchAssistants();
    }
  }, [selectedBusinessId, fetchAssistants]);

  // Filter assistants based on search query and status filter
  const filteredAssistants = (assistants || []).filter((assistant) => {
    const matchesSearch = assistant.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      statusFilter === 'all' ||
      (statusFilter === 'active' && assistant.is_responding) ||
      (statusFilter === 'inactive' && !assistant.is_responding);

    return matchesSearch && matchesStatus;
  });

  const handleViewAssistant = async (assistant: MakeAssistant) => {
    try {
      // Ensure oai_assistant_id is converted to number
      const assistantId = Number(assistant.oai_assistant_id);
      await fetchAssistantDetail(assistantId);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Error fetching assistant details:', error);
    }
  };

  const handleEditAssistant = async (assistant: MakeAssistant) => {
    setSelectedAssistantForAction(assistant);
    try {
      // Ensure oai_assistant_id is converted to number
      const assistantId = Number(assistant.oai_assistant_id);
      await fetchAssistantDetail(assistantId);
      setShowEditForm(true);
    } catch (error) {
      console.error('Error fetching assistant details for edit:', error);
    }
  };

  const handleDeleteAssistant = async (assistant: MakeAssistant) => {
    try {
      // Ensure oai_assistant_id is converted to number
      const assistantId = Number(assistant.oai_assistant_id);
      const success = await deleteAssistant(assistantId);
      if (success) {
        setShowDetailModal(false);
        clearSelectedAssistant();
      }
    } catch (error) {
      console.error('Error deleting assistant:', error);
    }
  };

  const handleToggleActive = async (assistant: MakeAssistant, isActive: boolean) => {
    setIsTogglingActive(true);

    try {
      // Use the new endpoint for Make assistants
      const assistantId = Number(assistant.oai_assistant_id);
      const response = await assistantApi.toggleMakeAssistant(assistantId, isActive);

      if (response.success) {
        // Refresh the assistants list
        await fetchAssistants();

        // If the detail modal is open, refresh the assistant details
        if (showDetailModal && selectedAssistant) {
          await fetchAssistantDetail(assistantId);
        }
      }
    } catch (error) {
      console.error('Error toggling assistant active state:', error);
    } finally {
      setIsTogglingActive(false);
    }
  };

  const handleCreateAssistant = async (data: CreateAssistantRequest) => {
    try {
      const newAssistant = await createAssistant({
        ...data,
        business_id: parseInt(selectedBusinessId || '0', 10),
      });

      if (newAssistant) {
        setShowCreateForm(false);
        await fetchAssistants();
      }
    } catch (error) {
      console.error('Error creating assistant:', error);
    }
  };

  const handleUpdateAssistant = async (data: UpdateAssistantRequest) => {
    if (!selectedAssistantForAction) return;

    try {
      // Ensure oai_assistant_id is converted to number
      const assistantId = Number(selectedAssistantForAction.oai_assistant_id);
      const success = await updateAssistant(assistantId, data);

      if (success) {
        setShowEditForm(false);
        await fetchAssistants();

        // If the detail modal is open, refresh the assistant details
        if (showDetailModal && selectedAssistant) {
          await fetchAssistantDetail(assistantId);
        }
      }
    } catch (error) {
      console.error('Error updating assistant:', error);
    }
  };

  const handleRefresh = () => {
    clearErrors();
    fetchAssistants();
  };

  // Load Calendly JS for inline widget
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asistentes Inteligentes</h1>
          <p className="text-gray-600">
            Gestiona tus asistentes de IA para automatizar conversaciones
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Actualizar"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={() => setShowCreateForm(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5 mr-2" />
            Nuevo Asistente
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{error}</p>
          </div>
          <button onClick={clearErrors} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Filters */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Search */}
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar asistentes..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-2">
            <Filter className="h-5 w-5 text-gray-500" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')}
              className="flex-1 border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">Todos los estados</option>
              <option value="active">Activos</option>
              <option value="inactive">Inactivos</option>
            </select>
          </div>

          {/* Results count */}
          <div className="flex items-center justify-end text-sm text-gray-600">
            {filteredAssistants.length} asistente{filteredAssistants.length !== 1 ? 's' : ''}
          </div>
        </div>
      </div>

      {/* Assistants Grid */}
      <div>
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <Loader2 className="h-8 w-8 text-blue-600 animate-spin mx-auto mb-4" />
              <p className="text-gray-600">Cargando asistentes...</p>
            </div>
          </div>
        ) : filteredAssistants.length === 0 ? (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
            <Bot className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No hay asistentes</h3>
            <p className="text-gray-500 mb-6">
              {searchQuery || statusFilter !== 'all'
                ? 'No se encontraron asistentes con los filtros aplicados'
                : 'Crea tu primer asistente para comenzar a automatizar conversaciones'}
            </p>
            {!searchQuery && statusFilter === 'all' && (
              <button
                onClick={() => setShowCreateForm(true)}
                className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Plus className="h-5 w-5 mr-2" />
                Crear Asistente
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredAssistants.map((assistant) => (
              <AssistantCard
                key={assistant.oai_assistant_id}
                assistant={assistant}
                onView={handleViewAssistant}
                onEdit={handleEditAssistant}
                onDelete={handleDeleteAssistant}
                onToggleActive={handleToggleActive}
              />
            ))}
          </div>
        )}
      </div>

      {/* Features Section */}
      <div className="bg-white rounded-xl p-8 border border-gray-100 shadow-sm">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
          Características de los Asistentes
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 text-blue-600 rounded-xl mb-4">
              <Brain className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">IA Conversacional</h3>
            <p className="text-gray-600 text-sm">
              Asistentes inteligentes que comprenden el contexto y mantienen conversaciones
              naturales con tus clientes.
            </p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-teal-50 rounded-xl p-6 border border-green-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-green-100 text-green-600 rounded-xl mb-4">
              <MessageSquare className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Respuestas Automáticas</h3>
            <p className="text-gray-600 text-sm">
              Configuración de respuestas automáticas personalizadas para diferentes tipos de
              consultas.
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-pink-50 rounded-xl p-6 border border-purple-100">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 text-purple-600 rounded-xl mb-4">
              <Zap className="h-6 w-6" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Integración Multicanal</h3>
            <p className="text-gray-600 text-sm">
              Funciona perfectamente en WhatsApp, Instagram, webchat y otros canales de
              comunicación.
            </p>
          </div>
        </div>
      </div>

      {/* Calendly Inline Widget Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Zap className="h-4 w-4 mr-2" />
            Asistentes Avanzados
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">
            ¿Necesitas un Asistente Personalizado?
          </h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Agenda una llamada con nuestro equipo para crear un asistente avanzado con capacidades
            específicas para tu negocio.
          </p>
        </div>

        {/* Calendly Inline Widget */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/letparley"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      </div>

      {/* Create Assistant Form */}
      {showCreateForm && (
        <AssistantForm
          onClose={() => {
            setShowCreateForm(false);
            clearErrors();
          }}
          onSubmit={handleCreateAssistant}
          isSubmitting={isCreating}
          error={createError}
          isEditMode={false}
        />
      )}

      {/* Edit Assistant Form */}
      {showEditForm && selectedAssistant && (
        <AssistantForm
          assistantDetail={selectedAssistant}
          onClose={() => {
            setShowEditForm(false);
            clearErrors();
          }}
          onSubmit={handleUpdateAssistant}
          isSubmitting={isUpdating}
          error={updateError}
          isEditMode={true}
        />
      )}

      {/* Assistant Detail Modal */}
      {showDetailModal && selectedAssistant && (
        <AssistantDetailModal
          assistantDetail={selectedAssistant}
          onClose={() => {
            setShowDetailModal(false);
            clearSelectedAssistant();
          }}
          onEdit={() => {
            setShowDetailModal(false);
            setShowEditForm(true);
          }}
          onDelete={() => handleDeleteAssistant(selectedAssistant.assistant)}
          onToggleActive={(isActive) => handleToggleActive(selectedAssistant.assistant, isActive)}
          isLoading={isUpdating || isDeleting || isTogglingActive}
        />
      )}
    </div>
  );
};

export default AssistantsPage;
