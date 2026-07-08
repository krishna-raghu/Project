import axios from 'axios';
import { supabase } from '../supabaseClient'; // Adjust path if your supabaseClient is directly under src

const api = axios.create({
  baseURL: 'http://localhost:8080/api/v1', // Points directly to your Spring Boot REST server
});

// Automatically injects the Supabase JWT token into every outgoing request
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();

    if (session) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;