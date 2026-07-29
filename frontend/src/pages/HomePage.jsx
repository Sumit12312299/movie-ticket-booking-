import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Film, Search, Star, Sparkles, Filter, Play, ChevronRight, TrendingUp, Flame, Tag, ShieldCheck, Ticket } from 'lucide-react';
import API from '../services/api';
import MovieCard from '../components/MovieCard';
import TrailerModal from '../components/TrailerModal';

export default function HomePage() {
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('now_showing');
  const [activeTrailerMovie, setActiveTrailerMovie] = useState(null);
  const [searchParams] = useSearchParams();

  const [liveQuery, setLiveQuery] = useState(searchParams.get('search') || '');

  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Adventure', 'Cyberpunk', 'Biography', 'Fantasy'];

  const experienceBadges = [
    { title: 'IMAX 3D Laser', icon: '🎬' },
    { title: 'VIP Recliner Lounge', icon: '👑' },
    { title: 'Dolby Atmos Audio', icon: '🎧' },
    { title: '4DX Motion Experience', icon: '🍿' }
  ];

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedStatus, liveQuery]);

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

  const featuredMovie = movies[0];

  return (
    <div className="space-y-12 pb-20">
      {/* 🎟️ Top Promo Offer Banner */}
      <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 rounded-2xl p-3 px-6 text-white text-xs font-bold flex flex-col sm:flex-row items-center justify-between gap-2 shadow-md">
        <div className="flex items-center gap-2">
          <Tag className="w-4 h-4 text-amber-200 shrink-0" />
          <span>Special Offer: Use promo code <code className="bg-black/20 px-2 py-0.5 rounded font-mono text-amber-200">CINEMA10</code> to get 10% OFF on all IMAX 3D tickets!</span>
        </div>
        <span className="text-[11px] bg-white/20 px-3 py-1 rounded-full font-semibold shrink-0">Limited Time Only</span>
      </div>

      {/* Featured Hero Premiere Showcase */}
      {featuredMovie && !liveQuery && selectedGenre === 'All' && (
        <section className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-2xl border border-slate-200 dark:border-slate-800 min-h-[460px] flex items-end p-6 sm:p-12 text-white">
          <div className="absolute inset-0 z-0">
            <img
              src={featuredMovie.banner_url || featuredMovie.poster_url}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center filter brightness-50 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/50 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/70 to-transparent"></div>
          </div>

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-red-600 text-white shadow-lg flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Premiere
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1 shadow-sm">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                {featuredMovie.rating.toFixed(1)} / 5.0 Rating
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/20 text-white backdrop-blur-md">
                {featuredMovie.language}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight drop-shadow-md">
              {featuredMovie.title}
            </h1>

            <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed font-normal">
              {featuredMovie.synopsis}
            </p>

            <div className="pt-3 flex flex-wrap items-center gap-4">
              <Link
                to={`/showtimes/${featuredMovie.id}`}
                className="px-7 py-3.5 rounded-2xl bg-red-600 hover:bg-red-700 text-white font-extrabold text-sm shadow-xl shadow-red-600/30 flex items-center gap-2 transition-all hover:scale-105"
              >
                <Ticket className="w-4 h-4" />
                Book Tickets Now
              </Link>

              {featuredMovie.trailer_url && (
                <button
                  onClick={() => setActiveTrailerMovie(featuredMovie)}
                  className="px-6 py-3.5 rounded-2xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md flex items-center gap-2 border border-white/30 transition-all hover:scale-105"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Official Trailer
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* 🎬 Experience Category Badges */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {experienceBadges.map((exp, idx) => (
          <div
            key={idx}
            className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-4 rounded-2xl flex items-center gap-3 shadow-sm hover:shadow-md transition-all cursor-pointer"
          >
            <span className="text-2xl">{exp.icon}</span>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">{exp.title}</h4>
              <span className="text-[10px] text-slate-500 dark:text-slate-400">Premium Screenings</span>
            </div>
          </div>
        ))}
      </div>

      {/* Movies Catalog Filter & Header */}
      <section className="space-y-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-red-100 dark:bg-red-950/50 text-red-600 flex items-center justify-center">
              <Flame className="w-5 h-5 fill-red-600" />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedStatus === 'now_showing' ? 'Now Showing in Cinemas' : 'Upcoming Blockbusters'}
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400">Select showtimes & reserve your favorite seats</p>
            </div>
          </div>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-between md:justify-end">
            {/* Status Switcher */}
            <div className="flex items-center gap-1 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800">
              <button
                onClick={() => setSelectedStatus('now_showing')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedStatus === 'now_showing'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                🎬 Now Showing
              </button>
              <button
                onClick={() => setSelectedStatus('coming_soon')}
                className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all ${
                  selectedStatus === 'coming_soon'
                    ? 'bg-red-600 text-white shadow-sm'
                    : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                📅 Coming Soon
              </button>
            </div>

            {/* Genre Filter Scrollable */}
            <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 sm:pb-0">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all ${
                    selectedGenre === genre
                      ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm'
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
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="h-96 rounded-2xl bg-slate-200/70 dark:bg-slate-900 animate-pulse border border-slate-300 dark:border-slate-800"></div>
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
