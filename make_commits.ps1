
# Script to make 3 small meaningful commits and push to GitHub
Set-Location "d:\movie ticket booking"
$ErrorActionPreference = "Stop"

function Make-Commit {
    param([string]$message)
    git add -A
    git commit -m $message
    Write-Host "Committed: $message" -ForegroundColor Green
}

# ─────────────────────────────────────────────────
# COMMIT 1 — Add useSessionStorage hook
# ─────────────────────────────────────────────────
$sessionHook = @"
import { useState } from 'react';

/**
 * useSessionStorage — syncs a React state value with sessionStorage automatically.
 * Falls back to `initialValue` if the key does not exist or parsing fails.
 * Unlike useLocalStorage, data is cleared when the browser tab is closed.
 *
 * @param {string} key - The sessionStorage key to read/write.
 * @param {*} initialValue - Default value when key is absent.
 * @returns {[*, Function]} A stateful value and a setter function.
 *
 * @example
 * const [step, setStep] = useSessionStorage('booking_step', 1);
 */
const useSessionStorage = (key, initialValue) => {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      const item = window.sessionStorage.getItem(key);
      return item ? JSON.parse(item) : initialValue;
    } catch {
      return initialValue;
    }
  });

  const setValue = (value) => {
    try {
      const valueToStore = value instanceof Function ? value(storedValue) : value;
      setStoredValue(valueToStore);
      window.sessionStorage.setItem(key, JSON.stringify(valueToStore));
    } catch (err) {
      console.error(`useSessionStorage: failed to set key "${key}"`, err);
    }
  };

  const removeValue = () => {
    try {
      setStoredValue(initialValue);
      window.sessionStorage.removeItem(key);
    } catch (err) {
      console.error(`useSessionStorage: failed to remove key "${key}"`, err);
    }
  };

  return [storedValue, setValue, removeValue];
};

export default useSessionStorage;
"@
Set-Content "frontend\src\utils\useSessionStorage.js" $sessionHook
Make-Commit "feat(hooks): add useSessionStorage hook mirroring useLocalStorage API"

# ─────────────────────────────────────────────────
# COMMIT 2 — Add getRelativeTime and formatDateLong to formatters.js
# ─────────────────────────────────────────────────
$newFormatters = @"

/**
 * Returns a relative time string (e.g. "2 hours ago", "just now").
 * @param {string|Date} date - The date to compare against current time.
 * @returns {string} Human-friendly relative time label.
 */
export const getRelativeTime = (date) => {
  if (!date) return '';
  const now = new Date();
  const target = new Date(date);
  const diffMs = now - target;
  const diffSecs = Math.floor(diffMs / 1000);
  const diffMins = Math.floor(diffSecs / 60);
  const diffHrs = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHrs / 24);

  if (diffSecs < 60) return 'just now';
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
  if (diffHrs < 24) return `${diffHrs} hour${diffHrs > 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
  return formatDate(date);
};

/**
 * Formats a date into a long-form string (e.g. "Saturday, 29 August 2026").
 * @param {string|Date} date - The date to format.
 * @returns {string} Long formatted date string.
 */
export const formatDateLong = (date) => {
  if (!date) return '';
  return new Intl.DateTimeFormat('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(new Date(date));
};
"@
Add-Content "frontend\src\utils\formatters.js" $newFormatters
Make-Commit "feat(utils): add getRelativeTime and formatDateLong formatter functions"

# ─────────────────────────────────────────────────
# COMMIT 3 — Add ANIMATION_DURATION and APP_NAME constants
# ─────────────────────────────────────────────────
$newConstants = @"

/** Application display name used across UI and meta tags */
export const APP_NAME = 'BookTicket';

/** Application tagline */
export const APP_TAGLINE = 'Your Premium Movie Booking Experience';

/** Standard CSS transition durations (in ms) for UI animations */
export const ANIMATION_DURATION = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
};

/** Seat lock expiry warning threshold in seconds */
export const SEAT_LOCK_WARNING_SECS = 60;

/** Maximum allowed voucher code length */
export const MAX_VOUCHER_CODE_LENGTH = 20;

/** Snackbar / toast auto-dismiss duration in milliseconds */
export const TOAST_DURATION_MS = 3500;
"@
Add-Content "frontend\src\utils\constants.js" $newConstants
Make-Commit "feat(constants): add APP_NAME, ANIMATION_DURATION, and UI utility constants"

# ─────────────────────────────────────────────────
# PUSH
# ─────────────────────────────────────────────────
Write-Host "`nPushing 3 commits to GitHub..." -ForegroundColor Cyan
git push origin main
Write-Host "Done! All 3 commits pushed." -ForegroundColor Green
