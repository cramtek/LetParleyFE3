import { create } from 'zustand';
import { useAuthStore } from './authStore';

interface Message {
  Content: string;
  IsBot: boolean;
  DateRegistered: string;
  PhotoURL: string;
  ActionURL: string;
}

interface MessagesState {
  messagesByThread: Record<string, Message[]>;
  isLoading: boolean;
  error: string | null;
  currentThreadId: string | null;

  // Actions
  setMessages: (threadId: string, messages: Message[]) => void;
  addMessage: (threadId: string, message: Message) => void;
  setIsLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  fetchMessages: (threadId: string) => Promise<void>;
  clearMessages: () => void;
  clearMessagesForThread: (threadId: string) => void;
  getMessagesForThread: (threadId: string) => Message[];
}

export const useMessagesStore = create<MessagesState>((set, get) => ({
  messagesByThread: {},
  isLoading: false,
  error: null,
  currentThreadId: null,

  setMessages: (threadId, messages) => {
    const { messagesByThread } = get();
    const updatedMessages = {
      ...messagesByThread,
      [threadId]: messages,
    };
    set({ messagesByThread: updatedMessages });

    // Save to localStorage
    try {
      localStorage.setItem(
        'messages-storage',
        JSON.stringify({
          messagesByThread: updatedMessages,
        }),
      );
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  },

  addMessage: (threadId, message) => {
    const { messagesByThread } = get();
    const existingMessages = messagesByThread[threadId] || [];

    // Check if message already exists (avoid duplicates)
    const messageExists = existingMessages.some(
      (msg) =>
        msg.Content === message.Content &&
        msg.DateRegistered === message.DateRegistered &&
        msg.IsBot === message.IsBot,
    );

    if (!messageExists) {
      const updatedMessages = [...existingMessages, message].sort(
        (a, b) => new Date(a.DateRegistered).getTime() - new Date(b.DateRegistered).getTime(),
      );

      const updatedMessagesByThread = {
        ...messagesByThread,
        [threadId]: updatedMessages,
      };

      set({ messagesByThread: updatedMessagesByThread });

      // Save to localStorage
      try {
        localStorage.setItem(
          'messages-storage',
          JSON.stringify({
            messagesByThread: updatedMessagesByThread,
          }),
        );
      } catch (error) {
        console.error('Error saving messages to localStorage:', error);
      }

      console.log('Added message:', {
        isBot: message.IsBot,
        content: message.Content.substring(0, 50) + '...',
        threadId,
        totalMessages: updatedMessages.length,
      });
    }
  },

  setIsLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  clearMessages: () => {
    set({
      messagesByThread: {},
      error: null,
      currentThreadId: null,
    });

    // Clear from localStorage
    try {
      localStorage.removeItem('messages-storage');
    } catch (error) {
      console.error('Error clearing messages from localStorage:', error);
    }
  },

  clearMessagesForThread: (threadId) => {
    const { messagesByThread } = get();
    const { [threadId]: removed, ...rest } = messagesByThread;
    set({ messagesByThread: rest });

    // Save to localStorage
    try {
      localStorage.setItem(
        'messages-storage',
        JSON.stringify({
          messagesByThread: rest,
        }),
      );
    } catch (error) {
      console.error('Error saving messages to localStorage:', error);
    }
  },

  getMessagesForThread: (threadId) => {
    const { messagesByThread } = get();
    return messagesByThread[threadId] || [];
  },

  fetchMessages: async (threadId) => {
    const { sessionToken, signOut } = useAuthStore.getState();
    const { currentThreadId } = get();

    if (!sessionToken) {
      signOut();
      set({ error: 'No session token found' });
      return;
    }

    // Set current thread ID if different
    if (currentThreadId !== threadId) {
      set({ currentThreadId: threadId });
    }

    set({ isLoading: true, error: null });

    try {
      console.log('Fetching messages for thread:', threadId);

      const response = await fetch('https://api3.letparley.com/lpmobile/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${sessionToken}`,
        },
        body: JSON.stringify({
          thread_id: threadId,
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
        console.log('No messages found for this conversation');
        get().setMessages(threadId, []);
        return;
      }

      if (!Array.isArray(data)) {
        console.error('Unexpected response format:', data);
        throw new Error('Invalid response format from server');
      }

      // Sort messages by date
      const sortedMessages = data.sort(
        (a, b) => new Date(a.DateRegistered).getTime() - new Date(b.DateRegistered).getTime(),
      );

      console.log('Fetched messages:', {
        threadId,
        totalMessages: sortedMessages.length,
        clientMessages: sortedMessages.filter((m) => !m.IsBot).length,
        botMessages: sortedMessages.filter((m) => m.IsBot).length,
      });

      get().setMessages(threadId, sortedMessages);
    } catch (error) {
      console.error('Error fetching messages:', error);
      set({ error: error instanceof Error ? error.message : 'Failed to load messages' });
    } finally {
      set({ isLoading: false });
    }
  },
}));

// Load from localStorage on initialization
try {
  const stored = localStorage.getItem('messages-storage');
  if (stored) {
    const parsed = JSON.parse(stored);
    if (parsed.messagesByThread) {
      useMessagesStore.setState({
        messagesByThread: parsed.messagesByThread,
      });
    }
  }
} catch (error) {
  console.error('Error loading messages from localStorage:', error);
}
