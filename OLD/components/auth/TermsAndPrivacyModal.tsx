import { ExternalLink, X } from 'lucide-react';

interface TermsAndPrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TermsAndPrivacyModal = ({ isOpen, onClose }: TermsAndPrivacyModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Términos y Políticas de Privacidad</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Términos y Condiciones</h3>
            <p className="text-gray-700">
              Al utilizar LetParley, aceptas cumplir con nuestros términos y condiciones que rigen
              el uso de nuestra plataforma. Estos términos establecen las reglas para el uso del
              servicio, las responsabilidades de los usuarios, y las limitaciones de
              responsabilidad.
            </p>
            <a
              href="https://letparley.com/terms-of-service/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Ver Términos y Condiciones completos
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-900">Política de Privacidad</h3>
            <p className="text-gray-700">
              Nuestra política de privacidad describe cómo recopilamos, usamos y protegemos tu
              información personal. Respetamos tu privacidad y nos comprometemos a proteger tus
              datos personales de acuerdo con las leyes y regulaciones aplicables.
            </p>
            <a
              href="https://letparley.com/privacy-policy/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center text-blue-600 hover:text-blue-800"
            >
              Ver Política de Privacidad completa
              <ExternalLink className="h-4 w-4 ml-1" />
            </a>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              Al marcar la casilla de aceptación, confirmas que has leído, entendido y aceptado
              nuestros Términos y Condiciones y nuestra Política de Privacidad. Esta aceptación es
              necesaria para utilizar LetParley y cumplir con los requisitos de Meta y las
              regulaciones legales aplicables.
            </p>
          </div>
        </div>

        <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default TermsAndPrivacyModal;
