export const SEAT_TIERS = {
  STANDARD: {
    label: 'Standard',
    code: 'STANDARD',
    color: '#3B82F6',
    multiplier: 1.0,
  },
  PREMIUM: {
    label: 'Premium',
    code: 'PREMIUM',
    color: '#8B5CF6',
    multiplier: 1.35,
  },
  RECLINER: {
    label: 'VIP Recliner',
    code: 'RECLINER',
    color: '#F59E0B',
    multiplier: 1.8,
  },
};

export const SCREEN_FORMATS = [
  { id: '2D', label: '2D Standard' },
  { id: '3D', label: 'RealD 3D' },
  { id: 'IMAX', label: 'IMAX 3D Laser' },
  { id: '4DX', label: '4DX Dynamic' },
  { id: 'DOLBY', label: 'Dolby Atmos Cinema' },
];

export const MAX_SEATS_PER_TRANSACTION = 8;
export const SEAT_HOLD_DURATION_MINUTES = 10;
