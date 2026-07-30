import React, { useState } from 'react';
import { Wallet, PlusCircle, Sparkles, CheckCircle2, ShieldCheck, ArrowUpRight, X, Zap, CreditCard } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function WalletModal({ isOpen, onClose }) {
  const { user, topUpWallet } = useAuth();
  const { addToast } = useNotification();

  const [selectedAmount, setSelectedAmount] = useState('');
  const [customAmount, setCustomAmount] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !user) return null;

  const currentBalance = user.wallet_balance != null ? user.wallet_balance : 1500.00;

  const quickAmounts = [500, 1000, 2000, 5000];

  const handleSelectQuick = (amount) => {
    setSelectedAmount(amount);
    setCustomAmount(amount.toString());
  };

  const handleCustomChange = (e) => {
    const val = e.target.value;
    if (/^\d*$/.test(val)) {
      setCustomAmount(val);
      setSelectedAmount(Number(val));
    }
  };

  const handleAddMoney = async (e) => {
    e.preventDefault();
    const amount = Number(customAmount || selectedAmount);
    if (!amount || amount <= 0) {
      addToast('Please enter a valid top-up amount', 'warning');
      return;
    }

    try {
      setIsLoading(true);
      const res = await topUpWallet(amount);
      addToast(res?.message || `Successfully added ₹${amount.toLocaleString('en-IN')} to your wallet!`, 'success');
      setCustomAmount('');
      setSelectedAmount('');
    } catch (err) {
      const errMsg = err?.response?.data?.detail || 'Failed to add money to wallet. Please try again.';
      addToast(errMsg, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-scale-up">
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/80">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-500">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Cineticket Pay
                <span className="px-2 py-0.5 text-[10px] font-extrabold uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 to-rose-500 text-white">
                  VIP Wallet
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Instant 1-Click Payments & Zero Convenience Fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto">
          {/* Virtual Digital Wallet Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-rose-950 to-slate-900 text-white shadow-xl overflow-hidden border border-rose-500/20 group">
            {/* Ambient Lighting FX */}
            <div className="absolute -top-12 -right-12 w-40 h-40 bg-rose-500/30 rounded-full blur-3xl group-hover:scale-125 transition-transform duration-500"></div>
            <div className="absolute -bottom-12 -left-12 w-40 h-40 bg-amber-500/20 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-6">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] uppercase font-mono tracking-widest text-rose-300/80 block">
                    Digital Cash Pass
                  </span>
                  <span className="text-sm font-extrabold tracking-tight text-white">
                    {user.full_name}
                  </span>
                </div>
                {/* Chip Visual */}
                <div className="w-9 h-7 rounded-lg bg-gradient-to-tr from-amber-400 to-amber-200 border border-amber-300/50 shadow-inner flex items-center justify-center">
                  <div className="w-7 h-5 border-t border-b border-amber-600/40"></div>
                </div>
              </div>

              <div>
                <span className="text-xs font-semibold text-slate-400 block mb-1">Available Balance</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-black font-mono tracking-tight text-white">
                    ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                  <span className="text-xs font-bold text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded-full border border-emerald-500/30 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3" /> Ready to Use
                  </span>
                </div>
              </div>

              <div className="pt-2 flex justify-between items-center text-[10px] text-slate-400 font-mono border-t border-white/10">
                <span>ACCOUNT: CT-{user.id ? user.id.slice(-6).toUpperCase() : 'USER'}</span>
                <span className="flex items-center gap-1 text-amber-300">
                  <Sparkles className="w-3 h-3 text-amber-400" /> CINETICKET VIP
                </span>
              </div>
            </div>
          </div>

          {/* Top-up Form */}
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 block mb-2">
                Top Up Wallet Balance
              </label>

              {/* Quick Preset Buttons */}
              <div className="grid grid-cols-4 gap-2 mb-3">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectQuick(amt)}
                    className={`py-2.5 rounded-xl border text-xs font-black transition-all ${
                      Number(customAmount) === amt
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md shadow-rose-600/30 scale-105'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 border-slate-200 dark:border-slate-700 hover:border-rose-500'
                    }`}
                  >
                    +₹{amt}
                  </button>
                ))}
              </div>

              {/* Custom Input */}
              <div className="relative">
                <span className="absolute left-4 top-3 text-sm font-black text-slate-400">₹</span>
                <input
                  type="text"
                  placeholder="Enter amount (e.g. 500)"
                  value={customAmount}
                  onChange={handleCustomChange}
                  className="w-full bg-slate-100 dark:bg-slate-800/90 border border-slate-200 dark:border-slate-700 rounded-2xl py-3 pl-9 pr-4 text-sm font-bold text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-rose-500 focus:ring-2 focus:ring-rose-500/20 font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !customAmount || Number(customAmount) <= 0}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none"
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Processing Top Up...
                </span>
              ) : (
                <>
                  <PlusCircle className="w-4 h-4" />
                  Add Money to Wallet
                </>
              )}
            </button>
          </form>

          {/* Perks Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500" /> Wallet Benefits
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>0 Convenience Fee</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>1-Click Payment</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <ArrowUpRight className="w-4 h-4 text-rose-500 shrink-0" />
                <span>Instant Refunds</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
