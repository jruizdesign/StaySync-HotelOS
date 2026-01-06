import React, { useState, useEffect } from 'react';
import { Property, Booking, Room, User } from '../types';
import {
    Save,
    Building2,
    MapPin,
    Phone,
    Mail,
    Loader2,
    CheckCircle2,
    Database,
    Table,
    Trash2,
    AlertTriangle,
    RefreshCw,
    Server,
    Eye
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProperty } from '@firebasegen/default';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
    property: Property;
    isDemoMode: boolean;
    dashboardData?: any; // The real Cloud SQL data
}

// Mock Data for "Visual Database" in Demo Mode
// MOCK_DB_DATA removed for production

const Settings: React.FC<SettingsProps> = ({ property, isDemoMode, dashboardData }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Form State
    const [formData, setFormData] = useState({
        name: property.name,
        address: property.address || '',
        email: property.email || '',
        phoneNumber: property.phoneNumber || ''
    });

    // UI State
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);
    const [activeDbTab, setActiveDbTab] = useState<'bookings' | 'rooms' | 'users'>('bookings');
    const [showJson, setShowJson] = useState(false);

    // Sync form with property prop changes
    useEffect(() => {
        setFormData({
            name: property.name,
            address: property.address || '',
            email: property.email || '',
            phoneNumber: property.phoneNumber || ''
        });
    }, [property]);

    // DB Mutation
    const mutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            return await updateProperty({
                id: property.id,
                ...data
            });
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', property.id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        },
        onError: (err) => {
            console.error("Failed to update property", err);
            alert("Failed to update settings. See console for details.");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        // Real Cloud SQL Update
        await mutation.mutateAsync(formData);

        setIsSaving(false);
    };

    // Determine data to show in Visualizer
    // Determine data to show in Visualizer
    const dbData = {
        bookings: dashboardData?.bookings || [],
        rooms: dashboardData?.rooms || [],
        users: dashboardData?.users || []
    };

    const handleClearData = () => {
        if (confirm("Are you sure you want to wipe all mock data? This cannot be undone.")) {
            alert("Data wipe simulation initiated. (In a real app, this would trigger a cleanup mutation).");
        }
    };

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-black text-slate-800">Property Settings</h1>
                    <p className="text-slate-500 font-medium">Configure property details and manage system data.</p>
                </div>
                <div className="flex items-center gap-2">
                    {isDemoMode && (
                        <div className="px-3 py-1 bg-amber-100 text-amber-700 rounded-full text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                            <AlertTriangle size={12} /> Demo Mode Active
                        </div>
                    )}
                </div>
            </div>

            {/* Main Configuration Form */}
            <div className="bg-white rounded-[2rem] p-8 md:p-10 border border-slate-100 shadow-xl shadow-slate-200/50">
                <form onSubmit={handleSubmit} className="space-y-10">
                    {/* Property Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                                <Building2 size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Property Identity</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Public Facing Information</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest">Property Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                                    placeholder="e.g. Lumina Grand Resort"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <MapPin size={12} /> Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                                    placeholder="123 Ocean Drive, Miami, FL"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-4 border-b border-slate-50">
                            <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                                <Phone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-slate-800 text-lg">Contact Information</h3>
                                <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Guest & Staff Communication</p>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Mail size={12} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                                    placeholder="contact@hotel.com"
                                />
                            </div>
                            <div className="space-y-3">
                                <label className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                                    <Phone size={12} /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none font-bold text-slate-700 transition-all"
                                    placeholder="+1 (555) 000-0000"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex flex-wrap items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`flex-1 md:flex-none px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-lg shadow-slate-900/20 flex items-center justify-center gap-3 transition-all active:scale-95 ${isSaving ? 'opacity-80' : 'hover:bg-slate-800'}`}
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isSaving ? 'Saving...' : 'Save Configuration'}
                        </button>

                        {showSuccess && (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-6 py-4 rounded-2xl animate-in fade-in slide-in-from-left-2 border border-emerald-100">
                                <CheckCircle2 size={20} />
                                Changes Saved
                            </div>
                        )}
                    </div>
                </form>
            </div>

            {/* Visual Database Section */}
            <div className="bg-white rounded-[2rem] border border-slate-100 shadow-xl shadow-slate-200/50 overflow-hidden">
                <div className="p-8 border-b border-slate-50 bg-slate-50/50 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                        <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Visual Database</h3>
                            <p className="text-xs text-slate-500 font-bold uppercase tracking-wider">
                                {isDemoMode ? 'Mock Data Simulation' : 'Connected to Cloud SQL'}
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={() => setShowJson(!showJson)}
                            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all ${showJson ? 'bg-violet-600 text-white' : 'bg-white text-slate-500 border border-slate-200 hover:bg-slate-50'}`}
                        >
                            <Eye size={14} /> {showJson ? 'View Table' : 'View JSON'}
                        </button>
                    </div>
                </div>

                <div className="p-4 bg-slate-50/50 border-b border-slate-100 flex gap-2 overflow-x-auto">
                    {(['bookings', 'rooms', 'users'] as const).map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveDbTab(tab)}
                            className={`px-6 py-3 rounded-xl text-sm font-bold capitalize transition-all ${activeDbTab === tab ? 'bg-white text-violet-600 shadow-sm ring-1 ring-slate-200' : 'text-slate-400 hover:bg-slate-100'}`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                <div className="p-8 min-h-[300px] max-h-[500px] overflow-auto">
                    {showJson ? (
                        <pre className="bg-slate-900 text-slate-50 p-6 rounded-2xl font-mono text-xs overflow-auto">
                            {JSON.stringify(dbData[activeDbTab], null, 2)}
                        </pre>
                    ) : (
                        <div className="overflow-x-auto">
                            {dbData[activeDbTab] && dbData[activeDbTab].length > 0 ? (
                                <table className="w-full text-left border-collapse">
                                    <thead>
                                        <tr className="border-b border-slate-100">
                                            {Object.keys(dbData[activeDbTab][0]).filter(k => k !== '__typename').map((key) => (
                                                <th key={key} className="py-4 px-4 text-xs font-black text-slate-400 uppercase tracking-wider bg-slate-50 first:rounded-l-lg last:rounded-r-lg">
                                                    {key}
                                                </th>
                                            ))}
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-50">
                                        {dbData[activeDbTab].map((row: any, i: number) => (
                                            <tr key={i} className="hover:bg-slate-50/80 transition-colors">
                                                {Object.keys(row).filter(k => k !== '__typename').map((key) => (
                                                    <td key={key} className="py-4 px-4 text-sm font-medium text-slate-700">
                                                        {typeof row[key] === 'object' ? JSON.stringify(row[key]) : row[key]}
                                                    </td>
                                                ))}
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            ) : (
                                <div className="text-center py-20 text-slate-400">
                                    <Database size={48} className="mx-auto mb-4 opacity-20" />
                                    <p className="font-bold">No records found in {activeDbTab} table.</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 rounded-[2rem] p-8 md:p-10 border border-rose-100">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-white text-rose-600 rounded-2xl shadow-sm">
                        <AlertTriangle size={32} />
                    </div>
                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-bold text-rose-800 text-xl">System Controls</h3>
                            <p className="text-rose-600/80 font-medium mt-1">Manage critical system states and data reset operations.</p>
                        </div>

                        <div className="flex flex-wrap gap-4">
                            <button
                                onClick={handleClearData}
                                className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-100 hover:border-rose-300 transition-all flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Wipe All Mock Data
                            </button>

                            {isDemoMode ? (
                                <button
                                    onClick={() => navigate('/')}
                                    className="px-6 py-3 bg-rose-600 text-white font-bold rounded-xl shadow-lg shadow-rose-600/20 hover:bg-rose-700 transition-all flex items-center gap-2"
                                >
                                    <Server size={18} />
                                    Exit Demo Mode
                                </button>
                            ) : (
                                <button className="px-6 py-3 bg-slate-900 opacity-50 text-white font-bold rounded-xl cursor-not-allowed flex items-center gap-2">
                                    <RefreshCw size={18} />
                                    Sync Cloud Data
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
