import React, { useState } from 'react';
import { Film, Mail, Phone, ShieldCheck, Send, CheckCircle2, Smartphone, CreditCard, Download } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

/**
 * Footer component rendered at the bottom of the BookTicket layout.
 * Provides newsletter subscriptions, social links, system security assurances, and copyright declarations.
 */
export default function Footer() {
  const { addToast } = useNotification();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address', 'warning');
      return;
    }
    addToast('Subscribed to BookTicket VIP Deals & Discounts!', 'success');
    setEmail('');
  };

  return (
    <footer className="mt-20 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-400 transition-colors">
      {/* Top Newsletter & App Download Section */}
      <div className="border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-950/50 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            {/* Newsletter Form */}
            <div className="space-y-2">
              <span className="text-[10px] uppercase font-black tracking-widest text-red-600 dark:text-red-400">
                VIP Premiere Pass
              </span>
              <h3 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white">
                Subscribe for Special Discounts & Early Tickets
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Get exclusive promo codes, weekend premiere alerts, and combo vouchers sent directly to your inbox.
              </p>

              <form onSubmit={handleSubscribe} className="pt-2 flex flex-col sm:flex-row gap-2 max-w-md">
                <input
                  type="email"
                  placeholder="Enter your email address..."
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="flex-1 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-xl px-4 py-2.5 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-red-600"
                />
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-md shadow-red-600/20 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  Subscribe
                </button>
              </form>
            </div>

            {/* App Store Download Badges */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-start lg:justify-end gap-4 border-t lg:border-t-0 border-slate-200 dark:border-slate-800 pt-6 lg:pt-0">
              <div className="space-y-1">
                <span className="text-xs font-bold text-slate-900 dark:text-white block">Book on the Go</span>
                <span className="text-[11px] text-slate-500">Download BookTicket App</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
                  <Smartphone className="w-5 h-5 text-red-500" />
                  <div>
                    <span className="text-[9px] block text-slate-400 font-normal">iOS App Store</span>
                    <span>Download App</span>
                  </div>
                </div>
                <div className="px-4 py-2.5 bg-slate-900 dark:bg-slate-800 text-white rounded-xl border border-slate-800 text-xs font-bold flex items-center gap-2 shadow-sm cursor-pointer hover:bg-slate-800 transition-colors">
                  <Download className="w-5 h-5 text-emerald-400" />
                  <div>
                    <span className="text-[9px] block text-slate-400 font-normal">Google Play</span>
                    <span>Get APK</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Links Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-sm">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900 dark:text-white">
                BOOK<span className="text-red-600">TICKET</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
              Online Cinema & Multiplex Movie Ticket Booking System with Real-Time Seat Reservation.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Movies & Showtimes</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li><a href="/" className="hover:text-red-600 transition-colors">Now Showing Movies</a></li>
              <li><a href="/" className="hover:text-red-600 transition-colors">Upcoming Blockbusters</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600 dark:text-slate-400">
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-red-600" />
                <span>support@bookticket.com</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-red-600" />
                <span>+1 (800) 555-CINE (24/7)</span>
              </li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-red-600 transition-colors">Terms of Service & Privacy</a></li>
            </ul>
          </div>

          {/* Payment Options Badges */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider mb-3">Accepted Payment Modes</h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold">
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-red-600" /> VISA
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <CreditCard className="w-3.5 h-3.5 text-amber-500" /> Mastercard
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <Smartphone className="w-3.5 h-3.5 text-emerald-500" /> UPI / QR
              </span>
              <span className="px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-sky-500" /> Net Banking
              </span>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-100 dark:border-slate-800 text-center text-xs text-slate-500 dark:text-slate-400 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 BookTicket Platform. All rights reserved.</p>
          <div className="flex items-center gap-4 text-xs font-medium text-slate-600 dark:text-slate-400">
            <span className="text-emerald-600 dark:text-emerald-400 font-bold flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5" /> Verified Ticketing Gateway
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
