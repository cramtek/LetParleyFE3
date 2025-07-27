import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// Routes protection
import ProtectedRoute from './components/auth/ProtectedRoute';
import PublicRoute from './components/auth/PublicRoute';
// Layout
import MainLayout from './components/layout/MainLayout';
// Pages
import LoginPage from './pages/LoginPage';
import NotFoundPage from './pages/NotFoundPage';
import SelectBusinessPage from './pages/SelectBusinessPage';
import VerifyPage from './pages/VerifyPage';
import { useAuthStore } from './store/authStore';
import { useNavigationStore } from './store/navigationStore';

function App() {
  const { loadFromStorage, isLoading, isAuthenticated, selectedBusinessId } = useAuthStore();
  const { clearHistory } = useNavigationStore();

  useEffect(() => {
    // Load auth state from localStorage on app startup
    loadFromStorage();
  }, [loadFromStorage]);

  // Clear navigation history when business changes
  useEffect(() => {
    if (selectedBusinessId) {
      clearHistory();
    }
  }, [selectedBusinessId, clearHistory]);

  // Show loading spinner while checking authentication state
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <img
            src="/assets/LetParley_LogoCompleto.png"
            alt="LetParley"
            className="h-12 w-auto mx-auto mb-4"
          />
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<PublicRoute />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify" element={<VerifyPage />} />
        </Route>

        {/* Business Selection Route - Special handling */}
        <Route path="/select-business" element={<SelectBusinessPage />} />

        {/* Protected Routes - Main application */}
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<MainLayout />} />
        </Route>

        {/* 404 - This must be the last route */}
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
