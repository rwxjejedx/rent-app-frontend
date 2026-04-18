import { Link } from "react-router-dom";
import { AlertCircle, ArrowRight } from "lucide-react";

const ProfileIncompleteGuard = () => {
  return (
    <div className="mx-auto max-w-lg px-4 py-20 text-center">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-amber-100 mx-auto">
        <AlertCircle className="h-10 w-10 text-amber-600" />
      </div>
      <h2 className="text-2xl font-extrabold text-[var(--color-foreground)] mb-3"
        style={{ fontFamily: "var(--font-display)" }}>
        Complete Your Profile First
      </h2>
      <p className="text-sm text-[var(--color-muted-fg)] mb-8">
        Before adding a property, you need to complete your tenant profile including NPWP, office address, and bank account information.
      </p>
      <Link to="/dashboard/profile"
        className="inline-flex items-center gap-2 rounded-xl bg-navy-gradient px-6 py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90">
        Complete Profile <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
};

export default ProfileIncompleteGuard;
