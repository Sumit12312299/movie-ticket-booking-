import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getMovie, getShowsByMovie } from '../services/api';
import { MapPin } from 'lucide-react';

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
    const tName = show.theatre_name || 'Cinema Hall';
    if (!theatreMap[tName]) theatreMap[tName] = [];
    theatreMap[tName].push(show);
  });

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(229,57,53,0.2)', borderTop: '3px solid var(--red)', borderRadius: '50%', animation: 'mh-spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header Banner */}
      <div style={{ marginBottom: '32px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ width: '4px', height: '26px', background: 'var(--red)', borderRadius: '2px' }} />
              <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0 }}>{movie?.title}</h1>
            </div>
            <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginTop: '6px', marginLeft: '16px' }}>
              {movie?.language} • {movie?.genre?.join(', ')} • {movie?.duration_mins} mins
            </p>
          </div>
          <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--red)', background: 'var(--red-dim)', padding: '6px 14px', borderRadius: '20px', border: '1px solid var(--red-border)' }}>
            Select Cinema & Showtime
          </div>
        </div>
      </div>

      {/* Theatres List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {Object.keys(theatreMap).length === 0 ? (
          <div className="card" style={{ padding: '48px', textAlign: 'center', color: 'var(--text-muted)' }}>
            No shows currently available for this movie.
          </div>
        ) : (
          Object.keys(theatreMap).map((theatreName) => (
            <div key={theatreName} className="card" style={{ padding: '24px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={18} color="var(--red)" />
                  <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', margin: 0 }}>{theatreName}</h3>
                </div>
                <button style={{ background: 'none', border: 'none', color: 'var(--red)', fontSize: '11px', fontWeight: 700, cursor: 'pointer' }}>Change Theatre</button>
              </div>

              {/* Showtimes Grid */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: '12px' }}>
                {theatreMap[theatreName].map((show) => {
                  const timeStr = new Date(show.show_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
                  const dateStr = new Date(show.show_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' });

                  return (
                    <button
                      key={show.id}
                      onClick={() => navigate(`/select-seats/${show.id}`)}
                      style={{
                        background: 'var(--bg-input)', border: '1px solid var(--border)', borderRadius: '8px', padding: '12px',
                        cursor: 'pointer', transition: 'all 0.2s', display: 'flex', flexDirection: 'column', alignItems: 'center',
                      }}
                      onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--red)'; e.currentTarget.style.background = 'var(--bg-hover)'; }}
                      onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--border)'; e.currentTarget.style.background = 'var(--bg-input)'; }}
                    >
                      <span style={{ fontSize: '14px', fontWeight: 800, color: '#fff', marginBottom: '4px' }}>{timeStr}</span>
                      <span style={{ fontSize: '11px', color: 'var(--text-mid)', marginBottom: '8px' }}>{dateStr}</span>
                      <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-sm)' }}>
                        <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Screen {show.screen_number}</span>
                        <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--text-light)' }}>₹{show.price}</span>
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
