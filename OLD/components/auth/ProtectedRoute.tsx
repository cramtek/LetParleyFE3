import { Navigate, Outlet } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const ProtectedRoute = () => {
  const { isAuthenticated, selectedBusinessId, isLoading } = useAuthStore();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Redirect to business selection if authenticated but no business selected
  if (!selectedBusinessId) {
    return <Navigate to="/select-business" replace />;
  }

  // Render children routes
  return <Outlet />;
};

export default ProtectedRoute;
