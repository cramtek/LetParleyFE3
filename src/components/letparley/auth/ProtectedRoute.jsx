import { Navigate, Outlet } from 'react-router-dom';
import { useLetParleyAuth } from '../../../providers/LetParleyAuthProvider';
import LoadingScreen from '../common/LoadingScreen';

const ProtectedRoute = ({ children, requireBusinessId = true }) => {
  const { isAuthenticated, selectedBusinessId, isLoading } = useLetParleyAuth();

  // Show loading state while checking authentication
  if (isLoading) {
    return <LoadingScreen message="Verificando autenticación..." />;
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    console.log('🔒 User not authenticated, redirecting to login');
    return <Navigate to="/letparley/auth/login" replace />;
  }

  // Redirect to business selection if authenticated but no business selected (only if required)
  if (requireBusinessId && !selectedBusinessId) {
    console.log('🏢 User authenticated but no business selected, redirecting to select business');
    return <Navigate to="/letparley/select-business" replace />;
  }

  console.log('✅ User authenticated, rendering protected content');

  // Render children routes or children component
  return children ? children : <Outlet />;
};

export default ProtectedRoute;
