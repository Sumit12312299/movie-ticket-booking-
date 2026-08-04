import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Star, Clock, Ticket, Play, Heart, Film, Info } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';

export default function MovieCard({ movie, onOpenTrailer }) {
  const { user, toggleFavorite } = useAuth();
  const { addToast } = useNotification();
  const navigate = useNavigate();

  const isFavorite = user?.favorites?.includes(movie.id);

  // 3D Tilt Card States
  const [rotateX, setRotateX] = React.useState(0);
  const [rotateY, setRotateY] = React.useState(0);
  const [glarePos, setGlarePos] = React.useState({ x: 50, y: 50 });
  const [isHovered, setIsHovered] = React.useState(false);

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left - width / 2;
    const mouseY = e.clientY - rect.top - height / 2;
    
    // Max tilt of 10 degrees
    const rX = -(mouseY / (height / 2)) * 10;
    const rY = (mouseX / (width / 2)) * 10;
    
    setRotateX(rX);
    setRotateY(rY);

    const glareX = ((e.clientX - rect.left) / width) * 100;
    const glareY = ((e.clientY - rect.top) / height) * 100;
    setGlarePos({ x: glareX, y: glareY });
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    setRotateX(0);
    setRotateY(0);
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
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-md hover:shadow-2xl hover:border-rose-500/40 transition-all duration-300 flex flex-col overflow-hidden group"
      style={{
        transform: isHovered
          ? `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`
          : 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)',
        transition: isHovered ? 'none' : 'transform 0.4s ease-out, border-color 0.3s, box-shadow 0.3s',
        transformStyle: 'preserve-3d',
      }}
    >
      {/* Poster Image Container - Standard 2:3 Cinema Ratio */}
      <div 
        className="relative aspect-[2/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800 cursor-pointer" 
        onClick={() => navigate(`/movie/${movie.id}`)}
        style={{ transform: 'translateZ(20px)', transformStyle: 'preserve-3d' }}
      >
        {/* Holographic Glare Effect */}
        {isHovered && (
          <div
            className="absolute inset-0 z-30 pointer-events-none mix-blend-color-dodge opacity-25"
            style={{
              background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0) 65%)`
            }}
          />
        )}

        <img
          src={movie.poster_url}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Poster Gradient Overlay on Hover */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent opacity-60 group-hover:opacity-90 transition-opacity duration-300"></div>

        {/* Rating Badge */}
        <div className="absolute top-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/85 border border-slate-700/80 flex items-center gap-1 shadow-lg backdrop-blur-md">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-black text-amber-300">
            {movie.rating ? Number(movie.rating).toFixed(1) : '5.0'}
          </span>
        </div>

        {/* Top Right Badges: IMAX + Wishlist */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          <span className="px-2 py-0.5 rounded-md bg-rose-600/90 text-white font-mono text-[9px] font-black tracking-wider uppercase border border-rose-400/40 shadow-sm backdrop-blur-md">
            IMAX 3D
          </span>

          <button
            onClick={handleFavoriteClick}
            className={`w-8 h-8 rounded-lg bg-slate-950/85 border flex items-center justify-center transition-all shadow-md backdrop-blur-md hover:scale-110 active:scale-95 ${
              isFavorite
                ? 'border-rose-500 text-rose-500'
                : 'border-slate-700 text-slate-300 hover:text-rose-500'
            }`}
            title="Add to Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-rose-500' : ''}`} />
          </button>
        </div>

        {/* Play Trailer Circle Overlay on Hover */}
        {movie.trailer_url && (
          <button
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (onOpenTrailer) onOpenTrailer(movie);
            }}
            className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-rose-600/90 hover:bg-rose-500 text-white flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 shadow-2xl shadow-rose-600/50 hover:scale-110 backdrop-blur-sm z-10"
            title="Watch Trailer"
          >
            <Play className="w-5 h-5 ml-0.5 fill-white" />
          </button>
        )}

        {/* Status Badge */}
        <div className="absolute bottom-3 left-3 z-10">
          <span
            className={`px-2.5 py-0.5 rounded-md text-[10px] uppercase font-black tracking-wider shadow-md ${
              movie.status === 'now_showing'
                ? 'bg-emerald-600/90 text-white border border-emerald-400/40'
                : 'bg-amber-500/90 text-slate-950 border border-amber-400/40'
            }`}
          >
            {movie.status === 'now_showing' ? 'Now Showing' : 'Coming Soon'}
          </span>
        </div>
      </div>

      {/* Content Details Section - BookMyShow Standard Layout */}
      <div className="p-3.5 flex-1 flex flex-col justify-between space-y-3">
        <div>
          <Link
            to={`/movie/${movie.id}`}
            className="text-sm font-black text-slate-900 dark:text-white hover:text-rose-600 dark:hover:text-rose-400 transition-colors line-clamp-1 block tracking-tight"
          >
            {movie.title}
          </Link>

          <div className="flex items-center gap-2 text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-semibold">
            <span className="text-slate-700 dark:text-slate-300">{movie.language}</span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3 h-3 text-rose-500" />
              {movie.duration_mins} mins
            </span>
          </div>

          <div className="flex flex-wrap gap-1.5 mt-2">
            {(Array.isArray(movie.genre) ? movie.genre : []).slice(0, 2).map((g, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-600 dark:text-slate-300 border border-slate-200/80 dark:border-slate-700/60"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        {/* Standard BookMyShow Action Button */}
        <div className="pt-2.5 border-t border-slate-100 dark:border-slate-800/80 flex items-center gap-2">
          <Link
            to={`/movie/${movie.id}`}
            className="p-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 transition-colors border border-slate-200 dark:border-slate-700 shrink-0"
            title="View Details & Reviews"
          >
            <Info className="w-4 h-4" />
          </Link>

          <Link
            to={`/showtimes/${movie.id}`}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-500 hover:from-red-500 hover:to-rose-400 text-white font-extrabold text-xs text-center flex items-center justify-center gap-1.5 shadow-md shadow-rose-600/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Ticket className="w-4 h-4" />
            Book Tickets
          </Link>
        </div>
      </div>
    </div>
  );
}


