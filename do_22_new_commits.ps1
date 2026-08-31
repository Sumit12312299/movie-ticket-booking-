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

# 1. appConstants.js
$p1 = "frontend\src\constants\appConstants.js"
Ensure-Dir $p1
Set-Content $p1 @"
export const APP_NAME = 'CineTicket';
export const APP_VERSION = '1.2.0';
export const DEFAULT_CURRENCY = 'INR';
export const SUPPORTED_LANGUAGES = ['English', 'Hindi', 'Tamil', 'Telugu', 'Kannada', 'Malayalam'];
export const BOOKING_LOCK_TIME_MINS = 10;
"@
Make-Commit "feat(config): define application brand constants and app metadata"

# 2. mathUtils.js
$p2 = "frontend\src\utils\mathUtils.js"
Ensure-Dir $p2
Set-Content $p2 @"
export const formatCurrency = (amount, currency = 'INR', locale = 'en-IN') => {
  return new Intl.NumberFormat(locale, { style: 'currency', currency, maximumFractionDigits: 2 }).format(amount);
};

export const calculateDiscount = (price, percentage) => {
  if (!price || !percentage) return price;
  return Math.max(0, price - (price * (percentage / 100)));
};
"@
Make-Commit "feat(utils): add math utility functions for currency formatting and discount calculations"

# 3. stringUtils.js
$p3 = "frontend\src\utils\stringUtils.js"
Ensure-Dir $p3
Set-Content $p3 @"
export const truncateText = (str, maxLength = 50, ellipsis = '...') => {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - ellipsis.length) + ellipsis;
};

export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};
"@
Make-Commit "feat(utils): add string utilities for text truncation and title capitalization"

# 4. dateUtils.js
$p4 = "frontend\src\utils\dateUtils.js"
Ensure-Dir $p4
Set-Content $p4 @"
export const formatDuration = (minutes) => {
  if (!minutes || minutes <= 0) return '0m';
  const hrs = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return hrs > 0 ? `${hrs}h ${mins}m` : `${mins}m`;
};

export const isToday = (dateStr) => {
  const d = new Date(dateStr);
  const today = new Date();
  return d.toDateString() === today.toDateString();
};
"@
Make-Commit "feat(utils): add date formatting and showtime duration calculation helpers"

# 5. validationUtils.js
$p5 = "frontend\src\utils\validationUtils.js"
Ensure-Dir $p5
Set-Content $p5 @"
export const isValidEmail = (email) => {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
};

export const isValidPhone = (phone) => {
  const re = /^[6-9]\d{9}$/;
  return re.test(String(phone));
};
"@
Make-Commit "feat(utils): add form input validators for email address and phone numbers"

# 6. storageUtils.js
$p6 = "frontend\src\utils\storageUtils.js"
Ensure-Dir $p6
Set-Content $p6 @"
export const safeGetItem = (key, fallback = null) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch {
    return fallback;
  }
};

export const safeSetItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
};
"@
Make-Commit "feat(utils): add safe localStorage helper functions with JSON error handling"

# 7. logger.js
$p7 = "frontend\src\utils\logger.js"
Ensure-Dir $p7
Set-Content $p7 @"
const isDev = process.env.NODE_ENV !== 'production';

export const logger = {
  log: (...args) => { if (isDev) console.log('[LOG]', ...args); },
  warn: (...args) => { if (isDev) console.warn('[WARN]', ...args); },
  error: (...args) => { console.error('[ERROR]', ...args); },
};

export default logger;
"@
Make-Commit "feat(utils): add conditional environment logger utility for browser debugging"

# 8. Badge.jsx
$p8 = "frontend\src\components\Badge.jsx"
Ensure-Dir $p8
Set-Content $p8 @"
import React from 'react';

const Badge = ({ children, variant = 'primary', size = 'medium' }) => {
  const variants = {
    primary: { bg: 'rgba(168, 85, 247, 0.15)', color: '#a855f7', border: '1px solid rgba(168, 85, 247, 0.3)' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', color: '#10b981', border: '1px solid rgba(16, 185, 129, 0.3)' },
    warning: { bg: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b', border: '1px solid rgba(245, 158, 11, 0.3)' },
    danger:  { bg: 'rgba(239, 68, 68, 0.15)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.3)' },
  };
  const style = variants[variant] || variants.primary;

  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', padding: size === 'small' ? '0.15rem 0.4rem' : '0.25rem 0.6rem',
      borderRadius: '9999px', fontSize: size === 'small' ? '0.7rem' : '0.8rem', fontWeight: 600,
      background: style.bg, color: style.color, border: style.border,
    }}>
      {children}
    </span>
  );
};

export default Badge;
"@
Make-Commit "feat(ui): add Badge status tag component with variant color themes"

# 9. Breadcrumb.jsx
$p9 = "frontend\src\components\Breadcrumb.jsx"
Ensure-Dir $p9
Set-Content $p9 @"
import React from 'react';

const Breadcrumb = ({ items = [] }) => {
  return (
    <nav aria-label="Breadcrumb" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.875rem', color: '#9ca3af' }}>
      {items.map((item, idx) => (
        <React.Fragment key={idx}>
          {idx > 0 && <span>/</span>}
          {item.link ? (
            <a href={item.link} style={{ color: '#a855f7', textDecoration: 'none' }}>{item.label}</a>
          ) : (
            <span style={{ color: '#f3f4f6', fontWeight: 500 }}>{item.label}</span>
          )}
        </React.Fragment>
      ))}
    </nav>
  );
};

export default Breadcrumb;
"@
Make-Commit "feat(ui): add accessible Breadcrumb navigation component"

# 10. Card.jsx
$p10 = "frontend\src\components\Card.jsx"
Ensure-Dir $p10
Set-Content $p10 @"
import React from 'react';

const Card = ({ children, title, subtitle, style = {} }) => {
  return (
    <div style={{
      background: '#1f2937', border: '1px solid #374151', borderRadius: '0.75rem', padding: '1.25rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', ...style
    }}>
      {(title || subtitle) && (
        <div style={{ marginBottom: '1rem' }}>
          {title && <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: 600, color: '#f9fafb' }}>{title}</h3>}
          {subtitle && <p style={{ margin: '0.25rem 0 0', fontSize: '0.875rem', color: '#9ca3af' }}>{subtitle}</p>}
        </div>
      )}
      {children}
    </div>
  );
};

export default Card;
"@
Make-Commit "feat(ui): add flexible Card container component with title and subtitle header"

# 11. ModalHeader.jsx
$p11 = "frontend\src\components\ModalHeader.jsx"
Ensure-Dir $p11
Set-Content $p11 @"
import React from 'react';

const ModalHeader = ({ title, onClose }) => {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingBottom: '1rem',
      borderBottom: '1px solid #374151', marginBottom: '1rem'
    }}>
      <h2 style={{ margin: 0, fontSize: '1.25rem', fontWeight: 600, color: '#f3f4f6' }}>{title}</h2>
      {onClose && (
        <button onClick={onClose} aria-label="Close modal" style={{
          background: 'none', border: 'none', color: '#9ca3af', fontSize: '1.5rem', cursor: 'pointer', lineHeight: 1
        }}>&times;</button>
      )}
    </div>
  );
};

export default ModalHeader;
"@
Make-Commit "feat(ui): add ModalHeader component with integrated close action button"

# 12. Accordion.jsx
$p12 = "frontend\src\components\Accordion.jsx"
Ensure-Dir $p12
Set-Content $p12 @"
import React, { useState } from 'react';

const Accordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div style={{ border: '1px solid #374151', borderRadius: '0.5rem', marginBottom: '0.5rem', overflow: 'hidden' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        padding: '0.875rem 1rem', background: '#1f2937', color: '#f9fafb', border: 'none', cursor: 'pointer', fontWeight: 600
      }}>
        <span>{title}</span>
        <span>{isOpen ? '▲' : '▼'}</span>
      </button>
      {isOpen && (
        <div style={{ padding: '1rem', background: '#111827', color: '#d1d5db', fontSize: '0.9rem' }}>
          {children}
        </div>
      )}
    </div>
  );
};

export default Accordion;
"@
Make-Commit "feat(ui): add collapsible Accordion component for FAQs and collapsible panels"

# 13. AlertBanner.jsx
$p13 = "frontend\src\components\AlertBanner.jsx"
Ensure-Dir $p13
Set-Content $p13 @"
import React from 'react';

const AlertBanner = ({ message, type = 'info', onClose }) => {
  const colors = {
    info: { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#60a5fa' },
    success: { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#34d399' },
    error: { bg: 'rgba(239, 68, 68, 0.15)', border: '#ef4444', text: '#f87171' },
  };
  const theme = colors[type] || colors.info;

  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.75rem 1rem',
      borderRadius: '0.5rem', background: theme.bg, borderLeft: `4px solid ${theme.border}`, color: theme.text, marginBottom: '1rem'
    }}>
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: 'inherit', cursor: 'pointer', fontWeight: 700 }}>&times;</button>
      )}
    </div>
  );
};

export default AlertBanner;
"@
Make-Commit "feat(ui): add AlertBanner component for contextual user notifications"

# 14. DropdownMenu.jsx
$p14 = "frontend\src\components\DropdownMenu.jsx"
Ensure-Dir $p14
Set-Content $p14 @"
import React, { useState } from 'react';

const DropdownMenu = ({ triggerLabel, items = [] }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div style={{ position: 'relative', display: 'inline-block' }}>
      <button onClick={() => setIsOpen(!isOpen)} style={{
        padding: '0.5rem 1rem', borderRadius: '0.375rem', background: '#374151', color: '#fff', border: 'none', cursor: 'pointer'
      }}>
        {triggerLabel} ▾
      </button>
      {isOpen && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, marginTop: '0.25rem', background: '#1f2937',
          border: '1px solid #374151', borderRadius: '0.375rem', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.3)', zIndex: 1000, minWidth: '150px'
        }}>
          {items.map((item, i) => (
            <div key={i} onClick={() => { item.onClick?.(); setIsOpen(false); }} style={{
              padding: '0.5rem 1rem', color: '#e5e7eb', cursor: 'pointer', fontSize: '0.875rem'
            }}>
              {item.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DropdownMenu;
"@
Make-Commit "feat(ui): add interactive DropdownMenu popover component"

# 15. SearchInput.jsx
$p15 = "frontend\src\components\SearchInput.jsx"
Ensure-Dir $p15
Set-Content $p15 @"
import React from 'react';

const SearchInput = ({ value, onChange, placeholder = 'Search movies, theaters...' }) => {
  return (
    <div style={{ position: 'relative', width: '100%' }}>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        placeholder={placeholder}
        style={{
          width: '100%', padding: '0.6rem 1rem 0.6rem 2.2rem', borderRadius: '0.5rem',
          background: '#1f2937', border: '1px solid #374151', color: '#f3f4f6', fontSize: '0.9rem'
        }}
      />
      <span style={{ position: 'absolute', left: '0.75rem', top: '50%', transform: 'translateY(-50%)', color: '#9ca3af' }}>🔍</span>
    </div>
  );
};

export default SearchInput;
"@
Make-Commit "feat(ui): add SearchInput component with embedded search icon"

# 16. ChipGroup.jsx
$p16 = "frontend\src\components\ChipGroup.jsx"
Ensure-Dir $p16
Set-Content $p16 @"
import React from 'react';

const ChipGroup = ({ options = [], selected = [], onToggle }) => {
  return (
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
      {options.map((opt) => {
        const isSelected = selected.includes(opt.value || opt);
        return (
          <button
            key={opt.value || opt}
            onClick={() => onToggle?.(opt.value || opt)}
            style={{
              padding: '0.35rem 0.8rem', borderRadius: '9999px', fontSize: '0.8rem', fontWeight: 500,
              background: isSelected ? '#a855f7' : '#374151', color: '#ffffff', border: 'none', cursor: 'pointer', transition: 'all 0.2s'
            }}
          >
            {opt.label || opt}
          </button>
        );
      })}
    </div>
  );
};

export default ChipGroup;
"@
Make-Commit "feat(ui): add ChipGroup component for multi-select filter tags"

# 17. crypto_utils.py
$p17 = "backend\app\utils\crypto_utils.py"
Ensure-Dir $p17
Set-Content $p17 @"
import secrets
import hashlib

def generate_random_token(length: int = 32) -> str:
    return secrets.token_hex(length)

def hash_string(data: str) -> str:
    return hashlib.sha256(data.encode('utf-8')).hexdigest()
"@
Make-Commit "feat(backend): add token generation and hashing crypto utility functions"

# 18. response_utils.py
$p18 = "backend\app\utils\response_utils.py"
Ensure-Dir $p18
Set-Content $p18 @"
from typing import Any, Optional

def success_response(data: Any = None, message: str = "Success", code: int = 200) -> dict:
    return {
        "status": "success",
        "code": code,
        "message": message,
        "data": data
    }

def error_response(message: str = "An error occurred", code: int = 400, details: Optional[Any] = None) -> dict:
    return {
        "status": "error",
        "code": code,
        "message": message,
        "details": details
    }
"@
Make-Commit "feat(backend): add standard API JSON response envelope functions"

# 19. sanitizer.py
$p19 = "backend\app\utils\sanitizer.py"
Ensure-Dir $p19
Set-Content $p19 @"
import html

def sanitize_input(text: str) -> str:
    if not text:
        return ""
    return html.escape(text.strip())
"@
Make-Commit "feat(backend): add HTML string input sanitization helper function"

# 20. geo_utils.py
$p20 = "backend\app\utils\geo_utils.py"
Ensure-Dir $p20
Set-Content $p20 @"
import math

def calculate_haversine_distance(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371.0  # Earth radius in kilometers
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = math.sin(dlat / 2)**2 + math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * math.sin(dlon / 2)**2
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1 - a))
    return R * c
"@
Make-Commit "feat(backend): add haversine distance formula utility for theater proximity lookup"

# 21. cache_utils.py
$p21 = "backend\app\utils\cache_utils.py"
Ensure-Dir $p21
Set-Content $p21 @"
import time
from typing import Any, Optional

class SimpleTTLCache:
    def __init__(self, default_ttl: int = 300):
        self.default_ttl = default_ttl
        self._cache = {}

    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> None:
        expiry = time.time() + (ttl if ttl is not None else self.default_ttl)
        self._cache[key] = (value, expiry)

    def get(self, key: str) -> Optional[Any]:
        if key not in self._cache:
            return None
        value, expiry = self._cache[key]
        if time.time() > expiry:
            del self._cache[key]
            return None
        return value
"@
Make-Commit "feat(backend): add in-memory key-value cache class with automatic TTL expiration"

# 22. API_DOCUMENTATION.md
$p22 = "docs\API_DOCUMENTATION.md"
Ensure-Dir $p22
Set-Content $p22 @"
# CineTicket REST API Specification

## Base URL
`/api/v1`

## Endpoints Summary

### Auth
- `POST /auth/login` - User login
- `POST /auth/register` - User registration

### Movies
- `GET /movies` - List all active movies
- `GET /movies/:id` - Get movie details

### Bookings
- `POST /bookings` - Create new ticket booking
- `GET /bookings/user` - Retrieve user booking history
"@
Make-Commit "docs(api): add REST API endpoint summary documentation"

Write-Host "Pushing 22 fresh commits to GitHub..." -ForegroundColor Cyan
git push origin main
Write-Host "Successfully generated and pushed 22 commits!" -ForegroundColor Green
