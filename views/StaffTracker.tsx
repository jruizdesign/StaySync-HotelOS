import React, { useState, useEffect } from 'react';
import {
  Users,
  Clock,
  UserCheck,
  UserX,
  Search,
  Filter,
  MoreVertical,
  MapPin,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  AlertCircle,
  Coffee,
  ArrowRight
} from 'lucide-react';
import { User } from '../types';

interface StaffTrackerProps {
  user?: User; // Made optional to prevent crashes if parent doesn't pass it
  isDemoMode?: boolean;
}

// Mock Data for Demo Mode
const MOCK_STAFF = [
  { id: 's1', name: 'Maria Gonzalez', role: 'Housekeeping Lead', status: 'Active', location: 'Floor 3', checkIn: '08:00 AM', avatar: 'MG' },
  { id: 's2', name: 'James Wilson', role: 'Front Desk', status: 'Active', location: 'Lobby', checkIn: '07:45 AM', avatar: 'JW' },
  { id: 's3', name: 'Sarah Davis', role: 'Concierge', status: 'Break', location: 'Staff Room', checkIn: '09:00 AM', avatar: 'SD' },
  { id: 's4', name: 'Robert Chen', role: 'Maintenance', status: 'Off Duty', location: '-', checkIn: '-', avatar: 'RC' },
];

const StaffTracker: React.FC<StaffTrackerProps> = ({ isDemoMode = true }) => {
  const [activeTab, setActiveTab] = useState<'roster' | 'timesheets'>('roster');
  const [staffList, setStaffList] = useState(MOCK_STAFF);
  const [searchTerm, setSearchTerm] = useState('');

  // Stats Calculation
  const activeCount = staffList.filter(s => s.status === 'Active').length;
  const breakCount = staffList.filter(s => s.status === 'Break').length;
  const offCount = staffList.filter(s => s.status === 'Off Duty').length;

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Staff Tracker</h1>
          <p className="text-slate-500 text-sm">Real-time attendance monitoring and shift management.</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setActiveTab('roster')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'roster' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            Live Roster
          </button>
          <button
            onClick={() => setActiveTab('timesheets')}
            className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTab === 'timesheets' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:bg-slate-50'}`}
          >
            Time Sheets
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-slate-900 text-white p-6 rounded-2xl shadow-xl shadow-slate-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Active Duty</p>
              <h3 className="text-4xl font-black mt-2">{activeCount}</h3>
            </div>
            <div className="p-3 bg-white/10 rounded-xl">
              <UserCheck size={24} className="text-emerald-400" />
            </div>
          </div>
          <div className="mt-4 flex items-center gap-2 text-xs text-slate-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            Live Updates Enabled
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">On Break</p>
              <h3 className="text-4xl font-black text-slate-800 mt-2">{breakCount}</h3>
            </div>
            <div className="p-3 bg-amber-50 rounded-xl">
              <Coffee size={24} className="text-amber-500" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 font-medium">Scheduled returns within 15m</p>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-400 text-xs font-bold uppercase tracking-widest">Off Duty</p>
              <h3 className="text-4xl font-black text-slate-800 mt-2">{offCount}</h3>
            </div>
            <div className="p-3 bg-slate-50 rounded-xl">
              <UserX size={24} className="text-slate-400" />
            </div>
          </div>
          <p className="mt-4 text-xs text-slate-400 font-medium">Next shift starts at 02:00 PM</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
        {/* Toolbar */}
        <div className="p-4 border-b border-slate-50 flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input
              type="text"
              placeholder="Find staff member..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-100">
            <Filter size={16} /> Filter
          </button>
        </div>

        {/* Staff List */}
        <div className="divide-y divide-slate-50">
          {staffList
            .filter(s => s.name.toLowerCase().includes(searchTerm.toLowerCase()))
            .map((staff) => (
              <div key={staff.id} className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors group">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-lg font-black border-2 border-white shadow-sm ${staff.status === 'Active' ? 'bg-emerald-100 text-emerald-600' :
                      staff.status === 'Break' ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-400'
                    }`}>
                    {staff.avatar}
                    {staff.status === 'Active' && (
                      <span className="absolute bottom-1 right-1 w-3 h-3 bg-emerald-500 border-2 border-white rounded-full"></span>
                    )}
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-800">{staff.name}</h4>
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-2 mt-0.5">
                      {staff.role} • <span className="flex items-center gap-1"><MapPin size={10} /> {staff.location}</span>
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-8">
                  <div className="hidden md:block text-right">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Clock In</p>
                    <p className="text-sm font-bold text-slate-700 font-mono">{staff.checkIn}</p>
                  </div>

                  <div className={`px-3 py-1 rounded-lg text-xs font-bold uppercase tracking-wider ${staff.status === 'Active' ? 'bg-emerald-50 text-emerald-600' :
                      staff.status === 'Break' ? 'bg-amber-50 text-amber-600' : 'bg-slate-100 text-slate-500'
                    }`}>
                    {staff.status}
                  </div>

                  <button className="p-2 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                    <MoreVertical size={18} />
                  </button>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};

export default StaffTracker;