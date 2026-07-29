import React, { useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, User, LogOut, ShieldAlert, Ticket, Layers, Sun, Moon, Star, X, MapPin, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import API from '../services/api';

export default function Navbar({ onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedCity, setSelectedCity] = useState('Mumbai');

  const [isDarkMode, setIsDarkMode] = useState(() => {
    return localStorage.getItem('cineticket_theme') === 'dark';
  });

  const navigate = useNavigate();
  const location = useLocation();
  const searchRef = useRef(null);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('cineticket_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('cineticket_theme', 'light');
    }
  }, [isDarkMode]);

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
    <header className="sticky top-0 z-40 bg-[#333545] text-white shadow-md">
      {/* Top Header Row */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* BookMyShow Style Logo */}
        <Link to="/" className="flex items-center gap-2 group shrink-0">
          <div className="w-10 h-10 rounded-xl bg-[#f84464] flex items-center justify-center shadow-md">
            <Film className="w-5 h-5 text-white" />
          </div>
          <div>
            <span className="text-xl font-black tracking-tight text-white flex items-center gap-0.5">
              book<span className="text-[#f84464]">my</span>ticket
            </span>
          </div>
        </Link>

        {/* Live Search Bar */}
        <div ref={searchRef} className="hidden md:block flex-1 max-w-xl relative">
          <div className="relative">
            <input
              type="text"
              placeholder="Search for Movies, Events, Plays, Sports and Activities"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                if (searchInput.trim().length > 0) setShowDropdown(true);
              }}
              className="w-full bg-white text-slate-900 border-0 rounded-md py-2 pl-10 pr-8 text-xs font-medium placeholder-slate-400 focus:outline-none shadow-inner"
            />
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            {searchInput && (
              <button
                onClick={() => setSearchInput('')}
                className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Instant Search Results Dropdown */}
          {showDropdown && (
            <div className="absolute top-11 left-0 right-0 bg-white text-slate-900 rounded-xl shadow-2xl border border-slate-200 overflow-hidden z-50 animate-slide-up">
              {isSearching ? (
                <div className="p-3 text-center text-xs text-slate-500">Searching movies...</div>
              ) : searchResults.length === 0 ? (
                <div className="p-3 text-center text-xs text-slate-500">No movies found matching "{searchInput}"</div>
              ) : (
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto">
                  <div className="px-4 py-2 bg-slate-50 text-[10px] uppercase font-bold text-slate-500">
                    Popular Movie Searches ({searchResults.length})
                  </div>
                  {searchResults.map((m) => (
                    <div
                      key={m.id}
                      onClick={() => handleMovieSelect(m.id)}
                      className="p-2.5 hover:bg-slate-50 cursor-pointer flex items-center gap-3 transition-colors"
                    >
                      <img src={m.poster_url} alt={m.title} className="w-9 h-12 object-cover rounded shrink-0" />
                      <div className="flex-1 min-w-0">
                        <h4 className="text-xs font-bold text-slate-900 truncate">{m.title}</h4>
                        <p className="text-[11px] text-slate-500 truncate">{m.genre.join(', ')}</p>
                        <span className="text-[10px] font-bold text-amber-500 flex items-center gap-1 mt-0.5">
                          <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
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

        {/* Right Actions */}
        <div className="flex items-center gap-3">
          {/* Location Selector */}
          <div className="hidden lg:flex items-center gap-1 text-xs font-semibold text-slate-200 cursor-pointer hover:text-white">
            <MapPin className="w-3.5 h-3.5 text-[#f84464]" />
            <span>{selectedCity}</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
          </div>

          {/* Theme Toggle Button */}
          <button
            onClick={toggleTheme}
            className="w-8 h-8 rounded-lg bg-[#222531] hover:bg-slate-700 text-slate-200 flex items-center justify-center transition-all"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? (
              <Sun className="w-4 h-4 text-amber-400 fill-amber-400" />
            ) : (
              <Moon className="w-4 h-4 text-slate-300" />
            )}
          </button>

          {/* User Auth Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-[#f84464] hover:bg-[#e03352] text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Hi, {user.full_name.split(' ')[0]}</span>
                <ChevronDown className="w-3 h-3 text-white" />
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-2 w-52 bg-white text-slate-900 rounded-xl p-2 shadow-2xl border border-slate-200 z-50 animate-slide-up">
                  <div className="px-3 py-2 border-b border-slate-100">
                    <p className="text-xs font-bold text-slate-900 truncate">{user.full_name}</p>
                    <p className="text-[10px] text-slate-500 truncate">{user.email}</p>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 font-medium"
                  >
                    <Ticket className="w-3.5 h-3.5 text-[#f84464]" />
                    Your Orders
                  </Link>

                  {isAdmin && (
                    <Link
                      to="/admin"
                      onClick={() => setShowProfileMenu(false)}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs text-amber-700 hover:bg-amber-50 flex items-center gap-2 font-bold"
                    >
                      <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
                      Admin Control
                    </Link>
                  )}

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-xs text-red-600 hover:bg-red-50 flex items-center gap-2 font-medium"
                  >
                    <LogOut className="w-3.5 h-3.5" />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <Link
              to="/auth"
              className="px-4 py-1.5 rounded-lg bg-[#f84464] hover:bg-[#e03352] text-white font-bold text-xs shadow-sm transition-all"
            >
              Sign in
            </Link>
          )}
        </div>
      </div>

      {/* BookMyShow Secondary Navigation Strip */}
      <div className="bg-[#222531] border-t border-slate-700/60 hidden sm:block">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-10 flex items-center justify-between text-xs font-semibold text-slate-300">
          <div className="flex items-center gap-6">
            <Link to="/" className="text-white hover:text-[#f84464] transition-colors">Movies</Link>
            <Link to="/" className="hover:text-[#f84464] transition-colors">Stream</Link>
            <Link to="/" className="hover:text-[#f84464] transition-colors">Events</Link>
            <Link to="/" className="hover:text-[#f84464] transition-colors">Plays</Link>
            <Link to="/" className="hover:text-[#f84464] transition-colors">Sports</Link>
            <Link to="/system-design" className="hover:text-[#f84464] transition-colors">Architecture</Link>
          </div>

          <div className="flex items-center gap-5 text-[11px] text-slate-400">
            <span className="hover:text-white cursor-pointer">ListYourShow</span>
            <span className="hover:text-white cursor-pointer">Offers</span>
            <span className="hover:text-white cursor-pointer">Gift Cards</span>
          </div>
        </div>
      </div>
    </header>
  );
}
