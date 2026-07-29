import React from 'react';
import { Film } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-sm">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                CINE<span className="text-red-600">TICKET</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed max-w-sm">
              Online Cinema & Multiplex Movie Ticket Booking System.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Explore</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><a href="/" className="hover:text-red-600 transition-colors">Now Showing</a></li>
              <li><a href="/" className="hover:text-red-600 transition-colors">Coming Soon</a></li>
              <li><a href="/system-design" className="hover:text-red-600 transition-colors">Architecture Docs</a></li>
            </ul>
          </div>

          {/* Customer Support & Legal */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">Customer Support</h4>
            <ul className="space-y-2 text-xs font-medium text-slate-600">
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-red-600 transition-colors">Help Center & FAQ</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-red-600 transition-colors">Terms of Service</a></li>
              <li><a href="#" onClick={(e) => e.preventDefault()} className="hover:text-red-600 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-500">
          <p>© 2026 CineTicket Project. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
