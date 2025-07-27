import { useEffect, useRef, useState } from 'react';
import { useCallback } from 'react';
import {
  BarChart2,
  Bot,
  ChevronLeft,
  CreditCard,
  FolderKanban,
  HelpCircle,
  MessageSquare,
  Settings,
  Share2,
  ShoppingBag,
  Users,
} from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { NavigationView, useNavigationStore } from '../../store/navigationStore';

interface SidebarProps {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const Sidebar = ({ isOpen, toggleSidebar }: SidebarProps) => {
  const [isHovering, setIsHovering] = useState(false);
  const [showText, setShowText] = useState(false);
  const sidebarRef = useRef<HTMLDivElement>(null);
  const { userEmail } = useAuthStore();
  const { currentView, navigateTo } = useNavigationStore();

  // Check if we're on mobile
  const isMobile = () => window.innerWidth < 1024; // lg breakpoint

  // Check if user is admin
  const isAdmin = userEmail === 'cramtek@hotmail.com';

  // Determine if sidebar should be expanded based on device and hover state
  const isExpanded = isMobile() ? isOpen : isHovering;

  // Delayed text display
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isExpanded) {
      // Delay showing text until sidebar is expanded
      timer = setTimeout(() => {
        setShowText(true);
      }, 150); // Delay text appearance by 150ms
    } else {
      // Hide text immediately when collapsing
      setShowText(false);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [isExpanded]);

  const navigationItems = [
    {
      name: 'Panel de Control',
      view: 'dashboard' as NavigationView,
      icon: <BarChart2 className="w-5 h-5" />,
    },
    {
      name: 'Conversaciones',
      view: 'conversations' as NavigationView,
      icon: <MessageSquare className="w-5 h-5" />,
    },
    { name: 'Clientes', view: 'clients' as NavigationView, icon: <Users className="w-5 h-5" /> },
    {
      name: 'Proyectos',
      view: 'projects' as NavigationView,
      icon: <FolderKanban className="w-5 h-5" />,
      submenu: [
        { name: 'Mis Proyectos', view: 'projects' as NavigationView },
        ...(isAdmin ? [{ name: 'Administración', view: 'projects-admin' as NavigationView }] : []),
      ],
    },
    { name: 'Asistentes', view: 'assistants' as NavigationView, icon: <Bot className="w-5 h-5" /> },
    {
      name: 'Integraciones',
      view: 'integrations' as NavigationView,
      icon: <Share2 className="w-5 h-5" />,
    },
    {
      name: 'Marketplace',
      view: 'marketplace' as NavigationView,
      icon: <ShoppingBag className="w-5 h-5" />,
    },
    {
      name: 'Suscripción',
      view: 'subscription' as NavigationView,
      icon: <CreditCard className="w-5 h-5" />,
    },
    {
      name: '¿Necesitas Ayuda?',
      view: 'help' as NavigationView,
      icon: <HelpCircle className="w-5 h-5" />,
    },
  ];

  const handleNavigation = (view: NavigationView) => {
    navigateTo(view);
    // Close sidebar on mobile after navigation
    if (isMobile()) {
      toggleSidebar();
    }
  };

  // Handle mouse enter/leave for desktop hover effect
  const handleMouseEnter = () => {
    if (!isMobile()) {
      setIsHovering(true);
    }
  };

  const handleMouseLeave = () => {
    if (!isMobile()) {
      setIsHovering(false);
    }
  };

  return (
    <>
      {/* Mobile sidebar backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar */}
      <aside
        ref={sidebarRef}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        className={`
          fixed lg:static inset-y-0 left-0 z-50 bg-white shadow-md
          transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0 w-64' : '-translate-x-full w-64'} 
          ${!isOpen && 'lg:translate-x-0'} 
          ${isHovering ? 'lg:w-64' : 'lg:w-20'}
        `}
      >
        {/* Logo area */}
        <div className="h-16 flex items-center justify-between px-4 border-b">
          <div>
            {isExpanded ? (
              <>
                {showText && (
                  <img
                    src="/assets/LetParley_LogoCompleto.png"
                    alt="LetParley"
                    className="h-8 w-auto transition-opacity duration-200"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.style.display = 'none';
                      // Fallback to text if image fails
                      const fallback = document.createElement('div');
                      fallback.className = 'font-bold text-xl text-primary';
                      fallback.textContent = 'LetParley';
                      target.parentNode?.appendChild(fallback);
                    }}
                  />
                )}
              </>
            ) : (
              <img
                src="/assets/LetParley_LogoMinimizado.png"
                alt="LetParley"
                className="h-8 w-8"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  // Fallback to text if image fails
                  const fallback = document.createElement('div');
                  fallback.className = 'font-bold text-lg text-primary';
                  fallback.textContent = 'LP';
                  target.parentNode?.appendChild(fallback);
                }}
              />
            )}
          </div>

          <button
            onClick={toggleSidebar}
            className="lg:hidden p-2 rounded-full hover:bg-gray-100"
            aria-label="Cerrar barra lateral"
          >
            <ChevronLeft className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        {/* Navigation items */}
        <nav className="mt-6 px-3">
          <ul className="space-y-2">
            {navigationItems.map((item) => {
              const isActive =
                currentView === item.view ||
                (item.submenu && item.submenu.some((sub) => currentView === sub.view));

              return (
                <li key={item.view}>
                  <button
                    onClick={() => handleNavigation(item.view)}
                    className={`
                      w-full flex items-center px-3 py-3 rounded-md text-left
                      transition-colors duration-200
                      ${
                        isActive
                          ? 'bg-primary text-white font-medium'
                          : 'text-gray-700 hover:bg-gray-100'
                      }
                    `}
                  >
                    <span className={`${isActive ? 'text-white' : 'text-gray-500'}`}>
                      {item.icon}
                    </span>

                    {isExpanded && showText && (
                      <span className="ml-3 transition-opacity duration-200">{item.name}</span>
                    )}
                  </button>

                  {/* Submenu */}
                  {item.submenu && isExpanded && showText && (
                    <ul className="ml-6 mt-2 space-y-1">
                      {item.submenu.map((subItem) => {
                        const isSubActive = currentView === subItem.view;
                        return (
                          <li key={subItem.view}>
                            <button
                              onClick={() => handleNavigation(subItem.view)}
                              className={`
                                w-full text-left px-3 py-2 rounded-md text-sm
                                transition-colors duration-200
                                ${
                                  isSubActive
                                    ? 'bg-primary/10 text-primary font-medium'
                                    : 'text-gray-600 hover:bg-gray-50'
                                }
                              `}
                            >
                              {subItem.name}
                            </button>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>
    </>
  );
};

export default Sidebar;
