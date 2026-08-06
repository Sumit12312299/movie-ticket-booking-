import React from 'react';
import { X, Gift, Copy, Check, Ticket, Sparkles, Percent } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

const ACTIVE_PROMOS = [
  {
    code: 'CINEMA10',
    title: '10% Flat Discount',
    desc: 'Get flat 10% discount on all movie ticket bookings above ₹300.',
    validTill: 'Valid till 31st Dec 2026',
    discount: '10% OFF'
  },
  {
    code: 'VIPWALLETPASS',
    title: '0 Convenience Fee',
    desc: 'Pay using BookTicket VIP Wallet to waive off 100% internet handling charges.',
    validTill: 'Unlimited VIP perk',
    discount: 'FREE FEE'
  },
  {
    code: 'SNACK50',
    title: '₹50 Popcorn Cashback',
    desc: 'Get ₹50 cashback in BookTicket wallet on any pre-ordered gourmet snack combo.',
    validTill: 'Valid on 2+ tickets',
    discount: '₹50 CASH'
  }
];

/**
 * VouchersModal displays active promotional discount codes.
 * Offers click-to-copy utility for coupons like CINEMA10, VIPWALLETPASS, and SNACK50.
 */
export default function VouchersModal({ isOpen, onClose }) {
  const { addToast } = useNotification();
  const [copiedCode, setCopiedCode] = React.useState(null);

  if (!isOpen) return null;

  const handleCopyCode = (code) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    addToast(`Promo code "${code}" copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-purple-600/10 to-indigo-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-600/30">
              <Gift className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                VIP Offers & Vouchers <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Click any promo code to copy & apply at checkout</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Promo List */}
        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          {ACTIVE_PROMOS.map((promo) => (
            <div
              key={promo.code}
              className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4 transition-all hover:border-purple-500/40 group"
            >
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-0.5 rounded-md bg-purple-600/10 text-purple-600 dark:text-purple-400 text-xs font-mono font-black border border-purple-500/30">
                    {promo.code}
                  </span>
                  <span className="text-xs font-extrabold text-slate-900 dark:text-white">{promo.title}</span>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">{promo.desc}</p>
                <span className="text-[10px] text-slate-400 font-semibold block pt-1">{promo.validTill}</span>
              </div>

              <button
                onClick={() => handleCopyCode(promo.code)}
                className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-black flex items-center gap-1.5 shadow-md shadow-purple-600/25 transition-all hover:scale-105 shrink-0"
              >
                {copiedCode === promo.code ? (
                  <>
                    <Check className="w-3.5 h-3.5" /> Copied!
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" /> Copy Code
                  </>
                )}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
