import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { adminListProperties } from '@firebasegen/default'; // REMOVED
import { api } from '../lib/api';
import { useAuth } from '../components/AuthContext';
import {
    MapPin,
    ArrowRight,
    Search,
    Plus,
    Hotel,
    Users,
    TrendingUp,
    Loader2,
    X
} from 'lucide-react';

export default function PropertySelector() {
    const navigate = useNavigate();
    const { user: firebaseUser } = useAuth();
    const queryClient = useQueryClient();
    const [searchTerm, setSearchTerm] = useState('');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [form, setForm] = useState({ name: '', address: '' });
    const [isCreating, setIsCreating] = useState(false);

    // MUTATIONS
    // MUTATIONS
    const createPropMutation = useMutation({
        mutationFn: async (vars: { name: string, address: string }) => {
            return await api.properties.create(vars);
        }
    });

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!firebaseUser) return;
        setIsCreating(true);
        try {
            // 1. Create Property
            const res = await createPropMutation.mutateAsync({
                name: form.name,
                address: form.address
            });
            const newPropertyId = res.property.id;

            // 2. Refresh & Redirect
            navigate(`/dashboard/${newPropertyId}`);
        } catch (err) {
            console.error("Creation failed", err);
            alert("Failed to create property. Please try again.");
        } finally {
            setIsCreating(false);
        }
    };

    // 1. FETCH REAL DATA
    const { data: properties, isLoading, error } = useQuery({
        queryKey: ["admin-properties"],
        queryFn: async () => {
            const result = await api.properties.list();
            return result.properties || []; // API returns { properties: [...] }
        },
    });

    // 2. SEARCH FILTERING & DATA JOIN
    // The new API might return just properties, or properties populated with rooms/bookings count
    // Adjust destructuring based on actual API response structure.
    const allRooms = []; // data?.rooms || []; //(If API returns separate arrays, otherwise assume property has counts)
    const allBookings = []; // data?.bookings || [];

    const filteredProperties = (properties || []).filter((p: any) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (p.address && p.address.toLowerCase().includes(searchTerm.toLowerCase()))
    ).map((p: any) => ({
        ...p,
        rooms: p.rooms || [], // Assume API now nests rooms or provides count
        bookings: p.bookings || []
    }));

    // 3. UI HELPERS & STATS
    const totalRoomsCount = allRooms.length;
    const totalBookingsCount = allBookings.length;

    if (isLoading) return (
        <div className="min-h-screen flex items-center justify-center bg-slate-50">
            <Loader2 className="animate-spin text-slate-400" size={40} />
        </div>
    );

    if (error) return (
        <div className="min-h-screen flex items-center justify-center text-red-500">
            Error loading properties: {error.message}
        </div>
    );

    return (
        <div className="min-h-screen bg-slate-50 p-6 md:p-12">
            <div className="max-w-7xl mx-auto space-y-10 animate-in fade-in duration-500">

                {/* Header Section */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
                    <div>
                        <h1 className="text-4xl font-black text-slate-900 tracking-tight mb-2">Portfolio Overview</h1>
                        <p className="text-slate-500 font-medium">Select a property to manage operations, view intelligence, or configure settings.</p>
                    </div>

                    <div className="flex items-center gap-3">
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                            <input
                                type="text"
                                placeholder="Find property..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-12 pr-6 py-3 bg-white border border-slate-200 rounded-xl font-bold text-sm focus:ring-4 focus:ring-slate-100 outline-none w-64 shadow-sm"
                            />
                        </div>
                        <button
                            onClick={() => setIsModalOpen(true)}
                            className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200"
                        >
                            <Plus size={18} />
                            New Property
                        </button>
                    </div>
                </div>

                {/* Global Stats Row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                            <Hotel size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Assets</p>
                            <p className="text-2xl font-black text-slate-900">{properties.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Bookings</p>
                            <p className="text-2xl font-black text-slate-900">
                                {totalBookingsCount}
                            </p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Rooms</p>
                            <p className="text-2xl font-black text-slate-900">
                                {totalRoomsCount}
                            </p>
                        </div>
                    </div>
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.length === 0 && (
                        <div className="col-span-3 text-center py-12 text-slate-400">
                            No properties found. Try creating one!
                        </div>
                    )}

                    {filteredProperties.map((property: any) => {
                        // Calculate Real Stats
                        const rooms = property.rooms || [];
                        const totalRooms = rooms.length;
                        const occupiedRooms = rooms.filter((r: any) => r.roomStatus === 'OCCUPIED').length;
                        const occupancy = totalRooms > 0 ? Math.round((occupiedRooms / totalRooms) * 100) : 0;

                        // Deterministic Image
                        const seed = property.id.length;
                        const images = [
                            "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3",
                            "https://images.unsplash.com/photo-1590490360182-f33efe29a77d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
                            "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3",
                            "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3"
                        ];
                        const img = images[seed % images.length];

                        return (
                            <div
                                key={property.id}
                                onClick={() => navigate(`/dashboard/${property.id}`)}
                                className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative"
                            >
                                <div className="w-full h-48 rounded-[2rem] bg-slate-100 overflow-hidden relative">
                                    <img src={img} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={property.name} />
                                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                                    <div className="absolute bottom-4 left-4 text-white">
                                        <h3 className="font-bold text-lg leading-tight">{property.name}</h3>
                                        <div className="flex items-center gap-1 text-xs font-medium text-slate-300 mt-1">
                                            <MapPin size={12} /> {property.address || "No Address"}
                                        </div>
                                    </div>

                                    <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                                        <span className="text-[10px] font-black text-white uppercase tracking-widest">{totalRooms} ROOMS</span>
                                    </div>
                                </div>

                                <div className="p-4 pt-6 space-y-6">
                                    <div className="flex justify-between items-center px-2">
                                        <div>
                                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupancy</p>
                                            <div className="flex items-end gap-2">
                                                <span className={`text-2xl font-black ${occupancy >= 80 ? 'text-emerald-600' : occupancy >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                    {occupancy}%
                                                </span>
                                                <div className="h-1.5 flex-1 w-24 bg-slate-100 rounded-full overflow-hidden mt-2 mb-2">
                                                    <div className={`h-full rounded-full ${occupancy >= 80 ? 'bg-emerald-500' : occupancy >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${occupancy}%` }}></div>
                                                </div>
                                            </div>
                                        </div>
                                        <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                                            <ArrowRight size={20} />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Simple Modal */}
                {isModalOpen && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
                        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setIsModalOpen(false)}></div>
                        <div className="relative bg-white w-full max-w-lg rounded-[2rem] shadow-2xl p-8 animate-in fade-in zoom-in duration-200">
                            <div className="flex justify-between items-center mb-6">
                                <h2 className="text-2xl font-black text-slate-800">Add New Property</h2>
                                <button onClick={() => setIsModalOpen(false)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full text-slate-400 hover:text-slate-600 transition-colors">
                                    <X size={20} />
                                </button>
                            </div>

                            <form onSubmit={handleCreate} className="space-y-6">
                                <div className="space-y-2">
                                    <label className="text-[10px] bg-white px-1 uppercase font-black tracking-widest text-slate-400">Property Chain / Name</label>
                                    <input
                                        required
                                        autoFocus
                                        type="text"
                                        placeholder="e.g. Grand Plaza Hotel"
                                        value={form.name}
                                        onChange={e => setForm({ ...form, name: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-[10px] bg-white px-1 uppercase font-black tracking-widest text-slate-400">Full Address</label>
                                    <input
                                        type="text"
                                        placeholder="123 Example Blvd, City, Country"
                                        value={form.address}
                                        onChange={e => setForm({ ...form, address: e.target.value })}
                                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl font-bold text-slate-800 focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                    />
                                </div>

                                <button
                                    type="submit"
                                    disabled={isCreating}
                                    className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold text-sm shadow-xl shadow-blue-200 transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                >
                                    {isCreating ? <Loader2 className="animate-spin" size={20} /> : "Create & Launch Dashboard"}
                                </button>
                            </form>
                        </div>
                    </div>
                )}

            </div>
        </div>
    );
}