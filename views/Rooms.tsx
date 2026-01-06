import React, { useState, useMemo } from 'react';
import {
  CheckCircle2, User as UserIcon, Wrench, AlertCircle, Sparkles,
  Filter, Search, LayoutGrid, List, X, Hash, ArrowUp, BedDouble,
  ToggleLeft, ToggleRight, History, Package, Clock, AlertTriangle
} from 'lucide-react';
import { RoomStatus, User } from '../types';
import RoomSetupWizard from './RoomSetupWizard';

// Backend Imports
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getPropertyDashboard, updateRoom } from '@firebasegen/default'; // Corrected imports
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

interface RoomsProps {
  isDemoMode: boolean;
  user: User;
  propertyId: string;
}

const Rooms: React.FC<RoomsProps> = ({ isDemoMode, user, propertyId }) => {
  const queryClient = useQueryClient();
  const db = getFirestore();

  // 1. FETCH REAL DATA
  const { data, isLoading, refetch } = useQuery({
    queryKey: ['dashboard', propertyId],
    queryFn: async () => {
      // Direct call to generated SDK function
      const response = await getPropertyDashboard({ propertyId });
      return response.data;
    },
    enabled: !!propertyId && !isDemoMode
  });

  // Merge Real Data or Use Mocks
  const rooms = useMemo(() => {
    if (!data) return [];

    // Merge SQL Rooms with Active Bookings to determine Guest Name
    return data.rooms.map((room: any) => {
      // Find if there is an active booking for this room
      const activeBooking = data.bookings.find((b: any) =>
        b.room?.roomNumber === room.roomNumber && b.status === 'CONFIRMED'
      );

      return {
        ...room,
        number: room.roomNumber, // Map SQL 'roomNumber' to UI 'number'
        floor: room.floor || 1,  // Default if missing
        type: room.roomType,     // Map SQL 'roomType' to UI 'type'
        status: room.roomStatus || 'AVAILABLE', // Map SQL 'roomStatus' to UI 'status'
        price: room.price,
        guestName: activeBooking ? activeBooking.guestName : null,
        checkoutDate: activeBooking ? activeBooking.checkOutDate : null
      };
    });
  }, [data, isDemoMode]);

  // UI State
  const [filterStatus, setFilterStatus] = useState<string | 'ALL'>('ALL');
  const [search, setSearch] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);
  const [editingRoom, setEditingRoom] = useState<any | null>(null);
  const [viewingRoom, setViewingRoom] = useState<any | null>(null);
  const [quickReportIssue, setQuickReportIssue] = useState('');

  // Use string comparison for roles to avoid Enum type mismatches if UserRole is not perfectly aligned
  const isManager = (user.role as string) === 'SUPER_ADMIN' || (user.role as string) === 'MANAGER';

  // 2. MUTATION: Update Room (SQL)
  const updateRoomMutation = useMutation({
    mutationFn: async (vars: any) => {
      // Direct call to generated SDK function
      return await updateRoom(vars);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', propertyId] });
      setEditingRoom(null);
    }
  });

  const toggleStatus = async (e: React.MouseEvent, room: any, newStatus: string) => {
    e.stopPropagation();
    e.stopPropagation();

    // Call Cloud SQL Mutation
    await updateRoomMutation.mutateAsync({
      id: room.id,
      status: newStatus,
      type: room.type,
      floor: room.floor,
      number: room.number
    });
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRoom) return;

    await updateRoomMutation.mutateAsync({
      id: editingRoom.id,
      status: editingRoom.status,
      type: editingRoom.type,
      floor: editingRoom.floor,
      number: editingRoom.number
    });
    setEditingRoom(null);
  };

  // 3. FIRESTORE: Create Maintenance Ticket
  const handleQuickMaintenanceReport = async () => {
    if (!viewingRoom || !quickReportIssue) return;

    if (propertyId) {
      try {
        // A. Add ticket to Firestore
        await addDoc(collection(db, `properties/${propertyId}/maintenance_tickets`), {
          issue: quickReportIssue,
          roomNumber: viewingRoom.number,
          priority: "MEDIUM",
          status: "OPEN",
          createdBy: user.id || 'unknown', // Fixed: use user.id per your interface definition
          createdAt: serverTimestamp(),
          comments: []
        });

        // B. Update Room Status in SQL to 'MAINTENANCE'
        await updateRoomMutation.mutateAsync({
          id: viewingRoom.id,
          status: 'MAINTENANCE',
          // Pass existing values so we don't wipe them
          type: viewingRoom.type,
          floor: viewingRoom.floor,
          number: viewingRoom.number
        });

      } catch (err) {
        console.error("Error creating ticket:", err);
        alert("Failed to report issue");
      }
    }

    alert(`Maintenance Ticket Created for Room ${viewingRoom.number}`);
    setQuickReportIssue('');
    setViewingRoom(null);
  };

  if (isLoading) return <div className="p-12 text-center text-slate-400 font-bold">Loading Rooms...</div>;

  // --- WIZARD LOGIC ---
  const showWizard = !isDemoMode && !isLoading && data && (!data.rooms || data.rooms.length === 0);

  if (showWizard) {
    return (
      <div className="space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
            <p className="text-slate-500 text-sm">Welcome! Let's set up your property.</p>
          </div>
        </div>
        <div className="py-12">
          <RoomSetupWizard propertyId={propertyId} onComplete={() => refetch()} />
        </div>
      </div>
    );
  }

  const filteredRooms = rooms.filter((room: any) => {
    const matchesStatus = filterStatus === 'ALL' || room.status === filterStatus;
    const matchesSearch = room.number.includes(search) ||
      (room.guestName?.toLowerCase() || '').includes(search.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const getStatusConfig = (status: string) => {
    // Normalize status case
    const s = status.toUpperCase();
    switch (s) {
      case 'AVAILABLE':
        return { color: 'bg-emerald-500', bg: 'bg-emerald-50', text: 'text-emerald-700', icon: CheckCircle2, label: 'Available' };
      case 'OCCUPIED':
        return { color: 'bg-blue-500', bg: 'bg-blue-50', text: 'text-blue-700', icon: UserIcon, label: 'Occupied' };
      case 'DIRTY':
        return { color: 'bg-amber-500', bg: 'bg-amber-50', text: 'text-amber-700', icon: Sparkles, label: 'Dirty' };
      case 'MAINTENANCE':
        return { color: 'bg-rose-500', bg: 'bg-rose-50', text: 'text-rose-700', icon: Wrench, label: 'Maintenance' };
      default:
        return { color: 'bg-slate-500', bg: 'bg-slate-50', text: 'text-slate-700', icon: AlertCircle, label: status };
    }
  };

  const handleRoomClick = (room: any) => {
    if (isEditMode && isManager) {
      setEditingRoom({ ...room });
    } else {
      setViewingRoom(room);
      setQuickReportIssue('');
    }
  };

  if (isLoading) return <div>Loading Rooms...</div>;

  return (
    <div className="space-y-6">
      {/* Header and Filter Logic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Room Management</h1>
          <p className="text-slate-500 text-sm">Monitor room readiness and occupancy at a glance.</p>
        </div>

        <div className="flex items-center gap-4">
          {isManager && (
            <button
              onClick={() => setIsEditMode(!isEditMode)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all font-bold text-sm ${isEditMode
                ? 'bg-slate-900 text-white shadow-lg'
                : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'
                }`}
            >
              {isEditMode ? <ToggleRight size={20} className="text-emerald-400" /> : <ToggleLeft size={20} />}
              {isEditMode ? 'Edit Mode ON' : 'Edit Mode OFF'}
            </button>
          )}
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
            onChange={(e) => setFilterStatus(e.target.value)}
            className="bg-slate-50 border border-slate-200 rounded-lg text-sm px-3 py-2 outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="ALL">All Statuses</option>
            <option value="AVAILABLE">Available</option>
            <option value="OCCUPIED">Occupied</option>
            <option value="DIRTY">Dirty</option>
            <option value="MAINTENANCE">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Room Grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
        {filteredRooms.length > 0 ? filteredRooms.map((room: any) => {
          const config = getStatusConfig(room.status);
          const StatusIcon = config.icon;

          return (
            <div
              key={room.id}
              onClick={() => handleRoomClick(room)}
              className={`group relative bg-white rounded-2xl border transition-all overflow-hidden ${isEditMode && isManager
                ? 'border-blue-400 shadow-lg shadow-blue-100 cursor-pointer scale-[1.02]'
                : 'border-slate-100 shadow-sm hover:shadow-md cursor-pointer'
                }`}
            >
              {isEditMode && isManager && (
                <div className="absolute top-2 right-2 z-10 bg-blue-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-full shadow-sm animate-pulse">
                  EDIT
                </div>
              )}

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

                {room.status === 'OCCUPIED' ? (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 rounded-full bg-blue-100 flex items-center justify-center text-[10px] font-bold text-blue-600">
                        {room.guestName?.[0] || 'G'}
                      </div>
                      <span className="text-sm font-semibold text-slate-700 truncate">{room.guestName || "Guest"}</span>
                    </div>
                    <p className="text-[10px] text-slate-400 font-medium">Checkout: {room.checkoutDate ? new Date(room.checkoutDate).toLocaleDateString() : 'N/A'}</p>
                  </div>
                ) : (
                  <div className="h-10 flex items-center">
                    <span className={`text-xs font-bold uppercase tracking-wider ${config.text}`}>
                      {config.label}
                    </span>
                  </div>
                )}

                {!isEditMode && (
                  <div className="pt-2 border-t border-slate-50 flex gap-2">
                    {room.status === 'DIRTY' && (
                      <button
                        onClick={(e) => toggleStatus(e, room, 'AVAILABLE')}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-emerald-50 text-emerald-600 rounded-lg text-[10px] font-bold hover:bg-emerald-100 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                        MARK CLEAN
                      </button>
                    )}
                    {room.status === 'AVAILABLE' && (
                      <button
                        onClick={(e) => toggleStatus(e, room, 'MAINTENANCE')}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-slate-50 text-slate-600 rounded-lg text-[10px] font-bold hover:bg-rose-50 hover:text-rose-600 transition-colors"
                      >
                        <Wrench size={12} />
                        MAINTENANCE
                      </button>
                    )}
                    {room.status === 'MAINTENANCE' && (
                      <button
                        onClick={(e) => toggleStatus(e, room, 'AVAILABLE')}
                        className="w-full flex items-center justify-center gap-1.5 py-1.5 bg-blue-50 text-blue-600 rounded-lg text-[10px] font-bold hover:bg-blue-100 transition-colors"
                      >
                        <CheckCircle2 size={12} />
                        READY
                      </button>
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

      {viewingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setViewingRoom(null)}></div>
          <div className="relative bg-white w-full max-w-2xl rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
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
              <div className={`p-4 rounded-2xl flex items-center gap-4 border ${viewingRoom.status === 'AVAILABLE' ? 'bg-emerald-50 border-emerald-100' :
                viewingRoom.status === 'OCCUPIED' ? 'bg-blue-50 border-blue-100' :
                  viewingRoom.status === 'DIRTY' ? 'bg-amber-50 border-amber-100' :
                    'bg-rose-50 border-rose-100'
                }`}>
                <div className={`p-3 rounded-xl ${viewingRoom.status === 'AVAILABLE' ? 'bg-emerald-100 text-emerald-600' :
                  viewingRoom.status === 'OCCUPIED' ? 'bg-blue-100 text-blue-600' :
                    viewingRoom.status === 'DIRTY' ? 'bg-amber-100 text-amber-600' :
                      'bg-rose-100 text-rose-600'
                  }`}>
                  {viewingRoom.status === 'AVAILABLE' ? <CheckCircle2 size={20} /> :
                    viewingRoom.status === 'OCCUPIED' ? <UserIcon size={20} /> :
                      viewingRoom.status === 'DIRTY' ? <Sparkles size={20} /> : <Wrench size={20} />}
                </div>
                <div>
                  <p className="font-bold text-slate-800 text-sm">Current Status: {viewingRoom.status}</p>
                  <p className="text-xs text-slate-500 mt-0.5">Room is currently {viewingRoom.status.toLowerCase()}.</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Housekeeping */}
                <div className="space-y-4">
                  <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                    <Package size={14} /> Housekeeping
                  </h3>
                  <div className="bg-white border border-slate-100 rounded-2xl p-4 shadow-sm">
                    <div className="mt-4 pt-4 border-t border-slate-50">
                      <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Last Cleaned</p>
                      <div className="flex items-center gap-2 text-xs text-slate-600">
                        <Clock size={12} />
                        <span>No recent records.</span>
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
                      <input
                        type="text"
                        value={quickReportIssue}
                        onChange={(e) => setQuickReportIssue(e.target.value)}
                        placeholder="e.g. Broken Lamp..."
                        className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs outline-none focus:ring-2 focus:ring-rose-500 mb-2"
                      />
                    </div>
                    <button
                      onClick={handleQuickMaintenanceReport}
                      disabled={!quickReportIssue}
                      className="w-full py-2 bg-rose-50 text-rose-600 rounded-lg text-xs font-bold uppercase tracking-wide hover:bg-rose-100 disabled:opacity-50 flex items-center justify-center gap-2"
                    >
                      <AlertTriangle size={12} />
                      Flag Maintenance
                    </button>
                  </div>
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

      {/* Edit Room Modal */}
      {editingRoom && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setEditingRoom(null)}></div>
          <div className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl">
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
                  onChange={e => setEditingRoom({ ...editingRoom, number: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <BedDouble size={14} /> Room Type
                </label>
                <select
                  value={editingRoom.type}
                  onChange={e => setEditingRoom({ ...editingRoom, type: e.target.value })}
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
                  onChange={e => setEditingRoom({ ...editingRoom, floor: parseInt(e.target.value) || 1 })}
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