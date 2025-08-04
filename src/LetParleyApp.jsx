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
import ConversationsPage from './pages/letparley/ConversationsPage';
import { LetParleyAuthProvider } from './providers/LetParleyAuthProvider';
import { DashboardProviderWrapper } from './providers/LetParleyDashboardProvider';

// Aurora Layout Integration
import LetParleyLayout from './layouts/letparley-layout';

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

            {/* Business Selection Route - Protected but doesn't require business ID */}
            <Route element={<ProtectedRoute requireBusinessId={false} />}>
              <Route path="/letparley/select-business" element={<SelectBusinessPage />} />
            </Route>

            {/* Protected Routes - Main application with Aurora layout */}
            <Route element={<ProtectedRoute />}>
              <Route element={<LetParleyLayout />}>
                <Route path="/letparley/dashboard" element={<DashboardPage />} />
                <Route path="/letparley/conversations" element={<ConversationsPage />} />

                {/* Future LetParley Routes with Aurora Layout */}
                {/* <Route path="/letparley/clients" element={<ClientsPage />} />
                <Route path="/letparley/assistants" element={<AssistantsPage />} />
                <Route path="/letparley/integrations" element={<IntegrationsPage />} />
                <Route path="/letparley/projects" element={<ProjectsPage />} />
                <Route path="/letparley/subscription" element={<SubscriptionPage />} />
                <Route path="/letparley/help" element={<HelpPage />} /> */}
              </Route>
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
