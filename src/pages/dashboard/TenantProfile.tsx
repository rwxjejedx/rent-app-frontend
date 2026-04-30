import { Loader2, Save } from "lucide-react";
import { useTenantProfile } from "@/hooks/useTenantProfile";
import { ProfileHeader, CompletionBanner } from "@/components/dashboard/profile/ProfileBanners";
import { BasicInfoSection, ContactSection, BusinessSection, BankSection } from "@/components/dashboard/profile/ProfileFormSections";

const TenantProfile = () => {
  const {
    profile, isLoading, isSaving, error, success, form, setForm,
    completedCount, completionPercent, handleSave
  } = useTenantProfile();

  if (isLoading) return <LoadingState />;

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <ProfileHeader />
      <CompletionBanner profile={profile} completedCount={completedCount} completionPercent={completionPercent} />
      
      <form onSubmit={handleSave} className="space-y-6">
        <StatusMessages error={error} success={success} />
        <BasicInfoSection form={form} setForm={setForm} email={profile?.email} />
        <ContactSection form={form} setForm={setForm} />
        <BusinessSection form={form} setForm={setForm} />
        <BankSection form={form} setForm={setForm} />
        <SubmitButton isSaving={isSaving} />
      </form>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex min-h-[60vh] items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
  </div>
);

const StatusMessages = ({ error, success }: { error: string; success: string }) => (
  <>
    {error && <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{error}</div>}
    {success && <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">{success}</div>}
  </>
);

const SubmitButton = ({ isSaving }: { isSaving: boolean }) => (
  <button type="submit" disabled={isSaving}
    className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-3.5 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-60">
    {isSaving ? <><Loader2 className="h-4 w-4 animate-spin" /> Saving...</> : <><Save className="h-4 w-4" /> Save Profile</>}
  </button>
);

export default TenantProfile;
