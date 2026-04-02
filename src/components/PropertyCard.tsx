import { Link } from "react-router-dom";
import { Star, MapPin, ArrowRight } from "lucide-react";
import { type Property } from "@/lib/data";

interface PropertyCardProps {
  property: Property;
}

const PropertyCard = ({ property }: PropertyCardProps) => {
  const formattedPrice = new Intl.NumberFormat("id-ID", {
    style: "currency", currency: "IDR", maximumFractionDigits: 0,
  }).format(property.lowestPrice);

  return (
    <Link to={`/property/${property.id}`} className="group block">
      <div className="card-hover overflow-hidden rounded-2xl border border-[var(--color-border)] bg-[var(--color-card)] shadow-sm">
        {/* Image */}
        <div className="relative h-52 overflow-hidden">
          <img
            src={property.image}
            alt={property.name}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-108"
            loading="lazy"
          />
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

          {/* Category badge */}
          <span className="absolute left-3 top-3 rounded-full bg-[var(--color-gold-gradient)] px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy-950)]"
            style={{ background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500))" }}>
            {property.category}
          </span>

          {/* Rating badge */}
          <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 text-xs font-semibold text-white backdrop-blur-sm">
            <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
            {property.rating}
          </span>
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="mb-1 line-clamp-1 text-base font-bold text-[var(--color-foreground)]"
            style={{ fontFamily: "var(--font-display)" }}>
            {property.name}
          </h3>
          <p className="mb-2 flex items-center gap-1 text-xs text-[var(--color-muted-fg)]">
            <MapPin className="h-3.5 w-3.5" /> {property.city}
          </p>
          <p className="mb-4 line-clamp-2 text-xs leading-relaxed text-[var(--color-muted-fg)]">
            {property.description}
          </p>

          {/* Footer */}
          <div className="flex items-end justify-between">
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wider text-[var(--color-muted-fg)]">from</p>
              <p className="text-lg font-extrabold text-[var(--color-navy-800)]">{formattedPrice}</p>
              <p className="text-[10px] text-[var(--color-muted-fg)]">/ night</p>
            </div>
            <div className="flex items-center gap-1.5 rounded-xl border border-[var(--color-navy-800)] px-3 py-2 text-xs font-semibold text-[var(--color-navy-800)] transition-all group-hover:bg-[var(--color-navy-800)] group-hover:text-white">
              View <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default PropertyCard;
