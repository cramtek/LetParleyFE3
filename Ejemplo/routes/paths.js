import docRoutePaths from 'docs/routes/docPaths';

export const rootPaths = {
  root: '/',
  dashboardRoot: 'dashboard',
  pagesRoot: 'pages',
  miscRoot: 'misc',
  authRoot: 'authentication',
  pricingRoot: 'pricing',
  authDefaultJwtRoot: 'default/jwt',
  authDefaultFirebaseRoot: 'default/firebase',
  authDefaultAuth0Root: 'default/auth0',
  errorRoot: 'error',
  ecommerceRoot: 'ecommerce',
  ecommerceAdminRoot: 'admin',
  ecommerceCustomerRoot: 'customer',
  eventsRoot: 'events',
  emailRoot: 'email',
  kanbanRoot: 'kanban',
  calendarRoot: 'calendar',
  schedulerRoot: 'scheduler',
  appsRoot: 'apps',
  crmRoot: 'crm',
  fileManagerRoot: 'file-manager',
};

const paths = {
  crm: `/${rootPaths.dashboardRoot}/crm`,
  project: `/${rootPaths.dashboardRoot}/project`,
  analytics: `/${rootPaths.dashboardRoot}/analytics`,
  hrm: `/${rootPaths.dashboardRoot}/hrm`,
  timeTracker: `/${rootPaths.dashboardRoot}/time-tracker`,

  starter: `/${rootPaths.pagesRoot}/starter`,
  notifications: `/${rootPaths.pagesRoot}/notifications`,
  defaultJwtLogin: `/${rootPaths.authRoot}/${rootPaths.authDefaultJwtRoot}/login`,
  defaultJwtSignup: `/${rootPaths.authRoot}/${rootPaths.authDefaultJwtRoot}/sign-up`,
  defaultJwtForgotPassword: `/${rootPaths.authRoot}/${rootPaths.authDefaultJwtRoot}/forgot-password`,
  defaultJwt2FA: `/${rootPaths.authRoot}/${rootPaths.authDefaultJwtRoot}/2FA`,
  defaultJwtSetPassword: `/${rootPaths.authRoot}/${rootPaths.authDefaultJwtRoot}/set-password`,

  defaultAuth0Login: `/${rootPaths.authRoot}/${rootPaths.authDefaultAuth0Root}/login`,

  defaultFirebaseLogin: `/${rootPaths.authRoot}/${rootPaths.authDefaultFirebaseRoot}/login`,
  defaultFirebaseSignup: `/${rootPaths.authRoot}/${rootPaths.authDefaultFirebaseRoot}/sign-up`,
  defaultFirebaseForgotPassword: `/${rootPaths.authRoot}/${rootPaths.authDefaultFirebaseRoot}/forgot-password`,

  defaultLoggedOut: `/${rootPaths.authRoot}/default/logged-out`,
  pricingColumn: `/${rootPaths.pricingRoot}/column`,
  pricingTable: `/${rootPaths.pricingRoot}/table`,

  account: `/account`,
  faq: `/faq`,
  comingSoon: `/coming-soon`,
  404: `/${rootPaths.errorRoot}/404`,

  ecommerceHomepage: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/homepage`,
  products: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/products`,
  productDetails: (productId) =>
    `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/product-details${
      productId ? `/${productId}` : ''
    }`,
  cart: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/cart`,
  customerAccount: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/customer-account`,
  checkout: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/checkout`,
  payment: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/payment`,
  orderConfirmation: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/order-confirmation`,
  wishlist: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/wishlist`,
  orderList: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/order-list`,
  orderDetails: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/order-details`,
  orderTrack: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceCustomerRoot}/order-track`,
  createEvent: `/${rootPaths.eventsRoot}/create-event`,
  events: `/${rootPaths.eventsRoot}/event-detail`,

  adminProductListing: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/product-listing`,
  adminProductList: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/product-list`,
  adminOrderList: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/order-list`,
  adminOrder: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/order`,
  adminCreateOrder: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/create-order`,
  adminRefund: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/refund`,

  adminInvoiceList: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/invoice-list`,
  adminInvoice: `/${rootPaths.ecommerceRoot}/${rootPaths.ecommerceAdminRoot}/invoice`,

  email: `/${rootPaths.emailRoot}`,
  emailLabel: (label) => `/${rootPaths.emailRoot}/list/${label}`,
  emailDetails: (label, id) => `/${rootPaths.emailRoot}/details/${label}/${id}`,

  kanban: `/${rootPaths.kanbanRoot}/kanban`,
  boards: `/${rootPaths.kanbanRoot}/boards`,
  createBoard: `/${rootPaths.kanbanRoot}/create-board`,

  leadDetails: `/${rootPaths.crmRoot}/lead-details`,
  dealDetails: `/${rootPaths.crmRoot}/deal-details`,
  addContact: `/${rootPaths.crmRoot}/add-contact`,

  chat: `/${rootPaths.appsRoot}/chat`,
  newChat: `/${rootPaths.appsRoot}/chat/new`,
  chatConversation: (userId) => `${paths.chat}/${userId ? `${userId}` : ''}`,
  social: `/${rootPaths.appsRoot}/social`,
  deals: `/${rootPaths.crmRoot}/deals`,
  dealsDetails: `/${rootPaths.crmRoot}/deals-details`,
  fileManager: `/${rootPaths.fileManagerRoot}`,
  fileManagerFolder: (folderId) => `/${rootPaths.fileManagerRoot}/${folderId}`,

  calendar: `/${rootPaths.appsRoot}/${rootPaths.calendarRoot}`,
  scheduler: `/${rootPaths.appsRoot}/${rootPaths.schedulerRoot}`,

  ...docRoutePaths,
};

export const authPaths = {
  /* ---------------------------------JWT----------------------------------------- */
  login: paths.defaultJwtLogin,
  signup: paths.defaultJwtSignup,
  forgotPassword: paths.defaultJwtForgotPassword,
  setNewPassword: paths.defaultJwtSetPassword,
  twoFactorAuth: paths.defaultJwt2FA,
  /* ---------------------------------Firebase----------------------------------------- */
  // login: paths.defaultFirebaseLogin,
  // signup: paths.defaultFirebaseSignup,
  // forgotPassword: paths.defaultFirebaseForgotPassword,
  /* ---------------------------------Auth0----------------------------------------- */
  // login: paths.defaultAuth0Login,
};

export const apiEndpoints = {
  register: '/auth/register',
  login: '/auth/login',
  logout: '/auth/logout',
  profile: '/auth/profile',
  getUsers: '/users',
  forgotPassword: '/auth/forgot-password',
  setPassword: '/auth/set-password',
  getProduct: (id) => `e-commerce/products/${id}`,
};

export default paths;
