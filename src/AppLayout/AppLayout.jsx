import { useState } from 'react';

import UseCaseModal from '../components/UseCaseModal';
import { useUseCase } from '../context/UseCaseContext';
import Header from './header/Header';
import Footer from './footer/Footer';
import './AppLayout.css';
import { Outlet } from 'react-router-dom';
// Keep this list outside the component to avoid recreating it on every render.
const USE_CASES = [
  'BillingHub (BH)',
  'OpsFlow (OF)',
  'UnderwritePro (UP)',
  'AccountSphere (AS)',
  'QuoteVision (QV)',
  'HealthQuote+ (HQ+)',
  'ListFlow (LF)',
  'MediUnderwrite(MU)',
];

export default function AppLayout({ children }) {
  const { selectedUseCase, setSelectedUseCase } = useUseCase();
  const [showUseCaseModal, setShowUseCaseModal] = useState(!selectedUseCase);

  const handleUseCaseSelect = (useCase) => {
  setSelectedUseCase(useCase);
  setShowUseCaseModal(false);
};

  return (
    <div className="shell">
      <Header
        selectedUseCase={selectedUseCase}
        useCases={USE_CASES}
        onUseCaseSelect={handleUseCaseSelect}
      />

     <main className="shell-main">
        <Outlet />
      </main>
      <Footer />

      <UseCaseModal
        isOpen={showUseCaseModal}
        useCases={USE_CASES}
        selectedUseCase={selectedUseCase}
        onSelect={handleUseCaseSelect}
        // Prevent closing the modal when no use case is selected yet.
        onClose={() => selectedUseCase && setShowUseCaseModal(false)}
      />
    </div>
  );
}