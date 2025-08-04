import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useLetParleyAuth } from '../../../providers/LetParleyAuthProvider';
import LoadingScreen from '../common/LoadingScreen';

const PublicRoute = () => {
  const { isAuthenticated, selectedBusinessId, isLoading } = useLetParleyAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando estado de sesión..." />;
  }

  // If user is authenticated and has selected a business, redirect to dashboard
  if (isAuthenticated && selectedBusinessId) {
    console.log('✅ User fully authenticated and business selected, redirecting to dashboard');
    return <Navigate to="/letparley/dashboard" replace />;
  }

  // If user is authenticated but hasn't selected a business, redirect to business selection
  // Allow verify page to complete normally, but redirect login page
  if (isAuthenticated && !selectedBusinessId && location.pathname === '/letparley/auth/login') {
    console.log(
      '🏢 User already authenticated but no business selected, redirecting to select business',
    );
    return <Navigate to="/letparley/select-business" replace />;
  }

  console.log('📖 Rendering public route for:', location.pathname);

  // Render children routes for:
  // 1. Non-authenticated users (login, verify pages)
  // 2. Authenticated users who are on login/verify (edge case handling)
  return <Outlet />;
};

export default PublicRoute;
