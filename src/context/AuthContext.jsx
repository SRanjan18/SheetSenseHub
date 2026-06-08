import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { apiFetch } from '../reusable/apiClient';
import { buildGoogleLoginUrl, createSessionFromGoogleCode } from '../reusable/auth';
import { clearLegacyAppCookies, clearSelectedBusinessCookie } from '../reusable/cookies';

const AuthContext = createContext(null);
const PUBLIC_AUTH_PATHS = new Set(['/', '/login', '/auth/callback', '/error', '/logout']);

const hasAnyRole = (user, roles) =>
  Boolean(
    user?.businessRoles?.some((businessRole) =>
      roles.includes(String(businessRole.roleCode || '').toUpperCase())
    )
  );

export function AuthProvider({ children }) {
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);
  const hasCheckedSession = useRef(false);

  const refreshUser = useCallback(async () => {
    setIsLoading(true);
    try {
      const currentUser = await apiFetch('/api/auth/session');
      setUser(currentUser);
      return currentUser;
    } catch {
      setUser(null);
      return null;
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    const currentPath = window.location.pathname;

    if (PUBLIC_AUTH_PATHS.has(currentPath)) {
      setIsLoading(false);
      return;
    }

    if (hasCheckedSession.current) return;
    hasCheckedSession.current = true;

    refreshUser();
  }, [refreshUser]);

  const startLogin = useCallback(() => {
    clearLegacyAppCookies();
    window.location.assign(buildGoogleLoginUrl());
  }, []);

  const completeLogin = useCallback(async (code) => {
    const loggedInUser = await createSessionFromGoogleCode(code);
    setUser(loggedInUser);
    return loggedInUser;
  }, []);

  const logout = useCallback(async () => {
    try {
      await apiFetch('/api/auth/logout', { method: 'POST' });
    } catch {
      // The UI should still clear local state if the logout request fails.
    }

    clearSelectedBusinessCookie();
    setUser(null);
  }, []);

  const value = useMemo(
    () => ({
      isAuthenticated: Boolean(user),
      isLoading,
      user,
      startLogin,
      completeLogin,
      refreshUser,
      logout,
      canManageUsers: hasAnyRole(user, ['ADMIN', 'ANALYST']),
      canViewReports: hasAnyRole(user, ['ADMIN']),
      canViewAnalytics: hasAnyRole(user, ['ADMIN']),
    }),
    [completeLogin, isLoading, logout, refreshUser, startLogin, user]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}