import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, Play, Heart } from 'lucide-react';
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
    <div className="glass-card rounded-2xl overflow-hidden flex flex-col group relative">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-900">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full glass-panel border border-amber-500/30 flex items-center gap-1 shadow-lg backdrop-blur-md">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-amber-300">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Favorite Wishlist Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full glass-panel flex items-center justify-center transition-all ${
            isFavorite ? 'bg-rose-500/20 border-rose-500 text-rose-500' : 'text-slate-300 hover:text-rose-400 hover:scale-110'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-rose-500' : ''}`} />
        </button>

        {/* Trailer Button Overlay */}
        {movie.trailer_url && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenTrailer) onOpenTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-14 h-14 rounded-full bg-rose-600/90 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl shadow-rose-600/50 hover:bg-rose-500"
          >
            <Play className="w-6 h-6 ml-1 fill-white" />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-bold tracking-wider ${
              movie.status === 'now_showing'
                ? 'bg-rose-600 text-white shadow-md shadow-rose-600/40'
                : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
            }`}
          >
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-[11px] text-slate-400 mb-1">
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {movie.duration_mins} mins
            </span>
            <span>•</span>
            <span className="text-slate-300 font-medium">{movie.language}</span>
          </div>

          <h3 className="text-lg font-bold text-white group-hover:text-rose-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genre.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-800/80 text-[10px] text-slate-300 border border-slate-700/50"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-2 border-t border-slate-800/80 flex items-center justify-between gap-2">
          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 font-medium text-xs text-center border border-slate-800 transition-colors"
          >
            View Details
          </Link>

          <Link
            to={`/showtimes/${movie.id}`}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-semibold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/20 transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
