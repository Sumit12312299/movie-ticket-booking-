import React from 'react';
import { Link } from 'react-router-dom';
import { Film, Sparkles, Shield, Heart } from 'lucide-react';

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-[#07080e] border-t border-white/10 mt-20 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Top Partner Showcase */}
        <div className="bg-[#0F111A] border border-white/10 rounded-2xl p-6 flex flex-wrap items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <Film className="w-6 h-6 text-[#E50914]" />
            <div>
              <h4 className="font-bebas text-xl text-white tracking-wider">OFFICIAL CINEMA PARTNER</h4>
              <p className="text-xs text-gray-400">Authorized Ticketing Platform for IMAX 3D, Dolby Atmos & 4K Laser Screens</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs font-black tracking-widest text-[#FFD700]">
            <span className="bg-black/60 px-3 py-1.5 rounded-lg border border-[#FFD700]/30">IMAX 3D</span>
            <span className="bg-black/60 px-3 py-1.5 rounded-lg border border-[#FFD700]/30">DOLBY ATMOS</span>
            <span className="bg-black/60 px-3 py-1.5 rounded-lg border border-[#FFD700]/30">4K LASER</span>
          </div>
        </div>

        {/* Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-2 text-decoration-none">
              <div className="w-8 h-8 rounded-lg bg-[#E50914] flex items-center justify-center text-white">
                <Film className="w-4 h-4" />
              </div>
              <span className="font-bebas text-2xl text-white tracking-wider">
                CINE<span className="text-[#E50914]">PASS</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed">
              India's premier movie ticketing platform. Experience blockbusters with real-time seat visualizers, instant QR passes, and zero booking friction.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h5 className="font-bebas text-lg text-white tracking-wider">QUICK NAVIGATION</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><Link to="/" className="hover:text-[#E50914] transition-colors text-decoration-none">Spotlight Movies</Link></li>
              <li><Link to="/#movies" className="hover:text-[#E50914] transition-colors text-decoration-none">Now Showing</Link></li>
              <li><Link to="/my-bookings" className="hover:text-[#E50914] transition-colors text-decoration-none">My E-Tickets</Link></li>
            </ul>
          </div>

          {/* Experience */}
          <div className="space-y-3">
            <h5 className="font-bebas text-lg text-white tracking-wider">CINEMA TECH</h5>
            <ul className="space-y-2 text-xs text-gray-400">
              <li><span className="text-gray-300">IMAX Enhanced Visuals</span></li>
              <li><span className="text-gray-300">Dolby 7.1 Spatial Audio</span></li>
              <li><span className="text-gray-300">VIP Leather Recliners</span></li>
            </ul>
          </div>

          {/* Newsletter */}
          <div className="space-y-3">
            <h5 className="font-bebas text-lg text-white tracking-wider">PREMIERE NOTIFICATIONS</h5>
            <p className="text-xs text-gray-400">Subscribe for early access tickets & midnight premiere passes.</p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="Enter email..."
                className="w-full bg-[#131624] border border-white/10 rounded-xl px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-[#E50914]"
              />
              <button className="btn-cinema text-xs py-2 px-4 rounded-xl shrink-0">Join</button>
            </div>
          </div>

        </div>

        {/* Bottom copyright */}
        <div className="border-t border-white/10 pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500 gap-4">
          <p>© {year} CINEPASS Inc. All Rights Reserved.</p>
          <p className="flex items-center gap-1">
            <span>Built for Cinema Lovers with</span>
            <Heart className="w-3.5 h-3.5 text-[#E50914] fill-[#E50914]" />
          </p>
        </div>

      </div>
    </footer>
  );
}
