import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { WEBSOCKET_URL } from '../services/api';
import { useAuthStore } from '../store/authStore';
import { useConversationsStore } from '../store/conversationsStore';
import { useMessagesStore } from '../store/messagesStore';
import { useNotificationStore } from '../store/notificationStore';

type ConnectionStatus = 'connecting' | 'connected' | 'disconnected' | 'error';

interface WebSocketMessage {
  type: string;
  event?: string;
  message?: string;
  connection_id?: string;
  timestamp?: string;
  business_id?: number;
  data?: {
    thread_id: string;
    message?: {
      content: string;
      is_bot: boolean;
      photo_url: string;
      action_url: string;
      document_url: string;
      date_registered: string;
    };
    contact_type?: string;
    show_name?: string;
    contact_id?: string;
    thread_registered?: string;
  };
  code?: number;
}

interface UseRealtimeConnectionReturn {
  status: ConnectionStatus;
  lastMessage: WebSocketMessage | null;
  reconnect: () => void;
  notifications: WebSocketMessage[];
  clearNotifications: () => void;
}

// Create a singleton WebSocket instance with unique ID tracking
let globalSocket: WebSocket | null = null;
let globalSocketId: number = 0;
let reconnectTimer: NodeJS.Timeout | null = null;

// Audio notification system
class NotificationAudio {
  private audio: HTMLAudioElement | null = null;
  private isLoaded = false;

  constructor() {
    this.initializeAudio();
  }

  private initializeAudio() {
    try {
      this.audio = new Audio(
        'https://apps.letparley.com/LPMobileApp/assets/LPNotificationSound.mp3',
      );
      this.audio.preload = 'auto';
      this.audio.volume = 0.7; // 70% volume for professional sound

      this.audio.addEventListener('canplaythrough', () => {
        this.isLoaded = true;
        console.log('🔊 Notification sound loaded successfully');
      });

      this.audio.addEventListener('error', (e) => {
        console.warn('🔇 Could not load notification sound:', e);
        this.isLoaded = false;
      });
    } catch (error) {
      console.warn('🔇 Audio not supported:', error);
    }
  }

  play() {
    if (this.audio && this.isLoaded) {
      try {
        // Reset audio to beginning and play
        this.audio.currentTime = 0;
        const playPromise = this.audio.play();

        if (playPromise !== undefined) {
          playPromise.catch((error) => {
            console.warn('🔇 Could not play notification sound:', error);
          });
        }
      } catch (error) {
        console.warn('🔇 Error playing notification sound:', error);
      }
    }
  }
}

// Create singleton audio instance
const notificationAudio = new NotificationAudio();

export const useRealtimeConnection = (
  sessionToken: string | null,
  businessId: string | null,
): UseRealtimeConnectionReturn => {
  const [status, setStatus] = useState<ConnectionStatus>('disconnected');
  const [lastMessage, setLastMessage] = useState<WebSocketMessage | null>(null);
  const [notifications, setNotifications] = useState<WebSocketMessage[]>([]);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const maxReconnectAttempts = 5;

  const navigate = useNavigate();
  const { signOut } = useAuthStore();
  const {
    selectedConversationId,
    updateConversation,
    addOrUpdateConversation,
    conversations,
    getConversationByThreadId,
  } = useConversationsStore();
  const { addMessage, fetchMessages } = useMessagesStore();
  const { addNotification, markConversationAsRead, incrementUnreadCount, playNotificationSound } =
    useNotificationStore();

  const connect = useCallback(() => {
    // Clear any existing reconnect timer
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    // Enhanced validation for sessionToken and businessId
    if (!sessionToken?.trim() || !businessId?.trim()) {
      console.log('Connection attempt skipped: Missing credentials', {
        hasToken: !!sessionToken,
        hasBusinessId: !!businessId,
      });
      setStatus('error');
      return;
    }

    // Don't create a new connection if one already exists and is open
    if (globalSocket && globalSocket.readyState === WebSocket.OPEN) {
      console.log('WebSocket connection already exists and is open');
      setStatus('connected');
      return;
    }

    try {
      // Close existing connection if it exists
      if (globalSocket) {
        console.log(
          'Closing existing WebSocket connection, current state:',
          globalSocket.readyState,
        );
        globalSocket.close(1000, 'Creating new connection');
      }

      // Generate unique ID for this socket instance
      const currentSocketId = ++globalSocketId;

      // Build WebSocket URL with both parameters
      const wsUrl = `${WEBSOCKET_URL}?token=${sessionToken}&business_id=${businessId}`;
      console.log(
        'Creating new WebSocket connection to:',
        wsUrl.replace(sessionToken, '[TOKEN_HIDDEN]'),
      );
      console.log('Connection attempt #', reconnectAttempts + 1, 'Socket ID:', currentSocketId);

      const ws = new WebSocket(wsUrl);
      globalSocket = ws;
      setStatus('connecting');

      // Set a connection timeout
      const connectionTimeout = setTimeout(() => {
        if (ws.readyState === WebSocket.CONNECTING) {
          console.error('WebSocket connection timeout after 10 seconds');
          ws.close(1000, 'Connection timeout');
        }
      }, 10000);

      ws.onopen = () => {
        console.log('🔗 WebSocket connected successfully, Socket ID:', currentSocketId);
        clearTimeout(connectionTimeout);
        setStatus('connected');
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          setLastMessage(message);

          switch (message.type) {
            case 'welcome':
              console.log('✅ WebSocket connection confirmed:', message.connection_id);
              break;

            case 'error':
              console.error('❌ WebSocket server error:', message.message, 'Code:', message.code);
              if (message.code === 401 || message.code === 403) {
                console.log('🔐 Authentication failed, signing out user');
                signOut();
                navigate('/login');
              }
              break;
          }

          // Handle new message events
          if (message.event === 'new_message' && message.data?.thread_id) {
            handleNewMessage(message);
          }

          // Handle new conversation events
          if (message.event === 'new_conversation' && message.data) {
            handleNewConversation(message);
          }
        } catch (error) {
          console.error('❌ Error parsing WebSocket message:', error, 'Raw data:', event.data);
        }
      };

      ws.onclose = (event) => {
        console.log('🔌 WebSocket disconnected:', {
          socketId: currentSocketId,
          code: event.code,
          reason: event.reason,
          wasClean: event.wasClean,
          timestamp: new Date().toISOString(),
        });
        clearTimeout(connectionTimeout);

        // Only set globalSocket to null if this is the current socket instance
        if (globalSocket === ws) {
          globalSocket = null;
          setStatus('disconnected');
        } else {
          console.log('Ignoring close event from old socket instance', currentSocketId);
          return;
        }

        // Handle specific close codes with more detailed logging
        const closeReasons = {
          1000: 'Normal closure',
          1001: 'Endpoint going away (server shutdown or page navigation)',
          1002: 'Protocol error',
          1003: 'Unsupported data type',
          1006: 'Abnormal closure (no close frame received)',
          1007: 'Invalid frame payload data',
          1008: 'Policy violation',
          1009: 'Message too big',
          1010: 'Missing extension',
          1011: 'Internal server error',
          1015: 'TLS handshake failure',
        };

        const closeReason =
          closeReasons[event.code as keyof typeof closeReasons] ||
          `Unknown close code: ${event.code}`;
        console.log(`WebSocket close reason: ${closeReason}`);

        // Only attempt reconnection if not closed intentionally and we haven't exceeded max attempts
        if (!event.wasClean && reconnectAttempts < maxReconnectAttempts) {
          const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);

          console.warn(
            `🔄 Scheduling reconnection attempt ${reconnectAttempts + 1}/${maxReconnectAttempts} in ${delay}ms`,
          );

          reconnectTimer = setTimeout(() => {
            setReconnectAttempts((prev) => prev + 1);
            connect();
          }, delay);
        } else if (reconnectAttempts >= maxReconnectAttempts) {
          console.error(
            '❌ Max reconnection attempts reached. WebSocket connection failed permanently.',
          );
          setStatus('error');
        }
      };

      ws.onerror = (error) => {
        console.log('⚠️ WebSocket connection error occurred:', {
          socketId: currentSocketId,
          readyState: ws.readyState,
          readyStateText: ['CONNECTING', 'OPEN', 'CLOSING', 'CLOSED'][ws.readyState],
          url: ws.url.replace(sessionToken, '[TOKEN_HIDDEN]'),
          timestamp: new Date().toISOString(),
          error: error,
        });

        clearTimeout(connectionTimeout);

        if (reconnectAttempts < maxReconnectAttempts) {
          if (ws.readyState === WebSocket.CONNECTING) {
            console.warn(
              '⚠️ WebSocket connection failed during handshake phase. Will attempt to reconnect...',
            );
          }
        } else {
          console.error('❌ WebSocket connection failed permanently after max attempts');
          setStatus('error');
        }
      };
    } catch (error) {
      console.error('❌ Error creating WebSocket:', error);
      setStatus('error');
    }
  }, [sessionToken, businessId, reconnectAttempts, navigate, signOut]);

  // Enhanced function to get contact name from conversation
  const getContactNameFromThread = useCallback(
    (threadId: string): string => {
      const conversation = conversations.find((conv) => conv.OpenAID === threadId);
      if (conversation) {
        return conversation.ShowName || conversation.ContactType || 'Contacto';
      }
      return 'Contacto';
    },
    [conversations],
  );

  // Enhanced function to get contact type from conversation
  const getContactTypeFromThread = useCallback(
    (threadId: string): string => {
      const conversation = conversations.find((conv) => conv.OpenAID === threadId);
      return conversation?.ContactType || 'Desconocido';
    },
    [conversations],
  );

  // Handle new message notifications with enhanced contact identification
  const handleNewMessage = useCallback(
    (message: WebSocketMessage) => {
      const { data } = message;
      if (!data?.thread_id) return;

      console.log('📨 New message received for thread:', data.thread_id);

      // Get contact information from existing conversations
      const contactName = getContactNameFromThread(data.thread_id);
      const contactType = getContactTypeFromThread(data.thread_id);

      // Add the message from WebSocket immediately
      if (data.message) {
        const newMessage = {
          Content: data.message.content,
          IsBot: data.message.is_bot,
          DateRegistered: data.message.date_registered,
          PhotoURL: data.message.photo_url || '',
          ActionURL: data.message.action_url || '',
          DocumentURL: data.message.document_url || '',
        };

        console.log('➕ Adding message from WebSocket:', {
          isBot: newMessage.IsBot,
          content: newMessage.Content.substring(0, 50) + '...',
          threadId: data.thread_id,
          contactName,
        });

        addMessage(data.thread_id, newMessage);

        // Update conversation with the latest message
        updateConversation(data.thread_id, {
          LastMessage: data.message.content,
          LastMessageDateRegistered: data.message.date_registered,
        });
      }

      // Always refresh messages to ensure we have the complete conversation
      console.log('🔄 Refreshing messages to ensure complete conversation');
      setTimeout(() => {
        fetchMessages(data.thread_id);
      }, 1000);

      // Handle notifications and unread counts
      if (selectedConversationId !== data.thread_id) {
        // Only show notification if it's not from the currently selected conversation
        const notificationTitle = data.message?.is_bot
          ? `Respuesta automática para ${contactName}`
          : `Nuevo mensaje de ${contactName}`;

        const notificationMessage = data.message?.content || 'Nuevo mensaje recibido';

        // Add to notifications store with enhanced contact info
        addNotification({
          id: `msg-${data.thread_id}-${Date.now()}`,
          title: notificationTitle,
          message: notificationMessage,
          threadId: data.thread_id,
          contactName,
          contactType,
          timestamp: message.timestamp || new Date().toISOString(),
          type: 'message',
        });

        // Increment unread count for this conversation
        incrementUnreadCount(data.thread_id);

        // Play notification sound
        playNotificationSound();
        notificationAudio.play();

        console.log('🔔 Notification added:', {
          title: notificationTitle,
          contact: contactName,
          type: contactType,
          isBot: data.message?.is_bot,
        });
      } else {
        // If it's the current conversation, just mark as read
        markConversationAsRead(data.thread_id);
      }
    },
    [
      selectedConversationId,
      conversations,
      addMessage,
      updateConversation,
      fetchMessages,
      addNotification,
      incrementUnreadCount,
      playNotificationSound,
      getContactNameFromThread,
      getContactTypeFromThread,
      markConversationAsRead,
    ],
  );

  // Handle new conversation notifications with enhanced contact identification
  const handleNewConversation = useCallback(
    (message: WebSocketMessage) => {
      const { data } = message;
      if (!data?.thread_id) return;

      console.log('🆕 New conversation received:', data.thread_id);

      const contactName = data.show_name || data.contact_id || 'Contacto nuevo';
      const contactType = data.contact_type || 'Desconocido';

      const newConversation = {
        ContactType: data.contact_type || 'Unknown',
        LastMessage: null,
        LastMessageDateRegistered: null,
        OpenAID: data.thread_id,
        ProfileImageURL: null,
        ShowName: contactName,
        ThreadRegistered: data.thread_registered || new Date().toISOString(),
      };

      // Add the new conversation to the list
      addOrUpdateConversation(newConversation);

      // Add notification for new conversation with proper contact info
      addNotification({
        id: `conv-${data.thread_id}-${Date.now()}`,
        title: `Nueva conversación`,
        message: `${contactName} inició una conversación por ${contactType}`,
        threadId: data.thread_id,
        contactName,
        contactType,
        timestamp: message.timestamp || new Date().toISOString(),
        type: 'conversation',
      });

      // Play notification sound
      playNotificationSound();
      notificationAudio.play();

      console.log('🔔 New conversation notification added:', {
        contact: contactName,
        type: contactType,
        threadId: data.thread_id,
      });
    },
    [addOrUpdateConversation, addNotification, playNotificationSound],
  );

  useEffect(() => {
    // Only attempt connection if we have valid credentials
    if (sessionToken && businessId) {
      console.log('🚀 Initializing WebSocket connection with credentials');
      connect();
    } else {
      console.log('⏸️ Skipping WebSocket connection - missing credentials:', {
        hasToken: !!sessionToken,
        hasBusinessId: !!businessId,
      });
      setStatus('error');
    }

    // Cleanup function to close WebSocket on unmount
    return () => {
      if (reconnectTimer) {
        clearTimeout(reconnectTimer);
        reconnectTimer = null;
      }

      if (globalSocket) {
        console.log('🧹 Cleaning up WebSocket connection on component unmount');
        globalSocket.close(1000, 'Component unmounting');
        globalSocket = null;
      }
    };
  }, [connect, sessionToken, businessId]);

  // Mark conversation as read when it's selected
  useEffect(() => {
    if (selectedConversationId) {
      markConversationAsRead(selectedConversationId);
    }
  }, [selectedConversationId, markConversationAsRead]);

  const reconnect = useCallback(() => {
    console.log('🔄 Manual reconnection requested by user');
    setReconnectAttempts(0);

    if (globalSocket) {
      globalSocket.close(1000, 'Manual reconnection');
    }

    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
      reconnectTimer = null;
    }

    connect();
  }, [connect]);

  const clearNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return {
    status,
    lastMessage,
    reconnect,
    notifications,
    clearNotifications,
  };
};
