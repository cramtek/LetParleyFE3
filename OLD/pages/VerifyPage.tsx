import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowRight, CheckCircle, ExternalLink, Sparkles, Star } from 'lucide-react';
import TermsAndPrivacyModal from '../components/auth/TermsAndPrivacyModal';
import { acceptTerms, checkTermsAcceptance } from '../services/authService';
import { useAuthStore } from '../store/authStore';

interface VerifyResponse {
  success: boolean;
  session_token?: string;
  message: string;
  is_new_user: boolean;
  user_id?: string;
}

const VerifyPage = () => {
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(4).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const [successData, setSuccessData] = useState<VerifyResponse | null>(null);
  const inputRefs = useRef<(HTMLInputElement | null)[]>(Array(4).fill(null));
  const [hasAcceptedTerms, setHasAcceptedTerms] = useState(false);
  const [isCheckingTerms, setIsCheckingTerms] = useState(true);
  const [showTermsModal, setShowTermsModal] = useState(false);

  const navigate = useNavigate();
  const { userEmail, signIn } = useAuthStore();

  // Redirect to login if email is not set
  useEffect(() => {
    if (!userEmail) {
      navigate('/login');
    }
  }, [userEmail, navigate]);

  // Check if user has already accepted terms
  useEffect(() => {
    const checkUserTerms = async () => {
      if (!userEmail) return;

      setIsCheckingTerms(true);
      try {
        const { accepted } = await checkTermsAcceptance(userEmail);
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
  }, [userEmail]);

  const handleInputChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }

    // Update the code array
    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    // Auto-focus next input if current input is filled
    if (value && index < 3) {
      inputRefs.current[index + 1]?.focus();
    }

    // 🔧 CORREGIDO: Solo autosubmit si términos están aceptados o no se requieren
    if (value && index === 3) {
      // Check if all inputs will be filled with this change
      const isComplete = newCode.every((digit) => digit.length === 1);
      if (isComplete) {
        const completeCode = newCode.join('');

        // ⚠️ NUEVA LÓGICA: Solo autosubmit si términos están OK
        const shouldAutoSubmit = hasAcceptedTerms || isCheckingTerms;

        if (shouldAutoSubmit) {
          console.log('✅ Autosubmit permitido - términos aceptados o verificando');
          setTimeout(() => {
            submitCode(completeCode);
          }, 100);
        } else {
          console.log('⏸️ Autosubmit bloqueado - términos no aceptados');
          // No hacer autosubmit, usuario debe hacer clic en el botón después de aceptar términos
        }
      }
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    // Move to previous input on backspace if current input is empty
    if (e.key === 'Backspace' && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();

    // Check if pasted content is a 4-digit number
    if (/^\d{4}$/.test(pastedData)) {
      const newCode = pastedData.split('');
      setVerificationCode(newCode);

      // Focus the last input
      inputRefs.current[3]?.focus();

      // 🔧 CORREGIDO: Solo autosubmit si términos están aceptados o no se requieren
      const shouldAutoSubmit = hasAcceptedTerms || isCheckingTerms;

      if (shouldAutoSubmit) {
        console.log('✅ Autosubmit (paste) permitido - términos aceptados o verificando');
        setTimeout(() => {
          submitCode(pastedData);
        }, 100);
      } else {
        console.log('⏸️ Autosubmit (paste) bloqueado - términos no aceptados');
        // No hacer autosubmit, usuario debe hacer clic en el botón después de aceptar términos
      }
    }
  };

  const submitCode = async (code: string) => {
    if (code.length !== 4) {
      setError('Por favor ingresa un código válido de 4 dígitos');
      return;
    }

    // 🔧 VALIDACIÓN MEJORADA: Solo proceder si términos están aceptados o no se requieren
    if (!hasAcceptedTerms && !isCheckingTerms) {
      setError('Debes aceptar los términos y políticas de privacidad para continuar');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      // PASO 1: Verificar código primero
      const response = await fetch('https://api3.letparley.com/lpmobile/verifycode', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: userEmail,
          code: code,
        }),
      });

      const data: VerifyResponse = await response.json();

      if (data.success && data.session_token) {
        // PASO 2: Usuario verificado exitosamente
        console.log('✅ Verificación exitosa:', data);

        // PASO 3: Si el usuario aceptó términos mediante checkbox, registrarlo en BD
        if (hasAcceptedTerms && !isCheckingTerms) {
          try {
            console.log('📝 Registrando aceptación de términos...');
            const termsResult = await acceptTerms(userEmail!);

            if (termsResult.success) {
              console.log('✅ Términos aceptados y registrados en BD');
            } else {
              console.error('❌ Error registrando términos:', termsResult.message);
              // No bloquear el flujo, pero logear el error
            }
          } catch (acceptError) {
            console.error('❌ Error en acceptTerms:', acceptError);
            // No bloquear el flujo si hay error registrando términos
          }
        }

        // PASO 4: Continuar con el flujo normal
        setSuccessData(data);
        setIsSuccess(true);
        signIn(data.session_token, userEmail!);

        // PASO 5: Navegación
        setTimeout(() => {
          navigate('/select-business');
        }, 2500);
      } else {
        setError(data.message || 'Error al verificar el código');
      }
    } catch (err) {
      setError('Error al verificar el código. Inténtalo de nuevo.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const code = verificationCode.join('');
    await submitCode(code);
  };

  // 🔧 NUEVA FUNCIÓN: Manejar cambio en checkbox de términos
  const handleTermsCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isChecked = e.target.checked;
    setHasAcceptedTerms(isChecked);

    if (error) setError(''); // Limpiar error al cambiar checkbox

    // Si acaba de aceptar términos y el código está completo, permitir autosubmit
    if (isChecked && verificationCode.join('').length === 4) {
      console.log('✅ Términos aceptados con código completo - habilitando submit');
      // Opcional: podrías hacer autosubmit aquí si quieres
      // setTimeout(() => {
      //   submitCode(verificationCode.join(''));
      // }, 100);
    }
  };

  // Success animation component
  if (isSuccess && successData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-blue-50 to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-8 shadow-xl sm:rounded-2xl border border-gray-100">
            <div className="text-center">
              {/* Success Icon with Animation */}
              <div className="mx-auto flex items-center justify-center h-20 w-20 rounded-full bg-green-100 mb-6 animate-pulse">
                <CheckCircle className="h-12 w-12 text-green-600 animate-bounce" />
              </div>

              {/* Welcome Message */}
              <div className="mb-6">
                {successData.is_new_user ? (
                  <>
                    <div className="flex items-center justify-center mb-4">
                      <Sparkles className="h-6 w-6 text-yellow-500 mr-2 animate-spin" />
                      <h2 className="text-2xl font-bold text-gray-900">¡Bienvenido a LetParley!</h2>
                      <Sparkles className="h-6 w-6 text-yellow-500 ml-2 animate-spin" />
                    </div>
                    <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700 leading-relaxed">{successData.message}</p>
                    </div>
                  </>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 mb-4">
                      ¡Bienvenido de vuelta!
                    </h2>
                    <div className="bg-blue-50 rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-700">{successData.message}</p>
                    </div>
                  </>
                )}
              </div>

              {/* Loading indicator */}
              <div className="flex items-center justify-center space-x-2 text-gray-600">
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm">Preparando tu experiencia...</span>
                <ArrowRight className="h-4 w-4 animate-pulse" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show loading state while checking terms acceptance
  if (isCheckingTerms) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-md">
          <div className="bg-white py-12 px-8 shadow-xl sm:rounded-2xl border border-gray-100">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="mt-4 text-gray-600">Cargando...</p>
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
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Código de Verificación</h2>
          <p className="text-gray-600 mb-2">Hemos enviado un código de 4 dígitos a</p>
          <p className="font-semibold text-blue-600 mb-6">{userEmail}</p>
        </div>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-10 px-8 shadow-xl sm:rounded-2xl border border-gray-100">
          <form className="space-y-8" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="code"
                className="block text-sm font-medium text-gray-700 text-center mb-6"
              >
                Ingresa el código de verificación
              </label>

              {/* Code Input */}
              <div className="flex justify-center space-x-3 mb-6">
                {verificationCode.map((digit, index) => (
                  <input
                    key={index}
                    ref={(el) => (inputRefs.current[index] = el)}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleInputChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                    onPaste={index === 0 ? handlePaste : undefined}
                    className="w-14 h-14 text-center text-xl font-bold border-2 border-gray-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 hover:border-gray-400"
                    required
                    disabled={isLoading}
                  />
                ))}
              </div>

              {/* Helper text */}
              <p className="text-xs text-gray-500 text-center mb-4">
                Revisa tu bandeja de entrada y carpeta de spam
              </p>
            </div>

            {/* Terms and Conditions Checkbox - Solo mostrar si no ha aceptado */}
            {!hasAcceptedTerms && !isCheckingTerms && (
              <div className="mt-6">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="terms"
                      name="terms"
                      type="checkbox"
                      checked={hasAcceptedTerms}
                      onChange={handleTermsCheckboxChange}
                      className="h-4 w-4 text-primary border-gray-300 rounded focus:ring-primary"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <label htmlFor="terms" className="text-gray-700">
                      Acepto los{' '}
                      <button
                        type="button"
                        onClick={() => setShowTermsModal(true)}
                        className="text-primary hover:text-primary-dark underline inline-flex items-center"
                      >
                        Términos y Condiciones y Políticas de Privacidad
                        <ExternalLink className="h-3 w-3 ml-0.5" />
                      </button>
                    </label>
                    <p className="text-gray-500 mt-1">Requerido para usar LetParley</p>
                  </div>
                </div>
              </div>
            )}

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

            {/* Submit Button - CORREGIDO */}
            <div>
              <button
                type="submit"
                disabled={
                  isLoading ||
                  verificationCode.join('').length !== 4 ||
                  (!hasAcceptedTerms && !isCheckingTerms) // Deshabilitar si términos no aceptados
                }
                className={`
                  w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-xl shadow-sm text-sm font-medium text-white 
                  bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                  transition-all duration-200 transform hover:scale-105
                  ${isLoading || verificationCode.join('').length !== 4 || (!hasAcceptedTerms && !isCheckingTerms) ? 'opacity-50 cursor-not-allowed hover:scale-100' : ''}
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
                    Verificando...
                  </div>
                ) : (
                  <div className="flex items-center">
                    <span>
                      {!hasAcceptedTerms && !isCheckingTerms
                        ? 'Acepta términos para continuar'
                        : 'Verificar Código'}
                    </span>
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </div>
                )}
              </button>
            </div>

            {/* Resend Code */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  // Navigate back to login to resend code
                  navigate('/login');
                }}
                className="text-sm text-blue-600 hover:text-blue-500 font-medium transition-colors duration-200"
                disabled={isLoading}
              >
                ¿No recibiste el código? Enviar de nuevo
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Terms and Privacy Modal */}
      <TermsAndPrivacyModal isOpen={showTermsModal} onClose={() => setShowTermsModal(false)} />
    </div>
  );
};

export default VerifyPage;
