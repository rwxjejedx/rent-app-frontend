import { createContext, useContext, useState, type ReactNode } from "react";
import { type UserRole } from "@/lib/data";

interface AuthContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
}

const AuthContext = createContext<AuthContextType>({ role: "guest", setRole: () => {} });

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [role, setRole] = useState<UserRole>("guest");
  return <AuthContext.Provider value={{ role, setRole }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
