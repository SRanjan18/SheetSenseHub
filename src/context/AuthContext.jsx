import { createContext, useContext, useMemo, useState } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  const login = () => {
    setIsAuthenticated(true);
    setUser({
      name: 'Test User',
      role: 'Analyst',
    });
  };

  const logout = () => {
    setIsAuthenticated(false);
    setUser(null);
  };

  const value = useMemo(
    () => ({
      isAuthenticated,
      user,
      login,
      logout,
    }),
    [isAuthenticated, user]
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