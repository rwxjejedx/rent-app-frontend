import { TrendingUp } from "lucide-react";

interface PeakPricingFormProps {
  peakRate: any;
  setPeakRate: (rate: any) => void;
  onSubmit: (e: React.FormEvent) => void;
  isPending: boolean;
  selectedRoomType: string;
}

const PeakPricingForm = ({ peakRate, setPeakRate, onSubmit, isPending, selectedRoomType }: PeakPricingFormProps) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm">
      <FormHeader />
      <form onSubmit={onSubmit} className="space-y-4">
        <DateRangeFields peakRate={peakRate} setPeakRate={setPeakRate} />
        <RateFields peakRate={peakRate} setPeakRate={setPeakRate} />
        <SubmitButton isPending={isPending} disabled={!selectedRoomType} />
      </form>
    </div>
  );
};

const FormHeader = () => (
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-amber-100 p-2.5 rounded-xl text-amber-600"><TrendingUp size={20} /></div>
    <h3 className="font-black text-navy-900 uppercase text-sm tracking-wider">Peak Pricing</h3>
  </div>
);

const DateRangeFields = ({ peakRate, setPeakRate }: any) => (
  <div className="grid grid-cols-2 gap-4">
    <DateField label="Mulai" value={peakRate.startDate} onChange={(v: string) => setPeakRate({...peakRate, startDate: v})} />
    <DateField label="Selesai" value={peakRate.endDate} onChange={(v: string) => setPeakRate({...peakRate, endDate: v})} />
  </div>
);

const DateField = ({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) => (
  <div>
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">{label}</label>
    <input type="date" className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1" 
      value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} required />
  </div>
);

const RateFields = ({ peakRate, setPeakRate }: any) => (
  <div className="flex gap-3">
    <div className="flex-1">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Penyesuaian Nilai</label>
      <input type="number" className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1 font-bold" 
        placeholder="Contoh: 20" value={peakRate.rateValue} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPeakRate({...peakRate, rateValue: e.target.value})} required />
    </div>
    <div className="w-28">
      <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Tipe</label>
      <select className="w-full bg-slate-50 p-3 rounded-xl text-sm border-0 mt-1 font-bold" 
        value={peakRate.rateType} 
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setPeakRate({...peakRate, rateType: e.target.value})}>
        <option value="PERCENTAGE">Persen (%)</option>
        <option value="NOMINAL">Nominal (Rp)</option>
      </select>
    </div>
  </div>
);

const SubmitButton = ({ isPending, disabled }: { isPending: boolean; disabled: boolean }) => (
  <button type="submit" disabled={isPending || disabled}
    className="w-full bg-navy-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-[0.2em] hover:bg-navy-800 transition-all disabled:opacity-50">
    {isPending ? "Sedang Memproses..." : "Terapkan Harga"}
  </button>
);

export default PeakPricingForm;
