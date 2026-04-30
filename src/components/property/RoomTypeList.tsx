import { Users, Check } from "lucide-react";
import { formatPrice } from "@/lib/property";

interface RoomTypeListProps {
  roomTypes: any[];
  selectedRoomIdx: number;
  setSelectedRoomIdx: (idx: number) => void;
}

const RoomTypeList = ({ roomTypes, selectedRoomIdx, setSelectedRoomIdx }: RoomTypeListProps) => {
  if (roomTypes.length === 0) return null;
  return (
    <div id="rooms" className="scroll-mt-32">
      <RoomHeader count={roomTypes.length} />
      <div className="space-y-6">
        {roomTypes.map((room, i) => (
          <RoomCard 
            key={room.id} room={room} isSelected={i === selectedRoomIdx} 
            onClick={() => setSelectedRoomIdx(i)} 
          />
        ))}
      </div>
    </div>
  );
};

const RoomHeader = ({ count }: { count: number }) => (
  <div className="mb-6 flex items-center justify-between">
    <h2 className="text-2xl font-black text-navy-900">Pilihan Kamar</h2>
    <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-500">
      {count} Tipe Kamar
    </span>
  </div>
);

const RoomCard = ({ room, isSelected, onClick }: any) => (
  <div onClick={onClick}
    className={`group cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 ${isSelected ? "border-blue-500 bg-blue-50/30 shadow-xl ring-4 ring-blue-50" : "border-white bg-white shadow-sm hover:border-slate-200"}`}>
    <div className="flex flex-col md:flex-row">
      <RoomImage image={room.images?.[0]} name={room.name} />
      <RoomContent room={room} />
    </div>
  </div>
);

const RoomImage = ({ image, name }: any) => (
  <div className="relative h-48 w-full md:w-64 shrink-0 overflow-hidden">
    {image && (
      <img src={image.url} alt={name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
    )}
    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
  </div>
);

const RoomContent = ({ room }: any) => (
  <div className="flex flex-1 flex-col justify-between p-6">
    <div>
      <div className="flex items-start justify-between">
        <h4 className="text-xl font-black text-navy-900 group-hover:text-blue-600 transition-colors">{room.name}</h4>
        <RoomAvailability count={room.availableRooms} />
      </div>
      <p className="mt-2 text-sm text-slate-500 line-clamp-2">{room.description}</p>
      <RoomCapacity capacity={room.capacity} />
    </div>
    <RoomFooter price={room.effectivePrice ?? room.basePrice} />
  </div>
);

const RoomAvailability = ({ count }: { count?: number }) => {
  if (count === undefined || count >= 3 || count <= 0) return null;
  return (
    <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded">Sisa {count} kamar!</span>
  );
};

const RoomCapacity = ({ capacity }: { capacity: number }) => (
  <div className="mt-4 flex flex-wrap gap-4">
    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
      <Users className="h-3.5 w-3.5" /> {capacity} Dewasa
    </span>
  </div>
);

const RoomFooter = ({ price }: { price: number }) => (
  <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
    <div className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1">
      <Check size={12} /> Pembatalan Gratis
    </div>
    <div className="text-right">
      <p className="text-xl font-black text-blue-600">{formatPrice(price)}</p>
      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">per malam</p>
    </div>
  </div>
);

export default RoomTypeList;
