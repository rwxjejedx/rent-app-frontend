import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";
import {
  User, Phone, MapPin, CreditCard, Building2,
  FileText, CheckCircle2, AlertCircle, Loader2, Save
} from "lucide-react";

interface TenantProfile {
  id: number;
  name: string;
  email: string;
  phone?: string;
  npwp?: string;
  officeAddress?: string;
  bankName?: string;
  bankAccount?: string;
  avatar?: string;
  isProfileComplete: boolean;
}

const REQUIRED_FIELDS = ['phone', 'npwp', 'officeAddress', 'bankName', 'bankAccount'];

const TenantProfile = () => {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();

  const [profile, setProfile] = useState<TenantProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    name: "",
    phone: "",
    npwp: "",
    officeAddress: "",
    bankName: "",
    bankAccount: "",
  });

  useEffect(() => {
    api.get('/users/me').then(res => {
      setProfile(res.data);
      setForm({
        name: res.data.name ?? "",
        phone: res.data.phone ?? "",
        npwp: res.data.npwp ?? "",
        officeAddress: res.data.officeAddress ?? "",
        bankName: res.data.bankName ?? "",
        bankAccount: res.data.bankAccount ?? "",
      });
    }).catch(console.error)
      .finally(() => setIsLoading(false));
  }, []);

  const completedCount = REQUIRED_FIELDS.filter(f => form[f as keyof typeof form]).length;
  const completionPercent = Math.round((completedCount / REQUIRED_FIELDS.length) * 100);
  const isComplete = completedCount === REQUIRED_FIELDS.length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setIsSaving(true);
      await api.put('/users/me', { name: form.name });
      await api.put('/users/me/tenant-profile', {
        phone: form.phone,
        npwp: form.npwp,
        officeAddress: form.officeAddress,
        bankName: form.bankName,
        bankAccount: form.bankAccount,
      });

      // Update user in auth context
      if (user && token) {
        login(token, { ...user, name: form.name });
      }

      setSuccess("Profile updated successfully!");
      if (isComplete) {
        setTimeout(() => navigate('/dashboard'), 1500);
      }
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
    </div>
  );

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] transition focus:border-[var(--color-navy-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)]/20";

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">

      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-extrabold text-[var(--color-foreground)]"
          style={{ fontFamily: "var(--font-display)" }}>
          Tenant Profile
        </h1>
        <p className="mt-1 text-sm text-[var(--color-muted-fg)]">
          Complete your profile to start listing properties
        </p>
      </div>

      {/* Completion Banner */}
      {!profile?.isProfileComplete && (
        <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm font-semibold text-amber-800">Profile Incomplete</p>
              <p className="text-xs text-amber-700 mt-0.5">
                You need to complete all required fields before you can add properties.
              </p>
              <div className="mt-3">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium text-amber-700">{completedCount}/{REQUIRED_FIELDS.length} fields completed</span>
                  <span className="text-xs font-bold text-amber-800">{completionPercent}%</span>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200">
                  <div
                    className="h-full rounded-full bg-amber-500 transition-all duration-500"
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {profile?.isProfileComplete && (
        <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
          <p className="text-sm font-semibold text-green-800">Profile Complete — You can list properties!</p>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {error && (
          <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>
        )}
        {success && (
          <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>
        )}

        {/* Basic Info */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <User className="h-5 w-5 text-[var(--color-navy-700)]" />
            <h2 className="text-base font-bold text-[var(--color-foreground)]">Basic Information</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">Full Name</label>
              <input type="text" className={inputBase} value={form.name}
                onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">Email</label>
              <input type="email" className={`${inputBase} opacity-60 cursor-not-allowed`}
                value={profile?.email ?? ""} disabled />
            </div>
          </div>
        </div>

        {/* Contact */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Phone className="h-5 w-5 text-[var(--color-navy-700)]" />
            <h2 className="text-base font-bold text-[var(--color-foreground)]">Contact Information</h2>
            <span className="ml-auto text-xs text-red-500 font-medium">Required</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input type="tel" className={inputBase} value={form.phone}
                onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="+62 812 3456 7890" />
            </div>
          </div>
        </div>

        {/* Business Info */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Building2 className="h-5 w-5 text-[var(--color-navy-700)]" />
            <h2 className="text-base font-bold text-[var(--color-foreground)]">Business Information</h2>
            <span className="ml-auto text-xs text-red-500 font-medium">Required</span>
          </div>
          <div className="space-y-4">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">
                NPWP <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
                <input type="text" className={`${inputBase} pl-10`} value={form.npwp}
                  onChange={e => setForm({ ...form, npwp: e.target.value })}
                  placeholder="XX.XXX.XXX.X-XXX.XXX" />
              </div>
              <p className="mt-1 text-xs text-[var(--color-muted-fg)]">Nomor Pokok Wajib Pajak</p>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">
                Office Address <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--color-muted-fg)]" />
                <textarea className={`${inputBase} pl-10 min-h-[80px] resize-none`} value={form.officeAddress}
                  onChange={e => setForm({ ...form, officeAddress: e.target.value })}
                  placeholder="Jl. Sudirman No. 1, Jakarta Pusat" />
              </div>
            </div>
          </div>
        </div>

        {/* Bank Info */}
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <CreditCard className="h-5 w-5 text-[var(--color-navy-700)]" />
            <h2 className="text-base font-bold text-[var(--color-foreground)]">Bank Account</h2>
            <span className="ml-auto text-xs text-red-500 font-medium">Required</span>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">
                Bank Name <span className="text-red-500">*</span>
              </label>
              <select className={`${inputBase} cursor-pointer`} value={form.bankName}
                onChange={e => setForm({ ...form, bankName: e.target.value })}>
                <option value="">Select bank...</option>
                {["BCA", "BRI", "BNI", "Mandiri", "BSI", "CIMB Niaga", "Danamon", "Permata", "Bank Jago", "SeaBank"].map(b => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">
                Account Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
                <input type="text" className={`${inputBase} pl-10`} value={form.bankAccount}
                  onChange={e => setForm({ ...form, bankAccount: e.target.value })}
                  placeholder="1234567890" />
              </div>
            </div>
          </div>
        </div>

        <button type="submit" disabled={isSaving}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
          {isSaving
            ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</>
            : <><Save className="h-4 w-4" /> Save Profile</>}
        </button>
      </form>
    </div>
  );
};

export default TenantProfile;
