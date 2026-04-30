import { useBooking } from "@/hooks/useBooking";
import Footer from "@/components/Footer";
import BookingHeader from "@/components/booking/BookingHeader";
import TripSummaryCard from "@/components/booking/TripSummaryCard";
import AvailabilitySection from "@/components/booking/AvailabilitySection";
import GuestDetailsForm from "@/components/booking/GuestDetailsForm";
import BookingSidebar from "@/components/booking/BookingSidebar";
import SubmitBookingButton from "@/components/booking/SubmitBookingButton";

const BookingPage = () => {
  const {
    roomTypeId, checkIn, handleCheckInChange, checkOut, handleCheckOutChange,
    isLoading, isPriceLoading, roomType, property, priceResult,
    calendarData, isCalendarLoading, guest, setGuest, handleBooking
  } = useBooking();

  const nights = priceResult?.nights ?? 0;
  const today = new Date().toISOString().split('T')[0];

  const onGuestChange = (field: string, value: string) => {
    setGuest(prev => ({ ...prev, [field]: value }));
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleBooking();
  };

  return (
    <div className="flex min-h-screen flex-col bg-[#F4F7F9]">
      <BookingHeader />
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-8 space-y-6">
              <TripSummaryCard property={property} roomType={roomType} checkIn={checkIn} checkOut={checkOut} nights={nights} />
              <form onSubmit={onSubmit} className="space-y-6">
                <AvailabilitySection
                  isCalendarLoading={isCalendarLoading} calendarData={calendarData} roomTypeId={roomTypeId}
                  roomType={roomType} checkIn={checkIn} checkOut={checkOut} today={today}
                  priceResult={priceResult} onCheckInChange={handleCheckInChange} onCheckOutChange={handleCheckOutChange}
                />
                <GuestDetailsForm guest={guest} onGuestChange={onGuestChange} />
                <SubmitBookingButton isLoading={isLoading} isPriceLoading={isPriceLoading} priceResult={priceResult} />
              </form>
            </div>
            <div className="lg:col-span-4">
              <BookingSidebar isPriceLoading={isPriceLoading} priceResult={priceResult} nights={nights} />
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default BookingPage;
