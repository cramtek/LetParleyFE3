import { create } from 'zustand';

export type NavigationView =
  | 'dashboard'
  | 'conversations'
  | 'clients'
  | 'projects'
  | 'projects-admin'
  | 'assistants'
  | 'integrations'
  | 'marketplace'
  | 'subscription'
  | 'help';

interface NavigationState {
  currentView: NavigationView;
  previousView: NavigationView | null;
  viewHistory: NavigationView[];

  // Actions
  navigateTo: (view: NavigationView) => void;
  goBack: () => void;
  canGoBack: () => boolean;
  clearHistory: () => void;
}

export const useNavigationStore = create<NavigationState>((set, get) => ({
  currentView: 'dashboard',
  previousView: null,
  viewHistory: ['dashboard'],

  navigateTo: (view) => {
    const { currentView, viewHistory } = get();

    // Don't navigate if already on the same view
    if (currentView === view) return;

    const newHistory = [...viewHistory, view];

    set({
      previousView: currentView,
      currentView: view,
      viewHistory: newHistory,
    });

    console.log('🧭 Navigated to:', view);
  },

  goBack: () => {
    const { viewHistory } = get();

    if (viewHistory.length > 1) {
      const newHistory = [...viewHistory];
      newHistory.pop(); // Remove current view
      const previousView = newHistory[newHistory.length - 1];

      set({
        currentView: previousView,
        previousView: viewHistory[viewHistory.length - 2] || null,
        viewHistory: newHistory,
      });

      console.log('🔙 Navigated back to:', previousView);
    }
  },

  canGoBack: () => {
    const { viewHistory } = get();
    return viewHistory.length > 1;
  },

  clearHistory: () => {
    set({
      currentView: 'dashboard',
      previousView: null,
      viewHistory: ['dashboard'],
    });
  },
}));
