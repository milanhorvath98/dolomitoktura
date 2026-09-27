// LordTúra - Neumorphism / Soft UI Theme Switcher (Figma 2026 Trend 8)
// Supports: Dark Neumorphism (Default Charcoal Soft UI) ↔ Light Neumorphism (Soft Alpine UI)
(function() {
  function applyTheme(theme) {
    if (theme === 'light') {
      document.documentElement.removeAttribute('data-theme');
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    updateButtons(theme);
  }

  function updateButtons(theme) {
    const isDark = theme !== 'light';
    const iconClass = isDark ? 'fa-sun' : 'fa-moon';
    const label = isDark ? 'VILÁGOS' : 'SÖTÉT';
    
    document.querySelectorAll('.neo-theme-toggle').forEach(btn => {
      const icon = btn.querySelector('i');
      const span = btn.querySelector('span');
      if (icon) icon.className = 'fa-solid ' + iconClass;
      if (span) span.textContent = label;
      btn.title = isDark ? 'Váltás Neumorphic Világos Módra' : 'Váltás Neumorphic Sötét Módra';
    });
  }

  window.toggleNeoTheme = function() {
    const current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    try {
      localStorage.setItem('lordtura_theme_v2', next);
      localStorage.setItem('lordtura_theme', next);
    } catch(e) {}
    applyTheme(next);
  };

  document.addEventListener('DOMContentLoaded', function() {
    let saved = 'dark';
    try {
      const stored = localStorage.getItem('lordtura_theme_v2') || localStorage.getItem('lordtura_theme');
      if (stored === 'light') {
        saved = 'light';
      } else {
        saved = 'dark';
        localStorage.setItem('lordtura_theme_v2', 'dark');
        localStorage.setItem('lordtura_theme', 'dark');
      }
    } catch(e) {
      saved = 'dark';
    }
    applyTheme(saved);

    document.querySelectorAll('.neo-theme-toggle').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.toggleNeoTheme();
      });
    });
  });
})();
