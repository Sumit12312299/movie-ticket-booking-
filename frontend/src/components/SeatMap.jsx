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
        {/* Projector Light Beam Cone */}
        <div 
          className="absolute -top-10 left-1/2 w-4/5 h-36 pointer-events-none z-0 mix-blend-screen animate-projector opacity-25"
          style={{
            clipPath: 'polygon(45% 0%, 55% 0%, 100% 100%, 0% 100%)',
            background: 'linear-gradient(to bottom, rgba(244, 63, 94, 0.4) 0%, rgba(99, 102, 241, 0.1) 60%, transparent 100%)',
            filter: 'blur(10px)',
          }}
        />

        {/* Cinematic Screen Reflection shadow glow */}
        <div className="absolute top-2 w-3/4 h-20 bg-rose-500/10 dark:bg-rose-500/15 blur-2xl pointer-events-none rounded-b-full"></div>

        {/* Curved IMAX Screen */}
        <div className="relative w-full h-8 rounded-b-[120px] bg-slate-900 via-rose-600 to-amber-300 shadow-[0_12px_28px_rgba(244,63,94,0.35)] border-b-4 border-slate-100 dark:border-amber-300/60 flex items-center justify-center overflow-hidden transition-all duration-500 z-10">
          {/* Moving highlight reflection on screen */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/35 to-transparent animate-[shimmer_4s_infinite_linear] bg-[length:200%_100%]"></div>
          {/* Laser screen border glow line */}
          <div className="w-full h-[2px] bg-rose-500/80 shadow-[0_0_8px_#ff2a5f] mt-auto"></div>
        </div>

        <p className="text-[10px] font-black tracking-widest text-slate-500 dark:text-slate-400 uppercase mt-4 flex items-center gap-1.5 z-10">
          <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" /> IMAX 3D LASER SCREEN <Sparkles className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
        </p>

        {/* Live Hover Tooltip Display */}
        <div className="h-8 mt-2 flex items-center justify-center z-10">
          {hoveredSeat ? (
            <div className="px-4 py-1.5 rounded-full bg-slate-950 text-white text-[11px] font-mono font-black shadow-lg border border-rose-500/30 animate-scale-up">
              {hoveredSeat.id} • <span className="text-amber-400">{hoveredSeat.tier}</span> • <span className="text-rose-400">₹{hoveredSeat.price.toFixed(2)}</span>
            </div>
          ) : (
            <div className="text-[11px] font-bold text-slate-400 dark:text-slate-500 italic">
              Select your seats below
            </div>
          )}
        </div>
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

