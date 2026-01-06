
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Accounting from './views/Accounting';
import StaffTracker from './views/StaffTracker';
import Bookings from './views/Bookings';
import Rooms from './views/Rooms';
import Guests from './views/Guests';
import Maintenance from './views/Maintenance';
import FeatureRequests from './views/FeatureRequests';
import SystemLogs from './views/SystemLogs';
import AIChat from './components/AIChat';
import { UserRole, User, Property, MaintenanceTask, FeatureRequest } from './types';
import { 
  Database, 
  ShieldCheck, 
  ToggleLeft, 
  ToggleRight, 
  Server, 
  Building2, 
  MapPin, 
  Hash, 
  Save, 
  Table, 
  Key, 
  Calendar, 
  Users, 
  BedDouble, 
  Wrench, 
  Clock 
} from 'lucide-react';

// Mock Data
const MOCK_PROPERTIES: Property[] = [
  { id: 'prop-1', name: 'Lumina Grand Resort', location: 'Miami, FL', totalRooms: 250 },
  { id: 'prop-2', name: 'Lumina City Suites', location: 'New York, NY', totalRooms: 120 },
  { id: 'prop-3', name: 'Lumina Alpine Lodge', location: 'Aspen, CO', totalRooms: 85 },
];

const MOCK_USER: User = {
  id: 'u-admin-1',
  name: 'Alex Johnson',
  email: 'alex@lumina.com',
  role: UserRole.SYSTEM_ADMIN,
  propertyId: null, // Admins see all
};

const INITIAL_MAINTENANCE_TASKS: MaintenanceTask[] = [
  { id: 'm1', roomNumber: '104', description: 'Bathroom Sink Leaking', priority: 'High', status: 'Pending', reportedDate: '2023-10-26', cost: 0 },
  { id: 'm2', roomNumber: 'Lobby', description: 'Main Entrance Light Flicker', priority: 'Low', status: 'Completed', reportedDate: '2023-10-20', completedDate: '2023-10-21', cost: 150, assignedTo: 'David Smith' },
  { id: 'm3', roomNumber: '203', description: 'AC Compressor Noise', priority: 'Medium', status: 'In Progress', reportedDate: '2023-10-25', assignedTo: 'David Smith', cost: 0 },
];

const INITIAL_FEATURE_REQUESTS: FeatureRequest[] = [
  { id: 'fr-1', title: 'Mobile Housekeeping App', description: 'Allow housekeeping staff to mark rooms clean from a mobile PWA interface.', priority: 'High', status: 'In Progress', votes: 12, requester: 'Sarah Wilson', date: '2023-10-15' },
  { id: 'fr-2', title: 'Integration with Stripe Terminal', description: 'Direct POS integration for the bar and restaurant charges to room.', priority: 'Medium', status: 'Planned', votes: 8, requester: 'Alex Johnson', date: '2023-10-18' },
  { id: 'fr-3', title: 'Dark Mode for Dashboard', description: 'Better for night shift auditors reducing eye strain.', priority: 'Low', status: 'New', votes: 5, requester: 'Elena Rodriguez', date: '2023-10-20' },
  { id: 'fr-4', title: 'Automated SMS Notifications', description: 'Send guests a welcome SMS with wifi code upon check-in.', priority: 'Medium', status: 'Implemented', votes: 24, requester: 'System Admin', date: '2023-09-01' },
];

const DB_SCHEMA = [
  { name: 'properties', icon: Building2, columns: ['id (uuid)', 'name (text)', 'location (text)', 'total_rooms (int)', 'created_at (ts)'] },
  { name: 'bookings', icon: Calendar, columns: ['id (uuid)', 'property_id (fk)', 'guest_id (fk)', 'room_no (varchar)', 'check_in (date)', 'check_out (date)', 'status (enum)', 'total_amt (decimal)'] },
  { name: 'guests', icon: Users, columns: ['id (uuid)', 'property_id (fk)', 'full_name (text)', 'email (varchar)', 'phone (varchar)', 'is_vip (bool)', 'is_dnr (bool)'] },
  { name: 'rooms', icon: BedDouble, columns: ['id (uuid)', 'property_id (fk)', 'number (varchar)', 'floor (int)', 'type (enum)', 'status (enum)'] },
  { name: 'maintenance_logs', icon: Wrench, columns: ['id (uuid)', 'room_id (fk)', 'issue (text)', 'priority (enum)', 'status (enum)', 'cost (decimal)', 'reported_at (ts)'] },
  { name: 'staff_logs', icon: Clock, columns: ['id (uuid)', 'user_id (fk)', 'clock_in (ts)', 'clock_out (ts)', 'total_hours (interval)'] },
];

const App: React.FC = () => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [properties, setProperties] = useState<Property[]>(MOCK_PROPERTIES);
  const [currentProperty, setCurrentProperty] = useState<Property>(MOCK_PROPERTIES[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);
  
  // Demo Mode State
  const [isDemoMode, setIsDemoMode] = useState(true);

  // Shared State
  const [maintenanceTasks, setMaintenanceTasks] = useState<MaintenanceTask[]>(INITIAL_MAINTENANCE_TASKS);
  const [featureRequests, setFeatureRequests] = useState<FeatureRequest[]>(INITIAL_FEATURE_REQUESTS);

  useEffect(() => {
    if (isDemoMode) {
      setMaintenanceTasks(INITIAL_MAINTENANCE_TASKS);
      setFeatureRequests(INITIAL_FEATURE_REQUESTS);
    } else {
      setMaintenanceTasks([]);
      setFeatureRequests([]);
    }
  }, [isDemoMode]);

  const handleMaintenanceUpdate = (updatedTask: MaintenanceTask) => {
    setMaintenanceTasks(prev => prev.map(t => t.id === updatedTask.id ? updatedTask : t));
  };

  const handleMaintenanceAdd = (newTask: MaintenanceTask) => {
    setMaintenanceTasks(prev => [newTask, ...prev]);
  };

  const handleMaintenanceDelete = (id: string) => {
    setMaintenanceTasks(prev => prev.filter(t => t.id !== id));
  };

  const handleFeatureAdd = (newReq: FeatureRequest) => {
    setFeatureRequests(prev => [newReq, ...prev]);
  };

  const handleFeatureUpdate = (updatedReq: FeatureRequest) => {
    setFeatureRequests(prev => prev.map(r => r.id === updatedReq.id ? updatedReq : r));
  };

  // Simulation of multi-tenant property filtering
  const handlePropertyChange = (property: Property) => {
    setCurrentProperty(property);
  };

  const handlePropertySettingChange = (field: keyof Property, value: string | number) => {
    const updated = { ...currentProperty, [field]: value };
    setCurrentProperty(updated);
    setProperties(prev => prev.map(p => p.id === updated.id ? updated : p));
  };

  if (!isAuthenticated) {
    return (
      <div className="h-screen w-full flex items-center justify-center bg-slate-900">
        <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
           <div className="flex justify-center mb-6">
             <div className="bg-blue-600 p-3 rounded-xl text-white">
                <span className="font-bold text-2xl">L</span>
             </div>
           </div>
           <h1 className="text-2xl font-bold mb-2 text-center text-slate-800">Welcome Back</h1>
           <p className="text-slate-500 text-center mb-8">Login to manage {properties[0].name}</p>
           <button 
            onClick={() => setIsAuthenticated(true)}
            className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all"
           >
             Sign In to Demo
           </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Layout
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        user={user}
        currentProperty={currentProperty}
        properties={properties}
        onPropertyChange={handlePropertyChange}
        onLogout={() => setIsAuthenticated(false)}
      >
        {/* We use the key prop to force a re-mount when Demo Mode changes, ensuring state resets */}
        {activeTab === 'dashboard' && <Dashboard key={isDemoMode ? 'demo' : 'prod'} property={currentProperty} isDemoMode={isDemoMode} />}
        {activeTab === 'bookings' && <Bookings key={isDemoMode ? 'demo' : 'prod'} isDemoMode={isDemoMode} />}
        {activeTab === 'rooms' && <Rooms key={isDemoMode ? 'demo' : 'prod'} isDemoMode={isDemoMode} user={user} />}
        {activeTab === 'guests' && <Guests key={isDemoMode ? 'demo' : 'prod'} isDemoMode={isDemoMode} />}
        {activeTab === 'maintenance' && (
          <Maintenance 
            key={isDemoMode ? 'demo' : 'prod'} 
            isDemoMode={isDemoMode} 
            tasks={maintenanceTasks}
            onUpdateTask={handleMaintenanceUpdate}
            onAddTask={handleMaintenanceAdd}
            onDeleteTask={handleMaintenanceDelete}
          />
        )}
        {activeTab === 'features' && (
          <FeatureRequests 
            key={isDemoMode ? 'demo' : 'prod'}
            requests={featureRequests}
            user={user}
            onAddRequest={handleFeatureAdd}
            onUpdateRequest={handleFeatureUpdate}
          />
        )}
        {activeTab === 'accounting' && (
          <Accounting 
            key={isDemoMode ? 'demo' : 'prod'} 
            isDemoMode={isDemoMode} 
            maintenanceTasks={maintenanceTasks}
          />
        )}
        {activeTab === 'staff' && <StaffTracker key={isDemoMode ? 'demo' : 'prod'} user={user} isDemoMode={isDemoMode} />}
        {activeTab === 'logs' && <SystemLogs key={isDemoMode ? 'demo' : 'prod'} isDemoMode={isDemoMode} property={currentProperty} />}
        
        {activeTab === 'users' && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">?</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 capitalize">User Management</h2>
              <p className="text-slate-500 max-w-sm">This module is currently being optimized for {currentProperty.name}.</p>
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-5xl mx-auto">
             <div>
                <h1 className="text-2xl font-bold text-slate-800">System Configuration</h1>
                <p className="text-slate-500 text-sm">Manage environment settings, property details, and database structure.</p>
             </div>

             {/* Property Profile Section */}
             <div className="bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden">
                <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                   <div>
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                         <Building2 size={20} className="text-blue-500" />
                         Property Profile
                      </h2>
                      <p className="text-sm text-slate-500 mt-1">Operational details available globally throughout the application.</p>
                   </div>
                   <div className="flex items-center gap-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-xl text-xs font-bold uppercase tracking-widest">
                      <ShieldCheck size={16} />
                      Live Config
                   </div>
                </div>

                <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-8">
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Building2 size={14} /> Property Name
                      </label>
                      <input 
                        type="text" 
                        value={currentProperty.name}
                        onChange={(e) => handlePropertySettingChange('name', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <MapPin size={14} /> Location / Region
                      </label>
                      <input 
                        type="text" 
                        value={currentProperty.location}
                        onChange={(e) => handlePropertySettingChange('location', e.target.value)}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                      />
                   </div>
                   <div className="space-y-3">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                        <Hash size={14} /> Total Room Inventory
                      </label>
                      <input 
                        type="number" 
                        value={currentProperty.totalRooms}
                        onChange={(e) => handlePropertySettingChange('totalRooms', parseInt(e.target.value))}
                        className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-2xl outline-none focus:ring-2 focus:ring-blue-500 font-bold text-slate-700"
                      />
                   </div>
                   <div className="flex items-end">
                      <button className="w-full py-4 bg-slate-900 text-white rounded-2xl font-bold shadow-lg hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
                         <Save size={18} />
                         Save Configuration
                      </button>
                   </div>
                </div>
             </div>

             <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Data Environment Section */}
                <div className="lg:col-span-1 bg-white rounded-[2rem] border border-slate-100 shadow-sm overflow-hidden h-fit">
                    <div className="p-6 border-b border-slate-50">
                      <h2 className="text-lg font-bold text-slate-800 flex items-center gap-2">
                          <Database size={20} className="text-blue-500" />
                          Data Environment
                      </h2>
                    </div>

                    <div className="p-6 space-y-6">
                      <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                          <div className="flex items-start gap-3">
                            <div className={`p-2 rounded-xl ${isDemoMode ? 'bg-blue-100 text-blue-600' : 'bg-slate-200 text-slate-500'}`}>
                                <Server size={20} />
                            </div>
                            <div>
                                <p className="font-bold text-slate-800 text-sm">Demo Mode</p>
                                <p className="text-[10px] text-slate-500 font-medium">Use sample data</p>
                            </div>
                          </div>
                          <button 
                            onClick={() => setIsDemoMode(!isDemoMode)}
                            className={`relative inline-flex h-6 w-12 items-center rounded-full transition-colors duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500/20 ${isDemoMode ? 'bg-blue-600' : 'bg-slate-300'}`}
                          >
                            <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition duration-300 shadow-md ${isDemoMode ? 'translate-x-7' : 'translate-x-1'}`} />
                          </button>
                      </div>

                      {!isDemoMode && (
                          <div className="flex items-start gap-3 p-4 bg-emerald-50 text-emerald-700 rounded-2xl border border-emerald-100">
                            <ShieldCheck className="shrink-0 mt-0.5" size={16} />
                            <div>
                                <p className="text-xs font-bold">Production Active</p>
                                <p className="text-[10px] mt-1 opacity-80 leading-relaxed">
                                  System is using live Postgres connection. Data is persistent.
                                </p>
                            </div>
                          </div>
                      )}
                    </div>
                </div>

                {/* Admin Only Database Visualizer */}
                {user.role === UserRole.SYSTEM_ADMIN && (
                   <div className="lg:col-span-2 bg-slate-900 rounded-[2rem] shadow-xl overflow-hidden text-white flex flex-col">
                      <div className="p-8 border-b border-slate-800 flex justify-between items-start">
                         <div>
                            <h2 className="text-lg font-bold flex items-center gap-2">
                                <Database size={20} className="text-emerald-400" />
                                System Architecture
                            </h2>
                            <p className="text-sm text-slate-400 mt-1">Live Schema Visualization (PostgreSQL / Data Connect)</p>
                         </div>
                         <div className="px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 text-[10px] font-black uppercase tracking-widest border border-emerald-500/20">
                            Admin Access
                         </div>
                      </div>
                      
                      <div className="p-8 grid grid-cols-1 md:grid-cols-2 gap-6">
                         {DB_SCHEMA.map((table) => (
                           <div key={table.name} className="bg-slate-800/50 rounded-2xl p-4 border border-slate-700/50 hover:border-blue-500/50 transition-colors group">
                              <div className="flex items-center gap-3 mb-3 text-slate-300 group-hover:text-blue-400 transition-colors">
                                 <table.icon size={16} />
                                 <h3 className="font-bold text-sm tracking-wide">{table.name}</h3>
                              </div>
                              <div className="space-y-1.5">
                                 {table.columns.map((col, idx) => (
                                   <div key={idx} className="flex items-center gap-2 text-[10px] font-mono text-slate-500">
                                      <Key size={8} className={col.includes('id') && !col.includes('_id') ? 'text-amber-500' : 'text-slate-600'} />
                                      <span className={col.includes('id') && !col.includes('_id') ? 'text-amber-200' : ''}>{col}</span>
                                   </div>
                                 ))}
                              </div>
                           </div>
                         ))}
                      </div>
                      <div className="p-4 bg-slate-950 text-center text-[10px] text-slate-600 font-mono border-t border-slate-800">
                         Schema Sync: v2.4.0 • Latency: 24ms • Encryption: AES-256
                      </div>
                   </div>
                )}
             </div>
          </div>
        )}
      </Layout>
      <AIChat />
    </>
  );
};

export default App;
