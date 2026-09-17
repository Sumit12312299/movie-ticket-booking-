import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket, Play, Sparkles } from 'lucide-react';

export default function MovieCard({ movie }) {
  // Deterministic sample rating display (or default 4.9)
  const rating = (movie.title ? (movie.title.length % 5) * 0.2 + 4.1 : 4.8).toFixed(1);

  return (
    <div className="group relative bg-[#0F111A] rounded-2xl overflow-hidden border border-white/10 hover:border-[#E50914] transition-all duration-300 hover:shadow-[0_15px_35px_rgba(0,0,0,0.8),0_0_25px_rgba(229,9,20,0.4)] flex flex-col h-full">
      
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] overflow-hidden bg-[#161926] cursor-pointer">
        <img
          src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
          }}
        />

        {/* Cinematic Vignette Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0F111A] via-transparent to-black/40 opacity-90 group-hover:opacity-100 transition-opacity" />

        {/* Top Badges */}
        <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
          <span className="bg-[#E50914] text-white text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-md tracking-wider shadow-lg shadow-[#E50914]/40 border border-white/20">
            {movie.language || 'English'}
          </span>
          <div className="bg-[#07080e]/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1 border border-white/15 shadow-lg">
            <Star className="w-3.5 h-3.5 text-[#FFD700] fill-[#FFD700]" />
            <span className="text-xs font-black text-white">{rating}</span>
          </div>
        </div>

        {/* Play Button Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 bg-black/40 backdrop-blur-xs z-10">
          <Link
            to={`/movie/${movie.id}`}
            className="w-14 h-14 rounded-full bg-[#E50914] flex items-center justify-center text-white shadow-[0_0_25px_rgba(229,9,20,0.8)] group-hover:scale-110 transition-transform duration-300 border border-white/30 text-decoration-none"
          >
            <Play className="w-6 h-6 fill-white ml-1" />
          </Link>
        </div>

        {/* Cinema Tech Tag (IMAX / 4K) */}
        <div className="absolute bottom-3 left-3 z-10">
          <span className="text-[9px] font-black tracking-widest text-[#FFD700] bg-black/70 backdrop-blur-md border border-[#FFD700]/30 px-2 py-0.5 rounded uppercase">
            IMAX 3D • 4K HDR
          </span>
        </div>
      </div>

      {/* Info Details */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-[#0F111A]">
        <div>
          <h3 className="font-bebas text-2xl tracking-wide text-white group-hover:text-[#E50914] transition-colors leading-tight line-clamp-1">
            {movie.title}
          </h3>

          {/* Genre Pills */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genre?.slice(0, 3).map((g, i) => (
              <span
                key={i}
                className="text-[10px] font-semibold px-2 py-0.5 rounded-md bg-[#181a28] text-gray-400 border border-white/5"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
          <div className="flex items-center text-gray-400 text-xs space-x-1 font-medium">
            <Clock className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{movie.duration_mins} mins</span>
          </div>

          <Link
            to={`/movie/${movie.id}`}
            className="btn-cinema text-xs py-1.5 px-3 rounded-lg text-decoration-none flex items-center space-x-1"
          >
            <span>Book</span>
            <Ticket className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
