import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, Clock, MapPin, Film, ChevronRight, ShieldCheck } from 'lucide-react';
import API from '../services/api';

export default function ShowtimeSelectionPage() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [showtimes, setShowtimes] = useState([]);
  const [loading, setLoading] = useState(true);

  // Date selection calculation
  const today = new Date().toISOString().split('T')[0];
  const tomorrow = new Date(Date.now() + 86400000).toISOString().split('T')[0];
  const dayAfter = new Date(Date.now() + 172800000).toISOString().split('T')[0];

  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedScreen, setSelectedScreen] = useState('All');

  useEffect(() => {
    fetchData();
  }, [movieId, selectedDate]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [mRes, stRes] = await Promise.all([
        API.get(`/movies/${movieId}`),
        API.get('/showtimes', { params: { movie_id: movieId, show_date: selectedDate } })
      ]);
      setMovie(mRes.data);
      setShowtimes(stRes.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Group showtimes by theater
  const filteredShowtimes = showtimes.filter(
    (st) => selectedScreen === 'All' || st.screen_type.includes(selectedScreen)
  );

  const theatersGrouped = filteredShowtimes.reduce((acc, st) => {
    if (!acc[st.theater_name]) acc[st.theater_name] = [];
    acc[st.theater_name].push(st);
    return acc;
  }, {});

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16">
      {/* Header Banner */}
      {movie && (
        <div className="glass-panel p-6 rounded-3xl border border-slate-800 flex flex-col sm:flex-row items-center gap-6">
          <img
            src={movie.poster_url}
            alt={movie.title}
            className="w-24 h-36 object-cover rounded-2xl shadow-xl border border-slate-700"
          />
          <div className="space-y-2 text-center sm:text-left flex-1">
            <span className="px-3 py-1 rounded-full text-[10px] uppercase font-bold bg-rose-600/20 text-rose-400 border border-rose-500/30">
              Select Showtime
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{movie.title}</h1>
            <p className="text-xs text-slate-400">
              {movie.duration_mins} mins • {movie.language} • {movie.genre.join(', ')}
            </p>
          </div>
        </div>
      )}

      {/* Date Navigation Bar */}
      <div className="glass-card p-4 rounded-3xl border border-slate-800 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-rose-500" />
          <span className="text-sm font-bold text-white">Select Date:</span>
        </div>

        <div className="flex items-center gap-2">
          {[
            { label: 'Today', date: today },
            { label: 'Tomorrow', date: tomorrow },
            { label: 'Day After', date: dayAfter }
          ].map((item) => (
            <button
              key={item.date}
              onClick={() => setSelectedDate(item.date)}
              className={`px-5 py-2.5 rounded-2xl text-xs font-bold transition-all ${
                selectedDate === item.date
                  ? 'bg-gradient-to-r from-rose-600 to-rose-500 text-white shadow-lg shadow-rose-600/30 scale-105'
                  : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {item.label} ({item.date.slice(5)})
            </button>
          ))}
        </div>
      </div>

      {/* Screen Format Filters */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2">
        <span className="text-xs font-semibold text-slate-400 shrink-0">Screen Format:</span>
        {['All', 'IMAX', 'Dolby', 'Standard 2D'].map((fmt) => (
          <button
            key={fmt}
            onClick={() => setSelectedScreen(fmt)}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-medium shrink-0 transition-colors ${
              selectedScreen === fmt
                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
            }`}
          >
            {fmt}
          </button>
        ))}
      </div>

      {/* Theaters & Showtimes Grid */}
      {loading ? (
        <div className="space-y-4">
          {[1, 2].map((n) => (
            <div key={n} className="h-40 rounded-3xl bg-slate-900/60 animate-pulse border border-slate-800"></div>
          ))}
        </div>
      ) : Object.keys(theatersGrouped).length === 0 ? (
        <div className="text-center py-16 glass-card rounded-3xl space-y-3">
          <Clock className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Screenings Available</h3>
          <p className="text-xs text-slate-500">No showtimes found for the selected date and screen format.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(theatersGrouped).map(([theaterName, slots]) => (
            <div key={theaterName} className="glass-card rounded-3xl p-6 border border-slate-800 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-5 h-5 text-rose-500" />
                  <h3 className="text-lg font-extrabold text-white">{theaterName}</h3>
                </div>
                <span className="text-xs text-slate-400 font-semibold">{slots[0]?.screen_type}</span>
              </div>

              {/* Showtimes Buttons */}
              <div className="flex flex-wrap gap-3 pt-2">
                {slots.map((st) => (
                  <button
                    key={st.id}
                    onClick={() => navigate(`/seats/${st.id}`)}
                    className="group px-5 py-3 rounded-2xl bg-slate-900 hover:bg-rose-600 border border-slate-800 hover:border-rose-500 transition-all flex flex-col items-center gap-1 shadow-md hover:scale-105"
                  >
                    <span className="text-sm font-black text-white group-hover:text-white">{st.show_time}</span>
                    <span className="text-[10px] text-emerald-400 group-hover:text-rose-100 font-semibold">
                      ${st.regular_price.toFixed(2)}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
