import { useNavigate } from "react-router-dom";
import { Loader2, ArrowLeft } from "lucide-react";
import { useManageAvailability } from "@/hooks/useManageAvailability";
import PeakPricingForm from "@/components/dashboard/availability/PeakPricingForm";
import ManualBlockForm from "@/components/dashboard/availability/ManualBlockForm";
import { RoomTypeSelector, AvailabilityInfoCard } from "@/components/dashboard/availability/MiscComponents";

const ManageAvailability = () => {
  const navigate = useNavigate();
  const {
    property, isLoading, selectedRoomType, setSelectedRoomType, blockDate, setBlockDate,
    peakRate, setPeakRate, handleSetPeakRate, handleManualBlock, isPeakPending, isAvailPending
  } = useManageAvailability();

  if (isLoading) return <LoadingState />;

  return (
    <div className="max-w-5xl mx-auto p-6 md:p-10 animate-fade-in">
      <BackButton onClick={() => navigate(-1)} />
      <PageHeader />
      <div className="grid lg:grid-cols-12 gap-8">
        <div className="lg:col-span-5 space-y-8">
          <RoomTypeSelector selectedRoomType={selectedRoomType} setSelectedRoomType={setSelectedRoomType} roomTypes={property?.roomTypes} />
          <PeakPricingForm peakRate={peakRate} setPeakRate={setPeakRate} onSubmit={handleSetPeakRate} isPending={isPeakPending} selectedRoomType={selectedRoomType} />
        </div>
        <div className="lg:col-span-7 space-y-6">
          <ManualBlockForm blockDate={blockDate} setBlockDate={setBlockDate} onBlock={handleManualBlock} isPending={isAvailPending} selectedRoomType={selectedRoomType} />
          <AvailabilityInfoCard />
        </div>
      </div>
    </div>
  );
};

const LoadingState = () => (
  <div className="flex h-screen items-center justify-center">
    <Loader2 className="animate-spin text-navy-600" size={40} />
  </div>
);

const BackButton = ({ onClick }: { onClick: () => void }) => (
  <button onClick={onClick} className="flex items-center gap-2 text-slate-400 hover:text-navy-900 mb-8 font-bold text-xs uppercase tracking-widest transition-colors">
    <ArrowLeft size={16} /> Kembali ke Properti
  </button>
);

const PageHeader = () => (
  <div className="mb-10">
    <h1 className="text-3xl font-black text-navy-900 tracking-tight">Manage Availability & Pricing</h1>
    <p className="text-slate-500 font-medium">Atur kalender harga dan blokir kamar secara manual.</p>
  </div>
);

export default ManageAvailability;