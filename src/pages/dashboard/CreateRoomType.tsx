import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { Bed, Users, Wallet, Loader2, ArrowLeft, AlignLeft, ImagePlus, X } from "lucide-react";

const CLOUDINARY_CLOUD_NAME = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
const CLOUDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

const CreateRoomType = () => {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [formData, setForm] = useState({
    name: "",
    description: "",
    basePrice: "",
    capacity: 2,
  });
  const [images, setImages] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    setUploading(true);
    const files = Array.from(e.target.files);
    try {
      const urls = await Promise.all(files.map(async (file) => {
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
        const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
          method: "POST", body: data,
        });
        const result = await res.json();
        if (!res.ok) throw new Error(result.error?.message || "Upload failed");
        return result.secure_url as string;
      }));
      setImages(prev => [...prev, ...urls]);
      toast({ title: "Images uploaded!", variant: "success" });
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.message, variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const mutation = useMutation({
    mutationFn: (payload: any) => api.post(`/rooms/properties/${propertyId}/room-types`, payload),
    onSuccess: () => {
      toast({ title: "Room Type Created!", variant: "success" });
      navigate(`/dashboard/property/${propertyId}`);
    },
    onError: (err: any) => {
      toast({ title: "Failed", description: err.response?.data?.message || "Check validation", variant: "destructive" });
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate({
      name: formData.name,
      description: formData.description,
      basePrice: Number(formData.basePrice),
      capacity: Number(formData.capacity),
      images,
    });
  };

  const inputBase = "w-full bg-slate-50 border-0 rounded-2xl p-4 text-sm focus:ring-2 focus:ring-navy-500 transition-all";

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-400 hover:text-navy-900 transition-colors text-xs font-black uppercase tracking-widest mb-8">
        <ArrowLeft size={14} /> Back
      </button>

      <div className="mb-8">
        <h2 className="text-3xl font-black text-navy-900 tracking-tight">Add Room Type</h2>
        <p className="text-slate-400 font-medium mt-1">Define a new room category with photos.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">

        {/* Image Upload */}
        <div className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-sm">
          <label className="mb-3 block text-[10px] font-black text-slate-400 uppercase tracking-widest">Room Photos</label>
          <div className="grid grid-cols-3 gap-3">
            {images.map((url, idx) => (
              <div key={idx} className="relative aspect-video rounded-xl overflow-hidden group">
                <img src={url} className="w-full h-full object-cover" alt="room" />
                <button type="button" onClick={() => setImages(images.filter((_, i) => i !== idx))}
                  className="absolute top-1.5 right-1.5 bg-white/90 p-1 rounded-full text-red-500 opacity-0 group-hover:opacity-100 transition shadow">
                  <X size={12} />
                </button>
              </div>
            ))}
            <label className="flex flex-col items-center justify-center aspect-video rounded-xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
              {uploading
                ? <Loader2 className="animate-spin text-navy-700" size={20} />
                : <><ImagePlus className="text-slate-300" size={20} /><span className="text-[10px] font-bold text-slate-400 mt-1.5">Add Photo</span></>}
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} disabled={uploading} />
            </label>
          </div>
        </div>

        {/* Room Name */}
        <div className="rounded-[2rem] bg-white border border-slate-100 p-6 shadow-sm space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Room Category Name</label>
            <div className="relative">
              <Bed className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4" />
              <input className={`${inputBase} pl-12`} placeholder="Ex: Deluxe King Suite" required
                value={formData.name} onChange={e => setForm({ ...formData, name: e.target.value })} />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Base Price / Night</label>
              <div className="relative">
                <Wallet className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4" />
                <input type="number" className={`${inputBase} pl-12`} placeholder="500000" required
                  value={formData.basePrice} onChange={e => setForm({ ...formData, basePrice: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Capacity</label>
              <div className="relative">
                <Users className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 size-4" />
                <input type="number" className={`${inputBase} pl-12`} required
                  value={formData.capacity} onChange={e => setForm({ ...formData, capacity: Number(e.target.value) })} />
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-1">Description</label>
            <div className="relative">
              <AlignLeft className="absolute left-4 top-4 text-slate-300 size-4" />
              <textarea className={`${inputBase} pl-12 min-h-[90px] resize-none`}
                placeholder="Describe the room features, amenities, view..." required
                value={formData.description} onChange={e => setForm({ ...formData, description: e.target.value })} />
            </div>
          </div>
        </div>

        <button type="submit" disabled={mutation.isPending || uploading}
          className="w-full bg-navy-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-navy-800 transition-all disabled:opacity-50 active:scale-95">
          {mutation.isPending ? <Loader2 className="animate-spin mx-auto" size={16} /> : "Create Room Type"}
        </button>
      </form>
    </div>
  );
};

export default CreateRoomType;
