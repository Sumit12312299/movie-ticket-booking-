import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { 
  Calendar, Clock, MapPin, Film, ChevronRight, ShieldCheck, 
  Sparkles, Tv, Volume2, Search, ArrowLeft, Coffee, Wifi, 
  HelpCircle, Star, Flame, Compass, Info, CheckCircle2
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';

export default function ShowtimeSelectionPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedScreen, setSelectedScreen] = useState('All');
  const [selectedTimeOfDay, setSelectedTimeOfDay] = useState('All');

  // Date selection calculation using local time
  const getLocalDateString = (offsetDays = 0) => {
    const d = new Date();
    d.setDate(d.getDate() + offsetDays);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const today = getLocalDateString(0);
  const [selectedDate, setSelectedDate] = useState(today);

  // Generate next 7 days list for date carousel
  const dateList = [];
  for (let i = 0; i < 7; i++) {
    dateList.push(getLocalDateString(i));
  }

  const getDayDetails = (dateStr) => {
    const parts = dateStr.split('-');
    const d = new Date(parts[0], parts[1] - 1, parts[2]);
    const weekday = d.toLocaleDateString('en-US', { weekday: 'short' });
    const day = d.toLocaleDateString('en-US', { day: '2-digit' });
    const month = d.toLocaleDateString('en-US', { month: 'short' });
    return { weekday, day, month };
  };

  useEffect(() => {
    fetchData();
  }, [movieId, selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const params = { movie_id: movieId, show_date: selectedDate };
      const [mRes, stRes] = await Promise.all([
        API.get(`/movies/${movieId}`),
        API.get('/showtimes', { params })
      ]);
      setMovie(mRes.data);
      setShowtimes(stRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const parseTimeToHour = (timeStr) => {
    const [time, modifier] = timeStr.split(' ');
    let [hours] = time.split(':').map(Number);
    if (modifier === 'PM' && hours < 12) {
      hours += 12;
    }
    if (modifier === 'AM' && hours === 12) {
      hours = 0;
    }
    return hours;
  };

  // Filters logic
  const filteredShowtimes = showtimes.filter((st) => {
    const matchesScreen = selectedScreen === 'All' || st.screen_type.includes(selectedScreen);
    const matchesSearch = st.theater_name.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesTime = true;
    if (selectedTimeOfDay !== 'All') {
      const hour = parseTimeToHour(st.show_time);
      if (selectedTimeOfDay === 'Morning') matchesTime = hour < 12;
      else if (selectedTimeOfDay === 'Afternoon') matchesTime = hour >= 12 && hour < 17;
      else if (selectedTimeOfDay === 'Evening') matchesTime = hour >= 17 && hour < 21;
      else if (selectedTimeOfDay === 'Night') matchesTime = hour >= 21;
    }

    return matchesScreen && matchesSearch && matchesTime;
  });

  // Group showtimes by theater
  const theatersGrouped = filteredShowtimes.reduce((acc, st) => {
    if (!acc[st.theater_name]) acc[st.theater_name] = [];
    acc[st.theater_name].push(st);
    return acc;
  }, {});

  const getTheaterFeatures = (name) => {
    if (name.includes('IMAX')) {
      return [
        { icon: <Tv className="w-3.5 h-3.5" />, label: 'IMAX Laser 3D' },
        { icon: <Volume2 className="w-3.5 h-3.5" />, label: 'Dolby Atmos 12.1' },
        { icon: <Coffee className="w-3.5 h-3.5" />, label: 'VIP Recliners' }
      ];
    } else if (name.includes('Starlight')) {
      return [
        { icon: <Tv className="w-3.5 h-3.5" />, label: 'Dolby Atmos' },
        { icon: <Wifi className="w-3.5 h-3.5" />, label: 'Snack Counter' },
        { icon: <Coffee className="w-3.5 h-3.5" />, label: 'Cozy Seats' }
      ];
    } else {
      return [
        { icon: <Tv className="w-3.5 h-3.5" />, label: 'Digital 2K' },
        { icon: <Coffee className="w-3.5 h-3.5" />, label: 'Soft Drinks & Popcorn' }
      ];
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.08 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 100 } }
  };

  return (
    <div className="relative max-w-5xl mx-auto space-y-8 pb-20 px-4 md:px-0">
      {/* Background Decorative Ambient Blobs */}
      <div className="absolute top-10 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-20 right-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Top Header Actions */}
      <div className="flex items-center justify-between">
        <Link 
          to={`/movie/${movieId}`}
          className="flex items-center gap-2 text-xs font-black text-rose-500 hover:text-rose-400 bg-rose-500/10 hover:bg-rose-500/20 px-4 py-2 rounded-2xl border border-rose-500/20 transition-all shadow-sm"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Details
        </Link>
        <span className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-500" />
          100% Secure Checkout
        </span>
      </div>

      {/* Header Banner Card with Spotify-style background blur */}
      {movie && (
        <div className="relative overflow-hidden glass-panel rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl p-6 md:p-8 flex flex-col sm:flex-row items-center gap-8">
          {/* Blurred Background Art */}
          <div 
            className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 dark:opacity-25 -z-10 scale-110"
            style={{ backgroundImage: `url(${movie.banner_url || movie.poster_url})` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-white/80 via-white/40 to-white/10 dark:from-slate-950/80 dark:via-slate-950/40 dark:to-slate-950/10 -z-10"></div>

          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-28 h-40 object-cover rounded-2xl shadow-2xl border-2 border-white dark:border-slate-700 hover:scale-105 transition-transform duration-500"
          />
          
          <div className="space-y-4 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="px-3 py-1 rounded-full text-[10px] uppercase font-black bg-rose-600/90 text-white shadow-md shadow-rose-600/20 flex items-center gap-1">
                <Sparkles className="w-3 h-3 fill-white" />
                Select Showtime
              </span>
              <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/30 flex items-center gap-0.5">
                <Star className="w-3 h-3 fill-amber-500 text-amber-500" />
                {movie.rating.toFixed(1)} / 5.0
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl font-black text-slate-900 dark:text-white tracking-tight">{movie.title}</h1>
            <p className="text-sm font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
              {movie.duration_mins} mins • {movie.language} • {movie.genre.join(', ')}
            </p>
            <div className="text-xs text-slate-450 dark:text-slate-400 max-w-xl line-clamp-2">
              {movie.synopsis}
            </div>
          </div>
        </div>
      )}

      {/* Modern Date Navigation Carousel */}
      <div className="glass-card p-5 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-rose-500/10 flex items-center justify-center">
              <Calendar className="w-4 h-4 text-rose-500" />
            </div>
            <span className="text-sm font-black text-slate-900 dark:text-white">Choose Screening Date</span>
          </div>
          
          {/* Custom Date Input for manual picking */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl px-3 py-1.5 shadow-inner">
            <input
              type="date"
              value={selectedDate}
              min={today}
              onChange={(e) => e.target.value && setSelectedDate(e.target.value)}
              className="bg-transparent text-[11px] font-bold text-slate-700 dark:text-slate-300 focus:outline-none cursor-pointer"
            />
          </div>
        </div>

        {/* Date Selector List */}
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-thin scrollbar-thumb-slate-800">
          {dateList.map((dateVal) => {
            const isSelected = selectedDate === dateVal;
            const { weekday, day, month } = getDayDetails(dateVal);
            return (
              <button
                key={dateVal}
                onClick={() => setSelectedDate(dateVal)}
                className={`flex-1 min-w-[76px] py-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-xl shadow-rose-500/35 border border-rose-400/20 scale-[1.03]'
                    : 'bg-slate-100/60 dark:bg-slate-900/60 text-slate-550 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-900 hover:text-slate-900 dark:hover:text-white border border-slate-200/50 dark:border-slate-800/80'
                }`}
              >
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-white/80' : 'text-slate-400'}`}>
                  {weekday}
                </span>
                <span className="text-lg font-black leading-none">
                  {day}
                </span>
                <span className={`text-[9px] font-extrabold uppercase ${isSelected ? 'text-white/80' : 'text-slate-500'}`}>
                  {month}
                </span>
              </button>
            );
          })}

          {/* Show Custom Date if it falls outside the 7 days */}
          {!dateList.includes(selectedDate) && (
            <button
              onClick={() => setSelectedDate(selectedDate)}
              className="flex-1 min-w-[90px] py-3.5 rounded-2xl flex flex-col items-center gap-1.5 transition-all duration-300 bg-gradient-to-tr from-rose-600 to-rose-500 text-white shadow-xl shadow-rose-500/35 border border-rose-400/20 scale-[1.03]"
            >
              <span className="text-[10px] font-bold uppercase tracking-wider text-white/80">Custom</span>
              <span className="text-lg font-black leading-none">{selectedDate.split('-')[2]}</span>
              <span className="text-[9px] font-extrabold uppercase text-white/80">
                {new Date(selectedDate).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          )}
        </div>
      </div>

      {/* Advanced Filters Panel: Search + Screen Format + Time range */}
      <div className="bg-white/40 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 p-5 rounded-3xl shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Theater Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 dark:text-slate-550" />
            <input
              type="text"
              placeholder="Search by multiplex name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200/50 dark:border-slate-800 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-800 dark:text-slate-250 placeholder-slate-400 dark:placeholder-slate-550 focus:outline-none focus:border-rose-500 shadow-inner"
            />
          </div>

          {/* Time range filters */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 mr-1 flex items-center gap-1">
              <Clock className="w-3 h-3" /> Time Range:
            </span>
            {['All', 'Morning', 'Afternoon', 'Evening', 'Night'].map((timeText) => (
              <button
                key={timeText}
                onClick={() => setSelectedTimeOfDay(timeText)}
                className={`px-3 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                  selectedTimeOfDay === timeText
                    ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800/80'
                }`}
              >
                {timeText}
              </button>
            ))}
          </div>
        </div>

        {/* Screen formats subbar */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-slate-200/50 dark:border-slate-800/50">
          <span className="text-[10px] font-black uppercase text-slate-450 dark:text-slate-500 mr-1 flex items-center gap-1">
            <Tv className="w-3 h-3" /> Format:
          </span>
          {['All', 'IMAX', 'Dolby', 'Standard 2D'].map((fmt) => (
            <button
              key={fmt}
              onClick={() => setSelectedScreen(fmt)}
              className={`px-3.5 py-1.5 rounded-xl text-[10px] font-black transition-all ${
                selectedScreen === fmt
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-650 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white border border-slate-200/80 dark:border-slate-800/80'
              }`}
            >
              {fmt}
            </button>
          ))}
        </div>
      </div>

      {/* Theaters & Showtimes Grid with Framer Motion animations */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-44 rounded-3xl bg-slate-200/50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800 shimmer-bg flex flex-col justify-between p-6">
              <div className="flex justify-between items-center">
                <div className="h-6 w-48 rounded shimmer-bg"></div>
                <div className="h-4 w-20 rounded shimmer-bg"></div>
              </div>
              <div className="flex gap-4 pt-4">
                <div className="h-14 w-24 rounded-2xl shimmer-bg"></div>
                <div className="h-14 w-24 rounded-2xl shimmer-bg"></div>
              </div>
            </div>
          ))}
        </div>
      ) : Object.keys(theatersGrouped).length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="text-center py-20 glass-card rounded-3xl space-y-4 border border-slate-200 dark:border-slate-800 shadow-xl"
        >
          <Compass className="w-16 h-16 text-slate-450 dark:text-slate-700 mx-auto animate-bounce" />
          <h3 className="text-xl font-black text-slate-750 dark:text-slate-200">No Matching Screenings</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
            No showtimes match your current filters. Try selecting a different date, clearing filters, or choosing another screen format.
          </p>
        </motion.div>
      ) : (
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="space-y-6"
        >
          <AnimatePresence mode="popLayout">
            {Object.entries(theatersGrouped).map(([theaterName, slots]) => (
              <motion.div 
                key={theaterName} 
                variants={itemVariants}
                layout
                className="glass-card rounded-3xl p-6 border border-slate-200/70 dark:border-slate-800/80 space-y-5 shadow-xl hover:shadow-2xl hover:border-rose-500/20 dark:hover:border-rose-500/10 transition-all duration-300"
              >
                {/* Theater Header Details */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-slate-200/60 dark:border-slate-800/60 pb-4 gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2">
                      <MapPin className="w-4 h-4 text-rose-500 fill-rose-500/10" />
                      <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">{theaterName}</h3>
                    </div>
                    {/* Amenities list */}
                    <div className="flex flex-wrap gap-3 items-center pt-0.5">
                      {getTheaterFeatures(theaterName).map((f, i) => (
                        <span key={i} className="flex items-center gap-1 text-[9px] font-black uppercase text-slate-450 dark:text-slate-500 bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-850 px-2 py-0.5 rounded-md">
                          {f.icon}
                          {f.label}
                        </span>
                      ))}
                    </div>
                  </div>

                  <span className="px-3.5 py-1.5 rounded-2xl bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:text-amber-300 text-xs font-black self-start sm:self-center flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5" />
                    {slots[0]?.screen_type}
                  </span>
                </div>

                {/* Showtimes Tickets List */}
                <div className="flex flex-wrap gap-4 pt-1">
                  {slots.map((st) => {
                    const totalSeats = 120;
                    const bookedCount = (st.booked_seats || []).length;
                    const remaining = totalSeats - bookedCount;
                    const occupancyPercentage = (remaining / totalSeats) * 100;
                    const isFillingFast = remaining < 15;

                    return (
                      <button
                        key={st.id}
                        onClick={() => navigate(`/seats/${st.id}`)}
                        className="group relative px-6 py-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 hover:bg-gradient-to-tr hover:from-rose-600 hover:to-rose-500 border border-slate-200 dark:border-slate-800/80 hover:border-transparent transition-all duration-300 flex flex-col items-center justify-between min-w-[130px] min-h-[96px] shadow-sm hover:shadow-xl hover:shadow-rose-600/25 hover:-translate-y-1 overflow-hidden"
                      >
                        {/* Occupancy Indicator Color Line (Top of ticket) */}
                        <div className="absolute top-0 left-0 w-full h-[3px] bg-slate-200 dark:bg-slate-850 group-hover:bg-white/20">
                          <div 
                            className={`h-full transition-all duration-500 ${isFillingFast ? 'bg-red-500' : 'bg-emerald-500'}`}
                            style={{ width: `${occupancyPercentage}%` }}
                          ></div>
                        </div>

                        {/* Showing Time */}
                        <span className="text-base font-black text-slate-900 dark:text-white group-hover:text-white transition-colors flex items-center gap-1 mt-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400 group-hover:text-white/80" />
                          {st.show_time}
                        </span>

                        {/* Price Details */}
                        <span className="text-xs text-emerald-600 dark:text-emerald-400 group-hover:text-amber-200 font-extrabold transition-colors">
                          ₹{st.regular_price.toFixed(2)}
                        </span>

                        {/* Live Remaining Seats Urgency Badge */}
                        <span className={`text-[8px] font-black uppercase flex items-center gap-0.5 mt-0.5 px-2 py-0.5 rounded-full ${
                          isFillingFast 
                            ? 'bg-red-500/10 text-red-500 border border-red-500/25 group-hover:bg-white/20 group-hover:text-white group-hover:border-transparent animate-pulse'
                            : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/25 group-hover:bg-white/20 group-hover:text-white group-hover:border-transparent'
                        }`}>
                          {isFillingFast ? (
                            <>
                              <Flame className="w-2.5 h-2.5 fill-red-500 group-hover:fill-white" />
                              {remaining} Seats Left!
                            </>
                          ) : (
                            <>
                              <CheckCircle2 className="w-2.5 h-2.5 text-emerald-500 group-hover:text-white" />
                              {remaining} Seats Left
                            </>
                          )}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
}
