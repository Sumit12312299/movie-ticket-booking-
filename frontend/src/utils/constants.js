// Application-wide constant definitions

/** Seat type categories used across SeatMap and Checkout pages */
export const SEAT_TYPES = {
  SILVER: 'silver',
  GOLD: 'gold',
  PLATINUM: 'platinum',
};

/** Seat type display labels */
export const SEAT_TYPE_LABELS = {
  [SEAT_TYPES.SILVER]: 'Silver',
  [SEAT_TYPES.GOLD]: 'Gold',
  [SEAT_TYPES.PLATINUM]: 'Platinum',
};

/** Booking status codes */
export const BOOKING_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  CANCELLED: 'cancelled',
};

/** Maximum seats a user can select per booking */
export const MAX_SEATS_PER_BOOKING = 10;

/** API request timeout in milliseconds */
export const API_TIMEOUT_MS = 15000;

/** Wallet top-up denomination options in INR */
export const WALLET_TOPUP_OPTIONS = [100, 250, 500, 1000, 2000];
