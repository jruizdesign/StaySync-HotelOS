import "./lib/firebase"; // Initialize Firebase first
import { BrowserRouter, Routes, Route, Navigate, Outlet } from "react-router-dom";
import { Analytics } from "@vercel/analytics/react";
import { AuthProvider, useAuth } from "./components/AuthContext";
import LoginPage from "./views/Login";
import PropertySelector from "./views/PropertySelector";
import PropertyDashboard from "./views/PropertyDashboard";
import LandingPage from "./views/InteractiveLanding";
import DigitalSolutions from "./views/DigitalSolutions";
import ITSecurity from "./views/ITSecurity";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Analytics } from "@vercel/analytics/next"

//Sub-Views
import Bookings from "./views/Bookings";
import Rooms from "./views/Rooms";
import Maintenance from "./views/Maintenance";
import Settings from "./views/Settings";

const queryClient = new QueryClient();
const PrivateRoute = () => {
  const { user, loading } = useAuth();
  if (loading)
    return (
      <div>Loading...</div>
    );
  return user ? <Outlet /> : <Navigate to="/login" replace />;
};

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Landing Page as Default */}
            <Route path="/" element={<LandingPage />} />

            {/* Digital Solutions Page */}
            <Route path="/digital-solutions" element={<DigitalSolutions />} />

            {/* IT Security Page */}
            <Route path="/it-security" element={<ITSecurity />} />

            <Route path="/login" element={<LoginPage />} />

            <Route element={<PrivateRoute />}>
              {/* Super Admin Route */}
              <Route path="/admin/properties" element={<PropertySelector />} />

              {/* The Shared Dashboard */}
              <Route path="/dashboard/:propertyId" element={<PropertyDashboard />} />
            </Route>

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
        <Analytics />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
