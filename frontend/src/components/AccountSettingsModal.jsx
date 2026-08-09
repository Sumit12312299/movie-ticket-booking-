import React, { useState } from 'react';
import { X, Settings, User, Mail, MapPin, Save } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function AccountSettingsModal({ isOpen, onClose }) {
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [fullName, setFullName] = useState(user?.full_name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [preferredCity, setPreferredCity] = useState('Mumbai');
  const [isSaving, setIsSaving] = useState(false);

  if (!isOpen) return null;

  const handleSaveSettings = (e) => {
    e.preventDefault();
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      addToast('Profile & preferred cinema location updated successfully!', 'success');
      onClose();
    }, 800);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-sky-600/10 to-blue-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-600 text-white flex items-center justify-center shadow-md">
              <Settings className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white">Account Settings</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Update profile details & cinema preferences</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSaveSettings} className="p-6 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-sky-500" /> Full Name
            </label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-sky-500" /> Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" /> Preferred City / Cinema Region
            </label>
            <select
              value={preferredCity}
              onChange={(e) => setPreferredCity(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500"
            >
              <option value="Mumbai">Mumbai (PVR & IMAX Grand)</option>
              <option value="Delhi NCR">Delhi NCR (PVR Director's Cut)</option>
              <option value="Bengaluru">Bengaluru (IMAX Forum Koramangala)</option>
              <option value="Hyderabad">Hyderabad (Prasads IMAX 4K)</option>
              <option value="Pune">Pune (PVR Phoenix Marketcity)</option>
              <option value="Phagwara">Phagwara (Majestic Grand & PVR Curo Mall)</option>
            </select>
          </div>

          <div className="pt-3">
            <button
              type="submit"
              disabled={isSaving}
              className="w-full py-3.5 rounded-2xl bg-sky-600 hover:bg-sky-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.02]"
            >
              <Save className="w-4 h-4" />
              {isSaving ? 'Saving Changes...' : 'Save Profile Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
