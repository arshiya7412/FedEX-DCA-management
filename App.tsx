import React, { useState } from 'react';
import { Layout } from './components/Layout';
import { Login } from './components/Login';
import { Dashboard } from './components/Dashboard';
import { AgencyList } from './components/AgencyList';
import { DebtAssignment } from './components/DebtAssignment';
import { CaseList } from './components/CaseList';
import { SLAConfig } from './components/SLAConfig';
import { StatusView } from './components/StatusView';
import { Reports } from './components/Reports';
import { UserRole } from './types';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentView, setCurrentView] = useState('dashboard');
  const [userRole, setUserRole] = useState<UserRole>(UserRole.FEDEX_ADMIN);

  const handleLogin = (role: UserRole) => {
      setUserRole(role);
      setIsAuthenticated(true);
      setCurrentView('dashboard');
  };

  const handleLogout = () => {
      setIsAuthenticated(false);
  };

  const renderContent = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard role={userRole} />;
      
      // FedEx Routes
      case 'case-management':
        return userRole === UserRole.FEDEX_ADMIN ? <DebtAssignment /> : null;
      case 'status-hub':
        return userRole === UserRole.FEDEX_ADMIN ? <StatusView /> : null;

      // DCA Routes
      case 'assigned-cases':
        return userRole === UserRole.DCA_MANAGER ? <CaseList /> : null;
      case 'sla-view':
         return userRole === UserRole.DCA_MANAGER ? <SLAConfig /> : null;
      case 'dca-reports':
        return userRole === UserRole.DCA_MANAGER ? <Reports /> : null;

      default:
        return <div className="flex items-center justify-center h-full text-gray-400">Module Under Construction</div>;
    }
  };

  if (!isAuthenticated) {
      return <Login onLogin={handleLogin} />;
  }

  return (
    <Layout 
        currentView={currentView} 
        setCurrentView={setCurrentView} 
        role={userRole}
        setRole={setUserRole}
        onLogout={handleLogout}
    >
      {renderContent()}
    </Layout>
  );
}

export default App;