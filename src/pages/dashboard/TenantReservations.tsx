import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Check, X, Eye, Loader2 } from "lucide-react";
import { bookingApi, formatPrice, statusConfig, type Booking } from "@/lib/booking";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import Footer from "@/components/Footer";

const TenantReservations = () => {
  const { isAuthenticated, isTenant } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState("ALL");
  const [processingId, setProcessingId] = useState<number | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !isTenant) { navigate('/login'); return; }
    bookingApi.getTenantBookings().then(setBookings).finally(() => setIsLoading(false));
  }, [isAuthenticated, isTenant]);

const handleUpdateStatus = async (bookingId: number, status: 'CONFIRMED' | 'CANCELLED') => {
  try {
    setProcessingId(bookingId);
    
    // Pastikan memanggil fungsi dari bookingApi yang sudah kita perbaiki di atas
    const updated = await bookingApi.updateStatus(bookingId, status);
    
    // Update state lokal agar UI berubah tanpa refresh
    setBookings(prev => prev.map(b => b.id === bookingId ? { ...b, status: updated.status } : b));
    
    toast({
      title: status === 'CONFIRMED' ? '✅ Booking Confirmed' : '❌ Booking Rejected',
      variant: "default", // Sesuaikan dengan variant toast kamu (biasanya 'default' atau 'destructive')
    });
  } catch (err: any) {
    // Tampilkan pesan error asli dari backend agar tahu kenapa gagal (misal: "Forbidden" atau "Booking not found")
    const errorMessage = err.response?.data?.message || "Something went wrong";
    toast({ 
      title: "Action Failed", 
      description: errorMessage, 
      variant: "destructive" 
    });
    console.error("Update Status Error:", err);
  } finally {
    setProcessingId(null);
  }
};

  const statuses = ["ALL", "WAITING_PAYMENT", "PENDING", "CONFIRMED", "COMPLETED", "CANCELLED"];
  
  // Only display CANCELLED if cancelled by TENANT or SYSTEM. Hide if cancelled by USER.
  const displayableBookings = bookings.filter(b => 
    b.status !== 'CANCELLED' || (b.cancelledBy === 'TENANT' || b.cancelledBy === 'SYSTEM' || !b.cancelledBy)
  );
  
  const filtered = filter === "ALL" ? displayableBookings : displayableBookings.filter(b => b.status === filter);
  const pendingCount = displayableBookings.filter(b => b.status === 'PENDING').length;

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-5xl px-4">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-[var(--color-foreground)]"
                style={{ fontFamily: "var(--font-display)" }}>
                Reservations
              </h1>
              {pendingCount > 0 && (
                <p className="mt-1 text-sm text-amber-600 font-medium">
                  ⚠️ {pendingCount} booking{pendingCount > 1 ? 's' : ''} waiting for your confirmation
                </p>
              )}
            </div>
          </div>

          {/* Filter */}
          <div className="mb-6 flex gap-2 overflow-x-auto pb-2">
            {statuses.map(s => (
              <button key={s} onClick={() => setFilter(s)}
                className={`shrink-0 rounded-full px-4 py-1.5 text-xs font-semibold transition ${filter === s ? 'bg-[var(--color-navy-800)] text-white' : 'border border-[var(--color-border)] text-[var(--color-muted-fg)] hover:border-[var(--color-navy-600)]'}`}>
                {s === "ALL" ? `All (${displayableBookings.length})` : `${statusConfig[s as keyof typeof statusConfig]?.label ?? s} ${s === 'PENDING' && pendingCount > 0 ? `(${pendingCount})` : ''}`}
              </button>
            ))}
          </div>

          {isLoading ? (
            <div className="flex justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
            </div>
          ) : filtered.length === 0 ? (
            <div className="flex flex-col items-center py-20 text-center">
              <div className="text-4xl mb-3">📋</div>
              <p className="font-semibold">No reservations found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filtered.map(booking => {
                const status = statusConfig[booking.status];
                const isPending = booking.status === 'PENDING';
                const isProcessing = processingId === booking.id;

                return (
                  <div key={booking.id}
                    className={`rounded-2xl border bg-white shadow-sm overflow-hidden ${isPending ? 'border-blue-200 ring-1 ring-blue-100' : 'border-[var(--color-border)]'}`}>
                    <div className="p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <p className="font-bold text-[var(--color-foreground)]">
                              Booking #{booking.id}
                            </p>
                            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${status.color}`}>
                              {status.label}
                            </span>
                          </div>
                          <p className="mt-1 text-sm text-[var(--color-muted-fg)]">
                            {(booking as any).user?.name ?? 'Guest'} • {(booking as any).user?.email}
                          </p>
                          <p className="mt-1 text-xs text-[var(--color-muted-fg)]">
                            {booking.roomType.property.name} — {booking.roomType.name}
                          </p>
                          <p className="mt-1 flex items-center gap-1 text-xs text-[var(--color-muted-fg)]">
                            <Calendar className="h-3 w-3" />
                            {new Date(booking.checkIn).toLocaleDateString('id-ID')} — {new Date(booking.checkOut).toLocaleDateString('id-ID')}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-[var(--color-navy-800)]">{formatPrice(booking.totalPrice)}</p>
                          <p className="text-xs text-[var(--color-muted-fg)]">{booking.paymentMethod.replace('_', ' ')}</p>
                        </div>
                      </div>

                      {/* Actions */}
                      {(['WAITING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(booking.status) || booking.paymentProof) && (
                        <div className="mt-4 flex flex-wrap items-center gap-3 border-t border-[var(--color-border)] pt-4">
                          {booking.paymentProof && (
                            <a href={booking.paymentProof} target="_blank" rel="noopener noreferrer"
                              className="flex items-center gap-1.5 rounded-xl border border-[var(--color-border)] bg-slate-50 px-4 py-2 text-xs font-semibold text-slate-600 transition hover:bg-slate-100">
                              <Eye className="h-3.5 w-3.5" /> View Payment Proof
                            </a>
                          )}
                          
                          <div className="ml-auto flex gap-2">
                            {['WAITING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(booking.status) && (
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                                disabled={isProcessing}
                                className="flex items-center gap-1.5 rounded-xl border border-red-200 bg-red-50 px-4 py-2 text-xs font-bold text-red-700 transition hover:bg-red-100 disabled:opacity-50">
                                {isProcessing && processingId === booking.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <X className="h-3.5 w-3.5" />}
                                {booking.status === 'CONFIRMED' ? 'Cancel Booking' : 'Reject'}
                              </button>
                            )}

                            {booking.status === 'PENDING' && (
                              <button
                                onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                                disabled={isProcessing}
                                className="flex items-center gap-1.5 rounded-xl bg-green-600 px-4 py-2 text-xs font-bold text-white transition hover:bg-green-700 disabled:opacity-50">
                                {isProcessing && processingId === booking.id ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Check className="h-3.5 w-3.5" />}
                                Confirm
                              </button>
                            )}
                          </div>
                        </div>
                      )}
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

export default TenantReservations;
