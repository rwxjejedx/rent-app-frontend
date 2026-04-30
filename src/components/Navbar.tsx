import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Menu, X, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import NotificationBell from "@/components/NotificationBell";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, isUser, isTenant, logout } = useAuth();
  const dropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) setDropdownOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => { logout(); setDropdownOpen(false); setMobileOpen(false); navigate('/'); };

  return (
    <nav className="bg-white sticky top-0 z-50 border-b border-slate-100 shadow-sm">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link to="/" className="flex items-center gap-2.5">
          <img src="/src/assets/full-logo.png" className="h-9 w-auto" alt="anta.com logo" />
        </Link>

        <div className="hidden items-center gap-6 md:flex">
          <Link to="/" className="text-sm font-semibold text-slate-500 hover:text-slate-950 transition-colors">Home</Link>
          {isUser && <Link to="/bookings" className="text-sm font-semibold text-slate-500 hover:text-slate-950 transition-colors">My Bookings</Link>}
          {isTenant && <Link to="/dashboard/reservations" className="text-sm font-semibold text-slate-500 hover:text-slate-950 transition-colors">Reservations</Link>}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login" className="rounded-xl px-4 py-2 text-sm font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-all">Sign In</Link>
              <Link to="/register" className="rounded-xl bg-slate-950 px-6 py-2.5 text-sm font-bold text-white hover:scale-105 active:scale-95 transition-all shadow-lg shadow-slate-200">Sign Up</Link>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <NotificationBell variant="light" />
              {isTenant ? (
                <div className="relative" ref={dropRef}>
                  <button onClick={() => setDropdownOpen(!dropdownOpen)}
                    className="flex items-center gap-2 rounded-xl bg-slate-50 px-4 py-2 text-sm font-bold text-slate-950 hover:bg-slate-100 transition-all">
                    {user?.avatar ? <img src={user.avatar} className="h-6 w-6 rounded-full object-cover" /> : <User className="h-4 w-4" />}
                    {user?.name?.split(' ')[0] ?? 'Account'}
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
                  </button>
                  {dropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-xl">
                      <div className="border-b border-[var(--color-border)] px-4 py-3">
                        <p className="text-xs font-semibold">{user?.name}</p>
                        <p className="text-xs text-[var(--color-muted-fg)]">{user?.email}</p>
                      </div>
                      <Link to="/dashboard" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--color-muted)]"><LayoutDashboard className="h-4 w-4" /> Dashboard</Link>
                      <Link to="/dashboard/profile" onClick={() => setDropdownOpen(false)} className="flex items-center gap-2 px-4 py-3 text-sm hover:bg-[var(--color-muted)]"><User className="h-4 w-4" /> Profile</Link>
                      <button onClick={handleLogout} className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[var(--color-destructive)] hover:bg-[var(--color-muted)]"><LogOut className="h-4 w-4" /> Sign Out</button>
                    </div>
                  )}
                </div>
              ) : (
                <button onClick={handleLogout} className="flex items-center gap-2 rounded-xl bg-red-50 px-4 py-2 text-sm font-bold text-red-600 hover:bg-red-100 transition-all">
                  <LogOut className="h-4 w-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>

        <button className="rounded-lg p-2 text-slate-500 hover:bg-slate-50 md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white px-4 pb-8 pt-3 md:hidden animate-in fade-in slide-in-from-top-4">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-all">Home</Link>
            {isUser && <Link to="/bookings" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-all">My Bookings</Link>}
            {isTenant && <>
              <Link to="/dashboard" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-all">Dashboard</Link>
              <Link to="/dashboard/reservations" onClick={() => setMobileOpen(false)} className="rounded-xl px-4 py-3 text-sm font-bold text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-all">Reservations</Link>
            </>}
          </div>
          <div className="mt-6 flex flex-col gap-3 border-t border-slate-100 pt-6">
            {!isAuthenticated ? (
              <><Link to="/login" onClick={() => setMobileOpen(false)} className="rounded-xl border border-slate-200 px-4 py-3 text-center text-sm font-bold text-slate-950">Sign In</Link>
              <Link to="/register" onClick={() => setMobileOpen(false)} className="rounded-xl bg-slate-950 px-4 py-3 text-center text-sm font-bold text-white shadow-lg shadow-slate-200">Sign Up</Link></>
            ) : (
              <button onClick={handleLogout} className="flex items-center justify-center gap-2 rounded-xl bg-red-50 px-4 py-3 text-sm font-bold text-red-600"><LogOut className="h-4 w-4" /> Sign Out</button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
