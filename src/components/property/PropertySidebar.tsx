import { Calendar, Check, TrendingUp } from "lucide-react";
import PriceCalendar from "@/components/PriceCalendar";
import { formatPrice } from "@/lib/property";

interface PropertySidebarProps {
  calendarPrices: any[];
  selectedRoom: any;
  handleBookNow: () => void;
}

const PropertySidebar = ({ calendarPrices, selectedRoom, handleBookNow }: PropertySidebarProps) => {
  return (
    <div className="relative">
      <div className="sticky top-40 space-y-6">
        <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
          <SidebarHeader />
          {calendarPrices.length > 0 && <PriceCalendar prices={calendarPrices} />}
          <BookingAction selectedRoom={selectedRoom} handleBookNow={handleBookNow} />
        </div>
      </div>
    </div>
  );
};

const SidebarHeader = () => (
  <div className="flex items-center gap-3 mb-6">
    <Calendar className="h-5 w-5 text-blue-500" />
    <h2 className="text-lg font-black text-navy-900">Pilih Tanggal</h2>
  </div>
);

const BookingAction = ({ selectedRoom, handleBookNow }: any) => {
  if (!selectedRoom) return null;
  return (
    <div className="mt-8 border-t border-slate-50 pt-6">
      <PriceDisplay price={selectedRoom.effectivePrice ?? selectedRoom.basePrice} />
      <BookButton isAvailable={selectedRoom.isAvailable} onClick={handleBookNow} />
    </div>
  );
};

const PriceDisplay = ({ price }: { price: number }) => (
  <div className="mb-4">
    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mulai dari</p>
    <div className="flex items-baseline gap-1">
      <p className="text-2xl font-black text-blue-600">{formatPrice(price)}</p>
      <span className="text-xs font-bold text-slate-400 uppercase">/malam</span>
    </div>
  </div>
);

const BookButton = ({ isAvailable, onClick }: any) => {
  const isCekKetersediaan = isAvailable === false;
  return (
    <button onClick={onClick}
      className={`w-full rounded-2xl py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg transition-all active:scale-[0.98] ${isCekKetersediaan ? 'bg-amber-500 shadow-amber-200 hover:bg-amber-600' : 'bg-blue-600 shadow-blue-200 hover:bg-blue-700'}`}>
      {isCekKetersediaan ? 'Cek Ketersediaan' : 'Pesan Sekarang'}
    </button>
  );
};

export default PropertySidebar;
