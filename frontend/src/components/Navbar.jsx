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
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-3 group">
          <div className="w-11 h-11 rounded-xl bg-red-600 flex items-center justify-center shadow-md shadow-red-600/20 group-hover:bg-red-700 transition-colors">
            <Film className="w-6 h-6 text-white" />
          </div>
          <div>
            <span className="text-2xl font-extrabold tracking-tight text-slate-900">
              CINE<span className="text-red-600">TICKET</span>
            </span>
            <span className="block text-[10px] uppercase font-bold tracking-widest text-slate-500 -mt-1">
              Cinema & Multiplex Booking
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
            className="w-full bg-slate-100 border border-slate-200 rounded-full py-2.5 pl-11 pr-4 text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
        </form>

        {/* Navigation Actions */}
        <nav className="flex items-center gap-2 sm:gap-4">
          <Link
            to="/"
            className={`px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
              location.pathname === '/' ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            Movies
          </Link>

          <Link
            to="/system-design"
            className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
              location.pathname === '/system-design' ? 'text-amber-700 bg-amber-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Layers className="w-4 h-4 text-amber-600" />
            <span className="hidden sm:inline">Architecture</span>
          </Link>

          {user && (
            <Link
              to="/dashboard"
              className={`px-3 py-2 rounded-xl text-sm font-semibold flex items-center gap-1.5 transition-colors ${
                location.pathname === '/dashboard' ? 'text-red-600 bg-red-50' : 'text-slate-700 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Ticket className="w-4 h-4 text-red-600" />
              <span className="hidden sm:inline">My Bookings</span>
            </Link>
          )}

          {isAdmin && (
            <Link
              to="/admin"
              className="px-3 py-2 rounded-xl text-sm font-bold text-amber-800 bg-amber-50 border border-amber-200 hover:bg-amber-100 flex items-center gap-1.5 transition-all"
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
                className="flex items-center gap-2 p-1.5 rounded-full hover:bg-slate-100 border border-slate-200 transition-all"
              >
                <div className="w-9 h-9 rounded-full bg-slate-900 font-bold text-white flex items-center justify-center text-sm shadow-sm">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              </button>

              {showProfileMenu && (
                <div className="absolute right-0 mt-3 w-56 bg-white rounded-2xl p-2 shadow-xl border border-slate-200 z-50 animate-slide-up">
                  <div className="px-4 py-3 border-b border-slate-100">
                    <p className="text-sm font-bold text-slate-900 truncate">{user.full_name}</p>
                    <p className="text-xs text-slate-500 truncate">{user.email}</p>
                    <span className="inline-block mt-1 px-2 py-0.5 rounded text-[10px] uppercase font-bold bg-slate-100 text-slate-700 border border-slate-200">
                      {user.role}
                    </span>
                  </div>

                  <Link
                    to="/dashboard"
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-slate-700 hover:bg-slate-50 flex items-center gap-2.5 transition-colors font-medium"
                  >
                    <Ticket className="w-4 h-4 text-red-600" />
                    My Bookings
                  </Link>

                  <button
                    onClick={() => {
                      logout();
                      setShowProfileMenu(false);
                    }}
                    className="w-full text-left px-4 py-2.5 rounded-xl text-sm text-red-600 hover:bg-red-50 flex items-center gap-2.5 transition-colors font-medium"
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
