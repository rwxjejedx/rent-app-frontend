import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import api from "@/lib/api";
import { useToast } from "@/hooks/use-toast";
import { DoorOpen, Plus, Trash2, ArrowLeft, Loader2, Hash } from "lucide-react";

const ManageRooms = () => {
  const { propertyId, roomTypeId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [roomNumberInput, setRoomNumberInput] = useState("");

  // 1. Ambil data property untuk mendapatkan info Room Type ini
  const { data: property, isLoading } = useQuery({
    queryKey: ["property-detail", propertyId],
    queryFn: () => api.get(`/properties/${propertyId}`).then(r => r.data)
  });

  // Cari detail room type yang sedang dikelola
  const currentRoomType = property?.roomTypes?.find(
    (rt: any) => rt.id === Number(roomTypeId)
  );

  // 2. Mutation untuk Tambah Room
  const addRoomMutation = useMutation({
    mutationFn: (newRoom: { number: string }) => 
      // Endpoint sesuai room.routes.ts
      api.post(`/rooms/room-types/${roomTypeId}/rooms`, newRoom),
    onSuccess: () => {
      toast({ title: "Unit berhasil ditambahkan!" });
      setRoomNumberInput("");
      // Refresh data agar list room terupdate secara real-time
      queryClient.invalidateQueries({ queryKey: ["property-detail", propertyId] });
    },
    onError: (error: any) => {
      const message = error.response?.data?.errors?.[0]?.message || 
                      error.response?.data?.message || 
                      "Gagal menambah unit";
      toast({ title: "Error", description: message, variant: "destructive" });
    }
  });

  // 3. Mutation untuk Hapus Room
  const deleteRoomMutation = useMutation({
    mutationFn: (roomId: number) => api.delete(`/rooms/${roomId}`),
    onSuccess: () => {
      toast({ title: "Unit berhasil dihapus" });
      queryClient.invalidateQueries({ queryKey: ["property-detail", propertyId] });
    },
    onError: () => {
      toast({ title: "Gagal menghapus unit", variant: "destructive" });
    }
  });

  const handleAddRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!roomNumberInput.trim()) return;

    // PENTING: Mengirim key "number" agar sesuai dengan validasi backend
    addRoomMutation.mutate({ number: roomNumberInput });
  };

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <Loader2 className="animate-spin text-navy-600" size={40} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-slate-500 hover:text-navy-900 transition-colors mb-6 group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          <span className="font-semibold">Kembali ke Property</span>
        </button>

        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden">
          <div className="p-8 border-b border-slate-50 bg-navy-900 text-white">
            <h1 className="text-2xl font-black italic uppercase tracking-tighter">
              Manage Units: {currentRoomType?.name}
            </h1>
            <p className="text-navy-200 text-sm mt-1">
              Tambahkan atau hapus nomor kamar spesifik untuk tipe ini.
            </p>
          </div>

          <div className="p-8">
            {/* Form Tambah Room */}
            <form onSubmit={handleAddRoom} className="flex gap-4 mb-10">
              <div className="relative flex-1">
                <Hash className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
                <input
                  type="text"
                  placeholder="Contoh: A-101 atau 202"
                  value={roomNumberInput}
                  onChange={(e) => setRoomNumberInput(e.target.value)}
                  className="w-full pl-12 pr-4 py-4 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-navy-500 font-bold text-navy-900"
                />
              </div>
              <button
                type="submit"
                disabled={addRoomMutation.isPending}
                className="bg-navy-600 hover:bg-navy-700 text-white px-8 rounded-2xl font-bold flex items-center gap-2 transition-all disabled:opacity-50"
              >
                {addRoomMutation.isPending ? <Loader2 className="animate-spin" /> : <Plus size={20} />}
                Tambah Unit
              </button>
            </form>

            {/* List Units */}
            <div className="space-y-3">
              <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] mb-4">
                Unit Terdaftar ({currentRoomType?.rooms?.length || 0})
              </h3>
              
              {currentRoomType?.rooms?.length > 0 ? (
                currentRoomType.rooms.map((room: any) => (
                  <div 
                    key={room.id} 
                    className="p-4 flex items-center justify-between bg-white border border-slate-100 rounded-2xl hover:shadow-md transition-all group"
                  >
                    <div className="flex items-center gap-4">
                      <div className="bg-navy-50 p-3 rounded-xl text-navy-600 group-hover:bg-navy-600 group-hover:text-white transition-colors">
                        <DoorOpen size={20} />
                      </div>
                      <div>
                        {/* Note: Pastikan backend mengirim field ini dengan nama 'roomNumber' 
                           atau 'number' di list property detail 
                        */}
                        <p className="font-black text-navy-900">Room {room.roomNumber || room.number}</p>
                        <p className="text-[10px] text-green-600 font-bold uppercase tracking-tight">Tersedia</p>
                      </div>
                    </div>
                    
                    <button 
                      onClick={() => {
                        if(confirm("Hapus unit ini?")) deleteRoomMutation.mutate(room.id);
                      }}
                      className="p-3 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-xl transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                ))
              ) : (
                <div className="py-12 text-center bg-slate-50 rounded-3xl border-2 border-dashed border-slate-200">
                  <p className="text-slate-400 font-medium italic">Belum ada unit yang ditambahkan.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ManageRooms;
