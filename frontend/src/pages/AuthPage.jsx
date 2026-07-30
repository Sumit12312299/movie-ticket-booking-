import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, ShieldCheck, ArrowRight, Sparkles, Eye, EyeOff, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [role, setRole] = useState('user');
  const [submitting, setSubmitting] = useState(false);

  const { login, register } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      if (isRegister) {
        await register(fullName, email, password, role);
        addToast('Account created successfully! Welcome to CineTicket.', 'success');
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
    const demoEmail = type === 'admin' ? 'admin@cineticket.com' : 'user@cineticket.com';
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

  return (
    <div className="relative min-h-[80vh] flex items-center justify-center py-12 px-4 overflow-hidden">
      {/* Ambient background glow circles */}
      <div className="absolute top-10 left-1/2 -translate-x-1/2 w-96 h-96 bg-gradient-to-tr from-rose-600/20 to-amber-500/20 rounded-full blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-rose-600/10 rounded-full blur-3xl pointer-events-none"></div>

      <div className="relative w-full max-w-md bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-3xl p-8 border border-slate-200/80 dark:border-slate-800 shadow-2xl space-y-6 animate-scale-up">
        {/* Top Header */}
        <div className="text-center space-y-3">
          <div className="relative inline-block group">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-red-600 via-rose-500 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30 group-hover:scale-105 transition-transform duration-300">
              <Film className="w-8 h-8 text-white" />
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
              {isRegister ? 'Join CineTicket for VIP booking & exclusive rewards' : 'Sign in to access tickets, seats & instant payments'}
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
                ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/20'
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
                ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/20'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Register
          </button>
        </div>

        {/* Demo Quick 1-Click Accounts */}
        <div className="p-3.5 bg-gradient-to-r from-slate-50 to-slate-100 dark:from-slate-800/40 dark:to-slate-800/80 rounded-2xl border border-slate-200 dark:border-slate-800 space-y-2">
          <div className="flex items-center justify-between px-1">
            <span className="text-[10px] uppercase font-black tracking-widest text-slate-500 dark:text-slate-400 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-amber-500" /> Instant Demo Access
            </span>
            <span className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold">1-Click Auto Login</span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => fillAndLoginDemo('user')}
              disabled={submitting}
              className="py-2.5 px-3 rounded-xl bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200 border border-slate-200 dark:border-slate-700/80 flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <User className="w-3.5 h-3.5 text-rose-500" />
              Demo User
            </button>

            <button
              type="button"
              onClick={() => fillAndLoginDemo('admin')}
              disabled={submitting}
              className="py-2.5 px-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-xs font-bold text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center justify-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95"
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
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50"
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
  );
}

