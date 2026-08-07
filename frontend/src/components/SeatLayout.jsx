import React from 'react';

export default function SeatLayout({ seatLayout = [], selectedSeats = [], onSeatToggle }) {
  const rowsMap = {};
  seatLayout.forEach((seat) => {
    if (!rowsMap[seat.row]) rowsMap[seat.row] = [];
    rowsMap[seat.row].push(seat);
  });
  const sortedRows = Object.keys(rowsMap).sort();

  return (
    <div style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      {/* Screen Graphic */}
      <div style={{ width: '100%', maxWidth: '600px', marginBottom: '40px', textAlign: 'center' }}>
        <div style={{ width: '100%', height: '14px', background: 'linear-gradient(to right, rgba(229,57,53,0.1), var(--red), rgba(229,57,53,0.1))', borderRadius: '50% 50% 0 0', boxShadow: '0 -10px 20px rgba(229,57,53,0.4)', opacity: 0.8 }} />
        <p style={{ fontSize: '10px', fontWeight: 800, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '1px', marginTop: '12px' }}>
          Screen This Way
        </p>
      </div>

      {/* Seat Grid */}
      <div style={{ overflowX: 'auto', maxWidth: '100%', paddingBottom: '16px' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {sortedRows.map((rowLetter) => (
            <div key={rowLetter} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '14px' }}>
              <span style={{ width: '20px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{rowLetter}</span>
              
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                {rowsMap[rowLetter].sort((a, b) => a.number - b.number).map((seat) => {
                  const seatLabel = `${seat.row}${seat.number}`;
                  const isSelected = selectedSeats.includes(seatLabel);
                  const isBooked = seat.status === 'booked';
                  
                  return (
                    <button
                      key={seatLabel}
                      disabled={isBooked}
                      onClick={() => onSeatToggle(seatLabel)}
                      className={`seat ${isBooked ? 'seat-booked' : isSelected ? 'seat-sel' : 'seat-avail'}`}
                      title={`Seat ${seatLabel} - ${isBooked ? 'Booked' : 'Available'}`}
                    >
                      {seat.number}
                    </button>
                  );
                })}
              </div>

              <span style={{ width: '20px', textAlign: 'center', fontSize: '12px', fontWeight: 700, color: 'var(--text-muted)' }}>{rowLetter}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Seat Legend */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '24px', marginTop: '32px', paddingTop: '20px', borderTop: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat seat-avail" style={{ cursor: 'default' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Available</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat seat-sel" style={{ cursor: 'default' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Selected</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div className="seat seat-booked" style={{ cursor: 'default' }}></div>
          <span style={{ fontSize: '12px', color: 'var(--text-muted)', fontWeight: 600 }}>Booked</span>
        </div>
      </div>
    </div>
  );
}
