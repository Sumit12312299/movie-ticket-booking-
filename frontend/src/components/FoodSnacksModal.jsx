import React, { useState } from 'react';
import { X, Utensils, Plus, Minus, ShoppingBag, Sparkles } from 'lucide-react';
import { useNotification } from '../context/NotificationContext';

/**
 * Pre-orderable concession food and beverage items inventory list.
 */
const SNACK_ITEMS = [
  {
    id: 1,
    name: 'Jumbo Salted Popcorn & Pepsi Combo',
    category: 'Combos',
    price: 350,
    image: '🍿',
    desc: 'Large Salted Butter Popcorn (150g) + 2x Chilled Pepsi (500ml)'
  },
  {
    id: 2,
    name: 'Cheesy Loaded Nachos Deluxe',
    category: 'Snacks',
    price: 260,
    image: '🧀',
    desc: 'Crispy Tortilla Chips with Warm Mexican Melted Cheese & Jalapeños'
  },
  {
    id: 3,
    name: 'Caramel Gold Popcorn Tub',
    category: 'Popcorn',
    price: 290,
    image: '🍯',
    desc: 'Handcrafted Gourmet Caramel Glazed Popcorn'
  },
  {
    id: 4,
    name: 'Cold Coffee & Belgian Waffle',
    category: 'Beverages',
    price: 280,
    image: '☕',
    desc: 'Rich Thick Cold Brew Coffee + Fresh Hot Waffle'
  }
];

export default function FoodSnacksModal({ isOpen, onClose }) {
  const { addToast } = useNotification();
  const [cart, setCart] = useState({});
  const [isOrdering, setIsOrdering] = useState(false);

  if (!isOpen) return null;

  const updateQuantity = (id, delta) => {
    setCart((prev) => {
      const current = prev[id] || 0;
      const next = Math.max(0, current + delta);
      if (next === 0) {
        const copy = { ...prev };
        delete copy[id];
        return copy;
      }
      return { ...prev, [id]: next };
    });
  };

  const totalAmount = Object.entries(cart).reduce((sum, [id, qty]) => {
    const item = SNACK_ITEMS.find((s) => s.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);

  const totalCount = Object.values(cart).reduce((a, b) => a + b, 0);

  const handleCheckoutSnacks = () => {
    if (totalCount === 0) {
      addToast('Please select at least 1 snack item to place order', 'warning');
      return;
    }

    setIsOrdering(true);
    setTimeout(() => {
      setIsOrdering(false);
      addToast(`🎉 Snack order confirmed! Total ₹${totalAmount.toFixed(2)} charged to BookTicket Wallet. Collect at Counter #3!`, 'success');
      setCart({});
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 to-teal-500/10">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-md">
              <Utensils className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
                Food & Gourmet Cinema Snacks <Sparkles className="w-4 h-4 text-amber-500" />
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Pre-order snacks and skip the theater line!</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white flex items-center justify-center transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Snack Items Grid */}
        <div className="p-6 space-y-4 overflow-y-auto flex-1">
          {SNACK_ITEMS.map((item) => {
            const qty = cart[item.id] || 0;
            return (
              <div
                key={item.id}
                className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 transition-all hover:border-emerald-500/40"
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  <span className="text-3xl bg-white dark:bg-slate-900 p-2.5 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700">
                    {item.image}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-black text-slate-900 dark:text-white truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 line-clamp-1">{item.desc}</p>
                    <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1 inline-block">
                      ₹{item.price.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* Quantity Controls */}
                <div className="flex items-center gap-2 bg-white dark:bg-slate-900 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm shrink-0">
                  <button
                    onClick={() => updateQuantity(item.id, -1)}
                    className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="w-6 text-center text-xs font-mono font-black text-slate-900 dark:text-white">{qty}</span>
                  <button
                    onClick={() => updateQuantity(item.id, 1)}
                    className="w-6 h-6 rounded-lg bg-emerald-600 text-white flex items-center justify-center hover:bg-emerald-500 transition-colors"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {/* Footer Order Total & Checkout */}
        <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Cart Total ({totalCount} items)</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{totalAmount.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleCheckoutSnacks}
            disabled={isOrdering || totalCount === 0}
            className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-extrabold text-xs flex items-center justify-center gap-2 shadow-xl transition-all ${
              totalCount > 0 && !isOrdering
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-md hover:scale-105 cursor-pointer'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            }`}
          >
            {isOrdering ? (
              'Placing Order...'
            ) : (
              <>
                <ShoppingBag className="w-4 h-4" /> Pre-order & Pay with Wallet
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
