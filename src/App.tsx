import { BrowserRouter, Route, Routes } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import Navbar from "@/components/Navbar";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AuthCallback from "./pages/AuthCallback";
import SetPassword from "./pages/SetPassword";
import Dashboard from "./pages/dashboard/Dashboard"; // Nama folder baru
import CreateProperty from "./pages/dashboard/CreateProperty"; // Nama folder baru
import ProtectedRoute from "./components/ProtectedRoute";
import ManageProperty from "./pages/dashboard/ManageProperty"; // Halaman baru untuk edit property

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/property/:id" element={<PropertyDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/verify-email" element={<VerifyEmail />} />
        <Route path="/set-password" element={<SetPassword />} />
        <Route path="/auth/callback" element={<AuthCallback />} />
        
        {/* Protected Tenant Routes - URL Singkat */}
        <Route element={<ProtectedRoute allowedRole="TENANT" />}>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/dashboard/create" element={<CreateProperty />} />
          {/* Tambahkan rute ini */}
          <Route path="/dashboard/property/:id" element={<ManageProperty />} />
        </Route>
        
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;