import React, { useState } from 'react';
import { Send, Download, Eye, CheckCircle, FileText, Clock } from 'lucide-react';

export const StatusView: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'sent' | 'updates'>('sent');
    const [viewEvidence, setViewEvidence] = useState(false);

    return (
        <div className="h-full flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
            <div className="flex border-b border-gray-200">
                <button 
                    onClick={() => setActiveTab('sent')}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'sent' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <Send size={16} className="inline mr-2" /> Log / Case Sent
                </button>
                <button 
                    onClick={() => setActiveTab('updates')}
                    className={`flex-1 py-4 text-sm font-bold text-center border-b-2 transition-colors ${activeTab === 'updates' ? 'border-purple-600 text-purple-600 bg-purple-50' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    <CheckCircle size={16} className="inline mr-2" /> Case Updates (Received)
                </button>
            </div>

            <div className="flex-1 overflow-auto p-6">
                {activeTab === 'sent' && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="flex justify-between items-center p-4 bg-gray-50 rounded-xl border border-gray-200">
                                <div>
                                    <h4 className="font-bold text-gray-900">Batch #B-202{i} - Consumer Debt</h4>
                                    <div className="flex items-center text-xs text-gray-500 mt-1">
                                        <Clock size={12} className="mr-1"/> Sent: Feb 2{i}, 10:00 AM
                                        <span className="mx-2">•</span>
                                        <span className="text-purple-600 font-medium">To: Global Recovery Partners</span>
                                    </div>
                                </div>
                                <button className="text-gray-400 hover:text-gray-600"><Eye size={20} /></button>
                            </div>
                        ))}
                    </div>
                )}

                {activeTab === 'updates' && !viewEvidence && (
                    <div className="overflow-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Cust Name</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Agency</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Amt Paid</th>
                                    <th className="px-6 py-4 text-left text-xs font-bold text-gray-500 uppercase">Current Status</th>
                                    <th className="px-6 py-4 text-center text-xs font-bold text-gray-500 uppercase">Details</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                <tr className="hover:bg-purple-50 transition-colors">
                                    <td className="px-6 py-4 text-sm font-bold text-gray-900">Wayne Enterprises</td>
                                    <td className="px-6 py-4 text-sm text-gray-600">Apex Solutions</td>
                                    <td className="px-6 py-4 text-sm font-bold text-green-600">$12,000</td>
                                    <td className="px-6 py-4 text-sm"><span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-bold">Paid</span></td>
                                    <td className="px-6 py-4 text-center">
                                        <button onClick={() => setViewEvidence(true)} className="p-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-purple-600 hover:text-white transition-colors">
                                            <FileText size={18} />
                                        </button>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                )}

                {activeTab === 'updates' && viewEvidence && (
                    <div className="max-w-3xl mx-auto bg-gray-50 rounded-2xl p-8 border border-gray-200">
                        <button onClick={() => setViewEvidence(false)} className="mb-4 text-sm font-bold text-gray-500 hover:text-purple-700">&larr; Back to List</button>
                        <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b border-gray-200 pb-4">Evidence & Details</h3>
                        <div className="grid grid-cols-2 gap-6 mb-8">
                            <div><span className="block text-gray-500 text-xs uppercase font-bold">Customer</span> <span className="text-lg font-bold">Wayne Enterprises</span></div>
                            <div><span className="block text-gray-500 text-xs uppercase font-bold">Status</span> <span className="text-lg font-bold text-green-600">Paid Full</span></div>
                        </div>
                        <div className="space-y-4">
                            <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center"><FileText className="text-purple-600 mr-3"/> <span>Final_Invoice.pdf</span></div>
                                <button className="text-purple-600 font-bold text-sm">View</button>
                            </div>
                            <div className="p-4 bg-white rounded-xl border border-gray-200 flex items-center justify-between">
                                <div className="flex items-center"><FileText className="text-purple-600 mr-3"/> <span>Call_Recording_Feb24.mp3</span></div>
                                <button className="text-purple-600 font-bold text-sm">Play</button>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};