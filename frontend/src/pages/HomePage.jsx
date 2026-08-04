import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Film, Search, Star, Sparkles, Filter, Play, ChevronRight, ChevronLeft, TrendingUp, Flame, Tag, ShieldCheck, Ticket, Crown, Headphones, Tv, Clapperboard, Zap } from 'lucide-react';
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
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md flex flex-col overflow-hidden">
      <div className="aspect-[2/3] w-full shimmer-bg"></div>
      <div className="p-3.5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <div className="h-4 w-3/4 rounded shimmer-bg"></div>
          <div className="h-3 w-1/2 rounded shimmer-bg"></div>
          <div className="flex gap-1.5 mt-2">
            <div className="h-4 w-12 rounded shimmer-bg"></div>
            <div className="h-4 w-14 rounded shimmer-bg"></div>
          </div>
        </div>
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
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


  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Adventure', 'Cyberpunk', 'Biography', 'Fantasy'];

  const experienceBadges = [
    { title: 'IMAX 3D Laser', icon: Tv, color: 'text-sky-500', desc: '4K Dual Laser Projection' },
    { title: 'VIP Recliner Lounge', icon: Crown, color: 'text-amber-500', desc: 'Plush Leather Recliners' },
    { title: 'Dolby Atmos Audio', icon: Headphones, color: 'text-emerald-500', desc: '360° Spatial Sound' },
    { title: '4DX Motion Experience', icon: Clapperboard, color: 'text-red-500', desc: 'Environmental Effects' }
  ];

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

  const featuredMovies = movies.slice(0, 4);
  const activeHero = featuredMovies[heroIndex] || movies[0];

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedStatus, liveQuery]);

  // Hero Slider Auto Rotation
  useEffect(() => {
    if (!movies.length) return;
    const interval = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % Math.min(movies.length, 4));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  // Netflix-style Autoplay hover trailer delay handler
  useEffect(() => {
    if (!hoveredHeroId) {
      setPlayTrailer(false);
      return;
    }
    const timer = setTimeout(() => {
      setPlayTrailer(true);
    }, 1200);
    return () => clearTimeout(timer);
  }, [hoveredHeroId]);

  // Update hoveredHeroId when the slider changes activeHero while mouse is hovered
  useEffect(() => {
    if (hoveredHeroId && activeHero && hoveredHeroId !== activeHero.id) {
      setHoveredHeroId(activeHero.id);
    }
  }, [activeHero, hoveredHeroId]);

  return (
    <div className="space-y-10 pb-20">
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

      {/* Featured Hero Premiere Slider */}
      {activeHero && !liveQuery && selectedGenre === 'All' && (
        <section 
          onMouseEnter={() => setHoveredHeroId(activeHero.id)}
          onMouseLeave={() => setHoveredHeroId(null)}
          className="relative w-full rounded-3xl overflow-hidden bg-slate-950 shadow-2xl border border-slate-200 dark:border-slate-800 min-h-[480px] sm:min-h-[520px] flex items-end p-6 sm:p-12 text-white group animate-fade-in"
        >
          {/* Background Poster Banner */}
          <div className="absolute inset-0 z-0 overflow-hidden">
            <img
              key={activeHero.id}
              src={activeHero.banner_url || activeHero.poster_url}
              alt={activeHero.title}
              className={`w-full h-full object-cover object-center filter brightness-60 contrast-110 scale-105 group-hover:scale-100 transition-all duration-1000 ease-out ${playTrailer && activeHero.trailer_url ? 'opacity-0 scale-95' : 'opacity-100'}`}
            />
            
            {/* Netflix-style Auto-play Trailer iframe overlay */}
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
                {/* Overlay to dim the video and blend it cinematically */}
                <div className="absolute inset-0 bg-slate-950/40 mix-blend-multiply"></div>
              </div>
            )}

            {/* Cinematic Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/80 to-transparent"></div>
          </div>

          {/* Hero Slider Navigation Arrows */}
          {featuredMovies.length > 1 && (
            <>
              <button
                onClick={() => setHeroIndex((prev) => (prev - 1 + featuredMovies.length) % featuredMovies.length)}
                className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-110"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>
              <button
                onClick={() => setHeroIndex((prev) => (prev + 1) % featuredMovies.length)}
                className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-slate-900/60 hover:bg-rose-600 text-white border border-white/20 flex items-center justify-center backdrop-blur-md transition-all shadow-lg hover:scale-110"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          {/* Hero Content Details */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Blockbuster
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-slate-950 flex items-center gap-1 shadow-md">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                {activeHero.rating ? Number(activeHero.rating).toFixed(1) : '5.0'} / 5.0 Rating
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white border border-white/20 backdrop-blur-md">
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
                className="px-7 py-3.5 rounded-2xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/40 flex items-center gap-2 transition-all hover:scale-105 active:scale-95"
              >
                <Ticket className="w-4 h-4" />
                Book Tickets Now
              </Link>

              {activeHero.trailer_url && (
                <button
                  onClick={() => setActiveTrailerMovie(activeHero)}
                  className="px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md flex items-center gap-2 border border-white/30 transition-all hover:scale-105 active:scale-95"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}
            </div>

            {/* Slider Dots Indicator */}
            {featuredMovies.length > 1 && (
              <div className="pt-4 flex items-center gap-2">
                {featuredMovies.map((m, idx) => (
                  <button
                    key={m.id}
                    onClick={() => setHeroIndex(idx)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${
                      heroIndex === idx ? 'w-8 bg-rose-500 shadow-md shadow-rose-500/50' : 'w-2.5 bg-white/40 hover:bg-white/70'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* 🎬 Experience Category Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {experienceBadges.map((exp, idx) => {
          const IconComp = exp.icon;
          return (
            <div
              key={idx}
              className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-3xl flex items-center gap-3.5 shadow-sm hover:shadow-xl hover:border-rose-500/40 hover:-translate-y-1 transition-all duration-300 cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl bg-slate-100 dark:bg-slate-800 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <IconComp className={`w-6 h-6 ${exp.color}`} />
              </div>
              <div>
                <h4 className="text-xs font-extrabold text-slate-900 dark:text-white group-hover:text-red-600 dark:group-hover:text-rose-400 transition-colors">
                  {exp.title}
                </h4>
                <span className="text-[10px] font-medium text-slate-500 dark:text-slate-400">{exp.desc}</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Movies Catalog Filter & Header */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-red-600 to-rose-500 text-white flex items-center justify-center shadow-lg shadow-rose-600/30">
              <Flame className="w-5 h-5 fill-white" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedStatus === 'now_showing' ? 'Now Showing in Multiplexes' : 'Upcoming Blockbusters'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select showtimes & reserve your favorite seats</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Status Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-300 dark:border-slate-800">
              <button
                onClick={() => setSelectedStatus('now_showing')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  selectedStatus === 'now_showing'
                    ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Film className="w-3.5 h-3.5" /> Now Showing
              </button>
              <button
                onClick={() => setSelectedStatus('coming_soon')}
                className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-1.5 ${
                  selectedStatus === 'coming_soon'
                    ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white shadow-md shadow-rose-600/30'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" /> Coming Soon
              </button>
            </div>

            {/* Genre Filter Scrollable */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black shrink-0 transition-all ${
                    selectedGenre === genre
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-md scale-105'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                  }`}
                >
                  {genre}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Movies Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
              <MovieCardSkeleton key={n} />
            ))}
          </div>
        ) : movies.length === 0 ? (
          <div className="text-center py-20 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3 shadow-sm">
            <Film className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-800 dark:text-slate-300">No Movies Found</h3>
            <p className="text-xs text-slate-500">Try selecting another genre filter or clearing your search input.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

