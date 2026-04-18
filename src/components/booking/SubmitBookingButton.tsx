import { Loader2 } from "lucide-react";

interface SubmitBookingButtonProps {
  isLoading: boolean;
  isPriceLoading: boolean;
  priceResult: any;
}

const SubmitBookingButton = ({ isLoading, isPriceLoading, priceResult }: SubmitBookingButtonProps) => {
  return (
    <div className="rounded-2xl bg-blue-900 p-6 text-white shadow-xl shadow-blue-200/50">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h4 className="text-lg font-bold">Ready to secure your stay?</h4>
          <p className="text-sm text-blue-100/80 mt-1">Make sure all details are correct before proceeding to payment.</p>
        </div>
        <button 
          type="submit" 
          disabled={isLoading || isPriceLoading || !priceResult}
          className="shrink-0 rounded-xl bg-gold-gradient px-8 py-3.5 text-sm font-black uppercase tracking-widest text-navy-900 shadow-lg hover:scale-[1.02] transition-all active:scale-95 disabled:opacity-50 disabled:grayscale flex items-center gap-2"
        >
          {isLoading ? <Loader2 className="animate-spin" size={20} /> : "Proceed to Payment"}
        </button>
      </div>
    </div>
  );
};

export default SubmitBookingButton;
