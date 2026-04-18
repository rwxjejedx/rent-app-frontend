import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { 
  Calendar, 
  TrendingUp, 
  Loader2, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert,
  Info
} from "lucide-react";

const ManageAvailability = () => {
  const { id: propertyId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // States
  const [selectedRoomType, setSelectedRoomType] = useState("");
  const [blockDate, setBlockDate] = useState("");
  
  const [peakRate, setPeakRate] = useState({
    startDate: "",
    endDate: "",
    rateType: "PERCENTAGE", // "NOMINAL" atau "PERCENTAGE"
    rateValue: ""
  });

  // 1. Fetch Data Property & Room Types
  const { data: property, isLoading } = useQuery({
    queryKey: ["manage-prop", propertyId],
    queryFn: () => api.get(`/properties/${propertyId}`).then(r => r.data)
  });

  // 2. Mutation: Set Peak Rate (Ke room.routes.ts)
  const peakRateMutation = useMutation({
    mutationFn: (payload: any) => 
      api.post(`/rooms/room-types/${selectedRoomType}/peak-rates`, payload),
    onSuccess: () => {
      toast({ title: "Berhasil!", description: "Harga khusus (Peak Rate) telah diterapkan." });
      setPeakRate({ startDate: "", endDate: "", rateType: "PERCENTAGE", rateValue: "" });
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Gagal mengatur harga khusus";
      toast({ title: "Validation Error", description: msg, variant: "destructive" });
    }
  });

  // 3. Mutation: Set Availability / Manual Block (Ke availability.routes.ts)
  const availabilityMutation = useMutation({
    mutationFn: (payload: { dates: { date: string; isAvailable: boolean }[] }) => 
      api.post(`/availability/room-types/${selectedRoomType}`, payload),
    onSuccess: () => {
      toast({ title: "Berhasil!", description: "Status ketersediaan kamar diperbarui." });
      setBlockDate("");
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || "Gagal memperbarui ketersediaan";
      toast({ title: "Error", description: msg, variant: "destructive" });
    }
  });

  const handleSetPeakRate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedRoomType) return toast({ title: "Pilih Tipe Kamar", variant: "destructive" });
    
    // Pastikan rateValue dikirim sebagai NUMBER agar tidak validation error
    peakRateMutation.mutate({
      ...peakRate,
      rateValue: Number(peakRate.rateValue)
    });
  };

  const handleManualBlock = () => {
    if (!selectedRoomType || !blockDate) return;
    
    // Sesuai dengan availability.service.ts yang mengharapkan array of dates
    availabilityMutation.mutate({
      dates: [{ date: blockDate, isAvailable: false }]
    });
  };

  if (isLoading) return (
    <div className="flex h-screen items-center justify-center">
      <Loader2 className="animate-spin text-navy-600" size={40} />
    </div>
  );

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 animate-fade-in">
      <button 
        onClick={() => navigate(-1)} 
        className="flex items-center gap-2 text-slate-400 hover:text-navy-900 mb-8 font-bold text-xs uppercase tracking-widest transition-colors"
      >
        <ArrowLeft size={16} /> Kembali ke Properti
      </button>

      <div className="mb-10">
        <h1 className="text-3xl font-black text-navy-900 tracking-tight">Manage Availability & Pricing</h1>
        <p className="text-slate-500 font-medium">Atur kalender harga dan blokir kamar secara manual.</p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Form Section */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* Room Selection - Global for both forms */}
          <div className="bg-navy-900 p-6 rounded-3xl text-white shadow-xl shadow-navy-900/10">
            <label className="text-[10px] font-black uppercase text-navy-300 mb-2 block tracking-widest">Pilih Kategori Kamar</label>
            <select 
              className="w-full bg-navy-800 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-white transition-all cursor-pointer"
              value={selectedRoomType} 
              onChange={e => setSelectedRoomType(e.target.value)}
            >
              <option value="">-- Pilih Tipe Kamar --</option>
              {property?.roomTypes?.map((rt: any) => (
                <option key={rt.id} value={rt.id}>{rt.name}</option>
              ))}
            </select>
          </div>

          {/* 1. Peak Pricing Form */}
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600">
                <TrendingUp size={20} />
              </div>
              <h3 className="font-black text-navy-900 uppercase text-sm tracking-wider">Peak Pricing</h3>
            </div>
            
            <form onSubmit={handleSetPeakRate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Mulai</label>
                  <input type="date" className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1" 
                    value={peakRate.startDate} onChange={e => setPeakRate({...peakRate, startDate: e.target.value})} required />
                </div>
                <div>
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Selesai</label>
                  <input type="date" className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1" 
                    value={peakRate.endDate} onChange={e => setPeakRate({...peakRate, endDate: e.target.value})} required />
                </div>
              </div>

              <div className="flex gap-3">
                <div className="flex-1">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Penyesuaian Nilai</label>
                  <input type="number" className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1 font-bold" 
                    placeholder="Contoh: 20" value={peakRate.rateValue} onChange={e => setPeakRate({...peakRate, rateValue: e.target.value})} required />
                </div>
                <div className="w-28">
                  <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipe</label>
                  <select className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1 font-bold" 
                    value={peakRate.rateType} onChange={e => setPeakRate({...peakRate, rateType: e.target.value})}>
                    <option value="PERCENTAGE">Persen (%)</option>
                    <option value="NOMINAL">Nominal (Rp)</option>
                  </select>
                </div>
              </div>

              <button 
                type="submit"
                disabled={peakRateMutation.isPending || !selectedRoomType}
                className="w-full bg-navy-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-navy-800 transition-all disabled:opacity-50"
              >
                {peakRateMutation.isPending ? "Sedang Memproses..." : "Terapkan Harga"}
              </button>
            </form>
          </div>
        </div>

        {/* Right Section: Manual Block & Info */}
        <div className="lg:col-span-7 space-y-6">
          
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
            <div className="relative z-10">
              <div className="flex items-center gap-3 mb-6">
                <div className="bg-red-100 p-2.5 rounded-xl text-red-600">
                  <ShieldAlert size={20} />
                </div>
                <h3 className="font-black text-navy-900 uppercase text-sm tracking-wider">Manual Room Block</h3>
              </div>

              <div className="space-y-6">
                <p className="text-slate-500 text-sm leading-relaxed">
                  Gunakan fitur ini untuk menutup pemesanan pada tanggal tertentu (misal: untuk renovasi atau keperluan pribadi).
                </p>
                
                <div className="flex flex-wrap gap-4 items-end">
                  <div className="flex-1 min-w-[200px]">
                    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Pilih Tanggal</label>
                    <input 
                      type="date" 
                      className="w-full bg-slate-50 p-4 rounded-2xl text-sm border-0 mt-1 font-bold text-red-600" 
                      value={blockDate}
                      onChange={e => setBlockDate(e.target.value)}
                    />
                  </div>
                  <button 
                    onClick={handleManualBlock}
                    disabled={!selectedRoomType || !blockDate || availabilityMutation.isPending}
                    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50"
                  >
                    {availabilityMutation.isPending ? "Memblokir..." : "Blokir Tanggal"}
                  </button>
                </div>
              </div>
            </div>
            <Calendar className="absolute right-[-40px] bottom-[-40px] text-slate-50/50" size={240} />
          </div>

          {/* Info Card */}
          <div className="bg-blue-50/50 border border-blue-100 p-8 rounded-[2.5rem] flex gap-5">
             <div className="bg-blue-600 text-white p-3 rounded-2xl h-fit">
                <Info size={24} />
             </div>
             <div>
                <h4 className="font-black text-blue-900 text-sm uppercase tracking-wider mb-2">Sistem Otomatis Aktif</h4>
                <p className="text-blue-700/80 text-sm leading-relaxed font-medium">
                  Kamar akan otomatis ditandai sebagai "Tidak Tersedia" jika ada pemesanan yang telah dikonfirmasi oleh sistem. Blokir manual hanya digunakan untuk keperluan di luar reservasi user.
                </p>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ManageAvailability;