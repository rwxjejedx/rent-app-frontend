import { User, Phone, MapPin, CreditCard, Building2, FileText } from "lucide-react";

const Section = ({ icon, title, required, children }: any) => (
  <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
    <div className="mb-4 flex items-center gap-2">
      <span className="text-[var(--color-navy-700)]">{icon}</span>
      <h2 className="text-base font-bold text-[var(--color-foreground)]">{title}</h2>
      {required && <span className="ml-auto text-xs text-red-500 font-medium">Required</span>}
    </div>
    <div className="space-y-4">{children}</div>
  </div>
);

const InputField = ({ label, required, children }: any) => (
  <div>
    <label className="mb-1.5 block text-xs font-semibold text-[var(--color-muted-fg)]">
      {label} {required && <span className="text-red-500">*</span>}
    </label>
    {children}
  </div>
);

const inputBase = "w-full rounded-xl border border-[var(--color-border)] bg-[var(--color-muted)] px-4 py-3 text-sm text-[var(--color-foreground)] transition focus:border-[var(--color-navy-700)] focus:bg-white focus:outline-none focus:ring-2 focus:ring-[var(--color-navy-700)]/20";

export const BasicInfoSection = ({ form, setForm, email }: any) => (
  <Section icon={<User size={20} />} title="Basic Information">
    <InputField label="Full Name">
      <input type="text" className={inputBase} value={form.name} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, name: e.target.value })} placeholder="Your full name" />
    </InputField>
    <InputField label="Email">
      <input type="email" className={`${inputBase} opacity-60 cursor-not-allowed`} value={email} disabled />
    </InputField>
  </Section>
);

export const ContactSection = ({ form, setForm }: any) => (
  <Section icon={<Phone size={20} />} title="Contact Information" required>
    <InputField label="Phone Number" required>
      <input type="tel" className={inputBase} value={form.phone} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, phone: e.target.value })} placeholder="+62 812 3456 7890" />
    </InputField>
  </Section>
);

export const BusinessSection = ({ form, setForm }: any) => (
  <Section icon={<Building2 size={20} />} title="Business Information" required>
    <InputField label="NPWP" required>
      <div className="relative">
        <FileText className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
        <input type="text" className={`${inputBase} pl-10`} value={form.npwp} 
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, npwp: e.target.value })} placeholder="XX.XXX.XXX.X-XXX.XXX" />
      </div>
      <p className="mt-1 text-xs text-[var(--color-muted-fg)]">Nomor Pokok Wajib Pajak</p>
    </InputField>
    <InputField label="Office Address" required>
      <div className="relative">
        <MapPin className="absolute left-3.5 top-3.5 h-4 w-4 text-[var(--color-muted-fg)]" />
        <textarea className={`${inputBase} pl-10 min-h-[80px] resize-none`} value={form.officeAddress} 
          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setForm({ ...form, officeAddress: e.target.value })} placeholder="Jl. Sudirman No. 1, Jakarta Pusat" />
      </div>
    </InputField>
  </Section>
);

export const BankSection = ({ form, setForm }: any) => (
  <Section icon={<CreditCard size={20} />} title="Bank Account" required>
    <div className="grid gap-4 sm:grid-cols-2">
      <InputField label="Bank Name" required>
        <select className={`${inputBase} cursor-pointer`} value={form.bankName} 
          onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setForm({ ...form, bankName: e.target.value })}>
          <option value="">Select bank...</option>
          {["BCA", "BRI", "BNI", "Mandiri", "BSI", "CIMB Niaga", "Danamon", "Permata", "Bank Jago", "SeaBank"].map(b => (
            <option key={b} value={b}>{b}</option>
          ))}
        </select>
      </InputField>
      <InputField label="Account Number" required>
        <div className="relative">
          <CreditCard className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-muted-fg)]" />
          <input type="text" className={`${inputBase} pl-10`} value={form.bankAccount} 
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setForm({ ...form, bankAccount: e.target.value })} placeholder="1234567890" />
        </div>
      </InputField>
    </div>
  </Section>
);
