import React from 'react';
import { Sidebar } from './Sidebar';
import { UserRole } from '../types';
import { Bell, Search } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: string;
  setCurrentView: (view: string) => void;
  role: UserRole;
  setRole: (role: UserRole) => void;
  onLogout: () => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setCurrentView, role, onLogout }) => {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <Sidebar currentView={currentView} setCurrentView={setCurrentView} role={role} onLogout={onLogout} />
      
      <div className="flex-1 ml-64 flex flex-col p-6 overflow-hidden h-screen">
        {/* Top Header Floating Card */}
        <header className="bg-white rounded-2xl p-4 mb-6 shadow-sm border border-gray-200 flex items-center justify-between">
          <div>
             <h2 className="text-gray-900 font-bold text-xl capitalize">{currentView.replace(/-/g, ' ')}</h2>
             <p className="text-xs text-gray-500">{role === UserRole.FEDEX_ADMIN ? 'Corporate Finance Governance' : 'DCA Operations Portal'}</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={16} />
                <input 
                    type="text" 
                    placeholder="Global Search..." 
                    className="pl-9 pr-4 py-2 bg-white border border-gray-300 rounded-full text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-600 focus:border-transparent w-64 shadow-sm"
                />
             </div>
             <button className="relative p-2 text-gray-500 hover:text-purple-700 transition-colors">
                <Bell size={20} />
                <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
             </button>
             <div className="flex items-center space-x-3 pl-4 border-l border-gray-200">
                <div className="text-right hidden md:block">
                    <p className="text-sm font-semibold text-gray-800">{role === UserRole.FEDEX_ADMIN ? 'Admin User' : 'DCA Manager'}</p>
                    <p className="text-xs text-gray-500">{role === UserRole.FEDEX_ADMIN ? 'FedEx HQ' : 'Agency Lead'}</p>
                </div>
                <div className="h-10 w-10 bg-gradient-to-br from-purple-700 to-indigo-800 rounded-full flex items-center justify-center text-white font-bold shadow-md">
                    {role === UserRole.FEDEX_ADMIN ? 'A' : 'M'}
                </div>
             </div>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="flex-1 overflow-auto rounded-2xl pb-4">
          {children}
        </main>
      </div>
    </div>
  );
};