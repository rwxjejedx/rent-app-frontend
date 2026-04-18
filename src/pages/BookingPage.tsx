import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, MapPin, Loader2, ArrowLeft, User, CreditCard, Phone, Home, TrendingUp } from "lucide-react";
import { propertyApi, formatPrice as fmtPrice } from "@/lib/property";
import { bookingApi } from "@/lib/booking";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import api from "@/lib/api";

interface PriceBreakdown {
  date: string;
  price: number;
  isPeak: boolean;
}

interface PriceCalcResult {
  nights: number;
  totalPrice: number;
  basePrice: number;
  breakdown: PriceBreakdown[];
}

const BookingPage = () => {
  const { roomTypeId } = useParams<{ roomTypeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isUser } = useAuth();
  const { toast } = useToast();

  const propertyId = new URLSearchParams(location.search).get('propertyId');

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [roomType, setRoomType] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [priceResult, setPriceResult] = useState<PriceCalcResult | null>(null);
  const [guest, setGuest] = useState({ guestName: "", guestNik: "", guestPhone: "", guestAddress: "" });

  useEffect(() => {
    if (!isAuthenticated || !isUser) { navigate('/login'); return; }
    api.get('/users/me').then(res => {
      setGuest(prev => ({ ...prev, guestName: res.data.name ?? "", guestPhone: res.data.phone ?? "" }));
    });
    if (propertyId && roomTypeId) {
      propertyApi.getById(parseInt(propertyId)).then(p => {
        setProperty(p);
        setRoomType(p.roomTypes.find((r: any) => r.id === parseInt(roomTypeId!)));
      });
    }
  }, [isAuthenticated, isUser, propertyId, roomTypeId, navigate]);

  // Hitung harga berdasarkan tanggal yang dipilih — pakai endpoint calculate-price
  const calculatePrice = useCallback(async () => {
    if (!checkIn || !checkOut || !roomTypeId) { setPriceResult(null); return; }
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) { setPriceResult(null); return; }
    try {
      setIsPriceLoading(true);
      const res = await api.get('/properties/calculate-price', {
        params: {
          roomTypeId,
          checkIn: new Date(checkIn).toISOString(),
          checkOut: new Date(checkOut).toISOString(),
        }
      });
      setPriceResult(res.data);
    } catch {
      // fallback
      if (roomType) {
        setPriceResult({
          nights, totalPrice: nights * Number(roomType.basePrice),
          basePrice: Number(roomType.basePrice), breakdown: [],
        });
      }
    } finally {
      setIsPriceLoading(false);
    }
  }, [checkIn, checkOut, roomTypeId, roomType]);

  useEffect(() => { calculatePrice(); }, [calculatePrice]);

  const nights = priceResult?.nights ?? 0;
  const hasPeakDates = priceResult?.breakdown.some(d => d.isPeak) ?? false;
  const today = new Date().toISOString().split('T')[0];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!checkIn || !checkOut || nights <= 0) {
      toast({ title: "Error", description: "Select valid check-in and check-out dates", variant: "destructive" });
      return;
    }
    if (guest.guestNik.length !== 16) {
      toast({ title: "Error", description: "NIK must be 16 digits", variant: "destructive" });
      return;
    }
    try {
      setIsLoading(true);
      const booking = await bookingApi.create({
        roomTypeId: parseInt(roomTypeId!),
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        ...guest,
      });
      toast({ title: "Booking confirmed!", description: "Upload payment proof within 1 hour", variant: "success" });
      navigate(`/bookings/${booking.id}/payment`);
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.response?.data?.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const inputBase = "w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:border-navy-700 focus:bg-white focus:outline-none transition-all";

  return (
    <div className="flex min-h-screen flex-col bg-slate-50">
      <main className="flex-1 py-10">
        <div className="mx-auto max-w-5xl px-4">
          <button onClick={() => navigate(-1)} className="mb-6 flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-navy-900 transition-colors">
            <ArrowLeft size={16} /> Back
          </button>
          <h1 className="text-2xl font-black text-navy-900 mb-1 tracking-tight">Complete Your Booking</h1>
          <p className="text-slate-400 text-sm mb-8">Fill in the details below to secure your reservation.</p>

          <div className="grid gap-8 lg:grid-cols-3">
            {/* Form */}
            <div className="lg:col-span-2 space-y-5">
              <form onSubmit={handleSubmit} className="space-y-5">

                {/* Dates */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                  <h2 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <Calendar size={14} /> Stay Dates
                  </h2>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">Check-in</label>
                      <input type="date" min={today} className={inputBase} value={checkIn}
                        onChange={e => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(''); }} />
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">Check-out</label>
                      <input type="date" min={checkIn || today} className={inputBase} value={checkOut}
                        onChange={e => setCheckOut(e.target.value)} />
                    </div>
                  </div>

                  {/* Price breakdown per hari */}
                  {priceResult && priceResult.breakdown.length > 0 && (
                    <div className="mt-4 rounded-xl bg-slate-50 p-4">
                      <p className="text-[10px] font-black uppercase text-slate-400 mb-3 tracking-widest">Price Breakdown</p>
                      <div className="space-y-1.5 max-h-40 overflow-y-auto">
                        {priceResult.breakdown.map(d => (
                          <div key={d.date} className="flex items-center justify-between text-xs">
                            <span className="text-slate-500">
                              {new Date(d.date).toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' })}
                            </span>
                            <span className={`font-semibold flex items-center gap-1 ${d.isPeak ? 'text-amber-600' : 'text-slate-700'}`}>
                              {d.isPeak && <TrendingUp size={10} />}
                              {fmtPrice(d.price)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Info */}
                <div className="rounded-2xl bg-white border border-slate-100 p-6 shadow-sm">
                  <h2 className="mb-5 flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400">
                    <User size={14} /> Guest Information
                  </h2>
                  <p className="mb-4 text-xs text-slate-400">Required for check-in identity verification.</p>
                  <div className="space-y-4">
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">Full Name (as per ID) *</label>
                      <input type="text" className={inputBase} placeholder="Full name" required
                        value={guest.guestName} onChange={e => setGuest({ ...guest, guestName: e.target.value })} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">NIK (16 digits) *</label>
                        <input type="text" maxLength={16} className={inputBase} placeholder="1234567890123456" required
                          value={guest.guestNik} onChange={e => setGuest({ ...guest, guestNik: e.target.value.replace(/\D/g, '') })} />
                        <p className={`mt-1 text-[10px] font-medium ${guest.guestNik.length === 16 ? 'text-green-500' : 'text-slate-400'}`}>
                          {guest.guestNik.length}/16
                        </p>
                      </div>
                      <div>
                        <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">Phone Number *</label>
                        <input type="tel" className={inputBase} placeholder="+62 812 xxxx xxxx" required
                          value={guest.guestPhone} onChange={e => setGuest({ ...guest, guestPhone: e.target.value })} />
                      </div>
                    </div>
                    <div>
                      <label className="mb-1.5 block text-[10px] font-bold uppercase text-slate-400">Address *</label>
                      <textarea className={`${inputBase} min-h-[80px] resize-none`} placeholder="Home address" required
                        value={guest.guestAddress} onChange={e => setGuest({ ...guest, guestAddress: e.target.value })} />
                    </div>
                  </div>
                </div>

                <button type="submit" disabled={isLoading || isPriceLoading || !priceResult}
                  className="w-full rounded-2xl bg-navy-900 py-4 text-sm font-black uppercase tracking-widest text-white shadow-xl hover:bg-navy-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isLoading
                    ? <Loader2 className="animate-spin" size={16} />
                    : priceResult
                    ? `Confirm — ${fmtPrice(priceResult.totalPrice)}`
                    : 'Select dates to continue'}
                </button>
              </form>
            </div>

            {/* Summary */}
            <div className="lg:col-span-1">
              <div className="sticky top-24 rounded-2xl bg-white border border-slate-100 shadow-sm overflow-hidden">
                {/* Property image */}
                {property?.images?.[0] && (
                  <img src={property.images[0].url} alt={property?.name} className="h-36 w-full object-cover" />
                )}
                <div className="p-5">
                  <p className="font-bold text-navy-900">{property?.name ?? '—'}</p>
                  <p className="flex items-center gap-1 text-xs text-slate-400 mt-1 font-medium">
                    <MapPin size={11} /> {property?.city}
                  </p>

                  {/* Room type + image */}
                  {roomType && (
                    <div className="mt-4 rounded-xl overflow-hidden border border-slate-100">
                      {roomType.images?.[0] && (
                        <img src={roomType.images[0].url} alt={roomType.name} className="h-28 w-full object-cover" />
                      )}
                      <div className="p-3 bg-slate-50">
                        <p className="text-xs font-bold text-navy-900">{roomType.name}</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">{roomType.capacity} guests · {fmtPrice(roomType.basePrice)}/night base</p>
                      </div>
                    </div>
                  )}

                  {/* Price summary */}
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-4">
                    {isPriceLoading ? (
                      <div className="flex items-center gap-2 text-xs text-slate-400">
                        <Loader2 size={12} className="animate-spin" /> Calculating price...
                      </div>
                    ) : priceResult ? (
                      <>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Base rate</span>
                          <span className="font-medium">{fmtPrice(priceResult.basePrice)}/night</span>
                        </div>
                        <div className="flex justify-between text-xs">
                          <span className="text-slate-400">Duration</span>
                          <span className="font-medium">{priceResult.nights} night{priceResult.nights > 1 ? 's' : ''}</span>
                        </div>
                        {hasPeakDates && (
                          <div className="flex items-center gap-1.5 rounded-lg bg-amber-50 px-3 py-2 text-[10px] font-semibold text-amber-700">
                            <TrendingUp size={11} /> Peak season pricing applies
                          </div>
                        )}
                        <div className="flex justify-between border-t border-slate-100 pt-2 text-sm font-black text-navy-900">
                          <span>Total</span>
                          <span>{fmtPrice(priceResult.totalPrice)}</span>
                        </div>
                      </>
                    ) : (
                      <p className="text-xs text-slate-400 text-center py-2">Select dates to see pricing</p>
                    )}
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

export default BookingPage;
