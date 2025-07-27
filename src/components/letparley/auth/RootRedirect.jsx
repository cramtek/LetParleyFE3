import { Navigate } from 'react-router-dom';
import { useLetParleyAuth } from '../../../providers/LetParleyAuthProvider';
import LoadingScreen from '../common/LoadingScreen';

const RootRedirect = () => {
  const { isAuthenticated, selectedBusinessId, isLoading } = useLetParleyAuth();

  // Show loading while auth state is being determined
  if (isLoading) {
    return <LoadingScreen message="Verificando estado de sesión..." />;
  }

  // User not authenticated - go to landing page
  if (!isAuthenticated) {
    console.log('🔒 User not authenticated, redirecting to landing page');
    return <Navigate to="/" replace />;
  }

  // User is authenticated but needs to select business - go to business selection
  if (isAuthenticated && !selectedBusinessId) {
    console.log('🏢 User authenticated but no business selected, redirecting to select business');
    return <Navigate to="/letparley/select-business" replace />;
  }

  // User is fully authenticated with business selected - go to dashboard
  if (isAuthenticated && selectedBusinessId) {
    console.log('✅ User fully authenticated and business selected, redirecting to dashboard');
    return <Navigate to="/letparley/dashboard" replace />;
  }

  // Fallback to login
  return <Navigate to="/letparley/auth/login" replace />;
};

export default RootRedirect;
