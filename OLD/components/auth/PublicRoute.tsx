import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

const PublicRoute = () => {
  const { isAuthenticated, selectedBusinessId, isLoading } = useAuthStore();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  // If user is authenticated and has selected a business, redirect to dashboard
  if (isAuthenticated && selectedBusinessId) {
    return <Navigate to="/" replace />;
  }

  // If user is authenticated but hasn't selected a business, redirect to business selection
  // ONLY if they're not already on login or verify pages
  if (
    isAuthenticated &&
    !selectedBusinessId &&
    location.pathname !== '/login' &&
    location.pathname !== '/verify'
  ) {
    return <Navigate to="/select-business" replace />;
  }

  // Render children routes for:
  // 1. Non-authenticated users (login, verify pages)
  // 2. Authenticated users who are on login/verify (edge case handling)
  return <Outlet />;
};

export default PublicRoute;
