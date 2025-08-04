/**
 * LetParley Sitemap Configuration
 * This defines the navigation structure specifically for LetParley sections
 */

const letparleySitemap = [
  {
    id: 'letparley-dashboard',
    subheader: 'Panel Principal',
    key: 'panel-principal',
    icon: 'material-symbols:home-outline',
    items: [
      {
        name: 'Dashboard',
        key: 'dashboard',
        path: '/letparley/dashboard',
        pathName: 'letparley-dashboard',
        icon: 'material-symbols:dashboard-outline',
        active: true,
      },
    ],
  },
  {
    id: 'letparley-communications',
    subheader: 'Comunicaciones',
    key: 'comunicaciones',
    icon: 'material-symbols:chat-outline',
    items: [
      {
        name: 'Conversaciones',
        key: 'conversations',
        path: '/letparley/conversations',
        pathName: 'letparley-conversations',
        icon: 'material-symbols:chat-bubble-outline',
        active: true,
      },
      {
        name: 'Clientes',
        key: 'clients',
        path: '/letparley/clients',
        pathName: 'letparley-clients',
        icon: 'material-symbols:people-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Canales',
        key: 'channels',
        path: '/letparley/channels',
        pathName: 'letparley-channels',
        icon: 'material-symbols:smartphone-outline',
        active: true,
        disabled: true, // Future feature
      },
    ],
  },
  {
    id: 'letparley-automation',
    subheader: 'Automatización',
    key: 'automatizacion',
    icon: 'material-symbols:smart-toy-outline',
    items: [
      {
        name: 'Asistentes IA',
        key: 'assistants',
        path: '/letparley/assistants',
        pathName: 'letparley-assistants',
        icon: 'material-symbols:android-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Integraciones',
        key: 'integrations',
        path: '/letparley/integrations',
        pathName: 'letparley-integrations',
        icon: 'material-symbols:link-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Flujos de Trabajo',
        key: 'workflows',
        path: '/letparley/workflows',
        pathName: 'letparley-workflows',
        icon: 'material-symbols:workflow-outline',
        active: true,
        disabled: true, // Future feature
      },
    ],
  },
  {
    id: 'letparley-analytics',
    subheader: 'Análisis',
    key: 'analisis',
    icon: 'material-symbols:analytics-outline',
    items: [
      {
        name: 'Reportes',
        key: 'reports',
        path: '/letparley/reports',
        pathName: 'letparley-reports',
        icon: 'material-symbols:assignment-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Métricas',
        key: 'metrics',
        path: '/letparley/metrics',
        pathName: 'letparley-metrics',
        icon: 'material-symbols:bar-chart-outline',
        active: true,
        disabled: true, // Future feature
      },
    ],
  },
  {
    id: 'letparley-management',
    subheader: 'Gestión',
    key: 'gestion',
    icon: 'material-symbols:settings-outline',
    items: [
      {
        name: 'Configuración',
        key: 'settings',
        path: '/letparley/settings',
        pathName: 'letparley-settings',
        icon: 'material-symbols:tune-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Equipo',
        key: 'team',
        path: '/letparley/team',
        pathName: 'letparley-team',
        icon: 'material-symbols:group-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Suscripción',
        key: 'subscription',
        path: '/letparley/subscription',
        pathName: 'letparley-subscription',
        icon: 'material-symbols:workspace-premium-outline',
        active: true,
        disabled: true, // Future feature
      },
    ],
  },
  {
    id: 'letparley-support',
    subheader: 'Soporte',
    key: 'soporte',
    icon: 'material-symbols:help-outline',
    items: [
      {
        name: 'Centro de Ayuda',
        key: 'help',
        path: '/letparley/help',
        pathName: 'letparley-help',
        icon: 'material-symbols:live-help-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Documentación',
        key: 'docs',
        path: '/letparley/docs',
        pathName: 'letparley-docs',
        icon: 'material-symbols:description-outline',
        active: true,
        disabled: true, // Future feature
      },
      {
        name: 'Contacto',
        key: 'contact',
        path: '/letparley/contact',
        pathName: 'letparley-contact',
        icon: 'material-symbols:contact-support-outline',
        active: true,
        disabled: true, // Future feature
      },
    ],
  },
];

export default letparleySitemap;