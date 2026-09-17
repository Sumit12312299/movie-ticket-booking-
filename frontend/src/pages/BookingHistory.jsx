import React, { useState, useEffect } from 'react';
import { getMyBookings, cancelBooking } from '../services/api';
import { Ticket, Calendar, XCircle, Clock, Film, CheckCircle, AlertTriangle, Sparkles, QrCode } from 'lucide-react';

const STATUS = {
  confirmed: { bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', color: 'text-emerald-400' },
  cancelled:  { bg: 'bg-red-500/10', border: 'border-red-500/30', color: 'text-red-400' },
  pending:    { bg: 'bg-amber-500/10', border: 'border-amber-500/30', color: 'text-amber-400' },
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
    if (!window.confirm('Cancel this booking? Seats will be returned to the live layout.')) return;
    setCancelId(id);
    try {
      await cancelBooking(id);
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.detail || 'Failed to cancel booking');
    } finally { setCancelId(null); }
  };

  const filtered = filter === 'all' ? bookings : bookings.filter((b) => b.status === filter);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#E50914]/20 border-t-[#E50914] rounded-full animate-spin"></div>
        <p className="font-bebas text-lg text-gray-400">Retrieving E-Tickets...</p>
      </div>
    );
  }

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-[#E50914] flex items-center justify-center text-white shadow-lg shadow-[#E50914]/30">
            <Ticket className="w-6 h-6" />
          </div>
          <div>
            <h1 className="font-bebas text-4xl text-white tracking-wide">MY CINEMA PASSES</h1>
            <p className="text-xs text-gray-400">Total {bookings.length} reservations recorded</p>
          </div>
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-2">
          {['all', 'confirmed', 'cancelled'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-4 py-2 rounded-xl text-xs font-bold capitalize transition-all cursor-pointer ${
                filter === f
                  ? 'bg-[#E50914] text-white shadow-md'
                  : 'bg-[#131624] text-gray-400 border border-white/10 hover:text-white'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <div className="bg-[#0F111A] border border-white/10 rounded-3xl p-16 text-center space-y-3">
          <Film className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="font-bebas text-2xl text-gray-400">No {filter !== 'all' ? filter : ''} E-Tickets Found</h3>
          <p className="text-xs text-gray-500">Explore the latest movies and reserve your first IMAX seat!</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((b) => {
            const st = STATUS[b.status] || STATUS.pending;
            return (
              <div key={b.id} className="bg-[#0F111A] border border-white/15 rounded-3xl p-6 shadow-xl relative overflow-hidden flex flex-col justify-between space-y-4 hover:border-white/30 transition-all">
                
                {/* Accent Status Indicator */}
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-bebas text-2xl text-white tracking-wide leading-tight">{b.movie_title}</h3>
                    <p className="text-xs text-gray-400">{b.theatre_name || 'INOX Grand'}</p>
                  </div>
                  <span className={`text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full border flex items-center gap-1 ${st.bg} ${st.border} ${st.color}`}>
                    {b.status === 'confirmed' ? <CheckCircle className="w-3 h-3" /> : <XCircle className="w-3 h-3" />}
                    {b.status}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 text-xs bg-[#131624] border border-white/5 rounded-2xl p-4">
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">Reserved Seats</span>
                    <span className="font-extrabold text-[#E50914] text-sm">{b.seats?.join(', ')}</span>
                  </div>
                  <div>
                    <span className="text-[9px] font-bold text-gray-500 uppercase block">Total Amount</span>
                    <span className="font-extrabold text-white text-sm">₹{b.total_amount}</span>
                  </div>
                  <div className="col-span-2 pt-2 border-t border-white/5 flex justify-between items-center text-[10px] text-gray-400">
                    <span>Date: {new Date(b.booking_time).toLocaleDateString('en-IN')}</span>
                    <span className="font-mono text-gray-500">ID: {b.id?.slice(0, 10)}...</span>
                  </div>
                </div>

                {b.status === 'confirmed' && (
                  <button
                    onClick={() => handleCancel(b.id)}
                    disabled={cancellingId === b.id}
                    className="text-xs font-bold text-red-400 hover:text-red-300 flex items-center justify-end gap-1 bg-transparent border-0 cursor-pointer self-end"
                  >
                    <XCircle className="w-3.5 h-3.5" />
                    <span>{cancellingId === b.id ? 'Cancelling...' : 'Cancel Reservation'}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
