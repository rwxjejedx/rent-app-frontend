import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import api from "@/lib/api";

const REQUIRED_FIELDS = ['phone', 'npwp', 'officeAddress', 'bankName', 'bankAccount'];

export const useTenantProfile = () => {
  const { user, login, token } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [form, setForm] = useState({ name: "", phone: "", npwp: "", officeAddress: "", bankName: "", bankAccount: "" });

  useEffect(() => {
    api.get('/users/me').then(res => {
      setProfile(res.data);
      setForm({
        name: res.data.name ?? "", phone: res.data.phone ?? "", npwp: res.data.npwp ?? "",
        officeAddress: res.data.officeAddress ?? "", bankName: res.data.bankName ?? "", bankAccount: res.data.bankAccount ?? "",
      });
    }).catch(() => setError("Failed to load profile")).finally(() => setIsLoading(false));
  }, []);

  const completedCount = REQUIRED_FIELDS.filter(f => form[f as keyof typeof form]).length;
  const completionPercent = Math.round((completedCount / REQUIRED_FIELDS.length) * 100);
  const isComplete = completedCount === REQUIRED_FIELDS.length;

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(""); setSuccess("");
    try {
      setIsSaving(true);
      await api.put('/users/me', { name: form.name });
      await api.put('/users/me/tenant-profile', { ...form });
      if (user && token) login(token, { ...user, name: form.name });
      setSuccess("Profile updated successfully!");
      if (isComplete) setTimeout(() => navigate('/dashboard'), 1500);
    } catch (err: any) {
      setError(err.response?.data?.message ?? "Failed to update profile");
    } finally {
      setIsSaving(false);
    }
  };

  return {
    profile, isLoading, isSaving, error, success, form, setForm,
    completedCount, completionPercent, isComplete, handleSave
  };
};
