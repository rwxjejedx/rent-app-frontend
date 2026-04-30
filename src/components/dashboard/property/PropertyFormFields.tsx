import { Building, MapPin } from "lucide-react";

export const BasicInfoFields = ({ formData, setFormData }: any) => (
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <InputField label="Property Name" icon={<Building />} placeholder="Ex: anta.com Villa"
      value={formData.name} onChange={(val: string) => setFormData({ ...formData, name: val })} />
    <InputField label="City" icon={<MapPin />} placeholder="Ex: Jakarta"
      value={formData.city} onChange={(val: string) => setFormData({ ...formData, city: val })} />
  </div>
);

const InputField = ({ label, icon, placeholder, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">{label}</label>
    <div className="relative">
      <div className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 size-4">
        {icon}
      </div>
      <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 pl-12 text-sm"
        placeholder={placeholder} required value={value} 
        onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
    </div>
  </div>
);

export const DetailFields = ({ formData, setFormData, categories }: any) => (
  <div className="space-y-6">
    <FullWidthInput label="Full Address" placeholder="Street name, number, etc."
      value={formData.location} onChange={(val: string) => setFormData({ ...formData, location: val })} />
    <CategorySelect categories={categories} value={formData.categoryId}
      onChange={(val: number) => setFormData({ ...formData, categoryId: val })} />
    <TextAreaField label="Description" placeholder="Tell users about your property..."
      value={formData.description} onChange={(val: string) => setFormData({ ...formData, description: val })} />
  </div>
);

const FullWidthInput = ({ label, placeholder, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">{label}</label>
    <input className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm"
      placeholder={placeholder} required value={value} 
      onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChange(e.target.value)} />
  </div>
);

const CategorySelect = ({ categories, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">Category</label>
    <select className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm"
      value={value} onChange={(e: React.ChangeEvent<HTMLSelectElement>) => onChange(Number(e.target.value))}>
      {categories?.map((c: any) => (
        <option key={c.id} value={c.id}>{c.name}</option>
      ))}
    </select>
  </div>
);

const TextAreaField = ({ label, placeholder, value, onChange }: any) => (
  <div className="space-y-2">
    <label className="text-[11px] font-bold text-slate-500 uppercase ml-1">{label}</label>
    <textarea className="w-full border-0 bg-slate-100 rounded-2xl p-4 text-sm min-h-[120px]"
      placeholder={placeholder} required value={value} 
      onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => onChange(e.target.value)} />
  </div>
);
