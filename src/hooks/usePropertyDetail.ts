import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { propertyApi, type Property } from "@/lib/property";
import { type DatePrice } from "@/lib/data";
import { useAuth } from "@/hooks/useAuth";

export const usePropertyDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { isAuthenticated, isUser } = useAuth();

  const [property, setProperty] = useState<Property | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedRoomIdx, setSelectedRoomIdx] = useState(0);
  const [calendarPrices, setCalendarPrices] = useState<DatePrice[]>([]);
  const [calMonth] = useState(new Date().getMonth() + 1);
  const [calYear] = useState(new Date().getFullYear());

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    try {
      const p = await propertyApi.getById(parseInt(id));
      setProperty(p);
    } catch {
      setProperty(null);
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  useEffect(() => { fetchProperty(); }, [fetchProperty]);

  const fetchCalendar = useCallback(async () => {
    if (!id) return;
    try {
      const calendar = await propertyApi.getCalendar(parseInt(id), calYear, calMonth);
      const roomType = property?.roomTypes?.[selectedRoomIdx];
      const prices: DatePrice[] = Object.values(calendar).map((day: any) => 
        formatDayPrice(day, roomType)
      );
      setCalendarPrices(prices);
    } catch {
      // Calendar fetch failed
    }
  }, [id, calYear, calMonth, selectedRoomIdx, property]);

  useEffect(() => { fetchCalendar(); }, [fetchCalendar]);

  const handleBookNow = () => {
    if (!isAuthenticated) return navigate('/login');
    if (!isUser) return alert('Only users can make bookings. Please login as a user.');
    navigate(`/booking/${property?.roomTypes?.[selectedRoomIdx]?.id}?propertyId=${id}`);
  };

  const scrollTo = (elementId: string) => {
    const el = document.getElementById(elementId);
    if (el) {
      const offset = 80;
      const bodyRect = document.body.getBoundingClientRect().top;
      const elementRect = el.getBoundingClientRect().top;
      window.scrollTo({ top: elementRect - bodyRect - offset, behavior: 'smooth' });
    }
  };

  return {
    property, isLoading, selectedRoomIdx, setSelectedRoomIdx,
    calendarPrices, handleBookNow, scrollTo
  };
};

const formatDayPrice = (day: any, roomType: any) => {
  const room = roomType?.id ? day.roomDetails?.find((r: any) => r.roomTypeId === roomType.id) : null;
  const price = room?.price ?? day.minPrice ?? 0;
  const available = room ? room.availableRooms > 0 : !day.isFullyBooked;
  const isPeak = roomType && room ? room.price > Number(roomType.basePrice) : false;
  return { date: day.date, price, available, isPeak };
};
