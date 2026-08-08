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

  // Live transaction feed state
  const [transactions, setTransactions] = useState([
    { id: 1, type: 'credit', title: 'Welcome VIP Bonus', date: 'Yesterday, 12:45 PM', amount: 500 },
    { id: 2, type: 'debit', title: 'Ticket Booking: Dune Part Two', date: '2 days ago', amount: 640 },
    { id: 3, type: 'credit', title: 'Zero Convenience Fee Cashback', date: '2 days ago', amount: 64 },
  ]);

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
      
      // Add transaction to log
      const newTx = {
        id: Date.now(),
        type: 'credit',
        title: 'Wallet Load (Success)',
        date: 'Just now',
        amount: amount
      };
      setTransactions((prev) => [newTx, ...prev]);
      
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/75 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl overflow-hidden transform transition-all animate-scale-up backdrop-blur-lg">
        
        {/* Header */}
        <div className="px-6 pt-6 pb-4 flex items-center justify-between border-b border-slate-100 dark:border-slate-800/60">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 border border-amber-500/25 flex items-center justify-center text-amber-500">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                BookTicket Pay
                <span className="px-2 py-0.5 text-[9px] font-black uppercase tracking-wider rounded-full bg-gradient-to-r from-amber-500 via-rose-500 to-indigo-500 text-white shadow-md shadow-rose-500/20 animate-pulse">
                  VIP Club
                </span>
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
                Instant 1-Click Checkout & Zero Extra Fees
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-6 max-h-[85vh] overflow-y-auto">
          
          {/* 💳 Luxury Fintech Virtual Digital Card */}
          <div className="relative p-6 rounded-3xl bg-gradient-to-br from-slate-900 via-[#1a1e35] to-slate-950 text-white shadow-xl overflow-hidden border border-slate-800 group hover:scale-[1.02] transition-all duration-500 cursor-pointer">
            {/* Metallic Glare Effect Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000"></div>
            {/* Card Hologram Glows */}
            <div className="absolute -top-12 -right-12 w-48 h-48 bg-rose-500/20 rounded-full blur-3xl group-hover:scale-125 transition-all"></div>
            <div className="absolute -bottom-12 -left-12 w-48 h-48 bg-indigo-500/25 rounded-full blur-3xl"></div>

            <div className="relative z-10 space-y-6">
              {/* Card Header */}
              <div className="flex justify-between items-start">
                <div className="space-y-0.5">
                  <span className="text-[9px] uppercase font-mono tracking-widest text-slate-400 block">
                    BookTicket Pay
                  </span>
                  <span className="text-[9px] font-black uppercase tracking-wider text-amber-300 bg-amber-500/10 px-2 py-0.5 rounded-md border border-amber-500/20">
                    VIP Platinum
                  </span>
                </div>
                {/* Contactless Visual + Brand */}
                <div className="flex items-center gap-2">
                  <div className="flex flex-col gap-0.5 text-slate-400">
                    <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                    <span className="w-2.5 h-2.5 rounded-full bg-current opacity-80"></span>
                    <span className="w-3.5 h-3.5 rounded-full bg-current opacity-60"></span>
                  </div>
                  <div className="w-9 h-7 rounded-lg bg-gradient-to-tr from-amber-400 via-yellow-250 to-amber-300 border border-amber-400/40 shadow-inner flex items-center justify-center">
                    <div className="w-7 h-5 border-t border-b border-amber-600/30"></div>
                  </div>
                </div>
              </div>

              {/* Card Number / Exp */}
              <div className="flex justify-between items-end">
                <div className="space-y-1">
                  <span className="text-xs font-semibold text-slate-400 block">Card Number</span>
                  <span className="text-base font-mono font-bold tracking-[0.2em] text-slate-100">
                    •••• •••• •••• {user.id ? user.id.slice(-4).toUpperCase() : '8899'}
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-[9px] uppercase font-mono text-slate-400 block">Expires</span>
                  <span className="text-xs font-mono font-bold text-slate-200">12/32</span>
                </div>
              </div>

              {/* Balance Section */}
              <div className="pt-4 border-t border-slate-800 flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-semibold text-slate-400 block uppercase">Available Balance</span>
                  <span className="text-3xl font-black font-mono tracking-tight text-white leading-none">
                    ₹{currentBalance.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                  </span>
                </div>
                <div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20 flex items-center gap-1.5 shadow-md shadow-emerald-950/20">
                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></div>
                    Active Wallet
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Top-up Form */}
          <form onSubmit={handleAddMoney} className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Select Quick Load / Add Cash
                </label>
                <span className="text-[10px] text-rose-500 dark:text-rose-400 font-bold flex items-center gap-1">
                  <Sparkles className="w-3 h-3 text-amber-500" /> Cashbacks Applied
                </span>
              </div>

              {/* Quick Preset Capsule buttons */}
              <div className="grid grid-cols-4 gap-2.5">
                {quickAmounts.map((amt) => (
                  <button
                    key={amt}
                    type="button"
                    onClick={() => handleSelectQuick(amt)}
                    className={`py-2.5 rounded-xl border text-xs font-bold tracking-wide transition-all ${
                      Number(customAmount) === amt
                        ? 'bg-rose-600 text-white border-rose-500 shadow-md scale-[1.05]'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700/60 hover:border-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700/80 cursor-pointer'
                    }`}
                  >
                    +₹{amt.toLocaleString('en-IN')}
                  </button>
                ))}
              </div>

              {/* Giant Numeric Currency Display */}
              <div className="relative bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 flex flex-col items-center justify-center space-y-1 focus-within:border-rose-500 focus-within:ring-2 focus-within:ring-rose-500/15 transition-all">
                <span className="text-[10px] uppercase font-black tracking-widest text-slate-400">
                  Custom Top Up Amount
                </span>
                <div className="flex items-center justify-center gap-1.5 w-full">
                  <span className="text-2xl font-black text-rose-500">₹</span>
                  <input
                    type="text"
                    placeholder="Enter Custom Amount"
                    value={customAmount}
                    onChange={handleCustomChange}
                    className="w-full bg-transparent border-none text-center text-2xl font-black text-slate-900 dark:text-white placeholder-slate-300 focus:outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || !customAmount || Number(customAmount) <= 0}
              className="w-full py-4 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-sm shadow-md flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-[0.98] transition-all disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
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

          {/* 📜 Simulated Live Transaction Log */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-slate-400">
                Recent Wallet Activity
              </h4>
              <span className="text-[10px] text-slate-400 font-bold">Simulated Live Log</span>
            </div>

            <div className="space-y-2 max-h-[170px] overflow-y-auto pr-1">
              {transactions.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/60 transition-all hover:bg-slate-100 dark:hover:bg-slate-800/40"
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                      tx.type === 'credit'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/25'
                        : 'bg-rose-500/10 text-rose-500 border border-rose-500/25'
                    }`}>
                      {tx.type === 'credit' ? (
                        <ArrowUpRight className="w-4 h-4" />
                      ) : (
                        <Zap className="w-4 h-4" />
                      )}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">
                        {tx.title}
                      </span>
                      <span className="text-[10px] text-slate-400 block font-medium">
                        {tx.date}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-xs font-mono font-black ${
                      tx.type === 'credit' ? 'text-emerald-500' : 'text-slate-800 dark:text-slate-350'
                    }`}>
                      {tx.type === 'credit' ? '+' : '-'}₹{tx.amount.toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Perks Section */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/60 dark:border-slate-800 space-y-2.5">
            <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-amber-500 animate-bounce" /> BookTicket Pay Privileges
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-[10px] font-bold text-slate-600 dark:text-slate-300">
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
                <span>Zero Convenience Fee</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>1-Click Payments</span>
              </div>
              <div className="flex items-center gap-2 bg-white dark:bg-slate-800 p-2.5 rounded-xl border border-slate-200/50 dark:border-slate-700/50">
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
