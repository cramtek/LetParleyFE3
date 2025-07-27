import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Conversation {
  ContactType: string;
  ContactId: string;
  LastMessage: string | null;
  LastMessageDateRegistered: string | null;
  OpenAID: string;
  ProfileImageURL: string | null;
  ShowName: string;
  ThreadRegistered: string;
}

interface ConversationsState {
  conversations: Conversation[];
  selectedConversationId: string | null;
  isLoading: boolean;
  error: string | null;
  filterType: 'All' | 'WhatsApp' | 'Instagram' | 'Webchat';
  currentBusinessId: string | null;

  // Actions
  setConversations: (conversations: Conversation[]) => void;
  updateConversation: (conversationId: string, updates: Partial<Conversation>) => void;
  addOrUpdateConversation: (conversation: Conversation) => void;
  setSelectedConversationId: (id: string | null) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  setFilterType: (type: 'All' | 'WhatsApp' | 'Instagram' | 'Webchat') => void;
  fetchConversations: () => Promise<void>;
  clearConversations: () => void;
}

export const useConversationsStore = create<ConversationsState>((set, get) => ({
  conversations: [],
  selectedConversationId: null,
  isLoading: false,
  error: null,
  filterType: 'All',
  currentBusinessId: null,

  setConversations: (conversations) => {
    set({ conversations });

    // Save to localStorage
    try {
      localStorage.setItem(
        'conversations-storage',
        JSON.stringify({
          conversations,
          currentBusinessId: get().currentBusinessId,
          filterType: get().filterType,
        }),
      );
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
    }
  },

  updateConversation: (conversationId, updates) => {
    const { conversations } = get();
    const updatedConversations = conversations.map((conv) =>
      conv.OpenAID === conversationId ? { ...conv, ...updates } : conv,
    );
    set({ conversations: updatedConversations });

    // Save to localStorage
    try {
      localStorage.setItem(
        'conversations-storage',
        JSON.stringify({
          conversations: updatedConversations,
          currentBusinessId: get().currentBusinessId,
          filterType: get().filterType,
        }),
      );
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
    }
  },

  addOrUpdateConversation: (conversation) => {
    const { conversations } = get();
    const existingIndex = conversations.findIndex((conv) => conv.OpenAID === conversation.OpenAID);

    let updatedConversations;

    if (existingIndex >= 0) {
      // Update existing conversation
      updatedConversations = [...conversations];
      updatedConversations[existingIndex] = conversation;

      // Move to top if it has a newer message
      const existing = conversations[existingIndex];
      const newDate = conversation.LastMessageDateRegistered || conversation.ThreadRegistered;
      const existingDate = existing.LastMessageDateRegistered || existing.ThreadRegistered;

      if (new Date(newDate) > new Date(existingDate)) {
        updatedConversations.splice(existingIndex, 1);
        updatedConversations.unshift(conversation);
      }
    } else {
      // Add new conversation at the top
      updatedConversations = [conversation, ...conversations];
    }

    set({ conversations: updatedConversations });

    // Save to localStorage
    try {
      localStorage.setItem(
        'conversations-storage',
        JSON.stringify({
          conversations: updatedConversations,
          currentBusinessId: get().currentBusinessId,
          filterType: get().filterType,
        }),
      );
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
    }
  },

  setSelectedConversationId: (id) => set({ selectedConversationId: id }),
  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),
  setFilterType: (type) => {
    set({ filterType: type });

    // Save to localStorage
    try {
      localStorage.setItem(
        'conversations-storage',
        JSON.stringify({
          conversations: get().conversations,
          currentBusinessId: get().currentBusinessId,
          filterType: type,
        }),
      );
    } catch (error) {
      console.error('Error saving conversations to localStorage:', error);
    }
  },

  clearConversations: () => {
    set({
      conversations: [],
      selectedConversationId: null,
      error: null,
      currentBusinessId: null,
    });

    // Clear from localStorage
    try {
      localStorage.removeItem('conversations-storage');
    } catch (error) {
      console.error('Error clearing conversations from localStorage:', error);
    }
  },

  fetchConversations: async () => {
    const selectedBusinessId = localStorage.getItem('selected_business_id');
    const { sessionToken, signOut } = useAuthStore.getState();
    const { currentBusinessId } = get();

    if (!selectedBusinessId) {
      set({ error: 'No business selected' });
      return;
    }

    if (!sessionToken) {
      signOut();
      set({ error: 'No session token found' });
      return;
    }

    // If business has changed, clear current state
    if (currentBusinessId && currentBusinessId !== selectedBusinessId) {
      console.log(
        'Business changed from',
        currentBusinessId,
        'to',
        selectedBusinessId,
        '- clearing conversations',
      );
      set({
        conversations: [],
        selectedConversationId: null,
        error: null,
        currentBusinessId: selectedBusinessId,
      });
    } else if (!currentBusinessId) {
      set({ currentBusinessId: selectedBusinessId });
    }

    set({ isLoading: true, error: null });

    try {
      const response = await fetch('https://api3.letparley.com/lpmobile/conversations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          business_id: parseInt(selectedBusinessId, 10),
        }),
      });

      if (response.status === 400 || response.status === 401) {
        signOut();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data === null || data === undefined) {
        console.log('No conversations found for this business');
        set({ conversations: [], currentBusinessId: selectedBusinessId });
        return;
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      // Sort conversations by date (most recent first)
      const sortedConversations = data.sort((a, b) => {
        const dateA = a.LastMessageDateRegistered || a.ThreadRegistered;
        const dateB = b.LastMessageDateRegistered || b.ThreadRegistered;
        return new Date(dateB).getTime() - new Date(dateA).getTime();
      });

      set({
        conversations: sortedConversations,
        currentBusinessId: selectedBusinessId,
      });
    } catch (error) {
      console.error('Error fetching conversations:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load conversations' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Load from localStorage on initialization
try {
  const stored = localStorage.getItem('conversations-storage');
  if (stored) {
    const parsed = JSON.parse(stored);
    useConversationsStore.setState({
      conversations: parsed.conversations || [],
      currentBusinessId: parsed.currentBusinessId || null,
      filterType: parsed.filterType || 'All',
    });
  }
} catch (error) {
  console.error('Error loading conversations from localStorage:', error);
}
