import { CreditCard, Loader2, TrendingUp, Check } from "lucide-react";
import { formatPrice as fmtPrice } from "@/lib/property";

interface BookingSidebarProps {
  isPriceLoading: boolean;
  priceResult: any;
  nights: number;
}

const BookingSidebar = ({ isPriceLoading, priceResult, nights }: BookingSidebarProps) => {
  return (
    <div className="sticky top-24 space-y-6">
      <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
        <SidebarHeader />
        <div className="space-y-3">
          <SidebarContent isPriceLoading={isPriceLoading} priceResult={priceResult} nights={nights} />
        </div>
      </div>
      <CancellationPolicy />
    </div>
  );
};

const SidebarHeader = () => (
  <h3 className="text-sm font-bold text-navy-900 mb-4 pb-4 border-b border-slate-50 flex items-center justify-between">
    Price Details
    <CreditCard size={16} className="text-slate-300" />
  </h3>
);

const SidebarContent = ({ isPriceLoading, priceResult, nights }: any) => {
  if (isPriceLoading) return <PriceLoadingState />;
  if (!priceResult) return <NoDateSelectedState />;
  return <PriceDetails priceResult={priceResult} nights={nights} />;
};

const PriceLoadingState = () => (
  <div className="flex flex-col items-center justify-center py-6 text-slate-400 animate-pulse">
    <Loader2 className="animate-spin mb-2" size={24} />
    <p className="text-xs font-bold uppercase">Recalculating...</p>
  </div>
);

const NoDateSelectedState = () => (
  <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
    <p className="text-[10px] font-bold text-slate-400 uppercase">Select dates to calculate</p>
  </div>
);

const PriceDetails = ({ priceResult, nights }: { priceResult: any; nights: number }) => (
  <>
    <PriceRow label="Accommodation Price" value={fmtPrice(priceResult.totalPrice)} />
    <PriceSubRow nights={nights} basePrice={priceResult.basePrice} />
    <PeakSeasonWarning active={priceResult.breakdown.some((d: any) => d.isPeak)} />
    <TotalPriceRow total={priceResult.totalPrice} />
  </>
);

const PriceRow = ({ label, value }: { label: string; value: string }) => (
  <div className="flex justify-between text-sm">
    <span className="text-slate-500">{label}</span>
    <span className="font-bold text-navy-900">{value}</span>
  </div>
);

const PriceSubRow = ({ nights, basePrice }: any) => (
  <div className="flex justify-between text-xs text-slate-400">
    <span>{nights} Night{nights > 1 ? 's' : ''} x {fmtPrice(basePrice)} base</span>
    <span>Incl. Tax</span>
  </div>
);

const PeakSeasonWarning = ({ active }: { active: boolean }) => {
  if (!active) return null;
  return (
    <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-[10px] font-bold text-amber-700">
      <TrendingUp size={14} /> Peak season rates are currently active for some dates.
    </div>
  );
};

const TotalPriceRow = ({ total }: { total: number }) => (
  <div className="mt-4 pt-4 border-t border-navy-900/5 flex items-center justify-between">
    <span className="text-base font-black text-navy-900">Total Payment</span>
    <span className="text-xl font-black text-blue-600">{fmtPrice(total)}</span>
  </div>
);

const CancellationPolicy = () => (
  <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center gap-4">
    <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
      <Check size={24} />
    </div>
    <div className="space-y-0.5">
      <p className="text-xs font-bold text-navy-900">Free Cancellation</p>
      <p className="text-[10px] text-slate-400">Cancel for free up to 24h before check-in.</p>
    </div>
  </div>
);

export default BookingSidebar;
