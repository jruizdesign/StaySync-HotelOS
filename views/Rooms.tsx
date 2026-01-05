
import React, { useState, useMemo } from 'react';
import { 
  CheckCircle2, 
  User, 
  Wrench, 
  AlertCircle, 
  Sparkles,
  Filter,
  Search,
  LayoutGrid,
  List
} from 'lucide-react';
import { Room, RoomStatus } from '../types';

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

const Rooms: React.FC = () => {
  const [rooms, setRooms] = useState<Room[]>(INITIAL_ROOMS);
  const [filterStatus, setFilterStatus] = useState<RoomStatus | 'ALL'>('ALL');
  const [search, setSearch] = useState('');

  const filteredRooms = useMemo(() => {
    return rooms.filter(room => {
      const matchesStatus = filterStatus === 'ALL' || room.status === filterStatus;
      const matchesSearch = room.number.includes(search) || 
                            (room.guestName?.toLowerCase() || '').includes(search.toLowerCase());
      return matchesStatus && matchesSearch;
    });
  }, [rooms, filterStatus, search]);

  const toggleStatus = (id: string, newStatus: RoomStatus) => {
    setRooms(prev => prev.map(r => r.id === id ? { ...r, status: newStatus } : r));
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
          icon: User,
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
        
        <div className="flex items-center gap-2 bg-white p-1 rounded-xl border border-slate-200 shadow-sm">
          <button className="p-2 bg-slate-100 text-slate-800 rounded-lg">
            <LayoutGrid size={20} />
          </button>
          <button className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg transition-colors">
            <List size={20} />
          </button>
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
        {filteredRooms.map(room => {
          const config = getStatusConfig(room.status);
          const StatusIcon = config.icon;
          
          return (
            <div 
              key={room.id}
              className="group relative bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all overflow-hidden"
            >
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

                {/* Hover Quick Actions */}
                <div className="pt-2 border-t border-slate-50 flex gap-2">
                  {room.status === RoomStatus.DIRTY && (
                    <button 
                      onClick={() => toggleStatus(room.id, RoomStatus.AVAILABLE)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                    >
                      <CheckCircle2 size={12} />
                      MARK CLEAN
                    </button>
                  )}
                  {room.status === RoomStatus.AVAILABLE && (
                    <button 
                      onClick={() => toggleStatus(room.id, RoomStatus.MAINTENANCE)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                    >
                      <Wrench size={12} />
                      MAINTENANCE
                    </button>
                  )}
                  {room.status === RoomStatus.MAINTENANCE && (
                    <button 
                      onClick={() => toggleStatus(room.id, RoomStatus.AVAILABLE)}
                      className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                    >
                      <CheckCircle2 size={12} />
                      READY
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {filteredRooms.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-200">
          <AlertCircle size={48} className="text-slate-200 mb-4" />
          <h3 className="text-lg font-bold text-slate-400">No rooms match your filters</h3>
        </div>
      )}
    </div>
  );
};

export default Rooms;
