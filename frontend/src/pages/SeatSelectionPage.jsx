import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Clock, ArrowRight, ShieldAlert, Sparkles, Utensils } from 'lucide-react';
import API from '../services/api';
import SeatMap from '../components/SeatMap';
import TrailerModal from '../components/TrailerModal';
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
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [totalPrice, setTotalPrice] = useState(0);
  const [locking, setLocking] = useState(false);

  // 5-minute countdown timer state
  const [timerSeconds, setTimerSeconds] = useState(300);
  const [isExpired, setIsExpired] = useState(false);
  const [showSnackStep, setShowSnackStep] = useState(false);
  const [selectedSnacks, setSelectedSnacks] = useState({});
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);

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

          // Check if any seat currently selected by this user got confirmed/booked by another user
          const latestBooked = newShowtime.booked_seats || [];

          setSelectedSeats((currentSelected) => {
            const conflictSeats = currentSelected.filter((s) => latestBooked.includes(s));
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
      if (!isExpired) {
        setIsExpired(true);
        if (selectedSeats.length > 0) {
          API.post('/bookings/unlock-seats', {
            showtime_id: showtimeId,
            seats: selectedSeats
          }).catch((err) => {
            console.error('Error unlocking seats on seat selection page timer expiration:', err);
          });
        }
      }
      return;
    }
    const interval = setInterval(() => {
      setTimerSeconds((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [timerSeconds, isExpired, showtimeId, selectedSeats]);

  const fetchShowtime = async () => {
    setLoading(true);
    try {
      const res = await API.get(`/showtimes/${showtimeId}`);
      setShowtime(res.data);
      
      // Fetch movie details for banner
      try {
        const movieRes = await API.get(`/movies/${res.data.movie_id}`);
        setMovie(movieRes.data);
      } catch (err) {
        console.error('Failed to load movie details for banner:', err);
      }
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

  // Dynamic list of 7 days centered on showtime.show_date
  const getDatesRange = () => {
    if (!showtime?.show_date) return [];
    try {
      const baseDate = new Date(showtime.show_date);
      const dates = [];
      for (let i = -3; i <= 3; i++) {
        const d = new Date(baseDate);
        d.setDate(baseDate.getDate() + i);
        dates.push({
          dayNum: d.getDate().toString().padStart(2, '0'),
          dayName: d.toLocaleString('en-US', { weekday: 'short' }),
          monthName: d.toLocaleString('en-US', { month: 'short' }),
          formatted: d.toISOString().split('T')[0],
          isOriginal: i === 0
        });
      }
      return dates;
    } catch {
      return [];
    }
  };

  const selectedSeatsTiers = selectedSeats.reduce((acc, seatId) => {
    const row = seatId.charAt(0);
    let tier = 'Normal';
    let price = showtime?.regular_price || 250;
    if (['C', 'D', 'E'].includes(row)) {
      tier = 'Deluxe';
      price = (showtime?.regular_price || 250) + 100;
    } else if (['F', 'G', 'H'].includes(row)) {
      tier = 'Super';
      price = showtime?.vip_price || 550;
    }
    acc[tier] = acc[tier] || { count: 0, subtotal: 0 };
    acc[tier].count += 1;
    acc[tier].subtotal += price;
    return acc;
  }, {
    Normal: { count: 0, subtotal: 0 },
    Deluxe: { count: 0, subtotal: 0 },
    Super: { count: 0, subtotal: 0 }
  });

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
    <div className="space-y-6 pb-16">
      
      {/* 🎬 Movie Brief cinematic backdrop banner */}
      {movie && (
        <div className="relative w-full rounded-3xl overflow-hidden border border-slate-200 dark:border-slate-800/80 shadow-md dark:shadow-2xl bg-white dark:bg-[#070d19]/90 p-5 sm:p-6 flex flex-col md:flex-row items-center gap-6">
          {/* Blurred banner cover background */}
          <div 
            className="absolute inset-0 bg-cover bg-center opacity-5 dark:opacity-10 pointer-events-none scale-105 blur-lg" 
            style={{ backgroundImage: `url(${movie.banner_url || movie.poster_url})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 to-transparent dark:from-slate-950 dark:via-slate-950/80 dark:to-transparent pointer-events-none"></div>

          {/* Poster block */}
          <img 
            src={movie.poster_url} 
            alt={movie.title} 
            className="relative z-10 w-28 h-40 object-cover rounded-2xl border border-slate-200 dark:border-slate-800 shadow-2xl shrink-0"
          />

          {/* Title & metadata specs */}
          <div className="relative z-10 text-center md:text-left flex-1 min-w-0 space-y-4">
            <div>
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight leading-snug">{movie.title}</h1>
              
              <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5 text-slate-500 dark:text-slate-400 font-bold text-xs mt-2">
                <div className="flex items-center bg-amber-500/20 border border-amber-500/30 text-amber-600 dark:text-amber-550 rounded px-1.5 py-0.5 text-[10px] font-black tracking-wide">
                  IMDb {movie.rating?.toFixed(1) || '8.1'}/10
                </div>
                <span>•</span>
                <span>{movie.duration_mins || '130'} mins</span>
                <span>•</span>
                <span>{movie.release_date ? movie.release_date.split('-')[0] : '2019'}</span>
                <span>•</span>
                <span className="truncate">{Array.isArray(movie.genre) ? movie.genre.join('/') : 'Action'}</span>
              </div>
            </div>

            {/* Watch Trailer Button */}
            {movie.trailer_url && (
              <button
                onClick={() => setActiveTrailerMovie(movie)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-amber-500/10 hover:bg-amber-500/25 border border-amber-500/30 text-amber-650 dark:text-amber-500 font-black text-xs transition-all shadow-sm active:scale-97 cursor-pointer"
              >
                Watch Trailer ▶
              </button>
            )}
          </div>
        </div>
      )}

      {/* Date, Time, Theater Bar */}
      <div className="bg-white dark:bg-[#070d19]/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-4 flex flex-col lg:flex-row items-center justify-between gap-6 shadow-md dark:shadow-lg">
        {/* Date Selector */}
        <div className="flex items-center gap-4 w-full lg:w-auto overflow-x-auto pb-2 lg:pb-0 scrollbar-none">
          <span className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest shrink-0">Date</span>
          <div className="flex items-center gap-1.5">
            <button className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-slate-800 dark:hover:text-white transition-colors cursor-pointer select-none">&lt;</button>
            <div className="flex items-center gap-2">
              {getDatesRange().map((dObj, idx) => (
                <div
                  key={idx}
                  className={`flex flex-col items-center justify-center py-2 px-3.5 rounded-2xl transition-all select-none min-w-[56px] text-center ${
                    dObj.isOriginal
                      ? 'bg-rose-500 text-white font-extrabold shadow-md'
                      : 'text-slate-500 dark:text-slate-450 font-bold hover:text-slate-800 dark:hover:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900/50'
                  }`}
                >
                  <span className="text-[8px] uppercase tracking-wider font-semibold opacity-80">{dObj.monthName}</span>
                  <span className="text-sm leading-none font-black mt-0.5">{dObj.dayNum}</span>
                  <span className="text-[8px] uppercase tracking-wider font-semibold opacity-70 mt-1">{dObj.dayName}</span>
                </div>
              ))}
            </div>
            <button className="p-1 rounded-full text-slate-400 dark:text-slate-500 hover:text-white transition-colors cursor-pointer select-none">&gt;</button>
          </div>
        </div>

        {/* Time and Theater Selector */}
        <div className="flex items-center gap-6 w-full lg:w-auto shrink-0 justify-end text-xs font-bold text-slate-450 dark:text-slate-400">
          {/* Radial countdown timer embedded */}
          <div className="flex items-center gap-2 bg-slate-50 dark:bg-[#050811] px-3.5 py-2 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-md">
            <Clock className="w-3.5 h-3.5 text-rose-500 animate-pulse" />
            <div className="text-left leading-tight">
              <span className="text-[8px] text-slate-400 dark:text-slate-500 font-bold uppercase tracking-wider block">Lock Expires In</span>
              <span className="text-xs font-mono font-black text-rose-600 dark:text-rose-550">
                {minutes}:{seconds < 10 ? `0${seconds}` : seconds}
              </span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-slate-205 dark:bg-slate-800"></div>

          {/* Time Selector */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-black">Time</span>
            <div className="mt-1 flex items-center gap-1 text-slate-800 dark:text-white font-black">
              <span>{showtime.show_time}</span>
            </div>
          </div>

          <div className="w-[1px] h-8 bg-slate-205 dark:bg-slate-800"></div>

          {/* Theater Selector */}
          <div className="flex flex-col text-left">
            <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-black">Theater</span>
            <div className="mt-1 flex items-center gap-1 text-slate-800 dark:text-white font-black">
              <span>{showtime.theater_name.replace('CinePlex ', '')}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Two Columns Grid: Sidebar (Left) + Seat Layout (Right) */}
      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Left Sidebar Billing & Info */}
        <div className="w-full lg:w-80 shrink-0 space-y-6">
          <div className="bg-white dark:bg-[#070d19]/90 border border-slate-200 dark:border-slate-800 rounded-3xl p-6 shadow-md dark:shadow-xl space-y-6">
            <div>
              <h2 className="text-base font-black text-slate-900 dark:text-white">Your Selected Seats</h2>
              <p className="text-[11px] text-slate-500 dark:text-slate-455 font-bold mt-1">
                {selectedSeats.length} {selectedSeats.length === 1 ? 'Seat' : 'Seats'}
              </p>
            </div>

            {/* Selected Seats Badges */}
            <div className="flex flex-wrap gap-2 min-h-[48px] items-center">
              {selectedSeats.length === 0 ? (
                <p className="text-xs text-slate-400 dark:text-slate-550/40 italic font-medium">No seats selected yet</p>
              ) : (
                selectedSeats.map((s) => (
                  <span key={s} className="px-3.5 py-1.5 rounded-xl bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 text-xs font-black animate-scale-up">
                    {s}
                  </span>
                ))
              )}
            </div>

            {/* Pricing breakdown table */}
            <div className="space-y-3.5 pt-4 border-t border-slate-100 dark:border-slate-800/80 text-xs text-slate-500 dark:text-slate-400 font-bold">
              {selectedSeats.length === 0 ? (
                <div className="py-4 text-center text-slate-400 dark:text-slate-500 space-y-2">
                  <span className="text-3xl block">🎟️</span>
                  <p className="text-[10px] uppercase tracking-wider font-extrabold">No Seats Selected</p>
                  <p className="text-[9px] font-normal leading-normal px-4 text-slate-400/80 dark:text-slate-500">Select seats from the grid to view ticket summary & pricing.</p>
                </div>
              ) : (
                <>
                  {selectedSeatsTiers.Normal.count > 0 && (
                    <div className="flex justify-between items-center animate-fade-in text-slate-700 dark:text-slate-350">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-cyan-500"></span>
                        <span>Normal Class</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800/40">
                        {selectedSeatsTiers.Normal.count} × ₹{showtime.regular_price.toFixed(0)}
                      </span>
                    </div>
                  )}
                  {selectedSeatsTiers.Deluxe.count > 0 && (
                    <div className="flex justify-between items-center animate-fade-in text-slate-700 dark:text-slate-350">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-indigo-500"></span>
                        <span>Deluxe Class</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800/40">
                        {selectedSeatsTiers.Deluxe.count} × ₹{(showtime.regular_price + 100).toFixed(0)}
                      </span>
                    </div>
                  )}
                  {selectedSeatsTiers.Super.count > 0 && (
                    <div className="flex justify-between items-center animate-fade-in text-slate-700 dark:text-slate-350">
                      <div className="flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                        <span>Super Class</span>
                      </div>
                      <span className="font-mono text-slate-600 dark:text-slate-350 bg-slate-50 dark:bg-slate-900/60 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-800/40">
                        {selectedSeatsTiers.Super.count} × ₹{showtime.vip_price.toFixed(0)}
                      </span>
                    </div>
                  )}
                  
                  {/* Convenient Fee or Taxes (adds realism) */}
                  <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-550 pt-2 border-t border-slate-100 dark:border-slate-900/40">
                    <span>Convenience Fee</span>
                    <span className="font-mono">₹30</span>
                  </div>

                  <div className="flex justify-between items-center pt-3 border-t border-slate-200 dark:border-slate-800/60 font-black text-sm text-slate-900 dark:text-white">
                    <span>Est. Total</span>
                    <span className="font-mono text-emerald-600 dark:text-emerald-400 text-sm">₹{(totalPrice + 30).toFixed(0)}</span>
                  </div>
                </>
              )}
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => setShowSnackStep(true)}
                className="w-full py-3.5 rounded-2xl bg-slate-50 dark:bg-[#091020] border border-slate-200 dark:border-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 font-black text-xs flex items-center justify-center gap-2 cursor-pointer transition-all shadow-sm active:scale-97"
              >
                <Utensils className="w-3.5 h-3.5 text-emerald-500" />
                + Add Foods
              </button>

              <button
                onClick={handleProceedToCheckout}
                disabled={locking || selectedSeats.length === 0}
                className={`w-full py-3.5 rounded-2xl font-black text-xs flex items-center justify-center gap-2 transition-all shadow-lg select-none cursor-pointer ${
                  selectedSeats.length > 0 && !locking
                    ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-md border border-rose-500/20 active:scale-97 hover:scale-[1.01]'
                    : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-555 border border-slate-200 dark:border-slate-800/80 cursor-not-allowed opacity-50'
                }`}
              >
                {locking ? 'Locking Seats...' : 'Purchase'}
              </button>
            </div>
          </div>
        </div>

        {/* Right Main Seat Layout */}
        <div className="flex-1 w-full">
          <SeatMap
            bookedSeats={showtime.booked_seats || []}
            lockedSeats={showtime.locked_seats || []}
            selectedSeats={selectedSeats}
            onSeatClick={handleSeatClick}
            regularPrice={showtime.regular_price}
            vipPrice={showtime.vip_price}
          />
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
              className="w-full py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-lg hover:scale-105 active:scale-95 transition-all"
            >
              Pick Seats Again
            </button>
          </div>
        </div>
      )}

      {/* Gourmet Snacks Selection Modal */}
      {showSnackStep && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 dark:bg-slate-950/90 backdrop-blur-md animate-fade-in">
          <div className="relative w-full max-w-xl bg-white dark:bg-slate-950 rounded-3xl border border-slate-200 dark:border-slate-900 shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-scale-up text-slate-800 dark:text-slate-200">
            {/* Header */}
            <div className="p-6 border-b border-slate-200 dark:border-slate-900 flex items-center justify-between bg-slate-55/50 dark:bg-gradient-to-r dark:from-slate-900 dark:via-slate-950 dark:to-slate-900">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 dark:text-amber-400 border border-amber-500/30 flex items-center justify-center shadow-md">
                  <Utensils className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black text-slate-900 dark:text-white flex items-center gap-2">
                    Step 1.5: Customize Your Gourmet Experience <Sparkles className="w-4 h-4 text-amber-600 dark:text-amber-550 fill-amber-500/10 animate-pulse" />
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Skip counter queues! Pre-order and collect at snacks bar.</p>
                </div>
              </div>
            </div>

            {/* Snack Items list */}
            <div className="p-6 space-y-4 overflow-y-auto flex-1 bg-white dark:bg-slate-950">
              {SNACK_ITEMS.map((item) => {
                const qty = selectedSnacks[item.id] || 0;
                return (
                  <div
                    key={item.id}
                    className="p-4 rounded-2xl bg-slate-50/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-850/80 flex items-center justify-between gap-4 hover:border-amber-500/30 transition-all duration-300 animate-fade-in"
                  >
                    <div className="flex items-center gap-3.5 flex-1 min-w-0">
                      <span className="text-3xl bg-white dark:bg-slate-950 p-3 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm shrink-0">{item.image}</span>
                      <div className="min-w-0">
                        <span className="font-black text-sm text-slate-850 dark:text-slate-100 block truncate">{item.name}</span>
                        <span className="text-[10px] text-slate-500 dark:text-slate-450 block truncate font-medium">{item.desc}</span>
                        <span className="text-xs font-mono font-black text-amber-600 dark:text-amber-400 mt-1 inline-block">₹{item.price.toFixed(2)}</span>
                      </div>
                    </div>

                    {/* Qty controller */}
                    <div className="flex items-center gap-2 bg-white dark:bg-slate-950 px-2.5 py-1.5 rounded-2xl border border-slate-200 dark:border-slate-850 shadow-sm shrink-0">
                      <button
                        onClick={() => updateSnackQty(item.id, -1)}
                        className="w-7 h-7 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 flex items-center justify-center font-black text-sm transition-all cursor-pointer select-none"
                      >
                        -
                      </button>
                      <span className="w-6 text-center text-xs font-mono font-black text-slate-800 dark:text-white">{qty}</span>
                      <button
                        onClick={() => updateSnackQty(item.id, 1)}
                        className="w-7 h-7 rounded-xl bg-rose-600 hover:bg-rose-500 text-white flex items-center justify-center font-black text-sm transition-all cursor-pointer shadow-sm select-none"
                      >
                        +
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Footer action bar */}
            <div className="p-6 border-t border-slate-200 dark:border-slate-900 bg-slate-50/95 dark:bg-slate-950/95 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div>
                <span className="text-[10px] text-slate-500 font-bold uppercase block tracking-wider">Snacks Total</span>
                <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                  ₹{snacksTotal.toFixed(2)}
                </span>
              </div>

              <div className="flex gap-3 w-full sm:w-auto">
                <button
                  onClick={() => handleProceedToFinalCheckout({})}
                  className="flex-1 sm:flex-none px-6 py-3.5 rounded-2xl border border-slate-250 dark:border-slate-800 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold text-xs text-slate-650 dark:text-slate-300 transition-colors cursor-pointer"
                >
                  Skip & Proceed
                </button>
                <button
                  onClick={() => handleProceedToFinalCheckout(selectedSnacks)}
                  className="flex-1 sm:flex-none px-8 py-3.5 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer"
                >
                  Add & Proceed
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Trailer Modal Overlay */}
      {activeTrailerMovie && (
        <TrailerModal 
          movie={activeTrailerMovie} 
          onClose={() => setActiveTrailerMovie(null)} 
        />
      )}
    </div>
  );
}
