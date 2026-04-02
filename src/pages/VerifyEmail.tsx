import { useState, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2 } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";
import { type UserRole } from "@/lib/data";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { setRole } = useAuth();
  const email = (location.state as any)?.email || "your email";
  const role = (location.state as any)?.role || "user";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const [verified, setVerified] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handleOtpChange = (value: string, idx: number) => {
    if (!/^\d?$/.test(value)) return;
    const next = [...otp];
    next[idx] = value;
    setOtp(next);
    if (value && idx < 5) inputRefs.current[idx + 1]?.focus();
  };

  const handleOtpKeyDown = (e: React.KeyboardEvent, idx: number) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputRefs.current[idx - 1]?.focus();
    }
  };

  const handleVerify = () => {
    setError("");
    if (otp.join("").length < 6) { setError("Please enter the complete 6-digit code."); return; }
    setVerified(true);
  };

  const handleSetPassword = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    setRole(role as UserRole);
    navigate("/");
  };

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] transition placeholder:text-[var(--color-muted-fg)] focus:border-[var(--color-navy-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)]/20";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-2xl">

        {/* Banner */}
        <div className="bg-navy-gradient px-8 py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient shadow-lg">
            {verified
              ? <Lock className="h-7 w-7 text-[var(--color-navy-950)]" />
              : <ShieldCheck className="h-7 w-7 text-[var(--color-navy-950)]" />}
          </div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {verified ? "Set your password" : "Check your inbox"}
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {verified
              ? "Create a strong password for your account"
              : <>We sent a 6-digit code to <span className="font-semibold text-white/90">{email}</span></>}
          </p>
        </div>

        <div className="px-8 py-7">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
          )}

          {!verified ? (
            <div className="space-y-6">
              {/* OTP inputs */}
              <div>
                <label className="mb-3 block text-xs font-semibold text-[var(--color-muted-fg)]">Enter verification code</label>
                <div className="flex justify-center gap-2">
                  {otp.map((digit, i) => (
                    <input
                      key={i}
                      ref={el => { inputRefs.current[i] = el; }}
                      type="text"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={e => handleOtpChange(e.target.value, i)}
                      onKeyDown={e => handleOtpKeyDown(e, i)}
                      className="h-12 w-12 rounded-xl border-2 border-[var(--color-border)] bg-[var(--color-muted)] text-center text-lg font-bold text-[var(--color-foreground)] transition focus:border-[var(--color-navy-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)]/20"
                    />
                  ))}
                </div>
              </div>

              <button
                onClick={handleVerify}
                className="w-full rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]"
              >
                Verify Email
              </button>

              <p className="text-center text-sm text-[var(--color-muted-fg)]">
                Didn't get a code?{" "}
                <button
                  type="button"
                  onClick={() => alert("Verification code resent!")}
                  className="font-semibold text-[var(--color-navy-800)] hover:underline"
                >
                  Resend
                </button>
              </p>
            </div>
          ) : (
            <form onSubmit={handleSetPassword} className="space-y-4">
              {/* Success indicator */}
              <div className="mb-2 flex items-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <span className="text-sm font-medium text-green-700">Email verified successfully!</span>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
                  <input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters"
                    className={`${inputBase} pl-10 pr-10`} value={password}
                    onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)]">
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">Confirm password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
                  <input type={showPassword ? "text" : "password"} placeholder="Re-enter your password"
                    className={`${inputBase} pl-10`} value={confirmPassword}
                    onChange={e => setConfirmPassword(e.target.value)} />
                </div>
              </div>

              <button type="submit"
                className="w-full rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]">
                Create Account
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
