import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { createBooking, processPayment } from '../services/api';
import { CreditCard, Smartphone, Building2, ShieldCheck, Ticket, AlertCircle } from 'lucide-react';

export default function Checkout() {
  const location = useLocation();
  const navigate = useNavigate();

  const { show, selectedSeats } = location.state || {};

  const [paymentMethod, setPaymentMethod] = useState('upi');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!show || !selectedSeats || selectedSeats.length === 0) {
    return (
      <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-muted)' }}>
        No booking session found. Please select your seats again.
      </div>
    );
  }

  const subtotal = show.price * selectedSeats.length;
  const convenienceFee = 30;
  const totalAmount = subtotal + convenienceFee;

  const handlePayAndBook = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const bookingRes = await createBooking({ show_id: show.id, seats: selectedSeats });
      const bookingId = bookingRes.data.id;

      const paymentRes = await processPayment({ booking_id: bookingId, payment_method: paymentMethod, amount: totalAmount });

      navigate('/booking-success', { state: { booking: bookingRes.data, payment: paymentRes.data } });
    } catch (err) {
      setError(err.response?.data?.detail || 'Booking or Payment failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const PaymentOption = ({ id, icon: Icon, title, desc }) => {
    const isSelected = paymentMethod === id;
    return (
      <label style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '16px', borderRadius: '10px', border: `1px solid ${isSelected ? 'rgba(229,57,53,0.5)' : 'var(--border)'}`,
        background: isSelected ? 'rgba(229,57,53,0.06)' : 'var(--bg-input)', cursor: 'pointer',
        transition: 'all 0.2s', marginBottom: '12px',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '40px', height: '40px', borderRadius: '8px', background: isSelected ? 'rgba(229,57,53,0.1)' : 'rgba(255,255,255,0.05)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Icon size={20} color={isSelected ? 'var(--red)' : 'var(--text-mid)'} />
          </div>
          <div>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 2px' }}>{title}</p>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: 0 }}>{desc}</p>
          </div>
        </div>
        <input
          type="radio" name="payment" value={id} checked={isSelected}
          onChange={(e) => setPaymentMethod(e.target.value)}
          style={{ width: '18px', height: '18px', accentColor: 'var(--red)', cursor: 'pointer' }}
        />
      </label>
    );
  };

  return (
    <div className="animate-fadeIn" style={{ maxWidth: '960px', margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px' }}>
        <ShieldCheck size={28} color="var(--red)" />
        <h1 style={{ fontSize: '24px', fontWeight: 900, color: '#fff', margin: 0 }}>Secure Checkout</h1>
      </div>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(229,57,53,0.08)', border: '1px solid rgba(229,57,53,0.3)', borderRadius: '8px', padding: '14px', marginBottom: '24px' }}>
          <AlertCircle size={18} color="var(--red)" />
          <span style={{ fontSize: '14px', color: 'var(--red)' }}>{error}</span>
        </div>
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 340px', gap: '32px', alignItems: 'start' }}>
        {/* Payment Options */}
        <div className="card" style={{ padding: '32px' }}>
          <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '16px', marginBottom: '24px' }}>
            Select Payment Method
          </h2>

          <PaymentOption id="upi" icon={Smartphone} title="UPI / GPay / PhonePe" desc="Instant approval via UPI ID or QR" />
          <PaymentOption id="credit_card" icon={CreditCard} title="Credit / Debit Card" desc="Visa, MasterCard, RuPay" />
          <PaymentOption id="net_banking" icon={Building2} title="Net Banking" desc="All major Indian Banks" />

          <button onClick={handlePayAndBook} disabled={loading} className="btn-red" style={{ width: '100%', justifyContent: 'center', padding: '16px', fontSize: '16px', marginTop: '16px', opacity: loading ? 0.7 : 1 }}>
            {loading ? 'Processing Payment...' : `Pay ₹${totalAmount} & Confirm Booking`}
          </button>
        </div>

        {/* Order Summary */}
        <div className="card" style={{ padding: '24px' }}>
          <h2 style={{ fontSize: '16px', fontWeight: 800, color: '#fff', borderBottom: '1px solid var(--border)', paddingBottom: '14px', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Ticket size={18} color="var(--red)" /> Order Summary
          </h2>

          <div style={{ marginBottom: '20px' }}>
            <p style={{ fontSize: '15px', fontWeight: 700, color: '#fff', margin: '0 0 4px' }}>{show.movie_title}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-mid)', margin: '0 0 12px' }}>{show.theatre_name}</p>
            <p style={{ fontSize: '13px', color: 'var(--text-muted)', margin: 0 }}>
              Seats: <span style={{ fontWeight: 700, color: 'var(--text-light)' }}>{selectedSeats.join(', ')}</span>
            </p>
          </div>

          <div style={{ borderTop: '1px solid var(--border-sm)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-mid)' }}>
              <span>Tickets ({selectedSeats.length})</span>
              <span>₹{subtotal}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '13px', color: 'var(--text-mid)' }}>
              <span>Convenience Fee</span>
              <span>₹{convenienceFee}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-sm)', paddingTop: '12px', marginTop: '6px' }}>
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#fff' }}>Amount Due</span>
              <span style={{ fontSize: '18px', fontWeight: 900, color: 'var(--red)' }}>₹{totalAmount}</span>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          div[style*="gridTemplateColumns: '1fr 340px'"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
