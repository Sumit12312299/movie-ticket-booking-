import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle2, Ticket, ArrowLeft } from 'lucide-react';
import TicketPass from '../components/TicketPass';

export default function BookingConfirmationPage() {
  const location = useLocation();
  const booking = location.state?.booking;

  if (!booking) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-300">No Booking Information Found</h2>
        <Link to="/dashboard" className="px-6 py-2.5 rounded-xl bg-rose-600 text-white text-xs font-bold">
          View My Bookings
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8 pb-16 text-center">
      <div className="space-y-3">
        <div className="w-16 h-16 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center mx-auto shadow-2xl animate-bounce">
          <CheckCircle2 className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Booking Confirmed!</h1>
        <p className="text-xs text-slate-400">
          Your movie tickets have been issued. Show this digital pass or QR code at the theater entrance.
        </p>
      </div>

      {/* Ticket Pass Preview */}
      <TicketPass booking={booking} />

      <div className="pt-4 flex justify-center gap-4">
        <Link
          to="/dashboard"
          className="px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-300 text-xs font-bold flex items-center gap-2 border border-slate-800"
        >
          <Ticket className="w-4 h-4 text-rose-500" />
          View All My Bookings
        </Link>

        <Link
          to="/"
          className="px-6 py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold flex items-center gap-2 shadow-lg shadow-rose-600/30"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    </div>
  );
}
