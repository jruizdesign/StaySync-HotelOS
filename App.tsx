
import "./lib/firebase"; // Initialize Firebase first
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./components/AuthContext";
import LoginPage from "./views/Login";
import PropertySelector from "./views/PropertySelector";
import PropertyDashboard from "./views/PropertyDashboard";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
// import Dashboard from "./views/Dashboard"; 

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<LoginPage />} />

            {/* Super Admin Route */}
            <Route path="/admin/properties" element={<PropertySelector />} />

            {/* The Shared Dashboard */}
            {/* The Shared Dashboard */}
            <Route path="/dashboard/:propertyId" element={<PropertyDashboard />} />

            {/* Default Redirect */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
