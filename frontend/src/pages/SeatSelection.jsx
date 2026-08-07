import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getShowSeats } from '../services/api';
import SeatLayout from '../components/SeatLayout';
import BookingSummary from '../components/BookingSummary';

export default function SeatSelection() {
  const { showId } = useParams();
  const navigate = useNavigate();

  const [show, setShow] = useState(null);
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchShow();
  }, [showId]);

  const fetchShow = async () => {
    try {
      setLoading(true);
      const res = await getShowSeats(showId);
      setShow(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSeatToggle = (seatLabel) => {
    if (selectedSeats.includes(seatLabel)) {
      setSelectedSeats(selectedSeats.filter((s) => s !== seatLabel));
    } else {
      if (selectedSeats.length >= 10) {
        alert('You can select a maximum of 10 seats per booking.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatLabel]);
    }
  };

  const handleProceed = () => {
    if (selectedSeats.length === 0) return;
    navigate('/checkout', { state: { show, selectedSeats } });
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
        <div style={{ width: '40px', height: '40px', border: '3px solid rgba(229,57,53,0.2)', borderTop: '3px solid var(--red)', borderRadius: '50%', animation: 'mh-spin 0.8s linear infinite' }} />
      </div>
    );
  }

  return (
    <div className="animate-fadeIn">
      {/* Header Info */}
      <div style={{ marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div style={{ width: '4px', height: '26px', background: 'var(--red)', borderRadius: '2px' }} />
            <h1 style={{ fontSize: '26px', fontWeight: 900, color: '#fff', margin: 0 }}>{show?.movie_title}</h1>
          </div>
          <p style={{ fontSize: '13px', color: 'var(--text-mid)', marginTop: '6px', marginLeft: '16px' }}>
            {show?.theatre_name} • Screen {show?.screen_number}
          </p>
        </div>
        <div style={{ fontSize: '12px', fontWeight: 600, color: 'var(--text-mid)' }}>
          Available Seats: <span style={{ color: 'var(--red)', fontWeight: 800 }}>{show?.available_seats}</span> / {show?.total_seats}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* Seat Map */}
        <div className="card" style={{ padding: '32px 24px', overflowX: 'hidden' }}>
          <SeatLayout seatLayout={show?.seat_layout || []} selectedSeats={selectedSeats} onSeatToggle={handleSeatToggle} />
        </div>

        {/* Booking Summary Panel */}
        <div style={{ position: 'sticky', top: '80px' }}>
          <BookingSummary show={show} selectedSeats={selectedSeats} onProceed={handleProceed} />
        </div>
      </div>

      <style>{`
        @media (max-width: 992px) {
          div[style*="gridTemplateColumns: '1fr 340px'"] {
            grid-template-columns: 1fr !important;
          }
          div[style*="position: 'sticky'"] {
            position: relative !important; top: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
