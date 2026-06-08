import config from '../config/config';
import { apiFetch } from './apiClient';

const OAUTH_STATE_KEY = 'SHEETSENSE_OAUTH_STATE';

const createRandomValue = () => {
  const array = new Uint8Array(24);
  window.crypto.getRandomValues(array);
  return Array.from(array, (value) => value.toString(16).padStart(2, '0')).join('');
};

export const getOAuthRedirectUri = () => `${window.location.origin}/auth/callback`;

// Builds the Google authorization URL. Google redirects back with ?code=...&state=... after the user signs in.
export function buildGoogleLoginUrl() {
  const state = createRandomValue();
  sessionStorage.setItem(OAUTH_STATE_KEY, state);

  const params = new URLSearchParams({
    client_id: config.googleClientId,
    redirect_uri: getOAuthRedirectUri(),
    response_type: 'code',
    scope: 'openid email profile',
    state,
    access_type: 'online',
  });

  return `${config.googleAuthUrl}?${params.toString()}`;
}

// Confirms the callback belongs to this browser login attempt and was not forged.
export function validateOAuthState(state) {
  const expectedState = sessionStorage.getItem(OAUTH_STATE_KEY);
  sessionStorage.removeItem(OAUTH_STATE_KEY);

  return Boolean(state && expectedState && state === expectedState);
}

// Sends only the temporary Google authorization code to backend; backend exchanges it with Google and creates our app session.
export function createSessionFromGoogleCode(code) {
  return apiFetch('/api/auth/session', {
    method: 'POST',
    body: JSON.stringify({
      code,
      redirectUri: getOAuthRedirectUri(),
    }),
  });
}
