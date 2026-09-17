import React from 'react';
import { Film, Sparkles } from 'lucide-react';

export default function SeatLayout({ seatLayout = [], selectedSeats = [], onSeatToggle }) {
  const rowsMap = {};
  seatLayout.forEach((seat) => {
    if (!rowsMap[seat.row]) rowsMap[seat.row] = [];
    rowsMap[seat.row].push(seat);
  });
  const sortedRows = Object.keys(rowsMap).sort();

  return (
    <div className="w-full flex flex-col items-center select-none py-4">
      
      {/* 3D Cinema Curved Screen Header */}
      <div className="w-full max-w-xl mb-10 text-center relative">
        <div className="cinema-screen-3d" />
        <div className="flex items-center justify-center gap-2 text-gray-500 text-[10px] font-black uppercase tracking-widest mt-6">
          <Film className="w-3.5 h-3.5 text-[#E50914] animate-pulse" />
          <span>IMAX 4K LASER PROJECTION SCREEN</span>
          <Film className="w-3.5 h-3.5 text-[#E50914] animate-pulse" />
        </div>
      </div>

      {/* Seat Rows Grid Container */}
      <div className="w-full overflow-x-auto no-scrollbar pb-6 flex justify-center">
        <div className="flex flex-col gap-3 min-w-max px-4">
          {sortedRows.map((rowLetter, index) => {
            const isVip = index === 0 || index === 1; // Top 2 rows as VIP
            return (
              <div key={rowLetter} className="flex items-center justify-center gap-3">
                
                {/* Left Row Label */}
                <span className="seat-row-label">{rowLetter}</span>

                {/* Seats */}
                <div className="flex items-center gap-2">
                  {rowsMap[rowLetter]
                    .sort((a, b) => a.number - b.number)
                    .map((seat) => {
                      const seatLabel = `${seat.row}${seat.number}`;
                      const isSelected = selectedSeats.includes(seatLabel);
                      const isBooked = seat.status === 'booked';

                      return (
                        <button
                          key={seatLabel}
                          disabled={isBooked}
                          onClick={() => onSeatToggle(seatLabel)}
                          className={`seat-btn ${
                            isBooked
                              ? 'seat-booked'
                              : isSelected
                              ? 'seat-selected'
                              : 'seat-available'
                          }`}
                          title={`Seat ${seatLabel} — ${isBooked ? 'Booked' : isVip ? 'VIP Recliner' : 'Executive'}`}
                        >
                          {seat.number}
                        </button>
                      );
                    })}
                </div>

                {/* Right Row Label */}
                <span className="seat-row-label">{rowLetter}</span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Seat Category Legend */}
      <div className="w-full max-w-lg mt-6 pt-6 border-t border-white/10 flex items-center justify-around text-xs">
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#191c2b] border border-white/15"></div>
          <span className="text-gray-400 font-semibold">Available</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#E50914] border border-[#FFA3A6] shadow-[0_0_10px_#E50914]"></div>
          <span className="text-white font-bold">Selected</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-5 h-5 rounded-md bg-[#0d0e17] border border-white/5 opacity-50"></div>
          <span className="text-gray-600 font-semibold">Booked</span>
        </div>
      </div>

    </div>
  );
}
