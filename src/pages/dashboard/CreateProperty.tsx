import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { ImagePlus, X, MapPin, AlignLeft, Building, Loader2 } from "lucide-react";

// KONFIGURASI DI SINI
const CLOUDINARY_CLOUD_NAME = "dlihs7whi"; // Ganti ini!
const CLOUDINARY_UPLOAD_PRESET = "rental"; // Ganti ini!

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
        if (!res.ok) throw new Error(result.error?.message || "Cloudinary Error");
        return result.secure_url;
      });

      const uploadedUrls = await Promise.all(uploadPromises);
      setImages((prev) => [...prev, ...uploadedUrls]);
      toast({ title: "Images uploaded!", variant: "success" });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
  mutationFn: (payload: any) => {
    const token = localStorage.getItem("token");
    // Gunakan URL lengkap jika belum ada axios config global
    return axios.post("http://localhost:3000/api/v1/properties", payload, {
      headers: { Authorization: `Bearer ${token}` }
    });
  },
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

  // Validasi sederhana di frontend sebelum kirim ke backend
  if (formData.description.length < 10) {
    return toast({ title: "Error", description: "Deskripsi minimal 10 karakter", variant: "destructive" });
  }
  
  if (images.length === 0) {
    return toast({ title: "Error", description: "Minimal upload 1 foto", variant: "destructive" });
  }

  const payload = {
    name: formData.name,
    description: formData.description,
    location: formData.location,
    city: formData.city,
    categoryId: Number(formData.categoryId) || 1, // Pastikan jadi angka
    images: images // Array URL dari Cloudinary
  };

  console.log("Payload yang dikirim:", payload); // Cek di console log browser
  mutation.mutate(payload);
};

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

        {/* Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Property Name</label>
            <div className="relative">
              <Building className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 pl-12 text-sm" 
                placeholder="Ex: StayEase Villa" required
                value={formData.name} onChange={(e) => setFormData({...formData, name: e.target.value})} />
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">City</label>
            <div className="relative">
              <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4" />
              <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 pl-12 text-sm" 
                placeholder="Ex: Jakarta" required
                value={formData.city} onChange={(e) => setFormData({...formData, city: e.target.value})} />
            </div>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Full Address</label>
          <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm" 
            placeholder="Street name, number, etc." required
            value={formData.location} onChange={(e) => setFormData({...formData, location: e.target.value})} />
        </div>
        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Category</label>
          <select 
            className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-navy-700/10 transition"
            value={formData.categoryId}
            onChange={(e) => setFormData({...formData, categoryId: Number(e.target.value)})}
          >
            <option value={1}>Hotel</option>
            <option value={2}>Apartment</option>
            <option value={3}>Villa</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Description</label>
          <textarea className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm min-h-[120px]" 
            placeholder="Tell users about your property..." required
            value={formData.description} onChange={(e) => setFormData({...formData, description: e.target.value})} />
        </div>

        <button type="submit" disabled={mutation.isPending || uploading}
          className="w-full bg-navy-900 text-white py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition hover:bg-navy-800 disabled:opacity-50 shadow-xl">
          {mutation.isPending ? "Syncing..." : "Launch Listing"}
        </button>
      </form>
    </div>
  );
};

export default CreateProperty;