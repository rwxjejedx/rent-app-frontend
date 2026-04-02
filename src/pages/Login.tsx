import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, Lock, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import SocialLoginButtons from "@/components/SocialLoginButtons";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [activeTab, setActiveTab] = useState<"user" | "tenant">("user");
  const [error, setError] = useState("");
  const { setRole } = useAuth();
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return setError("Please fill in all fields.");
    setRole(activeTab); // Set role as User or Tenant [cite: 13, 259]
    navigate("/");
  };

  const inputClasses = "w-full rounded-xl border border-border bg-muted px-4 py-3 pl-10 text-sm transition focus:border-navy-700 focus:bg-white focus:outline-none focus:ring-2 focus:ring-navy-700/20";

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4 py-8">
      <div className="w-full max-w-md overflow-hidden rounded-xl border border-border bg-white shadow-2xl animate-fade-up">
        
        {/* Header Section */}
        <div className="bg-navy-gradient px-8 py-10 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient shadow-lg">
            <Building2 className="h-7 w-7 text-navy-950" />
          </div>
          <h1 className="text-2xl font-extrabold text-white">Welcome Back</h1>
          <p className="text-sm text-white/60">Sign in to your StayEase account</p>
        </div>

        <div className="px-8 py-8">
          {/* Role Switcher [cite: 67, 312] */}
          <div className="mb-6 flex rounded-lg border border-border bg-muted p-1">
            {(["user", "tenant"] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-md py-2 text-sm font-semibold transition-all ${
                  activeTab === tab ? "bg-white text-navy-900 shadow-sm" : "text-muted-foreground"
                }`}
              >
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>

          <SocialLoginButtons label="Sign in" />

          <div className="my-6 flex items-center gap-3 text-muted-foreground">
            <div className="h-px flex-1 bg-border" />
            <span className="text-xs uppercase tracking-wider">Or email</span>
            <div className="h-px flex-1 bg-border" />
          </div>

          <form onSubmit={handleLogin} className="space-y-4">
            {error && <div className="rounded-lg bg-destructive/10 p-3 text-xs text-destructive">{error}</div>}

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type="email" className={inputClasses} value={email} onChange={e => setEmail(e.target.value)} placeholder="name@domain.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-muted-foreground">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input type={showPassword ? "text" : "password"} className={inputClasses} value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            <button type="submit" className="w-full rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-95">
              Sign In
            </button>
          </form>

          <p className="mt-8 text-center text-sm text-muted-foreground">
            New here? <Link to="/register" className="font-bold text-navy-800 hover:underline">Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;