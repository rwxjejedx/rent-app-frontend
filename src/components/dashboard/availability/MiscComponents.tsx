import { Info } from "lucide-react";

export const RoomTypeSelector = ({ selectedRoomType, setSelectedRoomType, roomTypes }: any) => (
  <div className="bg-navy-900 p-6 rounded-3xl text-white shadow-xl shadow-navy-900/10">
    <label className="text-[10px] font-black uppercase text-navy-300 mb-2 block tracking-widest">Pilih Kategori Kamar</label>
    <select 
      className="w-full bg-navy-800 border-none p-4 rounded-2xl text-sm font-bold focus:ring-2 focus:ring-white transition-all cursor-pointer"
      value={selectedRoomType} onChange={e => setSelectedRoomType(e.target.value)}
    >
      <option value="">-- Pilih Tipe Kamar --</option>
      {roomTypes?.map((rt: any) => (
        <option key={rt.id} value={rt.id}>{rt.name}</option>
      ))}
    </select>
  </div>
);

export const AvailabilityInfoCard = () => (
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
);
