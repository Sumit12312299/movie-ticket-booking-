import React, { useState, useEffect } from 'react';
import { Ticket, Heart, User, Calendar, Clock, MapPin, XCircle, QrCode, CheckCircle2, ShieldAlert } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TicketPass from '../components/TicketPass';

export default function UserDashboard() {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [bookings, setBookings] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('bookings');
  const [selectedTicket, setSelectedTicket] = useState(null);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bRes = await API.get('/bookings/my-bookings');
      setBookings(bRes.data || []);

      if (user.favorites && user.favorites.length > 0) {
        const mRes = await API.get('/movies', { params: { limit: 50 } });
        const favs = mRes.data.items.filter((m) => user.favorites.includes(m.id));
        setFavoriteMovies(favs);
      }
    } catch (err) {
      console.error(err);
      addToast('Failed to load user dashboard data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (bookingId) => {
    if (!window.confirm('Are you sure you want to cancel this booking? Seats will be released.')) return;
    try {
      await API.delete(`/bookings/${bookingId}/cancel`);
      addToast('Booking cancelled and seats released', 'info');
      fetchUserData();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to cancel booking', 'error');
    }
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-300">Please Sign In</h2>
        <p className="text-xs text-slate-500">Log in to view your profile and ticket booking history.</p>
      </div>
    );
  }

  const activeTickets = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div className="space-y-8 pb-16">
      {/* Profile Banner */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center sm:text-left">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center text-white font-extrabold text-2xl shadow-xl shadow-rose-600/30">
            {user.full_name.charAt(0).toUpperCase()}
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white">{user.full_name}</h1>
            <p className="text-xs text-slate-400 mt-0.5">{user.email}</p>
            <span className="inline-block mt-2 px-3 py-0.5 rounded-full text-[10px] uppercase font-extrabold bg-rose-600/20 text-rose-400 border border-rose-500/30">
              {user.role} Account
            </span>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-3 gap-3 w-full sm:w-auto">
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-xl font-black text-rose-500 font-mono">{bookings.length}</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">Total Bookings</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-xl font-black text-emerald-400 font-mono">{activeTickets.length}</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">Active Passes</span>
          </div>
          <div className="glass-card p-4 rounded-2xl border border-slate-800 text-center min-w-[90px]">
            <span className="text-xl font-black text-amber-400 font-mono">{user.favorites?.length || 0}</span>
            <span className="text-[10px] text-slate-400 block uppercase font-bold mt-1">Wishlist</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'bookings'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          My Tickets ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-5 py-2.5 rounded-2xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'favorites'
              ? 'bg-rose-600 text-white shadow-md shadow-rose-600/30'
              : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          Saved Wishlist ({user.favorites?.length || 0})
        </button>
      </div>

      {/* Tab Content */}
      {activeTab === 'bookings' ? (
        loading ? (
          <div className="space-y-4">
            {[1, 2].map((n) => (
              <div key={n} className="h-32 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800"></div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl space-y-3">
            <Ticket className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">No Booking History</h3>
            <p className="text-xs text-slate-500">You haven't booked any movie tickets yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => (
              <div
                key={b.id}
                className="glass-card rounded-3xl p-6 border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-6 hover:border-slate-700"
              >
                <div className="space-y-2 text-center sm:text-left flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-xs font-mono font-bold text-slate-400">{b.booking_reference}</span>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${
                        b.status === 'CONFIRMED'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                          : 'bg-rose-900/40 text-rose-400 border border-rose-800'
                      }`}
                    >
                      {b.status}
                    </span>
                  </div>

                  <h3 className="text-lg font-bold text-white">{b.movie_title}</h3>

                  <div className="flex flex-wrap gap-4 text-xs text-slate-400 justify-center sm:justify-start">
                    <span className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      {b.theater_name} ({b.screen_type})
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-rose-500" />
                      {b.show_date} at {b.show_time}
                    </span>
                  </div>

                  <div className="flex flex-wrap gap-1 pt-1 justify-center sm:justify-start">
                    {b.seats.map((seat) => (
                      <span key={seat} className="px-2 py-0.5 rounded bg-slate-900 text-rose-300 font-mono text-[11px] font-bold border border-slate-800">
                        Seat {seat}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Right Actions */}
                <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto">
                  <span className="text-xl font-black text-emerald-400 font-mono">
                    ${b.total_amount.toFixed(2)}
                  </span>

                  <div className="flex items-center gap-2">
                    {b.status === 'CONFIRMED' && (
                      <>
                        <button
                          onClick={() => setSelectedTicket(b)}
                          className="px-4 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-xs font-bold text-white flex items-center gap-1.5 border border-slate-800"
                        >
                          <QrCode className="w-3.5 h-3.5 text-rose-500" />
                          View E-Ticket Pass
                        </button>

                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-2 rounded-xl bg-rose-500/10 hover:bg-rose-500/20 text-xs font-bold text-rose-400 border border-rose-500/30"
                          title="Cancel ticket"
                        >
                          <XCircle className="w-4 h-4" />
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )
      ) : (
        /* Favorites Grid */
        favoriteMovies.length === 0 ? (
          <div className="text-center py-16 glass-card rounded-3xl space-y-3">
            <Heart className="w-12 h-12 text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-300">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">Click the heart icon on any movie poster to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMovies.map((m) => (
              <div key={m.id} className="glass-card rounded-2xl p-4 flex gap-4 border border-slate-800">
                <img src={m.poster_url} alt={m.title} className="w-20 h-28 object-cover rounded-xl" />
                <div className="space-y-2 flex-1">
                  <h4 className="text-sm font-bold text-white line-clamp-1">{m.title}</h4>
                  <p className="text-xs text-slate-400">{m.genre.join(', ')}</p>
                  <span className="text-xs font-bold text-amber-400 block">★ {m.rating.toFixed(1)}</span>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Ticket Pass Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-xl animate-slide-up">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute -top-12 right-0 p-2 text-slate-400 hover:text-white"
            >
              Close ✖
            </button>
            <TicketPass booking={selectedTicket} />
          </div>
        </div>
      )}
    </div>
  );
}
