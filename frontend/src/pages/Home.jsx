import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { getMovies } from '../services/api';
import { Ticket, Info, ChevronRight, Star, Clock, Play, TrendingUp, Zap } from 'lucide-react';

const FALLBACK = 'https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?w=400';

function StarRating({ rating = 4.2 }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '3px' }}>
      {[1,2,3,4,5].map(s => (
        <svg key={s} width="12" height="12" viewBox="0 0 24 24" fill={s <= Math.round(rating) ? '#FFC107' : 'none'} stroke="#FFC107" strokeWidth="2">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      ))}
      <span style={{ fontSize: '12px', color: '#FFC107', fontWeight: 700, marginLeft: '2px' }}>{rating}</span>
    </div>
  );
}

function MovieCard({ movie, width = 180 }) {
  return (
    <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', flexShrink: 0 }}>
      <div className="movie-card" style={{ width: `${width}px` }}>
        <div style={{ width: `${width}px`, height: `${Math.round(width * 1.45)}px`, overflow: 'hidden', position: 'relative', background: '#111220' }}>
          <img
            src={movie.poster_url || FALLBACK}
            alt={movie.title}
            style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block', transition: 'transform 0.4s ease' }}
            onError={e => { e.target.src = FALLBACK; }}
          />
          {/* Hover Overlay */}
          <div className="movie-overlay" style={{
            position: 'absolute', inset: 0,
            background: 'linear-gradient(to top, rgba(11,12,26,0.95) 0%, rgba(11,12,26,0.3) 50%, transparent 100%)',
            display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', padding: '12px',
            opacity: 0, transition: 'opacity 0.3s',
          }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '36px', height: '36px', background: 'var(--red)', borderRadius: '50%', margin: '0 auto 8px' }}>
              <Play size={14} fill="white" color="white" />
            </div>
          </div>
          {/* Genre badge top left */}
          {movie.genre?.[0] && (
            <div style={{ position: 'absolute', top: '8px', left: '8px', background: 'var(--red)', color: '#fff', fontSize: '9px', fontWeight: 800, padding: '2px 7px', borderRadius: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              {movie.genre[0]}
            </div>
          )}
        </div>
        <div style={{ padding: '12px', background: 'var(--bg-card)' }}>
          <p style={{ fontSize: '14px', fontWeight: 700, color: 'var(--text-white)', margin: '0 0 6px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {movie.title}
          </p>
          <StarRating rating={4.2} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '6px' }}>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '3px' }}>
              <Clock size={10} />{movie.duration_mins}m
            </span>
            <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>•</span>
            <span style={{ fontSize: '11px', color: 'var(--text-muted)' }}>{movie.language}</span>
          </div>
        </div>
      </div>
      <style>{`.movie-card:hover .movie-overlay { opacity: 1 !important; } .movie-card:hover img { transform: scale(1.06); }`}</style>
    </Link>
  );
}

function Row({ title, icon, items, viewAll }) {
  if (!items?.length) return null;
  return (
    <section style={{ marginBottom: '44px' }}>
      <div className="section-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {icon && <div style={{ width: '4px', height: '22px', background: 'var(--red)', borderRadius: '2px' }} />}
          <span>{title}</span>
        </div>
        <button style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '13px', color: 'var(--red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 600 }}>
          View All <ChevronRight size={15} />
        </button>
      </div>
      <div className="scroll-row">
        {items.map(movie => <MovieCard key={movie.id} movie={movie} />)}
      </div>
    </section>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [movies, setMovies]     = useState([]);
  const [featured, setFeatured] = useState(null);
  const [loading, setLoading]   = useState(true);

  useEffect(() => { fetchMovies(); }, []);

  const fetchMovies = async () => {
    try {
      const res = await getMovies();
      setMovies(res.data);
      if (res.data.length > 0) setFeatured(res.data[0]);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div style={{ width: '48px', height: '48px', border: '3px solid rgba(229,57,53,0.2)', borderTop: '3px solid var(--red)', borderRadius: '50%', animation: 'mh-spin 0.75s linear infinite' }} />
      </div>
    );
  }

  const actionMovies = movies.filter(m => m.genre?.some(g => ['Action','Thriller','Adventure'].includes(g)));
  const sciFiMovies  = movies.filter(m => m.genre?.some(g => ['Sci-Fi','Fantasy'].includes(g)));
  const dramaMovies  = movies.filter(m => m.genre?.some(g => ['Drama','Biography','Comedy','History'].includes(g)));

  return (
    <div className="animate-fadeIn">

      {/* ── HERO ─────────────────────────────────────────────────── */}
      {featured && (
        <section style={{
          position: 'relative', borderRadius: '14px', overflow: 'hidden',
          minHeight: '500px', display: 'flex', alignItems: 'center',
          marginBottom: '52px', background: '#0a0b18',
          border: '1px solid var(--border)',
        }}>
          {/* Background poster */}
          <div style={{ position: 'absolute', inset: 0 }}>
            <img
              src={featured.poster_url || FALLBACK}
              alt="" aria-hidden
              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top', opacity: 0.22, filter: 'blur(8px)', transform: 'scale(1.05)' }}
            />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, rgba(11,12,26,0.98) 0%, rgba(11,12,26,0.85) 50%, rgba(11,12,26,0.3) 100%)' }} />
            <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(11,12,26,1) 0%, transparent 50%)' }} />
          </div>

          {/* Content */}
          <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', width: '100%', gap: '48px', padding: '52px 52px' }}>

            {/* Left text */}
            <div style={{ flex: 1, maxWidth: '580px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
                <span className="badge badge-red">🎬 Now Showing</span>
                <span style={{ fontSize: '13px', color: 'var(--text-mid)', fontWeight: 600 }}>{featured.language}</span>
                {featured.genre?.map((g, i) => (
                  <span key={i} style={{ fontSize: '11px', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.06)', padding: '2px 8px', borderRadius: '4px', border: '1px solid var(--border)' }}>{g}</span>
                ))}
              </div>

              <h1 style={{
                fontSize: 'clamp(32px, 4.5vw, 58px)',
                fontWeight: 900, color: '#fff', lineHeight: 1.08,
                marginBottom: '18px', letterSpacing: '-0.5px',
              }}>
                Book Your Movie Tickets<br />
                <span style={{ color: 'var(--red)' }}>Anytime, Anywhere</span>
              </h1>

              <p style={{ fontSize: '15px', color: 'var(--text-mid)', lineHeight: 1.7, marginBottom: '32px', maxWidth: '480px' }}>
                {featured.description || 'Discover the latest movies, book tickets instantly and enjoy the ultimate cinema experience. Your seat is just a click away.'}
              </p>

              <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap' }}>
                <button onClick={() => navigate(`/movie/${featured.id}/select-show`)} className="btn-red" style={{ fontSize: '15px', padding: '13px 28px' }}>
                  <Ticket size={18} /> Book Now
                </button>
                <button onClick={() => navigate(`/movie/${featured.id}`)} className="btn-outline" style={{ fontSize: '15px', padding: '12px 24px' }}>
                  <Info size={17} /> Explore Movies
                </button>
              </div>
            </div>

            {/* Right poster */}
            <div style={{ flexShrink: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <div style={{
                width: '240px', height: '340px', borderRadius: '12px',
                overflow: 'hidden', boxShadow: '0 24px 60px rgba(0,0,0,0.75)',
                border: '2px solid rgba(229,57,53,0.3)',
              }}>
                <img
                  src={featured.poster_url || FALLBACK}
                  alt={featured.title}
                  style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }}
                  onError={e => { e.target.src = FALLBACK; }}
                />
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── MOVIE ROWS ───────────────────────────────────────────── */}
      <Row title="Trending Movies" icon items={movies} />
      <Row title="Action & Adventure" icon items={actionMovies} />
      <Row title="Sci-Fi & Blockbusters" icon items={sciFiMovies} />
      <Row title="Drama & Classics" icon items={dramaMovies} />

    </div>
  );
}
