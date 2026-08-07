import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getMovie, getMovieReviews, createReview } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { Star, Clock, Calendar, Ticket, Send, CheckCircle, AlertCircle, ArrowLeft } from 'lucide-react';

const S = {
  page: { paddingBottom: '60px' },
  back: { display: 'inline-flex', alignItems: 'center', gap: '6px', color: '#8a9bb0', fontSize: '13px', fontWeight: 600, textDecoration: 'none', marginBottom: '24px', transition: 'color 0.2s' },
  hero: { display: 'flex', gap: '40px', alignItems: 'flex-start', flexWrap: 'wrap', marginBottom: '48px', background: 'rgba(21,32,43,0.7)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '12px', padding: '36px', backdropFilter: 'blur(10px)' },
  poster: { width: '240px', minHeight: '340px', borderRadius: '10px', overflow: 'hidden', boxShadow: '0 20px 50px rgba(0,0,0,0.7)', border: '1px solid rgba(255,255,255,0.1)', flexShrink: 0 },
  info: { flex: 1, minWidth: '260px' },
  badge: { display: 'inline-block', fontSize: '11px', fontWeight: 700, padding: '3px 10px', borderRadius: '3px', border: '1px solid rgba(0,168,225,0.3)', background: 'rgba(0,168,225,0.1)', color: '#00a8e1', marginRight: '6px', marginBottom: '6px' },
  genreBadge: { display: 'inline-block', fontSize: '11px', fontWeight: 600, padding: '3px 10px', borderRadius: '3px', border: '1px solid rgba(255,255,255,0.1)', background: 'rgba(255,255,255,0.06)', color: '#8a9bb0', marginRight: '6px', marginBottom: '6px' },
  title: { fontSize: '38px', fontWeight: 900, color: '#fff', lineHeight: 1.1, margin: '12px 0 16px', letterSpacing: '-0.5px' },
  stats: { display: 'flex', flexWrap: 'wrap', gap: '20px', marginBottom: '20px' },
  stat: { display: 'flex', alignItems: 'center', gap: '6px', fontSize: '14px', color: '#8a9bb0' },
  desc: { fontSize: '15px', color: '#8a9bb0', lineHeight: 1.75, marginBottom: '28px', maxWidth: '600px' },
  card: { background: 'rgba(21,32,43,0.9)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: '10px', padding: '24px' },
};

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
      setRevMsg({ type: 'success', text: '✅ Review submitted successfully!' });
      setComment('');
      const rRes = await getMovieReviews(id);
      setReviews(rRes.data);
    } catch (err) {
      setRevMsg({ type: 'error', text: err.response?.data?.detail || 'Failed to submit review' });
    } finally { setSubmitting(false); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,168,225,0.2)', borderTop: '3px solid #00a8e1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }
  if (!movie) return (
    <div style={{ textAlign: 'center', padding: '60px', color: '#546e7a' }}>Movie not found.</div>
  );

  return (
    <div style={S.page} className="animate-fadeIn">
      {/* Back button */}
      <Link to="/" style={S.back}
        onMouseOver={e => e.currentTarget.style.color = '#fff'}
        onMouseOut={e => e.currentTarget.style.color = '#8a9bb0'}
      >
        <ArrowLeft size={16} /> Back to Movies
      </Link>

      {/* Hero section */}
      <div style={S.hero}>
        {/* Poster */}
        <div style={S.poster}>
          <img
            src={movie.poster_url || 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', minHeight: '340px' }}
            onError={e => { e.target.src = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=500'; }}
          />
        </div>

        {/* Info */}
        <div style={S.info}>
          {/* Badges */}
          <div>
            <span style={S.badge}>Prime Exclusive</span>
            <span style={S.badge}>{movie.language}</span>
            {movie.genre?.map((g, i) => <span key={i} style={S.genreBadge}>{g}</span>)}
          </div>

          <h1 style={S.title}>{movie.title}</h1>

          {/* Stats */}
          <div style={S.stats}>
            <div style={S.stat}>
              <Star size={16} fill="#f59e0b" color="#f59e0b" />
              <strong style={{ color: '#fff' }}>{reviews.average_rating || 'N/A'}</strong>
              <span style={{ fontSize: '12px', color: '#546e7a' }}>({reviews.total_reviews} reviews)</span>
            </div>
            <div style={S.stat}><Clock size={15} />{movie.duration_mins} mins</div>
            <div style={S.stat}><Calendar size={15} />{movie.release_date}</div>
          </div>

          <p style={S.desc}>{movie.description}</p>

          {/* CTA */}
          <button
            onClick={() => navigate(`/movie/${movie.id}/select-show`)}
            className="btn-prime"
            style={{ fontSize: '15px', padding: '12px 28px' }}
          >
            <Ticket size={18} /> Book Tickets
          </button>
        </div>
      </div>

      {/* Reviews */}
      <section>
        <h2 style={{ fontSize: '22px', fontWeight: 800, color: '#fff', marginBottom: '24px' }}>
          Audience Reviews
          {reviews.total_reviews > 0 && (
            <span style={{ marginLeft: '12px', fontSize: '14px', fontWeight: 600, color: '#546e7a' }}>
              {reviews.total_reviews} reviews · avg {reviews.average_rating} ★
            </span>
          )}
        </h2>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px', flexWrap: 'wrap' }}>
          {/* Write a review */}
          <div style={S.card}>
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', marginBottom: '18px' }}>Write a Review</h3>

            {revMsg.text && (
              <div style={{
                display: 'flex', gap: '8px', alignItems: 'flex-start',
                background: revMsg.type === 'success' ? 'rgba(70,211,105,0.08)' : 'rgba(244,67,54,0.08)',
                border: `1px solid ${revMsg.type === 'success' ? 'rgba(70,211,105,0.3)' : 'rgba(244,67,54,0.3)'}`,
                borderRadius: '6px', padding: '10px 12px', marginBottom: '16px',
              }}>
                {revMsg.type === 'success'
                  ? <CheckCircle size={15} color="#46d369" />
                  : <AlertCircle size={15} color="#f44336" />}
                <span style={{ fontSize: '13px', color: revMsg.type === 'success' ? '#46d369' : '#f44336' }}>{revMsg.text}</span>
              </div>
            )}

            <form onSubmit={handleReview}>
              <div style={{ marginBottom: '14px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8a9bb0', marginBottom: '6px' }}>Rating</label>
                <select value={rating} onChange={e => setRating(e.target.value)} className="input-field">
                  <option value={5}>⭐⭐⭐⭐⭐ Outstanding (5/5)</option>
                  <option value={4}>⭐⭐⭐⭐ Great (4/5)</option>
                  <option value={3}>⭐⭐⭐ Good (3/5)</option>
                  <option value={2}>⭐⭐ Fair (2/5)</option>
                  <option value={1}>⭐ Poor (1/5)</option>
                </select>
              </div>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '13px', fontWeight: 600, color: '#8a9bb0', marginBottom: '6px' }}>Your Review</label>
                <textarea
                  rows={4} required value={comment}
                  onChange={e => setComment(e.target.value)}
                  placeholder="Share your thoughts about this movie..."
                  className="input-field"
                  style={{ resize: 'vertical', fontFamily: 'inherit' }}
                />
              </div>
              <button type="submit" disabled={submitting} className="btn-prime" style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}>
                <Send size={15} /> {submitting ? 'Submitting...' : 'Post Review'}
              </button>
            </form>
          </div>

          {/* Reviews list */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {reviews.reviews.length === 0 ? (
              <div style={{ ...S.card, textAlign: 'center', color: '#546e7a', fontSize: '14px', padding: '40px' }}>
                No reviews yet. Be the first!
              </div>
            ) : reviews.reviews.map(r => (
              <div key={r.id} style={S.card}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 700, fontSize: '14px', color: '#f0f4f8' }}>{r.user_name}</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    {[...Array(r.rating)].map((_, i) => <Star key={i} size={13} fill="#f59e0b" color="#f59e0b" />)}
                    <span style={{ fontSize: '12px', color: '#8a9bb0', marginLeft: '4px' }}>{r.rating}/5</span>
                  </div>
                </div>
                <p style={{ fontSize: '13px', color: '#8a9bb0', lineHeight: 1.65 }}>{r.comment}</p>
                <span style={{ fontSize: '11px', color: '#2d3f54', display: 'block', marginTop: '8px' }}>
                  {new Date(r.created_at).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
