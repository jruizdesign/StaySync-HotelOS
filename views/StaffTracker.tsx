import React, { useState, useEffect, useMemo } from 'react';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { api } from '../lib/api';
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  orderBy,
  onSnapshot,
  serverTimestamp,
  updateDoc,
  doc
} from 'firebase/firestore';
import {
  User,
  Users,
  Play,
  Square,
  Coffee,
  CheckCircle2,
  AlertCircle,
  X,
  UserCheck,
  Search,
  Filter,
  Lock,
  Delete,
  ShieldCheck,
  Timer,
  UserPlus,
  RefreshCw,
  Mail,
  KeyRound
} from 'lucide-react';
import { TimeEntry } from '../types';

// Mock data fallback for Demo Mode
// MOCK DATA removed for production

interface StaffTrackerProps {
  user?: any;
  isDemoMode?: boolean;
  propertyId?: string;
  staffList?: any[]; // Users from SQL
}

const StaffTracker: React.FC<StaffTrackerProps> = ({ user, isDemoMode = true, propertyId, staffList }) => {
  const db = getFirestore();

  // 1. STATE: Real-time Active Shifts from Firestore
  const [activeShifts, setActiveShifts] = useState<Record<string, any>>({});
  const [recentLogs, setRecentLogs] = useState<TimeEntry[]>([]);

  // 2. STATE: UI Logic
  const [currentTime, setCurrentTime] = useState(new Date());
  const [searchQuery, setSearchQuery] = useState('');

  // PIN Pad State
  const [authStaff, setAuthStaff] = useState<{ id: string, name: string, action: string, currentStatus: string } | null>(null);
  const [pinBuffer, setPinBuffer] = useState('');
  const [isError, setIsError] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [inviteForm, setInviteForm] = useState({ name: '', email: '', role: 'STAFF', password: '' });
  const [isInviting, setIsInviting] = useState(false);

  const inviteMutation = useMutation({
    mutationFn: async (vars: any) => {
      // Use Node.js API
      const res = await api.users.create(vars);
      return res.user;
    },
    onSuccess: () => {
      // Invalidate dashboard query to refresh staff list
      const queryClient = useQueryClient();
      queryClient.invalidateQueries({ queryKey: ['dashboard', propertyId] });
      setShowInviteModal(false);
      setInviteForm({ name: '', email: '', role: 'STAFF', password: '' });
      alert("Staff member created successfully!");
    },
    onError: (err: any) => {
      console.error(err);
      alert(`Failed to create staff: ${err.message} `);
    }
  });

  const handleInviteSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isDemoMode) {
      alert("Cannot invite in Demo Mode.");
      return;
    }
    setIsInviting(true);
    try {
      await inviteMutation.mutateAsync({
        email: inviteForm.email,
        password: inviteForm.password,
        role: inviteForm.role,
        name: inviteForm.name,
        propertyId: propertyId,
      });
    } catch (e) {
      // handled in onError
    } finally {
      setIsInviting(false);
    }
  };

  // --- EFFECT: Listen to Firestore Time Clocks ---
  useEffect(() => {
    if (!propertyId) return;

    // A. Listen for currently ACTIVE shifts (endTime == null)
    const activeQ = query(
      collection(db, `properties/${propertyId}/time_clocks`),
      where("endTime", "==", null)
    );

    const unsubscribeActive = onSnapshot(activeQ, (snapshot) => {
      const shiftMap: Record<string, any> = {};
      snapshot.docs.forEach(doc => {
        const data = doc.data();
        shiftMap[data.userId] = {
          docId: doc.id,
          startTime: data.startTime?.toDate(),
          status: data.status // 'ACTIVE' or 'BREAK'
        };
      });
      setActiveShifts(shiftMap);
    });

    // B. Listen for HISTORY (Last 24 hours) for the Manager Table
    const historyQ = query(
      collection(db, `properties/${propertyId}/time_clocks`),
      orderBy("startTime", "desc")
      // Limit if needed
    );

    const unsubscribeHistory = onSnapshot(historyQ, (snapshot) => {
      const logs = snapshot.docs.map(doc => {
        const d = doc.data();
        const start = d.startTime?.toDate();
        const end = d.endTime?.toDate();

        // Calculate duration string
        let duration = "--";
        if (start && end) {
          const diff = end.getTime() - start.getTime();
          const hrs = Math.floor(diff / (1000 * 60 * 60));
          const mins = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
          duration = `${hrs}h ${mins}m`;
        }

        return {
          id: doc.id,
          userId: d.userId,
          userName: d.userName,
          date: start?.toLocaleDateString(),
          clockIn: start?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          clockOut: end?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          status: d.endTime ? 'Completed' : (d.status === 'ACTIVE' ? 'Active' : 'On-Break'),
          totalHours: duration,
        } as TimeEntry;
      });
      setRecentLogs(logs);
    });

    return () => {
      unsubscribeActive();
      unsubscribeHistory();
    };
  }, [propertyId, isDemoMode, db]);

  // --- MERGE LOGIC: SQL Users + Firestore Shifts ---
  const mergedStaffList = useMemo(() => {
    if (!staffList) return [];

    return staffList.map(u => {
      const activeShift = activeShifts[u.id]; // Check if they are in Firestore map
      let status = 'Out';
      if (activeShift) {
        status = activeShift.status === 'ACTIVE' ? 'Active' : 'On-Break';
      }

      return {
        id: u.id,
        name: u.name || u.email?.split('@')[0] || "Unknown",
        role: u.role,
        status: status,
        startTime: activeShift?.startTime?.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) || null,
        // In production, verify PIN via Cloud Function. For now, check client-side.
        pin: u.pin || '0000'
      };
    });
  }, [staffList, activeShifts, isDemoMode]);

  // Clock Update
  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  // --- ACTIONS ---

  const initiateAction = (staffId: string, name: string, action: string, currentStatus: string) => {
    setAuthStaff({ id: staffId, name, action, currentStatus });
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

  // Check PIN
  useEffect(() => {
    if (pinBuffer.length === 4 && authStaff) {
      const staff = mergedStaffList.find(s => s.id === authStaff.id);

      if (staff && staff.pin === pinBuffer) {
        performClockAction(authStaff.id, authStaff.name, authStaff.action, authStaff.currentStatus);
        setAuthStaff(null);
        setPinBuffer('');
      } else {
        setIsError(true);
        setPinBuffer('');
        setTimeout(() => setIsError(false), 500);
      }
    }
  }, [pinBuffer, authStaff, mergedStaffList]);

  // --- FIRESTORE WRITES ---
  const performClockAction = async (userId: string, userName: string, action: string, currentStatus: string) => {
    if (!propertyId) {
      console.log("No Property ID found");
      return;
    }

    try {
      // 1. CLOCK IN: from Out -> Active
      if (action === 'Active') {
        // Double check they aren't already active
        if (activeShifts[userId]) {
          // If they are on break, just set status back to active
          if (activeShifts[userId].status === 'BREAK') {
            const docId = activeShifts[userId].docId;
            await updateDoc(doc(db, `properties/${propertyId}/time_clocks`, docId), {
              status: 'ACTIVE'
            });
          }
        } else {
          // New Session
          await addDoc(collection(db, `properties/${propertyId}/time_clocks`), {
            userId,
            userName,
            startTime: serverTimestamp(),
            endTime: null,
            status: 'ACTIVE',
            device: 'kiosk'
          });
        }
      }

      // 2. BREAK: from Active -> Break
      else if (action === 'On-Break' && activeShifts[userId]) {
        const docId = activeShifts[userId].docId;
        await updateDoc(doc(db, `properties/${propertyId}/time_clocks`, docId), {
          status: 'BREAK'
        });
      }

      // 3. CLOCK OUT: from Active/Break -> Out
      else if (action === 'Out' && activeShifts[userId]) {
        const docId = activeShifts[userId].docId;
        await updateDoc(doc(db, `properties/${propertyId}/time_clocks`, docId), {
          endTime: serverTimestamp(),
          status: 'COMPLETED'
        });
      }

    } catch (e) {
      console.error("Clock action failed:", e);
      alert("System Error: Could not update time clock.");
    }
  };

  const filteredStaff = mergedStaffList.filter(s =>
    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.role.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeCount = mergedStaffList.filter(s => s.status === 'Active').length;
  const breakCount = mergedStaffList.filter(s => s.status === 'On-Break').length;

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Kiosk Header Board */}
      <div className="bg-slate-900 rounded-[3rem] p-8 md:p-12 text-white shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 blur-[120px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute bottom-0 left-0 w-64 h-64 bg-emerald-500/10 blur-[100px] rounded-full -ml-20 -mb-20"></div>

        <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-2 uppercase">Lumina Kiosk</h1>
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

        {!isDemoMode && (
          <button
            onClick={() => setShowInviteModal(true)}
            className="px-8 py-5 bg-slate-900 text-white rounded-[2rem] shadow-lg shadow-slate-900/20 font-bold text-sm hover:bg-slate-800 transition-all flex items-center justify-center gap-2"
          >
            <UserPlus size={18} />
            Create Staff
          </button>
        )}
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
                  {staff.name.split(' ').map((n: string) => n[0]).join('')}
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
                  onClick={() => initiateAction(staff.id, staff.name, 'Active', staff.status)}
                  className="col-span-3 flex items-center justify-center gap-3 py-5 bg-emerald-600 text-white rounded-2xl font-black text-sm hover:bg-emerald-700 shadow-lg shadow-emerald-100 transition-all active:scale-95"
                >
                  <Play size={18} fill="currentColor" />
                  START SHIFT
                </button>
              ) : (
                <>
                  <button
                    disabled={true}
                    className="flex flex-col items-center justify-center gap-2 py-4 bg-emerald-50 border-emerald-200 text-emerald-700 rounded-2xl font-bold text-[10px] border-2"
                  >
                    <UserCheck size={20} />
                    DUTY
                  </button>

                  <button
                    onClick={() => initiateAction(staff.id, staff.name, staff.status === 'On-Break' ? 'Active' : 'On-Break', staff.status)}
                    className={`flex flex-col items-center justify-center gap-2 py-4 rounded-2xl font-bold text-[10px] transition-all border-2 ${staff.status === 'On-Break'
                      ? 'bg-amber-50 border-amber-200 text-amber-700 hover:border-emerald-200 hover:text-emerald-700 hover:bg-emerald-50'
                      : 'bg-white border-slate-100 text-slate-400 hover:border-amber-200 hover:text-amber-600'
                      }`}
                  >
                    <Coffee size={20} />
                    {staff.status === 'On-Break' ? 'RESUME' : 'BREAK'}
                  </button>
                  <button
                    onClick={() => initiateAction(staff.id, staff.name, 'Out', staff.status)}
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
            <p className="text-xs text-slate-400 mt-2 max-w-xs">{isDemoMode ? "No staff found." : "Add users to your database to see them here."}</p>
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
                  Enter PIN to {authStaff.action === 'Out' ? 'Clock Out' : authStaff.action === 'Active' ? (authStaff.currentStatus === 'On-Break' ? 'Resume Shift' : 'Punch In') : 'Go on Break'}
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

      {/* History Table for Managers (Admin Audit) */}
      {(user?.role === 'SUPER_ADMIN' || user?.role === 'MANAGER' || user?.role === 'SYSTEM_ADMIN') && (
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
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {recentLogs.length > 0 ? recentLogs.map(entry => (
                  <tr key={entry.id} className="hover:bg-slate-50/50 transition-colors group">
                    <td className="px-10 py-6">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-black text-xs">
                          {entry.userName ? entry.userName[0] : '?'}
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
      {/* INVITE MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setShowInviteModal(false)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 animate-in zoom-in duration-300">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-black text-slate-800">Create Staff</h2>
              <button onClick={() => setShowInviteModal(false)}><X className="text-slate-400" /></button>
            </div>
            <form onSubmit={handleInviteSubmit} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold"
                  value={inviteForm.name}
                  onChange={e => setInviteForm({ ...inviteForm, name: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold"
                  value={inviteForm.email}
                  onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Initial Password</label>
                <div className="relative">
                  <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                  <input
                    required
                    type="password"
                    placeholder="••••••••"
                    minLength={6}
                    className="w-full pl-12 pr-4 py-4 bg-slate-50 rounded-xl font-bold"
                    value={inviteForm.password}
                    onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Role</label>
                <select
                  className="w-full p-4 bg-slate-50 rounded-xl font-bold"
                  value={inviteForm.role}
                  onChange={e => setInviteForm({ ...inviteForm, role: e.target.value })}
                >
                  <option value="STAFF">Staff</option>
                  <option value="MANAGER">Manager</option>
                  <option value="ADMIN">Admin</option>
                </select>
              </div>
              <button
                disabled={isInviting}
                type="submit"
                className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold mt-4 hover:bg-blue-700 transition-all flex justify-center items-center gap-2"
              >
                {isInviting ? <RefreshCw className="animate-spin" /> : <UserPlus size={18} />}
                {isInviting ? 'Creating...' : 'Create User'}
              </button>
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