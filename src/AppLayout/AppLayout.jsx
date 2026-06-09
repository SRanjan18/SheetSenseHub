import { useEffect, useMemo, useState } from 'react';
import { Outlet } from 'react-router-dom';
import BusinessSelectorModal from '../components/business-selector/BusinessSelectorModal';
import { ACTIVE_BUSINESSES } from '../config/businesses';
import { useAuth } from '../context/AuthContext';
import { useBusiness } from '../context/businessContext';
import Header from './header/Header';
import Footer from './footer/Footer';
import './AppLayout.css';

export default function AppLayout() {
  const { user } = useAuth();
  const { selectedBusiness, setSelectedBusiness } = useBusiness();

  const businesses = useMemo(
    () =>
      Array.from(
        new Set(
          (user?.businessRoles || [])
            .map((item) => item.businessName)
            .filter((business) => ACTIVE_BUSINESSES.includes(business))
        )
      ),
    [user]
  );

  const [showBusinessModal, setShowBusinessModal] = useState(false);
  const [hasOpenedInitialBusinessModal, setHasOpenedInitialBusinessModal] = useState(false);

  useEffect(() => {
    if (!businesses.length || !selectedBusiness) return;

    if (!businesses.includes(selectedBusiness)) {
      setSelectedBusiness('');
    }
  }, [businesses, selectedBusiness, setSelectedBusiness]);

  useEffect(() => {
    if (!businesses.length || hasOpenedInitialBusinessModal) return;

    setShowBusinessModal(true);
    setHasOpenedInitialBusinessModal(true);
  }, [businesses.length, hasOpenedInitialBusinessModal]);

  const handleBusinessSelect = (business) => {
    setSelectedBusiness(business);
    setShowBusinessModal(false);
  };

  return (
    <div className="shell">
      <Header
        selectedBusiness={selectedBusiness}
        businesses={businesses}
        onBusinessSelect={handleBusinessSelect}
      />

      <main className="shell-main">
        <Outlet />
      </main>
      <Footer />

      <BusinessSelectorModal
        isOpen={showBusinessModal && businesses.length > 0}
        businesses={businesses}
        onSelect={handleBusinessSelect}
      />
    </div>
  );
}
