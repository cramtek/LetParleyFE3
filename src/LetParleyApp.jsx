import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
// LetParley Components
import ProtectedRoute from './components/letparley/auth/ProtectedRoute';
import PublicRoute from './components/letparley/auth/PublicRoute';
import RootRedirect from './components/letparley/auth/RootRedirect';
import DashboardPage from './pages/letparley/DashboardPage';
import LandingPage from './pages/letparley/LandingPage';
import SelectBusinessPage from './pages/letparley/SelectBusinessPage';
import LoginPage from './pages/letparley/auth/LoginPage';
import VerifyPage from './pages/letparley/auth/VerifyPage';
import { LetParleyAuthProvider } from './providers/LetParleyAuthProvider';
import { DashboardProviderWrapper } from './providers/LetParleyDashboardProvider';

// Aurora Components (for integration examples)
// import MainLayout from './layouts/main-layout';

const LetParleyApp = () => {
  return (
    <BrowserRouter>
      <LetParleyAuthProvider>
        <DashboardProviderWrapper>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<LandingPage />} />

            {/* Public Routes - Authentication */}
            <Route element={<PublicRoute />}>
              <Route path="/letparley/auth/login" element={<LoginPage />} />
              <Route path="/letparley/auth/verify" element={<VerifyPage />} />
            </Route>

            {/* Business Selection Route - Special handling */}
            <Route path="/letparley/select-business" element={<SelectBusinessPage />} />

            {/* Protected Routes - Main application */}
            <Route element={<ProtectedRoute />}>
              {/* Dashboard Route - Can be wrapped with MainLayout for Aurora integration */}
              <Route path="/letparley/dashboard" element={<DashboardPage />} />

              {/* Example with Aurora MainLayout integration:
              <Route path="/letparley/dashboard" element={
                <MainLayout>
                  <DashboardPage />
                </MainLayout>
              } />
              */}

              {/* Future LetParley Routes */}
              {/* <Route path="/letparley/conversations" element={<ConversationsPage />} />
              <Route path="/letparley/clients" element={<ClientsPage />} />
              <Route path="/letparley/assistants" element={<AssistantsPage />} />
              <Route path="/letparley/integrations" element={<IntegrationsPage />} />
              <Route path="/letparley/projects" element={<ProjectsPage />} />
              <Route path="/letparley/subscription" element={<SubscriptionPage />} />
              <Route path="/letparley/help" element={<HelpPage />} /> */}
            </Route>

            {/* Root Redirect with smart logic for authenticated users */}
            <Route path="/letparley" element={<RootRedirect />} />

            {/* 404 - This must be the last route */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </DashboardProviderWrapper>
      </LetParleyAuthProvider>
    </BrowserRouter>
  );
};

export default LetParleyApp;
