import React from 'react';
import { LayoutDashboard, Users, Briefcase, FileText, Settings, ShieldCheck, LogOut, Activity, Send } from 'lucide-react';
import { UserRole } from '../types';

interface SidebarProps {
  currentView: string;
  setCurrentView: (view: string) => void;
  role: UserRole;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setCurrentView, role, onLogout }) => {
  const menuItems = [
    // Common
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, roles: [UserRole.FEDEX_ADMIN, UserRole.DCA_MANAGER] },
    
    // FedEx Admin
    { id: 'case-management', label: 'Case Management', icon: Briefcase, roles: [UserRole.FEDEX_ADMIN] },
    { id: 'status-hub', label: 'Status & Updates', icon: Send, roles: [UserRole.FEDEX_ADMIN] },
    
    // DCA Manager
    { id: 'assigned-cases', label: 'Assigned Cases', icon: Briefcase, roles: [UserRole.DCA_MANAGER] },
    { id: 'dca-reports', label: 'Reports', icon: FileText, roles: [UserRole.DCA_MANAGER] },
    { id: 'sla-view', label: 'SLA Configuration', icon: ShieldCheck, roles: [UserRole.DCA_MANAGER] },
  ];

  return (
    <div className="w-64 bg-white h-screen fixed left-0 top-0 border-r border-gray-200 z-10 flex flex-col shadow-lg">
      <div className="p-6 border-b border-gray-100 flex items-center space-x-3">
        <div className="w-8 h-8 bg-purple-700 rounded flex items-center justify-center font-bold text-white shadow-md">F</div>
        <span className="font-bold text-lg text-gray-800 tracking-tight">FedEx Connect</span>
      </div>

      <nav className="flex-1 overflow-y-auto py-6 px-4">
        <ul className="space-y-2">
          {menuItems.filter(item => item.roles.includes(role)).map((item) => (
            <li key={item.id}>
              <button
                onClick={() => setCurrentView(item.id)}
                className={`w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-xl transition-all
                  ${currentView === item.id 
                    ? 'bg-purple-50 text-purple-700 shadow-sm border border-purple-100' 
                    : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}
              >
                <item.icon size={18} className={currentView === item.id ? 'text-purple-700' : 'text-gray-400'} />
                <span>{item.label}</span>
              </button>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-gray-100">
        <button 
            onClick={onLogout}
            className="flex items-center space-x-3 text-gray-500 hover:text-red-600 w-full px-4 py-3 text-sm font-medium transition-colors hover:bg-red-50 rounded-xl"
        >
          <LogOut size={18} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};