import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { CreditCard, ShieldCheck, Ticket, CheckCircle2, Lock, Tag, DollarSign, Wallet } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import WalletModal from '../components/WalletModal';

export default function CheckoutPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, refreshUser } = useAuth();
  const { addToast } = useNotification();

  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const checkoutState = location.state;

  if (!checkoutState || !checkoutState.showtime) {
    return (
      <div className="py-20 text-center space-y-4">
        <h2 className="text-xl font-bold text-slate-300">No Active Booking Session</h2>
        <button
          onClick={() => navigate('/')}
          className="px-6 py-2.5 rounded-xl bg-rose-600 text-white font-bold text-xs"
        >
          Return to Movies
        </button>
      </div>
    );
  }

  const { showtime, selectedSeats, totalPrice } = checkoutState;

  const [paymentMethod, setPaymentMethod] = useState('Credit Card');
  const [promoCode, setPromoCode] = useState('');
  const [discount, setDiscount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);

  // Form payment fields
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [expiry, setExpiry] = useState('08/28');
  const [cvv, setCvv] = useState('889');

  const handleApplyPromo = (e) => {
    e.preventDefault();
    if (promoCode.toUpperCase() === 'CINEMA10') {
      setDiscount(totalPrice * 0.1);
      addToast('Promo code CINEMA10 applied! 10% Discount', 'success');
    } else {
      addToast('Invalid promo code. Try "CINEMA10"', 'error');
    }
  };

  const finalAmount = Math.max(0, totalPrice - discount);

  const handleConfirmPayment = async () => {
    setIsProcessing(true);
    try {
      const res = await API.post('/bookings', {
        showtime_id: showtime.id,
        movie_id: showtime.movie_id,
        movie_title: showtime.movie_title,
        theater_name: showtime.theater_name,
        show_date: showtime.show_date,
        show_time: showtime.show_time,
        screen_type: showtime.screen_type,
        seats: selectedSeats,
        total_amount: finalAmount,
        payment_method: paymentMethod
      });

      await refreshUser();
      addToast('Payment successful! Ticket confirmed.', 'success');
      navigate('/confirmation', { state: { booking: res.data } });
    } catch (err) {
      addToast(err.response?.data?.detail || 'Payment processing failed', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <div>
          <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">Step 2 of 3 • Payment Gateway</span>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white mt-1">Complete Checkout</h1>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-emerald-600 dark:text-emerald-400 font-semibold bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/30">
          <Lock className="w-3.5 h-3.5" />
          256-Bit SSL Encrypted
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Payment Methods & Inputs */}
        <div className="md:col-span-2 space-y-6">
          {/* Payment Method Selector */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
            <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              {[
                { name: 'Credit Card', icon: CreditCard },
                { name: 'UPI / QR', icon: Tag },
                { name: 'Net Banking', icon: ShieldCheck },
                { name: 'Digital Wallet', icon: Wallet }
              ].map(({ name, icon: IconComponent }) => (
                <button
                  key={name}
                  onClick={() => setPaymentMethod(name)}
                  className={`p-4 rounded-2xl border text-left text-xs font-bold transition-all flex items-center gap-3 ${
                    paymentMethod === name
                      ? 'bg-rose-600/20 border-rose-500 text-rose-600 dark:text-rose-300 shadow-lg shadow-rose-600/20 scale-[1.02]'
                      : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <IconComponent className="w-4 h-4 text-rose-500" />
                  {name}
                </button>
              ))}
            </div>
          </div>

          {/* Payment Details Section based on method */}
          {paymentMethod === 'Digital Wallet' ? (
            <div className="glass-card rounded-3xl p-6 border border-amber-500/30 bg-gradient-to-br from-amber-500/10 via-rose-500/5 to-slate-900/10 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-lg shadow-amber-500/30">
                    <Wallet className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-slate-900 dark:text-white">Cineticket VIP Wallet</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instant 1-Click Payment</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-slate-400 uppercase font-bold block">Available Balance</span>
                  <span className="text-lg font-black font-mono text-amber-600 dark:text-amber-400">
                    ₹{(user?.wallet_balance ?? 1500.00).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>

              {(user?.wallet_balance ?? 1500.00) < (finalAmount + (paymentMethod === 'Digital Wallet' ? 0 : 30.00)) ? (
                <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-300 text-xs flex items-center justify-between gap-2 font-semibold">
                  <span>Insufficient balance for this booking.</span>
                  <button
                    type="button"
                    onClick={() => setIsWalletModalOpen(true)}
                    className="px-3 py-1.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    + Top Up Now
                  </button>
                </div>
              ) : (
                <div className="p-3 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs flex items-center gap-2 font-semibold">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>Sufficient balance! Zero convenience fee applied.</span>
                </div>
              )}
            </div>
          ) : (
            <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-4">
              <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider">Payment Details</h3>
              <div className="space-y-3">
                <div>
                  <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Card / Account Details</label>
                  <input
                    type="text"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">Expiry Date</label>
                    <input
                      type="text"
                      value={expiry}
                      onChange={(e) => setExpiry(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-semibold text-slate-600 dark:text-slate-400 block mb-1">CVV</label>
                    <input
                      type="password"
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value)}
                      className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 font-mono"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary Column */}
        <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800 space-y-6 h-fit">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider border-b border-slate-200 dark:border-slate-800 pb-3">
            Order Summary
          </h3>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Movie</span>
              <span className="font-extrabold text-slate-900 dark:text-white text-sm block">{showtime.movie_title}</span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Cinema & Screen</span>
              <span className="text-slate-800 dark:text-slate-200 font-semibold">{showtime.theater_name} ({showtime.screen_type})</span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block">Showtime</span>
              <span className="text-rose-600 dark:text-rose-400 font-bold">{showtime.show_date} at {showtime.show_time}</span>
            </div>

            <div>
              <span className="text-slate-500 dark:text-slate-400 block mb-1">Seats</span>
              <div className="flex flex-wrap gap-1">
                {selectedSeats.map((s) => (
                  <span key={s} className="px-2 py-0.5 rounded bg-rose-600/20 text-rose-600 dark:text-rose-300 font-mono font-bold text-[11px]">
                    {s}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Promo Code Form */}
          <form onSubmit={handleApplyPromo} className="pt-3 border-t border-slate-200 dark:border-slate-800 space-y-2">
            <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 block">Promo Code</label>
            <div className="flex gap-2">
              <input
                type="text"
                placeholder="Try CINEMA10"
                value={promoCode}
                onChange={(e) => setPromoCode(e.target.value)}
                className="flex-1 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-2 text-xs text-slate-900 dark:text-white uppercase focus:outline-none focus:border-rose-500"
              />
              <button
                type="submit"
                className="px-3 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 hover:bg-slate-300 dark:hover:bg-slate-700 text-xs font-bold text-slate-800 dark:text-slate-200"
              >
                Apply
              </button>
            </div>
          </form>

          {/* Pricing Total Calculation */}
          <div className="pt-4 border-t border-slate-200 dark:border-slate-800 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Subtotal</span>
              <span>₹{totalPrice.toFixed(2)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Promo Discount (10%)</span>
                <span>-₹{discount.toFixed(2)}</span>
              </div>
            )}
            <div className="flex justify-between text-slate-600 dark:text-slate-400">
              <span>Convenience Fee</span>
              <span>₹30.00</span>
            </div>

            <div className="pt-2 border-t border-slate-200 dark:border-slate-800 flex justify-between items-center">
              <span className="text-sm font-bold text-slate-900 dark:text-white">Final Total</span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                ₹{(finalAmount + 30.00).toFixed(2)}
              </span>
            </div>
          </div>

          <button
            onClick={handleConfirmPayment}
            disabled={isProcessing}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white font-extrabold text-sm shadow-xl shadow-emerald-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] transition-all"
          >
            <CheckCircle2 className="w-5 h-5" />
            {isProcessing ? 'Processing Payment...' : 'Pay & Confirm Booking'}
          </button>
        </div>
      </div>
      <WalletModal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} />
    </div>
  );
}

