import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Film, Lock, Mail, User, ShieldCheck, ArrowRight, KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AuthPage() {
  const [isRegister, setIsRegister] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
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

  const fillDemoAccount = (type) => {
    if (type === 'admin') {
      setEmail('admin@cineticket.com');
      setPassword('admin123');
    } else {
      setEmail('user@cineticket.com');
      setPassword('user123');
    }
    setIsRegister(false);
  };

  return (
    <div className="max-w-md mx-auto py-12 pb-20">
      <div className="glass-card rounded-3xl p-8 border border-rose-500/30 shadow-2xl space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center mx-auto shadow-xl shadow-rose-600/30">
            <Film className="w-7 h-7 text-white" />
          </div>
          <h2 className="text-2xl font-black text-white">
            {isRegister ? 'Create Your Account' : 'Welcome Back'}
          </h2>
          <p className="text-xs text-slate-400">
            {isRegister ? 'Register to book movies & save favorites' : 'Sign in to access tickets and seat bookings'}
          </p>
        </div>

        {/* Demo Quick Fill Buttons */}
        <div className="p-3 bg-slate-900/90 rounded-2xl border border-slate-800 space-y-2">
          <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider block text-center">
            ⚡ Quick Demo Accounts
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => fillDemoAccount('user')}
              className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-200 border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-rose-500" />
              Demo User
            </button>

            <button
              onClick={() => fillDemoAccount('admin')}
              className="py-2 px-3 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-xs font-bold text-amber-300 border border-amber-500/30 flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
              Demo Admin
            </button>
          </div>
        </div>

        {/* Auth Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Full Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  placeholder="e.g. Alex Johnson"
                  className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
                />
                <User className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@domain.com"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-400 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-900 border border-slate-800 rounded-xl py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              />
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3.5" />
            </div>
          </div>

          {isRegister && (
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Account Role</label>
              <select
                value={role}
                onChange={(e) => setRole(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value="user">Standard User</option>
                <option value="admin">Administrator</option>
              </select>
            </div>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 transition-all hover:scale-[1.02]"
          >
            {submitting ? 'Please wait...' : isRegister ? 'Create Account' : 'Sign In'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="pt-4 border-t border-slate-800 text-center">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-slate-400 hover:text-rose-400 font-medium transition-colors"
          >
            {isRegister ? 'Already have an account? Sign In' : "Don't have an account? Register Now"}
          </button>
        </div>
      </div>
    </div>
  );
}
