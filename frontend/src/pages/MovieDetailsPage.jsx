import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Star, Clock, Calendar, Film, Play, User, Send, Heart, Ticket } from 'lucide-react';
import API from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useNotification } from '../context/NotificationContext';
import TrailerModal from '../components/TrailerModal';

export default function MovieDetailsPage() {
  const { id } = useParams();
  const { user } = useAuth();
  const { addToast } = useNotification();

  const [movie, setMovie] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showTrailer, setShowTrailer] = useState(false);

  // Review Form state
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

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
      const res = await API.post(`/movies/${id}/reviews`, {
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

  if (loading) {
    return (
      <div className="py-20 text-center">
        <div className="w-12 h-12 border-4 border-rose-600 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <p className="mt-4 text-xs text-slate-400">Loading movie details...</p>
      </div>
    );
  }

  if (!movie) return null;

  return (
    <div className="space-y-12 pb-16">
      {/* Movie Hero Showcase */}
      <div className="relative rounded-3xl overflow-hidden glass-card border border-slate-800 shadow-2xl p-6 sm:p-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
          {/* Poster Card */}
          <div className="relative aspect-[2/3] rounded-2xl overflow-hidden shadow-2xl border border-slate-700">
            <img src={movie.poster_url} alt={movie.title} className="w-full h-full object-cover" />
            {movie.trailer_url && (
              <button
                onClick={() => setShowTrailer(true)}
                className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-rose-600/90 text-white flex items-center justify-center shadow-2xl hover:scale-110 transition-transform"
              >
                <Play className="w-7 h-7 ml-1 fill-white" />
              </button>
            )}
          </div>

          {/* Specs & Synopsis */}
          <div className="md:col-span-2 space-y-5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                {movie.rating.toFixed(1)} / 5.0 ({movie.reviews_count} reviews)
              </span>
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-slate-800 text-slate-300">
                {movie.language}
              </span>
            </div>

            <h1 className="text-3xl sm:text-5xl font-black text-white leading-tight">{movie.title}</h1>

            <div className="flex flex-wrap gap-4 text-xs text-slate-300">
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

            <div className="flex flex-wrap gap-2">
              {movie.genre.map((g) => (
                <span key={g} className="px-3 py-1 rounded-lg bg-slate-800 text-xs text-slate-300 border border-slate-700">
                  {g}
                </span>
              ))}
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Synopsis</h3>
              <p className="text-sm text-slate-300 leading-relaxed">{movie.synopsis}</p>
            </div>

            {/* Cast List */}
            {movie.cast && movie.cast.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-bold uppercase tracking-wider text-slate-400">Starring Cast</h3>
                <div className="flex flex-wrap gap-2">
                  {movie.cast.map((actor) => (
                    <span key={actor} className="px-3 py-1 rounded-full bg-slate-900 text-xs font-medium text-slate-200 border border-slate-800">
                      {actor}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* CTA Button */}
            <div className="pt-4 flex flex-wrap items-center gap-4">
              <Link
                to={`/showtimes/${movie.id}`}
                className="px-8 py-4 rounded-2xl bg-gradient-to-r from-rose-600 to-rose-500 hover:from-rose-500 hover:to-rose-400 text-white font-extrabold text-sm shadow-xl shadow-rose-600/30 flex items-center gap-2 hover:scale-105 transition-all"
              >
                <Ticket className="w-5 h-5" />
                Select Showtime & Seats
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Reviews & Ratings Section */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Submit Review Form */}
        <div className="glass-card rounded-3xl p-6 space-y-4 border border-slate-800">
          <h3 className="text-lg font-bold text-white flex items-center gap-2">
            <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
            Write a Review
          </h3>

          <form onSubmit={handleReviewSubmit} className="space-y-4">
            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Your Rating</label>
              <select
                value={newRating}
                onChange={(e) => setNewRating(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-rose-500"
              >
                <option value={5}>⭐⭐⭐⭐⭐ (5.0 - Exceptional)</option>
                <option value={4}>⭐⭐⭐⭐ (4.0 - Great)</option>
                <option value={3}>⭐⭐⭐ (3.0 - Average)</option>
                <option value={2}>⭐⭐ (2.0 - Poor)</option>
                <option value={1}>⭐ (1.0 - Terrible)</option>
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-400 block mb-1">Comment</label>
              <textarea
                rows={4}
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Share your thoughts on the cinematography, plot, or score..."
                className="w-full bg-slate-900 border border-slate-800 rounded-xl p-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-rose-500"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={submittingReview}
              className="w-full py-3 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-rose-600/25 transition-all"
            >
              <Send className="w-4 h-4" />
              {submittingReview ? 'Submitting...' : 'Post Review'}
            </button>
          </form>
        </div>

        {/* Existing Reviews List */}
        <div className="md:col-span-2 glass-card rounded-3xl p-6 space-y-4 border border-slate-800">
          <h3 className="text-lg font-bold text-white">Audience Reviews ({reviews.length})</h3>
          {reviews.length === 0 ? (
            <p className="text-xs text-slate-500 py-8 text-center">No reviews yet. Be the first to rate this movie!</p>
          ) : (
            <div className="space-y-4 max-h-[380px] overflow-y-auto pr-2">
              {reviews.map((rev) => (
                <div key={rev.id} className="p-4 rounded-2xl bg-slate-900/70 border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-rose-600/30 text-rose-400 flex items-center justify-center font-bold text-xs">
                        {rev.user_name.charAt(0)}
                      </div>
                      <span className="text-xs font-bold text-white">{rev.user_name}</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold text-amber-300">{rev.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <p className="text-xs text-slate-300 leading-relaxed">{rev.comment}</p>
                  <span className="text-[10px] text-slate-500 block">{rev.created_at}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Trailer Modal */}
      {showTrailer && <TrailerModal movie={movie} onClose={() => setShowTrailer(false)} />}
    </div>
  );
}
