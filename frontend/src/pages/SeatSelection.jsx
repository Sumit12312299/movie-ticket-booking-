import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { getShowSeats } from '../services/api';
import SeatLayout from '../components/SeatLayout';
import BookingSummary from '../components/BookingSummary';
import { ArrowLeft, Film, Clock, MapPin, Sparkles, Ticket } from 'lucide-react';

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
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 border-4 border-[#E50914]/20 border-t-[#E50914] rounded-full animate-spin"></div>
        <p className="font-bebas text-lg text-gray-400">Loading Cinema Seat Layout...</p>
      </div>
    );
  }

  const showTimeFormatted = show?.show_time
    ? new Date(show.show_time).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) +
      ' • ' +
      new Date(show.show_time).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
    : '';

  return (
    <div className="animate-fadeIn max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
      
      {/* Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors bg-transparent border-0 cursor-pointer"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>BACK TO SHOWTIMES</span>
      </button>

      {/* Show Details Header Banner */}
      <div className="bg-[#0F111A] border border-white/15 rounded-3xl p-6 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-2xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="bg-[#E50914] text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded">
              INTERACTIVE SEAT SELECTION
            </span>
            <span className="text-xs font-semibold text-[#FFD700]">Screen {show?.screen_number || 1}</span>
          </div>
          <h1 className="font-bebas text-3xl sm:text-4xl text-white tracking-wide">{show?.movie_title}</h1>
          <p className="text-xs text-gray-400 flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-[#E50914]" />
            <span>{show?.theatre_name}</span>
            <span>•</span>
            <Clock className="w-3.5 h-3.5 text-[#FFD700]" />
            <span>{showTimeFormatted}</span>
          </p>
        </div>

        <div className="flex items-center gap-3 bg-[#131624] border border-white/10 px-4 py-3 rounded-2xl">
          <div className="text-right">
            <span className="block text-[10px] text-gray-400 uppercase tracking-widest font-bold">Seats Left</span>
            <span className="font-bebas text-2xl text-[#E50914] leading-none">{show?.available_seats}</span>
          </div>
        </div>
      </div>

      {/* Seat Map & Booking Summary Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Seat Layout Grid */}
        <div className="lg:col-span-8 bg-[#0F111A] border border-white/15 rounded-3xl p-6 shadow-2xl">
          <SeatLayout
            seatLayout={show?.seat_layout || []}
            selectedSeats={selectedSeats}
            onSeatToggle={handleSeatToggle}
          />
        </div>

        {/* Booking Summary Floating Card */}
        <div className="lg:col-span-4 lg:sticky lg:top-24">
          <BookingSummary
            show={show}
            selectedSeats={selectedSeats}
            onProceed={handleProceed}
          />
        </div>
      </div>

    </div>
  );
}
