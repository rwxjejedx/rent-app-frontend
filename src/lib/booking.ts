import api from './api';

export interface Booking {
  id: number;
  userId: number;
  roomTypeId: number;
  checkIn: string;
  checkOut: string;
  totalPrice: string;
  status: 'WAITING_PAYMENT' | 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  cancelledBy?: 'USER' | 'TENANT' | 'SYSTEM';
  paymentMethod: 'MANUAL_TRANSFER' | 'PAYMENT_GATEWAY';
  paymentProof?: string;
  paymentDeadline: string;
  roomType: {
    id: number;
    name: string;
    basePrice: string;
    property: {
      id: number;
      name: string;
      city: string;
      images?: { url: string }[];
    };
    images?: { url: string }[];
  };
  review?: any;
  createdAt: string;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: string;
  isRead: boolean;
  bookingId?: number;
  createdAt: string;
}

export const bookingApi = {
  create: async (data: {
    roomTypeId: number;
    checkIn: string;
    checkOut: string;
    guestName: string;
    guestNik: string;
    guestPhone: string;
    guestAddress: string;
  }) => {
    const res = await api.post('/bookings', data);
    return res.data as Booking;
  },

  getMyBookings: async (): Promise<Booking[]> => {
    const res = await api.get('/bookings/my');
    return res.data;
  },

  getTenantBookings: async (): Promise<Booking[]> => {
    const res = await api.get('/bookings/tenant');
    return res.data;
  },

  uploadPaymentProof: async (bookingId: number, file: File) => {
    const form = new FormData();
    form.append('paymentProof', file);
    const res = await api.post(`/bookings/${bookingId}/payment-proof`, form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data as Booking;
  },

  updateStatus: async (bookingId: number, status: 'CONFIRMED' | 'CANCELLED') => {
    const res = await api.patch(`/bookings/${bookingId}/status`, { status });
    return res.data as Booking;
  },

  cancel: async (bookingId: number) => {
    const res = await api.patch(`/bookings/${bookingId}/cancel`);
    return res.data as Booking;
  },
};

export const notificationApi = {
  getAll: async (): Promise<Notification[]> => {
    const res = await api.get('/notifications');
    return res.data;
  },

  getUnreadCount: async (): Promise<number> => {
    const res = await api.get('/notifications/unread-count');
    return res.data.count;
  },

  markAsRead: async (id: number) => {
    await api.patch(`/notifications/${id}/read`);
  },

  markAllAsRead: async () => {
    await api.patch('/notifications/read-all');
  },
};

export const roomApi = {
  createRoomType: async (propertyId: number, data: any) => {
    const res = await api.post(`/rooms/properties/${propertyId}/room-types`, data);
    return res.data;
  },

  updateRoomType: async (id: number, data: any) => {
    const res = await api.put(`/rooms/room-types/${id}`, data);
    return res.data;
  },

  deleteRoomType: async (id: number) => {
    await api.delete(`/rooms/room-types/${id}`);
  },

  createRoom: async (roomTypeId: number, number: string) => {
    const res = await api.post(`/rooms/room-types/${roomTypeId}/rooms`, { number });
    return res.data;
  },

  deleteRoom: async (id: number) => {
    await api.delete(`/rooms/rooms/${id}`);
  },

  createPeakRate: async (roomTypeId: number, data: any) => {
    const res = await api.post(`/rooms/room-types/${roomTypeId}/peak-rates`, data);
    return res.data;
  },

  getPeakRates: async (roomTypeId: number) => {
    const res = await api.get(`/rooms/room-types/${roomTypeId}/peak-rates`);
    return res.data;
  },

  deletePeakRate: async (id: number) => {
    await api.delete(`/rooms/peak-rates/${id}`);
  },

  setAvailability: async (roomTypeId: number, dates: { date: string; isAvailable: boolean }[]) => {
    const res = await api.post(`/availability/room-types/${roomTypeId}`, { dates });
    return res.data;
  },

  getAvailability: async (roomTypeId: number, year: number, month: number) => {
    const res = await api.get(`/availability/room-types/${roomTypeId}`, { params: { year, month } });
    return res.data;
  },
};

export const formatPrice = (price: string | number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(Number(price));

export const statusConfig = {
  WAITING_PAYMENT: { label: 'Waiting Payment', color: 'bg-amber-100 text-amber-800', dot: 'bg-amber-500' },
  PENDING: { label: 'Pending Review', color: 'bg-blue-100 text-blue-800', dot: 'bg-blue-500' },
  CONFIRMED: { label: 'Confirmed', color: 'bg-green-100 text-green-800', dot: 'bg-green-500' },
  CANCELLED: { label: 'Cancelled', color: 'bg-red-100 text-red-800', dot: 'bg-red-500' },
  COMPLETED: { label: 'Completed', color: 'bg-gray-100 text-gray-800', dot: 'bg-gray-500' },
};
