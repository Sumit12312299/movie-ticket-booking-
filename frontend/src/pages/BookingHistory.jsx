import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';
import { Ticket, Calendar, XCircle, Clock, Film, CheckCircle, AlertTriangle } from 'lucide-react';

const STATUS = {
  confirmed: { bg: 'rgba(70,211,105,0.08)', border: 'rgba(70,211,105,0.3)', color: '#46d369' },
  cancelled:  { bg: 'rgba(244,67,54,0.08)',  border: 'rgba(244,67,54,0.3)',  color: '#f44336' },
  pending:    { bg: 'rgba(255,153,0,0.08)',   border: 'rgba(255,153,0,0.3)',  color: '#ff9900' },
};

export default function BookingHistory() {
  const [bookings, setBookings]     = useState([]);
  const [loading, setLoading]       = useState(true);
  const [cancellingId, setCancelId] = useState(null);
  const [filter, setFilter]         = useState('all');

  useEffect(() => { fetchBookings(); }, []);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await getMyBookings();
      setBookings(res.data);
    } catch (err) { console.error(err); }
    finally { setLoading(false); }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Cancel this booking? This action cannot be undone.')) return;
    setCancelId(id);
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel booking');
    } finally { setCancelId(null); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter(b => b.status === filter);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(0,168,225,0.2)', borderTop: '3px solid #00a8e1', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  return (
    <div style={{ paddingBottom: '60px' }} className="animate-fadeIn">
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '28px', flexWrap: 'wrap', gap: '16px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <Ticket size={26} color="#00a8e1" />
          <div>
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0 }}>My Bookings</h1>
            <p style={{ fontSize: '13px', color: '#546e7a', margin: 0 }}>{bookings.length} total booking{bookings.length !== 1 ? 's' : ''}</p>
          </div>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          {['all', 'confirmed', 'cancelled'].map(f => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              style={{
                fontSize: '12px', fontWeight: 700, padding: '7px 16px', borderRadius: '6px',
                border: filter === f ? '1px solid rgba(0,168,225,0.5)' : '1px solid rgba(255,255,255,0.08)',
                background: filter === f ? 'rgba(0,168,225,0.1)' : 'rgba(255,255,255,0.03)',
                color: filter === f ? '#00a8e1' : '#8a9bb0',
                cursor: 'pointer', textTransform: 'capitalize', transition: 'all 0.2s',
              }}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div style={{
          background: 'rgba(21,32,43,0.7)', border: '1px solid rgba(255,255,255,0.07)',
          borderRadius: '12px', padding: '60px', textAlign: 'center',
        }}>
          <Film size={48} color="#2d3f54" style={{ margin: '0 auto 16px' }} />
          <p style={{ fontSize: '16px', fontWeight: 700, color: '#546e7a' }}>
            {filter === 'all' ? 'No bookings yet' : `No ${filter} bookings`}
          </p>
          <p style={{ fontSize: '13px', color: '#2d3f54', marginTop: '6px' }}>
            Browse movies and book your first ticket!
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(380px, 1fr))', gap: '20px' }}>
          {filtered.map(b => {
            const st = STATUS[b.status] || STATUS.pending;
            return (
              <div key={b.id} style={{
                background: 'rgba(21,32,43,0.9)', border: '1px solid rgba(255,255,255,0.07)',
                borderRadius: '12px', padding: '24px', position: 'relative', overflow: 'hidden',
              }}>
                {/* Status accent bar */}
                <div style={{ position: 'absolute', top: 0, left: 0, bottom: 0, width: '3px', background: st.color, borderRadius: '12px 0 0 12px' }} />

                {/* Movie name + status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', paddingLeft: '8px' }}>
                  <div>
                    <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', margin: '0 0 4px' }}>{b.movie_title}</h3>
                    <p style={{ fontSize: '12px', color: '#546e7a', margin: 0 }}>{b.theatre_name}</p>
                  </div>
                  <span style={{
                    fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px',
                    padding: '4px 10px', borderRadius: '4px', flexShrink: 0,
                    background: st.bg, border: `1px solid ${st.border}`, color: st.color,
                    display: 'flex', alignItems: 'center', gap: '4px',
                  }}>
                    {b.status === 'confirmed' ? <CheckCircle size={10} /> : b.status === 'cancelled' ? <XCircle size={10} /> : <AlertTriangle size={10} />}
                    {b.status}
                  </span>
                </div>

                {/* Details grid */}
                <div style={{
                  display: 'grid', gridTemplateColumns: '1fr 1fr',
                  gap: '12px', paddingTop: '16px', borderTop: '1px solid rgba(255,255,255,0.06)',
                  marginLeft: '8px',
                }}>
                  <div>
                    <p style={{ fontSize: '11px', color: '#546e7a', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Seats</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#00a8e1' }}>{b.seats?.join(', ')}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#546e7a', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Amount Paid</p>
                    <p style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>₹{b.total_amount}</p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#546e7a', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Booking Date</p>
                    <p style={{ fontSize: '13px', color: '#8a9bb0', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Calendar size={12} />
                      {new Date(b.booking_time).toLocaleDateString('en-IN', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                  <div>
                    <p style={{ fontSize: '11px', color: '#546e7a', marginBottom: '3px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Booking ID</p>
                    <p style={{ fontSize: '11px', fontFamily: 'monospace', color: '#546e7a' }}>{b.id?.slice(0, 12)}…</p>
                  </div>
                </div>

                {/* Cancel action */}
                {b.status === 'confirmed' && (
                  <div style={{ marginTop: '16px', paddingLeft: '8px', display: 'flex', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => handleCancel(b.id)}
                      disabled={cancellingId === b.id}
                      style={{
                        display: 'flex', alignItems: 'center', gap: '5px',
                        fontSize: '12px', fontWeight: 700, color: '#f44336',
                        background: 'none', border: 'none', cursor: 'pointer',
                        opacity: cancellingId === b.id ? 0.5 : 1,
                        transition: 'opacity 0.2s',
                      }}
                    >
                      <XCircle size={14} />
                      {cancellingId === b.id ? 'Cancelling…' : 'Cancel Booking'}
                    </button>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
