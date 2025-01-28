import axios from 'axios';

// Configura la URL base de tu API
const api = axios.create({
  baseURL: 'https://tu-api.com/api', // Reemplaza con la URL de tu API
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