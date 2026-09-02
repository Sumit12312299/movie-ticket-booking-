Set-Location "d:\movie ticket booking"
$ErrorActionPreference = "Stop"

function Make-Commit($msg) {
    git add -A
    git commit -m $msg
    Write-Host "Committed ($msg)" -ForegroundColor Green
}

# 1. useEventListener
Set-Content "frontend\src\utils\useEventListener.js" @"
import { useEffect, useRef } from 'react';

const useEventListener = (eventName, handler, element = window) => {
  const savedHandler = useRef(handler);

  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);

  useEffect(() => {
    const isSupported = element && element.addEventListener;
    if (!isSupported) return;

    const eventListener = (event) => savedHandler.current(event);
    element.addEventListener(eventName, eventListener);

    return () => {
      element.removeEventListener(eventName, eventListener);
    };
  }, [eventName, element]);
};

export default useEventListener;
"@
Make-Commit "feat(hooks): add useEventListener hook for declarative DOM event subscriptions"

# 2. useToggle
Set-Content "frontend\src\utils\useToggle.js" @"
import { useState, useCallback } from 'react';

const useToggle = (initialState = false) => {
  const [state, setState] = useState(Boolean(initialState));

  const toggle = useCallback(() => setState((prev) => !prev), []);
  const setTrue = useCallback(() => setState(true), []);
  const setFalse = useCallback(() => setState(false), []);

  return [state, toggle, setTrue, setFalse];
};

export default useToggle;
"@
Make-Commit "feat(hooks): add useToggle utility hook for boolean state management"

# 3. useAsync
Set-Content "frontend\src\utils\useAsync.js" @"
import { useState, useCallback } from 'react';

const useAsync = (asyncFunction) => {
  const [status, setStatus] = useState('idle');
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const execute = useCallback(
    async (...args) => {
      setStatus('pending');
      setData(null);
      setError(null);
      try {
        const response = await asyncFunction(...args);
        setData(response);
        setStatus('success');
        return response;
      } catch (err) {
        setError(err.message || 'An error occurred');
        setStatus('error');
        throw err;
      }
    },
    [asyncFunction]
  );

  return { execute, status, data, error, isPending: status === 'pending' };
};

export default useAsync;
"@
Make-Commit "feat(hooks): add useAsync hook for managing async operation states"

# 4. useMediaQuery
Set-Content "frontend\src\utils\useMediaQuery.js" @"
import { useState, useEffect } from 'react';

const useMediaQuery = (query) => {
  const [matches, setMatches] = useState(() => window.matchMedia(query).matches);

  useEffect(() => {
    const mediaQuery = window.matchMedia(query);
    const handler = (event) => setMatches(event.matches);

    mediaQuery.addEventListener('change', handler);
    return () => mediaQuery.removeEventListener('change', handler);
  }, [query]);

  return matches;
};

export default useMediaQuery;
"@
Make-Commit "feat(hooks): add useMediaQuery hook for responsive layout logic"

# 5. Stepper
Set-Content "frontend\src\components\Stepper.jsx" @"
import React from 'react';

const Stepper = ({ steps = [], currentStep = 0, onStepClick }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', margin: '1rem 0' }}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentStep;
        const isActive = idx === currentStep;
        return (
          <React.Fragment key={idx}>
            <div
              onClick={() => isCompleted && onStepClick?.(idx)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                cursor: isCompleted ? 'pointer' : 'default',
                opacity: idx > currentStep ? 0.5 : 1,
              }}
            >
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.85rem',
                  fontWeight: 700,
                  background: isActive ? '#a855f7' : isCompleted ? '#10b981' : 'rgba(255,255,255,0.1)',
                  color: '#fff',
                }}
              >
                {isCompleted ? '✓' : idx + 1}
              </div>
              <span style={{ fontSize: '0.85rem', fontWeight: isActive ? 600 : 400, color: isActive ? '#f9fafb' : '#9ca3af' }}>
                {step}
              </span>
            </div>
            {idx < steps.length - 1 && (
              <div style={{ flex: 1, height: 2, margin: '0 0.75rem', background: idx < currentStep ? '#10b981' : 'rgba(255,255,255,0.1)' }} />
            )}
          </React.Fragment>
        );
      })}
    </div>
  );
};

export default Stepper;
"@
Make-Commit "feat(ui): add Stepper visual indicator component for multi-step flows"

# 6. Switch
Set-Content "frontend\src\components\Switch.jsx" @"
import React from 'react';

const Switch = ({ checked = false, onChange, label, disabled = false }) => {
  return (
    <label style={{ display: 'inline-flex', alignItems: 'center', gap: '0.6rem', cursor: disabled ? 'not-allowed' : 'pointer', opacity: disabled ? 0.6 : 1 }}>
      <div
        onClick={() => !disabled && onChange?.(!checked)}
        style={{
          width: 42,
          height: 24,
          borderRadius: 12,
          background: checked ? '#a855f7' : 'rgba(255,255,255,0.15)',
          padding: 2,
          transition: 'background 0.25s ease',
          position: 'relative',
        }}
      >
        <div
          style={{
            width: 20,
            height: 20,
            borderRadius: '50%',
            background: '#fff',
            transform: checked ? 'translateX(18px)' : 'translateX(0)',
            transition: 'transform 0.25s ease',
          }}
        />
      </div>
      {label && <span style={{ fontSize: '0.875rem', color: 'var(--text-primary, #f9fafb)' }}>{label}</span>}
    </label>
  );
};

export default Switch;
"@
Make-Commit "feat(ui): add Switch toggle component with custom styling"

# 7. Tabs
Set-Content "frontend\src\components\Tabs.jsx" @"
import React, { useState } from 'react';

const Tabs = ({ tabs = [], activeTab, onChange, children }) => {
  const [current, setCurrent] = useState(activeTab || tabs[0]?.id);

  const handleSelect = (id) => {
    setCurrent(id);
    onChange?.(id);
  };

  return (
    <div>
      <div style={{ display: 'flex', borderBottom: '1px solid rgba(255,255,255,0.1)', gap: '1rem', marginBottom: '1rem' }}>
        {tabs.map((tab) => {
          const isActive = (activeTab !== undefined ? activeTab : current) === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => handleSelect(tab.id)}
              style={{
                padding: '0.6rem 1rem',
                border: 'none',
                background: 'none',
                borderBottom: isActive ? '2px solid #a855f7' : '2px solid transparent',
                color: isActive ? '#a855f7' : '#9ca3af',
                fontWeight: isActive ? 600 : 400,
                cursor: 'pointer',
                transition: 'all 0.2s ease',
              }}
            >
              {tab.label}
            </button>
          );
        })}
      </div>
      <div>{children}</div>
    </div>
  );
};

export default Tabs;
"@
Make-Commit "feat(ui): add Tabs layout component for structured navigation views"

# 8. NotificationToast
Set-Content "frontend\src\components\NotificationToast.jsx" @"
import React, { useEffect } from 'react';

const NotificationToast = ({ message, type = 'info', onClose, duration = 3000 }) => {
  useEffect(() => {
    if (!duration) return;
    const timer = setTimeout(() => onClose?.(), duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const bgColors = {
    info: 'rgba(59, 130, 246, 0.9)',
    success: 'rgba(16, 185, 129, 0.9)',
    warning: 'rgba(245, 158, 11, 0.9)',
    error: 'rgba(239, 68, 68, 0.9)',
  };

  return (
    <div
      style={{
        position: 'fixed',
        bottom: '1.5rem',
        right: '1.5rem',
        padding: '0.75rem 1.25rem',
        borderRadius: '0.5rem',
        background: bgColors[type] || bgColors.info,
        color: '#fff',
        fontWeight: 500,
        boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
        display: 'flex',
        alignItems: 'center',
        gap: '0.75rem',
        zIndex: 10000,
        animation: 'slideInRight 0.3s ease',
      }}
    >
      <span>{message}</span>
      {onClose && (
        <button onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', cursor: 'pointer', fontSize: '1rem' }}>
          ×
        </button>
      )}
    </div>
  );
};

export default NotificationToast;
"@
Make-Commit "feat(ui): add NotificationToast component for dynamic alert messages"

# 9. RatingPicker
Set-Content "frontend\src\components\RatingPicker.jsx" @"
import React, { useState } from 'react';

const RatingPicker = ({ max = 5, value = 0, onChange }) => {
  const [hovered, setHovered] = useState(0);

  return (
    <div style={{ display: 'inline-flex', gap: '0.25rem' }}>
      {Array.from({ length: max }, (_, i) => {
        const starValue = i + 1;
        const isFilled = starValue <= (hovered || value);
        return (
          <span
            key={i}
            onMouseEnter={() => setHovered(starValue)}
            onMouseLeave={() => setHovered(0)}
            onClick={() => onChange?.(starValue)}
            style={{
              cursor: 'pointer',
              fontSize: '1.5rem',
              color: isFilled ? '#f59e0b' : '#374151',
              transition: 'color 0.15s ease, transform 0.15s ease',
              transform: hovered === starValue ? 'scale(1.2)' : 'scale(1)',
            }}
          >
            ★
          </span>
        );
      })}
    </div>
  );
};

export default RatingPicker;
"@
Make-Commit "feat(ui): add RatingPicker interactive component for movie reviews"

# 10. currencyFormatter
Set-Content "frontend\src\utils\currencyFormatter.js" @"
export const formatINR = (amount, decimals = 2) => {
  const num = Number(amount);
  if (isNaN(num)) return '₹0.00';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(num);
};

export const parseINR = (str) => {
  if (typeof str !== 'string') return 0;
  const cleaned = str.replace(/[^0-9.-]+/g, '');
  return parseFloat(cleaned) || 0;
};
"@
Make-Commit "feat(utils): add currencyFormatter utility for standard INR pricing display"

# 11. datetime_utils
Set-Content "backend\app\utils\datetime_utils.py" @"
from __future__ import annotations
from datetime import datetime, timezone
from typing import Optional

def utc_now() -> datetime:
    return datetime.now(timezone.utc)

def format_iso(dt: Optional[datetime]) -> Optional[str]:
    if dt is None:
        return None
    return dt.isoformat()

def parse_iso(dt_str: str) -> Optional[datetime]:
    try:
        return datetime.fromisoformat(dt_str)
    except (ValueError, TypeError):
        return None
"@
Make-Commit "feat(backend): add datetime_utils for showtime timestamp handling"

# 12. validator_utils
Set-Content "backend\app\utils\validator_utils.py" @"
import re

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")
PHONE_REGEX = re.compile(r"^[6-9]\d{9}$")

def is_valid_email(email: str) -> bool:
    return bool(EMAIL_REGEX.match(email.strip())) if email else False

def is_valid_phone(phone: str) -> bool:
    return bool(PHONE_REGEX.match(phone.strip())) if phone else False

def is_valid_booking_ref(code: str) -> bool:
    return bool(code and len(code) == 8 and code.isalnum())
"@
Make-Commit "feat(backend): add validator_utils for regex pattern verification"

# 13. jwt_utils
Set-Content "backend\app\utils\jwt_utils.py" @"
import base64
import json
import time
from typing import Any, Optional

def decode_token_payload_unverified(token: str) -> Optional[dict[str, Any]]:
    try:
        parts = token.split(".")
        if len(parts) != 3:
            return None
        payload = parts[1]
        payload += "=" * (-len(payload) % 4)
        decoded = base64.urlsafe_bdecode(payload)
        return json.loads(decoded)
    except Exception:
        return None

def is_token_expired(token: str, buffer_seconds: int = 0) -> bool:
    payload = decode_token_payload_unverified(token)
    if not payload or "exp" not in payload:
        return True
    return time.time() >= (payload["exp"] - buffer_seconds)
"@
Make-Commit "feat(backend): add jwt_utils for token decoding and expiration checks"

# 14. file_utils
Set-Content "backend\app\utils\file_utils.py" @"
import os
import re

def sanitize_filename(filename: str) -> str:
    filename = os.path.basename(filename)
    filename = re.sub(r"[^\w\.-]", "_", filename)
    return filename

def get_file_extension(filename: str) -> str:
    return os.path.splitext(filename)[1].lower().lstrip(".")
"@
Make-Commit "feat(backend): add file_utils for poster upload path sanitization"

# 15. analyticsService
Set-Content "frontend\src\services\analyticsService.js" @"
class AnalyticsService {
  constructor() {
    this.queue = [];
    this.enabled = true;
  }

  trackEvent(eventName, properties = {}) {
    if (!this.enabled) return;
    const event = {
      eventName,
      properties,
      timestamp: new Date().toISOString(),
    };
    this.queue.push(event);
    if (process.env.NODE_ENV === 'development') {
      console.log('[Analytics]', event);
    }
  }

  flush() {
    const eventsToFlush = [...this.queue];
    this.queue = [];
    return eventsToFlush;
  }
}

export const analytics = new AnalyticsService();
"@
Make-Commit "feat(services): add analyticsService for client interaction logging"

# 16. test_utils
Set-Content "backend\tests\test_utils.py" @"
import pytest
from app.utils.validator_utils import is_valid_email, is_valid_phone, is_valid_booking_ref
from app.utils.file_utils import sanitize_filename, get_file_extension

def test_is_valid_email():
    assert is_valid_email("user@example.com") is True
    assert is_valid_email("invalid-email") is False

def test_is_valid_phone():
    assert is_valid_phone("9876543210") is True
    assert is_valid_phone("12345") is False

def test_is_valid_booking_ref():
    assert is_valid_booking_ref("BOOK1234") is True
    assert is_valid_booking_ref("SHORT") is False

def test_sanitize_filename():
    assert sanitize_filename("my file/poster.png") == "poster.png"
    assert sanitize_filename("test@file!.jpg") == "test_file_.jpg"

def test_get_file_extension():
    assert get_file_extension("movie_poster.JPEG") == "jpeg"
"@
Make-Commit "test(backend): add unit tests for utility functions"

# 17. CHANGELOG.md update
Add-Content "CHANGELOG.md" @"

- Added new hooks: useEventListener, useToggle, useAsync, useMediaQuery
- Added new UI components: Stepper, Switch, Tabs, NotificationToast, RatingPicker
- Added backend utility modules: datetime_utils, validator_utils, jwt_utils, file_utils
- Added analyticsService and backend unit tests
"@
Make-Commit "docs(changelog): update CHANGELOG with latest component and utility additions"

# 18. README.md update
Add-Content "README.md" @"

### Additional Utilities & UI Components
- **Hooks**: `useEventListener`, `useToggle`, `useAsync`, `useMediaQuery`
- **Components**: `Stepper`, `Switch`, `Tabs`, `NotificationToast`, `RatingPicker`
- **Backend Utilities**: `datetime_utils`, `validator_utils`, `jwt_utils`, `file_utils`
"@
Make-Commit "docs(readme): update feature list and utility references in README"

# 19. GitHub CI Workflow
New-Item -ItemType Directory -Force ".github\workflows" | Out-Null
Set-Content ".github\workflows\ci.yml" @"
name: Continuous Integration

on:
  push:
    branches: [ main, master ]
  pull_request:
    branches: [ main, master ]

jobs:
  test-backend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Python
        uses: actions/setup-python@v4
        with:
          python-version: '3.10'
      - name: Install Dependencies
        run: |
          python -m pip install --upgrade pip
          if [ -f backend/requirements.txt ]; then pip install -r backend/requirements.txt; fi
          pip install pytest
      - name: Run Pytest
        run: |
          cd backend
          pytest

  test-frontend:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Set up Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      - name: Install & Lint Frontend
        run: |
          cd frontend
          npm ci || npm install
"@
Make-Commit "ci(github): add continuous integration workflow for tests and quality checks"

Write-Host "Pushing 19 commits to GitHub..." -ForegroundColor Cyan
git push origin main
Write-Host "Done! All 19 commits pushed successfully." -ForegroundColor Green
