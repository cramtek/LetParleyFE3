import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, Check, ChevronDown } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { useBusinessStore } from '../../store/businessStore';
import { useConversationsStore } from '../../store/conversationsStore';
import { useMessagesStore } from '../../store/messagesStore';
import { useNavigationStore } from '../../store/navigationStore';

const BusinessSwitcher = () => {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const { selectedBusinessId, setSelectedBusinessId } = useAuthStore();
  const { businesses, isLoading, fetchBusinesses } = useBusinessStore();
  const { clearConversations } = useConversationsStore();
  const { clearMessages } = useMessagesStore();
  const { navigateTo } = useNavigationStore();

  // Filter out businesses with invalid business_id and find selected business
  const validBusinesses = businesses.filter((b) => b.business_id != null);
  const selectedBusiness = validBusinesses.find(
    (b) => b.business_id?.toString() === selectedBusinessId,
  );

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Always fetch businesses when component mounts
  useEffect(() => {
    fetchBusinesses();
  }, [fetchBusinesses]);

  const handleBusinessSelect = (business: (typeof validBusinesses)[0]) => {
    // Ensure business_id exists before converting to string
    if (!business.business_id) {
      console.error('Business has no valid business_id:', business);
      return;
    }

    const newBusinessId = business.business_id.toString();

    // Only proceed if it's actually a different business
    if (newBusinessId === selectedBusinessId) {
      setIsOpen(false);
      return;
    }

    console.log('Switching business from', selectedBusinessId, 'to', newBusinessId);

    // Clear conversations and messages state when switching business
    clearConversations();
    clearMessages();

    // Set the new business ID
    setSelectedBusinessId(newBusinessId);
    setIsOpen(false);

    // Navigate to dashboard using the navigation store (which uses the new routing)
    navigateTo('dashboard');
  };

  // Don't render anything while loading or if there's only one valid business
  if (isLoading || validBusinesses.length <= 1) {
    return null;
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors duration-200 group"
        title="Cambiar negocio"
      >
        <Building2 className="h-5 w-5 text-gray-600 group-hover:text-gray-800" />
        <span className="hidden md:block text-sm font-medium text-gray-700 group-hover:text-gray-900 max-w-32 truncate">
          {selectedBusiness?.name || 'Negocio'}
        </span>
        <ChevronDown
          className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
        />
      </button>

      {isOpen && (
        <div className="absolute left-1/2 transform -translate-x-1/2 md:left-auto md:right-0 md:transform-none mt-2 w-[calc(100vw-2rem)] max-w-80 md:w-80 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-[60] max-h-96 overflow-hidden">
          <div className="px-4 py-2 border-b border-gray-100">
            <h3 className="text-sm font-medium text-gray-900">Cambiar Negocio</h3>
            <p className="text-xs text-gray-500 mt-1">Selecciona el negocio que deseas gestionar</p>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {validBusinesses.map((business) => {
              // Ensure business_id exists before comparison
              const businessIdStr = business.business_id?.toString();
              const isSelected = businessIdStr === selectedBusinessId;

              return (
                <button
                  key={business.business_id}
                  onClick={() => handleBusinessSelect(business)}
                  className={`w-full px-4 py-3 hover:bg-gray-50 text-left transition-colors duration-200 flex items-center space-x-3 ${
                    isSelected ? 'bg-primary/5' : ''
                  }`}
                >
                  <div className="flex-shrink-0">
                    {business.logo ? (
                      <img
                        src={business.logo}
                        alt={`${business.name} logo`}
                        className="h-10 w-10 rounded-lg object-contain bg-gray-50"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src =
                            'https://apps.letparley.com/LPMobileApp/assets/lp-darklogo.png';
                        }}
                      />
                    ) : (
                      <div className="h-10 w-10 rounded-lg bg-gray-100 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-gray-400" />
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p
                        className={`text-sm font-medium truncate ${
                          isSelected ? 'text-primary' : 'text-gray-900'
                        }`}
                      >
                        {business.name}
                      </p>
                      {isSelected && <Check className="h-4 w-4 text-primary flex-shrink-0" />}
                    </div>

                    <div className="mt-1 space-y-1">
                      <p className="text-xs text-gray-500 truncate">
                        {business.industry || 'Sin industria especificada'}
                      </p>
                      {business.business_credits_id && (
                        <p className="text-xs text-gray-600">
                          <span className="font-medium">Créditos ID:</span>{' '}
                          <span className="text-primary font-medium">
                            {business.business_credits_id}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};

export default BusinessSwitcher;
