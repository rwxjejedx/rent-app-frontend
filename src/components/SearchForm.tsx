import { useState, useRef, useEffect } from "react";
import { Search, CalendarDays, Users, MapPin, ChevronDown } from "lucide-react";
import { format } from "date-fns";
import { CITIES } from "@/lib/data";

interface SearchFormProps {
  onSearch: (filters: { city: string; checkIn: Date | undefined; duration: number; guests: number }) => void;
}

// Minimal calendar
const MiniCalendar = ({ selected, onSelect, onClose }: { selected?: Date; onSelect: (d: Date) => void; onClose: () => void }) => {
  const today = new Date();
  const [viewYear, setViewYear] = useState(selected?.getFullYear() ?? today.getFullYear());
  const [viewMonth, setViewMonth] = useState(selected?.getMonth() ?? today.getMonth());

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const startDay = new Date(viewYear, viewMonth, 1).getDay();
  const monthLabel = new Date(viewYear, viewMonth).toLocaleDateString("en-US", { month: "long", year: "numeric" });

  const prev = () => { if (viewMonth === 0) { setViewMonth(11); setViewYear(y => y - 1); } else setViewMonth(m => m - 1); };
  const next = () => { if (viewMonth === 11) { setViewMonth(0); setViewYear(y => y + 1); } else setViewMonth(m => m + 1); };

  return (
    <div className="absolute top-full left-0 z-50 mt-2 w-72 rounded-xl border border-[var(--color-border)] bg-white p-4 shadow-2xl">
      <div className="mb-3 flex items-center justify-between">
        <button onClick={prev} className="rounded-lg p-1.5 text-[var(--color-muted-fg)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]">
          <ChevronDown className="h-4 w-4 rotate-90" />
        </button>
        <span className="text-sm font-semibold text-[var(--color-foreground)]">{monthLabel}</span>
        <button onClick={next} className="rounded-lg p-1.5 text-[var(--color-muted-fg)] hover:bg-[var(--color-muted)] hover:text-[var(--color-foreground)]">
          <ChevronDown className="h-4 w-4 -rotate-90" />
        </button>
      </div>
      <div className="mb-1 grid grid-cols-7 gap-0.5 text-center text-[10px] font-semibold text-[var(--color-muted-fg)]">
        {["Su","Mo","Tu","We","Th","Fr","Sa"].map(d => <div key={d}>{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-0.5">
        {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const date = new Date(viewYear, viewMonth, day);
          const isPast = date < new Date(today.getFullYear(), today.getMonth(), today.getDate());
          const isSelected = selected && date.toDateString() === selected.toDateString();
          return (
            <button key={day} disabled={isPast} onClick={() => { onSelect(date); onClose(); }}
              className={`rounded-lg py-1.5 text-xs font-medium transition
                ${isPast ? "cursor-not-allowed text-[var(--color-muted-fg)]/40" : "hover:bg-[var(--color-muted)]"}
                ${isSelected ? "bg-[var(--color-navy-900)]! text-white!" : "text-[var(--color-foreground)]"}
              `}>
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
};

const SearchForm = ({ onSearch }: SearchFormProps) => {
  const [city, setCity] = useState("");
  const [cityOpen, setCityOpen] = useState(false);
  const [checkIn, setCheckIn] = useState<Date>();
  const [calOpen, setCalOpen] = useState(false);
  const [duration, setDuration] = useState(1);
  const [guests, setGuests] = useState(1);
  const cityRef = useRef<HTMLDivElement>(null);
  const calRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (cityRef.current && !cityRef.current.contains(e.target as Node)) setCityOpen(false);
      if (calRef.current && !calRef.current.contains(e.target as Node)) setCalOpen(false);
    };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-white px-4 py-3 text-sm text-[var(--color-foreground)] transition focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)] focus:border-transparent placeholder:text-[var(--color-muted-fg)]";

  return (
    <div className="relative z-20 mx-auto -mt-10 max-w-6xl px-4">
      <div className="rounded-2xl border border-[var(--color-border)] bg-white/95 p-5 shadow-2xl backdrop-blur-md md:p-6">
        <p className="mb-4 text-xs font-semibold uppercase tracking-widest text-[var(--color-muted-fg)]">Search Properties</p>
        <div className="grid gap-3 md:grid-cols-5 md:gap-4">

          {/* City dropdown */}
          <div className="relative md:col-span-1" ref={cityRef}>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted-fg)]">
              <MapPin className="h-3.5 w-3.5" /> Destination
            </label>
            <button onClick={() => setCityOpen(!cityOpen)}
              className={`${inputBase} flex items-center justify-between text-left ${!city ? "text-[var(--color-muted-fg)]" : ""}`}>
              <span>{city || "Select city"}</span>
              <ChevronDown className={`h-4 w-4 shrink-0 transition-transform ${cityOpen ? "rotate-180" : ""}`} />
            </button>
            {cityOpen && (
              <div className="absolute top-full left-0 z-50 mt-1 max-h-52 w-full overflow-y-auto rounded-xl border border-[var(--color-border)] bg-white shadow-xl">
                {CITIES.map(c => (
                  <button key={c} onClick={() => { setCity(c); setCityOpen(false); }}
                    className={`w-full px-4 py-2.5 text-left text-sm transition hover:bg-[var(--color-muted)] ${c === city ? "font-semibold text-[var(--color-navy-800)]" : "text-[var(--color-foreground)]"}`}>
                    {c}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Check-in calendar */}
          <div className="relative" ref={calRef}>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted-fg)]">
              <CalendarDays className="h-3.5 w-3.5" /> Check-in
            </label>
            <button onClick={() => setCalOpen(!calOpen)}
              className={`${inputBase} flex items-center gap-2 text-left ${!checkIn ? "text-[var(--color-muted-fg)]" : ""}`}>
              <CalendarDays className="h-4 w-4 shrink-0" />
              {checkIn ? format(checkIn, "MMM dd, yyyy") : "Pick date"}
            </button>
            {calOpen && <MiniCalendar selected={checkIn} onSelect={setCheckIn} onClose={() => setCalOpen(false)} />}
          </div>

          {/* Duration */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted-fg)]">
              <CalendarDays className="h-3.5 w-3.5" /> Nights
            </label>
            <input type="number" min={1} max={30} value={duration}
              onChange={e => setDuration(Number(e.target.value))}
              className={inputBase} />
          </div>

          {/* Guests */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-semibold text-[var(--color-muted-fg)]">
              <Users className="h-3.5 w-3.5" /> Guests
            </label>
            <input type="number" min={1} max={20} value={guests}
              onChange={e => setGuests(Number(e.target.value))}
              className={inputBase} />
          </div>

          {/* Search button */}
          <div className="flex items-end">
            <button onClick={() => onSearch({ city, checkIn, duration, guests })}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-3 text-sm font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]">
              <Search className="h-4 w-4" /> Search
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchForm;
