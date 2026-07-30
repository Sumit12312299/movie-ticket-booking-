import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Heart, User, LogOut, ShieldAlert, Ticket, Layers, Sun, Moon, Star, X, Wallet } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';
import WalletModal from './WalletModal';

export default function Navbar({ onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [isWalletOpen, setIsWalletOpen] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);

  // Theme toggle state with localStorage persistence
  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('cineticket_theme') === 'dark';
  });


  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  // Sync theme class on mount and change
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cineticket_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cineticket_theme', 'light');
    }
  }, [isDarkMode]);

  // Live Instant Search as user types single letter
  useEffect(() => {
    if (searchInput.trim().length > 0) {
      setIsSearching(true);
      setShowDropdown(true);
      const timer = setTimeout(() => {
        API.get('/movies', { params: { search: searchInput.trim(), limit: 6 } })
          .then((res) => {
            setSearchResults(res.data.items || []);
          })
          .catch(() => setSearchResults([]))
          .finally(() => setIsSearching(false));
      }, 150);

      return () => clearTimeout(timer);
    } else {
      setSearchResults([]);
      setShowDropdown(false);
    }

    if (onSearchChange) {
      onSearchChange(searchInput);
    }
  }, [searchInput]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const toggleTheme = () => {
    setIsDarkMode((prev) => !prev);
  };

  const handleMovieSelect = (movieId) => {
    setShowDropdown(false);
    setSearchInput('');
    navigate(`/movie/${movieId}`);
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
        <div className="w-full px-4 sm:px-8 lg:px-12 h-20 flex items-center justify-between gap-4">
          {/* Brand Logo */}
          <Link to="/" className="flex items-center gap-3 group">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-all duration-300">
              <Film className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                CINE<span className="text-rose-600 dark:text-rose-500">TICKET</span>
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 dark:text-slate-400 -mt-1">
                Cinema & Multiplex Booking
              </span>
            </div>
          </Link>

          {/* Live Instant Search Bar with Dropdown */}
          <div ref={searchRef} className="hidden md:block flex-1 max-w-md relative">
            <div className="relative">
              <input
                type="text"
                placeholder="Search movies, genre, actors..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onFocus={() => {
                  if (searchInput.trim().length > 0) setShowDropdown(true);
                }}
                className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700/80 rounded-full py-2.5 pl-11 pr-12 text-sm font-medium text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all shadow-inner"
              />
              <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              {searchInput ? (
                <button
                  onClick={() => setSearchInput('')}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 p-0.5 rounded-full"
                >
                  <X className="w-4 h-4" />
                </button>
              ) : (
                <span className="absolute right-3.5 top-3 text-[10px] font-mono font-bold text-slate-400 dark:text-slate-500 bg-slate-200/60 dark:bg-slate-700/60 px-2 py-0.5 rounded-md">
                  ⌘K
                </span>
              )}
            </div>

            {/* Instant Search Results Dropdown */}
            {showDropdown && (
              <div className="absolute top-14 left-0 right-0 bg-white dark:bg-slate-900 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-slide-up backdrop-blur-xl">
                {isSearching ? (
                  <div className="p-5 text-center text-xs text-slate-500 font-medium">Searching catalog...</div>
                ) : searchResults.length === 0 ? (
                  <div className="p-5 text-center text-xs text-slate-500 font-medium">No movies found matching "{searchInput}"</div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                    <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-black tracking-wider text-rose-600 dark:text-rose-400">
                      Live Search Results ({searchResults.length})
                    </div>
                    {searchResults.map((m) => (
                      <div
                        key={m.id}
                        onClick={() => handleMovieSelect(m.id)}
                        className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center gap-3 transition-colors"
                      >
                        <img src={m.poster_url} alt={m.title} className="w-10 h-14 object-cover rounded-xl shrink-0 shadow-sm" />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-xs font-black text-slate-900 dark:text-white truncate">{m.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium truncate">{Array.isArray(m.genre) ? m.genre.join(', ') : m.genre}</p>
                          <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                            <Star className="w-3 h-3 fill-amber-500" />
                            {m.rating ? Number(m.rating).toFixed(1) : '5.0'} Rating
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Navigation Actions */}
          <nav className="flex items-center gap-2 sm:gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm hover:scale-110 active:rotate-45"
              title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            >
              {isDarkMode ? (
                <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
              ) : (
                <Moon className="w-4 h-4 text-slate-700" />
              )}
            </button>

            <Link
              to="/"
              className={`px-4 py-2.5 rounded-2xl text-xs font-black transition-all ${location.pathname === '/'
                  ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/30'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
            >
              Movies
            </Link>

            {/* Wallet Quick Button in Top Navbar */}
            {user && (
              <button
                onClick={() => setIsWalletOpen(true)}
                className="px-3.5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-extrabold text-xs flex items-center gap-2 transition-all shadow-sm group hover:scale-105 active:scale-95 cursor-pointer"
                title="Cineticket Wallet"
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
                className={`px-4 py-2.5 rounded-2xl text-xs font-black flex items-center gap-1.5 transition-all ${location.pathname === '/dashboard'
                    ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
              >
                <Ticket className="w-4 h-4" />
                <span className="hidden sm:inline">My Bookings</span>
              </Link>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className="px-4 py-2.5 rounded-2xl text-xs font-black text-amber-700 dark:text-amber-300 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all shadow-sm"
              >
                <ShieldAlert className="w-4 h-4 text-amber-500" />
                <span className="hidden sm:inline">Admin Portal</span>
              </Link>
            )}

            {/* User Auth Profile */}
            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowProfileMenu(!showProfileMenu)}
                  className="p-0.5 rounded-full bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 hover:scale-105 transition-transform shadow-md"
                >
                  <div className="w-9 h-9 rounded-full bg-slate-950 font-black text-white flex items-center justify-center text-sm border-2 border-white dark:border-slate-900">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                </button>

                {showProfileMenu && (
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-900 rounded-3xl p-2 shadow-2xl border border-slate-200 dark:border-slate-800 z-50 animate-slide-up">
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="text-sm font-black text-slate-900 dark:text-white truncate">{user.full_name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium truncate">{user.email}</p>
                      <span className="inline-block mt-1.5 px-2.5 py-0.5 rounded-full text-[10px] uppercase font-black bg-rose-600/10 text-rose-600 dark:text-rose-400 border border-rose-500/30">
                        {user.role} Account
                      </span>
                    </div>

                    <button
                      onClick={() => {
                        setShowProfileMenu(false);
                        setIsWalletOpen(true);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between transition-colors font-bold mt-1"
                    >
                      <div className="flex items-center gap-2.5">
                        <Wallet className="w-4 h-4 text-amber-500" />
                        My Wallet
                      </div>
                      <span className="font-mono text-amber-600 dark:text-amber-400 font-black">
                        ₹{(user.wallet_balance ?? 1500.00).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                      </span>
                    </button>

                    <Link
                      to="/dashboard"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-4 py-2.5 rounded-2xl text-xs text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center gap-2.5 transition-colors font-bold"
                    >
                      <Ticket className="w-4 h-4 text-rose-500" />
                      My Bookings & Passes
                    </Link>

                    <button
                      onClick={() => {
                        logout();
                        setShowProfileMenu(false);
                      }}
                      className="w-full text-left px-4 py-2.5 rounded-2xl text-xs text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/30 flex items-center gap-2.5 transition-colors font-bold"
                    >
                      <LogOut className="w-4 h-4" />
                      Sign Out
                    </button>
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

      {/* Wallet Modal */}
      <WalletModal isOpen={isWalletOpen} onClose={() => setIsWalletOpen(false)} />
    </>
  );
}
