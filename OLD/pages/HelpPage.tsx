import { useEffect, useState } from 'react';
import {
  ArrowRight,
  BarChart3,
  Book,
  Calendar,
  CheckCircle,
  ChevronDown,
  ChevronRight,
  Download,
  ExternalLink,
  FileText,
  Globe,
  Headphones,
  HelpCircle,
  Lightbulb,
  Mail,
  MessageCircle,
  Phone,
  PlayCircle,
  Search,
  Settings,
  Shield,
  Users,
  Video,
  Zap,
} from 'lucide-react';

const HelpPage = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    // Load Calendly JS for inline widget
    const script = document.createElement('script');
    script.src = 'https://assets.calendly.com/assets/external/widget.js';
    script.async = true;
    document.head.appendChild(script);

    // Cleanup function
    return () => {
      document.head.removeChild(script);
    };
  }, []);

  const helpCategories = [
    { id: 'all', name: 'Todas las categorías', icon: HelpCircle },
    { id: 'getting-started', name: 'Primeros Pasos', icon: Zap },
    { id: 'conversations', name: 'Conversaciones', icon: MessageCircle },
    { id: 'clients', name: 'Gestión de Clientes', icon: Users },
    { id: 'integrations', name: 'Integraciones', icon: Settings },
    { id: 'analytics', name: 'Análisis y Reportes', icon: BarChart3 },
    { id: 'billing', name: 'Facturación', icon: FileText },
    { id: 'security', name: 'Seguridad', icon: Shield },
  ];

  const quickStartGuides = [
    {
      title: 'Configuración Inicial',
      description: 'Aprende a configurar tu primer negocio en LetParley',
      duration: '5 min',
      icon: Zap,
      color: 'bg-blue-100 text-blue-600',
      steps: ['Crear cuenta', 'Configurar negocio', 'Conectar WhatsApp', 'Primera conversación'],
    },
    {
      title: 'Gestión de Conversaciones',
      description: 'Domina las herramientas de comunicación con clientes',
      duration: '8 min',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      steps: ['Ver conversaciones', 'Responder mensajes', 'Usar plantillas', 'Transferir chats'],
    },
    {
      title: 'Configurar Integraciones',
      description: 'Conecta LetParley con tus herramientas favoritas',
      duration: '10 min',
      icon: Settings,
      color: 'bg-purple-100 text-purple-600',
      steps: ['API de WhatsApp', 'Webhooks', 'CRM', 'E-commerce'],
    },
    {
      title: 'Análisis y Reportes',
      description: 'Comprende las métricas de tu negocio',
      duration: '6 min',
      icon: BarChart3,
      color: 'bg-orange-100 text-orange-600',
      steps: ['Dashboard', 'Métricas clave', 'Exportar datos', 'Alertas'],
    },
  ];

  const faqData = [
    {
      id: 1,
      category: 'getting-started',
      question: '¿Cómo empiezo a usar LetParley?',
      answer:
        'Para comenzar con LetParley, simplemente regístrate con tu email, verifica tu cuenta, crea tu primer negocio y conecta tus canales de comunicación como WhatsApp Business. Nuestro asistente de configuración te guiará paso a paso.',
    },
    {
      id: 2,
      category: 'getting-started',
      question: '¿Qué canales de comunicación puedo conectar?',
      answer:
        'Actualmente soportamos WhatsApp Business API, Instagram Direct, y webchat. Estamos trabajando en agregar más canales como Facebook Messenger, Telegram y SMS.',
    },
    {
      id: 3,
      category: 'conversations',
      question: '¿Puedo responder mensajes desde la plataforma?',
      answer:
        'Sí, puedes responder mensajes directamente desde LetParley. Actualmente el envío de mensajes está disponible para WhatsApp, y estamos expandiendo esta funcionalidad a otros canales.',
    },
    {
      id: 4,
      category: 'conversations',
      question: '¿Cómo funcionan las respuestas automáticas?',
      answer:
        'Las respuestas automáticas se configuran por canal y pueden activarse por palabras clave, horarios específicos o cuando no hay agentes disponibles. Puedes personalizar completamente los mensajes.',
    },
    {
      id: 5,
      category: 'clients',
      question: '¿Cómo gestiono la información de mis clientes?',
      answer:
        'LetParley incluye un CRM integrado donde puedes ver el historial completo de cada cliente, agregar notas, etiquetas y gestionar su información de contacto. Todo se sincroniza automáticamente con las conversaciones.',
    },
    {
      id: 6,
      category: 'clients',
      question: '¿Puedo exportar los datos de mis clientes?',
      answer:
        'Sí, puedes exportar la información de clientes en formato CSV o Excel. También puedes usar nuestra API para integrar con otros sistemas.',
    },
    {
      id: 7,
      category: 'integrations',
      question: '¿Qué integraciones están disponibles?',
      answer:
        'Ofrecemos integraciones con WhatsApp Business API, y estamos desarrollando conectores para Shopify, Stripe, Google Analytics, y más. También tenemos una API completa para integraciones personalizadas.',
    },
    {
      id: 8,
      category: 'integrations',
      question: '¿Puedo crear integraciones personalizadas?',
      answer:
        'Absolutamente. Tenemos una API RESTful completa y sistema de webhooks que te permite crear integraciones personalizadas. Nuestro equipo también puede ayudarte a desarrollar conectores específicos.',
    },
    {
      id: 9,
      category: 'analytics',
      question: '¿Qué métricas puedo ver en el dashboard?',
      answer:
        'El dashboard muestra conversaciones totales, mensajes por día, tiempo de respuesta promedio, canales más activos, y tendencias de crecimiento. También puedes ver métricas específicas por canal.',
    },
    {
      id: 10,
      category: 'billing',
      question: '¿Cómo funciona el sistema de créditos?',
      answer:
        'LetParley usa un sistema de créditos para el envío de mensajes. Cada mensaje enviado consume créditos según el canal. Puedes comprar paquetes de créditos o configurar recarga automática.',
    },
    {
      id: 11,
      category: 'billing',
      question: '¿Hay planes mensuales disponibles?',
      answer:
        'Sí, ofrecemos planes mensuales que incluyen créditos y funcionalidades adicionales. Contacta a nuestro equipo para conocer las opciones disponibles para tu negocio.',
    },
    {
      id: 12,
      category: 'security',
      question: '¿Qué medidas de seguridad implementan?',
      answer:
        'Implementamos encriptación end-to-end, autenticación de dos factores, auditorías de seguridad regulares, y cumplimos con estándares internacionales de protección de datos.',
    },
  ];

  const resources = [
    {
      title: 'Documentación de API',
      description: 'Guía completa para desarrolladores',
      icon: FileText,
      type: 'Documentación',
      url: '#',
    },
    {
      title: 'Video Tutoriales',
      description: 'Aprende con videos paso a paso',
      icon: Video,
      type: 'Videos',
      url: '#',
    },
    {
      title: 'Plantillas de Mensajes',
      description: 'Descarga plantillas prediseñadas',
      icon: Download,
      type: 'Recursos',
      url: '#',
    },
    {
      title: 'Webinars en Vivo',
      description: 'Sesiones de entrenamiento en vivo',
      icon: PlayCircle,
      type: 'Eventos',
      url: '#',
    },
  ];

  const supportChannels = [
    {
      title: 'Chat en Vivo',
      description: 'Respuesta inmediata durante horario laboral',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      availability: 'Lun-Vie 8AM-6PM',
      action: 'Iniciar Chat',
    },
    {
      title: 'Email de Soporte',
      description: 'Para consultas detalladas y técnicas',
      icon: Mail,
      color: 'bg-blue-100 text-blue-600',
      availability: 'Respuesta en 24h',
      action: 'Enviar Email',
    },
    {
      title: 'Llamada Telefónica',
      description: 'Soporte directo por teléfono',
      icon: Phone,
      color: 'bg-purple-100 text-purple-600',
      availability: 'Previa cita',
      action: 'Agendar Llamada',
    },
    {
      title: 'WhatsApp Business',
      description: 'Soporte a través de WhatsApp',
      icon: MessageCircle,
      color: 'bg-green-100 text-green-600',
      availability: '24/7 Automatizado',
      action: 'Contactar',
    },
  ];

  const filteredFaqs = faqData.filter((faq) => {
    const matchesCategory = selectedCategory === 'all' || faq.category === selectedCategory;
    const matchesSearch =
      searchQuery === '' ||
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const toggleFaq = (id: number) => {
    setExpandedFaq(expandedFaq === id ? null : id);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-12">
      {/* Header Section */}
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mb-6">
          <HelpCircle className="h-10 w-10 text-white" />
        </div>
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Centro de Ayuda</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
          Encuentra respuestas, aprende nuevas funcionalidades y obtén el máximo provecho de
          LetParley
        </p>
      </div>

      {/* Search Bar */}
      <div className="max-w-2xl mx-auto">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-lg"
            placeholder="Buscar en la ayuda..."
          />
        </div>
      </div>

      {/* Quick Start Guides */}
      <div>
        <div className="flex items-center mb-8">
          <Lightbulb className="h-6 w-6 text-yellow-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Guías de Inicio Rápido</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {quickStartGuides.map((guide, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 cursor-pointer group"
            >
              <div className="flex items-start justify-between mb-4">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${guide.color} rounded-xl`}
                >
                  <guide.icon className="h-6 w-6" />
                </div>
                <div className="text-right">
                  <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium">
                    {guide.duration}
                  </span>
                </div>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {guide.title}
              </h3>
              <p className="text-gray-600 text-sm mb-4">{guide.description}</p>

              <div className="space-y-2">
                {guide.steps.map((step, stepIndex) => (
                  <div key={stepIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-5 h-5 bg-blue-100 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="text-blue-600 font-bold text-xs">{stepIndex + 1}</span>
                    </div>
                    {step}
                  </div>
                ))}
              </div>

              <div className="mt-4 flex items-center text-blue-600 text-sm font-medium group-hover:text-blue-700">
                <span>Comenzar guía</span>
                <ArrowRight className="h-4 w-4 ml-1 group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* FAQ Section */}
      <div>
        <div className="flex items-center mb-8">
          <HelpCircle className="h-6 w-6 text-blue-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Preguntas Frecuentes</h2>
        </div>

        {/* Category Filter */}
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {helpCategories.map((category) => (
              <button
                key={category.id}
                onClick={() => setSelectedCategory(category.id)}
                className={`
                  inline-flex items-center px-4 py-2 rounded-full text-sm font-medium transition-all duration-200
                  ${
                    selectedCategory === category.id
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }
                `}
              >
                <category.icon className="h-4 w-4 mr-2" />
                {category.name}
              </button>
            ))}
          </div>
        </div>

        {/* FAQ List */}
        <div className="space-y-4">
          {filteredFaqs.length === 0 ? (
            <div className="text-center py-12">
              <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No se encontraron resultados
              </h3>
              <p className="text-gray-600">
                Intenta con otros términos de búsqueda o selecciona una categoría diferente
              </p>
            </div>
          ) : (
            filteredFaqs.map((faq) => (
              <div
                key={faq.id}
                className="bg-white rounded-xl border border-gray-100 overflow-hidden hover:shadow-md transition-shadow duration-200"
              >
                <button
                  onClick={() => toggleFaq(faq.id)}
                  className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                >
                  <h3 className="text-lg font-medium text-gray-900 pr-4">{faq.question}</h3>
                  <div className="flex-shrink-0">
                    {expandedFaq === faq.id ? (
                      <ChevronDown className="h-5 w-5 text-gray-500" />
                    ) : (
                      <ChevronRight className="h-5 w-5 text-gray-500" />
                    )}
                  </div>
                </button>

                {expandedFaq === faq.id && (
                  <div className="px-6 pb-4">
                    <div className="border-t border-gray-100 pt-4">
                      <p className="text-gray-700 leading-relaxed">{faq.answer}</p>
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>

      {/* Resources Section */}
      <div>
        <div className="flex items-center mb-8">
          <Book className="h-6 w-6 text-green-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Recursos Adicionales</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {resources.map((resource, index) => (
            <a
              key={index}
              href={resource.url}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl group-hover:bg-blue-100 transition-colors">
                  <resource.icon className="h-6 w-6 text-gray-600 group-hover:text-blue-600 transition-colors" />
                </div>
                <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 transition-colors" />
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                {resource.title}
              </h3>
              <p className="text-gray-600 text-sm mb-3">{resource.description}</p>

              <span className="inline-flex items-center px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-xs font-medium">
                {resource.type}
              </span>
            </a>
          ))}
        </div>
      </div>

      {/* Support Channels */}
      <div>
        <div className="flex items-center mb-8">
          <Headphones className="h-6 w-6 text-purple-500 mr-3" />
          <h2 className="text-2xl font-bold text-gray-900">Canales de Soporte</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {supportChannels.map((channel, index) => (
            <div
              key={index}
              className="bg-white rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
            >
              <div className="flex items-start space-x-4">
                <div
                  className={`inline-flex items-center justify-center w-12 h-12 ${channel.color} rounded-xl flex-shrink-0`}
                >
                  <channel.icon className="h-6 w-6" />
                </div>

                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{channel.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{channel.description}</p>

                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">{channel.availability}</span>
                    <button className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm font-medium">
                      {channel.action}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Status and Updates */}
      <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-2xl p-8 border border-green-200">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
          <div>
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium mb-4">
              <CheckCircle className="h-4 w-4 mr-2" />
              Todos los sistemas operativos
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Estado del Sistema</h2>
            <p className="text-gray-600 mb-6 leading-relaxed">
              Mantente informado sobre el estado de nuestros servicios y las últimas actualizaciones
              de la plataforma.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">API de WhatsApp - Operativo</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Dashboard - Operativo</span>
              </div>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-700">Webhooks - Operativo</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-lg font-bold text-gray-900 mb-4">Últimas Actualizaciones</h3>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <h4 className="font-medium text-gray-900">Nueva funcionalidad de etiquetas</h4>
                <p className="text-sm text-gray-600">
                  Organiza mejor tus clientes con el nuevo sistema de etiquetas
                </p>
                <span className="text-xs text-gray-500">Hace 2 días</span>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <h4 className="font-medium text-gray-900">Mejoras en el dashboard</h4>
                <p className="text-sm text-gray-600">Nuevas métricas y gráficos más detallados</p>
                <span className="text-xs text-gray-500">Hace 1 semana</span>
              </div>
              <div className="border-l-4 border-purple-500 pl-4">
                <h4 className="font-medium text-gray-900">API v2.0 disponible</h4>
                <p className="text-sm text-gray-600">
                  Nueva versión de la API con más funcionalidades
                </p>
                <span className="text-xs text-gray-500">Hace 2 semanas</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Calendly Inline Widget Section */}
      <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 border border-blue-200">
        <div className="text-center mb-8">
          <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium mb-4">
            <Calendar className="h-4 w-4 mr-2" />
            Soporte Personalizado
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-3">¿Necesitas Ayuda Personalizada?</h2>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Si no encontraste la respuesta que buscabas, agenda una llamada con nuestro equipo de
            soporte. Te ayudaremos a resolver cualquier duda y aprovechar al máximo LetParley.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <div className="inline-flex items-center px-4 py-2 bg-green-100 text-green-800 rounded-full text-sm font-medium">
              <CheckCircle className="h-4 w-4 mr-2" />
              Consulta gratuita de 30 minutos
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
              <Users className="h-4 w-4 mr-2" />
              Soporte en español
            </div>
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-800 rounded-full text-sm font-medium">
              <Zap className="h-4 w-4 mr-2" />
              Respuesta inmediata
            </div>
          </div>
        </div>

        {/* Calendly Inline Widget */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div
            className="calendly-inline-widget"
            data-url="https://calendly.com/letparley"
            style={{ minWidth: '320px', height: '700px' }}
          ></div>
        </div>
      </div>

      {/* Contact Information */}
      <div className="text-center bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Otros Métodos de Contacto</h2>
        <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
          Estamos aquí para ayudarte. Elige el método de contacto que prefieras.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-2xl mb-4">
              <Mail className="h-8 w-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Email</h3>
            <p className="text-gray-600 text-sm mb-3">Para consultas detalladas</p>
            <a
              href="mailto:soporte@letparley.com"
              className="text-blue-600 hover:text-blue-700 font-medium"
            >
              soporte@letparley.com
            </a>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-2xl mb-4">
              <MessageCircle className="h-8 w-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">WhatsApp</h3>
            <p className="text-gray-600 text-sm mb-3">Soporte rápido por chat</p>
            <a
              href="https://wa.me/50683081449"
              target="_blank"
              rel="noopener noreferrer"
              className="text-green-600 hover:text-green-700 font-medium"
            >
              +506 8308 1449
            </a>
          </div>

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-purple-100 rounded-2xl mb-4">
              <Globe className="h-8 w-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Sitio Web</h3>
            <p className="text-gray-600 text-sm mb-3">Más información</p>
            <a
              href="https://letparley.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-purple-600 hover:text-purple-700 font-medium"
            >
              letparley.com
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpPage;
