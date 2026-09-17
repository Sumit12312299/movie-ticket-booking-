import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovie, getMovieReviews, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, Calendar, Ticket, Send, CheckCircle, AlertCircle, ArrowLeft, Play, ShieldCheck, Sparkles, User } from 'lucide-react';

export default function MovieDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const [movie, setMovie]           = useState(null);
  const [reviews, setReviews]       = useState({ average_rating: 0, total_reviews: 0, reviews: [] });
  const [loading, setLoading]       = useState(true);
  const [rating, setRating]         = useState(5);
  const [comment, setComment]       = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [revMsg, setRevMsg]         = useState({ type: '', text: '' });

  useEffect(() => { fetchData(); }, [id]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [mRes, rRes] = await Promise.all([getMovie(id), getMovieReviews(id)]);
      setMovie(mRes.data);
      setReviews(rRes.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!isAuthenticated) { navigate('/login'); return; }
    setSubmitting(true);
    setRevMsg({ type: '', text: '' });
    try {
      await createReview({ movie_id: id, rating: Number(rating), comment });
      setRevMsg({ type: 'success', text: 'Review posted successfully!' });
      setComment('');
      const rRes = await getMovieReviews(id);
      setReviews(rRes.data);
    } catch (err) {
      setRevMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to submit review' });
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#E50914]/20 border-t-[#E50914] rounded-full animate-spin"></div>
        <p className="font-bebas text-lg text-gray-400">Loading Movie Experience...</p>
      </div>
    );
  }
  if (!movie) return (
    <div className="text-center py-20 text-gray-400 font-bebas text-2xl">Movie details not found.</div>
  );

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-12">
      
      {/* Back Button */}
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors text-decoration-none group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
        <span>BACK TO CATALOG</span>
      </Link>

      {/* Hero Section */}
      <div className="relative rounded-3xl overflow-hidden bg-[#0F111A] border border-white/15 p-6 sm:p-10 lg:p-12 shadow-2xl">
        {/* Background Backdrop Vignette */}
        <div className="absolute inset-0 z-0">
          <img
            src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'}
            alt={movie.title}
            className="w-full h-full object-cover opacity-20 filter blur-md scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#0F111A] via-[#0F111A]/95 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F111A] via-transparent to-black/50" />
        </div>

        {/* Content Layout */}
        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Poster Container */}
          <div className="lg:col-span-4 flex justify-center">
            <div className="relative group w-64 sm:w-72 aspect-[2/3] rounded-2xl overflow-hidden border-2 border-white/20 shadow-2xl">
              <img
                src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'}
                alt={movie.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 bg-[#E50914] text-white font-extrabold text-[10px] uppercase px-2.5 py-1 rounded-md tracking-wider">
                IN CINEMAS
              </div>
            </div>
          </div>

          {/* Movie Details */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Badges */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="bg-[#E50914]/20 border border-[#E50914]/40 text-[#E50914] font-extrabold text-xs px-3 py-1 rounded-full uppercase tracking-wider">
                {movie.language}
              </span>
              <span className="bg-[#FFD700]/10 border border-[#FFD700]/30 text-[#FFD700] font-black text-xs px-3 py-1 rounded-full uppercase tracking-widest">
                IMAX 3D • 4K LASER
              </span>
              {movie.genre?.map((g, i) => (
                <span key={i} className="bg-white/5 border border-white/10 text-gray-300 text-xs font-medium px-3 py-1 rounded-full">
                  {g}
                </span>
              ))}
            </div>

            {/* Title */}
            <h1 className="font-bebas text-5xl sm:text-6xl text-white tracking-wide leading-tight">
              {movie.title}
            </h1>

            {/* Stats */}
            <div className="flex flex-wrap items-center gap-6 text-sm text-gray-300 border-y border-white/10 py-3">
              <div className="flex items-center gap-1.5 text-[#FFD700]">
                <Star className="w-5 h-5 fill-[#FFD700]" />
                <span className="font-black text-base text-white">{reviews.average_rating || 4.8}</span>
                <span className="text-xs text-gray-400">({reviews.total_reviews} reviews)</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-[#E50914]" />
                <span>{movie.duration_mins} Minutes</span>
              </div>
              <span>•</span>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-[#00E5FF]" />
                <span>Release: {movie.release_date || '2024'}</span>
              </div>
            </div>

            {/* Description */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed">
              {movie.description}
            </p>

            {/* CTA */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <button
                onClick={() => navigate(`/movie/${movie.id}/select-show`)}
                className="btn-cinema py-4 px-10 text-base shadow-2xl"
              >
                <Ticket className="w-5 h-5" />
                <span>BOOK TICKETS FOR THIS MOVIE</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-6">
        <div className="flex items-center gap-3">
          <div className="w-1.5 h-8 bg-[#FFD700] rounded-full shadow-[0_0_12px_#FFD700]" />
          <h2 className="font-bebas text-4xl text-white tracking-wide">AUDIENCE REVIEWS & RATINGS</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Post Review Form */}
          <div className="lg:col-span-5 bg-[#0F111A] border border-white/15 rounded-3xl p-6 shadow-xl space-y-4">
            <h3 className="font-bebas text-2xl text-white tracking-wide border-b border-white/10 pb-3">
              WRITE AN AUDIENCE REVIEW
            </h3>

            {revMsg.text && (
              <div className={`p-3 rounded-xl border text-xs flex items-center gap-2 ${
                revMsg.type === 'success' ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400' : 'bg-red-500/10 border-red-500/30 text-red-400'
              }`}>
                {revMsg.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
                <span>{revMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleReview} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Rating</label>
                <select
                  value={rating}
                  onChange={(e) => setRating(e.target.value)}
                  className="w-full bg-[#181a28] border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#FFD700]"
                >
                  <option value={5}>⭐⭐⭐⭐⭐ Outstanding (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ Great (4/5)</option>
                  <option value={3}>⭐⭐⭐ Good (3/5)</option>
                  <option value={2}>⭐⭐ Fair (2/5)</option>
                  <option value={1}>⭐ Poor (1/5)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Your Thoughts</label>
                <textarea
                  rows={4}
                  required
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Share your review of the performance, visuals, sound..."
                  className="w-full bg-[#181a28] border border-white/10 rounded-xl p-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-[#FFD700]"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-cinema-gold w-full py-3 text-sm rounded-xl flex items-center justify-center gap-2"
              >
                <Send className="w-4 h-4" />
                <span>{submitting ? 'Posting...' : 'Post Audience Review'}</span>
              </button>
            </form>
          </div>

          {/* Reviews List */}
          <div className="lg:col-span-7 space-y-4">
            {reviews.reviews.length === 0 ? (
              <div className="bg-[#0F111A] border border-white/10 rounded-3xl p-12 text-center text-gray-500 text-sm">
                No audience reviews yet. Be the first to share your thoughts!
              </div>
            ) : (
              reviews.reviews.map((r) => (
                <div key={r.id} className="bg-[#0F111A] border border-white/10 rounded-2xl p-5 space-y-2 hover:border-white/20 transition-all">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-[#E50914]/20 border border-[#E50914]/40 flex items-center justify-center text-white font-extrabold text-xs">
                        {r.user_name?.[0]?.toUpperCase() || 'U'}
                      </div>
                      <span className="text-sm font-bold text-white">{r.user_name}</span>
                    </div>
                    <div className="flex items-center gap-1 bg-[#FFD700]/10 border border-[#FFD700]/30 px-2.5 py-1 rounded-full">
                      <Star className="w-3.5 h-3.5 fill-[#FFD700] text-[#FFD700]" />
                      <span className="text-xs font-black text-[#FFD700]">{r.rating}/5</span>
                    </div>
                  </div>
                  <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">{r.comment}</p>
                </div>
              ))
            )}
          </div>
        </div>
      </section>

    </div>
  );
}
