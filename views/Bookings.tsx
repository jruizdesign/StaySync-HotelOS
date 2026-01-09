
import React, { useState, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getPropertyDashboard } from '@firebasegen/default'; // REMOVED
import { api } from '../lib/api';
import {
  Plus,
  Search,
  Filter,
  MoreVertical,
  Edit2,
  Trash2,
  X,
  Calendar,
  User,
  Hash,
  DollarSign,
  CheckCircle2,
  Receipt,
  FileText,
  Loader2,
  Mail,
  Phone,
  Users,
  Sparkles,
  Infinity
} from 'lucide-react';
import { Booking } from '../types';

// MOCK DATA removed for production
// Auto-complete relies on API now



interface BookingsProps {
  isDemoMode: boolean;
  propertyId?: string;
}

const Bookings: React.FC<BookingsProps> = ({ isDemoMode, propertyId }) => {
  const queryClient = useQueryClient();

  // 1. Fetch Real Data
  const { data: dashboardData } = useQuery({
    queryKey: ['dashboard', propertyId],
    queryFn: async () => {
      if (!propertyId) return null;
      const res = await api.properties.getDashboard(propertyId);
      return res;
    },
    enabled: !!propertyId
  });

  // 2. Map Backend Data to UI Data
  const realBookings = useMemo(() => {
    if (!dashboardData?.bookings) return [];
    return dashboardData.bookings.map(b => ({
      id: b.id,
      guestName: b.guestName,
      guestEmail: b.guestEmail || '',
      guestPhone: b.guestPhone || '',
      numberOfGuests: b.numberOfGuests || 1,
      roomNumber: b.room?.roomNumber || 'Unknown',
      checkIn: b.checkInDate,
      checkOut: b.checkOutDate,
      status: b.status as any,
      dailyRate: b.dailyRate || 0,
      currentStayTotalAmount: b.currentStayTotalAmount || 0
    }));
  }, [dashboardData]);

  const bookings = realBookings;

  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);

  // Autocomplete State
  const [guestSuggestions, setGuestSuggestions] = useState<any[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [isSearchingGuests, setIsSearchingGuests] = useState(false);

  // 3. Mutation
  const createBookingMutation = useMutation({
    mutationFn: async (data: any) => {
      return await api.bookings.create(data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['dashboard', propertyId] });
      setIsModalOpen(false);
    },
    onError: (err) => {
      console.error("Failed to create booking", err);
      alert("Failed to create booking");
    }
  });

  // ... filtering logic ...
  const filteredBookings = useMemo(() => {
    return bookings.filter(b =>
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      b.roomNumber.includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  // ... modal logic ...
  const openModal = (booking: Booking | null = null) => {
    setCurrentBooking(booking || {
      guestName: '',
      guestEmail: '',
      guestPhone: '',
      numberOfGuests: 1,
      roomNumber: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'Confirmed',
      dailyRate: 0,
      currentStayTotalAmount: 0
    });
    setGuestSuggestions([]);
    setShowSuggestions(false);
    setIsModalOpen(true);
  };

  // ... helpers ...
  const handleNameChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setCurrentBooking(prev => prev ? ({ ...prev, guestName: val, guestId: undefined }) : null); // Clear ID if typing manually

    if (val.length > 1) {
      setIsSearchingGuests(true);
      try {
        const res = await api.guests.list(val, false, propertyId); // Use real API
        setGuestSuggestions(res.guests || []);
        setShowSuggestions(true);
      } catch (err) {
        console.error("Failed to search guests", err);
      } finally {
        setIsSearchingGuests(false);
      }
    } else {
      setGuestSuggestions([]);
      setShowSuggestions(false);
    }
  };

  const selectGuest = (guest: any) => {
    setCurrentBooking(prev => prev ? ({
      ...prev,
      guestName: guest.name,
      guestEmail: guest.email,
      guestPhone: guest.phoneNumber || guest.phone,
      guestId: guest.id // Link the ID
    }) : null);
    setShowSuggestions(false);
  };

  const toggleIndefiniteStay = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!currentBooking) return;
    if (e.target.checked) {
      setCurrentBooking({ ...currentBooking, checkOut: undefined });
    } else {
      const baseDate = currentBooking.checkIn ? new Date(currentBooking.checkIn) : new Date();
      baseDate.setDate(baseDate.getDate() + 1);
      setCurrentBooking({ ...currentBooking, checkOut: baseDate.toISOString().split('T')[0] });
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;

    // Real Data
    if (currentBooking.id) {
      alert("Editing not yet supported in this version.");
    } else {
      // CREATE
      setIsGeneratingDocs(true); // Reusing loading state
      createBookingMutation.mutate({
        propertyId: propertyId!,
        roomNumber: currentBooking.roomNumber,
        guestName: currentBooking.guestName || 'Guest',
        guestId: currentBooking.guestId, // Pass ID
        guestEmail: currentBooking.guestEmail,
        guestPhone: currentBooking.guestPhone,
        numberOfGuests: currentBooking.numberOfGuests,
        dailyRate: currentBooking.dailyRate,
        currentStayTotalAmount: currentBooking.currentStayTotalAmount,
        checkIn: currentBooking.checkIn || new Date().toISOString(),
        checkOut: currentBooking.checkOut || new Date().toISOString()
      });
      setIsGeneratingDocs(false);
    }
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      // setBookings(prev => prev.filter(b => b.id !== id));
      alert("Delete not yet implemented on backend");
    }
  };

  const getStatusStyle = (status: Booking['status']) => {
    switch (status) {
      case 'Checked-In': return 'bg-emerald-100 text-emerald-700';
      case 'Confirmed': return 'bg-blue-100 text-blue-700';
      case 'Completed': return 'bg-slate-100 text-slate-600';
      case 'Cancelled': return 'bg-rose-100 text-rose-700';
      default: return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Reservations</h1>
          <p className="text-slate-500 text-sm">Manage guest check-ins, stays, and automated departures.</p>
        </div>
        <button
          onClick={() => openModal()}
          className="flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all"
        >
          <Plus size={20} />
          New Booking
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-4 bg-white p-4 rounded-2xl border border-slate-100 shadow-sm">
        <div className="relative flex-1 min-w-[240px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input
            type="text"
            placeholder="Search by guest or room..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 text-slate-600 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-100 transition-colors">
          <Filter size={18} />
          Filters
        </button>
        <div className="flex-1"></div>
        <div className="text-sm text-slate-400 font-medium">
          Showing {filteredBookings.length} results
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4 font-bold">Guest</th>
                <th className="px-6 py-4 font-bold">Room</th>
                <th className="px-6 py-4 font-bold">Occupancy</th>
                <th className="px-6 py-4 font-bold">Check In/Out</th>
                <th className="px-6 py-4 font-bold">Amount</th>
                <th className="px-6 py-4 font-bold">Status</th>
                <th className="px-6 py-4 text-right font-bold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredBookings.length > 0 ? filteredBookings.map((booking) => (
                <tr key={booking.id} className="hover:bg-slate-50/80 transition-colors group">
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center font-bold text-sm">
                        {booking.guestName.split(' ').map(n => n[0]).join('')}
                      </div>
                      <div>
                        <span className="font-semibold text-slate-700 block">{booking.guestName}</span>
                        <div className="flex flex-col gap-0.5 mt-0.5">
                          {booking.guestEmail && (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Mail size={10} /> {booking.guestEmail}
                            </span>
                          )}
                          {booking.guestPhone && (
                            <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                              <Phone size={10} /> {booking.guestPhone}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 text-xs font-bold">
                      #{booking.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-1.5 text-slate-600">
                      <Users size={14} className="text-slate-400" />
                      <span className="text-xs font-bold">{booking.numberOfGuests}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-700 font-medium">{booking.checkIn}</span>
                      {booking.checkOut ? (
                        <span className="text-slate-400 text-xs">to {booking.checkOut}</span>
                      ) : (
                        <span className="text-blue-600 text-xs font-bold flex items-center gap-1 mt-0.5">
                          <Infinity size={12} /> Indefinite
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    <div>
                      ${booking.currentStayTotalAmount.toFixed(2)}
                      <p className="text-[10px] text-slate-400 font-medium">${booking.dailyRate}/night</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${getStatusStyle(booking.status)}`}>
                      {booking.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      <button
                        onClick={() => openModal(booking)}
                        className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                        title="Edit Booking"
                      >
                        <Edit2 size={16} />
                      </button>
                      {booking.status === 'Completed' && (
                        <button
                          className="p-2 text-emerald-500 hover:bg-emerald-50 rounded-lg transition-colors"
                          title="View Auto-Generated Receipt"
                        >
                          <Receipt size={16} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(booking.id)}
                        className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-slate-400">
                    {isDemoMode ? "No bookings found matching your search." : "No bookings in production database. Click 'New Booking' to start."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && currentBooking && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-visible animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {currentBooking.id ? 'Modify Stay' : 'New Reservation'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>

            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-2 relative">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Guest Name
                </label>
                <div className="relative">
                  <input
                    required
                    type="text"
                    value={currentBooking.guestName}
                    onChange={handleNameChange}
                    onFocus={() => { if (currentBooking.guestName && currentBooking.guestName.length > 1) setShowSuggestions(true); }}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="Search Guest..."
                    autoComplete="off"
                  />
                  {showSuggestions && guestSuggestions.length > 0 && (
                    <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 overflow-hidden z-50 max-h-48 overflow-y-auto">
                      {guestSuggestions.map((g, idx) => (
                        <div
                          key={idx}
                          onClick={() => selectGuest(g)}
                          className="p-3 hover:bg-blue-50 cursor-pointer flex items-center justify-between group border-b border-slate-50 last:border-0"
                        >
                          <div>
                            <p className="font-bold text-slate-700 text-sm">{g.name}</p>
                            <p className="text-[10px] text-slate-400">{g.email} • {g.phoneNumber || g.phone}</p>
                          </div>
                          <div className="hidden group-hover:flex items-center gap-1 text-[10px] font-bold text-blue-600 uppercase">
                            <Sparkles size={10} /> Link
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* Contact Info Row */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} /> Email
                  </label>
                  <input
                    type="email"
                    value={currentBooking.guestEmail || ''}
                    onChange={e => setCurrentBooking(prev => prev ? { ...prev, guestEmail: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="guest@email.com"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Phone size={14} /> Phone
                  </label>
                  <input
                    type="tel"
                    value={currentBooking.guestPhone || ''}
                    onChange={e => setCurrentBooking(prev => prev ? { ...prev, guestPhone: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="+1 (555) 000-0000"
                  />
                </div>
              </div>

              {/* Date Selection & Indefinite Stay */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Calendar size={14} /> Check In
                  </label>
                  <input
                    required
                    type="date"
                    value={currentBooking.checkIn}
                    onChange={e => setCurrentBooking(prev => prev ? { ...prev, checkIn: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                      <Calendar size={14} /> Check Out
                    </label>
                    <label className="flex items-center gap-1.5 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={currentBooking.checkOut === undefined}
                        onChange={toggleIndefiniteStay}
                        className="w-3 h-3 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-[10px] font-bold text-blue-600 uppercase tracking-widest group-hover:text-blue-700">Indefinite</span>
                    </label>
                  </div>
                  <input
                    required={currentBooking.checkOut !== undefined}
                    disabled={currentBooking.checkOut === undefined}
                    type="date"
                    value={currentBooking.checkOut || ''}
                    onChange={e => setCurrentBooking(prev => prev ? { ...prev, checkOut: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all font-medium text-slate-700 disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-slate-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={14} /> Room
                  </label>
                  <input
                    required
                    type="text"
                    value={currentBooking.roomNumber}
                    onChange={e => setCurrentBooking(prev => prev ? { ...prev, roomNumber: e.target.value } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="101"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Users size={14} /> Guests
                  </label>
                  <input
                    required
                    type="number"
                    min="1"
                    value={currentBooking.numberOfGuests}
                    onChange={e => setCurrentBooking(prev => prev ? { ...prev, numberOfGuests: parseInt(e.target.value) || 1 } : null)}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign size={14} /> Daily Rate
                  </label>
                  <input
                    required
                    type="number"
                    value={currentBooking.dailyRate}
                    onChange={e => {
                      const rate = parseFloat(e.target.value) || 0;
                      // Simple auto-calc
                      const start = new Date(currentBooking.checkIn || '');
                      const end = currentBooking.checkOut ? new Date(currentBooking.checkOut) : new Date();
                      const nights = Math.max(1, Math.ceil((end.getTime() - start.getTime()) / (1000 * 3600 * 24)));

                      setCurrentBooking(prev => prev ? {
                        ...prev,
                        dailyRate: rate,
                        currentStayTotalAmount: rate * nights
                      } : null)
                    }}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="0.00"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <CheckCircle2 size={14} /> Status
                </label>
                <select
                  value={currentBooking.status}
                  onChange={e => setCurrentBooking(prev => prev ? { ...prev, status: e.target.value as any } : null)}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all appearance-none"
                >
                  <option value="Confirmed">Confirmed</option>
                  <option value="Checked-In">Checked-In</option>
                  <option value="Completed">Completed (Auto-generate Billing)</option>
                  <option value="Cancelled">Cancelled</option>
                </select>
              </div>

              {currentBooking.status === 'Completed' && (
                <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-100 flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                  <FileText className="text-emerald-500 shrink-0 mt-1" size={18} />
                  <p className="text-xs font-medium text-emerald-700 leading-relaxed">
                    Marking this booking as <strong>Completed</strong> will automatically generate a final invoice and receipt and add them to the guest's secure document vault.
                  </p>
                </div>
              )}

              <div className="pt-4 flex gap-4">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 py-3 text-slate-600 font-bold hover:bg-slate-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGeneratingDocs}
                  className="flex-1 py-3 bg-blue-600 text-white font-bold rounded-xl shadow-lg shadow-blue-200 hover:bg-blue-700 transition-all flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  {isGeneratingDocs ? (
                    <>
                      <Loader2 className="animate-spin" size={18} />
                      Billing...
                    </>
                  ) : (
                    currentBooking.id ? 'Update & Finalize' : 'Create Booking'
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;
