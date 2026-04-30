import { ImagePlus, X, Loader2 } from "lucide-react";

interface PropertyImageGalleryProps {
  images: string[];
  setImages: (images: string[]) => void;
  uploading: boolean;
  onUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const PropertyImageGallery = ({ images, setImages, uploading, onUpload }: PropertyImageGalleryProps) => {
  return (
    <div className="space-y-4">
      <label className="text-xs font-black text-navy-700 uppercase tracking-widest">Visual Gallery</label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {images.map((url, idx) => (
          <ImagePreview key={idx} url={url} onRemove={() => setImages(images.filter((_, i) => i !== idx))} />
        ))}
        <UploadButton uploading={uploading} onUpload={onUpload} />
      </div>
    </div>
  );
};

const ImagePreview = ({ url, onRemove }: { url: string; onRemove: () => void }) => (
  <div className="relative aspect-square rounded-2xl overflow-hidden border group">
    <img src={url} className="object-cover w-full h-full transition group-hover:scale-110" alt="preview" />
    <button type="button" onClick={onRemove}
      className="absolute top-2 right-2 bg-white/90 p-1.5 rounded-full text-rose-600 shadow-md">
      <X size={14} />
    </button>
  </div>
);

const UploadButton = ({ uploading, onUpload }: { uploading: boolean; onUpload: (e: any) => void }) => (
  <label className="flex flex-col items-center justify-center aspect-square rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 cursor-pointer hover:bg-slate-100 transition">
    {uploading ? <Loader2 className="animate-spin text-navy-700" /> : <ImagePlus className="text-slate-400" />}
    <span className="text-[10px] font-bold text-slate-500 uppercase mt-2">{uploading ? "Uploading..." : "Add Photo"}</span>
    <input type="file" multiple className="hidden" onChange={onUpload} disabled={uploading} accept="image/*" />
  </label>
);

export default PropertyImageGallery;
