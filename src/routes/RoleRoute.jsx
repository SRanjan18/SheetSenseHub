import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoadingPage from '../reusable/LoadingPage/LoadingPage';

export default function RoleRoute({ allowed, children }) {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <LoadingPage />;
  }

  if (!allowed) {
    return <Navigate to="/error" replace />;
  }

  return children;
}
