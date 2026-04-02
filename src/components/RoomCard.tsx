import { Users, Wifi, Wind, Tv, Coffee, Bath, Check } from "lucide-react";
import { type Room } from "@/lib/data";

interface RoomCardProps {
  room: Room;
  selected: boolean;
  onSelect: () => void;
}

const amenityIcons: Record<string, React.ReactNode> = {
  WiFi: <Wifi className="h-3.5 w-3.5" />,
  AC: <Wind className="h-3.5 w-3.5" />,
  TV: <Tv className="h-3.5 w-3.5" />,
  "Mini Bar": <Coffee className="h-3.5 w-3.5" />,
  Jacuzzi: <Bath className="h-3.5 w-3.5" />,
};

const formatPrice = (price: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(price);

const RoomCard = ({ room, selected, onSelect }: RoomCardProps) => (
  <div
    onClick={onSelect}
    className={`group cursor-pointer overflow-hidden rounded-2xl border-2 transition-all duration-200
      ${selected
        ? "border-[var(--color-navy-800)] shadow-lg shadow-[var(--color-navy-800)]/10"
        : "border-[var(--color-border)] hover:border-[var(--color-navy-600)] hover:shadow-md"
      }`}
  >
    <div className="flex flex-col sm:flex-row">
      {/* Image */}
      <div className="relative h-44 w-full overflow-hidden sm:h-auto sm:w-52 sm:flex-shrink-0">
        <img src={room.image} alt={room.name} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
        {selected && (
          <div className="absolute inset-0 flex items-center justify-center bg-[var(--color-navy-900)]/40 backdrop-blur-[1px]">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[var(--color-navy-800)]">
              <Check className="h-5 w-5 text-white" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col justify-between p-5">
        <div>
          <h4 className="mb-1 text-base font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}>
            {room.name}
          </h4>
          <p className="mb-3 flex items-center gap-1.5 text-xs text-[var(--color-muted-fg)]">
            <Users className="h-3.5 w-3.5" /> Up to {room.capacity} guests
          </p>
          <p className="mb-3 text-xs leading-relaxed text-[var(--color-muted-fg)]">{room.description}</p>
          <div className="flex flex-wrap gap-1.5">
            {room.amenities.map(a => (
              <span key={a}
                className="flex items-center gap-1 rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-2.5 py-1 text-[11px] font-medium text-[var(--color-muted-fg)]">
                {amenityIcons[a] ?? null} {a}
              </span>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-4 flex items-center justify-between border-t border-[var(--color-border)] pt-4">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-wider text-[var(--color-muted-fg)]">from</p>
            <p className="text-xl font-extrabold text-[var(--color-navy-800)]">{formatPrice(room.basePrice)}</p>
            <p className="text-[10px] text-[var(--color-muted-fg)]">per night</p>
          </div>
          <button
            className={`rounded-xl px-4 py-2 text-sm font-semibold transition-all
              ${selected
                ? "bg-navy-gradient text-white shadow"
                : "border-2 border-[var(--color-navy-800)] text-[var(--color-navy-800)] hover:bg-[var(--color-navy-800)] hover:text-white"
              }`}
          >
            {selected ? "✓ Selected" : "Select Room"}
          </button>
        </div>
      </div>
    </div>
  </div>
);

export default RoomCard;
