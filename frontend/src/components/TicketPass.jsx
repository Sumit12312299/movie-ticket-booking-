import React from 'react';
import { QrCode, Ticket, Calendar, Clock, MapPin, Printer, CheckCircle2 } from 'lucide-react';

export default function TicketPass({ booking }) {
  if (!booking) return null;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-xl relative group">
      {/* Top Red Accent Banner */}
      <div className="h-3 bg-red-600"></div>

      <div className="p-6 space-y-6">
        {/* Header Branding & Status */}
        <div className="flex items-center justify-between border-b border-slate-100 pb-4">
          <div>
            <span className="text-[10px] uppercase font-bold tracking-widest text-slate-500">Digital E-Ticket Pass</span>
            <h3 className="text-xl font-extrabold text-slate-900 leading-tight mt-0.5">{booking.movie_title}</h3>
          </div>
          <div className="flex flex-col items-end">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold tracking-wider bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {booking.status}
            </span>
            <span className="text-[10px] text-slate-500 mt-1 font-mono font-semibold">{booking.booking_reference}</span>
          </div>
        </div>

        {/* Showtime Details */}
        <div className="grid grid-cols-2 gap-4 bg-slate-50 p-4 rounded-2xl border border-slate-200">
          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <MapPin className="w-3.5 h-3.5 text-red-600" />
              <span className="font-bold text-slate-700">Venue</span>
            </div>
            <p className="text-xs font-bold text-slate-900 leading-tight">{booking.theater_name}</p>
            <span className="text-[10px] text-amber-700 font-semibold">{booking.screen_type}</span>
          </div>

          <div className="space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-slate-500">
              <Calendar className="w-3.5 h-3.5 text-red-600" />
              <span className="font-bold text-slate-700">Date & Time</span>
            </div>
            <p className="text-xs font-bold text-slate-900">{booking.show_date}</p>
            <p className="text-xs font-bold text-red-600">{booking.show_time}</p>
          </div>
        </div>

        {/* Seat Allocation & Price */}
        <div className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-200">
          <div>
            <span className="text-xs text-slate-500 font-medium block">Allocated Seats</span>
            <div className="flex flex-wrap gap-1.5 mt-1">
              {booking.seats.map((seat) => (
                <span
                  key={seat}
                  className="px-2.5 py-1 rounded-lg bg-red-50 text-red-700 border border-red-200 text-xs font-bold font-mono"
                >
                  {seat}
                </span>
              ))}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs text-slate-500 font-medium block">Total Paid</span>
            <span className="text-lg font-black text-emerald-600 font-mono">
              ${booking.total_amount.toFixed(2)}
            </span>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="flex flex-col items-center justify-center p-4 bg-slate-100 rounded-2xl border border-slate-200 text-slate-900">
          {booking.qr_code_data ? (
            <img src={booking.qr_code_data} alt="Ticket QR Code" className="w-32 h-32 object-contain" />
          ) : (
            <QrCode className="w-28 h-28 text-slate-800" />
          )}
          <span className="text-[11px] font-mono font-bold tracking-widest text-slate-700 mt-2 uppercase">
            SCAN AT CINEMA GATE • {booking.booking_reference}
          </span>
        </div>

        {/* Action Controls */}
        <div className="pt-2">
          <button
            onClick={handlePrint}
            className="w-full py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Printer className="w-4 h-4 text-red-400" />
            Print E-Ticket Pass
          </button>
        </div>
      </div>
    </div>
  );
}
