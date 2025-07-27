import { create } from 'zustand';
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
  integrationApi,
} from '../services/integrationService';
import { useAuthStore } from './authStore';

interface IntegrationState {
  // WhatsApp
  whatsappIntegrations: WhatsAppIntegration[];
  selectedWhatsApp: WhatsAppIntegration | null;
  isLoadingWhatsApp: boolean;
  isCreatingWhatsApp: boolean;
  isUpdatingWhatsApp: boolean;
  isDeletingWhatsApp: boolean;
  whatsAppError: string | null;

  // Instagram
  instagramIntegrations: InstagramIntegration[];
  selectedInstagram: InstagramIntegration | null;
  isLoadingInstagram: boolean;
  isCreatingInstagram: boolean;
  isUpdatingInstagram: boolean;
  isDeletingInstagram: boolean;
  instagramError: string | null;

  // Widget
  widgetIntegrations: WidgetIntegration[];
  selectedWidget: WidgetIntegration | null;
  isLoadingWidget: boolean;
  isCreatingWidget: boolean;
  isUpdatingWidget: boolean;
  isDeletingWidget: boolean;
  widgetError: string | null;

  // Store
  storeIntegrations: StoreIntegration[];
  selectedStore: StoreIntegration | null;
  isLoadingStore: boolean;
  isCreatingStore: boolean;
  isUpdatingStore: boolean;
  isDeletingStore: boolean;
  storeError: string | null;

  // Common
  isAssigningAssistant: boolean;

  // Actions - WhatsApp
  fetchWhatsAppIntegrations: () => Promise<void>;
  createWhatsAppIntegration: (
    data: CreateWhatsAppIntegrationRequest,
  ) => Promise<WhatsAppIntegration | null>;
  updateWhatsAppIntegration: (
    id: number,
    data: UpdateWhatsAppIntegrationRequest,
  ) => Promise<boolean>;
  deleteWhatsAppIntegration: (id: number) => Promise<boolean>;
  assignAssistantToWhatsApp: (whatsappId: number, assistantId: number | null) => Promise<boolean>;
  setSelectedWhatsApp: (whatsapp: WhatsAppIntegration | null) => void;
  clearWhatsAppError: () => void;

  // Actions - Instagram
  fetchInstagramIntegrations: () => Promise<void>;
  createInstagramIntegration: (
    data: CreateInstagramIntegrationRequest,
  ) => Promise<InstagramIntegration | null>;
  updateInstagramIntegration: (
    id: number,
    data: UpdateInstagramIntegrationRequest,
  ) => Promise<boolean>;
  deleteInstagramIntegration: (id: number) => Promise<boolean>;
  assignAssistantToInstagram: (
    connectionId: number,
    assistantId: number | null,
  ) => Promise<boolean>;
  setSelectedInstagram: (instagram: InstagramIntegration | null) => void;
  clearInstagramError: () => void;

  // Actions - Widget
  fetchWidgetIntegrations: () => Promise<void>;
  createWidgetIntegration: (
    data: CreateWidgetIntegrationRequest,
  ) => Promise<WidgetIntegration | null>;
  updateWidgetIntegration: (id: number, data: UpdateWidgetIntegrationRequest) => Promise<boolean>;
  deleteWidgetIntegration: (id: number) => Promise<boolean>;
  assignAssistantToWidget: (widgetId: number, assistantId: number | null) => Promise<boolean>;
  setSelectedWidget: (widget: WidgetIntegration | null) => void;
  clearWidgetError: () => void;

  // Actions - Store
  fetchStoreIntegrations: (provider?: StoreProvider) => Promise<void>;
  createStoreIntegration: (data: CreateStoreIntegrationRequest) => Promise<StoreIntegration | null>;
  updateStoreIntegration: (id: number, data: UpdateStoreIntegrationRequest) => Promise<boolean>;
  deleteStoreIntegration: (id: number) => Promise<boolean>;
  assignAssistantToStore: (storeId: number, assistantId: number | null) => Promise<boolean>;
  setSelectedStore: (store: StoreIntegration | null) => void;
  clearStoreError: () => void;

  // Common actions
  clearAllErrors: () => void;
  clearAllData: () => void;
}

export const useIntegrationStore = create<IntegrationState>((set, get) => ({
  // Initial state - WhatsApp
  whatsappIntegrations: [],
  selectedWhatsApp: null,
  isLoadingWhatsApp: false,
  isCreatingWhatsApp: false,
  isUpdatingWhatsApp: false,
  isDeletingWhatsApp: false,
  whatsAppError: null,

  // Initial state - Instagram
  instagramIntegrations: [],
  selectedInstagram: null,
  isLoadingInstagram: false,
  isCreatingInstagram: false,
  isUpdatingInstagram: false,
  isDeletingInstagram: false,
  instagramError: null,

  // Initial state - Widget
  widgetIntegrations: [],
  selectedWidget: null,
  isLoadingWidget: false,
  isCreatingWidget: false,
  isUpdatingWidget: false,
  isDeletingWidget: false,
  widgetError: null,

  // Initial state - Store
  storeIntegrations: [],
  selectedStore: null,
  isLoadingStore: false,
  isCreatingStore: false,
  isUpdatingStore: false,
  isDeletingStore: false,
  storeError: null,

  // Common
  isAssigningAssistant: false,

  // Actions - WhatsApp
  fetchWhatsAppIntegrations: async () => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      set({ whatsAppError: 'No business selected' });
      return;
    }

    set({ isLoadingWhatsApp: true, whatsAppError: null });

    try {
      const response = await integrationApi.getWhatsAppIntegrations();
      set({ whatsappIntegrations: response.data || [] });
    } catch (error) {
      console.error('Error fetching WhatsApp integrations:', error);
      set({
        whatsAppError:
          error instanceof Error ? error.message : 'Error al cargar integraciones de WhatsApp',
      });
    } finally {
      set({ isLoadingWhatsApp: false });
    }
  },

  createWhatsAppIntegration: async (data) => {
    const { selectedBusinessId } = useAuthStore.getState();

    // Validate that assistant ID is provided and not null/0
    if (!data.oai_assistant_id || data.oai_assistant_id === 0) {
      set({ whatsAppError: 'Debe seleccionar un asistente para crear la integración de WhatsApp' });
      return null;
    }

    if (!selectedBusinessId) {
      set({ whatsAppError: 'No business selected' });
      return null;
    }

    set({ isCreatingWhatsApp: true, whatsAppError: null });

    try {
      const response = await integrationApi.createWhatsAppIntegration({
        ...data,
        business_id: parseInt(selectedBusinessId, 10),
      });

      // Update the list
      const { whatsappIntegrations } = get();
      set({ whatsappIntegrations: [...whatsappIntegrations, response.data] });

      return response.data;
    } catch (error) {
      console.error('Error creating WhatsApp integration:', error);
      set({
        whatsAppError:
          error instanceof Error ? error.message : 'Error al crear integración de WhatsApp',
      });
      return null;
    } finally {
      set({ isCreatingWhatsApp: false });
    }
  },

  updateWhatsAppIntegration: async (id, data) => {
    set({ isUpdatingWhatsApp: true, whatsAppError: null });

    try {
      await integrationApi.updateWhatsAppIntegration(id, data);

      // Update the list
      const { whatsappIntegrations } = get();
      const updatedIntegrations = whatsappIntegrations.map((integration) =>
        integration.oaia_whatsapp_id === id ? { ...integration, ...data } : integration,
      );

      set({ whatsappIntegrations: updatedIntegrations });

      // Update selected if it's the same
      const { selectedWhatsApp } = get();
      if (selectedWhatsApp && selectedWhatsApp.oaia_whatsapp_id === id) {
        set({ selectedWhatsApp: { ...selectedWhatsApp, ...data } });
      }

      return true;
    } catch (error) {
      console.error('Error updating WhatsApp integration:', error);
      set({
        whatsAppError:
          error instanceof Error ? error.message : 'Error al actualizar integración de WhatsApp',
      });
      return false;
    } finally {
      set({ isUpdatingWhatsApp: false });
    }
  },

  deleteWhatsAppIntegration: async (id) => {
    set({ isDeletingWhatsApp: true, whatsAppError: null });

    try {
      await integrationApi.deleteWhatsAppIntegration(id);

      // Update the list
      const { whatsappIntegrations } = get();
      set({
        whatsappIntegrations: whatsappIntegrations.filter(
          (integration) => integration.oaia_whatsapp_id !== id,
        ),
        selectedWhatsApp: null,
      });

      return true;
    } catch (error) {
      console.error('Error deleting WhatsApp integration:', error);
      set({
        whatsAppError:
          error instanceof Error ? error.message : 'Error al eliminar integración de WhatsApp',
      });
      return false;
    } finally {
      set({ isDeletingWhatsApp: false });
    }
  },

  assignAssistantToWhatsApp: async (whatsappId, assistantId) => {
    set({ isAssigningAssistant: true, whatsAppError: null });

    try {
      await integrationApi.assignAssistantToWhatsApp(whatsappId, assistantId);

      // Update the list
      await get().fetchWhatsAppIntegrations();

      return true;
    } catch (error) {
      console.error('Error assigning assistant to WhatsApp:', error);
      set({
        whatsAppError:
          error instanceof Error ? error.message : 'Error al asignar asistente a WhatsApp',
      });
      return false;
    } finally {
      set({ isAssigningAssistant: false });
    }
  },

  setSelectedWhatsApp: (whatsapp) => set({ selectedWhatsApp: whatsapp }),
  clearWhatsAppError: () => set({ whatsAppError: null }),

  // Actions - Instagram
  fetchInstagramIntegrations: async () => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      set({ instagramError: 'No business selected' });
      return;
    }

    set({ isLoadingInstagram: true, instagramError: null });

    try {
      const response = await integrationApi.getInstagramIntegrations();
      set({ instagramIntegrations: response.data || [] });
    } catch (error) {
      console.error('Error fetching Instagram integrations:', error);
      set({
        instagramError:
          error instanceof Error ? error.message : 'Error al cargar integraciones de Instagram',
      });
    } finally {
      set({ isLoadingInstagram: false });
    }
  },

  createInstagramIntegration: async (data) => {
    const { selectedBusinessId } = useAuthStore.getState();

    // Validate that assistant ID is provided and not null/0
    if (!data.oai_assistant_id || data.oai_assistant_id === 0) {
      set({
        instagramError: 'Debe seleccionar un asistente para crear la integración de Instagram',
      });
      return null;
    }

    if (!selectedBusinessId) {
      set({ instagramError: 'No business selected' });
      return null;
    }

    set({ isCreatingInstagram: true, instagramError: null });

    try {
      const response = await integrationApi.createInstagramIntegration({
        ...data,
        business_id: parseInt(selectedBusinessId, 10),
      });

      const { instagramIntegrations } = get();
      set({ instagramIntegrations: [...instagramIntegrations, response.data] });

      return response.data;
    } catch (error) {
      console.error('Error creating Instagram integration:', error);
      set({
        instagramError:
          error instanceof Error ? error.message : 'Error al crear integración de Instagram',
      });
      return null;
    } finally {
      set({ isCreatingInstagram: false });
    }
  },

  updateInstagramIntegration: async (id, data) => {
    set({ isUpdatingInstagram: true, instagramError: null });

    try {
      await integrationApi.updateInstagramIntegration(id, data);

      const { instagramIntegrations } = get();
      const updated = instagramIntegrations.map((intg) =>
        intg.tbl_oaia_instagram_account_id === id ? { ...intg, ...data } : intg,
      );
      set({ instagramIntegrations: updated });

      const { selectedInstagram } = get();
      if (selectedInstagram && selectedInstagram.tbl_oaia_instagram_account_id === id) {
        set({ selectedInstagram: { ...selectedInstagram, ...data } });
      }

      return true;
    } catch (error) {
      console.error('Error updating Instagram integration:', error);
      set({
        instagramError:
          error instanceof Error ? error.message : 'Error al actualizar integración de Instagram',
      });
      return false;
    } finally {
      set({ isUpdatingInstagram: false });
    }
  },

  deleteInstagramIntegration: async (id) => {
    set({ isDeletingInstagram: true, instagramError: null });

    try {
      await integrationApi.deleteInstagramIntegration(id);

      const { instagramIntegrations } = get();
      set({
        instagramIntegrations: instagramIntegrations.filter(
          (intg) => intg.tbl_oaia_instagram_account_id !== id,
        ),
        selectedInstagram: null,
      });

      return true;
    } catch (error) {
      console.error('Error deleting Instagram integration:', error);
      set({
        instagramError:
          error instanceof Error ? error.message : 'Error al eliminar integración de Instagram',
      });
      return false;
    } finally {
      set({ isDeletingInstagram: false });
    }
  },

  assignAssistantToInstagram: async (connectionId, assistantId) => {
    set({ isAssigningAssistant: true, instagramError: null });

    try {
      await integrationApi.assignAssistantToInstagram(connectionId, assistantId);

      await get().fetchInstagramIntegrations();

      return true;
    } catch (error) {
      console.error('Error assigning assistant to Instagram:', error);
      set({
        instagramError:
          error instanceof Error ? error.message : 'Error al asignar asistente a Instagram',
      });
      return false;
    } finally {
      set({ isAssigningAssistant: false });
    }
  },

  setSelectedInstagram: (insta) => set({ selectedInstagram: insta }),
  clearInstagramError: () => set({ instagramError: null }),

  // Actions - Widget
  fetchWidgetIntegrations: async () => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      set({ widgetError: 'No business selected' });
      return;
    }

    set({ isLoadingWidget: true, widgetError: null });

    try {
      const response = await integrationApi.getWidgetIntegrations();
      set({ widgetIntegrations: response.data || [] });
    } catch (error) {
      console.error('Error fetching Widget integrations:', error);
      set({
        widgetError:
          error instanceof Error ? error.message : 'Error al cargar integraciones de Widget',
      });
    } finally {
      set({ isLoadingWidget: false });
    }
  },

  createWidgetIntegration: async (data) => {
    const { selectedBusinessId } = useAuthStore.getState();

    // Validate that assistant ID is provided and not null/0
    if (!data.oai_assistant_id || data.oai_assistant_id === 0) {
      set({ widgetError: 'Debe seleccionar un asistente para crear el widget' });
      return null;
    }

    if (!selectedBusinessId) {
      set({ widgetError: 'No business selected' });
      return null;
    }

    set({ isCreatingWidget: true, widgetError: null });

    try {
      const response = await integrationApi.createWidgetIntegration({
        ...data,
        business_id: parseInt(selectedBusinessId, 10),
      });

      // Update the list
      const { widgetIntegrations } = get();
      set({ widgetIntegrations: [...widgetIntegrations, response.data] });

      return response.data;
    } catch (error) {
      console.error('Error creating Widget integration:', error);
      set({
        widgetError:
          error instanceof Error ? error.message : 'Error al crear integración de Widget',
      });
      return null;
    } finally {
      set({ isCreatingWidget: false });
    }
  },

  updateWidgetIntegration: async (id, data) => {
    set({ isUpdatingWidget: true, widgetError: null });

    try {
      await integrationApi.updateWidgetIntegration(id, data);

      // Update the list
      const { widgetIntegrations } = get();
      const updatedIntegrations = widgetIntegrations.map((integration) =>
        integration.oaia_widget_id === id ? { ...integration, ...data } : integration,
      );

      set({ widgetIntegrations: updatedIntegrations });

      // Update selected if it's the same
      const { selectedWidget } = get();
      if (selectedWidget && selectedWidget.oaia_widget_id === id) {
        set({ selectedWidget: { ...selectedWidget, ...data } });
      }

      return true;
    } catch (error) {
      console.error('Error updating Widget integration:', error);
      set({
        widgetError:
          error instanceof Error ? error.message : 'Error al actualizar integración de Widget',
      });
      return false;
    } finally {
      set({ isUpdatingWidget: false });
    }
  },

  deleteWidgetIntegration: async (id) => {
    set({ isDeletingWidget: true, widgetError: null });

    try {
      await integrationApi.deleteWidgetIntegration(id);

      // Update the list
      const { widgetIntegrations } = get();
      set({
        widgetIntegrations: widgetIntegrations.filter(
          (integration) => integration.oaia_widget_id !== id,
        ),
        selectedWidget: null,
      });

      return true;
    } catch (error) {
      console.error('Error deleting Widget integration:', error);
      set({
        widgetError:
          error instanceof Error ? error.message : 'Error al eliminar integración de Widget',
      });
      return false;
    } finally {
      set({ isDeletingWidget: false });
    }
  },

  assignAssistantToWidget: async (widgetId, assistantId) => {
    set({ isAssigningAssistant: true, widgetError: null });

    try {
      await integrationApi.assignAssistantToWidget(widgetId, assistantId);

      // Update the list
      await get().fetchWidgetIntegrations();

      return true;
    } catch (error) {
      console.error('Error assigning assistant to Widget:', error);
      set({
        widgetError: error instanceof Error ? error.message : 'Error al asignar asistente a Widget',
      });
      return false;
    } finally {
      set({ isAssigningAssistant: false });
    }
  },

  setSelectedWidget: (widget) => set({ selectedWidget: widget }),
  clearWidgetError: () => set({ widgetError: null }),

  // Actions - Store
  fetchStoreIntegrations: async (provider) => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      set({ storeError: 'No business selected' });
      return;
    }

    set({ isLoadingStore: true, storeError: null });

    try {
      const response = await integrationApi.getStoreIntegrations(provider);
      set({ storeIntegrations: response.data || [] });
    } catch (error) {
      console.error('Error fetching Store integrations:', error);
      set({
        storeError:
          error instanceof Error ? error.message : 'Error al cargar integraciones de Tienda',
      });
    } finally {
      set({ isLoadingStore: false });
    }
  },

  createStoreIntegration: async (data) => {
    const { selectedBusinessId } = useAuthStore.getState();

    // Validate that assistant ID is provided and not null/0
    if (!data.oai_assistant_id || data.oai_assistant_id === 0) {
      set({ storeError: 'Debe seleccionar un asistente para crear la integración de tienda' });
      return null;
    }

    if (!selectedBusinessId) {
      set({ storeError: 'No business selected' });
      return null;
    }

    set({ isCreatingStore: true, storeError: null });

    try {
      const response = await integrationApi.createStoreIntegration({
        ...data,
        business_id: parseInt(selectedBusinessId, 10),
      });

      // Update the list
      const { storeIntegrations } = get();
      set({ storeIntegrations: [...storeIntegrations, response.data] });

      return response.data;
    } catch (error) {
      console.error('Error creating Store integration:', error);
      set({
        storeError: error instanceof Error ? error.message : 'Error al crear integración de Tienda',
      });
      return null;
    } finally {
      set({ isCreatingStore: false });
    }
  },

  updateStoreIntegration: async (id, data) => {
    set({ isUpdatingStore: true, storeError: null });

    try {
      await integrationApi.updateStoreIntegration(id, data);

      // Update the list
      const { storeIntegrations } = get();
      const updatedIntegrations = storeIntegrations.map((integration) =>
        integration.oaia_store_id === id ? { ...integration, ...data } : integration,
      );

      set({ storeIntegrations: updatedIntegrations });

      // Update selected if it's the same
      const { selectedStore } = get();
      if (selectedStore && selectedStore.oaia_store_id === id) {
        set({ selectedStore: { ...selectedStore, ...data } });
      }

      return true;
    } catch (error) {
      console.error('Error updating Store integration:', error);
      set({
        storeError:
          error instanceof Error ? error.message : 'Error al actualizar integración de Tienda',
      });
      return false;
    } finally {
      set({ isUpdatingStore: false });
    }
  },

  deleteStoreIntegration: async (id) => {
    set({ isDeletingStore: true, storeError: null });

    try {
      await integrationApi.deleteStoreIntegration(id);

      // Update the list
      const { storeIntegrations } = get();
      set({
        storeIntegrations: storeIntegrations.filter(
          (integration) => integration.oaia_store_id !== id,
        ),
        selectedStore: null,
      });

      return true;
    } catch (error) {
      console.error('Error deleting Store integration:', error);
      set({
        storeError:
          error instanceof Error ? error.message : 'Error al eliminar integración de Tienda',
      });
      return false;
    } finally {
      set({ isDeletingStore: false });
    }
  },

  assignAssistantToStore: async (storeId, assistantId) => {
    set({ isAssigningAssistant: true, storeError: null });

    try {
      await integrationApi.assignAssistantToStore(storeId, assistantId);

      // Update the list
      await get().fetchStoreIntegrations();

      return true;
    } catch (error) {
      console.error('Error assigning assistant to Store:', error);
      set({
        storeError: error instanceof Error ? error.message : 'Error al asignar asistente a Tienda',
      });
      return false;
    } finally {
      set({ isAssigningAssistant: false });
    }
  },

  setSelectedStore: (store) => set({ selectedStore: store }),
  clearStoreError: () => set({ storeError: null }),

  // Common actions
  clearAllErrors: () =>
    set({
      whatsAppError: null,
      instagramError: null,
      widgetError: null,
      storeError: null,
    }),

  clearAllData: () =>
    set({
      whatsappIntegrations: [],
      selectedWhatsApp: null,
      instagramIntegrations: [],
      selectedInstagram: null,
      widgetIntegrations: [],
      selectedWidget: null,
      storeIntegrations: [],
      selectedStore: null,
      whatsAppError: null,
      instagramError: null,
      widgetError: null,
      storeError: null,
    }),
}));
