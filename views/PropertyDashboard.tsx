import React, { useState, useMemo } from "react";
import { Building2 } from "lucide-react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Layout from "../components/Layout";
import { useQuery } from '@tanstack/react-query';
import { getPropertyDashboard, adminListProperties } from '@firebasegen/default';
import { Outlet } from 'react-router-dom';

// inside PropertyDashboard JSX:

// Import your views
import Dashboard from "./Dashboard";
import Guests from "./Guests";
import Maintenance from "./Maintenance";
import Accounting from "./Accounting";
import Bookings from "./Bookings";
import FeatureRequests from "./FeatureRequests";
import StaffTracker from "./StaffTracker";
import Rooms from "./Rooms";
import Settings from "./Settings";
import SystemLogs from "./SystemLogs";
import DailyOverview from "./DailyOverview";
import AIChat from "../components/AIChat";
import { User } from "../types"; // Import your custom type

// MOCK_PROPERTIES removed for production

export default function PropertyDashboard() {
    const { propertyId } = useParams<{ propertyId: string }>();
    const navigate = useNavigate();
    const { user: firebaseUser, claims, loading } = useAuth(); // Rename 'user' to 'firebaseUser' to avoid confusion

    const [activeTab, setActiveTab] = useState("dashboard");
    const [maintenanceTasks, setMaintenanceTasks] = useState([]);
    const [featureRequests, setFeatureRequests] = useState([]);

    // --- 1. THE FIX: Create a 'Safe User' object that matches your TypeScript interface ---
    // We combine the Firebase Auth data with the Custom Claims data
    const appUser: User | null = useMemo(() => {
        if (!firebaseUser) return null;
        return {
            id: firebaseUser.uid, // Assuming Firebase UID can serve as the User ID
            uid: firebaseUser.uid,
            email: firebaseUser.email || "",
            name: firebaseUser.displayName || "Staff Member",
            role: (claims?.role as any) || "STAFF", // Cast to match your UserRole type
            propertyId: claims?.propertyId,
            photoUrl: firebaseUser.photoURL || undefined
        };
    }, [firebaseUser, claims]);

    // Fetch Real Data if not demo
    const isDemoMode = propertyId === 'demo';

    const { data: dashboardData, isLoading: isLoadingData } = useQuery({
        queryKey: ['dashboard', propertyId],
        queryFn: async () => {
            if (isDemoMode || !propertyId) return null;
            const res = await getPropertyDashboard({ propertyId });
            return res.data;
        },
        enabled: !!propertyId && !isDemoMode
    });

    // Fetch Properties List for Admin Selector
    const { data: propertiesList } = useQuery({
        queryKey: ['admin-properties'],
        queryFn: async () => {
            const res = await adminListProperties();
            return res.data.properties;
        },
        // Only fetch if user is admin (and we have the user object)
        enabled: !!appUser && appUser.role === 'SYSTEM_ADMIN'
    });

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!appUser) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <p>Access Restricted</p>
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Log In</button>
            </div>
        );
    }

    const currentProperty = dashboardData?.property
        ? { ...dashboardData.property, rooms: dashboardData.rooms?.length || 0 }
        : null;

    if (!currentProperty && !isLoadingData) {
        return (
            <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center animate-in fade-in zoom-in duration-500">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-[2rem] flex items-center justify-center mb-8 shadow-xl shadow-blue-200">
                    <Building2 size={48} />
                </div>
                <h1 className="text-3xl font-black text-slate-900 mb-2">Welcome to StaySync</h1>
                <p className="text-slate-500 font-medium max-w-md mx-auto mb-10">
                    Your account is active but not yet linked to a property. Create your first hotel property to get started.
                </p>

                <button
                    onClick={() => navigate('/admin/properties')}
                    className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-xl shadow-slate-900/20 hover:scale-105 transition-all text-sm uppercase tracking-widest"
                >
                    View Property Portfolio
                </button>
                <button
                    onClick={() => navigate('/login')}
                    className="mt-6 text-slate-400 font-bold text-xs uppercase tracking-widest hover:text-slate-600"
                >
                    Switch Account
                </button>
            </div>
        );
    }

    return (
        <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={appUser}
            currentProperty={currentProperty as any}
            properties={(propertiesList as any[]) || []}
            onPropertyChange={(p) => navigate(`/dashboard/${p.id}`)}
            onLogout={() => navigate('/login')}
        >
            {activeTab === 'dashboard' && (
                <Dashboard
                    property={currentProperty as any}
                    isDemoMode={isDemoMode}
                    user={appUser}
                />
            )}

            {activeTab === 'daily-overview' && (
                <DailyOverview propertyId={propertyId || ''} />
            )}

            {activeTab === 'guests' && <Guests isDemoMode={isDemoMode} />}

            {activeTab === 'maintenance' && (
                <Maintenance
                    isDemoMode={isDemoMode}
                    tasks={maintenanceTasks}
                    onAddTask={(t: any) => setMaintenanceTasks((prev: any) => [t, ...prev])}
                    onUpdateTask={(t: any) => setMaintenanceTasks((prev: any) => prev.map((old: any) => old.id === t.id ? t : old))}
                    onDeleteTask={(id: string) => setMaintenanceTasks((prev: any) => prev.filter((t: any) => t.id !== id))}
                />
            )}

            {activeTab === 'accounting' && (
                <Accounting isDemoMode={isDemoMode} maintenanceTasks={maintenanceTasks} />
            )}

            {activeTab === 'bookings' && <Bookings isDemoMode={isDemoMode} propertyId={propertyId} />}

            {activeTab === 'rooms' && (
                <Rooms
                    isDemoMode={isDemoMode}
                    user={appUser}
                    propertyId={propertyId}
                />
            )}

            {activeTab === 'features' && (
                <FeatureRequests
                    requests={featureRequests}
                    user={appUser}
                    onAddRequest={(r: any) => setFeatureRequests((prev: any) => [r, ...prev])}
                    onUpdateRequest={(r: any) => setFeatureRequests((prev: any) => prev.map((old: any) => old.id === r.id ? r : old))}
                />
            )}

            {activeTab === 'staff' && (
                <StaffTracker
                    user={appUser}
                    isDemoMode={isDemoMode}
                    propertyId={propertyId}
                    staffList={isDemoMode ? undefined : dashboardData?.users}
                />
            )}

            {activeTab === 'logs' && (
                <SystemLogs
                    isDemoMode={isDemoMode}
                    property={currentProperty as any}
                />
            )}

            {activeTab === 'settings' && (
                <Settings
                    property={currentProperty as any}
                    isDemoMode={isDemoMode}
                    dashboardData={dashboardData}
                />
            )}

            <AIChat />
        </Layout>
    );
}