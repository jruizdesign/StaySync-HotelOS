
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Building2,
    MapPin,
    ArrowRight,
    Search,
    Plus,
    Hotel,
    Users,
    TrendingUp,
    Settings
} from 'lucide-react';
// import { customProperties } from '../App'; // If we are importing mocks, otherwise define locally

// Mock Data for "Properties" since we might not have a full backend fetch for all of them yet
// In a real scenario, we'd fetch these from Data Connect
export const MOCK_ADMIN_PROPERTIES = [
    {
        id: "p-london-01",
        name: "StaySync London Prime",
        location: "London, UK",
        rooms: 120,
        occupancy: 85,
        revenueContext: "positive",
        image: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3"
    },
    {
        id: "p-nyc-02",
        name: "StaySync NYC Central",
        location: "New York, USA",
        rooms: 240,
        occupancy: 92,
        revenueContext: "positive",
        image: "https://images.unsplash.com/photo-1590490360182-f33efe29a77d?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3"
    },
    {
        id: "p-dubai-03",
        name: "StaySync Dubai Resort",
        location: "Dubai, UAE",
        rooms: 350,
        occupancy: 64,
        revenueContext: "warning",
        image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=2670&ixlib=rb-4.0.3"
    },
    {
        id: "demo",
        name: "StaySync Demo Hotel",
        location: "Virtual Sandbox",
        rooms: 45,
        occupancy: 78,
        revenueContext: "positive",
        image: "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=3270&ixlib=rb-4.0.3"
    }
];

export default function PropertySelector() {
    const navigate = useNavigate();
    const [searchTerm, setSearchTerm] = useState('');

    const filteredProperties = MOCK_ADMIN_PROPERTIES.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.location.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleSelectProperty = (propertyId: string) => {
        // Navigate to the Dashboard for this specific property
        navigate(`/dashboard/${propertyId}`);
    };

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
                        <button className="flex items-center gap-2 px-6 py-3 bg-slate-900 text-white rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg shadow-slate-200">
                            <Plus size={18} />
                            New Property
                        </button>
                    </div>
                </div>

                {/* Global Stats Row (Simulated) */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-blue-50 text-blue-600 rounded-2xl">
                            <Hotel size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Total Assets</p>
                            <p className="text-2xl font-black text-slate-900">{MOCK_ADMIN_PROPERTIES.length}</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-emerald-50 text-emerald-600 rounded-2xl">
                            <Users size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Global Guests</p>
                            <p className="text-2xl font-black text-slate-900">1,248</p>
                        </div>
                    </div>
                    <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center gap-4">
                        <div className="p-4 bg-indigo-50 text-indigo-600 rounded-2xl">
                            <TrendingUp size={24} />
                        </div>
                        <div>
                            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Portfolio RevPAR</p>
                            <p className="text-2xl font-black text-slate-900">$184.20</p>
                        </div>
                    </div>
                </div>

                {/* Property Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {filteredProperties.map(property => (
                        <div
                            key={property.id}
                            onClick={() => handleSelectProperty(property.id)}
                            className="group bg-white rounded-[2.5rem] p-4 border border-slate-100 shadow-sm hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer overflow-hidden relative"
                        >
                            {/* Image Header */}
                            <div className="w-full h-48 rounded-[2rem] bg-slate-100 overflow-hidden relative">
                                <img src={property.image} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" alt={property.name} />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent"></div>

                                <div className="absolute bottom-4 left-4 text-white">
                                    <h3 className="font-bold text-lg leading-tight">{property.name}</h3>
                                    <div className="flex items-center gap-1 text-xs font-medium text-slate-300 mt-1">
                                        <MapPin size={12} /> {property.location}
                                    </div>
                                </div>

                                <div className="absolute top-4 right-4 bg-white/10 backdrop-blur-md border border-white/20 px-3 py-1 rounded-full">
                                    <span className="text-[10px] font-black text-white uppercase tracking-widest">{property.rooms} ROOMS</span>
                                </div>
                            </div>

                            {/* Card Body */}
                            <div className="p-4 pt-6 space-y-6">
                                <div className="flex justify-between items-center px-2">
                                    <div>
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Occupancy</p>
                                        <div className="flex items-en gap-2">
                                            <span className={`text-2xl font-black ${property.occupancy >= 80 ? 'text-emerald-600' : property.occupancy >= 60 ? 'text-amber-500' : 'text-rose-500'}`}>
                                                {property.occupancy}%
                                            </span>
                                            <div className="h-1.5 flex-1 w-24 bg-slate-100 rounded-full overflow-hidden mt-2">
                                                <div className={`h-full rounded-full ${property.occupancy >= 80 ? 'bg-emerald-500' : property.occupancy >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`} style={{ width: `${property.occupancy}%` }}></div>
                                            </div>
                                        </div>
                                    </div>
                                    <button className="w-12 h-12 rounded-full bg-slate-50 text-slate-300 group-hover:bg-blue-600 group-hover:text-white transition-colors flex items-center justify-center">
                                        <ArrowRight size={20} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
