import React, { useState } from 'react';
import { Armchair, Sparkles } from 'lucide-react';

export default function SeatMap({
  bookedSeats = [],
  lockedSeats = [],
  selectedSeats = [],
  onSeatClick,
  regularPrice = 350.00,
  vipPrice = 550.00
}) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;
  const [hoveredSeat, setHoveredSeat] = useState(null);

  const getSeatStatus = (seatId) => {
    if (bookedSeats.includes(seatId)) return 'booked';
    if (lockedSeats.includes(seatId)) return 'locked';
    if (selectedSeats.includes(seatId)) return 'selected';
    return 'available';
  };

  const getSeatTier = (row) => {
    return ['G', 'H'].includes(row) ? 'VIP' : 'Regular';
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4 sm:px-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl transition-colors">
      {/* 🎬 3D Curved Screen & Projection Light Rays */}
      <div className="relative w-full max-w-2xl mb-12 flex flex-col items-center">
        {/* Light Beam Cone Projection Gradient */}
        <div className="absolute -top-4 w-3/4 h-24 bg-gradient-to-b from-rose-500/20 via-sky-500/10 to-transparent blur-xl pointer-events-none rounded-t-full"></div>

        {/* Curved Screen Curve */}
        <div className="relative w-full h-6 rounded-b-[100px] bg-gradient-to-b from-rose-500 via-rose-400 to-amber-200 shadow-2xl shadow-rose-500/50 border-b-2 border-white/60 dark:border-amber-300/40 flex items-center justify-center overflow-hidden">
          <div className="w-full h-full bg-gradient-to-r from-transparent via-white/50 to-transparent animate-pulse"></div>
        </div>

        <p className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-3 flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-rose-500" /> CINEMA 4K SCREEN THIS WAY <Sparkles className="w-3.5 h-3.5 text-rose-500" />
        </p>

        {/* Live Hover Tooltip Display */}
        {hoveredSeat && (
          <div className="mt-2 px-3 py-1 rounded-full bg-slate-900 text-white text-[11px] font-mono font-bold shadow-md border border-slate-700 animate-fade-in">
            {hoveredSeat.id} • {hoveredSeat.tier} • ₹{hoveredSeat.price.toFixed(2)}
          </div>
        )}
      </div>

      {/* Seat Grid Container */}
      <div className="overflow-x-auto w-full flex justify-center pb-4">
        <div className="grid gap-3 min-w-[600px] max-w-3xl">
          {rows.map((row) => {
            const isVipRow = getSeatTier(row) === 'VIP';
            return (
              <div key={row} className="flex items-center justify-between gap-3">
                {/* Row Label */}
                <span className="w-6 text-xs font-black text-slate-500 dark:text-slate-400 text-center">{row}</span>

                {/* Seat Row */}
                <div className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2.5">
                  {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
                    const seatId = `${row}${seatNum}`;
                    const status = getSeatStatus(seatId);
                    const price = isVipRow ? vipPrice : regularPrice;
                    const tier = isVipRow ? 'VIP Recliner' : 'Standard Cinema';

                    const hasAisle = seatNum === 6;

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          disabled={status === 'booked' || status === 'locked'}
                          onClick={() => onSeatClick(seatId, price, isVipRow)}
                          onMouseEnter={() => setHoveredSeat({ id: seatId, price, tier })}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`group relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                            status === 'selected'
                              ? 'bg-gradient-to-tr from-red-600 to-rose-500 text-white shadow-lg shadow-rose-600/40 scale-110 border-2 border-white dark:border-slate-900 ring-2 ring-rose-500/50'
                              : status === 'booked'
                              ? 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-600 cursor-not-allowed border border-slate-300 dark:border-slate-800'
                              : status === 'locked'
                              ? 'bg-amber-100 dark:bg-amber-950/40 text-amber-600 border border-amber-300 dark:border-amber-700 cursor-not-allowed'
                              : isVipRow
                              ? 'bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/40 hover:bg-amber-500/20 hover:scale-110 shadow-xs'
                              : 'bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 border border-slate-200 dark:border-slate-700 hover:bg-slate-200 dark:hover:bg-slate-700 hover:scale-110 shadow-xs'
                          }`}
                        >
                          <Armchair className="w-4 h-4 opacity-70 group-hover:opacity-100 transition-opacity" />
                          <span className="absolute text-[8px] font-black -bottom-0.5">{seatNum}</span>
                        </button>
                        {hasAisle && <div className="w-4 sm:w-8"></div>}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Tier Badge */}
                <span
                  className={`w-14 text-[10px] font-extrabold text-center px-1.5 py-0.5 rounded-full ${
                    isVipRow
                      ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  {isVipRow ? 'VIP' : 'Std'}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Legend */}
      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-800 w-full flex flex-wrap justify-center items-center gap-6 text-xs text-slate-600 dark:text-slate-400 font-bold">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700"></div>
          <span>Available (₹{regularPrice.toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-amber-500/20 border border-amber-500/40 text-amber-500"></div>
          <span>VIP Recliner (₹{vipPrice.toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-rose-600 border border-rose-600 shadow-md"></div>
          <span className="font-extrabold text-slate-900 dark:text-white">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-800"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}

