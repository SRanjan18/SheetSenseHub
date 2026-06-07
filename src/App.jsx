import { Routes, Route, Navigate } from 'react-router-dom';
import AppLayout from './AppLayout/AppLayout';
import ProtectedRoute from './components/ProtectedRoute';
import ErrorPage from './pages/ErrorPage/ErrorPage';
import LoginPage from './pages/LoginPage/LoginPage';
import LogoutPage from './pages/LogoutPage/LogoutPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import ReportPage from './pages/report/ReportPage';
import AnalyticsPage from './pages/Analytics/AnalyticsPage';
import ContactUs from './pages/ContactUsPage/ContactUs';
import UserManagement from './pages/UserManagementPage/UserManagement';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/error" element={<ErrorPage />} />
      <Route path="/logout" element={<LogoutPage />} />

      <Route
        element={
          <ProtectedRoute>
            <AppLayout />
          </ProtectedRoute>
        }
      >
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/report" element={<ReportPage />} />
        <Route path="/analytics" element={<AnalyticsPage />} />
         <Route path="/contact-us" element={<ContactUs />} />
          <Route path="/user-management" element={<UserManagement />} />
      </Route>
    </Routes>
  );
}