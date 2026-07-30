import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, Play, Heart, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function MovieCard({ movie, onOpenTrailer }) {
  const { user, toggleFavorite } = useAuth();
  const { addToast } = useNotification();

  const isFavorite = user?.favorites?.includes(movie.id);

  const handleFavoriteClick = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) {
      addToast('Please sign in to save movies to your wishlist', 'warning');
      return;
    }
    const result = await toggleFavorite(movie.id);
    if (result === 'added') {
      addToast(`Added "${movie.title}" to Wishlist`, 'success');
    } else if (result === 'removed') {
      addToast(`Removed "${movie.title}" from Wishlist`, 'info');
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/80 dark:border-slate-800/80 shadow-md hover:shadow-2xl hover:shadow-rose-600/20 dark:hover:border-rose-500/50 hover:-translate-y-2 transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-108 transition-transform duration-700 ease-out"
          loading="lazy"
        />

        {/* Poster Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-40 group-hover:opacity-90 transition-opacity duration-300"></div>

        {/* Top Badges Bar */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <div className="px-2.5 py-1 rounded-full bg-slate-900/90 border border-slate-700/80 flex items-center gap-1 shadow-lg backdrop-blur-md">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span className="text-xs font-black text-amber-300">
              {movie.rating ? Number(movie.rating).toFixed(1) : '5.0'}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white font-mono text-[9px] font-black tracking-wider uppercase border border-rose-500/50 shadow-sm backdrop-blur-md">
              4K IMAX
            </span>

            {/* Favorite Wishlist Button */}
            <button
              onClick={handleFavoriteClick}
              className={`w-8 h-8 rounded-full bg-slate-900/90 border flex items-center justify-center transition-all shadow-lg backdrop-blur-md hover:scale-110 active:scale-95 ${
                isFavorite
                  ? 'border-red-500 text-red-500'
                  : 'border-slate-700 text-slate-300 hover:text-red-500'
              }`}
              title="Add to Wishlist"
            >
              <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-red-500' : ''}`} />
            </button>
          </div>
        </div>

        {/* Play Trailer Button Overlay */}
        {movie.trailer_url && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenTrailer) onOpenTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-gradient-to-r from-red-600 to-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl shadow-rose-600/50 hover:scale-110 backdrop-blur-sm z-10"
          >
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`px-3 py-0.5 rounded-full text-[10px] uppercase font-black tracking-wider shadow-md ${
              movie.status === 'now_showing'
                ? 'bg-gradient-to-r from-red-600 to-rose-500 text-white'
                : 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 backdrop-blur-md'
            }`}
          >
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 mb-1 font-medium">
            <span className="flex items-center gap-1 font-bold text-slate-700 dark:text-slate-300">
              <Clock className="w-3.5 h-3.5 text-rose-500" />
              {movie.duration_mins} mins
            </span>
            <span>•</span>
            <span className="text-slate-600 dark:text-slate-300 font-bold">{movie.language}</span>
          </div>

          <h3 className="text-base font-black text-slate-900 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {(Array.isArray(movie.genre) ? movie.genre : []).slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="px-2.5 py-0.5 rounded-lg bg-slate-100 dark:bg-slate-800/90 text-[10px] font-extrabold text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/80"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 border-t border-slate-100 dark:border-slate-800/80 flex items-center justify-between gap-2">
          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-extrabold text-xs text-center transition-colors border border-slate-200 dark:border-slate-700"
          >
            Details
          </Link>

          <Link
            to={`/showtimes/${movie.id}`}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-black text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}

