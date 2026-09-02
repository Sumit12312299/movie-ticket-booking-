# Changelog

All notable changes to BookTicket will be documented in this file.
Format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/).

---

## [Unreleased]

### Added
- /ping liveness probe endpoint for container health monitoring
- /version endpoint returning service metadata
- is_valid_email helper for email format validation
- 	runcate_text helper for capping long string output
- slugify helper for URL-safe slug generation
- capitalize_words helper for title-case formatting
- get_greeting utility based on server time of day
- Shared pytest fixtures via conftest.py
- pyproject.toml with pytest configuration

### Changed
- Logger formatter updated for richer module-level diagnostics

---

## [1.0.5] - 2026-08-29

### Added
- Enterprise release with full seat locking, admin analytics, and JWT auth

## [Unreleased]

### Added
- React hooks: useThrottle, usePrevious, useWindowSize, useOnlineStatus, useClipboard, useLockBodyScroll
- UI components: LoadingDots, EmptyState, ProgressBar, Avatar, Divider, Tooltip, Tag, CountdownTimer, RatingStars, CopyButton, Skeleton
- Backend utilities: RateLimiter, email_utils, pagination helpers, slug generation

- Added new hooks: useEventListener, useToggle, useAsync, useMediaQuery
- Added new UI components: Stepper, Switch, Tabs, NotificationToast, RatingPicker
- Added backend utility modules: datetime_utils, validator_utils, jwt_utils, file_utils
- Added analyticsService and backend unit tests
