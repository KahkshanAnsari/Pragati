import axios from 'axios';
import { supabase } from './supabase';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
});

api.interceptors.request.use(async (config) => {
  const { data: { session } } = await supabase.auth.getSession();
  if (session?.access_token) {
    config.headers.Authorization = `Bearer ${session.access_token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => {
    // Backend returns raw arrays/objects. Normalize so both
    // `response.data` AND `response.data.data` work.
    const d = response.data;
    if (d !== null && d !== undefined && typeof d === 'object' && !('data' in d)) {
      try {
        Object.defineProperty(d, 'data', {
          get() { return this; },
          enumerable: false,
          configurable: true,
        });
      } catch {
        // non-fatal
      }
    }
    return response;
  },
  (error) => {
    return Promise.reject(error);
  }
);
