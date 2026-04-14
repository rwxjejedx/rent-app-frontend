import { useSearchParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import axios from "axios";

const SetPassword = () => {
  const [searchParams] = useSearchParams();
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const token = searchParams.get("token");
  const role = searchParams.get("role");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Di sinilah VERIFY terjadi (POST ke Backend)
      await axios.post("http://localhost:3000/api/v1/auth/verify", {
        token,
        role,
        password // Password baru dari input user
      });
      alert("Verifikasi Berhasil! Silakan Login.");
      navigate("/login");
    } catch (err) {
      alert("Link sudah kadaluarsa atau tidak valid.");
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background p-4">
      <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-4 rounded-xl border bg-white p-8 shadow-lg">
        <h2 className="text-xl font-bold font-display">Set Your Password</h2>
        <p className="text-sm text-muted-foreground">Please enter a new password for your {role} account.</p>
        <input 
          type="password" 
          className="w-full rounded-lg border border-border p-3 focus:outline-none focus:ring-2 focus:ring-navy-700/20"
          placeholder="New Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
        />
        <button type="submit" className="w-full rounded-lg bg-navy-gradient py-3 font-bold text-white transition hover:opacity-90">
          Verify & Save
        </button>
      </form>
    </div>
  );
};

export default SetPassword;