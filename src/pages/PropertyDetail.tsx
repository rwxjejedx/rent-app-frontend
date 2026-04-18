import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { ArrowLeft, Star, MapPin, Calendar, Loader2, Users, Check, TrendingUp } from "lucide-react";
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
    navigate(`/booking/${property?.roomTypes?.[selectedRoomIdx]?.id}?propertyId=${id}`);
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

  const tabs = [
    { id: 'info', label: 'Info Umum' },
    { id: 'rooms', label: 'Kamar' },
  ];

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      const elementPosition = elementRect - bodyRect;
      const offsetPosition = elementPosition - offset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">

          <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-navy-900">
            <ArrowLeft className="h-4 w-4" /> Back to listings
          </Link>

          {/* Photo Gallery with tiket.com style layout can be handled in PhotoGallery component */}
          {photos.length > 0 && <PhotoGallery photos={photos} name={property.name} />}

          {/* Sticky Tab Nav */}
          <div className="sticky top-16 z-30 -mx-4 bg-white border-b border-slate-200 px-4 mb-8 md:top-20">
            <div className="mx-auto max-w-7xl">
              <div className="flex gap-8 overflow-x-auto no-scrollbar py-1">
                {tabs.map(tab => (
                  <button key={tab.id} onClick={() => scrollTo(tab.id)}
                    className="whitespace-nowrap pb-3 pt-4 text-sm font-bold text-slate-500 transition-all hover:text-navy-900 border-b-2 border-transparent hover:border-blue-500">
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-3">

            {/* Left */}
            <div className="space-y-10 lg:col-span-2">
              
              <div id="info" className="scroll-mt-32 rounded-3xl border border-slate-100 bg-white p-8 shadow-sm">
                <div className="flex flex-wrap items-start justify-between gap-6">
                  <div className="flex-1 min-w-[300px]">
                    <div className="flex items-center gap-3 mb-3">
                      {property.category && (
                        <span className="rounded-lg bg-blue-50 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-blue-700">
                          {property.category.name}
                        </span>
                      )}
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < 4 ? "fill-amber-400 text-amber-400" : "text-slate-200"}`} />
                        ))}
                      </div>
                    </div>
                    <h1 className="text-3xl font-black text-navy-900 md:text-4xl leading-tight">
                      {property.name}
                    </h1>
                    <p className="mt-4 flex items-center gap-2 text-sm font-medium text-slate-500">
                      <MapPin className="h-4 w-4 text-blue-500" /> {property.location}, {property.city}
                    </p>
                  </div>
                  {property.avgRating && (
                    <div className="flex items-center gap-4 rounded-2xl bg-slate-50 p-4 border border-slate-100">
                      <div className="text-right">
                        <p className="text-sm font-black text-navy-900">Excellent</p>
                        <p className="text-[10px] font-bold text-slate-400">{property.reviews.length} Reviews</p>
                      </div>
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-xl font-black text-white shadow-lg shadow-blue-200">
                        {property.avgRating.toFixed(1)}
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="mt-8 pt-8 border-t border-slate-50">
                  <h3 className="text-lg font-black text-navy-900 mb-4">Tentang Akomodasi</h3>
                  <p className="leading-relaxed text-slate-600 whitespace-pre-line">{property.description}</p>
                </div>
              </div>

              {/* Room Types */}
              {property.roomTypes.length > 0 && (
                <div id="rooms" className="scroll-mt-32">
                  <div className="mb-6 flex items-center justify-between">
                    <h2 className="text-2xl font-black text-navy-900">Pilihan Kamar</h2>
                    <span className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-bold text-slate-500">
                      {property.roomTypes.length} Tipe Kamar
                    </span>
                  </div>
                  <div className="space-y-6">
                    {property.roomTypes.map((room, i) => (
                      <div key={room.id}
                        onClick={() => setSelectedRoomIdx(i)}
                        className={`group cursor-pointer overflow-hidden rounded-3xl border-2 transition-all duration-300 ${i === selectedRoomIdx ? "border-blue-500 bg-blue-50/30 shadow-xl ring-4 ring-blue-50" : "border-white bg-white shadow-sm hover:border-slate-200"}`}>
                        <div className="flex flex-col md:flex-row">
                          <div className="relative h-48 w-full md:w-64 shrink-0 overflow-hidden">
                            {room.images?.[0] && (
                              <img src={room.images[0].url} alt={room.name} className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                            )}
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                          </div>
                          <div className="flex flex-1 flex-col justify-between p-6">
                            <div>
                              <div className="flex items-start justify-between">
                                <h4 className="text-xl font-black text-navy-900 group-hover:text-blue-600 transition-colors">{room.name}</h4>
                                {room.availableRooms !== undefined && room.availableRooms < 3 && room.availableRooms > 0 && (
                                  <span className="text-[10px] font-bold text-red-500 uppercase bg-red-50 px-2 py-1 rounded">Sisa {room.availableRooms} kamar!</span>
                                )}
                              </div>
                              <p className="mt-2 text-sm text-slate-500 line-clamp-2">{room.description}</p>
                              <div className="mt-4 flex flex-wrap gap-4">
                                <span className="flex items-center gap-1.5 text-xs font-bold text-slate-400">
                                  <Users className="h-3.5 w-3.5" /> {room.capacity} Dewasa
                                </span>
                              </div>
                            </div>
                            <div className="mt-6 flex items-end justify-between border-t border-slate-100 pt-4">
                              <div className="text-[10px] font-bold text-green-600 uppercase flex items-center gap-1">
                                <Check size={12} /> Pembatalan Gratis
                              </div>
                              <div className="text-right">
                                <p className="text-xl font-black text-blue-600">
                                  {formatPrice(room.effectivePrice ?? room.basePrice)}
                                </p>
                                <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">per malam</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>

            {/* Right: Sticky sidebar */}
            <div className="relative">
              <div className="sticky top-40 space-y-6">
                
                <div className="rounded-3xl bg-white p-6 shadow-xl shadow-slate-200/50 border border-slate-50">
                  <div className="flex items-center gap-3 mb-6">
                    <Calendar className="h-5 w-5 text-blue-500" />
                    <h2 className="text-lg font-black text-navy-900">Pilih Tanggal</h2>
                  </div>
                  
                  {calendarPrices.length > 0 && <PriceCalendar prices={calendarPrices} />}

                  {selectedRoom && (
                    <div className="mt-8 border-t border-slate-50 pt-6">
                      <div className="mb-4">
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Mulai dari</p>
                        <div className="flex items-baseline gap-1">
                          <p className="text-2xl font-black text-blue-600">
                            {formatPrice(selectedRoom.effectivePrice ?? selectedRoom.basePrice)}
                          </p>
                          <span className="text-xs font-bold text-slate-400 uppercase">/malam</span>
                        </div>
                      </div>
                      
                      <button
                        onClick={handleBookNow}
                        disabled={selectedRoom.isAvailable === false}
                        className="w-full rounded-2xl bg-blue-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.98] disabled:opacity-50 disabled:grayscale">
                        {selectedRoom.isAvailable === false ? 'Penuh' : 'Pesan Sekarang'}
                      </button>
                      <p className="mt-3 text-center text-[10px] font-bold text-green-600 flex items-center justify-center gap-1.5">
                         <Check size={14} /> Jaminan Harga Termurah
                      </p>
                    </div>
                  )}
                </div>

                <div className="rounded-2xl bg-blue-900 p-6 text-white shadow-xl shadow-blue-900/20 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-2xl bg-white/10 flex items-center justify-center text-white">
                    <TrendingUp size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-black">Lagi Populer!</p>
                    <p className="text-[10px] text-blue-100/60 mt-0.5">Banyak yang melihat akomodasi ini dalam 24 jam terakhir.</p>
                  </div>
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
