import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import MovieCard from '../components/MovieCard';
import { Ticket, Info, ChevronRight, Star, Clock, Play, Sparkles, Film, Shield, Flame, Volume2, VolumeX, X } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500';

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies]           = useState([]);
  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [loading, setLoading]         = useState(true);
  const [selectedGenre, setSelectedGenre] = useState('ALL');
  const [trailerModal, setTrailerModal] = useState(null);

  useEffect(() => {
    fetchMovies();
  }, []);

  // Auto slide hero banner every 6 seconds
  useEffect(() => {
    if (movies.length === 0) return;
    const interval = setInterval(() => {
      setFeaturedIndex((prev) => (prev + 1) % Math.min(movies.length, 5));
    }, 6000);
    return () => clearInterval(interval);
  }, [movies]);

  const fetchMovies = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-4 border-[#E50914]/20 border-t-[#E50914] animate-spin"></div>
          <Film className="absolute inset-0 m-auto w-6 h-6 text-[#FFD700] animate-pulse" />
        </div>
        <p className="font-bebas text-xl text-[#FFD700] tracking-widest animate-pulse">Initializing Cinema Projector...</p>
      </div>
    );
  }

  const currentFeatured = movies[featuredIndex] || movies[0];

  // Filtering
  const filteredMovies = movies.filter((m) => {
    if (selectedGenre === 'ALL') return true;
    if (selectedGenre === 'HINDI') return m.language?.toLowerCase() === 'hindi';
    if (selectedGenre === 'ENGLISH') return m.language?.toLowerCase() === 'english';
    return m.genre?.some((g) => g.toUpperCase() === selectedGenre);
  });

  const actionMovies = movies.filter((m) => m.genre?.some((g) => ['Action', 'Thriller', 'Adventure'].includes(g)));
  const sciFiMovies  = movies.filter((m) => m.genre?.some((g) => ['Sci-Fi', 'Fantasy'].includes(g)));
  const dramaMovies  = movies.filter((m) => m.genre?.some((g) => ['Drama', 'Biography', 'Comedy', 'History'].includes(g)));

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">

      {/* ── CINEMATIC HERO SPOTLIGHT CAROUSEL ─────────────────── */}
      {currentFeatured && (
        <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-[#0F111A] shadow-[0_20px_60px_rgba(0,0,0,0.9)] min-h-[540px] flex items-center">
          
          {/* Ambient Projector Beam Ray FX */}
          <div className="absolute top-0 right-1/4 w-96 h-full projector-light-beam z-10 pointer-events-none opacity-40"></div>

          {/* Dynamic Backdrop */}
          <div className="absolute inset-0 z-0">
            <img
              src={currentFeatured.poster_url || FALLBACK}
              alt={currentFeatured.title}
              className="w-full h-full object-cover object-center opacity-30 filter blur-sm scale-105 transition-all duration-1000"
            />
            {/* Dark Vignette Gradient Overlays */}
            <div className="absolute inset-0 bg-gradient-to-r from-[#07080E] via-[#07080E]/90 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#07080E] via-transparent to-black/60" />
          </div>

          {/* Hero Content */}
          <div className="relative z-20 w-full p-8 sm:p-12 lg:p-16 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Details */}
            <div className="lg:col-span-8 space-y-6">
              
              {/* Badges */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="bg-[#E50914] text-white font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider shadow-lg shadow-[#E50914]/40 flex items-center gap-1.5 border border-white/20">
                  <Flame className="w-3.5 h-3.5 fill-white" /> SPOTLIGHT BLOCKBUSTER
                </span>
                <span className="bg-black/60 backdrop-blur-md text-[#FFD700] border border-[#FFD700]/30 font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                  IMAX 3D • DOLBY ATMOS
                </span>
                <span className="text-gray-300 text-xs font-semibold bg-white/10 px-3 py-1 rounded-full border border-white/10">
                  {currentFeatured.language}
                </span>
              </div>

              {/* Title */}
              <h1 className="font-bebas text-5xl sm:text-6xl lg:text-7xl text-white tracking-wide leading-tight drop-shadow-2xl">
                {currentFeatured.title}
              </h1>

              {/* Description */}
              <p className="text-gray-300 text-sm sm:text-base max-w-2xl leading-relaxed line-clamp-3">
                {currentFeatured.description || 'Experience the cinematic masterpiece on the big screen with surround sound, ultra 4K visual brilliance, and luxury recliners.'}
              </p>

              {/* Genres & Details */}
              <div className="flex items-center gap-4 text-xs text-gray-400 font-semibold">
                <div className="flex items-center gap-1 text-[#FFD700]">
                  <Star className="w-4 h-4 fill-[#FFD700]" />
                  <span className="text-white font-black text-sm">4.9 / 5</span>
                </div>
                <span>•</span>
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4 text-[#E50914]" />
                  <span>{currentFeatured.duration_mins} Minutes</span>
                </div>
                <span>•</span>
                <div className="flex gap-2">
                  {currentFeatured.genre?.map((g, i) => (
                    <span key={i} className="bg-white/5 border border-white/10 px-2.5 py-0.5 rounded text-gray-300">
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => navigate(`/movie/${currentFeatured.id}`)}
                  className="btn-cinema py-3.5 px-8 text-base shadow-xl"
                >
                  <Ticket className="w-5 h-5" />
                  <span>BOOK TICKETS NOW</span>
                </button>
                <button
                  onClick={() => setTrailerModal(currentFeatured)}
                  className="btn-cinema-glass py-3.5 px-6 text-sm flex items-center gap-2"
                >
                  <Play className="w-4 h-4 fill-white" />
                  <span>WATCH TRAILER</span>
                </button>
              </div>
            </div>

            {/* Right Column: Poster Card Preview */}
            <div className="hidden lg:col-span-4 lg:flex justify-end">
              <div className="relative group cursor-pointer" onClick={() => navigate(`/movie/${currentFeatured.id}`)}>
                <div className="absolute -inset-1 bg-gradient-to-r from-[#E50914] to-[#FFD700] rounded-2xl blur-md opacity-75 group-hover:opacity-100 transition duration-500"></div>
                <div className="relative w-64 h-96 rounded-2xl overflow-hidden border border-white/20 shadow-2xl">
                  <img
                    src={currentFeatured.poster_url || FALLBACK}
                    alt={currentFeatured.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-4">
                    <span className="btn-cinema-gold text-xs px-3 py-1.5 w-full text-center rounded-lg">
                      CLICK TO BOOK SEATS
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Carousel Slide Indicators */}
          <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
            {movies.slice(0, 5).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setFeaturedIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  idx === featuredIndex ? 'w-8 bg-[#E50914]' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
              />
            ))}
          </div>
        </div>
      )}

      {/* ── CINEMA CATEGORY FILTER PILLS ─────────────────────── */}
      <div className="flex items-center justify-between border-b border-white/10 pb-4 overflow-x-auto no-scrollbar gap-2">
        <div className="flex items-center gap-2 min-w-max">
          {['ALL', 'IMAX', 'ACTION', 'SCI-FI', 'DRAMA', 'HINDI', 'ENGLISH'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedGenre(cat)}
              className={`px-5 py-2 rounded-full text-xs font-bold transition-all duration-200 cursor-pointer ${
                selectedGenre === cat
                  ? 'bg-[#E50914] text-white shadow-lg shadow-[#E50914]/40 border border-white/20'
                  : 'bg-[#131624] text-gray-400 border border-white/10 hover:text-white hover:border-white/30'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
        <div className="hidden sm:flex items-center gap-2 text-xs font-bold text-[#FFD700]">
          <Sparkles className="w-4 h-4 animate-spin" />
          <span>DOLBY ATMOS ENHANCED</span>
        </div>
      </div>

      {/* ── CATALOG GRID / ROWS ──────────────────────────────── */}
      <section id="movies" className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-1.5 h-8 bg-[#E50914] rounded-full shadow-[0_0_12px_#E50914]" />
            <h2 className="font-bebas text-4xl text-white tracking-wide">
              {selectedGenre === 'ALL' ? 'NOW SHOWING IN CINEMAS' : `${selectedGenre} CATALOG`}
            </h2>
          </div>
          <span className="text-xs font-semibold text-gray-400">
            Showing <strong className="text-white">{filteredMovies.length}</strong> movies
          </span>
        </div>

        {/* Movie Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredMovies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
      </section>

      {/* ── ACTION CATEGORY ROW ─────────────────────────────── */}
      {actionMovies.length > 0 && selectedGenre === 'ALL' && (
        <section className="space-y-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#FFD700] rounded-full shadow-[0_0_12px_#FFD700]" />
              <h2 className="font-bebas text-4xl text-white tracking-wide">HIGH-OCTANE ACTION & THRILLER</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {actionMovies.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* ── SCI-FI & FANTASY ROW ───────────────────────────── */}
      {sciFiMovies.length > 0 && selectedGenre === 'ALL' && (
        <section className="space-y-6 pt-4 border-t border-white/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-1.5 h-8 bg-[#00E5FF] rounded-full shadow-[0_0_12px_#00E5FF]" />
              <h2 className="font-bebas text-4xl text-white tracking-wide">SCI-FI & MIND-BENDING VISUALS</h2>
            </div>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {sciFiMovies.slice(0, 5).map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </section>
      )}

      {/* ── CINEMA EXPERIENCE STATS BANNER ──────────────────── */}
      <div className="relative rounded-3xl bg-gradient-to-r from-[#141726] via-[#0F111A] to-[#191D30] border border-white/15 p-8 sm:p-12 overflow-hidden shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#E50914]/10 rounded-full filter blur-3xl pointer-events-none"></div>
        <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          <div className="space-y-1">
            <span className="font-bebas text-4xl sm:text-5xl text-[#FFD700] tracking-wider">180+</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Daily Shows Scheduled</p>
          </div>
          <div className="space-y-1">
            <span className="font-bebas text-4xl sm:text-5xl text-[#E50914] tracking-wider">4K HDR</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Laser Projection</p>
          </div>
          <div className="space-y-1">
            <span className="font-bebas text-4xl sm:text-5xl text-[#00E5FF] tracking-wider">DOLBY 7.1</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Immersive Surround</p>
          </div>
          <div className="space-y-1">
            <span className="font-bebas text-4xl sm:text-5xl text-white tracking-wider">100%</span>
            <p className="text-xs text-gray-400 font-bold uppercase tracking-widest">Instant E-Tickets</p>
          </div>
        </div>
      </div>

      {/* ── TRAILER PREVIEW MODAL ───────────────────────────── */}
      {trailerModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-4xl bg-[#0F111A] border border-white/20 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Film className="w-5 h-5 text-[#E50914]" />
                <h3 className="font-bebas text-2xl text-white tracking-wide">{trailerModal.title} — Official Trailer</h3>
              </div>
              <button
                onClick={() => setTrailerModal(null)}
                className="text-gray-400 hover:text-white p-2 rounded-full bg-white/5 border border-white/10"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Video Player Placeholder */}
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-black flex items-center justify-center border border-white/10">
              <img
                src={trailerModal.poster_url || FALLBACK}
                alt={trailerModal.title}
                className="w-full h-full object-cover opacity-40 filter blur-xs"
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center space-y-3 bg-black/50 p-6 text-center">
                <div className="w-20 h-20 rounded-full bg-[#E50914] flex items-center justify-center shadow-2xl shadow-[#E50914]/60 animate-bounce">
                  <Play className="w-8 h-8 fill-white ml-1" />
                </div>
                <h4 className="font-bebas text-3xl text-white">PLAYING CINEMATIC TRAILER PREVIEW</h4>
                <p className="text-xs text-gray-300 max-w-md">{trailerModal.description}</p>
                <button
                  onClick={() => {
                    const mId = trailerModal.id;
                    setTrailerModal(null);
                    navigate(`/movie/${mId}`);
                  }}
                  className="btn-cinema-gold text-xs px-6 py-2 rounded-xl mt-2"
                >
                  PROCEED TO BOOK SEATS
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
