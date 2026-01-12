
import React, { useState, FormEvent } from "react";
import { getAuth, signInWithEmailAndPassword, setPersistence, browserLocalPersistence, browserSessionPersistence, GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { CustomClaims } from "../components/AuthContext";
import { useNavigate } from "react-router-dom";
import { ShieldCheck, User, Lock, ArrowRight, Loader2 } from 'lucide-react';

// NOTE: Since we don't have react-router-dom set up in App.tsx yet, we'll emit an event or rely on App.tsx to handle the redirect based on auth state change.
// For now, I am integrating your logic into the existing UI design I created.

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [isLoggingIn, setIsLoggingIn] = useState(false);
    const [rememberMe, setRememberMe] = useState(false);

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError(null);

        const auth = getAuth();

        try {
            // 1. Set Persistence
            await setPersistence(auth, rememberMe ? browserLocalPersistence : browserSessionPersistence);

            // 2. Sign In
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch the latest Claims (Roles/PropertyId)
            const tokenResult = await user.getIdTokenResult(true);
            const claims = tokenResult.claims as unknown as CustomClaims;

            console.log("Login Success. Role:", claims.role, "Property:", claims.propertyId);

            // 3. The Logic Switch
            if (claims.role === "SUPER_ADMIN") {
                navigate("/admin/properties");
            }
            else if (claims.propertyId) {
                navigate(`/dashboard/${claims.propertyId}`);
            }
            else {
                // Default fallback
                navigate("/dashboard/demo");
            }

        } catch (err: any) {
            console.error(err);
            setError("Failed to sign in. Please check your email and password.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    const handleGoogleLogin = async () => {
        setIsLoggingIn(true);
        setError(null);
        const auth = getAuth();
        const provider = new GoogleAuthProvider();

        try {
            await setPersistence(auth, browserLocalPersistence);
            const result = await signInWithPopup(auth, provider);
            const user = result.user;

            // Fetch Claims
            const tokenResult = await user.getIdTokenResult(true);
            const claims = tokenResult.claims as unknown as CustomClaims;

            console.log("Google Login Success. Claims:", claims);

            if (claims.role === "SUPER_ADMIN") {
                navigate("/admin/properties");
            } else if (claims.propertyId) {
                navigate(`/dashboard/${claims.propertyId}`);
            } else {
                // Determine if we should show an error or just let them in as a "Guest" / Demo user
                // For now, let's allow them to see the demo dashboard, but maybe show a toast later
                navigate("/dashboard/demo");
            }
        } catch (err: any) {
            console.error(err);
            setError("Google Sign-In failed. Please try again.");
        } finally {
            setIsLoggingIn(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-900 flex items-center justify-center p-6 relative overflow-hidden">
            {/* Background Gradients */}
            <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[100px] -mr-32 -mt-32"></div>
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[100px] -ml-32 -mb-32"></div>

            <div className="bg-white rounded-[2.5rem] p-10 md:p-14 w-full max-w-xl shadow-2xl relative z-10 animate-in fade-in zoom-in duration-500 border border-slate-100">
                <div className="text-center mb-10">
                    <div className="inline-flex p-4 rounded-2xl bg-slate-900 text-white mb-6 shadow-xl shadow-slate-900/30">
                        <ShieldCheck size={32} />
                    </div>
                    <h1 className="text-3xl font-black text-slate-900 mb-2 tracking-tight">StaySync OS</h1>
                    <p className="text-slate-500 font-medium">Enterprise Hotel Management Environment</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-4">Officer Email</label>
                        <div className="relative">
                            <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="email"
                                placeholder="officer@staysync.com"
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-[10px] uppercase font-black tracking-widest text-slate-400 pl-4">Security Key</label>
                        <div className="relative">
                            <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-300" size={18} />
                            <input
                                type="password"
                                placeholder="Password"
                                className="w-full pl-14 pr-6 py-5 bg-slate-50 border border-slate-200 rounded-2xl text-slate-800 font-bold focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 outline-none transition-all"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                disabled={isLoggingIn}
                            />
                        </div>
                    </div>

                    {error && (
                        <div className="p-4 bg-rose-50 rounded-2xl border border-rose-100 text-xs font-bold text-rose-600 flex items-center justify-center gap-2">
                            <ShieldCheck size={14} />
                            {error}
                        </div>
                    )}

                    <div className="flex items-center gap-3 pl-4">
                        <input
                            type="checkbox"
                            id="rememberMe"
                            className="w-5 h-5 rounded-md border-slate-300 text-blue-600 focus:ring-blue-500 bg-slate-50 cursor-pointer"
                            checked={rememberMe}
                            onChange={(e) => setRememberMe(e.target.checked)}
                        />
                        <label htmlFor="rememberMe" className="text-sm font-bold text-slate-500 cursor-pointer select-none">
                            Keep me logged in
                        </label>
                    </div>

                    <button
                        type="submit"
                        className="w-full py-5 bg-blue-600 hover:bg-blue-700 text-white rounded-2xl font-bold uppercase tracking-widest shadow-xl shadow-blue-200 transition-all active:scale-95 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                        disabled={isLoggingIn}
                    >
                        {isLoggingIn ? (
                            <>
                                <Loader2 size={18} className="animate-spin" />
                                Verifying...
                            </>
                        ) : (
                            <>
                                Authenticate Access <ArrowRight size={18} />
                            </>
                        )}
                    </button>

                    <div className="relative flex items-center justify-center my-6">
                        <div className="absolute w-full border-t border-slate-200"></div>
                        <div className="relative bg-white px-4 text-xs font-bold text-slate-400 uppercase tracking-widest">Or Continue With</div>
                    </div>

                    <button
                        type="button"
                        onClick={handleGoogleLogin}
                        disabled={isLoggingIn}
                        className="w-full py-4 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold flex items-center justify-center gap-3 hover:bg-slate-50 transition-all hover:shadow-lg disabled:opacity-70"
                    >
                        {/* Google Logo */}
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                        </svg>
                        Sign in with Google
                    </button>
                </form>
            </div>
        </div>
    );
}
