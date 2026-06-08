import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingPage from '../../reusable/LoadingPage/LoadingPage';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { isAuthenticated, isLoading, startLogin } = useAuth();

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, isLoading, navigate]);

  if (isLoading) {
    return <LoadingPage />;
  }

  return (
    <div className="auth-screen">
      <div className="auth-screen__left">
        <div className="auth-screen__left-content">
          <h1> Sheet Sense Hub</h1>
        </div>
      </div>

      <div className="auth-screen__right">
        <div className="auth-screen__login-panel">
          <h2>Welcome To RanjanLabs</h2>

          <button className="auth-screen__login-btn" onClick={startLogin}>
            LOG IN
          </button>
        </div>
      </div>
    </div>
  );
}