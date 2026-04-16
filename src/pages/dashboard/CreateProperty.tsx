import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, X, MapPin, Building, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import api from "@/lib/api";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

const CreateProperty = () => {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    location: "",
    city: "",
    categoryId: 1,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Check profile completion
  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["my-profile"],
    queryFn: () => api.get('/users/me').then(r => r.data),
  });

  // Fetch categories
  const { data: categories } = useQuery({
    queryKey: ["categories"],
    queryFn: () => api.get('/categories').then(r => r.data),
  });

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    try {
      const uploadPromises = files.map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST",
          body: data,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error?.message || "Upload failed");
        return result.secure_url;
      });
      const uploadedUrls = await Promise.all(uploadPromises);
      setImages(prev => [...prev, ...uploadedUrls]);
      toast({ title: "Images uploaded!", variant: "success" });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post('/properties', payload),
    onSuccess: () => {
      toast({ title: "Property Published!", variant: "success" });
      navigate("/dashboard");
    },
    onError: (err: any) => {
      const errMsg = err.response?.data?.message || "Check your input and role";
      toast({ title: "Create Failed", description: errMsg, variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.description.length < 10) {
      return toast({ title: "Error", description: "Description must be at least 10 characters", variant: "destructive" });
    }
    if (images.length === 0) {
      return toast({ title: "Error", description: "Please upload at least 1 photo", variant: "destructive" });
    }
    mutation.mutate({
      name: formData.name,
      description: formData.description,
      location: formData.location,
      city: formData.city,
      categoryId: Number(formData.categoryId),
      images,
    });
  };

  if (profileLoading) return (
    <div className="flex h-[60vh] items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-navy-700" />
    </div>
  );

  // Guard: profile must be complete
  if (!profile?.isProfileComplete) {
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
  }

  return (
    <div className="max-w-3xl mx-auto p-8 bg-white rounded-3xl border shadow-xl mt-12 mb-20 animate-fade-up">
      <h2 className="text-3xl font-extrabold mb-8 font-display text-navy-900 tracking-tight">New Property Listing</h2>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Visual Gallery */}
        <div className="space-y-4">
          <label className="text-xs font-black text-navy-700 uppercase tracking-widest">Visual Gallery</label>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-square rounded-2xl overflow-hidden border group">
                <img src={url} className="object-cover w-full h-full transition group-hover:scale-110" alt="preview" />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-rose-600 shadow-md">
                  <X size={14} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
              {uploading ? <Loader2 className="animate-spin text-navy-700" /> : <ImagePlus className="text-slate-400" />}
              <span className="text-[10px] font-bold text-slate-500 uppercase mt-2">{uploading ? "Uploading..." : "Add Photo"}</span>
              <input type="file" multiple className="hidden" onChange={handleImageUpload} disabled={uploading} accept="image/*" />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Property Name</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 pl-12 text-sm"
                placeholder="Ex: StayEase Villa" required
                value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 pl-12 text-sm"
                placeholder="Ex: Jakarta" required
                value={formData.city} onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Full Address</label>
          <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm"
            placeholder="Street name, number, etc." required
            value={formData.location} onChange={(e) => setFormData({ ...formData, location: e.target.value })} />
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Category</label>
          <select
            className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm"
            value={formData.categoryId}
            onChange={(e) => setFormData({ ...formData, categoryId: Number(e.target.value) })}
          >
            {categories?.map((c: any) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Description</label>
          <textarea className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm min-h-[120px]"
            placeholder="Tell users about your property..." required
            value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} />
        </div>

        <button type="submit" disabled={mutation.isPending || uploading}
          className="w-full bg-navy-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition hover:bg-navy-800 disabled:opacity-50 shadow-xl">
          {mutation.isPending ? "Publishing..." : "Launch Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;
