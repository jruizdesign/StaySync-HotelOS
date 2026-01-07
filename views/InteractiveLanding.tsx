import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Play,
  Pause,
  ChevronRight,
  CheckCircle2,
  ShieldCheck,
  Zap,
  Globe,
  ArrowRight,
  LayoutDashboard,
  BedDouble,
  Wrench,
  Users,
  Copyright
} from 'lucide-react';
import Dashboard from './Dashboard';
import Rooms from './Rooms';
import Maintenance from './Maintenance';
import Guests from './Guests';
import { Property, User, UserRole } from '../types';

// Mock data for the demo preview
const DEMO_PROPERTY: Property = {
  id: 'demo-1',
  name: 'StaySync Grand Demo',
  location: 'Virtual Tour',
  totalRooms: 150
};

const DEMO_USER: User = {
  id: 'demo-u',
  name: 'Demo Admin',
  email: 'admin@staysync.os',
  role: UserRole.SYSTEM_ADMIN,
  propertyId: null
};

const DEMO_STEPS = [
  {
    id: 'dashboard',
    label: 'AI Operations Center',
    description: 'Real-time revenue tracking and Gemini AI-powered operational insights.',
    component: <Dashboard property={DEMO_PROPERTY} user={DEMO_USER} isDemoMode={true} />,
    icon: LayoutDashboard,
    highlight: "AI analyzes arrears & maintenance risks instantly."
  },
  {
    id: 'rooms',
    label: 'Live Inventory',
    description: 'Visual room grid with one-click status updates for housekeeping.',
    component: <Rooms isDemoMode={true} user={DEMO_USER} propertyId={DEMO_PROPERTY.id} />,
    icon: BedDouble,
    highlight: "Interactive grid with drag-and-drop status changes."
  },
  {
    id: 'maintenance',
    label: 'Work Orders',
    description: 'Track repairs, assign costs, and link expenses to accounting.',
    component: <Maintenance isDemoMode={true} tasks={[]} onUpdateTask={() => { }} onAddTask={() => { }} onDeleteTask={() => { }} />, // Passing empty props as component handles demo data internally
    icon: Wrench,
    highlight: "Seamlessly link repairs to financial ledger."
  },
  {
    id: 'guests',
    label: 'Guest Vault',
    description: 'Secure profile management with automated document categorization.',
    component: <Guests isDemoMode={true} />,
    icon: Users,
    highlight: "AI auto-categorizes uploaded passports and IDs."
  }
];

const LandingPage: React.FC = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);

  // Auto-advance logic
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          setActiveStep(s => (s + 1) % DEMO_STEPS.length);
          return 0;
        }
        return prev + 1; // 100 ticks per step
      });
    }, 80); // ~8 seconds per slide

    return () => clearInterval(interval);
  }, [isPlaying, activeStep]);

  // Reset progress when step changes manually
  const handleStepClick = (index: number) => {
    setActiveStep(index);
    setProgress(0);
    setIsPlaying(false); // Pause if user interacts
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden selection:bg-blue-500 selection:text-white">
      {/* Navbar */}
      <nav className="fixed top-0 w-full z-50 border-b border-white/10 bg-slate-950/80 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center font-bold text-xl shadow-lg shadow-blue-500/20">
              S
            </div>
            <span className="font-bold text-xl tracking-tight">STAYSYNC <span className="text-slate-500">OS</span></span>
          </div>
          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-300">
            <Link to="/digital-solutions" className="hover:text-white transition-colors">Digital Solutions</Link>
            <Link to="/it-security" className="hover:text-white transition-colors">IT & Security</Link>
            <a href="#features" className="hover:text-white transition-colors">Features</a>
          </div>
          <Link
            to="/login"
            className="px-6 py-2.5 bg-white text-slate-950 rounded-xl font-bold text-sm hover:bg-slate-200 transition-colors"
          >
            Launch Demo
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-bold uppercase tracking-widest mb-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <Zap size={14} fill="currentColor" />
            New: Gemini 3.0 Integration
          </div>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6 leading-tight animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
            The Operating System for <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">Modern Hospitality</span>
          </h1>
          <p className="text-lg text-slate-400 leading-relaxed mb-10 animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
            Unify bookings, staff management, and maintenance into one intelligent platform.
            Secured by Firebase, Powered by Google Cloud.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
            <Link
              to="/login"
              className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-500 transition-all shadow-xl shadow-blue-900/20 flex items-center justify-center gap-3 group"
            >
              Start Live Trial
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </Link>
            <button className="w-full sm:w-auto px-8 py-4 bg-white/5 text-white border border-white/10 rounded-2xl font-bold text-lg hover:bg-white/10 transition-all flex items-center justify-center gap-3">
              <Play size={20} fill="currentColor" />
              Watch Video
            </button>
          </div>
        </div>

        {/* Interactive App Demo Window */}
        <div className="relative animate-in fade-in zoom-in duration-1000 delay-300">
          {/* Decorative Glows */}
          <div className="absolute -top-20 -left-20 w-96 h-96 bg-blue-600/20 rounded-full blur-[128px]"></div>
          <div className="absolute -bottom-20 -right-20 w-96 h-96 bg-emerald-600/10 rounded-full blur-[128px]"></div>

          <div className="relative bg-slate-900 rounded-3xl border border-white/10 shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[700px]">

            {/* Sidebar Controls */}
            <div className="w-full md:w-80 bg-slate-950/50 backdrop-blur-xl border-r border-white/5 p-6 flex flex-col z-20">
              <div className="mb-6 flex items-center justify-between">
                <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Live Tour</span>
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-white transition-colors"
                >
                  {isPlaying ? <Pause size={14} /> : <Play size={14} />}
                </button>
              </div>

              <div className="space-y-3">
                {DEMO_STEPS.map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = activeStep === index;
                  return (
                    <button
                      key={step.id}
                      onClick={() => handleStepClick(index)}
                      className={`w-full text-left p-4 rounded-xl border transition-all relative overflow-hidden group ${isActive
                        ? 'bg-blue-600/10 border-blue-500/50'
                        : 'bg-white/5 border-transparent hover:bg-white/10'
                        }`}
                    >
                      {/* Progress Bar Background for Active Step */}
                      {isActive && (
                        <div
                          className="absolute bottom-0 left-0 h-1 bg-blue-500 transition-all duration-100 ease-linear"
                          style={{ width: `${progress}%` }}
                        ></div>
                      )}

                      <div className="flex items-start gap-4 mb-2">
                        <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-500 text-white' : 'bg-slate-800 text-slate-400 group-hover:text-white'}`}>
                          <StepIcon size={18} />
                        </div>
                        <div>
                          <h3 className={`font-bold text-sm ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-200'}`}>{step.label}</h3>
                        </div>
                      </div>
                      <p className="text-xs text-slate-500 leading-relaxed pl-[3.25rem]">
                        {step.description}
                      </p>
                    </button>
                  );
                })}
              </div>

              <div className="mt-auto pt-6 border-t border-white/5">
                <div className="flex items-center gap-3 px-4 py-3 bg-emerald-500/10 rounded-xl border border-emerald-500/20">
                  <ShieldCheck size={20} className="text-emerald-400" />
                  <div>
                    <p className="text-xs font-bold text-emerald-400">Enterprise Ready</p>
                    <p className="text-[10px] text-emerald-400/70">SOC2 Type II Compliant</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Preview Area */}
            <div className="flex-1 bg-slate-50 relative overflow-hidden flex flex-col">
              {/* Fake Browser Header */}
              <div className="h-12 bg-white border-b border-slate-200 flex items-center px-4 gap-4 shrink-0">
                <div className="flex gap-2">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <div className="bg-slate-100 px-4 py-1.5 rounded-md text-[10px] font-medium text-slate-500 flex items-center gap-2 min-w-[300px]">
                  <Globe size={12} />
                  https://app.staysyncos.com/dashboard/
                </div>
              </div>

              {/* Viewport */}
              <div className="flex-1 overflow-y-auto p-8 relative">
                {/* Feature Spotlight Overlay */}
                <div className="absolute top-6 right-6 z-30 animate-in fade-in slide-in-from-right-8 duration-700 key={activeStep}">
                  <div className="bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-2xl shadow-2xl max-w-xs border border-white/10">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="p-1.5 bg-blue-600 rounded-lg">
                        <Zap size={12} fill="currentColor" />
                      </div>
                      <span className="text-xs font-bold uppercase tracking-wider">Feature Spotlight</span>
                    </div>
                    <p className="text-sm font-medium leading-relaxed">
                      {DEMO_STEPS[activeStep].highlight}
                    </p>
                  </div>
                </div>

                {/* Actual App Component Rendered Here */}
                <div key={activeStep} className="animate-in fade-in zoom-in-95 duration-500 origin-top-left h-full">
                  {DEMO_STEPS[activeStep].component}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Proof / Footer */}
      <div className="border-t border-white/5 bg-slate-900/50">
        <div className="max-w-7xl mx-auto px-6 py-12 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2 text-slate-400">
              <Copyright size={14} />
              <span className="text-sm font-medium">2024 StaySyncOS</span>
            </div>
            <p className="text-slate-500 text-xs flex items-center gap-1.5">
              Built & Designed by <span className="text-slate-300 font-bold">Jason Ruiz</span>
            </p>
          </div>

          <div className="flex gap-6 text-slate-500 grayscale opacity-50">
            <span className="font-bold text-xl">Hilton</span>
            <span className="font-bold text-xl">Marriott</span>
            <span className="font-bold text-xl">Hyatt</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingPage;