import { createContext, useContext, useState } from 'react';

const UseCaseContext = createContext(null);

export function UseCaseProvider({ children }) {
  const [selectedUseCase, setSelectedUseCase] = useState('');

  return (
    <UseCaseContext.Provider value={{ selectedUseCase, setSelectedUseCase }}>
      {children}
    </UseCaseContext.Provider>
  );
}

export function useUseCase() {
  const context = useContext(UseCaseContext);

  if (!context) {
    throw new Error('useUseCase must be used within a UseCaseProvider');
  }

  return context;
}