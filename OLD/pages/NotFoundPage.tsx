import { AlertTriangle, ArrowLeft, Home } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { useNavigationStore } from '../store/navigationStore';

const NotFoundPage = () => {
  const { navigateTo } = useNavigationStore();
  const { isAuthenticated, selectedBusinessId } = useAuthStore();

  const handleGoHome = () => {
    if (isAuthenticated && selectedBusinessId) {
      navigateTo('dashboard');
    } else {
      window.location.href = '/';
    }
  };

  const handleGoBack = () => {
    window.history.back();
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full text-center">
        {/* Logo */}
        <img
          src="/assets/LetParley_LogoMinimizado.png"
          alt="LetParley"
          className="h-12 w-auto mx-auto mb-8"
        />

        {/* Error Icon */}
        <div className="mb-6">
          <AlertTriangle className="h-20 w-20 text-amber-500 mx-auto" />
        </div>

        {/* Error Message */}
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Página No Encontrada</h1>

        <p className="text-gray-600 mb-2">La página que buscas no existe o ha sido movida.</p>

        <p className="text-sm text-gray-500 mb-8 font-mono bg-gray-100 px-3 py-2 rounded">
          Ruta solicitada: {window.location.pathname}
        </p>

        {/* Action Buttons */}
        <div className="space-y-4">
          <button
            onClick={handleGoHome}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary-dark transition-colors font-medium"
          >
            <Home className="h-5 w-5 mr-2" />
            Ir al Inicio
          </button>

          <button
            onClick={handleGoBack}
            className="w-full inline-flex items-center justify-center px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
          >
            <ArrowLeft className="h-5 w-5 mr-2" />
            Volver Atrás
          </button>
        </div>

        {/* Additional Help */}
        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-sm text-gray-500 mb-4">
            ¿Necesitas ayuda? Verifica que la URL esté escrita correctamente.
          </p>

          <div className="text-xs text-gray-400">
            <p>Si el problema persiste, contacta al soporte técnico.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
