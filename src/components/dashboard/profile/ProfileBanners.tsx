import { CheckCircle2, AlertCircle } from "lucide-react";

export const ProfileHeader = () => (
  <div className="mb-8">
    <h1 className="text-3xl font-extrabold text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-display)" }}>
      Tenant Profile
    </h1>
    <p className="mt-1 text-sm text-[var(--color-muted-fg)]">Complete your profile to start listing properties</p>
  </div>
);

export const CompletionBanner = ({ profile, completedCount, completionPercent }: any) => {
  if (profile?.isProfileComplete) {
    return (
      <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
        <CheckCircle2 className="h-5 w-5 text-green-600 shrink-0" />
        <p className="text-sm font-semibold text-green-800">Profile Complete — You can list properties!</p>
      </div>
    );
  }
  return <IncompleteBanner completedCount={completedCount} completionPercent={completionPercent} />;
};

const IncompleteBanner = ({ completedCount, completionPercent }: any) => (
  <div className="mb-6 rounded-2xl border border-amber-200 bg-amber-50 p-4">
    <div className="flex items-start gap-3">
      <AlertCircle className="h-5 w-5 shrink-0 text-amber-600 mt-0.5" />
      <div className="flex-1">
        <p className="text-sm font-semibold text-amber-800">Profile Incomplete</p>
        <p className="text-xs text-amber-700 mt-0.5">You need to complete all required fields before you can add properties.</p>
        <ProgressBar count={completedCount} percent={completionPercent} />
      </div>
    </div>
  </div>
);

const ProgressBar = ({ count, percent }: { count: number; percent: number }) => (
  <div className="mt-3">
    <div className="flex items-center justify-between mb-1">
      <span className="text-xs font-medium text-amber-700">{count}/5 fields completed</span>
      <span className="text-xs font-bold text-amber-800">{percent}%</span>
    </div>
    <div className="h-2 w-full overflow-hidden rounded-full bg-amber-200">
      <div className="h-full rounded-full bg-amber-500 transition-all duration-500" style={{ width: `${percent}%` }} />
    </div>
  </div>
);
