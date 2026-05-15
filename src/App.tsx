import { useState } from 'react';
import type { Role } from './types';
import Layout from './components/layout/Layout';
import Dashboard from './pages/Dashboard';
import Rebalance from './pages/Rebalance';
import Compliance from './pages/Compliance';
import AuditTrail from './pages/AuditTrail';
import EtfManagement from './pages/EtfManagement';
import CollateralMonitor from './pages/CollateralMonitor';

function App() {
  const [activePage, setActivePage] = useState('dashboard');
  const [currentRole, setCurrentRole] = useState<Role>('FundManager');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard': return <Dashboard />;
      case 'rebalance': return <Rebalance currentRole={currentRole} />;
      case 'compliance': return <Compliance />;
      case 'audit':return <AuditTrail />;
      case 'etf': return <EtfManagement currentRole={currentRole} />;
      case 'collateral': return <CollateralMonitor currentRole={currentRole} />;
      default: return (
        <div className="text-canton-text text-lg">
          Coming soon: {activePage}
        </div>
      );
    }
  };

  return (
    <Layout
      activePage={activePage}
      onNavigate={setActivePage}
      currentRole={currentRole}
      onRoleChange={setCurrentRole}
    >
      {renderPage()}
    </Layout>
  );
}


export default App;