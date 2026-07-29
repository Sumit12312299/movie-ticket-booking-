import React, { useState } from 'react';
import { Film, Mail, Phone, Heart, Send, CheckCircle2, Smartphone, CreditCard, Download, ShieldCheck } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

export default function Footer() {
  const { addToast } = useNotification();
  const [email, setEmail] = useState('');

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (!email.trim() || !email.includes('@')) {
      addToast('Please enter a valid email address', 'warning');
      return;
    }
    addToast('Subscribed to BookMyTicket VIP Deals & Movie Vouchers!', 'success');
    setEmail('');
  };

  return (
    <footer className="mt-16 bg-[#222531] text-slate-300 border-t border-slate-700/60">
      {/* BookMyShow Top Support Strip */}
      <div className="border-b border-slate-700/60 py-4 bg-[#1f2533]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2 text-white">
            <Film className="w-5 h-5 text-[#f84464]" />
            <span>List your Show — Got a show, event, activity or a great experience? Partner with BookMyTicket</span>
          </div>

          <button
            onClick={() => addToast('Partner request submitted!', 'info')}
            className="px-4 py-1.5 rounded-md bg-[#f84464] hover:bg-[#e03352] text-white font-bold transition-colors"
          >
            Contact Today
          </button>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-[#f84464] flex items-center justify-center shadow-sm">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-white">
                book<span className="text-[#f84464]">my</span>ticket
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              BookMyTicket is India's leading entertainment ticketing platform for movies, live events, sports, and plays.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Movies Now Showing</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li><a href="/" className="hover:text-[#f84464] transition-colors">Dune: Part Two</a></li>
              <li><a href="/" className="hover:text-[#f84464] transition-colors">Deadpool & Wolverine</a></li>
              <li><a href="/" className="hover:text-[#f84464] transition-colors">Oppenheimer</a></li>
              <li><a href="/" className="hover:text-[#f84464] transition-colors">Interstellar Remastered</a></li>
            </ul>
          </div>

          {/* Customer Support */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">24/7 Customer Care</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-400">
              <li className="flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-[#f84464]" />
                <span>helpdesk@bookmyticket.com</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Phone className="w-3.5 h-3.5 text-[#f84464]" />
                <span>+91 (022) 6144-5000</span>
              </li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-[#f84464] transition-colors">Resend Booking Confirmation</a></li>
            </ul>
          </div>

          {/* Payment Badges */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-3">Secure Payment Options</h4>
            <div className="flex flex-wrap gap-2 text-[11px] font-bold text-slate-300">
              <span className="px-3 py-1.5 rounded bg-[#1f2533] border border-slate-700">VISA</span>
              <span className="px-3 py-1.5 rounded bg-[#1f2533] border border-slate-700">Mastercard</span>
              <span className="px-3 py-1.5 rounded bg-[#1f2533] border border-slate-700">BHIM UPI</span>
              <span className="px-3 py-1.5 rounded bg-[#1f2533] border border-slate-700">Net Banking</span>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-700/60 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 BookMyTicket Entertainment Pvt. Ltd. All Rights Reserved.</p>
          <div className="flex items-center gap-2 text-emerald-400 font-semibold">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>100% Safe & Verified Cinema Booking</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
