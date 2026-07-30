import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Armchair, Clock, ArrowRight, ShieldAlert, Sparkles, CheckCircle2 } from 'lucide-react';
import API from '../services/api';
import SeatMap from '../components/SeatMap';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

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
    if (timerSeconds <= 0) return;
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
      addToast('Seats locked for 5 minutes! Proceeding to checkout', 'success');

      // Navigate to checkout with booking payload state
      navigate('/checkout', {
        state: {
          showtime,
          selectedSeats,
          totalPrice
        }
      });
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to lock seats. Please pick another seat.', 'error');
      fetchShowtime(); // Refresh seats map
    } finally {
      setLocking(false);
    }
  };

  const minutes = Math.floor(timerSeconds / 60);
  const seconds = timerSeconds % 60;

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xs text-slate-400">Loading seat layout...</p>
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
                    : 'text-rose-500 animate-pulse'
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
    </div>
  );
}
