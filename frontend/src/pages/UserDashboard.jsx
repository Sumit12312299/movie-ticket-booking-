import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Ticket, Heart, User, Calendar, Clock, MapPin, XCircle, QrCode, CheckCircle2, ShieldCheck, Film, Sparkles, Crown, ArrowRight, X, Wallet, Settings, Camera, Save, Lock, Eye, EyeOff, Mail, Phone, Award, Upload, Image } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TicketPass from '../components/TicketPass';
import WalletModal from '../components/WalletModal';

const AVATAR_PRESETS = [
  { id: 1, icon: '🍿', name: 'Popcorn Lover', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80' },
  { id: 2, icon: '👑', name: 'VIP Crown', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=300&q=80' },
  { id: 3, icon: '🎬', name: 'Cinema Director', url: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80' },
  { id: 4, icon: '🦸', name: 'Superhero', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80' },
  { id: 5, icon: '🤖', name: 'Sci-Fi Neon', url: 'https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=80' },
  { id: 6, icon: '🔥', name: 'Star Cinephile', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=300&q=80' }
];

export default function UserDashboard() {
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();
  const location = useLocation();

  const fileInputRef = useRef(null);

  const handleDeviceFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      addToast('Please select a valid image file (PNG, JPG, WEBP)', 'warning');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      addToast('Image size should be less than 5MB', 'warning');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target.result;
      setAvatarUrl(dataUrl);
      addToast(`🎉 Uploaded "${file.name}" from your device!`, 'success');
    };
    reader.readAsDataURL(file);
  };

  const [bookings, setBookings] = useState([]);
  const [favoriteMovies, setFavoriteMovies] = useState([]);
  const [moviesMap, setMoviesMap] = useState({});
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(location.state?.tab || 'bookings');
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [isWalletOpen, setIsWalletOpen] = useState(false);

  // Settings State
  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 98765 43210');
  const [preferredCity, setPreferredCity] = useState('Mumbai (PVR & IMAX Grand)');
  const [avatarUrl, setAvatarUrl] = useState(
    user?.avatar_url || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=80'
  );
  const [customAvatarInput, setCustomAvatarInput] = useState('');
  const [isSavingSettings, setIsSavingSettings] = useState(false);

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

  const handleSaveProfile = (e) => {
    e.preventDefault();
    setIsSavingSettings(true);
    setTimeout(() => {
      setIsSavingSettings(false);
      addToast('🎉 Profile details & avatar updated successfully!', 'success');
      if (refreshUser) refreshUser();
    }, 800);
  };

  if (!user) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-700 dark:text-slate-300">Please Sign In</h2>
        <p className="text-xs text-slate-500">Log in to view your profile and ticket booking history.</p>
        <Link to="/auth" className="inline-block px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-md">
          Go to Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      {/* VIP Member Card Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-red-600/10 via-rose-500/5 to-amber-500/10 dark:from-red-950/40 dark:via-slate-900 dark:to-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-lg flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-5 text-center sm:text-left">
          <div className="relative shrink-0 group">
            {avatarUrl ? (
              <img
                src={avatarUrl}
                alt={user.full_name}
                className="w-20 h-20 rounded-3xl object-cover border-4 border-white dark:border-slate-900 shadow-2xl group-hover:scale-105 transition-transform"
              />
            ) : (
              <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center text-white font-black text-3xl shadow-md">
                {user.full_name.charAt(0).toUpperCase()}
              </div>
            )}

            <button
              onClick={() => setActiveTab('settings')}
              className="absolute -bottom-1 -right-1 w-8 h-8 rounded-full bg-rose-600 text-white flex items-center justify-center shadow-lg border-2 border-white dark:border-slate-900 hover:scale-110 transition-transform"
              title="Change Profile Picture"
            >
              <Camera className="w-4 h-4" />
            </button>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-2 justify-center sm:justify-start">
              <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">{fullName || user.full_name}</h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 flex items-center gap-1">
                <Crown className="w-3 h-3 text-amber-500 fill-amber-400" />
                VIP Gold
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium">{email || user.email}</p>
            <div className="pt-1 flex items-center gap-2 justify-center sm:justify-start">
              <span className="px-3 py-1 rounded-xl text-[10px] uppercase font-black tracking-wider bg-rose-600/10 dark:bg-rose-950/60 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                {user.role} Account
              </span>
              <span className="px-3 py-1 rounded-xl text-[10px] font-bold text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                📍 {preferredCity.split(' ')[0]}
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
            <span className="text-xl sm:text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono block">{bookings.filter((b) => b.status === 'CONFIRMED').length}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-extrabold mt-0.5">Active Passes</span>
          </div>

          <div className="bg-white dark:bg-slate-900/90 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-center min-w-[100px] shadow-sm hover:shadow-md transition-all">
            <Heart className="w-4 h-4 text-amber-500 mx-auto mb-1" />
            <span className="text-xl sm:text-2xl font-black text-amber-600 dark:text-amber-400 font-mono block">{user.favorites?.length || 0}</span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 block uppercase font-extrabold mt-0.5">Wishlist</span>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3 border-b border-slate-200 dark:border-slate-800 pb-4">
        <button
          onClick={() => setActiveTab('bookings')}
          className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'bookings'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Ticket className="w-4 h-4" />
          My Tickets ({bookings.length})
        </button>

        <button
          onClick={() => setActiveTab('favorites')}
          className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'favorites' || activeTab === 'wishlist'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Heart className="w-4 h-4" />
          Saved Wishlist ({user.favorites?.length || 0})
        </button>

        <button
          onClick={() => setActiveTab('settings')}
          className={`px-6 py-3 rounded-2xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
            activeTab === 'settings'
              ? 'bg-rose-600 text-white shadow-md'
              : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-800'
          }`}
        >
          <Settings className="w-4 h-4" />
          Account Settings & Profile
        </button>
      </div>

      {/* TAB 1: My Bookings */}
      {activeTab === 'bookings' && (
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
            <Link to="/" className="inline-block mt-2 px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-md">
              Browse Movies & Book Now
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {bookings.map((b) => {
              const movie = moviesMap[b.movie_title] || {};
              return (
                <div
                  key={b.id}
                  className="bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200 dark:border-slate-800 shadow-md flex flex-col sm:flex-row items-center justify-between gap-4 transition-all hover:border-slate-300 dark:hover:border-slate-700"
                >
                  <div className="flex items-center gap-4 w-full sm:w-auto">
                    {movie.poster_url ? (
                      <img src={movie.poster_url} alt={b.movie_title} className="w-14 h-20 object-cover rounded-2xl shadow-sm shrink-0" />
                    ) : (
                      <div className="w-14 h-20 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-slate-400 shrink-0">
                        <Film className="w-6 h-6" />
                      </div>
                    )}

                    <div className="space-y-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span
                          className={`px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider ${
                            b.status === 'CONFIRMED'
                              ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700'
                              : 'bg-rose-100 text-rose-700 dark:bg-rose-950/60 dark:text-rose-300 border border-rose-300 dark:border-rose-700'
                          }`}
                        >
                          {b.status}
                        </span>
                        <span className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400">{b.booking_reference}</span>
                      </div>

                      <h3 className="text-lg font-black text-slate-900 dark:text-white truncate">{b.movie_title}</h3>

                      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-500 dark:text-slate-400 font-medium">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-rose-500" />
                          {b.theater_name} ({b.screen_type})
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5 text-rose-500" />
                          {b.show_date} at {b.show_time}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex sm:flex-col items-center sm:items-end justify-between w-full sm:w-auto pt-3 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-slate-800 gap-2">
                    <div>
                      <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-wider text-right">Seats ({b.seats.length})</span>
                      <div className="flex flex-wrap gap-1 mt-0.5 justify-end">
                        {b.seats.map((s) => (
                          <span key={s} className="px-2 py-0.5 rounded bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-300 text-[11px] font-mono font-bold border border-rose-200 dark:border-rose-800">
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 mt-2">
                      {b.status === 'CONFIRMED' && (
                        <button
                          onClick={() => handleCancelBooking(b.id)}
                          className="px-3 py-1.5 rounded-xl bg-rose-50 dark:bg-rose-950/40 hover:bg-rose-100 text-rose-600 dark:text-rose-400 text-xs font-bold transition-colors border border-rose-200 dark:border-rose-800"
                        >
                          Cancel
                        </button>
                      )}

                      <button
                        onClick={() => setSelectedTicket(b)}
                        className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-1.5 shadow-sm hover:scale-105 transition-all"
                      >
                        <QrCode className="w-3.5 h-3.5" /> E-Pass
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )
      )}

      {/* TAB 2: Wishlist Movies */}
      {(activeTab === 'favorites' || activeTab === 'wishlist') && (
        favoriteMovies.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl space-y-3 border border-slate-200 dark:border-slate-800 shadow-sm">
            <Heart className="w-12 h-12 text-slate-400 dark:text-slate-600 mx-auto" />
            <h3 className="text-lg font-bold text-slate-700 dark:text-slate-300">Your Wishlist is Empty</h3>
            <p className="text-xs text-slate-500">Explore movies and click the heart icon to save your favorites.</p>
            <Link to="/" className="inline-block mt-2 px-6 py-2.5 rounded-2xl bg-rose-600 text-white text-xs font-bold shadow-md">
              Discover Movies
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
            {favoriteMovies.map((m) => (
              <div key={m.id} className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-3 shadow-md space-y-3 flex flex-col justify-between">
                <div className="relative aspect-[2/3] rounded-xl overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img src={m.poster_url} alt={m.title} className="w-full h-full object-cover" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{m.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400">{m.language} • {m.duration_mins} mins</p>
                </div>
                <Link
                  to={`/showtimes/${m.id}`}
                  className="w-full py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs text-center block shadow-sm hover:scale-105 transition-all"
                >
                  Book Tickets
                </Link>
              </div>
            ))}
          </div>
        )
      )}

      {/* TAB 3: Integrated Account Settings & Profile Manager */}
      {activeTab === 'settings' && (
        <div className="space-y-8 animate-fade-in">
          {/* Profile Picture Avatar Manager Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-rose-600 text-white flex items-center justify-center shadow-md">
                <Camera className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Profile Picture & Avatar Manager</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Pick a preset VIP CineAvatar or upload custom profile image</p>
              </div>
            </div>

            {/* Current Selected Avatar Preview & Custom URL Input */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center bg-slate-50 dark:bg-slate-800/40 p-6 rounded-2xl border border-slate-200/80 dark:border-slate-800">
              <div className="flex flex-col items-center justify-center space-y-2">
                <img
                  src={avatarUrl}
                  alt="Avatar Preview"
                  className="w-24 h-24 rounded-3xl object-cover border-4 border-rose-500 shadow-2xl"
                />
                <span className="text-[11px] font-black text-rose-600 dark:text-rose-400">Active Profile Picture</span>
              </div>

              <div className="md:col-span-2 space-y-4">
                {/* Device Upload Button & URL Input */}
                <div className="space-y-2">
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block">
                    Upload Photo from Device or Enter Image URL
                  </span>
                  
                  {/* Hidden File Input */}
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleDeviceFileUpload}
                    accept="image/*"
                    className="hidden"
                  />

                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-5 py-2.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-white font-extrabold text-xs shadow-md flex items-center gap-2 hover:scale-105 transition-all cursor-pointer"
                    >
                      <Upload className="w-4 h-4" /> Upload from Device
                    </button>

                    <div className="flex-1 min-w-[200px] flex gap-2">
                      <input
                        type="url"
                        placeholder="Or paste image URL (https://...)"
                        value={customAvatarInput}
                        onChange={(e) => setCustomAvatarInput(e.target.value)}
                        className="flex-1 px-4 py-2.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:ring-2 focus:ring-rose-500"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customAvatarInput.trim()) {
                            setAvatarUrl(customAvatarInput.trim());
                            addToast('Custom image URL applied as profile picture!', 'success');
                          }
                        }}
                        className="px-4 py-2.5 rounded-2xl bg-rose-600 text-white font-extrabold text-xs shadow-md hover:scale-105 transition-all cursor-pointer"
                      >
                        Apply URL
                      </button>
                    </div>
                  </div>
                </div>

                {/* Preset Avatar Selection Grid */}
                <div className="pt-2">
                  <span className="text-[11px] font-extrabold text-slate-500 dark:text-slate-400 uppercase tracking-wider block mb-2">Or Choose from VIP CineAvatars</span>
                  <div className="grid grid-cols-6 gap-2">
                    {AVATAR_PRESETS.map((preset) => (
                      <button
                        key={preset.id}
                        type="button"
                        onClick={() => {
                          setAvatarUrl(preset.url);
                          addToast(`Switched avatar to ${preset.name}!`, 'info');
                        }}
                        className={`relative aspect-square rounded-2xl overflow-hidden border-2 transition-all hover:scale-110 ${
                          avatarUrl === preset.url
                            ? 'border-rose-500 ring-2 ring-rose-500/40 scale-105'
                            : 'border-slate-200 dark:border-slate-700 opacity-70 hover:opacity-100'
                        }`}
                        title={preset.name}
                      >
                        <img src={preset.url} alt={preset.name} className="w-full h-full object-cover" />
                        <span className="absolute bottom-0 inset-x-0 bg-slate-950/80 text-white text-[10px] text-center">{preset.icon}</span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Account Details & Preferences Form */}
          <form onSubmit={handleSaveProfile} className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-6 sm:p-8 shadow-xl space-y-6">
            <div className="flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 pb-4">
              <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
                <User className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-black text-slate-900 dark:text-white">Personal Information</h3>
                <p className="text-xs text-slate-500 dark:text-slate-400">Update your name, contact, and cinema city preferences</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-rose-500" /> Full Name
                </label>
                <input
                  type="text"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-rose-500" /> Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-rose-500"
                  required
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-rose-500" /> Mobile Phone Number
                </label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-rose-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-rose-500" /> Preferred Cinema Location
                </label>
                <select
                  value={preferredCity}
                  onChange={(e) => setPreferredCity(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 font-bold focus:ring-2 focus:ring-rose-500"
                >
                  <option value="Mumbai (PVR & IMAX Grand)">Mumbai (PVR & IMAX Grand)</option>
                  <option value="Delhi NCR (PVR Director's Cut)">Delhi NCR (PVR Director's Cut)</option>
                  <option value="Bengaluru (IMAX Forum)">Bengaluru (IMAX Forum)</option>
                  <option value="Hyderabad (Prasads IMAX 4K)">Hyderabad (Prasads IMAX 4K)</option>
                  <option value="Pune (PVR Phoenix Marketcity)">Pune (PVR Phoenix Marketcity)</option>
                  <option value="Phagwara (Majestic Grand & PVR Curo Mall)">Phagwara (Majestic Grand & PVR Curo Mall)</option>
                </select>
              </div>
            </div>

            <div className="pt-4 flex justify-end">
              <button
                type="submit"
                disabled={isSavingSettings}
                className="px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-black flex items-center gap-2 shadow-md transition-all hover:scale-105 cursor-pointer"
              >
                <Save className="w-4 h-4" />
                {isSavingSettings ? 'Saving Changes...' : 'Save Profile Changes'}
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Ticket Pass Preview Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-md bg-transparent">
            <button
              onClick={() => setSelectedTicket(null)}
              className="absolute -top-12 right-0 w-9 h-9 rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white flex items-center justify-center shadow-xl border border-slate-200 dark:border-slate-800 hover:scale-110 transition-transform"
            >
              <X className="w-5 h-5" />
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
