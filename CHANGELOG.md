# Changelog

All notable changes to this project will be documented in this file.

## [0.1.0] - 2025-09-08
### Added
- CI workflow (lint, type-check, build) and GitHub Pages deployment via Actions.
- Vite base configuration for Pages (`/cyberqp-mrt-table/`).
- Table state toggles in `src/App.tsx`:
  - Top pagination (hides only pagination controls, keeps count/CTAs)
  - Bottom pagination (shows/hides entire bottom bar)
  - Action CTAs
  - Row selection checkboxes
  - Edit column feature
- Edit column UX:
  - Popover with 40px header and right-aligned Save button
  - Compact 40px checkbox rows, left-aligned; list scrolls after 8 items
  - Staged changes apply on Save; Save enabled only when changes differ
  - Visibility persisted to localStorage under key `mrt-column-visibility`

### Changed
- Removed redundant container border to eliminate double/thick table border.

### Fixed
- Pagination spacing when bottom pagination is hidden (no empty box below rows).

---

Keep this file updated when making user-visible changes.
