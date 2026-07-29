import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Heart, User, LogOut, ShieldAlert, Ticket, Layers, Sun, Moon, Star, X } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Navbar({ onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
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
    <header className="sticky top-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 shadow-sm transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/20 group-hover:bg-red-700 transition-colors">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              CINE<span className="text-red-600">TICKET</span>
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
              placeholder="Type movie name, genre, actor..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (searchInput.trim().length > 0) setShowDropdown(true);
              }}
              className="w-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full py-2.5 pl-11 pr-10 text-sm text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none focus:bg-white dark:focus:bg-slate-900 focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-14 left-0 right-0 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 overflow-hidden z-50 animate-slide-up">
              {isSearching ? (
                <div className="p-4 text-center text-xs text-slate-500">Searching movies...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-4 text-center text-xs text-slate-500">No movies found matching "{searchInput}"</div>
              ) : (
                <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-80 overflow-y-auto">
                  <div className="px-4 py-2 bg-slate-50 dark:bg-slate-800/50 text-[10px] uppercase font-bold text-slate-500">
                    Live Search Results ({searchResults.length})
                  </div>
                  {searchResults.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleMovieSelect(m.id)}
                      className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img src={m.poster_url} alt={m.title} className="w-10 h-14 object-cover rounded-lg shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">{m.title}</h4>
                        <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{m.genre.join(', ')}</p>
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-500" />
                          {m.rating.toFixed(1)} Rating
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
        <nav className="flex items-center gap-2 sm:gap-4">
          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 flex items-center justify-center transition-all shadow-sm"
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
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/'
                ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            Movies
          </Link>

          <Link
            to="/system-design"
            className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              location.pathname === '/system-design'
                ? 'text-amber-700 bg-amber-50 dark:bg-amber-950/40 dark:text-amber-400'
                : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Architecture</span>
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/dashboard'
                  ? 'text-red-600 bg-red-50 dark:bg-red-950/40 dark:text-red-400'
                  : 'text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Ticket className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">My Bookings</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2 rounded-xl text-sm font-bold text-amber-800 dark:text-amber-300 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-4 h-4 text-amber-600" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>
          )}

          {/* User Auth Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-red-600 font-bold text-white flex items-center justify-center text-sm shadow-sm">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-slate-800 rounded-2xl p-2 shadow-xl border border-slate-200 dark:border-slate-700 z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-600">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Ticket className="w-4 h-4 text-red-600" />
                    My Bookings
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 flex items-center gap-2.5 transition-colors font-medium"
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
              className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-700 text-white font-semibold text-sm shadow-md shadow-red-600/20 transition-all flex items-center gap-2"
            >
              <User className="w-4 h-4" />
              Sign In
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
}
