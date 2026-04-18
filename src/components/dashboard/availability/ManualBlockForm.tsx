import { Calendar, ShieldAlert } from "lucide-react";

interface ManualBlockFormProps {
  blockDate: string;
  setBlockDate: (date: string) => void;
  onBlock: () => void;
  isPending: boolean;
  selectedRoomType: string;
}

const ManualBlockForm = ({ blockDate, setBlockDate, onBlock, isPending, selectedRoomType }: ManualBlockFormProps) => {
  return (
    <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm relative overflow-hidden">
      <div className="relative z-10">
        <FormHeader />
        <div className="space-y-6">
          <p className="text-slate-500 text-sm leading-relaxed">
            Gunakan fitur ini untuk menutup pemesanan pada tanggal tertentu (misal: untuk renovasi atau keperluan pribadi).
          </p>
          <div className="flex flex-wrap gap-4 items-end">
            <DateInput value={blockDate} onChange={setBlockDate} />
            <BlockButton isPending={isPending} disabled={!selectedRoomType || !blockDate} onClick={onBlock} />
          </div>
        </div>
      </div>
      <Calendar className="absolute right-[-40px] bottom-[-40px] text-slate-50/50" size={240} />
    </div>
  );
};

const FormHeader = () => (
  <div className="flex items-center gap-3 mb-6">
    <div className="bg-red-100 p-2.5 rounded-xl text-red-600"><ShieldAlert size={20} /></div>
    <h3 className="font-black text-navy-900 uppercase text-sm tracking-wider">Manual Room Block</h3>
  </div>
);

const DateInput = ({ value, onChange }: { value: string; onChange: (v: string) => void }) => (
  <div className="flex-1 min-w-[200px]">
    <label className="text-[10px] font-black uppercase text-slate-400 ml-1">Pilih Tanggal</label>
    <input type="date" className="w-full bg-slate-50 p-4 rounded-2xl text-sm border-0 mt-1 font-bold text-red-600" 
      value={value} onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
  </div>
);

const BlockButton = ({ isPending, disabled, onClick }: { isPending: boolean; disabled: boolean; onClick: () => void }) => (
  <button onClick={onClick} disabled={disabled || isPending}
    className="bg-red-600 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-red-700 transition-all disabled:opacity-50">
    {isPending ? "Memblokir..." : "Blokir Tanggal"}
  </button>
);

export default ManualBlockForm;
