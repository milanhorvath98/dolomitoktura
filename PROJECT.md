# Project: LordTúra UI/UX Neumorphic Refinement & Live Sync

## Architecture
LordTúra is an expedition planning web platform with a Neumorphic (Soft UI) aesthetic, comprising:
- **Portal Hub (`index.html`, `theme.js`, `styles.css`)**: High-level portal homepage with hero video, statistics, expedition switcher, and footer.
- **Dolomites 4-Day Expedition (`dolomitok.html`, `styles.css`, `app.js`, `data.js`, `theme.js`)**: Interactive Leaflet maps, 12 GPX routes with SVG elevation profiles, live weather, webcams, packing list, mobile drawer, and bottom navigation.
- **Dürre Wand / Plattenstein Loop (`durrewand/index.html`, `durrewand/styles.css`, `durrewand/app.js`, `durrewand/data.js`, `durrewand/theme.js`)**: Standalone alpine tour subsystem with DEM elevation profiles, photo gallery, lightbox, timetable, weather, and Austrian emergency rescue integration.
- **Automated Live Sync Pipeline (`sync.ps1`)**: Windows PowerShell script staging changes, committing to Git, pushing to GitHub (`git@github.com:milanhorvath98/dolomitoktura.git`), and deploying over SSH/SCP to Raspberry Pi 4 (`raspberry:/home/milan/dolomitok-web/`) which serves the site live via Tailscale Funnel.

## Feature Inventory
| # | Feature | Description | Milestone | Source |
|---|---------|-------------|-----------|--------|
| 1 | Git Safety (.gitignore) | Add `.agents/` and `*.log` to `.gitignore` to prevent leaking internal agent logs and prompts to public repo | M1 | Survey Arch |
| 2 | Neumorphic WCAG AA Contrast Tokens | Redefine `--text-muted` (5.38:1), `--accent-blue` (5.0:1), `--accent-yellow`, category colors (`--climber-color`, `--hiker-color`, `--joint-color`) in `:root` and `[data-theme="dark"]` for styles.css and durrewand/styles.css | M1 | Survey UI |
| 3 | Leaking Dark Surfaces Fix | Fix `.map-legend` and `.modal-parking-box` hardcoded dark backgrounds in Light mode to use `var(--bg-surface)` and `var(--text-primary)` | M1 | Survey UI |
| 4 | Category Badges Contrast | Fix `.badge-climber`, `.badge-hiker`, `.badge-joint` low contrast (1.5:1 - 2.26:1) in styles.css with high-contrast text and border variables | M1 | Survey UI |
| 5 | Dürre Wand Mobile Nav & Drawer Theming | Fix `.mobile-bottom-nav` selector typo to `.mobile-bottom-bar` and apply full Neumorphic tokens to `.mobile-drawer` and `.drawer-link` | M1 | Survey UI |
| 6 | Dürre Wand Packing List & Timetable Contrast | Fix `.item-text` (1.05:1) invisible text in light mode, style `.custom-checkbox`, and `.timeline-time` high contrast | M1 | Survey UI |
| 7 | SOS Buttons High-Contrast Feedback | Fix dark mode `.sos-btn.emergency` and `.sos-btn.general` to use deep colors with white text (>4.5:1), and dark checkmark on mint background | M1 | Survey UI |
| 8 | Primary Button Contrast (index.html:849) | Fix Plattenstein green button having blue text (`#0284c7` on `#059669`, 1.09:1) by setting `#ffffff` text | M1 | Survey UI |
| 9 | Global Keyboard/Touch Focus (:focus-visible) | Add comprehensive `:focus-visible` styling with Neumorphic focus rings across buttons, tabs, links, and inputs | M1 | Survey UI |
| 10 | Typography & Spec Labels | Support both `.spec-val` and `.spec-value` with font-weight: 800 and high-contrast `--text-primary`, uppercase `--text-muted` labels | M1 | Survey UI |
| 11 | 44x44px Touch Targets | Enforce min 44x44px hitboxes for `.filter-btn`, `.nav-tab`, `.modal-close-btn`, `.drawer-close-btn`, `.hamburger-btn`, `.hero-ctrl-btn`, `.hero-dot` pseudo hitboxes | M1 | Survey UX |
| 12 | Bottom Bar & Floating Button Collision | Offset `.floating-map-jump-btn` above `.mobile-bottom-nav` using `calc(64px + env(safe-area-inset-bottom, 0px) + 16px)`, add body bottom padding in Dürre Wand | M1 | Survey UX |
| 13 | Portal Hub Mobile Navigation & Theme Toggle | Prevent hiding `.portal-nav-links` at <=768px on `index.html`; maintain accessible `#themeToggleBtn` and expedition CTA | M1 | Survey UX |
| 14 | Touch Elevation Profile Scrubbing & Latch | Add `touch-action: none`, `touchstart` listener, non-passive `touchmove` with `e.preventDefault()`, and touchend timeout latch (2.5s) to retain elevation telemetry | M1 | Survey UX |
| 15 | Alpine Emergency SOS & GPS Quick Copy | Add SOS 140 button on Dürre Wand mobile bar, enlarge `.mobile-sos-chip` (>=44px), and implement one-tap GPS coordinate copy helper | M1 | Survey UX |
| 16 | SafeArea Insets & Notch Protection | Add `env(safe-area-inset-top)` padding to sticky headers (`.main-nav`, `.portal-nav`, `.top-cross-bar`) for notch/Dynamic Island devices | M1 | Survey UX |
| 17 | Outdated Brutalist Label & Navigation Fix | Update `aria-label` to "Neumorphic Soft UI Téma Váltó", fix `durrewand/index.html` link pointing to `/` to point to `../dolomitok.html` | M1 | Survey Arch |
| 18 | Automated Verification Test Suite | Multi-tier test suite verifying HTML tags, local assets, GPX integrity, WCAG AA contrast, git safety, and mobile target rules | M1 | Survey Arch |
| 19 | Automated Live Sync Execution | Run `sync.ps1` to commit, push to GitHub (`origin main`), and scp to Raspberry Pi webszerver | M2 | ORIGINAL_REQUEST R4 |

## Milestones
| # | Name | Scope | Dependencies | Status |
|---|------|-------|-------------|--------|
| M1 | Web Design & Ergonomics Implementation | Security (.gitignore), E2E test infra, UI contrast tokens, Neumorphic hierarchy, 44x44px touch targets, bottom bar spacing, elevation touch scrubbing, SOS/GPS features | none | DONE |
| M2 | Verification & Live Synchronization | Complete E2E test suite execution, run `sync.ps1`, verify GitHub push (`origin main`) and Raspberry Pi SCP deployment | M1 | IN_PROGRESS |

### Milestone 1 Key Outputs
- Modified Files: `.gitignore`, `styles.css`, `durrewand/styles.css`, `index.html`, `durrewand/index.html`, `dolomitok.html`, `app.js`, `durrewand/app.js`
- Test Infrastructure: `tests/verify_e2e.py`, `tests/test_challenger_m1.py`, `tests/test_adversarial_m1.py`, `tests/test_empirical_challenger_final.py`
- Test Results: All 4 test suites pass with 100% success (0 defects, exit code 0). Gate result: PASS (Auditor CLEAN, Reviewer APPROVE, Challenger APPROVE).

## Interface Contracts
### Design Tokens ↔ Components
- `--bg-surface`: Neumorphic surface base (`#e6ecf5` Light, `#141820` / `#181d26` Dark).
- `--text-primary`: Primary text, min 12:1 contrast (`#0f172a` Light, `#f8fafc` Dark).
- `--text-secondary`: Secondary body text, min 6.5:1 contrast (`#334155` Light, `#94a3b8` Dark).
- `--text-muted`: Metadata, labels, min 5:1 contrast (`#526071` / `#526075` Light, `#818ea1` / `#8ea0b4` Dark).
- `--accent-blue`: Active tabs, links, min 4.5:1 contrast (`#0369a1` Light, `#38bdf8` Dark).
- `--climber-color`, `--hiker-color`, `--joint-color`: Categorical badges & filters with WCAG AA compliant text & background pairings.
- `:focus-visible`: Standard 2px solid `var(--accent-blue)` with offset 3px and soft glow.

### Mobile Ergonomics Contract
- All interactive touch targets (`button`, `a`, `input`, `.filter-btn`, `.nav-tab`, `.drawer-close-btn`, `.modal-close-btn`): Minimum dimension `44px x 44px`.
- Elevation Chart: `touch-action: none !important;` on wrapper; `touchstart` + `touchmove` with `e.preventDefault()`.
- Bottom Floating Actions: `bottom: calc(64px + env(safe-area-inset-bottom, 0px) + 16px)`.

### Live Deployment Contract
- Git: Clean working tree, no untracked `.agents/` files committed.
- Remote: Pushed to `origin main` (`git@github.com:milanhorvath98/dolomitoktura.git`).
- Server: SCP to `raspberry:/home/milan/dolomitok-web/`.

## Code Layout
- `index.html`: Portal hub entrypoint.
- `styles.css`: Central stylesheet for portal and Dolomites tour.
- `app.js`: Main application logic, elevation profiles, map handling.
- `dolomitok.html`: Dolomites 4-day expedition page.
- `durrewand/index.html`: Dürre Wand tour page.
- `durrewand/styles.css`: Dürre Wand stylesheet.
- `durrewand/app.js`: Dürre Wand interactive map & elevation logic.
- `sync.ps1`: Automated deployment script.
- `.gitignore`: Git exclusion patterns.
- `tests/verify_e2e.py`: Automated verification test suite.
