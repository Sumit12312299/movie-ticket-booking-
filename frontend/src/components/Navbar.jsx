import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Film, Search, Heart, User, LogOut, ShieldAlert, Ticket, Layers } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Navbar({ onSearchChange }) {
  const { user, logout, isAdmin } = useAuth();
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const [searchInput, setSearchInput] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (onSearchChange) {
      onSearchChange(searchInput);
    } else {
      navigate(`/?search=${encodeURIComponent(searchInput)}`);
    }
  };

  return (
    <header className="sticky top-0 z-40 glass-panel border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-lg shadow-rose-600/30 group-hover:scale-105 transition-transform">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-black tracking-wider bg-gradient-to-r from-white via-slate-100 to-rose-400 bg-clip-text text-transparent">
              CINE<span className="text-rose-500">TICKET</span>
            </span>
            <span className="block text-[10px] uppercase font-semibold tracking-widest text-slate-400 -mt-1">
              Cinema & IMAX Booking
            </span>
          </div>
        </Link>

        {/* Live Movie Search Bar */}
        <form onSubmit={handleSearchSubmit} className="hidden md:flex flex-1 max-w-md relative">
          <input
            type="text"
            placeholder="Search movies, genres, actors..."
            value={searchInput}
            onChange={(e) => {
              setSearchInput(e.target.value);
              if (onSearchChange) onSearchChange(e.target.value);
            }}
            className="w-full bg-slate-900/90 border border-slate-800 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-rose-500 focus:ring-1 focus:ring-rose-500 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        </form>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-sm font-medium transition-colors ${
              location.pathname === '/' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            Movies
          </Link>

          <Link
            to="/system-design"
            className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
              location.pathname === '/system-design' ? 'text-amber-400 bg-amber-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-400" />
            <span className="hidden sm:inline">System Architecture</span>
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-xl text-sm font-medium flex items-center gap-1.5 transition-colors ${
                location.pathname === '/dashboard' ? 'text-rose-400 bg-rose-500/10' : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              <Ticket className="w-4 h-4 text-rose-500" />
              <span className="hidden sm:inline">My Bookings</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2 rounded-xl text-sm font-semibold text-amber-400 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all"
            >
              <ShieldAlert className="w-4 h-4" />
              <span className="hidden sm:inline">Admin Portal</span>
            </Link>
          )}

          {/* User Auth Profile */}
          {user ? (
            <div className="relative">
              <button
                onClick={() => setShowProfileMenu(!showProfileMenu)}
                className="flex items-center gap-2.5 p-1.5 rounded-full hover:bg-slate-800/60 border border-slate-800 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-rose-500 to-amber-500 flex items-center justify-center font-bold text-white text-sm shadow-md">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 glass-card rounded-2xl p-2 shadow-2xl z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-slate-800">
                    <p className="text-sm font-bold text-white truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-400 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-rose-500/20 text-rose-400 border border-rose-500/30">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-300 hover:text-white hover:bg-slate-800/60 flex items-center gap-2.5 transition-colors"
                  >
                    <Ticket className="w-4 h-4 text-rose-400" />
                    My Bookings
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-rose-400 hover:bg-rose-500/10 flex items-center gap-2.5 transition-colors"
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
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-sm shadow-lg shadow-rose-600/25 hover:shadow-rose-600/40 transition-all flex items-center gap-2"
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
