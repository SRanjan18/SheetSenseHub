import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout/AppLayout';
import ProtectedRoute from './routes/ProtectedRoute';
import RoleRoute from './routes/RoleRoute';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import AuthCallbackPage from './pages/AuthCallbackPage/AuthCallbackPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import AboutPage from './pages/AboutPage/AboutPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ReportPage from './pages/report/ReportPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ContactUs from './pages/ContactUsPage/ContactUs';
import UserManagement from './pages/UserManagementPage/UserManagement';
import { useAuth } from './context/AuthContext';

export default function App() {
  const { canManageUsers, canViewAnalytics, canViewReports } = useAuth();
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/auth/callback" element={<AuthCallbackPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/about" element={<AboutPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report"element={<RoleRoute allowed={canViewReports}><ReportPage /></RoleRoute>}/>
        <Route path="/analytics"element={<RoleRoute allowed={canViewAnalytics}><AnalyticsPage /></RoleRoute>}/>
        <Route path="/contact-us" element={<ContactUs />} />
        <Route path="/user-management"element={<RoleRoute allowed={canManageUsers}><UserManagement /></RoleRoute>} />
      </Route>
    </Routes>
  );
}
