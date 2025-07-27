import { useEffect, useState } from 'react';
import { useNavigationStore } from '../../store/navigationStore';
import ToastContainer from '../common/ToastContainer';
import Sidebar from './Sidebar';
import Topbar from './Topbar';
import ViewRenderer from './ViewRenderer';

const MainLayout = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const { currentView } = useNavigationStore();

  // Collapse sidebar when entering conversations page
  useEffect(() => {
    if (currentView === 'conversations') {
      setIsSidebarOpen(false);
    }
  }, [currentView]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div className="flex flex-col flex-grow overflow-hidden">
        <Topbar toggleSidebar={toggleSidebar} />

        <main className="flex-grow overflow-auto p-6">
          <ViewRenderer />
        </main>
        <ToastContainer />
      </div>
    </div>
  );
};

export default MainLayout;
