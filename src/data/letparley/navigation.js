/**
 * LetParley Navigation Configuration
 * This file defines the sidebar navigation structure for LetParley
 */

export const letparleyNavigation = [
  {
    label: 'Dashboard',
    path: '/letparley/dashboard',
    icon: 'solar:pie-chart-2-bold',
    active: true, // Set as default active
  },
  {
    label: 'Conversaciones',
    path: '/letparley/conversations',
    icon: 'solar:chat-round-dots-bold',
    disabled: true, // Future feature
  },
  {
    label: 'Clientes',
    path: '/letparley/clients',
    icon: 'solar:users-group-rounded-bold',
    disabled: true, // Future feature
  },
  {
    label: 'Asistentes',
    path: '/letparley/assistants',
    icon: 'solar:chatbot-bold',
    disabled: true, // Future feature
  },
  {
    label: 'Integraciones',
    path: '/letparley/integrations',
    icon: 'solar:link-bold',
    disabled: true, // Future feature
  },
  {
    label: 'Proyectos',
    path: '/letparley/projects',
    icon: 'solar:folder-with-files-bold',
    disabled: true, // Future feature
  },
  {
    label: 'Suscripción',
    path: '/letparley/subscription',
    icon: 'solar:crown-bold',
    disabled: true, // Future feature
  },
  {
    label: 'Ayuda',
    path: '/letparley/help',
    icon: 'solar:question-circle-bold',
    disabled: true, // Future feature
  },
];

/**
 * Convert LetParley navigation to Aurora template format
 * This matches the structure expected by the Aurora sidebar components
 */
export const convertToAuroraNavFormat = () => {
  return letparleyNavigation.map((item) => ({
    id: item.path.replace(/[^a-zA-Z0-9]/g, ''), // Generate ID from path
    name: item.label,
    path: item.path,
    iconifyIcon: item.icon,
    active: item.active || false,
    disabled: item.disabled || false,
  }));
};

export default letparleyNavigation;