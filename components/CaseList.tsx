import React, { useState, useRef } from 'react';
import { Case, CaseStatus } from '../types';
import { 
  Clock, CheckCircle, AlertCircle, ChevronRight, Upload, Phone, Mail, 
  MapPin, Calendar, FileText, Mic, DollarSign, Search, Eye, Edit3, Lock, Send, ShieldCheck, Bot
} from 'lucide-react';

// Mock Data
const mockCases: Case[] = [
    { 
        id: 'C-001', customerName: 'Acme Corp', amount: 12500, currency: 'USD', 
        dueDate: '2024-03-01', status: CaseStatus.NEW, priority: 'Medium', 
        slaDueDate: '2024-03-05', dcaId: '1', phone: '+1 (555) 012-3456', 
        email: 'billing@acme.com', logs: [] 
    },
    { 
        id: 'C-002', customerName: 'Wayne Enterprises', amount: 45000, currency: 'USD', 
        dueDate: '2024-02-28', status: CaseStatus.CONTACTED, priority: 'High', 
        slaDueDate: '2024-03-02', dcaId: '1', phone: '+1 (555) 098-7654', 
        email: 'finance@wayne.com', logs: [] 
    },
];

interface ActivityMsg {
    id: number;
    text: string;
    time: string;
    status: 'sent' | 'viewed' | 'delivered';
}

export const CaseList: React.FC = () => {
    const [viewMode, setViewMode] = useState<'list' | 'detail' | 'preview'>('list');
    const [selectedCase, setSelectedCase] = useState<Case | null>(null);
    const [showSLAModal, setShowSLAModal] = useState(false);
    
    // Form State
    const [statusUpdate, setStatusUpdate] = useState<CaseStatus | ''>('');
    const [promiseDate, setPromiseDate] = useState('');
    const [remarks, setRemarks] = useState('');
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Evidence File State
    const [evidenceFiles, setEvidenceFiles] = useState<{name: string, type: string}[]>([]);
    const fileInputRef = useRef<HTMLInputElement>(null);

    // Activity State
    const [activities, setActivities] = useState<ActivityMsg[]>([
        { id: 1, text: 'Case Assigned to Agency', time: '10:00 AM', status: 'viewed' },
        { id: 2, text: 'First Contact Attempted', time: '10:30 AM', status: 'delivered' }
    ]);

    const handleActionClick = (c: Case) => {
        setSelectedCase(c);
        setStatusUpdate(c.status);
        setPromiseDate(c.promiseDate || '');
        setRemarks('');
        setEvidenceFiles([]);
        setIsSubmitted(false);
        setViewMode('detail');
    };

    const handleFormatPreview = () => {
        setViewMode('preview');
    };

    const handleFinalSubmit = () => {
        setIsSubmitted(true);
        setViewMode('detail'); // Go back to detail but locked
        // Add activity
        setActivities([...activities, { 
            id: activities.length + 1, 
            text: `Status updated to ${statusUpdate}`, 
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }), 
            status: 'sent' 
        }]);
    };

    const handleEdit = () => {
        setViewMode('detail');
    };

    const triggerFileUpload = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(e.target.files && e.target.files.length > 0) {
            const file = e.target.files[0];
            setEvidenceFiles(prev => [...prev, {name: file.name, type: 'File'}]);
        }
    };

    return (
        <div className="h-full flex flex-col relative">
            <input type="file" ref={fileInputRef} className="hidden" onChange={handleFileChange} />
            
            {/* SLA Modal */}
            {showSLAModal && (
                <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
                    <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl relative">
                        <button onClick={() => setShowSLAModal(false)} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">&times;</button>
                        <div className="flex items-center space-x-2 mb-4 text-purple-700">
                            <Bot size={24} />
                            <h3 className="font-bold text-xl">AI SLA Monitor</h3>
                        </div>
                        <div className="space-y-4 bg-gray-50 p-4 rounded-xl border border-gray-200 text-sm">
                            <h4 className="font-bold text-gray-700 uppercase text-xs">Active Rules (Read Only)</h4>
                            <div className="flex justify-between"><span>First Contact:</span> <span className="font-bold">3 Days</span></div>
                            <div className="flex justify-between"><span>Status Update:</span> <span className="font-bold">Every 7 Days</span></div>
                            <div className="flex justify-between"><span>Max Duration:</span> <span className="font-bold">45 Days</span></div>
                            <div className="flex justify-between"><span>Escalation:</span> <span className="font-bold text-red-600">10 Days Inactivity</span></div>
                        </div>
                        <div className="mt-4 flex items-center text-xs text-green-600 font-medium">
                            <ShieldCheck size={14} className="mr-1" /> Monitoring Active
                        </div>
                    </div>
                </div>
            )}

            {/* --- LIST VIEW --- */}
            {viewMode === 'list' && (
                <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col h-full">
                    <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                        <h2 className="text-xl font-bold text-gray-900">Assigned Cases</h2>
                        <div className="flex space-x-2">
                             {/* AI SLA Monitor Icon */}
                             <button onClick={() => setShowSLAModal(true)} className="flex items-center space-x-2 px-3 py-2 bg-purple-50 text-purple-700 rounded-lg hover:bg-purple-100 border border-purple-200 transition-colors">
                                <Bot size={18} />
                                <span className="text-sm font-bold">AI Monitor</span>
                             </button>
                        </div>
                    </div>
                    
                    <div className="overflow-auto flex-1">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Case ID</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Customer</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Phone</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Due Date</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Priority</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Action</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200 bg-white">
                                {mockCases.map((c) => (
                                    <tr key={c.id} className="hover:bg-purple-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-mono text-gray-600">{c.id}</td>
                                        <td className="px-6 py-4">
                                            <div className="text-sm font-bold text-gray-900">{c.customerName}</div>
                                            <div className="text-xs text-gray-400">123 Business Rd, NY</div>
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{c.phone}</td>
                                        <td className="px-6 py-4 text-sm text-gray-600">{c.dueDate}</td>
                                        <td className="px-6 py-4">
                                            <span className={`px-2 py-1 text-xs font-bold rounded-full border ${
                                                c.priority === 'High' ? 'bg-red-50 text-red-700 border-red-200' : 'bg-yellow-50 text-yellow-700 border-yellow-200'
                                            }`}>{c.priority}</span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded border border-gray-200">{c.status}</span>
                                        </td>
                                        <td className="px-6 py-4 text-center">
                                            <button 
                                                onClick={() => handleActionClick(c)}
                                                className="p-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 shadow-sm transition-transform hover:scale-105"
                                            >
                                                <ChevronRight size={18} />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* --- DETAIL & PREVIEW VIEW --- */}
            {(viewMode === 'detail' || viewMode === 'preview') && selectedCase && (
                <div className="flex h-full gap-6">
                    {/* Main Form Area */}
                    <div className="flex-1 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
                        {/* Read Only Header */}
                        <div className="bg-gray-50 p-6 border-b border-gray-200 grid grid-cols-2 gap-4">
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">{selectedCase.customerName}</h2>
                                <p className="text-sm text-gray-500 font-mono mt-1">{selectedCase.id}</p>
                            </div>
                            <div className="text-right">
                                <p className="text-xl font-bold text-gray-900">{selectedCase.currency} {selectedCase.amount.toLocaleString()}</p>
                                <p className="text-sm text-red-600 font-medium">Due: {selectedCase.dueDate}</p>
                            </div>
                            <div className="col-span-2 grid grid-cols-3 gap-4 text-sm text-gray-600 mt-2">
                                <div className="flex items-center"><MapPin size={14} className="mr-2"/> 123 Business Rd, NY</div>
                                <div className="flex items-center"><Phone size={14} className="mr-2"/> {selectedCase.phone}</div>
                                <div className="flex items-center"><Clock size={14} className="mr-2"/> 34 Days Overdue</div>
                            </div>
                        </div>

                        {viewMode === 'detail' && (
                            <div className="p-8 flex-1 overflow-y-auto">
                                {isSubmitted ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center">
                                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
                                            <Lock size={32} />
                                        </div>
                                        <h3 className="text-xl font-bold text-gray-900">Update Locked</h3>
                                        <p className="text-gray-500 mt-2">This status update has been submitted to FedEx.</p>
                                        <button onClick={() => setViewMode('list')} className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-lg font-medium">Back to List</button>
                                    </div>
                                ) : (
                                    <div className="space-y-6 max-w-2xl mx-auto">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Update Status</label>
                                            <select 
                                                value={statusUpdate} 
                                                onChange={(e) => setStatusUpdate(e.target.value as CaseStatus)}
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none transition-all text-gray-900"
                                            >
                                                <option value={CaseStatus.CONTACTED}>Contacted</option>
                                                <option value={CaseStatus.NOT_REACHABLE}>Not Reachable</option>
                                                <option value={CaseStatus.PROMISE_TO_PAY}>Promise to Pay</option>
                                                <option value={CaseStatus.PAID}>Paid</option>
                                            </select>
                                        </div>

                                        {statusUpdate === CaseStatus.PROMISE_TO_PAY && (
                                            <div className="animate-in fade-in slide-in-from-top-2">
                                                <label className="block text-sm font-bold text-gray-700 mb-2">Promise Date</label>
                                                <div className="relative">
                                                    <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" size={18} />
                                                    <input 
                                                        type="date" 
                                                        className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none text-gray-900"
                                                        value={promiseDate}
                                                        onChange={(e) => setPromiseDate(e.target.value)}
                                                    />
                                                </div>
                                            </div>
                                        )}

                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-2">Remarks</label>
                                            <textarea 
                                                className="w-full px-4 py-3 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 outline-none h-32 resize-none text-gray-900"
                                                placeholder="Enter interaction details..."
                                                value={remarks}
                                                onChange={(e) => setRemarks(e.target.value)}
                                            ></textarea>
                                        </div>

                                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-200">
                                            <h4 className="font-bold text-sm text-gray-700 mb-3">Evidence Submission</h4>
                                            
                                            {evidenceFiles.length > 0 && (
                                                <div className="flex flex-wrap gap-2 mb-3">
                                                    {evidenceFiles.map((f, i) => (
                                                        <span key={i} className="px-2 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold flex items-center">
                                                            {f.name} <CheckCircle size={10} className="ml-1"/>
                                                        </span>
                                                    ))}
                                                </div>
                                            )}

                                            <div className="flex space-x-3">
                                                <button onClick={triggerFileUpload} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                                                    <Mic size={16} className="mr-2"/> Call Rec
                                                </button>
                                                <button onClick={triggerFileUpload} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                                                    <FileText size={16} className="mr-2"/> Invoice
                                                </button>
                                                <button onClick={triggerFileUpload} className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 hover:bg-gray-100">
                                                    <Upload size={16} className="mr-2"/> Docs
                                                </button>
                                            </div>
                                        </div>

                                        <button 
                                            onClick={handleFormatPreview}
                                            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-4 rounded-xl shadow-lg transition-transform hover:scale-[1.01] flex justify-center items-center"
                                        >
                                            <Send size={18} className="mr-2" /> Submit Update
                                        </button>
                                    </div>
                                )}
                            </div>
                        )}

                        {viewMode === 'preview' && (
                            <div className="p-8 flex-1 overflow-y-auto">
                                <div className="max-w-2xl mx-auto bg-gray-50 p-8 rounded-2xl border border-gray-200">
                                    <h3 className="text-xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Confirm Submission</h3>
                                    
                                    <div className="space-y-4 text-sm">
                                        <div className="flex justify-between"><span className="text-gray-500">Customer:</span> <span className="font-bold">{selectedCase.customerName}</span></div>
                                        <div className="flex justify-between"><span className="text-gray-500">New Status:</span> <span className="font-bold text-purple-700">{statusUpdate}</span></div>
                                        {promiseDate && <div className="flex justify-between"><span className="text-gray-500">Promise Date:</span> <span className="font-bold">{promiseDate}</span></div>}
                                        <div className="flex justify-between"><span className="text-gray-500">Evidence:</span> <span className="font-bold">{evidenceFiles.length > 0 ? `${evidenceFiles.length} Files Attached` : 'No files'}</span></div>
                                        <div className="mt-4">
                                            <span className="text-gray-500 block mb-1">Remarks:</span>
                                            <p className="bg-white p-3 rounded-lg border border-gray-200 italic">{remarks}</p>
                                        </div>
                                    </div>

                                    <div className="flex space-x-4 mt-8">
                                        <button onClick={handleEdit} className="flex-1 bg-white border border-gray-300 text-gray-700 py-3 rounded-xl font-bold flex items-center justify-center hover:bg-gray-50">
                                            <Edit3 size={18} className="mr-2"/> Edit
                                        </button>
                                        <button onClick={handleFinalSubmit} className="flex-1 bg-green-600 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-green-700 shadow-md">
                                            <CheckCircle size={18} className="mr-2"/> Confirm Submit
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Activity Log - WhatsApp Style */}
                    <div className="w-80 bg-white rounded-2xl border border-gray-200 shadow-sm flex flex-col overflow-hidden">
                        <div className="p-4 bg-purple-700 text-white font-bold flex items-center">
                            <Clock size={18} className="mr-2" /> Activity Log
                        </div>
                        <div className="flex-1 bg-gray-100 p-4 space-y-3 overflow-y-auto">
                            {activities.map((msg) => (
                                <div key={msg.id} className="flex flex-col items-end">
                                    <div className="bg-white p-3 rounded-lg rounded-tr-none shadow-sm text-sm text-gray-800 border border-gray-200 max-w-[90%]">
                                        {msg.text}
                                    </div>
                                    <div className="flex items-center mt-1 text-[10px] text-gray-500">
                                        <span>{msg.time}</span>
                                        <span className="mx-1">•</span>
                                        {msg.status === 'sent' && <CheckCircle size={10} className="text-gray-400"/>}
                                        {msg.status === 'viewed' && <div className="flex"><CheckCircle size={10} className="text-blue-500"/><CheckCircle size={10} className="text-blue-500 -ml-1"/></div>}
                                        {msg.status === 'delivered' && <div className="flex"><CheckCircle size={10} className="text-gray-500"/><CheckCircle size={10} className="text-gray-500 -ml-1"/></div>}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};