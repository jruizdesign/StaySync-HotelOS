
import React, { useState } from 'react'; import {
  LayoutDashboard,
  CalendarCheck,
  Wallet,
  Users,
  Settings,
  LogOut,
  Building2,
  ChevronDown,
  Clock,
  BedDouble,
  UserCircle,
  Wrench,
  NotebookPen,
  Lightbulb,
  Terminal
}
  from 'lucide-react';
import { User, Property, UserRole } from '../types';

interface LayoutProps {
  children: React.ReactNode;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  user: User;
  currentProperty: Property;
  properties: Property[];
  onPropertyChange: (p: Property) => void;
  onLogout: () => void;
}

const Layout: React.FC<LayoutProps> = ({
  children,
  activeTab,
  setActiveTab,
  user,
  currentProperty,
  properties,
  onPropertyChange,
  onLogout
}) => {
  const mainMenuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'daily-overview', label: 'Daily Overview', icon: NotebookPen },
    { id: 'bookings', label: 'Bookings', icon: CalendarCheck },
    { id: 'rooms', label: 'Rooms', icon: BedDouble },
    { id: 'guests', label: 'Guests', icon: UserCircle },
    { id: 'maintenance', label: 'Maintenance', icon: Wrench },
    { id: 'accounting', label: 'Accounting', icon: Wallet },
  ];

  const systemMenuItems = [
    { id: 'users', label: 'User Management', icon: Users, restricted: false },
    { id: 'staff', label: 'Staff Tracker', icon: Clock, restricted: false },
    { id: 'logs', label: 'System Logs', icon: Terminal, restricted: true }, // Restricted to Admin/Manager
    { id: 'features', label: 'Feature Roadmap', icon: Lightbulb, restricted: false },
    { id: 'settings', label: 'Settings', icon: Settings, restricted: false },
  ];
  const [isSelectorOpen, setIsSelectorOpen] = useState(false);

  const canSwitchProperty =
    user.role === 'SYSTEM_ADMIN' ||
    user.role === UserRole.ADMIN;

  function NavItem({ item }) {
    return (
      <button
        onClick={() => setActiveTab(item.id)}
        className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all font-medium text-sm ${activeTab === item.id
          ? 'bg-blue-600 text-white shadow-lg shadow-blue-900/50'
          : 'hover:bg-slate-800 hover:text-white'}`}
      >
        <item.icon size={20} />
        {item.label}
      </button>
    );
  }

  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col shrink-0">
        <div className="p-6 flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl">
            SS
          </div>
          <div className="flex-1 min-w-0">
            <h1 className="text-white font-bold tracking-tight truncate">{currentProperty?.name || 'StaySync'}</h1>
            <p className="text-[10px] uppercase tracking-widest text-slate-500 font-bold">StaySync OS</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1 mt-4 overflow-y-auto">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">Main</div>
          {mainMenuItems.map((item) => <NavItem key={item.id} item={item} />)}
        </nav>

        <div className="px-4 py-4 space-y-1 border-t border-slate-800">
          <div className="px-4 py-2 text-[10px] font-bold text-slate-500 uppercase tracking-widest">System</div>
          {systemMenuItems.filter(item => {
            // Hide restricted items from regular STAFF
            if (item.restricted && user.role === UserRole.STAFF) return false;
            return true;
          }).map((item) => <NavItem key={item.id} item={item} />)}

          <button
            onClick={onLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-rose-500/10 hover:text-rose-400 transition-all text-sm font-medium mt-2"
          >
            <LogOut size={20} />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 flex items-center justify-between px-8 shrink-0">
          <div className="flex items-center gap-6">
            <div className="relative group">
              <button className="flex items-center gap-2 px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl hover:bg-slate-100 transition-colors">
                <Building2 size={18} className="text-blue-600" />
                <span className="font-semibold text-slate-700">{currentProperty?.name || "No Property Selected"}</span>
                <ChevronDown size={16} className="text-slate-400" />
              </button>

              {user.role === UserRole.SYSTEM_ADMIN && (
                <div className="absolute top-full left-0 mt-2 w-64 bg-white border border-slate-200 rounded-2xl shadow-xl py-2 invisible group-hover:visible z-50">
                  <div className="px-4 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest">Switch Property</div>
                  {properties.map(p => (
                    <button
                      key={p.id}
                      onClick={() => onPropertyChange(p)}
                      className="w-full text-left px-4 py-2.5 hover:bg-slate-50 transition-colors text-sm font-medium text-slate-700"
                    >
                      {p.name}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-bold text-slate-800">{user.name}</p>
              <p className="text-xs text-slate-500 uppercase tracking-wider">{user.role.replace('_', ' ')}</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-500">
              {user.name.split(' ').map(n => n[0]).join('')}
            </div>
          </div>
        </header>

        {/* Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-8">
          {children}
        </div>
      </main>
    </div>
  );
};

export default Layout;
