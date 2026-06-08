import { useEffect, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import LoadingPage from '../../reusable/LoadingPage/LoadingPage';
import { validateOAuthState } from '../../reusable/auth';
import { clearBrowserManagedAppCookies } from '../../reusable/cookies';

export default function AuthCallbackPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { completeLogin } = useAuth();
  const hasExchangedCode = useRef(false);

  useEffect(() => {
    if (hasExchangedCode.current) return;
    hasExchangedCode.current = true;

    // Google returns the authorization code in the callback URL query string.
    const code = searchParams.get('code');
    const state = searchParams.get('state');
    const oauthError = searchParams.get('error');

    if (oauthError || !code || !validateOAuthState(state)) {
      clearBrowserManagedAppCookies();
      navigate('/error', { replace: true });
      return;
    }

    completeLogin(code)
      .then(() => navigate('/dashboard', { replace: true }))
      .catch(() => {
        clearBrowserManagedAppCookies();
        navigate('/error', { replace: true });
      });
  }, [completeLogin, navigate, searchParams]);

  return <LoadingPage />;
}
