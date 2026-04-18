import { User } from "lucide-react";

interface GuestDetailsFormProps {
  guest: {
    guestName: string;
    guestNik: string;
    guestPhone: string;
    guestAddress: string;
  };
  onGuestChange: (field: string, value: string) => void;
}

const GuestDetailsForm = ({ guest, onGuestChange }: GuestDetailsFormProps) => {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
      <FormHeader />
      <div className="space-y-5">
        <NameInput value={guest.guestName} onChange={onGuestChange} />
        <div className="grid gap-4 sm:grid-cols-2">
          <NikInput value={guest.guestNik} onChange={onGuestChange} />
          <PhoneInput value={guest.guestPhone} onChange={onGuestChange} />
        </div>
        <AddressInput value={guest.guestAddress} onChange={onGuestChange} />
      </div>
    </div>
  );
};

const FormHeader = () => (
  <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-6">
    <User size={18} className="text-blue-500" /> Contact Details
  </h3>
);

const InputWrapper = ({ label, children, info }: any) => (
  <div className="space-y-1.5">
    <label className="text-[10px] font-bold uppercase text-slate-400 px-1">{label}</label>
    {children}
    {info}
  </div>
);

const CommonInput = (props: any) => (
  <input {...props} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-navy-700 focus:bg-white focus:outline-none transition-all" />
);

const NameInput = ({ value, onChange }: any) => (
  <InputWrapper label="Full Name (According to ID)">
    <CommonInput placeholder="e.g. John Doe" required value={value} onChange={(e: any) => onChange("guestName", e.target.value)} />
  </InputWrapper>
);

const NikInput = ({ value, onChange }: any) => (
  <InputWrapper label="National ID / NIK (16 Digits)" info={<NikInfo value={value} />}>
    <CommonInput maxLength={16} placeholder="3201xxxxxxxxxxxx" required value={value} onChange={(e: any) => onChange("guestNik", e.target.value.replace(/\D/g, ''))} />
  </InputWrapper>
);

const NikInfo = ({ value }: { value: string }) => (
  <div className="flex justify-between items-center px-1">
    <p className="text-[9px] text-slate-400">Must be exactly 16 digits</p>
    <p className={`text-[10px] font-bold ${value.length === 16 ? 'text-green-500' : 'text-slate-300'}`}>
      {value.length}/16
    </p>
  </div>
);

const PhoneInput = ({ value, onChange }: any) => (
  <InputWrapper label="Phone Number">
    <div className="relative">
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+62</span>
      <input type="tel" className="w-full rounded-xl border border-slate-200 bg-slate-50 pl-12 pr-4 py-3 text-sm focus:border-navy-700 focus:bg-white focus:outline-none transition-all" 
        placeholder="812xxxxxxx" required value={value} onChange={e => onChange("guestPhone", e.target.value)} />
    </div>
  </InputWrapper>
);

const AddressInput = ({ value, onChange }: any) => (
  <InputWrapper label="Residential Address">
    <textarea className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm focus:border-navy-700 focus:bg-white focus:outline-none transition-all min-h-[100px] resize-none" 
      placeholder="Complete address for verification" required value={value} onChange={e => onChange("guestAddress", e.target.value)} />
  </InputWrapper>
);

export default GuestDetailsForm;
