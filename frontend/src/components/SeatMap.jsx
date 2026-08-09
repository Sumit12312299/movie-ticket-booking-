import React, { useState } from 'react';


/**
 * SeatMap manages the visualization of theater auditorium seat selections.
 * @param {Array} props.bookedSeats - Seats already purchased and confirmed
 * @param {Array} props.lockedSeats - Seats temporarily held during ongoing checkouts
 * @param {Array} props.selectedSeats - Seats currently highlighted by the active session
 * @param {function} props.onSeatClick - Click event handler triggered on seat toggle
 */
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
    <div className="w-full flex flex-col items-center py-8 px-4 sm:px-8 bg-white dark:bg-[#070d19]/95 rounded-3xl border border-slate-200 dark:border-slate-800/80 shadow-md dark:shadow-2xl relative overflow-hidden text-slate-800 dark:text-slate-200 transition-all duration-300">
      
      {/* 🎬 Seat Legend (Premium Glass Card) */}
      <div className="w-full bg-slate-50 dark:bg-slate-900/50 p-4 rounded-2xl border border-slate-150 dark:border-slate-800/80 flex flex-wrap justify-between items-center gap-4 text-[11px] text-slate-500 dark:text-slate-400 font-extrabold tracking-wider mb-10">
        {/* Left Tiers */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-cyan-500/40 bg-cyan-500/10"></div>
            <span>Normal (₹{regularPrice.toFixed(0)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-indigo-500/40 bg-indigo-500/10"></div>
            <span>Deluxe (₹{(regularPrice + 100).toFixed(0)})</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-amber-500/40 bg-amber-500/10"></div>
            <span>Super (₹{vipPrice.toFixed(0)})</span>
          </div>
        </div>

        {/* Right Statuses */}
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-slate-200 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 opacity-60"></div>
            <span>Sold</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded border border-slate-305 dark:border-slate-600 bg-transparent"></div>
            <span>Available</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3.5 h-3.5 rounded bg-rose-600 border border-rose-600 shadow-sm"></div>
            <span className="text-slate-900 dark:text-white">Selected</span>
          </div>
        </div>
      </div>

      {/* 🎬 Premium SVG Curved Screen & Lighting */}
      <div className="relative w-full max-w-md mb-10 flex flex-col items-center">
        {/* Projector Light Beam Ambient Projection (No color glow, just subtle neutral light) */}
        <div className="absolute -top-1 w-4/5 h-16 bg-gradient-to-b from-slate-200/50 dark:from-slate-800/20 to-transparent blur-xl pointer-events-none rounded-b-full"></div>

        {/* Curved Screen Line (Minimalist SVG Arc) */}
        <svg className="w-full h-5 text-slate-350 dark:text-slate-700 drop-shadow-sm" viewBox="0 0 120 10" preserveAspectRatio="none">
          <path d="M0,2 Q60,8 120,2" fill="none" stroke="currentColor" strokeWidth="1.5" />
        </svg>

        <p className="text-[9px] font-black tracking-[0.25em] text-slate-400 dark:text-slate-500 uppercase mt-2">
          SCREEN THIS WAY
        </p>

        {/* Live Hover Tooltip Display */}
        <div className="h-6 mt-2.5 flex items-center justify-center z-10">
          {hoveredSeat ? (
            <div className={`px-3 py-1 rounded-full bg-slate-900 dark:bg-slate-950 text-white text-[10px] font-mono font-black shadow-md border ${
              hoveredSeat.tier === 'Super' 
                ? 'border-amber-500/40' 
                : hoveredSeat.tier === 'Deluxe' 
                ? 'border-indigo-500/40' 
                : 'border-cyan-500/40'
            } animate-scale-up`}>
              Seat {hoveredSeat.id} • <span className={
                hoveredSeat.tier === 'Super' 
                  ? 'text-amber-400' 
                  : hoveredSeat.tier === 'Deluxe' 
                  ? 'text-indigo-400' 
                  : 'text-cyan-400'
              }>{hoveredSeat.tier}</span> • <span className="text-emerald-400 font-bold">₹{hoveredSeat.price.toFixed(0)}</span>
            </div>
          ) : (
            <div className="text-[10px] font-bold text-slate-450 dark:text-slate-500 italic">
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
                <span className="w-5 text-[10px] font-black text-slate-400 dark:text-slate-550 text-center">{row}</span>

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
                          className={`group relative w-7 h-7 sm:w-8 sm:h-8 rounded-t-xl rounded-b-[4px] flex items-center justify-center text-[10px] font-black transition-all duration-250 cursor-pointer ${
                            status === 'selected'
                              ? 'bg-rose-600 border border-rose-600 text-white font-black shadow-md hover:scale-105 active:scale-95'
                              : status === 'booked'
                              ? 'bg-slate-200 dark:bg-slate-800/40 text-slate-400 dark:text-slate-600/30 border border-transparent cursor-not-allowed opacity-50'
                              : status === 'locked'
                              ? 'bg-amber-950/20 dark:bg-amber-955/30 text-amber-700 dark:text-amber-600 border border-amber-900/20 cursor-not-allowed'
                              : tier === 'Super'
                              ? 'border border-amber-500/30 dark:border-amber-500/25 text-amber-700 dark:text-amber-400 bg-amber-500/5 hover:bg-amber-500/10 hover:text-amber-800 dark:hover:text-amber-300 hover:border-amber-400 hover:scale-110 shadow-sm'
                              : tier === 'Deluxe'
                              ? 'border border-indigo-500/30 dark:border-indigo-500/25 text-indigo-700 dark:text-indigo-400 bg-indigo-500/5 hover:bg-indigo-500/10 hover:text-indigo-800 dark:hover:text-indigo-300 hover:border-indigo-400 hover:scale-110 shadow-sm'
                              : 'border border-cyan-500/30 dark:border-cyan-500/25 text-cyan-700 dark:text-cyan-400 bg-cyan-500/5 hover:bg-cyan-500/10 hover:text-cyan-800 dark:hover:text-cyan-300 hover:border-cyan-400 hover:scale-110 shadow-sm'
                          }`}
                        >
                          {/* Top Headrest Accent Bar */}
                          {status !== 'booked' && status !== 'locked' && (
                            <span 
                              className={`absolute -top-[1px] left-[15%] right-[15%] h-[3px] rounded-t-full transition-all duration-200 ${
                                status === 'selected' 
                                  ? 'bg-white' 
                                  : tier === 'Super' 
                                  ? 'bg-amber-500/60 dark:bg-amber-400 group-hover:bg-amber-350' 
                                  : tier === 'Deluxe' 
                                  ? 'bg-indigo-500/60 dark:bg-indigo-400 group-hover:bg-indigo-350' 
                                  : 'bg-cyan-500/60 dark:bg-cyan-400 group-hover:bg-cyan-350'
                              }`}
                            ></span>
                          )}

                          {/* Bottom Seat Cushion Accent Bar */}
                          {status !== 'booked' && status !== 'locked' && (
                            <span 
                              className={`absolute bottom-[2px] left-[10%] right-[10%] h-[3.5px] rounded-sm transition-all duration-200 ${
                                status === 'selected' 
                                  ? 'bg-white/40' 
                                  : tier === 'Super' 
                                  ? 'bg-amber-500/20 dark:bg-amber-500/45 group-hover:bg-amber-300' 
                                  : tier === 'Deluxe' 
                                  ? 'bg-indigo-500/20 dark:bg-indigo-500/45 group-hover:bg-indigo-300' 
                                  : 'bg-cyan-500/20 dark:bg-cyan-500/45 group-hover:bg-cyan-300'
                              }`}
                            ></span>
                          )}

                          <span className="relative z-10 -mt-[1px]">{seatNum}</span>
                        </button>
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Right Row Label */}
                <span className="w-5 text-[10px] font-black text-slate-400 dark:text-slate-550 text-center">{row}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
