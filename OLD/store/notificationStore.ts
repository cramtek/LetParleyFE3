import { create } from 'zustand';

const getStorageKey = (userEmail: string | null, businessId: string | null): string => {
  if (!userEmail || !businessId) {
    return 'notifications-temp'; // Temporary key for incomplete context
  }
  return `notifications-${userEmail}-${businessId}`;
};

export interface Notification {
  id: string;
  title: string;
  message: string;
  threadId: string;
  contactName: string;
  contactType: string;
  timestamp: string;
  type: 'message' | 'conversation';
  isRead?: boolean;
}

interface NotificationState {
  notifications: Notification[];
  unreadCounts: Record<string, number>; // threadId -> unread count
  soundEnabled: boolean;
  currentUserEmail: string | null;
  currentBusinessId: string | null;

  // Actions
  addNotification: (notification: Notification) => void;
  removeNotification: (id: string) => void;
  markAsRead: (id: string) => void;
  clearAllNotifications: () => void;
  incrementUnreadCount: (threadId: string) => void;
  markConversationAsRead: (threadId: string) => void;
  getUnreadCount: (threadId: string) => number;
  getTotalUnreadCount: () => number;
  setSoundEnabled: (enabled: boolean) => void;
  playNotificationSound: () => void;

  // Context management
  setUserContext: (userEmail: string | null, businessId: string | null) => void;
  clearUserContext: () => void;
  loadNotificationsForContext: (userEmail: string | null, businessId: string | null) => void;
  saveNotificationsToStorage: () => void;
}

export const useNotificationStore = create<NotificationState>((set, get) => ({
  notifications: [],
  unreadCounts: {},
  soundEnabled: true,
  currentUserEmail: null,
  currentBusinessId: null,

  addNotification: (notification) => {
    const { notifications, unreadCounts, currentUserEmail, currentBusinessId } = get();

    // Don't add notifications if we don't have proper context
    if (!currentUserEmail || !currentBusinessId) {
      console.warn('Cannot add notification without proper user/business context');
      return;
    }

    // Prevent duplicate notifications with enhanced deduplication
    const exists = notifications.some(
      (n) =>
        n.threadId === notification.threadId &&
        n.message === notification.message &&
        n.type === notification.type &&
        Math.abs(new Date(n.timestamp).getTime() - new Date(notification.timestamp).getTime()) <
          5000, // Within 5 seconds
    );

    if (!exists) {
      const newNotifications = [notification, ...notifications].slice(0, 50); // Keep only last 50 notifications
      set({ notifications: newNotifications });

      // Save to localStorage with user/business context
      get().saveNotificationsToStorage();

      console.log('🔔 Notification added to store:', {
        id: notification.id,
        title: notification.title,
        contact: notification.contactName,
        type: notification.type,
        contactType: notification.contactType,
        userContext: `${currentUserEmail}/${currentBusinessId}`,
      });
    } else {
      console.log('🔕 Duplicate notification prevented:', {
        threadId: notification.threadId,
        type: notification.type,
        contact: notification.contactName,
      });
    }
  },

  removeNotification: (id) => {
    const { notifications } = get();
    const updated = notifications.filter((n) => n.id !== id);
    set({ notifications: updated });
    get().saveNotificationsToStorage();
  },

  markAsRead: (id) => {
    const { notifications } = get();
    const updated = notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
    set({ notifications: updated });
    get().saveNotificationsToStorage();
  },

  clearAllNotifications: () => {
    set({ notifications: [], unreadCounts: {} });
    console.log('🧹 All notifications cleared');
    get().saveNotificationsToStorage();
  },

  incrementUnreadCount: (threadId) => {
    const { unreadCounts, currentUserEmail, currentBusinessId } = get();

    // Don't increment if we don't have proper context
    if (!currentUserEmail || !currentBusinessId) {
      return;
    }

    const newCount = (unreadCounts[threadId] || 0) + 1;

    const updatedCounts = {
      ...unreadCounts,
      [threadId]: newCount,
    };

    set({ unreadCounts: updatedCounts });
    get().saveNotificationsToStorage();

    console.log('📊 Unread count incremented for thread:', threadId, 'New count:', newCount);
  },

  markConversationAsRead: (threadId) => {
    const { unreadCounts, notifications } = get();

    // Reset unread count for this conversation
    const newUnreadCounts = { ...unreadCounts };
    delete newUnreadCounts[threadId];

    // Mark related notifications as read
    const updatedNotifications = notifications.map((n) =>
      n.threadId === threadId ? { ...n, isRead: true } : n,
    );

    set({
      unreadCounts: newUnreadCounts,
      notifications: updatedNotifications,
    });

    get().saveNotificationsToStorage();

    console.log('✅ Conversation marked as read:', threadId);
  },

  getUnreadCount: (threadId) => {
    const { unreadCounts } = get();
    return unreadCounts[threadId] || 0;
  },

  getTotalUnreadCount: () => {
    const { unreadCounts } = get();
    return Object.values(unreadCounts).reduce((total, count) => total + count, 0);
  },

  setSoundEnabled: (enabled) => {
    set({ soundEnabled: enabled });
    localStorage.setItem('notification-sound-enabled', enabled.toString());
    console.log('🔊 Notification sound', enabled ? 'enabled' : 'disabled');
  },

  playNotificationSound: () => {
    const { soundEnabled } = get();
    if (soundEnabled) {
      console.log('🔊 Playing notification sound');
      // The actual sound playing is handled in the useRealtimeConnection hook
    }
  },

  setUserContext: (userEmail, businessId) => {
    const { currentUserEmail, currentBusinessId } = get();

    // If context is changing, save current notifications first
    if (
      currentUserEmail &&
      currentBusinessId &&
      (currentUserEmail !== userEmail || currentBusinessId !== businessId)
    ) {
      get().saveNotificationsToStorage();
    }

    set({
      currentUserEmail: userEmail,
      currentBusinessId: businessId,
    });

    // Load notifications for the new context
    get().loadNotificationsForContext(userEmail, businessId);

    console.log('👤 User context updated:', { userEmail, businessId });
  },

  clearUserContext: () => {
    const { currentUserEmail, currentBusinessId } = get();

    // Save current notifications before clearing
    if (currentUserEmail && currentBusinessId) {
      get().saveNotificationsToStorage();
    }

    set({
      notifications: [],
      unreadCounts: {},
      currentUserEmail: null,
      currentBusinessId: null,
    });

    console.log('🧹 User context cleared');
  },

  loadNotificationsForContext: (userEmail, businessId) => {
    if (!userEmail || !businessId) {
      set({ notifications: [], unreadCounts: {} });
      return;
    }

    try {
      const storageKey = getStorageKey(userEmail, businessId);
      const stored = localStorage.getItem(storageKey);

      if (stored) {
        const parsed = JSON.parse(stored);
        set({
          notifications: parsed.notifications || [],
          unreadCounts: parsed.unreadCounts || {},
        });
        console.log('📥 Loaded notifications for context:', {
          userEmail,
          businessId,
          count: parsed.notifications?.length || 0,
        });
      } else {
        set({ notifications: [], unreadCounts: {} });
        console.log('📭 No notifications found for context:', { userEmail, businessId });
      }
    } catch (error) {
      console.error('Error loading notifications for context:', error);
      set({ notifications: [], unreadCounts: {} });
    }
  },

  saveNotificationsToStorage: () => {
    const { notifications, unreadCounts, currentUserEmail, currentBusinessId } = get();

    if (!currentUserEmail || !currentBusinessId) {
      return; // Don't save without proper context
    }

    try {
      const storageKey = getStorageKey(currentUserEmail, currentBusinessId);
      localStorage.setItem(
        storageKey,
        JSON.stringify({
          notifications,
          unreadCounts,
          lastUpdated: new Date().toISOString(),
        }),
      );
    } catch (error) {
      console.error('Error saving notifications to localStorage:', error);
    }
  },
}));

// Load sound preference from localStorage (this is global, not user-specific)
try {
  const soundEnabled = localStorage.getItem('notification-sound-enabled');
  if (soundEnabled !== null) {
    useNotificationStore.setState({ soundEnabled: soundEnabled === 'true' });
  }
} catch (error) {
  console.error('Error loading notification sound preference:', error);
}

// Clean up old notification storage format
try {
  const oldStorageKey = 'notifications-storage';
  if (localStorage.getItem(oldStorageKey)) {
    localStorage.removeItem(oldStorageKey);
    console.log('🧹 Cleaned up old notification storage format');
  }
} catch (error) {
  console.error('Error cleaning up old notification storage:', error);
}
