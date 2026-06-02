import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingPage from '../../reusable/LoadingPage/LoadingPage';
import './LoginPage.css';

export default function LoginPage() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const handleLogin = () => {
    if (isLoading) return;

    setIsLoading(true);
    timerRef.current = setTimeout(() => {
      login();
      navigate('/dashboard');
    }, 1400);
  };

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

          <button className="auth-screen__login-btn" onClick={handleLogin}>
            LOG IN
          </button>
        </div>
      </div>
    </div>
  );
}