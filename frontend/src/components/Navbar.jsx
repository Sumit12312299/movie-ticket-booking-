import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Search, Bell, LogOut, Ticket, Shield, Menu, X, Film, Sparkles, User, Clapperboard } from 'lucide-react';
import { getNotifications, markAllNotificationsRead, searchMovies } from '../services/api';

const Logo = () => (
  <Link to="/" className="flex items-center gap-3 group text-decoration-none">
    <div className="relative w-10 h-10 rounded-xl bg-gradient-to-br from-[#E50914] via-[#B80710] to-[#700207] flex items-center justify-center shadow-lg shadow-[#E50914]/40 group-hover:scale-105 transition-all duration-300 border border-white/20">
      <Film className="w-5 h-5 text-white animate-pulse" />
      <span className="absolute -top-1 -right-1 flex h-3 w-3">
        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#FFD700] opacity-75"></span>
        <span className="relative inline-flex rounded-full h-3 w-3 bg-[#FFD700]"></span>
      </span>
    </div>
    <div className="flex flex-col">
      <span className="font-bebas text-2xl tracking-wider text-white flex items-center gap-1 leading-none">
        CINE<span className="text-[#E50914] text-glow-red">PASS</span>
      </span>
      <span className="text-[9px] font-semibold tracking-widest text-[#FFD700] uppercase -mt-1 opacity-90">
        IMAX & Dolby Screen
      </span>
    </div>
  </Link>
);

export default function Navbar() {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [mobileOpen, setMobileOpen] = useState(false);
  const [notifOpen, setNotifOpen]   = useState(false);
  const [notifs, setNotifs]         = useState([]);
  const [unread, setUnread]         = useState(0);

  // Search State
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearchModal, setShowSearchModal] = useState(false);

  useEffect(() => {
    if (isAuthenticated) fetchNotifs();
  }, [isAuthenticated, location.pathname]);

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      if (searchQuery.trim().length >= 2) {
        performSearch(searchQuery);
      } else {
        setSearchResults([]);
        setIsSearching(false);
      }
    }, 300);
    return () => clearTimeout(delayDebounce);
  }, [searchQuery]);

  const performSearch = async (query) => {
    setIsSearching(true);
    try {
      const res = await searchMovies(query);
      setSearchResults(res.data || []);
    } catch {
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const fetchNotifs = async () => {
    try {
      const res = await getNotifications();
      setNotifs(res.data);
      setUnread(res.data.filter(n => !n.is_read).length);
    } catch {}
  };

  const handleMarkRead = async () => {
    try {
      await markAllNotificationsRead();
      setUnread(0);
      setNotifs(prev => prev.map(n => ({ ...n, is_read: true })));
    } catch {}
  };

  const handleLogout = () => { logout(); navigate('/login'); };

  const navItems = [
    { to: '/', label: 'Spotlight' },
    { to: '/#movies', label: 'Now Showing' },
    { to: '/my-bookings', label: 'My Tickets', requireAuth: true },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin Studio', isBadge: true }] : []),
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-[#07080e]/90 backdrop-blur-xl border-b border-white/10 shadow-2xl transition-all duration-300">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between gap-4">
          
          {/* Brand Logo */}
          <Logo />

          {/* Search Bar with Instant Cinema Dropdown */}
          <div className="relative flex-1 max-w-md hidden md:block">
            <div className="relative">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#8c93b3]" />
              <input
                type="text"
                placeholder="Search movies, genres, languages..."
                value={searchQuery}
                onFocus={() => setShowSearchModal(true)}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#131624] text-sm text-white placeholder-[#5d6480] pl-10 pr-4 py-2.5 rounded-full border border-white/10 focus:outline-none focus:border-[#E50914] focus:ring-2 focus:ring-[#E50914]/20 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-[#8c93b3] hover:text-white"
                >
                  Clear
                </button>
              )}
            </div>

            {/* Quick Autocomplete Search Results Drawer */}
            {showSearchModal && searchQuery.trim().length >= 2 && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-[#0F111A] border border-white/15 rounded-2xl p-3 shadow-2xl z-50 backdrop-blur-2xl">
                <div className="flex items-center justify-between text-xs font-semibold text-[#8c93b3] px-2 pb-2 border-b border-white/10">
                  <span>Search Results</span>
                  {isSearching && <span className="text-[#FFD700] animate-pulse">Searching catalog...</span>}
                </div>
                <div className="max-h-64 overflow-y-auto mt-2 space-y-1">
                  {searchResults.length === 0 && !isSearching ? (
                    <div className="text-center py-4 text-xs text-gray-400">No movies found matching "{searchQuery}"</div>
                  ) : (
                    searchResults.map((m) => (
                      <Link
                        key={m.id}
                        to={`/movie/${m.id}`}
                        onClick={() => { setShowSearchModal(false); setSearchQuery(''); }}
                        className="flex items-center gap-3 p-2 rounded-xl hover:bg-[#E50914]/15 transition-all text-decoration-none group"
                      >
                        <img
                          src={m.poster_url || 'https://via.placeholder.com/60x90'}
                          alt={m.title}
                          className="w-10 h-14 object-cover rounded-lg border border-white/10 group-hover:border-[#E50914]"
                        />
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-bold text-white group-hover:text-[#E50914] truncate">{m.title}</h4>
                          <p className="text-xs text-gray-400 truncate">{m.language} • {m.duration_mins} Mins</p>
                        </div>
                        <span className="text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-2 py-1 rounded-md">
                          Book
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Desktop Nav Items */}
          <div className="hidden lg:flex items-center gap-1">
            {navItems.map((item) => {
              if (item.requireAuth && !isAuthenticated) return null;
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.label}
                  to={item.to}
                  className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all text-decoration-none flex items-center gap-2 ${
                    active
                      ? 'bg-[#E50914]/15 text-[#E50914] border border-[#E50914]/30 shadow-lg shadow-[#E50914]/10'
                      : 'text-[#9c9eb9] hover:text-white hover:bg-white/5'
                  }`}
                >
                  {item.isBadge && <Sparkles className="w-3.5 h-3.5 text-[#FFD700]" />}
                  {item.label}
                </Link>
              );
            })}
          </div>

          {/* User & Action Buttons */}
          <div className="hidden md:flex items-center gap-4">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Notifications */}
                <div className="relative">
                  <button
                    onClick={() => setNotifOpen((p) => !p)}
                    className="relative w-10 h-10 rounded-full bg-[#131624] border border-white/10 flex items-center justify-center text-[#9c9eb9] hover:text-white hover:border-white/30 transition-all"
                  >
                    <Bell className="w-4 h-4" />
                    {unread > 0 && (
                      <span className="absolute -top-1 -right-1 w-5 h-5 bg-[#E50914] text-white text-[10px] font-extrabold rounded-full flex items-center justify-center border-2 border-[#07080e]">
                        {unread > 9 ? '9+' : unread}
                      </span>
                    )}
                  </button>

                  {/* Notification Dropdown */}
                  {notifOpen && (
                    <div className="absolute right-0 top-12 w-80 bg-[#0F111A] border border-white/15 rounded-2xl p-4 shadow-2xl z-50 backdrop-blur-xl">
                      <div className="flex items-center justify-between pb-3 border-b border-white/10">
                        <span className="text-xs font-extrabold tracking-wider text-white uppercase flex items-center gap-2">
                          <Bell className="w-3.5 h-3.5 text-[#FFD700]" /> Notifications
                        </span>
                        {unread > 0 && (
                          <button
                            onClick={handleMarkRead}
                            className="text-xs text-[#E50914] font-semibold hover:underline bg-transparent border-0 cursor-pointer"
                          >
                            Mark all read
                          </button>
                        )}
                      </div>
                      <div className="max-h-60 overflow-y-auto mt-2 space-y-2">
                        {notifs.length === 0 ? (
                          <div className="text-center py-6 text-xs text-gray-500">No new notifications</div>
                        ) : (
                          notifs.map((n) => (
                            <div
                              key={n.id}
                              className={`p-3 rounded-xl border-l-4 ${
                                n.is_read ? 'bg-white/5 border-transparent' : 'bg-[#E50914]/10 border-[#E50914]'
                              }`}
                            >
                              <h5 className="text-xs font-bold text-white">{n.title}</h5>
                              <p className="text-xs text-gray-400 mt-1">{n.message}</p>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* Profile Pill */}
                <Link
                  to="/profile"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#131624] border border-white/15 hover:border-[#FFD700]/50 transition-all text-decoration-none"
                >
                  <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[#E50914] to-[#FFD700] flex items-center justify-center text-xs font-extrabold text-white">
                    {user?.name?.[0]?.toUpperCase() || 'U'}
                  </div>
                  <span className="text-xs font-bold text-white max-w-[100px] truncate">{user?.name}</span>
                </Link>

                {/* Signout */}
                <button
                  onClick={handleLogout}
                  className="p-2 text-gray-400 hover:text-[#E50914] transition-colors bg-transparent border-0 cursor-pointer"
                  title="Sign Out"
                >
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-3">
                <Link to="/login" className="btn-cinema-glass text-xs px-5 py-2">
                  Sign In
                </Link>
                <Link to="/register" className="btn-cinema text-xs px-5 py-2">
                  Book Now
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen((p) => !p)}
            className="md:hidden text-gray-300 hover:text-white p-2"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileOpen && (
          <div className="md:hidden bg-[#0F111A] border-b border-white/10 px-6 py-4 space-y-3">
            <div className="relative mb-3">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search movies..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-[#181a28] text-sm text-white placeholder-gray-500 pl-9 pr-3 py-2 rounded-xl border border-white/10"
              />
            </div>
            {navItems.map((item) => (
              <Link
                key={item.label}
                to={item.to}
                onClick={() => setMobileOpen(false)}
                className="block text-sm font-semibold text-gray-300 hover:text-white py-2 border-b border-white/5"
              >
                {item.label}
              </Link>
            ))}
            {isAuthenticated ? (
              <button
                onClick={() => { handleLogout(); setMobileOpen(false); }}
                className="w-full text-left text-sm font-bold text-[#E50914] py-2 bg-transparent border-0 cursor-pointer"
              >
                Sign Out
              </button>
            ) : (
              <div className="flex gap-2 pt-2">
                <Link to="/login" onClick={() => setMobileOpen(false)} className="btn-cinema-glass text-center flex-1 py-2 text-xs">
                  Login
                </Link>
                <Link to="/register" onClick={() => setMobileOpen(false)} className="btn-cinema text-center flex-1 py-2 text-xs">
                  Register
                </Link>
              </div>
            )}
          </div>
        )}
      </header>

      {/* Backdrop overlay when search dropdown is active */}
      {showSearchModal && searchQuery && (
        <div
          onClick={() => setShowSearchModal(false)}
          className="fixed inset-0 z-40 bg-black/50 backdrop-blur-xs"
        />
      )}
    </>
  );
}
