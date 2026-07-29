import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Film, Search, Star, Sparkles, Filter, Play, ChevronRight, TrendingUp } from 'lucide-react';
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

  const searchQuery = searchParams.get('search') || '';

  const genres = ['All', 'Sci-Fi', 'Action', 'Drama', 'Adventure', 'Cyberpunk', 'Biography', 'Fantasy'];

  useEffect(() => {
    fetchMovies();
  }, [selectedGenre, selectedStatus, searchQuery]);

  const fetchMovies = async () => {
    setLoading(true);
    try {
      const res = await API.get('/movies', {
        params: {
          search: searchQuery,
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
    <div className="space-y-10 pb-16">
      {/* Hero Banner Carousel (Featured Blockbuster) */}
      {featuredMovie && !searchQuery && selectedGenre === 'All' && (
        <section className="relative w-full rounded-3xl overflow-hidden bg-slate-900 shadow-xl border border-slate-200 dark:border-slate-800 min-h-[420px] flex items-end p-6 sm:p-12 text-white">
          {/* Background Image Overlay */}
          <div className="absolute inset-0 z-0">
            <img
              src={featuredMovie.banner_url || featuredMovie.poster_url}
              alt={featuredMovie.title}
              className="w-full h-full object-cover object-center filter brightness-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>
            <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/60 to-transparent"></div>
          </div>

          {/* Hero Content */}
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-extrabold uppercase tracking-wider bg-red-600 text-white shadow-md flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" />
                Featured Premiere
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-400 text-slate-950 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                {featuredMovie.rating.toFixed(1)} Rating
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight tracking-tight">
              {featuredMovie.title}
            </h1>

            <p className="text-sm text-slate-200 line-clamp-3 leading-relaxed">
              {featuredMovie.synopsis}
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                to={`/showtimes/${featuredMovie.id}`}
                className="px-6 py-3 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-sm shadow-md flex items-center gap-2 transition-all hover:scale-105"
              >
                <Film className="w-4 h-4" />
                Book Tickets Now
              </Link>

              {featuredMovie.trailer_url && (
                <button
                  onClick={() => setActiveTrailerMovie(featuredMovie)}
                  className="px-6 py-3 rounded-xl bg-white/20 hover:bg-white/30 text-white font-bold text-sm backdrop-blur-md flex items-center gap-2 border border-white/30 transition-all"
                >
                  <Play className="w-4 h-4 fill-white" />
                  Watch Trailer
                </button>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Filter Tabs & Controls */}
      <section className="space-y-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-4">
          {/* Status Tabs */}
          <div className="flex items-center gap-2 bg-slate-200/80 dark:bg-slate-900 p-1 rounded-2xl border border-slate-300 dark:border-slate-800">
            <button
              onClick={() => setSelectedStatus('now_showing')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedStatus === 'now_showing'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              🎬 Now Showing
            </button>
            <button
              onClick={() => setSelectedStatus('coming_soon')}
              className={`px-5 py-2 rounded-xl text-xs font-extrabold transition-all ${
                selectedStatus === 'coming_soon'
                  ? 'bg-red-600 text-white shadow-sm'
                  : 'text-slate-700 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              📅 Coming Soon
            </button>
          </div>

          {/* Genre Scrollable Filter */}
          <div className="flex items-center gap-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
            <Filter className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            {genres.map((genre) => (
              <button
                key={genre}
                onClick={() => setSelectedGenre(genre)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold shrink-0 transition-all ${
                  selectedGenre === genre
                    ? 'bg-slate-900 dark:bg-white text-white dark:text-slate-900 shadow-sm font-bold'
                    : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-800'
                }`}
              >
                {genre}
              </button>
            ))}
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
          <div className="text-center py-16 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-3">
            <Film className="w-12 h-12 text-slate-400 mx-auto" />
            <h3 className="text-base font-bold text-slate-700 dark:text-slate-300">No Movies Found</h3>
            <p className="text-xs text-slate-500">Try clearing your search query or selecting another genre filter.</p>
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
