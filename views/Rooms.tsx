
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  User as UserIcon, 
  Wrench, 
  AlertCircle, 
  Sparkles,
  Filter,
  Search,
  LayoutGrid,
  List,
  X,
  Hash,
  ArrowUp,
  BedDouble,
  ToggleLeft,
  ToggleRight,
  History,
  ClipboardList,
  Package,
  Calendar,
  Clock,
  AlertTriangle,
  Send
} from 'lucide-react';
import { Room, RoomStatus, User, UserRole } from '../types';

const INITIAL_ROOMS: Room[] = [
  { id: '101', number: '101', type: 'Single', floor: 1, status: RoomStatus.AVAILABLE },
  { id: '102', number: '102', type: 'Double', floor: 1, status: RoomStatus.OCCUPIED, guestName: 'John Doe', checkoutDate: '2023-11-01' },
  { id: '103', number: '103', type: 'Suite', floor: 1, status: RoomStatus.DIRTY },
  { id: '104', number: '104', type: 'Double', floor: 1, status: RoomStatus.MAINTENANCE },
  { id: '201', number: '201', type: 'Suite', floor: 2, status: RoomStatus.OCCUPIED, guestName: 'Jane Smith', checkoutDate: '2023-10-29' },
  { id: '202', number: '202', type: 'Double', floor: 2, status: RoomStatus.AVAILABLE },
  { id: '203', number: '203', type: 'Double', floor: 2, status: RoomStatus.DIRTY },
  { id: '204', number: '204', type: 'Double', floor: 2, status: RoomStatus.AVAILABLE },
  { id: '301', number: '301', type: 'Penthouse', floor: 3, status: RoomStatus.AVAILABLE },
  { id: '302', number: '302', type: 'Penthouse', floor: 3, status: RoomStatus.OCCUPIED, guestName: 'Robert Brown', checkoutDate: '2023-10-31' },
];

interface RoomsProps {
  isDemoMode: boolean;
  user: User;
}

const Rooms: React.FC<RoomsProps> = ({ isDemoMode, user }) => {
  const [rooms, setRooms] = useState<Room[]>(isDemoMode ? INITIAL_ROOMS : []);
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  
  // Modes
  const [isEditMode, setIsEditMode] = useState(false);
  
  // Modal States
  const [editingRoom, setEditingRoom] = useState<Room | null>(null);
  const [viewingRoom, setViewingRoom] = useState<Room | null>(null);
  const [quickReportIssue, setQuickReportIssue] = useState('');

  const isManager = user.role === UserRole.SYSTEM_ADMIN || user.role === UserRole.PROPERTY_MANAGER;

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesStatus = filterStatus === 'ALL' || room.status === filterStatus;
      const matchesSearch = room.number.includes(search) || 
                            (room.guestName?.toLowerCase() || '').includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [rooms, filterStatus, search]);

  const toggleStatus = (e: React.MouseEvent, id: string, newStatus: RoomStatus) => {
    e.stopPropagation();
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
  };

  const handleRoomClick = (room: Room) => {
    if (isEditMode && isManager) {
        setEditingRoom({...room});
    } else {
        setViewingRoom(room);
        setQuickReportIssue('');
    }
  };

  const handleSaveEdit = (e: React.FormEvent) => {
      e.preventDefault();
      if (!editingRoom) return;
      setRooms(prev => prev.map(r => r.id === editingRoom.id ? editingRoom : r));
      setEditingRoom(null);
  };

  const handleQuickMaintenanceReport = () => {
    if (!viewingRoom || !quickReportIssue) return;
    
    // Simulate updating backend via Firestore
    setRooms(prev => prev.map(r => r.id === viewingRoom.id ? { ...r, status: RoomStatus.MAINTENANCE } : r));
    setViewingRoom(prev => prev ? { ...prev, status: RoomStatus.MAINTENANCE } : null);
    
    // Reset
    alert(`Maintenance Ticket Created for Room ${viewingRoom.number}: "${quickReportIssue}"`);
    setQuickReportIssue('');
  };

  const getStatusConfig = (status: RoomStatus) => {
    switch (status) {
      case RoomStatus.AVAILABLE:
        return { 
          color: 'bg-emerald-500', 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          icon: CheckCircle2,
          label: 'Available'
        };
      case RoomStatus.OCCUPIED:
        return { 
          color: 'bg-blue-500', 
          bg: 'bg-blue-50', 
          text: 'text-blue-700', 
          icon: UserIcon,
          label: 'Occupied'
        };
      case RoomStatus.DIRTY:
        return { 
          color: 'bg-amber-500', 
          bg: 'bg-amber-50', 
          text: 'text-amber-700', 
          icon: Sparkles,
          label: 'Dirty'
        };
      case RoomStatus.MAINTENANCE:
        return { 
          color: 'bg-rose-500', 
          bg: 'bg-rose-50', 
          text: 'text-rose-700', 
          icon: Wrench,
          label: 'Maintenance'
        };
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
          <p className="text-slate-500 text-sm">Monitor room readiness and occupancy at a glance.</p>
        </div>
        
        <div className="flex items-center gap-4">
           {isManager && (
             <button 
               onClick={() => setIsEditMode(!isEditMode)}
               className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${
                 isEditMode 
                 ? 'bg-slate-900 text-white shadow-lg' 
                 : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
               }`}
             >
               {isEditMode ? <ToggleRight size={20} className="text-emerald-400" /> : <ToggleLeft size={20} />}
               {isEditMode ? 'Edit Mode ON' : 'Edit Mode OFF'}
             </button>
           )}

            <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
              <button className="p-2 bg-slate-100 text-slate-800 rounded-lg">
                <LayoutGrid size={20} />
              </button>
              <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
                <List size={20} />
              </button>
            </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text"
            placeholder="Search room number or guest..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        
        <div className="flex items-center gap-2">
          <Filter size={18} className="text-slate-400" />
          <select 
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value as any)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value={RoomStatus.AVAILABLE}>Available</option>
            <option value={RoomStatus.OCCUPIED}>Occupied</option>
            <option value={RoomStatus.DIRTY}>Dirty</option>
            <option value={RoomStatus.MAINTENANCE}>Maintenance</option>
          </select>
        </div>

        <div className="h-6 w-px bg-slate-200 mx-2 hidden md:block"></div>

        <div className="flex gap-2">
          {Object.values(RoomStatus).map(status => {
            const config = getStatusConfig(status);
            const count = rooms.filter(r => r.status === status).length;
            return (
              <div key={status} className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-100">
                <div className={`w-2 h-2 rounded-full ${config.color}`}></div>
                <span className="text-[10px] font-bold text-slate-500 uppercase">{count} {config.label}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredRooms.length > 0 ? filteredRooms.map(room => {
          const config = getStatusConfig(room.status);
          const StatusIcon = config.icon;
          
          return (
            <div 
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className={`group relative bg-white rounded-2xl border transition-all overflow-hidden ${
                isEditMode && isManager
                  ? 'border-blue-400 shadow-lg shadow-blue-100 cursor-pointer scale-[1.02]'
                  : 'border-slate-100 shadow-sm hover:shadow-md cursor-pointer'
              }`}
            >
              {isEditMode && isManager && (
                 <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                    EDIT
                 </div>
              )}
              
              {/* Header */}
              <div className={`h-1.5 w-full ${config.color}`}></div>
              
              <div className="p-5 space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 leading-none">{room.number}</h3>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">Floor {room.floor} • {room.type}</p>
                  </div>
                  <div className={`p-2 rounded-xl ${config.bg} ${config.text}`}>
                    <StatusIcon size={20} />
                  </div>
                </div>

                {room.status === RoomStatus.OCCUPIED ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        {room.guestName?.[0]}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">{room.guestName}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Checkout: {room.checkoutDate}</p>
                  </div>
                ) : (
                  <div className="h-10 flex items-center">
                    <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                      {config.label}
                    </span>
                  </div>
                )}

                {/* Hover Quick Actions (Only visible when NOT in Edit Mode) */}
                {!isEditMode && (
                  <div className="pt-2 border-t border-slate-50 flex gap-2">
                    {room.status === RoomStatus.DIRTY && (
                      <button 
                        onClick={(e) => toggleStatus(e, room.id, RoomStatus.AVAILABLE)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                        MARK CLEAN
                      </button>
                    )}
                    {room.status === RoomStatus.AVAILABLE && (
                      <button 
                        onClick={(e) => toggleStatus(e, room.id, RoomStatus.MAINTENANCE)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Wrench size={12} />
                        MAINTENANCE
                      </button>
                    )}
                    {room.status === RoomStatus.MAINTENANCE && (
                      <button 
                        onClick={(e) => toggleStatus(e, room.id, RoomStatus.AVAILABLE)}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                        READY
                      </button>
                    )}
                    {room.status === RoomStatus.OCCUPIED && (
                        <div className="w-full text-center py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                            Occupied
                        </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        }) : (
          <div className="col-span-full py-20 bg-slate-50 rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center text-center">
              <AlertCircle size={48} className="text-slate-300 mb-4" />
              <h3 className="text-lg font-bold text-slate-400">No Room Data</h3>
              <p className="text-xs text-slate-400 mt-2 max-w-xs">{isDemoMode ? "No rooms match your filters." : "Production mode is active. Configure room inventory in settings."}</p>
          </div>
        )}
      </div>

      {/* --- View Info Modal --- */}
      {viewingRoom && (
         <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
             <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingRoom(null)}></div>
             <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200 flex flex-col max-h-[90vh]">
                 {/* Header */}
                 <div className="px-8 py-6 bg-slate-50 border-b border-slate-100 flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm text-slate-800 font-black text-2xl">
                            {viewingRoom.number}
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800">Room Overview</h2>
                            <p className="text-xs font-medium text-slate-400 uppercase tracking-widest">{viewingRoom.type} • Floor {viewingRoom.floor}</p>
                        </div>
                    </div>
                    <button onClick={() => setViewingRoom(null)} className="p-2 text-slate-400 hover:text-slate-600 rounded-full hover:bg-slate-200/50 transition-colors">
                        <X size={24} />
                    </button>
                 </div>

                 <div className="flex-1 overflow-y-auto p-8 space-y-8">
                     
                     {/* Status Banner */}
                     <div className={`p-4 rounded-2xl flex items-center gap-4 border ${
                        viewingRoom.status === RoomStatus.AVAILABLE ? 'bg-emerald-50 border-emerald-100' :
                        viewingRoom.status === RoomStatus.OCCUPIED ? 'bg-blue-50 border-blue-100' :
                        viewingRoom.status === RoomStatus.DIRTY ? 'bg-amber-50 border-amber-100' :
                        'bg-rose-50 border-rose-100'
                     }`}>
                        <div className={`p-3 rounded-xl ${
                             viewingRoom.status === RoomStatus.AVAILABLE ? 'bg-emerald-100 text-emerald-600' :
                             viewingRoom.status === RoomStatus.OCCUPIED ? 'bg-blue-100 text-blue-600' :
                             viewingRoom.status === RoomStatus.DIRTY ? 'bg-amber-100 text-amber-600' :
                             'bg-rose-100 text-rose-600'
                        }`}>
                             {viewingRoom.status === RoomStatus.AVAILABLE ? <CheckCircle2 size={20}/> :
                              viewingRoom.status === RoomStatus.OCCUPIED ? <UserIcon size={20}/> :
                              viewingRoom.status === RoomStatus.DIRTY ? <Sparkles size={20}/> : <Wrench size={20}/>}
                        </div>
                        <div>
                             <p className="font-bold text-slate-800 text-sm">Current Status: {viewingRoom.status}</p>
                             <p className="text-xs text-slate-500 mt-0.5">
                                 {viewingRoom.status === RoomStatus.AVAILABLE ? 'Room is ready for check-in.' :
                                  viewingRoom.status === RoomStatus.OCCUPIED ? `Occupied by ${viewingRoom.guestName}.` :
                                  viewingRoom.status === RoomStatus.DIRTY ? 'Requires housekeeping attention.' :
                                  'Undergoing maintenance.'}
                             </p>
                        </div>
                     </div>

                     <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {/* Housekeeping & Supplies */}
                         <div className="space-y-4">
                             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Package size={14} /> Housekeeping
                             </h3>
                             <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                                 <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <input type="checkbox" checked={viewingRoom.status === RoomStatus.AVAILABLE} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Fresh Linens</span>
                                        </div>
                                        {viewingRoom.status === RoomStatus.AVAILABLE && <span className="text-[10px] font-bold text-emerald-500">OK</span>}
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-2 text-sm text-slate-600">
                                            <input type="checkbox" checked={viewingRoom.status === RoomStatus.AVAILABLE} readOnly className="rounded text-blue-600 focus:ring-0" />
                                            <span>Toiletries Restock</span>
                                        </div>
                                        {viewingRoom.status === RoomStatus.AVAILABLE && <span className="text-[10px] font-bold text-emerald-500">OK</span>}
                                    </div>
                                 </div>
                                 
                                 <div className="mt-4 pt-4 border-t border-slate-50">
                                     <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Last Cleaned</p>
                                     <div className="flex items-center gap-2 text-xs text-slate-600">
                                         <Clock size={12} />
                                         <span>Today, 10:45 AM by Maria G.</span>
                                     </div>
                                 </div>
                             </div>
                         </div>

                         {/* Maintenance Quick Action */}
                         <div className="space-y-4">
                             <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                 <Wrench size={14} /> Quick Action
                             </h3>
                             <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm h-full flex flex-col justify-between">
                                <div>
                                   <label className="text-[10px] font-bold text-slate-500 mb-2 block uppercase">Report Issue</label>
                                   <div className="relative">
                                     <input 
                                       type="text" 
                                       value={quickReportIssue}
                                       onChange={(e) => setQuickReportIssue(e.target.value)}
                                       placeholder="e.g. Broken Lamp, TV Remote..."
                                       className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500 mb-2"
                                     />
                                   </div>
                                </div>
                                <button 
                                  onClick={handleQuickMaintenanceReport}
                                  disabled={!quickReportIssue}
                                  className="w-full py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-rose-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                  <AlertTriangle size={12} />
                                  Flag Maintenance
                                </button>
                             </div>
                         </div>
                     </div>
                     
                     {/* Guest Info / History */}
                     <div className="space-y-4">
                         <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                             <History size={14} /> Guest Activity
                         </h3>
                         <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm space-y-4">
                             {viewingRoom.guestName ? (
                                 <div className="pb-4 border-b border-slate-50">
                                     <p className="text-[10px] font-bold text-blue-600 uppercase mb-2">Current Tenant</p>
                                     <div className="flex items-center gap-3">
                                         <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center font-bold">
                                             {viewingRoom.guestName[0]}
                                         </div>
                                         <div>
                                             <p className="font-bold text-slate-800">{viewingRoom.guestName}</p>
                                             <p className="text-xs text-slate-500">Checkout: {viewingRoom.checkoutDate}</p>
                                         </div>
                                     </div>
                                 </div>
                             ) : (
                                 <div className="pb-4 border-b border-slate-50 text-center py-6 text-slate-400 text-xs italic">
                                     No active tenant.
                                 </div>
                             )}
                         </div>
                     </div>
                 </div>
                 
                 {/* Footer Actions */}
                 {isManager && (
                     <div className="p-6 bg-slate-50 border-t border-slate-100 flex justify-end">
                         <button 
                            onClick={() => {
                                setEditingRoom(viewingRoom);
                                setViewingRoom(null);
                            }}
                            className="px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-slate-800 transition-all shadow-lg"
                         >
                            Edit Room Details
                         </button>
                     </div>
                 )}
             </div>
         </div>
      )}

      {/* --- Edit Room Modal (Only visible in Edit Mode or via Info Modal) --- */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingRoom(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                Edit Room {editingRoom.number}
              </h2>
              <button onClick={() => setEditingRoom(null)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSaveEdit} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <Hash size={14} /> Room Number
                </label>
                <input 
                  required
                  type="text"
                  value={editingRoom.number}
                  onChange={e => setEditingRoom({...editingRoom, number: e.target.value} as Room)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <BedDouble size={14} /> Room Type
                </label>
                <select 
                  value={editingRoom.type}
                  onChange={e => setEditingRoom({...editingRoom, type: e.target.value as any})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none font-bold"
                >
                  <option value="Single">Single</option>
                  <option value="Double">Double</option>
                  <option value="Suite">Suite</option>
                  <option value="Penthouse">Penthouse</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <ArrowUp size={14} /> Floor
                </label>
                <input 
                  required
                  type="number"
                  min="1"
                  max="100"
                  value={editingRoom.floor}
                  onChange={e => setEditingRoom({...editingRoom, floor: parseInt(e.target.value) || 1} as Room)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                />
              </div>

              <div className="pt-4 flex gap-4">
                <button 
                  type="button"
                  onClick={() => setEditingRoom(null)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button 
                  type="submit"
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Rooms;
