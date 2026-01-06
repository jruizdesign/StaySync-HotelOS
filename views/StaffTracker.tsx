
import React, { useState, useEffect, useMemo } from 'react';
import {
  User,
  Users,
  Clock,
  Play,
  Square,
  Coffee,
  Edit2,
  Calendar,
  CheckCircle2,
  AlertCircle,
  MoreVertical,
  ChevronRight,
  X,
  UserCheck,
  Timer,
  LayoutGrid,
  Search,
  Filter,
  Lock,
  Delete,
  ShieldCheck
} from 'lucide-react';
import { UserRole, TimeEntry } from '../types';

const MOCK_STAFF_MEMBERS = [
  { id: 'u-1', name: 'Sarah Wilson', role: 'Front Desk', status: 'Active', startTime: '09:00 AM', pin: '1234' },
  { id: 'u-2', name: 'Mike Johnson', role: 'Housekeeping', status: 'On-Break', startTime: '08:45 AM', pin: '0000' },
  { id: 'u-3', name: 'Elena Rodriguez', role: 'Night Audit', status: 'Active', startTime: '10:00 AM', pin: '1111' },
  { id: 'u-4', name: 'David Smith', role: 'Maintenance', status: 'Out', startTime: null, pin: '2222' },
  { id: 'u-5', name: 'Jessica Chen', role: 'Concierge', status: 'Out', startTime: null, pin: '3333' },
  { id: 'u-6', name: 'Robert Vance', role: 'Security', status: 'Active', startTime: '07:00 AM', pin: '4444' },
];

const MOCK_TIME_ENTRIES: TimeEntry[] = [
  { id: 'te1', userId: 'u-1', userName: 'Sarah Wilson', date: '2023-10-27', clockIn: '09:00 AM', clockOut: '05:30 PM', breakStart: '12:30 PM', breakEnd: '01:15 PM', totalHours: '7h 45m', status: 'Completed' },
];

interface StaffTrackerProps {
  user: any;
  isDemoMode: boolean;
}

const StaffTracker: React.FC<StaffTrackerProps> = ({ user, isDemoMode }) => {
  const [staffList, setStaffList] = useState(isDemoMode ? MOCK_STAFF_MEMBERS : []);
  const [entries, setEntries] = useState<TimeEntry[]>(isDemoMode ? MOCK_TIME_ENTRIES : []);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [editingEntry, setEditingEntry] = useState<TimeEntry | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  // PIN Pad State
  const [authStaff, setAuthStaff] = useState<{ id: string, name: string, action: string } | null>(null);
  const [pinBuffer, setPinBuffer] = useState('');
  const [isError, setIsError] = useState(false);

  const isManager = user.role === UserRole.PROPERTY_MANAGER || user.role === UserRole.SYSTEM_ADMIN;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const initiateAction = (staffId: string, name: string, action: string) => {
    setAuthStaff({ id: staffId, name, action });
    setPinBuffer('');
    setIsError(false);
  };

  const handlePinPress = (num: string) => {
    if (pinBuffer.length < 4) {
      setPinBuffer(prev => prev + num);
      setIsError(false);
    }
  };

  const handlePinDelete = () => {
    setPinBuffer(prev => prev.slice(0, -1));
    setIsError(false);
  };

  useEffect(() => {
    if (pinBuffer.length === 4 && authStaff) {
      const staff = staffList.find(s => s.id === authStaff.id);
      if (staff && staff.pin === pinBuffer) {
        completeStatusChange(authStaff.id, authStaff.action);
        setAuthStaff(null);
        setPinBuffer('');
      } else {
        setIsError(true);
        setPinBuffer('');
        setTimeout(() => setIsError(false), 500);
      }
    }
  }, [pinBuffer, authStaff]);

  const completeStatusChange = (staffId: string, newStatus: string) => {
    setStaffList(prev => prev.map(s => {
      if (s.id === staffId) {
        return {
          ...s,
          status: newStatus,
          startTime: newStatus === 'Active' ? new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : s.startTime
        };
      }
      return s;
    }));
  };

  const filteredStaff = staffList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = staffList.filter(s => s.status === 'Active').length;
  const breakCount = staffList.filter(s => s.status === 'On-Break').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Kiosk Header Board */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase">StaySync Kiosk</h1>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs">Property Staff Verification Engine</p>

            <div className="flex flex-wrap justify-center md:justify-start gap-4 mt-8">
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Active Duty</p>
                  <p className="text-xl font-black">{activeCount}</p>
                </div>
              </div>
              <div className="bg-white/5 backdrop-blur-md border border-white/10 px-6 py-3 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-amber-500"></div>
                <div>
                  <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest">On Break</p>
                  <p className="text-xl font-black">{breakCount}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="text-center md:text-right">
            <div className="text-6xl md:text-8xl font-black tabular-nums tracking-tighter drop-shadow-2xl">
              {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false })}
              <span className="text-2xl md:text-3xl text-slate-500 ml-2">:{currentTime.getSeconds().toString().padStart(2, '0')}</span>
            </div>
            <p className="text-slate-400 font-bold text-sm uppercase tracking-widest mt-2 flex items-center justify-center md:justify-end gap-2">
              <Lock size={14} className="text-blue-400" />
              Secure Terminal Verified
            </p>
          </div>
        </div>
      </div>

      {/* Kiosk Controls */}
      <div className="flex flex-col md:flex-row items-center gap-4">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            placeholder="Search team members..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-16 pr-6 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-lg font-medium focus:ring-4 focus:ring-blue-500/10 outline-none transition-all"
          />
        </div>
        <button className="px-8 py-5 bg-white border border-slate-100 rounded-[2rem] shadow-sm text-slate-600 font-bold text-sm hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
          <Filter size={18} />
          Filter Duty
        </button>
      </div>

      {/* Staff Kiosk Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStaff.length > 0 ? filteredStaff.map(staff => (
          <div
            key={staff.id}
            className={`group bg-white rounded-[3rem] p-8 border transition-all duration-300 relative overflow-hidden ${staff.status === 'Active' ? 'border-emerald-100 shadow-xl shadow-emerald-500/5' :
                staff.status === 'On-Break' ? 'border-amber-100 shadow-xl shadow-amber-500/5' :
                  'border-slate-100 opacity-70 hover:opacity-100 shadow-sm'
              }`}
          >
            <div className="flex items-center gap-6 mb-8">
              <div className="relative">
                <div className={`w-20 h-20 rounded-3xl flex items-center justify-center text-2xl font-black transition-colors ${staff.status === 'Active' ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' :
                    staff.status === 'On-Break' ? 'bg-amber-500 text-white shadow-lg shadow-amber-500/20' :
                      'bg-slate-100 text-slate-400'
                  }`}>
                  {staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                {staff.status !== 'Out' && (
                  <div className={`absolute -bottom-1 -right-1 w-6 h-6 rounded-full border-4 border-white ${staff.status === 'Active' ? 'bg-emerald-500' : 'bg-amber-500'
                    }`}></div>
                )}
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-800">{staff.name}</h3>
                <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">{staff.role}</p>
                {staff.status !== 'Out' && (
                  <div className="flex items-center gap-1.5 mt-2">
                    <Timer size={14} className="text-slate-400" />
                    <span className="text-xs font-bold text-slate-500">Session: {staff.startTime}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {staff.status === 'Out' ? (
                <button
                  onClick={() => initiateAction(staff.id, staff.name, 'Active')}
                  className="col-span-3 flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  <Play size={18} fill="currentColor" />
                  START SHIFT
                </button>
              ) : (
                <>
                  <button
                    onClick={() => initiateAction(staff.id, staff.name, 'Active')}
                    disabled={staff.status === 'Active'}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[10px] transition-all border-2 ${staff.status === 'Active'
                        ? 'bg-emerald-50 border-emerald-200 text-emerald-700'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-emerald-200 hover:text-emerald-600'
                      }`}
                  >
                    <UserCheck size={20} />
                    DUTY
                  </button>
                  <button
                    onClick={() => initiateAction(staff.id, staff.name, 'On-Break')}
                    disabled={staff.status === 'On-Break'}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[10px] transition-all border-2 ${staff.status === 'On-Break'
                        ? 'bg-amber-50 border-amber-200 text-amber-700'
                        : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                      }`}
                  >
                    <Coffee size={20} />
                    BREAK
                  </button>
                  <button
                    onClick={() => initiateAction(staff.id, staff.name, 'Out')}
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-rose-50 text-rose-600 rounded-2xl font-bold text-[10px] border-2 border-rose-100 hover:bg-rose-100 transition-all active:scale-95"
                  >
                    <Square size={20} fill="currentColor" />
                    CLOCK OUT
                  </button>
                </>
              )}
            </div>
          </div>
        )) : (
          <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
            <Users size={48} className="text-slate-300 mb-4" />
            <h3 className="text-lg font-bold text-slate-400">No Staff Records</h3>
            <p className="text-xs text-slate-400 mt-2 max-w-xs">{isDemoMode ? "No staff match your search." : "Production mode is active. Add staff members to the roster to begin tracking."}</p>
          </div>
        )}
      </div>

      {/* PIN AUTH OVERLAY */}
      {authStaff && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-xl" onClick={() => setAuthStaff(null)}></div>
          <div className="relative w-full max-w-md bg-white rounded-[4rem] shadow-2xl overflow-hidden animate-in zoom-in duration-300">
            <div className="p-10 text-center space-y-6">
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 bg-blue-50 text-blue-600 rounded-[2rem] flex items-center justify-center text-3xl font-black mb-4 shadow-xl shadow-blue-500/10">
                  {authStaff.name[0]}
                </div>
                <h2 className="text-2xl font-black text-slate-900">{authStaff.name}</h2>
                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mt-1">
                  Enter PIN to {authStaff.action === 'Out' ? 'Clock Out' : authStaff.action === 'On-Break' ? 'Go on Break' : 'Punch In'}
                </p>
              </div>

              {/* PIN Dots */}
              <div className={`flex justify-center gap-4 py-4 ${isError ? 'animate-shake' : ''}`}>
                {[0, 1, 2, 3].map(i => (
                  <div key={i} className={`w-4 h-4 rounded-full transition-all duration-200 border-2 ${i < pinBuffer.length ? 'bg-blue-600 border-blue-600 scale-125' : 'bg-transparent border-slate-200'
                    }`}></div>
                ))}
              </div>

              {isError && (
                <p className="text-xs font-black text-rose-500 uppercase tracking-widest">Access Denied: Invalid PIN</p>
              )}

              {/* Numeric Keypad */}
              <div className="grid grid-cols-3 gap-3">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', 'C', '0', 'DEL'].map((val) => (
                  <button
                    key={val}
                    onClick={() => {
                      if (val === 'C') setPinBuffer('');
                      else if (val === 'DEL') handlePinDelete();
                      else handlePinPress(val);
                    }}
                    className={`h-20 rounded-[2rem] text-2xl font-black transition-all active:scale-90 ${val === 'C' ? 'bg-slate-100 text-slate-400 text-lg' :
                        val === 'DEL' ? 'bg-slate-100 text-slate-400' :
                          'bg-white border-2 border-slate-100 text-slate-800 hover:bg-slate-50 hover:border-blue-200 active:bg-blue-600 active:text-white active:border-blue-600'
                      }`}
                  >
                    {val === 'DEL' ? <Delete className="mx-auto" /> : val}
                  </button>
                ))}
              </div>

              <button
                onClick={() => setAuthStaff(null)}
                className="w-full py-4 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
              >
                Cancel Transaction
              </button>
            </div>
          </div>
        </div>
      )}

      {/* History Section for Managers */}
      {isManager && (
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden mt-12">
          <div className="px-10 py-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <div>
              <h3 className="font-bold text-slate-800 text-xl flex items-center gap-3">
                <ShieldCheck size={24} className="text-blue-500" />
                Administrative Timesheet Audit
              </h3>
              <p className="text-sm text-slate-400 font-medium">Full visibility into verified shift history and audit logs.</p>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-slate-50/50 text-slate-400 uppercase font-black text-[10px] tracking-widest border-b border-slate-50">
                <tr>
                  <th className="px-10 py-6">Staff Member</th>
                  <th className="px-10 py-6">Shift Period</th>
                  <th className="px-10 py-6">Status</th>
                  <th className="px-10 py-6">Hours</th>
                  <th className="px-10 py-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {entries.length > 0 ? entries.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                          {entry.userName[0]}
                        </div>
                        <div>
                          <p className="font-bold text-slate-800">{entry.userName}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase">{entry.date}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-10 py-6 font-semibold text-slate-600">
                      {entry.clockIn} — {entry.clockOut || 'Current'}
                    </td>
                    <td className="px-10 py-6">
                      <span className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-black uppercase">
                        {entry.status}
                      </span>
                    </td>
                    <td className="px-10 py-6 font-black text-slate-800">
                      {entry.totalHours}
                    </td>
                    <td className="px-10 py-6 text-right">
                      <button
                        onClick={() => setEditingEntry(entry)}
                        className="p-3 text-slate-300 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all opacity-0 group-hover:opacity-100"
                      >
                        <Edit2 size={18} />
                      </button>
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan={5} className="px-10 py-12 text-center text-slate-400">
                      {isDemoMode ? "No entries found." : "No entries recorded. Ledger is clean."}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Edit Modal (Retained for Administrative Control) */}
      {editingEntry && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center p-6">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setEditingEntry(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-[3rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-300">
            <div className="p-10 border-b border-slate-50 flex justify-between items-center bg-slate-50/50">
              <div>
                <h2 className="text-2xl font-bold text-slate-800">Manual Entry Adjustment</h2>
                <p className="text-xs text-slate-500 font-medium">Logged for {editingEntry.userName}</p>
              </div>
              <button onClick={() => setEditingEntry(null)} className="p-2 text-slate-400 hover:text-slate-600">
                <X size={28} />
              </button>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); setEditingEntry(null); }} className="p-10 space-y-8">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">In Time</label>
                  <input type="text" defaultValue={editingEntry.clockIn} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Out Time</label>
                  <input type="text" defaultValue={editingEntry.clockOut || ''} className="w-full px-6 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none font-bold text-sm" />
                </div>
              </div>
              <div className="p-5 bg-amber-50 rounded-[2rem] border border-amber-100 flex gap-4">
                <AlertCircle className="text-amber-600 shrink-0" size={24} />
                <p className="text-xs font-medium text-amber-800 leading-relaxed">
                  Adjustments will be flagged in the next payroll report. Ensure management approval is documented.
                </p>
              </div>
              <div className="flex gap-4">
                <button type="button" onClick={() => setEditingEntry(null)} className="flex-1 py-5 text-slate-400 font-bold text-xs uppercase tracking-widest hover:bg-slate-50 rounded-2xl">Discard</button>
                <button type="submit" className="flex-1 py-5 bg-slate-900 text-white font-bold text-xs uppercase tracking-widest rounded-2xl shadow-xl shadow-slate-200">Commit Edit</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          25% { transform: translateX(-8px); }
          75% { transform: translateX(8px); }
        }
        .animate-shake {
          animation: shake 0.2s ease-in-out infinite;
        }
      `}</style>
    </div>
  );
};

export default StaffTracker;
