import React, { useState } from 'react';
import { Sparkles } from 'lucide-react';

export default function SeatMap({
  bookedSeats = [],
  lockedSeats = [],
  selectedSeats = [],
  onSeatClick,
  regularPrice = 250.00,
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

  const getSeatInfo = (row) => {
    if (['A', 'B'].includes(row)) {
      return { tier: 'Normal', price: regularPrice };
    } else if (['C', 'D', 'E'].includes(row)) {
      return { tier: 'Deluxe', price: regularPrice + 100 };
    } else {
      return { tier: 'Super', price: vipPrice };
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-8 px-4 sm:px-8 bg-[#070d19]/90 dark:bg-[#040811] rounded-3xl border border-slate-800 shadow-2xl relative overflow-hidden text-slate-200 transition-all duration-300">
      
      {/* 🎬 Seat Legend (Aligned at top) */}
      <div className="w-full flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-400 font-black tracking-wider pb-6 border-b border-slate-800/80 mb-8">
        {/* Left Tiers */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-blue-500/40 bg-blue-500/5"></div>
            <span>Normal (₹{regularPrice.toFixed(0)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-indigo-500/40 bg-indigo-500/5"></div>
            <span>Deluxe ({(regularPrice + 100).toFixed(0)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-purple-500/40 bg-purple-500/5"></div>
            <span>Super (₹{vipPrice.toFixed(0)})</span>
          </div>
        </div>

        {/* Right Statuses */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-[#0b1424]"></div>
            <span>Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded border border-slate-700 bg-transparent"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded bg-amber-500"></div>
            <span className="text-white">Selected</span>
          </div>
        </div>
      </div>

      {/* 🎬 Curved Gold Screen */}
      <div className="relative w-full max-w-xl mb-12 flex flex-col items-center">
        {/* Screen Ambient Glow */}
        <div className="absolute top-2 w-4/5 h-16 bg-amber-500/5 blur-2xl pointer-events-none rounded-b-full"></div>

        {/* Curved Screen Line */}
        <div className="relative w-full h-2 rounded-b-[180px] bg-gradient-to-r from-transparent via-amber-450 to-transparent shadow-[0_4px_16px_rgba(245,158,11,0.25)] border-b-2 border-amber-450/70 flex items-center justify-center z-10">
        </div>

        <p className="text-[10px] font-black tracking-widest text-slate-500 uppercase mt-4 flex items-center gap-1.5 z-10">
          SCREEN THIS WAY
        </p>

        {/* Live Hover Tooltip Display */}
        <div className="h-6 mt-2 flex items-center justify-center z-10">
          {hoveredSeat ? (
            <div className="px-3.5 py-1 rounded-full bg-slate-900/90 text-white text-[10px] font-mono font-black shadow-lg border border-amber-500/30 animate-scale-up">
              Seat {hoveredSeat.id} • <span className="text-amber-400">{hoveredSeat.tier}</span> • <span className="text-emerald-400">₹{hoveredSeat.price.toFixed(0)}</span>
            </div>
          ) : (
            <div className="text-[10px] font-bold text-slate-500 italic">
              Hover over a seat to view details
            </div>
          )}
        </div>
      </div>

      {/* Seat Grid Container */}
      <div className="overflow-x-auto w-full flex justify-center pb-4 z-10">
        <div className="grid gap-3.5 min-w-[620px] max-w-3xl">
          {rows.map((row) => {
            const { tier, price } = getSeatInfo(row);
            const isVipRow = tier === 'Super';
            return (
              <div key={row} className="flex items-center justify-between gap-4">
                {/* Left Row Label */}
                <span className="w-5 text-[10px] font-black text-slate-500 text-center">{row}</span>

                {/* Seat Row */}
                <div className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
                    const seatId = `${row}${seatNum}`;
                    const status = getSeatStatus(seatId);

                    const hasAisle = seatNum === 3 || seatNum === 9; // Aisles like in standard multiplex layouts

                    return (
                      <React.Fragment key={seatId}>
                        {hasAisle && <div className="w-4 sm:w-6"></div>}
                        <button
                          disabled={status === 'booked' || status === 'locked'}
                          onClick={() => onSeatClick(seatId, price, isVipRow)}
                          onMouseEnter={() => setHoveredSeat({ id: seatId, price, tier })}
                          onMouseLeave={() => setHoveredSeat(null)}
                          className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-lg flex items-center justify-center text-[10px] font-black transition-all duration-200 cursor-pointer ${
                            status === 'selected'
                              ? 'bg-amber-500 border-amber-500 text-[#070d19] font-black shadow-lg shadow-amber-500/20 hover:scale-105 active:scale-95'
                              : status === 'booked'
                              ? 'bg-[#0b1424]/90 text-slate-800 border border-transparent cursor-not-allowed'
                              : status === 'locked'
                              ? 'bg-amber-950/30 text-amber-700 border border-amber-900/20 cursor-not-allowed'
                              : tier === 'Super'
                              ? 'border border-purple-500/30 text-purple-400/80 bg-purple-500/2 hover:bg-purple-500/10 hover:text-purple-300 hover:scale-110'
                              : tier === 'Deluxe'
                              ? 'border border-indigo-500/30 text-indigo-400/80 bg-indigo-500/2 hover:bg-indigo-500/10 hover:text-indigo-300 hover:scale-110'
                              : 'border border-blue-500/30 text-blue-400/80 bg-blue-500/2 hover:bg-blue-500/10 hover:text-blue-300 hover:scale-110'
                          }`}
                        >
                          <span>{seatNum}</span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right Row Label */}
                <span className="w-5 text-[10px] font-black text-slate-500 text-center">{row}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
