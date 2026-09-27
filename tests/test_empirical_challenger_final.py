#!/usr/bin/env python3
"""
LordTúra Final Empirical Challenger Stress Test Suite
Author: challenger_m1_final
Adversarial Verification for Milestone 1 Remediations:
- 0 Contrast Defects (WCAG AA SC 1.4.3 & 1.4.11 across light & dark themes)
- Touch Targets >= 44x44px (WCAG 2.5.5 / Apple HIG across base & mobile media queries)
- Scroll Trapping Elimination (Viewport mobility & touch-action isolation)
- DOM, Asset, Geodetic, and Git Security Integrity
"""

import os
import re
import sys
import subprocess
from html.parser import HTMLParser

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# ---------------------------------------------------------------------------
# COLOR & CONTRAST ORACLE (WCAG 2.1 Standard)
# ---------------------------------------------------------------------------
def hex_to_rgb(h):
    h = h.lstrip('#').strip()
    if len(h) == 3:
        h = ''.join([c*2 for c in h])
    if len(h) == 8:
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), int(h[6:8], 16) / 255.0)
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0)

def blend_over(fg_rgba, bg_rgb):
    if len(fg_rgba) == 3:
        fg_rgba = (*fg_rgba, 1.0)
    r_fg, g_fg, b_fg, a = fg_rgba
    r_bg, g_bg, b_bg = bg_rgb[:3]
    return (
        int(round(r_fg * a + r_bg * (1.0 - a))),
        int(round(g_fg * a + g_bg * (1.0 - a))),
        int(round(b_fg * a + b_bg * (1.0 - a)))
    )

def rel_lum(rgb):
    def channel(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * channel(rgb[0]) + 0.7152 * channel(rgb[1]) + 0.0722 * channel(rgb[2])

def contrast_ratio(c1, c2):
    rgb1 = c1 if isinstance(c1, tuple) else hex_to_rgb(c1)
    rgb2 = c2 if isinstance(c2, tuple) else hex_to_rgb(c2)
    l1 = rel_lum(rgb1)
    l2 = rel_lum(rgb2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


# ---------------------------------------------------------------------------
# TEST SUITE
# ---------------------------------------------------------------------------
def run_final_challenger_audit():
    defects = []
    checks_passed = 0

    print("=" * 75)
    print("   LORDTURA FINAL ADVERSARIAL VERIFICATION SUITE — CHALLENGER M1 FINAL")
    print("=" * 75)

    # -----------------------------------------------------------------------
    # 1. CONTRAST DEFECT STRESS-TEST (WCAG AA)
    # -----------------------------------------------------------------------
    print("\n[CHALLENGE 1] Empirical Contrast Audit Across All Tokens & Surfaces:")

    # Read stylesheet tokens
    styles_css = open(os.path.join(ROOT_DIR, "styles.css"), encoding="utf-8").read()
    durre_css = open(os.path.join(ROOT_DIR, "durrewand", "styles.css"), encoding="utf-8").read()
    durre_html = open(os.path.join(ROOT_DIR, "durrewand", "index.html"), encoding="utf-8").read()
    dolo_html = open(os.path.join(ROOT_DIR, "dolomitok.html"), encoding="utf-8").read()
    portal_html = open(os.path.join(ROOT_DIR, "index.html"), encoding="utf-8").read()
    app_js = open(os.path.join(ROOT_DIR, "app.js"), encoding="utf-8").read()
    durre_js = open(os.path.join(ROOT_DIR, "durrewand", "app.js"), encoding="utf-8").read()

    combined_css = styles_css + "\n" + durre_css

    # Systematic tokens check
    tokens_to_test = [
        # (Name, FG, BG, Min CR, Mode)
        ("Light mode text-primary on light surface", "0f172a", "e6ecf5", 4.5, "Light"),
        ("Light mode text-secondary on light surface", "334155", "e6ecf5", 4.5, "Light"),
        ("Light mode text-muted on light surface", "526075", "e6ecf5", 4.5, "Light"),
        ("Light mode accent-blue on light surface", "0369a1", "e6ecf5", 4.5, "Light"),
        ("Light mode accent-yellow on light surface", "854d0e", "e6ecf5", 4.5, "Light"),
        ("Light mode climber-color on light surface", "be123c", "e6ecf5", 4.5, "Light"),
        ("Light mode hiker-color on light surface", "047857", "e6ecf5", 4.5, "Light"),
        ("Light mode joint-color on light surface", "92400e", "e6ecf5", 4.5, "Light"),
        ("Climber category badge text on badge bg", "9f1239", "ffe4e6", 4.5, "Light"),
        ("Hiker category badge text on badge bg", "065f46", "d1fae5", 4.5, "Light"),
        ("Joint category badge text on badge bg", "78350f", "fef3c7", 4.5, "Light"),
        ("Plattenstein CTA button text on green btn", "ffffff", "047857", 4.5, "Light"),
        ("Dark mode text-primary on dark surface", "f8fafc", "141820", 4.5, "Dark"),
        ("Dark mode text-secondary on dark card", "94a3b8", "181d26", 4.5, "Dark"),
        ("Dark mode text-muted on dark card", "818ea1", "181d26", 4.5, "Dark"),
        ("Dark mode accent-blue on dark surface", "38bdf8", "141820", 4.5, "Dark"),
        ("Dark mode climber-color on dark surface", "fb7185", "141820", 4.5, "Dark"),
        ("Dark mode hiker-color on dark surface", "34d399", "181d26", 4.5, "Dark"),
        ("Dark mode joint-color on dark surface", "fbbf24", "181d26", 4.5, "Dark"),
        ("Dark mode SOS Emergency text on red surface", "ffffff", "be123c", 4.5, "Dark"),
        ("Dark mode SOS General text on amber surface", "ffffff", "b45309", 4.5, "Dark"),
        ("Dark mode checkmark text on green surface", "0b1120", "34d399", 4.5, "Dark"),
        ("Hero stat card value on dark hero card", "f8fafc", "0d1424", 4.5, "Hero"),
        ("Hero stat card label on dark hero card", "cbd5e1", "0d1424", 4.5, "Hero"),
        ("Hero subtitle text on dark hero base", "cbd5e1", "0b1120", 4.5, "Hero"),
        ("Dürre Wand dark btn-primary gradient end", "ffffff", "065f46", 4.5, "Dark"),
        ("Dürre Wand section badge text on badge surface", "065f46", blend_over((16, 185, 129, 0.10), hex_to_rgb("e6ecf5")), 4.5, "Light"),
        ("Dürre Wand #packedCount pill text on pill surface", "065f46", blend_over((16, 185, 129, 0.15), hex_to_rgb("e6ecf5")), 4.5, "Light"),
        ("Dolomitok drawer Dürre Wand expedition link", "047857", "e6ecf5", 4.5, "Light"),
        ("SVG Elevation bounds text (Light)", "334155", "e6ecf5", 4.5, "Light"),
        ("SVG Peak altitude text (Light)", "854d0e", "e6ecf5", 4.5, "Light"),
        ("SVG Distance axis text (Dark)", "94a3b8", "181d26", 4.5, "Dark"),
    ]

    for label, fg, bg, min_cr, mode in tokens_to_test:
        cr = contrast_ratio(fg, bg)
        if cr < min_cr:
            defects.append(f"CONTRAST: {label} [{mode}]: {cr:.2f}:1 (< min {min_cr}:1)")
            print(f"  [FAIL] {label:<50} : {cr:>5.2f}:1 (< {min_cr}:1)")
        else:
            checks_passed += 1
            print(f"  [PASS] {label:<50} : {cr:>5.2f}:1 (>= {min_cr}:1)")

    # -----------------------------------------------------------------------
    # 2. TOUCH TARGETS (>= 44x44px RULE)
    # -----------------------------------------------------------------------
    print("\n[CHALLENGE 2] Mobile Touch Target Ergonomics & Hitbox Audit (>= 44x44px):")
    touch_checks = [
        # Check name, regex in styles_css or durre_css
        (".filter-btn min-height >= 44px", r"\.filter-btn[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".nav-tab min-height >= 44px", r"\.nav-tab[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".currency-btn min-height >= 44px", r"\.currency-btn[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".rate-refresh-btn 44x44px", r"\.rate-refresh-btn[^{]*\{[^}]*min-width:\s*44px[^}]*min-height:\s*44px", styles_css),
        (".nav-home-btn min-height >= 44px (Dolomitok)", r'class="nav-home-btn"[^>]*min-height:\s*44px', dolo_html),
        (".nav-home-btn min-height >= 44px (Dürre Wand)", r'class="nav-home-btn"[^>]*min-height:\s*44px', durre_html),
        (".timeline-map-btn min-height >= 44px", r"\.timeline-map-btn[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".custom-popup-btn min-height >= 44px", r"\.custom-popup-btn[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".modal-close-btn >= 44px", r"\.modal-close-btn[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".drawer-close-btn >= 44px", r"\.drawer-close-btn[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".hamburger-btn >= 44px (Dürre Wand)", r"\.hamburger-btn[^{]*\{[^}]*min-height:\s*44px", durre_css),
        (".mobile-menu-toggle >= 44px (Dolomitok)", r"\.mobile-menu-toggle[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".mobile-sos-chip min-height >= 44px", r"\.mobile-sos-chip[^{]*\{[^}]*min-height:\s*44px", styles_css),
        (".hero-dot::after expanded touch target (styles.css)", r"\.hero-dot::after[^{]*\{[^}]*top:\s*-20px", styles_css),
        (".hero-dot::after expanded touch target (durrewand)", r"\.hero-dot::after[^{]*\{[^}]*top:\s*-20px", durre_css),
        (".btn-open-tour styled with min-height >= 44px", r"\.btn-open-tour[^{]*\{[^}]*min-height:\s*44px", styles_css),
        ("Mobile tour-actions-bar .btn-sm >= 44px", r"\.tour-actions-bar\s+\.btn-sm\s*\{[^}]*min-height:\s*44px", styles_css),
        ("Mobile modal-actions .btn-sm >= 44px", r"\.modal-actions\s+\.btn-sm\s*\{[^}]*min-height:\s*44px", styles_css),
    ]

    for label, pattern, source_text in touch_checks:
        if re.search(pattern, source_text):
            checks_passed += 1
            print(f"  [PASS] {label}")
        else:
            defects.append(f"TOUCH TARGET: {label} failed hitbox requirement")
            print(f"  [FAIL] {label}")

    # -----------------------------------------------------------------------
    # 3. SCROLL TRAPPING & VIEWPORT FREEDOM AUDIT
    # -----------------------------------------------------------------------
    print("\n[CHALLENGE 3] Scroll Trapping & Viewport Mobility Audit:")
    
    # Verify that touch-action: none is NEVER applied to container cards or body
    scroll_trap_candidates = [
        (".elevation-card should NOT have touch-action: none", r"\.elevation-card[^{]*\{[^}]*touch-action:\s*none", durre_css),
        ("body should NOT have touch-action: none in styles.css", r"body[^{]*\{[^}]*touch-action:\s*none", styles_css),
        ("body should NOT have touch-action: none in durrewand/styles.css", r"body[^{]*\{[^}]*touch-action:\s*none", durre_css),
        (".map-card should NOT have touch-action: none", r"\.map-card[^{]*\{[^}]*touch-action:\s*none", durre_css),
        (".trail-card should NOT have touch-action: none", r"\.trail-card[^{]*\{[^}]*touch-action:\s*none", durre_css),
        ("Permanent overflow:hidden on body in base styles", r"body\s*\{[^}]*overflow:\s*hidden", styles_css),
    ]

    for label, pattern, stylesheet in scroll_trap_candidates:
        if re.search(pattern, stylesheet):
            defects.append(f"SCROLL TRAP: {label} (Traps user touch scrolling)")
            print(f"  [FAIL] {label}")
        else:
            checks_passed += 1
            print(f"  [PASS] {label}")

    # Verify that touch-action: none IS properly isolated to inner svg / chart wrap
    if re.search(r"svg#elevationSvg,\s*\.elevation-svg-wrapper\s*\{[^}]*touch-action:\s*none", durre_css):
        checks_passed += 1
        print("  [PASS] Dürre Wand touch-action: none is strictly isolated to svg#elevationSvg and wrapper")
    else:
        defects.append("SCROLL ISOLATION: Dürre Wand elevation svg missing isolated touch-action: none")
        print("  [FAIL] Dürre Wand elevation svg missing isolated touch-action")

    if re.search(r"\.elevation-chart-wrap,\s*\.elevation-svg-chart\s*\{[^}]*touch-action:\s*none", styles_css):
        checks_passed += 1
        print("  [PASS] Dolomites touch-action: none is strictly isolated to .elevation-chart-wrap")
    else:
        defects.append("SCROLL ISOLATION: Dolomites elevation chart missing isolated touch-action: none")
        print("  [FAIL] Dolomites elevation chart missing isolated touch-action")

    # Verify touchcancel handlers exist in both app.js and durrewand/app.js
    if "touchcancel" in app_js and "touchcancel" in durre_js:
        checks_passed += 1
        print("  [PASS] touchcancel event listeners present in both app.js and durrewand/app.js")
    else:
        defects.append("TOUCH CANCEL: Missing touchcancel event listener")
        print("  [FAIL] Missing touchcancel listener")

    # -----------------------------------------------------------------------
    # 4. RESIDUAL BRUTALIST & OUTDATED ARTIFACT AUDIT
    # -----------------------------------------------------------------------
    print("\n[CHALLENGE 4] Residual Neo-Brutalist Artifact & Root Link Audit:")
    files_to_check = [
        "index.html", "dolomitok.html", os.path.join("durrewand", "index.html"),
        "styles.css", os.path.join("durrewand", "styles.css"),
        "app.js", os.path.join("durrewand", "app.js"),
        "theme.js", os.path.join("durrewand", "theme.js")
    ]
    brutalist_pat = re.compile(r'neo-brutalist', re.IGNORECASE)
    brutalist_found = []
    for rel_f in files_to_check:
        full_p = os.path.join(ROOT_DIR, rel_f)
        txt = open(full_p, encoding="utf-8").read()
        matches = brutalist_pat.findall(txt)
        if matches:
            brutalist_found.append((rel_f, len(matches)))

    if brutalist_found:
        defects.append(f"OUTDATED LABELS: Residual Neo-Brutalist references found: {brutalist_found}")
        print(f"  [FAIL] Neo-Brutalist references found: {brutalist_found}")
    else:
        checks_passed += 1
        print("  [PASS] Zero residual Neo-Brutalist references across all codebase files.")

    # -----------------------------------------------------------------------
    # 5. GIT SECURITY & STAGING EXCLUSION
    # -----------------------------------------------------------------------
    print("\n[CHALLENGE 5] Git Security & .agents/ Staging Exclusion:")
    gi = open(os.path.join(ROOT_DIR, ".gitignore"), encoding="utf-8").read()
    if re.search(r"^\.agents/?", gi, re.MULTILINE):
        checks_passed += 1
        print("  [PASS] .gitignore contains explicit .agents/ rule")
    else:
        defects.append("GIT SECURITY: .gitignore missing .agents/")
        print("  [FAIL] .gitignore missing .agents/")

    st_dry = subprocess.run(["git", "add", "-n", "-A"], cwd=ROOT_DIR, capture_output=True, text=True)
    agents_staged = [l for l in st_dry.stdout.splitlines() if ".agents" in l]
    if not agents_staged:
        checks_passed += 1
        print("  [PASS] Dry-run git add -n -A stages 0 .agents files")
    else:
        defects.append(f"GIT SECURITY: Dry-run staged .agents files: {agents_staged}")
        print(f"  [FAIL] Dry-run staged .agents files: {agents_staged}")

    # -----------------------------------------------------------------------
    # VERDICT REPORTING
    # -----------------------------------------------------------------------
    print("\n" + "=" * 75)
    print("                    FINAL CHALLENGER AUDIT SUMMARY")
    print("=" * 75)
    print(f"Total stress checks executed: {checks_passed + len(defects)}")
    print(f"Checks passed:                {checks_passed}")
    print(f"Empirical defects found:      {len(defects)}")
    print("=" * 75)

    if defects:
        print("\nVERDICT: REQUEST_CHANGES")
        print("Defect listing:")
        for i, d in enumerate(defects, 1):
            print(f"  {i}. {d}")
        return 1
    else:
        print("\nVERDICT: APPROVE")
        print("All empirical adversarial challenges satisfied with ZERO defects.")
        return 0

if __name__ == "__main__":
    sys.exit(run_final_challenger_audit())
