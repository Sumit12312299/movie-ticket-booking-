// Application main home page
import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useNotification } from '../context/NotificationContext';
import { 
  Film, Star, Sparkles, 
  TrendingUp, Flame, Ticket, Crown, Clapperboard, Zap, Heart 
} from 'lucide-react';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';



function MovieCardSkeleton() {
  return (
    <div className="bg-[#070d19]/90 rounded-2xl border border-slate-800 shadow-md flex flex-col overflow-hidden">
      <div className="aspect-[2/3] w-full shimmer-bg"></div>
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded shimmer-bg"></div>
          <div className="h-3 w-1/2 rounded shimmer-bg"></div>
        </div>
        <div className="pt-2.5 border-t border-slate-800/80 flex items-center gap-2">
          <div className="h-9 w-9 rounded-xl shimmer-bg shrink-0"></div>
          <div className="h-9 flex-1 rounded-xl shimmer-bg"></div>
        </div>
      </div>
    </div>
  );
}

/**
 * HomePage — main landing page of the BookTicket application.
 * Displays a rotating hero banner, quick booking widget, genre filter tabs,
 * and a paginated movie grid with Now Showing / Coming Soon toggle.
 * Integrates search via URL query params and opens a YouTube trailer modal on demand.
 */
export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('now_showing');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const liveQuery = searchParams.get('search') || '';

  const navigate = useNavigate();
  const { addToast } = useNotification();

  const [widgetCity, setWidgetCity] = useState('Mumbai');
  const [widgetDate, setWidgetDate] = useState('Today');
  const [widgetMovieId, setWidgetMovieId] = useState('');
  const [widgetPeople, setWidgetPeople] = useState('1');

  const CITIES = ['Mumbai', 'Delhi NCR', 'Bengaluru', 'Pune', 'Hyderabad', 'Ahmedabad', 'Kolkata', 'Phagwara'];

  const handleWidgetBookClick = () => {
    if (!widgetMovieId) {
      addToast('Please select a movie from the dropdown to book tickets', 'warning');
      return;
    }
    localStorage.setItem('bookticket_city', widgetCity);
    navigate(`/showtimes/${widgetMovieId}`);
  };

  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Adventure', 'Biography', 'Fantasy'];

  const genreIcons = {
    All: Clapperboard,
    Action: Zap,
    Drama: Heart,
    'Sci-Fi': Sparkles,
    Adventure: Film,
    Biography: Crown,
    Fantasy: TrendingUp
  };

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get('/movies', {
        params: {
          search: liveQuery.trim() || undefined,
          genre: selectedGenre !== 'All' ? selectedGenre : undefined,
          status: selectedStatus,
          limit: 20
        }
      });
      setMovies(res.data.items || []);
    } catch (err) {
      console.error('Failed to load movies', err);
    } finally {
      setLoading(false);
    }
  };

  const featuredMovies = movies.slice(0, 3);
  const activeHero = featuredMovies[heroIndex] || movies[0];

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedStatus, liveQuery]);

  // Hero Slider Auto Rotation
  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 3));
    }, 8000);
    return () => clearInterval(interval);
  }, [movies]);

  // Autoplay delay handler
  useEffect(() => {
    if (!hoveredHeroId) {
      setPlayTrailer(false);
      return;
    }
    const timer = setTimeout(() => {
      setPlayTrailer(true);
    }, 1500);
    return () => clearTimeout(timer);
  }, [hoveredHeroId]);

  return (
    <div className="space-y-8 pb-20">
      
      {/* 🎟️ Top Promo Offer Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 rounded-3xl p-3.5 px-6 text-white text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl shadow-rose-600/20">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
            <Zap className="w-4 h-4 text-amber-200 fill-amber-200" />
          </div>
          <span>
            Special Offer: Use promo code <code className="bg-black/30 px-2.5 py-0.5 rounded-md font-mono text-amber-200 font-extrabold">CINEMA10</code> for 10% OFF + 0 Convenience Fee on BookTicket VIP Wallet!
          </span>
        </div>
        <span className="text-[10px] uppercase tracking-wider bg-white/25 px-3 py-1 rounded-full font-black shrink-0 border border-white/30 backdrop-blur-md">
          VIP Deal
        </span>
      </div>

      {/* Redesigned Premium Hero Premiere Banner (Mockup Style) */}
      {!liveQuery && selectedGenre === 'All' && activeHero && (
        <section 
          className="relative w-full rounded-3xl overflow-hidden border border-slate-800 dark:border-slate-850 shadow-2xl p-6 sm:p-12 pb-24 sm:pb-32 text-white group flex flex-col justify-between min-h-[520px]"
        >
          {/* Dynamic background with cross-fade effect */}
          <div 
            className="absolute inset-0 bg-cover bg-center transition-all duration-1000 ease-in-out z-0"
            style={{
              backgroundImage: `linear-gradient(to bottom, rgba(11, 11, 15, 0.3) 0%, rgba(11, 11, 15, 0.85) 60%, rgba(11, 11, 15, 0.98) 100%), url(${activeHero.banner_url || activeHero.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=1600'})`
            }}
          />

          {/* Main Hero grid containing Headline (Left) and Featured Cards (Right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center w-full z-10 pt-4">
            
            {/* Left Headline Section (Dynamic based on activeHero) */}
            <div className="lg:col-span-6 space-y-4 text-left animate-fade-in" key={activeHero.id}>
              {/* Category / Genre Badges */}
              <div className="flex flex-wrap gap-2 items-center">
                <span className="px-3 py-1 rounded-full bg-rose-600/30 border border-rose-500/30 text-rose-450 text-[10px] font-black uppercase tracking-wider">
                  Featured Premiere
                </span>
                {activeHero.genre?.map((g) => (
                  <span key={g} className="px-2.5 py-0.5 rounded-full bg-slate-900/60 border border-slate-800 text-slate-350 text-[9px] font-bold">
                    {g}
                  </span>
                ))}
              </div>

              <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
                {activeHero.title}
              </h1>

              {/* Rating and Meta info */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-200">
                <div className="flex items-center gap-1">
                  <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
                  <span className="font-extrabold">{activeHero.rating ? activeHero.rating.toFixed(1) : '4.8'}/5</span>
                </div>
                <span>•</span>
                <span>{activeHero.status === 'now_showing' ? 'In Theaters' : 'Coming Soon'}</span>
              </div>

              <p className="text-xs sm:text-sm text-slate-305 leading-relaxed font-bold max-w-md pt-2">
                {activeHero.description || `Experience the cinematic magic of ${activeHero.title} at Majestic Grand and PVR Curo Mall. Premium audio and seating configuration ready.`}
              </p>

              {/* Call to Action Button */}
              <div className="pt-4">
                <button
                  onClick={() => navigate(`/movie/${activeHero.id}`)}
                  className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-md transition-all active:scale-95 cursor-pointer inline-flex items-center gap-2"
                >
                  <Ticket className="w-4 h-4" /> Book Tickets
                </button>
              </div>
            </div>

            {/* Right Cards Stack (Mockup Movies Grid) */}
            <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-12 gap-4 w-full z-10">
              {/* Column 1: Middle Cards (Two Horizontal Cards) */}
              <div className="sm:col-span-7 flex flex-col gap-4">
                {featuredMovies.slice(0, 2).map((m, idx) => {
                  const isActive = heroIndex === idx;
                  return (
                    <div
                      key={m.id}
                      onClick={() => setHeroIndex(idx)}
                      className={`relative aspect-video sm:h-[135px] rounded-xl overflow-hidden border cursor-pointer group/card transition-all duration-300 ${
                        isActive 
                          ? 'border-rose-500 scale-[1.03] shadow-lg' 
                          : 'border-slate-800 hover:border-[#FF5F45]/40 hover:scale-[1.01]'
                      }`}
                    >
                      <img
                        src={m.banner_url || m.poster_url}
                        alt={m.title}
                        className="w-full h-full object-cover filter brightness-75 group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/90 via-[#0B0B0F]/20 to-transparent"></div>
                      
                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
                      )}

                      {/* Now Showing Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[8px] uppercase tracking-wider">
                        {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                      </span>

                      {/* Rating Badge */}
                      <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/60 border border-slate-700/60 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                        <span className="text-[9px] font-black text-white">{m.rating ? m.rating.toFixed(1) : '4.5'}/5</span>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                        <h4 className="text-xs font-black text-white truncate">{m.title}</h4>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Column 2: Right Card (One Full-Height Vertical Card) */}
              <div className="sm:col-span-5">
                {featuredMovies[2] && (() => {
                  const idx = 2;
                  const m = featuredMovies[idx];
                  const isActive = heroIndex === idx;
                  return (
                    <div
                      onClick={() => setHeroIndex(idx)}
                      className={`relative w-full h-[286px] rounded-xl overflow-hidden border cursor-pointer group/card transition-all duration-300 ${
                        isActive 
                          ? 'border-rose-500 scale-[1.03] shadow-lg' 
                          : 'border-slate-800 hover:border-[#FF5F45]/40 hover:scale-[1.01]'
                      }`}
                    >
                      <img
                        src={m.poster_url}
                        alt={m.title}
                        className="w-full h-full object-cover filter brightness-75 group-hover/card:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0F]/95 via-[#0B0B0F]/10 to-transparent"></div>

                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute top-0 left-0 right-0 h-1 bg-rose-500"></div>
                      )}

                      {/* Release Date Badge */}
                      <span className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded bg-amber-500 text-black font-extrabold text-[8px] uppercase tracking-wider">
                        {m.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
                      </span>

                      {/* Rating Badge */}
                      <div className="absolute top-2.5 right-2.5 px-1.5 py-0.5 rounded bg-black/60 border border-slate-700/60 flex items-center gap-0.5">
                        <Star className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />
                        <span className="text-[9px] font-black text-white">{m.rating ? m.rating.toFixed(1) : '4.8'}/5</span>
                      </div>

                      {/* Title */}
                      <div className="absolute bottom-2.5 left-2.5 right-2.5 text-left">
                        <h4 className="text-xs font-black text-white truncate">{m.title}</h4>
                        <span className="text-[9px] text-slate-400 font-bold block mt-0.5 truncate">
                          {m.genre?.join(' • ')}
                        </span>
                      </div>
                    </div>
                  );
                })()}
              </div>
            </div>
          </div>

          {/* Slide Indicator Dots at bottom left */}
          <div className="absolute bottom-28 left-6 sm:left-12 z-10 flex gap-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setHeroIndex(idx)}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  heroIndex === idx ? 'w-6 bg-rose-500' : 'w-1.5 bg-white/40 hover:bg-white/80'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </section>
      )}

      {/* Floating Booking Widget Selector (Only if Hero Banner is visible) */}
      {!liveQuery && selectedGenre === 'All' && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-4xl px-4 z-20">
            <div className="bg-[#15151C]/90 backdrop-blur-md rounded-2xl border border-white/5 p-4 sm:py-5 sm:px-6 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full text-left">
                {/* Location Picker */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Location</span>
                  <div className="relative">
                    <select
                      value={widgetCity}
                      onChange={(e) => setWidgetCity(e.target.value)}
                      className="w-full bg-transparent text-xs font-black text-white pr-6 py-1 focus:outline-none cursor-pointer appearance-none"
                    >
                      {CITIES.map((c) => (
                        <option key={c} value={c} className="bg-[#15151C] text-white font-bold">{c}</option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>

                {/* Date Picker */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Date</span>
                  <div className="relative">
                    <select
                      value={widgetDate}
                      onChange={(e) => setWidgetDate(e.target.value)}
                      className="w-full bg-transparent text-xs font-black text-white pr-6 py-1 focus:outline-none cursor-pointer appearance-none"
                    >
                      <option value="Today" className="bg-[#15151C] text-white font-bold">Today, {new Date().toLocaleDateString(undefined, {month:'short', day:'numeric'})}</option>
                      <option value="Tomorrow" className="bg-[#15151C] text-white font-bold">Tomorrow</option>
                      <option value="Day after" className="bg-[#15151C] text-white font-bold">Day after</option>
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>

                {/* Movie Picker */}
                <div className="space-y-1 col-span-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">Movie</span>
                  <div className="relative">
                    <select
                      value={widgetMovieId}
                      onChange={(e) => setWidgetMovieId(e.target.value)}
                      className="w-full bg-transparent text-xs font-black text-white pr-6 py-1 focus:outline-none cursor-pointer appearance-none truncate"
                    >
                      <option value="" className="bg-[#15151C] text-slate-400 font-bold">Select Movie...</option>
                      {movies.map((m) => (
                        <option key={m.id} value={m.id} className="bg-[#15151C] text-white font-bold">{m.title}</option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>

                {/* People Count Picker */}
                <div className="space-y-1">
                  <span className="text-[9px] uppercase font-black text-slate-400 tracking-wider">People</span>
                  <div className="relative">
                    <select
                      value={widgetPeople}
                      onChange={(e) => setWidgetPeople(e.target.value)}
                      className="w-full bg-transparent text-xs font-black text-white pr-6 py-1 focus:outline-none cursor-pointer appearance-none"
                    >
                      {[1,2,3,4,5,6,7,8].map((n) => (
                        <option key={n} value={n} className="bg-[#15151C] text-white font-bold">{n} Person{n > 1 ? 's' : ''}</option>
                      ))}
                    </select>
                    <span className="absolute right-0 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none text-[10px]">▼</span>
                  </div>
                </div>
              </div>

              {/* Book Now trigger */}
              <button
                onClick={handleWidgetBookClick}
                className="w-full md:w-auto px-8 py-3 rounded-xl bg-[#FF5F45] hover:bg-[#FF7A5C] text-white font-extrabold text-xs tracking-wider uppercase transition-all shadow-md hover:scale-[1.02] active:scale-[0.98] shrink-0"
              >
                Book Now
              </button>
            </div>
          </div>
        )}

      {/* Movies Catalog Filter & Header */}
      <section className="space-y-6">
        
        {/* Popular Categories Genre Grid */}
        <div className="space-y-3.5 text-left">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-black text-slate-800 dark:text-white uppercase tracking-wider">Popular Categories</h3>
          </div>
          <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none justify-start">
            {genres.map((genre) => {
              const IconComp = genreIcons[genre] || Clapperboard;
              const isSelected = selectedGenre === genre;
              return (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`py-3 px-6 rounded-2xl text-xs font-black shrink-0 transition-all flex items-center gap-2 cursor-pointer border ${
                    isSelected
                      ? 'bg-rose-600 text-white shadow-md scale-105 border-rose-500'
                      : 'bg-white dark:bg-[#070d19]/90 text-slate-650 dark:text-slate-400 border-slate-200 dark:border-slate-800 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-900/60 shadow-sm'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-550 dark:text-slate-500'}`} />
                  <span>{genre}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4 text-left">
          <div>
            <h2 className="text-lg font-black text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              {selectedStatus === 'now_showing' ? 'Trending Now' : 'Upcoming Blockbusters'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-450 font-bold mt-1">Select showtimes & reserve your seats instantly</p>
          </div>

          {/* Status Switcher (Now Showing vs Coming Soon) */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-[#050811] p-1.5 rounded-2xl border border-slate-205 dark:border-slate-850 shrink-0">
            <button
              onClick={() => setSelectedStatus('now_showing')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedStatus === 'now_showing'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-550 dark:text-slate-500 hover:text-slate-850 dark:hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Now Showing
            </button>
            <button
              onClick={() => setSelectedStatus('coming_soon')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedStatus === 'coming_soon'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'text-slate-550 dark:text-slate-500 hover:text-slate-850 dark:hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" /> Coming Soon
            </button>
          </div>
        </div>

        {/* Movies Grid / Carousel */}
        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((n) => (
              <MovieCardSkeleton key={n} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-[#070d19]/90 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-md dark:shadow-xl text-slate-800 dark:text-slate-200">
            <Film className="w-12 h-12 text-slate-400 dark:text-slate-500 mx-auto animate-pulse" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-350">No Movies Found</h3>
            <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed font-medium">Try selecting another category or check back later.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 animate-fade-in">
            {movies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} onOpenTrailer={setActiveTrailerMovie} />
            ))}
          </div>
        )}
      </section>

      {/* Trailer Modal */}
      {activeTrailerMovie && (
        <TrailerModal movie={activeTrailerMovie} onClose={() => setActiveTrailerMovie(null)} />
      )}
    </div>
  );
}
