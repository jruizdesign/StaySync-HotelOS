import "./lib/firebase"; // Initialize Firebase first
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import LoginPage from "./views/Login";
import PropertySelector from "./views/PropertySelector";
import PropertyDashboard from "./views/PropertyDashboard";
import LandingPage from "./views/LandingPage";
import DigitalSolutions from "./views/DigitalSolutions";
import ITSecurity from "./views/ITSecurity";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

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

            {/* Super Admin Route */}
            <Route path="/admin/properties" element={<PropertySelector />} />

            {/* The Shared Dashboard */}
            <Route path="/dashboard/:propertyId" element={<PropertyDashboard />} />

            {/* Default Redirect */}
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
