import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, Play, Plus, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

/**
 * MovieCard displays details of a movie styled with the IMDb grid card template.
 * @param {object} props.movie - Movie catalog item dataset
 * @param {function} props.onOpenTrailer - Event handler trigger to load youtube video trailer modal
 */
export default function MovieCard({ movie, onOpenTrailer }) {
  const { user, toggleFavorite } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const isFavorite = user?.favorites?.includes(movie.id);

  // Hover states for glare effects
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const glareX = ((e.clientX - rect.left) / width) * 100;
    const glareY = ((e.clientY - rect.top) / height) * 100;
    setGlarePos({ x: glareX, y: glareY });
  };

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
    <div
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="bg-white dark:bg-[#1a1a1a] rounded-lg border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-xl hover:border-[#f5c518]/30 transition-all duration-300 flex flex-col overflow-hidden group"
    >
      {/* Poster Image Container - Standard 2:3 Cinema Ratio */}
      <div 
        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-900 cursor-pointer" 
        onClick={() => navigate(`/movie/${movie.id}`)}
      >
        {/* Holographic Glare Effect */}
        {isHovered && (
          <div
            className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge opacity-15"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.4) 0%, rgba(255, 255, 255, 0) 65%)`
            }}
          />
        )}

        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-[1.03] transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Poster Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent opacity-40 group-hover:opacity-60 transition-opacity duration-300"></div>

        {/* IMDb Signature Watchlist Bookmark (Top Left) */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-0 left-0 z-20 group/bookmark"
          title={isFavorite ? "Remove from Watchlist" : "Add to Watchlist"}
        >
          <svg
            width="34"
            height="45"
            viewBox="0 0 34 45"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="drop-shadow-md transition-transform active:scale-95"
          >
            <path
              d="M0 0H34V45L17 33L0 45V0Z"
              fill={isFavorite ? "#f5c518" : "rgba(18, 18, 18, 0.75)"}
              stroke={isFavorite ? "#dfb311" : "rgba(255, 255, 255, 0.2)"}
              strokeWidth="1"
            />
          </svg>
          <span className="absolute top-2.5 left-2.5 flex items-center justify-center z-30">
            {isFavorite ? (
              <Check className="w-3.5 h-3.5 text-black stroke-[3px]" />
            ) : (
              <Plus className="w-3.5 h-3.5 text-white stroke-[3px] group-hover/bookmark:text-[#f5c518] transition-colors" />
            )}
          </span>
        </button>

        {/* IMAX Badge (Top Right) */}
        <div className="absolute top-2 right-2 z-10">
          <span className="px-2 py-0.5 rounded bg-black/60 text-[#f5c518] border border-[#f5c518]/30 font-mono text-[9px] font-black tracking-wider uppercase backdrop-blur-sm">
            IMAX 3D
          </span>
        </div>

        {/* Status Badge */}
        <div className="absolute bottom-2 left-2 z-10">
          <span
            className={`px-2 py-0.5 rounded text-[8px] uppercase font-black tracking-wider shadow-md backdrop-blur-sm ${
              movie.status === 'now_showing'
                ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                : 'bg-[#f5c518]/90 text-slate-950 border border-[#dfb311]/40'
            }`}
          >
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>
      </div>

      {/* Content Details Section - Styled to match IMDb Info Layout */}
      <div className="p-3 flex-1 flex flex-col justify-between space-y-2.5">
        <div>
          {/* Rating Line */}
          <div className="flex items-center gap-1.5 text-[11px] text-slate-400 font-bold px-0.5">
            <div className="flex items-center gap-0.5">
              <Star className="w-3.5 h-3.5 text-[#f5c518] fill-[#f5c518]" />
              <span className="text-xs font-black text-slate-900 dark:text-slate-100">
                {movie.rating ? Number(movie.rating).toFixed(1) : '5.0'}
              </span>
            </div>
            <span className="text-slate-400 dark:text-slate-650">•</span>
            <button 
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                navigate(`/movie/${movie.id}#reviews`);
              }}
              className="text-sky-600 dark:text-sky-400 hover:text-sky-300 font-bold transition-colors hover:underline flex items-center gap-0.5 text-[10px]"
            >
              <Star className="w-2.5 h-2.5" /> Rate
            </button>
          </div>

          {/* Title */}
          <Link
            to={`/movie/${movie.id}`}
            className="text-xs sm:text-sm font-black text-slate-900 dark:text-slate-100 hover:text-slate-600 dark:hover:text-slate-350 transition-colors line-clamp-1 block tracking-tight mt-1"
          >
            {movie.title}
          </Link>

          {/* Language & Duration */}
          <div className="flex items-center gap-1.5 text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 font-bold">
            <span className="text-slate-700 dark:text-slate-350">{movie.language}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-slate-400" />
              {movie.duration_mins}m
            </span>
          </div>

          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1 mt-1.5">
            {(Array.isArray(movie.genre) ? movie.genre : []).slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] sm:text-[10px] font-bold text-slate-600 dark:text-slate-400 border border-slate-200/60 dark:border-slate-700/50"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* IMDb Actions Layout */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800/60 flex flex-col gap-1.5">
          {/* Trailer action */}
          {movie.trailer_url && (
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                if (onOpenTrailer) onOpenTrailer(movie);
              }}
              className="w-full py-1.5 rounded-md bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-900 dark:text-white font-extrabold text-[10px] sm:text-xs flex items-center justify-center gap-1 transition-all border border-slate-250 dark:border-slate-700"
            >
              <Play className="w-3 h-3 fill-current" />
              Watch Trailer
            </button>
          )}

          {/* Book Tickets (IMDb yellow flat button) */}
          <Link
            to={`/showtimes/${movie.id}`}
            className="w-full py-2 rounded-md bg-[#f5c518] hover:bg-[#dfb311] text-black font-extrabold text-[10px] sm:text-xs text-center flex items-center justify-center gap-1 shadow-sm hover:scale-[1.01] active:scale-[0.99] transition-all"
          >
            <Ticket className="w-3.5 h-3.5" />
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}


