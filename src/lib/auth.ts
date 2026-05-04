import api from './api';

export interface User {
  id: number;
  email: string;
  name: string;
  role: 'USER' | 'TENANT';
  avatar?: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

export const authApi = {
  register: async (email: string, name: string, role: 'USER' | 'TENANT') => {
    const res = await api.post('/auth/register', { email, name, role });
    return res.data;
  },

  verifyAndSetPassword: async (token: string, password: string) => {
    const res = await api.post('/auth/verify', { token, password });
    return res.data;
  },

  resendVerification: async (email: string) => {
    const res = await api.post('/auth/resend-verification', { email });
    return res.data;
  },

  login: async (email: string, password: string): Promise<AuthResponse> => {
    const res = await api.post('/auth/login', { email, password });
    return res.data;
  },

  getProfile: async (): Promise<User> => {
    const res = await api.get('/users/me');
    return res.data;
  },

  googleLogin: (role: 'user' | 'tenant') => {
    window.location.href = `${import.meta.env.VITE_API_URL ?? 'https://rent-app-backend-production-d854.up.railway.app/api/v1'}/auth/google?role=${role}`;
  },
};

export const saveAuth = (token: string, user: User) => {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
};

export const clearAuth = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

export const getSavedUser = (): User | null => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

export const getSavedToken = (): string | null => {
  return localStorage.getItem('token');
};
