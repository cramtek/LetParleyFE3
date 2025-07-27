import { useEffect, useRef, useState } from 'react';
import { Bell, BellOff, MessageSquare, Settings, Users, Volume2, VolumeX, X } from 'lucide-react';
import { useConversationsStore } from '../../store/conversationsStore';
import { useNavigationStore } from '../../store/navigationStore';
import { Notification, useNotificationStore } from '../../store/notificationStore';
import { getRelativeTimeWithTimezone } from '../../utils/timezone';

const NotificationsDropdown = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { navigateTo } = useNavigationStore();
  const { setSelectedConversationId } = useConversationsStore();

  const {
    notifications,
    soundEnabled,
    getTotalUnreadCount,
    clearAllNotifications,
    markAsRead,
    removeNotification,
    setSoundEnabled,
  } = useNotificationStore();

  const totalUnreadCount = getTotalUnreadCount();
  const recentNotifications = notifications.slice(0, 10); // Show last 10 notifications

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setShowSettings(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleNotificationClick = (notification: Notification) => {
    // Mark as read
    markAsRead(notification.id);

    // Navigate to conversations view and select the specific conversation
    setSelectedConversationId(notification.threadId);
    navigateTo('conversations');
    setIsOpen(false);
  };

  const handleClearAll = () => {
    clearAllNotifications();
  };

  const handleToggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const getNotificationIcon = (notification: Notification) => {
    switch (notification.type) {
      case 'conversation':
        return <Users className="h-4 w-4 text-green-600" />;
      case 'message':
      default:
        return <MessageSquare className="h-4 w-4 text-blue-600" />;
    }
  };

  const getContactTypeColor = (contactType: string) => {
    switch (contactType.toLowerCase()) {
      case 'whatsapp':
        return 'text-green-600 bg-green-100';
      case 'instagram':
        return 'text-pink-600 bg-pink-100';
      case 'webchat':
      case 'widget':
        return 'text-blue-600 bg-blue-100';
      default:
        return 'text-gray-600 bg-gray-100';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return getRelativeTimeWithTimezone(timestamp);
  };

  // Enhanced notification preview text
  const getNotificationPreview = (notification: Notification) => {
    if (notification.type === 'conversation') {
      return `Nueva conversación iniciada por ${notification.contactType}`;
    }

    // For messages, show a preview of the content
    const maxLength = 80;
    if (notification.message.length > maxLength) {
      return notification.message.substring(0, maxLength) + '...';
    }
    return notification.message;
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
        title="Notificaciones"
      >
        {soundEnabled ? (
          <Bell className="h-5 w-5 text-gray-600" />
        ) : (
          <BellOff className="h-5 w-5 text-gray-400" />
        )}
        {totalUnreadCount > 0 && (
          <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full text-xs text-white flex items-center justify-center font-medium animate-pulse">
            {totalUnreadCount > 99 ? '99+' : totalUnreadCount}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:transform-none mt-2 w-96 max-w-[calc(100vw-1rem)] md:w-96 bg-white rounded-xl shadow-lg border border-gray-200 py-1 z-[60] max-h-[80vh] overflow-hidden">
          {/* Header */}
          <div className="px-4 py-3 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <h3 className="text-lg font-semibold text-gray-900">Notificaciones</h3>
                {totalUnreadCount > 0 && (
                  <span className="inline-flex items-center px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">
                    {totalUnreadCount} nueva{totalUnreadCount !== 1 ? 's' : ''}
                  </span>
                )}
              </div>
              <div className="flex items-center space-x-1">
                <button
                  onClick={() => setShowSettings(!showSettings)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                  title="Configuración"
                >
                  <Settings className="h-4 w-4 text-gray-500" />
                </button>
                {notifications.length > 0 && (
                  <button
                    onClick={handleClearAll}
                    className="text-xs text-blue-600 hover:text-blue-700 px-2 py-1 rounded hover:bg-blue-50 transition-colors"
                  >
                    Limpiar todo
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Settings Panel */}
          {showSettings && (
            <div className="px-4 py-3 border-b border-gray-100 bg-gray-50">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {soundEnabled ? (
                    <Volume2 className="h-4 w-4 text-green-600" />
                  ) : (
                    <VolumeX className="h-4 w-4 text-gray-400" />
                  )}
                  <span className="text-sm font-medium text-gray-700">
                    Sonido de notificaciones
                  </span>
                </div>
                <button
                  onClick={handleToggleSound}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${soundEnabled ? 'bg-green-600' : 'bg-gray-300'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${soundEnabled ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          )}

          {/* Notifications List */}
          <div className="max-h-96 overflow-y-auto">
            {recentNotifications.length === 0 ? (
              <div className="px-4 py-8 text-center">
                <Bell className="h-12 w-12 text-gray-300 mx-auto mb-3" />
                <h3 className="text-sm font-medium text-gray-900 mb-1">No hay notificaciones</h3>
                <p className="text-xs text-gray-500">
                  Te notificaremos cuando recibas nuevos mensajes
                </p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {recentNotifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`
                      px-4 py-3 hover:bg-gray-50 cursor-pointer transition-colors relative
                      ${!notification.isRead ? 'bg-blue-50' : ''}
                    `}
                    onClick={() => handleNotificationClick(notification)}
                  >
                    {/* Unread indicator */}
                    {!notification.isRead && (
                      <div className="absolute left-2 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-blue-600 rounded-full"></div>
                    )}

                    <div className="flex items-start space-x-3 ml-2">
                      <div className="flex-shrink-0 mt-1">{getNotificationIcon(notification)}</div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {notification.title}
                          </p>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              removeNotification(notification.id);
                            }}
                            className="text-gray-400 hover:text-gray-600 p-1 rounded-full hover:bg-gray-200 transition-colors"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>

                        <p className="text-sm text-gray-600 line-clamp-2 mb-2">
                          {getNotificationPreview(notification)}
                        </p>

                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span
                              className={`
                              inline-flex items-center px-2 py-1 rounded-full text-xs font-medium
                              ${getContactTypeColor(notification.contactType)}
                            `}
                            >
                              {notification.contactType}
                            </span>
                            <span className="text-xs text-gray-500 font-medium">
                              {notification.contactName}
                            </span>
                          </div>
                          <span className="text-xs text-gray-500">
                            {formatTimestamp(notification.timestamp)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 10 && (
            <div className="px-4 py-3 border-t border-gray-100 text-center">
              <button
                onClick={() => {
                  navigateTo('conversations');
                  setIsOpen(false);
                }}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Ver todas las conversaciones
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default NotificationsDropdown;
