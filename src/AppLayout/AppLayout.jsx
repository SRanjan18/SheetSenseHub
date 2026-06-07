import { useState } from 'react';

import BusinessModal from '../components/businessModal';
import { useBusiness } from '../context/businessContext';
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
  const { selectedBusiness, setSelectedBusiness } = useBusiness();
  const [showBusinessModal, setShowBusinessModal] = useState(!selectedBusiness);

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setShowBusinessModal(false);
  };

  return (
    <div className="shell">
      <Header
        selectedBusiness={selectedBusiness}
        businesses={USE_CASES}
        onBusinessSelect={handleBusinessSelect}
      />

     <main className="shell-main">
        <Outlet />
      </main>
      <Footer />

      <BusinessModal
        isOpen={showBusinessModal}
        businesses={USE_CASES}
        selectedBusiness={selectedBusiness}
        onSelect={handleBusinessSelect}
        // Prevent closing the modal when no business is selected yet.
        onClose={() => selectedBusiness && setShowBusinessModal(false)}
      />
    </div>
  );
}
