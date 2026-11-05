import React from 'react';
import { AegisProvider, useAegis } from './context/AegisContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { GuidedTourBanner } from './components/layout/GuidedTourBanner';
import { GlobalSearchModal } from './components/common/GlobalSearchModal';
import { NotificationDrawer } from './components/common/NotificationDrawer';

import { OverviewDashboard } from './components/overview/OverviewDashboard';
import { FraudGuardianView } from './components/fraud-guardian/FraudGuardianView';
import { FairTradeView } from './components/fair-trade/FairTradeView';
import { VirtualVaultView } from './components/virtual-vault/VirtualVaultView';
import { SovereigntyView } from './components/sovereignty/SovereigntyView';
import { TransactionsView } from './components/transactions/TransactionsView';
import { SettingsView } from './components/settings/SettingsView';

const MainLayout: React.FC = () => {
  const { activeTab } = useAegis();

  const renderActiveView = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewDashboard />;
      case 'fraud-guardian':
        return <FraudGuardianView />;
      case 'fair-trade':
        return <FairTradeView />;
      case 'virtual-vault':
        return <VirtualVaultView />;
      case 'sovereignty':
        return <SovereigntyView />;
      case 'transactions':
        return <TransactionsView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <OverviewDashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-[#F8FAFC] text-slate-900 overflow-hidden font-sans">
      {/* Persistent Desktop Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Interactive Guided Tour Banner */}
        <GuidedTourBanner />

        {/* Top Header */}
        <Header />

        {/* Scrollable View Area */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-8 py-6 sm:py-8 max-w-7xl w-full mx-auto">
          {renderActiveView()}
        </main>
      </div>

      {/* Global Modals & Drawers */}
      <GlobalSearchModal />
      <NotificationDrawer />
    </div>
  );
};

export default function App() {
  return (
    <AegisProvider>
      <MainLayout />
    </AegisProvider>
  );
}
