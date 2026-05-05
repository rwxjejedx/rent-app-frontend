import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Upload, Clock, CheckCircle2, Loader2, ArrowLeft, AlertCircle, ImageIcon } from "lucide-react";
import { bookingApi, formatPrice, statusConfig, type Booking } from "@/lib/booking";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

const PaymentUpload = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    api.get('/bookings/my').then(res => {
      const b = res.data.find((b: Booking) => b.id === parseInt(bookingId!));
      setBooking(b ?? null);
    }).finally(() => setIsLoading(false));
  }, [bookingId]);

  useEffect(() => {
    if (!booking?.paymentDeadline) return;
    const interval = setInterval(() => {
      const diff = new Date(booking.paymentDeadline).getTime() - Date.now();
      if (diff <= 0) { setTimeLeft("Expired"); clearInterval(interval); return; }
      const mins = Math.floor(diff / 60000);
      const secs = Math.floor((diff % 60000) / 1000);
      setTimeLeft(`${mins}m ${secs}s`);
    }, 1000);
    return () => clearInterval(interval);
  }, [booking]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (!f) return;
    if (!['image/jpeg', 'image/png'].includes(f.type)) {
      toast({ title: "Only JPG and PNG allowed", variant: "destructive" }); return;
    }
    if (f.size > 1024 * 1024) {
      toast({ title: "File must be under 1MB", variant: "destructive" }); return;
    }
    setFile(f);
    setPreview(URL.createObjectURL(f));
  };

  const handleUpload = async () => {
    if (!file || !bookingId) return;
    try {
      setIsUploading(true);
      await bookingApi.uploadPaymentProof(parseInt(bookingId), file);
      toast({ title: "Payment proof uploaded!", description: "Waiting for tenant confirmation", variant: "success" });
      navigate('/bookings');
    } catch (err: any) {
      toast({ title: "Upload Failed", description: err.response?.data?.message, variant: "destructive" });
    } finally {
      setIsUploading(false);
    }
  };

  if (isLoading) return <div className="flex min-h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" /></div>;
  if (!booking) return <div className="flex min-h-screen items-center justify-center text-sm text-[var(--color-muted-fg)]">Booking not found</div>;

  const isExpired = new Date() > new Date(booking.paymentDeadline);
  const status = statusConfig[booking.status];

  return (
    <div className="mx-auto max-w-md px-4 py-10">
      <button onClick={() => navigate('/bookings')} className="mb-6 inline-flex items-center gap-1.5 text-sm font-medium text-[var(--color-muted-fg)] hover:text-[var(--color-foreground)]">
        <ArrowLeft className="h-4 w-4" /> My Bookings
      </button>

      <h1 className="mb-6 text-3xl font-bold text-gradient-gold">Upload Payment Proof</h1>

      {/* Booking Info */}
      <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-premium">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-[var(--color-foreground)] tracking-tight">{booking.roomType.property.name}</p>
            <p className="text-xs text-[var(--color-muted-fg)] uppercase tracking-widest font-semibold">{booking.roomType.name}</p>
            <p className="mt-2 text-xs text-[var(--color-muted-fg)] flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {new Date(booking.checkIn).toLocaleDateString('id-ID')} — {new Date(booking.checkOut).toLocaleDateString('id-ID')}
            </p>
          </div>
          <span className={`rounded-full px-3 py-1 text-[10px] font-bold uppercase tracking-tighter ${status.color}`}>{status.label}</span>
        </div>
        <div className="mt-4 flex justify-between border-t border-[var(--color-border)] pt-4">
          <span className="text-xs font-medium text-[var(--color-muted-fg)]">Total Amount</span>
          <span className="text-lg font-bold text-[var(--color-navy-800)]">{formatPrice(booking.totalPrice)}</span>
        </div>
      </div>


      {/* Deadline */}
      {booking.status === 'WAITING_PAYMENT' && (
        <div className={`mb-4 rounded-2xl border p-4 flex items-center gap-3 ${isExpired ? 'border-red-200 bg-red-50' : 'border-amber-200 bg-amber-50'}`}>
          {isExpired ? <AlertCircle className="h-5 w-5 text-red-600 shrink-0" /> : <Clock className="h-5 w-5 text-amber-600 shrink-0" />}
          <div>
            <p className={`text-sm font-semibold ${isExpired ? 'text-red-800' : 'text-amber-800'}`}>
              {isExpired ? 'Payment deadline passed' : `Time remaining: ${timeLeft}`}
            </p>
            <p className={`text-xs mt-0.5 ${isExpired ? 'text-red-700' : 'text-amber-700'}`}>
              Deadline: {new Date(booking.paymentDeadline).toLocaleString('id-ID')}
            </p>
          </div>
        </div>
      )}

      {/* Already uploaded */}
      {booking.paymentProof && (
        <div className="mb-4 rounded-2xl border border-green-200 bg-green-50 p-4 flex items-center gap-3">
          <CheckCircle2 className="h-5 w-5 text-green-600" />
          <div>
            <p className="text-sm font-semibold text-green-800">Payment proof uploaded</p>
            <a href={booking.paymentProof} target="_blank" rel="noopener noreferrer" className="text-xs text-green-700 underline">View proof</a>
          </div>
        </div>
      )}

      {/* Upload form */}
      {booking.status === 'WAITING_PAYMENT' && !isExpired && (
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-premium">
          <h2 className="mb-4 text-xs font-bold uppercase tracking-widest text-[var(--color-muted-fg)]">Transfer Details</h2>
          <div className="mb-5 rounded-xl bg-[var(--color-muted)] p-5 border border-[var(--color-border)]">
            <p className="text-xs font-semibold text-[var(--color-muted-fg)] uppercase">Bank Destination</p>
            <p className="mt-1 font-bold text-[var(--color-navy-950)]">BCA — PT Anta Jaya Mandiri</p>
            <div className="mt-3 flex justify-between items-end">
              <div>
                <p className="text-[10px] font-bold text-[var(--color-muted-fg)] uppercase">Account Number</p>
                <p className="text-lg font-black tracking-tighter text-[var(--color-foreground)]">6730381464</p>
              </div>
              <div className="text-right">
                <p className="text-[10px] font-bold text-[var(--color-muted-fg)] uppercase">Amount to Pay</p>
                <p className="text-xl font-black tracking-tight text-[var(--color-gold-600)]">{formatPrice(booking.totalPrice)}</p>
              </div>
            </div>
          </div>

          <label className={`block cursor-pointer rounded-2xl border-2 border-dashed p-8 text-center transition-all ${file ? 'border-[var(--color-gold-500)] bg-gold-400/5' : 'border-[var(--color-border)] hover:border-[var(--color-navy-700)] hover:bg-[var(--color-muted)]'}`}>
            {preview
              ? <div className="relative group">
                <img src={preview} alt="Preview" className="mx-auto max-h-48 rounded-xl object-contain shadow-md" />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity rounded-xl">
                  <p className="text-white text-xs font-bold">Change Image</p>
                </div>
              </div>
              : <div className="flex flex-col items-center gap-3">
                <div className="rounded-full bg-[var(--color-muted)] p-4">
                  <ImageIcon className="h-6 w-6 text-[var(--color-navy-700)]" />
                </div>
                <div>
                  <p className="text-sm font-bold text-[var(--color-foreground)]">Upload Payment Receipt</p>
                  <p className="text-xs text-[var(--color-muted-fg)] mt-1">JPG or PNG (max 1MB)</p>
                </div>
              </div>}
            <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleFileChange} />
          </label>

          {file && (
            <div className="mt-3 flex items-center gap-2 rounded-lg bg-[var(--color-muted)] px-3 py-2">
              <div className="h-2 w-2 rounded-full bg-green-500" />
              <p className="text-[10px] font-medium text-[var(--color-muted-fg)] truncate flex-1">{file.name}</p>
              <p className="text-[10px] font-bold text-[var(--color-muted-fg)]">{(file.size / 1024).toFixed(0)} KB</p>
            </div>
          )}

          <button onClick={handleUpload} disabled={!file || isUploading}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-4 text-sm font-bold text-white shadow-premium transition-all hover:scale-[1.02] active:scale-95 disabled:opacity-50 disabled:hover:scale-100">
            {isUploading ? <Loader2 className="h-5 w-5 animate-spin" /> : <><Upload className="h-4 w-4" /> Confirm Payment</>}
          </button>
        </div>
      )}

    </div>
  );
};

export default PaymentUpload;
