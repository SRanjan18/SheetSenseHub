import { useState } from 'react';

import BusinessSelectorModal from '../components/business-selector/BusinessSelectorModal';
import { useBusiness } from '../context/businessContext';
import Header from './header/Header';
import Footer from './footer/Footer';
import './AppLayout.css';
import { Outlet } from 'react-router-dom';
import { ACTIVE_BUSINESSES } from '../config/businesses';

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
        businesses={ACTIVE_BUSINESSES}
        onBusinessSelect={handleBusinessSelect}
      />

     <main className="shell-main">
        <Outlet />
      </main>
      <Footer />

      <BusinessSelectorModal
        isOpen={showBusinessModal}
        businesses={ACTIVE_BUSINESSES}
        selectedBusiness={selectedBusiness}
        onSelect={handleBusinessSelect}
        // Prevent closing the modal when no business is selected yet.
        onClose={() => selectedBusiness && setShowBusinessModal(false)}
      />
    </div>
  );
}
