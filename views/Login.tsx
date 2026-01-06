
import React, { useState, FormEvent } from "react";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
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

    const navigate = useNavigate();

    const handleLogin = async (e: FormEvent) => {
        e.preventDefault();
        setIsLoggingIn(true);
        setError(null);

        const auth = getAuth();

        try {
            // 1. Sign In
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // 2. Fetch the latest Claims (Roles/PropertyId)
            const tokenResult = await user.getIdTokenResult(true);
            const claims = tokenResult.claims as CustomClaims;

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
                </form>
            </div>
        </div>
    );
}
