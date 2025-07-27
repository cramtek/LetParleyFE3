import { useEffect, useRef, useState } from 'react';
import {
  AlertCircle,
  ArrowLeft,
  ChevronDown,
  ExternalLink,
  Filter,
  Globe,
  Info,
  Instagram,
  MessageCircle,
  MessageSquare,
  Search,
  Send,
  X,
} from 'lucide-react';
import AssistantControls from '../components/chat/AssistantControls';
import ContactInfoPanel from '../components/chat/ContactInfoPanel';
import MessageInput from '../components/chat/MessageInput';
import { useSendMessage } from '../hooks/useSendMessage';
import { useAuthStore } from '../store/authStore';
import { useConversationsStore } from '../store/conversationsStore';
import { useMessagesStore } from '../store/messagesStore';
import { useNotificationStore } from '../store/notificationStore';
import { formatTimeToUserTimezone, getRelativeTimeWithTimezone } from '../utils/timezone';

interface Conversation {
  ContactType: string;
  LastMessage: string | null;
  LastMessageDateRegistered: string | null;
  OpenAID: string;
  ProfileImageURL: string | null;
  ShowName: string;
  ThreadRegistered: string;
}

const ContactTypeIcon = ({ type }: { type: string }) => {
  switch (type.toLowerCase()) {
    case 'whatsapp':
      return <MessageCircle className="h-5 w-5 text-green-500" />;
    case 'instagram':
      return <Instagram className="h-5 w-5 text-pink-500" />;
    case 'webchat':
    case 'widget':
      return <Globe className="h-5 w-5 text-blue-500" />;
    default:
      return <MessageSquare className="h-5 w-5 text-gray-500" />;
  }
};

// Helper function to get display name for Widget contacts
const getDisplayName = (conversation: Conversation): string => {
  const contactType = conversation.ContactType.toLowerCase();

  // For Widget/Webchat contacts, show "Visitante Web" instead of the long contactId
  if (contactType === 'widget' || contactType === 'webchat') {
    return 'Visitante Web';
  }

  // For other contact types, use the original ShowName
  return conversation.ShowName;
};

const MessageViewer = ({
  onBackToList,
  onShowContactInfo,
}: {
  onBackToList: () => void;
  onShowContactInfo: () => void;
}) => {
  const { selectedConversationId, conversations } = useConversationsStore();
  const { getMessagesForThread, isLoading, error, fetchMessages } = useMessagesStore();
  const { getUnreadCount, markConversationAsRead } = useNotificationStore();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const messagesContainerRef = useRef<HTMLDivElement>(null);
  const [isUserScrolling, setIsUserScrolling] = useState(false);
  const [lastMessageCount, setLastMessageCount] = useState(0);
  const [showNewMessagesButton, setShowNewMessagesButton] = useState(false);
  const [showScrollDownButton, setShowScrollDownButton] = useState(false);
  const [lastMessageIsBot, setLastMessageIsBot] = useState(false);

  const selectedConversation = conversations.find((c) => c.OpenAID === selectedConversationId);
  const messages = selectedConversationId ? getMessagesForThread(selectedConversationId) : [];
  const unreadCount = selectedConversationId ? getUnreadCount(selectedConversationId) : 0;

  // Scroll to bottom function with smooth animation
  const scrollToBottom = (smooth = true, force = false) => {
    if (messagesEndRef.current) {
      if (force) {
        // Force immediate scroll without animation when needed
        messagesEndRef.current.scrollIntoView({
          behavior: 'auto',
          block: 'end',
        });
      } else {
        // Smooth scroll with animation
        messagesEndRef.current.scrollIntoView({
          behavior: smooth ? 'smooth' : 'auto',
          block: 'end',
        });
      }

      if (smooth) {
        // Reset UI state after scrolling
        setIsUserScrolling(false);
        setShowNewMessagesButton(false);
        setShowScrollDownButton(false);
      }
    }
  };

  // Handle user scroll detection
  const handleScroll = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const { scrollTop, scrollHeight, clientHeight } = container;
    const isAtBottom = scrollHeight - scrollTop - clientHeight < 50;

    // If user scrolls up, mark as user scrolling
    if (!isAtBottom) {
      // Only set user scrolling if we're not already at the bottom
      if (!isUserScrolling) {
        setIsUserScrolling(true);
      }
      setShowScrollDownButton(true);
    } else {
      setIsUserScrolling(false);
      setShowNewMessagesButton(false);
      setShowScrollDownButton(false);
    }
  };

  // Force scroll to bottom when a bot message is received and user is scrolled up
  useEffect(() => {
    if (lastMessageIsBot && messages.length > 0) {
      // When bot sends a message, always scroll to it, even if user was scrolled up
      setTimeout(() => {
        scrollToBottom(true);
        setLastMessageIsBot(false);
      }, 100);
    }
  }, [lastMessageIsBot, messages.length]);

  // Auto-scroll when new messages arrive
  useEffect(() => {
    if (messages.length > lastMessageCount && lastMessageCount > 0) {
      // Check if the last message is from the bot (assistant)
      const lastMessage = messages[messages.length - 1];
      const isFromBot = lastMessage?.IsBot === true;
      setLastMessageIsBot(isFromBot);

      // New messages arrived
      if (isUserScrolling && !isFromBot) {
        // User is scrolling, show new messages button
        // But only if the message is from the user, not the bot
        setShowNewMessagesButton(true);
      } else {
        // Auto scroll to bottom with smooth animation
        setTimeout(() => {
          scrollToBottom(true);
        }, 100);
      }
    }
    setLastMessageCount(messages.length);
  }, [messages.length, lastMessageCount, isUserScrolling, messages]);

  // Reset scroll state and scroll to bottom when conversation changes
  useEffect(() => {
    setIsUserScrolling(false);
    setLastMessageCount(0);
    setShowNewMessagesButton(false);
    setShowScrollDownButton(false);

    // Use a short delay to ensure the messages are rendered before scrolling
    setTimeout(() => {
      scrollToBottom(false, true);
    }, 150);
  }, [selectedConversationId]);

  useEffect(() => {
    if (selectedConversationId) {
      // Mark conversation as read when selected
      markConversationAsRead(selectedConversationId);

      // Only fetch if we don't have messages cached
      if (messages.length === 0) {
        fetchMessages(selectedConversationId);
      }
    }
  }, [selectedConversationId, fetchMessages, messages.length, markConversationAsRead]);

  const handleRefreshConversation = () => {
    if (selectedConversationId) {
      console.log('Refreshing conversation:', selectedConversationId);
      fetchMessages(selectedConversationId);
    }
  };

  const formatMessageTime = (date: string) => {
    return formatTimeToUserTimezone(date);
  };

  if (!selectedConversationId) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">Selecciona una conversación para empezar a chatear</p>
        </div>
      </div>
    );
  }

  if (isLoading && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center space-x-3 flex-shrink-0">
          <button onClick={onBackToList} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">
              {selectedConversation ? getDisplayName(selectedConversation) : 'Conversación'}
            </h2>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (error && messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col bg-gray-50 h-full">
        {/* Mobile header */}
        <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center space-x-3 flex-shrink-0">
          <button onClick={onBackToList} className="p-2 hover:bg-gray-100 rounded-full">
            <ArrowLeft className="h-5 w-5 text-gray-600" />
          </button>
          <div className="flex-1">
            <h2 className="font-medium text-gray-900">
              {selectedConversation ? getDisplayName(selectedConversation) : 'Conversación'}
            </h2>
          </div>
        </div>

        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={() => fetchMessages(selectedConversationId)}
              className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
            >
              Intentar de nuevo
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col bg-gray-50 h-full relative">
      {/* Mobile header */}
      <div className="md:hidden bg-white border-b border-gray-200 p-4 flex items-center space-x-3 flex-shrink-0">
        <button onClick={onBackToList} className="p-2 hover:bg-gray-100 rounded-full">
          <ArrowLeft className="h-5 w-5 text-gray-600" />
        </button>

        <div className="flex-1 flex items-center space-x-3">
          {selectedConversation?.ProfileImageURL ? (
            <img
              src={selectedConversation.ProfileImageURL}
              alt={getDisplayName(selectedConversation)}
              className="h-8 w-8 rounded-full object-cover"
            />
          ) : (
            <div className="h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center">
              <ContactTypeIcon type={selectedConversation?.ContactType || ''} />
            </div>
          )}
          <div className="flex-1 min-w-0">
            <h2 className="font-medium text-gray-900 truncate">
              {selectedConversation ? getDisplayName(selectedConversation) : 'Conversación'}
            </h2>
            <div className="flex items-center text-xs text-gray-500">
              <ContactTypeIcon type={selectedConversation?.ContactType || ''} />
              <span className="ml-1">{selectedConversation?.ContactType}</span>
              {unreadCount > 0 && (
                <span className="ml-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                  {unreadCount}
                </span>
              )}
            </div>
          </div>
        </div>

        <button
          onClick={onShowContactInfo}
          className="p-2 hover:bg-gray-100 rounded-full"
          title="Ver información del contacto"
        >
          <Info className="h-5 w-5 text-gray-600" />
        </button>
      </div>

      {/* Desktop header */}
      <div className="hidden md:block bg-white border-b border-gray-200 p-4 flex-shrink-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {selectedConversation?.ProfileImageURL ? (
              <img
                src={selectedConversation.ProfileImageURL}
                alt={getDisplayName(selectedConversation)}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                <ContactTypeIcon type={selectedConversation?.ContactType || ''} />
              </div>
            )}
            <div>
              <div className="flex items-center space-x-2">
                <h2 className="font-medium text-gray-900">
                  {selectedConversation ? getDisplayName(selectedConversation) : 'Conversación'}
                </h2>
                {unreadCount > 0 && (
                  <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                    {unreadCount}
                  </span>
                )}
              </div>
              <div className="flex items-center text-sm text-gray-500">
                <ContactTypeIcon type={selectedConversation?.ContactType || ''} />
                <span className="ml-1">{selectedConversation?.ContactType}</span>
              </div>
            </div>
          </div>

          <button
            onClick={onShowContactInfo}
            className="p-2 hover:bg-gray-100 rounded-full"
            title="Ver información del contacto"
          >
            <Info className="h-5 w-5 text-gray-600" />
          </button>
        </div>
      </div>

      {/* Assistant Controls */}
      <AssistantControls
        threadId={selectedConversationId}
        onRefreshConversation={handleRefreshConversation}
      />

      {/* Messages */}
      {messages.length === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 mb-2">No hay mensajes en esta conversación</p>
            <p className="text-sm text-gray-500">Envía el primer mensaje para comenzar</p>
          </div>
        </div>
      ) : (
        <div className="flex-1 relative overflow-hidden">
          <div
            ref={messagesContainerRef}
            onScroll={handleScroll}
            className="h-full overflow-y-auto p-4 space-y-4"
            style={{
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {messages.map((message, index) => {
              // Determine if this message is from the client or the business
              // IsBot: false = message from client (left side)
              // IsBot: true = message from business/assistant (right side)
              return (
                <div
                  key={`${message.DateRegistered}-${index}`}
                  className={`flex ${!message.IsBot ? 'justify-start' : 'justify-end'}`}
                >
                  <div
                    className={`max-w-[80%] md:max-w-[60%] space-y-2 ${
                      !message.IsBot ? 'bg-white text-gray-900' : 'bg-primary text-white'
                    } rounded-lg p-4 shadow-sm`}
                  >
                    {message.PhotoURL && (
                      <img
                        src={message.PhotoURL}
                        alt="Message attachment"
                        className="w-full rounded-lg object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                        }}
                      />
                    )}

                    <p className="text-sm whitespace-pre-wrap break-words">{message.Content}</p>

                    {message.ActionURL && (
                      <a
                        href={message.ActionURL}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`inline-flex items-center space-x-1 text-sm mt-2 px-3 py-1 rounded ${
                          !message.IsBot ? 'bg-primary text-white' : 'bg-white text-primary'
                        }`}
                      >
                        <span>IR</span>
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}

                    <p
                      className={`text-xs ${!message.IsBot ? 'text-gray-500' : 'text-primary-100'}`}
                    >
                      {formatMessageTime(message.DateRegistered)}
                    </p>
                  </div>
                </div>
              );
            })}
            {/* Invisible element to scroll to */}
            <div ref={messagesEndRef} />
          </div>

          {/* New Messages Button */}
          {showNewMessagesButton && (
            <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 z-10">
              <button
                onClick={() => scrollToBottom(true)}
                className="bg-primary text-white px-4 py-2 rounded-full shadow-lg hover:bg-primary-dark transition-colors flex items-center space-x-2"
              >
                <span className="text-sm font-medium">Nuevos mensajes</span>
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          )}
          {showScrollDownButton && !showNewMessagesButton && (
            <div className="absolute bottom-4 right-4 z-10">
              <button
                onClick={() => scrollToBottom(true)}
                className="bg-gray-200 p-2 rounded-full shadow-lg hover:bg-gray-300 transition-colors"
              >
                <ChevronDown className="h-5 w-5 text-gray-700" />
              </button>
            </div>
          )}
        </div>
      )}

      <MessageInput />
    </div>
  );
};

const ConversationsList = ({
  onSelectConversation,
}: {
  onSelectConversation: (conversationId: string) => void;
}) => {
  const { selectedBusinessId } = useAuthStore();
  const {
    conversations,
    isLoading,
    error,
    filterType,
    fetchConversations,
    setFilterType,
    clearConversations,
  } = useConversationsStore();
  const { getMessagesForThread } = useMessagesStore();
  const { getUnreadCount } = useNotificationStore();
  const [searchTerm, setSearchTerm] = useState('');

  // Clear conversations when business changes
  useEffect(() => {
    clearConversations();
  }, [selectedBusinessId, clearConversations]);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  const filteredConversations = conversations
    .filter(
      (conv) => filterType === 'All' || conv.ContactType.toLowerCase() === filterType.toLowerCase(),
    )
    .filter((conv) => {
      if (!searchTerm.trim()) return true;
      const search = searchTerm.toLowerCase();
      const lastMessage = (conv.LastMessage || '').toLowerCase();
      const displayName = getDisplayName(conv).toLowerCase();
      return displayName.includes(search) || lastMessage.includes(search);
    });

  const formatDate = (date: string) => {
    return getRelativeTimeWithTimezone(date);
  };

  // Function to get the last client message preview
  const getLastClientMessagePreview = (conversation: Conversation): string => {
    // First try to get from cached messages
    const messages = getMessagesForThread(conversation.OpenAID);

    if (messages && messages.length > 0) {
      // Find the last message from a client (not bot)
      const clientMessages = messages.filter((msg) => !msg.IsBot);

      if (clientMessages.length > 0) {
        const lastClientMessage = clientMessages[clientMessages.length - 1];
        const content = lastClientMessage.Content.trim();

        // Truncate if longer than 60 characters
        if (content.length > 60) {
          return content.substring(0, 60) + '...';
        }
        return content;
      }
    }

    // Fallback to conversation's LastMessage if available
    if (conversation.LastMessage) {
      const content = conversation.LastMessage.trim();
      if (content.length > 60) {
        return content.substring(0, 60) + '...';
      }
      return content;
    }

    // Final fallback
    return 'Conversación iniciada';
  };

  if (error) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="text-center">
          <MessageSquare className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-600">{error}</p>
          <button
            onClick={() => fetchConversations()}
            className="mt-4 px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Conversaciones</h2>
        </div>

        {/* Search and Filter */}
        <div className="space-y-3">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-4 w-4 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Buscar conversaciones"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            />
          </div>

          <div className="flex items-center space-x-2">
            <Filter className="h-4 w-4 text-gray-500" />
            <select
              value={filterType}
              onChange={(e) =>
                setFilterType(e.target.value as 'All' | 'WhatsApp' | 'Instagram' | 'Webchat')
              }
              className="flex-1 border border-gray-300 rounded-md py-1 px-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary"
            >
              <option value="All">Todas las conversaciones</option>
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Widget">Widget</option>
            </select>
          </div>
        </div>
      </div>

      {/* Conversations List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : filteredConversations.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-center px-4">
            <MessageSquare className="h-8 w-8 text-gray-400 mb-2" />
            <p className="text-gray-500">No se encontraron conversaciones</p>
            <p className="text-sm text-gray-400 mt-1">
              {conversations.length === 0
                ? 'Este negocio aún no tiene conversaciones'
                : 'Intenta cambiar el filtro'}
            </p>
          </div>
        ) : (
          <div className="divide-y divide-gray-200">
            {filteredConversations.map((conversation) => {
              const unreadCount = getUnreadCount(conversation.OpenAID);
              const displayName = getDisplayName(conversation);

              return (
                <button
                  key={conversation.OpenAID}
                  onClick={() => onSelectConversation(conversation.OpenAID)}
                  className={`w-full text-left p-4 hover:bg-gray-50 transition-colors relative ${
                    unreadCount > 0 ? 'bg-blue-50' : ''
                  }`}
                >
                  {/* Unread indicator */}
                  {unreadCount > 0 && (
                    <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                  )}

                  <div className="flex items-start space-x-3 ml-2">
                    <div className="flex-shrink-0">
                      {conversation.ProfileImageURL ? (
                        <img
                          src={conversation.ProfileImageURL}
                          alt={displayName}
                          className="h-10 w-10 rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
                          <ContactTypeIcon type={conversation.ContactType} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {displayName}
                          </p>
                          {unreadCount > 0 && (
                            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
                              {unreadCount}
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-gray-500">
                          {formatDate(
                            conversation.LastMessageDateRegistered || conversation.ThreadRegistered,
                          )}
                        </p>
                      </div>

                      <div className="mt-1">
                        <p className="text-sm text-gray-600 truncate">
                          {getLastClientMessagePreview(conversation)}
                        </p>
                      </div>

                      <div className="mt-1 flex items-center">
                        <span className="text-xs text-gray-500 flex items-center">
                          <ContactTypeIcon type={conversation.ContactType} />
                          <span className="ml-1">{conversation.ContactType}</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

const ConversationsPage = () => {
  const [showContactInfo, setShowContactInfo] = useState(false);
  const [mobileView, setMobileView] = useState<'list' | 'chat'>('list');
  const { selectedConversationId, setSelectedConversationId } = useConversationsStore();
  const { markConversationAsRead } = useNotificationStore();

  const handleSelectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setMobileView('chat');
    // Mark conversation as read when selected
    markConversationAsRead(conversationId);
  };

  const handleBackToList = () => {
    setMobileView('list');
    setSelectedConversationId(null);
  };

  const handleShowContactInfo = () => {
    setShowContactInfo(true);
  };

  // Reset mobile view when conversation is deselected
  useEffect(() => {
    if (!selectedConversationId) {
      setMobileView('list');
    }
  }, [selectedConversationId]);

  // Auto-open contact info panel in desktop when a conversation is selected
  useEffect(() => {
    if (selectedConversationId) {
      // Check if we're on desktop (md breakpoint and above)
      const isDesktop = window.innerWidth >= 768;
      if (isDesktop) {
        setShowContactInfo(true);
      }
    } else {
      setShowContactInfo(false);
    }
  }, [selectedConversationId]);

  return (
    <>
      {/* Desktop View - with container and margins */}
      <div className="hidden md:block h-[calc(100vh-7rem)]">
        <div className="h-full flex overflow-hidden bg-white rounded-lg shadow-sm border border-gray-100">
          {/* Conversation List */}
          <div className="w-80 border-r border-gray-200 flex flex-col">
            <ConversationsList onSelectConversation={handleSelectConversation} />
          </div>

          {/* Message Viewer - Flex container that adjusts based on contact panel */}
          <div className={`flex-1 flex ${showContactInfo ? 'max-w-[calc(100%-20rem)]' : ''}`}>
            <MessageViewer
              onBackToList={handleBackToList}
              onShowContactInfo={handleShowContactInfo}
            />
          </div>

          {/* Contact Info Panel - Fixed width on the right - DESKTOP ONLY */}
          {showContactInfo && (
            <ContactInfoPanel
              onClose={() => setShowContactInfo(false)}
              isOpen={showContactInfo}
              isMobile={false}
            />
          )}
        </div>
      </div>

      {/* Mobile View - fullscreen without margins */}
      <div className="md:hidden fixed inset-0 top-16 bg-white z-20">
        <div className="h-full flex flex-col">
          {mobileView === 'list' ? (
            <ConversationsList onSelectConversation={handleSelectConversation} />
          ) : (
            <MessageViewer
              onBackToList={handleBackToList}
              onShowContactInfo={handleShowContactInfo}
            />
          )}
        </div>

        {/* Mobile Contact Info Panel - MOBILE ONLY */}
        <ContactInfoPanel
          onClose={() => setShowContactInfo(false)}
          isOpen={showContactInfo}
          isMobile={true}
        />
      </div>
    </>
  );
};

export default ConversationsPage;
