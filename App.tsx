
import React, { useState, useEffect } from 'react';
import Layout from './components/Layout';
import Dashboard from './views/Dashboard';
import Accounting from './views/Accounting';
import StaffTracker from './views/StaffTracker';
import Bookings from './views/Bookings';
import Rooms from './views/Rooms';
import Guests from './views/Guests';
import AIChat from './components/AIChat';
import { UserRole, User, Property } from './types';

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

const App: React.FC = () => {
  const [user, setUser] = useState<User>(MOCK_USER);
  const [currentProperty, setCurrentProperty] = useState<Property>(MOCK_PROPERTIES[0]);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isAuthenticated, setIsAuthenticated] = useState(true);

  // Simulation of multi-tenant property filtering
  const handlePropertyChange = (property: Property) => {
    setCurrentProperty(property);
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
           <p className="text-slate-500 text-center mb-8">Login to manage {MOCK_PROPERTIES[0].name}</p>
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
        properties={MOCK_PROPERTIES}
        onPropertyChange={handlePropertyChange}
        onLogout={() => setIsAuthenticated(false)}
      >
        {activeTab === 'dashboard' && <Dashboard property={currentProperty} />}
        {activeTab === 'bookings' && <Bookings />}
        {activeTab === 'rooms' && <Rooms />}
        {activeTab === 'guests' && <Guests />}
        {activeTab === 'accounting' && <Accounting />}
        {activeTab === 'staff' && <StaffTracker user={user} />}
        
        {(activeTab === 'users' || activeTab === 'settings') && (
          <div className="flex flex-col items-center justify-center h-full text-center space-y-4">
            <div className="w-16 h-16 bg-slate-100 text-slate-400 rounded-full flex items-center justify-center">
              <span className="text-2xl">?</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800 capitalize">{activeTab} Module</h2>
              <p className="text-slate-500 max-w-sm">This module is currently being optimized for {currentProperty.name}. Check back shortly.</p>
            </div>
          </div>
        )}
      </Layout>
      <AIChat />
    </>
  );
};

export default App;
