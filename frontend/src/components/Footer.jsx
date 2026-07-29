import React from 'react';
import { Film, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-200 bg-white text-slate-600">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Info */}
          <div className="space-y-3 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-red-600 flex items-center justify-center shadow-sm">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-black tracking-tight text-slate-900">
                CINE<span className="text-red-600">TICKET</span>
              </span>
            </div>
            <p className="text-xs text-slate-500 leading-relaxed">
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

          {/* System Health */}
          <div>
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider mb-3">System Health</h4>
            <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-ping"></div>
              <div>
                <span className="text-xs font-bold text-emerald-800 block">FastAPI Server Online</span>
                <span className="text-[10px] text-emerald-600">Port 8000 • Async Engine</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-100 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CineTicket Project. All rights reserved.</p>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-red-600 fill-red-600" />
            <span>FastAPI & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
