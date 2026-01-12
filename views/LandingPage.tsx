import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import {
    Building2,
    Bot,
    TrendingUp,
    ChevronRight,
    LayoutDashboard,
    ShieldCheck,
    Users,
    Zap,
    Check,
    Globe,
    Star,
    ArrowRight
} from 'lucide-react';

const LandingPage: React.FC = () => {
    const { scrollY } = useScroll();
    const opacity = useTransform(scrollY, [0, 300], [0, 1]);
    const heroY = useTransform(scrollY, [0, 500], [0, 200]);

    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 50);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    return (
        <div className="min-h-screen bg-slate-50 overflow-x-hidden font-sans text-slate-900">

            {/* --- NAVIGATION --- */}
            <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/80 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
                <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight text-slate-900">StaySync OS</span>
                    </div>

                    <div className="hidden md:flex items-center gap-8">
                        <Link to="/digital-solutions" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            Digital Solutions
                        </Link>
                        <Link to="/it-security" className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                            IT & Cybersecurity
                        </Link>
                        {['Product', 'Pricing', 'Resources'].map((item) => (
                            <a key={item} href={`#${item.toLowerCase()}`} className="text-sm font-medium text-slate-600 hover:text-blue-600 transition-colors">
                                {item}
                            </a>
                        ))}
                    </div>

                    <div className="flex items-center gap-4">
                        <Link
                            to="/super-admin"
                            className="px-6 py-2.5 bg-transparent border border-slate-200 text-slate-600 hover:bg-slate-50 text-sm font-bold rounded-full transition-all flex items-center gap-2"
                        >
                            <ShieldCheck size={16} /> Admin
                        </Link>
                        <Link
                            to="/login"
                            className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-full hover:bg-slate-800 transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5 flex items-center gap-2"
                        >
                            Login to Property <ArrowRight size={16} />
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
                {/* Abstract Background Shapes */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[600px] bg-blue-100/50 rounded-full blur-[120px] -z-10 mix-blend-multiply opacity-70 animate-blob"></div>
                <div className="absolute top-0 right-0 w-[800px] h-[600px] bg-indigo-100/50 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-70 animate-blob animation-delay-2000"></div>
                <div className="absolute -bottom-32 left-0 w-[800px] h-[600px] bg-purple-100/50 rounded-full blur-[100px] -z-10 mix-blend-multiply opacity-70 animate-blob animation-delay-4000"></div>

                <div className="max-w-7xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/60 backdrop-blur-sm border border-slate-200 shadow-sm mb-8">
                            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></span>
                            <span className="text-xs font-bold text-slate-600 uppercase tracking-wide">The Future of Hospitality is Here</span>
                        </div>

                        <h1 className="text-5xl lg:text-7xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8">
                            The Operating System for <br className="hidden md:block" />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                                Modern Hospitality
                            </span>
                        </h1>

                        <p className="text-lg lg:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Streamline operations, automate guest communication, and manage your entire property portfolio with Al-driven insights. Everything you need to run your hotel, in one unified platform.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <Link to="/login" className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-600/30 hover:-translate-y-1 w-full sm:w-auto">
                                Get Started Free
                            </Link>
                            <button className="px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-full font-bold text-lg hover:bg-slate-50 transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 w-full sm:w-auto flex items-center justify-center gap-2">
                                <Globe size={20} /> View Live Demo
                            </button>
                        </div>
                    </motion.div>

                    {/* Hero Visual */}
                    <motion.div
                        style={{ y: heroY }}
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 1 }}
                        className="mt-20 relative"
                    >
                        <div className="relative rounded-3xl overflow-hidden shadow-2xl border-4 border-white/50 ring-1 ring-slate-900/5 bg-slate-900 mx-auto max-w-5xl aspect-[16/9] group">
                            {/* Fake UI Overlay */}
                            <div className="absolute inset-0 bg-gradient-to-br from-slate-800 to-slate-950 flex items-center justify-center">
                                {/* Dashboard Mockup - Simplified representation */}
                                <div className="grid grid-cols-12 gap-6 p-8 w-full h-full opacity-90">
                                    <div className="col-span-3 bg-slate-800/50 rounded-2xl p-4 border border-white/5"></div>
                                    <div className="col-span-9 grid grid-rows-3 gap-6">
                                        <div className="grid grid-cols-3 gap-6 row-span-1">
                                            <div className="bg-blue-500/10 border border-blue-500/20 rounded-2xl"></div>
                                            <div className="bg-indigo-500/10 border border-indigo-500/20 rounded-2xl"></div>
                                            <div className="bg-purple-500/10 border border-purple-500/20 rounded-2xl"></div>
                                        </div>
                                        <div className="row-span-2 bg-slate-800/50 rounded-2xl border border-white/5"></div>
                                    </div>
                                </div>
                            </div>

                            {/* Floating Cards */}
                            <motion.div
                                animate={{ y: [0, -20, 0] }}
                                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -right-8 top-20 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40 max-w-[240px]"
                            >
                                <div className="flex items-center gap-3 mb-3">
                                    <div className="p-2 bg-green-100 text-green-600 rounded-lg"><TrendingUp size={20} /></div>
                                    <div>
                                        <p className="text-xs font-bold text-slate-400">RevPAR</p>
                                        <p className="text-lg font-black text-slate-900">+127%</p>
                                    </div>
                                </div>
                                <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
                                    <div className="h-full bg-green-500 w-[70%]"></div>
                                </div>
                            </motion.div>

                            <motion.div
                                animate={{ y: [0, 20, 0] }}
                                transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                                className="absolute -left-8 bottom-20 bg-white/90 backdrop-blur-xl p-5 rounded-2xl shadow-xl border border-white/40 max-w-[260px]"
                            >
                                <div className="flex items-start gap-3">
                                    <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Bot size={20} /></div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-900 mb-1">AI Concierge</p>
                                        <p className="text-xs text-slate-500 leading-snug">"Guest in Room 304 requested late checkout. Approved automatically."</p>
                                    </div>
                                </div>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- LOGO WALL --- */}
            <section className="py-10 border-y border-slate-200 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest mb-8">Trusted by modern hotels worldwide</p>
                    <div className="flex flex-wrap justify-center items-center gap-12 lg:gap-24 opacity-60 grayscale hover:grayscale-0 transition-all duration-500">
                        {['Marriott', 'Hilton', 'Hyatt', 'Four Seasons', 'Accor'].map(brand => (
                            <span key={brand} className="text-xl font-black text-slate-800">{brand}</span>
                        ))}
                    </div>
                </div>
            </section>

            {/* --- FEATURES GRID --- */}
            <section className="py-24 bg-slate-50" id="solutions">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center max-w-3xl mx-auto mb-20">
                        <h2 className="text-4xl font-black text-slate-900 mb-6">Everything you need to scale</h2>
                        <p className="text-lg text-slate-500">Simplify the complexity of hotel management with a suite of powerful, integrated tools designed for the modern hotelier.</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureCard
                            icon={<Building2 size={32} />}
                            title="Property Management"
                            description="Real-time room availability, housekeeping status, and maintenance tracking in one intuitive dashboard."
                            color="blue"
                        />
                        <FeatureCard
                            icon={<Bot size={32} />}
                            title="AI Automation"
                            description="Automated guest messaging, document analysis, and predictive insights powered by advanced AI."
                            color="indigo"
                        />
                        <FeatureCard
                            icon={<TrendingUp size={32} />}
                            title="Financial Control"
                            description="Integrated invoicing, expense tracking, and revenue reporting to keep your business profitable."
                            color="purple"
                        />
                    </div>

                    <div className="mt-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                        <div className="bg-white rounded-[2rem] p-8 lg:p-12 shadow-2xl border border-slate-100">
                            <div className="flex items-center gap-4 mb-8">
                                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white shadow-lg">
                                    <LayoutDashboard size={24} />
                                </div>
                                <h3 className="text-2xl font-bold text-slate-900">Live Operations Control</h3>
                            </div>
                            <ul className="space-y-4">
                                {['Real-time Housekeeping Updates', 'Instant Guest Check-in/out', 'Maintenance Ticket Tracking', 'Staff Shift Management', 'Inventory Control'].map((item, i) => (
                                    <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                                        <div className="w-6 h-6 rounded-full bg-green-100 text-green-600 flex items-center justify-center shrink-0">
                                            <Check size={14} />
                                        </div>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                        <div>
                            <span className="text-blue-600 font-bold tracking-wide uppercase text-sm">Seamless Integration</span>
                            <h3 className="text-4xl font-black text-slate-900 mt-2 mb-6">Connect your entire tech stack</h3>
                            <p className="text-slate-500 text-lg leading-relaxed mb-8">
                                StaySync OS integrates with your existing OTA channels, payment gateways, and door lock systems. No more manual data entry or double bookings.
                            </p>
                            <Link to="/login" className="inline-flex items-center gap-2 font-bold text-blue-600 hover:text-blue-700 hover:underline">
                                Explore Integrations <ChevronRight size={16} />
                            </Link>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- CTA SECTION --- */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 rounded-[3rem] p-12 lg:p-24 text-center relative overflow-hidden shadow-2xl">
                        {/* Background glow */}
                        <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>

                        <h2 className="text-4xl lg:text-5xl font-black text-white mb-8 relative z-10">Ready to transform your<br />hotel operations?</h2>
                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 relative z-10">
                            <Link to="/login" className="px-10 py-5 bg-white text-blue-900 rounded-full font-bold text-lg hover:bg-blue-50 transition-all shadow-xl hover:-translate-y-1">
                                Start for Free
                            </Link>
                            <button className="px-10 py-5 bg-transparent border border-white/30 text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                                Talk to Sales
                            </button>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER --- */}
            <footer className="bg-slate-900 text-slate-400 py-20">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 border-b border-slate-800 pb-12">
                    <div className="col-span-1 md:col-span-2">
                        <div className="flex items-center gap-2 mb-6">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center text-white font-black text-sm">S</div>
                            <span className="text-lg font-bold text-white">StaySync OS</span>
                        </div>
                        <p className="max-w-sm mb-8">The all-in-one operating system for modern hotels, vacation rentals, and hospitality groups.</p>
                        <div className="flex gap-4">
                            {/* Socials placeholder */}
                            {[1, 2, 3, 4].map(i => (
                                <div key={i} className="w-10 h-10 rounded-full bg-slate-800 hover:bg-slate-700 transition-colors"></div>
                            ))}
                        </div>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Product</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Features</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Pricing</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Integrations</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Enterprise</a></li>
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-white font-bold mb-6">Company</h4>
                        <ul className="space-y-4">
                            <li><a href="#" className="hover:text-blue-500 transition-colors">About</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Careers</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Blog</a></li>
                            <li><a href="#" className="hover:text-blue-500 transition-colors">Contact</a></li>
                        </ul>
                    </div>
                </div>
                <div className="max-w-7xl mx-auto px-6 pt-8 flex flex-col md:flex-row justify-between items-center text-sm font-medium">
                    <p>&copy; 2026 StaySync Technologies. All rights reserved.</p>
                    <div className="flex gap-8 mt-4 md:mt-0">
                        <a href="#" className="hover:text-white">Privacy Policy</a>
                        <a href="#" className="hover:text-white">Terms of Service</a>
                    </div>
                </div>
            </footer>
        </div>
    );
};

// Feature Card Component
const FeatureCard: React.FC<{ icon: React.ReactNode, title: string, description: string, color: 'blue' | 'indigo' | 'purple' }> = ({ icon, title, description, color }) => {
    const colorClasses = {
        blue: "bg-blue-50 text-blue-600 group-hover:bg-blue-600 group-hover:text-white",
        indigo: "bg-indigo-50 text-indigo-600 group-hover:bg-indigo-600 group-hover:text-white",
        purple: "bg-purple-50 text-purple-600 group-hover:bg-purple-600 group-hover:text-white",
    };

    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group p-8 bg-white rounded-[2rem] border border-slate-100 shadow-lg hover:shadow-2xl transition-all duration-300"
        >
            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 transition-colors duration-300 ${colorClasses[color]}`}>
                {icon}
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
            <p className="text-slate-500 leading-relaxed font-medium">
                {description}
            </p>
        </motion.div>
    );
};

export default LandingPage;
