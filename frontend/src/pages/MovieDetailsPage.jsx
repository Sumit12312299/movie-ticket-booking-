import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Star, Clock, Calendar, Film, Play, User, Send, Heart, Ticket, 
  Tv, Lightbulb, Sparkles, MessageSquare, ChevronRight, UserCheck, 
  ThumbsUp, ArrowLeft
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TrailerModal from '../components/TrailerModal';

function StarryBackground() {
  const canvasRef = React.useRef(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Create particles
    const particles = [];
    const count = 75;
    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1,
        speed: Math.random() * 0.05 + 0.02,
        phase: Math.random() * Math.PI * 2,
      });
    }

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#060812';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach((p) => {
        p.phase += p.speed;
        const currentAlpha = p.alpha + Math.sin(p.phase) * 0.15;
        ctx.fillStyle = `rgba(255, 42, 95, ${Math.max(0.02, Math.min(1, currentAlpha))})`; // Rose ambient lights
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fill();

        // Slow drift upwards
        p.y -= p.speed * 8;
        if (p.y < 0) {
          p.y = canvas.height;
          p.x = Math.random() * canvas.width;
        }
      });

      animationFrameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', resizeCanvas);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 z-20 pointer-events-none transition-opacity duration-1000 ease-in-out bg-slate-950"
    />
  );
}

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { user, toggleFavorite } = useAuth();
  const { addToast } = useNotification();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);
  const [isTheaterDimmed, setIsTheaterDimmed] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const isFavorite = user?.favorites?.includes(id) || user?.favorites?.includes(movie?.id);

  useEffect(() => {
    fetchMovieAndReviews();
  }, [id]);

  const fetchMovieAndReviews = async () => {
    setLoading(true);
    try {
      const [mRes, rRes] = await Promise.all([
        API.get(`/movies/${id}`),
        API.get(`/movies/${id}/reviews`)
      ]);
      setMovie(mRes.data);
      setReviews(rRes.data || []);
    } catch (err) {
      console.error(err);
      addToast('Failed to load movie details', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      addToast('Please sign in to post a review', 'warning');
      return;
    }
    if (!newComment.trim()) {
      addToast('Please write a brief comment', 'warning');
      return;
    }

    setSubmittingReview(true);
    try {
      await API.post(`/movies/${id}/reviews`, {
        user_name: user.full_name,
        rating: Number(newRating),
        comment: newComment
      });
      addToast('Review submitted successfully!', 'success');
      setNewComment('');
      fetchMovieAndReviews();
    } catch (err) {
      addToast(err.response?.data?.detail || 'Failed to submit review', 'error');
    } finally {
      setSubmittingReview(false);
    }
  };

  const handleFavoriteClick = async () => {
    if (!user) {
      addToast('Please sign in to save favorites', 'warning');
      return;
    }
    const action = await toggleFavorite(movie?.id || id);
    if (action === 'added') {
      addToast('Added to Wishlist!', 'success');
    } else if (action === 'removed') {
      addToast('Removed from Wishlist!', 'info');
    }
  };

  // Calculate review statistics
  const ratingDistribution = [0, 0, 0, 0, 0];
  reviews.forEach((r) => {
    const stars = Math.min(Math.max(Math.floor(r.rating) - 1, 0), 4);
    ratingDistribution[stars]++;
  });
  const maxDistributionCount = Math.max(...ratingDistribution, 1);

  if (loading) {
    return (
      <div className="space-y-12 pb-16 animate-fade-in px-4 md:px-0">
        {/* Banner/Hero area skeleton */}
        <div className="relative rounded-3xl overflow-hidden bg-slate-200/50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 sm:p-10 min-h-[400px] flex items-center">
          <div className="flex flex-col md:flex-row items-center gap-8 w-full z-10">
            <div className="w-48 h-72 rounded-2xl shimmer-bg shrink-0 shadow-lg border border-slate-350 dark:border-slate-800"></div>
            <div className="flex-1 space-y-4 w-full">
              <div className="h-4 w-28 rounded-full shimmer-bg"></div>
              <div className="h-8 w-3/4 rounded-lg shimmer-bg"></div>
              <div className="flex flex-wrap gap-2 pt-2">
                <div className="h-6 w-20 rounded-full shimmer-bg"></div>
                <div className="h-6 w-24 rounded-full shimmer-bg"></div>
              </div>
              <div className="space-y-2 pt-2">
                <div className="h-3 w-full rounded shimmer-bg"></div>
                <div className="h-3 w-11/12 rounded shimmer-bg"></div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className={`space-y-12 pb-16 transition-all duration-700 relative px-4 md:px-0 ${isTheaterDimmed ? 'bg-slate-950 p-6 rounded-3xl ring-4 ring-rose-500/20 shadow-2xl' : ''}`}>
      {/* Dimmed Theater Lights Overlay */}
      {isTheaterDimmed && (
        <>
          <StarryBackground />
          <div className="fixed inset-0 bg-slate-950/60 z-20 pointer-events-none transition-opacity animate-fade-in backdrop-blur-xs"></div>
        </>
      )}

      {/* Decorative Ambient Blobs behind panels */}
      <div className="absolute top-20 left-10 w-72 h-72 bg-rose-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse"></div>
      <div className="absolute bottom-40 right-10 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" style={{ animationDelay: '2s' }}></div>

      {/* Movie Hero Showcase */}
      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-40 rounded-3xl overflow-hidden bg-slate-950 text-white border border-slate-800 shadow-2xl p-6 sm:p-10"
      >
        {/* Cinematic Blurred Backdrop Banner */}
        <div 
          className="absolute inset-0 bg-cover bg-center filter blur-3xl opacity-20 scale-110 -z-10"
          style={{ backgroundImage: `url(${movie.banner_url || movie.poster_url})` }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-tr from-slate-950/95 via-slate-950/80 to-transparent -z-10"></div>

        {/* Theater Dim Lights Control */}
        <div className="flex justify-between items-center mb-6">
          <Link
            to="/"
            className="flex items-center gap-1.5 text-xs font-black text-rose-450 hover:text-rose-400 bg-white/5 hover:bg-white/10 px-4 py-2 rounded-2xl border border-white/10 transition-all shadow-md"
          >
            <ArrowLeft className="w-4 h-4" />
            Home
          </Link>
          <button
            onClick={() => setIsTheaterDimmed(!isTheaterDimmed)}
            className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 transition-all border shadow-lg ${
              isTheaterDimmed
                ? 'bg-amber-400 text-slate-950 border-amber-300 scale-105 shadow-amber-400/20'
                : 'bg-white/10 hover:bg-white/15 text-slate-200 border-white/10'
            }`}
          >
            <Lightbulb className={`w-4 h-4 ${isTheaterDimmed ? 'fill-slate-950 text-slate-950 animate-pulse' : 'text-amber-400'}`} />
            {isTheaterDimmed ? 'Lights On' : 'Dim Theater Lights'}
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 sm:gap-10 items-center">
          {/* Poster Card with embedded play trailer button */}
          <div className="relative aspect-[2/3] max-w-sm mx-auto w-full rounded-2xl overflow-hidden shadow-2xl border border-slate-700/60 group">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" />
            {movie.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform cursor-pointer border border-rose-400/40"
                title="Watch Trailer"
              >
                <Play className="w-7 h-7 ml-1 fill-white" />
              </button>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent opacity-60 pointer-events-none"></div>
          </div>

          {/* Specs & Synopsis details */}
          <div className="md:col-span-2 space-y-6 text-left">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3.5 py-1.5 rounded-full text-xs font-black bg-amber-500/25 text-amber-300 border border-amber-500/35 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {movie.rating.toFixed(1)} / 5.0 ({movie.reviews_count} reviews)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-black bg-white/10 text-slate-200 border border-white/5">
                {movie.language}
              </span>
              {movie.status === 'now_showing' ? (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  Now Showing
                </span>
              ) : (
                <span className="px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-300 border border-amber-500/30">
                  Coming Soon
                </span>
              )}
            </div>

            {/* Title & Heart Wishlist Button */}
            <div className="flex items-center justify-between gap-4">
              <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-none">{movie.title}</h1>
              <button
                onClick={handleFavoriteClick}
                className={`p-3.5 rounded-2xl border transition-all ${
                  isFavorite
                    ? 'bg-rose-600/20 border-rose-500/40 text-rose-500 scale-110 shadow-lg shadow-rose-500/20'
                    : 'bg-white/5 border-white/10 text-slate-400 hover:text-rose-500 hover:scale-105'
                }`}
                title={isFavorite ? 'Remove from Wishlist' : 'Add to Wishlist'}
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-rose-500' : ''}`} />
              </button>
            </div>

            <div className="flex flex-wrap gap-x-6 gap-y-2 text-xs text-slate-300 font-bold">
              <span className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-rose-500" />
                {movie.duration_mins} Minutes
              </span>
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-rose-500" />
                Released {movie.release_date}
              </span>
              {movie.director && (
                <span className="flex items-center gap-1.5">
                  <Film className="w-4 h-4 text-rose-500" />
                  Director: {movie.director}
                </span>
              )}
            </div>

            {/* Genre tags */}
            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <span key={g} className="px-3 py-1.5 rounded-xl bg-white/5 text-xs font-black text-slate-300 border border-white/5">
                  {g}
                </span>
              ))}
            </div>

            {/* Synopsis */}
            <div className="space-y-2.5">
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-555">Synopsis</h3>
              <p className="text-sm text-slate-300 leading-relaxed max-w-2xl">{movie.synopsis}</p>
            </div>

            {/* Dynamic Star Cast List with visual Avatar circles */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-555">Starring Cast</h3>
                <div className="flex flex-wrap gap-4">
                  {movie.cast.map((actor) => {
                    const initials = actor.split(' ').map(n => n[0]).join('').slice(0, 2);
                    return (
                      <div key={actor} className="flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1.5 rounded-full shadow-md">
                        <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-rose-600 to-amber-500 text-white font-black text-[9px] flex items-center justify-center uppercase shadow-inner">
                          {initials}
                        </div>
                        <span className="text-xs font-bold text-slate-200">{actor}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Select Showtime Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to={`/showtimes/${movie.id}`}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 via-rose-500 to-rose-600 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/35 flex items-center gap-2 hover:scale-105 active:scale-98 transition-all border border-rose-500/20"
              >
                <Ticket className="w-5 h-5" />
                Select Showtime & Seats
              </Link>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Reviews & Ratings Section */}
      <motion.section 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-40"
      >
        {/* Left Column: Submit Review Form */}
        <div className="glass-card rounded-3xl p-6 space-y-5 border border-slate-200 dark:border-slate-800/80 shadow-xl self-start">
          <h3 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2 tracking-tight">
            <Sparkles className="w-5 h-5 text-rose-500 fill-rose-500/20" />
            Write a Review
          </h3>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Your Rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white focus:outline-none focus:border-rose-500 transition-colors cursor-pointer"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Exceptional)</option>
                <option value={4}>⭐⭐⭐⭐ (4.0 - Great)</option>
                <option value={3}>⭐⭐⭐ (3.0 - Average)</option>
                <option value={2}>⭐⭐ (2.0 - Poor)</option>
                <option value={1}>⭐ (1.0 - Terrible)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 block mb-1.5">Comment</label>
              <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on the cinematography, plot, or score..."
                className="w-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-sm text-slate-900 dark:text-white placeholder-slate-400 dark:placeholder-slate-550 focus:outline-none focus:border-rose-500 transition-colors"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-450 text-white font-extrabold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/20 transition-all hover:scale-102 active:scale-97 cursor-pointer"
            >
              <Send className="w-4 h-4" />
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>

        {/* Right Columns: Reviews Breakdown & Review Items List */}
        <div className="md:col-span-2 space-y-6">
          
          {/* Review breakdown visual panel */}
          <div className="glass-card rounded-3xl p-6 border border-slate-200 dark:border-slate-800/80 shadow-xl grid grid-cols-1 sm:grid-cols-3 gap-6 items-center">
            <div className="text-center sm:border-r border-slate-200 dark:border-slate-800/80 space-y-1">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider">Average Rating</h4>
              <span className="text-4xl font-black text-slate-900 dark:text-white font-mono block">
                {movie.rating.toFixed(1)}
              </span>
              <div className="flex items-center justify-center gap-0.5 text-amber-400">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className={`w-3.5 h-3.5 ${s <= Math.round(movie.rating) ? 'fill-amber-400' : 'text-slate-300 dark:text-slate-700'}`} />
                ))}
              </div>
              <span className="text-[10px] font-bold text-slate-450 block pt-1">
                Based on {reviews.length} reviews
              </span>
            </div>

            <div className="sm:col-span-2 space-y-2">
              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider mb-2">Rating Distribution</h4>
              {[5, 4, 3, 2, 1].map((stars) => {
                const count = ratingDistribution[stars - 1] || 0;
                const percentage = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                return (
                  <div key={stars} className="flex items-center gap-3 text-xs">
                    <span className="w-3 text-slate-450 dark:text-slate-400 font-bold">{stars}⭐</span>
                    <div className="flex-1 h-2 rounded-full bg-slate-100 dark:bg-slate-900 shadow-inner overflow-hidden">
                      <div 
                        className="h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-full transition-all duration-1000"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <span className="w-8 text-right text-[10px] font-black text-slate-500 dark:text-slate-400 font-mono">
                      {count} ({Math.round(percentage)}%)
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* List of existing reviews */}
          <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-200 dark:border-slate-800/80 shadow-xl">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight">Audience Reviews ({reviews.length})</h3>
            {reviews.length === 0 ? (
              <div className="text-center py-12 space-y-2">
                <MessageSquare className="w-10 h-10 text-slate-450 mx-auto" />
                <p className="text-xs text-slate-500">No reviews yet. Be the first to rate this movie!</p>
              </div>
            ) : (
              <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-slate-850">
                <AnimatePresence>
                  {reviews.map((rev) => (
                    <motion.div 
                      key={rev.id} 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="p-4.5 rounded-2xl bg-slate-100/50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/80 space-y-2.5 hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700/80 transition-all duration-300"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-rose-600 to-rose-450 text-white flex items-center justify-center font-black text-xs shadow-md">
                            {rev.user_name.charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <span className="text-xs font-black text-slate-900 dark:text-white block">{rev.user_name}</span>
                            <span className="text-[9px] text-slate-450 dark:text-slate-500 block font-semibold">{rev.created_at}</span>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 bg-amber-500/10 border border-amber-500/25 px-2.5 py-1 rounded-full">
                          <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                          <span className="text-[10px] font-black text-amber-700 dark:text-amber-300">{rev.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-medium pl-1">
                        {rev.comment}
                      </p>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* Trailer Modal */}
      {showTrailer && <TrailerModal movie={movie} onClose={() => setShowTrailer(false)} />}
    </div>
  );
}
