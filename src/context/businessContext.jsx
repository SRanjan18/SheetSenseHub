import { createContext, useCallback, useContext, useState } from 'react';
import {
  clearSelectedBusinessCookie,
  getSelectedBusinessCookie,
  setSelectedBusinessCookie,
} from '../reusable/cookies';

const businessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [selectedBusiness, setSelectedBusinessState] = useState(() => getSelectedBusinessCookie());

  const setSelectedBusiness = useCallback((businessName) => {
    const nextBusiness = businessName || '';
    setSelectedBusinessState(nextBusiness);

    if (nextBusiness) {
      setSelectedBusinessCookie(nextBusiness);
    } else {
      clearSelectedBusinessCookie();
    }
  }, []);

  return (
    <businessContext.Provider value={{ selectedBusiness, setSelectedBusiness }}>
      {children}
    </businessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(businessContext);

  if (!context) {
    throw new Error('useBusiness must be used within a Business Provider');
  }

  return context;
}