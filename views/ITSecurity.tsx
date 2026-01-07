import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Shield,
    Server,
    Lock,
    Activity,
    Wifi,
    FileKey,
    CheckCircle2,
    ArrowRight,
    MonitorCheck,
    AlertTriangle
} from 'lucide-react';

const ITSecurity: React.FC = () => {
    return (
        <div className="min-h-screen bg-white font-sans text-slate-900 selection:bg-indigo-500 selection:text-white overflow-x-hidden">

            {/* --- NAVIGATION --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900 text-white shadow-md">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-indigo-600/20 group-hover:scale-105 transition-transform">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">StaySync IT</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/digital-solutions" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Digital Solutions
                        </Link>
                        <Link
                            to="/login"
                            className="px-5 py-2 bg-indigo-600 text-white text-sm font-bold rounded-full hover:bg-indigo-500 transition-all shadow-lg hover:translate-y-px"
                        >
                            Client Portal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 bg-slate-900 text-white overflow-hidden">
                {/* Abstract Background */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10"></div>
                <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] pointer-events-none"></div>

                <div className="max-w-4xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-900/50 border border-indigo-500/30 text-indigo-300 text-xs font-bold uppercase tracking-widest mb-6">
                            <Shield size={14} /> Enterprise-Grade Protection
                        </div>
                        <h1 className="text-5xl lg:text-6xl font-black mb-6 tracking-tight">
                            IT Infrastructure & <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-cyan-400">
                                Cybersecurity
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
                            Defending your data and optimizing your network performance with military-grade security standards and proactive management.
                        </p>
                    </motion.div>
                </div>
            </section>

            {/* --- MAIN CONTENT SPLIT --- */}
            <section className="py-24 bg-slate-50">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 lg:gap-20">

                        {/* COLUMN 1: IT Management */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6 }}
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-indigo-600 mb-8 border border-slate-100">
                                <Server size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Comprehensive IT Management</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Our managed IT services ensure your daily operations run smoothly. We handle updates, patches, and user management so you can focus on your core business.
                            </p>

                            <ul className="space-y-4">
                                <ListItem text="Remote Monitoring & Management (RMM)" />
                                <ListItem text="24/7 Help Desk Support" />
                                <ListItem text="Hardware Procurement & Lifecycle" />
                                <ListItem text="Network Optimization (Wi-Fi 6E)" />
                                <ListItem text="Cloud Infrastructure Management" />
                            </ul>
                        </motion.div>

                        {/* COLUMN 2: Cybersecurity */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-rose-500 mb-8 border border-slate-100">
                                <Lock size={32} />
                            </div>
                            <h2 className="text-3xl font-bold text-slate-900 mb-6">Cybersecurity Defense</h2>
                            <p className="text-lg text-slate-600 mb-8 leading-relaxed">
                                Cyber threats are evolving. Our multi-layered security approach protects your endpoints, network, and cloud data from ransomware and phishing attacks.
                            </p>

                            <ul className="space-y-4">
                                <ListItem text="Threat Detection & Response (EDR/MDR)" iconColor="rose" />
                                <ListItem text="Next-Gen Firewall Configuration" iconColor="rose" />
                                <ListItem text="Security Audits & Compliance (PCI-DSS)" iconColor="rose" />
                                <ListItem text="Employee Security Training" iconColor="rose" />
                                <ListItem text="Data Backup & Disaster Recovery" iconColor="rose" />
                            </ul>
                        </motion.div>

                    </div>
                </div>
            </section>

            {/* --- FEATURE HIGHLIGHTS --- */}
            <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-16">
                        <h2 className="text-3xl font-black text-slate-900">Why choose StaySync Security?</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <FeatureBox
                            icon={<MonitorCheck />}
                            title="Proactive Monitoring"
                            text="We stop problems before they disrupt your business. Our AI-driven tools detect anomalies instantly."
                        />
                        <FeatureBox
                            icon={<FileKey />}
                            title="Data Privacy First"
                            text="We ensure guest data is encrypted in transit and at rest, fully compliant with GDPR and local laws."
                        />
                        <FeatureBox
                            icon={<AlertTriangle />}
                            title="Zero-Trust Architecture"
                            text="Trust no one, verify everything. We implement strict identity controls for every access request."
                        />
                    </div>
                </div>
            </section>

            {/* --- CTA FOOTER --- */}
            <section className="py-20 bg-indigo-600 text-white relative overflow-hidden">
                {/* Background Pattern */}
                <div className="absolute inset-0 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:20px_20px]"></div>

                <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
                    <h2 className="text-4xl font-black mb-6">Ready to secure your business?</h2>
                    <p className="text-indigo-100 text-lg mb-10">
                        Get a comprehensive security assessment today and discover vulnerabilities before hackers do.
                    </p>
                    <div className="flex flex-col sm:flex-row justify-center gap-4">
                        <button className="px-8 py-4 bg-white text-indigo-600 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1">
                            Get Free Assessment
                        </button>
                        <button className="px-8 py-4 bg-transparent border-2 border-white text-white rounded-full font-bold text-lg hover:bg-white/10 transition-all">
                            Contact Support
                        </button>
                    </div>
                </div>
            </section>

            {/* --- SIMPLE FOOTER --- */}
            <footer className="bg-slate-900 text-slate-500 py-12 text-center text-sm font-medium border-t border-slate-800">
                <p>&copy; 2026 StaySync Technologies. IT & Cybersecurity Division.</p>
            </footer>

        </div>
    );
};

// --- SUB-COMPONENTS ---

const ListItem: React.FC<{ text: string, iconColor?: 'indigo' | 'rose' }> = ({ text, iconColor = 'indigo' }) => (
    <div className="flex items-center gap-3">
        <div className={`p-1 rounded-full ${iconColor === 'rose' ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'}`}>
            <CheckCircle2 size={16} />
        </div>
        <span className="font-medium text-slate-700">{text}</span>
    </div>
);

const FeatureBox: React.FC<{ icon: React.ReactNode, title: string, text: string }> = ({ icon, title, text }) => (
    <div className="p-8 rounded-3xl bg-slate-50 border border-slate-100 hover:shadow-xl hover:bg-white transition-all duration-300">
        <div className="w-12 h-12 rounded-xl bg-slate-900 text-white flex items-center justify-center mb-6">
            {icon}
        </div>
        <h3 className="text-xl font-bold text-slate-900 mb-3">{title}</h3>
        <p className="text-slate-500 leading-relaxed font-medium">{text}</p>
    </div>
);

export default ITSecurity;
