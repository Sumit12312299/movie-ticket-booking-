import React from 'react';
import { Film, ShieldCheck, Cpu, Database, Heart } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-slate-900 bg-slate-950/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-500 flex items-center justify-center shadow-md">
                <Film className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-bold tracking-wider text-white">
                CINE<span className="text-rose-500">TICKET</span>
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Full Stack Movie Ticket Booking Platform powered by FastAPI, Async MongoDB, React, & Tailwind CSS.
            </p>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Quick Navigation</h4>
            <ul className="space-y-2 text-xs text-slate-400">
              <li><a href="/" className="hover:text-rose-400 transition-colors">Now Showing</a></li>
              <li><a href="/" className="hover:text-rose-400 transition-colors">Coming Soon</a></li>
              <li><a href="/system-design" className="hover:text-amber-400 transition-colors">System Architecture</a></li>
              <li><a href="/admin" className="hover:text-rose-400 transition-colors">Admin Dashboard</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">Technology Stack</h4>
            <div className="flex flex-wrap gap-2 text-[11px]">
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">FastAPI</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">MongoDB</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">React 19</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">Tailwind CSS</span>
              <span className="px-2.5 py-1 rounded-md bg-slate-900 border border-slate-800 text-slate-300">JWT Auth</span>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-3">API Health</h4>
            <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 flex items-center gap-3">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping"></div>
              <div>
                <span className="text-xs font-semibold text-emerald-400 block">FastAPI Server Online</span>
                <span className="text-[10px] text-slate-400">Port 8000 • Async MongoDB</span>
              </div>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-900/80 text-center text-xs text-slate-500 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p>© 2026 CineTicket Project. Created for Full Stack Engineering Showcase.</p>
          <div className="flex items-center gap-2 text-slate-400">
            <span>Built with</span>
            <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" />
            <span>FastAPI & React</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
