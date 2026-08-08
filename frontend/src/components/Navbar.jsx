import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { 
  Film, Search, Heart, User, LogOut, ShieldAlert, Ticket, 
  Sun, Moon, Star, X, Wallet, Crown, Utensils, Settings, 
  HelpCircle, Gift, MapPin, ChevronDown, Check, Bell
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import API from '../services/api';
import WalletModal from './WalletModal';
import FoodSnacksModal from './FoodSnacksModal';
import VouchersModal from './VouchersModal';
import AccountSettingsModal from './AccountSettingsModal';
import SupportModal from './SupportModal';

export default function Navbar({ onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
  const { addToast } = useNotification();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [isSnacksOpen, setIsSnacksOpen] = useState(false);
  const [isVouchersOpen, setIsVouchersOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSupportOpen, setIsSupportOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  const [isScrolled, setIsScrolled] = useState(false);

  const [showLocationMenu, setShowLocationMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notifications, setNotifications] = useState([
    { id: 1, text: "🎟️ Ticket Booking Confirmed: Spider-Man Across the Spider-Verse", time: "2 mins ago" },
    { id: 2, text: "🎁 Flat 10% promo code active: CINEMA10", time: "1 hour ago" },
    { id: 3, text: "📍 Location auto-detected and set to Mumbai", time: "3 hours ago" }
  ]);
  const notificationMenuRef = useRef(null);
  const [selectedCity, setSelectedCity] = useState(() => {
    return localStorage.getItem('bookticket_city') || 'Mumbai';
  });

  const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Phagwara'];

  const handleCityChange = (city) => {
    setSelectedCity(city);
    localStorage.setItem('bookticket_city', city);
    setShowLocationMenu(false);
    addToast(`📍 Location updated to ${city}`, 'success');
  };

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('bookticket_theme') === 'dark';
  });

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);
  const profileMenuRef = useRef(null);
  const locationMenuRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('bookticket_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('bookticket_theme', 'light');
    }
  }, [isDarkMode]);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  useEffect(() => {
    if (!searchInput.trim()) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    const timer = setTimeout(async () => {
      setIsSearching(true);
      try {
        const res = await API.get('/movies/', {
          params: { search: searchInput }
        });
        setSearchResults(res.data.items || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      if (profileMenuRef.current && !profileMenuRef.current.contains(e.target)) {
        setShowProfileMenu(false);
      }
      if (locationMenuRef.current && !locationMenuRef.current.contains(e.target)) {
        setShowLocationMenu(false);
      }
      if (notificationMenuRef.current && !notificationMenuRef.current.contains(e.target)) {
        setShowNotifications(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelectMovie = (movieId) => {
    setShowDropdown(false);
    setSearchInput('');
    navigate(`/movie/${movieId}`);
  };

  const wishlistCount = user?.favorites?.length || 0;

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-500 border-b ${
        isScrolled
          ? 'bg-white/85 dark:bg-slate-900/85 backdrop-blur-xl border-slate-200/80 dark:border-slate-800/90 shadow-xl shadow-slate-950/5'
          : 'bg-white/95 dark:bg-slate-900/95 border-transparent'
      }`}>
        <div className={`w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 transition-all duration-500 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Logo and Location Section */}
          <div className="flex items-center gap-4 sm:gap-6 shrink-0">
            {/* Brand Logo with movie tape elements */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="w-10 h-10 rounded-xl overflow-hidden shadow-lg shadow-rose-600/20 group-hover:scale-105 transition-transform duration-350 shrink-0">
                <img src="/logo.png" alt="BookTicket Logo" className="w-full h-full object-cover" />
              </div>
              <div className="hidden sm:block text-left">
                <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white group-hover:text-rose-500 transition-colors">
                  BOOK<span className="text-rose-600 dark:text-rose-500">TICKET</span>
                </span>
                <span className="text-[9px] block font-bold text-slate-400 dark:text-slate-555 tracking-wider uppercase -mt-1">
                  Cinema Booking Elite
                </span>
              </div>
            </Link>

            {/* Premium Location Selector Dropdown */}
            <div className="relative shrink-0" ref={locationMenuRef}>
              <button
                onClick={() => setShowLocationMenu(!showLocationMenu)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all border border-slate-200 dark:border-slate-700 text-xs font-black cursor-pointer shadow-xs hover:scale-102 active:scale-97"
              >
                <MapPin className="w-3.5 h-3.5 text-rose-500 fill-rose-500/10" />
                <span>{selectedCity}</span>
                <ChevronDown className="w-3 h-3 text-slate-400" />
              </button>

              {showLocationMenu && (
                <div className="absolute left-0 mt-3 w-48 bg-white dark:bg-slate-900 rounded-3xl p-1.5 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up space-y-0.5">
                  {CITIES.map((city) => (
                    <button
                      key={city}
                      onClick={() => handleCityChange(city)}
                      className={`w-full text-left px-3.5 py-2.5 rounded-2xl text-xs font-bold transition-colors cursor-pointer flex items-center justify-between ${
                        selectedCity === city
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-450 font-black'
                          : 'text-slate-700 dark:text-slate-350 hover:bg-slate-105 dark:hover:bg-slate-800'
                      }`}
                    >
                      <span>{city}</span>
                      {selectedCity === city && <Check className="w-3.5 h-3.5 text-rose-500" />}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Search Bar Container */}
          <div ref={searchRef} className="relative flex-1 max-w-sm hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 dark:text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search movies, genre, actors..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => searchInput.trim() && setShowDropdown(true)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100/80 dark:bg-slate-800/80 border border-slate-200/50 dark:border-slate-700/60 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-655 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-3 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-slide-up max-h-96 overflow-y-auto p-1.5 space-y-1">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-450 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    Searching movies...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="space-y-0.5 text-left">
                    {searchResults.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMovie(m.id)}
                        className="p-2 hover:bg-slate-100/60 dark:hover:bg-slate-800/60 rounded-2xl flex items-center gap-3 cursor-pointer transition-all group"
                      >
                        <img
                          src={m.poster_url}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-xl shadow-md group-hover:scale-103 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate group-hover:text-rose-500 transition-colors">
                            {m.title}
                          </h4>
                          <p className="text-[10px] text-slate-450 dark:text-slate-400 font-bold">
                            {m.language} • {m.duration_mins} mins
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-black text-amber-600 dark:text-amber-400">
                              {m.rating?.toFixed(1) || '5.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400 font-bold">
                    No movies found matching "{searchInput}"
                  </div>
                )}
              </div>
            )}
          </div>
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700/80 transition-all border border-slate-200 dark:border-slate-700 shadow-xs hover:scale-105 active:scale-95 cursor-pointer"
              title={isDarkMode ? 'Light Mode' : 'Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            {/* Movies link (flat style) */}
            <Link
              to="/"
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all shadow-xs ${
                location.pathname === '/'
                  ? 'bg-rose-500 text-white shadow-md'
                  : 'text-slate-755 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 border border-transparent'
              }`}
            >
              Movies
            </Link>

            {/* Events link (toast trigger) */}
            <button
              onClick={() => addToast('🎉 Live Plays, Concerts & Comedy Events are coming soon to your city!', 'info')}
              className="px-4 py-2.5 rounded-2xl text-xs font-black text-slate-755 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent cursor-pointer"
            >
              Events
            </button>

            {/* Offers link */}
            <button
              onClick={() => setIsVouchersOpen(true)}
              className="px-4 py-2.5 rounded-2xl text-xs font-black text-slate-755 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-transparent cursor-pointer"
            >
              Offers
            </button>

            {/* Wishlist Link */}
            {user && (
              <Link
                to="/dashboard"
                state={{ tab: 'wishlist' }}
                className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95 shadow-xs ${
                  location.pathname === '/dashboard' && location.state?.tab === 'wishlist'
                    ? 'bg-rose-500/10 border-rose-500 text-rose-500'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-350 border-slate-200 dark:border-slate-755 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-500/5'
                }`}
                title="Saved Wishlist"
              >
                <Heart className={`w-4 h-4 ${wishlistCount > 0 ? 'fill-rose-500 text-rose-500' : ''}`} />
                {wishlistCount > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-600 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-md">
                    {wishlistCount}
                  </span>
                )}
              </Link>
            )}

            {/* Notifications Center */}
            <div className="relative animate-fade-in" ref={notificationMenuRef}>
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative w-10 h-10 rounded-2xl flex items-center justify-center border transition-all hover:scale-105 active:scale-95 shadow-xs bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 border-slate-200 dark:border-slate-700 hover:text-rose-500 dark:hover:text-rose-500 hover:bg-rose-500/5 cursor-pointer`}
                title="Recent Notifications"
              >
                <Bell className="w-4 h-4" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1.5 -right-1.5 bg-rose-500 text-white text-[9px] font-black w-4.5 h-4.5 rounded-full flex items-center justify-center border border-white dark:border-slate-900 shadow-md">
                    {notifications.length}
                  </span>
                )}
              </button>

              {showNotifications && (
                <div className="absolute right-0 mt-3 w-80 bg-white dark:bg-slate-900 rounded-3xl p-3 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up space-y-2 text-left">
                  <div className="px-3 py-2 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
                    <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider">Notifications</h4>
                    {notifications.length > 0 && (
                      <button 
                        onClick={() => setNotifications([])} 
                        className="text-[10px] text-rose-500 font-black hover:underline"
                      >
                        Clear All
                      </button>
                    )}
                  </div>
                  <div className="max-h-64 overflow-y-auto space-y-1.5 p-0.5">
                    {notifications.length > 0 ? (
                      notifications.map((n) => (
                        <div key={n.id} className="p-3 rounded-2xl bg-slate-50 dark:bg-slate-805/40 border border-slate-100 dark:border-slate-800/80 space-y-1 text-xs">
                          <p className="font-bold text-slate-800 dark:text-slate-200 leading-normal">{n.text}</p>
                          <span className="text-[9px] text-slate-400 font-bold block">{n.time}</span>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-450 dark:text-slate-400 font-bold">
                        No new notifications
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Profile Dropdown Menu */}
            {user ? (
              <div className="relative animate-fade-in" ref={profileMenuRef}>
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-0.5 rounded-full bg-rose-500 hover:scale-105 transition-transform shadow-md cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-950 font-black text-white flex items-center justify-center text-sm border-2 border-white dark:border-slate-900">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-3xl p-2.5 shadow-2xl border border-slate-200 dark:border-slate-800/80 z-50 animate-slide-up space-y-1">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl mb-1 text-left">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.full_name}</p>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 fill-amber-400" /> VIP Gold
                        </span>
                      </div>
                      <p className="text-xs text-slate-450 dark:text-slate-400 font-semibold truncate">{user.email}</p>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsWalletOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <span>BookTicket Wallet</span>
                      </div>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-black">
                        ₹{(user.wallet_balance ?? 1500.00).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard', { state: { tab: 'bookings' } });
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-805 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <span>My Bookings & Passes</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard', { state: { tab: 'wishlist' } });
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                          <Heart className="w-4 h-4" />
                        </div>
                        <span>Saved Wishlist</span>
                      </div>
                      {wishlistCount > 0 && (
                        <span className="text-[10px] font-mono text-red-500 font-black bg-red-500/10 px-2 py-0.5 rounded-full">
                          {wishlistCount}
                        </span>
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsSnacksOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <span>Food & Cinema Snacks</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-black">NEW</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsVouchersOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                          <Gift className="w-4 h-4" />
                        </div>
                        <span>Offers & Vouchers</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-500 font-extrabold">3 active</span>
                    </button>

                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors font-bold group border border-amber-550/20"
                      >
                        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard', { state: { tab: 'settings' } });
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span>Account Settings</span>
                    </button>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsSupportOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-250 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-115 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span>24/7 Help & Support</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-955/30 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-115 transition-transform">
                          <LogOut className="w-4 h-4" />
                        </div>
                        <span>Sign Out</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <Link
                to="/auth"
                className="px-5 py-2.5 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-extrabold text-xs shadow-md transition-all hover:scale-105 flex items-center gap-2"
              >
                <User className="w-4 h-4" />
                Sign In
              </Link>
            )}
          </nav>
        </div>
      </header>

      {/* Interactive Modals */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
      <FoodSnacksModal isOpen={isSnacksOpen} onClose={() => setIsSnacksOpen(false)} />
      <VouchersModal isOpen={isVouchersOpen} onClose={() => setIsVouchersOpen(false)} />
      <AccountSettingsModal isOpen={isSettingsOpen} onClose={() => setIsSettingsOpen(false)} />
      <SupportModal isOpen={isSupportOpen} onClose={() => setIsSupportOpen(false)} />
    </>
  );
}
