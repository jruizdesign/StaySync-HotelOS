import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Code2,
    Cloud,
    ShieldCheck,
    ArrowRight,
    Database,
    Cpu,
    Globe,
    Lock,
    ChevronRight
} from 'lucide-react';

const DigitalSolutions: React.FC = () => {
    return (
        <div className="min-h-screen bg-slate-900 font-sans text-white selection:bg-blue-500 selection:text-white overflow-x-hidden">

            {/* --- NAVIGATION --- */}
            <nav className="fixed top-0 left-0 right-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-white/10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link to="/" className="flex items-center gap-2 group">
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-lg shadow-blue-600/20 group-hover:scale-105 transition-transform">
                            S
                        </div>
                        <span className="text-xl font-bold tracking-tight">StaySync Digital</span>
                    </Link>

                    <div className="flex items-center gap-6">
                        <Link to="/" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            Home
                        </Link>
                        <Link to="/it-security" className="text-sm font-medium text-slate-300 hover:text-white transition-colors">
                            IT & Cybersecurity
                        </Link>
                        <Link
                            to="/login"
                            className="px-5 py-2 bg-white text-slate-900 text-sm font-bold rounded-full hover:bg-blue-50 transition-all shadow-lg hover:translate-y-px"
                        >
                            Client Portal
                        </Link>
                    </div>
                </div>
            </nav>

            {/* --- HERO SECTION --- */}
            <section className="relative pt-40 pb-32 lg:pt-52 lg:pb-48 overflow-hidden">
                {/* Background Effects */}
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20"></div>
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-blue-900/20 via-slate-900 to-slate-900"></div>

                {/* Animated Glows */}
                <div className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-blue-600/30 rounded-full blur-[120px] animate-pulse"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[140px] animate-blob animation-delay-2000"></div>

                <div className="max-w-5xl mx-auto px-6 relative z-10 text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                    >
                        <h1 className="text-5xl lg:text-7xl font-black mb-8 tracking-tight">
                            Empowering Your <br />
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400">
                                Digital Future
                            </span>
                        </h1>

                        <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                            We provide cutting-edge technology solutions to transform your business.
                            From custom software to enterprise- grade cybersecurity, we build the infrastructure for your growth.
                        </p>

                        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                            <button className="px-8 py-4 bg-blue-600 text-white rounded-full font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-600/20 hover:-translate-y-1 w-full sm:w-auto">
                                View IT Solutions
                            </button>
                            <button className="px-8 py-4 bg-slate-800 text-white border border-white/10 rounded-full font-bold text-lg hover:bg-slate-700 transition-all w-full sm:w-auto">
                                Schedule Consultation
                            </button>
                        </div>
                    </motion.div>
                </div>
            </section>

            {/* --- EXPERTISE GRID --- */}
            <section className="py-24 relative z-10">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="text-center mb-20">
                        <span className="text-blue-500 font-bold uppercase tracking-widest text-sm">Our Capabilities</span>
                        <h2 className="text-4xl font-black text-white mt-3">Engineering Excellence</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        {/* Card 1 */}
                        <ServiceCard
                            icon={<Code2 size={32} className="text-blue-400" />}
                            title="Software Development"
                            description="Custom applications tailored to your specific business needs. We build scalable, high-performance web and mobile solutions."
                            tags={['React', 'Node.js', 'Mobile Apps']}
                        />

                        {/* Card 2 */}
                        <ServiceCard
                            icon={<Cloud size={32} className="text-indigo-400" />}
                            title="Cloud Integration"
                            description="Seamless migration and management of cloud infrastructure. We optimize your stack for speed, reliability, and cost-efficiency."
                            tags={['AWS', 'Azure', 'Google Cloud']}
                        />

                        {/* Card 3 */}
                        <ServiceCard
                            icon={<ShieldCheck size={32} className="text-emerald-400" />}
                            title="IT & Cybersecurity"
                            description="Protect your digital assets with our enterprise-grade security protocols, real-time monitoring, and compliance management."
                            tags={['Network Security', 'Audits', '24/7 Monitoring']}
                        />
                    </div>
                </div>
            </section>

            {/* --- STATS / TRUST --- */}
            <section className="py-20 border-y border-white/5 bg-slate-800/30">
                <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 lg:grid-cols-4 gap-12 text-center">
                    {[
                        { label: "Uptime Guaranteed", value: "99.9%" },
                        { label: "Global Clients", value: "200+" },
                        { label: "Security Audits", value: "Weekly" },
                        { label: "Support", value: "24/7" }
                    ].map((stat, i) => (
                        <div key={i}>
                            <div className="text-4xl lg:text-5xl font-black text-white mb-2">{stat.value}</div>
                            <div className="text-sm font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
                        </div>
                    ))}
                </div>
            </section>

            {/* --- DETAILED SERVICES LIST --- */}
            <section className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                        <div>
                            <h3 className="text-3xl font-bold mb-8">Comprehensive IT Management</h3>
                            <div className="space-y-6">
                                <ServiceRow
                                    icon={<Database />}
                                    title="Data Architecture"
                                    text="Structured, secure, and accessible data systems designed for analytics and scale."
                                />
                                <ServiceRow
                                    icon={<Cpu />}
                                    title="Infrastructure Automation"
                                    text="Reduce manual workload with intelligent scripting and DevOps pipelines."
                                />
                                <ServiceRow
                                    icon={<Globe />}
                                    title="Network Solutions"
                                    text="High-speed, redundant connectivity setup for offices, hotels, and remote teams."
                                />
                                <ServiceRow
                                    icon={<Lock />}
                                    title="Identity Management"
                                    text="SSO, MFA, and role-based access control to ensure only the right people have access."
                                />
                            </div>
                        </div>
                        <div className="relative">
                            <div className="absolute inset-0 bg-gradient-to-tr from-blue-600 to-purple-600 rounded-3xl blur-2xl opacity-30"></div>
                            <div className="relative bg-slate-800 border border-white/10 rounded-3xl p-8 shadow-2xl">
                                <div className="flex items-center justify-between mb-8 border-b border-white/10 pb-6">
                                    <div>
                                        <div className="text-xs font-bold text-slate-400 uppercase">System Status</div>
                                        <div className="text-green-400 font-bold flex items-center gap-2 mt-1">
                                            <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                            All Systems Operational
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xs font-bold text-slate-400 uppercase">Active Threats</div>
                                        <div className="text-white font-bold mt-1">0 Detected</div>
                                    </div>
                                </div>

                                {/* Fake Terminal */}
                                <div className="font-mono text-xs text-slate-400 space-y-2">
                                    <p><span className="text-purple-400">➜</span> <span className="text-blue-400">~</span> initializing secure protocols...</p>
                                    <p><span className="text-green-400">✔</span> Encryption keys verified</p>
                                    <p><span className="text-green-400">✔</span> Firewall rules updated</p>
                                    <p><span className="text-purple-400">➜</span> <span className="text-blue-400">~</span> monitoring traffic flow...</p>
                                    <div className="h-32 mt-4 bg-slate-900/50 rounded-lg border border-white/5 p-4 relative overflow-hidden">
                                        {/* Animated bars */}
                                        <div className="flex items-end justify-between h-full gap-1">
                                            {[40, 70, 30, 85, 50, 65, 45, 90, 60, 75, 55, 80, 40, 60, 35].map((h, i) => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: '0%' }}
                                                    animate={{ height: `${h}%` }}
                                                    transition={{ duration: 2, repeat: Infinity, repeatType: "reverse", delay: i * 0.1 }}
                                                    className="w-full bg-blue-500/40 rounded-t-sm"
                                                />
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            {/* --- FOOTER CTA --- */}
            <section className="py-24">
                <div className="max-w-5xl mx-auto px-6 text-center">
                    <h2 className="text-4xl font-black mb-6">Ready to upgrade your infrastructure?</h2>
                    <p className="text-xl text-slate-400 mb-10">Let's build a technology roadmap that aligns with your business goals.</p>
                    <button className="px-10 py-5 bg-white text-slate-900 rounded-full font-bold text-lg hover:bg-slate-100 transition-all shadow-xl hover:-translate-y-1">
                        Start Your Transformation
                    </button>
                </div>
            </section>

        </div>
    );
};

// --- Sub Components ---

const ServiceCard: React.FC<{ icon: React.ReactNode, title: string, description: string, tags: string[] }> = ({ icon, title, description, tags }) => {
    return (
        <motion.div
            whileHover={{ y: -10 }}
            className="bg-slate-800/50 border border-white/5 p-8 rounded-3xl hover:bg-slate-800 transition-colors group"
        >
            <div className="mb-6 p-4 bg-slate-900 rounded-2xl inline-block border border-white/5 shadow-lg group-hover:shadow-blue-900/20 transition-all">
                {icon}
            </div>
            <h3 className="text-2xl font-bold mb-4">{title}</h3>
            <p className="text-slate-400 mb-6 leading-relaxed">
                {description}
            </p>
            <div className="flex flex-wrap gap-2">
                {tags.map(tag => (
                    <span key={tag} className="text-xs font-bold px-3 py-1 rounded-full bg-white/5 text-slate-300 border border-white/5">
                        {tag}
                    </span>
                ))}
            </div>

            <div className="mt-8 pt-6 border-t border-white/5 flex items-center text-blue-400 text-sm font-bold gap-2 group-hover:gap-3 transition-all cursor-pointer">
                Learn more <ArrowRight size={16} />
            </div>
        </motion.div>
    )
}

const ServiceRow: React.FC<{ icon: React.ReactNode, title: string, text: string }> = ({ icon, title, text }) => (
    <div className="flex gap-4">
        <div className="mt-1 w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-slate-300 shrink-0">
            {icon}
        </div>
        <div>
            <h4 className="text-lg font-bold text-white mb-1">{title}</h4>
            <p className="text-slate-400 text-sm leading-relaxed">{text}</p>
        </div>
    </div>
)

export default DigitalSolutions;
