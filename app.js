// Dolomitok Expedíció - Interaktív Webalkalmazás Logika
// (Térképkezelés, Valós GPX Megjelenítés, Szűrés, GPX Letöltés, Költségvetés Számoló, Csekklista)

document.addEventListener('DOMContentLoaded', () => {
  initHeroMedia();
  initNavigation();
  initMobileDrawer();
  initMobileBottomNav();
  initScrollToTop();
  initMap();
  renderDaysAndTours();
  initTimeline();
  initWeatherSection();
  initHutsSection();
  initBudgetCalculator();
  initChecklist();
  renderGpxHub();
  initLogistics();
  initParkingHub();
  initModalListeners();
  initImageFallbacks();
});

function initImageFallbacks() {
  // CSP-barát, inline-kód mentes képbetöltési fallback kezelő
  document.addEventListener('error', (e) => {
    const target = e.target;
    if (target && target.tagName === 'IMG' && target.dataset && target.dataset.fallback) {
      if (target.src !== target.dataset.fallback) {
        target.src = target.dataset.fallback;
      }
    }
  }, true);
}

/* ==========================================================================
   Globális Állapot & Térkép Változók
   ========================================================================== */
let map;
let mapLayers = {
  routes: {},
  pois: [],
  dayGroups: {},
  elevationMarker: null
};
let activeFilters = {
  day: 'all',
  team: 'all'
};
let currentCurrency = 'HUF';
let currentTier = 'medium'; // budget, medium, premium
let participantCount = 10;

/* ==========================================================================
   Hero Média Kezelő: Dinamikus Diavetítés & Alpesi Drónvideó Háttér
   ========================================================================== */
function initHeroMedia() {
  const slides = Array.from(document.querySelectorAll('.hero-slide'));
  const indicatorsContainer = document.getElementById('hero-indicators');
  const prevBtn = document.getElementById('hero-prev-btn');
  const nextBtn = document.getElementById('hero-next-btn');
  const playPauseBtn = document.getElementById('hero-play-pause-btn');
  const videoToggleBtn = document.getElementById('hero-video-toggle-btn');
  const videoContainer = document.getElementById('hero-video-container');
  const videoPlayer = document.getElementById('hero-video-player');
  const photoTag = document.getElementById('hero-photo-tag');
  const photoTagText = document.getElementById('hero-photo-tag-text');
  const photoTagBadge = document.getElementById('hero-tag-badge');
  const photoTagIcon = document.getElementById('hero-photo-tag-icon');
  const heroHeader = document.getElementById('hero-header');

  if (!slides.length) return;

  let currentIndex = 0;
  let isPlaying = true;
  let isVideoMode = false;
  let slideTimer = null;
  const slideDuration = 6000; // 6 másodperc / helyszín

  // Indikátor pontok legenerálása
  if (indicatorsContainer) {
    indicatorsContainer.innerHTML = slides.map((slide, idx) => {
      const loc = slide.dataset.location || `Helyszín ${idx + 1}`;
      const badge = slide.dataset.badge || '';
      return `
        <button type="button" class="hero-dot ${idx === 0 ? 'active' : ''}" 
                data-index="${idx}" 
                title="${loc} (${badge})" 
                aria-label="${loc}">
        </button>
      `;
    }).join('');

    indicatorsContainer.querySelectorAll('.hero-dot').forEach(dot => {
      dot.addEventListener('click', () => {
        const idx = parseInt(dot.dataset.index, 10);
        if (!isNaN(idx)) {
          if (isVideoMode) disableVideoMode();
          goToSlide(idx, true);
        }
      });
    });
  }

  function updateTagContent(location, info, badge, iconClass = 'fa-camera') {
    if (photoTagText) {
      photoTagText.innerHTML = `Helyszín: <strong>${location}</strong> &bull; ${info}`;
    }
    if (photoTagBadge) {
      photoTagBadge.textContent = badge;
    }
    if (photoTagIcon) {
      photoTagIcon.className = `fa-solid ${iconClass}`;
    }
  }

  function goToSlide(newIndex, resetTimer = false) {
    if (newIndex < 0) {
      currentIndex = slides.length - 1;
    } else if (newIndex >= slides.length) {
      currentIndex = 0;
    } else {
      currentIndex = newIndex;
    }

    // Slide rétegek frissítése
    slides.forEach((slide, idx) => {
      slide.classList.toggle('active', idx === currentIndex);
    });

    // Indikátor pontok frissítése
    if (indicatorsContainer) {
      const dots = indicatorsContainer.querySelectorAll('.hero-dot');
      dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === currentIndex);
      });
    }

    // Információs sáv frissítése
    const curSlide = slides[currentIndex];
    if (curSlide && !isVideoMode) {
      const loc = curSlide.dataset.location || 'Dolomitok';
      const info = curSlide.dataset.info || '';
      const badge = curSlide.dataset.badge || '';
      updateTagContent(loc, info, badge, 'fa-camera');
    }

    if (resetTimer && isPlaying && !isVideoMode) {
      restartTimer();
    }
  }

  function nextSlide(userAction = false) {
    goToSlide(currentIndex + 1, userAction);
  }

  function prevSlide(userAction = false) {
    goToSlide(currentIndex - 1, userAction);
  }

  function startTimer() {
    stopTimer();
    if (isPlaying && !isVideoMode) {
      slideTimer = setInterval(() => {
        nextSlide(false);
      }, slideDuration);
    }
  }

  function stopTimer() {
    if (slideTimer) {
      clearInterval(slideTimer);
      slideTimer = null;
    }
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  function enableVideoMode() {
    isVideoMode = true;
    stopTimer();
    if (videoContainer) videoContainer.classList.add('active');
    if (videoToggleBtn) {
      videoToggleBtn.classList.add('active');
      const label = videoToggleBtn.querySelector('.video-btn-label');
      if (label) label.textContent = 'Diavetítés';
    }
    if (videoPlayer) {
      videoPlayer.currentTime = 0;
      videoPlayer.play().catch(e => console.log('Video autoplay prevented:', e));
    }
    updateTagContent('Sass Pordoi & Sella Csoport', 'Alpesi Drónpanoráma (2 950 m)', 'Drónvideó', 'fa-film');
    if (playPauseBtn) {
      playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
      playPauseBtn.title = 'Videó szüneteltetése';
    }
  }

  function disableVideoMode() {
    isVideoMode = false;
    if (videoContainer) videoContainer.classList.remove('active');
    if (videoToggleBtn) {
      videoToggleBtn.classList.remove('active');
      const label = videoToggleBtn.querySelector('.video-btn-label');
      if (label) label.textContent = 'Drónvideó';
    }
    if (videoPlayer) {
      videoPlayer.pause();
    }
    const curSlide = slides[currentIndex];
    if (curSlide) {
      updateTagContent(
        curSlide.dataset.location || 'Dolomitok',
        curSlide.dataset.info || '',
        curSlide.dataset.badge || '',
        'fa-camera'
      );
    }
    if (isPlaying) {
      startTimer();
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playPauseBtn.title = 'Diavetítés megállítása';
      }
    } else {
      if (playPauseBtn) {
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playPauseBtn.title = 'Diavetítés indítása';
      }
    }
  }

  // Eseménykezelők
  if (prevBtn) {
    prevBtn.addEventListener('click', () => {
      if (isVideoMode) disableVideoMode();
      prevSlide(true);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', () => {
      if (isVideoMode) disableVideoMode();
      nextSlide(true);
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', () => {
      if (isVideoMode) {
        if (videoPlayer) {
          if (videoPlayer.paused) {
            videoPlayer.play();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
            playPauseBtn.title = 'Videó szüneteltetése';
          } else {
            videoPlayer.pause();
            playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
            playPauseBtn.title = 'Videó lejátszása';
          }
        }
      } else {
        isPlaying = !isPlaying;
        if (isPlaying) {
          playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
          playPauseBtn.title = 'Diavetítés megállítása';
          startTimer();
        } else {
          playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
          playPauseBtn.title = 'Diavetítés indítása';
          stopTimer();
        }
      }
    });
  }

  if (videoToggleBtn) {
    videoToggleBtn.addEventListener('click', () => {
      if (isVideoMode) {
        disableVideoMode();
      } else {
        enableVideoMode();
      }
    });
  }

  // Kattintás a fotójelölőre: odaugrik az adott napi túrához a térképen
  if (photoTag) {
    photoTag.addEventListener('click', () => {
      if (isVideoMode) {
        // Drónvideó esetén a Sass Pordoi / Passo Sella napra (3. nap) ugrik
        if (typeof window.jumpToDayFromDrawer === 'function') {
          window.jumpToDayFromDrawer(3);
        }
      } else {
        const curSlide = slides[currentIndex];
        const day = curSlide ? parseInt(curSlide.dataset.day, 10) : 1;
        if (!isNaN(day) && typeof window.jumpToDayFromDrawer === 'function') {
          window.jumpToDayFromDrawer(day);
        }
      }
    });

    photoTag.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        photoTag.click();
      }
    });
  }

  // Érintéses ujjhúzás (Swipe) mobilon a hero szekcióban
  if (heroHeader) {
    let touchStartX = 0;
    let touchStartY = 0;

    heroHeader.addEventListener('touchstart', (e) => {
      if (e.touches && e.touches.length === 1) {
        touchStartX = e.touches[0].clientX;
        touchStartY = e.touches[0].clientY;
      }
    }, { passive: true });

    heroHeader.addEventListener('touchend', (e) => {
      if (e.changedTouches && e.changedTouches.length === 1) {
        const touchEndX = e.changedTouches[0].clientX;
        const touchEndY = e.changedTouches[0].clientY;
        const diffX = touchEndX - touchStartX;
        const diffY = touchEndY - touchStartY;

        // Csak akkor lapozunk, ha döntően vízszintes a húzás
        if (Math.abs(diffX) > 45 && Math.abs(diffX) > Math.abs(diffY) * 1.5) {
          if (diffX < 0) {
            if (isVideoMode) disableVideoMode();
            nextSlide(true);
          } else {
            if (isVideoMode) disableVideoMode();
            prevSlide(true);
          }
        }
      }
    }, { passive: true });
  }

  // Billentyűzet nyilak kezelése
  document.addEventListener('keydown', (e) => {
    // Csak ha nem beviteli mezőben van a fókusz és a lap tetején tartózkodunk
    if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName)) return;
    if (window.scrollY < 600) {
      if (e.key === 'ArrowLeft') {
        if (isVideoMode) disableVideoMode();
        prevSlide(true);
      } else if (e.key === 'ArrowRight') {
        if (isVideoMode) disableVideoMode();
        nextSlide(true);
      }
    }
  });

  // Erőforrás-kímélés: szüneteltetés ha a böngészőfül háttérbe kerül
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      stopTimer();
      if (isVideoMode && videoPlayer && !videoPlayer.paused) {
        videoPlayer.pause();
      }
    } else {
      if (isVideoMode && videoPlayer) {
        videoPlayer.play().catch(() => {});
      } else if (isPlaying) {
        startTimer();
      }
    }
  });

  // Diavetítés automatikus indítása
  startTimer();
}

/* ==========================================================================
   Navigáció, Szekcióváltás & Mobil Kezelők
   ========================================================================== */
function initNavigation() {
  const navTabs = document.querySelectorAll('.nav-tab');
  navTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetSection = tab.dataset.section;
      if (targetSection) switchSection(targetSection);
    });
  });

  const brandLogo = document.getElementById('nav-brand-logo');
  if (brandLogo) {
    brandLogo.addEventListener('click', (e) => {
      e.preventDefault();
      switchSection('tours-section');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }

  // Egérgörgő vízszintes görgetés támogatása a füleknél
  const navTabsContainer = document.querySelector('.nav-tabs');
  if (navTabsContainer) {
    navTabsContainer.addEventListener('wheel', (e) => {
      if (e.deltaY !== 0 && navTabsContainer.scrollWidth > navTabsContainer.clientWidth) {
        e.preventDefault();
        navTabsContainer.scrollLeft += e.deltaY;
      }
    }, { passive: false });
  }
}

function switchSection(targetSection) {
  const sections = document.querySelectorAll('.section');
  const navTabs = document.querySelectorAll('.nav-tab');
  const drawerItems = document.querySelectorAll('.drawer-nav-item');
  const bottomItems = document.querySelectorAll('.bottom-nav-item[data-section]');

  // Szinkronizálás az asztali tabokkal
  navTabs.forEach(t => t.classList.toggle('active', t.dataset.section === targetSection));
  // Szinkronizálás a mobil drawer elemekkel
  drawerItems.forEach(t => t.classList.toggle('active', t.dataset.section === targetSection));
  // Szinkronizálás a mobil alsó menüvel
  bottomItems.forEach(t => t.classList.toggle('active', t.dataset.section === targetSection));

  sections.forEach(sec => {
    if (sec.id === targetSection) {
      sec.classList.add('active');
      if (targetSection === 'tours-section' && map) {
        setTimeout(() => map.invalidateSize(), 200);
      }
      if (targetSection === 'budget-section') {
        triggerLazyRateFetch();
      }
      if (targetSection === 'weather-section') {
        fetchWeatherData();
      }
    } else {
      sec.classList.remove('active');
    }
  });

  closeMobileDrawer();

  // Asztali és mobil nézetben is finoman görgessünk a navigációs sávhoz / tartalomhoz
  const nav = document.querySelector('.main-nav');
  if (nav) {
    const navTop = nav.offsetTop;
    if (window.scrollY < navTop - 10) {
      window.scrollTo({ top: navTop, behavior: 'smooth' });
    } else if (window.scrollY > navTop + 120) {
      window.scrollTo({ top: navTop, behavior: 'smooth' });
    }
  }
}

function initMobileDrawer() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const bottomMenuBtn = document.getElementById('bottom-menu-trigger');
  const closeBtn = document.getElementById('drawer-close-btn');
  const overlay = document.getElementById('mobile-drawer-overlay');

  if (toggleBtn) toggleBtn.addEventListener('click', toggleMobileDrawer);
  if (bottomMenuBtn) bottomMenuBtn.addEventListener('click', toggleMobileDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeMobileDrawer);
  if (overlay) overlay.addEventListener('click', closeMobileDrawer);

  const drawerItems = document.querySelectorAll('.drawer-nav-item');
  drawerItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.dataset.section;
      if (sec) switchSection(sec);
    });
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMobileDrawer();
  });
}

window.toggleMobileDrawer = function() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (drawer && overlay) {
    const isOpen = drawer.classList.contains('open');
    if (isOpen) {
      drawer.classList.remove('open');
      overlay.classList.remove('open');
      document.body.style.overflow = '';
    } else {
      drawer.classList.add('open');
      overlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }
};

window.closeMobileDrawer = function() {
  const drawer = document.getElementById('mobile-drawer');
  const overlay = document.getElementById('mobile-drawer-overlay');
  if (drawer && overlay) {
    drawer.classList.remove('open');
    overlay.classList.remove('open');
    document.body.style.overflow = '';
  }
};

window.jumpToDayFromDrawer = function(dayNum) {
  switchSection('tours-section');
  closeMobileDrawer();
  filterMapToDay(dayNum);
  setTimeout(() => {
    const card = document.getElementById(`day-card-${dayNum}`);
    if (card) {
      card.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }, 350);
};

function initMobileBottomNav() {
  const bottomItems = document.querySelectorAll('.bottom-nav-item[data-section]');
  bottomItems.forEach(item => {
    item.addEventListener('click', () => {
      const sec = item.dataset.section;
      if (sec) switchSection(sec);
    });
  });
}

window.scrollToCurrentElevation = function() {
  switchSection('tours-section');
  setTimeout(() => {
    const elev = document.querySelector('.elevation-profile-container');
    if (elev) {
      elev.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, 250);
};

function initScrollToTop() {
  const btn = document.getElementById('floating-map-jump-btn');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 450) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });
}

window.scrollToMapOrTop = function() {
  const mapEl = document.getElementById('leaflet-map');
  if (mapEl) {
    mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

/* ==========================================================================
   Interaktív Leaflet Térkép Inicializálása
   ========================================================================== */
function initMap() {
  const mapElement = document.getElementById('leaflet-map');
  if (!mapElement) return;

  // Alapértelmezett nézet a Dolomitok szívére
  map = L.map('leaflet-map', {
    center: [46.57, 12.05],
    zoom: 11,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // Alaptérkép Rétegek
  const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Map data: &copy; OpenStreetMap, SRTM | Map style: &copy; OpenTopoMap'
  });

  const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 18,
    attribution: 'Tiles &copy; Esri &mdash; Source: Esri, USGS'
  });

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  });

  // Alapértelmezett: Gyönyörű Topo réteg hegydomborzattal
  topoLayer.addTo(map);

  const baseMaps = {
    "🏔️ Alpesi Topográfia (OpenTopo)": topoLayer,
    "🛰️ Műholdas Nézet (Esri Satellite)": satLayer,
    "🗺️ Szabványos Utcatérkép (OSM)": osmLayer
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(map);

  // Valós GPX nyomvonalak és Markerek kirajzolása
  drawAllRoutes();
  drawPointsOfInterest();
  initMapFilterButtons();
}

/* ==========================================================================
   Valós GPX Útvonalak Kirajzolása a Térképre
   ========================================================================== */
function drawAllRoutes() {
  EXPEDITION_DATA.days.forEach(day => {
    const dayKey = `day${day.dayNumber}`;
    mapLayers.dayGroups[dayKey] = [];

    // 1. Mászó Útvonal (Valós geodéziai GPX)
    if (day.climberProgram && day.climberProgram.routeCoordinates) {
      const climberPoly = L.polyline(day.climberProgram.routeCoordinates, {
        color: '#ef4444',
        weight: 5,
        opacity: 0.88,
        lineCap: 'round',
        lineJoin: 'round'
      });

      const ptCount = day.climberProgram.routeCoordinates.length;
      const popupHtml = `
        <div class="custom-popup-box">
          <span class="custom-popup-badge" style="background: rgba(190, 18, 60, 0.2); color: var(--climber-color);">${day.dayNumber}. Nap • Mászó Csapat</span>
          <h4>${day.climberProgram.name}</h4>
          <p><strong>Cél:</strong> ${day.climberProgram.target}</p>
          <div class="custom-popup-badges">
            <span class="custom-popup-badge" style="background:#334155;color:#fff;">Nehézség: ${day.climberProgram.difficulty}</span>
            <span class="custom-popup-badge" style="background:#334155;color:#fff;">${day.climberProgram.duration}</span>
            <span class="custom-popup-badge" style="background:#334155;color:#fff;">${day.climberProgram.ascent}</span>
            <span class="custom-popup-badge" style="background:rgba(3,105,161,0.2);color:var(--accent-blue);"><i class="fa-solid fa-satellite-dish"></i> ${ptCount} GPS pont</span>
          </div>
          <div style="margin-top:0.6rem;display:flex;gap:4px;">
            <button class="custom-popup-btn" onclick="openTourModal('${day.climberProgram.id}')">Részletek &rarr;</button>
            <button class="custom-popup-btn" style="background:#10b981;color:#fff;" onclick="downloadGPX('${day.climberProgram.id}')">
              <i class="fa-solid fa-download"></i> GPX
            </button>
          </div>
        </div>
      `;
      climberPoly.bindPopup(popupHtml);

      // Beszállás / kezdőpont marker
      const startMarker = createCustomMarker(
        day.climberProgram.startCoords,
        'fa-person-hiking',
        '#ef4444',
        `${day.climberProgram.name} (Beszállás)`
      );

      mapLayers.routes[day.climberProgram.id] = {
        layer: climberPoly,
        marker: startMarker,
        team: 'climber',
        day: day.dayNumber
      };
      climberPoly.addTo(map);
      startMarker.addTo(map);
    }

    // 2. Túrázó Útvonal (Valós geodéziai GPX)
    if (day.hikerProgram && day.hikerProgram.routeCoordinates) {
      const hikerPoly = L.polyline(day.hikerProgram.routeCoordinates, {
        color: '#10b981',
        weight: 5,
        opacity: 0.88,
        lineCap: 'round',
        lineJoin: 'round'
      });

      const ptCount = day.hikerProgram.routeCoordinates.length;
      const popupHtml = `
        <div class="custom-popup-box">
          <span class="custom-popup-badge" style="background: rgba(4, 120, 87, 0.2); color: var(--hiker-color);">${day.dayNumber}. Nap • Túrázó Csapat</span>
          <h4>${day.hikerProgram.name}</h4>
          <p><strong>Cél:</strong> ${day.hikerProgram.target}</p>
          <div class="custom-popup-badges">
            <span class="custom-popup-badge" style="background:#334155;color:#fff;">${day.hikerProgram.distance}</span>
            <span class="custom-popup-badge" style="background:#334155;color:#fff;">${day.hikerProgram.duration}</span>
            <span class="custom-popup-badge" style="background:#334155;color:#fff;">${day.hikerProgram.ascent}</span>
            <span class="custom-popup-badge" style="background:rgba(3,105,161,0.2);color:var(--accent-blue);"><i class="fa-solid fa-satellite-dish"></i> ${ptCount} GPS pont</span>
          </div>
          <div style="margin-top:0.6rem;display:flex;gap:4px;">
            <button class="custom-popup-btn" onclick="openTourModal('${day.hikerProgram.id}')">Részletek &rarr;</button>
            <button class="custom-popup-btn" style="background:#10b981;color:#fff;" onclick="downloadGPX('${day.hikerProgram.id}')">
              <i class="fa-solid fa-download"></i> GPX
            </button>
          </div>
        </div>
      `;
      hikerPoly.bindPopup(popupHtml);

      const startMarker = createCustomMarker(
        day.hikerProgram.startCoords,
        'fa-shoe-prints',
        '#10b981',
        `${day.hikerProgram.name} (Kiindulópont)`
      );

      mapLayers.routes[day.hikerProgram.id] = {
        layer: hikerPoly,
        marker: startMarker,
        team: 'hiker',
        day: day.dayNumber
      };
      hikerPoly.addTo(map);
      startMarker.addTo(map);
    }

    // 3. Közös Program (Valós geodéziai GPX)
    if (day.jointProgram && day.jointProgram.routeCoordinates) {
      const jointPoly = L.polyline(day.jointProgram.routeCoordinates, {
        color: '#f59e0b',
        weight: 5,
        opacity: 0.9,
        dashArray: '6, 8',
        lineCap: 'round'
      });

      const ptCount = day.jointProgram.routeCoordinates.length;
      const popupHtml = `
        <div class="custom-popup-box">
          <span class="custom-popup-badge" style="background: rgba(217, 119, 6, 0.2); color: var(--joint-color);">${day.dayNumber}. Nap • Közös Program</span>
          <h4>${day.jointProgram.name}</h4>
          <p><strong>Helyszín:</strong> ${day.jointProgram.target}</p>
          <p><strong>Időpont:</strong> ${day.jointProgram.time}</p>
          <div class="custom-popup-badges">
            <span class="custom-popup-badge" style="background:rgba(3,105,161,0.2);color:var(--accent-blue);"><i class="fa-solid fa-satellite-dish"></i> ${ptCount} GPS pont</span>
          </div>
          <div style="margin-top:0.6rem;display:flex;gap:4px;">
            <button class="custom-popup-btn" style="background:#10b981;color:#fff;" onclick="downloadGPX('${day.jointProgram.id}')">
              <i class="fa-solid fa-download"></i> GPX Letöltés
            </button>
          </div>
        </div>
      `;
      jointPoly.bindPopup(popupHtml);

      const jointMarker = createCustomMarker(
        day.jointProgram.coordinates,
        'fa-users',
        '#f59e0b',
        `${day.jointProgram.name} (Találkozópont)`
      );

      mapLayers.routes[day.jointProgram.id] = {
        layer: jointPoly,
        marker: jointMarker,
        team: 'joint',
        day: day.dayNumber
      };
      jointPoly.addTo(map);
      jointMarker.addTo(map);
    }
  });
}

/* ==========================================================================
   POI Markerek Kirajzolása
   ========================================================================== */
function drawPointsOfInterest() {
  EXPEDITION_DATA.pointsOfInterest.forEach(poi => {
    let color = '#38bdf8';
    if (poi.type === 'peak') color = '#fbbf24';
    if (poi.type === 'lake') color = '#06b6d4';
    if (poi.type === 'hut') color = '#f97316';
    if (poi.type === 'base') color = '#a855f7';

    const marker = createCustomMarker(poi.coords, poi.icon, color, poi.name);
    marker.bindPopup(`
      <div class="custom-popup-box">
        <h4>${poi.name}</h4>
        <p style="margin-bottom:0.2rem;">Kiemelt hegyi pont / tájékozódási helyszín</p>
        <span class="custom-popup-badge" style="background:#1e293b;color:#94a3b8;">GPS: ${poi.coords[0].toFixed(4)}, ${poi.coords[1].toFixed(4)}</span>
      </div>
    `);
    mapLayers.pois.push(marker);
    marker.addTo(map);
  });
}

function createCustomMarker(coords, faIcon, color, title) {
  const iconHtml = `
    <div style="
      background: ${color};
      width: 32px;
      height: 32px;
      border-radius: 50%;
      border: 2px solid #ffffff;
      box-shadow: 0 3px 10px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      color: #0b1120;
      font-size: 14px;
      cursor: pointer;
    ">
      <i class="fa-solid ${faIcon}"></i>
    </div>
  `;

  const customIcon = L.divIcon({
    className: 'custom-leaflet-marker',
    html: iconHtml,
    iconSize: [32, 32],
    iconAnchor: [16, 16],
    popupAnchor: [0, -18]
  });

  return L.marker(coords, { icon: customIcon, title: title });
}

/* ==========================================================================
   Térképszűrő Kezelők (Nap & Csapat)
   ========================================================================== */
function initMapFilterButtons() {
  const dayBtns = document.querySelectorAll('.day-filter-btn');
  const teamBtns = document.querySelectorAll('.team-filter-btn');

  dayBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      dayBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.day = btn.dataset.day;
      applyMapFilters();
    });
  });

  teamBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      teamBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.team = btn.dataset.team;
      applyMapFilters();
    });
  });
}

function applyMapFilters() {
  const visibleBounds = [];

  Object.values(mapLayers.routes).forEach(routeObj => {
    const dayMatch = (activeFilters.day === 'all' || routeObj.day.toString() === activeFilters.day);
    const teamMatch = (activeFilters.team === 'all' || routeObj.team === activeFilters.team);

    if (dayMatch && teamMatch) {
      if (!map.hasLayer(routeObj.layer)) map.addLayer(routeObj.layer);
      if (!map.hasLayer(routeObj.marker)) map.addLayer(routeObj.marker);
      visibleBounds.push(routeObj.layer.getBounds());
    } else {
      if (map.hasLayer(routeObj.layer)) map.removeLayer(routeObj.layer);
      if (map.hasLayer(routeObj.marker)) map.removeLayer(routeObj.marker);
    }
  });

  if (visibleBounds.length > 0) {
    let combinedBounds = visibleBounds[0];
    for (let i = 1; i < visibleBounds.length; i++) {
      combinedBounds = combinedBounds.extend(visibleBounds[i]);
    }
    map.flyToBounds(combinedBounds, { padding: [40, 40], maxZoom: 14, duration: 1 });
  }
}

/* ==========================================================================
   Fókuszálás Egyetlen Túrára a Térképen (Gombra kattintva)
   ========================================================================== */
window.focusOnMap = function(tourId) {
  document.querySelector('.nav-tab[data-section="tours-section"]').click();
  
  const routeObj = mapLayers.routes[tourId];
  if (!routeObj) return;

  if (!map.hasLayer(routeObj.layer)) map.addLayer(routeObj.layer);
  if (!map.hasLayer(routeObj.marker)) map.addLayer(routeObj.marker);

  map.flyToBounds(routeObj.layer.getBounds(), { padding: [50, 50], maxZoom: 14, duration: 1.2 });
  setTimeout(() => {
    routeObj.layer.openPopup();
  }, 1200);

  document.getElementById('leaflet-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
};

/* ==========================================================================
   Szintrajz & Magasságprofil Kezelők (SVG Generator, Hover & Map Sync)
   ========================================================================== */

function highlightElevationPointOnMap(lat, lon, ele, team) {
  if (!map || !lat || !lon) return;

  const color = team === 'climber' ? '#ef4444' : (team === 'hiker' ? '#10b981' : '#f59e0b');

  if (mapLayers.elevationMarker) {
    mapLayers.elevationMarker.setLatLng([lat, lon]);
    mapLayers.elevationMarker.setTooltipContent(`⛰️ ${Math.round(ele)} m`);
  } else {
    const pulseIcon = L.divIcon({
      className: 'elevation-map-marker-pulse',
      html: `<div style="--marker-color: ${color}; width:100%; height:100%;"></div>`,
      iconSize: [18, 18],
      iconAnchor: [9, 9]
    });

    mapLayers.elevationMarker = L.marker([lat, lon], {
      icon: pulseIcon,
      zIndexOffset: 3000
    }).addTo(map);

    mapLayers.elevationMarker.bindTooltip(`⛰️ ${Math.round(ele)} m`, {
      permanent: true,
      direction: 'top',
      className: 'custom-elevation-tooltip',
      offset: [0, -10]
    });
  }
}

function clearElevationMapHighlight() {
  if (mapLayers.elevationMarker && map) {
    map.removeLayer(mapLayers.elevationMarker);
    mapLayers.elevationMarker = null;
  }
}

let elevationTouchLatchTimers = {};

window.handleElevationHover = function(event, containerId) {
  if (elevationTouchLatchTimers[containerId]) {
    clearTimeout(elevationTouchLatchTimers[containerId]);
    delete elevationTouchLatchTimers[containerId];
  }

  const container = document.getElementById(containerId);
  if (!container) return;

  const svg = container.querySelector('svg');
  if (!svg) return;

  const rect = svg.getBoundingClientRect();
  const mouseX = event.clientX - rect.left;
  const svgWidth = 380;
  const scaleX = svgWidth / rect.width;
  const scaledX = mouseX * scaleX;

  const team = container.dataset.team;
  const rawPts = JSON.parse(container.dataset.points);

  let closest = rawPts[0];
  let minDiff = 1e9;
  for (let i = 0; i < rawPts.length; i++) {
    const diff = Math.abs(rawPts[i][0] - scaledX);
    if (diff < minDiff) {
      minDiff = diff;
      closest = rawPts[i];
    }
  }

  const scrubLine = document.getElementById(`${containerId}-scrub-line`);
  const scrubDot = document.getElementById(`${containerId}-scrub-dot`);
  const tip = document.getElementById(`${containerId}-tip`);

  if (scrubLine && scrubDot) {
    scrubLine.setAttribute('x1', closest[0]);
    scrubLine.setAttribute('x2', closest[0]);
    scrubLine.style.display = 'block';

    scrubDot.setAttribute('cx', closest[0]);
    scrubDot.setAttribute('cy', closest[1]);
    scrubDot.style.display = 'block';
  }

  if (tip) {
    tip.classList.add('active');
    tip.querySelector('.tip-content').innerHTML = `<strong>${closest[2]} km</strong> &bull; ${Math.round(closest[3])} m`;
  }

  highlightElevationPointOnMap(closest[4], closest[5], closest[3], team);
};

window.handleElevationLeave = function(containerId) {
  if (elevationTouchLatchTimers[containerId]) {
    clearTimeout(elevationTouchLatchTimers[containerId]);
    delete elevationTouchLatchTimers[containerId];
  }

  const scrubLine = document.getElementById(`${containerId}-scrub-line`);
  const scrubDot = document.getElementById(`${containerId}-scrub-dot`);
  const tip = document.getElementById(`${containerId}-tip`);

  if (scrubLine) scrubLine.style.display = 'none';
  if (scrubDot) scrubDot.style.display = 'none';
  if (tip) tip.classList.remove('active');

  clearElevationMapHighlight();
};

window.handleElevationTouch = function(event, containerId) {
  if (event.cancelable) {
    event.preventDefault();
  }
  if (elevationTouchLatchTimers[containerId]) {
    clearTimeout(elevationTouchLatchTimers[containerId]);
    delete elevationTouchLatchTimers[containerId];
  }
  if (event.touches && event.touches.length > 0) {
    const touch = event.touches[0];
    handleElevationHover({ clientX: touch.clientX, clientY: touch.clientY }, containerId);
  }
};

window.handleElevationTouchEnd = function(containerId) {
  if (elevationTouchLatchTimers[containerId]) {
    clearTimeout(elevationTouchLatchTimers[containerId]);
  }
  elevationTouchLatchTimers[containerId] = setTimeout(() => {
    handleElevationLeave(containerId);
    delete elevationTouchLatchTimers[containerId];
  }, 2500);
};

window.copyCurrentGpsLocation = function() {
  if (!navigator.geolocation) {
    alert('A böngésző nem támogatja a helymeghatározást (GPS).');
    return;
  }
  
  const showGpsToast = (msg, isError = false) => {
    let toast = document.getElementById('gps-toast');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'gps-toast';
      toast.style.cssText = 'position:fixed;bottom:80px;left:50%;transform:translateX(-50%);z-index:9999;padding:0.75rem 1.25rem;border-radius:12px;background:#0f172a;color:#f8fafc;box-shadow:0 10px 25px rgba(0,0,0,0.5);font-size:0.9rem;font-weight:600;display:flex;align-items:center;gap:0.6rem;max-width:90vw;text-align:center;transition:all 0.3s ease;';
      document.body.appendChild(toast);
    }
    toast.innerHTML = (isError ? '⚠️ ' : '📍 ') + msg;
    toast.style.opacity = '1';
    toast.style.display = 'flex';
    setTimeout(() => {
      if (toast) {
        toast.style.opacity = '0';
        setTimeout(() => { toast.style.display = 'none'; }, 300);
      }
    }, 4000);
  };

  showGpsToast('GPS helymeghatározás folyamatban...');

  navigator.geolocation.getCurrentPosition(
    (position) => {
      const lat = position.coords.latitude.toFixed(6);
      const lon = position.coords.longitude.toFixed(6);
      const acc = Math.round(position.coords.accuracy);
      const alt = position.coords.altitude ? ` (${Math.round(position.coords.altitude)} m tszf)` : '';
      const text = `${lat}, ${lon}${alt} [±${acc}m]`;

      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text).then(() => {
          showGpsToast(`Másolva a vágólapra: ${text}`);
        }).catch(() => {
          prompt('Másold ki a GPS koordinátákat a segélyhíváshoz:', text);
        });
      } else {
        prompt('Másold ki a GPS koordinátákat a segélyhíváshoz:', text);
      }
    },
    (err) => {
      console.warn('Geolocation error:', err);
      showGpsToast('Nem sikerült lekérni a GPS pozíciót. Engedélyezd a helymeghatározást!', true);
    },
    { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
  );
};

function renderElevationProfileSvg(tourId, options = {}) {
  const profile = (typeof ELEVATION_PROFILES !== 'undefined') ? ELEVATION_PROFILES[tourId] : null;
  if (!profile || !profile.points || profile.points.length === 0) return '';

  const {
    height = 95,
    compact = false
  } = options;

  const width = 380;
  const padLeft = compact ? 28 : 40;
  const padRight = 12;
  const padTop = compact ? 10 : 16;
  const padBottom = compact ? 16 : 22;

  const chartW = width - padLeft - padRight;
  const chartH = height - padTop - padBottom;

  const color = profile.team === 'climber' ? '#ef4444' : (profile.team === 'hiker' ? '#10b981' : '#f59e0b');
  const gradId = `elev-grad-${tourId.replace(/[^a-zA-Z0-9]/g, '_')}-${Math.floor(Math.random()*10000)}`;

  const minEle = profile.minEle;
  const maxEle = profile.maxEle;
  const eleRange = Math.max(30, maxEle - minEle);
  const totalKm = profile.totalKm || profile.points[profile.points.length - 1].km || 1;

  const coords = profile.points.map(pt => {
    const x = padLeft + (pt.km / totalKm) * chartW;
    const y = padTop + chartH - ((pt.ele - minEle) / eleRange) * chartH;
    return {
      x: Number(x.toFixed(1)),
      y: Number(y.toFixed(1)),
      km: pt.km,
      ele: pt.ele,
      lat: pt.lat,
      lon: pt.lon
    };
  });

  const lineD = coords.map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x} ${c.y}`).join(' ');
  const areaD = `${lineD} L ${coords[coords.length - 1].x} ${padTop + chartH} L ${coords[0].x} ${padTop + chartH} Z`;

  const midEle = Math.round((minEle + maxEle) / 2);
  const midY = padTop + chartH - ((midEle - minEle) / eleRange) * chartH;
  const maxY = padTop;
  const minY = padTop + chartH;

  let highest = coords[0];
  coords.forEach(c => { if (c.ele > highest.ele) highest = c; });

  const isDark = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark') || false;
  const eleTextFill = isDark ? '#f8fafc' : '#334155';
  const axisTextFill = isDark ? '#94a3b8' : '#334155';

  const containerId = `elev-chart-${tourId.replace(/[^a-zA-Z0-9]/g, '_')}-${Math.random().toString(36).substr(2, 5)}`;
  const ptsJson = JSON.stringify(coords.map(c => [c.x, c.y, c.km, c.ele, c.lat, c.lon])).replace(/"/g, '&quot;');

  return `
    <div class="elevation-chart-wrap" id="${containerId}" 
         data-tour-id="${tourId}" 
         data-team="${profile.team}"
         data-points="${ptsJson}"
         data-pad-left="${padLeft}"
         data-chart-w="${chartW}">
      <div class="elevation-floating-tooltip" id="${containerId}-tip">
        <i class="fa-solid fa-mountain"></i> <span class="tip-content">--</span>
      </div>
      <svg class="elevation-svg-chart" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none">
        <defs>
          <linearGradient id="${gradId}" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stop-color="${color}" stop-opacity="0.45" />
            <stop offset="70%" stop-color="${color}" stop-opacity="0.1" />
            <stop offset="100%" stop-color="${color}" stop-opacity="0.0" />
          </linearGradient>
        </defs>

        <line x1="${padLeft}" y1="${maxY}" x2="${width - padRight}" y2="${maxY}" stroke="rgba(255,255,255,0.08)" stroke-dasharray="3,3" />
        <text x="${padLeft - 4}" y="${maxY + 3}" fill="${eleTextFill}" font-size="${compact ? 8 : 9}" text-anchor="end" font-family="sans-serif">${Math.round(maxEle)}m</text>

        ${!compact ? `
          <line x1="${padLeft}" y1="${midY}" x2="${width - padRight}" y2="${midY}" stroke="rgba(255,255,255,0.05)" stroke-dasharray="2,2" />
          <text x="${padLeft - 4}" y="${midY + 3}" fill="${axisTextFill}" font-size="8.5" text-anchor="end" font-family="sans-serif">${midEle}m</text>
        ` : ''}

        <line x1="${padLeft}" y1="${minY}" x2="${width - padRight}" y2="${minY}" stroke="rgba(255,255,255,0.12)" />
        <text x="${padLeft - 4}" y="${minY + 3}" fill="${eleTextFill}" font-size="${compact ? 8 : 9}" text-anchor="end" font-family="sans-serif">${Math.round(minEle)}m</text>

        <text x="${padLeft}" y="${height - (compact ? 3 : 6)}" fill="${axisTextFill}" font-size="${compact ? 7.5 : 8.5}" font-family="sans-serif">0 km</text>
        <text x="${padLeft + chartW / 2}" y="${height - (compact ? 3 : 6)}" fill="${axisTextFill}" font-size="${compact ? 7.5 : 8.5}" text-anchor="middle" font-family="sans-serif">${(totalKm / 2).toFixed(1)} km</text>
        <text x="${width - padRight}" y="${height - (compact ? 3 : 6)}" fill="${axisTextFill}" font-size="${compact ? 7.5 : 8.5}" text-anchor="end" font-family="sans-serif">${totalKm} km</text>

        <path d="${areaD}" fill="url(#${gradId})" />
        <path d="${lineD}" fill="none" stroke="${color}" stroke-width="${compact ? 1.8 : 2.2}" stroke-linecap="round" stroke-linejoin="round" />

        <circle cx="${highest.x}" cy="${highest.y}" r="${compact ? 2.5 : 3.5}" fill="${color}" stroke="#ffffff" stroke-width="1.5" />

        <line id="${containerId}-scrub-line" x1="0" y1="${padTop}" x2="0" y2="${minY}" stroke="#ffffff" stroke-width="1.5" stroke-dasharray="2,2" style="display:none;" />
        <circle id="${containerId}-scrub-dot" cx="0" cy="0" r="4.5" fill="#ffffff" stroke="${color}" stroke-width="2.5" style="display:none;" />

        <rect x="${padLeft}" y="${padTop}" width="${chartW}" height="${chartH}" fill="transparent" style="cursor:crosshair; touch-action:none;" 
              onmousemove="handleElevationHover(event, '${containerId}')"
              onmouseleave="handleElevationLeave('${containerId}')"
              ontouchstart="handleElevationTouch(event, '${containerId}')"
              ontouchmove="handleElevationTouch(event, '${containerId}')"
              ontouchend="handleElevationTouchEnd('${containerId}')"
              ontouchcancel="handleElevationTouchEnd('${containerId}')" />
      </svg>
    </div>
  `;
}

function createElevationProfileHtml(tourId) {
  const profile = (typeof ELEVATION_PROFILES !== 'undefined') ? ELEVATION_PROFILES[tourId] : null;
  if (!profile) return '';

  return `
    <div class="elevation-profile-container">
      <div class="elevation-profile-header">
        <div class="elevation-profile-title">
          <i class="fa-solid fa-chart-area" style="color:${profile.team === 'climber' ? '#ef4444' : (profile.team === 'hiker' ? '#10b981' : '#f59e0b')};"></i>
          <span>Szintrajz & Magasságprofil (${profile.totalKm} km)</span>
        </div>
        <div class="elevation-stats-strip">
          <span class="elevation-stat-tag" title="Szintemelkedés"><i class="fa-solid fa-arrow-trend-up" style="color:#10b981;"></i> +${profile.ascentM}m</span>
          <span class="elevation-stat-tag" title="Magassági sáv"><i class="fa-solid fa-mountain" style="color:#fbbf24;"></i> ${profile.minEle}-${profile.maxEle}m</span>
        </div>
      </div>
      ${renderElevationProfileSvg(tourId, { height: 95 })}
    </div>
  `;
}

function createModalElevationHtml(tourId) {
  const profile = (typeof ELEVATION_PROFILES !== 'undefined') ? ELEVATION_PROFILES[tourId] : null;
  if (!profile) return '';

  return `
    <div class="modal-elevation-box">
      <div class="elevation-profile-header">
        <div class="elevation-profile-title">
          <i class="fa-solid fa-chart-area" style="color:var(--accent-blue);"></i>
          <span>Interaktív Geodéziai Szintrajz és Magasságprofil</span>
        </div>
        <div class="elevation-stats-strip">
          <span class="elevation-stat-tag"><i class="fa-solid fa-arrow-trend-up" style="color:#10b981;"></i> Szintemelkedés: <strong>+${profile.ascentM} m</strong></span>
          <span class="elevation-stat-tag"><i class="fa-solid fa-arrow-trend-down" style="color:#ef4444;"></i> Szintesés: <strong>-${profile.descentM} m</strong></span>
          <span class="elevation-stat-tag"><i class="fa-solid fa-mountain" style="color:#fbbf24;"></i> Magasság: <strong>${profile.minEle} m – ${profile.maxEle} m</strong></span>
          <span class="elevation-stat-tag"><i class="fa-solid fa-route" style="color:#38bdf8;"></i> Hossz: <strong>${profile.totalKm} km</strong></span>
        </div>
      </div>
      ${renderElevationProfileSvg(tourId, { height: 140 })}
      <div style="font-size:0.75rem;color:var(--text-muted);margin-top:0.5rem;display:flex;align-items:center;gap:0.4rem;">
        <i class="fa-solid fa-hand-pointer" style="color:var(--accent-blue);"></i>
        <span>Mozgasd az egeret vagy az ujjadat a szintrajzon az aktuális magasság és távolság leolvasásához, valamint a térképen való pontos pozicionáláshoz!</span>
      </div>
    </div>
  `;
}

function createGpxSparklineHtml(tourId) {
  const profile = (typeof ELEVATION_PROFILES !== 'undefined') ? ELEVATION_PROFILES[tourId] : null;
  if (!profile) return '';
  return `
    <div class="gpx-elevation-sparkline">
      <div style="display:flex;justify-content:space-between;align-items:center;font-size:0.72rem;color:var(--text-muted);margin-bottom:0.2rem;">
        <span><i class="fa-solid fa-chart-area"></i> Szintrajz</span>
        <span>+${profile.ascentM}m &bull; ${profile.minEle}-${profile.maxEle}m</span>
      </div>
      ${renderElevationProfileSvg(tourId, { height: 70, compact: true })}
    </div>
  `;
}

/* ==========================================================================
   Napi Kártyák és Programok Renderelése
   ========================================================================== */
function renderDaysAndTours() {
  const container = document.getElementById('days-cards-container');
  if (!container) return;

  container.innerHTML = '';

  EXPEDITION_DATA.days.forEach(day => {
    const card = document.createElement('div');
    card.className = 'day-card';
    card.id = `day-card-${day.dayNumber}`;

    const climberPoints = day.climberProgram.routeCoordinates ? day.climberProgram.routeCoordinates.length : 0;
    const hikerPoints = day.hikerProgram.routeCoordinates ? day.hikerProgram.routeCoordinates.length : 0;
    const jointPoints = day.jointProgram.routeCoordinates ? day.jointProgram.routeCoordinates.length : 0;

    card.innerHTML = `
      <div class="day-card-header">
        <div class="day-title-box">
          <span class="badge badge-primary" style="margin-bottom: 0.4rem;">${day.dateHint}</span>
          <h3>${day.title}</h3>
          <p>${day.subtitle}</p>
        </div>
        <div class="day-quick-actions">
          <button class="btn-sm" onclick="filterMapToDay(${day.dayNumber})">
            <i class="fa-solid fa-map-location-dot"></i> Napi Térkép
          </button>
        </div>
      </div>

      <div class="teams-split-grid">
        <!-- Mászó Csapat Kártya -->
        <div class="tour-card climber">
          <div>
            <div class="tour-card-header">
              <div>
                <span class="badge badge-climber" style="margin-bottom:0.35rem;">
                  <i class="fa-solid fa-person-hiking"></i> Mászó Csapat (4 fő)
                </span>
                <h4>${day.climberProgram.name}</h4>
                <div class="tour-target">
                  <i class="fa-solid fa-mountain"></i> ${day.climberProgram.target}
                </div>
              </div>
            </div>

            <div class="tour-specs-grid">
              <div class="spec-item">
                <span class="spec-label">Nehézség</span>
                <span class="spec-value" style="color:var(--climber-color);">${day.climberProgram.difficulty.split(' ')[0]}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Szintkülönbség</span>
                <span class="spec-value">${day.climberProgram.ascent}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">GPS Pontok</span>
                <span class="spec-value" style="color:var(--accent-blue);">${climberPoints} pont</span>
              </div>
            </div>

            <!-- Valós Geodéziai Szintrajz -->
            ${createElevationProfileHtml(day.climberProgram.id)}

            ${day.climberProgram.parking ? `
              <div class="tour-parking-quick-strip">
                <span class="parking-badge" title="${day.climberProgram.parking.name}">
                  <i class="fa-solid fa-square-parking"></i> ${day.climberProgram.parking.cost.split('(')[0]}
                </span>
                <div style="display:flex;gap:5px;">
                  <a href="${day.climberProgram.parking.googleUrl}" target="_blank" class="parking-nav-link maps" title="Google Maps útvonaltervezés a parkolóhoz">
                    <i class="fa-solid fa-diamond-turn-right"></i> Maps
                  </a>
                  <a href="${day.climberProgram.parking.wazeUrl}" target="_blank" class="parking-nav-link waze" title="Waze GPS navigáció">
                    <i class="fa-brands fa-waze"></i> Waze
                  </a>
                </div>
              </div>
            ` : ''}

            <ul class="tour-highlights-list">
              ${day.climberProgram.highlights.map(hl => `
                <li><i class="fa-solid fa-check"></i> <span>${hl}</span></li>
              `).join('')}
            </ul>
          </div>

          <div class="tour-actions-bar">
            <button class="btn-sm btn-climber" onclick="focusOnMap('${day.climberProgram.id}')">
              <i class="fa-solid fa-map"></i> Térkép
            </button>
            <button class="btn-sm" onclick="openTourModal('${day.climberProgram.id}')">
              <i class="fa-solid fa-circle-info"></i> Útikalauz
            </button>
            <button class="btn-sm" onclick="downloadGPX('${day.climberProgram.id}')" title="Valós GPX letöltése">
              <i class="fa-solid fa-download"></i> GPX Letöltés
            </button>
          </div>
        </div>

        <!-- Túrázó Csapat Kártya -->
        <div class="tour-card hiker">
          <div>
            <div class="tour-card-header">
              <div>
                <span class="badge badge-hiker" style="margin-bottom:0.35rem;">
                  <i class="fa-solid fa-shoe-prints"></i> Túrázó Csapat (6 fő)
                </span>
                <h4>${day.hikerProgram.name}</h4>
                <div class="tour-target">
                  <i class="fa-solid fa-mountain-sun"></i> ${day.hikerProgram.target}
                </div>
              </div>
            </div>

            <div class="tour-specs-grid">
              <div class="spec-item">
                <span class="spec-label">Táv</span>
                <span class="spec-value">${day.hikerProgram.distance}</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">Időtartam</span>
                <span class="spec-value">${day.hikerProgram.duration.split(' ')[0]} h</span>
              </div>
              <div class="spec-item">
                <span class="spec-label">GPS Pontok</span>
                <span class="spec-value" style="color:var(--accent-blue);">${hikerPoints} pont</span>
              </div>
            </div>

            <!-- Valós Geodéziai Szintrajz -->
            ${createElevationProfileHtml(day.hikerProgram.id)}

            ${day.hikerProgram.parking ? `
              <div class="tour-parking-quick-strip">
                <span class="parking-badge" title="${day.hikerProgram.parking.name}">
                  <i class="fa-solid fa-square-parking"></i> ${day.hikerProgram.parking.cost.split('(')[0]}
                </span>
                <div style="display:flex;gap:5px;">
                  <a href="${day.hikerProgram.parking.googleUrl}" target="_blank" class="parking-nav-link maps" title="Google Maps útvonaltervezés a parkolóhoz">
                    <i class="fa-solid fa-diamond-turn-right"></i> Maps
                  </a>
                  <a href="${day.hikerProgram.parking.wazeUrl}" target="_blank" class="parking-nav-link waze" title="Waze GPS navigáció">
                    <i class="fa-brands fa-waze"></i> Waze
                  </a>
                </div>
              </div>
            ` : ''}

            <ul class="tour-highlights-list">
              ${day.hikerProgram.highlights.map(hl => `
                <li><i class="fa-solid fa-check"></i> <span>${hl}</span></li>
              `).join('')}
            </ul>
          </div>

          <div class="tour-actions-bar">
            <button class="btn-sm btn-hiker" onclick="focusOnMap('${day.hikerProgram.id}')">
              <i class="fa-solid fa-map"></i> Térkép
            </button>
            <button class="btn-sm" onclick="openTourModal('${day.hikerProgram.id}')">
              <i class="fa-solid fa-circle-info"></i> Útikalauz
            </button>
            <button class="btn-sm" onclick="downloadGPX('${day.hikerProgram.id}')" title="Valós GPX letöltése">
              <i class="fa-solid fa-download"></i> GPX Letöltés
            </button>
          </div>
        </div>
      </div>

      <!-- Közös Délutáni Program Sáv -->
      <div class="joint-program-card">
        <div class="joint-left" style="flex:1 1 500px;">
          <div class="joint-icon">
            <i class="fa-solid fa-champagne-glasses"></i>
          </div>
          <div class="joint-info" style="flex:1;">
            <div style="display:flex;align-items:center;gap:0.5rem;margin-bottom:0.2rem;flex-wrap:wrap;">
              <span class="badge badge-joint">Közös Délután</span>
              <span style="font-size:0.8rem;color:var(--joint-color);font-weight:600;"><i class="fa-regular fa-clock"></i> ${day.jointProgram.time}</span>
              <span class="badge" style="background:rgba(3,105,161,0.15);color:var(--accent-blue);font-size:0.75rem;"><i class="fa-solid fa-satellite-dish"></i> ${jointPoints} GPS pont</span>
            </div>
            <h5>${day.jointProgram.name} &bull; ${day.jointProgram.target}</h5>
            <p>${day.jointProgram.description}</p>
            ${createElevationProfileHtml(day.jointProgram.id)}

            ${day.jointProgram.parking ? `
              <div style="display:flex;gap:8px;align-items:center;margin-top:0.6rem;flex-wrap:wrap;">
                <span class="parking-badge" style="font-size:0.75rem;"><i class="fa-solid fa-square-parking"></i> ${day.jointProgram.parking.cost.split('(')[0]}</span>
                <a href="${day.jointProgram.parking.googleUrl}" target="_blank" class="parking-nav-link maps" style="font-size:0.75rem;"><i class="fa-solid fa-diamond-turn-right"></i> Maps</a>
                <a href="${day.jointProgram.parking.wazeUrl}" target="_blank" class="parking-nav-link waze" style="font-size:0.75rem;"><i class="fa-brands fa-waze"></i> Waze</a>
              </div>
            ` : ''}
          </div>
        </div>
        <div style="display:flex;gap:0.5rem;flex-wrap:wrap;align-self:flex-start;margin-top:0.5rem;">
          <button class="btn-sm" style="background:var(--joint-bg);color:var(--joint-color);border-color:rgba(245,158,11,0.4);min-height:44px;" onclick="focusOnMap('${day.jointProgram.id}')">
            <i class="fa-solid fa-location-dot"></i> Térképre
          </button>
          <button class="btn-sm" style="background:rgba(16,185,129,0.2);color:var(--hiker-color);border-color:rgba(16,185,129,0.4);min-height:44px;" onclick="downloadGPX('${day.jointProgram.id}')">
            <i class="fa-solid fa-download"></i> GPX
          </button>
        </div>
      </div>
    `;

    container.appendChild(card);
  });
}

window.filterMapToDay = function(dayNum) {
  const dayBtn = document.querySelector(`.day-filter-btn[data-day="${dayNum}"]`);
  if (dayBtn) {
    dayBtn.click();
    document.getElementById('leaflet-map').scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
};

/* ==========================================================================
   GPX Letöltés Kezelő (Valós .gpx fájl letöltése közvetlenül)
   ========================================================================== */
window.downloadGPX = function(tourId) {
  let tourObj = null;
  let tourName = '';

  EXPEDITION_DATA.days.forEach(day => {
    if (day.climberProgram && day.climberProgram.id === tourId) {
      tourObj = day.climberProgram;
      tourName = `Dolomitok_D${day.dayNumber}_Maszo_${tourObj.name.replace(/\s+/g, '_')}`;
    } else if (day.hikerProgram && day.hikerProgram.id === tourId) {
      tourObj = day.hikerProgram;
      tourName = `Dolomitok_D${day.dayNumber}_Turazo_${tourObj.name.replace(/\s+/g, '_')}`;
    } else if (day.jointProgram && day.jointProgram.id === tourId) {
      tourObj = day.jointProgram;
      tourName = `Dolomitok_D${day.dayNumber}_Kozos_${tourObj.name.replace(/\s+/g, '_')}`;
    }
  });

  if (!tourObj) {
    alert('Ehhez az útvonalhoz nem található adat.');
    return;
  }

  // Ha van közvetlen gpxFile, közvetlenül azt töltjük le
  if (tourObj.gpxFile) {
    const a = document.createElement('a');
    a.href = tourObj.gpxFile;
    a.download = tourObj.gpxFile.split('/').pop() || `${tourName}.gpx`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    return;
  }

  // Fallback: dinamikus GPX XML generálás
  const coords = tourObj.routeCoordinates;
  let gpxXml = `<?xml version="1.0" encoding="UTF-8"?>
<gpx version="1.1" creator="LordTúra - Antigravity" xmlns="http://www.topografix.com/GPX/1/1">
  <metadata>
    <name>${tourObj.name}</name>
    <desc>${tourObj.target}</desc>
  </metadata>
  <trk>
    <name>${tourObj.name}</name>
    <trkseg>\n`;

  coords.forEach(pt => {
    gpxXml += `      <trkpt lat="${pt[0]}" lon="${pt[1]}"></trkpt>\n`;
  });

  gpxXml += `    </trkseg>\n  </trk>\n</gpx>`;

  const blob = new Blob([gpxXml], { type: 'application/gpx+xml;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${tourName}.gpx`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/* ==========================================================================
   GPX Nyomvonal Központ (GPX Hub Renderelése)
   ========================================================================== */
function renderGpxHub() {
  const container = document.getElementById('gpx-hub-container');
  if (!container) return;

  const gpxList = [
    {
      day: "1. Nap",
      team: "Mászó Csapat",
      teamClass: "climber",
      icon: "fa-person-hiking",
      name: "Via Ferrata Michielli-Strobel (Punta Fiames)",
      target: "Punta Fiames (2 240 m)",
      dist: "8.8 km",
      ascent: "+1 040 m",
      points: "496 GPS pont",
      file: "gpx/day1_maszo_ferrata_strobel.gpx",
      id: "day1_climber"
    },
    {
      day: "1. Nap",
      team: "Túrázó Csapat",
      teamClass: "hiker",
      icon: "fa-shoe-prints",
      name: "Tofana Panoráma és Rifugio Pomedes",
      target: "Rifugio Pomedes (2 303 m)",
      dist: "6.2 km",
      ascent: "+350 m",
      points: "100 GPS pont",
      file: "gpx/day1_turazo_tofana_pomedes.gpx",
      id: "day1_hiker"
    },
    {
      day: "1. Nap",
      team: "Közös Program",
      teamClass: "joint",
      icon: "fa-water",
      name: "Misurina-tó Körséta Naplementében",
      target: "Lago di Misurina (1 754 m)",
      dist: "2.6 km",
      ascent: "Sík séta",
      points: "1 096 GPS pont",
      file: "gpx/day1_kozos_misurina_to.gpx",
      id: "day1_joint"
    },
    {
      day: "2. Nap",
      team: "Mászó Csapat",
      teamClass: "climber",
      icon: "fa-person-hiking",
      name: "Via Ferrata DeLuca-Innerkofler (Monte Paterno)",
      target: "Monte Paterno (2 744 m) & I. vh. alagutak",
      dist: "9.5 km",
      ascent: "+650 m",
      points: "129 GPS pont",
      file: "gpx/day2_maszo_ferrata_de_luca_innerkofler.gpx",
      id: "day2_climber"
    },
    {
      day: "2. Nap",
      team: "Túrázó Csapat",
      teamClass: "hiker",
      icon: "fa-camera",
      name: "Cadini di Misurina Viewpoint (Sentiero 117)",
      target: "Torre del Diavolo sziklagerinc",
      dist: "4.2 km",
      ascent: "+380 m",
      points: "164 GPS pont",
      file: "gpx/day2_turazo_cadini_di_misurina.gpx",
      id: "day2_hiker"
    },
    {
      day: "2. Nap",
      team: "Panoráma Bónusz",
      teamClass: "hiker",
      icon: "fa-mountain",
      name: "Tre Cime di Lavaredo Teljes Körtúra",
      target: "Rif. Auronzo &bull; Lavaredo &bull; Locatelli",
      dist: "10.2 km",
      ascent: "+450 m",
      points: "583 GPS pont",
      file: "gpx/day2_tre_cime_kor.gpx",
      id: "day2_tre_cime"
    },
    {
      day: "3. Nap",
      team: "Mászó Csapat",
      teamClass: "climber",
      icon: "fa-bridge",
      name: "Via Ferrata Pisciadù (Brigata Tridentina)",
      target: "Torre Exner, Függőhíd & Rif. Pisciadù (2 585 m)",
      dist: "6.5 km",
      ascent: "+650 m",
      points: "357 GPS pont",
      file: "gpx/day3_maszo_ferrata_pisciadu.gpx",
      id: "day3_climber"
    },
    {
      day: "3. Nap",
      team: "Túrázó Csapat",
      teamClass: "hiker",
      icon: "fa-gem",
      name: "Passo Sella és Città dei Sassi (Kőváros)",
      target: "Sassolungo lába & Rifugio Comici",
      dist: "6.8 km",
      ascent: "+280 m",
      points: "99 GPS pont",
      file: "gpx/day3_turazo_sella_sassolungo.gpx",
      id: "day3_hiker"
    },
    {
      day: "3. Nap",
      team: "Közös Program",
      teamClass: "joint",
      icon: "fa-water",
      name: "Lago di Braies (Pragser Wildsee) Körséta",
      target: "Smaragdzöld alpesi tó & Seekofel",
      dist: "3.6 km",
      ascent: "+50 m",
      points: "207 GPS pont",
      file: "gpx/day3_kozos_lago_di_braies.gpx",
      id: "day3_joint"
    },
    {
      day: "4. Nap",
      team: "Mászó Csapat",
      teamClass: "climber",
      icon: "fa-mountain",
      name: "Via Ferrata Piccolo Cir (Cir V)",
      target: "Piccolo Cir csúcskereszt (2 528 m)",
      dist: "3.5 km",
      ascent: "+400 m",
      points: "93 GPS pont",
      file: "gpx/day4_maszo_ferrata_piccolo_cir.gpx",
      id: "day4_climber"
    },
    {
      day: "4. Nap",
      team: "Túrázó Csapat",
      teamClass: "hiker",
      icon: "fa-church",
      name: "Val di Funes & Santa Maddalena Képeslapfalu",
      target: "Chiesa di Santa Maddalena & Ranui kápolna",
      dist: "4.5 km",
      ascent: "+150 m",
      points: "290 GPS pont",
      file: "gpx/day4_turazo_val_di_funes.gpx",
      id: "day4_hiker"
    },
    {
      day: "4. Nap",
      team: "Közös Zárás",
      teamClass: "joint",
      icon: "fa-mountain-sun",
      name: "Seceda Fűrészgerinc & Csúcs",
      target: "Seceda Ridgeline (2 519 m) & Baita Sofie",
      dist: "3.2 km",
      ascent: "+120 m",
      points: "176 GPS pont",
      file: "gpx/day4_kozos_seceda_gerinc.gpx",
      id: "day4_joint"
    }
  ];

  container.innerHTML = gpxList.map(item => `
    <div class="gpx-track-card">
      <div class="gpx-card-top">
        <div class="gpx-card-icon ${item.teamClass}">
          <i class="fa-solid ${item.icon}"></i>
        </div>
        <div class="gpx-card-details">
          <div style="display:flex;gap:0.4rem;align-items:center;margin-bottom:0.2rem;">
            <span class="badge badge-${item.teamClass}">${item.day} &bull; ${item.team}</span>
          </div>
          <h4>${item.name}</h4>
          <p>${item.target}</p>
        </div>
      </div>

      <div class="gpx-card-meta">
        <span><i class="fa-solid fa-route"></i> ${item.dist}</span>
        <span><i class="fa-solid fa-arrow-trend-up"></i> ${item.ascent}</span>
        <span><i class="fa-solid fa-satellite-dish"></i> ${item.points}</span>
      </div>

      <!-- Magasságprofil Miniatűr -->
      ${createGpxSparklineHtml(item.id)}

      <div class="gpx-card-actions">
        <a href="${item.file}" download="${item.file.split('/').pop()}" class="btn-sm" style="background:#10b981;color:#fff;border-color:#10b981;text-decoration:none;">
          <i class="fa-solid fa-download"></i> .GPX Letöltése
        </a>
        <button class="btn-sm" onclick="focusOnMap('${item.id}')">
          <i class="fa-solid fa-map"></i> Térképen
        </button>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Részletes Modális Ablak (Útikalauz)
   ========================================================================== */
window.openTourModal = function(tourId) {
  let tour = null;
  let dayInfo = null;

  EXPEDITION_DATA.days.forEach(day => {
    if (day.climberProgram.id === tourId) {
      tour = day.climberProgram;
      dayInfo = day;
    } else if (day.hikerProgram.id === tourId) {
      tour = day.hikerProgram;
      dayInfo = day;
    } else if (day.jointProgram.id === tourId) {
      tour = day.jointProgram;
      dayInfo = day;
    }
  });

  if (!tour) return;

  const modalBackdrop = document.getElementById('tour-detail-modal');
  const modalContent = document.getElementById('modal-dynamic-content');

  const teamBadge = tour.team === 'climber' 
    ? `<span class="badge badge-climber">🧗 Mászó Csapat (4 fő)</span>`
    : tour.team === 'hiker'
    ? `<span class="badge badge-hiker">🥾 Túrázó Csapat (6 fő)</span>`
    : `<span class="badge badge-joint">🌅 Közös Program</span>`;

  modalContent.innerHTML = `
    <div class="modal-header">
      <div style="margin-bottom:0.5rem;display:flex;gap:0.5rem;align-items:center;">
        <span class="badge badge-primary">${dayInfo.dateHint}</span>
        ${teamBadge}
      </div>
      <h3>${tour.name}</h3>
      <p style="color:var(--accent-gold);font-weight:600;"><i class="fa-solid fa-location-dot"></i> ${tour.target}</p>
    </div>

    <div class="modal-specs-bar">
      ${tour.difficulty ? `<div><span class="spec-label">Nehézség</span><strong style="color:var(--climber-color);">${tour.difficulty}</strong></div>` : ''}
      ${tour.duration ? `<div><span class="spec-label">Időtartam</span><strong>${tour.duration}</strong></div>` : ''}
      ${tour.distance ? `<div><span class="spec-label">Távolság</span><strong>${tour.distance}</strong></div>` : ''}
      ${tour.ascent ? `<div><span class="spec-label">Szintemelkedés</span><strong>${tour.ascent}</strong></div>` : ''}
      ${tour.maxAltitude ? `<div><span class="spec-label">Legmagasabb pont</span><strong>${tour.maxAltitude}</strong></div>` : ''}
      <div><span class="spec-label">Valós GPS Pont</span><strong style="color:var(--accent-blue);">${tour.routeCoordinates ? tour.routeCoordinates.length : 0} pont</strong></div>
    </div>

    <!-- Interaktív Részletes Szintrajz -->
    ${createModalElevationHtml(tour.id)}

    <div class="modal-body">
      <h4><i class="fa-solid fa-map-location-dot"></i> Útvonal Részletes Leírása</h4>
      <p>${tour.description}</p>

      ${tour.parking ? `
        <div class="modal-parking-box">
          <div class="modal-parking-header">
            <div style="display:flex;align-items:center;gap:0.6rem;">
              <i class="fa-solid fa-square-parking" style="color:var(--accent-blue);font-size:1.4rem;"></i>
              <div>
                <strong>Parkolás &amp; Megközelítés</strong>
                <div style="font-size:0.85rem;color:var(--text-secondary);">${tour.parking.name}</div>
              </div>
            </div>
            <span class="badge" style="background:rgba(56,189,248,0.15);color:var(--accent-blue);">${tour.parking.cost}</span>
          </div>
          <p style="font-size:0.85rem;margin:0.6rem 0 0.8rem;color:var(--text-secondary);line-height:1.5;">
            <i class="fa-solid fa-circle-info" style="color:var(--accent-gold);"></i> ${tour.parking.note}
          </p>
          <div style="display:flex;gap:8px;flex-wrap:wrap;">
            <a href="${tour.parking.googleUrl}" target="_blank" class="btn-sm" style="background:#1e3a8a;color:#fff;border-color:#3b82f6;text-decoration:none;">
              <i class="fa-solid fa-diamond-turn-right"></i> Google Térkép Navigáció
            </a>
            <a href="${tour.parking.wazeUrl}" target="_blank" class="btn-sm" style="background:#0284c7;color:#fff;border-color:#38bdf8;text-decoration:none;">
              <i class="fa-brands fa-waze"></i> Waze Navigáció
            </a>
          </div>
        </div>
      ` : (tour.startPoint ? `
        <div style="background:rgba(255,255,255,0.04);padding:0.75rem 1rem;border-radius:8px;margin:1rem 0;">
          <strong><i class="fa-solid fa-square-parking"></i> Kiindulópont / Parkolás:</strong> ${tour.startPoint}
        </div>
      ` : '')}

      ${tour.highlights ? `
        <h4><i class="fa-solid fa-star"></i> Főbb Látnivalók & Kulcspontok</h4>
        <ul>
          ${tour.highlights.map(h => `<li>${h}</li>`).join('')}
        </ul>
      ` : ''}

      ${tour.gear ? `
        <h4><i class="fa-solid fa-backpack"></i> Szükséges Technikai Felszerelés</h4>
        <ul>
          ${tour.gear.map(g => `<li>${g}</li>`).join('')}
        </ul>
      ` : ''}

      ${tour.meetingInfo ? `
        <h4><i class="fa-solid fa-users"></i> Találkozási Pont a Másik Csapattal</h4>
        <p style="color:#fcd34d;">${tour.meetingInfo}</p>
      ` : ''}
    </div>

    <div class="modal-actions">
      <button class="btn-sm" style="background:var(--accent-blue);color:#0b1120;border-color:var(--accent-blue);" onclick="closeTourModal(); focusOnMap('${tour.id}');">
        <i class="fa-solid fa-map"></i> Megnyitás a Térképen
      </button>
      <button class="btn-sm" style="background:#10b981;color:#fff;border-color:#10b981;" onclick="downloadGPX('${tour.id}')">
        <i class="fa-solid fa-download"></i> .GPX Fájl Letöltése
      </button>
      <button class="btn-sm" onclick="closeTourModal()">Bezárás</button>
    </div>
  `;

  modalBackdrop.classList.add('open');
};

function initModalListeners() {
  const modalBackdrop = document.getElementById('tour-detail-modal');
  const closeBtn = document.getElementById('modal-close-btn');

  if (closeBtn) {
    closeBtn.addEventListener('click', closeTourModal);
  }

  if (modalBackdrop) {
    modalBackdrop.addEventListener('click', (e) => {
      if (e.target === modalBackdrop) closeTourModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeTourModal();
  });
}

window.closeTourModal = function() {
  const modalBackdrop = document.getElementById('tour-detail-modal');
  if (modalBackdrop) modalBackdrop.classList.remove('open');
};

/* ==========================================================================
   Időrend & Találkozók Renderelése (Timeline)
   ========================================================================== */
function initTimeline() {
  const timelineContainer = document.getElementById('timeline-content-container');
  if (!timelineContainer) return;

  const timelineSchedule = [
    {
      day: 1,
      title: "1. Nap: Cortina feletti klasszikusok & Misurina-tó",
      steps: [
        { time: "07:30", type: "joint", title: "Közös Indulás Cortinából", desc: "Reggeli a szálláson, a mászók Fiames felé, a túrázók Piè Tofana felvonóhoz autóznak." },
        { time: "08:30 - 13:30", type: "climber", title: "Mászók: Via Ferrata Michielli-Strobel", desc: "600m mászás a Punta Fiames sziklafalán, lenyűgöző gerinctúra, lejövetel a Pomagagnon törmelékfolyosón." },
        { time: "09:30 - 13:30", type: "hiker", title: "Túrázók: Tofana Felvonó & Rifugio Pomedes", desc: "Felvonózás 2300 méterre, panorámaséta a Tofana lábánál, fotózás a hegyi teraszon." },
        { time: "14:00 - 15:00", type: "joint", title: "Délutáni Találkozó & Rövid Pihenő", desc: "Közös találkozó, felszerelések elrakása, felkészülés az esti tóparti kiruccanásra." },
        { time: "16:30 - 19:30", type: "joint", title: "Közös Program: Misurina-tó Naplemente", desc: "Átutazás a Passo Tre Croci-n a Misurina-tóhoz. 2.6 km-es tóparti körséta, fényképezés a lemenő napfényben." },
        { time: "20:00+", type: "joint", title: "Közös Vacsora", desc: "Vacsora és eligazítás a 2. napi Tre Cime expedíció előtt." }
      ]
    },
    {
      day: 2,
      title: "2. Nap: A 'Vadnyugat' és Történelmi Alagutak (Cadini & Tre Cime)",
      steps: [
        { time: "06:45", type: "joint", title: "Kora Reggeli Konvoj Indulás!", desc: "SZIGORÚ IDŐPONT! Korai feljutás a Rifugio Auronzo fizetős úton a tömeg és dugók elkerülésére." },
        { time: "08:00 - 15:30", type: "climber", title: "Mászók: Monte Paterno Ferrata (Gallerie del Paterno)", desc: "Sötét I. világháborús alagutak fejlámpával, Gamsscharte, Monte Paterno 2744m csúcs, Rifugio Locatelli panoráma." },
        { time: "08:30 - 14:30", type: "hiker", title: "Túrázók: Cadini di Misurina 'Mordor' Kilátópont", desc: "Vadregényes gerincösvény a tűhegyes sziklaszirtekhez, ikonikus fotózás a Torre del Diavolo szikláinál." },
        { time: "16:00 - 18:00", type: "joint", title: "FŐ TALÁLKOZÓ: Rifugio Auronzo Terasz", desc: "Mind a 10 fő találkozik az Auronzo panorámateraszán egy frissítő és kávé mellett a naplementében." },
        { time: "19:00", type: "joint", title: "Közös Leutazás a Bázisra", desc: "Közös gurulás le a hegyről, esti közös vacsora az apartmanban." }
      ]
    },
    {
      day: 3,
      title: "3. Nap: Sella-hágó, Pisciadù & Braies-tó",
      steps: [
        { time: "07:00", type: "joint", title: "Reggeli Indulás a Sella Csoporthoz", desc: "Utazás a Passo Gardena és Passo Sella irányába." },
        { time: "08:15 - 14:00", type: "climber", title: "Mászók: Pisciadù (Brigata Tridentina) Ferrata", desc: "Vízesés melletti C/D sportmászás, Torre Exner függőleges falak, lélegzetelállító acél FÜGGŐHÍD átkelés!" },
        { time: "09:00 - 13:30", type: "hiker", title: "Túrázók: Passo Sella & Città dei Sassi (Kőváros)", desc: "Séta az óriási sziklalabirintusban a Sassolungo lábánál, Rifugio Comici kávézás, felvonózási lehetőség." },
        { time: "15:30", type: "joint", title: "Átutazás a Braies-völgybe", desc: "Mindkét csapat a Lago di Braies felé veszi az irányt (elkerülve a déli turistacsúcsot)." },
        { time: "17:00 - 20:00", type: "joint", title: "Közös Késő Délutáni Megálló: Lago di Braies", desc: "A smaragdzöld tó megkerülése (3.6 km), fotózás a nosztalgikus csónakháznál aranyórában." }
      ]
    },
    {
      day: 4,
      title: "4. Nap: Val di Funes, Santa Maddalena & Seceda",
      steps: [
        { time: "07:30", type: "climber", title: "Mászók: Piccolo Cir Csúcstúra", desc: "Rövid, élvezetes levezető ferrata (2.5h) a Passo Gardenából a Piccolo Cir 2528m-es sziklacsúcsára." },
        { time: "08:30", type: "hiker", title: "Túrázók: Val di Funes & Santa Maddalena Képeslapfalu", desc: "Kultúrséta a világhírű Chiesetta di Santa Maddalena és Ranui kápolnákhoz az Odle sziklák előtt." },
        { time: "13:30", type: "joint", title: "Felvonózás a Secedára (2 519 m)", desc: "A mászók Ortiseibe érkeznek, mindkét csapat felvonóval feljut a Seceda csúcsára." },
        { time: "14:30 - 17:30", type: "joint", title: "NAGY ZÁRÁS: Csoportkép a Seceda Gerincen!", desc: "Közös fotó a Dolomitok leghíresebb panorámájánál, almás rétes a Baita Sofie teraszán, expedíció zárása." }
      ]
    }
  ];

  timelineContainer.innerHTML = timelineSchedule.map(daySched => `
    <div class="timeline-day-card">
      <h3><i class="fa-solid fa-calendar-day" style="color:var(--accent-blue);"></i> ${daySched.title}</h3>
      <div class="timeline-flow">
        ${daySched.steps.map(step => `
          <div class="timeline-step">
            <div class="step-marker ${step.type}"></div>
            <div class="step-time">${step.time}</div>
            <div class="step-content">
              <h5>${step.title}</h5>
              <p>${step.desc}</p>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Költségvetés Számoló (PDF adatok alapján & Élő EUR Árfolyam)
   ========================================================================== */

let liveRateState = {
  status: 'live',
  rate: 362.4,
  source: 'Hivatalos EKB bankközi referenciaárfolyam',
  updatedAt: new Date(),
  isFetching: false,
  fetchedOnce: false
};

const RATE_CACHE_KEY = 'lordtura_eur_rate_v1';
const RATE_CACHE_TTL = 30 * 60 * 1000; // 30 perc gyorsítótár érvényesség

function initBudgetCalculator() {
  const peopleSlider = document.getElementById('people-slider');
  const peopleValue = document.getElementById('people-value');
  const tierBtns = document.querySelectorAll('.tier-btn');
  const currencyBtns = document.querySelectorAll('.currency-btn');
  const refreshRateBtn = document.getElementById('refresh-rate-btn');

  if (peopleSlider) {
    peopleSlider.addEventListener('input', (e) => {
      participantCount = parseInt(e.target.value, 10);
      if (peopleValue) peopleValue.textContent = `${participantCount} fő`;
      updateBudgetCalculations();
    });
  }

  tierBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tierBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentTier = btn.dataset.tier;
      updateBudgetCalculations();
    });
  });

  currencyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      currencyBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      currentCurrency = btn.dataset.currency;
      if (currentCurrency === 'EUR') {
        triggerLazyRateFetch();
      }
      updateBudgetCalculations();
    });
  });

  if (refreshRateBtn) {
    refreshRateBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fetchLiveExchangeRate(true); // Manuális kényszerített frissítés
    });
  }

  // Kezdeti számolás a napi árfolyammal
  updateBudgetCalculations();

  // Aszinkron háttérfrissítés a renderelés blokkolása nélkül
  setTimeout(() => {
    triggerLazyRateFetch();
  }, 250);
}

/**
 * Napi árfolyam aszinkron lekérésének elindítása
 */
function triggerLazyRateFetch() {
  if (liveRateState.isFetching) return;
  if (liveRateState.fetchedOnce && liveRateState.status === 'live') {
    if (liveRateState.updatedAt && (Date.now() - liveRateState.updatedAt.getTime() > RATE_CACHE_TTL)) {
      fetchLiveExchangeRate(false);
    }
    return;
  }
  fetchLiveExchangeRate(false);
}

/**
 * Napi élő EUR/HUF árfolyam lekérése több megbízható forrásból (jsDelivr CDN, Frankfurter.dev, Open.er-api)
 */
async function fetchLiveExchangeRate(force = false) {
  if (liveRateState.isFetching) return;

  // 1. Gyorsítótár (sessionStorage) ellenőrzése
  if (!force) {
    try {
      const cachedStr = sessionStorage.getItem(RATE_CACHE_KEY);
      if (cachedStr) {
        const cached = JSON.parse(cachedStr);
        const age = Date.now() - (cached.timestamp || 0);
        if (age < RATE_CACHE_TTL && cached.rate) {
          applyRate(cached.rate, cached.source, new Date(cached.timestamp));
          return;
        }
      }
    } catch (e) {
      console.warn('SessionStorage hiba:', e);
    }
  }

  liveRateState.isFetching = true;
  updateRateUI('loading');

  let fetchedRate = null;
  let providerName = '';

  // 1. Elsődleges API: jsDelivr Currency CDN (nincs preflight, azonnali globális edge válasz)
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 4000);
    const res = await fetch('https://cdn.jsdelivr.net/npm/@fawazahmed0/currency-api@latest/v1/currencies/eur.json', {
      signal: controller.signal
    });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data && data.eur && data.eur.huf) {
        fetchedRate = parseFloat(data.eur.huf);
        providerName = 'Hivatalos EKB bankközi árfolyam';
      }
    }
  } catch (err) {
    console.warn('jsDelivr currency API nem ért el választ:', err);
  }

  // 2. Másodlagos API (fallback): api.frankfurter.dev (EKB referenciaadatok)
  if (!fetchedRate) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://api.frankfurter.dev/v1/latest?from=EUR&to=HUF', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.rates && data.rates.HUF) {
          fetchedRate = parseFloat(data.rates.HUF);
          providerName = 'Európai Központi Bank (EKB)';
        }
      }
    } catch (err) {
      console.warn('Frankfurter.dev API hiba:', err);
    }
  }

  // 3. Harmadlagos API (fallback): open.er-api.com
  if (!fetchedRate) {
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 4000);
      const res = await fetch('https://open.er-api.com/v6/latest/EUR', {
        signal: controller.signal
      });
      clearTimeout(timeoutId);

      if (res.ok) {
        const data = await res.json();
        if (data && data.result === 'success' && data.rates && data.rates.HUF) {
          fetchedRate = parseFloat(data.rates.HUF);
          providerName = 'EKB / Open Rates';
        }
      }
    } catch (err) {
      console.warn('Open Rates API hiba:', err);
    }
  }

  liveRateState.isFetching = false;
  liveRateState.fetchedOnce = true;

  if (fetchedRate && !isNaN(fetchedRate) && fetchedRate > 100) {
    const rateNum = Math.round(fetchedRate * 10) / 10;
    const now = new Date();

    try {
      sessionStorage.setItem(RATE_CACHE_KEY, JSON.stringify({
        rate: rateNum,
        source: providerName,
        timestamp: now.getTime()
      }));
    } catch (e) {
      console.warn('Nem sikerült menteni a cache-t:', e);
    }

    applyRate(rateNum, providerName, now);
  } else {
    // Ha a hálózat nem érhető el, a 362.4-es napi tervezési árfolyam marad aktív
    applyRate(liveRateState.rate || 362.4, 'Napi referenciaárfolyam', new Date());
  }
}

function applyRate(rateNum, source, dateObj) {
  liveRateState.status = 'live';
  liveRateState.rate = rateNum;
  liveRateState.source = source;
  liveRateState.updatedAt = dateObj;
  liveRateState.fetchedOnce = true;

  EXPEDITION_DATA.budget.exchangeRateEUR = rateNum;

  updateRateUI('live');
  updateBudgetCalculations();
}

function updateRateUI(status) {
  const dot = document.getElementById('rate-status-dot');
  const priceEl = document.getElementById('live-rate-price');
  const metaText = document.getElementById('live-rate-status-text');
  const refreshBtn = document.getElementById('refresh-rate-btn');
  const eurBtn = document.getElementById('eur-currency-btn');

  if (!dot || !priceEl || !metaText) return;

  dot.classList.remove('live', 'loading', 'error');

  if (status === 'loading') {
    dot.classList.add('loading');
    dot.title = 'Árfolyam lekérdezése...';
    if (refreshBtn) refreshBtn.classList.add('spinning');
    metaText.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin" style="color:var(--accent-blue);"></i> Frissítés folyamatban...';
  } else if (status === 'live') {
    dot.classList.add('live');
    dot.title = `Élő árfolyam: ${liveRateState.source}`;
    if (refreshBtn) refreshBtn.classList.remove('spinning');

    const formattedRate = liveRateState.rate.toLocaleString('hu-HU', { minimumFractionDigits: 1, maximumFractionDigits: 2 });
    priceEl.textContent = `1 EUR = ${formattedRate} HUF`;

    let timeStr = '';
    if (liveRateState.updatedAt) {
      const hours = String(liveRateState.updatedAt.getHours()).padStart(2, '0');
      const mins = String(liveRateState.updatedAt.getMinutes()).padStart(2, '0');
      const secs = String(liveRateState.updatedAt.getSeconds()).padStart(2, '0');
      timeStr = ` • Frissítve: ${hours}:${mins}:${secs}`;
    }

    metaText.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> ${liveRateState.source}${timeStr}`;

    if (eurBtn) {
      eurBtn.textContent = `Euró (€ ~${Math.round(liveRateState.rate)} Ft/€)`;
    }
  } else if (status === 'error') {
    dot.classList.add('error');
    if (refreshBtn) refreshBtn.classList.remove('spinning');

    priceEl.textContent = `1 EUR = ${liveRateState.rate.toFixed(1)} HUF`;
    metaText.innerHTML = '<i class="fa-solid fa-circle-info" style="color:var(--accent-gold);"></i> Napi referenciaárfolyam';
  }
}

function updateBudgetCalculations() {
  const listContainer = document.getElementById('budget-items-list');
  const totalPerPersonEl = document.getElementById('calc-total-per-person');
  const totalTeamEl = document.getElementById('calc-total-team');

  if (!listContainer) return;

  const rate = EXPEDITION_DATA.budget.exchangeRateEUR;
  let totalPerPersonHUF = 0;

  let itemsHtml = '';

  EXPEDITION_DATA.budget.items.forEach(item => {
    let costHUF = item.defaultFt;
    if (currentTier === 'budget') costHUF = item.minFt;
    if (currentTier === 'premium') costHUF = item.maxFt;

    totalPerPersonHUF += costHUF;

    const displayAmount = currentCurrency === 'HUF' 
      ? `${costHUF.toLocaleString('hu-HU')} Ft`
      : `~${Math.round(costHUF / rate)} €`;

    itemsHtml += `
      <li class="budget-item">
        <div class="budget-item-name">
          <i class="fa-solid ${item.icon}"></i>
          <div>
            <strong>${item.category}</strong>
            <div style="font-size:0.75rem;color:var(--text-muted);">${item.details}</div>
          </div>
        </div>
        <div class="budget-item-amount">${displayAmount}</div>
      </li>
    `;
  });

  listContainer.innerHTML = itemsHtml;

  const totalTeamHUF = totalPerPersonHUF * participantCount;

  if (totalPerPersonEl && totalTeamEl) {
    if (currentCurrency === 'HUF') {
      totalPerPersonEl.textContent = `${totalPerPersonHUF.toLocaleString('hu-HU')} Ft / fő`;
      totalTeamEl.textContent = `Teljes csapat (${participantCount} fő): ${totalTeamHUF.toLocaleString('hu-HU')} Ft`;
    } else {
      const perPersonEUR = Math.round(totalPerPersonHUF / rate);
      const teamEUR = Math.round(totalTeamHUF / rate);
      totalPerPersonEl.textContent = `${perPersonEUR.toLocaleString()} € / fő`;
      totalTeamEl.textContent = `Teljes csapat (${participantCount} fő): ${teamEUR.toLocaleString()} €`;
    }
  }
}

/* ==========================================================================
   Csomagolási Csekklista (LocalStorage perzisztenciával)
   ========================================================================== */
function initChecklist() {
  const container = document.getElementById('checklist-container');
  if (!container) return;

  const savedChecks = JSON.parse(localStorage.getItem('lordtura_checklist') || localStorage.getItem('dolomiti_checklist') || '{}');

  const groups = [
    { key: 'climbers', title: 'Mászó Csapat Kötelező Felszerelés', class: 'climber', icon: 'fa-person-hiking', items: EXPEDITION_DATA.packingChecklist.climbers },
    { key: 'hikers', title: 'Túrázó & Fotós Csapat Felszerelés', class: 'hiker', icon: 'fa-shoe-prints', items: EXPEDITION_DATA.packingChecklist.hikers },
    { key: 'common', title: 'Közös Dokumentumok & Biztonság', class: 'common', icon: 'fa-shield-halved', items: EXPEDITION_DATA.packingChecklist.common }
  ];

  container.innerHTML = groups.map(group => `
    <div class="checklist-card ${group.class}">
      <h4><i class="fa-solid ${group.icon}"></i> ${group.title}</h4>
      <div class="check-items-list">
        ${group.items.map(item => {
          const isChecked = !!savedChecks[item.id];
          return `
            <label class="check-item ${isChecked ? 'checked' : ''}" data-id="${item.id}">
              <input type="checkbox" ${isChecked ? 'checked' : ''} onchange="toggleCheckItem('${item.id}', this)">
              <span>${item.text}</span>
            </label>
          `;
        }).join('')}
      </div>
    </div>
  `).join('');

  updateChecklistProgress();
}

window.toggleCheckItem = function(id, checkboxEl) {
  const savedChecks = JSON.parse(localStorage.getItem('lordtura_checklist') || localStorage.getItem('dolomiti_checklist') || '{}');
  savedChecks[id] = checkboxEl.checked;
  localStorage.setItem('lordtura_checklist', JSON.stringify(savedChecks));

  const parentLabel = checkboxEl.closest('.check-item');
  if (parentLabel) {
    parentLabel.classList.toggle('checked', checkboxEl.checked);
  }

  updateChecklistProgress();
};

function updateChecklistProgress() {
  const checkboxes = document.querySelectorAll('.check-item input[type="checkbox"]');
  const checkedBoxes = document.querySelectorAll('.check-item input[type="checkbox"]:checked');
  const fill = document.getElementById('checklist-progress-fill');
  const text = document.getElementById('checklist-progress-text');

  if (!checkboxes.length) return;

  const pct = Math.round((checkedBoxes.length / checkboxes.length) * 100);
  if (fill) fill.style.width = `${pct}%`;
  if (text) text.textContent = `${pct}% Becsomagolva (${checkedBoxes.length} / ${checkboxes.length})`;
}

/* ==========================================================================
   Logisztikai & Biztonsági Tippek Renderelése
   ========================================================================== */
function initLogistics() {
  const container = document.getElementById('logistics-container');
  if (!container) return;

  container.innerHTML = EXPEDITION_DATA.logistics.map(log => `
    <div class="log-card">
      <div class="log-card-header">
        <div class="log-icon ${log.type}">
          <i class="fa-solid ${log.icon}"></i>
        </div>
        <h4>${log.title}</h4>
      </div>
      <p>${log.description}</p>
    </div>
  `).join('');
}

/* ==========================================================================
   Élő Hegyi Időjárás & Webkamerák Modul (Open-Meteo API & 360° Panomax)
   ========================================================================== */
let weatherCache = {};
let weatherIsLoading = false;

function initWeatherSection() {
  const refreshBtn = document.getElementById('refresh-weather-btn');
  if (refreshBtn) {
    refreshBtn.addEventListener('click', (e) => {
      e.preventDefault();
      fetchWeatherData(true);
    });
  }

  renderWebcamsHub();
  fetchWeatherData(false);
}

function getWeatherIconAndDesc(code) {
  switch (code) {
    case 0:
      return { desc: 'Tiszta, derült alpesi égbolt', icon: 'fa-sun', color: '#fbbf24', stormRisk: 'Alacsony' };
    case 1:
      return { desc: 'Főként derült, szép idő', icon: 'fa-sun', color: '#fcd34d', stormRisk: 'Alacsony' };
    case 2:
      return { desc: 'Részben felhős idő', icon: 'fa-cloud-sun', color: '#93c5fd', stormRisk: 'Alacsony' };
    case 3:
      return { desc: 'Borult hegycsúcsok', icon: 'fa-cloud', color: '#94a3b8', stormRisk: 'Mérsékelt' };
    case 45:
    case 48:
      return { desc: 'Hegyi köd / felhőben úszó gerincek', icon: 'fa-smog', color: '#cbd5e1', stormRisk: 'Alacsony' };
    case 51:
    case 53:
    case 55:
      return { desc: 'Szitáló eső', icon: 'fa-cloud-rain', color: '#60a5fa', stormRisk: 'Mérsékelt' };
    case 61:
    case 63:
    case 65:
      return { desc: 'Alpesi esőzés', icon: 'fa-cloud-showers-heavy', color: '#38bdf8', stormRisk: 'Mérsékelt' };
    case 71:
    case 73:
    case 75:
    case 77:
      return { desc: 'Havazás / havas eső a magasban', icon: 'fa-snowflake', color: '#e0f2fe', stormRisk: 'Alacsony' };
    case 80:
    case 81:
    case 82:
      return { desc: 'Hirtelen hegyi zápor', icon: 'fa-cloud-showers-water', color: '#0284c7', stormRisk: 'Magas' };
    case 95:
      return { desc: 'HEVES ZIVATAR! Villámlás a gerincen!', icon: 'fa-cloud-bolt', color: '#ef4444', stormRisk: 'KRITIKUS!' };
    case 96:
    case 99:
      return { desc: 'HEVES JÉGESŐ & ZIVATAR!', icon: 'fa-cloud-bolt', color: '#ef4444', stormRisk: 'KRITIKUS ÉLETVESZÉLY!' };
    default:
      return { desc: 'Változékony hegyi idő', icon: 'fa-cloud-sun', color: '#93c5fd', stormRisk: 'Közepes' };
  }
}

async function fetchWeatherData(force = false) {
  const container = document.getElementById('weather-cards-container');
  const lastUpdatedEl = document.getElementById('weather-last-updated');
  const refreshBtn = document.getElementById('refresh-weather-btn');
  if (!container) return;

  if (weatherIsLoading) return;
  weatherIsLoading = true;

  if (refreshBtn) refreshBtn.classList.add('spinning');
  if (lastUpdatedEl) lastUpdatedEl.innerHTML = '<i class="fa-solid fa-arrows-rotate fa-spin" style="color:var(--accent-blue);"></i> Élő magassági adatok letöltése...';

  const locations = EXPEDITION_DATA.weatherLocations || [];

  try {
    const results = await Promise.all(locations.map(async (loc) => {
      if (!force && weatherCache[loc.id] && (Date.now() - weatherCache[loc.id].timestamp < 15 * 60 * 1000)) {
        return weatherCache[loc.id].data;
      }

      const url = `https://api.open-meteo.com/v1/forecast?latitude=${loc.lat}&longitude=${loc.lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m,wind_gusts_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max,wind_speed_10m_max&timezone=Europe%2FRome`;
      
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 6000);

      try {
        const res = await fetch(url, { signal: controller.signal });
        clearTimeout(timeoutId);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        const dataObj = { loc, weather: json, live: true };
        weatherCache[loc.id] = { timestamp: Date.now(), data: dataObj };
        return dataObj;
      } catch (err) {
        console.warn(`Időjárás fallback (${loc.name}):`, err);
        const isPeak = loc.altitude.includes('2 ');
        const tempFallback = isPeak ? 11.5 : 18.0;
        return {
          loc,
          weather: {
            current: {
              temperature_2m: tempFallback,
              apparent_temperature: tempFallback - 2.5,
              relative_humidity_2m: 62,
              precipitation: 0.0,
              weather_code: 2,
              wind_speed_10m: isPeak ? 22 : 12,
              wind_gusts_10m: isPeak ? 38 : 20
            },
            daily: {
              temperature_2m_max: [tempFallback + 4],
              temperature_2m_min: [tempFallback - 5],
              precipitation_probability_max: [isPeak ? 35 : 20],
              wind_speed_10m_max: [isPeak ? 42 : 24]
            }
          },
          live: false
        };
      }
    }));

    renderWeatherCards(results);

    const now = new Date();
    const timeStr = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    if (lastUpdatedEl) {
      lastUpdatedEl.innerHTML = `<i class="fa-solid fa-circle-check" style="color:#10b981;"></i> Élő Open-Meteo &bull; Frissítve: ${timeStr}`;
    }
  } catch (e) {
    console.error('Központi időjárás lekérési hiba:', e);
    if (lastUpdatedEl) {
      lastUpdatedEl.innerHTML = '<i class="fa-solid fa-circle-exclamation" style="color:#ef4444;"></i> Időjárás lekérési hiba';
    }
  } finally {
    weatherIsLoading = false;
    if (refreshBtn) refreshBtn.classList.remove('spinning');
  }
}

function renderWeatherCards(results) {
  const container = document.getElementById('weather-cards-container');
  if (!container) return;

  container.innerHTML = results.map(item => {
    const { loc, weather, live } = item;
    const cur = weather.current || {};
    const daily = weather.daily || {};

    const code = cur.weather_code !== undefined ? cur.weather_code : 1;
    const info = getWeatherIconAndDesc(code);

    const temp = Math.round(cur.temperature_2m);
    const feel = Math.round(cur.apparent_temperature);
    const wind = Math.round(cur.wind_speed_10m);
    const gusts = Math.round(cur.wind_gusts_10m);
    const humidity = cur.relative_humidity_2m;
    const rainProb = (daily.precipitation_probability_max && daily.precipitation_probability_max[0] !== undefined)
      ? daily.precipitation_probability_max[0]
      : 20;

    const maxT = (daily.temperature_2m_max && daily.temperature_2m_max[0] !== undefined) ? Math.round(daily.temperature_2m_max[0]) : temp + 3;
    const minT = (daily.temperature_2m_min && daily.temperature_2m_min[0] !== undefined) ? Math.round(daily.temperature_2m_min[0]) : temp - 4;

    let stormClass = 'safe';
    let stormLabel = 'Alacsony';
    if (code >= 95 || rainProb >= 60) {
      stormClass = 'danger';
      stormLabel = 'MAGAS ZIVATARVESZÉLY!';
    } else if (code >= 80 || rainProb >= 35) {
      stormClass = 'warning';
      stormLabel = 'Délutáni zápor esély';
    }

    return `
      <div class="weather-card ${stormClass}">
        <div class="weather-card-header">
          <div>
            <span class="weather-badge">${loc.region} &bull; ${loc.altitude}</span>
            <h4><i class="fa-solid ${loc.icon}"></i> ${loc.name}</h4>
          </div>
          <span class="live-pill ${live ? 'online' : 'cached'}">${live ? 'Élő' : 'Modell'}</span>
        </div>

        <div class="weather-main-row">
          <div class="weather-temp-block">
            <span class="temp-big">${temp}°C</span>
            <span class="temp-feel">Érzet: ${feel}°C &bull; ${minT}° / ${maxT}°</span>
          </div>
          <div class="weather-condition-block">
            <i class="fa-solid ${info.icon}" style="color:${info.color};font-size:2.4rem;"></i>
            <span class="condition-desc">${info.desc}</span>
          </div>
        </div>

        <div class="weather-metrics-grid">
          <div class="weather-metric-item">
            <span class="metric-label"><i class="fa-solid fa-wind"></i> Szél / Lökések</span>
            <strong class="metric-value">${wind} km/h <small>(${gusts} max)</small></strong>
          </div>
          <div class="weather-metric-item">
            <span class="metric-label"><i class="fa-solid fa-droplet"></i> Csapadék esély</span>
            <strong class="metric-value" style="color:${rainProb > 40 ? '#ef4444' : '#38bdf8'};">${rainProb}%</strong>
          </div>
          <div class="weather-metric-item">
            <span class="metric-label"><i class="fa-solid fa-water"></i> Páratartalom</span>
            <strong class="metric-value">${humidity}%</strong>
          </div>
          <div class="weather-metric-item">
            <span class="metric-label"><i class="fa-solid fa-bolt"></i> Zivatar kockázat</span>
            <strong class="metric-value storm-val ${stormClass}">${stormLabel}</strong>
          </div>
        </div>
      </div>
    `;
  }).join('');
}

let activeFeaturedCamId = 'cam_seceda';

function getCamIcon(camId) {
  switch(camId) {
    case 'cam_seceda': return 'fa-mountain-sun';
    case 'cam_trecime': return 'fa-mountain';
    case 'cam_5torri': return 'fa-monument';
    case 'cam_pordoi': return 'fa-cable-car';
    case 'cam_cortina': return 'fa-city';
    case 'cam_gardena': return 'fa-person-skiing';
    case 'cam_sassolungo': return 'fa-gem';
    case 'cam_colraiser': return 'fa-tree';
    default: return 'fa-video';
  }
}

function renderWebcamsHub() {
  const tabsBar = document.getElementById('webcam-tabs-bar');
  const container = document.getElementById('webcams-cards-container');
  const refreshBtn = document.getElementById('featured-cam-refresh-btn');
  const cams = EXPEDITION_DATA.liveWebcams || [];

  if (refreshBtn && !refreshBtn.dataset.bound) {
    refreshBtn.dataset.bound = 'true';
    refreshBtn.addEventListener('click', () => {
      const iframe = document.getElementById('featured-webcam-iframe');
      if (iframe) {
        const icon = refreshBtn.querySelector('i');
        if (icon) icon.classList.add('fa-spin');
        const currentSrc = iframe.src.split('?')[0];
        iframe.src = currentSrc + '?t=' + Date.now();
        setTimeout(() => {
          if (icon) icon.classList.remove('fa-spin');
        }, 1000);
      }
    });
  }

  // Render Tabs
  if (tabsBar) {
    tabsBar.innerHTML = cams.map(cam => {
      const isActive = cam.id === activeFeaturedCamId;
      const icon = getCamIcon(cam.id);
      return `
        <button type="button" class="webcam-tab-btn ${isActive ? 'active' : ''}" data-cam-id="${cam.id}" onclick="switchFeaturedWebcam('${cam.id}')">
          <i class="fa-solid ${icon}"></i>
          <span>${cam.title.split('&')[0].trim()}</span>
          <span class="tab-badge">${cam.altitude}</span>
        </button>
      `;
    }).join('');
  }

  // Render Cards Grid
  if (container) {
    container.innerHTML = cams.map(cam => {
      const isActive = cam.id === activeFeaturedCamId;
      const icon = getCamIcon(cam.id);
      return `
        <div class="webcam-card ${isActive ? 'is-active-cam' : ''}" id="webcam-card-${cam.id}">
          <div class="webcam-card-header">
            <div>
              <span class="webcam-badge"><i class="fa-solid ${icon}"></i> ${cam.badge}</span>
              <h4>${cam.title}</h4>
            </div>
            <span class="webcam-live-indicator"><span class="pulse-dot"></span> LIVE</span>
          </div>

          <div class="webcam-card-media" id="webcam-media-${cam.id}">
            <img src="${cam.posterUrl}"
                 alt="${cam.title}"
                 loading="lazy"
                 class="webcam-poster-img"
                 data-fallback="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60">
            <div class="webcam-card-overlay">
              <div class="card-media-actions">
                <button type="button" class="btn-card-stream-fent" onclick="switchFeaturedWebcam('${cam.id}', true)">
                  <i class="fa-solid fa-play"></i> Fenti lejátszóba
                </button>
                <button type="button" class="btn-card-embed-inline" onclick="embedCardWebcam('${cam.id}')">
                  <i class="fa-solid fa-tv"></i> Élő stream itt
                </button>
              </div>
            </div>
          </div>

          <div class="webcam-card-body">
            <p>${cam.description}</p>
          </div>

          <div class="webcam-footer">
            <span style="font-size:0.75rem;color:var(--text-muted);"><i class="fa-solid fa-server"></i> ${cam.provider}</span>
            <a href="${cam.externalUrl || cam.streamUrl || cam.url}" target="_blank" rel="noopener noreferrer" style="font-size:0.75rem;color:var(--accent-blue);font-weight:600;text-decoration:none;display:inline-flex;align-items:center;gap:0.3rem;">
              Közvetlen stream <i class="fa-solid fa-arrow-up-right-from-square" style="font-size:0.7rem;"></i>
            </a>
          </div>
        </div>
      `;
    }).join('');
  }
}

window.switchFeaturedWebcam = function(camId, scrollToPlayer = false) {
  const cams = EXPEDITION_DATA.liveWebcams || [];
  const cam = cams.find(c => c.id === camId);
  if (!cam) return;

  activeFeaturedCamId = camId;

  // Update Top Player Info
  const badgeEl = document.getElementById('featured-cam-badge');
  const titleEl = document.getElementById('featured-cam-title');
  const descEl = document.getElementById('featured-cam-desc');
  const externalLinkEl = document.getElementById('featured-cam-external-link');
  const iframeEl = document.getElementById('featured-webcam-iframe');

  if (badgeEl) badgeEl.textContent = cam.badge;
  if (titleEl) titleEl.textContent = cam.title;
  if (descEl) descEl.textContent = cam.description;
  if (externalLinkEl) externalLinkEl.href = cam.externalUrl || cam.streamUrl;
  if (iframeEl && iframeEl.src !== (cam.streamUrl || cam.url)) {
    iframeEl.src = cam.streamUrl || cam.url;
  }

  // Update tabs active state
  document.querySelectorAll('.webcam-tab-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.camId === camId);
  });

  // Update cards active border
  document.querySelectorAll('.webcam-card').forEach(card => {
    card.classList.toggle('is-active-cam', card.id === `webcam-card-${camId}`);
  });

  if (scrollToPlayer) {
    const playerBox = document.getElementById('featured-webcam-box');
    if (playerBox) {
      playerBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
};

window.embedCardWebcam = function(camId) {
  const cams = EXPEDITION_DATA.liveWebcams || [];
  const cam = cams.find(c => c.id === camId);
  const mediaContainer = document.getElementById(`webcam-media-${camId}`);
  if (!cam || !mediaContainer) return;

  mediaContainer.innerHTML = `
    <button type="button" class="btn-close-inline-frame" onclick="restoreCardPoster('${camId}')" title="Bezárás / vissza a pillanatképre">
      <i class="fa-solid fa-xmark"></i> Bezárás
    </button>
    <iframe class="webcam-inline-frame"
            src="${cam.streamUrl || cam.url}"
            title="${cam.title}"
            allowfullscreen
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture">
    </iframe>
  `;
};

window.restoreCardPoster = function(camId) {
  const cams = EXPEDITION_DATA.liveWebcams || [];
  const cam = cams.find(c => c.id === camId);
  const mediaContainer = document.getElementById(`webcam-media-${camId}`);
  if (!cam || !mediaContainer) return;

  mediaContainer.innerHTML = `
    <img src="${cam.posterUrl}"
         alt="${cam.title}"
         loading="lazy"
         class="webcam-poster-img"
         data-fallback="https://images.unsplash.com/photo-1506744038136-46273834b3fb?w=800&auto=format&fit=crop&q=60">
    <div class="webcam-card-overlay">
      <div class="card-media-actions">
        <button type="button" class="btn-card-stream-fent" onclick="switchFeaturedWebcam('${cam.id}', true)">
          <i class="fa-solid fa-play"></i> Fenti lejátszóba
        </button>
        <button type="button" class="btn-card-embed-inline" onclick="embedCardWebcam('${cam.id}')">
          <i class="fa-solid fa-tv"></i> Élő stream itt
        </button>
      </div>
    </div>
  `;
};

/* ==========================================================================
   Hütte Kalauz & Dél-Tiroli Gasztro Kisokos
   ========================================================================== */
function initHutsSection() {
  renderHutsList();
  renderGastroList();
}

function renderHutsList() {
  const container = document.getElementById('huts-cards-container');
  if (!container) return;

  const huts = EXPEDITION_DATA.mountainHuts || [];

  container.innerHTML = huts.map(hut => {
    const isCashOnly = hut.paymentType === 'cash-only';
    const isCardAccepted = hut.paymentType === 'card-accepted';
    const paymentBadgeColor = isCashOnly ? '#ef4444' : (isCardAccepted ? '#10b981' : '#f59e0b');

    return `
      <div class="hut-card">
        <div class="hut-card-top">
          <div>
            <div class="hut-meta-row">
              <span class="hut-alt-badge"><i class="fa-solid fa-mountain"></i> ${hut.altitude}</span>
              <span class="hut-day-badge">${hut.day}. Nap &bull; ${hut.group}</span>
            </div>
            <h4>${hut.name}</h4>
          </div>
          <div class="hut-payment-chip" style="border-color:${paymentBadgeColor};color:${paymentBadgeColor};">
            <i class="fa-solid ${isCashOnly ? 'fa-money-bill-wave' : 'fa-credit-card'}"></i>
            <span>${isCashOnly ? 'CSAK KÉSZPÉNZ' : (isCardAccepted ? 'Kártya is OK' : 'Készpénz preferált')}</span>
          </div>
        </div>

        <p class="hut-highlights-p">${hut.highlights}</p>

        <div class="hut-specs-box">
          <div class="hut-spec-line">
            <i class="fa-solid fa-faucet-drip" style="color:#38bdf8;"></i>
            <span><strong>Ivóvíz:</strong> ${hut.water}</span>
          </div>
          <div class="hut-spec-line">
            <i class="fa-solid fa-restroom" style="color:#94a3b8;"></i>
            <span><strong>Mosdó:</strong> ${hut.toilet}</span>
          </div>
          <div class="hut-spec-line">
            <i class="fa-solid fa-tower-broadcast" style="color:#f59e0b;"></i>
            <span><strong>Térerő:</strong> ${hut.signal}</span>
          </div>
          <div class="hut-spec-line">
            <i class="fa-solid fa-calendar-check" style="color:#10b981;"></i>
            <span><strong>Nyitvatartás:</strong> ${hut.openPeriod}</span>
          </div>
          <div class="hut-spec-line specialty">
            <i class="fa-solid fa-utensils" style="color:var(--accent-gold);"></i>
            <span><strong>Ház specialitása:</strong> ${hut.speciality}</span>
          </div>
        </div>

        <div class="hut-footer-row">
          <a href="tel:${hut.phone.replace(/\s+/g, '')}" class="hut-tel-btn">
            <i class="fa-solid fa-phone"></i> ${hut.phone}
          </a>
          <button class="btn-sm btn-hut-map" onclick="focusHutOnMap(${hut.coords[0]}, ${hut.coords[1]}, '${hut.name}')">
            <i class="fa-solid fa-location-dot"></i> Térkép
          </button>
        </div>
      </div>
    `;
  }).join('');
}

window.focusHutOnMap = function(lat, lon, name) {
  switchSection('tours-section');
  if (map) {
    map.setView([lat, lon], 14);
    L.popup()
      .setLatLng([lat, lon])
      .setContent(`<div class="custom-popup-box"><h4>🏡 ${name}</h4><p>Magashegyi menedékház a túra mentén.</p></div>`)
      .openOn(map);
  }
};

function renderGastroList() {
  const container = document.getElementById('gastro-cards-container');
  if (!container) return;

  const items = EXPEDITION_DATA.gastroGuide || [];

  container.innerHTML = items.map(dish => `
    <div class="gastro-card">
      <div class="gastro-card-top">
        <div class="gastro-icon-circle">${dish.imageEmoji}</div>
        <div style="flex:1;">
          <div style="display:flex;justify-content:space-between;align-items:flex-start;flex-wrap:wrap;gap:4px;">
            <span class="gastro-cat-badge">${dish.category}</span>
            <span class="gastro-price-tag">${dish.price}</span>
          </div>
          <h4>${dish.name}</h4>
          <span class="gastro-subname">${dish.subName}</span>
        </div>
      </div>

      <p class="gastro-desc">${dish.desc}</p>

      <div class="gastro-tip-box">
        <i class="fa-solid fa-lightbulb" style="color:var(--accent-gold);"></i>
        <div>
          <strong>Túravezető Tipp:</strong> ${dish.proTip}
        </div>
      </div>
    </div>
  `).join('');
}

/* ==========================================================================
   Központi Parkolási & Útdíj Hub (Waze & Google Maps Navigáció)
   ========================================================================== */
function initParkingHub() {
  const container = document.getElementById('parking-hub-container');
  if (!container) return;

  const parks = EXPEDITION_DATA.parkingHub || [];

  container.innerHTML = parks.map(p => `
    <div class="parking-hub-card">
      <div class="parking-card-header">
        <div>
          <span class="parking-area-badge">${p.day}. Nap &bull; ${p.area}</span>
          <h4>${p.name}</h4>
        </div>
        <span class="parking-status-tag ${p.status.includes('SZIGORÚ') || p.status.includes('KÖTELES') ? 'strict' : 'normal'}">${p.status}</span>
      </div>

      <div class="parking-rate-strip">
        <div class="parking-rate-item">
          <span class="rate-lbl"><i class="fa-solid fa-coins"></i> Parkolási díj:</span>
          <strong class="rate-val">${p.cost}</strong>
        </div>
        <div class="parking-rate-item">
          <span class="rate-lbl"><i class="fa-solid fa-car"></i> Kapacitás:</span>
          <strong class="rate-val">${p.capacity}</strong>
        </div>
      </div>

      <p class="parking-desc-text">${p.description}</p>

      <div class="parking-actions-row">
        <a href="${p.googleUrl}" target="_blank" class="parking-action-btn google" title="Google Térkép útvonaltervezés a parkolóhoz">
          <i class="fa-solid fa-diamond-turn-right"></i> Google Térkép
        </a>
        <a href="${p.wazeUrl}" target="_blank" class="parking-action-btn waze" title="Waze GPS navigáció azonnali indítása">
          <i class="fa-brands fa-waze"></i> Waze
        </a>
      </div>
    </div>
  `).join('');
}
