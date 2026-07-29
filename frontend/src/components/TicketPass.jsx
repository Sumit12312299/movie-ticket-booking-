import React from 'react';
import { QrCode, Ticket, Calendar, Clock, MapPin, Printer, Download, CheckCircle2 } from 'lucide-react';

export default function TicketPass({ booking }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-md mx-auto glass-card rounded-3xl overflow-hidden border border-rose-500/40 shadow-2xl relative group">
      {/* Top Banner Accent */}
      <div className="h-3 bg-gradient-to-r from-rose-600 via-amber-500 to-rose-600"></div>

      <div className="p-6 space-y-6">
        {/* Header Branding & Status */}
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <span className="text-xs uppercase font-bold tracking-widest text-slate-400">Digital E-Ticket Pass</span>
            <h3 className="text-xl font-extrabold text-white leading-tight mt-0.5">{booking.movie_title}</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-black tracking-wider bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              {booking.status}
            </span>
            <span className="text-[10px] text-slate-400 mt-1 font-mono">{booking.booking_reference}</span>
          </div>
        </div>

        {/* Showtime Details */}
        <div className="grid grid-cols-2 gap-4 bg-slate-900/80 p-4 rounded-2xl border border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-semibold text-slate-200">Venue</span>
            </div>
            <p className="text-xs font-bold text-white leading-tight">{booking.theater_name}</p>
            <span className="text-[10px] text-amber-400 font-semibold">{booking.screen_type}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Calendar className="w-3.5 h-3.5 text-rose-500" />
              <span className="font-semibold text-slate-200">Date & Time</span>
            </div>
            <p className="text-xs font-bold text-white">{booking.show_date}</p>
            <p className="text-xs font-semibold text-rose-400">{booking.show_time}</p>
          </div>
        </div>

        {/* Seat Allocation & Price */}
        <div className="flex items-center justify-between p-4 bg-slate-900/60 rounded-2xl border border-slate-800">
          <div>
            <span className="text-xs text-slate-400 block">Allocated Seats</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {booking.seats.map((seat) => (
                <span
                  key={seat}
                  className="px-2.5 py-1 rounded-lg bg-rose-600/20 text-rose-300 border border-rose-500/40 text-xs font-bold font-mono"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-400 block">Total Paid</span>
            <span className="text-lg font-black text-emerald-400 font-mono">
              ${booking.total_amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-inner text-slate-900">
          {booking.qr_code_data ? (
            <img src={booking.qr_code_data} alt="Ticket QR Code" className="w-32 h-32 object-contain" />
          ) : (
            <QrCode className="w-28 h-28 text-slate-800" />
          )}
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-600 mt-2 uppercase">
            SCAN AT CINEMA GATE • {booking.booking_reference}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={handlePrint}
            className="flex-1 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 text-xs font-bold flex items-center justify-center gap-2 border border-slate-800 transition-all"
          >
            <Printer className="w-4 h-4 text-rose-400" />
            Print Ticket
          </button>
        </div>
      </div>
    </div>
  );
}
