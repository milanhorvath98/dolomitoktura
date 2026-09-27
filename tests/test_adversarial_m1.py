#!/usr/bin/env python3
"""
LordTúra Adversarial UI/UX Contrast & Ergonomics Verification Suite
Empirical Stress-Testing Harness for Milestone 1
Reproduces all visual contrast and state violations across light and dark modes.
"""

import os
import re
import sys
from html.parser import HTMLParser

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

# ---------------------------------------------------------------------------
# COLOR & CONTRAST ENGINE (WCAG 2.1 SC 1.4.3 & 1.4.11)
# ---------------------------------------------------------------------------
NAMED_COLORS = {
    'white': '#ffffff',
    'black': '#000000',
    'transparent': 'rgba(0,0,0,0)',
}

def hex_to_rgb(h):
    h = h.lstrip('#').strip()
    if len(h) == 3:
        h = ''.join([c*2 for c in h])
    if len(h) == 8:
        return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), int(h[6:8], 16)/255.0)
    return (int(h[0:2], 16), int(h[2:4], 16), int(h[4:6], 16), 1.0)

def parse_css_color(c, default=None):
    if not c:
        return default
    c = c.strip().lower()
    if c in NAMED_COLORS:
        c = NAMED_COLORS[c]
    if c.startswith('#'):
        return hex_to_rgb(c)
    m = re.match(r'rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)(?:\s*,\s*([\d.]+))?\s*\)', c)
    if m:
        r, g, b = float(m.group(1)), float(m.group(2)), float(m.group(3))
        a = float(m.group(4)) if m.group(4) is not None else 1.0
        return (int(round(r)), int(round(g)), int(round(b)), a)
    return default

def blend_over(fg_rgba, bg_rgb):
    """Alpha-composites fg_rgba over opaque bg_rgb."""
    if len(fg_rgba) == 3:
        fg_rgba = (*fg_rgba, 1.0)
    r_fg, g_fg, b_fg, a = fg_rgba
    r_bg, g_bg, b_bg = bg_rgb[:3]
    r_res = int(round(r_fg * a + r_bg * (1.0 - a)))
    g_res = int(round(g_fg * a + g_bg * (1.0 - a)))
    b_res = int(round(b_fg * a + b_bg * (1.0 - a)))
    return (r_res, g_res, b_res)

def rel_lum(rgb):
    r, g, b = rgb[:3]
    def channel(v):
        v = v / 255.0
        return v / 12.92 if v <= 0.04045 else ((v + 0.055) / 1.055) ** 2.4
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def contrast_ratio(c1, c2):
    rgb1 = c1 if isinstance(c1, tuple) else hex_to_rgb(c1)
    rgb2 = c2 if isinstance(c2, tuple) else hex_to_rgb(c2)
    l1 = rel_lum(rgb1)
    l2 = rel_lum(rgb2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)


# ---------------------------------------------------------------------------
# SUITE EXECUTION
# ---------------------------------------------------------------------------
def run_adversarial_suite():
    failures = []
    passes = []
    
    print("=" * 75)
    print("      LORDTURA EMPIRICAL ADVERSARIAL STRESS-TEST HARNESS")
    print("=" * 75)

    # -----------------------------------------------------------------------
    # TEST 1: CSS Syntax & Structure Integrity
    # -----------------------------------------------------------------------
    print("\n[STRESS GATE 1] CSS Syntax & Balance Integrity:")
    for css_file in ["styles.css", os.path.join("durrewand", "styles.css")]:
        full_path = os.path.join(ROOT_DIR, css_file)
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        # Check comments
        c_open = content.count("/*")
        c_close = content.count("*/")
        if c_open != c_close:
            failures.append(f"{css_file}: Unclosed CSS comment (/* {c_open} vs */ {c_close})")
            print(f"  [FAIL] {css_file}: Mismatched comments")
        else:
            print(f"  [PASS] {css_file}: Comments balanced ({c_open} pairs)")
            
        # Clean out comments and strings
        clean = re.sub(r'/\*.*?\*/', '', content, flags=re.DOTALL)
        clean = re.sub(r'"[^"]*"', '', clean)
        clean = re.sub(r"'[^']*'", '', clean)
        b_open = clean.count("{")
        b_close = clean.count("}")
        if b_open != b_close:
            failures.append(f"{css_file}: Mismatched braces ({{ {b_open} vs }} {b_close})")
            print(f"  [FAIL] {css_file}: Mismatched braces")
        else:
            print(f"  [PASS] {css_file}: Braces balanced ({b_open} pairs)")
            passes.append(f"{css_file} syntax balance")

    # -----------------------------------------------------------------------
    # TEST 2: HTML DOM Integrity & Duplicate ID Scan
    # -----------------------------------------------------------------------
    print("\n[STRESS GATE 2] HTML DOM Integrity & Unique ID Scan:")
    class IDScanner(HTMLParser):
        def __init__(self):
            super().__init__()
            self.ids = set()
            self.duplicates = []
        def handle_starttag(self, tag, attrs):
            d = dict(attrs)
            if 'id' in d:
                i = d['id']
                if i in self.ids:
                    self.duplicates.append((i, self.getpos()[0]))
                else:
                    self.ids.add(i)

    for hf in ["index.html", "dolomitok.html", os.path.join("durrewand", "index.html")]:
        scanner = IDScanner()
        full_path = os.path.join(ROOT_DIR, hf)
        with open(full_path, "r", encoding="utf-8") as f:
            scanner.feed(f.read())
        if scanner.duplicates:
            failures.append(f"{hf}: Duplicate DOM IDs: {scanner.duplicates}")
            print(f"  [FAIL] {hf}: Found duplicate IDs: {scanner.duplicates}")
        else:
            print(f"  [PASS] {hf}: {len(scanner.ids)} IDs verified unique")
            passes.append(f"{hf} unique IDs")

    # -----------------------------------------------------------------------
    # TEST 3: Empirical Contrast Stress-Testing (Normal text >= 4.5:1)
    # -----------------------------------------------------------------------
    print("\n[STRESS GATE 3] Contrast Verification Across Real UI Elements & Modes:")
    
    # Bases
    LIGHT_SURFACE = hex_to_rgb("e6ecf5")
    LIGHT_CARD = hex_to_rgb("e6ecf5")
    DARK_SURFACE = hex_to_rgb("141820")
    DARK_CARD = hex_to_rgb("181d26")
    HERO_DARK_BASE = hex_to_rgb("0b1120")
    DURRE_HERO_STAT_BG = blend_over((15, 23, 42, 0.75), hex_to_rgb("070b12")) # (13, 20, 36)
    
    # Load files for real dynamic inspection
    with open(os.path.join(ROOT_DIR, "durrewand", "styles.css"), "r", encoding="utf-8") as f:
        durre_css = f.read()
    with open(os.path.join(ROOT_DIR, "styles.css"), "r", encoding="utf-8") as f:
        styles_css = f.read()
    with open(os.path.join(ROOT_DIR, "durrewand", "index.html"), "r", encoding="utf-8") as f:
        durre_html = f.read()
    with open(os.path.join(ROOT_DIR, "dolomitok.html"), "r", encoding="utf-8") as f:
        dolo_html = f.read()
    with open(os.path.join(ROOT_DIR, "app.js"), "r", encoding="utf-8") as f:
        app_js = f.read()
    with open(os.path.join(ROOT_DIR, "durrewand", "app.js"), "r", encoding="utf-8") as f:
        durre_js = f.read()

    LIGHT_TOKENS = {
        '--text-primary': '0f172a',
        '--text-secondary': '334155',
        '--text-muted': '526075',
        '--accent-blue': '0369a1',
        '--accent-yellow': '854d0e',
        '--climber-color': 'be123c',
        '--hiker-color': '047857',
        '--emerald-600': '065f46',
        '--emerald-500': '047857',
        '--emerald-400': '059669',
    }

    DARK_TOKENS = {
        '--text-primary': 'f8fafc',
        '--text-secondary': '94a3b8',
        '--text-muted': '818ea1',
        '--accent-blue': '38bdf8',
        '--accent-yellow': 'fbbf24',
        '--climber-color': 'fb7185',
        '--hiker-color': '34d399',
        '--emerald-600': '065f46',
        '--emerald-500': '34d399',
        '--emerald-400': '6ee7b7',
    }

    def extract_color(raw_str, default_hex="334155", is_dark=False):
        if not raw_str:
            return hex_to_rgb(default_hex)
        tokens = DARK_TOKENS if is_dark else LIGHT_TOKENS
        for var_name, hex_val in tokens.items():
            if var_name in raw_str:
                return hex_to_rgb(hex_val)
        m = re.search(r'#([0-9a-fA-F]{3,8})', raw_str)
        if m:
            return hex_to_rgb(m.group(1))
        rgb_m = re.search(r'rgba?\s*\(\s*([\d.]+)\s*,\s*([\d.]+)\s*,\s*([\d.]+)', raw_str)
        if rgb_m:
            return (int(round(float(rgb_m.group(1)))), int(round(float(rgb_m.group(2)))), int(round(float(rgb_m.group(3)))), 1.0)
        return hex_to_rgb(default_hex)

    # Dynamic extraction of active values with precise CSS property matching
    m1 = re.search(r'\.stat-card\s+\.value\s*\{[^}]*?(?<![\w-])color:\s*([^;]+)', durre_css)
    c1 = extract_color(m1.group(1) if m1 else None, default_hex="0f172a")

    m2 = re.search(r'\.stat-card\s+\.label\s*\{[^}]*?(?<![\w-])color:\s*([^;]+)', durre_css)
    c2 = extract_color(m2.group(1) if m2 else None, default_hex="334155")

    m3 = re.search(r'\.hero-subtitle\s*\{[^}]*?(?<![\w-])color:\s*([^;]+)', styles_css)
    c3 = extract_color(m3.group(1) if m3 else None, default_hex="334155")

    m4 = re.search(r'\[data-theme=["\']dark["\']\]\s+\.btn-primary\s*\{[^}]*background:\s*linear-gradient\([^,]+,\s*([^,]+),\s*([^)]+)\)', durre_css)
    c4 = extract_color(m4.group(2) if m4 else None, default_hex="34d399", is_dark=True)

    m5 = re.search(r'\.hero-actions\s+\.btn-secondary\s*\{[^}]*?(?<![\w-])color:\s*([^;]+)', durre_css)
    c5 = extract_color(m5.group(1) if m5 else None, default_hex="0f172a")

    m6 = re.search(r'id=["\']packedCount["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)', durre_html)
    c6 = extract_color(m6.group(1) if m6 else None, default_hex="34d399")

    m7 = re.search(r'\.section-badge\s*\{[^}]*?(?<![\w-])color:\s*([^;]+)', durre_css)
    c7 = extract_color(m7.group(1) if m7 else None, default_hex="059669")

    m8 = re.search(r'<span[^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)[^"\']*["\'][^>]*>\s*Szintemelkedés:', durre_html)
    c8 = extract_color(m8.group(1) if m8 else None, default_hex="cbd5e1")

    m9 = re.search(r'<p[^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)[^"\']*["\'][^>]*>\s*<i[^>]*></i>\s*FIZETÉS:', durre_html)
    c9 = extract_color(m9.group(1) if m9 else None, default_hex="f87171")

    m10 = re.search(r'href=["\']https://shop\.asfinag\.at["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)', durre_html)
    c10 = extract_color(m10.group(1) if m10 else None, default_hex="34d399")

    m11 = re.search(r'id=["\']liveTemp["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)', durre_html)
    c11 = extract_color(m11.group(1) if m11 else None, default_hex="f59e0b")

    m12 = re.search(r'id=["\']liveDesc["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)', durre_html)
    c12 = extract_color(m12.group(1) if m12 else None, default_hex="94a3b8")

    m13 = re.search(r'<div class=["\']val["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)[^"\']*["\']>Szept\. 26\.</div>', durre_html)
    c13 = extract_color(m13.group(1) if m13 else None, default_hex="34d399")

    m14 = re.search(r'<div class=["\']val["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)[^"\']*["\']>~12 - 16 °C</div>', durre_html)
    c14 = extract_color(m14.group(1) if m14 else None, default_hex="fbbf24")

    m15 = re.search(r'href=["\']durrewand/index\.html["\'][^>]*style=["\'][^"\']*?(?<![\w-])color:\s*([^;]+)', dolo_html)
    c15 = extract_color(m15.group(1) if m15 else None, default_hex="34d399")

    m16 = re.search(r'eleTextFill\s*=\s*isDark\s*\?\s*[\'"]([^\'"]+)[\'"]\s*:\s*[\'"]([^\'"]+)[\'"]', app_js)
    c16 = extract_color(m16.group(2) if m16 else None, default_hex="94a3b8")

    m17 = re.search(r'peakFill\s*=\s*isDark\s*\?\s*[\'"]([^\'"]+)[\'"]\s*:\s*[\'"]([^\'"]+)[\'"]', durre_js)
    c17 = extract_color(m17.group(2) if m17 else None, default_hex="fbbf24")

    m18 = re.search(r'axisTextFill\s*=\s*isDark\s*\?\s*[\'"]([^\'"]+)[\'"]\s*:\s*[\'"]([^\'"]+)[\'"]', app_js)
    c18 = extract_color(m18.group(1) if m18 else None, default_hex="64748b", is_dark=True)

    stress_cases = [
        # (Target Description, FG Color, BG Color, Required CR, Theme Context)
        (
            "durrewand/styles.css .stat-card .value in Light Mode",
            c1,
            DURRE_HERO_STAT_BG,   # fixed dark background of hero stat card
            4.5,
            "Light Mode (Default)"
        ),
        (
            "durrewand/styles.css .stat-card .label in Light Mode",
            c2,
            DURRE_HERO_STAT_BG,   # fixed dark background of hero stat card
            4.5,
            "Light Mode (Default)"
        ),
        (
            "styles.css .hero-subtitle in Light Mode",
            c3,
            HERO_DARK_BASE,       # fixed #0b1120 background of .hero
            4.5,
            "Light Mode (Default)"
        ),
        (
            "durrewand/styles.css .btn-primary in Dark Mode (gradient end)",
            hex_to_rgb("ffffff"), # color: #fff
            c4,                   # gradient end background in dark mode
            4.5,
            "Dark Mode"
        ),
        (
            "durrewand/styles.css .btn-secondary in Hero (Light Mode)",
            c5,
            blend_over((255, 255, 255, 0.08), hex_to_rgb("070b12")),
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:369 #packedCount text in Light Mode",
            c6,
            blend_over((16, 185, 129, 0.15), LIGHT_CARD),
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/styles.css .section-badge in Light Mode",
            c7,
            blend_over((16, 185, 129, 0.12), LIGHT_SURFACE),
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:316 Elevation metrics text in Light Mode",
            c8,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:482 Cash only alert text in Light Mode",
            c9,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:456 Highway vignette link in Light Mode",
            c10,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:402 Weather #liveTemp in Light Mode",
            c11,
            LIGHT_CARD,
            3.0,                  # large text (2.2rem)
            "Light Mode"
        ),
        (
            "durrewand/index.html:403 Weather #liveDesc in Light Mode",
            c12,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:418 Weather season text in Light Mode",
            c13,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/index.html:422 Weather peak temp in Light Mode",
            c14,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "dolomitok.html:268 Mobile Drawer Dürre Wand link in Light Mode",
            c15,
            LIGHT_SURFACE,
            4.5,
            "Light Mode"
        ),
        (
            "app.js:1157-1165 Elevation bounds text (#94a3b8) in Light Mode",
            c16,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "durrewand/app.js:566 SVG Peak altitude text (#fbbf24) in Light Mode",
            c17,
            LIGHT_CARD,
            4.5,
            "Light Mode"
        ),
        (
            "app.js:1167-1170 SVG Distance axis text (#64748b) in Dark Mode",
            c18,
            DARK_CARD,
            4.5,
            "Dark Mode"
        ),
    ]

    for label, fg, bg, min_cr, theme in stress_cases:
        cr = contrast_ratio(fg, bg)
        if cr < min_cr:
            msg = f"{label} [{theme}]: Contrast {cr:.2f}:1 (FAILED min {min_cr}:1)"
            failures.append(msg)
            print(f"  [FAIL] {label:<60} : {cr:>5.2f}:1 (< {min_cr}:1) [{theme}]")
        else:
            print(f"  [PASS] {label:<60} : {cr:>5.2f}:1 (>= {min_cr}:1) [{theme}]")
            passes.append(label)

    # -----------------------------------------------------------------------
    # VERDICT REPORTING
    # -----------------------------------------------------------------------
    print("\n" + "=" * 75)
    print("                   ADVERSARIAL STRESS-TEST VERDICT")
    print("=" * 75)
    print(f"Passed checks:    {len(passes)}")
    print(f"Empirical defects: {len(failures)}")
    print("-" * 75)
    
    if failures:
        print("VERDICT: REQUEST_CHANGES (Defects verified empirically)")
        print("\nSummary of empirical defects to fix:")
        for idx, f in enumerate(failures, 1):
            print(f"  {idx}. {f}")
        print("=" * 75)
        return 1
    else:
        print("VERDICT: APPROVE (Zero defects detected)")
        print("=" * 75)
        return 0

if __name__ == "__main__":
    code = run_adversarial_suite()
    sys.exit(code)
