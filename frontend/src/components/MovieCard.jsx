import React from 'react';
import { Link } from 'react-router-dom';
import { Star, Clock, Ticket } from 'lucide-react';

export default function MovieCard({ movie }) {
  return (
    <div className="glass-card group overflow-hidden flex flex-col justify-between h-full">
      <div className="relative aspect-[2/3] overflow-hidden bg-slate-800">
        <img
          src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'}
          alt={movie.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

        {/* Rating Badge */}
        <div className="absolute top-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-full flex items-center space-x-1 border border-slate-700/50">
          <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
          <span className="text-xs font-bold text-slate-100">4.8</span>
        </div>

        {/* Language Badge */}
        <div className="absolute top-3 left-3 bg-indigo-600/80 backdrop-blur-md px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wide text-white uppercase">
          {movie.language}
        </div>
      </div>

      {/* Info Container */}
      <div className="p-4 flex flex-col flex-1 justify-between">
        <div>
          <h3 className="text-lg font-bold text-white group-hover:text-indigo-400 transition-colors line-clamp-1">
            {movie.title}
          </h3>

          {/* Genre Badges */}
          <div className="flex flex-wrap gap-1.5 mt-2">
            {movie.genre?.map((g, i) => (
              <span
                key={i}
                className="text-[11px] px-2 py-0.5 rounded-md bg-slate-800 text-slate-400 font-medium"
              >
                {g}
              </span>
            ))}
          </div>
        </div>

        <div className="mt-4 pt-3 border-t border-slate-800/80 flex items-center justify-between">
          <div className="flex items-center text-slate-400 text-xs space-x-1">
            <Clock className="w-3.5 h-3.5" />
            <span>{movie.duration_mins} mins</span>
          </div>

          <Link
            to={`/movie/${movie.id}`}
            className="flex items-center space-x-1 text-xs font-bold text-indigo-400 hover:text-indigo-300 group-hover:translate-x-0.5 transition-all"
          >
            <span>Book Now</span>
            <Ticket className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
