
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
  Receipt,
  Activity,
  CheckCircle2,
  Clock,
  UserCheck,
  Building2,
  MapPin
} from 'lucide-react';
import { Property, User, UserRole } from '../types';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { GoogleGenAI } from '@google/genai';

import { useQuery } from "@tanstack/react-query";
import { adminListAllProperties, getPropertyDashboard } from "@firebasegen/default";
import { dc } from '../lib/firebase';

// --- Types ---

interface DashboardProps {
  property: Property;
  isDemoMode: boolean;
  user: User;
}

// --- Components ---

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

// --- Admin View ---

function AdminView({ properties }: { properties: any[] | undefined }) {
  if (!properties) return <div className="p-8 text-center text-slate-500">No properties found.</div>;

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Global Admin Dashboard</h1>
          <p className="text-slate-500 text-sm">Overview of all properties in the system.</p>
        </div>
        <div className="px-3 py-1 bg-purple-100 text-purple-700 rounded-lg text-xs font-bold uppercase">Super Admin</div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {properties.map((prop) => (
          <div key={prop.id} className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition cursor-pointer">
            <div className="flex items-center gap-4 mb-4">
              <div className="p-3 bg-blue-50 text-blue-600 rounded-xl">
                <Building2 size={24} />
              </div>
              <div>
                <h3 className="font-bold text-lg text-slate-800">{prop.name}</h3>
                <p className="text-xs text-slate-500 flex items-center gap-1"><MapPin size={10} /> {prop.address || 'No address'}</p>
              </div>
            </div>
            <div className="flex items-center justify-between pt-4 border-t border-slate-50">
              <div className="text-center">
                <p className="text-[10px] text-slate-400 font-bold uppercase">Staff</p>
                <p className="text-lg font-bold text-slate-700">{prop.users?.length || 0}</p>
              </div>
              <button className="text-xs font-bold text-blue-600 hover:underline">Manage Property &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}


// --- Manager View (The Original Dashboard) ---

const REVENUE_DATA = [
  { name: 'Mon', revenue: 4200, occupancy: 65 },
  { name: 'Tue', revenue: 3800, occupancy: 58 },
  { name: 'Wed', revenue: 5100, occupancy: 72 },
  { name: 'Thu', revenue: 4800, occupancy: 68 },
  { name: 'Fri', revenue: 6200, occupancy: 85 },
  { name: 'Sat', revenue: 7500, occupancy: 92 },
  { name: 'Sun', revenue: 5800, occupancy: 80 },
];

// Mock Live Events for Feed
const MOCK_EVENTS = [
  { id: 1, type: 'maintenance', message: 'Maintenance Request: Room 304 (AC Leak)', time: 'Just now', user: 'Maria G.' },
  { id: 2, type: 'cleaning', message: 'Room 102 marked as Clean', time: '2 mins ago', user: 'Sarah W.' },
  { id: 3, type: 'checkin', message: 'Guest Check-in: R. Wilson (Room 302)', time: '15 mins ago', user: 'Front Desk' },
  { id: 4, type: 'system', message: 'Night Audit Completed Successfully', time: '4 hours ago', user: 'System' },
];

function ManagerView({ data, property, isDemoMode }: { data: any, property: Property, isDemoMode: boolean }) {
  const [insight, setInsight] = useState<string | null>(null);
  const [loadingInsight, setLoadingInsight] = useState(true);
  const [liveEvents, setLiveEvents] = useState(MOCK_EVENTS);

  // Simulate Firestore Real-time Updates (Keep demo logic for visual flare)
  useEffect(() => {
    if (!isDemoMode) return;

    const interval = setInterval(() => {
      const newEvent = {
        id: Math.random(),
        type: Math.random() > 0.5 ? 'cleaning' : 'maintenance',
        message: Math.random() > 0.5 ? `Room ${Math.floor(Math.random() * 300) + 100} inspection complete` : `Minibar restock: Room ${Math.floor(Math.random() * 300) + 100}`,
        time: 'Just now',
        user: 'Staff Mobile'
      };
      setLiveEvents(prev => [newEvent, ...prev].slice(0, 5));
    }, 8000);

    return () => clearInterval(interval);
  }, [isDemoMode]);

  // AI Insight Logic
  useEffect(() => {
    if (!isDemoMode) {
      setInsight("System is in Production Mode. Awaiting live operational data to generate insights.");
      setLoadingInsight(false);
      return;
    }

    const fetchInsight = async () => {
      setLoadingInsight(true);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || 'demo-key' });
        // Mock context data
        const contextData = {
          arrears: [
            { guest: "Marcus Thorne", amount: "$1,250", status: "Overdue 5 days", reason: "Property Damage Fee" },
            { guest: "Sarah Marshall", amount: "$450", status: "Pending", reason: "Unsettled Minibar & Incidental" }
          ],
          maintenance: [
            { room: "104", issue: "Bathroom Leak", priority: "URGENT" },
            { room: "203", issue: "AC Compressor Noise", priority: "MEDIUM" }
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

        // Just simulate response in demo mode if no key (or error) to prevent crash
        // const response = await ai.models.generateContent({ ... });

        // Simulating delay for effect
        setTimeout(() => {
          setInsight("Summary: Critical attention needed on Room 104's active leak preventing occupancy, alongside monitoring Marcus Thorne's overdue balance. Action: Dispatch maintenance team to Room 104 immediately to mitigate water damage.");
          setLoadingInsight(false);
        }, 1500);

      } catch (error) {
        console.error("Insight Error:", error);
        setInsight("Unable to generate AI brief.");
      } finally {
        // setLoadingInsight(false);
      }
    };

    fetchInsight();
  }, [property, isDemoMode]);


  // Derived Data from Data Connect (if available)
  const bookingsCount = data?.bookings?.length || 0;
  const roomsCount = data?.rooms?.length || 0;
  // Calculate simple occupancy from data if available
  const occupiedRooms = data?.rooms?.filter((r: any) => r.status === 'Occupied').length || 0;
  const occupancyRate = roomsCount > 0 ? ((occupiedRooms / roomsCount) * 100).toFixed(1) : (isDemoMode ? "78.2" : "0");


  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Operational Dashboard</h1>
          <p className="text-slate-500 text-sm">Managing risks, maintenance, and revenue for {data?.property?.name || property.name}.</p>
        </div>
        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-400">
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500"></span>
          </span>
          Firestore Sync: <span className="text-emerald-500">Connected</span>
        </div>
      </div>

      {/* AI Strategic Brief */}
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
              <h2 className="text-lg font-bold tracking-tight">StaySync Operational Intel</h2>
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
                  "{insight && insight.includes('Action:') ? insight.split('Action:')[0].replace('Summary:', '').trim() : insight}"
                </p>
              </div>
              {(isDemoMode || insight) && (
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
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Daily Revenue"
          value={isDemoMode ? "$12,450.00" : "$0.00"}
          icon={DollarSign}
          trend={isDemoMode ? 12.5 : 0}
          color="bg-blue-600"
          subValue="Revenue Today"
        />
        <StatCard
          title="Occupancy"
          value={`${occupancyRate}%`}
          icon={DoorOpen}
          trend={isDemoMode ? -4.2 : 0}
          color="bg-emerald-600"
          subValue={`${occupiedRooms} / ${roomsCount} Rooms`}
        />
        <StatCard
          title="Total Bookings"
          value={bookingsCount.toString()}
          icon={Receipt}
          trend={isDemoMode ? 15.4 : 0}
          color="bg-rose-600"
          subValue="Confirmed Reservations"
        />
        <StatCard
          title="Maintenance Tasks"
          value={isDemoMode ? "5 Active" : "0 Active"}
          icon={Wrench}
          color="bg-amber-600"
          subValue="Open Work Orders"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Live Operations Feed */}
        <div className="lg:col-span-1 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-slate-50 flex justify-between items-center">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Activity size={16} className="text-blue-500" /> Live Operations
            </h3>
            <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
          </div>
          <div className="p-2 max-h-[400px] overflow-y-auto">
            {liveEvents.map((event) => (
              <div key={event.id} className="p-4 hover:bg-slate-50 rounded-xl transition-colors flex items-start gap-3 animate-in slide-in-from-left-2 duration-300">
                <div className={`p-2 rounded-full shrink-0 ${event.type === 'maintenance' ? 'bg-amber-100 text-amber-600' :
                  event.type === 'cleaning' ? 'bg-emerald-100 text-emerald-600' :
                    event.type === 'checkin' ? 'bg-blue-100 text-blue-600' : 'bg-slate-100 text-slate-500'
                  }`}>
                  {event.type === 'maintenance' ? <Wrench size={14} /> :
                    event.type === 'cleaning' ? <Sparkles size={14} /> :
                      event.type === 'checkin' ? <UserCheck size={14} /> : <CheckCircle2 size={14} />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-700 leading-tight">{event.message}</p>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-[10px] text-slate-400 font-medium">{event.user}</span>
                    <span className="text-[10px] text-slate-300">•</span>
                    <span className="text-[10px] text-slate-400 font-medium">{event.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Pending Maintenance */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Urgent Repairs</h3>
            <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-1 rounded font-bold">3 Urgent</span>
          </div>
          <div className="space-y-4">
            {isDemoMode ? [
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
                <span className={`text-[10px] font-black uppercase px-2 py-0.5 rounded ${item.level === 'Urgent' ? 'bg-rose-100 text-rose-600' : 'bg-slate-200 text-slate-500'
                  }`}>
                  {item.level}
                </span>
              </div>
            )) : (
              <div className="py-8 text-center text-slate-400 text-xs italic">No active maintenance tickets.</div>
            )}
            <button className="w-full py-3 text-[10px] font-bold text-slate-400 uppercase tracking-widest hover:text-blue-600 transition-colors">Manage All Work Orders</button>
          </div>
        </div>

        {/* Small Performance Chart */}
        <div className="lg:col-span-1 bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <h3 className="text-sm font-bold text-slate-800 uppercase tracking-wider mb-6">Revenue Pulse</h3>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={isDemoMode ? REVENUE_DATA : REVENUE_DATA.map(d => ({ ...d, revenue: 0 }))}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1} />
                    <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
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
}

const Dashboard: React.FC<DashboardProps> = ({ property, isDemoMode, user }) => {

  // Logic Fix: 
  // We prioritize the ID passed in via props (which comes from the URL in PropertyDashboard wrapper).
  // This allows Super Admins to view ANY dashboard they navigated to.
  // Managers are restricted by the 'propertyId' check done in the parent or routing logic.

  // If this is a Super Admin, they have access to everything.
  // If this is a Manager, their user.propertyId SHOULD match the property.id.

  const propertyIdToFetch = property?.id;

  // Safety check: specific property ID required
  if (!propertyIdToFetch && !isDemoMode) {
    return <div>Error: No Property Context</div>;
  }

  const { data, isLoading, error } = useQuery({
    queryKey: ['dashboard', propertyIdToFetch],
    queryFn: async () => {
      // The generated SDK function takes the variables directly.
      // It already knows which "dc" instance to use from your initialization in @stay-sync/hotel-os
      const result = await getPropertyDashboard({
        propertyId: propertyIdToFetch
      });
      return result.data; // Usually the actual data is inside .data
    },
    enabled: !!propertyIdToFetch && !isDemoMode
  });

  if (isLoading && !isDemoMode) return <div className="h-full flex items-center justify-center text-slate-400 text-sm">Loading dashboard...</div>;

  if (error && !isDemoMode) {
    console.error("Dashboard Query Error:", error);
    return <div className="h-full flex items-center justify-center text-rose-500 text-sm">Error loading data. Check console.</div>;
  }

  return <ManagerView data={data} property={property} isDemoMode={isDemoMode} />;
};

export default Dashboard;
