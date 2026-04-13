import { useState, useEffect } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { ShieldCheck, Lock, Eye, EyeOff, CheckCircle2, Mail, Loader2 } from "lucide-react";
import { authApi } from "@/lib/auth";

const VerifyEmail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const email = (location.state as any)?.email ?? "";
  const token = searchParams.get("token");

  const [step, setStep] = useState<"waiting" | "set-password" | "success">(
    token ? "set-password" : "waiting"
  );
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);

  // Auto verify if token is present in URL
  useEffect(() => {
    if (token) setStep("set-password");
  }, [token]);

  const handleSetPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (password.length < 6) { setError("Password must be at least 6 characters."); return; }
    if (password !== confirmPassword) { setError("Passwords do not match."); return; }
    if (!token) { setError("Invalid verification link."); return; }

    try {
      setIsLoading(true);
      await authApi.verifyAndSetPassword(token, password);
      setStep("success");
      setTimeout(() => navigate("/login"), 2500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Verification failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (!email) return;
    try {
      setResendLoading(true);
      await authApi.resendVerification(email);
      setResendSuccess(true);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to resend email.");
    } finally {
      setResendLoading(false);
    }
  };

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] transition placeholder:text-[var(--color-muted-fg)] focus:border-[var(--color-navy-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)]/20";

  return (
    <div className="flex min-h-[calc(100vh-4rem)] items-center justify-center bg-[var(--color-background)] px-4 py-12">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-[var(--color-border)] bg-white shadow-2xl">

        {/* Banner */}
        <div className="bg-navy-gradient px-8 py-8 text-center">
          <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-gold-gradient shadow-lg">
            {step === "set-password" || step === "success"
              ? <Lock className="h-7 w-7 text-[var(--color-navy-950)]" />
              : <ShieldCheck className="h-7 w-7 text-[var(--color-navy-950)]" />}
          </div>
          <h1 className="text-2xl font-extrabold text-white" style={{ fontFamily: "var(--font-display)" }}>
            {step === "waiting" && "Check your inbox"}
            {step === "set-password" && "Set your password"}
            {step === "success" && "All done! 🎉"}
          </h1>
          <p className="mt-1 text-sm text-white/60">
            {step === "waiting" && <>We sent a verification link to <span className="font-semibold text-white/90">{email}</span></>}
            {step === "set-password" && "Create a strong password for your account"}
            {step === "success" && "Redirecting you to login..."}
          </p>
        </div>

        <div className="px-8 py-7">
          {error && (
            <div className="mb-4 rounded-xl border border-red-200 bg-red-50 px-4 py-2.5 text-sm text-red-700">{error}</div>
          )}

          {/* Step 1: Waiting for email click */}
          {step === "waiting" && (
            <div className="space-y-5 text-center">
              <div className="flex flex-col items-center gap-3 py-4">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[var(--color-muted)]">
                  <Mail className="h-8 w-8 text-[var(--color-navy-700)]" />
                </div>
                <p className="text-sm text-[var(--color-muted-fg)]">
                  Click the verification link in your email to set your password and activate your account.
                </p>
                <p className="text-xs text-[var(--color-muted-fg)]">
                  The link expires in <span className="font-semibold text-[var(--color-foreground)]">1 hour</span>.
                </p>
              </div>

              {resendSuccess ? (
                <div className="flex items-center justify-center gap-2 rounded-xl border border-green-200 bg-green-50 px-4 py-2.5">
                  <CheckCircle2 className="h-4 w-4 text-green-600" />
                  <span className="text-sm font-medium text-green-700">Email resent successfully!</span>
                </div>
              ) : (
                <button onClick={handleResend} disabled={resendLoading}
                  className="flex w-full items-center justify-center gap-2 rounded-xl border border-[var(--color-border)] py-2.5 text-sm font-semibold text-[var(--color-navy-800)] transition hover:bg-[var(--color-muted)] disabled:opacity-60">
                  {resendLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Resend verification email"}
                </button>
              )}
            </div>
          )}

          {/* Step 2: Set password */}
          {step === "set-password" && (
            <form onSubmit={handleSetPassword} className="space-y-4">
              <div>
                <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
                  <input type={showPassword ? "text" : "password"} placeholder="Min. 6 characters"
                    className={`${inputBase} pl-10 pr-10`} value={password}
                    onChange={e => setPassword(e.target.value)} />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[var(--color-muted-fg)]">
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

              <button type="submit" disabled={isLoading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Create Account"}
              </button>
            </form>
          )}

          {/* Step 3: Success */}
          {step === "success" && (
            <div className="flex flex-col items-center gap-4 py-4 text-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                <CheckCircle2 className="h-8 w-8 text-green-600" />
              </div>
              <p className="text-sm text-[var(--color-muted-fg)]">
                Your account has been verified. You will be redirected to login shortly.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail;
