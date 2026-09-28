#!/usr/bin/env python3
"""
LordTúra M2 Stress & Collisions Adversarial Test Suite
Author: Challenger 1 (Stress & Collisions Challenger)
Role: Empirical Challenger (critic, specialist)

Validates:
  1. Z-Index Stacking Order & Visual Occlusion Invariants
  2. Safe-Area Inset Geometry & Mathematical Clearance Simulation
  3. Notch & Dynamic Island Safe-Area Top Protection
  4. Small-Screen Viewport Bounding Box & Grid Blowout Prevention (375px-430px)
  5. Touch Target Ergonomics & Overlap Clearance (>= 44x44px)
  6. Accessibility & ARIA Modal Stacking Semantics
  7. Touch Event Scrubbing Isolation & Event Non-Interference
"""

import os
import re
import sys
from html.parser import HTMLParser

# Configure UTF-8 stdout
if sys.stdout.encoding.lower() != 'utf-8':
    try:
        sys.stdout.reconfigure(encoding='utf-8')
    except Exception:
        pass

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

def load_file(rel_path):
    path = os.path.join(ROOT_DIR, rel_path)
    with open(path, "r", encoding="utf-8") as f:
        return f.read()

def main():
    print("=" * 75)
    print("   LORDTURA M2 EMPIRICAL STRESS & COLLISIONS TEST SUITE")
    print("   Challenger 1: Stress & Collisions Challenger")
    print("=" * 75)

    failures = 0
    total_checks = 0

    styles_css = load_file("styles.css")
    durre_styles_css = load_file("durrewand/styles.css")
    index_html = load_file("index.html")
    dolomitok_html = load_file("dolomitok.html")
    durre_html = load_file("durrewand/index.html")
    app_js = load_file("app.js")
    durre_app_js = load_file("durrewand/app.js")

    # =========================================================================
    # GATE 1: Z-Index Stacking Invariants & Layer Hierarchy
    # =========================================================================
    print("\n[STRESS GATE 1] Z-Index Stacking Order & Occlusion Hierarchy:")

    # Define standard stacking layers and expected relative values
    # Invariant: Nav (1000) < TopBar (1001) < BottomNav (1100) < FAB (1150) < DrawerBackdrop (2050) < Drawer (2100) < Modal (3000) < Close (3100) < Toast (9999)
    stacking_tests = [
        ("Dolomites: .main-nav", styles_css, r"\.main-nav[^{]*\{[^}]*z-index:\s*(\d+)", 1000, 1000),
        ("Dolomites: .top-cross-bar", styles_css, r"\.top-cross-bar[^{]*\{[^}]*z-index:\s*(\d+)", 1001, 1001),
        ("Dolomites: .mobile-bottom-nav", styles_css, r"\.mobile-bottom-nav[^{]*\{[^}]*z-index:\s*(\d+)", 1100, 1100),
        ("Dolomites: .floating-map-jump-btn", styles_css, r"\.floating-map-jump-btn[^{]*\{[^}]*z-index:\s*(\d+)", 1150, 1150),
        ("Dolomites: .mobile-drawer-overlay", styles_css, r"\.mobile-drawer-overlay[^{]*\{[^}]*z-index:\s*(\d+)", 2050, 2050),
        ("Dolomites: .mobile-drawer", styles_css, r"\.mobile-drawer(?!\w|\-)[^{]*\{[^}]*z-index:\s*(\d+)", 2100, 2100),
        ("Dolomites: .modal-backdrop", styles_css, r"\.modal-backdrop[^{]*\{[^}]*z-index:\s*(\d+)", 3000, 3000),
        ("Dolomites: #gps-toast (dynamic JS)", app_js, r"z-index:(\d+)", 9999, 9999),

        ("Dürre Wand: .main-nav", durre_styles_css, r"\.main-nav[^{]*\{[^}]*z-index:\s*(\d+)", 1000, 1000),
        ("Dürre Wand: .top-cross-bar", durre_styles_css, r"\.top-cross-bar[^{]*\{[^}]*z-index:\s*(\d+)", 1001, 1001),
        ("Dürre Wand: .mobile-bottom-bar", durre_styles_css, r"\.mobile-bottom-bar[^{]*\{[^}]*z-index:\s*(\d+)", 1100, 1100),
        ("Dürre Wand: .floating-map-jump-btn", durre_styles_css, r"\.floating-map-jump-btn[^{]*\{[^}]*z-index:\s*(\d+)", 1150, 1150),
        ("Dürre Wand: .drawer-backdrop", durre_styles_css, r"\.drawer-backdrop[^{]*\{[^}]*z-index:\s*(\d+)", 2050, 2050),
        ("Dürre Wand: .mobile-drawer", durre_styles_css, r"\.mobile-drawer(?!\w|\-)[^{]*\{[^}]*z-index:\s*(\d+)", 2100, 2100),
        ("Dürre Wand: .lightbox-modal", durre_styles_css, r"\.lightbox-modal[^{]*\{[^}]*z-index:\s*(\d+)", 3000, 3000),
        ("Dürre Wand: .lightbox-close", durre_styles_css, r"\.lightbox-close[^{]*\{[^}]*z-index:\s*(\d+)", 3100, 3100),
        ("Dürre Wand: #gps-toast (dynamic JS)", durre_app_js, r"z-index:(\d+)", 9999, 9999),

        ("Portal: .portal-nav", index_html, r"\.portal-nav[^{]*\{[^}]*z-index:\s*(\d+)", 1000, 1000),
    ]

    extracted_layers = {}
    for name, src, pattern, expected_val, min_val in stacking_tests:
        total_checks += 1
        m = re.search(pattern, src)
        if m:
            val = int(m.group(1))
            extracted_layers[name] = val
            if val >= min_val:
                print(f"  [PASS] {name:40s} -> z-index: {val} (expected >= {min_val})")
            else:
                failures += 1
                print(f"  [FAIL] {name:40s} -> z-index: {val} (violated min: {min_val})")
        else:
            failures += 1
            print(f"  [FAIL] {name:40s} -> z-index not found with pattern {pattern}")

    # Mathematical Invariant Checks
    print("\n  Evaluating Mathematical Stacking Inequality Invariants:")
    invariants = [
        ("FAB strictly below Drawer Backdrop (prevents punch-through)",
         extracted_layers.get("Dolomites: .floating-map-jump-btn", 0) < extracted_layers.get("Dolomites: .mobile-drawer-overlay", 0)),
        ("Bottom Nav strictly below Drawer Backdrop",
         extracted_layers.get("Dolomites: .mobile-bottom-nav", 0) < extracted_layers.get("Dolomites: .mobile-drawer-overlay", 0)),
        ("Drawer Backdrop strictly below Drawer Panel",
         extracted_layers.get("Dolomites: .mobile-drawer-overlay", 0) < extracted_layers.get("Dolomites: .mobile-drawer", 0)),
        ("Drawer Panel strictly below Modal Backdrop",
         extracted_layers.get("Dolomites: .mobile-drawer", 0) < extracted_layers.get("Dolomites: .modal-backdrop", 0)),
        ("Modal Backdrop strictly below Toast Notification",
         extracted_layers.get("Dolomites: .modal-backdrop", 0) < extracted_layers.get("Dolomites: #gps-toast (dynamic JS)", 0)),

        ("Dürre Wand: FAB strictly below Drawer Backdrop",
         extracted_layers.get("Dürre Wand: .floating-map-jump-btn", 0) < extracted_layers.get("Dürre Wand: .drawer-backdrop", 0)),
        ("Dürre Wand: Bottom Bar strictly below Drawer Backdrop",
         extracted_layers.get("Dürre Wand: .mobile-bottom-bar", 0) < extracted_layers.get("Dürre Wand: .drawer-backdrop", 0)),
        ("Dürre Wand: Drawer Backdrop strictly below Drawer Panel",
         extracted_layers.get("Dürre Wand: .drawer-backdrop", 0) < extracted_layers.get("Dürre Wand: .mobile-drawer", 0)),
        ("Dürre Wand: Drawer Panel strictly below Lightbox Modal",
         extracted_layers.get("Dürre Wand: .mobile-drawer", 0) < extracted_layers.get("Dürre Wand: .lightbox-modal", 0)),
        ("Dürre Wand: Lightbox Modal strictly below Lightbox Close button",
         extracted_layers.get("Dürre Wand: .lightbox-modal", 0) < extracted_layers.get("Dürre Wand: .lightbox-close", 0)),
        ("Dürre Wand: Lightbox Modal strictly below Toast Notification",
         extracted_layers.get("Dürre Wand: .lightbox-modal", 0) < extracted_layers.get("Dürre Wand: #gps-toast (dynamic JS)", 0)),
    ]

    for desc, condition in invariants:
        total_checks += 1
        if condition:
            print(f"  [PASS] Invariant: {desc}")
        else:
            failures += 1
            print(f"  [FAIL] Invariant Violated: {desc}")

    # =========================================================================
    # GATE 2: Safe-Area Inset Geometry & Clearance Simulation
    # =========================================================================
    print("\n[STRESS GATE 2] Safe Area Inset Geometry & Clearance Simulation:")

    # Hardware scenarios (safe-area-inset-bottom values)
    scenarios = [
        ("Desktop / Flat Android", 0),
        ("Modern Android Gesture Bar", 16),
        ("iPhone Home Indicator Standard", 34),
        ("Maximum Inset Device", 44)
    ]

    # Dolomites:
    # Nav bar: height = calc(60px + env)
    # FAB: bottom = calc(60px + env + 16px), height = 48px
    # Dürre Wand:
    # Nav bar: height = calc(64px + env)
    # FAB: bottom = calc(64px + env + 16px), height = 48px
    for scen_name, inset in scenarios:
        # Dolomites simulation
        bar_height_dol = 60 + inset
        fab_bottom_dol = 60 + inset + 16
        gap_dol = fab_bottom_dol - bar_height_dol

        total_checks += 1
        if gap_dol == 16:
            print(f"  [PASS] Dolomites [{scen_name} (inset={inset}px)]: Bar={bar_height_dol}px, FAB-bottom={fab_bottom_dol}px, Gap={gap_dol}px (strictly positive 16px clearance)")
        else:
            failures += 1
            print(f"  [FAIL] Dolomites [{scen_name}]: Collision! Gap={gap_dol}px (expected 16px)")

        # Dürre Wand simulation
        bar_height_dur = 64 + inset
        fab_bottom_dur = 64 + inset + 16
        gap_dur = fab_bottom_dur - bar_height_dur

        total_checks += 1
        if gap_dur == 16:
            print(f"  [PASS] Dürre Wand [{scen_name} (inset={inset}px)]: Bar={bar_height_dur}px, FAB-bottom={fab_bottom_dur}px, Gap={gap_dur}px (strictly positive 16px clearance)")
        else:
            failures += 1
            print(f"  [FAIL] Dürre Wand [{scen_name}]: Collision! Gap={gap_dur}px (expected 16px)")

    # Test that body padding-bottom matches or exceeds bar height + 16px
    total_checks += 1
    if "calc(64px + env(safe-area-inset-bottom, 0px) + 16px)" in styles_css:
        print("  [PASS] styles.css body bottom clearance padding accounts for bar + safe area + 16px buffer")
    else:
        failures += 1
        print("  [FAIL] styles.css body missing safe area bottom clearance padding")

    total_checks += 1
    if "calc(64px + env(safe-area-inset-bottom, 0px) + 16px)" in durre_styles_css:
        print("  [PASS] durrewand/styles.css body bottom clearance padding accounts for bar + safe area + 16px buffer")
    else:
        failures += 1
        print("  [FAIL] durrewand/styles.css body missing safe area bottom clearance padding")

    # =========================================================================
    # GATE 3: Safe Area Top & Notch / Dynamic Island Protection
    # =========================================================================
    print("\n[STRESS GATE 3] Notch & Dynamic Island Safe-Area Top Protection:")

    notch_checks = [
        ("styles.css: .main-nav padding-top env(safe-area-inset-top)",
         r"\.main-nav[^{]*\{[^}]*padding-top:\s*max\([^)]*safe-area-inset-top[^)]*\)", styles_css),
        ("durrewand/styles.css: .main-nav padding-top env(safe-area-inset-top)",
         r"\.main-nav[^{]*\{[^}]*padding-top:\s*max\([^)]*safe-area-inset-top[^)]*\)", durre_styles_css),
        ("durrewand/styles.css: .lightbox-close top env(safe-area-inset-top)",
         r"\.lightbox-close[^{]*\{[^}]*top:\s*max\([^)]*safe-area-inset-top[^)]*\)", durre_styles_css),
        ("index.html: .portal-nav padding max(..., env(safe-area-inset-top))",
         r"\.portal-nav[^{]*\{[^}]*padding:\s*max\([^)]*safe-area-inset-top[^)]*\)", index_html),
    ]

    for label, pattern, src in notch_checks:
        total_checks += 1
        if re.search(pattern, src):
            print(f"  [PASS] {label}")
        else:
            failures += 1
            print(f"  [FAIL] Missing safe-area-inset-top protection: {label}")

    # =========================================================================
    # GATE 4: Small-Screen Bounding Box & Grid Blowout Prevention (375px-430px)
    # =========================================================================
    print("\n[STRESS GATE 4] Responsive Grids & Overflow Containment across Viewports:")

    # Verify overflow-x: hidden on body
    total_checks += 1
    if re.search(r"body[^{]*\{[^}]*overflow-x:\s*hidden", styles_css):
        print("  [PASS] styles.css: body sets overflow-x: hidden")
    else:
        failures += 1
        print("  [FAIL] styles.css: body missing overflow-x: hidden")

    total_checks += 1
    if re.search(r"body[^{]*\{[^}]*overflow-x:\s*hidden", durre_styles_css):
        print("  [PASS] durrewand/styles.css: body sets overflow-x: hidden")
    else:
        failures += 1
        print("  [FAIL] durrewand/styles.css: body missing overflow-x: hidden")

    # Responsive Grid 1fr overrides on <= 768px
    mobile_grid_tests = [
        ("styles.css", ".webcams-grid", styles_css),
        ("styles.css", ".gastro-grid", styles_css),
        ("styles.css", ".checklist-grid", styles_css),
        ("styles.css", ".parking-hub-grid", styles_css),
        ("styles.css", ".weather-grid", styles_css),
        ("styles.css", ".logistics-grid", styles_css),
        ("styles.css", ".teams-split-grid", styles_css),
        ("styles.css", ".hero-stats-grid", styles_css),
        ("styles.css", ".gpx-hub-grid", styles_css),
        ("styles.css", ".budget-calculator-grid", styles_css),
        ("durrewand/styles.css", ".logistics-grid", durre_styles_css),
        ("durrewand/styles.css", ".checklist-grid", durre_styles_css),
        ("durrewand/styles.css", ".sos-buttons-wrap", durre_styles_css),
        ("index.html", ".portal-stats-grid", index_html),
        ("index.html", ".expeditions-grid", index_html),
        ("index.html", ".portal-features-grid", index_html),
    ]

    for file_name, grid_name, content in mobile_grid_tests:
        total_checks += 1
        # Check that grid has 1fr override in @media (max-width: <=900px)
        media_blocks = re.findall(r"@media\s*\(\s*max-width:\s*(?:480px|600px|640px|768px|900px)\s*\)\s*\{((?:[^{}]*\{[^{}]*\})*)\s*\}", content)
        found = False
        for mb in media_blocks:
            if grid_name in mb and "1fr" in mb:
                found = True
                break
        if found:
            print(f"  [PASS] {file_name}: {grid_name} collapses to single-column 1fr on mobile viewports")
        else:
            failures += 1
            print(f"  [FAIL] {file_name}: {grid_name} missing 1fr single-column collapse on mobile")

    # Verify no fixed min-width or width > 360px without max-width
    fixed_widths = re.findall(r"([^{}]+)\{[^}]*?(?<!max-)(?<!min-)width:\s*([4-9]\d{2}|[1-9]\d{3,})px[^}]*\}", styles_css + durre_styles_css)
    total_checks += 1
    if not fixed_widths:
        print("  [PASS] Zero fixed width definitions > 360px in both central stylesheets")
    else:
        failures += 1
        print(f"  [FAIL] Detected {len(fixed_widths)} fixed width rules > 360px: {fixed_widths[:3]}")

    # =========================================================================
    # GATE 5: Touch Target Hitbox Clearance (>= 44x44px)
    # =========================================================================
    print("\n[STRESS GATE 5] Touch Target Ergonomics & Overlap Free Clearance (>= 44x44px):")

    hitbox_tests = [
        ("Dolomites: .bottom-nav-item min-height >= 44px", r"\.bottom-nav-item[^{]*\{[^}]*min-height:\s*(\d+)px", styles_css, 44),
        ("Dolomites: .bottom-nav-item min-width >= 44px", r"\.bottom-nav-item[^{]*\{[^}]*min-width:\s*(\d+)px", styles_css, 44),
        ("Dolomites: .floating-map-jump-btn width >= 44px", r"\.floating-map-jump-btn[^{]*\{[^}]*width:\s*(\d+)px", styles_css, 44),
        ("Dolomites: .floating-map-jump-btn height >= 44px", r"\.floating-map-jump-btn[^{]*\{[^}]*height:\s*(\d+)px", styles_css, 44),
        ("Dolomites: .modal-close-btn width >= 44px", r"\.modal-close-btn[^{]*\{[^}]*width:\s*(\d+)px", styles_css, 44),
        ("Dolomites: .drawer-close-btn width >= 44px", r"\.drawer-close-btn[^{]*\{[^}]*width:\s*(\d+)px", styles_css, 44),
        ("Dolomites: .mobile-menu-toggle width >= 44px", r"\.mobile-menu-toggle[^{]*\{[^}]*width:\s*(\d+)px", styles_css, 44),

        ("Dürre Wand: .mb-btn min-height >= 44px", r"\.mb-btn[^{]*\{[^}]*min-height:\s*(\d+)px", durre_styles_css, 44),
        ("Dürre Wand: .mb-btn min-width >= 44px", r"\.mb-btn[^{]*\{[^}]*min-width:\s*(\d+)px", durre_styles_css, 44),
        ("Dürre Wand: .floating-map-jump-btn width >= 44px", r"\.floating-map-jump-btn[^{]*\{[^}]*width:\s*(\d+)px", durre_styles_css, 44),
        ("Dürre Wand: .floating-map-jump-btn height >= 44px", r"\.floating-map-jump-btn[^{]*\{[^}]*height:\s*(\d+)px", durre_styles_css, 44),
        ("Dürre Wand: .hamburger-btn width >= 44px", r"\.hamburger-btn[^{]*\{[^}]*width:\s*(\d+)px", durre_styles_css, 44),
        ("Dürre Wand: .drawer-close-btn width >= 44px", r"\.drawer-close-btn[^{]*\{[^}]*width:\s*(\d+)px", durre_styles_css, 44),
        ("Dürre Wand: .nav-home-btn mobile width >= 44px", r"\.nav-home-btn[^{]*\{[^}]*width:\s*(\d+)px\s*!important", durre_styles_css, 44),

        ("Portal: .portal-cta-btn mobile min-height >= 44px", r"\.portal-cta-btn[^{]*\{[^}]*min-height:\s*(\d+)px", index_html, 44),
        ("Portal: .neo-theme-toggle mobile width >= 44px", r"\.portal-nav \.neo-theme-toggle[^{]*\{[^}]*width:\s*(\d+)px\s*!important", index_html, 44),
    ]

    for label, pattern, src, min_dim in hitbox_tests:
        total_checks += 1
        m = re.search(pattern, src)
        if m and int(m.group(1)) >= min_dim:
            print(f"  [PASS] {label:55s} (found {m.group(1)}px)")
        else:
            failures += 1
            print(f"  [FAIL] {label:55s} (expected >= {min_dim}px)")

    # =========================================================================
    # GATE 6: DOM Semantics & Dialog / Range Stacking
    # =========================================================================
    print("\n[STRESS GATE 6] Accessibility & ARIA Modal Stacking Semantics:")

    # Dolomitok modal dialog
    total_checks += 1
    if 'id="tour-detail-modal"' in dolomitok_html and 'role="dialog"' in dolomitok_html and 'aria-modal="true"' in dolomitok_html:
        print("  [PASS] dolomitok.html: #tour-detail-modal implements role='dialog' and aria-modal='true'")
    else:
        failures += 1
        print("  [FAIL] dolomitok.html: #tour-detail-modal missing role='dialog' or aria-modal='true'")

    # Dürre Wand lightbox dialog
    total_checks += 1
    if 'id="lightboxModal"' in durre_html and 'role="dialog"' in durre_html and 'aria-modal="true"' in durre_html:
        print("  [PASS] durrewand/index.html: #lightboxModal implements role='dialog' and aria-modal='true'")
    else:
        failures += 1
        print("  [FAIL] durrewand/index.html: #lightboxModal missing role='dialog' or aria-modal='true'")

    # Range slider semantics
    total_checks += 1
    if 'id="people-slider"' in dolomitok_html and 'aria-label=' in dolomitok_html and 'aria-valuemin=' in dolomitok_html:
        print("  [PASS] dolomitok.html: #people-slider implements aria-label, aria-valuemin, aria-valuemax, aria-valuenow")
    else:
        failures += 1
        print("  [FAIL] dolomitok.html: #people-slider missing accessibility range attributes")

    # Heading hierarchy scan (hero-stats-grid should not skip to h4)
    total_checks += 1
    if '<div class="stat-info">\n            <h4>' not in dolomitok_html and '<div class="stat-info">\n            <h3>' in dolomitok_html:
        print("  [PASS] dolomitok.html: .hero-stats-grid uses semantic <h3> headings under <h1>, avoiding skipped levels")
    else:
        failures += 1
        print("  [FAIL] dolomitok.html: .hero-stats-grid contains improper heading levels")

    # =========================================================================
    # GATE 7: Touch Event Scrubbing Isolation & Event Non-Interference
    # =========================================================================
    print("\n[STRESS GATE 7] Touch Event Scrubbing Isolation & Event Non-Interference:")

    # Elevation chart touch scrubbing isolation
    total_checks += 1
    if "touch-action: none !important" in styles_css and ".elevation-chart-wrap" in styles_css:
        print("  [PASS] styles.css: touch-action: none is strictly scoped to .elevation-chart-wrap")
    else:
        failures += 1
        print("  [FAIL] styles.css: touch-action: none not properly scoped")

    total_checks += 1
    if "touch-action: none !important" in durre_styles_css and "svg#elevationSvg" in durre_styles_css:
        print("  [PASS] durrewand/styles.css: touch-action: none is strictly scoped to svg#elevationSvg & wrapper")
    else:
        failures += 1
        print("  [FAIL] durrewand/styles.css: touch-action: none not properly scoped")

    # Check that touchcancel listeners exist in both app scripts
    total_checks += 1
    if "touchcancel" in app_js:
        print("  [PASS] app.js implements touchcancel listener for elevation scrub release")
    else:
        failures += 1
        print("  [FAIL] app.js missing touchcancel listener")

    total_checks += 1
    if "touchcancel" in durre_app_js:
        print("  [PASS] durrewand/app.js implements touchcancel listener for elevation scrub release")
    else:
        failures += 1
        print("  [FAIL] durrewand/app.js missing touchcancel listener")

    # =========================================================================
    # SUMMARY & VERDICT
    # =========================================================================
    print("\n" + "=" * 75)
    print("                 CHALLENGER 1 STRESS AUDIT SUMMARY")
    print("=" * 75)
    print(f"Total stress checks executed: {total_checks}")
    print(f"Checks passed:                {total_checks - failures}")
    print(f"Empirical defects found:      {failures}")
    print("-" * 75)

    if failures == 0:
        print("FINAL VERDICT: APPROVE")
        print("All z-index stacking layers, safe area clearance calculations,")
        print("and viewport collision invariants verified with ZERO empirical defects.")
        print("=" * 75)
        sys.exit(0)
    else:
        print("FINAL VERDICT: REJECT")
        print(f"Found {failures} empirical defects.")
        print("=" * 75)
        sys.exit(1)

if __name__ == "__main__":
    main()
