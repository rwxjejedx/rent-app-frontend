import api from './api';

export interface PropertyImage {
  id: number;
  url: string;
}

export interface Category {
  id: number;
  name: string;
}

export interface RoomType {
  id: number;
  name: string;
  description: string;
  basePrice: number;
  effectivePrice: number;
  capacity: number;
  images: PropertyImage[];
  rooms: { id: number; number: string }[];
  availableRooms?: number;
  isAvailable?: boolean;
}

export interface Review {
  id: number;
  rating: number;
  comment: string;
  user: { id: number; name: string; avatar?: string };
  createdAt: string;
}

export interface Property {
  id: number;
  name: string;
  description: string;
  location: string;
  city: string;
  latitude?: number;
  longitude?: number;
  category?: Category;
  images: PropertyImage[];
  roomTypes: RoomType[];
  reviews: Review[];
  minPrice: number | null;
  avgRating: number | null;
  owner: { id: number; name: string; email?: string };
}

export interface PropertyListResponse {
  data: Property[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface CalendarDay {
  date: string;
  roomPrices: { roomTypeId: number; name: string; price: number }[];
  minPrice: number | null;
}

export const propertyApi = {
  getAll: async (params?: {
    city?: string;
    name?: string;
    categoryId?: number;
    checkIn?: string;
    checkOut?: string;
    sort?: string;
    page?: number;
    limit?: number;
  }): Promise<PropertyListResponse> => {
    const res = await api.get('/properties', { params });
    return res.data;
  },

  getById: async (id: number, params?: { checkIn?: string; checkOut?: string }): Promise<Property> => {
    const res = await api.get(`/properties/${id}`, { params });
    return res.data;
  },

  getCalendar: async (id: number, year: number, month: number): Promise<Record<string, CalendarDay>> => {
    const res = await api.get(`/properties/${id}/calendar`, { params: { year, month } });
    return res.data;
  },

  create: async (data: FormData) => {
    const res = await api.post('/properties', data);
    return res.data;
  },

  update: async (id: number, data: any) => {
    const res = await api.put(`/properties/${id}`, data);
    return res.data;
  },

  delete: async (id: number) => {
    const res = await api.delete(`/properties/${id}`);
    return res.data;
  },

  getMyProperties: async (): Promise<Property[]> => {
    const res = await api.get('/properties/tenant/my-listings');
    return res.data;
  },
};

export const categoryApi = {
  getAll: async (): Promise<Category[]> => {
    const res = await api.get('/categories');
    return res.data;
  },
};

export const formatPrice = (price: number) =>
  new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    maximumFractionDigits: 0,
  }).format(price);
