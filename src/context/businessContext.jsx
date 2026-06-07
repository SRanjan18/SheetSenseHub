import { createContext, useContext, useState } from 'react';

const businessContext = createContext(null);

export function BusinessProvider({ children }) {
  const [selectedBusiness, setSelectedBusiness] = useState('');

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