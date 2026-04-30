import { MapPin, Home } from "lucide-react";
import { format } from "date-fns";

interface TripSummaryCardProps {
  property: any;
  roomType: any;
  checkIn: string;
  checkOut: string;
  nights: number;
}

const TripSummaryCard = ({ property, roomType, checkIn, checkOut, nights }: TripSummaryCardProps) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <PropertyInfo property={property} roomType={roomType} />
      <BookingDetails checkIn={checkIn} checkOut={checkOut} nights={nights} roomType={roomType} />
    </div>
  );
};

const PropertyInfo = ({ property, roomType }: any) => (
  <div className="flex items-start gap-4">
    <RoomImage roomType={roomType} />
    <div>
      <h2 className="text-lg font-bold text-navy-900">{property?.name || "Loading property..."}</h2>
      <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
        <MapPin size={12} /> {property?.city}, {property?.location}
      </p>
      <RoomBadge name={roomType?.name} />
    </div>
  </div>
);

const RoomImage = ({ roomType }: any) => (
  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
    {roomType?.images?.[0] ? (
      <img src={roomType.images[0].url} alt={roomType.name} className="h-full w-full object-cover" />
    ) : (
      <div className="flex h-full w-full items-center justify-center text-slate-300"><Home size={24} /></div>
    )}
  </div>
);

const RoomBadge = ({ name }: { name: string }) => (
  <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
    <Home size={12} /> {name || "Room Type"}
  </div>
);

const BookingDetails = ({ checkIn, checkOut, nights, roomType }: any) => (
  <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-6 md:grid-cols-4">
    <DateInfo label="Check-in" date={checkIn} />
    <DateInfo label="Check-out" date={checkOut} />
    <InfoItem label="Duration" value={`${nights} Night${nights > 1 ? 's' : ''}`} />
    <InfoItem label="Guests" value={`${roomType?.capacity || 1} Person${roomType?.capacity > 1 ? 's' : ''}`} />
  </div>
);

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <div>
    <p className="text-[10px] font-bold uppercase text-slate-400">{label}</p>
    <p className="mt-1 text-sm font-bold text-navy-900">{value}</p>
  </div>
);

const DateInfo = ({ label, date }: { label: string; date: string }) => (
  <InfoItem label={label} value={date ? format(new Date(date), "EEE, dd MMM yyyy") : "—"} />
);

export default TripSummaryCard;
