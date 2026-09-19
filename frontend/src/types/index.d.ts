export interface User {
  id: string;
  name: string;
  email: string;
  role: 'customer' | 'admin' | 'theatre_manager';
  phone?: string;
  avatarUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  description: string;
  duration: number; // in minutes
  genre: string[];
  releaseDate: string;
  posterUrl: string;
  backdropUrl?: string;
  rating: number;
  voteCount: number;
  language: string;
}

export interface Seat {
  id: string;
  row: string;
  number: number;
  tier: 'STANDARD' | 'PREMIUM' | 'RECLINER';
  price: number;
  isBooked: boolean;
  isSelected?: boolean;
}

export interface Show {
  id: string;
  movieId: string;
  theatreId: string;
  screenName: string;
  startTime: string;
  endTime: string;
  price: number;
  format: '2D' | '3D' | 'IMAX' | '4DX';
}

export interface Booking {
  id: string;
  bookingCode: string;
  userId: string;
  showId: string;
  seats: string[];
  totalAmount: number;
  status: 'CONFIRMED' | 'PENDING' | 'CANCELLED';
  createdAt: string;
}
