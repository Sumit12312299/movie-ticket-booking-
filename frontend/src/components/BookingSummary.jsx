import React from 'react';
import { Ticket, Calendar, Clock, Film, Sparkles } from 'lucide-react';

export default function BookingSummary({ show, selectedSeats = [], onProceed, loading = false }) {
  const price = show?.price || 0;
  const subtotal = price * selectedSeats.length;
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalAmount = subtotal + convenienceFee;

  const showDate = show?.show_time ? new Date(show.show_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';
  const showTime = show?.show_time ? new Date(show.show_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="bg-[#0F111A] border border-white/15 rounded-3xl p-6 shadow-2xl flex flex-col justify-between space-y-6">
      <div className="space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Ticket className="w-5 h-5 text-[#E50914]" />
            <h3 className="font-bebas text-2xl text-white tracking-wide">BOOKING SUMMARY</h3>
          </div>
          <span className="text-[10px] font-black text-[#FFD700] bg-[#FFD700]/10 border border-[#FFD700]/30 px-2 py-0.5 rounded uppercase">
            IMAX PASS
          </span>
        </div>

        {/* Movie Info */}
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Film className="w-5 h-5 text-[#E50914] shrink-0 mt-1" />
            <div>
              <h4 className="font-bebas text-xl text-white tracking-wide">{show?.movie_title}</h4>
              <p className="text-xs text-gray-400 font-medium">{show?.theatre_name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-300 font-semibold pl-8">
            <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5 text-[#00E5FF]" /> {showDate}</span>
            <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5 text-[#FFD700]" /> {showTime}</span>
          </div>

          {/* Selected Seat Badges */}
          {selectedSeats.length > 0 && (
            <div className="pl-8 pt-3 border-t border-white/5 space-y-2">
              <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider block">Selected Seats ({selectedSeats.length})</span>
              <div className="flex flex-wrap gap-1.5">
                {selectedSeats.map((seat) => (
                  <span key={seat} className="bg-[#E50914]/20 border border-[#E50914]/50 text-white font-extrabold text-xs px-2.5 py-1 rounded-md shadow-sm">
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price Breakdown */}
        <div className="border-t border-white/10 pt-4 space-y-2.5 text-xs">
          <div className="flex justify-between text-gray-400">
            <span>Ticket Price ({selectedSeats.length} × ₹{price})</span>
            <span className="text-white font-bold">₹{subtotal}</span>
          </div>
          {selectedSeats.length > 0 && (
            <div className="flex justify-between text-gray-400">
              <span>Convenience & Dolby Fee</span>
              <span className="text-white font-bold">₹{convenienceFee}</span>
            </div>
          )}
          <div className="flex justify-between items-center border-t border-white/10 pt-3 text-sm">
            <span className="font-bebas text-lg text-white tracking-wide">TOTAL PAYABLE</span>
            <span className="font-bebas text-2xl text-[#E50914] text-glow-red">₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <button
        onClick={onProceed}
        disabled={selectedSeats.length === 0 || loading}
        className="btn-cinema w-full py-3.5 text-sm flex items-center justify-center gap-2 rounded-xl disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <Ticket className="w-4 h-4" />
        <span>{loading ? 'Processing...' : `PROCEED TO CHECKOUT (₹${totalAmount})`}</span>
      </button>
    </div>
  );
}
