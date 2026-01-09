import { createContext, useEffect, useState, useContext, ReactNode } from 'react';
import { onAuthStateChanged, User as FirebaseUser } from 'firebase/auth';
import { auth } from '../lib/firebase';
import { api } from '../lib/api';

interface DbProfile {
    id: string;
    email: string;
    name: string;
    role: string;
    defaultPropertyId: string;
    // add other fields as needed based on your API response
}

interface AuthContextType {
    user: FirebaseUser | null;
    dbProfile: DbProfile | null;
    hotelId: string | null;
    switchProperty: (id: string) => void;
    loading: boolean;
    // Add claims if you are using them in App.tsx
    claims?: CustomClaims;
}

export interface CustomClaims {
    role: string;
    propertyId?: string;
    hotelId?: string; // Legacy/Backend field support
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [user, setUser] = useState<FirebaseUser | null>(null);
    const [dbProfile, setDbProfile] = useState<DbProfile | null>(null);
    const [hotelId, setHotelId] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // 1. Listen for Firebase Auth (Identity)
        const unsub = onAuthStateChanged(auth, async (fbUser) => {
            setUser(fbUser);

            if (fbUser) {
                // 2. Fetch "Real" Profile from Postgres API
                // This gets us the Role and Default Property ID
                try {
                    const profile = await api.users.getMe(fbUser.uid);
                    setDbProfile(profile);
                    if (profile?.defaultPropertyId) {
                        setHotelId(profile.defaultPropertyId);
                    }
                } catch (e) {
                    console.error("User not in SQL DB", e);
                }
            } else {
                setDbProfile(null);
                setHotelId(null);
            }
            setLoading(false);
        });
        return () => unsub();
    }, []);

    const switchProperty = (id: string) => setHotelId(id);

    return (
        <AuthContext.Provider value={{ user, dbProfile, hotelId, switchProperty, loading }}>
            {children}
        </AuthContext.Provider>
    );
};