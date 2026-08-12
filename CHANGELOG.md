# Changelog

All notable changes to this project are documented in this file.

## [1.3.2] - 2026-08-12

### Changed

- Replaced the text-based header badge with an animated stacked-card brand mark
- Added a matching browser favicon

## [1.3.1] - 2026-08-12

### Changed

- Added a staggered fade and slide transition when switching between English and Korean
- Added an animated language-selection indicator with reduced-motion support

## [1.3.0] - 2026-08-12

### Added

- Searchable technology library containing 3,453 bundled Simple Icons
- Per-category add workflow with multi-add and instant removal
- Cached internal icon endpoint for builder previews
- Page entrance, ambient background, marquee, modal, result, and interaction motion

### Changed

- Technology groups now show focused selections instead of a fixed checklist
- Custom stack validation accepts any bundled icon in any existing category
- Refined the visual hierarchy, responsive library, panel depth, and live-preview feedback

## [1.2.0] - 2026-08-11

### Added

- Astro-powered visual card customizer in English and Korean
- Live SVG preview, shareable builder links, and browser-local autosave
- Technology selection and drag or keyboard reordering
- Versioned custom stack tokens for unregistered GitHub usernames
- Custom card titles and icon-tile colors

### Changed

- Moved technology definitions into a shared catalog used by profiles, the API, and the builder
- Expanded validation to include Astro type checking and production builds

## [1.1.0] - 2026-08-11

### Added

- Staggered category and logo entrance animations
- Continuous subtle icon floating and animated border accent
- `animation=false` option for static cards
- Automatic `prefers-reduced-motion` support

## [1.0.1] - 2026-08-11

### Documentation

- Added live layout previews and a complete API option reference
- Clarified caching, Vercel deployment, and alternative hosting requirements
- Added development, contribution, and project acknowledgement guidance

## [1.0.0] - 2026-08-11

### Added

- Dynamic SVG tech stack card endpoint for Vercel
- Rows, grid, and compact layouts
- Shiny, GitHub Dark, and light themes
- Custom colors, icon sizing, hiding, and title options
- Seungpyo1007 tech stack profile with locally vendored logos
- API, validation, SVG rendering, and PNG rendering tests
- GitHub Actions validation workflow
