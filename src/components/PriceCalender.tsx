import { useMemo, useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type DatePrice } from "@/lib/data";
import { cn } from "@/lib/utils"; // Pastikan utilitas cn masih ada, atau ganti dengan string template

interface PriceCalendarProps {
  prices: DatePrice[];
}

const DAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const formatCompact = (price: number) => {
  if (price >= 1000000) return `${(price / 1000000).toFixed(1)}M`;
  return `${(price / 1000).toFixed(0)}K`;
};

const PriceCalendar = ({ prices }: PriceCalendarProps) => {
  const priceMap = useMemo(() => {
    const m = new Map<string, DatePrice>();
    prices.forEach((p) => m.set(p.date, p));
    return m;
  }, [prices]);

  const months = useMemo(() => {
    if (prices.length === 0) return [];
    const first = new Date(prices[0].date);
    const last = new Date(prices[prices.length - 1].date);
    const result: Date[] = [];
    const d = new Date(first.getFullYear(), first.getMonth(), 1);
    while (d <= last) {
      result.push(new Date(d));
      d.setMonth(d.getMonth() + 1);
    }
    return result;
  }, [prices]);

  const [monthIdx, setMonthIdx] = useState(0);
  const currentMonth = months[monthIdx];

  if (!currentMonth) return null;

  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const startDay = new Date(year, month, 1).getDay();

  const monthLabel = currentMonth.toLocaleDateString("en-US", { 
    month: "long", 
    year: "numeric" 
  });

  const availablePrices = prices.filter((p) => p.available).map((p) => p.price);
  const minPrice = Math.min(...availablePrices);
  const maxPrice = Math.max(...availablePrices);

  const getPriceColor = (price: number) => {
    if (maxPrice === minPrice) return "bg-emerald-50 text-emerald-700 border-emerald-100";
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    if (ratio < 0.33) return "bg-emerald-50 text-emerald-700 border-emerald-200";
    if (ratio < 0.66) return "bg-amber-50 text-amber-700 border-amber-200";
    return "bg-rose-50 text-rose-700 border-rose-200";
  };

  return (
    <div className="rounded-2xl border border-border bg-white p-5 shadow-sm">
      {/* Header - Native Button Replacement */}
      <div className="mb-6 flex items-center justify-between">
        <button
          disabled={monthIdx === 0}
          onClick={() => setMonthIdx((i) => i - 1)}
          className="p-2 rounded-lg transition-colors hover:bg-muted disabled:opacity-30 text-navy-700"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        
        <h3 className="text-lg font-extrabold text-navy-900 font-display">
          {monthLabel}
        </h3>
        
        <button
          disabled={monthIdx >= months.length - 1}
          onClick={() => setMonthIdx((i) => i + 1)}
          className="p-2 rounded-lg transition-colors hover:bg-muted disabled:opacity-30 text-navy-700"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      </div>

      {/* Day headers */}
      <div className="mb-2 grid grid-cols-7 gap-1">
        {DAYS.map((d) => (
          <div key={d} className="text-center text-[10px] uppercase tracking-wider font-bold text-muted-fg py-1">
            {d}
          </div>
        ))}
      </div>

      {/* Calendar grid */}
      <div className="grid grid-cols-7 gap-1.5">
        {Array.from({ length: startDay }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}

        {Array.from({ length: daysInMonth }).map((_, i) => {
          const day = i + 1;
          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const info = priceMap.get(dateStr);

          if (!info) {
            return (
              <div key={dateStr} className="flex h-12 flex-col items-center justify-center rounded-xl p-1 opacity-20">
                <span className="text-xs font-medium">{day}</span>
              </div>
            );
          }

          if (!info.available) {
            return (
              <div key={dateStr} className="flex h-12 flex-col items-center justify-center rounded-xl bg-slate-100 p-1 text-center relative overflow-hidden">
                <span className="text-xs font-bold text-slate-400">{day}</span>
                <span className="text-[8px] font-bold text-destructive/70 z-10">N/A</span>
                <div className="absolute inset-0 opacity-10" style={{ background: "repeating-linear-gradient(45deg, #000, #000 2px, transparent 2px, transparent 4px)" }} />
              </div>
            );
          }

          return (
            <div
              key={dateStr}
              className={cn(
                "flex h-12 flex-col items-center justify-center rounded-xl border p-1 text-center transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-sm",
                getPriceColor(info.price)
              )}
            >
              <span className="text-xs font-bold">{day}</span>
              <span className="text-[9px] font-extrabold leading-tight tracking-tighter">
                {formatCompact(info.price)}
              </span>
            </div>
          );
        })}
      </div>

      {/* Legend */}
      <div className="mt-6 flex flex-wrap items-center justify-center gap-4 text-[10px] font-bold uppercase tracking-tight">
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border border-emerald-200 bg-emerald-50" />
          <span className="text-muted-fg">Budget</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-3 w-3 rounded-full border border-rose-200 bg-rose-50" />
          <span className="text-muted-fg">Peak</span>
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;