import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BookingHeader = () => {
  const navigate = useNavigate();
  return (
    <div className="bg-white border-b border-slate-200 py-4 shadow-sm">
      <div className="mx-auto max-w-6xl px-4 flex items-center justify-between">
        <button 
          onClick={() => navigate(-1)} 
          className="flex items-center gap-2 text-sm font-bold text-navy-700 hover:text-navy-900 transition-colors"
        >
          <ArrowLeft size={18} /> Review Your Trip
        </button>
        <div className="flex items-center gap-4 text-[10px] font-bold uppercase tracking-widest text-slate-400">
          <span className="text-navy-700 border-b-2 border-navy-700 pb-1">1. Fill Details</span>
          <span>2. Payment</span>
          <span>3. Confirmation</span>
        </div>
      </div>
    </div>
  );
};

export default BookingHeader;
