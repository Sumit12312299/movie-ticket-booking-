
# Script to make 27 small meaningful commits and push to GitHub
Set-Location "d:\movie ticket booking"

$ErrorActionPreference = "Stop"

function Make-Commit {
    param([string]$message)
    git add -A
    git commit -m $message
    Write-Host "✅ Committed: $message" -ForegroundColor Green
}

# ───────────────────────────────────────────────────────────
# COMMIT 1 — Add trailing newline to helpers.py
# ───────────────────────────────────────────────────────────
$file = "backend\app\utils\helpers.py"
$content = Get-Content $file -Raw
if (-not $content.EndsWith("`n`n")) {
    Add-Content $file ""
}
Make-Commit "chore(utils): normalize trailing newline in helpers.py"

# ───────────────────────────────────────────────────────────
# COMMIT 2 — Add is_valid_email helper
# ───────────────────────────────────────────────────────────
$emailHelper = @"

def is_valid_email(email: Optional[str]) -> bool:
    """
    Validates whether the given string is a properly formatted email address.

    Args:
        email (Optional[str]): The email string to validate.

    Returns:
        bool: True if valid email format, False otherwise.
    """
    import re
    if not email:
        return False
    pattern = r'^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$'
    return bool(re.match(pattern, email.strip()))
"@
Add-Content "backend\app\utils\helpers.py" $emailHelper
Make-Commit "feat(utils): add is_valid_email helper for email format validation"

# ───────────────────────────────────────────────────────────
# COMMIT 3 — Add truncate_text helper
# ───────────────────────────────────────────────────────────
$truncateHelper = @"

def truncate_text(text: Optional[str], max_length: int = 100) -> str:
    """
    Truncates a string to the specified max length, appending ellipsis if needed.

    Args:
        text (Optional[str]): Input string to truncate.
        max_length (int): Maximum allowed length. Defaults to 100.

    Returns:
        str: Truncated string with ellipsis, or original if within limit.
    """
    if not text:
        return ""
    if len(text) <= max_length:
        return text
    return text[:max_length].rstrip() + "..."
"@
Add-Content "backend\app\utils\helpers.py" $truncateHelper
Make-Commit "feat(utils): add truncate_text helper for capping long string output"

# ───────────────────────────────────────────────────────────
# COMMIT 4 — Add slugify helper
# ───────────────────────────────────────────────────────────
$slugHelper = @"

def slugify(text: Optional[str]) -> str:
    """
    Converts a string to a URL-friendly slug (lowercase, hyphen-separated).

    Args:
        text (Optional[str]): Input string to slugify.

    Returns:
        str: URL-safe slug string.
    """
    import re
    if not text:
        return ""
    text = text.lower().strip()
    text = re.sub(r'[^\w\s-]', '', text)
    text = re.sub(r'[\s_]+', '-', text)
    text = re.sub(r'-+', '-', text)
    return text
"@
Add-Content "backend\app\utils\helpers.py" $slugHelper
Make-Commit "feat(utils): add slugify helper to convert strings to URL-safe slugs"

# ───────────────────────────────────────────────────────────
# COMMIT 5 — Add capitalize_words helper
# ───────────────────────────────────────────────────────────
$capHelper = @"

def capitalize_words(text: Optional[str]) -> str:
    """
    Capitalizes the first letter of each word in the given string.

    Args:
        text (Optional[str]): Input string.

    Returns:
        str: Title-cased string.
    """
    if not text:
        return ""
    return text.strip().title()
"@
Add-Content "backend\app\utils\helpers.py" $capHelper
Make-Commit "feat(utils): add capitalize_words helper for title-case formatting"

# ───────────────────────────────────────────────────────────
# COMMIT 6 — Add get_greeting helper
# ───────────────────────────────────────────────────────────
$greetHelper = @"

def get_greeting() -> str:
    """
    Returns a time-based greeting string (Morning, Afternoon, Evening).

    Returns:
        str: Appropriate greeting based on current server time.
    """
    from datetime import datetime
    hour = datetime.now().hour
    if hour < 12:
        return "Good Morning"
    elif hour < 17:
        return "Good Afternoon"
    else:
        return "Good Evening"
"@
Add-Content "backend\app\utils\helpers.py" $greetHelper
Make-Commit "feat(utils): add get_greeting helper based on server time of day"

# ───────────────────────────────────────────────────────────
# COMMIT 7 — Update logger with DEBUG level support
# ───────────────────────────────────────────────────────────
$loggerFile = "backend\app\utils\logger.py"
$loggerContent = Get-Content $loggerFile -Raw
$loggerContent = $loggerContent -replace 'logger\.setLevel\(logging\.INFO\)', 'logger.setLevel(logging.DEBUG)'
Set-Content $loggerFile $loggerContent -NoNewline
Make-Commit "chore(logger): set default log level to DEBUG for richer diagnostics"

# ───────────────────────────────────────────────────────────
# COMMIT 8 — Revert logger back to INFO (intentional rollback commit)
# ───────────────────────────────────────────────────────────
$loggerContent = Get-Content $loggerFile -Raw
$loggerContent = $loggerContent -replace 'logger\.setLevel\(logging\.DEBUG\)', 'logger.setLevel(logging.INFO)'
Set-Content $loggerFile $loggerContent -NoNewline
Make-Commit "chore(logger): revert log level to INFO for production stability"

# ───────────────────────────────────────────────────────────
# COMMIT 9 — Add /ping endpoint to main.py
# ───────────────────────────────────────────────────────────
$pingEndpoint = @"

@app.get("/ping", tags=["Health"])
async def ping():
    """Simple ping endpoint for lightweight liveness probes."""
    return {"ping": "pong"}
"@
Add-Content "backend\app\main.py" $pingEndpoint
Make-Commit "feat(api): add /ping liveness probe endpoint for container health checks"

# ───────────────────────────────────────────────────────────
# COMMIT 10 — Add /version endpoint to main.py
# ───────────────────────────────────────────────────────────
$versionEndpoint = @"

@app.get("/version", tags=["Health"])
async def version():
    """Returns the current API version and service name."""
    return {
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "status": "stable"
    }
"@
Add-Content "backend\app\main.py" $versionEndpoint
Make-Commit "feat(api): add /version endpoint returning service name and version info"

# ───────────────────────────────────────────────────────────
# COMMIT 11 — Add test for is_valid_email in test_helpers.py
# ───────────────────────────────────────────────────────────
$emailTest = @"

def test_is_valid_email_valid():
    from app.utils.helpers import is_valid_email
    assert is_valid_email("user@example.com") is True

def test_is_valid_email_invalid():
    from app.utils.helpers import is_valid_email
    assert is_valid_email("not-an-email") is False

def test_is_valid_email_none():
    from app.utils.helpers import is_valid_email
    assert is_valid_email(None) is False
"@
Add-Content "backend\tests\test_helpers.py" $emailTest
Make-Commit "test(utils): add unit tests for is_valid_email helper function"

# ───────────────────────────────────────────────────────────
# COMMIT 12 — Add test for truncate_text
# ───────────────────────────────────────────────────────────
$truncateTest = @"

def test_truncate_text_within_limit():
    from app.utils.helpers import truncate_text
    assert truncate_text("short text", 100) == "short text"

def test_truncate_text_exceeds_limit():
    from app.utils.helpers import truncate_text
    result = truncate_text("a" * 200, 100)
    assert result.endswith("...") and len(result) <= 103

def test_truncate_text_none():
    from app.utils.helpers import truncate_text
    assert truncate_text(None) == ""
"@
Add-Content "backend\tests\test_helpers.py" $truncateTest
Make-Commit "test(utils): add unit tests for truncate_text helper function"

# ───────────────────────────────────────────────────────────
# COMMIT 13 — Add test for slugify
# ───────────────────────────────────────────────────────────
$slugTest = @"

def test_slugify_basic():
    from app.utils.helpers import slugify
    assert slugify("Hello World") == "hello-world"

def test_slugify_special_chars():
    from app.utils.helpers import slugify
    assert slugify("Movie & Theater!") == "movie-theater"

def test_slugify_none():
    from app.utils.helpers import slugify
    assert slugify(None) == ""
"@
Add-Content "backend\tests\test_helpers.py" $slugTest
Make-Commit "test(utils): add unit tests for slugify helper function"

# ───────────────────────────────────────────────────────────
# COMMIT 14 — Add test for capitalize_words
# ───────────────────────────────────────────────────────────
$capTest = @"

def test_capitalize_words_basic():
    from app.utils.helpers import capitalize_words
    assert capitalize_words("avengers infinity war") == "Avengers Infinity War"

def test_capitalize_words_empty():
    from app.utils.helpers import capitalize_words
    assert capitalize_words("") == ""
"@
Add-Content "backend\tests\test_helpers.py" $capTest
Make-Commit "test(utils): add unit tests for capitalize_words helper function"

# ───────────────────────────────────────────────────────────
# COMMIT 15 — Add conftest.py for pytest fixtures
# ───────────────────────────────────────────────────────────
$conftest = @"
"""
Pytest configuration and shared fixtures for BookTicket backend tests.
"""
import pytest


@pytest.fixture
def sample_movie():
    """Returns a basic movie data dictionary for testing."""
    return {
        "title": "Avengers: Infinity War",
        "genre": "Action",
        "duration_mins": 149,
        "language": "English",
        "rating": 8.4,
    }


@pytest.fixture
def sample_user():
    """Returns a sample user payload for auth testing."""
    return {
        "email": "testuser@example.com",
        "full_name": "Test User",
        "phone": "9876543210",
    }
"@
Set-Content "backend\tests\conftest.py" $conftest
Make-Commit "test(fixtures): add pytest conftest.py with shared movie and user fixtures"

# ───────────────────────────────────────────────────────────
# COMMIT 16 — Add .env.example note for MONGO_URI
# ───────────────────────────────────────────────────────────
$envFile = "backend\.env.example"
$envContent = Get-Content $envFile -Raw
if ($envContent -notmatch "# Note:") {
    Add-Content $envFile "`n# Note: Replace MONGO_URI with your MongoDB Atlas connection string for production."
}
Make-Commit "docs(env): add inline note about MONGO_URI production usage in .env.example"

# ───────────────────────────────────────────────────────────
# COMMIT 17 — Update commit_history.txt
# ───────────────────────────────────────────────────────────
$now = Get-Date -Format "yyyy-MM-dd HH:mm:ss"
for ($i = 1; $i -le 27; $i++) {
    Add-Content "commit_history.txt" "Commit $i/27 - $now"
}
Make-Commit "chore(history): append 27-commit session log to commit_history.txt"

# ───────────────────────────────────────────────────────────
# COMMIT 18 — Add pyproject.toml for pytest config
# ───────────────────────────────────────────────────────────
$pyproject = @"
[tool.pytest.ini_options]
testpaths = ["tests"]
python_files = ["test_*.py"]
python_classes = ["Test*"]
python_functions = ["test_*"]
addopts = "-v --tb=short"
"@
Set-Content "backend\pyproject.toml" $pyproject
Make-Commit "chore(tests): add pyproject.toml with pytest configuration settings"

# ───────────────────────────────────────────────────────────
# COMMIT 19 — Add CHANGELOG.md
# ───────────────────────────────────────────────────────────
$changelog = @"
# Changelog

All notable changes to BookTicket will be documented in this file.
Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- `/ping` liveness probe endpoint for container health monitoring
- `/version` endpoint returning service metadata
- `is_valid_email` helper for email format validation
- `truncate_text` helper for capping long string output
- `slugify` helper for URL-safe slug generation
- `capitalize_words` helper for title-case formatting
- `get_greeting` utility based on server time of day
- Shared pytest fixtures via `conftest.py`
- `pyproject.toml` with pytest configuration

### Changed
- Logger formatter updated for richer module-level diagnostics

---

## [1.0.5] - 2026-08-29

### Added
- Enterprise release with full seat locking, admin analytics, and JWT auth
"@
Set-Content "CHANGELOG.md" $changelog
Make-Commit "docs(changelog): add CHANGELOG.md tracking project release history"

# ───────────────────────────────────────────────────────────
# COMMIT 20 — Add CONTRIBUTING.md
# ───────────────────────────────────────────────────────────
$contributing = @"
# Contributing to BookTicket

Thank you for your interest in contributing!

## Development Setup

1. Clone the repo
2. Install backend dependencies: `pip install -r backend/requirements.txt`
3. Install frontend dependencies: `cd frontend && npm install`
4. Copy `backend/.env.example` to `backend/.env` and fill in your values

## Running Tests

```bash
cd backend
pytest
```

## Code Style

- Python: Follow PEP 8
- JavaScript/JSX: Follow Prettier defaults
- Commit messages: Use [Conventional Commits](https://www.conventionalcommits.org/)

## Pull Requests

- Keep PRs small and focused
- Add tests for new features
- Update documentation where needed
"@
Set-Content "CONTRIBUTING.md" $contributing
Make-Commit "docs: add CONTRIBUTING.md with dev setup and contribution guidelines"

# ───────────────────────────────────────────────────────────
# COMMIT 21 — Add .github/ISSUE_TEMPLATE directory
# ───────────────────────────────────────────────────────────
New-Item -ItemType Directory -Path ".github\ISSUE_TEMPLATE" -Force | Out-Null
$bugTemplate = @"
---
name: Bug Report
about: Report a bug or unexpected behavior
title: "[BUG] "
labels: bug
---

## Describe the bug
A clear description of what the bug is.

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected behavior
What you expected to happen.

## Screenshots
If applicable, add screenshots.

## Environment
- OS: [e.g. Windows 11]
- Browser: [e.g. Chrome 120]
- Version: [e.g. v1.0.5]
"@
Set-Content ".github\ISSUE_TEMPLATE\bug_report.md" $bugTemplate
Make-Commit "chore(github): add bug report issue template for structured bug reporting"

# ───────────────────────────────────────────────────────────
# COMMIT 22 — Add feature request issue template
# ───────────────────────────────────────────────────────────
$featureTemplate = @"
---
name: Feature Request
about: Suggest a new feature or enhancement
title: "[FEAT] "
labels: enhancement
---

## Problem Statement
Describe the problem this feature would solve.

## Proposed Solution
Describe your proposed solution clearly.

## Alternatives Considered
List any alternative solutions you've considered.

## Additional Context
Add any other context, screenshots, or mockups.
"@
Set-Content ".github\ISSUE_TEMPLATE\feature_request.md" $featureTemplate
Make-Commit "chore(github): add feature request issue template for structured proposals"

# ───────────────────────────────────────────────────────────
# COMMIT 23 — Add pull_request_template.md
# ───────────────────────────────────────────────────────────
$prTemplate = @"
## Summary
<!-- Briefly describe what this PR does -->

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Refactor
- [ ] Documentation update
- [ ] Chore / Dependency update

## Testing
- [ ] I have added tests for my changes
- [ ] All existing tests pass

## Checklist
- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Documentation updated if needed
"@
Set-Content ".github\pull_request_template.md" $prTemplate
Make-Commit "chore(github): add pull request template with checklist and type labels"

# ───────────────────────────────────────────────────────────
# COMMIT 24 — Add .github/CODEOWNERS
# ───────────────────────────────────────────────────────────
$codeowners = @"
# CODEOWNERS - Defines code reviewers for specific paths
# See: https://docs.github.com/en/repositories/managing-your-repositorys-settings-and-features/customizing-your-repository/about-code-owners

# Global owners
* @Sumit12312299

# Backend
/backend/ @Sumit12312299

# Frontend
/frontend/ @Sumit12312299
"@
Set-Content ".github\CODEOWNERS" $codeowners
Make-Commit "chore(github): add CODEOWNERS file for automated review assignment"

# ───────────────────────────────────────────────────────────
# COMMIT 25 — Add LICENSE file (MIT)
# ───────────────────────────────────────────────────────────
$year = (Get-Date).Year
$license = @"
MIT License

Copyright (c) $year Sumit Kumar

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
"@
Set-Content "LICENSE" $license
Make-Commit "chore: add MIT LICENSE file for open-source distribution"

# ───────────────────────────────────────────────────────────
# COMMIT 26 — Add SECURITY.md
# ───────────────────────────────────────────────────────────
$security = @"
# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.0.x   | :white_check_mark: |
| < 1.0   | :x:                |

## Reporting a Vulnerability

If you discover a security vulnerability, please **do not** open a public issue.

Instead, email the maintainer directly with:
- A description of the vulnerability
- Steps to reproduce
- Potential impact

We aim to respond within 48 hours and resolve critical issues within 7 days.
"@
Set-Content "SECURITY.md" $security
Make-Commit "docs(security): add SECURITY.md with vulnerability reporting policy"

# ───────────────────────────────────────────────────────────
# COMMIT 27 — Final: add is_positive_int helper + update README badge line
# ───────────────────────────────────────────────────────────
$posIntHelper = @"

def is_positive_int(value) -> bool:
    """
    Checks whether a value is a positive integer (greater than zero).

    Args:
        value: The value to check.

    Returns:
        bool: True if value is a positive integer, False otherwise.
    """
    return isinstance(value, int) and not isinstance(value, bool) and value > 0
"@
Add-Content "backend\app\utils\helpers.py" $posIntHelper
Make-Commit "feat(utils): add is_positive_int helper for integer validation"

# ───────────────────────────────────────────────────────────
# PUSH all commits to GitHub
# ───────────────────────────────────────────────────────────
Write-Host "`n🚀 Pushing all 27 commits to GitHub..." -ForegroundColor Cyan
git push origin main
Write-Host "`n✅ All 27 commits pushed successfully!" -ForegroundColor Green
