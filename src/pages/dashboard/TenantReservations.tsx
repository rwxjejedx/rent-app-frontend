import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MapPin, Calendar, Check, X, Eye, Loader2, Clock } from "lucide-react";
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
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-950">Reservations</h1>
          <p className="text-slate-500 mt-1 font-medium">Manage and review your property bookings.</p>
        </div>
        {pendingCount > 0 && (
          <div className="flex items-center gap-2 bg-amber-50 text-amber-700 px-4 py-2 rounded-full text-xs font-bold border border-amber-100">
            <Clock size={14} />
            <span>{pendingCount} Pending Approvals</span>
          </div>
        )}
      </div>

      {/* Filter */}
      <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
        {statuses.map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`shrink-0 rounded-full px-5 py-2 text-xs font-bold transition-all ${
              filter === s 
                ? 'bg-slate-950 text-white shadow-lg shadow-slate-200' 
                : 'bg-white border border-slate-100 text-slate-500 hover:border-slate-300'
            }`}>
            {s === "ALL" ? `All (${displayableBookings.length})` : `${statusConfig[s as keyof typeof statusConfig]?.label ?? s} ${s === 'PENDING' && pendingCount > 0 ? `(${pendingCount})` : ''}`}
          </button>
        ))}
      </div>

      {isLoading ? (
        <div className="flex justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
        </div>
      ) : filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm">
          <div className="bg-slate-50 p-6 rounded-full mb-4">
            <Calendar className="h-10 w-10 text-slate-300" />
          </div>
          <h3 className="text-lg font-bold text-slate-950">No reservations found</h3>
          <p className="text-slate-400 text-sm mt-1">Try changing your filters or check back later.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {filtered.map(booking => {
            const status = statusConfig[booking.status];
            const isPending = booking.status === 'PENDING';
            const isProcessing = processingId === booking.id;

            return (
              <div key={booking.id}
                className={`group bg-white rounded-3xl border transition-all duration-300 p-6 ${
                  isPending ? 'border-blue-200 ring-4 ring-blue-50' : 'border-slate-100 hover:shadow-md'
                }`}>
                <div className="flex flex-col md:flex-row gap-6">
                  {/* Guest Info */}
                  <div className="flex items-start gap-4 flex-1">
                    <div className="h-12 w-12 rounded-2xl bg-slate-100 flex items-center justify-center text-lg font-bold text-slate-400">
                      {(booking as any).user?.name?.charAt(0) ?? 'G'}
                    </div>
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-bold text-slate-950 text-lg">{(booking as any).user?.name ?? 'Guest'}</h3>
                        <span className={`rounded-full px-3 py-0.5 text-[10px] font-black uppercase tracking-widest ${status.color}`}>
                          {status.label}
                        </span>
                      </div>
                      <p className="text-sm text-slate-500 font-medium">{(booking as any).user?.email}</p>
                      <div className="flex items-center gap-3 mt-2 text-xs text-slate-400 font-bold uppercase tracking-wider">
                        <span className="flex items-center gap-1"><MapPin size={12} /> {booking.roomType.property.name}</span>
                        <span className="flex items-center gap-1"><Calendar size={12} /> {new Date(booking.checkIn).toLocaleDateString()} - {new Date(booking.checkOut).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment & Actions */}
                  <div className="flex flex-col md:items-end justify-between gap-4">
                    <div className="md:text-right">
                      <p className="text-xl font-black text-slate-950">{formatPrice(booking.totalPrice)}</p>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1">{booking.paymentMethod.replace('_', ' ')}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {booking.paymentProof && (
                        <a href={booking.paymentProof} target="_blank" rel="noopener noreferrer"
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-slate-600 bg-slate-50 hover:bg-slate-100 transition-colors">
                          <Eye size={14} /> Proof
                        </a>
                      )}
                      
                      {['WAITING_PAYMENT', 'PENDING', 'CONFIRMED'].includes(booking.status) && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'CANCELLED')}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold text-red-600 bg-red-50 hover:bg-red-100 transition-colors disabled:opacity-50">
                          {isProcessing && processingId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <X size={14} />}
                          {booking.status === 'CONFIRMED' ? 'Cancel' : 'Reject'}
                        </button>
                      )}

                      {booking.status === 'PENDING' && (
                        <button
                          onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}
                          disabled={isProcessing}
                          className="flex items-center gap-2 px-6 py-2 rounded-xl text-xs font-bold text-white bg-slate-950 hover:scale-105 active:scale-95 transition-all disabled:opacity-50">
                          {isProcessing && processingId === booking.id ? <Loader2 size={14} className="animate-spin" /> : <Check size={14} />}
                          Confirm
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default TenantReservations;

