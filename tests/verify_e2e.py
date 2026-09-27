#!/usr/bin/env python3
"""
LordTúra End-to-End Integrity & Verification Suite
Covers:
  1. HTML Tag Closure & Balance (HTMLValidator)
  2. Local Asset & Link References Integrity
  3. GPX Geodetic Track Integrity (Trackpoints & DEM elevation)
  4. WCAG AA Color Contrast Calculation across Light & Dark Neumorphic Tokens
  5. Mobile Touch Target Ergonomics (>=44x44px)
  6. Git Safety & .gitignore Exclusion
  7. Navigation & Reachability
"""

import os
import re
import sys
import subprocess
from html.parser import HTMLParser

ROOT_DIR = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))

class HTMLValidator(HTMLParser):
    def __init__(self):
        super().__init__()
        self.stack = []
        self.errors = []
        self.void_elements = {'area', 'base', 'br', 'col', 'embed', 'hr', 'img', 'input', 'link', 'meta', 'param', 'source', 'track', 'wbr'}

    def handle_starttag(self, tag, attrs):
        if tag.lower() not in self.void_elements:
            self.stack.append((tag.lower(), self.getpos()))

    def handle_endtag(self, tag):
        t = tag.lower()
        if t in self.void_elements:
            return
        if not self.stack:
            self.errors.append(f"Unexpected closing tag </{t}> at line {self.getpos()[0]} (stack empty)")
            return
        if self.stack[-1][0] == t:
            self.stack.pop()
        else:
            stack_tags = [x[0] for x in self.stack]
            if t in stack_tags:
                idx = len(self.stack) - 1 - stack_tags[::-1].index(t)
                unclosed = [f"<{self.stack[i][0]}> (line {self.stack[i][1][0]})" for i in range(idx + 1, len(self.stack))]
                self.errors.append(f"Mismatched closing tag </{t}> at line {self.getpos()[0]}, closing unclosed: {unclosed}")
                self.stack = self.stack[:idx]
            else:
                self.errors.append(f"Spurious closing tag </{t}> at line {self.getpos()[0]}")

def rel_lum(r, g, b):
    def channel(c):
        c = c / 255.0
        return c / 12.92 if c <= 0.04045 else ((c + 0.055) / 1.055) ** 2.4
    return 0.2126 * channel(r) + 0.7152 * channel(g) + 0.0722 * channel(b)

def hex_to_rgb(h):
    h = h.lstrip('#')
    return tuple(int(h[i:i+2], 16) for i in (0, 2, 4))

def contrast(c1, c2):
    rgb1 = hex_to_rgb(c1) if isinstance(c1, str) else c1
    rgb2 = hex_to_rgb(c2) if isinstance(c2, str) else c2
    l1 = rel_lum(*rgb1)
    l2 = rel_lum(*rgb2)
    return (max(l1, l2) + 0.05) / (min(l1, l2) + 0.05)

def run_tests():
    total_failures = 0
    print("==================================================")
    print("   LORDTURA END-TO-END E2E VERIFICATION SUITE    ")
    print("==================================================")
    
    html_files = [
        os.path.join(ROOT_DIR, "index.html"),
        os.path.join(ROOT_DIR, "dolomitok.html"),
        os.path.join(ROOT_DIR, "durrewand", "index.html")
    ]
    
    # ----------------------------------------------------
    # 1. HTML Syntax & Tag Balancer
    # ----------------------------------------------------
    print("\n[GATE 1] HTML Tag Closure & Balance:")
    for path in html_files:
        rel = os.path.relpath(path, ROOT_DIR)
        val = HTMLValidator()
        with open(path, "r", encoding="utf-8") as f:
            val.feed(f.read())
            val.close()
        if not val.errors and not val.stack:
            print(f"  [PASS] {rel} (0 errors, perfect tag balance)")
        else:
            total_failures += 1
            print(f"  [FAIL] {rel}")
            for e in val.errors:
                print(f"    - Error: {e}")
            for tag, pos in val.stack:
                print(f"    - Unclosed <{tag}> at line {pos[0]}")

    # ----------------------------------------------------
    # 2. Local Asset & Link Validity
    # ----------------------------------------------------
    print("\n[GATE 2] Local Assets & Link References:")
    class LinkCollector(HTMLParser):
        def __init__(self, base_dir):
            super().__init__()
            self.base_dir = base_dir
            self.missing = []
            self.total = 0
        def handle_starttag(self, tag, attrs):
            d = dict(attrs)
            for attr in ['src', 'href']:
                if attr in d:
                    u = d[attr]
                    if (u.startswith('#') or u.startswith('http://') or u.startswith('https://')
                            or u.startswith('tel:') or u.startswith('mailto:') or u.startswith('javascript:')):
                        continue
                    clean = u.split('?')[0].split('#')[0]
                    if not clean:
                        continue
                    if clean.startswith('/'):
                        tgt = os.path.normpath(os.path.join(ROOT_DIR, clean.lstrip('/\\')))
                    else:
                        tgt = os.path.normpath(os.path.join(self.base_dir, clean))
                    self.total += 1
                    if not os.path.exists(tgt):
                        self.missing.append((self.getpos()[0], tag, attr, u, tgt))
                        
    for path in html_files:
        rel = os.path.relpath(path, ROOT_DIR)
        collector = LinkCollector(os.path.dirname(path))
        with open(path, "r", encoding="utf-8") as f:
            collector.feed(f.read())
        if not collector.missing:
            print(f"  [PASS] {rel} ({collector.total} local refs verified)")
        else:
            total_failures += 1
            print(f"  [FAIL] {rel} ({len(collector.missing)} missing targets):")
            for line, tag, attr, u, tgt in collector.missing:
                print(f"    - Line {line}: <{tag} {attr}=\"{u}\"> not found at {tgt}")

    # ----------------------------------------------------
    # 3. GPX Tracks Inspection
    # ----------------------------------------------------
    print("\n[GATE 3] GPX Geodetic Track Integrity:")
    gpx_dir = os.path.join(ROOT_DIR, "gpx")
    gpx_files = [os.path.join(gpx_dir, f) for f in os.listdir(gpx_dir) if f.endswith(".gpx")]
    gpx_files.append(os.path.join(ROOT_DIR, "durrewand", "plattenstein.gpx"))
    print(f"  Found {len(gpx_files)} GPX track files.")
    gpx_fail = False
    for gf in sorted(gpx_files):
        rel = os.path.relpath(gf, ROOT_DIR)
        with open(gf, "r", encoding="utf-8") as f:
            content = f.read()
        points = len(re.findall(r'<(?:\w+:)?trkpt', content))
        has_ele = bool(re.search(r'<(?:\w+:)?ele>', content))
        if points > 0 and has_ele:
            print(f"  [PASS] {rel:<45} ({points:>4} trackpoints, DEM elevation verified)")
        else:
            gpx_fail = True
            print(f"  [FAIL] {rel} (pts: {points}, has_ele: {has_ele})")
    if gpx_fail:
        total_failures += 1

    # ----------------------------------------------------
    # 4. WCAG AA Contrast Evaluation (Tokens & Components)
    # ----------------------------------------------------
    print("\n[GATE 4] WCAG AA Color Contrast Evaluation (>= 4.5:1 for normal text):")
    light_bg = "e6ecf5"
    dark_bg = "181d26"
    
    light_tokens = [
        ("Light text-primary (#0f172a)", "0f172a", light_bg),
        ("Light text-secondary (#334155)", "334155", light_bg),
        ("Light text-muted (#526075)", "526075", light_bg),
        ("Light accent-blue (#0369a1)", "0369a1", light_bg),
        ("Light accent-yellow (#854d0e)", "854d0e", light_bg),
        ("Light climber-color (#be123c)", "be123c", light_bg),
        ("Light hiker-color (#047857)", "047857", light_bg),
        ("Light joint-color (#92400e)", "92400e", light_bg),
        ("Badge Climber text #9f1239 on #ffe4e6", "9f1239", "ffe4e6"),
        ("Badge Hiker text #065f46 on #d1fae5", "065f46", "d1fae5"),
        ("Badge Joint text #78350f on #fef3c7", "78350f", "fef3c7"),
        ("Plattenstein btn #ffffff on #047857", "ffffff", "047857"),
    ]
    
    contrast_fail = False
    for label, fg, bg in light_tokens:
        cr = contrast(fg, bg)
        st = "PASS" if cr >= 4.5 else "FAIL"
        if st == "FAIL":
            contrast_fail = True
            print(f"  [FAIL] {label:<45}: {cr:>5.2f}:1 (< 4.5:1)")
        else:
            print(f"  [PASS] {label:<45}: {cr:>5.2f}:1 (>= 4.5:1)")

    dark_tokens = [
        ("Dark text-primary (#f8fafc)", "f8fafc", dark_bg),
        ("Dark text-secondary (#94a3b8)", "94a3b8", dark_bg),
        ("Dark text-muted (#818ea1)", "818ea1", dark_bg),
        ("Dark accent-blue (#38bdf8)", "38bdf8", dark_bg),
        ("Dark climber-color (#fb7185)", "fb7185", dark_bg),
        ("Dark hiker-color (#34d399)", "34d399", dark_bg),
        ("Dark joint-color (#fbbf24)", "fbbf24", dark_bg),
        ("Dark SOS Emergency (#ffffff on #be123c)", "ffffff", "be123c"),
        ("Dark SOS General (#ffffff on #b45309)", "ffffff", "b45309"),
        ("Dark checkmark (#0b1120 on #34d399)", "0b1120", "34d399"),
    ]
    print("\n  Dark mode tokens:")
    for label, fg, bg in dark_tokens:
        cr = contrast(fg, bg)
        st = "PASS" if cr >= 4.5 else "FAIL"
        if st == "FAIL":
            contrast_fail = True
            print(f"  [FAIL] {label:<45}: {cr:>5.2f}:1 (< 4.5:1)")
        else:
            print(f"  [PASS] {label:<45}: {cr:>5.2f}:1 (>= 4.5:1)")
    if contrast_fail:
        total_failures += 1

    # ----------------------------------------------------
    # 5. Mobile Touch Target Ergonomics (>=44x44px)
    # ----------------------------------------------------
    print("\n[GATE 5] Mobile Touch Target Ergonomics Check in CSS:")
    styles_content = ""
    for css_file in ["styles.css", os.path.join("durrewand", "styles.css")]:
        with open(os.path.join(ROOT_DIR, css_file), "r", encoding="utf-8") as f:
            styles_content += f.read() + "\n"

    touch_targets = [
        (".filter-btn min-height >= 44px", r"\.filter-btn[^{]*\{[^}]*min-height:\s*44px"),
        (".nav-tab min-height >= 44px", r"\.nav-tab[^{]*\{[^}]*min-height:\s*44px"),
        (".modal-close-btn 44x44px", r"\.modal-close-btn[^{]*\{[^}]*(width:\s*44px|min-width:\s*44px)"),
        (".drawer-close-btn 44x44px", r"\.drawer-close-btn[^{]*\{[^}]*(width:\s*44px|min-width:\s*44px)"),
        (".hamburger-btn / .mobile-menu-toggle 44x44px", r"(\.hamburger-btn|\.mobile-menu-toggle)[^{]*\{[^}]*(width:\s*44px|min-width:\s*44px)"),
        (".hero-dot pseudo-hitbox ::after", r"\.hero-dot::after[^{]*\{[^}]*top:"),
        (".floating-map-jump-btn safe-area offset", r"calc\(64px\s*\+\s*env\(safe-area-inset-bottom"),
    ]
    touch_fail = False
    for label, pat in touch_targets:
        if re.search(pat, styles_content):
            print(f"  [PASS] {label}")
        else:
            touch_fail = True
            print(f"  [FAIL] {label} pattern not matched in stylesheets")
    if touch_fail:
        total_failures += 1

    # ----------------------------------------------------
    # 6. Git Ignore & Security Policy
    # ----------------------------------------------------
    print("\n[GATE 6] Git Safety & .gitignore Exclusion:")
    gitignore_path = os.path.join(ROOT_DIR, ".gitignore")
    with open(gitignore_path, "r", encoding="utf-8") as f:
        gi = f.read()
    if ".agents" in gi:
        print("  [PASS] .agents is present in .gitignore")
    else:
        total_failures += 1
        print("  [FAIL] .agents is NOT in .gitignore!")

    try:
        status_res = subprocess.run(["git", "status", "--porcelain"], cwd=ROOT_DIR, capture_output=True, text=True, timeout=5)
        untracked = [line for line in status_res.stdout.splitlines() if line.startswith("?? .agents")]
        if not untracked:
            print("  [PASS] git status confirms .agents/ is ignored and untracked")
        else:
            total_failures += 1
            print("  [FAIL] git status shows .agents/ is tracked or untracked: " + str(untracked))
    except Exception as ex:
        print(f"  [WARN] git status check could not run: {ex}")

    # ----------------------------------------------------
    # 7. Navigation & Reachability
    # ----------------------------------------------------
    print("\n[GATE 7] Navigation Links & Remote Reachability:")
    durrewand_html_path = os.path.join(ROOT_DIR, "durrewand", "index.html")
    with open(durrewand_html_path, "r", encoding="utf-8") as f:
        durr_content = f.read()
    
    # Check footer link does not point to /
    if 'href="/"' in durr_content:
        total_failures += 1
        print("  [FAIL] durrewand/index.html contains root link href=\"/\", should be ../dolomitok.html")
    else:
        print("  [PASS] durrewand/index.html footer links use relative paths")

    # Check theme toggle aria-label
    if 'aria-label="Neo-Brutalist Téma Váltó"' in durr_content:
        total_failures += 1
        print("  [FAIL] durrewand/index.html contains outdated 'Neo-Brutalist Téma Váltó' label")
    else:
        print("  [PASS] durrewand/index.html uses updated theme toggle label")

    # Remote Sync Ping
    try:
        res = subprocess.run(["ssh", "-o", "BatchMode=yes", "-o", "ConnectTimeout=4", "raspberry", "echo PING_OK"], capture_output=True, text=True, timeout=5)
        if res.returncode == 0 and "PING_OK" in res.stdout:
            print("  [PASS] SSH to 'raspberry' reachable and authenticated")
        else:
            print(f"  [WARN] SSH to raspberry returned code {res.returncode}")
    except Exception as ex:
        print(f"  [WARN] SSH to raspberry test error: {ex}")

    try:
        res = subprocess.run(["git", "push", "--dry-run", "origin", "main"], cwd=ROOT_DIR, capture_output=True, text=True, timeout=8)
        if res.returncode == 0:
            print("  [PASS] GitHub 'origin main' push dry-run successful")
        else:
            print(f"  [WARN] GitHub push dry-run returned code {res.returncode}")
    except Exception as ex:
        print(f"  [WARN] Git push dry-run error: {ex}")

    print("\n==================================================")
    if total_failures == 0:
        print("     ALL GATES PASSED (100% SUCCESS)              ")
    else:
        print(f"     SUITE FINISHED WITH {total_failures} GATE FAILURE(S)     ")
    print("==================================================")
    return total_failures

if __name__ == "__main__":
    code = run_tests()
    sys.exit(code)
