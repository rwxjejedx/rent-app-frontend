import { useState, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, CheckCircle2, Calendar } from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import RoomCard from "@/components/RoomCard";
import PriceCalendar from "@/components/PriceCalendar";
import Footer from "@/components/Footer";
import { MOCK_PROPERTY_DETAILS, generatePriceCalendar } from "@/lib/data";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const property = id ? MOCK_PROPERTY_DETAILS[id] : undefined;
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);

  const priceCalendar = useMemo(() => {
    if (!property) return [];
    const room = property.rooms[selectedRoomIdx];
    return generatePriceCalendar(room.basePrice, parseInt(property.id) + selectedRoomIdx);
  }, [property, selectedRoomIdx]);

  if (!property) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <div className="text-5xl">🏚️</div>
        <p className="text-lg font-semibold text-[var(--color-foreground)]">Property not found</p>
        <p className="text-sm text-[var(--color-muted-fg)]">This listing may have been removed or never existed.</p>
        <Link to="/" className="rounded-xl border border-[var(--color-navy-800)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy-800)] transition hover:bg-[var(--color-navy-800)] hover:text-white">
          ← Back to listings
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

          {/* Back */}
          <Link to="/"
            className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-fg)] transition hover:text-[var(--color-foreground)]">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* Left: Photos + Info */}
            <div className="space-y-8 lg:col-span-2">
              <PhotoGallery photos={property.photos} name={property.name} />

              {/* Property info */}
              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    <span className="mb-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy-950)]"
                      style={{ background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500))" }}>
                      {property.category}
                    </span>
                    <h1 className="text-2xl font-extrabold text-[var(--color-foreground)] md:text-3xl"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {property.name}
                    </h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--color-muted-fg)]">
                      <MapPin className="h-4 w-4" /> {property.address}
                    </p>
                  </div>
                  <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--color-border)] px-4 py-2">
                    <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                    <span className="text-lg font-extrabold text-[var(--color-foreground)]">{property.rating}</span>
                  </div>
                </div>

                <p className="mt-4 leading-relaxed text-[var(--color-muted-fg)]">{property.description}</p>

                {/* Amenities */}
                <div className="mt-5 border-t border-[var(--color-border)] pt-5">
                  <h3 className="mb-3 text-sm font-bold text-[var(--color-foreground)]">Property Amenities</h3>
                  <div className="flex flex-wrap gap-2">
                    {property.amenities.map(a => (
                      <span key={a}
                        className="flex items-center gap-1.5 rounded-full border border-[var(--color-border)] bg-[var(--color-muted)] px-3 py-1.5 text-xs font-medium text-[var(--color-muted-fg)]">
                        <CheckCircle2 className="h-3 w-3 text-[var(--color-navy-700)]" /> {a}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Rooms */}
              <div>
                <div className="mb-4 flex items-center justify-between">
                  <h2 className="text-xl font-extrabold text-[var(--color-foreground)]"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Available Rooms
                  </h2>
                  <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted-fg)]">
                    {property.rooms.length} options
                  </span>
                </div>
                <div className="space-y-4">
                  {property.rooms.map((room, i) => (
                    <RoomCard
                      key={room.id}
                      room={room}
                      selected={i === selectedRoomIdx}
                      onSelect={() => setSelectedRoomIdx(i)}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* Right: Price calendar */}
            <div>
              <div className="sticky top-20 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--color-navy-700)]" />
                  <h2 className="text-lg font-extrabold text-[var(--color-foreground)]"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Price Calendar
                  </h2>
                </div>
                <p className="text-xs text-[var(--color-muted-fg)]">
                  Showing prices for{" "}
                  <span className="font-semibold text-[var(--color-foreground)]">
                    {property.rooms[selectedRoomIdx].name}
                  </span>
                </p>
                <PriceCalendar prices={priceCalendar} />

                {/* Book CTA */}
                <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
                  <p className="mb-1 text-xs text-[var(--color-muted-fg)]">Starting from</p>
                  <p className="mb-3 text-2xl font-extrabold text-[var(--color-navy-800)]">
                    {new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(property.rooms[selectedRoomIdx].basePrice)}
                    <span className="text-sm font-normal text-[var(--color-muted-fg)]"> /night</span>
                  </p>
                  <button className="w-full rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98]">
                    Book Now
                  </button>
                  <p className="mt-2 text-center text-xs text-[var(--color-muted-fg)]">Free cancellation available</p>
                </div>
              </div>
            </div>

          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PropertyDetail;
