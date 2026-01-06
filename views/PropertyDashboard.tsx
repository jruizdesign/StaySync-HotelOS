import React, { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "../components/AuthContext";
import Layout from "../components/Layout";
import { useQuery } from '@tanstack/react-query';
import { getPropertyDashboard } from '@firebasegen/default';

// Import your views
import Dashboard from "./Dashboard";
import Guests from "./Guests";
import Maintenance from "./Maintenance";
import Accounting from "./Accounting";
import Bookings from "./Bookings";
import FeatureRequests from "./FeatureRequests";
import StaffTracker from "./StaffTracker";
import Settings from "./Settings";
import SystemLogs from "./SystemLogs";
import { User } from "../types"; // Import your custom type

const MOCK_PROPERTIES = [
    { id: "p-london-01", name: "StaySync London Prime", location: "London, UK", rooms: 120 },
    { id: "p-nyc-02", name: "StaySync NYC Central", location: "New York, USA", rooms: 240 },
    { id: "demo", name: "StaySync Demo Hotel", location: "Virtual Sandbox", rooms: 50 }
];

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

    if (loading) return <div className="h-screen flex items-center justify-center">Loading...</div>;

    if (!appUser) {
        return (
            <div className="h-screen flex flex-col items-center justify-center gap-4">
                <p>Access Restricted</p>
                <button onClick={() => navigate('/login')} className="px-4 py-2 bg-blue-600 text-white rounded-lg">Log In</button>
            </div>
        );
    }

    const currentProperty = isDemoMode
        ? MOCK_PROPERTIES.find(p => p.id === 'demo')
        : (dashboardData?.property ? { ...dashboardData.property, rooms: 0 } : MOCK_PROPERTIES.find(p => p.id === propertyId));

    if (!currentProperty && !isLoadingData && !isDemoMode) return <div>Property Not Found</div>;

    return (
        <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={appUser} // Passing the converted appUser
            currentProperty={currentProperty as any}
            properties={MOCK_PROPERTIES}
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

            {/* 2. THE FIX: Guests only takes isDemoMode, removed 'user' prop */}
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

            {activeTab === 'bookings' && <Bookings isDemoMode={isDemoMode} />}

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
        </Layout>
    );
}