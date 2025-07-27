import AssistantsPage from '../../pages/AssistantsPage';
import ClientsPage from '../../pages/ClientsPage';
import ConversationsPage from '../../pages/ConversationsPage';
// Import all page components
import DashboardPage from '../../pages/DashboardPage';
import HelpPage from '../../pages/HelpPage';
import IntegrationsPage from '../../pages/IntegrationsPage';
import MarketplacePage from '../../pages/MarketplacePage';
import ProjectsAdminPage from '../../pages/ProjectsAdminPage';
import ProjectsPage from '../../pages/ProjectsPage';
import SubscriptionPage from '../../pages/SubscriptionPage';
import { NavigationView, useNavigationStore } from '../../store/navigationStore';

const ViewRenderer = () => {
  const { currentView } = useNavigationStore();

  const renderView = (view: NavigationView) => {
    switch (view) {
      case 'dashboard':
        return <DashboardPage />;
      case 'conversations':
        return <ConversationsPage />;
      case 'clients':
        return <ClientsPage />;
      case 'projects':
        return <ProjectsPage />;
      case 'projects-admin':
        return <ProjectsAdminPage />;
      case 'assistants':
        return <AssistantsPage />;
      case 'integrations':
        return <IntegrationsPage />;
      case 'marketplace':
        return <MarketplacePage />;
      case 'subscription':
        return <SubscriptionPage />;
      case 'help':
        return <HelpPage />;
      default:
        return <DashboardPage />;
    }
  };

  return <div className="h-full">{renderView(currentView)}</div>;
};

export default ViewRenderer;
