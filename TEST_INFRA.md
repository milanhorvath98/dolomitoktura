# E2E Test Infra: LordTúra Portal UI/UX & Live Sync

## Test Philosophy
- Opaque-box, requirement-driven verification covering Neumorphic visual contrast (WCAG AA min 4.5:1), field mobile ergonomics (44x44px touch targets), interactive elevation profile responsiveness, system integrity, and automated live synchronization.
- Derived from `ORIGINAL_REQUEST.md`.

## Feature Inventory & Test Coverage
| # | Feature | Requirement Source | Tier 1 (Feature) | Tier 2 (Boundary) | Tier 3 (Cross-Feature) | Tier 4 (Real-World) |
|---|---------|-------------------|:----------------:|:-----------------:|:----------------------:|:--------------------:|
| 1 | Git Safety (.gitignore) | Security requirement | ✓ | ✓ | ✓ | ✓ |
| 2 | Neumorphic WCAG AA Contrast | ORIGINAL_REQUEST R1 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 3 | Leaking Dark Surfaces Fix | ORIGINAL_REQUEST R1 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 4 | Category Badges Contrast | ORIGINAL_REQUEST R1 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 5 | Dürre Wand Mobile Nav Parity | ORIGINAL_REQUEST R1/R3 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 6 | Packing List & Timetable Contrast | ORIGINAL_REQUEST R1/R3 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 7 | SOS Buttons Contrast | ORIGINAL_REQUEST R1/R2 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 8 | Primary Button Contrast (index:849) | ORIGINAL_REQUEST R1/R3 | ✓ | ✓ | ✓ | ✓ |
| 9 | Focus-Visible Styling | ORIGINAL_REQUEST R1 | ✓ | ✓ | ✓ | ✓ |
| 10 | Typography & Spec Labels | ORIGINAL_REQUEST R1 | ✓ | ✓ | ✓ | ✓ |
| 11 | 44x44px Touch Targets | ORIGINAL_REQUEST R2 | ✓ (5 tests) | ✓ (5 tests) | ✓ | ✓ |
| 12 | Bottom Bar & Floating Button Collision | ORIGINAL_REQUEST R2 | ✓ | ✓ | ✓ | ✓ |
| 13 | Portal Hub Mobile Navigation | ORIGINAL_REQUEST R2 | ✓ | ✓ | ✓ | ✓ |
| 14 | Touch Elevation Profile Scrubbing | ORIGINAL_REQUEST R2 | ✓ | ✓ | ✓ | ✓ |
| 15 | Emergency SOS & GPS Quick Copy | ORIGINAL_REQUEST R2 | ✓ | ✓ | ✓ | ✓ |
| 16 | SafeArea Insets & Notch Protection | ORIGINAL_REQUEST R2 | ✓ | ✓ | ✓ | ✓ |
| 17 | Outdated Labels & Links | ORIGINAL_REQUEST R3 | ✓ | ✓ | ✓ | ✓ |
| 18 | Automated Verification Test Suite | Acceptance Criteria | ✓ | ✓ | ✓ | ✓ |
| 19 | Automated Live Sync Execution | ORIGINAL_REQUEST R4 | ✓ | ✓ | ✓ | ✓ |

## Test Architecture
- Test Suite Script: `tests/verify_e2e.py`
- Command: `python tests/verify_e2e.py`
- Validations:
  - HTML Tag syntax balance and structure
  - Local asset and reference validation (100% resolution)
  - GPX XML parsing and DEM elevation data points
  - WCAG 2.1 relative luminance and contrast ratio calculations for all tokens
  - Mobile touch target minimum bounding box audit (>=44x44px)
  - Git repository safety check (.agents exclusion)
  - Remote SSH & Git connectivity check
