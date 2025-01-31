import axios from 'axios';
import {API_URL} from '@env';


// Configura la URL base de tu API
const api = axios.create({
  baseURL: API_URL, // 'https://api.example.com'
  headers: {
    'Content-Type': 'application/json',
  },
});


// api.interceptors.request.use(
//   (config) => {
//     // Puedes agregar lógica aquí, como agregar un token de autenticación
//     const token = 'tu-token-de-autenticacion';
//     if (token) {
//       config.headers.Authorization = `Bearer ${token}`;
//     }
//     return config;
//   },
//   (error) => {
//     return Promise.reject(error);
//   }
// );

// api.interceptors.response.use(
//   (response) => {
//     return response;
//   },
//   (error) => {
//     // Manejo de errores globales
//     if (error.response && error.response.status === 401) {
//       // Redirigir al usuario a la pantalla de inicio de sesión, por ejemplo
//     }
//     return Promise.reject(error);
//   }
// );

export default api;