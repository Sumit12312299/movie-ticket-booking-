import React, { useState } from 'react';
import { QrCode, Calendar, MapPin, Printer, CheckCircle2, Film, Scan } from 'lucide-react';

/**
 * TicketPass renders the printable E-Ticket layout.
 * Visual design resembles a real boarding pass with dynamic booking fields,
 * interactive 3D card tilt animation, and simulated scanning QR Code.
 */
export default function TicketPass({ booking }) {
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);

  if (!booking) return null;

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left - rect.width / 2;
    const y = e.clientY - rect.top - rect.height / 2;
    setRotateX((-y / rect.height) * 12);
    setRotateY((x / rect.width) * 12);
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: rotateX === 0 ? 'all 0.5s ease' : 'none'
      }}
      className="w-full max-w-md mx-auto bg-white dark:bg-slate-900 rounded-3xl overflow-hidden border border-slate-200/80 dark:border-slate-800 shadow-2xl relative group transition-colors cursor-pointer"
    >
      {/* Holographic Metallic Sheen Effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-rose-500/10 via-amber-500/10 to-sky-500/10 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20"></div>

      {/* Top Red Accent Gradient Bar */}
      <div className="h-3 bg-gradient-to-r from-red-600 via-rose-500 to-amber-500"></div>

      <div className="p-6 space-y-6 relative z-10">
        {/* Header Branding & Status */}
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
          <div className="space-y-1 text-left">
            <span className="text-[10px] uppercase font-black tracking-widest text-rose-600 dark:text-rose-400 flex items-center gap-1">
              <Film className="w-3 h-3" />
              VIP Digital Pass
            </span>
            <h3 className="text-xl font-extrabold text-slate-900 dark:text-white leading-tight">{booking.movie_title}</h3>
          </div>
          <div className="flex flex-col items-end gap-1">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider bg-emerald-100 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 border border-emerald-300 dark:border-emerald-700 flex items-center gap-1 shadow-sm">
              <CheckCircle2 className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
              {booking.status}
            </span>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono font-bold">{booking.booking_reference}</span>
          </div>
        </div>

        {/* Showtime & Venue Details */}
        <div className="grid grid-cols-2 gap-3 bg-slate-50 dark:bg-slate-800/60 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Venue</span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white leading-snug">{booking.theater_name}</p>
            <span className="text-[10px] font-bold text-amber-600 dark:text-amber-400 inline-block bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/30">
              {booking.screen_type}
            </span>
          </div>

          <div className="space-y-1 border-l border-slate-200 dark:border-slate-700/60 pl-3">
            <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-red-600 dark:text-red-400" />
              <span className="font-extrabold text-slate-700 dark:text-slate-300 uppercase text-[10px]">Date & Time</span>
            </div>
            <p className="text-xs font-black text-slate-900 dark:text-white">{booking.show_date}</p>
            <p className="text-xs font-black text-rose-600 dark:text-rose-400 font-mono">{booking.show_time}</p>
          </div>
        </div>

        {/* Seat Allocation & Price */}
        <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl border border-slate-200 dark:border-slate-800 text-left">
          <div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block tracking-wider">Allocated Seats</span>
            <div className="flex flex-wrap gap-1.5 mt-1.5">
              {(booking.seats || []).map((seat) => (
                <span
                  key={seat}
                  className="px-2.5 py-1 rounded-lg bg-red-600/10 dark:bg-red-950/50 text-red-600 dark:text-rose-400 border border-red-300 dark:border-red-800 text-xs font-black font-mono shadow-sm"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-bold uppercase block tracking-wider">Total Paid</span>
            <span className="text-xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{booking.total_amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* Ticket Perforation / Cut Notch Divider */}
        <div className="relative flex items-center justify-center my-2">
          <div className="w-5 h-5 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 absolute -left-8"></div>
          <div className="w-full border-t-2 border-dashed border-slate-300 dark:border-slate-700"></div>
          <div className="w-5 h-5 bg-slate-100 dark:bg-slate-950 rounded-full border border-slate-200 dark:border-slate-800 absolute -right-8"></div>
        </div>

        {/* QR Code Section with Laser Scanning Beam */}
        <div className="relative overflow-hidden flex flex-col items-center justify-center p-4 bg-white rounded-2xl border border-slate-200 dark:border-slate-800 text-slate-900 shadow-inner group/qr">
          {/* Laser beam scanner line */}
          <div className="absolute left-0 right-0 h-0.5 bg-rose-500 shadow-lg shadow-rose-500 animate-pulse pointer-events-none top-4 group-hover/qr:top-[85%] transition-all duration-1000 ease-in-out"></div>

          {booking.qr_code_data ? (
            <img src={booking.qr_code_data} alt="Ticket QR Code" className="w-36 h-36 object-contain" />
          ) : (
            <QrCode className="w-32 h-32 text-slate-800" />
          )}
          <span className="text-[10px] font-mono font-bold tracking-widest text-slate-600 mt-2 uppercase flex items-center gap-1">
            <Scan className="w-3 h-3 text-rose-500" /> SCAN AT CINEMA GATE • {booking.booking_reference}
          </span>
        </div>

        {/* Action Controls */}
        <div className="pt-1">
          <button
            onClick={handlePrint}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white text-xs font-black flex items-center justify-center gap-2 transition-all shadow-lg shadow-red-600/30 hover:scale-[1.02]"
          >
            <Printer className="w-4 h-4 text-white" />
            Print E-Ticket Pass
          </button>
        </div>
      </div>
    </div>
  );
}

