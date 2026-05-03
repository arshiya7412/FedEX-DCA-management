import React, { useState, useRef, useEffect } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';
import { 
  DollarSign, AlertTriangle, MessageSquare, Send, Clock, CheckCircle, 
  TrendingUp, Users, FileText, ShieldAlert, Briefcase, User
} from 'lucide-react';
import { UserRole } from '../types';
import { chatWithAI } from '../services/geminiService';

interface DashboardProps {
    role: UserRole;
}

interface ChatMessage {
    role: 'user' | 'ai';
    text: string;
}

export const Dashboard: React.FC<DashboardProps> = ({ role }) => {
  const isAdmin = role === UserRole.FEDEX_ADMIN;
  
  // Chat State
  const [chatQuery, setChatQuery] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isChatting, setIsChatting] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat
  useEffect(() => {
    if (chatContainerRef.current) {
        chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isChatting]);

  const handleChat = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatQuery.trim()) return;

    // Add User Message
    const userMsg: ChatMessage = { role: 'user', text: chatQuery };
    setMessages(prev => [...prev, userMsg]);
    setChatQuery('');
    setIsChatting(true);

    // AI Request
    const context = isAdmin 
        ? 'You are a FedEx Admin Assistant. Analyze recovery amounts, SLA violations, and DCA performance.' 
        : 'You are a DCA Agent Assistant. Analyze assigned cases, due dates, and SLA countdowns.';
    
    // Simulate interactive flow by sending history (simplified here by just sending query + context)
    const responseText = await chatWithAI(chatQuery, context);
    
    // Add AI Message
    const aiMsg: ChatMessage = { role: 'ai', text: responseText };
    setMessages(prev => [...prev, aiMsg]);
    setIsChatting(false);
  };

  const KPICard = ({ title, value, icon: Icon, colorClass, subText }: any) => (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200 hover:shadow-md transition-all">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-semibold text-gray-500 uppercase tracking-wide">{title}</p>
          <h3 className="text-3xl font-bold text-gray-900 mt-2">{value}</h3>
          {subText && <p className="text-xs text-gray-400 mt-1">{subText}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colorClass}`}>
            <Icon size={24} className="text-white" />
        </div>
      </div>
    </div>
  );

  // --- FedEx Admin Interface ---
  if (isAdmin) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Overview</h1>
        
        {/* Metric Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <KPICard title="Cases Recovered" value="1,240" icon={CheckCircle} colorClass="bg-green-500" />
          <KPICard title="Amount Recovered" value="$12.4M" icon={DollarSign} colorClass="bg-purple-600" />
          <KPICard title="SLA Violations" value="12" icon={ShieldAlert} colorClass="bg-red-500" subText="Requires Attention" />
          <KPICard title="Unresolved" value="450" icon={AlertTriangle} colorClass="bg-orange-500" />
        </div>

        <div className="grid grid-cols-12 gap-6">
             {/* Performance Level */}
             <div className="col-span-12 lg:col-span-8 bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 text-lg mb-6">DCA Performance Levels</h3>
                <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={[
                            { name: 'Global Recovery', value: 92 },
                            { name: 'Apex Solutions', value: 85 },
                            { name: 'Rapid Collect', value: 65 },
                            { name: 'FedEx Internal', value: 98 },
                        ]}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E5E7EB" />
                            <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                            <YAxis axisLine={false} tickLine={false} tick={{fill: '#6B7280', fontSize: 12}} />
                            <Tooltip contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }} />
                            <Bar dataKey="value" fill="#7C3AED" radius={[4, 4, 0, 0]} barSize={40} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
             </div>

             {/* Interactive AI Chatbot */}
             <div className="col-span-12 lg:col-span-4 bg-white p-6 rounded-2xl shadow-sm border border-gray-200 flex flex-col h-[500px]">
                <div className="flex items-center space-x-2 mb-4 border-b border-gray-100 pb-4">
                    <div className="p-2 bg-purple-100 rounded-lg">
                        <MessageSquare size={20} className="text-purple-600" />
                    </div>
                    <h3 className="font-bold text-lg text-gray-900">AI Assistant</h3>
                </div>
                
                <div ref={chatContainerRef} className="flex-1 overflow-y-auto space-y-4 mb-4 p-2">
                    {messages.length === 0 && (
                         <div className="text-gray-400 italic text-center mt-20">
                            How can I help you analyze the data today?
                        </div>
                    )}
                    {messages.map((msg, i) => (
                        <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[80%] p-3 rounded-2xl text-sm ${
                                msg.role === 'user' 
                                ? 'bg-purple-600 text-white rounded-tr-none' 
                                : 'bg-gray-100 text-gray-800 rounded-tl-none border border-gray-200'
                            }`}>
                                {msg.text}
                            </div>
                        </div>
                    ))}
                    {isChatting && (
                        <div className="flex justify-start">
                             <div className="bg-gray-100 text-gray-500 text-xs p-3 rounded-2xl rounded-tl-none animate-pulse">
                                AI is typing...
                             </div>
                        </div>
                    )}
                </div>

                <form onSubmit={handleChat} className="relative">
                    <input 
                        type="text" 
                        placeholder="Ask Gemini..."
                        className="w-full pl-4 pr-10 py-3 bg-white border border-gray-300 rounded-xl text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500 shadow-sm"
                        value={chatQuery}
                        onChange={(e) => setChatQuery(e.target.value)}
                    />
                    <button type="submit" className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 text-purple-600 hover:bg-purple-50 rounded-lg transition-colors">
                        <Send size={18} />
                    </button>
                </form>
             </div>
        </div>
      </div>
    );
  }

  // --- DCA Interface ---
  return (
    <div className="space-y-6">
        <h1 className="text-2xl font-bold text-gray-900">DCA Dashboard</h1>
        
        {/* KPI Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <KPICard title="Total Assigned" value="340" icon={Briefcase} colorClass="bg-blue-600" />
            <KPICard title="Due Today" value="12" icon={Clock} colorClass="bg-orange-500" subText="5 Overdue" />
            <KPICard title="SLA Breaches" value="2" icon={ShieldAlert} colorClass="bg-red-600" subText="Critical" />
            <KPICard title="Recovery Rate" value="68%" icon={TrendingUp} colorClass="bg-green-600" />
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Status Breakdown */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">Case Status Breakdown</h3>
                <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Contacted</span>
                        <span className="font-bold text-gray-900">145</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Not Reachable</span>
                        <span className="font-bold text-gray-900">34</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                        <span className="text-sm font-medium text-gray-700">Promise to Pay</span>
                        <span className="font-bold text-gray-900">89</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-green-50 rounded-lg border border-green-100">
                        <span className="text-sm font-medium text-green-700">Paid</span>
                        <span className="font-bold text-green-900">72</span>
                    </div>
                </div>
            </div>
            
            {/* SLA Countdowns */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-200">
                <h3 className="font-bold text-gray-800 mb-4">SLA Countdown</h3>
                <div className="space-y-3">
                    {[1, 2, 3].map((i) => (
                        <div key={i} className="flex items-center justify-between p-3 border border-red-100 bg-red-50 rounded-lg">
                            <div>
                                <div className="text-sm font-bold text-red-900">Case #C-00{i}</div>
                                <div className="text-xs text-red-700">First Contact SLA</div>
                            </div>
                            <div className="text-xl font-mono font-bold text-red-600">
                                0{i}:15:00
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    </div>
  );
};