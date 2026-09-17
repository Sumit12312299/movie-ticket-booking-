import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getMovie, getShowsByMovie } from '../services/api';
import { MapPin, Film, Calendar, Clock, Ticket, Sparkles, ArrowLeft } from 'lucide-react';

export default function TheatreSelection() {
  const { movieId } = useParams();
  const navigate = useNavigate();

  const [movie, setMovie] = useState(null);
  const [shows, setShows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, [movieId]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, sRes] = await Promise.all([getMovie(movieId), getShowsByMovie(movieId)]);
      setMovie(mRes.data);
      setShows(sRes.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const theatreMap = {};
  shows.forEach((show) => {
    const tName = show.theatre_name || 'INOX Grand Cinemas';
    if (!theatreMap[tName]) theatreMap[tName] = [];
    theatreMap[tName].push(show);
  });

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#E50914]/20 border-t-[#E50914] rounded-full animate-spin"></div>
        <p className="font-bebas text-lg text-gray-400">Loading Cinema Halls & Showtimes...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Back Link */}
      <Link
        to={`/movie/${movieId}`}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors text-decoration-none group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>BACK TO MOVIE DETAILS</span>
      </Link>

      {/* Header Banner */}
      <div className="bg-[#0F111A] border border-white/15 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-2xl">
        <div className="flex items-center gap-4">
          <div className="w-16 h-24 rounded-xl overflow-hidden border border-white/20 shrink-0">
            <img
              src={movie?.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'}
              alt={movie?.title}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="bg-[#E50914] text-white text-[10px] font-extrabold px-2 py-0.5 rounded">
                SELECT SHOWTIME
              </span>
              <span className="text-xs text-gray-400 font-semibold">{movie?.language}</span>
            </div>
            <h1 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide mt-1">
              {movie?.title}
            </h1>
            <p className="text-xs text-gray-400 font-medium">
              {movie?.genre?.join(' • ')} • {movie?.duration_mins} Minutes
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] text-xs font-extrabold px-4 py-2 rounded-full self-start md:self-auto">
          <Sparkles className="w-4 h-4" />
          <span>REAL-TIME SEAT AVAILABILITY</span>
        </div>
      </div>

      {/* Theatres List */}
      <div className="space-y-6">
        {Object.keys(theatreMap).length === 0 ? (
          <div className="bg-[#0F111A] border border-white/10 rounded-3xl p-12 text-center text-gray-400 font-bebas text-xl">
            No showtimes currently scheduled for this movie. Check back soon!
          </div>
        ) : (
          Object.keys(theatreMap).map((theatreName) => (
            <div key={theatreName} className="bg-[#0F111A] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
              
              {/* Cinema Header */}
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-[#E50914]">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-bebas text-2xl text-white tracking-wide">{theatreName}</h3>
                    <p className="text-xs text-gray-400">IMAX 4K Laser • Dolby Atmos Surround • Recliners</p>
                  </div>
                </div>
                <span className="text-xs font-bold text-[#FFD700] bg-black/40 px-3 py-1 rounded-full border border-white/10">
                  4K HDR
                </span>
              </div>

              {/* Showtimes Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3 pt-2">
                {theatreMap[theatreName].map((show) => {
                  const timeStr = new Date(show.show_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                  const dateStr = new Date(show.show_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

                  return (
                    <button
                      key={show.id}
                      onClick={() => navigate(`/select-seats/${show.id}`)}
                      className="group bg-[#131624] border border-white/10 hover:border-[#E50914] hover:bg-[#E50914]/10 rounded-2xl p-4 transition-all duration-300 flex flex-col items-center justify-between text-center cursor-pointer hover:shadow-lg hover:shadow-[#E50914]/20"
                    >
                      <span className="text-xs font-semibold text-gray-400 group-hover:text-gray-200">{dateStr}</span>
                      <span className="font-bebas text-2xl text-white group-hover:text-[#E50914] my-1 tracking-wider">{timeStr}</span>
                      <div className="w-full pt-2 border-t border-white/5 flex items-center justify-between text-[11px]">
                        <span className="text-gray-500 font-medium">Screen {show.screen_number || 1}</span>
                        <span className="font-extrabold text-[#FFD700]">₹{show.price}</span>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          ))
        )}
      </div>

    </div>
  );
}
