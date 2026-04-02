import { useState } from "react";
import { ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";

interface PhotoGalleryProps {
  photos: string[];
  name: string;
}

const PhotoGallery = ({ photos, name }: PhotoGalleryProps) => {
  const [selected, setSelected] = useState(0);

  return (
    <div className="space-y-3">
      {/* Main photo */}
      <div className="group relative h-72 overflow-hidden rounded-2xl shadow-lg md:h-[420px]">
        <img
          src={photos[selected]}
          alt={`${name} photo ${selected + 1}`}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

        {/* Photo counter */}
        <span className="absolute bottom-3 right-3 rounded-full bg-black/50 px-3 py-1 text-xs font-medium text-white backdrop-blur-sm">
          {selected + 1} / {photos.length}
        </span>

        {/* Zoom hint */}
        <div className="absolute left-3 top-3 flex items-center gap-1.5 rounded-full bg-black/40 px-2.5 py-1 text-xs text-white/80 opacity-0 backdrop-blur-sm transition group-hover:opacity-100">
          <ZoomIn className="h-3 w-3" /> View
        </div>

        {photos.length > 1 && (
          <>
            <button
              onClick={() => setSelected(s => (s - 1 + photos.length) % photos.length)}
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button
              onClick={() => setSelected(s => (s + 1) % photos.length)}
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full border border-white/20 bg-white/20 p-2 text-white backdrop-blur-sm transition hover:bg-white/30"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </>
        )}
      </div>

      {/* Thumbnails */}
      <div className="flex gap-2 overflow-x-auto pb-1">
        {photos.map((photo, i) => (
          <button
            key={i}
            onClick={() => setSelected(i)}
            className={`h-16 w-24 flex-shrink-0 overflow-hidden rounded-xl border-2 transition-all duration-200
              ${i === selected
                ? "border-[var(--color-navy-700)] opacity-100 shadow-md"
                : "border-transparent opacity-55 hover:opacity-80"
              }`}
          >
            <img src={photo} alt={`Thumb ${i + 1}`} className="h-full w-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
};

export default PhotoGallery;
