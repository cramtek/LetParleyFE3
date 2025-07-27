import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Building2, ExternalLink, Plus, Sparkles } from 'lucide-react';
import CreateBusinessWizard from '../components/business/CreateBusinessWizard';
import { useAuthStore } from '../store/authStore';
import { useBusinessStore } from '../store/businessStore';

const SelectBusinessPage = () => {
  const navigate = useNavigate();
  const { sessionToken, isAuthenticated, setSelectedBusinessId } = useAuthStore();
  const { businesses, isLoading, error, fetchBusinesses } = useBusinessStore();

  const [showCreateWizard, setShowCreateWizard] = useState(false);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated || !sessionToken) {
      console.log('Not authenticated, redirecting to login');
      navigate('/login', { replace: true });
      return;
    }

    // Fetch businesses when component mounts
    console.log('Fetching businesses for authenticated user');
    fetchBusinesses();
  }, [isAuthenticated, sessionToken, navigate, fetchBusinesses]);

  const handleSelectBusiness = (business: (typeof businesses)[0]) => {
    console.log('Selecting business:', business.business_id);
    setSelectedBusinessId(business.business_id.toString());
    navigate('/'); // Cambié de '/app' a '/'
  };

  const handleCreateSuccess = (businessId: number) => {
    console.log('Business created successfully:', businessId);
    setShowCreateWizard(false);
    setSelectedBusinessId(businessId.toString());
    navigate('/'); // Cambié de '/app' a '/'
  };

  // Auto-select if only one business
  useEffect(() => {
    if (businesses.length === 1 && !isLoading && !error) {
      console.log('Auto-selecting single business:', businesses[0].business_id);
      handleSelectBusiness(businesses[0]);
    }
  }, [businesses, isLoading, error]);

  // Don't render anything if not authenticated
  if (!isAuthenticated || !sessionToken) {
    return null;
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center items-center p-4">
        <img
          src="/assets/LetParley_LogoCompleto.png"
          alt="LetParley"
          className="h-12 w-auto mb-8"
        />
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        <p className="mt-4 text-gray-700">Cargando tus negocios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center items-center p-4">
        <img
          src="/assets/LetParley_LogoCompleto.png"
          alt="LetParley"
          className="h-12 w-auto mb-8"
        />
        <div className="max-w-md w-full bg-white rounded-lg shadow-sm p-6 text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={() => fetchBusinesses()}
            className="px-4 py-2 bg-primary text-white rounded-md hover:bg-primary-dark transition-colors"
          >
            Intentar de nuevo
          </button>
        </div>
      </div>
    );
  }

  // No businesses found - show create business option
  if (businesses.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto w-full">
          <div className="text-center mb-12">
            <img
              src="/assets/LetParley_LogoCompleto.png"
              alt="LetParley"
              className="h-12 w-auto mx-auto mb-8"
            />
            <div className="flex items-center justify-center mb-6">
              <Sparkles className="h-8 w-8 text-yellow-500 mr-3 animate-pulse" />
              <h2 className="text-3xl font-bold text-gray-900">¡Bienvenido a LetParley!</h2>
              <Sparkles className="h-8 w-8 text-yellow-500 ml-3 animate-pulse" />
            </div>
            <p className="text-xl text-gray-600 mb-4">
              Para comenzar, necesitas crear tu primer negocio
            </p>
            <p className="text-gray-500">
              Esto te permitirá gestionar conversaciones y conectar con tus clientes
            </p>
          </div>

          {/* Create Business Card */}
          <div className="max-w-2xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:scale-105">
              <div className="bg-gradient-to-r from-blue-600 to-purple-600 h-32 flex items-center justify-center">
                <div className="text-center text-white">
                  <Building2 className="h-12 w-12 mx-auto mb-2 animate-bounce" />
                  <h3 className="text-xl font-bold">Crear Mi Primer Negocio</h3>
                </div>
              </div>

              <div className="p-8">
                <div className="text-center mb-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-2">
                    Configura tu negocio en minutos
                  </h4>
                  <p className="text-gray-600">
                    Te guiaremos paso a paso para configurar toda la información de tu empresa
                  </p>
                </div>

                {/* Features */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Configuración rápida y fácil</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Gestión de conversaciones</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Múltiples canales de comunicación</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-green-600 font-bold text-sm">✓</span>
                    </div>
                    <span className="text-sm text-gray-700">Análisis y reportes</span>
                  </div>
                </div>

                <button
                  onClick={() => setShowCreateWizard(true)}
                  className="w-full py-4 px-6 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center gap-3 font-semibold text-lg shadow-lg hover:shadow-xl transform hover:scale-105"
                >
                  <Plus className="h-6 w-6" />
                  Crear Mi Negocio
                </button>

                <p className="text-xs text-gray-500 text-center mt-4">
                  Solo necesitas el nombre y email para comenzar. El resto lo puedes completar
                  después.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Create Business Wizard */}
        {showCreateWizard && (
          <CreateBusinessWizard
            onClose={() => setShowCreateWizard(false)}
            onSuccess={handleCreateSuccess}
          />
        )}
      </div>
    );
  }

  // Multiple businesses - show selection
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto w-full">
        <div className="text-center mb-12">
          <img
            src="/assets/LetParley_LogoCompleto.png"
            alt="LetParley"
            className="h-12 w-auto mx-auto mb-8"
          />
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Selecciona un Negocio</h2>
          <p className="text-lg text-gray-600 mb-6">Elige el negocio que quieres gestionar</p>

          {/* Add New Business Button */}
          <button
            onClick={() => setShowCreateWizard(true)}
            className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Plus className="h-5 w-5 mr-2" />
            Agregar Nuevo Negocio
          </button>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {businesses.map((business) => (
            <div
              key={business.business_id}
              className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-300"
            >
              <div className="h-40 bg-gradient-to-br from-gray-50 to-gray-100 flex items-center justify-center p-6">
                {business.logo ? (
                  <img
                    src={business.logo}
                    alt={`${business.name} logo`}
                    className="max-h-full max-w-full object-contain"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = '/assets/LetParley_LogoMinimizado.png';
                    }}
                  />
                ) : (
                  <img
                    src="/assets/LetParley_LogoMinimizado.png"
                    alt="Default logo"
                    className="max-h-full max-w-full object-contain opacity-50"
                  />
                )}
              </div>

              <div className="p-6">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">{business.name}</h3>

                <div className="space-y-3 mb-6">
                  <p className="text-sm text-gray-600">
                    <span className="font-medium text-gray-900">Industria:</span>{' '}
                    {business.industry || 'No especificada'}
                  </p>

                  {business.website && (
                    <a
                      href={business.website}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-primary hover:text-primary-dark flex items-center gap-1"
                    >
                      {business.website}
                      <ExternalLink className="h-4 w-4" />
                    </a>
                  )}

                  {business.business_credits_id && (
                    <p className="text-sm">
                      <span className="font-medium text-gray-900">ID de Créditos:</span>{' '}
                      <span className="text-primary font-medium">
                        {business.business_credits_id}
                      </span>
                    </p>
                  )}

                  <p className="text-sm">
                    <span className="font-medium text-gray-900">Registrado:</span>{' '}
                    <span className="text-gray-600">
                      {new Date(business.date_registered).toLocaleDateString('es-ES')}
                    </span>
                  </p>
                </div>

                <button
                  onClick={() => handleSelectBusiness(business)}
                  className="w-full py-2 px-4 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors duration-200 flex items-center justify-center gap-2"
                >
                  Seleccionar Negocio
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Create Business Wizard */}
      {showCreateWizard && (
        <CreateBusinessWizard
          onClose={() => setShowCreateWizard(false)}
          onSuccess={handleCreateSuccess}
        />
      )}
    </div>
  );
};

export default SelectBusinessPage;
