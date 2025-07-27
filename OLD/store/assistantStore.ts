import { create } from 'zustand';
import {
  AssistantDetail,
  CreateAssistantRequest,
  MakeAssistant,
  UpdateAssistantRequest,
  assistantApi,
} from '../services/assistantService';
import { useAuthStore } from './authStore';

interface AssistantState {
  // Data
  assistants: MakeAssistant[];
  selectedAssistant: AssistantDetail | null;

  // Loading states
  isLoading: boolean;
  isLoadingDetail: boolean;
  isCreating: boolean;
  isUpdating: boolean;
  isDeleting: boolean;

  // Error states
  error: string | null;
  detailError: string | null;
  createError: string | null;
  updateError: string | null;
  deleteError: string | null;

  // Actions
  setAssistants: (assistants: MakeAssistant[]) => void;
  setSelectedAssistant: (assistant: AssistantDetail | null) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingDetail: (loading: boolean) => void;
  setIsCreating: (creating: boolean) => void;
  setIsUpdating: (updating: boolean) => void;
  setIsDeleting: (deleting: boolean) => void;
  setError: (error: string | null) => void;
  setDetailError: (error: string | null) => void;
  setCreateError: (error: string | null) => void;
  setUpdateError: (error: string | null) => void;
  setDeleteError: (error: string | null) => void;

  // API actions
  fetchAssistants: () => Promise<void>;
  fetchAssistantDetail: (assistantId: number) => Promise<void>;
  createAssistant: (data: CreateAssistantRequest) => Promise<MakeAssistant | null>;
  updateAssistant: (assistantId: number, data: UpdateAssistantRequest) => Promise<boolean>;
  deleteAssistant: (assistantId: number) => Promise<boolean>;

  // Utility actions
  clearErrors: () => void;
  clearAssistants: () => void;
  clearSelectedAssistant: () => void;
}

export const useAssistantStore = create<AssistantState>((set, get) => ({
  // Initial state
  assistants: [],
  selectedAssistant: null,
  isLoading: false,
  isLoadingDetail: false,
  isCreating: false,
  isUpdating: false,
  isDeleting: false,
  error: null,
  detailError: null,
  createError: null,
  updateError: null,
  deleteError: null,

  // Setters
  setAssistants: (assistants) => set({ assistants }),
  setSelectedAssistant: (assistant) => set({ selectedAssistant: assistant }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsLoadingDetail: (loading) => set({ isLoadingDetail: loading }),
  setIsCreating: (creating) => set({ isCreating: creating }),
  setIsUpdating: (updating) => set({ isUpdating: updating }),
  setIsDeleting: (deleting) => set({ isDeleting: deleting }),
  setError: (error) => set({ error }),
  setDetailError: (error) => set({ detailError: error }),
  setCreateError: (error) => set({ createError: error }),
  setUpdateError: (error) => set({ updateError: error }),
  setDeleteError: (error) => set({ deleteError: error }),

  // API actions
  fetchAssistants: async () => {
    const { selectedBusinessId } = useAuthStore.getState();

    if (!selectedBusinessId) {
      set({ error: 'No business selected' });
      return;
    }

    set({ isLoading: true, error: null });

    try {
      const assistants = await assistantApi.listMakeAssistants(selectedBusinessId);
      set({ assistants: Array.isArray(assistants) ? assistants : [] });
    } catch (error) {
      console.error('Error fetching assistants:', error);
      set({
        error: error instanceof Error ? error.message : 'Error al cargar asistentes',
        assistants: [],
      });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchAssistantDetail: async (assistantId) => {
    set({ isLoadingDetail: true, detailError: null });

    try {
      const assistantDetail = await assistantApi.getMakeAssistantDetail(assistantId);
      set({ selectedAssistant: assistantDetail });
    } catch (error) {
      console.error('Error fetching assistant detail:', error);

      // Handle specific case where assistant has no training data
      if (
        error instanceof Error &&
        error.message.includes(
          'API error: 500 - error obteniendo entrenamiento: sql: no rows in result set',
        )
      ) {
        // Find the basic assistant info from the already loaded assistants
        const { assistants } = get();
        const basicAssistant = assistants.find((a) => a.oai_assistant_id === assistantId);

        if (basicAssistant) {
          // Create an AssistantDetail object with null training (advanced assistant)
          const assistantDetail: AssistantDetail = {
            assistant: basicAssistant,
            training: null,
          };
          set({ selectedAssistant: assistantDetail });
        } else {
          set({ detailError: 'Asistente no encontrado' });
        }
      } else {
        set({
          detailError:
            error instanceof Error ? error.message : 'Error al cargar detalles del asistente',
        });
      }
    } finally {
      set({ isLoadingDetail: false });
    }
  },

  createAssistant: async (data) => {
    set({ isCreating: true, createError: null });

    try {
      const newAssistant = await assistantApi.createMakeAssistant(data);

      // Update assistants list
      const { assistants } = get();
      set({ assistants: [...assistants, newAssistant] });

      return newAssistant;
    } catch (error) {
      console.error('Error creating assistant:', error);
      set({ createError: error instanceof Error ? error.message : 'Error al crear asistente' });
      return null;
    } finally {
      set({ isCreating: false });
    }
  },

  updateAssistant: async (assistantId, data) => {
    set({ isUpdating: true, updateError: null });

    try {
      await assistantApi.updateMakeAssistant(assistantId, data);

      // Refresh assistants list
      await get().fetchAssistants();

      // If the selected assistant is the one being updated, refresh its details
      const { selectedAssistant } = get();
      if (selectedAssistant && selectedAssistant.assistant.oai_assistant_id === assistantId) {
        await get().fetchAssistantDetail(assistantId);
      }

      return true;
    } catch (error) {
      console.error('Error updating assistant:', error);
      set({
        updateError: error instanceof Error ? error.message : 'Error al actualizar asistente',
      });
      return false;
    } finally {
      set({ isUpdating: false });
    }
  },

  deleteAssistant: async (assistantId) => {
    set({ isDeleting: true, deleteError: null });

    try {
      await assistantApi.deleteMakeAssistant(assistantId);

      // Update assistants list
      const { assistants } = get();
      set({
        assistants: assistants.filter((a) => a.oai_assistant_id !== assistantId),
        selectedAssistant: null,
      });

      return true;
    } catch (error) {
      console.error('Error deleting assistant:', error);
      set({ deleteError: error instanceof Error ? error.message : 'Error al eliminar asistente' });
      return false;
    } finally {
      set({ isDeleting: false });
    }
  },

  // Utility actions
  clearErrors: () =>
    set({
      error: null,
      detailError: null,
      createError: null,
      updateError: null,
      deleteError: null,
    }),

  clearAssistants: () =>
    set({
      assistants: [],
      selectedAssistant: null,
      error: null,
    }),

  clearSelectedAssistant: () =>
    set({
      selectedAssistant: null,
      detailError: null,
    }),
}));
