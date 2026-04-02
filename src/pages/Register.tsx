import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Building2, Mail, ArrowRight } from "lucide-react";
import SocialLoginButtons from "@/components/SocialLoginButtons";

const Register = () => {
  const [email, setEmail] = useState("");
  const [activeTab, setActiveTab] = useState<"user" | "tenant">("user");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!email) { setError("Please enter your email address."); return; }
    navigate("/verify-email", { state: { email, role: activeTab } });
  };

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] transition placeholder:text-[var(--color-muted-fg)] focus:border-[var(--color-navy-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)]/20";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-2xl">

        {/* Banner */}
        <div className="bg-navy-gradient px-8 py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient shadow-lg">
            <Building2 className="h-7 w-7 text-[var(--color-navy-950)]" />
          </div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
            Create an account
          </h1>
          <p className="mt-1 text-sm text-white/60">
            Join StayEase as a {activeTab === "user" ? "traveler" : "property owner"}
          </p>
        </div>

        <div className="px-8 py-7">
          {/* Role tabs */}
          <div className="mb-6 flex rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] p-1">
            {(["user", "tenant"] as const).map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)}
                className={`flex-1 rounded-lg py-2 text-sm font-semibold transition-all
                  ${activeTab === tab
                    ? "bg-white text-[var(--color-navy-900)] shadow-sm"
                    : "text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)]"
                  }`}>
                {tab === "user" ? "🧳 Traveler" : "🏠 Tenant"}
              </button>
            ))}
          </div>

          {/* Role description */}
          <div className="mb-5 rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-xs text-[var(--color-muted-fg)]">
            {activeTab === "user"
              ? "🌏 Browse thousands of properties and book your perfect stay across Indonesia."
              : "🔑 List and manage your properties, set pricing, and track your earnings."}
          </div>

          {/* Social */}
          <SocialLoginButtons label="Sign up" />

          <div className="my-5 flex items-center gap-3">
            <div className="h-px flex-1 bg-[var(--color-border)]" />
            <span className="text-xs text-[var(--color-muted-fg)]">or sign up with email</span>
            <div className="h-px flex-1 bg-[var(--color-border)]" />
          </div>

          {/* Form */}
          <form onSubmit={handleRegister} className="space-y-4">
            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
            )}
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">Email address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  className={`${inputBase} pl-10`}
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button type="submit"
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]">
              Continue <ArrowRight className="h-4 w-4" />
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-[var(--color-muted-fg)]">
            Already have an account?{" "}
            <Link to="/login" className="font-semibold text-[var(--color-navy-800)] hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Register;
