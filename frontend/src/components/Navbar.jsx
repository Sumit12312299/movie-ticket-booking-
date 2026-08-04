import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Heart, User, LogOut, ShieldAlert, Ticket, Sun, Moon, Star, X, Wallet, Crown, Utensils, Settings, HelpCircle, Gift } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import WalletModal from './WalletModal';
import FoodSnacksModal from './FoodSnacksModal';
import VouchersModal from './VouchersModal';
import AccountSettingsModal from './AccountSettingsModal';
import SupportModal from './SupportModal';

export default function Navbar({ onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
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

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Theme toggle state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('bookticket_theme') === 'dark';
  });

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Sync theme class on mount and change
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

  // Handle live search input debouncing
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
        setSearchResults(res.data || []);
        setShowDropdown(true);
      } catch (err) {
        console.error(err);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchInput]);

  // Close search dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
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

  return (
    <>
      <header className={`sticky top-0 z-40 transition-all duration-300 border-b ${
        isScrolled
          ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-slate-200 dark:border-slate-800/85 shadow-lg'
          : 'bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-transparent shadow-none'
      }`}>
        <div className={`w-full px-4 sm:px-8 lg:px-12 flex items-center justify-between gap-4 transition-all duration-300 ${
          isScrolled ? 'h-16' : 'h-20'
        }`}>
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-all duration-300">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                BOOK<span className="text-rose-600 dark:text-rose-500">TICKET</span>
              </span>
              <span className="text-[10px] block font-bold text-slate-400 dark:text-slate-500 tracking-wider uppercase -mt-1">
                Cinema & Multiplex Booking
              </span>
            </div>
          </Link>

          {/* Search Bar Container */}
          <div ref={searchRef} className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search movies, genre, actors..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => searchInput.trim() && setShowDropdown(true)}
                className="w-full pl-10 pr-10 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-500 focus:bg-white dark:focus:bg-slate-900 transition-all shadow-inner"
              />
              {searchInput && (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Live Search Dropdown */}
            {showDropdown && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden z-50 animate-slide-up max-h-96 overflow-y-auto">
                {isSearching ? (
                  <div className="p-4 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                    <div className="w-4 h-4 border-2 border-rose-500 border-t-transparent rounded-full animate-spin"></div>
                    Searching movies...
                  </div>
                ) : searchResults.length > 0 ? (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {searchResults.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleSelectMovie(m.id)}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/60 flex items-center gap-3 cursor-pointer transition-colors group"
                      >
                        <img
                          src={m.poster_url}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg shadow-sm group-hover:scale-105 transition-transform"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate group-hover:text-rose-600 dark:group-hover:text-rose-400">
                            {m.title}
                          </h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400">
                            {m.language} • {m.duration_mins} mins
                          </p>
                          <div className="flex items-center gap-1 mt-1">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400">
                              {m.rating?.toFixed(1) || '5.0'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="p-6 text-center text-xs text-slate-500 dark:text-slate-400">
                    No movies found matching "{searchInput}"
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Controls */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* Dark/Light Mode Toggle */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-amber-400 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-all border border-slate-200 dark:border-slate-700 shadow-sm hover:scale-105 active:scale-95"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
            </button>

            <Link
              to="/"
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${
                location.pathname === '/'
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              Movies
            </Link>

            {user && (
              <button
                onClick={() => setIsWalletOpen(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm group hover:scale-105 active:scale-95 cursor-pointer"
                title="BookTicket Wallet"
              >
                <div className="w-5 h-5 rounded-full bg-amber-500 text-white flex items-center justify-center shadow-xs group-hover:rotate-12 transition-transform">
                  <Wallet className="w-3.5 h-3.5" />
                </div>
                <span className="font-mono font-black text-slate-900 dark:text-amber-300">
                  ₹{(user.wallet_balance ?? 1500.00).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
                <span className="text-[10px] bg-amber-500/20 px-1.5 py-0.5 rounded-md text-amber-600 dark:text-amber-300 font-black uppercase tracking-wider hidden md:inline">
                  + Add
                </span>
              </button>
            )}

            {user && (
              <Link
                to="/dashboard"
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all ${
                  location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">My Bookings</span>
              </Link>
            )}

            {/* User Auth Profile Menu */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-0.5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 hover:scale-105 transition-transform shadow-md cursor-pointer"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-950 font-black text-white flex items-center justify-center text-sm border-2 border-white dark:border-slate-900">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-72 bg-white dark:bg-slate-900 rounded-3xl p-2.5 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up space-y-1">
                    {/* User Header Profile Summary */}
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800/80 bg-slate-50/50 dark:bg-slate-800/40 rounded-2xl mb-1">
                      <div className="flex items-center justify-between">
                        <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.full_name}</p>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-black uppercase bg-amber-500/20 text-amber-600 dark:text-amber-400 border border-amber-500/30 flex items-center gap-1">
                          <Crown className="w-2.5 h-2.5 fill-amber-400" /> VIP Gold
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{user.email}</p>
                    </div>

                    {/* Option 1: Digital Wallet */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsWalletOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Wallet className="w-4 h-4" />
                        </div>
                        <span>BookTicket Wallet</span>
                      </div>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-black">
                        ₹{(user.wallet_balance ?? 1500.00).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>

                    {/* Option 2: My Bookings & Tickets */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard', { state: { tab: 'bookings' } });
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Ticket className="w-4 h-4" />
                      </div>
                      <span>My Bookings & Passes</span>
                    </button>

                    {/* Option 3: Saved Wishlist */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard', { state: { tab: 'wishlist' } });
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-red-500/10 text-red-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Heart className="w-4 h-4" />
                      </div>
                      <span>Saved Wishlist Movies</span>
                    </button>

                    {/* Option 4: Food & Beverages Snacks */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsSnacksOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Utensils className="w-4 h-4" />
                        </div>
                        <span>Food & Cinema Snacks</span>
                      </div>
                      <span className="text-[9px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 font-extrabold">NEW</span>
                    </button>

                    {/* Option 5: VIP Rewards & Vouchers */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsVouchersOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold group cursor-pointer"
                    >
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <Gift className="w-4 h-4" />
                        </div>
                        <span>VIP Offers & Vouchers</span>
                      </div>
                      <span className="text-[10px] font-mono text-purple-500 font-extrabold">3 active</span>
                    </button>

                    {/* Option 6: Admin Portal Link (If Admin User) */}
                    {isAdmin && (
                      <Link
                        to="/admin"
                        onClick={() => setShowProfileMenu(false)}
                        className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-amber-700 dark:text-amber-300 hover:bg-amber-500/10 flex items-center gap-2.5 transition-colors font-bold group border border-amber-500/20"
                      >
                        <div className="w-7 h-7 rounded-xl bg-amber-500/20 text-amber-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                          <ShieldAlert className="w-4 h-4" />
                        </div>
                        <span>Admin Control Center</span>
                      </Link>
                    )}

                    {/* Option 7: Account Settings */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        navigate('/dashboard', { state: { tab: 'settings' } });
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-sky-500/10 text-sky-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <Settings className="w-4 h-4" />
                      </div>
                      <span>Account Settings & Profile</span>
                    </button>

                    {/* Option 8: Customer Support & Help */}
                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsSupportOpen(true);
                      }}
                      className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                    >
                      <div className="w-7 h-7 rounded-xl bg-indigo-500/10 text-indigo-500 flex items-center justify-center group-hover:scale-110 transition-transform">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <span>24/7 Help & Support</span>
                    </button>

                    <div className="pt-1 border-t border-slate-100 dark:border-slate-800">
                      {/* Option 9: Sign Out */}
                      <button
                        onClick={() => {
                          logout();
                          setShowProfileMenu(false);
                        }}
                        className="w-full text-left px-3.5 py-2.5 rounded-2xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors font-bold group cursor-pointer"
                      >
                        <div className="w-7 h-7 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center group-hover:scale-110 transition-transform">
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
                className="px-5 py-2.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold text-xs shadow-lg shadow-rose-600/30 transition-all hover:scale-105 flex items-center gap-2"
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
