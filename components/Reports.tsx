import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Download } from 'lucide-react';

export const Reports: React.FC = () => {
    const data = [
        { name: 'Paid', value: 72, color: '#10B981' },
        { name: 'Unpaid', value: 28, color: '#EF4444' },
    ];

    return (
        <div className="h-full space-y-6">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-900">Performance Report</h2>
                <button className="flex items-center space-x-2 px-4 py-2 bg-gray-900 text-white rounded-lg font-bold shadow-md hover:bg-gray-800">
                    <Download size={16} /> <span>Download PDF</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-6 h-96">
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col items-center justify-center">
                    <h3 className="text-lg font-bold text-gray-700 mb-4">Recovery Status</h3>
                    <ResponsiveContainer width="100%" height={250}>
                        <PieChart>
                            <Pie data={data} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                                {data.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} stroke="none" />
                                ))}
                            </Pie>
                            <Tooltip />
                            <Legend verticalAlign="bottom" height={36}/>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
                <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-center items-center">
                     <h3 className="text-gray-500 font-bold uppercase tracking-wider mb-2">Avg Days to Close</h3>
                     <p className="text-6xl font-bold text-purple-700">14</p>
                     <p className="text-gray-400 mt-2">Days</p>
                </div>
            </div>
        </div>
    );
};