import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Ticket, Calendar, Clock, MapPin, Download, Home } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const { booking, payment } = location.state || {};

  if (!booking) {
    return (
      <div className="text-center py-12 text-slate-400">
        No booking data found. Go to{' '}
        <Link to="/my-bookings" className="text-indigo-400 underline">
          My Bookings
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="max-w-xl mx-auto space-y-8 animate-slideUp py-8 px-4">
      {/* Success Banner */}
      <div className="text-center space-y-3">
        <div className="w-16 h-16 bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 rounded-full flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/20">
          <CheckCircle className="w-10 h-10" />
        </div>
        <h1 className="text-3xl font-extrabold text-white">Booking Confirmed!</h1>
        <p className="text-xs text-slate-400">
          Your tickets have been reserved. Confirmation details sent to your registered email.
        </p>
      </div>

      {/* Ticket Card Container */}
      <div id="printable-ticket" className="glass-card overflow-hidden border border-indigo-500/30 shadow-2xl">
        {/* Ticket Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 p-6 text-white flex justify-between items-center">
          <div>
            <h2 className="text-xl font-bold">{booking.movie_title}</h2>
            <p className="text-xs text-indigo-100 mt-0.5">{booking.theatre_name}</p>
          </div>
          <Ticket className="w-8 h-8 text-indigo-200" />
        </div>

        {/* Ticket Body */}
        <div className="p-6 space-y-4 text-xs">
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-slate-500 font-medium block">Booking ID</span>
              <span className="text-slate-200 font-bold text-sm font-mono">{booking.id}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Transaction ID</span>
              <span className="text-slate-200 font-mono">{payment?.transaction_id || 'N/A'}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-800">
            <div>
              <span className="text-slate-500 font-medium block">Seats</span>
              <span className="text-indigo-400 font-extrabold text-sm">{booking.seats?.join(', ')}</span>
            </div>
            <div>
              <span className="text-slate-500 font-medium block">Total Paid</span>
              <span className="text-emerald-400 font-bold text-sm">₹{booking.total_amount}</span>
            </div>
          </div>

          {/* QR Code Placeholder */}
          <div className="pt-2 flex flex-col items-center justify-center space-y-2">
            <div className="w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-md">
              {/* Simulated QR Code SVG */}
              <svg className="w-full h-full text-slate-900" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,2H10V10H2V2M4,4V8H8V4H4M14,2H22V10H14V2M16,4V8H20V4H16M2,14H10V22H2V14M4,16V20H8V16H4M14,14H18V18H14V14M18,18H22V22H18V18M14,18H18V22H14V18" />
              </svg>
            </div>
            <span className="text-[10px] text-slate-500">Scan at entrance gate</span>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <button
          onClick={handlePrint}
          className="btn-primary flex-1 py-3 text-xs font-semibold flex items-center justify-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Download / Print Ticket</span>
        </button>

        <Link
          to="/"
          className="glass-card flex-1 py-3 text-xs font-semibold text-center text-slate-300 hover:text-white flex items-center justify-center space-x-2"
        >
          <Home className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
