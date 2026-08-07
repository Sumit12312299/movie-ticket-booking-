import React from 'react';
import { Ticket, Calendar, Clock, Film } from 'lucide-react';

export default function BookingSummary({ show, selectedSeats = [], onProceed, loading = false }) {
  const price = show?.price || 0;
  const subtotal = price * selectedSeats.length;
  const convenienceFee = selectedSeats.length > 0 ? 30 : 0;
  const totalAmount = subtotal + convenienceFee;

  const showDate = show?.show_time ? new Date(show.show_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' }) : '';
  const showTime = show?.show_time ? new Date(show.show_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : '';

  return (
    <div className="card" style={{ padding: '24px', display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>
      <div>
        <h3 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Ticket size={20} color="var(--red)" />
          Booking Summary
        </h3>

        {/* Movie Details */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px', marginBottom: '12px' }}>
            <Film size={18} color="var(--text-muted)" style={{ marginTop: '2px' }} />
            <div>
              <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{show?.movie_title}</p>
              <p style={{ fontSize: '13px', color: 'var(--text-mid)', margin: 0 }}>{show?.theatre_name}</p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '12px', color: 'var(--text-mid)', marginLeft: '28px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Calendar size={14} color="var(--text-muted)" /> {showDate}</span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}><Clock size={14} color="var(--text-muted)" /> {showTime}</span>
          </div>

          {selectedSeats.length > 0 && (
            <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: '1px solid var(--border-sm)', marginLeft: '28px' }}>
              <p style={{ fontSize: '12px', color: 'var(--text-muted)', marginBottom: '8px' }}>Selected Seats:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                {selectedSeats.map(seat => (
                  <span key={seat} style={{ background: 'var(--bg-input)', border: '1px solid var(--border)', color: '#fff', fontSize: '11px', fontWeight: 700, padding: '3px 8px', borderRadius: '4px' }}>
                    {seat}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Price */}
        <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border)', paddingTop: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '10px' }}>
            <span>Ticket Price ({selectedSeats.length} x ₹{price})</span>
            <span style={{ color: '#fff' }}>₹{subtotal}</span>
          </div>
          {selectedSeats.length > 0 && (
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-mid)', marginBottom: '16px' }}>
              <span>Convenience Fee</span>
              <span style={{ color: '#fff' }}>₹{convenienceFee}</span>
            </div>
          )}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-sm)', paddingTop: '16px', marginBottom: '24px' }}>
            <span style={{ fontSize: '15px', fontWeight: 800, color: '#fff' }}>Total Payable</span>
            <span style={{ fontSize: '20px', fontWeight: 900, color: 'var(--red)' }}>₹{totalAmount}</span>
          </div>
        </div>
      </div>

      <button onClick={onProceed} disabled={selectedSeats.length === 0 || loading} className="btn-red" style={{ width: '100%', justifyContent: 'center', padding: '14px', opacity: selectedSeats.length === 0 || loading ? 0.5 : 1 }}>
        {loading ? 'Processing...' : `Proceed to Payment (₹${totalAmount})`}
      </button>
    </div>
  );
}
