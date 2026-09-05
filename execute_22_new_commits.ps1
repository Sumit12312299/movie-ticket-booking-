$ErrorActionPreference = "Stop"
Set-Location "d:\movie ticket booking"

function Make-Commit($msg) {
    git add -A
    git commit -m $msg
    Write-Host "Committed: $msg" -ForegroundColor Green
}

function Ensure-Dir($filePath) {
    $dir = Split-Path -Parent $filePath
    if ($dir -and !(Test-Path $dir)) {
        New-Item -ItemType Directory -Path $dir -Force | Out-Null
    }
}

# Commit 1
$p1 = "frontend\src\utils\themeUtils.js"
Ensure-Dir $p1
Set-Content $p1 @"
export const getPreferredTheme = () => {
  const saved = localStorage.getItem('app_theme');
  if (saved) return saved;
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

export const applyTheme = (theme) => {
  document.documentElement.setAttribute('data-theme', theme);
  localStorage.setItem('app_theme', theme);
};
"@
Make-Commit "feat(utils): add themeUtils for system preference detection and theme toggling"

# Commit 2
$p2 = "frontend\src\utils\debounceUtils.js"
Ensure-Dir $p2
Set-Content $p2 @"
export const debounce = (func, wait = 300, immediate = false) => {
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
"@
Make-Commit "feat(utils): add flexible debounce utility with immediate execution option"

# Commit 3
$p3 = "frontend\src\utils\numberUtils.js"
Ensure-Dir $p3
Set-Content $p3 @"
export const getOrdinalSuffix = (n) => {
  const s = ['th', 'st', 'nd', 'rd'];
  const v = n % 100;
  return n + (s[(v - 20) % 10] || s[v] || s[0]);
};

export const clamp = (num, min, max) => Math.min(Math.max(num, min), max);
"@
Make-Commit "feat(utils): add numberUtils for ordinal formatting and numeric clamping"

# Commit 4
$p4 = "frontend\src\utils\arrayUtils.js"
Ensure-Dir $p4
Set-Content $p4 @"
export const chunkArray = (arr, size) => {
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
"@
Make-Commit "feat(utils): add arrayUtils for seat matrix chunking and deduplication"

# Commit 5
$p5 = "frontend\src\utils\urlUtils.js"
Ensure-Dir $p5
Set-Content $p5 @"
export const parseQueryParams = (searchString) => {
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
"@
Make-Commit "feat(utils): add urlUtils for parsing and constructing URL query parameters"

# Commit 6
$p6 = "frontend\src\components\SkeletonLoader.jsx"
Ensure-Dir $p6
Set-Content $p6 @"
import React from 'react';

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
"@
Make-Commit "feat(ui): add SkeletonLoader UI component for loading placeholder animations"

# Commit 7
$p7 = "frontend\src\components\Tooltip.jsx"
Ensure-Dir $p7
Set-Content $p7 @"
import React, { useState } from 'react';

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
"@
Make-Commit "feat(ui): add Tooltip component for context help popups"

# Commit 8
$p8 = "frontend\src\components\Divider.jsx"
Ensure-Dir $p8
Set-Content $p8 @"
import React from 'react';

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
"@
Make-Commit "feat(ui): add Divider component for visual content sectioning"

# Commit 9
$p9 = "frontend\src\components\Avatar.jsx"
Ensure-Dir $p9
Set-Content $p9 @"
import React from 'react';

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
"@
Make-Commit "feat(ui): add Avatar component with initials fallback display"

# Commit 10
$p10 = "frontend\src\components\ProgressBar.jsx"
Ensure-Dir $p10
Set-Content $p10 @"
import React from 'react';

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
"@
Make-Commit "feat(ui): add ProgressBar component for booking wizard steps"

# Commit 11
$p11 = "frontend\src\components\EmptyState.jsx"
Ensure-Dir $p11
Set-Content $p11 @"
import React from 'react';

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
"@
Make-Commit "feat(ui): add EmptyState placeholder component for zero-data views"

# Commit 12
$p12 = "frontend\src\components\StatusIndicator.jsx"
Ensure-Dir $p12
Set-Content $p12 @"
import React from 'react';

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
"@
Make-Commit "feat(ui): add StatusIndicator component for live showtime status"

# Commit 13
$p13 = "backend\app\utils\pagination_utils.py"
Ensure-Dir $p13
Set-Content $p13 @"
from typing import List, Dict, Any

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
"@
Make-Commit "feat(backend): add pagination_utils helper for array slice pagination"

# Commit 14
$p14 = "backend\app\utils\hash_utils.py"
Ensure-Dir $p14
Set-Content $p14 @"
import hashlib

def compute_sha256(text: str) -> str:
    return hashlib.sha256(text.encode('utf-8')).hexdigest()

def compute_short_hash(text: str, length: int = 8) -> str:
    full_hash = compute_sha256(text)
    return full_hash[:length]
"@
Make-Commit "feat(backend): add hash_utils for SHA-256 and short checksum generation"

# Commit 15
$p15 = "backend\app\utils\email_validator.py"
Ensure-Dir $p15
Set-Content $p15 @"
import re

EMAIL_REGEX = re.compile(r"^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$")

def is_valid_email_syntax(email: str) -> bool:
    if not email or len(email) > 254:
        return False
    return bool(EMAIL_REGEX.match(email))
"@
Make-Commit "feat(backend): add email_validator regex helper module"

# Commit 16
$p16 = "backend\app\utils\slug_utils.py"
Ensure-Dir $p16
Set-Content $p16 @"
import re
import unicodedata

def slugify(text: str) -> str:
    text = unicodedata.normalize('NFKD', text).encode('ascii', 'ignore').decode('utf-8')
    text = re.sub(r'[^\w\s-]', '', text).lower()
    return re.sub(r'[-\s]+', '-', text).strip('-')
"@
Make-Commit "feat(backend): add slug_utils for generating movie URL slugs"

# Commit 17
$p17 = "backend\app\utils\rate_limiter.py"
Ensure-Dir $p17
Set-Content $p17 @"
import time
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
"@
Make-Commit "feat(backend): add sliding window in-memory rate limiting class"

# Commit 18
$p18 = "backend\app\utils\string_cleaner.py"
Ensure-Dir $p18
Set-Content $p18 @"
import re

def normalize_whitespace(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\s+', ' ', text).strip()

def extract_digits(text: str) -> str:
    if not text:
        return ""
    return re.sub(r'\D', '', text)
"@
Make-Commit "feat(backend): add string_cleaner utilities for text normalization"

# Commit 19
$p19 = "docs\CONTRIBUTING_GUIDE.md"
Ensure-Dir $p19
Set-Content $p19 @"
# CineTicket Contributing Guide

Thank you for contributing to CineTicket!

## Code Style
- Frontend: ES6+, JSX standard React guidelines
- Backend: PEP8 Python standards

## Commit Messages
Use Conventional Commits format:
- `feat(...)`: New features
- `fix(...)`: Bug fixes
- `docs(...)`: Documentation changes
"@
Make-Commit "docs(guide): add developer contribution guidelines and commit conventions"

# Commit 20
$p20 = "docs\ENVIRONMENT_VARIABLES.md"
Ensure-Dir $p20
Set-Content $p20 @"
# Environment Variables Reference

## Frontend (.env)
- `VITE_API_BASE_URL`: Base backend API URL
- `VITE_APP_TITLE`: Application title

## Backend (.env)
- `PORT`: Service port (default 5000)
- `JWT_SECRET`: Secret key for auth tokens
- `DATABASE_URL`: Connection string
"@
Make-Commit "docs(config): add comprehensive environment variables specification"

# Commit 21
$p21 = "docs\TESTING_STRATEGY.md"
Ensure-Dir $p21
Set-Content $p21 @"
# Testing Strategy

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
"@
Make-Commit "docs(testing): document backend and frontend test execution strategies"

# Commit 22
$p22 = "README.md"
# Append new utilities list to README
Add-Content $p22 "`n`n## Modular Utility Extensions`nAdded theme, debounce, number, array, URL, and security helper utilities."
Make-Commit "docs(readme): document modular utility extensions in project README"

Write-Host "Pushing 22 commits to GitHub remote..." -ForegroundColor Cyan
git push origin main
Write-Host "All 22 commits created and pushed successfully!" -ForegroundColor Green
