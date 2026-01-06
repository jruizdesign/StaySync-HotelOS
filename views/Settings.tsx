import React, { useState, useEffect } from 'react';
import { Property } from '../types';
import { Save, Building2, MapPin, Phone, Mail, Loader2, CheckCircle2 } from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { updateProperty } from '@firebasegen/default';

interface SettingsProps {
    property: Property;
    isDemoMode: boolean;
}

const Settings: React.FC<SettingsProps> = ({ property, isDemoMode }) => {
    const queryClient = useQueryClient();
    const [formData, setFormData] = useState({
        name: property.name,
        address: property.address || '',
        email: property.email || '',
        phoneNumber: property.phoneNumber || ''
    });
    const [isSaving, setIsSaving] = useState(false);
    const [showSuccess, setShowSuccess] = useState(false);

    useEffect(() => {
        setFormData({
            name: property.name,
            address: property.address || '',
            email: property.email || '',
            phoneNumber: property.phoneNumber || ''
        });
    }, [property]);

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
            alert("Failed to update settings.");
        }
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSaving(true);

        if (isDemoMode) {
            await new Promise(resolve => setTimeout(resolve, 1000));
            setShowSuccess(true);
            setTimeout(() => setShowSuccess(false), 3000);
        } else {
            await mutation.mutateAsync(formData);
        }

        setIsSaving(false);
    };

    return (
        <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold text-slate-800">Settings</h1>
                    <p className="text-slate-500 text-sm">Manage global property configurations and contact details.</p>
                </div>
            </div>

            <div className="bg-white rounded-3xl p-8 border border-slate-100 shadow-sm">
                <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Property Identity */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                            <Building2 className="text-blue-600" size={20} />
                            <h3 className="font-bold text-slate-800 text-lg">Property Identity</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider">Property Name</label>
                                <input
                                    type="text"
                                    value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-bold text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <MapPin size={14} /> Address
                                </label>
                                <input
                                    type="text"
                                    value={formData.address}
                                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-3 pb-2 border-b border-slate-50">
                            <Phone className="text-blue-600" size={20} />
                            <h3 className="font-bold text-slate-800 text-lg">Contact Information</h3>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Mail size={14} /> Email Address
                                </label>
                                <input
                                    type="email"
                                    value={formData.email}
                                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                                    <Phone size={14} /> Phone Number
                                </label>
                                <input
                                    type="tel"
                                    value={formData.phoneNumber}
                                    onChange={(e) => setFormData({ ...formData, phoneNumber: e.target.value })}
                                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-blue-500 outline-none font-medium text-slate-700"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center gap-4">
                        <button
                            type="submit"
                            disabled={isSaving}
                            className={`px-8 py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 flex items-center gap-2 transition-all active:scale-95 ${isSaving ? 'opacity-80' : 'hover:bg-slate-800'}`}
                        >
                            {isSaving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                            {isSaving ? 'Saving Changes...' : 'Save Configuration'}
                        </button>

                        {showSuccess && (
                            <div className="flex items-center gap-2 text-emerald-600 font-bold bg-emerald-50 px-4 py-3 rounded-xl animate-in fade-in slide-in-from-left-2">
                                <CheckCircle2 size={20} />
                                Settings Saved Successfully
                            </div>
                        )}
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Settings;
