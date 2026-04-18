import { BrowserRouter, Route, Routes } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "@/components/Navbar";

// Public Pages
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import PropertyDetail from "./pages/PropertyDetail";
import Login from "./pages/Login";
import Register from "./pages/Register";
import VerifyEmail from "./pages/VerifyEmail";
import AuthCallback from "./pages/AuthCallback";
import SetPassword from "./pages/SetPassword";

// Tenant Dashboard Pages
import Dashboard from "./pages/dashboard/Dashboard";
import CreateProperty from "./pages/dashboard/CreateProperty";
import ManageProperty from "./pages/dashboard/ManageProperty";
import TenantProfile from "./pages/dashboard/TenantProfile";
import TenantReservations from "./pages/dashboard/TenantReservations";

// Tambahkan Import Baru di Sini
import CreateRoomType from "./pages/dashboard/CreateRoomType" // Pastikan file ini sudah dibuat
import ManageAvailability from "./pages/dashboard/ManageAvailability"; // Pastikan file ini sudah dibuat
import ManageRooms from "./pages/dashboard/ManageRooms"; // Pastikan file ini sudah dibuat

// User/Customer Pages
import MyBookings from "./pages/MyBookings";
import BookingPage from "./pages/BookingPage";
import PaymentUpload from "./pages/PaymentUpload";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          {/* --- Public Routes --- */}
          <Route path="/" element={<Index />} />
          <Route path="/property/:id" element={<PropertyDetail />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/verify-email" element={<VerifyEmail />} />
          <Route path="/set-password" element={<SetPassword />} />
          <Route path="/auth/callback" element={<AuthCallback />} />

          {/* --- Protected User Routes --- */}
          <Route element={<ProtectedRoute allowedRole="USER" />}>
            <Route path="/bookings" element={<MyBookings />} />
            <Route path="/booking/:roomTypeId" element={<BookingPage />} />
            <Route path="/bookings/:bookingId/payment" element={<PaymentUpload />} />
          </Route>

          {/* --- Protected Tenant Routes --- */}
          <Route element={<ProtectedRoute allowedRole="TENANT" />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/profile" element={<TenantProfile />} />
            <Route path="/dashboard/reservations" element={<TenantReservations />} />
            
            {/* Property Management Group */}
            <Route path="/dashboard/create" element={<CreateProperty />} />
            <Route path="/dashboard/property/:id" element={<ManageProperty />} />
            <Route path="/dashboard/property/:id/room-type/create" element={<CreateRoomType />} />
            <Route path="/dashboard/property/:id/availability" element={<ManageAvailability />} />
            <Route path="/dashboard/property/:propertyId/room-type/:roomTypeId/rooms" element={<ManageRooms />} />
          </Route>

          {/* 404 Route */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;