import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Calendar, Loader2 } from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import PriceCalendar from "@/components/PriceCalendar";
import Footer from "@/components/Footer";
import { propertyApi, formatPrice, type Property, type CalendarDay } from "@/lib/property";
import { type DatePrice } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";

const PropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isUser } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [calendarPrices, setCalendarPrices] = useState<DatePrice[]>([]);
  const [calMonth, setCalMonth] = useState(new Date().getMonth() + 1);
  const [calYear, setCalYear] = useState(new Date().getFullYear());

  useEffect(() => {
    if (!id) return;
    propertyApi.getById(parseInt(id))
      .then(setProperty)
      .catch(() => setProperty(null))
      .finally(() => setIsLoading(false));
  }, [id]);

  useEffect(() => {
    if (!id) return;
    propertyApi.getCalendar(parseInt(id), calYear, calMonth).then((calendar) => {
      const roomType = property?.roomTypes?.[selectedRoomIdx];
      const prices: DatePrice[] = Object.values(calendar).map((day: CalendarDay) => {
        const roomPrice = roomType
          ? day.roomPrices.find(r => r.roomTypeId === roomType.id)?.price ?? day.minPrice ?? 0
          : day.minPrice ?? 0;
        return { date: day.date, price: roomPrice, available: roomPrice > 0 };
      });
      setCalendarPrices(prices);
    }).catch(console.error);
  }, [id, calYear, calMonth, selectedRoomIdx, property]);

  const handleBookNow = () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    if (!isUser) {
      alert('Only users can make bookings. Please login as a user.');
      return;
    }
    // Navigate to booking page
    navigate(`/booking/${property?.roomTypes?.[selectedRoomIdx]?.id}`);
  };

  if (isLoading) return (
    <div className="flex min-h-screen items-center justify-center">
      <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
    </div>
  );

  if (!property) return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <div className="text-5xl">🏚️</div>
      <p className="text-lg font-semibold">Property not found</p>
      <Link to="/" className="rounded-xl border border-[var(--color-navy-800)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy-800)] transition hover:bg-[var(--color-navy-800)] hover:text-white">
        ← Back to listings
      </Link>
    </div>
  );

  const photos = property.images.map(img => img.url);
  const selectedRoom = property.roomTypes?.[selectedRoomIdx];

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

          <Link to="/" className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-fg)] transition hover:text-[var(--color-foreground)]">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* Left */}
            <div className="space-y-8 lg:col-span-2">
              {photos.length > 0 && <PhotoGallery photos={photos} name={property.name} />}

              <div className="rounded-2xl border border-[var(--color-border)] bg-white p-6 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div>
                    {property.category && (
                      <span className="mb-2 inline-block rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider text-[var(--color-navy-950)]"
                        style={{ background: "linear-gradient(135deg, var(--color-gold-400), var(--color-gold-500))" }}>
                        {property.category.name}
                      </span>
                    )}
                    <h1 className="text-2xl font-extrabold text-[var(--color-foreground)] md:text-3xl"
                      style={{ fontFamily: "var(--font-display)" }}>
                      {property.name}
                    </h1>
                    <p className="mt-1.5 flex items-center gap-1.5 text-sm text-[var(--color-muted-fg)]">
                      <MapPin className="h-4 w-4" /> {property.location}, {property.city}
                    </p>
                  </div>
                  {property.avgRating && (
                    <div className="flex items-center gap-1.5 rounded-2xl border border-[var(--color-border)] px-4 py-2">
                      <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                      <span className="text-lg font-extrabold">{property.avgRating.toFixed(1)}</span>
                      <span className="text-xs text-[var(--color-muted-fg)]">({property.reviews.length})</span>
                    </div>
                  )}
                </div>
                <p className="mt-4 leading-relaxed text-[var(--color-muted-fg)]">{property.description}</p>
              </div>

              {/* Room Types */}
              {property.roomTypes.length > 0 && (
                <div>
                  <div className="mb-4 flex items-center justify-between">
                    <h2 className="text-xl font-extrabold text-[var(--color-foreground)]"
                      style={{ fontFamily: "var(--font-display)" }}>
                      Available Rooms
                    </h2>
                    <span className="rounded-full border border-[var(--color-border)] px-3 py-1 text-xs text-[var(--color-muted-fg)]">
                      {property.roomTypes.length} options
                    </span>
                  </div>
                  <div className="space-y-4">
                    {property.roomTypes.map((room, i) => (
                      <div key={room.id}
                        onClick={() => setSelectedRoomIdx(i)}
                        className={`cursor-pointer overflow-hidden rounded-2xl border-2 p-5 transition-all ${i === selectedRoomIdx ? "border-[var(--color-navy-800)] shadow-lg" : "border-[var(--color-border)] hover:border-[var(--color-navy-600)]"}`}>
                        <div className="flex items-start justify-between">
                          <div>
                            <h4 className="text-base font-bold text-[var(--color-foreground)]">{room.name}</h4>
                            <p className="mt-1 text-xs text-[var(--color-muted-fg)]">{room.description}</p>
                            <p className="mt-2 text-xs text-[var(--color-muted-fg)]">
                              Capacity: {room.capacity} guests •{" "}
                              {room.availableRooms !== undefined
                                ? room.availableRooms > 0
                                  ? <span className="text-green-600">{room.availableRooms} rooms available</span>
                                  : <span className="text-red-500">Not available</span>
                                : `${room.rooms.length} units`}
                            </p>
                          </div>
                          <div className="text-right">
                            <p className="text-xl font-extrabold text-[var(--color-navy-800)]">
                              {formatPrice(room.effectivePrice ?? room.basePrice)}
                            </p>
                            <p className="text-xs text-[var(--color-muted-fg)]">/night</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Reviews */}
              {property.reviews.length > 0 && (
                <div>
                  <h2 className="mb-4 text-xl font-extrabold text-[var(--color-foreground)]"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Reviews
                  </h2>
                  <div className="space-y-4">
                    {property.reviews.map(review => (
                      <div key={review.id} className="rounded-2xl border border-[var(--color-border)] bg-white p-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--color-navy-800)] text-xs font-bold text-white">
                            {review.user.name.charAt(0)}
                          </div>
                          <div>
                            <p className="text-sm font-semibold">{review.user.name}</p>
                            <div className="flex gap-0.5">
                              {Array.from({ length: 5 }).map((_, i) => (
                                <Star key={i} className={`h-3 w-3 ${i < review.rating ? "fill-amber-400 text-amber-400" : "text-gray-300"}`} />
                              ))}
                            </div>
                          </div>
                        </div>
                        <p className="mt-2 text-sm text-[var(--color-muted-fg)]">{review.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Price calendar + Book */}
            <div>
              <div className="sticky top-20 space-y-4">
                <div className="flex items-center gap-2">
                  <Calendar className="h-5 w-5 text-[var(--color-navy-700)]" />
                  <h2 className="text-lg font-extrabold text-[var(--color-foreground)]"
                    style={{ fontFamily: "var(--font-display)" }}>
                    Price Calendar
                  </h2>
                </div>
                {calendarPrices.length > 0 && <PriceCalendar prices={calendarPrices} />}

                {selectedRoom && (
                  <div className="rounded-2xl border border-[var(--color-border)] bg-white p-4 shadow-sm">
                    <p className="mb-1 text-xs text-[var(--color-muted-fg)]">Starting from</p>
                    <p className="mb-3 text-2xl font-extrabold text-[var(--color-navy-800)]">
                      {formatPrice(selectedRoom.effectivePrice ?? selectedRoom.basePrice)}
                      <span className="text-sm font-normal text-[var(--color-muted-fg)]"> /night</span>
                    </p>
                    <button
                      onClick={handleBookNow}
                      disabled={selectedRoom.isAvailable === false}
                      className="w-full rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
                      {selectedRoom.isAvailable === false ? 'Not Available' : 'Book Now'}
                    </button>
                    <p className="mt-2 text-center text-xs text-[var(--color-muted-fg)]">Free cancellation available</p>
                  </div>
                )}
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
