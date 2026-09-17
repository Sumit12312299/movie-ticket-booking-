import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { createBooking, processPayment } from '../services/api';
import { CreditCard, Smartphone, Building2, ShieldCheck, Ticket, AlertCircle, Sparkles, ArrowLeft } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { show, selectedSeats } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div className="text-center py-20 text-gray-400 font-bebas text-2xl">
        No booking session found. Please select your seats again from the catalog.
      </div>
    );
  }

  const subtotal = show.price * selectedSeats.length;
  const convenienceFee = 30;
  const totalAmount = subtotal + convenienceFee;

  const handlePayAndBook = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const bookingRes = await createBooking({ show_id: show.id, seats: selectedSeats });
      const bookingId = bookingRes.data.id;

      const paymentRes = await processPayment({ booking_id: bookingId, payment_method: paymentMethod, amount: totalAmount });

      navigate('/booking-success', { state: { booking: bookingRes.data, payment: paymentRes.data } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking or Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ id, icon: Icon, title, desc }) => {
    const isSelected = paymentMethod === id;
    return (
      <label
        className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-300 cursor-pointer ${
          isSelected
            ? 'bg-[#E50914]/15 border-[#E50914] shadow-lg shadow-[#E50914]/20'
            : 'bg-[#131624] border-white/10 hover:border-white/30'
        }`}
      >
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isSelected ? 'bg-[#E50914] text-white shadow-md' : 'bg-white/5 text-gray-400'
          }`}>
            <Icon className="w-6 h-6" />
          </div>
          <div>
            <h4 className="font-bebas text-xl text-white tracking-wide">{title}</h4>
            <p className="text-xs text-gray-400">{desc}</p>
          </div>
        </div>
        <input
          type="radio"
          name="payment"
          value={id}
          checked={isSelected}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-5 h-5 accent-[#E50914] cursor-pointer"
        />
      </label>
    );
  };

  return (
    <div className="animate-fadeIn max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Back Link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO SEAT SELECTION</span>
      </button>

      {/* Title Banner */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4">
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-8 h-8 text-[#E50914]" />
          <div>
            <h1 className="font-bebas text-4xl text-white tracking-wide">CINEMA GATEWAY CHECKOUT</h1>
            <p className="text-xs text-gray-400">256-bit Encrypted SSL Payment Transaction</p>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#FFD700] bg-[#FFD700]/10 px-3 py-1.5 rounded-full border border-[#FFD700]/30">
          <Sparkles className="w-4 h-4" />
          <span>GUARANTEED SEAT RESERVATION</span>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-sm flex items-center gap-3">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Grid Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left: Payment Method Selection */}
        <div className="lg:col-span-7 bg-[#0F111A] border border-white/15 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
          <h2 className="font-bebas text-2xl text-white tracking-wide border-b border-white/10 pb-3">
            SELECT PAYMENT METHOD
          </h2>

          <div className="space-y-3">
            <PaymentOption id="upi" icon={Smartphone} title="UPI / GPay / PhonePe / Paytm" desc="Instant 1-Tap Authorization" />
            <PaymentOption id="credit_card" icon={CreditCard} title="Credit / Debit Card" desc="Visa, MasterCard, RuPay, Amex" />
            <PaymentOption id="net_banking" icon={Building2} title="Internet Banking" desc="All Indian Banks Supported" />
          </div>

          <button
            onClick={handlePayAndBook}
            disabled={loading}
            className="btn-cinema w-full py-4 text-base rounded-2xl flex items-center justify-center gap-2 shadow-2xl mt-4"
          >
            <Ticket className="w-5 h-5" />
            <span>{loading ? 'Authorizing Payment...' : `PAY ₹${totalAmount} & INSTANTLY ISSUED TICKET`}</span>
          </button>
        </div>

        {/* Right: Order Ticket Summary */}
        <div className="lg:col-span-5 bg-[#0F111A] border border-white/15 rounded-3xl p-6 shadow-2xl space-y-6">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="font-bebas text-2xl text-white tracking-wide">ORDER TICKET SUMMARY</h3>
            <Ticket className="w-5 h-5 text-[#FFD700]" />
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="font-bebas text-2xl text-white tracking-wide">{show.movie_title}</h4>
              <p className="text-xs text-gray-400">{show.theatre_name}</p>
            </div>

            <div className="bg-[#131624] border border-white/10 rounded-2xl p-4 space-y-2 text-xs">
              <div className="flex justify-between text-gray-300">
                <span className="font-semibold text-gray-500">Selected Seats:</span>
                <span className="font-extrabold text-[#E50914]">{selectedSeats.join(', ')}</span>
              </div>
              <div className="flex justify-between text-gray-300">
                <span className="font-semibold text-gray-500">Screen:</span>
                <span className="font-bold text-white">Screen {show.screen_number || 1}</span>
              </div>
            </div>
          </div>

          <div className="border-t border-white/10 pt-4 space-y-2 text-xs">
            <div className="flex justify-between text-gray-400">
              <span>Tickets Cost ({selectedSeats.length} Seats)</span>
              <span className="text-white font-bold">₹{subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Convenience & Screen Fee</span>
              <span className="text-white font-bold">₹{convenienceFee}</span>
            </div>
            <div className="flex justify-between items-center border-t border-white/10 pt-3 text-sm">
              <span className="font-bebas text-xl text-white tracking-wide">TOTAL AMOUNT DUE</span>
              <span className="font-bebas text-3xl text-[#E50914] text-glow-red">₹{totalAmount}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
