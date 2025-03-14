import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuthStore } from "@/stores/authStore"; 


export const api = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_URL, // 'https://api.example.com'
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add JWT token to requests
api.interceptors.request.use(
  async (config) => {
    const { jwt } = useAuthStore.getState();

    if (jwt) {
      config.headers.Authorization = `Bearer ${jwt}`; 
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor to handle JWT token refresh
api.interceptors.response.use(
  (response) => {
    const newToken = response.data?.token;
    if (newToken) {
      const { setJwt } = useAuthStore.getState();
      setJwt(newToken); 
      AsyncStorage.setItem("jwt", newToken); 
    }

    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      const { signOut } = useAuthStore.getState();
      signOut(); 

    }
    return Promise.reject(error);
  }
);

export default api;
