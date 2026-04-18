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

      <h1 className="mb-6 text-xl font-extrabold" style={{ fontFamily: "var(--font-display)" }}>Upload Payment Proof</h1>

      {/* Booking Info */}
      <div className="mb-4 rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
        <div className="flex items-start justify-between">
          <div>
            <p className="font-bold text-[var(--color-foreground)]">{booking.roomType.property.name}</p>
            <p className="text-xs text-[var(--color-muted-fg)]">{booking.roomType.name}</p>
            <p className="mt-1.5 text-xs text-[var(--color-muted-fg)]">
              {new Date(booking.checkIn).toLocaleDateString('id-ID')} — {new Date(booking.checkOut).toLocaleDateString('id-ID')}
            </p>
          </div>
          <span className={`rounded-full px-2.5 py-1 text-[11px] font-semibold ${status.color}`}>{status.label}</span>
        </div>
        <div className="mt-3 flex justify-between border-t border-[var(--color-border)] pt-3">
          <span className="text-xs text-[var(--color-muted-fg)]">Total</span>
          <span className="text-sm font-bold text-[var(--color-navy-800)]">{formatPrice(booking.totalPrice)}</span>
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
        <div className="rounded-2xl border border-[var(--color-border)] bg-white p-5 shadow-sm">
          <h2 className="mb-3 text-sm font-bold">Transfer Details</h2>
          <div className="mb-4 rounded-xl bg-[var(--color-muted)] p-4 text-sm">
            <p className="font-semibold">BCA — StayEase Indonesia</p>
            <p className="text-[var(--color-muted-fg)]">No. Rekening: <span className="font-bold text-[var(--color-foreground)]">1234567890</span></p>
            <p className="mt-1.5 text-base font-extrabold text-[var(--color-navy-800)]">{formatPrice(booking.totalPrice)}</p>
          </div>

          <label className={`block cursor-pointer rounded-xl border-2 border-dashed p-5 text-center transition ${file ? 'border-[var(--color-navy-700)] bg-blue-50' : 'border-[var(--color-border)] hover:border-[var(--color-navy-600)]'}`}>
            {preview
              ? <img src={preview} alt="Preview" className="mx-auto max-h-36 rounded-lg object-contain" />
              : <div className="flex flex-col items-center gap-2">
                  <ImageIcon className="h-8 w-8 text-[var(--color-muted-fg)]" />
                  <p className="text-sm font-medium">Click to upload proof</p>
                  <p className="text-xs text-[var(--color-muted-fg)]">JPG or PNG, max 1MB</p>
                </div>}
            <input type="file" className="hidden" accept="image/jpeg,image/png" onChange={handleFileChange} />
          </label>

          {file && <p className="mt-2 text-xs text-[var(--color-muted-fg)]">{file.name} ({(file.size / 1024).toFixed(0)} KB)</p>}

          <button onClick={handleUpload} disabled={!file || isUploading}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-navy-gradient py-3 text-sm font-bold text-white shadow-lg transition hover:opacity-90 disabled:opacity-50">
            {isUploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Upload className="h-4 w-4" /> Upload Payment Proof</>}
          </button>
        </div>
      )}
    </div>
  );
};

export default PaymentUpload;
