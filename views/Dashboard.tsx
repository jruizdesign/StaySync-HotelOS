
import React, { useState, useEffect } from 'react';
import { 
  Users, 
  DoorOpen, 
  TrendingUp, 
  DollarSign,
  ArrowUpRight,
  ArrowDownRight,
  Sparkles,
  Loader2,
  AlertCircle,
  Wrench,
  AlertTriangle,
  Receipt
} from 'lucide-react';
import { Property, RoomStatus } from '../types';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { GoogleGenAI } from '@google/genai';

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4200, occupancy: 65 },
  { name: 'Tue', revenue: 3800, occupancy: 58 },
  { name: 'Wed', revenue: 5100, occupancy: 72 },
  { name: 'Thu', revenue: 4800, occupancy: 68 },
  { name: 'Fri', revenue: 6200, occupancy: 85 },
  { name: 'Sat', revenue: 7500, occupancy: 92 },
  { name: 'Sun', revenue: 5800, occupancy: 80 },
];

const StatCard = ({ title, value, icon: Icon, trend, color, subValue }: any) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
    <div className="flex items-start justify-between">
      <div className={`p-3 rounded-xl ${color} bg-opacity-10`}>
        <Icon className={color.replace('bg-', 'text-')} size={24} />
      </div>
      {trend !== undefined && (
        <div className={`flex items-center gap-1 text-sm font-bold ${trend > 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
          {trend > 0 ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          {Math.abs(trend)}%
        </div>
      )}
    </div>
    <div className="mt-4">
      <h3 className="text-slate-500 text-sm font-medium">{title}</h3>
      <p className="text-2xl font-bold text-slate-800 mt-1">{value}</p>
      {subValue && <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">{subValue}</p>}
    </div>
  </div>
);

const Dashboard: React.FC<{ property: Property }> = ({ property }) => {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);

  useEffect(() => {
    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        // Context-specific data for the AI focused on Money Owed and Maintenance
        const contextData = {
          arrears: [
            { guest: "Marcus Thorne", amount: "$1,250", status: "Overdue 5 days", reason: "Property Damage Fee" },
            { guest: "Sarah Marshall", amount: "$450", status: "Pending", reason: "Unsettled Minibar & Incidental" }
          ],
          maintenance: [
            { room: "104", issue: "Bathroom Leak", priority: "URGENT" },
            { room: "203", issue: "AC Compressor Noise", priority: "MEDIUM" },
            { room: "Suite 412", issue: "Smart Lock Battery Low", priority: "LOW" }
          ]
        };

        const prompt = `Perform a high-priority operational analysis for ${property.name}.
        Focus EXCLUSIVELY on these two categories:
        1. DEBT/ARREARS (Who owes money): ${JSON.stringify(contextData.arrears)}
        2. MAINTENANCE (What needs repair): ${JSON.stringify(contextData.maintenance)}

        Provide a 2-sentence executive strategic summary highlighting the biggest financial or physical risk. 
        Then, provide one single 'Priority Action' for the manager to execute immediately.
        
        Format your response exactly like this:
        Summary: [analysis text]
        Action: [immediate task]`;

        const response = await ai.models.generateContent({
          model: 'gemini-3-pro-preview',
          contents: [{ parts: [{ text: prompt }] }],
        });

        setInsight(response.text || "Operational health is stable. No critical arrears or maintenance alerts found.");
      } catch (error) {
        console.error("Insight Error:", error);
        setInsight("Unable to generate AI brief. Please check manual Arrears and Maintenance logs below.");
      } finally {
        setLoadingInsight(false);
      }
    };

    fetchInsight();
  }, [property]);

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Dashboard</h1>
          <p className="text-slate-500 text-sm">Managing risks, maintenance, and revenue for {property.name}.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          Sync Status: <span className="text-emerald-500">Live</span>
        </div>
      </div>

      {/* AI Strategic Brief - Refocused on Arrears & Maintenance */}
      <div className="relative overflow-hidden bg-slate-900 rounded-[2rem] p-8 text-white shadow-xl shadow-slate-200">
        <div className="absolute top-0 right-0 p-12 opacity-5">
          <AlertTriangle size={140} />
        </div>
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <Sparkles size={20} className="text-white" />
            </div>
            <div>
              <h2 className="text-lg font-bold tracking-tight">Lumina Operational Intel</h2>
              <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest">Arrears & Maintenance Analysis</p>
            </div>
          </div>
          
          {loadingInsight ? (
            <div className="flex items-center gap-3 py-4">
              <Loader2 size={24} className="animate-spin text-blue-400" />
              <p className="text-slate-400 font-medium text-sm">Scanning financial ledgers and room work orders...</p>
            </div>
          ) : (
            <div className="space-y-6">
              <div className="max-w-4xl">
                <p className="text-slate-300 font-medium leading-relaxed text-lg italic">
                  "{insight?.split('Action:')[0].replace('Summary:', '').trim()}"
                </p>
              </div>
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                <div className="flex items-center gap-3 px-5 py-3 bg-blue-600 rounded-2xl shadow-lg shadow-blue-900/40">
                  <AlertCircle size={18} className="text-white shrink-0" />
                  <div>
                    <p className="text-[10px] font-black text-blue-100 uppercase tracking-widest">Manager Action Item</p>
                    <p className="text-sm font-bold text-white">{insight?.split('Action:')[1]?.trim() || "Review open maintenance tickets."}</p>
                  </div>
                </div>
                <div className="text-[10px] text-slate-500 font-bold uppercase tracking-widest px-4 border-l border-slate-800">
                  Powered by Gemini 3 Pro
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Stats Realignment - Focusing on Risk */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard 
          title="Daily Revenue" 
          value="$12,450.00" 
          icon={DollarSign} 
          trend={12.5} 
          color="bg-blue-600" 
          subValue="Revenue Today"
        />
        <StatCard 
          title="Occupancy" 
          value="78.2%" 
          icon={DoorOpen} 
          trend={-4.2} 
          color="bg-emerald-600" 
          subValue="Room Utilization"
        />
        <StatCard 
          title="Outstanding Arrears" 
          value="$1,700.00" 
          icon={Receipt} 
          trend={15.4} 
          color="bg-rose-600" 
          subValue="Unpaid Guest Balances"
        />
        <StatCard 
          title="Maintenance Tasks" 
          value="5 Active" 
          icon={Wrench} 
          color="bg-amber-600" 
          subValue="Open Work Orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Arrears List */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Unpaid Balances</h3>
            <span className="text-[10px] bg-rose-50 text-rose-600 px-2 py-1 rounded font-bold">Risk Alert</span>
          </div>
          <div className="space-y-4">
            {[
              { name: 'Marcus Thorne', amount: '$1,250', days: '5d', reason: 'Damage' },
              { name: 'Sarah Marshall', amount: '$450', days: '1d', reason: 'Incidentals' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div>
                  <p className="text-sm font-bold text-slate-800">{item.name}</p>
                  <p className="text-[10px] text-slate-400 font-bold">{item.reason}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm font-black text-rose-600">{item.amount}</p>
                  <p className="text-[10px] text-slate-400 font-bold">Late: {item.days}</p>
                </div>
              </div>
            ))}
            <button className="w-full py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">View All Accounts Receivable</button>
          </div>
        </div>

        {/* Pending Maintenance */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Urgent Repairs</h3>
            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded font-bold">3 Urgent</span>
          </div>
          <div className="space-y-4">
            {[
              { room: '104', task: 'Bathroom Leak', level: 'Urgent' },
              { room: '203', task: 'AC Unit Check', level: 'High' },
              { room: '412', task: 'Door Lock', level: 'Low' }
            ].map((item, i) => (
              <div key={i} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-lg bg-white border border-slate-100 flex items-center justify-center font-bold text-slate-700 text-xs">
                    {item.room}
                  </div>
                  <p className="text-sm font-bold text-slate-800">{item.task}</p>
                </div>
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${
                  item.level === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'
                }`}>
                  {item.level}
                </span>
              </div>
            ))}
            <button className="w-full py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Manage All Work Orders</button>
          </div>
        </div>

        {/* Small Performance Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Revenue Pulse</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis dataKey="name" hide />
                <YAxis hide />
                <Tooltip 
                  contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  itemStyle={{ fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#2563eb" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex justify-between items-center text-[10px] font-black uppercase text-slate-400 tracking-widest">
            <span>Peak: Saturday</span>
            <span className="text-emerald-500">+12% vs LW</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
