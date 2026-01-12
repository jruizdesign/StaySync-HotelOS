import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from './AuthContext';
import { Loader2 } from 'lucide-react';

export const AdminGuard = () => {
    const { dbProfile, loading, user } = useAuth();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-slate-50">
                <Loader2 className="animate-spin text-blue-600" size={32} />
            </div>
        );
    }

    // 1. Must be logged in
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    // 2. Must be ADMIN
    if (dbProfile?.role !== 'ADMIN') {
        // Redirect to their default dashboard if available, or just a safe fallback
        const fallback = dbProfile?.defaultPropertyId
            ? `/dashboard/${dbProfile.defaultPropertyId}`
            : '/';

        return <Navigate to={fallback} replace />;
    }

    return <Outlet />;
};
