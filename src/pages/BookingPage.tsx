import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { Calendar, MapPin, Loader2, ArrowLeft, User, CreditCard, Phone, Home, TrendingUp, Check } from "lucide-react";
import { propertyApi, formatPrice as fmtPrice } from "@/lib/property";
import { bookingApi } from "@/lib/booking";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";
import { format } from "date-fns";
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
    } catch (err) {
      console.error("Price calculation failed:", err);
      // fallback to base price if API fails
      if (roomType) {
        setPriceResult({
          nights,
          totalPrice: nights * Number(roomType.basePrice),
          basePrice: Number(roomType.basePrice),
          breakdown: [],
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
    <div className="flex min-h-screen flex-col bg-[#F4F7F9]">
      {/* Header bar */}
      <div className="bg-white border-b border-slate-200 py-4 shadow-sm">
        <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
          <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm font-bold text-navy-700 hover:text-navy-900 transition-colors">
            <ArrowLeft size={18} /> Review Your Trip
          </button>
          <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
            <span className="text-navy-700 border-b-2 border-navy-700 pb-1">1. Fill Details</span>
            <span>2. Payment</span>
            <span>3. Confirmation</span>
          </div>
        </div>
      </div>

      <main className="flex-1 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-12">
            
            {/* Main Form Area */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Trip Summary Card (Mobile friendly) */}
              <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-32 shrink-0 overflow-hidden rounded-xl bg-slate-100">
                    {roomType?.images?.[0] ? (
                      <img src={roomType.images[0].url} alt={roomType.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-slate-300"><Home size={24} /></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-navy-900">{property?.name || "Loading property..."}</h2>
                    <p className="flex items-center gap-1.5 text-xs text-slate-500 mt-1">
                      <MapPin size={12} /> {property?.city}, {property?.location}
                    </p>
                    <div className="mt-2 inline-flex items-center gap-2 rounded-lg bg-blue-50 px-2.5 py-1 text-[10px] font-bold text-blue-700">
                      <Home size={12} /> {roomType?.name || "Room Type"}
                    </div>
                  </div>
                </div>
                
                <div className="mt-6 grid grid-cols-2 gap-4 border-t border-slate-50 pt-6 md:grid-cols-4">
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Check-in</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{checkIn ? format(new Date(checkIn), "EEE, dd MMM yyyy") : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Check-out</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{checkOut ? format(new Date(checkOut), "EEE, dd MMM yyyy") : "—"}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Duration</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{nights} Night{nights > 1 ? 's' : ''}</p>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase text-slate-400">Guests</p>
                    <p className="mt-1 text-sm font-bold text-navy-900">{roomType?.capacity || 1} Person{roomType?.capacity > 1 ? 's' : ''}</p>
                  </div>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                {/* Date Picker Section */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                  <div className="mb-4 flex items-center justify-between">
                    <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2">
                      <Calendar size={18} className="text-blue-500" /> Change Dates
                    </h3>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Check-in Date</label>
                      <input type="date" min={today} className={inputBase} value={checkIn}
                        onChange={e => { setCheckIn(e.target.value); if (checkOut <= e.target.value) setCheckOut(''); }} />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Check-out Date</label>
                      <input type="date" min={checkIn || today} className={inputBase} value={checkOut}
                        onChange={e => setCheckOut(e.target.value)} />
                    </div>
                  </div>

                  {priceResult && priceResult.breakdown.length > 0 && (
                    <div className="mt-6 border-t border-slate-50 pt-4">
                      <p className="text-[10px] font-bold uppercase text-slate-400 mb-3 tracking-widest">Dynamic Pricing Details</p>
                      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                        {priceResult.breakdown.map((d, idx) => (
                          <div key={d.date} 
                            className={`rounded-xl p-2.5 text-center border transition-all ${d.isPeak ? 'bg-amber-50 border-amber-200' : 'bg-slate-50 border-slate-100'}`}
                            style={{ animationDelay: `${idx * 50}ms` }}>
                            <p className="text-[9px] font-bold text-slate-400 uppercase">
                              {new Date(d.date).toLocaleDateString('en-US', { weekday: 'short', day: 'numeric' })}
                            </p>
                            <p className={`text-xs font-black mt-0.5 ${d.isPeak ? 'text-amber-700' : 'text-navy-900'}`}>
                              {fmtPrice(d.price)}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Guest Info Section */}
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-navy-900 flex items-center gap-2 mb-6">
                    <User size={18} className="text-blue-500" /> Contact Details
                  </h3>
                  <div className="space-y-5">
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Full Name (According to ID)</label>
                      <input type="text" className={inputBase} placeholder="e.g. John Doe" required
                        value={guest.guestName} onChange={e => setGuest({ ...guest, guestName: e.target.value })} />
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 px-1">National ID / NIK (16 Digits)</label>
                        <input type="text" maxLength={16} className={inputBase} placeholder="3201xxxxxxxxxxxx" required
                          value={guest.guestNik} onChange={e => setGuest({ ...guest, guestNik: e.target.value.replace(/\D/g, '') })} />
                        <div className="flex justify-between items-center px-1">
                           <p className="text-[9px] text-slate-400">Must be exactly 16 digits</p>
                           <p className={`text-[10px] font-bold ${guest.guestNik.length === 16 ? 'text-green-500' : 'text-slate-300'}`}>
                            {guest.guestNik.length}/16
                           </p>
                        </div>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Phone Number</label>
                        <div className="relative">
                          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-bold text-slate-400">+62</span>
                          <input type="tel" className={`${inputBase} pl-12`} placeholder="812xxxxxxx" required
                            value={guest.guestPhone} onChange={e => setGuest({ ...guest, guestPhone: e.target.value })} />
                        </div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] font-bold uppercase text-slate-400 px-1">Residential Address</label>
                      <textarea className={`${inputBase} min-h-[100px] py-4 resize-none`} placeholder="Complete address for verification" required
                        value={guest.guestAddress} onChange={e => setGuest({ ...guest, guestAddress: e.target.value })} />
                    </div>
                  </div>
                </div>

                <div className="rounded-2xl bg-blue-900 p-6 text-white shadow-xl shadow-blue-200/50">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h4 className="text-lg font-bold">Ready to secure your stay?</h4>
                      <p className="text-sm text-blue-100/80 mt-1">Make sure all details are correct before proceeding to payment.</p>
                    </div>
                    <button type="submit" disabled={isLoading || isPriceLoading || !priceResult}
                      className="shrink-0 rounded-xl bg-gold-gradient px-8 py-3.5 text-sm font-black uppercase tracking-widest text-navy-900 shadow-lg hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2">
                      {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Proceed to Payment"}
                    </button>
                  </div>
                </div>
              </form>
            </div>

            {/* Sidebar Summary */}
            <div className="lg:col-span-4">
              <div className="sticky top-24 space-y-6">
                
                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100">
                  <h3 className="text-sm font-bold text-navy-900 mb-4 pb-4 border-b border-slate-50 flex items-center justify-between">
                    Price Details
                    <CreditCard size={16} className="text-slate-300" />
                  </h3>
                  
                  <div className="space-y-3">
                    {isPriceLoading ? (
                      <div className="flex flex-col items-center justify-center py-6 text-slate-400 animate-pulse">
                        <Loader2 className="animate-spin mb-2" size={24} />
                        <p className="text-xs font-bold uppercase">Recalculating...</p>
                      </div>
                    ) : priceResult ? (
                      <>
                        <div className="flex justify-between text-sm">
                          <span className="text-slate-500">Accommodation Price</span>
                          <span className="font-bold text-navy-900">{fmtPrice(priceResult.totalPrice)}</span>
                        </div>
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>{nights} Night{nights > 1 ? 's' : ''} x {fmtPrice(priceResult.basePrice)} base</span>
                          <span>Incl. Tax</span>
                        </div>
                        
                        {hasPeakDates && (
                          <div className="flex items-center gap-2 rounded-xl bg-amber-50 p-3 text-[10px] font-bold text-amber-700">
                            <TrendingUp size={14} /> Peak season rates are currently active for some dates.
                          </div>
                        )}

                        <div className="mt-4 pt-4 border-t border-navy-900/5 flex items-center justify-between">
                          <span className="text-base font-black text-navy-900">Total Payment</span>
                          <span className="text-xl font-black text-blue-600">{fmtPrice(priceResult.totalPrice)}</span>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                        <p className="text-[10px] font-bold text-slate-400 uppercase">Select dates to calculate</p>
                      </div>
                    )}
                  </div>
                </div>

                <div className="rounded-2xl bg-white p-6 shadow-sm border border-slate-100 flex items-center gap-4">
                  <div className="h-12 w-12 rounded-full bg-green-50 flex items-center justify-center text-green-600">
                    <Check size={24} />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-navy-900">Free Cancellation</p>
                    <p className="text-[10px] text-slate-400">Cancel for free up to 24h before check-in.</p>
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
