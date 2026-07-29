import React from 'react';
import { Armchair, CheckCircle2 } from 'lucide-react';

export default function SeatMap({
  bookedSeats = [],
  lockedSeats = [],
  selectedSeats = [],
  onSeatClick,
  regularPrice = 12.50,
  vipPrice = 18.00
}) {
  const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
  const seatsPerRow = 12;

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
    <div className="w-full flex flex-col items-center py-6 px-2 sm:px-6 glass-panel rounded-3xl border border-slate-800">
      {/* Screen Indicator */}
      <div className="w-full max-w-2xl mb-12 flex flex-col items-center">
        <div className="w-full h-4 curved-screen mb-3"></div>
        <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">
          ✦ CINEMA SCREEN THIS WAY ✦
        </p>
      </div>

      {/* Seat Grid Container */}
      <div className="overflow-x-auto w-full flex justify-center pb-4">
        <div className="grid gap-2 min-w-[600px] max-w-3xl">
          {rows.map((row) => {
            const isVipRow = getSeatTier(row) === 'VIP';
            return (
              <div key={row} className="flex items-center justify-between gap-3">
                {/* Row Label */}
                <span className="w-6 text-xs font-bold text-slate-400 text-center">{row}</span>

                {/* Seat Row */}
                <div className="flex-1 flex justify-center items-center gap-1.5 sm:gap-2">
                  {Array.from({ length: seatsPerRow }, (_, i) => i + 1).map((seatNum) => {
                    const seatId = `${row}${seatNum}`;
                    const status = getSeatStatus(seatId);
                    const price = isVipRow ? vipPrice : regularPrice;

                    // Add middle aisle gap after 6th seat
                    const hasAisle = seatNum === 6;

                    return (
                      <React.Fragment key={seatId}>
                        <button
                          disabled={status === 'booked' || status === 'locked'}
                          onClick={() => onSeatClick(seatId, price, isVipRow)}
                          className={`group relative w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center text-xs font-bold transition-all duration-200 ${
                            status === 'selected'
                              ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/50 scale-105 border border-rose-400'
                              : status === 'booked'
                              ? 'bg-slate-800/80 text-slate-600 cursor-not-allowed border border-slate-800'
                              : status === 'locked'
                              ? 'bg-amber-950/80 text-amber-600/60 border border-amber-800/50 cursor-not-allowed'
                              : isVipRow
                              ? 'bg-amber-500/10 text-amber-300 hover:bg-amber-500/30 border border-amber-500/30 hover:scale-105'
                              : 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700/60 hover:scale-105'
                          }`}
                          title={`Seat ${seatId} (${isVipRow ? 'VIP $' + vipPrice : 'Standard $' + regularPrice}) - ${status}`}
                        >
                          <Armchair className="w-4 h-4 opacity-70 group-hover:opacity-100" />
                          <span className="absolute text-[9px] font-semibold -bottom-0.5">{seatNum}</span>
                        </button>
                        {hasAisle && <div className="w-4 sm:w-8"></div>}
                      </React.Fragment>
                    );
                  })}
                </div>

                {/* Row Tier Badge */}
                <span
                  className={`w-14 text-[10px] font-bold text-center px-1.5 py-0.5 rounded ${
                    isVipRow ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30' : 'text-slate-500'
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
      <div className="mt-8 pt-6 border-t border-slate-800/80 w-full flex flex-wrap justify-center items-center gap-6 text-xs text-slate-300">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-900 border border-slate-700"></div>
          <span>Available (${regularPrice.toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-amber-500/20 border border-amber-500/40"></div>
          <span>VIP Seat (${vipPrice.toFixed(2)})</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-rose-600 border border-rose-400 shadow-sm shadow-rose-600"></div>
          <span>Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-lg bg-slate-800 border border-slate-800 opacity-60"></div>
          <span>Booked</span>
        </div>
      </div>
    </div>
  );
}
