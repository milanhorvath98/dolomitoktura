# Test Readiness Attestation

## Test Suite Location
- **Path**: `tests/verify_e2e.py`
- **Runner**: Python 3 standard library (`python tests/verify_e2e.py`)

## Gates Covered
1. **HTML Tag Closure & Balance**: Full DOM validation using `html.parser.HTMLParser` over `index.html`, `dolomitok.html`, and `durrewand/index.html`.
2. **Asset & Link Integrity**: Validates existence of all 40+ local assets (CSS, JS, GPX, images, video) referenced via `src` and `href`.
3. **GPX Geodetic Track Integrity**: Validates XML integrity, trackpoint counts (`<trkpt>`), and DEM elevation (`<ele>`) for all 13 GPX routes.
4. **WCAG AA Color Contrast Evaluation**: Computes relative luminance and contrast ratios for all Light mode and Dark mode Neumorphic color tokens, badges, buttons, and form controls against `--bg-surface` (`#e6ecf5` and `#181d26`). Requires minimum 4.5:1 for normal text and controls.
5. **Mobile Touch Target Ergonomics**: Enforces minimum 44x44px target sizes for interactive mobile elements (`.filter-btn`, `.nav-tab`, `.modal-close-btn`, `.drawer-close-btn`, `.hamburger-btn`, `.hero-dot`, `.floating-map-jump-btn`).
6. **Git Safety & Privacy Policy**: Verifies `.agents` is included in `.gitignore` and untracked by Git.
7. **Navigation & Reachability**: Verifies valid relative links (no broken root references), updated accessibility labels, and live connectivity (Raspberry Pi and GitHub).

## Execution Command
```powershell
python tests/verify_e2e.py
```
