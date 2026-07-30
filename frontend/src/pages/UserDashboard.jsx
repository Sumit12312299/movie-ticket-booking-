import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Heart, User, Calendar, Clock, MapPin, XCircle, QrCode, CheckCircle2, ShieldCheck, Film, Sparkles, Crown, ArrowRight, X, Wallet } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TicketPass from '../components/TicketPass';
import WalletModal from '../components/WalletModal';

export default function UserDashboard() {
  const { user } = useAuth();
  const { addToast } = useNotification();
  const location = useLocation();

  const [bookings, setBookings] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [moviesMap, setMoviesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'bookings');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  useEffect(() => {
    fetchUserData();
  }, [user]);

  const fetchUserData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const bRes = await API.get('/bookings/my-bookings');
      setBookings(bRes.data || []);

      const mRes = await API.get('/movies', { params: { limit: 50 } });
      const moviesList = mRes.data.items || [];
      const mDict = {};
      moviesList.forEach((m) => {
        mDict[m.id] = m;
        mDict[m.title] = m;
      });
      setMoviesMap(mDict);

      if (user.favorites && user.favorites.length > 0) {
        const favs = moviesList.filter((m) => user.favorites.includes(m.id));
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
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Please Sign In</h2>
        <p className="text-xs text-slate-500">Log in to view your profile and ticket booking history.</p>
        <Link to="/auth" className="inline-block px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-lg shadow-rose-600/30">
          Go to Sign In
        </Link>
      </div>
    );
  }

  const activeTickets = bookings.filter((b) => b.status === 'CONFIRMED');

  return (
    <div className="space-y-8 pb-16">
      {/* VIP Member Card Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600/10 via-rose-500/5 to-amber-500/10 dark:from-red-950/40 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="relative shrink-0">
            <div className="w-18 h-18 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-3xl shadow-xl shadow-rose-600/30">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="absolute -bottom-1 -right-1 w-7 h-7 rounded-full bg-amber-500 text-slate-950 flex items-center justify-center shadow-md border-2 border-white dark:border-slate-900">
              <Crown className="w-4 h-4 fill-slate-950" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{user.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500" />
                VIP Member
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{user.email}</p>
            <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-xl text-[10px] uppercase font-black tracking-wider bg-rose-600/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                {user.role} Account
              </span>
            </div>
          </div>
        </div>

        {/* Dashboard Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full md:w-auto">
          <button
            type="button"
            onClick={() => setIsWalletOpen(true)}
            className="bg-gradient-to-br from-amber-500/10 to-rose-500/10 dark:from-amber-950/40 dark:to-slate-900 p-4 rounded-2xl border border-amber-500/40 text-center min-w-[105px] shadow-sm hover:shadow-md hover:scale-105 transition-all text-left group"
          >
            <Wallet className="w-4 h-4 text-amber-500 mx-auto mb-1 group-hover:rotate-12 transition-transform" />
            <span className="text-lg sm:text-xl font-black text-amber-600 dark:text-amber-400 font-mono block text-center truncate">
              ₹{(user.wallet_balance ?? 1500.0).toLocaleString('en-IN', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
            </span>
            <span className="text-[10px] text-amber-700 dark:text-amber-300 block uppercase font-extrabold text-center mt-0.5">
              + Top Up
            </span>
          </button>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all">
            <Ticket className="w-4 h-4 text-rose-500 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-black text-rose-600 dark:text-rose-500 font-mono block">{bookings.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-extrabold mt-0.5">Bookings</span>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all">
            <QrCode className="w-4 h-4 text-emerald-500 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">{activeTickets.length}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-extrabold mt-0.5">Active Passes</span>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all">
            <Heart className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">{user.favorites?.length || 0}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-extrabold mt-0.5">Wishlist</span>
          </div>
        </div>
      </div>


      {/* Tabs */}
      <div className="flex items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'bookings'
              ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-rose-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          My Tickets ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all ${
            activeTab === 'favorites'
              ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg shadow-rose-600/30'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
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
              <div key={n} className="h-32 rounded-3xl bg-slate-200 dark:bg-slate-900/60 animate-pulse border border-slate-200 dark:border-slate-800"></div>
            ))}
          </div>
        ) : bookings.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Ticket className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">No Booking History</h3>
            <p className="text-xs text-slate-500">You haven't booked any movie tickets yet.</p>
            <Link to="/" className="inline-block mt-2 px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-md shadow-rose-600/30">
              Browse Movies & Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const movieDetail = moviesMap[b.movie_id] || moviesMap[b.movie_title];
              const posterUrl = movieDetail?.poster_url || 'https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=400';

              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-5 shadow-sm hover:shadow-xl dark:hover:border-rose-500/40 transition-all duration-300 group"
                >
                  <div className="flex items-center gap-4 text-center sm:text-left flex-1 w-full sm:w-auto">
                    {/* Movie Poster Thumbnail */}
                    <img
                      src={posterUrl}
                      alt={b.movie_title}
                      className="w-16 h-24 object-cover rounded-2xl shrink-0 shadow-md group-hover:scale-105 transition-transform"
                    />

                    <div className="space-y-1.5 flex-1">
                      <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                        <span className="text-[10px] font-mono font-bold text-slate-500 dark:text-slate-400">{b.booking_reference}</span>
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-rose-100 dark:bg-rose-950/60 text-rose-700 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                          }`}
                        >
                          {b.status}
                        </span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 dark:text-white leading-snug">{b.movie_title}</h3>

                      <div className="flex flex-wrap gap-3 text-xs text-slate-600 dark:text-slate-400 justify-center sm:justify-start">
                        <span className="flex items-center gap-1 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {b.theater_name} ({b.screen_type})
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          {b.show_date} at {b.show_time}
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-1.5 pt-1 justify-center sm:justify-start">
                        {b.seats.map((seat) => (
                          <span key={seat} className="px-2.5 py-0.5 rounded-lg bg-red-600/10 dark:bg-red-950/50 text-red-600 dark:text-rose-400 font-mono text-[11px] font-black border border-red-200 dark:border-red-800 shadow-sm">
                            Seat {seat}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Right Actions */}
                  <div className="flex flex-col items-center sm:items-end gap-3 w-full sm:w-auto pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800">
                    <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                      ₹{b.total_amount.toFixed(2)}
                    </span>

                    <div className="flex items-center gap-2">
                      {b.status === 'CONFIRMED' && (
                        <>
                          <button
                            onClick={() => setSelectedTicket(b)}
                            className="px-4 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-xs font-black text-white flex items-center gap-1.5 shadow-md shadow-rose-600/25 transition-all hover:scale-105"
                          >
                            <QrCode className="w-4 h-4 text-white" />
                            View E-Ticket Pass
                          </button>

                          <button
                            onClick={() => handleCancelBooking(b.id)}
                            className="p-2.5 rounded-2xl bg-rose-500/10 hover:bg-rose-500/20 text-rose-600 dark:text-rose-400 border border-rose-500/30 transition-all hover:scale-105"
                            title="Cancel booking & release seats"
                          >
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      ) : (
        /* Favorites Wishlist Grid */
        favoriteMovies.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Heart className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">Click the heart icon on any movie poster to save it here.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {favoriteMovies.map((m) => (
              <div key={m.id} className="bg-white dark:bg-slate-900 rounded-3xl p-4 flex gap-4 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-xl transition-all group">
                <img src={m.poster_url} alt={m.title} className="w-20 h-28 object-cover rounded-2xl shrink-0 group-hover:scale-105 transition-transform" />
                <div className="space-y-2 flex-1 flex flex-col justify-between">
                  <div>
                    <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1 group-hover:text-rose-600 transition-colors">{m.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">{Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}</p>
                    <span className="text-xs font-black text-amber-500 block mt-1">★ {m.rating ? Number(m.rating).toFixed(1) : '5.0'}</span>
                  </div>

                  <Link
                    to={`/showtimes/${m.id}`}
                    className="py-2 px-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 text-white text-xs font-bold text-center flex items-center justify-center gap-1 shadow-md shadow-rose-600/20 hover:scale-105 transition-all"
                  >
                    <Ticket className="w-3.5 h-3.5" />
                    Book Ticket
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )
      )}

      {/* Ticket Pass Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-slide-up">
          <div className="relative max-w-md w-full">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute -top-12 right-0 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center gap-1.5 backdrop-blur-md transition-all"
            >
              <X className="w-4 h-4" />
              Close Preview
            </button>
            <TicketPass booking={selectedTicket} />
          </div>
        </div>
      )}

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </div>
  );
}


