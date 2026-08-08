import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import API from '../services/api';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  // Split-screen movie carousel state
  const [movies, setMovies] = useState([]);
  const [movieIndex, setMovieIndex] = useState(0);

  const { login, register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  // Load movies for cinematic preview panel
  useEffect(() => {
    const fetchMovies = async () => {
      try {
        const res = await API.get('/movies', { params: { limit: 5 } });
        setMovies(res.data.items || []);
      } catch (err) {
        console.error('Failed to load movies on auth page', err);
      }
    };
    fetchMovies();
  }, []);

  // Auto rotate preview movies
  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setMovieIndex((prev) => (prev + 1) % movies.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(fullName, email, password, role);
        addToast('Account created successfully! Welcome to BookTicket.', 'success');
      } else {
        await login(email, password);
        addToast('Signed in successfully!', 'success');
      }
      navigate('/');
    } catch (err) {
      addToast(err.response?.data?.detail || 'Authentication failed. Please check your details.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const fillAndLoginDemo = async (type) => {
    const demoEmail = type === 'admin' ? 'admin@bookticket.com' : 'user@bookticket.com';
    const demoPw = type === 'admin' ? 'admin123' : 'user123';
    setEmail(demoEmail);
    setPassword(demoPw);
    setIsRegister(false);
    setSubmitting(true);
    try {
      await login(demoEmail, demoPw);
      addToast(`Signed in as ${type === 'admin' ? 'Demo Admin' : 'Demo User'}!`, 'success');
      navigate('/');
    } catch (err) {
      addToast('Demo login failed. Please try manual login.', 'error');
    } finally {
      setSubmitting(false);
    }
  };

  const activeMovie = movies[movieIndex];

  return (
    <div className="relative min-h-[85vh] flex items-center justify-center py-8 px-4 overflow-hidden">
      {/* Immersive ambient glows */}
      <div className="absolute top-10 left-1/3 w-96 h-96 bg-gradient-to-tr from-rose-500/20 to-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-80 h-80 bg-rose-500/15 rounded-full blur-3xl pointer-events-none"></div>

      {/* Outer Card Container: split grid on large screens */}
      <div className="relative w-full max-w-md lg:max-w-5xl bg-white/60 dark:bg-slate-900/40 backdrop-blur-2xl rounded-[32px] border border-slate-200/60 dark:border-slate-800/80 shadow-[0_20px_50px_rgba(0,0,0,0.12)] dark:shadow-[0_20px_50px_rgba(0,0,0,0.3)] flex overflow-hidden min-h-[580px] animate-scale-up">
        
        {/* Left Pane: Cinematic Carousel (visible on desktop) */}
        <div className="hidden lg:flex lg:w-7/12 relative overflow-hidden bg-slate-950 text-white p-12 flex-col justify-between group">
          {/* Backdrop Image with cross-fade blur effect */}
          <div className="absolute inset-0 z-0">
            {activeMovie ? (
              <img
                key={activeMovie._id}
                src={activeMovie.banner_url || activeMovie.poster_url}
                alt={activeMovie.title}
                className="w-full h-full object-cover object-center filter brightness-50 contrast-110 scale-105 animate-fade-in transition-all duration-1000"
              />
            ) : (
              <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-950 to-indigo-950"></div>
            )}
            {/* Dark vignette overlay mask */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950/80 via-transparent to-slate-950/30"></div>
          </div>

          {/* Top Branding Tag */}
          <div className="relative z-10 flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 to-rose-500 flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Film className="w-4 h-4 text-white" />
            </div>
            <span className="font-black text-sm tracking-wider uppercase bg-gradient-to-r from-white to-slate-300 bg-clip-text text-transparent">BookTicket Premiere</span>
          </div>

          {/* Dynamic Movie Info Overlay */}
          <div className="relative z-10 space-y-4 max-w-md">
            {activeMovie && (
              <div className="space-y-2.5 animate-slide-up">
                <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-rose-500 text-white shadow-lg inline-flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-300 fill-amber-300 animate-pulse" />
                  Trending Blockbuster
                </span>
                <h3 className="text-3xl font-black tracking-tight leading-none drop-shadow-md">
                  {activeMovie.title}
                </h3>
                <p className="text-xs text-slate-300/80 font-medium line-clamp-3 leading-relaxed drop-shadow-xs">
                  {activeMovie.synopsis}
                </p>
                <div className="flex items-center gap-4 text-xs font-bold text-slate-300">
                  <span className="flex items-center gap-1 text-amber-400">
                    ★ {activeMovie.rating ? Number(activeMovie.rating).toFixed(1) : '5.0'}
                  </span>
                  <span>•</span>
                  <span>{activeMovie.genre?.slice(0, 2).join(', ')}</span>
                </div>
              </div>
            )}
            
            {/* Bullet Indicators */}
            <div className="flex gap-1.5 pt-2">
              {movies.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setMovieIndex(idx)}
                  className={`h-1 rounded-full transition-all duration-300 ${
                    idx === movieIndex ? 'w-6 bg-rose-500' : 'w-2 bg-white/30 hover:bg-white/60'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Right Pane: Login/Register Form (Responsive column) */}
        <div className="w-full lg:w-5/12 p-6 sm:p-10 flex flex-col justify-center space-y-6 relative z-10 bg-white/80 dark:bg-slate-900/90 backdrop-blur-xl lg:bg-transparent lg:dark:bg-transparent">
          {/* Top Header */}
          <div className="text-center space-y-3">
            <div className="relative inline-block group lg:hidden">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30">
                <Film className="w-7 h-7 text-white" />
              </div>
              <span className="absolute -bottom-1 -right-1 p-1 rounded-full bg-amber-500 text-slate-950 shadow-md">
                <Sparkles className="w-3 h-3" />
              </span>
            </div>

            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white">
                {isRegister ? 'Create Your Account' : 'Welcome Back'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium mt-1">
                {isRegister ? 'Join BookTicket for VIP booking & rewards' : 'Sign in to access tickets, seats & instant payments'}
              </p>
            </div>
          </div>

          {/* Tab Switcher */}
          <div className="flex bg-slate-100 dark:bg-slate-800/80 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              type="button"
              onClick={() => setIsRegister(false)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                !isRegister
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Sign In
            </button>
            <button
              type="button"
              onClick={() => setIsRegister(true)}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all ${
                isRegister
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              Register
            </button>
          </div>

          {/* Demo Quick 1-Click Accounts */}
          <div className="p-3.5 bg-slate-50/80 dark:bg-slate-800/40 rounded-2xl border border-slate-200 dark:border-slate-800/80 space-y-2">
            <div className="flex items-center justify-between px-1">
              <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-500 animate-bounce" /> Instant Demo Access
              </span>
              <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">1-Click Login</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => fillAndLoginDemo('user')}
                disabled={submitting}
                className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-850 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <User className="w-3.5 h-3.5 text-rose-500" />
                Demo User
              </button>

              <button
                type="button"
                onClick={() => fillAndLoginDemo('admin')}
                disabled={submitting}
                className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5 text-amber-500" />
                Demo Admin
              </button>
            </div>
          </div>

          {/* Form Inputs */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {isRegister && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Full Name</label>
                <div className="relative">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="e.g. Alex Morgan"
                    className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                  />
                  <User className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Email Address</label>
              <div className="relative">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-4 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                />
                <Mail className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-11 pr-11 text-sm font-medium text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all font-mono"
                />
                <Lock className="w-4 h-4 text-slate-400 absolute left-4 top-3.5" />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-3.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {isRegister && (
              <div>
                <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1.5">Account Type</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl p-3 text-sm font-medium text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 transition-all"
                >
                  <option value="user">Standard Movie Enthusiast</option>
                  <option value="admin">Multiplex Administrator</option>
                </select>
              </div>
            )}

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 cursor-pointer"
            >
              {submitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Authenticating...
                </div>
              ) : (
                <>
                  {isRegister ? 'Create VIP Account' : 'Sign In'}
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

