import { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Menu, X, User, ChevronDown, LogOut, LayoutDashboard } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const Navbar = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { user, isAuthenticated, isUser, isTenant, logout } = useAuth();
  const dropRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropRef.current && !dropRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    setMobileOpen(false);
    navigate('/');
  };

  return (
    <nav className="bg-navy-gradient sticky top-0 z-50 shadow-[0_2px_20px_rgba(0,0,0,0.3)]">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">

        {/* Logo */}
        <Link to="/" className="flex items-center gap-2.5 text-white">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gold-gradient">
            <Building2 className="h-4.5 w-4.5 text-[var(--color-navy-950)]" />
          </div>
          <span style={{ fontFamily: "var(--font-display)" }} className="text-xl font-bold tracking-tight">
            StayEase
          </span>
        </Link>

        {/* Desktop nav */}
        <div className="hidden items-center gap-8 md:flex">
          <Link to="/" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
            Home
          </Link>
          {isUser && (
            <Link to="/bookings" className="text-sm font-medium text-white/70 transition-colors hover:text-white">
              My Bookings
            </Link>
          )}
          {isTenant && (
            <>
              <Link to="/dashboard/bookings" className="text-sm font-medium text-white/70 transition-colors hover:text-white">Reservations</Link>
            </>
          )}

          {!isAuthenticated ? (
            <div className="flex items-center gap-3">
              <Link to="/login"
                className="rounded-lg px-4 py-2 text-sm font-medium text-white/80 transition hover:bg-white/10 hover:text-white">
                Sign In
              </Link>
              <Link to="/register"
                className="rounded-lg bg-gold-gradient px-4 py-2 text-sm font-semibold text-[var(--color-navy-950)] transition-opacity hover:opacity-90">
                Sign Up
              </Link>
            </div>
          ) : (
            <div className="relative" ref={dropRef}>
              <button
                onClick={() => setDropdownOpen(!dropdownOpen)}
                className="flex items-center gap-2 rounded-lg bg-white/10 px-3 py-2 text-sm font-medium text-white transition hover:bg-white/15"
              >
                {user?.avatar
                  ? <img src={user.avatar} className="h-6 w-6 rounded-full object-cover" />
                  : <User className="h-4 w-4" />
                }
                {user?.name?.split(' ')[0] ?? 'Account'}
                <ChevronDown className={`h-3.5 w-3.5 transition-transform ${dropdownOpen ? "rotate-180" : ""}`} />
              </button>
              {dropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 overflow-hidden rounded-xl border border-[var(--color-border)] bg-white shadow-xl">
                  <div className="border-b border-[var(--color-border)] px-4 py-3">
                    <p className="text-xs font-semibold text-[var(--color-foreground)]">{user?.name}</p>
                    <p className="text-xs text-[var(--color-muted-fg)]">{user?.email}</p>
                  </div>
                  {isTenant && (
                    <Link to="/dashboard"
                      onClick={() => setDropdownOpen(false)}
                      className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)]">
                      <LayoutDashboard className="h-4 w-4" /> Dashboard
                    </Link>
                  )}
                  <Link to="/profile"
                    onClick={() => setDropdownOpen(false)}
                    className="flex items-center gap-2 px-4 py-3 text-sm text-[var(--color-foreground)] transition hover:bg-[var(--color-muted)]">
                    <User className="h-4 w-4" /> Profile
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex w-full items-center gap-2 px-4 py-3 text-sm text-[var(--color-destructive)] transition hover:bg-[var(--color-muted)]"
                  >
                    <LogOut className="h-4 w-4" /> Sign Out
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Mobile toggle */}
        <button
          className="rounded-lg p-2 text-white/80 transition hover:bg-white/10 hover:text-white md:hidden"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="border-t border-white/10 bg-[var(--color-navy-900)] px-4 pb-5 pt-3 md:hidden">
          <div className="flex flex-col gap-1">
            <Link to="/" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">Home</Link>
            {isUser && <Link to="/bookings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">My Bookings</Link>}
            {isTenant && <>
              <Link to="/dashboard/properties" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">My Properties</Link>
              <Link to="/dashboard/bookings" onClick={() => setMobileOpen(false)} className="rounded-lg px-3 py-2.5 text-sm font-medium text-white/80 hover:bg-white/10 hover:text-white">Reservations</Link>
            </>}
          </div>
          <div className="mt-4 flex gap-2 border-t border-white/10 pt-4">
            {!isAuthenticated ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg border border-white/20 px-4 py-2 text-center text-sm font-medium text-white transition hover:bg-white/10">Sign In</Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="flex-1 rounded-lg bg-gold-gradient px-4 py-2 text-center text-sm font-semibold text-[var(--color-navy-950)]">Sign Up</Link>
              </>
            ) : (
              <button onClick={handleLogout} className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-red-400 hover:bg-white/10">
                <LogOut className="h-4 w-4" /> Sign Out
              </button>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
