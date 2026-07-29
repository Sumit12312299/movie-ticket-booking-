import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import MainLayout from './layouts/MainLayout';
import HomePage from './pages/HomePage';
import MovieDetailsPage from './pages/MovieDetailsPage';
import ShowtimeSelectionPage from './pages/ShowtimeSelectionPage';
import SeatSelectionPage from './pages/SeatSelectionPage';
import CheckoutPage from './pages/CheckoutPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import UserDashboard from './pages/UserDashboard';
import AdminDashboard from './pages/AdminDashboard';
import AuthPage from './pages/AuthPage';
import SystemDesignPage from './pages/SystemDesignPage';

export default function App() {
  return (
    <AuthProvider>
      <NotificationProvider>
        <Router>
          <MainLayout>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/movie/:id" element={<MovieDetailsPage />} />
              <Route path="/showtimes/:movieId" element={<ShowtimeSelectionPage />} />
              <Route path="/seats/:showtimeId" element={<SeatSelectionPage />} />
              <Route path="/checkout" element={<CheckoutPage />} />
              <Route path="/confirmation" element={<BookingConfirmationPage />} />
              <Route path="/dashboard" element={<UserDashboard />} />
              <Route path="/admin" element={<AdminDashboard />} />
              <Route path="/auth" element={<AuthPage />} />
              <Route path="/system-design" element={<SystemDesignPage />} />
            </Routes>
          </MainLayout>
        </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}
