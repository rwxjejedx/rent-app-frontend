import { useMemo, useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { type DatePrice } from "@/lib/data";

interface PriceCalendarProps {
  prices: DatePrice[];
}

const DAYS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

const formatCompact = (price: number) => {
  if (price >= 1_000_000) return `${(price / 1_000_000).toFixed(1)}M`;
  return `${(price / 1000).toFixed(0)}K`;
};

const PriceCalendar = ({ prices }: PriceCalendarProps) => {
  const priceMap = useMemo(() => {
    const m = new Map<string, DatePrice>();
    prices.forEach(p => m.set(p.date, p));
    return m;
  }, [prices]);

  const months = useMemo(() => {
    if (!prices.length) return [];
    const seen = new Set<string>();
    const result: Date[] = [];
    prices.forEach(p => {
      const d = new Date(p.date);
      const key = `${d.getUTCFullYear()}-${d.getUTCMonth()}`;
      if (!seen.has(key)) {
        seen.add(key);
        result.push(new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), 1)));
      }
    });
    result.sort((a, b) => a.getTime() - b.getTime());
    return result;
  }, [prices]);

  // Always start at the current month if available
  const [monthIdx, setMonthIdx] = useState(0);

  useEffect(() => {
    if (!months.length) return;
    const now = new Date();
    const currentKey = `${now.getFullYear()}-${now.getMonth()}`;
    const idx = months.findIndex(m => `${m.getUTCFullYear()}-${m.getUTCMonth()}` === currentKey);
    setMonthIdx(idx >= 0 ? idx : 0);
  }, [months]);

  const currentMonth = months[monthIdx];
  if (!currentMonth) return null;

  const year = currentMonth.getUTCFullYear();
  const month = currentMonth.getUTCMonth();
  const daysInMonth = new Date(Date.UTC(year, month + 1, 0)).getUTCDate();
  const startDay = new Date(Date.UTC(year, month, 1)).getUTCDay();
  const monthLabel = currentMonth.toLocaleDateString("en-US", { month: "long", year: "numeric", timeZone: "UTC" });

  const availablePrices = prices.filter(p => p.available).map(p => p.price);
  const minPrice = availablePrices.length ? Math.min(...availablePrices) : 0;
  const maxPrice = availablePrices.length ? Math.max(...availablePrices) : 0;

  const getPriceStyle = (price: number) => {
    if (maxPrice === minPrice) return { bg: "#dcfce7", text: "#166534", border: "#86efac" };
    const ratio = (price - minPrice) / (maxPrice - minPrice);
    if (ratio < 0.33) return { bg: "#dcfce7", text: "#166534", border: "#86efac" };
    if (ratio < 0.66) return { bg: "#fef9c3", text: "#854d0e", border: "#fde047" };
    return { bg: "#fee2e2", text: "#991b1b", border: "#fca5a5" };
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-[var(--color-border)] bg-white shadow-sm">
      <div className="flex items-center justify-between border-b border-[var(--color-border)] px-4 py-3">
        <button disabled={monthIdx === 0} onClick={() => setMonthIdx(i => i - 1)}
          className="rounded-lg p-1.5 text-[var(--color-muted-fg)] hover:bg-[var(--color-muted)] disabled:opacity-30">
          <ChevronLeft className="h-4 w-4" />
        </button>
        <h3 className="text-sm font-bold" style={{ fontFamily: "var(--font-display)" }}>{monthLabel}</h3>
        <button disabled={monthIdx >= months.length - 1} onClick={() => setMonthIdx(i => i + 1)}
          className="rounded-lg p-1.5 text-[var(--color-muted-fg)] hover:bg-[var(--color-muted)] disabled:opacity-30">
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      <div className="p-3">
        <div className="mb-1 grid grid-cols-7 gap-0.5">
          {DAYS.map(d => (
            <div key={d} className="py-1 text-center text-[10px] font-bold uppercase tracking-wider text-[var(--color-muted-fg)]">{d}</div>
          ))}
        </div>

        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: startDay }).map((_, i) => <div key={`e${i}`} />)}
          {Array.from({ length: daysInMonth }).map((_, i) => {
            const day = i + 1;
            const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const info = priceMap.get(dateStr);

            if (!info) return (
              <div key={dateStr} className="flex flex-col items-center rounded-lg p-1 text-center opacity-25">
                <span className="text-[10px] font-medium text-[var(--color-muted-fg)]">{day}</span>
              </div>
            );

            if (!info.available) return (
              <div key={dateStr} className="relative flex flex-col items-center overflow-hidden rounded-lg bg-[var(--color-muted)] p-1 text-center">
                <span className="text-[10px] font-medium text-[var(--color-muted-fg)]">{day}</span>
                <span className="text-[9px] font-bold text-red-400">N/A</span>
              </div>
            );

            const style = getPriceStyle(info.price);
            return (
              <div key={dateStr} className="flex flex-col items-center rounded-lg border p-1 text-center transition-transform hover:scale-105"
                style={{ backgroundColor: style.bg, borderColor: style.border }}>
                <span className="text-[10px] font-semibold" style={{ color: style.text }}>{day}</span>
                <span className="text-[9px] font-bold leading-tight" style={{ color: style.text }}>
                  {formatCompact(info.price)}
                </span>
              </div>
            );
          })}
        </div>

        <div className="mt-3 flex flex-wrap items-center justify-center gap-3 border-t border-[var(--color-border)] pt-3">
          {[{ bg: "#dcfce7", border: "#86efac", label: "Low" }, { bg: "#fef9c3", border: "#fde047", label: "Mid" }, { bg: "#fee2e2", border: "#fca5a5", label: "Peak" }].map(({ bg, border, label }) => (
            <div key={label} className="flex items-center gap-1.5 text-[11px] text-[var(--color-muted-fg)]">
              <div className="h-3 w-3 rounded border" style={{ backgroundColor: bg, borderColor: border }} />
              {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PriceCalendar;
