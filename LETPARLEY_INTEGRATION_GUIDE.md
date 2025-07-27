# LetParley Integration Guide

## 🚀 Integración con Aurora Router

### Opción 1: App Separada (Recomendada para desarrollo inicial)

Usa `LetParleyApp.jsx` como aplicación independiente:

```javascript
// main.jsx
import { createRoot } from 'react-dom/client';
import LetParleyApp from './LetParleyApp';

const container = document.getElementById('root');
const root = createRoot(container);

root.render(<LetParleyApp />);
```

### Opción 2: Integración con Router Existente de Aurora

Modifica el router principal de Aurora para incluir rutas de LetParley:

```javascript
// routes/router.jsx (Aurora existente)
import { createBrowserRouter } from 'react-router-dom';
import App from '../App';
import ProtectedRoute from '../components/letparley/auth/ProtectedRoute';
import PublicRoute from '../components/letparley/auth/PublicRoute';
import DashboardPage from '../pages/letparley/DashboardPage';
import SelectBusinessPage from '../pages/letparley/SelectBusinessPage';
import LoginPage from '../pages/letparley/auth/LoginPage';
import VerifyPage from '../pages/letparley/auth/VerifyPage';
// LetParley imports
import { LetParleyAuthProvider } from '../providers/LetParleyAuthProvider';

const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <LetParleyAuthProvider>
        <App />
      </LetParleyAuthProvider>
    ),
    children: [
      // Rutas públicas de LetParley
      {
        path: 'letparley/auth',
        element: <PublicRoute />,
        children: [
          { path: 'login', element: <LoginPage /> },
          { path: 'verify', element: <VerifyPage /> },
        ],
      },

      // Selección de negocio
      {
        path: 'letparley/select-business',
        element: <SelectBusinessPage />,
      },

      // Rutas protegidas de LetParley
      {
        path: 'letparley',
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
          // ... más rutas de LetParley
        ],
      },

      // Rutas originales de Aurora
      // ... rutas existentes de Aurora
    ],
  },
]);
```

### Opción 3: Integración con MainLayout de Aurora

Para usar el layout principal de Aurora con páginas de LetParley:

```javascript
// pages/letparley/DashboardPage.jsx
import MainLayout from '../../layouts/main-layout/MainLayout';
import DashboardContent from './DashboardContent';

// Tu contenido del dashboard

const DashboardPage = () => {
  return (
    <MainLayout>
      <DashboardContent />
    </MainLayout>
  );
};
```

## 🔄 Flujo de Autenticación Completo

### 1. Estados de Autenticación

```
❌ No autenticado → 📧 /letparley/auth/login
📧 Login → 🔐 /letparley/auth/verify
🔐 Verificado → 🏢 /letparley/select-business
🏢 Negocio seleccionado → 📊 /letparley/dashboard
```

### 2. Protección de Rutas

- **PublicRoute**: Solo permite acceso a usuarios no autenticados o en proceso de auth
- **ProtectedRoute**: Requiere autenticación completa + negocio seleccionado
- **SelectBusiness**: Estado intermedio, solo usuarios autenticados sin negocio

### 3. Redirecciones Automáticas

```javascript
// ProtectedRoute.jsx
if (!isAuthenticated) {
  return <Navigate to="/letparley/auth/login" replace />;
}

if (!selectedBusinessId) {
  return <Navigate to="/letparley/select-business" replace />;
}

// PublicRoute.jsx
if (isAuthenticated && selectedBusinessId) {
  return <Navigate to="/letparley/dashboard" replace />;
}
```

## 📦 Providers Necesarios

### 1. LetParleyAuthProvider (Obligatorio)

- Maneja autenticación, localStorage, estado de sesión
- Debe envolver toda la app de LetParley

### 2. LetParleyDashboardProvider (Para Dashboard)

- Maneja datos del dashboard, auto-refresh
- Solo necesario en páginas que usen dashboard

Ejemplo de estructura:

```javascript
<LetParleyAuthProvider>
  <LetParleyDashboardProvider authContext={authFromAuthProvider}>
    <Routes>{/* Rutas de LetParley */}</Routes>
  </LetParleyDashboardProvider>
</LetParleyAuthProvider>
```

## 🎨 Styling y Theming

### Con Aurora Theme

Las páginas de LetParley usan `useTheme()` de MUI, por lo que heredan automáticamente el tema de Aurora.

### Customización

Para personalizar colores específicos de LetParley:

```javascript
// En cualquier componente de LetParley
const theme = useTheme();

// Usa los colores del tema de Aurora
sx={{
  background: `linear-gradient(135deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
  color: theme.palette.text.primary
}}
```

## 🔧 Development Setup

### 1. Desarrollo Independiente

```bash
# Usar LetParleyApp.jsx como entry point
npm run dev
```

### 2. Desarrollo Integrado

```bash
# Modificar main.jsx para usar router integrado
# Después usar Aurora normalmente
npm run dev
```

## 📱 Responsive Behavior

Todas las páginas de LetParley son completamente responsive:

- **Mobile**: Layout vertical, botones grandes, navegación simplificada
- **Tablet**: Layout adaptativo con espaciado intermedio
- **Desktop**: Layout completo con todas las funcionalidades

## 🛡️ Seguridad

### Headers Automáticos

Todas las llamadas API incluyen automáticamente:

```javascript
headers: {
  'Authorization': `Bearer ${sessionToken}`,
  'Content-Type': 'application/json'
}
```

### Auto-logout

- **401 responses**: Automáticamente ejecuta `signOut()` y redirige a login
- **Token validation**: Verifica validez del token al cargar la app
- **Session cleanup**: Limpia localStorage en logout

## 🐛 Debugging

### Estado de Autenticación

```javascript
// En DevTools Console
window.localStorage; // Ver datos almacenados
```

### Context State

```javascript
// En React DevTools
// Buscar LetParleyAuthProvider para ver estado completo
```

### Network Requests

- Todas las llamadas API usan `console.log` para debugging
- Revisa Network tab para ver headers y responses

## 🚀 Next Steps

1. **Implementar más páginas**: Conversations, Clients, etc.
2. **Integrar navegación**: Sidebar/topbar de Aurora con links de LetParley
3. **Notificaciones**: Sistema de notificaciones en tiempo real
4. **WebSockets**: Para actualizaciones en vivo
5. **Testing**: Tests unitarios y de integración
