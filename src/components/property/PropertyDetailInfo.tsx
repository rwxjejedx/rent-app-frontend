import { Star, MapPin } from "lucide-react";

interface PropertyDetailInfoProps {
  property: any;
}

const PropertyDetailInfo = ({ property }: PropertyDetailInfoProps) => {
  return (
    <div id="info" className="scroll-mt-32 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="flex-1 min-w-[300px]">
          <PropertyMeta category={property.category} />
          <h1 className="text-3xl font-black text-navy-900 md:text-4xl leading-tight">{property.name}</h1>
          <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
            <MapPin className="h-4 w-4 text-blue-500" /> {property.location}, {property.city}
          </p>
        </div>
        <RatingBadge property={property} />
      </div>
      <Description text={property.description} />
    </div>
  );
};

const PropertyMeta = ({ category }: any) => (
  <div className="flex items-center gap-3 mb-3">
    {category && (
      <span className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
        {category.name}
      </span>
    )}
    <StarRating />
  </div>
);

const StarRating = () => (
  <div className="flex gap-0.5">
    {Array.from({ length: 5 }).map((_, i) => (
      <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
    ))}
  </div>
);

const RatingBadge = ({ property }: any) => {
  if (!property.avgRating) return null;
  return (
    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
      <div className="text-right">
        <p className="text-sm font-black text-navy-900">Excellent</p>
        <p className="text-[10px] font-bold text-slate-400">{property.reviews.length} Reviews</p>
      </div>
      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-200">
        {property.avgRating.toFixed(1)}
      </div>
    </div>
  );
};

const Description = ({ text }: { text: string }) => (
  <div className="mt-8 pt-8 border-t border-slate-50">
    <h3 className="text-lg font-black text-navy-900 mb-4">Tentang Akomodasi</h3>
    <p className="leading-relaxed text-slate-600 whitespace-pre-line">{text}</p>
  </div>
);

export default PropertyDetailInfo;
