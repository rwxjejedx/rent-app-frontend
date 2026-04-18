import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MapPin, Calendar, Upload, Star, Loader2, Eye, X } from "lucide-react";
import { bookingApi, formatPrice, statusConfig, type Booking } from "@/lib/booking";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const MyBookings = () => {
  const { isAuthenticated, isUser } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [cancellingId, setCancellingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isUser) { navigate('/login'); return; }
    bookingApi.getMyBookings().then(setBookings).finally(() => setIsLoading(false));
  }, [isAuthenticated, isUser]);

  const handleCancel = async (bookingId: number) => {
    if (!confirm("Cancel this booking?")) return;
    try {
      setCancellingId(bookingId);
      await bookingApi.cancel(bookingId);
      setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: 'CANCELLED' } : b));
      toast({ title: "Booking cancelled", variant: "default" });
    } catch (err: any) {
      toast({ title: "Failed to cancel", description: err.response?.data?.message, variant: "destructive" });
    } finally {
      setCancellingId(null);
    }
  };

  const statuses = ["ALL", "WAITING_PAYMENT", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
  const filtered = filter === "ALL" ? bookings : bookings.filter(b => b.status === filter);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-background)]">
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-4xl px-4">
          <h1 className="mb-2 text-2xl font-extrabold text-[var(--color-foreground)]" style={{ fontFamily: "var(--font-display)" }}>
            My Bookings
          </h1>
          <p className="mb-6 text-sm text-[var(--color-muted-fg)]">Track and manage all your reservations.</p>

          {/* Filter tabs */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === s ? 'bg-[var(--color-navy-800)] text-white' : 'border border-[var(--color-border)] text-[var(--color-muted-fg)] hover:border-[var(--color-navy-600)]'}`}>
                {s === "ALL" ? `All (${bookings.length})` : statusConfig[s as keyof typeof statusConfig]?.label ?? s}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" /></div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="text-4xl mb-3">🏨</div>
              <p className="font-semibold text-[var(--color-foreground)]">No bookings found</p>
              <Link to="/" className="mt-4 text-sm text-[var(--color-navy-800)] underline">Browse properties</Link>
            </div>
          ) : (
            <div className="space-y-3">
              {filtered.map(booking => {
                const status = statusConfig[booking.status];
                const isWaiting = booking.status === 'WAITING_PAYMENT';
                const isPending = booking.status === 'PENDING';
                const isExpired = isWaiting && new Date() > new Date(booking.paymentDeadline);
                const canCancel = (isWaiting || isPending) && !isExpired;
                const image = booking.roomType.property.images?.[0]?.url ?? booking.roomType.images?.[0]?.url;

                return (
                  <div key={booking.id} className="rounded-2xl border border-[var(--color-border)] bg-white shadow-sm overflow-hidden">
                    <div className="flex flex-col sm:flex-row">
                      {image && <img src={image} alt="" className="h-28 w-full object-cover sm:h-auto sm:w-32 shrink-0" />}
                      <div className="flex flex-1 flex-col justify-between p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="font-bold text-[var(--color-foreground)]">{booking.roomType.property.name}</p>
                            <p className="text-xs text-[var(--color-muted-fg)]">{booking.roomType.name}</p>
                            <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-muted-fg)]">
                              <MapPin className="h-3 w-3" /> {booking.roomType.property.city}
                            </p>
                            <p className="mt-0.5 flex items-center gap-1 text-xs text-[var(--color-muted-fg)]">
                              <Calendar className="h-3 w-3" />
                              {new Date(booking.checkIn).toLocaleDateString('id-ID')} — {new Date(booking.checkOut).toLocaleDateString('id-ID')}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className={`shrink-0 rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.color}`}>{status.label}</span>
                            {canCancel && (
                              <button onClick={() => handleCancel(booking.id)} disabled={cancellingId === booking.id}
                                className="rounded-full border border-red-200 p-1 text-red-400 hover:bg-red-50 transition disabled:opacity-50">
                                {cancellingId === booking.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                              </button>
                            )}
                          </div>
                        </div>

                        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--color-border)] pt-3">
                          <span className="text-sm font-bold text-[var(--color-navy-800)]">{formatPrice(booking.totalPrice)}</span>
                          <div className="flex gap-2">
                            {isWaiting && !isExpired && (
                              <Link to={`/bookings/${booking.id}/payment`}
                                className="flex items-center gap-1.5 rounded-xl bg-navy-gradient px-3 py-1.5 text-xs font-bold text-white transition hover:opacity-90">
                                <Upload className="h-3 w-3" /> Upload Payment
                              </Link>
                            )}
                            {isWaiting && isExpired && <span className="text-xs text-red-500 font-medium">Deadline passed</span>}
                            {booking.status === 'COMPLETED' && !booking.review && (
                              <Link to={`/bookings/${booking.id}/review`}
                                className="flex items-center gap-1.5 rounded-xl border border-[var(--color-navy-800)] px-3 py-1.5 text-xs font-bold text-[var(--color-navy-800)] hover:bg-[var(--color-navy-800)] hover:text-white transition">
                                <Star className="h-3 w-3" /> Review
                              </Link>
                            )}
                            {booking.paymentProof && (
                              <a href={booking.paymentProof} target="_blank" rel="noopener noreferrer"
                                className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] px-3 py-1.5 text-xs font-semibold text-[var(--color-muted-fg)] hover:bg-[var(--color-muted)] transition">
                                <Eye className="h-3 w-3" /> Proof
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default MyBookings;
