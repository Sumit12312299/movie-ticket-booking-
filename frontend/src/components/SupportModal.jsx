import React, { useState } from 'react';
import { X, HelpCircle, MessageSquare, PhoneCall, ChevronDown, ChevronUp, Sparkles } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

/**
 * Frequently Asked Questions (FAQ) repository data.
 */
const FAQS = [
  {
    q: 'How do I cancel my booking and get a refund?',
    a: 'Go to My Bookings in your profile, click "Cancel Booking" up to 20 minutes before showtime. 100% of the ticket amount is instantly refunded to your BookTicket VIP Wallet!'
  },
  {
    q: 'Do I need a physical printout of the E-ticket?',
    a: 'No! Show the Digital E-Ticket Pass or QR Code directly on your phone screen at the cinema security gate.'
  },
  {
    q: 'How does BookTicket VIP Wallet work?',
    a: 'BookTicket VIP Wallet gives 0 convenience fees, 1-click instant ticket locks, and immediate cancellation refunds without waiting for bank gateways.'
  }
];

/**
 * SupportModal component provides user documentation and 24/7 help.
 * Displays FAQs regarding booking cancellation, E-ticket usage, and wallet refunds.
 * Offers live chat simulation and call support helpline buttons.
 */
export default function SupportModal({ isOpen, onClose }) {
  const { addToast } = useNotification();
  const [openFaq, setOpenFaq] = useState(0);

  if (!isOpen) return null;

  const handleStartChat = () => {
    addToast('Connecting to 24/7 VIP Concierge Support Live Agent...', 'info');
  };

  const handleCallSupport = () => {
    addToast('Dialing BookTicket VIP Helpline: +91 1800-889-CINE (Toll Free)', 'success');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-lg bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-indigo-600/10 to-purple-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-600/30">
              <HelpCircle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                24/7 VIP Support & Help <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Instant answers & live concierge assistance</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* FAQs List */}
        <div className="p-6 space-y-3 max-h-[60vh] overflow-y-auto">
          <h4 className="text-xs font-black text-slate-400 uppercase tracking-wider mb-2">Frequently Asked Questions</h4>
          {FAQS.map((faq, idx) => (
            <div
              key={idx}
              className="rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden bg-slate-50 dark:bg-slate-800/40"
            >
              <button
                onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                className="w-full text-left p-3.5 text-xs font-bold text-slate-900 dark:text-white flex items-center justify-between gap-3"
              >
                <span>{faq.q}</span>
                {openFaq === idx ? <ChevronUp className="w-4 h-4 text-indigo-500 shrink-0" /> : <ChevronDown className="w-4 h-4 text-slate-400 shrink-0" />}
              </button>

              {openFaq === idx && (
                <div className="px-3.5 pb-3.5 text-xs text-slate-600 dark:text-slate-400 font-medium border-t border-slate-200/60 dark:border-slate-700/50 pt-2.5 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}

          {/* Quick Action Contact Buttons */}
          <div className="pt-4 grid grid-cols-2 gap-3">
            <button
              onClick={handleStartChat}
              className="py-3 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-black flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 transition-all hover:scale-105"
            >
              <MessageSquare className="w-4 h-4" /> Start Live Chat
            </button>
            <button
              onClick={handleCallSupport}
              className="py-3 rounded-2xl bg-slate-900 dark:bg-slate-800 hover:bg-slate-800 text-white text-xs font-black flex items-center justify-center gap-2 border border-slate-700 shadow-md transition-all hover:scale-105"
            >
              <PhoneCall className="w-4 h-4 text-emerald-400" /> Call VIP Desk
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
