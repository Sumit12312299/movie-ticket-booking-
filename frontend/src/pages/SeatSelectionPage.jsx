import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Armchair, Clock, ArrowRight, ShieldAlert, Sparkles, CheckCircle2, Utensils } from 'lucide-react';
import API from '../services/api';
import SeatMap from '../components/SeatMap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

const SNACK_ITEMS = [
  {
    id: 1,
    name: 'Jumbo Salted Popcorn & Pepsi Combo',
    price: 350,
    image: '🍿',
    desc: 'Large Salted Popcorn + 2x Chilled Pepsi'
  },
  {
    id: 2,
    name: 'Cheesy Loaded Nachos Deluxe',
    price: 260,
    image: '🧀',
    desc: 'Tortilla Chips with Warm Mexican Cheese'
  },
  {
    id: 3,
    name: 'Caramel Gold Popcorn Tub',
    price: 290,
    image: '🍯',
    desc: 'Handcrafted Caramel Glazed Popcorn'
  },
  {
    id: 4,
    name: 'Cold Coffee & Belgian Waffle',
    price: 280,
    image: '☕',
    desc: 'Thick Cold Brew + Fresh Hot Waffle'
  }
];

export default function SeatSelectionPage() {
  const { showtimeId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [showtime, setShowtime] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [locking, setLocking] = useState(false);

  // 5-minute countdown timer state
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [showSnackStep, setShowSnackStep] = useState(false);
  const [selectedSnacks, setSelectedSnacks] = useState({});

  const updateSnackQty = (id, delta) => {
    setSelectedSnacks((prev) => {
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

  const snacksTotal = Object.entries(selectedSnacks).reduce((sum, [id, qty]) => {
    const item = SNACK_ITEMS.find((s) => s.id === Number(id));
    return sum + (item ? item.price * qty : 0);
  }, 0);


  useEffect(() => {
    fetchShowtime();
  }, [showtimeId]);

  // Real-time seat availability background sync polling (every 2.5 seconds)
  useEffect(() => {
    if (!showtimeId) return;

    const pollInterval = setInterval(async () => {
      try {
        const res = await API.get(`/showtimes/${showtimeId}`);
        const newShowtime = res.data;

        setShowtime((prev) => {
          if (!prev) return newShowtime;

          // Check if any seat currently selected by this user got locked or booked by someone else
          const latestBooked = newShowtime.booked_seats || [];
          const latestLocked = newShowtime.locked_seats || [];

          setSelectedSeats((currentSelected) => {
            const conflictSeats = currentSelected.filter(
              (s) => latestBooked.includes(s) || latestLocked.includes(s)
            );
            if (conflictSeats.length > 0) {
              addToast(`Seat(s) ${conflictSeats.join(', ')} were just reserved by another user!`, 'warning');
              return currentSelected.filter((s) => !conflictSeats.includes(s));
            }
            return currentSelected;
          });

          return newShowtime;
        });
      } catch (err) {
        // Silent error handling for background polling
      }
    }, 2500);

    return () => clearInterval(pollInterval);
  }, [showtimeId]);

  useEffect(() => {
    if (timerSeconds <= 0) {
      setIsExpired(true);
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds]);

  const fetchShowtime = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/showtimes/${showtimeId}`);
      setShowtime(res.data);
    } catch (err) {
      console.error(err);
      addToast('Failed to load seat layout', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSeatClick = (seatId, seatPrice) => {
    if (selectedSeats.includes(seatId)) {
      setSelectedSeats((prev) => prev.filter((s) => s !== seatId));
      setTotalPrice((prev) => Math.max(0, prev - seatPrice));
    } else {
      if (selectedSeats.length >= 8) {
        addToast('Maximum 8 seats allowed per booking', 'warning');
        return;
      }
      setSelectedSeats((prev) => [...prev, seatId]);
      setTotalPrice((prev) => prev + seatPrice);
    }
  };

  const handleProceedToCheckout = async () => {
    if (!user) {
      addToast('Please sign in to proceed with ticket booking', 'warning');
      navigate('/auth');
      return;
    }
    if (selectedSeats.length === 0) {
      addToast('Please select at least 1 seat on the map', 'warning');
      return;
    }

    setLocking(true);
    try {
      await API.post('/bookings/lock-seats', {
        showtime_id: showtimeId,
        seats: selectedSeats
      });
      addToast('Seats locked! Customize your experience (Step 1.5)', 'success');
      setShowSnackStep(true);
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to lock seats. Please pick another seat.', 'error');
      fetchShowtime(); // Refresh seats map
    } finally {
      setLocking(false);
    }
  };

  const handleProceedToFinalCheckout = (snacksCart) => {
    setShowSnackStep(false);
    navigate('/checkout', {
      state: {
        showtime,
        selectedSeats,
        totalPrice,
        preSelectedSnacks: snacksCart,
        timerSecondsRemaining: timerSeconds
      }
    });
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  if (loading) {
    return (
      <div className="space-y-8 pb-16 animate-fade-in">
        {/* Header skeleton */}
        <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="space-y-2 flex-1">
            <div className="h-4 w-32 rounded shimmer-bg"></div>
            <div className="h-6 w-3/4 rounded shimmer-bg"></div>
            <div className="h-3 w-1/2 rounded shimmer-bg"></div>
          </div>
          <div className="h-10 w-32 rounded-2xl shimmer-bg"></div>
        </div>
        {/* Seat Map Screen skeleton */}
        <div className="glass-card p-10 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col items-center space-y-8">
          <div className="w-full max-w-xl h-4 rounded-full bg-slate-300 dark:bg-slate-800 shimmer-bg shadow-lg"></div>
          <div className="space-y-2 w-full max-w-md pt-6">
            {[1, 2, 3, 4, 5, 6].map((row) => (
              <div key={row} className="flex justify-center gap-1.5">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seat) => (
                  <div key={seat} className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-800 shimmer-bg shrink-0"></div>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!showtime) return null;

  return (
    <div className="space-y-8 pb-16">
      {/* Header & Movie Brief */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs uppercase font-bold text-rose-500 tracking-wider">Step 1 of 3 • Seat Map</span>
            <span className="flex items-center gap-1.5 bg-emerald-500/10 px-3 py-0.5 rounded-full border border-emerald-500/30 text-[10px] font-extrabold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Live Seat Sync
            </span>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-1">{showtime.movie_title}</h1>
          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
            {showtime.theater_name} • <span className="text-amber-600 dark:text-amber-400 font-semibold">{showtime.screen_type}</span> • {showtime.show_date} at {showtime.show_time}
          </p>
        </div>

        {/* Radial Circular Seat Lock Timer */}
        <div className="flex items-center gap-3 bg-gradient-to-r from-slate-900 to-slate-950 text-white px-4 py-2.5 rounded-2xl border border-slate-800 shadow-lg">
          <div className="relative w-8 h-8 flex items-center justify-center">
            <svg className="w-8 h-8 transform -rotate-90">
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="currentColor"
                strokeWidth="3"
                className="text-slate-800"
                fill="transparent"
              />
              <circle
                cx="16"
                cy="16"
                r="12"
                stroke="currentColor"
                strokeWidth="3"
                strokeDasharray={2 * Math.PI * 12}
                strokeDashoffset={((300 - timerSeconds) / 300) * (2 * Math.PI * 12)}
                className={`transition-all duration-1000 ${
                  timerSeconds > 120
                    ? 'text-emerald-500'
                    : timerSeconds > 60
                    ? 'text-amber-500'
                    : 'text-red-500 timer-glow-red'
                }`}
                fill="transparent"
                strokeLinecap="round"
              />
            </svg>
            <Clock className="w-3.5 h-3.5 absolute text-white" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">Lock Expires In</span>
            <span className="text-xs font-mono font-black text-amber-400">
              {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
            </span>
          </div>
        </div>
      </div>

      {/* Interactive Seat Map */}
      <SeatMap
        bookedSeats={showtime.booked_seats || []}
        lockedSeats={showtime.locked_seats || []}
        selectedSeats={selectedSeats}
        onSeatClick={handleSeatClick}
        regularPrice={showtime.regular_price}
        vipPrice={showtime.vip_price}
      />

      {/* Booking Summary Footer Bar */}
      <div className="glass-panel p-6 rounded-3xl border border-rose-500/30 sticky bottom-4 z-30 shadow-2xl flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="space-y-1 text-center sm:text-left">
          <span className="text-xs text-slate-600 dark:text-slate-400 block">Selected Seats ({selectedSeats.length})</span>
          <div className="flex flex-wrap items-center gap-1.5 justify-center sm:justify-start">
            {selectedSeats.length === 0 ? (
              <span className="text-xs text-slate-500 italic">No seats selected yet</span>
            ) : (
              selectedSeats.map((s) => (
                <span key={s} className="px-2.5 py-0.5 rounded-md bg-rose-600/20 text-rose-600 dark:text-rose-300 text-xs font-bold border border-rose-500/40">
                  {s}
                </span>
              ))
            )}
          </div>
        </div>

        <div className="flex items-center gap-6">
          <div className="text-right">
            <span className="text-xs text-slate-600 dark:text-slate-400 block">Total Amount</span>
            <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
              ₹{totalPrice.toFixed(2)}
            </span>
          </div>

          <button
            onClick={handleProceedToCheckout}
            disabled={locking || selectedSeats.length === 0}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center gap-2 shadow-xl transition-all ${
              selectedSeats.length > 0 && !locking
                ? 'bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white shadow-rose-600/30 hover:scale-105'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed border border-slate-300 dark:border-slate-700'
            }`}
          >
            {locking ? 'Locking Seats...' : 'Proceed to Checkout'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Session Expired Alert Modal */}
      {isExpired && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="glass-card max-w-sm w-full p-8 rounded-3xl border border-rose-500/30 text-center space-y-4 shadow-2xl">
            <div className="w-16 h-16 bg-rose-500/10 text-rose-500 border border-rose-500/30 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Clock className="w-8 h-8 animate-bounce" />
            </div>
            <h3 className="text-lg font-black text-slate-900 dark:text-white">Seat Lock Session Expired</h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-medium">
              You took more than 5 minutes to check out. The seats have been released to ensure fair availability.
            </p>
            <button
              onClick={() => {
                setIsExpired(false);
                setSelectedSeats([]);
                setTotalPrice(0);
                setTimerSeconds(300);
                fetchShowtime();
              }}
              className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 text-white font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Pick Seats Again
            </button>
          </div>
        </div>
      )}

      {/* Step 1.5 Gourmet Snacks Selection Modal */}
      {showSnackStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between bg-gradient-to-r from-emerald-600/10 to-teal-500/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Step 1.5: Customize Your Gourmet Cinema Experience <Sparkles className="w-4 h-4 text-amber-500" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Skip counter queues! Pre-order and collect at snacks bar.</p>
                </div>
              </div>
            </div>

            {/* Snack Items list */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {SNACK_ITEMS.map((item) => {
                const qty = selectedSnacks[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200/80 dark:border-slate-800 flex items-center justify-between gap-4 hover:border-emerald-500/40 transition-all animate-fade-in"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span className="text-3xl bg-white dark:bg-slate-950 p-2.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">{item.image}</span>
                      <div className="min-w-0">
                        <span className="font-bold text-sm text-slate-900 dark:text-white block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-400 block truncate">{item.desc}</span>
                        <span className="text-xs font-mono font-black text-emerald-600 dark:text-emerald-400 mt-1 inline-block">₹{item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Qty controller */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-2 py-1 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm shrink-0">
                      <button
                        onClick={() => updateSnackQty(item.id, -1)}
                        className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-bold text-xs"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-black text-slate-900 dark:text-white">{qty}</span>
                      <button
                        onClick={() => updateSnackQty(item.id, 1)}
                        className="w-6 h-6 rounded-lg bg-rose-600 text-white flex items-center justify-center font-bold text-xs"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer action bar */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/90 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 dark:text-slate-400 block font-medium">Snacks Total</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{snacksTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleProceedToFinalCheckout({})}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs text-slate-700 dark:text-slate-300 transition-colors"
                >
                  Skip & Proceed
                </button>
                <button
                  onClick={() => handleProceedToFinalCheckout(selectedSnacks)}
                  className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-white font-extrabold text-xs shadow-lg shadow-emerald-500/20 hover:scale-105 active:scale-95 transition-all"
                >
                  Add & Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
