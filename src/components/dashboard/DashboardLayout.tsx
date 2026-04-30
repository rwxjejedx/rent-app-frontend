import { Link, useLocation, Outlet, useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, 
  Building, 
  CalendarCheck, 
  User, 
  LogOut, 
  Building2
} from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";

const DashboardLayout = () => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const menuItems = [
    { label: "Overview", icon: LayoutDashboard, path: "/dashboard" },
    { label: "My Properties", icon: Building, path: "/dashboard/properties" },
    { label: "Reservations", icon: CalendarCheck, path: "/dashboard/reservations" },
    { label: "Profile", icon: User, path: "/dashboard/profile" },
  ];

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="flex min-h-screen bg-white text-slate-900 font-sans">
      {/* Sidebar */}
      <aside className="w-64 border-r border-slate-100 flex flex-col fixed inset-y-0 z-20 bg-white">
        <div className="p-8">
          <Link to="/" className="flex items-center gap-2.5">
            <img src="/src/assets/full-logo.png" className="h-9 w-auto" alt="anta.com logo" />
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.label}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                  isActive 
                    ? "bg-slate-950 text-white shadow-lg shadow-slate-200" 
                    : "text-slate-500 hover:bg-slate-50 hover:text-slate-950"
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? "text-white" : "text-slate-400"}`} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-slate-50">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors"
          >
            <LogOut className="h-5 w-5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 min-h-screen flex flex-col">
        {/* Header */}
        <header className="h-20 border-b border-slate-50 flex items-center justify-end px-8 bg-white/80 backdrop-blur-md sticky top-0 z-10">

          <div className="flex items-center gap-4">
            <div className="relative">
               <NotificationBell variant="light" />
            </div>
            <div className="h-8 w-px bg-slate-100 mx-2" />
            <div className="flex items-center gap-3">
              <div className="text-right hidden sm:block">
                <p className="text-sm font-bold text-slate-950">{user?.name}</p>
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-widest">Tenant Partner</p>
              </div>
              {user?.avatar ? (
                <img src={user.avatar} className="h-10 w-10 rounded-full border-2 border-slate-50 shadow-sm object-cover" />
              ) : (
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-950 font-bold border border-slate-200">
                  {user?.name?.charAt(0)}
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-8 lg:p-12 max-w-7xl">
          <Outlet />
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;
