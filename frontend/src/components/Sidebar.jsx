import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Film, LayoutDashboard, Calendar, Ticket, Heart, Settings, User, LogOut, ShieldAlert } from 'lucide-react';

export default function Sidebar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside className="w-64 bg-slate-950/60 border-r border-slate-900 flex flex-col justify-between h-screen sticky top-0 px-4 py-6 hidden md:flex flex-shrink-0">
      {/* Upper Section */}
      <div className="space-y-8">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2 px-2">
          <div className="w-8 h-8 rounded-lg bg-emerald-500 flex items-center justify-center">
            <Film className="w-5 h-5 text-slate-950 font-bold" />
          </div>
          <span className="text-lg font-black tracking-wider text-emerald-400">
            MOVIEGO
          </span>
        </Link>

        {/* Menu Group */}
        <div className="space-y-6">
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600 px-2 mb-2">Menu</p>
            <nav className="space-y-1">
              <Link
                to="/"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/'
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <LayoutDashboard className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>

              <Link
                to="/"
                className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/40 transition-all"
              >
                <Film className="w-4 h-4" />
                <span>Films</span>
              </Link>

              {isAuthenticated && (
                <Link
                  to="/my-bookings"
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/my-bookings'
                      ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <Ticket className="w-4 h-4" />
                  <span>Ticketings</span>
                </Link>
              )}

              {isAdmin && (
                <Link
                  to="/admin"
                  className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    location.pathname === '/admin'
                      ? 'bg-indigo-500/10 text-indigo-400 border-l-2 border-indigo-500'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                  }`}
                >
                  <ShieldAlert className="w-4 h-4" />
                  <span>Admin Panel</span>
                </Link>
              )}
            </nav>
          </div>

          {/* System Group */}
          <div>
            <p className="text-[10px] uppercase font-bold tracking-widest text-slate-600 px-2 mb-2">System</p>
            <nav className="space-y-1">
              <Link
                to="/profile"
                className={`flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                  location.pathname === '/profile'
                    ? 'bg-emerald-500/10 text-emerald-400 border-l-2 border-emerald-500'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>

              {isAuthenticated ? (
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-rose-400 hover:bg-rose-950/20 transition-all text-left"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Logout</span>
                </button>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center space-x-3 px-3 py-2.5 rounded-xl text-xs font-semibold text-emerald-400 hover:bg-emerald-500/10 transition-all"
                >
                  <User className="w-4 h-4" />
                  <span>Sign In</span>
                </Link>
              )}
            </nav>
          </div>
        </div>
      </div>

      {/* Profile Card Footer */}
      {isAuthenticated && (
        <div className="border-t border-slate-900 pt-4 flex items-center space-x-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center font-bold text-emerald-400">
            {user?.name?.[0]?.toUpperCase() || 'U'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-bold text-slate-200 truncate">{user?.name}</p>
            <p className="text-[10px] text-slate-500 truncate">{user?.role || 'Customer'}</p>
          </div>
        </div>
      )}
    </aside>
  );
}
