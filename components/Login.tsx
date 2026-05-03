import React, { useState } from 'react';
import { UserRole } from '../types';
import { ArrowRight, Lock } from 'lucide-react';

interface LoginProps {
  onLogin: (role: UserRole) => void;
}

export const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(UserRole.FEDEX_ADMIN);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8 relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-purple-600 to-indigo-600"></div>
        
        <div className="mb-8 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-purple-100 rounded-lg text-purple-700 font-bold text-xl mb-4">
                F
            </div>
            <h1 className="text-2xl font-bold text-gray-900 tracking-tight">FedEx DCA Connect</h1>
            <p className="text-gray-500 text-sm mt-2">Secure Enterprise Access</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Role Selection</label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setSelectedRole(UserRole.FEDEX_ADMIN)}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  selectedRole === UserRole.FEDEX_ADMIN
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                FedEx Admin
              </button>
              <button
                type="button"
                onClick={() => setSelectedRole(UserRole.DCA_MANAGER)}
                className={`py-2 px-4 rounded-lg border text-sm font-medium transition-all ${
                  selectedRole === UserRole.DCA_MANAGER
                    ? 'border-purple-600 bg-purple-50 text-purple-700'
                    : 'border-gray-200 text-gray-500 hover:border-gray-300'
                }`}
              >
                DCA Manager
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="Enter corporate ID"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              required
              className="w-full px-4 py-2 bg-white border border-gray-300 text-gray-900 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-purple-700 hover:bg-purple-800 text-white font-semibold py-2.5 rounded-lg shadow-md hover:shadow-lg transition-all flex items-center justify-center group"
          >
            <Lock size={18} className="mr-2" />
            Secure Login
            <ArrowRight size={18} className="ml-2 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <div className="mt-6 text-center">
            <p className="text-xs text-gray-400">Authorized Personnel Only. All activities are monitored.</p>
        </div>
      </div>
    </div>
  );
};