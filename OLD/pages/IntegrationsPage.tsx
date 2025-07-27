import { useEffect, useState } from 'react';
import {
  AlertCircle,
  Bot,
  Check,
  Edit,
  ExternalLink,
  Filter,
  Globe,
  Info,
  Instagram,
  MessageCircle,
  Plus,
  RefreshCw,
  Save,
  Search,
  Share2,
  ShoppingBag,
  Trash2,
  X,
} from 'lucide-react';
import ImageUploader from '../components/common/ImageUploader';
import { uploadImage } from '../services/fileService';
import {
  CreateInstagramIntegrationRequest,
  CreateStoreIntegrationRequest,
  CreateWhatsAppIntegrationRequest,
  CreateWidgetIntegrationRequest,
  InstagramIntegration,
  StoreIntegration,
  StoreProvider,
  UpdateInstagramIntegrationRequest,
  UpdateStoreIntegrationRequest,
  UpdateWhatsAppIntegrationRequest,
  UpdateWidgetIntegrationRequest,
  WhatsAppIntegration,
  WidgetIntegration,
  getIntegrationStatusColor,
  getIntegrationStatusText,
  getRequiredFieldsForStoreProvider,
  getStoreProviderColor,
  getWidgetMinimizedTypeOptions,
  getWidgetPositionOptions,
} from '../services/integrationService';
import { useAssistantStore } from '../store/assistantStore';
import { useAuthStore } from '../store/authStore';
import { useIntegrationStore } from '../store/integrationStore';
import { useNavigationStore } from '../store/navigationStore';

const IntegrationsPage = () => {
  const { selectedBusinessId } = useAuthStore();
  const {
    // WhatsApp
    whatsappIntegrations,
    isLoadingWhatsApp,
    whatsAppError,
    fetchWhatsAppIntegrations,
    createWhatsAppIntegration,
    updateWhatsAppIntegration,
    deleteWhatsAppIntegration,
    assignAssistantToWhatsApp,
    clearWhatsAppError,

    // Instagram
    instagramIntegrations,
    isLoadingInstagram,
    instagramError,
    fetchInstagramIntegrations,
    createInstagramIntegration,
    updateInstagramIntegration,
    deleteInstagramIntegration,
    assignAssistantToInstagram,
    clearInstagramError,

    // Widget
    widgetIntegrations,
    isLoadingWidget,
    widgetError,
    fetchWidgetIntegrations,
    createWidgetIntegration,
    updateWidgetIntegration,
    deleteWidgetIntegration,
    assignAssistantToWidget,
    clearWidgetError,

    // Store
    storeIntegrations,
    isLoadingStore,
    storeError,
    fetchStoreIntegrations,
    createStoreIntegration,
    updateStoreIntegration,
    deleteStoreIntegration,
    assignAssistantToStore,
    clearStoreError,

    // Common
    clearAllErrors,
  } = useIntegrationStore();

  const { assistants, isLoading: isLoadingAssistants, fetchAssistants } = useAssistantStore();

  const { navigateTo } = useNavigationStore();

  const [activeTab, setActiveTab] = useState<'whatsapp' | 'instagram' | 'widget' | 'store'>(
    'whatsapp',
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedIntegration, setSelectedIntegration] = useState<any>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form data for WhatsApp
  const [whatsappFormData, setWhatsappFormData] = useState<CreateWhatsAppIntegrationRequest>({
    oai_assistant_id: 0,
    business_id: 0,
    meta_access_token: '',
    meta_phone_number_id: '',
    phone_number: '',
    name: '',
  });

  // Form data for Instagram
  const [instagramFormData, setInstagramFormData] = useState<CreateInstagramIntegrationRequest>({
    oai_assistant_id: null,
    business_id: 0,
    meta_access_token: '',
    instagram_account_id: '',
    name: '',
  });

  // Form data for Widget
  const [widgetFormData, setWidgetFormData] = useState<CreateWidgetIntegrationRequest>({
    oai_assistant_id: 0,
    business_id: 0,
    widget_name: '',
    minimizable: true,
    desktop_minimized_type: 'bubble',
    mobile_minimized_type: 'bubble',
    top_radius: 10,
    bottom_radius: 10,
    box_size_width: 350,
    box_size_height: 500,
    minimized_width: 60,
    minimized_height: 60,
    desktop_screen_position: 'bottom-right',
    mobile_screen_position: 'bottom-right',
    attention_getter: false,
    header_color: '#3B82F6',
    agent_text_color: '#FFFFFF',
    header_text_color: '#FFFFFF',
    visitor_message_color: '#F3F4F6',
    agent_message_color: '#EFF6FF',
    visitor_text_color: '#1F2937',
    welcome_message: '¡Hola! ¿En qué puedo ayudarte?',
    powered_by_message: 'Powered by LetParley',
    is_active: true,
  });

  // Form data for Store
  const [storeFormData, setStoreFormData] = useState<CreateStoreIntegrationRequest>({
    oai_assistant_id: 0,
    business_id: 0,
    store: 'Nidux',
    name: '',
    store_url: '',
  });

  // Load data when component mounts
  useEffect(() => {
    if (selectedBusinessId) {
      loadData();
    }
  }, [selectedBusinessId]);

  // Load assistants when component mounts
  useEffect(() => {
    if (selectedBusinessId) {
      fetchAssistants();
    }
  }, [selectedBusinessId, fetchAssistants]);

  // Load data based on active tab
  useEffect(() => {
    if (selectedBusinessId) {
      loadTabData();
    }
  }, [activeTab, selectedBusinessId]);

  const loadData = () => {
    fetchWhatsAppIntegrations();
    fetchInstagramIntegrations();
    fetchWidgetIntegrations();
    fetchStoreIntegrations();
  };

  const loadTabData = () => {
    switch (activeTab) {
      case 'whatsapp':
        fetchWhatsAppIntegrations();
        break;
      case 'instagram':
        fetchInstagramIntegrations();
        break;
      case 'widget':
        fetchWidgetIntegrations();
        break;
      case 'store':
        fetchStoreIntegrations();
        break;
    }
  };

  const handleCreateIntegration = () => {
    // Check if there are any assistants available
    if (!assistants || assistants.length === 0) {
      return; // Don't open modal if no assistants
    }

    // Reset form data
    switch (activeTab) {
      case 'whatsapp':
        setWhatsappFormData({
          oai_assistant_id: 0, // Start with no selection to force user choice
          business_id: parseInt(selectedBusinessId || '0', 10),
          meta_access_token: '',
          meta_phone_number_id: '',
          phone_number: '',
          name: '',
        });
        break;
      case 'instagram':
        setInstagramFormData({
          oai_assistant_id: 0, // Start with no selection to force user choice
          business_id: parseInt(selectedBusinessId || '0', 10),
          meta_access_token: '',
          instagram_account_id: '',
          name: '',
        });
        break;
      case 'widget':
        setWidgetFormData({
          oai_assistant_id: 0, // Start with no selection to force user choice
          business_id: parseInt(selectedBusinessId || '0', 10),
          widget_name: '',
          minimizable: true,
          desktop_minimized_type: 'bubble',
          mobile_minimized_type: 'bubble',
          top_radius: 10,
          bottom_radius: 10,
          box_size_width: 350,
          box_size_height: 500,
          minimized_width: 60,
          minimized_height: 60,
          desktop_screen_position: 'bottom-right',
          mobile_screen_position: 'bottom-right',
          attention_getter: false,
          header_color: '#3B82F6',
          agent_text_color: '#FFFFFF',
          header_text_color: '#FFFFFF',
          visitor_message_color: '#F3F4F6',
          agent_message_color: '#EFF6FF',
          visitor_text_color: '#1F2937',
          welcome_message: '¡Hola! ¿En qué puedo ayudarte?',
          powered_by_message: 'Powered by LetParley',
          is_active: true,
        });
        break;
      case 'store':
        setStoreFormData({
          oai_assistant_id: 0, // Start with no selection to force user choice
          business_id: parseInt(selectedBusinessId || '0', 10),
          store: 'Nidux',
          name: '',
          store_url: '',
        });
        break;
    }

    setShowCreateModal(true);
  };

  const handleEditIntegration = (integration: any) => {
    setSelectedIntegration(integration);

    switch (activeTab) {
      case 'whatsapp':
        setWhatsappFormData({
          oai_assistant_id: integration.oai_assistant_id,
          business_id: integration.business_id,
          meta_access_token: integration.meta_access_token,
          meta_phone_number_id: integration.meta_phone_number_id,
          phone_number: integration.phone_number,
          name: integration.name,
        });
        break;
      case 'instagram':
        setInstagramFormData({
          oai_assistant_id: integration.oai_assistant_id,
          business_id: integration.business_id,
          meta_access_token: integration.meta_access_token,
          instagram_account_id: integration.instagram_account_id,
          name: integration.name,
        });
        break;
      case 'widget':
        setWidgetFormData({
          oai_assistant_id: integration.oai_assistant_id,
          business_id: integration.business_id,
          widget_name: integration.widget_name,
          minimizable: integration.minimizable,
          desktop_minimized_type: integration.desktop_minimized_type,
          mobile_minimized_type: integration.mobile_minimized_type,
          top_radius: integration.top_radius,
          bottom_radius: integration.bottom_radius,
          box_size_width: integration.box_size_width,
          box_size_height: integration.box_size_height,
          minimized_width: integration.minimized_width,
          minimized_height: integration.minimized_height,
          desktop_screen_position: integration.desktop_screen_position,
          mobile_screen_position: integration.mobile_screen_position,
          attention_getter: integration.attention_getter,
          attention_getter_image: integration.attention_getter_image,
          header_color: integration.header_color,
          agent_text_color: integration.agent_text_color,
          header_text_color: integration.header_text_color,
          visitor_message_color: integration.visitor_message_color,
          agent_message_color: integration.agent_message_color,
          visitor_text_color: integration.visitor_text_color,
          logo_image_url: integration.logo_image_url,
          welcome_message: integration.welcome_message,
          powered_by_message: integration.powered_by_message,
          is_active: integration.is_active,
        });
        break;
      case 'store':
        setStoreFormData({
          oai_assistant_id: integration.oai_assistant_id,
          business_id: integration.business_id,
          store: integration.store,
          name: integration.name,
          store_url: integration.store_url,
          store_id: integration.store_id,
          base_url: integration.base_url,
          username: integration.username,
          password: integration.password,
          shop_name: integration.shop_name,
          access_token: integration.access_token,
          consumer_key: integration.consumer_key,
          consumer_secret: integration.consumer_secret,
        });
        break;
    }

    setShowEditModal(true);
  };

  const handleDeleteIntegration = (integration: any) => {
    setSelectedIntegration(integration);
    setShowDeleteModal(true);
  };

  const handleSubmitCreate = async () => {
    setIsSubmitting(true);

    try {
      switch (activeTab) {
        case 'whatsapp':
          await createWhatsAppIntegration(whatsappFormData);
          break;
        case 'instagram':
          await createInstagramIntegration(instagramFormData);
          break;
        case 'widget':
          await createWidgetIntegration(widgetFormData);
          break;
        case 'store':
          await createStoreIntegration(storeFormData);
          break;
      }

      setShowCreateModal(false);
      loadTabData();
    } catch (error) {
      console.error('Error creating integration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubmitEdit = async () => {
    if (!selectedIntegration) return;

    setIsSubmitting(true);

    try {
      switch (activeTab) {
        case 'whatsapp':
          await updateWhatsAppIntegration(selectedIntegration.oaia_whatsapp_id, whatsappFormData);
          break;
        case 'instagram':
          await updateInstagramIntegration(
            selectedIntegration.tbl_oaia_instagram_account_id,
            instagramFormData,
          );
          break;
        case 'widget':
          await updateWidgetIntegration(selectedIntegration.oaia_widget_id, widgetFormData);
          break;
        case 'store':
          await updateStoreIntegration(selectedIntegration.oaia_store_id, storeFormData);
          break;
      }

      setShowEditModal(false);
      loadTabData();
    } catch (error) {
      console.error('Error updating integration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedIntegration) return;

    setIsSubmitting(true);

    try {
      switch (activeTab) {
        case 'whatsapp':
          await deleteWhatsAppIntegration(selectedIntegration.oaia_whatsapp_id);
          break;
        case 'instagram':
          await deleteInstagramIntegration(selectedIntegration.tbl_oaia_instagram_account_id);
          break;
        case 'widget':
          await deleteWidgetIntegration(selectedIntegration.oaia_widget_id);
          break;
        case 'store':
          await deleteStoreIntegration(selectedIntegration.oaia_store_id);
          break;
      }

      setShowDeleteModal(false);
      loadTabData();
    } catch (error) {
      console.error('Error deleting integration:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAssignAssistant = async (integration: any, assistantId: number | null) => {
    setIsSubmitting(true);

    try {
      switch (activeTab) {
        case 'whatsapp':
          await assignAssistantToWhatsApp(integration.oaia_whatsapp_id, assistantId);
          break;
        case 'instagram':
          await assignAssistantToInstagram(integration.tbl_oaia_instagram_account_id, assistantId);
          break;
        case 'widget':
          await assignAssistantToWidget(integration.oaia_widget_id, assistantId);
          break;
        case 'store':
          await assignAssistantToStore(integration.oaia_store_id, assistantId);
          break;
      }

      loadTabData();
    } catch (error) {
      console.error('Error assigning assistant:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleRefresh = () => {
    clearAllErrors();
    loadTabData();
  };

  // Filter integrations based on search query
  const getFilteredIntegrations = () => {
    const query = searchQuery.toLowerCase();

    switch (activeTab) {
      case 'whatsapp':
        return whatsappIntegrations.filter(
          (integration) =>
            (integration.name ?? '').toLowerCase().includes(query) ||
            (integration.phone_number ?? '').toLowerCase().includes(query),
        );
      case 'instagram':
        return instagramIntegrations
          ? instagramIntegrations.filter(
              (integration) =>
                (integration.name ?? '').toLowerCase().includes(query) ||
                (integration.instagram_account_id ?? '').toLowerCase().includes(query),
            )
          : [];
      case 'widget':
        return widgetIntegrations.filter((integration) =>
          (integration.widget_name ?? '').toLowerCase().includes(query),
        );
      case 'store':
        return storeIntegrations.filter(
          (integration) =>
            (integration.name ?? '').toLowerCase().includes(query) ||
            (integration.store_url ?? '').toLowerCase().includes(query),
        );
      default:
        return [];
    }
  };

  // Get current error based on active tab
  const getCurrentError = () => {
    switch (activeTab) {
      case 'whatsapp':
        return whatsAppError;
      case 'instagram':
        return instagramError;
      case 'widget':
        return widgetError;
      case 'store':
        return storeError;
      default:
        return null;
    }
  };

  // Clear current error based on active tab
  const clearCurrentError = () => {
    switch (activeTab) {
      case 'whatsapp':
        clearWhatsAppError();
        break;
      case 'instagram':
        clearInstagramError();
        break;
      case 'widget':
        clearWidgetError();
        break;
      case 'store':
        clearStoreError();
        break;
    }
  };

  // Get loading state based on active tab
  const isLoading = () => {
    switch (activeTab) {
      case 'whatsapp':
        return isLoadingWhatsApp;
      case 'instagram':
        return isLoadingInstagram;
      case 'widget':
        return isLoadingWidget;
      case 'store':
        return isLoadingStore;
      default:
        return false;
    }
  };

  // Handle file upload for widget
  const handleFileUpload = async (file: File, field: string) => {
    try {
      const result = await uploadImage(file);

      if (result.file_url) {
        if (field === 'logo') {
          setWidgetFormData((prev) => ({ ...prev, logo_image_url: result.file_url }));
        } else if (field === 'attention') {
          setWidgetFormData((prev) => ({ ...prev, attention_getter_image: result.file_url }));
        }
        return result.file_url;
      }

      throw new Error(result.message || 'Upload failed');
    } catch (error) {
      console.error('Image upload failed:', error);
      throw error;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Integraciones</h1>
          <p className="text-gray-600">
            Conecta LetParley con tus canales de comunicación y sistemas
          </p>
        </div>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={isLoading()}
            className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-full transition-colors"
            title="Actualizar"
          >
            <RefreshCw className={`h-5 w-5 ${isLoading() ? 'animate-spin' : ''}`} />
          </button>

          <button
            onClick={handleCreateIntegration}
            disabled={!assistants || assistants.length === 0 || isLoadingAssistants}
            className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors"
            title={
              !assistants || assistants.length === 0
                ? 'Necesitas crear un asistente primero'
                : 'Nueva Integración'
            }
          >
            <Plus className="h-5 w-5 mr-2" />
            Nueva Integración
          </button>
        </div>
      </div>

      {/* Error Message */}
      {getCurrentError() && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 flex items-start space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <p className="text-sm text-red-700">{getCurrentError()}</p>
          </div>
          <button onClick={clearCurrentError} className="text-red-500 hover:text-red-700">
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* No Assistants Warning */}
      {(!assistants || assistants.length === 0) && !isLoadingAssistants && (
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 flex items-start space-x-2">
          <Info className="h-5 w-5 text-amber-500 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="text-sm font-medium text-amber-800 mb-1">Se requiere un asistente</h3>
            <p className="text-sm text-amber-700 mb-3">
              Para crear integraciones necesitas tener al menos un asistente configurado. Los
              asistentes son los que responderán automáticamente a los mensajes en tus canales.
            </p>
            <button
              onClick={() => navigateTo('assistants')}
              className="inline-flex items-center px-3 py-1.5 bg-amber-600 text-white text-sm rounded-md hover:bg-amber-700 transition-colors"
            >
              <Bot className="h-4 w-4 mr-1.5" />
              Crear mi primer asistente
            </button>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="border-b border-gray-200">
        <nav className="-mb-px flex space-x-8">
          <button
            onClick={() => setActiveTab('whatsapp')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'whatsapp'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <MessageCircle className="h-4 w-4 inline mr-2" />
            WhatsApp
          </button>
          <button
            onClick={() => setActiveTab('instagram')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'instagram'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Instagram className="h-4 w-4 inline mr-2" />
            Instagram
          </button>
          <button
            onClick={() => setActiveTab('widget')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'widget'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <Globe className="h-4 w-4 inline mr-2" />
            Widget
          </button>
          <button
            onClick={() => setActiveTab('store')}
            className={`py-2 px-1 border-b-2 font-medium text-sm ${
              activeTab === 'store'
                ? 'border-primary text-primary'
                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
            }`}
          >
            <ShoppingBag className="h-4 w-4 inline mr-2" />
            Tiendas
          </button>
        </nav>
      </div>

      {/* Search */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder={`Buscar ${
              activeTab === 'whatsapp'
                ? 'conexiones de WhatsApp'
                : activeTab === 'instagram'
                  ? 'conexiones de Instagram'
                  : activeTab === 'widget'
                    ? 'widgets'
                    : 'conexiones de tiendas'
            }...`}
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
          />
        </div>
      </div>

      {/* Content */}
      <div>
        {isLoading() ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            {/* WhatsApp Integrations */}
            {activeTab === 'whatsapp' && (
              <WhatsAppIntegrationsList
                integrations={getFilteredIntegrations()}
                assistants={assistants}
                onEdit={handleEditIntegration}
                onDelete={handleDeleteIntegration}
                onAssignAssistant={handleAssignAssistant}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Instagram Integrations */}
            {activeTab === 'instagram' && (
              <InstagramIntegrationsList
                integrations={getFilteredIntegrations()}
                assistants={assistants}
                onEdit={handleEditIntegration}
                onDelete={handleDeleteIntegration}
                onAssignAssistant={handleAssignAssistant}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Widget Integrations */}
            {activeTab === 'widget' && (
              <WidgetIntegrationsList
                integrations={getFilteredIntegrations()}
                assistants={assistants}
                onEdit={handleEditIntegration}
                onDelete={handleDeleteIntegration}
                onAssignAssistant={handleAssignAssistant}
                isSubmitting={isSubmitting}
              />
            )}

            {/* Store Integrations */}
            {activeTab === 'store' && (
              <StoreIntegrationsList
                integrations={getFilteredIntegrations()}
                assistants={assistants}
                onEdit={handleEditIntegration}
                onDelete={handleDeleteIntegration}
                onAssignAssistant={handleAssignAssistant}
                isSubmitting={isSubmitting}
              />
            )}
          </>
        )}
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'whatsapp'
                  ? 'Agregar Conexión de WhatsApp'
                  : activeTab === 'instagram'
                    ? 'Agregar Conexión de Instagram'
                    : activeTab === 'widget'
                      ? 'Crear Widget'
                      : 'Agregar Conexión de Tienda'}
              </h2>
              <button
                onClick={() => setShowCreateModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'whatsapp' && (
                <WhatsAppForm
                  formData={whatsappFormData}
                  setFormData={setWhatsappFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitCreate}
                  onCancel={() => setShowCreateModal(false)}
                />
              )}

              {activeTab === 'instagram' && (
                <InstagramForm
                  formData={instagramFormData}
                  setFormData={setInstagramFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitCreate}
                  onCancel={() => setShowCreateModal(false)}
                />
              )}

              {activeTab === 'widget' && (
                <WidgetForm
                  formData={widgetFormData}
                  setFormData={setWidgetFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitCreate}
                  onCancel={() => setShowCreateModal(false)}
                  onUploadFile={handleFileUpload}
                />
              )}

              {activeTab === 'store' && (
                <StoreForm
                  formData={storeFormData}
                  setFormData={setStoreFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitCreate}
                  onCancel={() => setShowCreateModal(false)}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {showEditModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeTab === 'whatsapp'
                  ? 'Editar Conexión de WhatsApp'
                  : activeTab === 'instagram'
                    ? 'Editar Conexión de Instagram'
                    : activeTab === 'widget'
                      ? 'Editar Widget'
                      : 'Editar Conexión de Tienda'}
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X className="h-6 w-6" />
              </button>
            </div>

            <div className="p-6">
              {activeTab === 'whatsapp' && (
                <WhatsAppForm
                  formData={whatsappFormData}
                  setFormData={setWhatsappFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitEdit}
                  onCancel={() => setShowEditModal(false)}
                  isEditMode={true}
                />
              )}

              {activeTab === 'instagram' && (
                <InstagramForm
                  formData={instagramFormData}
                  setFormData={setInstagramFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitEdit}
                  onCancel={() => setShowEditModal(false)}
                  isEditMode={true}
                />
              )}

              {activeTab === 'widget' && (
                <WidgetForm
                  formData={widgetFormData}
                  setFormData={setWidgetFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitEdit}
                  onCancel={() => setShowEditModal(false)}
                  isEditMode={true}
                  onUploadFile={handleFileUpload}
                />
              )}

              {activeTab === 'store' && (
                <StoreForm
                  formData={storeFormData}
                  setFormData={setStoreFormData}
                  assistants={assistants}
                  isSubmitting={isSubmitting}
                  onSubmit={handleSubmitEdit}
                  onCancel={() => setShowEditModal(false)}
                  isEditMode={true}
                />
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && selectedIntegration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center text-red-600 mb-4">
                <AlertCircle className="h-6 w-6 mr-2" />
                <h3 className="text-lg font-bold">Confirmar eliminación</h3>
              </div>

              <p className="text-gray-700 mb-6">
                ¿Estás seguro de que deseas eliminar esta
                {activeTab === 'whatsapp'
                  ? ' conexión de WhatsApp'
                  : activeTab === 'instagram'
                    ? ' conexión de Instagram'
                    : activeTab === 'widget'
                      ? ' widget'
                      : ' conexión de tienda'}
                ? Esta acción no se puede deshacer.
              </p>

              <div className="flex justify-end space-x-3">
                <button
                  onClick={() => setShowDeleteModal(false)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleConfirmDelete}
                  disabled={isSubmitting}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                >
                  {isSubmitting ? (
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
        </div>
      )}
    </div>
  );
};

// WhatsApp Integrations List Component
const WhatsAppIntegrationsList = ({
  integrations,
  assistants,
  onEdit,
  onDelete,
  onAssignAssistant,
  isSubmitting,
}: {
  integrations: WhatsAppIntegration[];
  assistants: any[];
  onEdit: (integration: any) => void;
  onDelete: (integration: any) => void;
  onAssignAssistant: (integration: any, assistantId: number | null) => void;
  isSubmitting: boolean;
}) => {
  if (!integrations || integrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <MessageCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conexiones de WhatsApp</h3>
        <p className="text-gray-500 mb-6">
          Conecta tu cuenta de WhatsApp Business para comenzar a recibir mensajes
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <div
          key={integration.oaia_whatsapp_id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600">
                <MessageCircle className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.phone_number}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getIntegrationStatusColor(
                integration.is_active,
              )}`}
            >
              {getIntegrationStatusText(integration.is_active)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Asistente:</span>
              <span className="font-medium">{integration.assistant_name || 'No asignado'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">ID de Teléfono:</span>
              <span className="font-medium text-gray-900">{integration.meta_phone_number_id}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <select
                value={integration.oai_assistant_id || ''}
                onChange={(e) =>
                  onAssignAssistant(
                    integration,
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                disabled={isSubmitting}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Sin asistente</option>
                {(assistants || []).map((assistant) => (
                  <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(integration)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(integration)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Instagram Integrations List Component
const InstagramIntegrationsList = ({
  integrations,
  assistants,
  onEdit,
  onDelete,
  onAssignAssistant,
  isSubmitting,
}: {
  integrations: InstagramIntegration[];
  assistants: any[];
  onEdit: (integration: any) => void;
  onDelete: (integration: any) => void;
  onAssignAssistant: (integration: any, assistantId: number | null) => void;
  isSubmitting: boolean;
}) => {
  if (!integrations || integrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Instagram className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conexiones de Instagram</h3>
        <p className="text-gray-500 mb-6">
          Conecta tu cuenta de Instagram Business para comenzar a recibir mensajes
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <div
          key={integration.tbl_oaia_instagram_account_id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-pink-100 rounded-lg flex items-center justify-center text-pink-600">
                <Instagram className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500">Instagram Business</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getIntegrationStatusColor(
                integration.is_active,
              )}`}
            >
              {getIntegrationStatusText(integration.is_active)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Asistente:</span>
              <span className="font-medium">{integration.assistant_name || 'No asignado'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">ID de Cuenta:</span>
              <span className="font-medium text-gray-900">{integration.instagram_account_id}</span>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <select
                value={integration.oai_assistant_id || ''}
                onChange={(e) =>
                  onAssignAssistant(
                    integration,
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                disabled={isSubmitting}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Sin asistente</option>
                {(assistants || []).map((assistant) => (
                  <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(integration)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(integration)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Widget Integrations List Component
const WidgetIntegrationsList = ({
  integrations,
  assistants,
  onEdit,
  onDelete,
  onAssignAssistant,
  isSubmitting,
}: {
  integrations: WidgetIntegration[];
  assistants: any[];
  onEdit: (integration: any) => void;
  onDelete: (integration: any) => void;
  onAssignAssistant: (integration: any, assistantId: number | null) => void;
  isSubmitting: boolean;
}) => {
  if (!integrations || integrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <Globe className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay widgets</h3>
        <p className="text-gray-500 mb-6">
          Crea un widget para tu sitio web para comenzar a recibir mensajes
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <div
          key={integration.oaia_widget_id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600">
                <Globe className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{integration.widget_name}</h3>
                <p className="text-sm text-gray-500">Widget Web</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getIntegrationStatusColor(
                integration.is_active,
              )}`}
            >
              {getIntegrationStatusText(integration.is_active)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Asistente:</span>
              <span className="font-medium">{integration.assistant_name || 'No asignado'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Posición:</span>
              <span className="font-medium text-gray-900">
                {integration.desktop_screen_position}
              </span>
            </div>

            {integration.embed_code && (
              <div className="mt-3">
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(integration.embed_code || '');
                    alert('Código copiado al portapapeles');
                  }}
                  className="w-full px-3 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm flex items-center justify-center"
                >
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Copiar Código de Embed
                </button>
              </div>
            )}
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <select
                value={integration.oai_assistant_id || ''}
                onChange={(e) =>
                  onAssignAssistant(
                    integration,
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                disabled={isSubmitting}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Sin asistente</option>
                {(assistants || []).map((assistant) => (
                  <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(integration)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(integration)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Store Integrations List Component
const StoreIntegrationsList = ({
  integrations,
  assistants,
  onEdit,
  onDelete,
  onAssignAssistant,
  isSubmitting,
}: {
  integrations: StoreIntegration[];
  assistants: any[];
  onEdit: (integration: any) => void;
  onDelete: (integration: any) => void;
  onAssignAssistant: (integration: any, assistantId: number | null) => void;
  isSubmitting: boolean;
}) => {
  if (!integrations || integrations.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-12 text-center">
        <ShoppingBag className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">No hay conexiones de tiendas</h3>
        <p className="text-gray-500 mb-6">
          Conecta tu tienda para comenzar a recibir información de productos
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {integrations.map((integration) => (
        <div
          key={integration.oaia_store_id}
          className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{integration.name}</h3>
                <p className="text-sm text-gray-500">{integration.store}</p>
              </div>
            </div>
            <span
              className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getIntegrationStatusColor(
                integration.is_active,
              )}`}
            >
              {getIntegrationStatusText(integration.is_active)}
            </span>
          </div>

          <div className="space-y-3 mb-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">Asistente:</span>
              <span className="font-medium">{integration.assistant_name || 'No asignado'}</span>
            </div>

            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-600">URL:</span>
              <a
                href={integration.store_url}
                target="_blank"
                rel="noopener noreferrer"
                className="font-medium text-blue-600 hover:text-blue-800 flex items-center"
              >
                <span className="truncate max-w-[150px]">{integration.store_url}</span>
                <ExternalLink className="h-3 w-3 ml-1 flex-shrink-0" />
              </a>
            </div>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-gray-100">
            <div className="flex items-center space-x-2">
              <select
                value={integration.oai_assistant_id || ''}
                onChange={(e) =>
                  onAssignAssistant(
                    integration,
                    e.target.value ? parseInt(e.target.value, 10) : null,
                  )
                }
                disabled={isSubmitting}
                className="text-sm border border-gray-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary"
              >
                <option value="">Sin asistente</option>
                {(assistants || []).map((assistant) => (
                  <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => onEdit(integration)}
                className="p-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded"
                title="Editar"
              >
                <Edit className="h-4 w-4" />
              </button>
              <button
                onClick={() => onDelete(integration)}
                className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                title="Eliminar"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

// Form Components
const WhatsAppForm = ({
  formData,
  setFormData,
  assistants,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditMode = false,
}: {
  formData: any;
  setFormData: (data: any) => void;
  assistants: any[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Conexión *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Ej: WhatsApp Ventas"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Access Token *
          </label>
          <input
            type="text"
            value={formData.meta_access_token}
            onChange={(e) => setFormData({ ...formData, meta_access_token: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="EAABZCz..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">
            Token de acceso de la API de WhatsApp Business
          </p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Phone Number ID *
          </label>
          <input
            type="text"
            value={formData.meta_phone_number_id}
            onChange={(e) => setFormData({ ...formData, meta_phone_number_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="1234567890"
            required
          />
          <p className="text-xs text-gray-500 mt-1">ID del número de teléfono en Meta Business</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Número de Teléfono *
          </label>
          <input
            type="text"
            value={formData.phone_number}
            onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="+50612345678"
            required
          />
          <p className="text-xs text-gray-500 mt-1">Número de teléfono con código de país</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asistente *</label>
          <select
            value={formData.oai_assistant_id || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                oai_assistant_id: e.target.value ? parseInt(e.target.value, 10) : null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Seleccionar asistente</option>
            {(assistants || []).map((assistant) => (
              <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                {assistant.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Asistente que responderá automáticamente a los mensajes
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              {isEditMode ? 'Actualizando...' : 'Creando...'}
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 inline mr-2" />
              {isEditMode ? 'Actualizar' : 'Crear'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Instagram Form Component
const InstagramForm = ({
  formData,
  setFormData,
  assistants,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditMode = false,
}: {
  formData: any;
  setFormData: (data: any) => void;
  assistants: any[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
}) => {
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Conexión *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Ej: Instagram Marketing"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Meta Access Token *
          </label>
          <input
            type="text"
            value={formData.meta_access_token}
            onChange={(e) => setFormData({ ...formData, meta_access_token: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="EAABZCz..."
            required
          />
          <p className="text-xs text-gray-500 mt-1">Token de acceso de la API de Meta Business</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instagram Account ID *
          </label>
          <input
            type="text"
            value={formData.instagram_account_id}
            onChange={(e) => setFormData({ ...formData, instagram_account_id: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="1234567890"
            required
          />
          <p className="text-xs text-gray-500 mt-1">ID de la cuenta de Instagram Business</p>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asistente *</label>
          <select
            value={formData.oai_assistant_id || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                oai_assistant_id: e.target.value ? parseInt(e.target.value, 10) : null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Seleccionar asistente</option>
            {(assistants || []).map((assistant) => (
              <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                {assistant.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Asistente que responderá automáticamente a los mensajes
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              {isEditMode ? 'Actualizando...' : 'Creando...'}
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 inline mr-2" />
              {isEditMode ? 'Actualizar' : 'Crear'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Widget Form Component
const WidgetForm = ({
  formData,
  setFormData,
  assistants,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditMode = false,
  onUploadFile,
}: {
  formData: any;
  setFormData: (data: any) => void;
  assistants: any[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
  onUploadFile: (file: File, field: string) => Promise<string>;
}) => {
  const positionOptions = getWidgetPositionOptions();
  const minimizedTypeOptions = getWidgetMinimizedTypeOptions();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Información Básica</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre del Widget *
              </label>
              <input
                type="text"
                value={formData.widget_name}
                onChange={(e) => setFormData({ ...formData, widget_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="Ej: Widget Soporte"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Asistente *</label>
              <select
                value={formData.oai_assistant_id || ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    oai_assistant_id: e.target.value ? parseInt(e.target.value, 10) : null,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                required
              >
                <option value="">Seleccionar asistente</option>
                {(assistants || []).map((assistant) => (
                  <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                    {assistant.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Apariencia</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Cabecera
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.header_color}
                  onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                  className="w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.header_color}
                  onChange={(e) => setFormData({ ...formData, header_color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="#3B82F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Texto de Cabecera
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.header_text_color}
                  onChange={(e) => setFormData({ ...formData, header_text_color: e.target.value })}
                  className="w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.header_text_color}
                  onChange={(e) => setFormData({ ...formData, header_text_color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Mensajes del Visitante
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.visitor_message_color}
                  onChange={(e) =>
                    setFormData({ ...formData, visitor_message_color: e.target.value })
                  }
                  className="w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.visitor_message_color}
                  onChange={(e) =>
                    setFormData({ ...formData, visitor_message_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="#F3F4F6"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Texto del Visitante
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.visitor_text_color}
                  onChange={(e) => setFormData({ ...formData, visitor_text_color: e.target.value })}
                  className="w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.visitor_text_color}
                  onChange={(e) => setFormData({ ...formData, visitor_text_color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="#1F2937"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Mensajes del Agente
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.agent_message_color}
                  onChange={(e) =>
                    setFormData({ ...formData, agent_message_color: e.target.value })
                  }
                  className="w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.agent_message_color}
                  onChange={(e) =>
                    setFormData({ ...formData, agent_message_color: e.target.value })
                  }
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="#EFF6FF"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Color de Texto del Agente
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="color"
                  value={formData.agent_text_color}
                  onChange={(e) => setFormData({ ...formData, agent_text_color: e.target.value })}
                  className="w-10 h-10 border border-gray-300 rounded-md"
                />
                <input
                  type="text"
                  value={formData.agent_text_color}
                  onChange={(e) => setFormData({ ...formData, agent_text_color: e.target.value })}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                  placeholder="#FFFFFF"
                />
              </div>
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Posición y Tamaño</h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición en Escritorio
              </label>
              <select
                value={formData.desktop_screen_position}
                onChange={(e) =>
                  setFormData({ ...formData, desktop_screen_position: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Posición en Móvil
              </label>
              <select
                value={formData.mobile_screen_position}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_screen_position: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {positionOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Minimizado en Escritorio
              </label>
              <select
                value={formData.desktop_minimized_type}
                onChange={(e) =>
                  setFormData({ ...formData, desktop_minimized_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {minimizedTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tipo Minimizado en Móvil
              </label>
              <select
                value={formData.mobile_minimized_type}
                onChange={(e) =>
                  setFormData({ ...formData, mobile_minimized_type: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
              >
                {minimizedTypeOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Ancho del Widget (px)
              </label>
              <input
                type="number"
                value={formData.box_size_width}
                onChange={(e) =>
                  setFormData({ ...formData, box_size_width: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                min="200"
                max="500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Alto del Widget (px)
              </label>
              <input
                type="number"
                value={formData.box_size_height}
                onChange={(e) =>
                  setFormData({ ...formData, box_size_height: parseInt(e.target.value, 10) })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                min="300"
                max="700"
              />
            </div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 mb-4">Contenido</h3>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensaje de Bienvenida
              </label>
              <textarea
                value={formData.welcome_message}
                onChange={(e) => setFormData({ ...formData, welcome_message: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                rows={3}
                placeholder="¡Hola! ¿En qué puedo ayudarte?"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="minimizable"
                checked={formData.minimizable}
                onChange={(e) => setFormData({ ...formData, minimizable: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="minimizable" className="ml-2 block text-sm text-gray-700">
                Permitir minimizar el widget
              </label>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="attention_getter"
                checked={formData.attention_getter}
                onChange={(e) => setFormData({ ...formData, attention_getter: e.target.checked })}
                className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
              />
              <label htmlFor="attention_getter" className="ml-2 block text-sm text-gray-700">
                Mostrar attention getter
              </label>
            </div>

            {formData.attention_getter && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imagen de Attention Getter
                </label>
                <ImageUploader
                  label="Imagen de Attention Getter"
                  name="attention_getter_image"
                  value={formData.attention_getter_image || ''}
                  onChange={(url) => setFormData({ ...formData, attention_getter_image: url })}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Logo del Widget
              </label>
              <ImageUploader
                label="Logo del Widget"
                name="logo_image_url"
                value={formData.logo_image_url || ''}
                onChange={(url) => setFormData({ ...formData, logo_image_url: url })}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              {isEditMode ? 'Actualizando...' : 'Creando...'}
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 inline mr-2" />
              {isEditMode ? 'Actualizar' : 'Crear'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

// Store Form Component
const StoreForm = ({
  formData,
  setFormData,
  assistants,
  isSubmitting,
  onSubmit,
  onCancel,
  isEditMode = false,
}: {
  formData: any;
  setFormData: (data: any) => void;
  assistants: any[];
  isSubmitting: boolean;
  onSubmit: () => void;
  onCancel: () => void;
  isEditMode?: boolean;
}) => {
  const requiredFields = getRequiredFieldsForStoreProvider(formData.store as StoreProvider);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        onSubmit();
      }}
    >
      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Tipo de Tienda *</label>
          <select
            value={formData.store}
            onChange={(e) => setFormData({ ...formData, store: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            required
          >
            <option value="Nidux">Nidux</option>
            <option value="Shopify">Shopify</option>
            <option value="WooCommerce">WooCommerce</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Nombre de la Tienda *
          </label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="Ej: Mi Tienda Online"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">URL de la Tienda *</label>
          <input
            type="url"
            value={formData.store_url}
            onChange={(e) => setFormData({ ...formData, store_url: e.target.value })}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            placeholder="https://mitienda.com"
            required
          />
        </div>

        {/* Nidux specific fields */}
        {formData.store === 'Nidux' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ID de Tienda {requiredFields.includes('store_id') && '*'}
              </label>
              <input
                type="text"
                value={formData.store_id || ''}
                onChange={(e) => setFormData({ ...formData, store_id: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="12345"
                required={requiredFields.includes('store_id')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                URL Base {requiredFields.includes('base_url') && '*'}
              </label>
              <input
                type="url"
                value={formData.base_url || ''}
                onChange={(e) => setFormData({ ...formData, base_url: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="https://api.nidux.com"
                required={requiredFields.includes('base_url')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Usuario {requiredFields.includes('username') && '*'}
              </label>
              <input
                type="text"
                value={formData.username || ''}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="usuario"
                required={requiredFields.includes('username')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Contraseña {requiredFields.includes('password') && '*'}
              </label>
              <input
                type="password"
                value={formData.password || ''}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="••••••••"
                required={requiredFields.includes('password')}
              />
            </div>
          </>
        )}

        {/* Shopify specific fields */}
        {formData.store === 'Shopify' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Nombre de la Tienda {requiredFields.includes('shop_name') && '*'}
              </label>
              <input
                type="text"
                value={formData.shop_name || ''}
                onChange={(e) => setFormData({ ...formData, shop_name: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="mitienda"
                required={requiredFields.includes('shop_name')}
              />
              <p className="text-xs text-gray-500 mt-1">
                El nombre de la tienda en Shopify (ej: mitienda.myshopify.com)
              </p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Access Token {requiredFields.includes('access_token') && '*'}
              </label>
              <input
                type="text"
                value={formData.access_token || ''}
                onChange={(e) => setFormData({ ...formData, access_token: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="shpat_..."
                required={requiredFields.includes('access_token')}
              />
            </div>
          </>
        )}

        {/* WooCommerce specific fields */}
        {formData.store === 'WooCommerce' && (
          <>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Key {requiredFields.includes('consumer_key') && '*'}
              </label>
              <input
                type="text"
                value={formData.consumer_key || ''}
                onChange={(e) => setFormData({ ...formData, consumer_key: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="ck_..."
                required={requiredFields.includes('consumer_key')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Consumer Secret {requiredFields.includes('consumer_secret') && '*'}
              </label>
              <input
                type="text"
                value={formData.consumer_secret || ''}
                onChange={(e) => setFormData({ ...formData, consumer_secret: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
                placeholder="cs_..."
                required={requiredFields.includes('consumer_secret')}
              />
            </div>
          </>
        )}

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Asistente *</label>
          <select
            value={formData.oai_assistant_id || ''}
            onChange={(e) =>
              setFormData({
                ...formData,
                oai_assistant_id: e.target.value ? parseInt(e.target.value, 10) : null,
              })
            }
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            required
          >
            <option value="">Seleccionar asistente</option>
            {(assistants || []).map((assistant) => (
              <option key={assistant.oai_assistant_id} value={assistant.oai_assistant_id}>
                {assistant.name}
              </option>
            ))}
          </select>
          <p className="text-xs text-gray-500 mt-1">
            Asistente que utilizará la información de la tienda (requerido)
          </p>
        </div>
      </div>

      <div className="flex justify-end space-x-3 mt-8">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
        >
          Cancelar
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark disabled:opacity-50"
        >
          {isSubmitting ? (
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
              {isEditMode ? 'Actualizando...' : 'Creando...'}
            </div>
          ) : (
            <>
              <Save className="h-4 w-4 inline mr-2" />
              {isEditMode ? 'Actualizar' : 'Crear'}
            </>
          )}
        </button>
      </div>
    </form>
  );
};

export default IntegrationsPage;
