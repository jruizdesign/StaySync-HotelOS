
import React, { useState, useMemo } from 'react';
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
  Loader2
} from 'lucide-react';
import { Booking } from '../types';

const INITIAL_BOOKINGS: Booking[] = [
  { id: 'b1', guestName: 'Emma Thompson', roomNumber: '204', checkIn: '2023-10-27', checkOut: '2023-10-30', status: 'Checked-In', totalAmount: 450 },
  { id: 'b2', guestName: 'James Miller', roomNumber: '105', checkIn: '2023-10-28', checkOut: '2023-11-01', status: 'Confirmed', totalAmount: 820 },
  { id: 'b3', guestName: 'Sophia Garcia', roomNumber: '412', checkIn: '2023-10-25', checkOut: '2023-10-27', status: 'Completed', totalAmount: 340 },
  { id: 'b4', guestName: 'Robert Wilson', roomNumber: '302', checkIn: '2023-10-29', checkOut: '2023-10-31', status: 'Cancelled', totalAmount: 0 },
];

const Bookings: React.FC = () => {
  const [bookings, setBookings] = useState<Booking[]>(INITIAL_BOOKINGS);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentBooking, setCurrentBooking] = useState<Partial<Booking> | null>(null);
  const [isGeneratingDocs, setIsGeneratingDocs] = useState(false);

  const filteredBookings = useMemo(() => {
    return bookings.filter(b => 
      b.guestName.toLowerCase().includes(searchTerm.toLowerCase()) || 
      b.roomNumber.includes(searchTerm)
    );
  }, [bookings, searchTerm]);

  const openModal = (booking: Booking | null = null) => {
    setCurrentBooking(booking || {
      guestName: '',
      roomNumber: '',
      checkIn: new Date().toISOString().split('T')[0],
      checkOut: new Date(Date.now() + 86400000).toISOString().split('T')[0],
      status: 'Confirmed',
      totalAmount: 0
    });
    setIsModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentBooking) return;

    if (currentBooking.status === 'Completed' && currentBooking.id) {
        // Trigger Doc Generation Simulation
        setIsGeneratingDocs(true);
        // Simulate a small delay for "generating" PDFs
        await new Promise(resolve => setTimeout(resolve, 1500));
        console.log(`Auto-generated Invoice & Receipt for ${currentBooking.guestName}`);
        setIsGeneratingDocs(false);
    }

    if (currentBooking.id) {
      setBookings(prev => prev.map(b => b.id === currentBooking.id ? (currentBooking as Booking) : b));
    } else {
      const newBooking = {
        ...currentBooking,
        id: 'b' + Math.random().toString(36).substr(2, 5)
      } as Booking;
      setBookings([newBooking, ...bookings]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id: string) => {
    if (confirm('Are you sure you want to delete this booking?')) {
      setBookings(prev => prev.filter(b => b.id !== id));
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
                      <span className="font-semibold text-slate-700">{booking.guestName}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-slate-100 rounded-md text-slate-600 text-xs font-bold">
                      #{booking.roomNumber}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-col text-sm">
                      <span className="text-slate-700 font-medium">{booking.checkIn}</span>
                      <span className="text-slate-400 text-xs">to {booking.checkOut}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 font-bold text-slate-800">
                    ${booking.totalAmount.toFixed(2)}
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
                  <td colSpan={6} className="px-6 py-12 text-center text-slate-400">
                    No bookings found matching your search.
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
          <div className="relative bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            <div className="flex justify-between items-center px-8 py-6 border-b border-slate-100">
              <h2 className="text-xl font-bold text-slate-800">
                {currentBooking.id ? 'Modify Stay' : 'New Reservation'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600 p-2">
                <X size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSave} className="p-8 space-y-5">
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                  <User size={14} /> Guest Name
                </label>
                <input 
                  required
                  type="text"
                  value={currentBooking.guestName}
                  onChange={e => setCurrentBooking({...currentBooking, guestName: e.target.value})}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                  placeholder="Search Guest..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <Hash size={14} /> Room No
                  </label>
                  <input 
                    required
                    type="text"
                    value={currentBooking.roomNumber}
                    onChange={e => setCurrentBooking({...currentBooking, roomNumber: e.target.value})}
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                    placeholder="101"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                    <DollarSign size={14} /> Total Amount
                  </label>
                  <input 
                    required
                    type="number"
                    value={currentBooking.totalAmount}
                    onChange={e => setCurrentBooking({...currentBooking, totalAmount: parseFloat(e.target.value)})}
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
                  onChange={e => setCurrentBooking({...currentBooking, status: e.target.value as any})}
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
