import React, { useState, useMemo } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getPropertyDashboard } from '@firebasegen/default';
import {
    Users,
    DollarSign,
    Search,
    CalendarDays,
    ChevronDown,
    AlertCircle,
    CheckCircle2,
    Clock
} from 'lucide-react';

interface DailyOverviewProps {
    propertyId: string;
}

export default function DailyOverview({ propertyId }: DailyOverviewProps) {
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState<'ALL' | 'OWING' | 'LONG_TERM'>('OWING');

    // Reuse existing dashboard query which fetches bookings
    const { data, isLoading } = useQuery({
        queryKey: ['dashboard', propertyId],
        queryFn: async () => {
            const res = await getPropertyDashboard({ propertyId });
            return res.data;
        }
    });

    const guests = useMemo(() => {
        if (!data?.bookings) return [];

        return data.bookings.map(b => {
            const total = b.currentStayTotalAmount || 0;
            const paid = b.amountPaid || 0;
            const owing = total - paid;

            const checkIn = new Date(b.checkInDate);
            const checkOut = new Date(b.checkOutDate);
            const days = Math.ceil((checkOut.getTime() - checkIn.getTime()) / (1000 * 60 * 60 * 24));

            return {
                id: b.id,
                name: b.guestName,
                email: b.guestEmail,
                phone: b.guestPhone,
                room: b.room?.roomNumber || 'Unassigned',
                checkIn: b.checkInDate,
                checkOut: b.checkOutDate,
                status: b.status,
                total,
                paid,
                owing,
                isLongTerm: days > 14, // Definition of long term?
                days
            };
        }).filter(g => {
            // Search filter
            const matchesSearch =
                g.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                g.room.toLowerCase().includes(searchTerm.toLowerCase());

            if (!matchesSearch) return false;

            // Type filter
            if (filterType === 'OWING') return g.owing > 0;
            if (filterType === 'LONG_TERM') return g.isLongTerm;
            return true;
        });

    }, [data, searchTerm, filterType]);

    const totalOwed = guests.reduce((acc, g) => acc + g.owing, 0);

    if (isLoading) return <div className="p-12 text-center text-slate-400">Loading daily overview...</div>;

    return (
        <div className="space-y-6">
            {/* Header Stats */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex-1 flex items-center gap-4 shadow-sm">
                    <div className="p-4 bg-rose-50 text-rose-500 rounded-2xl">
                        <AlertCircle size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Total Outstanding</p>
                        <p className="text-3xl font-black text-slate-800">${totalOwed.toLocaleString()}</p>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-3xl border border-slate-100 flex-1 flex items-center gap-4 shadow-sm">
                    <div className="p-4 bg-blue-50 text-blue-500 rounded-2xl">
                        <Users size={24} />
                    </div>
                    <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">Guests Listed</p>
                        <p className="text-3xl font-black text-slate-800">{guests.length}</p>
                    </div>
                </div>
            </div>

            {/* Valid Filters & Table */}
            <div className="bg-white border border-slate-200 rounded-[2.5rem] overflow-hidden shadow-sm">
                <div className="p-6 border-b border-slate-100 flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="flex gap-2 p-1 bg-slate-100 rounded-xl">
                        <button
                            onClick={() => setFilterType('OWING')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'OWING' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            Owes Money
                        </button>
                        <button
                            onClick={() => setFilterType('LONG_TERM')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'LONG_TERM' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
               Long Term (>14 Days)
                        </button>
                        <button
                            onClick={() => setFilterType('ALL')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all ${filterType === 'ALL' ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                        >
                            All Guests
                        </button>
                    </div>

                    <div className="relative w-full md:w-64">
                        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Search guest or room..."
                            value={searchTerm}
                            onChange={e => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm font-bold text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>
                </div>

                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-slate-50/50 text-slate-400 text-[10px] uppercase font-bold tracking-wider">
                            <tr>
                                <th className="px-6 py-4">Guest Info</th>
                                <th className="px-6 py-4">Room</th>
                                <th className="px-6 py-4">Stay Duration</th>
                                <th className="px-6 py-4">Total Bill</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4 text-right">Amount Due</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                            {guests.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-slate-400 text-sm font-medium">
                                        No guests found matching your filters.
                                    </td>
                                </tr>
                            ) : (
                                guests.map(guest => (
                                    <tr key={guest.id} className="hover:bg-slate-50/50 transition-colors">
                                        <td className="px-6 py-4">
                                            <div className="font-bold text-slate-800 text-sm">{guest.name}</div>
                                            <div className="text-xs text-slate-500">{guest.email || 'No email'}</div>
                                            <div className="text-[10px] text-slate-400 mt-1">{guest.id.substring(0, 8)}</div>
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className="px-2.5 py-1 bg-slate-100 text-slate-600 rounded-lg text-xs font-bold">
                                                {guest.room}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-xs text-slate-600">
                                                <CalendarDays size={14} className="text-slate-400" />
                                                <span>{new Date(guest.checkIn).toLocaleDateString()} - {new Date(guest.checkOut).toLocaleDateString()}</span>
                                            </div>
                                            <div className="text-[10px] text-orange-500 font-bold mt-1 ml-6">
                                                {guest.days} Nights {guest.isLongTerm && '(Long Term)'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 text-sm font-medium text-slate-600">
                                            ${guest.total.toLocaleString()}
                                        </td>
                                        <td className="px-6 py-4">
                                            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wide
                        ${guest.status === 'CONFIRMED' ? 'bg-emerald-100 text-emerald-600' : 'bg-slate-100 text-slate-500'}
                      `}>
                                                {guest.status === 'CONFIRMED' && <CheckCircle2 size={10} />}
                                                {guest.status}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 text-right">
                                            <div className={`text-sm font-black ${guest.owing > 0 ? 'text-rose-500' : 'text-emerald-500'}`}>
                                                ${guest.owing.toLocaleString()}
                                            </div>
                                            {guest.owing > 0 && (
                                                <div className="text-[10px] font-bold text-rose-400 uppercase tracking-wider mt-1">Payment Pending</div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
