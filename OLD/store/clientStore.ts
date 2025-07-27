import { create } from 'zustand';
import { Client, ClientNote, ClientsResponse, Tag, clientApi } from '../services/clientService';

interface ClientState {
  // Clients data
  clients: Client[];
  selectedClient: Client | null;
  clientNotes: ClientNote[];
  businessTags: Tag[];

  // Pagination and filters
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalClients: number;
  searchQuery: string;
  statusFilter: 'All' | 'Active' | 'Inactive';
  sortBy: string;
  sortOrder: 'asc' | 'desc';

  // Loading states
  isLoading: boolean;
  isLoadingNotes: boolean;
  isLoadingTags: boolean;
  isSaving: boolean;

  // Error states
  error: string | null;
  notesError: string | null;
  tagsError: string | null;

  // Actions
  setClients: (response: ClientsResponse) => void;
  setSelectedClient: (client: Client | null) => void;
  setClientNotes: (notes: ClientNote[]) => void;
  setBusinessTags: (tags: Tag[]) => void;
  setSearchQuery: (query: string) => void;
  setStatusFilter: (status: 'All' | 'Active' | 'Inactive') => void;
  setSortBy: (sortBy: string) => void;
  setSortOrder: (order: 'asc' | 'desc') => void;
  setCurrentPage: (page: number) => void;
  setPageSize: (size: number) => void;
  setIsLoading: (loading: boolean) => void;
  setIsLoadingNotes: (loading: boolean) => void;
  setIsLoadingTags: (loading: boolean) => void;
  setIsSaving: (saving: boolean) => void;
  setError: (error: string | null) => void;
  setNotesError: (error: string | null) => void;
  setTagsError: (error: string | null) => void;

  // API actions
  fetchClients: () => Promise<void>;
  fetchClientById: (clientId: number) => Promise<void>;
  fetchClientNotes: (clientId: number) => Promise<void>;
  fetchBusinessTags: () => Promise<void>;
  createClient: (clientData: any) => Promise<boolean>;
  updateClient: (clientId: number, clientData: any) => Promise<boolean>;
  addClientNote: (clientId: number, noteData: any) => Promise<boolean>;
  assignTagToClient: (clientId: number, tagData: any) => Promise<boolean>;
  removeTagFromClient: (clientId: number, tagId: number) => Promise<boolean>;

  // Utility actions
  clearError: () => void;
  clearNotesError: () => void;
  clearTagsError: () => void;
  resetFilters: () => void;
  clearSelectedClient: () => void;
}

export const useClientStore = create<ClientState>((set, get) => ({
  // Initial state
  clients: [],
  selectedClient: null,
  clientNotes: [],
  businessTags: [],
  currentPage: 1,
  pageSize: 20,
  totalPages: 1,
  totalClients: 0,
  searchQuery: '',
  statusFilter: 'All',
  sortBy: 'client_name',
  sortOrder: 'asc',
  isLoading: false,
  isLoadingNotes: false,
  isLoadingTags: false,
  isSaving: false,
  error: null,
  notesError: null,
  tagsError: null,

  // Setters
  setClients: (response) =>
    set({
      clients: response.clients,
      totalClients: response.total,
      currentPage: response.page,
      pageSize: response.page_size,
      totalPages: response.total_pages,
    }),

  setSelectedClient: (client) => set({ selectedClient: client }),
  setClientNotes: (notes) => set({ clientNotes: notes }),
  setBusinessTags: (tags) => set({ businessTags: tags }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  setStatusFilter: (status) => set({ statusFilter: status }),
  setSortBy: (sortBy) => set({ sortBy }),
  setSortOrder: (order) => set({ sortOrder: order }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setPageSize: (size) => set({ pageSize: size }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setIsLoadingNotes: (loading) => set({ isLoadingNotes: loading }),
  setIsLoadingTags: (loading) => set({ isLoadingTags: loading }),
  setIsSaving: (saving) => set({ isSaving: saving }),
  setError: (error) => set({ error }),
  setNotesError: (error) => set({ notesError: error }),
  setTagsError: (error) => set({ tagsError: error }),

  // API actions
  fetchClients: async () => {
    const state = get();
    set({ isLoading: true, error: null });

    try {
      const params = {
        search: state.searchQuery || undefined,
        status: state.statusFilter !== 'All' ? state.statusFilter : undefined,
        sort_by: state.sortBy,
        sort_order: state.sortOrder,
        page: state.currentPage,
        page_size: state.pageSize,
      };

      const response = await clientApi.getClients(params);
      state.setClients(response);
    } catch (error) {
      console.error('Error fetching clients:', error);
      set({ error: error instanceof Error ? error.message : 'Error al cargar clientes' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchClientById: async (clientId) => {
    set({ isLoading: true, error: null });

    try {
      const client = await clientApi.getClientById(clientId);
      set({ selectedClient: client });
    } catch (error) {
      console.error('Error fetching client:', error);
      set({ error: error instanceof Error ? error.message : 'Error al cargar cliente' });
    } finally {
      set({ isLoading: false });
    }
  },

  fetchClientNotes: async (clientId) => {
    set({ isLoadingNotes: true, notesError: null });

    try {
      const notes = await clientApi.getClientNotes(clientId);
      set({ clientNotes: notes });
    } catch (error) {
      console.error('Error fetching client notes:', error);
      set({ notesError: error instanceof Error ? error.message : 'Error al cargar notas' });
    } finally {
      set({ isLoadingNotes: false });
    }
  },

  fetchBusinessTags: async () => {
    set({ isLoadingTags: true, tagsError: null });

    try {
      const tags = await clientApi.getTags();
      set({ businessTags: tags });
    } catch (error) {
      console.error('Error fetching tags:', error);
      set({ tagsError: error instanceof Error ? error.message : 'Error al cargar etiquetas' });
    } finally {
      set({ isLoadingTags: false });
    }
  },

  createClient: async (clientData) => {
    set({ isSaving: true, error: null });

    try {
      await clientApi.createClient(clientData);

      // Refresh clients list
      await get().fetchClients();

      return true;
    } catch (error) {
      console.error('Error creating client:', error);
      set({ error: error instanceof Error ? error.message : 'Error al crear cliente' });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  updateClient: async (clientId, clientData) => {
    set({ isSaving: true, error: null });

    try {
      await clientApi.updateClient(clientId, clientData);

      // Update selected client if it's the one being updated
      const state = get();
      if (state.selectedClient?.client_profile_id === clientId) {
        await state.fetchClientById(clientId);
      }

      // Refresh clients list
      await get().fetchClients();

      return true;
    } catch (error) {
      console.error('Error updating client:', error);
      set({ error: error instanceof Error ? error.message : 'Error al actualizar cliente' });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  addClientNote: async (clientId, noteData) => {
    set({ isSaving: true, notesError: null });

    try {
      await clientApi.addClientNote(clientId, noteData);

      // Refresh notes
      await get().fetchClientNotes(clientId);

      return true;
    } catch (error) {
      console.error('Error adding note:', error);
      set({ notesError: error instanceof Error ? error.message : 'Error al agregar nota' });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  assignTagToClient: async (clientId, tagData) => {
    set({ isSaving: true, error: null });

    try {
      await clientApi.assignTag(clientId, tagData);

      // Refresh client data
      const state = get();
      if (state.selectedClient?.client_profile_id === clientId) {
        await state.fetchClientById(clientId);
      }

      // Refresh clients list
      await get().fetchClients();

      return true;
    } catch (error) {
      console.error('Error assigning tag:', error);
      set({ error: error instanceof Error ? error.message : 'Error al asignar etiqueta' });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  removeTagFromClient: async (clientId, tagId) => {
    set({ isSaving: true, error: null });

    try {
      await clientApi.removeTag(clientId, tagId);

      // Refresh client data
      const state = get();
      if (state.selectedClient?.client_profile_id === clientId) {
        await state.fetchClientById(clientId);
      }

      // Refresh clients list
      await get().fetchClients();

      return true;
    } catch (error) {
      console.error('Error removing tag:', error);
      set({ error: error instanceof Error ? error.message : 'Error al remover etiqueta' });
      return false;
    } finally {
      set({ isSaving: false });
    }
  },

  // Utility actions
  clearError: () => set({ error: null }),
  clearNotesError: () => set({ notesError: null }),
  clearTagsError: () => set({ tagsError: null }),

  resetFilters: () =>
    set({
      searchQuery: '',
      statusFilter: 'All',
      sortBy: 'client_name',
      sortOrder: 'asc',
      currentPage: 1,
    }),

  clearSelectedClient: () =>
    set({
      selectedClient: null,
      clientNotes: [],
      notesError: null,
    }),
}));
