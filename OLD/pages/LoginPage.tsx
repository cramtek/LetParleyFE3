import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ExternalLink, Mail, Sparkles } from 'lucide-react';
import TermsAndPrivacyModal from '../components/auth/TermsAndPrivacyModal';
import { checkTermsAcceptance } from '../services/authService';
import { useAuthStore } from '../store/authStore';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [showTermsModal, setShowTermsModal] = useState(false);
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(false);

  const navigate = useNavigate();
  const { setUserEmail } = useAuthStore();

  // Check terms acceptance when email changes
  useEffect(() => {
    const checkUserTerms = async () => {
      // Basic email validation
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!email || !emailRegex.test(email)) return;

      setIsCheckingTerms(true);
      try {
        const { accepted } = await checkTermsAcceptance(email);
        setHasAcceptedTerms(accepted);
      } catch (error) {
        console.error('Error checking terms acceptance:', error);
        // If there's an error, assume terms haven't been accepted
        setHasAcceptedTerms(false);
      } finally {
        setIsCheckingTerms(false);
      }
    };

    checkUserTerms();
  }, [email]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      setError('El email es requerido');
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Por favor ingresa un email válido');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('https://api3.letparley.com/lpmobile/sendcode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Error al enviar el código de verificación');
      }

      // Store email in state for verification page
      setUserEmail(email);

      // Show success state briefly before navigating
      setIsSuccess(true);

      setTimeout(() => {
        navigate('/verify');
      }, 1500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error al enviar el código de verificación. Inténtalo de nuevo.',
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-8 shadow-xl sm:rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                <Mail className="h-8 w-8 text-green-600 animate-bounce" />
              </div>
              <h2 className="text-2xl font-bold text-gray-900 mb-4">¡Código Enviado!</h2>
              <p className="text-gray-600 mb-6">
                Hemos enviado un código de verificación a{' '}
                <span className="font-semibold text-blue-600">{email}</span>
              </p>
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm">Redirigiendo...</span>
                <ArrowRight className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center mb-8">
          <img src="/assets/LetParley_LogoCompleto.png" alt="LetParley" className="h-12 w-auto" />
        </div>
        <div className="text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Bienvenido a LetParley</h2>
          <p className="text-gray-600 mb-2">Mensajería, Automatización y Desarrollo</p>
          <div className="flex items-center justify-center space-x-1 text-sm text-gray-500 mb-8">
            <Sparkles className="h-4 w-4 text-yellow-500" />
            <span>Ingresa tu email para comenzar</span>
            <Sparkles className="h-4 w-4 text-yellow-500" />
          </div>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-xl sm:rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Dirección de email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (error) setError(''); // Clear error when user starts typing
                  }}
                  className="appearance-none block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-xl shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                  placeholder="tu@empresa.com"
                  disabled={isLoading}
                />
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-md">
                <div className="flex">
                  <div className="ml-3">
                    <p className="text-sm text-red-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={isLoading || !email}
                className={`
                  w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
                  bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transition-all duration-200 transform hover:scale-105
                  ${isLoading || !email ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
                `}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Enviando código...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>Continuar</span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>

            {/* Terms Acceptance Info */}
            <div className="text-center space-y-2">
              <p className="text-xs text-gray-500 leading-relaxed">
                Te enviaremos un código de verificación por email.
                <br />
                Si no tienes cuenta, la crearemos automáticamente.
              </p>

              {hasAcceptedTerms ? (
                <div className="flex items-center justify-center text-xs text-green-600">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  <span>Ya has aceptado nuestros términos y políticas de privacidad</span>
                </div>
              ) : (
                <p className="text-xs text-gray-500">
                  Al continuar, aceptas nuestros{' '}
                  <button
                    type="button"
                    onClick={() => setShowTermsModal(true)}
                    className="text-primary hover:text-primary-dark underline inline-flex items-center"
                  >
                    Términos y Condiciones y Políticas de Privacidad
                    <ExternalLink className="h-3 w-3 ml-0.5" />
                  </button>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
};

export default LoginPage;
