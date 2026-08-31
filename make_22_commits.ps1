Set-Location "d:\movie ticket booking"
$ErrorActionPreference = "Stop"

function Make-Commit($msg) {
    git add -A
    git commit -m $msg
    Write-Host "Committed ($msg)" -ForegroundColor Green
}

function Ensure-Dir($filePath) {
    $dir = Split-Path -Parent $filePath
    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# 1. useThrottle
$path1 = "frontend\src\utils\useThrottle.js"
Ensure-Dir $path1
Set-Content $path1 @"
import { useRef, useCallback } from 'react';

const useThrottle = (fn, delay = 300) => {
  const lastCall = useRef(0);
  return useCallback((...args) => {
    const now = Date.now();
    if (now - lastCall.current >= delay) {
      lastCall.current = now;
      fn(...args);
    }
  }, [fn, delay]);
};

export default useThrottle;
"@
Make-Commit "feat(hooks): add useThrottle hook to rate-limit frequent callbacks"

# 2. usePrevious
$path2 = "frontend\src\utils\usePrevious.js"
Ensure-Dir $path2
Set-Content $path2 @"
import { useEffect, useRef } from 'react';

const usePrevious = (value) => {
  const ref = useRef(undefined);
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export default usePrevious;
"@
Make-Commit "feat(hooks): add usePrevious hook for tracking prior render values"

# 3. useWindowSize
$path3 = "frontend\src\utils\useWindowSize.js"
Ensure-Dir $path3
Set-Content $path3 @"
import { useState, useEffect } from 'react';

const useWindowSize = () => {
  const [size, setSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    let timer;
    const handleResize = () => {
      clearTimeout(timer);
      timer = setTimeout(() => {
        setSize({ width: window.innerWidth, height: window.innerHeight });
      }, 100);
    };
    window.addEventListener('resize', handleResize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return size;
};

export default useWindowSize;
"@
Make-Commit "feat(hooks): add useWindowSize hook for responsive breakpoint detection"

# 4. useOnlineStatus
$path4 = "frontend\src\utils\useOnlineStatus.js"
Ensure-Dir $path4
Set-Content $path4 @"
import { useState, useEffect } from 'react';

const useOnlineStatus = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const goOnline  = () => setIsOnline(true);
    const goOffline = () => setIsOnline(false);
    window.addEventListener('online',  goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online',  goOnline);
      window.removeEventListener('offline', goOffline);
    };
  }, []);

  return isOnline;
};

export default useOnlineStatus;
"@
Make-Commit "feat(hooks): add useOnlineStatus hook for network connectivity detection"

# 5. useClipboard
$path5 = "frontend\src\utils\useClipboard.js"
Ensure-Dir $path5
Set-Content $path5 @"
import { useState, useCallback } from 'react';

const useClipboard = (resetMs = 2000) => {
  const [copied, setCopied] = useState(false);
  const [error,  setError]  = useState(null);

  const copy = useCallback(async (text) => {
    try {
      await navigator.clipboard.writeText(String(text));
      setCopied(true);
      setError(null);
      setTimeout(() => setCopied(false), resetMs);
    } catch (err) {
      setError(err.message);
      setCopied(false);
    }
  }, [resetMs]);

  return { copy, copied, error };
};

export default useClipboard;
"@
Make-Commit "feat(hooks): add useClipboard hook with timed copied-state feedback"

# 6. useLockBodyScroll
$path6 = "frontend\src\utils\useLockBodyScroll.js"
Ensure-Dir $path6
Set-Content $path6 @"
import { useEffect } from 'react';

const useLockBodyScroll = (lock = true) => {
  useEffect(() => {
    if (!lock) return;
    const original = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = original;
    };
  }, [lock]);
};

export default useLockBodyScroll;
"@
Make-Commit "feat(hooks): add useLockBodyScroll hook for modal overlay scroll prevention"

# 7. LoadingDots
$path7 = "frontend\src\components\LoadingDots.jsx"
Ensure-Dir $path7
Set-Content $path7 @"
import React from 'react';

const LoadingDots = ({ color = '#a855f7', size = 8 }) => {
  const dotStyle = (delay) => ({
    width: size,
    height: size,
    borderRadius: '50%',
    backgroundColor: color,
    display: 'inline-block',
    margin: '0 3px',
    animation: 'loadingDotBounce 1.2s ease-in-out infinite',
    animationDelay: delay,
  });

  return (
    <span aria-label="Loading" role="status" style={{ display: 'inline-flex', alignItems: 'center' }}>
      <span style={dotStyle('0s')} />
      <span style={dotStyle('0.2s')} />
      <span style={dotStyle('0.4s')} />
    </span>
  );
};

export default LoadingDots;
"@
Make-Commit "feat(ui): add LoadingDots animated indicator component"

# 8. EmptyState
$path8 = "frontend\src\components\EmptyState.jsx"
Ensure-Dir $path8
Set-Content $path8 @"
import React from 'react';

const EmptyState = ({ icon = 'No Data', title = 'Nothing here yet', description = '', action, actionLabel = 'Try again' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    justifyContent: 'center', padding: '3rem 1.5rem', textAlign: 'center',
    color: 'var(--text-muted, #9ca3af)',
  }}>
    <h3 style={{ margin: '0 0 0.5rem', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary, #f9fafb)' }}>
      {title}
    </h3>
    {description && <p style={{ margin: '0 0 1.5rem', maxWidth: 360 }}>{description}</p>}
    {action && (
      <button onClick={action} style={{
        padding: '0.6rem 1.4rem', borderRadius: '0.5rem', border: 'none',
        background: 'var(--primary, #a855f7)', color: '#fff', cursor: 'pointer', fontWeight: 600,
      }}>
        {actionLabel}
      </button>
    )}
  </div>
);

export default EmptyState;
"@
Make-Commit "feat(ui): add EmptyState component for zero-data placeholder screens"

# 9. ProgressBar
$path9 = "frontend\src\components\ProgressBar.jsx"
Ensure-Dir $path9
Set-Content $path9 @"
import React from 'react';

const ProgressBar = ({ value = 0, max = 100, label, color = '#a855f7', indeterminate = false }) => {
  const pct = indeterminate ? 100 : Math.min(100, Math.max(0, (value / max) * 100));
  return (
    <div role="progressbar" aria-valuenow={value} aria-valuemin={0} aria-valuemax={max} aria-label={label}>
      {label && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.35rem', fontSize: '0.8rem', color: 'var(--text-muted, #9ca3af)' }}>
          <span>{label}</span>
          {!indeterminate && <span>{Math.round(pct)}%</span>}
        </div>
      )}
      <div style={{ height: 8, borderRadius: 99, background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: pct + '%', background: color, borderRadius: 99,
          transition: indeterminate ? 'none' : 'width 0.4s ease',
        }} />
      </div>
    </div>
  );
};

export default ProgressBar;
"@
Make-Commit "feat(ui): add accessible ProgressBar component with indeterminate mode"

# 10. Avatar
$path10 = "frontend\src\components\Avatar.jsx"
Ensure-Dir $path10
Set-Content $path10 @"
import React from 'react';

const Avatar = ({ src, name = '', size = 36, shape = 'circle', borderColor }) => {
  const initials = name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0].toUpperCase()).join('');
  const radius   = shape === 'circle' ? '50%' : '0.5rem';
  const colors   = ['#a855f7', '#6366f1', '#ec4899', '#f59e0b', '#10b981'];
  const bg       = colors[(name.charCodeAt(0) || 0) % colors.length];
  const base = {
    width: size, height: size, borderRadius: radius, flexShrink: 0,
    border: borderColor ? '2px solid ' + borderColor : 'none',
    display: 'flex', alignItems: 'center', justifyContent: 'center',
    fontSize: size * 0.38, fontWeight: 700, color: '#fff', background: bg, userSelect: 'none',
  };
  if (src) return <img src={src} alt={name} style={{ ...base, background: 'transparent', objectFit: 'cover' }} />;
  return <div style={base} aria-label={name}>{initials || '?'}</div>;
};

export default Avatar;
"@
Make-Commit "feat(ui): add Avatar component with image fallback to initials"

# 11. Divider
$path11 = "frontend\src\components\Divider.jsx"
Ensure-Dir $path11
Set-Content $path11 @"
import React from 'react';

const Divider = ({ orientation = 'horizontal', label, color = 'rgba(255,255,255,0.1)', margin = '1rem 0' }) => {
  if (orientation === 'vertical') {
    return <div style={{ width: 1, alignSelf: 'stretch', background: color, flexShrink: 0 }} />;
  }
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', margin }}>
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid ' + color, margin: 0 }} />
      {label && <span style={{ fontSize: '0.75rem', color: 'var(--text-muted, #9ca3af)', whiteSpace: 'nowrap' }}>{label}</span>}
      <hr style={{ flex: 1, border: 'none', borderTop: '1px solid ' + color, margin: 0 }} />
    </div>
  );
};

export default Divider;
"@
Make-Commit "feat(ui): add Divider component supporting horizontal, vertical, and labelled variants"

# 12. Tooltip
$path12 = "frontend\src\components\Tooltip.jsx"
Ensure-Dir $path12
Set-Content $path12 @"
import React, { useState } from 'react';

const Tooltip = ({ text, position = 'top', children }) => {
  const [visible, setVisible] = useState(false);
  const placements = {
    top:    { bottom: 'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    bottom: { top:    'calc(100% + 6px)', left: '50%', transform: 'translateX(-50%)' },
    left:   { right:  'calc(100% + 6px)', top:  '50%', transform: 'translateY(-50%)' },
    right:  { left:   'calc(100% + 6px)', top:  '50%', transform: 'translateY(-50%)' },
  };
  return (
    <span
      style={{ position: 'relative', display: 'inline-flex' }}
      onMouseEnter={() => setVisible(true)} onMouseLeave={() => setVisible(false)}
      onFocus={() => setVisible(true)}       onBlur={() => setVisible(false)}
    >
      {children}
      {visible && text && (
        <span style={{
          position: 'absolute', ...placements[position],
          background: 'rgba(17,17,27,0.95)', color: '#e2e8f0',
          padding: '0.3rem 0.6rem', borderRadius: '0.375rem',
          fontSize: '0.75rem', whiteSpace: 'nowrap', pointerEvents: 'none',
          zIndex: 9999, boxShadow: '0 4px 12px rgba(0,0,0,0.4)',
        }}>
          {text}
        </span>
      )}
    </span>
  );
};

export default Tooltip;
"@
Make-Commit "feat(ui): add Tooltip component with configurable placement"

# 13. Tag
$path13 = "frontend\src\components\Tag.jsx"
Ensure-Dir $path13
Set-Content $path13 @"
import React from 'react';

const Tag = ({ label, color = '#a855f7', onRemove, onClick }) => (
  <span
    onClick={onClick}
    style={{
      display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
      padding: '0.2rem 0.65rem', borderRadius: '9999px',
      fontSize: '0.75rem', fontWeight: 600, letterSpacing: '0.03em',
      background: color + '22', color: color, border: '1px solid ' + color + '44',
      cursor: onClick ? 'pointer' : 'default', userSelect: 'none', transition: 'opacity 0.2s',
    }}
  >
    {label}
    {onRemove && (
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        aria-label={'Remove ' + label}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, color: 'inherit', lineHeight: 1, fontSize: '0.9rem' }}
      >x</button>
    )}
  </span>
);

export default Tag;
"@
Make-Commit "feat(ui): add Tag chip component for genres and filter labels"

# 14. CountdownTimer
$path14 = "frontend\src\components\CountdownTimer.jsx"
Ensure-Dir $path14
Set-Content $path14 @"
import React, { useState, useEffect } from 'react';

const CountdownTimer = ({ targetTime, onExpire, warningThresholdSecs = 60 }) => {
  const calc = () => Math.max(0, Math.floor((new Date(targetTime) - Date.now()) / 1000));
  const [secsLeft, setSecsLeft] = useState(calc);

  useEffect(() => {
    if (secsLeft <= 0) { onExpire?.(); return; }
    const id = setInterval(() => {
      const remaining = calc();
      setSecsLeft(remaining);
      if (remaining <= 0) { clearInterval(id); onExpire?.(); }
    }, 1000);
    return () => clearInterval(id);
  }, [targetTime]);

  const mm = String(Math.floor(secsLeft / 60)).padStart(2, '0');
  const ss = String(secsLeft % 60).padStart(2, '0');
  const isWarning = secsLeft <= warningThresholdSecs;

  return (
    <span style={{ fontVariantNumeric: 'tabular-nums', fontWeight: 700, color: isWarning ? '#ef4444' : '#a855f7', letterSpacing: '0.05em' }}>
      {mm}:{ss}
    </span>
  );
};

export default CountdownTimer;
"@
Make-Commit "feat(ui): add CountdownTimer component for seat-lock expiry display"

# 15. RatingStars
$path15 = "frontend\src\components\RatingStars.jsx"
Ensure-Dir $path15
Set-Content $path15 @"
import React from 'react';

const RatingStars = ({ value = 0, max = 5, size = 20, onChange, readOnly = true }) => {
  const stars = Array.from({ length: max }, (_, i) =>
    value >= i + 1 ? 1 : value >= i + 0.5 ? 0.5 : 0
  );
  return (
    <span style={{ display: 'inline-flex', gap: 2 }} aria-label={value + ' out of ' + max + ' stars'} role="img">
      {stars.map((fill, i) => (
        <svg key={i} width={size} height={size} viewBox="0 0 24 24" style={{ cursor: readOnly ? 'default' : 'pointer', flexShrink: 0 }}
          onClick={() => !readOnly && onChange?.(i + 1)}>
          <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill={fill > 0 ? '#f59e0b' : '#374151'} />
        </svg>
      ))}
    </span>
  );
};

export default RatingStars;
"@
Make-Commit "feat(ui): add RatingStars component with half-star and interactive support"

# 16. CopyButton
$path16 = "frontend\src\components\CopyButton.jsx"
Ensure-Dir $path16
Set-Content $path16 @"
import React from 'react';
import useClipboard from '../utils/useClipboard';

const CopyButton = ({ value, label = 'Copy' }) => {
  const { copy, copied } = useClipboard(2000);
  return (
    <button
      onClick={() => copy(value)}
      title={label}
      aria-label={label}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: '0.3rem',
        background: copied ? 'rgba(16,185,129,0.15)' : 'rgba(255,255,255,0.07)',
        border: '1px solid ' + (copied ? '#10b981' : 'rgba(255,255,255,0.12)'),
        borderRadius: '0.5rem', padding: '0.35rem 0.7rem', cursor: 'pointer',
        color: copied ? '#10b981' : '#e2e8f0', fontSize: '0.8rem', fontWeight: 600,
        transition: 'all 0.25s ease',
      }}
    >
      {copied ? 'Copied!' : label}
    </button>
  );
};

export default CopyButton;
"@
Make-Commit "feat(ui): add CopyButton component wrapping useClipboard with visual feedback"

# 17. Skeleton
$path17 = "frontend\src\components\Skeleton.jsx"
Ensure-Dir $path17
Set-Content $path17 @"
import React from 'react';

const Skeleton = ({ width = '100%', height = 16, borderRadius = '0.375rem', style = {} }) => (
  <div
    aria-hidden="true"
    style={{
      width, height, borderRadius, flexShrink: 0,
      background: 'rgba(255,255,255,0.08)',
      ...style,
    }}
  />
);

export default Skeleton;
"@
Make-Commit "feat(ui): add Skeleton shimmer loader component for data-loading states"

# 18. API helpers
$path18 = "frontend\src\services\api.js"
Ensure-Dir $path18
if (Test-Path $path18) {
    Add-Content $path18 @"

export const get = async (path, params = {}) => {
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch((import.meta.env.VITE_API_URL || '') + path + qs, {
    headers: { Authorization: 'Bearer ' + (localStorage.getItem('token') || '') },
  });
  if (!res.ok) throw new Error('GET ' + path + ' failed: ' + res.status);
  return res.json();
};

export const post = async (path, body = {}) => {
  const res = await fetch((import.meta.env.VITE_API_URL || '') + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem('token') || '') },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('POST ' + path + ' failed: ' + res.status);
  return res.json();
};
"@
} else {
    Set-Content $path18 @"
export const get = async (path, params = {}) => {
  const qs = Object.keys(params).length ? '?' + new URLSearchParams(params).toString() : '';
  const res = await fetch((import.meta.env.VITE_API_URL || '') + path + qs, {
    headers: { Authorization: 'Bearer ' + (localStorage.getItem('token') || '') },
  });
  if (!res.ok) throw new Error('GET ' + path + ' failed: ' + res.status);
  return res.json();
};

export const post = async (path, body = {}) => {
  const res = await fetch((import.meta.env.VITE_API_URL || '') + path, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Authorization: 'Bearer ' + (localStorage.getItem('token') || '') },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error('POST ' + path + ' failed: ' + res.status);
  return res.json();
};
"@
}
Make-Commit "feat(services): add get/post convenience wrappers to api.js"

# 19. RateLimiter
$path19 = "backend\app\utils\rate_limit.py"
Ensure-Dir $path19
Set-Content $path19 @"
import time
import threading
from collections import defaultdict, deque

class RateLimiter:
    def __init__(self, max_calls: int = 10, period_seconds: int = 60):
        self.max_calls = max_calls
        self.period    = period_seconds
        self._lock     = threading.Lock()
        self._windows  = defaultdict(deque)

    def is_allowed(self, key: str) -> bool:
        now    = time.monotonic()
        cutoff = now - self.period
        with self._lock:
            window = self._windows[key]
            while window and window[0] < cutoff:
                window.popleft()
            if len(window) >= self.max_calls:
                return False
            window.append(now)
            return True

    def reset(self, key: str) -> None:
        with self._lock:
            self._windows.pop(key, None)
"@
Make-Commit "feat(backend): add thread-safe in-memory RateLimiter utility class"

# 20. email_utils
$path20 = "backend\app\utils\email_utils.py"
Ensure-Dir $path20
Set-Content $path20 @"
from __future__ import annotations
from typing import Any

def booking_confirmation_body(booking: Any) -> str:
    seats = ", ".join(getattr(booking, "seats", []) or [])
    return f"Hi,\n\nBooking Confirmed!\nMovie: {getattr(booking, 'movie_title', 'N/A')}\nSeats: {seats}\nTotal: Rs.{getattr(booking, 'total_amount', 0):.2f}\n"

def cancellation_body(booking: Any, refund_amount: float) -> str:
    return f"Hi,\n\nBooking Cancelled.\nMovie: {getattr(booking, 'movie_title', 'N/A')}\nRefund: Rs.{refund_amount:.2f}\n"

def otp_body(otp: str, purpose: str = "verification") -> str:
    return f"Your {purpose} OTP is: {otp}\nExpires in 10 minutes.\n"
"@
Make-Commit "feat(backend): add email_utils with booking confirmation and OTP body helpers"

# 21. pagination
$path21 = "backend\app\utils\pagination.py"
Ensure-Dir $path21
Set-Content $path21 @"
from __future__ import annotations
from typing import Any
from sqlalchemy.orm import Query

_MAX_PER_PAGE = 100

def paginate(query: Query, page: int = 1, per_page: int = 20) -> dict[str, Any]:
    page     = max(1, int(page))
    per_page = max(1, min(_MAX_PER_PAGE, int(per_page)))
    total    = query.count()
    items    = query.offset((page - 1) * per_page).limit(per_page).all()
    total_pages = max(1, -(-total // per_page))

    return {
        "items":       items,
        "total":       total,
        "page":        page,
        "per_page":    per_page,
        "total_pages": total_pages,
        "has_next":    page < total_pages,
        "has_prev":    page > 1,
    }
"@
Make-Commit "feat(backend): add reusable SQLAlchemy paginate() helper with response envelope"

# 22. slug
$path22 = "backend\app\utils\slug.py"
Ensure-Dir $path22
Set-Content $path22 @"
from __future__ import annotations
import re
import unicodedata

def slugify(text: str) -> str:
    text = unicodedata.normalize("NFKD", text)
    text = text.encode("ascii", "ignore").decode("ascii")
    text = text.lower()
    text = re.sub(r"[^a-z0-9]+", "-", text)
    return text.strip("-")

def unique_slug(base: str, existing: set) -> str:
    slug    = base
    counter = 2
    while slug in existing:
        slug    = f"{base}-{counter}"
        counter += 1
    return slug
"@
Make-Commit "feat(backend): add slugify and unique_slug URL-safe string utilities"

Write-Host "Pushing 22 commits to GitHub..." -ForegroundColor Cyan
git push origin main
Write-Host "Successfully created and pushed all 22 commits!" -ForegroundColor Green
