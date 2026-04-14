import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";

const ProtectedRoute = ({ allowedRole }: { allowedRole: string }) => {
  const { user, loading } = useAuth();

  // Tampilkan loading spinner sementara jika data user sedang diambil
  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-navy-700 border-t-transparent"></div>
      </div>
    );
  }

  // Jika tidak ada user atau role tidak sesuai, tendang ke halaman login
  if (!user || user.role !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  // Jika aman, render komponen anak (halaman dashboard/create property)
  return <Outlet />;
};

// Pastikan ini adalah default export
export default ProtectedRoute;