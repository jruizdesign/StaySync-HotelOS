import { useState, useEffect, useContext, createContext } from "react";
import { getAuth, onAuthStateChanged, User } from "firebase/auth";

export interface CustomClaims {
    role?: string;
    propertyId?: string;
    [key: string]: any;
}

interface AuthContextType {
    user: User | null;
    claims: CustomClaims | null;
    loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, claims: null, loading: true });

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [claims, setClaims] = useState<CustomClaims | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
            if (firebaseUser) {
                // 1. Get the latest token to ensure we have the custom claims
                const tokenResult = await firebaseUser.getIdTokenResult(true);

                setUser(firebaseUser);
                setClaims(tokenResult.claims); // This contains { role, propertyId }
            } else {
                setUser(null);
                setClaims(null);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, []);

    return (
        <AuthContext.Provider value={{ user, claims, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
