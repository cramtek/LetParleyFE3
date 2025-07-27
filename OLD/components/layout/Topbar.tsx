import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Menu, Rocket, UserCircle } from 'lucide-react';
import { useRealtimeConnection } from '../../hooks/useRealtimeConnection';
import { useAuthStore } from '../../store/authStore';
import { useBusinessStore } from '../../store/businessStore';
import ChangelogModal from '../changelog/ChangelogModal';
import BusinessSwitcher from './BusinessSwitcher';
import NotificationsDropdown from './NotificationsDropdown';

interface TopbarProps {
  toggleSidebar: () => void;
}

const Topbar = ({ toggleSidebar }: TopbarProps) => {
  const { userEmail, sessionToken, selectedBusinessId, signOut } = useAuthStore();
  const { businesses } = useBusinessStore();
  const navigate = useNavigate();
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isChangelogModalOpen, setIsChangelogModalOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Initialize WebSocket connection for real-time notifications
  const { status: connectionStatus } = useRealtimeConnection(sessionToken, selectedBusinessId);

  // Get selected business name with safe property access
  const selectedBusiness = businesses.find((b) => b.business_id?.toString() === selectedBusinessId);
  const businessName = selectedBusiness?.name || 'Negocio';

  const handleSignOut = () => {
    signOut();
    navigate('/login');
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsProfileDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <>
      <header className="bg-white shadow-sm h-16 flex items-center justify-between px-4 z-50 relative">
        <div className="flex items-center space-x-3">
          {/* Mobile Menu Button - Always visible on mobile */}
          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            aria-label="Abrir menú"
          >
            <Menu className="h-5 w-5 text-gray-600" />
          </button>

          {/* Business name */}
          <div className="text-xl font-semibold text-gray-900 truncate max-w-xs">
            {businessName}
          </div>

          {/* Connection Status Indicator */}
          {connectionStatus && (
            <div
              className={`
              w-2 h-2 rounded-full
              ${
                connectionStatus === 'connected'
                  ? 'bg-green-500'
                  : connectionStatus === 'connecting'
                    ? 'bg-yellow-500 animate-pulse'
                    : 'bg-red-500'
              }
            `}
              title={`WebSocket: ${connectionStatus}`}
            />
          )}
        </div>

        <div className="flex items-center space-x-2">
          {/* Notifications Dropdown */}
          <NotificationsDropdown />

          {/* Changelog/Suggestions Button */}
          <button
            onClick={() => setIsChangelogModalOpen(true)}
            className="relative p-2 rounded-full hover:bg-gray-100 transition-colors duration-200"
            title="Novedades y Sugerencias"
          >
            <Rocket className="h-5 w-5 text-gray-600" />
          </button>

          <BusinessSwitcher />

          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center space-x-2 px-2 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <UserCircle className="h-8 w-8 text-gray-700" />
              <span className="text-sm font-medium text-gray-700 hidden md:block">
                {userEmail || 'Usuario'}
              </span>
            </button>

            {isProfileDropdownOpen && (
              <div className="absolute left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:transform-none mt-2 w-48 max-w-[calc(100vw-1rem)] md:w-48 bg-white rounded-md shadow-lg border border-gray-200 py-1 z-[60]">
                <button
                  className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                  onClick={handleSignOut}
                >
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Changelog Modal */}
      <ChangelogModal
        isOpen={isChangelogModalOpen}
        onClose={() => setIsChangelogModalOpen(false)}
      />
    </>
  );
};

export default Topbar;
