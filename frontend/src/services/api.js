import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:8000/api',
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request
API.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 globally
API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const loginUser = (data) => API.post('/auth/login/json', data);
export const getProfile = () => API.get('/auth/profile');
export const updateProfile = (data) => API.put('/auth/profile', data);
export const changePassword = (data) => API.post('/auth/change-password', data);

// Movies
export const getMovies = () => API.get('/movies/');
export const getMovie = (id) => API.get(`/movies/${id}`);
export const searchMovies = (params) => API.get('/movies/search', { params });
export const createMovie = (data) => API.post('/movies/', data);
export const updateMovie = (id, data) => API.put(`/movies/${id}`, data);
export const deleteMovie = (id) => API.delete(`/movies/${id}`);
export const getAllMoviesAdmin = () => API.get('/movies/all');

// Theatres
export const getTheatres = () => API.get('/theatres/');
export const getTheatre = (id) => API.get(`/theatres/${id}`);
export const createTheatre = (data) => API.post('/theatres/', data);
export const updateTheatre = (id, data) => API.put(`/theatres/${id}`, data);
export const deleteTheatre = (id) => API.delete(`/theatres/${id}`);
export const getScreens = (theatreId) => API.get(`/theatres/${theatreId}/screens`);
export const createScreen = (data) => API.post('/theatres/screens', data);

// Shows
export const getShowsByMovie = (movieId) => API.get(`/shows/movie/${movieId}`);
export const getShowSeats = (showId) => API.get(`/shows/${showId}/seats`);
export const createShow = (data) => API.post('/shows/', data);
export const updateShow = (id, data) => API.put(`/shows/${id}`, data);
export const deleteShow = (id) => API.delete(`/shows/${id}`);
export const getAllShows = () => API.get('/shows/all');

// Bookings
export const createBooking = (data) => API.post('/bookings/', data);
export const getMyBookings = () => API.get('/bookings/me');
export const cancelBooking = (id) => API.post(`/bookings/${id}/cancel`);
export const getAllBookings = () => API.get('/bookings/all');
export const getRevenue = () => API.get('/bookings/revenue');

// Payments
export const processPayment = (data) => API.post('/payments/', data);
export const getPaymentHistory = () => API.get('/payments/history');

// Reviews
export const createReview = (data) => API.post('/reviews/', data);
export const getMovieReviews = (movieId) => API.get(`/reviews/movie/${movieId}`);

// Notifications
export const getNotifications = () => API.get('/notifications/');
export const markNotificationRead = (id) => API.post(`/notifications/${id}/read`);
export const markAllNotificationsRead = () => API.post('/notifications/read-all');

// Admin
export const getDashboard = () => API.get('/admin/dashboard');
export const getAllUsers = () => API.get('/admin/users');

export default API;
