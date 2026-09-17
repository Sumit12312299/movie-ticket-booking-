import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { CheckCircle, Ticket, Calendar, Clock, MapPin, Download, Home, Film, Sparkles, QrCode } from 'lucide-react';

export default function BookingSuccess() {
  const location = useLocation();
  const { booking, payment } = location.state || {};

  if (!booking) {
    return (
      <div className="text-center py-20 text-gray-400 font-bebas text-2xl">
        No active booking found. View your saved tickets in{' '}
        <Link to="/my-bookings" className="text-[#E50914] underline">
          My Tickets
        </Link>
      </div>
    );
  }

  const handlePrint = () => {
    window.print();
  };

  const bookingDate = new Date().toLocaleDateString('en-IN', {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="animate-fadeIn max-w-2xl mx-auto px-4 py-8 space-y-8">
      
      {/* Success Celebration Banner */}
      <div className="text-center space-y-3">
        <div className="w-20 h-20 bg-gradient-to-tr from-[#E50914] to-[#FFD700] rounded-full flex items-center justify-center mx-auto shadow-[0_0_40px_rgba(229,9,20,0.6)] animate-bounce">
          <CheckCircle className="w-10 h-10 text-white" />
        </div>
        <h1 className="font-bebas text-5xl text-white tracking-wide">BOOKING CONFIRMED!</h1>
        <p className="text-xs text-gray-300 max-w-md mx-auto">
          Your IMAX & Dolby seats have been officially reserved. Present this printable ticket or digital QR code at the theater entrance.
        </p>
      </div>

      {/* 🎟️ REALISTIC CINEMA TICKET STUB */}
      <div id="printable-ticket" className="ticket-container p-6 sm:p-8 space-y-6">
        
        {/* Ticket Top Branding */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-2">
            <Film className="w-6 h-6 text-[#E50914]" />
            <span className="font-bebas text-3xl text-white tracking-widest">CINE<span className="text-[#E50914]">PASS</span> E-TICKET</span>
          </div>
          <span className="bg-[#FFD700] text-black font-black text-[10px] px-3 py-1 rounded-full uppercase tracking-wider shadow-lg">
            CONFIRMED PASS
          </span>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
          
          {/* Movie Details */}
          <div className="md:col-span-8 space-y-4">
            <div>
              <span className="text-[10px] font-extrabold text-[#E50914] uppercase tracking-widest block">MOVIE TITLE</span>
              <h2 className="font-bebas text-4xl text-white tracking-wide leading-none">{booking.movie_title}</h2>
              <p className="text-xs text-gray-300 mt-1">{booking.theatre_name || 'INOX Grand Cinemas'}</p>
            </div>

            <div className="grid grid-cols-2 gap-4 text-xs pt-2 border-t border-white/10">
              <div>
                <span className="text-gray-500 font-bold block uppercase text-[9px]">BOOKING ID</span>
                <span className="font-mono text-sm text-[#FFD700] font-extrabold">{booking.id}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold block uppercase text-[9px]">TRANSACTION ID</span>
                <span className="font-mono text-xs text-gray-300">{payment?.transaction_id || 'TXN_987412'}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold block uppercase text-[9px]">RESERVED SEATS</span>
                <span className="font-extrabold text-base text-[#E50914]">{booking.seats?.join(', ')}</span>
              </div>
              <div>
                <span className="text-gray-500 font-bold block uppercase text-[9px]">TOTAL PAID</span>
                <span className="font-extrabold text-base text-emerald-400">₹{booking.total_amount}</span>
              </div>
            </div>
          </div>

          {/* Right: QR Code Gate Scanner */}
          <div className="md:col-span-4 flex flex-col items-center justify-center p-4 bg-black/60 rounded-2xl border border-white/10 relative overflow-hidden">
            <div className="relative w-28 h-28 bg-white p-2 rounded-xl flex items-center justify-center shadow-2xl">
              {/* QR Barcode Line */}
              <div className="barcode-scanner-line" />
              <svg className="w-full h-full text-black" viewBox="0 0 24 24" fill="currentColor">
                <path d="M2,2H10V10H2V2M4,4V8H8V4H4M14,2H22V10H14V2M16,4V8H20V4H16M2,14H10V22H2V14M4,16V20H8V16H4M14,14H18V18H14V14M18,18H22V22H18V18M14,18H18V22H14V18" />
              </svg>
            </div>
            <span className="text-[9px] font-black text-gray-400 mt-2 tracking-widest uppercase">
              SCAN AT CINEMA GATE
            </span>
          </div>

        </div>

        {/* Footer Perforated Note */}
        <div className="border-t border-dashed border-white/20 pt-4 flex justify-between items-center text-[10px] text-gray-400 font-semibold">
          <span>Date Issued: {bookingDate}</span>
          <span className="text-[#FFD700]">Valid for 1 Entry Only</span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-4">
        <button
          onClick={handlePrint}
          className="btn-cinema-gold flex-1 py-4 text-xs font-bold flex items-center justify-center gap-2 rounded-2xl shadow-xl"
        >
          <Download className="w-4 h-4" />
          <span>DOWNLOAD / PRINT E-TICKET</span>
        </button>

        <Link
          to="/"
          className="btn-cinema-glass flex-1 py-4 text-xs font-bold text-center flex items-center justify-center gap-2 rounded-2xl text-decoration-none"
        >
          <Home className="w-4 h-4" />
          <span>RETURN TO HOME</span>
        </Link>
      </div>

    </div>
  );
}
