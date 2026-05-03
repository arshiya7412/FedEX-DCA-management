import React from 'react';
import { ShieldCheck, AlertTriangle, AlertCircle } from 'lucide-react';

export const SLAConfig: React.FC = () => {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
        <h2 className="text-2xl font-bold text-gray-900">SLA Monitor & Configuration</h2>
        
        <div className="grid grid-cols-3 gap-6">
            <div className="col-span-1 bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
                 <h3 className="flex items-center font-bold text-gray-800 mb-4">
                    <ShieldCheck className="mr-2 text-purple-600" size={20}/> Active Rules
                 </h3>
                 <div className="space-y-4 text-sm">
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span>First Contact</span> <span className="font-bold">3 Days</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Update Freq</span> <span className="font-bold">7 Days</span></div>
                    <div className="flex justify-between p-2 bg-gray-50 rounded"><span>Max Duration</span> <span className="font-bold">45 Days</span></div>
                    <div className="p-3 bg-green-50 text-green-700 rounded-lg text-xs font-bold text-center mt-4">
                        AI Tracking Enabled
                    </div>
                 </div>
            </div>

            <div className="col-span-2 space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-orange-100 shadow-sm">
                    <h3 className="font-bold text-orange-700 mb-4 flex items-center">
                        <AlertTriangle className="mr-2" size={20}/> Nearing Breach (Warning)
                    </h3>
                    <div className="space-y-2">
                        <div className="flex justify-between items-center p-3 bg-orange-50 rounded-lg border border-orange-100">
                            <span className="font-bold text-gray-800">Case #C-005</span>
                            <span className="text-sm text-orange-600 font-mono">04:23:00 Remaining</span>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-red-100 shadow-sm">
                    <h3 className="font-bold text-red-700 mb-4 flex items-center">
                        <AlertCircle className="mr-2" size={20}/> Breached Cases
                    </h3>
                    <div className="space-y-2">
                         <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                            <span className="font-bold text-gray-800">Case #C-002</span>
                            <span className="text-sm text-red-600 font-mono">- 2 Days Overdue</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
  );
};