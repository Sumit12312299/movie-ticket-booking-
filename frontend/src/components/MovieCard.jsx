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
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col overflow-hidden group">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 border border-slate-200 flex items-center gap-1 shadow-sm backdrop-blur-sm">
          <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
          <span className="text-xs font-bold text-slate-800">{movie.rating.toFixed(1)}</span>
        </div>

        {/* Favorite Wishlist Button */}
        <button
          onClick={handleFavoriteClick}
          className={`absolute top-3 right-3 w-9 h-9 rounded-full bg-white/90 border flex items-center justify-center transition-all ${
            isFavorite ? 'border-red-500 text-red-600' : 'border-slate-200 text-slate-400 hover:text-red-600'
          }`}
          title="Add to Wishlist"
        >
          <Heart className={`w-4 h-4 ${isFavorite ? 'fill-red-600' : ''}`} />
        </button>

        {/* Trailer Button Overlay */}
        {movie.trailer_url && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenTrailer) onOpenTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-red-600 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
          >
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3">
          <span
            className={`px-2.5 py-0.5 rounded text-[10px] uppercase font-bold tracking-wider ${
              movie.status === 'now_showing'
                ? 'bg-red-600 text-white shadow-sm'
                : 'bg-amber-100 text-amber-800 border border-amber-300'
            }`}
          >
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-500 mb-1">
            <span className="flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              {movie.duration_mins} mins
            </span>
            <span>•</span>
            <span className="text-slate-700 font-semibold">{movie.language}</span>
          </div>

          <h3 className="text-base font-bold text-slate-900 group-hover:text-red-600 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genre.slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded bg-slate-100 text-[11px] font-medium text-slate-600 border border-slate-200"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Action Button */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs text-center transition-colors"
          >
            Details
          </Link>

          <Link
            to={`/showtimes/${movie.id}`}
            className="flex-1 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
