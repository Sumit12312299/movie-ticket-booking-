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
    <div className="bg-white dark:bg-[#1f2533] rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-lg transition-all duration-200 flex flex-col overflow-hidden group">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />

        {/* BookMyShow Style Rating Bar */}
        <div className="absolute bottom-0 left-0 right-0 bg-slate-950/85 backdrop-blur-sm p-2 flex items-center justify-between text-white text-xs font-semibold">
          <div className="flex items-center gap-1">
            <Star className="w-3.5 h-3.5 text-[#f84464] fill-[#f84464]" />
            <span className="font-bold">{movie.rating.toFixed(1)}/5</span>
            <span className="text-[10px] text-slate-400 font-normal">({movie.reviews_count || 120} Votes)</span>
          </div>

          <button
            onClick={handleFavoriteClick}
            className="text-slate-300 hover:text-[#f84464] transition-colors"
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isFavorite ? 'fill-[#f84464] text-[#f84464]' : ''}`} />
          </button>
        </div>

        {/* Trailer Button Overlay */}
        {movie.trailer_url && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenTrailer) onOpenTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-11 h-11 rounded-full bg-[#f84464] text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-[#e03352]"
          >
            <Play className="w-4 h-4 ml-0.5 fill-white" />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute top-2 left-2">
          <span
            className={`px-2 py-0.5 rounded text-[10px] uppercase font-extrabold tracking-wider ${
              movie.status === 'now_showing'
                ? 'bg-[#f84464] text-white shadow-sm'
                : 'bg-amber-400 text-slate-950'
            }`}
          >
            {movie.status === 'now_showing' ? 'PROMOTED' : 'COMING SOON'}
          </span>
        </div>
      </div>

      {/* Content Details */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-2">
        <div>
          <h3 className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-[#f84464] transition-colors line-clamp-1">
            {movie.title}
          </h3>

          <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 line-clamp-1 font-medium">
            {movie.genre.join('/')}
          </p>

          <div className="flex flex-wrap gap-1 mt-2 text-[10px] font-semibold text-slate-600 dark:text-slate-300">
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">2D, 3D, IMAX</span>
            <span className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700">{movie.language}</span>
          </div>
        </div>

        {/* Book Button */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-2">
          <Link
            to={`/movie/${movie.id}`}
            className="flex-1 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs text-center transition-colors"
          >
            Info
          </Link>

          <Link
            to={`/showtimes/${movie.id}`}
            className="flex-1 py-1.5 rounded-lg bms-btn-red font-bold text-xs text-center flex items-center justify-center gap-1 shadow-sm transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book
          </Link>
        </div>
      </div>
    </div>
  );
}
