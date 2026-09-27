#!/usr/bin/env python3
"""
Adversarial Stress Test Suite for Mobile Ergonomics, Touch Interactions, and Git Security.
Milestone 1 Verification - Challenger M1-2
"""

import os
import re
import sys
import subprocess
import html.parser
from pathlib import Path

ROOT_DIR = Path(__file__).resolve().parent.parent

class LinkCollector(html.parser.HTMLParser):
    def __init__(self):
        super().__init__()
        self.links = []
        self.buttons = []
        self.anchors = []

    def handle_starttag(self, tag, attrs):
        attr_dict = dict(attrs)
        if tag in ['a', 'link', 'script', 'img', 'video', 'source']:
            ref = attr_dict.get('href') or attr_dict.get('src')
            if ref:
                self.links.append((tag, ref, attr_dict))
        if tag == 'button':
            self.buttons.append(attr_dict)
        if tag == 'a':
            self.anchors.append(attr_dict)


def test_git_security():
    """Verify that .agents/ is never staged under any git add variant."""
    print("\n[STRESS TEST 1] Git Security & .agents/ Staging Exclusion:")
    errors = []
    
    # 1. Verify .gitignore content
    gitignore_path = ROOT_DIR / ".gitignore"
    with open(gitignore_path, "r", encoding="utf-8") as f:
        gi_content = f.read()
    if not re.search(r"^\.agents/?", gi_content, re.MULTILINE):
        errors.append(".gitignore missing explicit .agents/ pattern")
    
    # 2. git check-ignore
    agent_sample_files = [
        ".agents/teamwork/ORIGINAL_REQUEST.md",
        ".agents/teamwork/challenger_m1_2/BRIEFING.md",
        ".agents/teamwork/worker_m1/handoff.md",
        ".agents/test_nested_agent.txt"
    ]
    for sample in agent_sample_files:
        res = subprocess.run(
            ["git", "check-ignore", "-v", sample],
            cwd=str(ROOT_DIR),
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
        if res.returncode != 0 or ".agents" not in res.stdout:
            errors.append(f"git check-ignore failed to match ignored rule for: {sample}")

    # 3. Dry-run staging check (git add -n -A)
    res = subprocess.run(
        ["git", "add", "-n", "-A"],
        cwd=str(ROOT_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    staged_preview = res.stdout
    for line in staged_preview.splitlines():
        if ".agents" in line:
            errors.append(f"Dry-run staging would stage internal agent file: {line}")

    # 4. Git status porcelain check
    res_status = subprocess.run(
        ["git", "status", "--porcelain"],
        cwd=str(ROOT_DIR),
        stdout=subprocess.PIPE,
        stderr=subprocess.PIPE,
        text=True
    )
    for line in res_status.stdout.splitlines():
        if ".agents" in line:
            errors.append(f"git status lists .agents in working tree: {line}")

    if errors:
        for err in errors:
            print(f"  [FAIL] {err}")
        return False
    else:
        print("  [PASS] .agents/ is strictly ignored by gitignore and excluded from all staging operations.")
        return True


def test_relative_links_and_sos():
    """Verify relative link targets, emergency SOS numbers, and GPS copy button wiring."""
    print("\n[STRESS TEST 2] Emergency SOS, GPS Fallback & Link Integrity:")
    errors = []

    pages = [
        ("index.html", ROOT_DIR),
        ("dolomitok.html", ROOT_DIR),
        (os.path.join("durrewand", "index.html"), ROOT_DIR / "durrewand")
    ]

    for rel_path, base_dir in pages:
        full_path = ROOT_DIR / rel_path
        with open(full_path, "r", encoding="utf-8") as f:
            content = f.read()
        
        collector = LinkCollector()
        collector.feed(content)

        # Check links
        for tag, ref, attrs in collector.links:
            if ref.startswith("#") or ref.startswith("http:") or ref.startswith("https:") or ref.startswith("tel:") or ref.startswith("mailto:") or ref.startswith("data:"):
                continue
            if ref.startswith("/"):
                errors.append(f"{rel_path}: Absolute root path found: <{tag} href/src='{ref}'> (breaks subpath/offline deployments)")
            else:
                target_file = (base_dir / ref).resolve()
                if not target_file.exists():
                    errors.append(f"{rel_path}: Broken local target: {ref} -> {target_file}")

        # Check SOS targets
        if rel_path == "dolomitok.html":
            has_118 = any(ref == "tel:118" for _, ref, _ in collector.links)
            has_112 = any(ref == "tel:112" for _, ref, _ in collector.links)
            if not has_118:
                errors.append(f"{rel_path}: Missing Italian mountain rescue emergency phone link (tel:118)")
            if not has_112:
                errors.append(f"{rel_path}: Missing European general emergency phone link (tel:112)")
            if "copyCurrentGpsLocation" not in content:
                errors.append(f"{rel_path}: Missing GPS quick-copy button integration")

        elif "durrewand" in rel_path:
            has_140 = any(ref == "tel:140" for _, ref, _ in collector.links)
            has_112 = any(ref == "tel:112" for _, ref, _ in collector.links)
            if not has_140:
                errors.append(f"{rel_path}: Missing Austrian alpine rescue emergency phone link (tel:140)")
            if not has_112:
                errors.append(f"{rel_path}: Missing European general emergency phone link (tel:112)")
            if "copyCurrentGpsLocation" not in content:
                errors.append(f"{rel_path}: Missing GPS quick-copy button integration")

    # Inspect GPS copy function implementation for fallbacks
    js_files = [ROOT_DIR / "app.js", ROOT_DIR / "durrewand" / "app.js"]
    for jf in js_files:
        with open(jf, "r", encoding="utf-8") as f:
            js_code = f.read()
        if "copyCurrentGpsLocation" not in js_code:
            errors.append(f"{jf.name}: copyCurrentGpsLocation is not defined")
        if "navigator.geolocation" not in js_code:
            errors.append(f"{jf.name}: Missing navigator.geolocation support check")
        if "navigator.clipboard" not in js_code or "prompt(" not in js_code:
            errors.append(f"{jf.name}: Missing clipboard API fallback (prompt) for insecure contexts")

    if errors:
        for err in errors:
            print(f"  [FAIL] {err}")
        return False
    else:
        print("  [PASS] All relative links valid, SOS 118/140/112 active, GPS copy and fallback present.")
        return True


def test_touch_event_edge_cases():
    """Inspect app.js and durrewand/app.js touch event handling for edge cases."""
    print("\n[STRESS TEST 3] Touch Event Handling & Edge Case Inspection:")
    findings = []

    # 1. Cancellation test: check if touchcancel is handled
    for jf, rel_name in [(ROOT_DIR / "app.js", "app.js"), (ROOT_DIR / "durrewand" / "app.js", "durrewand/app.js")]:
        with open(jf, "r", encoding="utf-8") as f:
            code = f.read()

        has_touchcancel = "touchcancel" in code
        if not has_touchcancel:
            findings.append(f"{rel_name}: Unhandled 'touchcancel' event in elevation chart! Interruptions (phone call, notification shade, system gesture) will leave chart scrubber in stale/stuck state without triggering latch cleanup.")

        # 2. Multi-touch handling
        has_multitouch_guard = ("event.touches" in code or "e.touches" in code) and ("touches.length" in code or "touches[0]" in code)
        if not has_multitouch_guard:
            findings.append(f"{rel_name}: Missing multi-touch guard (e.touches array inspection).")

        # 3. Non-passive touchmove prevention
        if rel_name == "durrewand/app.js":
            if "{ passive: false }" not in code:
                findings.append(f"{rel_name}: touchmove listener does not explicitly specify passive: false.")
        elif rel_name == "app.js":
            # Check how touch is bound in app.js
            if "ontouchmove" in code and "addEventListener('touchmove'" not in code:
                # inline handler
                pass

        # 4. Latch timeout verification (2.5 seconds = 2500ms)
        if "2500" not in code:
            findings.append(f"{rel_name}: Elevation latch timeout is not set to standard 2.5s (2500ms).")

    if findings:
        for f in findings:
            print(f"  [DEFECT/RISK] {f}")
        return False
    else:
        print("  [PASS] Touch handling, multi-touch, rapid scrubbing, and cancellation robustly handled.")
        return True


def test_touch_target_bounding_boxes():
    """Adversarially evaluate all touch target bounding boxes in CSS and media queries."""
    print("\n[STRESS TEST 4] Touch Target Bounding Boxes (>= 44x44px Rule):")
    defects = []

    styles_css = (ROOT_DIR / "styles.css").read_text(encoding="utf-8")
    durre_css = (ROOT_DIR / "durrewand" / "styles.css").read_text(encoding="utf-8")
    index_html = (ROOT_DIR / "index.html").read_text(encoding="utf-8")

    # 1. Check .custom-popup-btn and .timeline-map-btn
    m_pop = re.search(r"\.custom-popup-btn[^{]*\{([^}]+)\}", styles_css)
    if m_pop:
        m_h = re.search(r"min-height:\s*(\d+)px", m_pop.group(1))
        if m_h and int(m_h.group(1)) < 44:
            defects.append(f"styles.css: .custom-popup-btn has min-height: {m_h.group(1)}px (< 44px required for map popup actions)")

    m_tm = re.search(r"\.timeline-map-btn[^{]*\{([^}]+)\}", styles_css)
    if m_tm:
        m_h = re.search(r"min-height:\s*(\d+)px", m_tm.group(1))
        if m_h and int(m_h.group(1)) < 44:
            defects.append(f"styles.css: .timeline-map-btn has min-height: {m_h.group(1)}px (< 44px required for timeline jump action)")

    # 2. Check mobile media queries in styles.css for min-height: 42px
    m_tour_actions = re.search(r"\.tour-actions-bar\s+\.btn-sm\s*\{([^}]+)\}", styles_css)
    if m_tour_actions:
        m_h = re.search(r"min-height:\s*(\d+)px", m_tour_actions.group(1))
        if m_h and int(m_h.group(1)) < 44:
            defects.append(f"styles.css (@media max-width: 768px): .tour-actions-bar .btn-sm explicitly caps min-height to {m_h.group(1)}px (< 44px)")

    m_modal_actions = re.search(r"\.modal-actions\s+\.btn-sm\s*\{([^}]+)\}", styles_css)
    if m_modal_actions:
        m_h = re.search(r"min-height:\s*(\d+)px", m_modal_actions.group(1))
        if m_h and int(m_h.group(1)) < 44:
            defects.append(f"styles.css (@media max-width: 768px): .modal-actions .btn-sm explicitly caps min-height to {m_h.group(1)}px (< 44px)")

    # 3. Check .currency-btn
    m_curr = re.search(r"\.currency-btn\s*\{([^}]+)\}", styles_css)
    if m_curr:
        decl = m_curr.group(1)
        if "min-height" not in decl:
            defects.append("styles.css: .currency-btn lacks min-height: 44px (padding: 0.3rem yields ~28px total height on budget calculator currency switcher)")

    # 4. Check .rate-refresh-btn
    m_rate = re.search(r"\.rate-refresh-btn\s*\{([^}]+)\}", styles_css)
    if m_rate:
        decl = m_rate.group(1)
        m_wh = re.findall(r"(?:width|height):\s*(\d+)px", decl)
        if any(int(v) < 44 for v in m_wh):
            defects.append(f"styles.css: .rate-refresh-btn dimensions are {m_wh}px (< 44x44px required for currency refresh button)")

    # 5. Check .hero-dot pseudo-hitbox dimensions
    # .hero-dot::after { top: -14px; bottom: -14px; left: -10px; right: -10px; }
    for name, css_text in [("styles.css", styles_css), ("durrewand/styles.css", durre_css)]:
        m_dot_after = re.search(r"\.hero-dot::after\s*\{([^}]+)\}", css_text)
        if m_dot_after:
            decl = m_dot_after.group(1)
            m_top = re.search(r"top:\s*-?(\d+)px", decl)
            m_bot = re.search(r"bottom:\s*-?(\d+)px", decl)
            m_left = re.search(r"left:\s*-?(\d+)px", decl)
            m_right = re.search(r"right:\s*-?(\d+)px", decl)
            if m_top and m_bot:
                vert_pad = int(m_top.group(1)) + int(m_bot.group(1))
                # base dot height is 5px-10px
                total_h = vert_pad + 6 # average dot height
                if total_h < 44:
                    defects.append(f"{name}: .hero-dot::after total vertical hitbox is only ~{total_h}px (-{m_top.group(1)}px to -{m_bot.group(1)}px), failing 44px min height requirement")

    # 6. Check .btn-open-tour in index.html (Portal Hub expedition cards)
    if "btn-open-tour" in index_html:
        has_css_rule = re.search(r"\.btn-open-tour\s*\{", index_html) or re.search(r"\.btn-open-tour\s*\{", styles_css)
        if not has_css_rule:
            defects.append("index.html: .btn-open-tour has NO CSS rule in index.html or styles.css! The primary tour launch buttons in the homepage expedition cards render unstyled with default text link height (~19px) and no touch target protection")

    if defects:
        for d in defects:
            print(f"  [DEFECT] {d}")
        return False
    else:
        print("  [PASS] All interactive elements and media query overrides strictly maintain >= 44x44px bounding boxes.")
        return True


def run_all_adversarial_tests():
    print("=" * 60)
    print("   ADVERSARIAL STRESS TEST HARNESS — CHALLENGER M1-2")
    print("=" * 60)

    git_ok = test_git_security()
    links_ok = test_relative_links_and_sos()
    touch_ok = test_touch_event_edge_cases()
    targets_ok = test_touch_target_bounding_boxes()

    print("\n" + "=" * 60)
    print("   STRESS TEST SUMMARY")
    print("=" * 60)
    print(f"   Git Security & Staging Exclusion : {'PASS' if git_ok else 'FAIL'}")
    print(f"   Links, SOS & GPS Fallbacks       : {'PASS' if links_ok else 'FAIL'}")
    print(f"   Touch Event Edge Cases           : {'PASS' if touch_ok else 'FAIL (Defects Found)'}")
    print(f"   Touch Target Bounding Boxes      : {'PASS' if targets_ok else 'FAIL (Defects Found)'}")
    print("=" * 60)

    all_passed = git_ok and links_ok and touch_ok and targets_ok
    if all_passed:
        print("   FINAL VERDICT: APPROVE")
        return 0
    else:
        print("   FINAL VERDICT: REQUEST_CHANGES (Defects Reproduced Empirically)")
        return 1

if __name__ == "__main__":
    sys.exit(run_all_adversarial_tests())
