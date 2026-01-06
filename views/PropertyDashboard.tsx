
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Layout from "../components/Layout";
import Dashboard from "./Dashboard";
import Guests from "./Guests";
import StaffTracker from "./StaffTracker";
import { useAuth } from "../components/AuthContext";
// Import other views if needed, e.g. Maintenance, Bookings

// Mock Data for properties to ensure we have context
// Ideally this comes from a hook or context
const MOCK_PROPERTIES = [
    {
        id: "p-london-01",
        name: "StaySync London Prime",
        location: "London, UK",
        totalRooms: 120
    },
    {
        id: "p-nyc-02",
        name: "StaySync NYC Central",
        location: "New York, USA",
        totalRooms: 240
    },
    {
        id: "p-dubai-03",
        name: "StaySync Dubai Resort",
        location: "Dubai, UAE",
        totalRooms: 350
    },
    {
        id: "demo",
        name: "StaySync Demo Hotel",
        location: "Virtual Space",
        totalRooms: 50
    }
];

export default function PropertyDashboard() {
    const { propertyId } = useParams<{ propertyId: string }>();
    const navigate = useNavigate();
    const { user, loading } = useAuth();
    const [activeTab, setActiveTab] = useState("dashboard");

    // Find key property details
    const currentProperty = MOCK_PROPERTIES.find(p => p.id === propertyId) || MOCK_PROPERTIES[0];
    const isDemoMode = propertyId === 'demo';

    const handleLogout = () => {
        // Sign out logic
        // For now, redirect to login
        navigate('/login');
    };

    const handlePropertyChange = (prop: any) => {
        navigate(`/dashboard/${prop.id}`);
    };

    if (loading) return <div className="p-10 font-bold text-center">Loading Property Context...</div>;

    // Redirect if not authenticated
    if (!user) {
        // Optionally use navigate here or rely on App 's protected routes if we had them.
        // Since we are inside the context, let's redirect.
        // We need to use useEffect to navigate during render or return null and navigate in effect.
        return <div className="p-10 font-bold text-center">Please Log In...</div>;
    }

    // Ensure we have a valid property context, else redirect (or show 404)
    if (!currentProperty) {
        return <div className="p-10 text-center">Property Not Found</div>;
    }

    return (
        <Layout
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            user={user}
            currentProperty={currentProperty}
            properties={MOCK_PROPERTIES} // Pass all available properties for the switcher
            onPropertyChange={handlePropertyChange}
            onLogout={handleLogout}
        >
            {activeTab === 'dashboard' && (
                <Dashboard
                    key={isDemoMode ? 'demo' : propertyId}
                    property={currentProperty}
                    isDemoMode={isDemoMode}
                    user={user}
                />
            )}

            {activeTab === 'guests' && <Guests user={user} />}
            {activeTab === 'staff' && <StaffTracker user={user} />}

            {/* Add other tab mappings here */}
            {activeTab === 'bookings' && <div className="p-10 font-bold text-slate-400">Bookings Module Loading...</div>}
            {activeTab === 'rooms' && <div className="p-10 font-bold text-slate-400">Room Management Module Loading...</div>}
        </Layout>
    );
}
