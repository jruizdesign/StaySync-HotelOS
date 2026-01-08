import React, { useState, useEffect, useRef } from 'react';
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
    Trash2,
    AlertTriangle,
    Server,
    Download,
    Upload,
    AlertOctagon,
    FileJson,
    RefreshCw
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { api } from '../lib/api';
import { useNavigate } from 'react-router-dom';

interface SettingsProps {
    property: Property;
    isDemoMode: boolean;
    dashboardData?: any;
}

const Settings: React.FC<SettingsProps> = ({ property, isDemoMode, dashboardData }) => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();
    const restoreFileRef = useRef<HTMLInputElement>(null);

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
    const [wipingData, setWipingData] = useState(false);
    const [restoringData, setRestoringData] = useState(false);

    // Modal State
    const [showWipeConfirm, setShowWipeConfirm] = useState(false);
    const [wipeConfirmationInput, setWipeConfirmationInput] = useState('');
    const [showDemoConfirm, setShowDemoConfirm] = useState(false);

    // Sync form with property prop changes
    useEffect(() => {
        setFormData({
            name: property.name,
            address: property.address || '',
            email: property.email || '',
            phoneNumber: property.phoneNumber || ''
        });
    }, [property]);

    // Update Property Mutation
    const updateMutation = useMutation({
        mutationFn: async (data: typeof formData) => {
            return await api.properties.update(property.id, data);
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['dashboard', property.id] });
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);
        await updateMutation.mutateAsync(formData);
        setIsSaving(false);
    };

    // --- DATA MANAGEMENT HANDLERS ---

    const handleBackup = async () => {
        try {
            const res = await api.properties.backup(property.id);
            const blob = new Blob([JSON.stringify(res, null, 2)], { type: 'application/json' });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `backup_${property.name.replace(/\s+/g, '_')}_${new Date().toISOString().split('T')[0]}.json`;
            link.click();
            window.URL.revokeObjectURL(url);
        } catch (e: any) {
            alert('Backup failed: ' + e.message);
        }
    };

    const handleRestoreClick = () => {
        restoreFileRef.current?.click();
    };

    const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!confirm("WARNING: Restore will overwrite current property data. Continue?")) {
            e.target.value = '';
            return;
        }

        setRestoringData(true);
        const reader = new FileReader();
        reader.onload = async (event) => {
            try {
                const json = JSON.parse(event.target?.result as string);
                // Validate basic structure
                if (!json.data || !json.data.rooms) throw new Error("Invalid backup file format");

                await api.properties.restore(property.id, json.data); // Pass list of rooms/bookings/etc
                alert("Restore completed successfully. Page will reload.");
                window.location.reload();
            } catch (err: any) {
                alert("Restore failed: " + err.message);
            } finally {
                setRestoringData(false);
                if (restoreFileRef.current) restoreFileRef.current.value = '';
            }
        };
        reader.readAsText(file);
    };

    const handleWipeData = async () => {
        if (wipeConfirmationInput !== property.name) {
            alert("Property name does not match.");
            return;
        }

        setWipingData(true);
        try {
            await api.properties.wipe(property.id);
            alert("All property data has been wiped.");
            setShowWipeConfirm(false);
            window.location.reload();
        } catch (e: any) {
            alert("Wipe failed: " + e.message);
        } finally {
            setWipingData(false);
        }
    };

    const handleToggleDemo = async () => {
        const newValue = !isDemoMode;
        if (!newValue && !confirm("Disabling Demo Mode? This property will now be live. Any demo data created remains until wiped.")) {
            return;
        }

        try {
            await api.properties.toggleDemo(property.id, newValue);
            alert(`Demo Mode ${newValue ? 'Enabled' : 'Disabled'}. Page will reload.`);
            window.location.reload();
        } catch (e: any) {
            alert("Failed to toggle demo mode: " + e.message);
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
                                />
                            </div>
                        </div>
                    </div>

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

            {/* Data Management Section (Advanced Settings) */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Backup & Restore */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-3 bg-violet-100 text-violet-600 rounded-xl">
                            <Database size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">Data Backup</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Export & Import</p>
                        </div>
                    </div>

                    <div className="flex-1 space-y-4">
                        <p className="text-slate-600 text-sm">
                            Create a full backup of all property data (Rooms, Guests, Bookings, Maintenance) or restore from a previous JSON backup.
                        </p>

                        <div className="grid grid-cols-2 gap-4 mt-6">
                            <button
                                onClick={handleBackup}
                                className="px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-2"
                            >
                                <Download size={20} />
                                <span className="text-xs uppercase tracking-wider">Download Backup</span>
                            </button>

                            <button
                                onClick={handleRestoreClick}
                                disabled={restoringData}
                                className="px-4 py-3 bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl hover:bg-slate-100 hover:border-slate-300 transition-all flex flex-col items-center justify-center gap-2 relative"
                            >
                                {restoringData ? <Loader2 size={20} className="animate-spin" /> : <Upload size={20} />}
                                <span className="text-xs uppercase tracking-wider">{restoringData ? 'Restoring...' : 'Restore Backup'}</span>
                                <input
                                    type="file"
                                    ref={restoreFileRef}
                                    onChange={handleFileChange}
                                    accept=".json"
                                    className="hidden"
                                />
                            </button>
                        </div>
                    </div>
                </div>

                {/* System Modes */}
                <div className="bg-white rounded-[2rem] p-8 border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-col h-full">
                    <div className="flex items-center gap-3 mb-6">
                        <div className={`p-3 rounded-xl transition-colors ${isDemoMode ? 'bg-amber-100 text-amber-600' : 'bg-slate-100 text-slate-600'}`}>
                            {isDemoMode ? <AlertTriangle size={24} /> : <Server size={24} />}
                        </div>
                        <div>
                            <h3 className="font-bold text-slate-800 text-lg">System Mode</h3>
                            <p className="text-xs text-slate-400 font-bold uppercase tracking-wider">Current: {isDemoMode ? 'Demo' : 'Productive'}</p>
                        </div>
                    </div>

                    <div className="flex-1 flex flex-col justify-between space-y-4">
                        <p className="text-slate-600 text-sm">
                            Toggle between **Demo Mode** (simulated environment) and **Production Mode**.
                        </p>

                        <div className="p-4 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <span className="font-bold text-slate-700 text-sm">Demo Mode</span>
                            <button
                                onClick={handleToggleDemo}
                                className={`w-14 h-8 rounded-full p-1 transition-all ${isDemoMode ? 'bg-amber-500' : 'bg-slate-300'}`}
                            >
                                <div className={`w-6 h-6 bg-white rounded-full shadow-sm transition-all transform ${isDemoMode ? 'translate-x-6' : 'translate-x-0'}`} />
                            </button>
                        </div>
                    </div>
                </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-rose-50 rounded-[2rem] p-8 md:p-10 border border-rose-100">
                <div className="flex items-start gap-6">
                    <div className="p-4 bg-white text-rose-600 rounded-2xl shadow-sm">
                        <AlertOctagon size={32} />
                    </div>
                    <div className="flex-1 space-y-6">
                        <div>
                            <h3 className="font-black text-rose-800 text-xl uppercase tracking-wider">Danger Zone</h3>
                            <p className="text-rose-600/80 font-medium mt-1">Irreversible actions. Proceed with extreme caution.</p>
                        </div>

                        {!showWipeConfirm ? (
                            <button
                                onClick={() => setShowWipeConfirm(true)}
                                className="px-6 py-3 bg-white border-2 border-rose-200 text-rose-600 font-bold rounded-xl hover:bg-rose-100 hover:border-rose-300 hover:scale-[1.02] active:scale-95 transition-all flex items-center gap-2"
                            >
                                <Trash2 size={18} />
                                Wipe Property Data
                            </button>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl border border-rose-200 shadow-sm space-y-4 animate-in fade-in slide-in-from-top-2">
                                <h4 className="font-bold text-rose-800">Confirm Data Wipe</h4>
                                <p className="text-sm text-slate-600">
                                    This will permanently delete ALL rooms, bookings, guests, and maintenance logs for this property.
                                    Users and the property record itself will be preserved.
                                </p>
                                <div className="space-y-2">
                                    <label className="text-xs font-bold text-slate-500 uppercase">Type property name to confirm</label>
                                    <input
                                        type="text"
                                        value={wipeConfirmationInput}
                                        onChange={(e) => setWipeConfirmationInput(e.target.value)}
                                        placeholder={property.name}
                                        className="w-full px-4 py-2 border border-rose-200 rounded-lg focus:ring-2 focus:ring-rose-500 outline-none font-bold"
                                    />
                                </div>
                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={handleWipeData}
                                        disabled={wipingData || wipeConfirmationInput !== property.name}
                                        className="px-4 py-2 bg-rose-600 text-white font-bold rounded-lg hover:bg-rose-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                                    >
                                        {wipingData ? <Loader2 className="animate-spin" size={16} /> : <Trash2 size={16} />}
                                        {wipingData ? 'Wiping...' : 'Confirm Wipe'}
                                    </button>
                                    <button
                                        onClick={() => setShowWipeConfirm(false)}
                                        className="px-4 py-2 text-slate-500 font-bold hover:bg-slate-50 rounded-lg transition-all"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        )}

                    </div>
                </div>
            </div>
        </div>
    );
};

export default Settings;
