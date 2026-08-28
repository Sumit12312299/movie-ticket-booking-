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

/** Supported movie genre categories */
export const DEFAULT_GENRES = [
  'Action',
  'Adventure',
  'Animation',
  'Comedy',
  'Crime',
  'Drama',
  'Horror',
  'Mystery',
  'Romance',
  'Sci-Fi',
  'Thriller',
];

/** Supported audio/subtitle language filter options */
export const SUPPORTED_LANGUAGES = [
  'Hindi',
  'English',
  'Telugu',
  'Tamil',
  'Malayalam',
  'Kannada',
  'Marathi',
  'Gujarati',
  'Bengali',
];

/** Payment method options for checkout flow */
export const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI / QR Code', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', icon: '💳' },
  { id: 'wallet', label: 'CineWallet Balance', icon: '👛' },
  { id: 'netbanking', label: 'Net Banking', icon: '🏦' },
];

/** Base pricing rates per seat type category in INR */
export const SEAT_PRICING = {
  [SEAT_TYPES.SILVER]: 180,
  [SEAT_TYPES.GOLD]: 250,
  [SEAT_TYPES.PLATINUM]: 350,
};




