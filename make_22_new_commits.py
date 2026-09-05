import os
import subprocess

def run_cmd(cmd):
    result = subprocess.run(cmd, shell=True, capture_output=True, text=True, cwd=r"d:\movie ticket booking")
    return result.stdout.strip(), result.stderr.strip(), result.returncode

def ensure_dir(filepath):
    os.makedirs(os.path.dirname(os.path.abspath(filepath)), exist_ok=True)

def write_and_commit(filepath, content, commit_msg):
    ensure_dir(filepath)
    with open(filepath, "w", encoding="utf-8") as f:
        f.write(content)
    run_cmd("git add -A")
    out, err, code = run_cmd(f'git commit -m "{commit_msg}"')
    print(f"Committed: {commit_msg} -> code {code}")

commits = [
    (
        r"d:\movie ticket booking\frontend\src\utils\themeUtils.js",
        """export const getPreferredTheme = () => {
  const saved = localStorage.getItem('app_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('app_theme', theme);
};
""",
        "feat(utils): add themeUtils for system preference detection and theme toggling"
    ),
    (
        r"d:\movie ticket booking\frontend\src\utils\debounceUtils.js",
        """export const debounce = (func, wait = 300, immediate = false) => {
  let timeout;
  return function (...args) {
    const context = this;
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    }, wait);
    if (callNow) func.apply(context, args);
  };
};
""",
        "feat(utils): add flexible debounce utility with immediate execution option"
    ),
    (
        r"d:\movie ticket booking\frontend\src\utils\numberUtils.js",
        """export const getOrdinalSuffix = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
""",
        "feat(utils): add numberUtils for ordinal formatting and numeric clamping"
    ),
    (
        r"d:\movie ticket booking\frontend\src\utils\arrayUtils.js",
        """export const chunkArray = (arr, size) => {
  if (!arr || size <= 0) return [];
  const result = [];
  for (let i = 0; i < arr.length; i += size) {
    result.push(arr.slice(i, i + size));
  }
  return result;
};

export const uniqueByKey = (arr, key) => {
  return [...new Map(arr.map(item => [item[key], item])).values()];
};
""",
        "feat(utils): add arrayUtils for seat matrix chunking and deduplication"
    ),
    (
        r"d:\movie ticket booking\frontend\src\utils\urlUtils.js",
        """export const parseQueryParams = (searchString) => {
  const params = new URLSearchParams(searchString);
  const result = {};
  for (const [key, value] of params.entries()) {
    result[key] = value;
  }
  return result;
};

export const buildQueryString = (paramsObj) => {
  const params = new URLSearchParams();
  Object.entries(paramsObj).forEach(([key, val]) => {
    if (val !== undefined && val !== null) {
      params.append(key, val);
    }
  });
  return params.toString();
};
""",
        "feat(utils): add urlUtils for parsing and constructing URL query parameters"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\SkeletonLoader.jsx",
        """import React from 'react';

const SkeletonLoader = ({ width = '100%', height = '20px', borderRadius = '4px', className = '' }) => {
  return (
    <div
      className={`skeleton-loader ${className}`}
      style={{
        width,
        height,
        borderRadius,
        backgroundColor: '#2a2d3d',
        opacity: 0.6,
        animation: 'pulse 1.5s infinite ease-in-out',
      }}
    />
  );
};

export default SkeletonLoader;
""",
        "feat(ui): add SkeletonLoader UI component for loading placeholder animations"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\Tooltip.jsx",
        """import React, { useState } from 'react';

const Tooltip = ({ text, children, position = 'top' }) => {
  const [visible, setVisible] = useState(false);

  return (
    <div
      className="tooltip-container"
      style={{ position: 'relative', display: 'inline-block' }}
      onMouseEnter={() => setVisible(true)}
      onMouseLeave={() => setVisible(false)}
    >
      {children}
      {visible && (
        <div className={`tooltip-bubble tooltip-${position}`}>
          {text}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
""",
        "feat(ui): add Tooltip component for context help popups"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\Divider.jsx",
        """import React from 'react';

const Divider = ({ label, margin = '16px 0' }) => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', margin }}>
      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
      {label && <span style={{ padding: '0 12px', fontSize: '0.85rem', color: '#8b9bb4' }}>{label}</span>}
      <div style={{ flex: 1, height: '1px', backgroundColor: 'rgba(255, 255, 255, 0.12)' }} />
    </div>
  );
};

export default Divider;
""",
        "feat(ui): add Divider component for visual content sectioning"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\Avatar.jsx",
        """import React from 'react';

const Avatar = ({ src, name = 'User', size = 40 }) => {
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);

  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: '50%',
        backgroundColor: '#e50914',
        color: '#fff',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontWeight: 'bold',
        fontSize: size * 0.4,
        overflow: 'hidden'
      }}
    >
      {src ? <img src={src} alt={name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : initials}
    </div>
  );
};

export default Avatar;
""",
        "feat(ui): add Avatar component with initials fallback display"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\ProgressBar.jsx",
        """import React from 'react';

const ProgressBar = ({ progress = 0, color = '#e50914', height = '8px' }) => {
  const clampedProgress = Math.min(100, Math.max(0, progress));

  return (
    <div style={{ width: '100%', backgroundColor: 'rgba(255, 255, 255, 0.1)', borderRadius: '4px', overflow: 'hidden', height }}>
      <div
        style={{
          width: `${clampedProgress}%`,
          backgroundColor: color,
          height: '100%',
          transition: 'width 0.3s ease-in-out'
        }}
      />
    </div>
  );
};

export default ProgressBar;
""",
        "feat(ui): add ProgressBar component for booking wizard steps"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\EmptyState.jsx",
        """import React from 'react';

const EmptyState = ({ title = 'No Data Found', description = 'There are no items to display right now.', icon = '🎬' }) => {
  return (
    <div style={{ textAlign: 'center', padding: '40px 20px', color: '#8b9bb4' }}>
      <div style={{ fontSize: '3rem', marginBottom: '12px' }}>{icon}</div>
      <h3 style={{ color: '#ffffff', marginBottom: '8px' }}>{title}</h3>
      <p style={{ margin: 0, fontSize: '0.95rem' }}>{description}</p>
    </div>
  );
};

export default EmptyState;
""",
        "feat(ui): add EmptyState placeholder component for zero-data views"
    ),
    (
        r"d:\movie ticket booking\frontend\src\components\StatusIndicator.jsx",
        """import React from 'react';

const StatusIndicator = ({ status = 'online', label }) => {
  const colors = {
    online: '#4caf50',
    busy: '#f44336',
    filling: '#ff9800',
  };

  const color = colors[status] || colors.online;

  return (
    <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
      <span
        style={{
          width: '8px',
          height: '8px',
          borderRadius: '50%',
          backgroundColor: color,
          display: 'inline-block',
          boxShadow: `0 0 6px ${color}`
        }}
      />
      {label && <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>{label}</span>}
    </div>
  );
};

export default StatusIndicator;
""",
        "feat(ui): add StatusIndicator component for live showtime status"
    ),
    (
        r"d:\movie ticket booking\backend\app\utils\pagination_utils.py",
        """from typing import List, Dict, Any

def paginate_list(items: List[Any], page: int = 1, per_page: int = 10) -> Dict[str, Any]:
    page = max(1, page)
    per_page = max(1, min(100, per_page))
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "per_page": per_page,
        "total_pages": (total + per_page - 1) // per_page if total > 0 else 0
    }
""",
        "feat(backend): add pagination_utils helper for array slice pagination"
    ),
    (
        r"d:\movie ticket booking\backend\app\utils\hash_utils.py",
        """import hashlib

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def compute_short_hash(text: str, length: int = 8) -> str:
    full_hash = compute_sha256(text)
    return full_hash[:length]
""",
        "feat(backend): add hash_utils for SHA-256 and short checksum generation"
    ),
    (
        r"d:\movie ticket booking\backend\app\utils\email_validator.py",
        """import re

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\\.[a-zA-Z0-9-.]+$")

def is_valid_email_syntax(email: str) -> bool:
    if not email or len(email) > 254:
        return False
    return bool(EMAIL_REGEX.match(email))
""",
        "feat(backend): add email_validator regex helper module"
    ),
    (
        r"d:\movie ticket booking\backend\app\utils\slug_utils.py",
        """import re
import unicodedata

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\\w\\s-]', '', text).lower()
    return re.sub(r'[-\\s]+', '-', text).strip('-')
""",
        "feat(backend): add slug_utils for generating movie URL slugs"
    ),
    (
        r"d:\movie ticket booking\backend\app\utils\rate_limiter.py",
        """import time
from collections import defaultdict

class MemoryRateLimiter:
    def __init__(self, max_requests: int = 10, window_seconds: int = 60):
        self.max_requests = max_requests
        self.window_seconds = window_seconds
        self.requests = defaultdict(list)

    def is_allowed(self, client_id: str) -> bool:
        now = time.time()
        cutoff = now - self.window_seconds
        self.requests[client_id] = [t for t in self.requests[client_id] if t > cutoff]
        if len(self.requests[client_id]) < self.max_requests:
            self.requests[client_id].append(now)
            return True
        return False
""",
        "feat(backend): add sliding window in-memory rate limiting class"
    ),
    (
        r"d:\movie ticket booking\backend\app\utils\string_cleaner.py",
        """import re

def normalize_whitespace(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\\s+', ' ', text).strip()

def extract_digits(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\\D', '', text)
""",
        "feat(backend): add string_cleaner utilities for text normalization"
    ),
    (
        r"d:\movie ticket booking\docs\CONTRIBUTING_GUIDE.md",
        """# CineTicket Contributing Guide

Thank you for contributing to CineTicket!

## Code Style
- Frontend: ES6+, JSX standard React guidelines
- Backend: PEP8 Python standards

## Commit Messages
Use Conventional Commits format:
- `feat(...)`: New features
- `fix(...)`: Bug fixes
- `docs(...)`: Documentation changes
""",
        "docs(guide): add developer contribution guidelines and commit conventions"
    ),
    (
        r"d:\movie ticket booking\docs\ENVIRONMENT_VARIABLES.md",
        """# Environment Variables Reference

## Frontend (.env)
- `VITE_API_BASE_URL`: Base backend API URL
- `VITE_APP_TITLE`: Application title

## Backend (.env)
- `PORT`: Service port (default 5000)
- `JWT_SECRET`: Secret key for auth tokens
- `DATABASE_URL`: Connection string
""",
        "docs(config): add comprehensive environment variables specification"
    ),
    (
        r"d:\movie ticket booking\docs\TESTING_STRATEGY.md",
        """# Testing Strategy

## Backend Testing
Run pytest for unit and integration testing:
```bash
pytest backend/app/tests
```

## Frontend Testing
Run Vitest for frontend unit tests:
```bash
npm run test
```
""",
        "docs(testing): document backend and frontend test execution strategies"
    ),
    (
        r"d:\movie ticket booking\README.md",
        """# Movie Ticket Booking Application

A full-stack CineTicket movie ticket booking web application with React frontend and Python FastAPI backend.

## Features
- Movie listings & trailers
- Interactive seat selection map
- Dynamic pricing & promo discount calculations
- Ticket passing & digital PDF receipt summary
- Modular utility extensions (theme, debounce, pagination, rate-limiting, and validation)

## Setup & Running
- **Frontend**: `cd frontend && npm install && npm run dev`
- **Backend**: `cd backend && pip install -r requirements.txt && python main.py`
""",
        "docs(readme): update project features and setup documentation"
    )
]

def main():
    print(f"Starting creation of {len(commits)} commits...")
    for idx, (filepath, content, msg) in enumerate(commits, start=1):
        print(f"[{idx}/22] Processing: {filepath}")
        write_and_commit(filepath, content, msg)
    
    print("Pushing commits to remote origin main...")
    out, err, code = run_cmd("git push origin main")
    print(f"Push stdout: {out}")
    print(f"Push stderr: {err}")
    print(f"Push exit code: {code}")

if __name__ == "__main__":
    main()
