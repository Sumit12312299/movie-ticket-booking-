import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Film, Star, Sparkles, Play, ChevronRight, ChevronLeft, 
  TrendingUp, Flame, Ticket, Crown, Headphones, Tv, Clapperboard, Zap, Heart, ShieldCheck 
} from 'lucide-react';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

const getAutoplayUrl = (url) => {
  if (!url) return '';
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  const videoId = (match && match[2].length === 11) ? match[2] : null;
  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&playlist=${videoId}&loop=1&controls=0&showinfo=0&rel=0&modestbranding=1&iv_load_policy=3&playsinline=1&enablejsapi=1`;
  }
  return url;
};

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

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('now_showing');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [heroIndex, setHeroIndex] = useState(0);
  const [searchParams] = useSearchParams();

  const [liveQuery, setLiveQuery] = useState(searchParams.get('search') || '');
  const [hoveredHeroId, setHoveredHeroId] = useState(null);
  const [playTrailer, setPlayTrailer] = useState(false);

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

      {/* Featured Hero Premiere Slider (Mockup Style) */}
      {activeHero && !liveQuery && selectedGenre === 'All' && (
        <section 
          onMouseEnter={() => setHoveredHeroId(activeHero.id)}
          onMouseLeave={() => setHoveredHeroId(null)}
          className="relative w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-800 min-h-[460px] sm:min-h-[500px] flex items-end p-6 sm:p-12 pb-16 sm:pb-20 text-white group animate-fade-in gap-8"
        >
          {/* Background Poster Banner */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              key={activeHero.id}
              src={activeHero.banner_url || activeHero.poster_url}
              alt={activeHero.title}
              className={`w-full h-full object-cover object-center filter brightness-50 contrast-110 scale-102 transition-all duration-1000 ease-out ${playTrailer && activeHero.trailer_url ? 'opacity-0 scale-95' : 'opacity-100'}`}
            />
            
            {/* Auto-play Trailer iframe overlay */}
            {playTrailer && activeHero.trailer_url && (
              <div className="absolute inset-0 w-full h-full pointer-events-none transition-all duration-700 ease-in-out opacity-100 scale-105">
                <iframe
                  src={getAutoplayUrl(activeHero.trailer_url)}
                  title={`${activeHero.title} Trailer Preview`}
                  className="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 scale-[1.35] pointer-events-none"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                ></iframe>
                <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply"></div>
              </div>
            )}

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>

          {/* Left Hero Content Details */}
          <div className="relative z-10 flex-1 space-y-4 text-left">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-rose-600 text-white shadow-lg flex items-center gap-1.5">
                <Flame className="w-3.5 h-3.5 animate-pulse" />
                Featured Blockbuster
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500 text-[#070d19] flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-[#070d19] text-[#070d19]" />
                {activeHero.rating ? Number(activeHero.rating).toFixed(1) : '5.0'} Rating
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-white border border-white/15 backdrop-blur-md">
                IMAX 3D • {activeHero.language}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-lg">
              {activeHero.title}
            </h1>

            <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed font-medium max-w-xl">
              {activeHero.synopsis}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-4">
              <Link
                to={`/showtimes/${activeHero.id}`}
                className="px-6 py-3 rounded-2xl bg-rose-600 hover:bg-rose-500 text-white font-extrabold text-xs shadow-xl shadow-rose-600/30 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                Book Tickets Now
              </Link>

              {activeHero.trailer_url && (
                <button
                  onClick={() => setActiveTrailerMovie(activeHero)}
                  className="px-6 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs backdrop-blur-md flex items-center gap-2 border border-white/20 transition-all hover:scale-105 active:scale-95 cursor-pointer"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>

          {/* Right Playlist Stack (Mockup style) */}
          <div className="hidden lg:flex flex-col gap-3 w-72 shrink-0 z-10">
            {featuredMovies.map((m, idx) => (
              <div
                key={m.id}
                onClick={() => setHeroIndex(idx)}
                className={`p-3 rounded-2xl border cursor-pointer transition-all duration-300 flex items-center gap-3 ${
                  heroIndex === idx
                    ? 'bg-slate-900/90 border-rose-500 shadow-md shadow-rose-500/10 scale-102'
                    : 'bg-slate-950/60 border-slate-850 hover:bg-slate-900/60 hover:border-slate-700'
                }`}
              >
                <img
                  src={m.poster_url}
                  alt={m.title}
                  className="w-10 h-14 object-cover rounded-xl border border-slate-800"
                />
                <div className="flex-1 min-w-0 text-left">
                  <h4 className="text-xs font-black text-white truncate">{m.title}</h4>
                  <p className="text-[10px] text-slate-400 font-bold mt-0.5">
                    {Array.isArray(m.genre) ? m.genre[0] : 'Action'} • {m.language}
                  </p>
                  <div className="flex items-center gap-1 mt-1 text-amber-500 text-[10px] font-black">
                    <Star className="w-3 h-3 fill-amber-500" />
                    <span>{m.rating?.toFixed(1) || '5.0'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Bottom features bar matching mockup */}
          <div className="absolute bottom-0 left-0 right-0 bg-slate-950/80 backdrop-blur-md border-t border-slate-900 px-6 sm:px-12 py-3.5 flex flex-wrap items-center justify-between gap-4 z-10 text-[10px] font-black tracking-wider text-slate-400">
            <div className="flex items-center gap-2">
              <Film className="w-3.5 h-3.5 text-rose-500" />
              <span>10,000+ MOVIES & SHOWS</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-rose-500" />
              <span>4K HDR ULTRA HD QUALITY</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <Tv className="w-3.5 h-3.5 text-rose-500" />
              <span>ANY DEVICE WATCH ANYWHERE</span>
            </div>
            <div className="w-[1px] h-4 bg-slate-800 hidden md:block"></div>
            <div className="flex items-center gap-2">
              <Headphones className="w-3.5 h-3.5 text-rose-500" />
              <span>OFFLINE DOWNLOAD & GO</span>
            </div>
          </div>
        </section>
      )}

      {/* Movies Catalog Filter & Header */}
      <section className="space-y-6">
        
        {/* Popular Categories Genre Grid */}
        <div className="space-y-3.5 text-left">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-rose-500" />
            <h3 className="text-sm font-black text-white uppercase tracking-wider">Popular Categories</h3>
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
                      ? 'bg-rose-600 text-white shadow-lg shadow-rose-600/30 scale-105 border-rose-500'
                      : 'bg-[#070d19]/90 text-slate-400 border-slate-800 hover:text-white hover:bg-slate-900/60'
                  }`}
                >
                  <IconComp className={`w-4 h-4 ${isSelected ? 'text-white' : 'text-slate-500'}`} />
                  <span>{genre}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Section Title */}
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-800 pb-4 text-left">
          <div>
            <h2 className="text-lg font-black text-white tracking-tight flex items-center gap-2">
              {selectedStatus === 'now_showing' ? 'Trending Now' : 'Upcoming Blockbusters'}
            </h2>
            <p className="text-xs text-slate-450 font-bold mt-1">Select showtimes & reserve your seats instantly</p>
          </div>

          {/* Status Switcher (Now Showing vs Coming Soon) */}
          <div className="flex items-center gap-1 bg-[#050811] p-1.5 rounded-2xl border border-slate-850 shrink-0">
            <button
              onClick={() => setSelectedStatus('now_showing')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedStatus === 'now_showing'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-500 hover:text-white'
              }`}
            >
              <Film className="w-3.5 h-3.5" /> Now Showing
            </button>
            <button
              onClick={() => setSelectedStatus('coming_soon')}
              className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                selectedStatus === 'coming_soon'
                  ? 'bg-rose-600 text-white shadow-md shadow-rose-600/20'
                  : 'text-slate-500 hover:text-white'
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
          <div className="text-center py-20 bg-[#070d19]/90 rounded-3xl border border-slate-800 space-y-3 shadow-xl">
            <Film className="w-12 h-12 text-slate-500 mx-auto animate-pulse" />
            <h3 className="text-base font-bold text-slate-350">No Movies Found</h3>
            <p className="text-xs text-slate-500 leading-relaxed font-medium">Try selecting another category or check back later.</p>
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
