// LordTúra - Neumorphism / Soft UI Theme Switcher (Figma 2026 Trend 8)
// Supports: Light Neumorphism (Soft Alpine UI) ↔ Dark Neumorphism (Charcoal Soft UI)
(function() {
  function applyTheme(theme) {
    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
    } else {
      document.documentElement.removeAttribute('data-theme');
    }
    updateButtons(theme);
  }

  function updateButtons(theme) {
    const isDark = theme === 'dark';
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
      localStorage.setItem('lordtura_theme', next);
    } catch(e) {}
    applyTheme(next);
  };

  document.addEventListener('DOMContentLoaded', function() {
    let saved = 'light';
    try {
      saved = localStorage.getItem('lordtura_theme') || 'light';
    } catch(e) {}
    updateButtons(saved);

    document.querySelectorAll('.neo-theme-toggle').forEach(btn => {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        window.toggleNeoTheme();
      });
    });
  });
})();
