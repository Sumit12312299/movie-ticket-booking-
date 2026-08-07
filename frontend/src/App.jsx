import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ProtectedRoute from './components/ProtectedRoute';

import Home            from './pages/Home';
import Login           from './pages/Login';
import Register        from './pages/Register';
import MovieDetails    from './pages/MovieDetails';
import TheatreSelection from './pages/TheatreSelection';
import SeatSelection   from './pages/SeatSelection';
import Checkout        from './pages/Checkout';
import BookingSuccess  from './pages/BookingSuccess';
import BookingHistory  from './pages/BookingHistory';
import UserProfile     from './pages/UserProfile';
import AdminDashboard  from './pages/AdminDashboard';

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-base)', color: 'var(--text-light)' }}>
          <Navbar />
          <main style={{ flex: 1, maxWidth: '1280px', width: '100%', margin: '0 auto', padding: '36px 36px', boxSizing: 'border-box' }}>
            <Routes>
              <Route path="/"                           element={<Home />} />
              <Route path="/login"                      element={<Login />} />
              <Route path="/register"                   element={<Register />} />
              <Route path="/movie/:id"                  element={<MovieDetails />} />
              <Route path="/movie/:movieId/select-show" element={<TheatreSelection />} />
              <Route path="/select-seats/:showId"       element={<SeatSelection />} />
              <Route path="/checkout"                   element={<ProtectedRoute><Checkout /></ProtectedRoute>} />
              <Route path="/booking-success"            element={<ProtectedRoute><BookingSuccess /></ProtectedRoute>} />
              <Route path="/my-bookings"                element={<ProtectedRoute><BookingHistory /></ProtectedRoute>} />
              <Route path="/profile"                    element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/admin"                      element={<ProtectedRoute adminOnly><AdminDashboard /></ProtectedRoute>} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}
