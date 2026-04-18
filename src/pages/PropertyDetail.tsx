import { Link } from "react-router-dom";
import { ArrowLeft, Loader2 } from "lucide-react";
import PhotoGallery from "@/components/PhotoGallery";
import Footer from "@/components/Footer";
import { usePropertyDetail } from "@/hooks/usePropertyDetail";
import PropertyDetailInfo from "@/components/property/PropertyDetailInfo";
import RoomTypeList from "@/components/property/RoomTypeList";
import PropertySidebar from "@/components/property/PropertySidebar";

const PropertyDetail = () => {
  const {
    property, isLoading, selectedRoomIdx, setSelectedRoomIdx,
    calendarPrices, handleBookNow, scrollTo
  } = usePropertyDetail();

  if (isLoading) return <LoadingState />;
  if (!property) return <NotFoundState />;

  const photos = property.images.map(img => img.url);
  const selectedRoom = property.roomTypes?.[selectedRoomIdx];

  return (
    <div className="flex min-h-screen flex-col bg-[#F8FAFC]">
      <main className="flex-1">
        <div className="mx-auto max-w-7xl px-4 py-8 md:px-8">
          <BackButton />
          {photos.length > 0 && <PhotoGallery photos={photos} name={property.name} />}
          <StickyTabs scrollTo={scrollTo} />
          <div className="grid gap-8 lg:grid-cols-3">
            <div className="space-y-10 lg:col-span-2">
              <PropertyDetailInfo property={property} />
              <RoomTypeList roomTypes={property.roomTypes} selectedRoomIdx={selectedRoomIdx} setSelectedRoomIdx={setSelectedRoomIdx} />
            </div>
            <PropertySidebar calendarPrices={calendarPrices} selectedRoom={selectedRoom} handleBookNow={handleBookNow} />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

const LoadingState = () => (
  <div className="flex min-h-screen items-center justify-center">
    <Loader2 className="h-8 w-8 animate-spin text-[var(--color-navy-700)]" />
  </div>
);

const NotFoundState = () => (
  <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
    <div className="text-5xl">🏚️</div>
    <p className="text-lg font-semibold">Property not found</p>
    <Link to="/" className="rounded-xl border border-[var(--color-navy-800)] px-5 py-2.5 text-sm font-semibold text-[var(--color-navy-800)] transition hover:bg-[var(--color-navy-800)] hover:text-white">
      ← Back to listings
    </Link>
  </div>
);

const BackButton = () => (
  <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 transition hover:text-navy-900">
    <ArrowLeft className="h-4 w-4" /> Back to listings
  </Link>
);

const StickyTabs = ({ scrollTo }: { scrollTo: (id: string) => void }) => (
  <div className="sticky top-16 z-30 -mx-4 bg-white border-b border-slate-200 px-4 mb-8 md:top-20">
    <div className="mx-auto max-w-7xl">
      <div className="flex gap-8 overflow-x-auto no-scrollbar py-1">
        {['info', 'rooms'].map(id => (
          <button key={id} onClick={() => scrollTo(id)}
            className="whitespace-nowrap pb-3 pt-4 text-sm font-bold text-slate-500 transition-all hover:text-navy-900 border-b-2 border-transparent hover:border-blue-500">
            {id === 'info' ? 'Info Umum' : 'Kamar'}
          </button>
        ))}
      </div>
    </div>
  </div>
);

export default PropertyDetail;
