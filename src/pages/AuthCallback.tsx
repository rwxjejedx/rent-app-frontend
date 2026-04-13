import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { type User } from "@/lib/auth";
import { Loader2 } from "lucide-react";

const AuthCallback = () => {
  const [searchParams] = useSearchParams();
  const { login } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");
    const role = searchParams.get("role");

    if (!token) {
      navigate("/login");
      return;
    }

    // Decode JWT to get user info (basic decode, no verification)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const user: User = {
        id: payload.userId,
        email: "",
        name: "",
        role: role === "TENANT" ? "TENANT" : "USER",
      };

      login(token, user);

      if (role === "TENANT") navigate("/dashboard");
      else navigate("/");
    } catch {
      navigate("/login");
    }
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="flex flex-col items-center gap-3">
        <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
        <p className="text-sm text-[var(--color-muted-fg)]">Signing you in...</p>
      </div>
    </div>
  );
};

export default AuthCallback;
