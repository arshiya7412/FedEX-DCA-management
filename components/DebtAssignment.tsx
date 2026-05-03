import React, { useState, useRef } from 'react';
import { Briefcase, Upload, Plus, ShieldCheck, Users, Save, ChevronDown, CheckCircle, Bot, Send } from 'lucide-react';
import { generateBatchStrategy } from '../services/geminiService';

type SubView = 'hub' | 'manual-add' | 'sla-config' | 'dca-select';

export const DebtAssignment: React.FC = () => {
  const [view, setView] = useState<SubView>('hub');
  
  // Manual Add State
  const [numRows, setNumRows] = useState(0);
  const [manualRows, setManualRows] = useState<any[]>([]);

  // CSV Upload State
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadStatus, setUploadStatus] = useState<string>('');

  // Auto Assign State
  const [autoAssignStatus, setAutoAssignStatus] = useState<string>('');

  // Global Submit State
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  // SLA State
  const [slaConfig, setSlaConfig] = useState({
      firstContact: 3,
      updateFreq: 7,
      maxDuration: 45,
      ptpFollowUp: 2,
      escalation: 10
  });

  const handleCreateRows = () => {
      setManualRows(Array(numRows).fill({ id: '', name: '', amt: '', addr: '', phone: '', email: '', due: '' }));
  };

  const handleCSVClick = () => {
      if (fileInputRef.current) {
          fileInputRef.current.click();
      }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files.length > 0) {
          setUploadStatus('CSV Uploaded Successfully!');
          setTimeout(() => setUploadStatus(''), 3000);
      }
  };

  const handleAutoAssign = () => {
      setAutoAssignStatus('Analyzing Portfolio Risk...');
      setTimeout(() => {
          setAutoAssignStatus('Assigned to Global Recovery (Recommended)');
      }, 1500);
  };

  const handleGlobalSubmit = () => {
      setShowSuccessToast(true);
      setTimeout(() => setShowSuccessToast(false), 3000);
      // Logic to actually submit data would go here
  };

  const HubCard = ({ title, icon: Icon, onClick, color, subText }: any) => (
      <div onClick={onClick} className="bg-white p-8 rounded-2xl border border-gray-200 shadow-sm hover:shadow-lg hover:border-purple-300 transition-all cursor-pointer group relative overflow-hidden">
          <div className={`p-4 rounded-full w-fit mb-4 ${color}`}>
              <Icon size={32} className="text-white" />
          </div>
          <h3 className="text-xl font-bold text-gray-900 group-hover:text-purple-700">{title}</h3>
          <p className="text-gray-500 mt-2 text-sm">{subText || "Click to manage."}</p>
      </div>
  );

  return (
    <div className="h-full relative">
        {/* Success Toast */}
        {showSuccessToast && (
            <div className="absolute top-4 right-4 z-50 bg-green-600 text-white px-6 py-4 rounded-xl shadow-2xl flex items-center animate-bounce">
                <CheckCircle size={24} className="mr-3" />
                <span className="font-bold text-lg">Submitted successfully!</span>
            </div>
        )}

        {/* Global Submit FAB (Floating Action Button) */}
        {view !== 'hub' && (
             <button 
                onClick={handleGlobalSubmit}
                className="absolute bottom-6 right-6 z-40 bg-gray-900 text-white px-6 py-4 rounded-full shadow-2xl hover:bg-gray-800 transition-all flex items-center font-bold text-lg border-2 border-white/20"
             >
                <Send size={20} className="mr-2" /> Submit Records
             </button>
        )}

        {view === 'hub' && (
            <div className="h-full flex flex-col justify-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">Case Management Hub</h2>
                
                {/* Hidden File Input for CSV */}
                <input type="file" ref={fileInputRef} className="hidden" accept=".csv" onChange={handleFileChange} />
                {uploadStatus && (
                    <div className="max-w-md mx-auto mb-6 bg-green-100 border border-green-300 text-green-800 px-4 py-2 rounded-lg text-center font-bold">
                        {uploadStatus}
                    </div>
                )}

                <div className="grid grid-cols-2 gap-8 max-w-4xl mx-auto w-full">
                    <HubCard title="Upload CSV" icon={Upload} onClick={handleCSVClick} color="bg-blue-600" subText="Import bulk cases" />
                    <HubCard title="Add Case Manually" icon={Plus} onClick={() => setView('manual-add')} color="bg-green-600" subText="Single entry mode" />
                    <HubCard title="SLA Configuration" icon={ShieldCheck} onClick={() => setView('sla-config')} color="bg-orange-500" subText="Set rules & alerts" />
                    <HubCard title="Select DCA" icon={Users} onClick={() => setView('dca-select')} color="bg-purple-600" subText="Assign portfolios" />
                </div>
            </div>
        )}

        {view !== 'hub' && (
            <button onClick={() => setView('hub')} className="mb-4 text-sm font-bold text-gray-500 hover:text-purple-700 flex items-center">
                <ChevronDown className="rotate-90 mr-1" size={16} /> Back to Hub
            </button>
        )}

        {/* 1. Manual Add View */}
        {view === 'manual-add' && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-200 p-6 h-full flex flex-col pb-24"> {/* Added padding bottom for FAB */}
                <div className="flex items-end gap-4 mb-6 border-b border-gray-100 pb-6">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Number of Customers</label>
                        <input 
                            type="number" 
                            className="px-4 py-2 bg-white border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 outline-none w-32"
                            value={numRows}
                            onChange={(e) => setNumRows(parseInt(e.target.value))}
                        />
                    </div>
                    <button onClick={handleCreateRows} className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg hover:bg-purple-700">
                        Create Rows
                    </button>
                </div>

                <div className="flex-1 overflow-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                {['Case ID', 'Cust Name', 'Amount', 'Address', 'Phone', 'Email', 'Due Date'].map(h => (
                                    <th key={h} className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">{h}</th>
                                ))}
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {manualRows.map((_, idx) => (
                                <tr key={idx}>
                                    {['id', 'name', 'amt', 'addr', 'phone', 'email', 'due'].map((field) => (
                                        <td key={field} className="px-4 py-2">
                                            <input 
                                                type="text" 
                                                className="w-full px-2 py-1 bg-white border border-gray-200 rounded focus:border-purple-500 focus:ring-1 focus:ring-purple-200 outline-none text-sm" 
                                                placeholder="..." 
                                            />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        )}

        {/* 2. SLA Configuration View */}
        {view === 'sla-config' && (
            <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-sm border border-gray-200 p-8 pb-24">
                <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    <ShieldCheck className="mr-2 text-orange-500"/> SLA Rules Engine
                </h2>
                
                <div className="space-y-6">
                    {[
                        { label: 'First Contact SLA', key: 'firstContact', suffix: 'days' },
                        { label: 'Status Update SLA', key: 'updateFreq', suffix: 'days' },
                        { label: 'Case Duration SLA', key: 'maxDuration', suffix: 'days', badge: 'Review Required' },
                        { label: 'Escalation Rule', key: 'escalation', suffix: 'days' }
                    ].map((item: any) => (
                        <div key={item.key}>
                            <label className="block text-sm font-bold text-gray-700 mb-2">{item.label}</label>
                            <div className="flex items-center bg-gray-50 p-3 rounded-lg border border-gray-200">
                                <span className="text-sm text-gray-600 mr-2">Value:</span>
                                <input 
                                    type="number" 
                                    className="w-20 p-1 bg-white border border-gray-300 rounded text-center font-bold outline-none focus:border-purple-500"
                                    value={(slaConfig as any)[item.key]} 
                                    onChange={(e) => setSlaConfig({...slaConfig, [item.key]: parseInt(e.target.value)})}
                                />
                                <span className="text-sm text-gray-600 ml-2">{item.suffix}</span>
                                {item.badge && <span className="ml-auto text-xs bg-red-100 text-red-700 px-2 py-1 rounded font-bold">{item.badge} ▼</span>}
                            </div>
                        </div>
                    ))}
                </div>
                
                {/* Save button specific to SLA, can rely on global submit too, but user might expect local save */}
                <button onClick={handleGlobalSubmit} className="w-full mt-8 bg-purple-600 text-white font-bold py-3 rounded-xl shadow-md hover:bg-purple-700 flex justify-center items-center">
                    <Save size={18} className="mr-2" /> Save Configuration
                </button>
            </div>
        )}

        {/* 3. DCA Select View */}
        {view === 'dca-select' && (
            <div className="grid grid-cols-2 gap-6 h-full pb-20">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm overflow-auto">
                    <h3 className="text-lg font-bold text-gray-900 mb-4">DCA List</h3>
                    <div className="space-y-3">
                        {['Global Recovery', 'Apex Solutions', 'Rapid Collect'].map((dca, i) => (
                            <div key={i} className="p-4 border border-gray-200 rounded-xl hover:border-purple-500 cursor-pointer transition-all flex justify-between items-center group bg-white">
                                <span className="font-bold text-gray-800">{dca}</span>
                                <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full font-bold">9{8-i}% Perf</span>
                            </div>
                        ))}
                    </div>
                </div>
                <div className="bg-gradient-to-br from-indigo-50 to-purple-50 p-6 rounded-2xl border border-purple-100 flex flex-col justify-center items-center text-center relative">
                    <Bot size={48} className="text-purple-600 mb-4" />
                    <h3 className="text-xl font-bold text-purple-900">AI Recommendation</h3>
                    <p className="text-purple-800 mt-2 mb-6">Based on current portfolio risk, <span className="font-bold">Global Recovery</span> is the optimal choice due to their 98% recovery rate in this region.</p>
                    
                    {autoAssignStatus ? (
                        <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-green-200 text-green-700 font-bold animate-in fade-in zoom-in">
                            <CheckCircle size={20} className="inline mr-2 mb-1"/>
                            {autoAssignStatus}
                        </div>
                    ) : (
                        <button 
                            onClick={handleAutoAssign}
                            className="px-6 py-2 bg-purple-600 text-white font-bold rounded-lg shadow-md hover:bg-purple-700"
                        >
                            Auto-Assign
                        </button>
                    )}
                </div>
            </div>
        )}
    </div>
  );
};