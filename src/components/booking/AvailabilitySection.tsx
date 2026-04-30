import { Calendar, Loader2, TrendingUp } from "lucide-react";
import PriceCalendar from "@/components/PriceCalendar";
import { formatPrice as fmtPrice } from "@/lib/property";

interface AvailabilitySectionProps {
  isCalendarLoading: boolean;
  calendarData: Record<string, any>;
  roomTypeId: string | undefined;
  roomType: any;
  checkIn: string;
  checkOut: string;
  today: string;
  priceResult: any;
  onCheckInChange: (date: string) => void;
  onCheckOutChange: (date: string) => void;
}

const AvailabilitySection = (props: AvailabilitySectionProps) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <SectionHeader />
      <CalendarBlock {...props} />
      <DateInputGrid {...props} />
      <PricingDetails breakdown={props.priceResult?.breakdown} />
    </div>
  );
};

const SectionHeader = () => (
  <div className="mb-4 flex items-center justify-between">
    <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
      <Calendar size={18} className="text-blue-500" /> Change Dates
    </h3>
  </div>
);

const CalendarBlock = ({ isCalendarLoading, calendarData, roomTypeId, roomType }: any) => (
  <div className="mb-6">
    <CalendarHeader />
    {isCalendarLoading ? <LoadingSpinner /> : (
      <PriceCalendar prices={formatCalendarPrices(calendarData, roomTypeId, roomType)} />
    )}
    <CalendarFooter />
  </div>
);

const CalendarHeader = () => (
  <div className="mb-4 flex items-center justify-between">
    <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
      <Calendar size={18} className="text-blue-500" /> Availability & Pricing
    </h3>
    <div className="flex gap-4">
      <Legend color="bg-red-100 border-red-300" label="Full" />
      <Legend color="bg-green-100 border-green-300" label="Available" />
    </div>
  </div>
);

const Legend = ({ color, label }: { color: string; label: string }) => (
  <div className="flex items-center gap-1.5 text-[9px] font-bold text-slate-400">
    <div className={`h-2 w-2 rounded-full ${color}`} /> {label}
  </div>
);

const LoadingSpinner = () => (
  <div className="flex justify-center py-10 rounded-2xl border border-slate-100 bg-white shadow-sm">
    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
  </div>
);

const CalendarFooter = () => (
  <p className="mt-3 text-[10px] text-slate-400 flex items-center gap-1.5 px-1">
    <TrendingUp size={12} /> Colors indicate price levels (Low, Mid, Peak season). Red marked days are fully booked.
  </p>
);

const DateInputGrid = ({ today, checkIn, checkOut, onCheckInChange, onCheckOutChange }: any) => (
  <div className="grid gap-4 sm:grid-cols-2">
    <DateInput label="Check-in Date" min={today} value={checkIn} onChange={onCheckInChange} />
    <DateInput label="Check-out Date" min={checkIn || today} value={checkOut} onChange={onCheckOutChange} />
  </div>
);

const DateInput = ({ label, min, value, onChange }: any) => {
  const inputBase = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-navy-700 focus:bg-white focus:outline-none transition-all";
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-bold uppercase text-slate-400 px-1">{label}</label>
      <input type="date" min={min} className={inputBase} value={value} onChange={e => onChange(e.target.value)} />
    </div>
  );
};

const PricingDetails = ({ breakdown }: { breakdown: any[] }) => {
  if (!breakdown || breakdown.length === 0) return null;
  return (
    <div className="mt-6 border-t border-slate-50 pt-4">
      <p className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Dynamic Pricing Details</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
        {breakdown.map((d, idx) => (
          <PriceItem key={d.date} date={d.date} price={d.price} isPeak={d.isPeak} delay={idx * 50} />
        ))}
      </div>
    </div>
  );
};

const PriceItem = ({ date, price, isPeak, delay }: any) => (
  <div className={`rounded-xl p-2.5 text-center border transition-all ${isPeak ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}
    style={{ animationDelay: `${delay}ms` }}>
    <p className="text-[9px] font-bold text-slate-400 uppercase">
      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
    </p>
    <p className={`text-xs font-black mt-0.5 ${isPeak ? 'text-amber-700' : 'text-navy-900'}`}>
      {fmtPrice(price)}
    </p>
  </div>
);

const formatCalendarPrices = (calendarData: Record<string, any>, roomTypeId: string | undefined, roomType: any) => {
  return Object.entries(calendarData).map(([date, data]) => {
    const room = data.roomDetails?.find((r: any) => r.roomTypeId === Number(roomTypeId));
    return {
      date,
      price: room?.price || 0,
      available: room?.availableRooms > 0,
      isPeak: roomType && room ? room.price > Number(roomType.basePrice) : false
    };
  });
};

export default AvailabilitySection;
