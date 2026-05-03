import React, { useState } from 'react';
import { Search, ShieldAlert, CheckCircle, BarChart3, Bot } from 'lucide-react';
import { Agency, AgencyStatus } from '../types';
import { analyzeAgencyRisk } from '../services/geminiService';

const mockAgencies: Agency[] = [
  { id: '1', name: 'Global Recovery Partners', region: 'North America', status: AgencyStatus.ACTIVE, complianceScore: 98, recoveryRate: 72, activeCases: 1450, contactEmail: 'ops@grp.com', lastAuditDate: '2023-11-15' },
  { id: '2', name: 'Apex Debt Solutions', region: 'Europe', status: AgencyStatus.ACTIVE, complianceScore: 95, recoveryRate: 68, activeCases: 890, contactEmail: 'support@apexdebt.eu', lastAuditDate: '2023-10-30' },
  { id: '3', name: 'Rapid Collect Inc.', region: 'APAC', status: AgencyStatus.PROBATION, complianceScore: 82, recoveryRate: 55, activeCases: 320, contactEmail: 'legal@rapidcollect.asia', lastAuditDate: '2023-12-01' },
  { id: '4', name: 'Secure Financial Svcs', region: 'North America', status: AgencyStatus.SUSPENDED, complianceScore: 65, recoveryRate: 40, activeCases: 0, contactEmail: 'admin@securefin.com', lastAuditDate: '2023-09-20' },
];

export const AgencyList: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedAgency, setSelectedAgency] = useState<Agency | null>(null);
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async (agency: Agency) => {
    setSelectedAgency(agency);
    setIsAnalyzing(true);
    setAiAnalysis('');
    const result = await analyzeAgencyRisk(agency);
    setAiAnalysis(result);
    setIsAnalyzing(false);
  };

  return (
    <div className="h-full flex flex-col space-y-6">
      <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        <div className="relative w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="Search agency network..." 
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-200"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button className="bg-purple-600 hover:bg-purple-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors shadow-sm">
          + Add New Agency
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 flex-1 overflow-hidden">
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-1">
                <table className="min-w-full divide-y divide-gray-100">
                    <thead className="bg-gray-50">
                    <tr>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Agency</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Status</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Compliance</th>
                        <th className="px-6 py-4 text-left text-xs font-semibold text-gray-500 uppercase">Recovery</th>
                        <th className="px-6 py-4 text-right text-xs font-semibold text-gray-500 uppercase">Action</th>
                    </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                    {mockAgencies.filter(a => a.name.toLowerCase().includes(searchTerm.toLowerCase())).map((agency) => (
                        <tr key={agency.id} className="hover:bg-purple-50/50 transition-colors group cursor-pointer" onClick={() => handleAnalyze(agency)}>
                        <td className="px-6 py-4">
                            <div className="flex items-center">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center text-gray-600 font-bold text-xs mr-3">
                                {agency.name.charAt(0)}
                            </div>
                            <div>
                                <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                                <div className="text-xs text-gray-500">{agency.region}</div>
                            </div>
                            </div>
                        </td>
                        <td className="px-6 py-4">
                            <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                agency.status === AgencyStatus.ACTIVE ? 'bg-green-100 text-green-800' : 
                                agency.status === AgencyStatus.PROBATION ? 'bg-yellow-100 text-yellow-800' : 'bg-red-100 text-red-800'
                            }`}>
                            {agency.status}
                            </span>
                        </td>
                        <td className="px-6 py-4">
                            <div className="flex items-center space-x-2">
                                <div className="flex-1 h-1.5 bg-gray-100 rounded-full w-20">
                                    <div className="h-1.5 bg-purple-600 rounded-full" style={{width: `${agency.complianceScore}%`}}></div>
                                </div>
                                <span className="text-xs font-medium text-gray-600">{agency.complianceScore}%</span>
                            </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600 font-medium">
                            {agency.recoveryRate}%
                        </td>
                        <td className="px-6 py-4 text-right">
                             <button className="text-gray-400 hover:text-purple-600 group-hover:text-purple-600">
                                <BarChart3 size={18} />
                             </button>
                        </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>
        </div>

        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
           {!selectedAgency ? (
               <div className="flex-1 flex flex-col items-center justify-center text-center text-gray-400">
                   <ShieldAlert size={48} className="mb-4 text-gray-200" />
                   <p>Select an agency to view AI risk profile and performance details.</p>
               </div>
           ) : (
               <>
                <div className="flex items-center space-x-3 mb-6 pb-6 border-b border-gray-100">
                    <div className="h-12 w-12 rounded-xl bg-purple-100 flex items-center justify-center text-purple-700 font-bold text-xl">
                        {selectedAgency.name.charAt(0)}
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-900">{selectedAgency.name}</h3>
                        <p className="text-sm text-gray-500">{selectedAgency.contactEmail}</p>
                    </div>
                </div>

                <div className="space-y-6 flex-1">
                    <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-4 rounded-xl border border-purple-100">
                        <div className="flex items-center space-x-2 mb-2">
                            <Bot size={16} className="text-purple-600" />
                            <h4 className="font-semibold text-purple-900 text-sm">AI Risk Assessment</h4>
                        </div>
                        {isAnalyzing ? (
                            <div className="h-10 flex items-center space-x-2 text-gray-400 text-sm">
                                <span>Analyzing operational data...</span>
                            </div>
                        ) : (
                            <p className="text-sm text-gray-700 leading-relaxed">{aiAnalysis}</p>
                        )}
                    </div>

                    <div>
                        <h4 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Performance & Compliance</h4>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                <div className="text-2xl font-bold text-gray-900">{selectedAgency.activeCases}</div>
                                <div className="text-xs text-gray-500">Active Cases</div>
                            </div>
                            <div className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-center">
                                <div className="text-2xl font-bold text-gray-900">{selectedAgency.lastAuditDate}</div>
                                <div className="text-xs text-gray-500">Last Audit</div>
                            </div>
                        </div>
                    </div>
                </div>

                <button className="w-full mt-6 bg-gray-900 text-white py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors">
                    View Full Audit Logs
                </button>
               </>
           )}
        </div>
      </div>
    </div>
  );
};