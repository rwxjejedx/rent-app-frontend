import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { propertyApi } from "@/lib/property";
import { bookingApi } from "@/lib/booking";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import api from "@/lib/api";

export const useBooking = () => {
  const { roomTypeId } = useParams<{ roomTypeId: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const { isAuthenticated, isUser } = useAuth();
  const { toast } = useToast();
  const propertyId = new URLSearchParams(location.search).get('propertyId');

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPriceLoading, setIsPriceLoading] = useState(false);
  const [roomType, setRoomType] = useState<any>(null);
  const [property, setProperty] = useState<any>(null);
  const [priceResult, setPriceResult] = useState<any>(null);
  const [calendarData, setCalendarData] = useState<Record<string, any>>({});
  const [isCalendarLoading, setIsCalendarLoading] = useState(false);
  const [guest, setGuest] = useState({ guestName: "", guestNik: "", guestPhone: "", guestAddress: "" });

  const fetchCalendar = useCallback(async () => {
    if (!propertyId) return;
    setIsCalendarLoading(true);
    try {
      const res = await api.get(`/properties/${propertyId}/calendar`);
      setCalendarData(res.data);
    } catch (err) {
      // Calendar fetch error
    } finally {
      setIsCalendarLoading(false);
    }
  }, [propertyId]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const fetchInitialData = useCallback(async () => {
    if (!isAuthenticated || !isUser) { navigate('/login'); return; }
    const userRes = await api.get('/users/me');
    setGuest(prev => ({ ...prev, guestName: userRes.data.name ?? "", guestPhone: userRes.data.phone ?? "" }));
    
    if (propertyId && roomTypeId) {
      const p = await propertyApi.getById(parseInt(propertyId));
      setProperty(p);
      setRoomType(p.roomTypes.find((r: any) => r.id === parseInt(roomTypeId!)));
    }
  }, [isAuthenticated, isUser, propertyId, roomTypeId, navigate]);

  useEffect(() => { fetchInitialData(); }, [fetchInitialData]);

  const calculatePrice = useCallback(async () => {
    if (!checkIn || !checkOut || !roomTypeId) { setPriceResult(null); return; }
    const nights = Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24));
    if (nights <= 0) { setPriceResult(null); return; }
    
    setIsPriceLoading(true);
    try {
      const res = await api.get('/properties/calculate-price', {
        params: { roomTypeId, checkIn: new Date(checkIn).toISOString(), checkOut: new Date(checkOut).toISOString() }
      });
      setPriceResult(res.data);
    } catch (err) {
      handlePriceError(nights);
    } finally {
      setIsPriceLoading(false);
    }
  }, [checkIn, checkOut, roomTypeId, roomType]);

  const handlePriceError = (nights: number) => {
    if (roomType) {
      setPriceResult({
        nights, totalPrice: nights * Number(roomType.basePrice),
        basePrice: Number(roomType.basePrice), breakdown: [],
      });
    }
  };

  useEffect(() => { calculatePrice(); }, [calculatePrice]);

  const handleBooking = async () => {
    if (!checkIn || !checkOut || (priceResult?.nights ?? 0) <= 0) {
      toast({ title: "Error", description: "Select valid check-in and check-out dates", variant: "destructive" });
      return;
    }
    if (guest.guestNik.length !== 16) {
      toast({ title: "Error", description: "NIK must be 16 digits", variant: "destructive" });
      return;
    }
    
    setIsLoading(true);
    try {
      const booking = await bookingApi.create({
        roomTypeId: parseInt(roomTypeId!),
        checkIn: new Date(checkIn).toISOString(),
        checkOut: new Date(checkOut).toISOString(),
        ...guest,
      });
      toast({ title: "Booking confirmed!", description: "Upload payment proof within 1 hour", variant: "success" });
      navigate(`/bookings/${booking.id}/payment`);
    } catch (err: any) {
      toast({ title: "Booking Failed", description: err.response?.data?.message, variant: "destructive" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCheckInChange = (date: string) => {
    const isFull = calendarData[date]?.roomDetails?.find((r: any) => r.roomTypeId === Number(roomTypeId))?.availableRooms <= 0;
    if (isFull) {
      toast({ title: "Date Full", description: "This date is already fully booked.", variant: "destructive" });
      return;
    }
    setCheckIn(date);
    if (checkOut <= date) setCheckOut('');
  };

  const isRangeAvailable = (start: Date, end: Date) => {
    for (let d = new Date(start); d < end; d.setDate(d.getDate() + 1)) {
      const dStr = d.toISOString().split('T')[0];
      const details = calendarData[dStr]?.roomDetails?.find((r: any) => r.roomTypeId === Number(roomTypeId));
      if (details?.availableRooms <= 0) return false;
    }
    return true;
  };

  const handleCheckOutChange = (date: string) => {
    if (checkIn && date && !isRangeAvailable(new Date(checkIn), new Date(date))) {
      toast({ title: "Range Unavailable", description: "Some dates in your selected range are already full.", variant: "destructive" });
      return;
    }
    setCheckOut(date);
  };

  return {
    roomTypeId, checkIn, handleCheckInChange, checkOut, handleCheckOutChange, isLoading, isPriceLoading,
    roomType, property, priceResult, calendarData, isCalendarLoading, guest, setGuest,
    handleBooking, toast
  };
};
