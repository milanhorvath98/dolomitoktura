/**
 * DÜRRE WAND & PLATTENSTEIN TÚRA - JAVASCRIPT APPLICATION
 * 2026. szeptember 26. (Szombat)
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroSlideshow();
  initLeafletMapAndElevation();
  initTimeline();
  initGallery();
  initPackingList();
  initLiveWeather();
  initNavigation();
  initFloatingMapButton();
});

/* ==========================================================================
   1. HERO SLIDESHOW
   ========================================================================== */
function initHeroSlideshow() {
  const slidesContainer = document.getElementById('heroBgSlides');
  const dotsContainer = document.getElementById('heroDots');
  const captionTextEl = document.getElementById('heroCaptionText');
  const tagBadgeEl = document.getElementById('heroTagBadge');
  const photoTagEl = document.getElementById('heroPhotoTag');
  const prevBtn = document.getElementById('heroPrevBtn');
  const nextBtn = document.getElementById('heroNextBtn');
  const playPauseBtn = document.getElementById('heroPlayPauseBtn');

  if (!slidesContainer || !TOUR_DATA.heroSlides) return;

  slidesContainer.innerHTML = '';
  if (dotsContainer) dotsContainer.innerHTML = '';

  TOUR_DATA.heroSlides.forEach((slide, idx) => {
    // Slide elem létrehozása
    const slideDiv = document.createElement('div');
    slideDiv.className = `hero-slide ${idx === 0 ? 'active' : ''}`;
    slideDiv.style.backgroundImage = `url('${slide.image}')`;
    slideDiv.setAttribute('role', 'img');
    slideDiv.setAttribute('aria-label', slide.title);
    slidesContainer.appendChild(slideDiv);

    // Indikátor pont
    if (dotsContainer) {
      const dot = document.createElement('button');
      dot.className = `hero-dot ${idx === 0 ? 'active' : ''}`;
      dot.setAttribute('aria-label', `Ugrás a ${idx + 1}. képre: ${slide.title}`);
      dot.addEventListener('click', () => setSlide(idx));
      dotsContainer.appendChild(dot);
    }
  });

  let currentSlide = 0;
  let slideInterval = null;
  let isPlaying = true;

  function updateCaption(idx) {
    const s = TOUR_DATA.heroSlides[idx];
    if (!s) return;
    if (captionTextEl) {
      captionTextEl.style.opacity = '0';
      setTimeout(() => {
        captionTextEl.innerHTML = `<strong>${s.title}</strong> &bull; ${s.caption}`;
        if (tagBadgeEl) {
          tagBadgeEl.textContent = s.tag || 'Helyszín';
        }
        captionTextEl.style.opacity = '1';
      }, 140);
    }
  }

  function setSlide(idx) {
    const slides = slidesContainer.querySelectorAll('.hero-slide');
    const dots = dotsContainer ? dotsContainer.querySelectorAll('.hero-dot') : [];

    slides.forEach((s, i) => s.classList.toggle('active', i === idx));
    dots.forEach((d, i) => d.classList.toggle('active', i === idx));

    currentSlide = idx;
    updateCaption(idx);
    if (isPlaying) restartTimer();
  }

  function nextSlide() {
    let next = (currentSlide + 1) % TOUR_DATA.heroSlides.length;
    setSlide(next);
  }

  function prevSlide() {
    let prev = (currentSlide - 1 + TOUR_DATA.heroSlides.length) % TOUR_DATA.heroSlides.length;
    setSlide(prev);
  }

  function startTimer() {
    clearInterval(slideInterval);
    slideInterval = setInterval(nextSlide, 6500);
  }

  function stopTimer() {
    clearInterval(slideInterval);
    slideInterval = null;
  }

  function restartTimer() {
    stopTimer();
    startTimer();
  }

  if (prevBtn) {
    prevBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      prevSlide();
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      nextSlide();
    });
  }

  if (playPauseBtn) {
    playPauseBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (isPlaying) {
        stopTimer();
        isPlaying = false;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-play"></i>';
        playPauseBtn.title = 'Diavetítés indítása';
      } else {
        startTimer();
        isPlaying = true;
        playPauseBtn.innerHTML = '<i class="fa-solid fa-pause"></i>';
        playPauseBtn.title = 'Diavetítés szüneteltetése';
      }
    });
  }

  if (photoTagEl) {
    photoTagEl.addEventListener('click', () => {
      nextSlide();
    });
  }

  updateCaption(0);
  startTimer();
}

/* ==========================================================================
   2. LEAFLET INTERACTIVE MAP & ELEVATION PROFILE
   ========================================================================== */
let mapInstance = null;
let liveTrackMarker = null;
let fullRoutePolyline = null;
let trackCoordinates = [];
const waypointMarkers = {};
let activeFilters = { stage: 'all', poi: 'all' };

function createCustomMarker(coords, faIcon, color, title, isSummit = false) {
  const iconHtml = `
    <div class="custom-marker-badge ${isSummit ? 'summit-badge' : ''}" style="background: ${color};" title="${title}">
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

function initLeafletMapAndElevation() {
  const mapEl = document.getElementById('routeMap');
  if (!mapEl) return;

  // 1. Térkép inicializálása a Dürre Wand hegytömbre igazítva
  mapInstance = L.map('routeMap', {
    center: [47.848, 15.955],
    zoom: 13,
    zoomControl: true,
    scrollWheelZoom: true
  });

  // 2. Alaptérkép rétegek (pontosan megegyezve a Dolomitok oldallal)
  const topoLayer = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
    maxZoom: 17,
    attribution: 'Térképadatok: &copy; OpenStreetMap, SRTM | Stílus: &copy; OpenTopoMap'
  });

  const satLayer = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
    maxZoom: 19,
    attribution: 'Tiles &copy; Esri &mdash; DigitalGlobe, GeoEye, Earthstar Geographics'
  });

  const osmLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 19,
    attribution: '&copy; OpenStreetMap contributors'
  });

  // Alapértelmezett réteg: Topográfia
  topoLayer.addTo(mapInstance);

  const baseMaps = {
    "🏔️ Alpesi Topográfia (OpenTopo)": topoLayer,
    "🛰️ Műholdas Nézet (Esri Satellite)": satLayer,
    "🗺️ Szabványos Utcatérkép (OSM)": osmLayer
  };
  L.control.layers(baseMaps, null, { position: 'topright' }).addTo(mapInstance);

  // 3. Valós GPX nyomvonal kirajzolása
  const elevData = TOUR_DATA.elevationData;
  if (elevData && elevData.track && elevData.track.length > 0) {
    trackCoordinates = elevData.track.map(pt => [pt.lat, pt.lon]);

    // Háttér árnyékoló vonal a jobb kontrasztért műholdképen is
    L.polyline(trackCoordinates, {
      color: '#064e3b',
      weight: 9,
      opacity: 0.45,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(mapInstance);

    // Fő túra nyomvonal (ragyogó zöld)
    fullRoutePolyline = L.polyline(trackCoordinates, {
      color: '#10b981',
      weight: 5,
      opacity: 0.92,
      lineJoin: 'round',
      lineCap: 'round'
    }).addTo(mapInstance);

    const ptCount = trackCoordinates.length;
    const polylinePopupHtml = `
      <div class="custom-popup-box">
        <span class="custom-popup-badge" style="background: rgba(4, 120, 87, 0.2); color: var(--emerald-600);">
          Dürre Wand Körtúra • 9.07 km
        </span>
        <h4>Plattenstein & Gauermannhütte Kör</h4>
        <p><strong>Útvonal:</strong> Frohnberg &rarr; Wurzelsteig &rarr; Plattenstein (1154m) &rarr; Gauermannhütte &rarr; Ochsenweg &rarr; Schwaighofer &rarr; Frohnberg</p>
        <div class="custom-popup-badges">
          <span class="custom-popup-badge" style="background:#1e293b;color:#f1f5f9;">9.07 km</span>
          <span class="custom-popup-badge" style="background:#1e293b;color:#f1f5f9;">+656 m / -656 m</span>
          <span class="custom-popup-badge" style="background:#1e293b;color:#f1f5f9;">3.5–4.5 óra</span>
          <span class="custom-popup-badge" style="background:rgba(3,105,161,0.2);color:var(--accent-blue);">
            <i class="fa-solid fa-satellite-dish"></i> ${ptCount} GPS pont
          </span>
        </div>
        <div style="margin-top:0.6rem;display:flex;gap:6px;flex-wrap:wrap;">
          <a class="custom-popup-btn" style="background:#10b981;color:#fff;text-decoration:none;" href="plattenstein.gpx" download="durrewand_plattenstein.gpx">
            <i class="fa-solid fa-download"></i> GPX Letöltése
          </a>
          <button class="custom-popup-btn" style="background:#3b82f6;color:#fff;" onclick="fitFullRoute()">
            <i class="fa-solid fa-compress"></i> Teljes Kör
          </button>
        </div>
      </div>
    `;
    fullRoutePolyline.bindPopup(polylinePopupHtml);

    // Kezdeti illesztés a teljes körre
    mapInstance.fitBounds(fullRoutePolyline.getBounds(), { padding: [40, 40] });

    // Élő kurzor követő marker a térképen
    liveTrackMarker = L.marker(trackCoordinates[0], {
      icon: L.divIcon({
        className: 'live-marker-container',
        html: '<div class="live-track-marker"></div>',
        iconSize: [16, 16],
        iconAnchor: [8, 8]
      }),
      zIndexOffset: 1000
    }).addTo(mapInstance);

    // Szintrajz kirajzolása
    renderSvgElevationProfile(elevData.track, elevData.totalDistKm, elevData.minEle, elevData.maxEle);
  }

  // 4. Egyedi Markerek Kirajzolása (Kerek 32px ikonok, színkódolva a Dolomitok oldal szerint)
  if (TOUR_DATA.waypoints && TOUR_DATA.waypoints.length > 0) {
    TOUR_DATA.waypoints.forEach(wp => {
      let color = '#10b981';
      let icon = wp.icon || 'fa-location-dot';
      let isSummit = false;
      let category = 'trail';
      let stage = 'climb';

      if (wp.distKm <= 4.2) {
        stage = 'climb';
      } else if (wp.distKm > 4.2 && wp.distKm <= 4.6) {
        stage = 'summit';
      } else {
        stage = 'descent';
      }

      if (wp.type === 'summit') {
        color = '#f59e0b';
        isSummit = true;
        category = 'highlights';
      } else if (wp.type === 'hut') {
        color = '#f97316';
        category = 'highlights';
      } else if (wp.type === 'start' || wp.type === 'end') {
        color = '#3b82f6';
        category = 'highlights';
      } else if (wp.type === 'viewpoint') {
        color = '#06b6d4';
        category = 'viewpoints';
      } else if (wp.type === 'poi') {
        color = '#a855f7';
        category = 'viewpoints';
      }

      const marker = createCustomMarker([wp.lat, wp.lon], icon, color, wp.name, isSummit);

      const popupHtml = `
        <div class="custom-popup-box">
          <span class="custom-popup-badge" style="background: rgba(4, 120, 87, 0.2); color: var(--emerald-600);">
            ${wp.badge || (wp.elevation + ' m')}
          </span>
          <h4>${wp.name}</h4>
          ${wp.image ? `<img src="${wp.image}" alt="${wp.name}" loading="lazy">` : ''}
          <p>${wp.desc}</p>
          <div class="custom-popup-badges">
            <span class="custom-popup-badge" style="background:#1e293b;color:#f1f5f9;">
              <i class="fa-solid fa-mountain"></i> ${wp.elevation} m
            </span>
            <span class="custom-popup-badge" style="background:#1e293b;color:#f1f5f9;">
              <i class="fa-solid fa-route"></i> ${wp.distKm} km
            </span>
            <span class="custom-popup-badge" style="background:rgba(3,105,161,0.2);color:var(--accent-blue);">
              <i class="fa-solid fa-satellite-dish"></i> ${wp.lat.toFixed(4)}, ${wp.lon.toFixed(4)}
            </span>
          </div>
          <div style="margin-top:0.6rem;display:flex;gap:6px;flex-wrap:wrap;">
            <button class="custom-popup-btn" style="background:#0284c7;" onclick="syncWithElevation(${wp.distKm})">
              <i class="fa-solid fa-chart-line"></i> Szintrajz
            </button>
            <a class="custom-popup-btn" style="background:#10b981;color:#fff;text-decoration:none;" href="plattenstein.gpx" download="durrewand_plattenstein.gpx">
              <i class="fa-solid fa-download"></i> GPX
            </a>
          </div>
        </div>
      `;

      marker.bindPopup(popupHtml);
      marker.addTo(mapInstance);

      // Marker kattintásra szinkronizálja a szintrajzot is
      marker.on('click', () => {
        syncWithElevation(wp.distKm, false);
      });

      waypointMarkers[wp.id] = {
        marker: marker,
        wp: wp,
        coords: [wp.lat, wp.lon],
        category: category,
        stage: stage
      };
    });
  }

  // 5. Térképszűrő Kezelők inicializálása
  initMapFilterButtons();
}

/* ==========================================================================
   Térképszűrő Kezelők (Szakaszok & Pontok) matching Dolomitok
   ========================================================================== */
function initMapFilterButtons() {
  const stageBtns = document.querySelectorAll('.stage-filter-btn');
  const poiBtns = document.querySelectorAll('.poi-filter-btn');

  stageBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      stageBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.stage = btn.dataset.stage;
      applyMapFilters();
    });
  });

  poiBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      poiBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      activeFilters.poi = btn.dataset.poi;
      applyMapFilters();
    });
  });
}

function applyMapFilters() {
  if (!mapInstance || !TOUR_DATA.elevationData) return;

  const elevTrack = TOUR_DATA.elevationData.track || [];

  // Szakasz szűrés és nézetbeállítás
  if (activeFilters.stage === 'all') {
    if (fullRoutePolyline) {
      mapInstance.flyToBounds(fullRoutePolyline.getBounds(), { padding: [40, 40], duration: 1 });
    }
  } else if (activeFilters.stage === 'climb') {
    // 1. Kaptató: 0.0 - 4.2 km
    const climbPts = elevTrack.filter(pt => pt.dist <= 4.2).map(pt => [pt.lat, pt.lon]);
    if (climbPts.length > 0) {
      mapInstance.flyToBounds(L.polyline(climbPts).getBounds(), { padding: [40, 40], duration: 1 });
    }
  } else if (activeFilters.stage === 'summit') {
    // 2. Csúcs & Hütte: ugrás a csúcsra és popup nyitás
    mapInstance.flyTo(TOUR_DATA.tourInfo.summitCoordinates, 15, { duration: 1 });
    const summitObj = waypointMarkers['plattenstein_summit'];
    if (summitObj) {
      setTimeout(() => summitObj.marker.openPopup(), 1050);
    }
  } else if (activeFilters.stage === 'descent') {
    // 3. Ereszkedés: 4.3 - 9.07 km
    const descentPts = elevTrack.filter(pt => pt.dist >= 4.3).map(pt => [pt.lat, pt.lon]);
    if (descentPts.length > 0) {
      mapInstance.flyToBounds(L.polyline(descentPts).getBounds(), { padding: [40, 40], duration: 1 });
    }
  }

  // Pontok láthatósági szűrése
  Object.values(waypointMarkers).forEach(item => {
    let show = true;
    if (activeFilters.poi === 'highlights') {
      show = item.category === 'highlights';
    } else if (activeFilters.poi === 'viewpoints') {
      show = item.category === 'viewpoints';
    }

    if (show) {
      if (!mapInstance.hasLayer(item.marker)) {
        mapInstance.addLayer(item.marker);
      }
    } else {
      if (mapInstance.hasLayer(item.marker)) {
        mapInstance.removeLayer(item.marker);
      }
    }
  });
}

/* ==========================================================================
   Globális Vezérlő Függvények (Térkép, Szintrajz, Ugrások)
   ========================================================================== */
window.focusOnMap = function(waypointId) {
  const mapCard = document.querySelector('.map-card') || document.getElementById('routeMap');
  if (mapCard) {
    mapCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  const markerObj = waypointMarkers[waypointId];
  if (markerObj && mapInstance) {
    if (!mapInstance.hasLayer(markerObj.marker)) {
      mapInstance.addLayer(markerObj.marker);
    }
    setTimeout(() => {
      mapInstance.flyTo(markerObj.coords, 16, { duration: 1.0 });
      setTimeout(() => markerObj.marker.openPopup(), 1050);
    }, 250);
  }
};

window.fitFullRoute = function() {
  if (fullRoutePolyline && mapInstance) {
    mapInstance.flyToBounds(fullRoutePolyline.getBounds(), { padding: [40, 40], duration: 1 });
  }
};

window.syncWithElevation = function(distKm, scroll = true) {
  if (scroll) {
    const szintrajzEl = document.getElementById('szintrajz');
    if (szintrajzEl) {
      szintrajzEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }
  if (typeof window.scrubToDistance === 'function') {
    window.scrubToDistance(distKm);
  }
};

window.scrollToMapOrTop = function() {
  const mapEl = document.getElementById('routeMap');
  if (mapEl) {
    mapEl.scrollIntoView({ behavior: 'smooth', block: 'center' });
  } else {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
};

function initFloatingMapButton() {
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

/* ==========================================================================
   3. SVG ELEVATION PROFILE WITH SCRUBBING & EXACT SUMMIT
   ========================================================================== */
function renderSvgElevationProfile(track, totalDist, minEle, maxEle) {
  const svg = document.getElementById('elevationSvg');
  const tooltip = document.getElementById('profileTooltip');
  if (!svg || !track || track.length === 0) return;
  
  const width = 1000;
  const height = 280;
  const padLeft = 60;
  const padRight = 35;
  const padTop = 55;
  const padBottom = 40;
  
  const plotW = width - padLeft - padRight;
  const plotH = height - padTop - padBottom;
  
  const yMin = 500;
  const yMax = 1200;
  
  function getX(dist) {
    return padLeft + (dist / totalDist) * plotW;
  }
  
  function getY(ele) {
    return padTop + plotH - ((ele - yMin) / (yMax - yMin)) * plotH;
  }
  
  // Dynamic TRUE PEAK detection from GPS track data
  const peakPt = track.reduce((max, pt) => pt.ele > max.ele ? pt : max, track[0]);
  const summitDist = peakPt.dist;
  const summitEle = peakPt.ele;
  const summitX = getX(summitDist);
  const summitY = getY(summitEle);
  
  const isDark = (typeof document !== 'undefined' && document.documentElement.getAttribute('data-theme') === 'dark') || false;
  const peakFill = isDark ? '#fbbf24' : '#854d0e';
  const eleFill = isDark ? '#f8fafc' : '#334155';
  const distFill = isDark ? '#94a3b8' : '#334155';

  // Build SVG Path
  let dPath = `M ${getX(track[0].dist)} ${getY(track[0].ele)}`;
  track.forEach(pt => {
    dPath += ` L ${getX(pt.dist)} ${getY(pt.ele)}`;
  });
  
  const dArea = `${dPath} L ${getX(track[track.length - 1].dist)} ${padTop + plotH} L ${padLeft} ${padTop + plotH} Z`;
  
  // Horizontal grid lines
  const gridLevels = [600, 800, 1000, 1148];
  let gridSvg = '';
  gridLevels.forEach(lvl => {
    const y = getY(lvl);
    const isPeak = lvl === 1148;
    gridSvg += `
      <line x1="${padLeft}" y1="${y}" x2="${width - padRight}" y2="${y}" stroke="${isPeak ? 'rgba(245,158,11,0.4)' : 'rgba(255,255,255,0.08)'}" stroke-dasharray="${isPeak ? '3,3' : '4,4'}" stroke-width="${isPeak ? '1.5' : '1'}"/>
      <text x="${padLeft - 10}" y="${y + 4}" fill="${isPeak ? peakFill : eleFill}" font-size="${isPeak ? '12' : '11'}" font-weight="${isPeak ? 'bold' : 'normal'}" text-anchor="end" font-family="sans-serif">${lvl === 1148 ? '1154 m' : lvl + ' m'}</text>
    `;
  });
  
  // Distance markers along bottom axis
  const distSteps = [0, 2, 4, 6, 8, Math.round(totalDist * 10) / 10];
  let distSvg = '';
  distSteps.forEach(d => {
    const x = getX(d);
    distSvg += `
      <line x1="${x}" y1="${padTop + plotH}" x2="${x}" y2="${padTop + plotH + 6}" stroke="rgba(255,255,255,0.25)"/>
      <text x="${x}" y="${padTop + plotH + 22}" fill="${distFill}" font-size="11" text-anchor="middle" font-family="sans-serif">${d} km</text>
    `;
  });
  
  // Exact Summit Peak Visual Beacon & Floating Badge
  const summitMarkerSvg = `
    <!-- Summit vertical drop line to bottom axis -->
    <line x1="${summitX}" y1="${summitY}" x2="${summitX}" y2="${padTop + plotH}" stroke="#f59e0b" stroke-width="1.5" stroke-dasharray="3,3" opacity="0.6" style="pointer-events:none;"/>
    
    <!-- Summit pulsing halo -->
    <circle cx="${summitX}" cy="${summitY}" r="9" fill="rgba(245, 158, 11, 0.4)" style="pointer-events:none;">
      <animate attributeName="r" values="6;13;6" dur="2s" repeatCount="indefinite"/>
      <animate attributeName="opacity" values="0.8;0.2;0.8" dur="2s" repeatCount="indefinite"/>
    </circle>
    <circle cx="${summitX}" cy="${summitY}" r="5.5" fill="#f59e0b" stroke="#ffffff" stroke-width="2.5" style="pointer-events:none;"/>
    
    <!-- Summit Floating Pill Badge -->
    <g id="summitPillBadge" transform="translate(${summitX}, ${summitY - 14})" style="pointer-events:none; transition: opacity 0.2s ease;">
      <rect x="-105" y="-28" width="210" height="26" rx="13" fill="rgba(15, 23, 42, 0.94)" stroke="#f59e0b" stroke-width="1.5"/>
      <text x="0" y="-11" fill="#fbbf24" font-size="11" font-weight="800" text-anchor="middle" font-family="sans-serif">
        ⛰️ Plattenstein Csúcs &bull; 1 154 m
      </text>
    </g>
  `;
  
  // Waypoint Milestone Pins along the elevation curve
  const milestones = [
    { name: "Start (577m)", dist: 0.0, ele: 577, color: "#3b82f6" },
    { name: "Nyereg (842m)", dist: 2.76, ele: 842, color: "#10b981" },
    { name: "Schwaighofer (804m)", dist: 6.55, ele: 804, color: "#10b981" },
    { name: "Cél (577m)", dist: 9.07, ele: 577, color: "#3b82f6" }
  ];
  
  let milestoneSvg = '';
  milestones.forEach(m => {
    const mx = getX(m.dist);
    const my = getY(m.ele);
    milestoneSvg += `
      <circle cx="${mx}" cy="${my}" r="4" fill="${m.color}" stroke="#ffffff" stroke-width="1.5" style="pointer-events:none;"/>
      <text x="${mx}" y="${my + (m.dist > 5 ? 18 : -10)}" fill="#cbd5e1" font-size="9.5" font-weight="600" text-anchor="middle" font-family="sans-serif" style="pointer-events:none;">${m.name}</text>
    `;
  });
  
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.setAttribute('preserveAspectRatio', 'none');
  svg.innerHTML = `
    <defs>
      <linearGradient id="eleGrad" x1="0%" y1="0%" x2="0%" y2="100%">
        <stop offset="0%" stop-color="#10b981" stop-opacity="0.65"/>
        <stop offset="50%" stop-color="#059669" stop-opacity="0.30"/>
        <stop offset="100%" stop-color="#047857" stop-opacity="0.03"/>
      </linearGradient>
    </defs>
    
    <!-- Grid & Axes -->
    ${gridSvg}
    ${distSvg}
    <line x1="${padLeft}" y1="${padTop + plotH}" x2="${width - padRight}" y2="${padTop + plotH}" stroke="rgba(255,255,255,0.2)" style="pointer-events:none;"/>
    
    <!-- Profile Area & Gradient -->
    <path d="${dArea}" fill="url(#eleGrad)" style="pointer-events:none;"/>
    <path d="${dPath}" fill="none" stroke="#34d399" stroke-width="3.5" stroke-linejoin="round" stroke-linecap="round" style="pointer-events:none;"/>
    
    <!-- Milestones & Summit -->
    ${milestoneSvg}
    ${summitMarkerSvg}
    
    <!-- Interactive Scrubber Guide Line & Dot -->
    <line id="scrubLine" x1="0" y1="${padTop}" x2="0" y2="${padTop + plotH}" stroke="#f59e0b" stroke-width="2" stroke-dasharray="3,3" opacity="0" style="pointer-events:none;"/>
    <circle id="scrubCircle" cx="0" cy="0" r="6" fill="#f59e0b" stroke="#fff" stroke-width="2" opacity="0" style="pointer-events:none;"/>

    <!-- Full hit test overlay rectangle for smooth crosshair interaction -->
    <rect id="scrubHitArea" x="0" y="0" width="${width}" height="${height}" fill="transparent" style="cursor:crosshair; pointer-events:all;"></rect>
  `;
  
  const scrubLine = document.getElementById('scrubLine');
  const scrubCircle = document.getElementById('scrubCircle');
  
  // Interpolate continuous track point along elevation profile curve
  function getTrackPointAtDist(targetDist) {
    if (targetDist <= track[0].dist) return { ...track[0], rawIndex: 0 };
    if (targetDist >= track[track.length - 1].dist) return { ...track[track.length - 1], rawIndex: track.length - 1 };
    
    let i = 0;
    while (i < track.length - 1 && track[i + 1].dist < targetDist) {
      i++;
    }
    const p1 = track[i];
    const p2 = track[Math.min(i + 1, track.length - 1)];
    const span = p2.dist - p1.dist;
    const t = span > 0 ? (targetDist - p1.dist) / span : 0;
    
    return {
      dist: targetDist,
      ele: p1.ele + t * (p2.ele - p1.ele),
      lat: p1.lat + t * (p2.lat - p1.lat),
      lon: p1.lon + t * (p2.lon - p1.lon),
      rawIndex: i
    };
  }

  // Exact 1:1 mapping from mouse clientX to SVG coordinates and track distance
  function getSvgCoordinates(clientX) {
    const rect = svg.getBoundingClientRect();
    if (!rect.width || rect.width <= 0) return null;
    const mouseSvgX = (clientX - rect.left) * (width / rect.width);
    const clampedSvgX = Math.max(padLeft, Math.min(width - padRight, mouseSvgX));
    const plotRatio = Math.max(0, Math.min(1, (clampedSvgX - padLeft) / plotW));
    const curDist = plotRatio * totalDist;
    return { mouseSvgX, clampedSvgX, curDist };
  }

  function updateScrubPosition(curDist, targetSvgX = null) {
    const pt = getTrackPointAtDist(curDist);
    const svgX = targetSvgX !== null ? targetSvgX : getX(pt.dist);
    const svgY = getY(pt.ele);
    
    // Calculate slope percentage (gradient)
    let slopeText = '';
    const nextIdx = Math.min(pt.rawIndex + 2, track.length - 1);
    const prevIdx = Math.max(0, pt.rawIndex - 1);
    const nextPt = track[nextIdx];
    const prevPt = track[prevIdx];
    const distDelta = (nextPt.dist - prevPt.dist) * 1000;
    if (distDelta > 10) {
      const grade = Math.round(((nextPt.ele - prevPt.ele) / distDelta) * 100);
      if (grade > 12) slopeText = `<span style="color:#f87171;">Meredek emelkedő (+${grade}%)</span>`;
      else if (grade < -12) slopeText = `<span style="color:#60a5fa;">Meredek lejtő (${grade}%)</span>`;
      else if (grade > 4) slopeText = `<span style="color:#34d399;">Mérsékelt emelkedés (+${grade}%)</span>`;
      else if (grade < -4) slopeText = `<span style="color:#38bdf8;">Mérsékelt lejtő (${grade}%)</span>`;
      else slopeText = `<span style="color:#94a3b8;">Lankás szakasz</span>`;
    }
    
    // Update SVG elements with zero cursor offset
    scrubLine.setAttribute('x1', svgX);
    scrubLine.setAttribute('x2', svgX);
    scrubLine.setAttribute('opacity', '1');
    
    scrubCircle.setAttribute('cx', svgX);
    scrubCircle.setAttribute('cy', svgY);
    scrubCircle.setAttribute('opacity', '1');
    
    // Update Tooltip position & content
    if (tooltip) {
      const leftPct = (svgX / width) * 100;
      const topPct = (svgY / height) * 100;
      tooltip.style.left = `${leftPct}%`;
      tooltip.style.top = `${topPct}%`;
      
      if (leftPct < 18) {
        tooltip.style.transform = 'translate(12px, -120%)';
      } else if (leftPct > 82) {
        tooltip.style.transform = 'translate(calc(-100% - 12px), -120%)';
      } else {
        tooltip.style.transform = 'translate(-50%, -120%)';
      }
      
      // Find nearby waypoint
      let nearWp = '';
      if (TOUR_DATA.waypoints) {
        const wp = TOUR_DATA.waypoints.find(w => Math.abs(w.distKm - pt.dist) < 0.35);
        if (wp) nearWp = `<div style="font-size:0.78rem; color:#fde68a; font-weight:700; margin-top:3px;">📍 ${wp.name}</div>`;
      }
      
      tooltip.innerHTML = `
        <div class="tt-dist">📍 ${pt.dist.toFixed(2)} km (${Math.round((pt.dist / totalDist) * 100)}%)</div>
        <div class="tt-ele">⛰️ ${Math.round(pt.ele)} m</div>
        ${slopeText ? `<div style="font-size:0.75rem; margin-top:2px;">${slopeText}</div>` : ''}
        ${nearWp}
      `;
      tooltip.classList.add('active');
    }
    
    const summitBadge = document.getElementById('summitPillBadge');
    if (summitBadge) {
      summitBadge.style.opacity = '0';
    }
    
    // Synchronize Live Marker on Leaflet Map
    if (liveTrackMarker) {
      liveTrackMarker.setLatLng([pt.lat, pt.lon]);
    }
  }

  window.scrubToDistance = function(dist) {
    updateScrubPosition(dist);
  };
  
  let durreTouchLatchTimer = null;

  function clearDurreLatch() {
    if (durreTouchLatchTimer) {
      clearTimeout(durreTouchLatchTimer);
      durreTouchLatchTimer = null;
    }
  }

  function handleScrub(clientX) {
    clearDurreLatch();
    const coords = getSvgCoordinates(clientX);
    if (!coords) return;
    updateScrubPosition(coords.curDist, coords.clampedSvgX);
  }
  
  svg.addEventListener('mousemove', (e) => handleScrub(e.clientX));

  svg.addEventListener('touchstart', (e) => {
    clearDurreLatch();
    if (e.touches && e.touches.length > 0) {
      if (e.cancelable) e.preventDefault();
      handleScrub(e.touches[0].clientX);
    }
  }, { passive: false });

  svg.addEventListener('touchmove', (e) => {
    clearDurreLatch();
    if (e.touches && e.touches.length > 0) {
      if (e.cancelable) e.preventDefault();
      handleScrub(e.touches[0].clientX);
    }
  }, { passive: false });
  
  // Click on SVG centers map on that location
  svg.addEventListener('click', (e) => {
    const coords = getSvgCoordinates(e.clientX);
    if (!coords) return;
    const pt = getTrackPointAtDist(coords.curDist);
    if (mapInstance && pt) {
      mapInstance.flyTo([pt.lat, pt.lon], 15, { duration: 0.8 });
    }
  });
  
  function hideScrub() {
    clearDurreLatch();
    scrubLine.setAttribute('opacity', '0');
    scrubCircle.setAttribute('opacity', '0');
    if (tooltip) tooltip.classList.remove('active');
    const summitBadge = document.getElementById('summitPillBadge');
    if (summitBadge) {
      summitBadge.style.opacity = '1';
    }
  }
  
  svg.addEventListener('mouseleave', hideScrub);

  svg.addEventListener('touchend', () => {
    clearDurreLatch();
    durreTouchLatchTimer = setTimeout(() => {
      hideScrub();
    }, 2500);
  });

  svg.addEventListener('touchcancel', () => {
    clearDurreLatch();
    durreTouchLatchTimer = setTimeout(() => {
      hideScrub();
    }, 2500);
  });
}

/* ==========================================================================
   4. DAY SCHEDULE / TIMELINE
   ========================================================================== */
function initTimeline() {
  const container = document.getElementById('timelineContainer');
  if (!container || !TOUR_DATA.timelineSchedule) return;
  
  container.innerHTML = '';
  
  TOUR_DATA.timelineSchedule.forEach(item => {
    const isHighlight = item.title.includes('Plattenstein') || item.title.includes('Gauermannhütte');
    
    const card = document.createElement('div');
    card.className = `timeline-card ${isHighlight ? 'highlight' : ''}`;
    card.innerHTML = `
      <div class="timeline-icon-box">
        <i class="fa-solid ${item.icon}"></i>
      </div>
      <div class="timeline-card-content">
        <div class="timeline-meta">
          <div class="timeline-time"><i class="fa-regular fa-clock"></i> ${item.time}</div>
          <span class="timeline-badge">${item.badge}</span>
        </div>
        <h3 class="timeline-card-title">${item.title}</h3>
        <div class="timeline-card-subtitle">${item.subtitle}</div>
        <p class="timeline-card-desc">${item.desc}</p>
        ${item.wpId ? `
          <div style="margin-top: 0.65rem;">
            <button class="timeline-map-btn" onclick="focusOnMap('${item.wpId}')">
              <i class="fa-solid fa-map-location-dot"></i> Megnyitás a Térképen
            </button>
          </div>
        ` : ''}
      </div>
    `;
    container.appendChild(card);
  });
}

/* ==========================================================================
   5. PHOTO GALLERY & LIGHTBOX
   ========================================================================== */
let activePhotoIndex = 0;

function initGallery() {
  const grid = document.getElementById('galleryGrid');
  const modal = document.getElementById('lightboxModal');
  const modalImg = document.getElementById('lightboxImg');
  const modalCaption = document.getElementById('lightboxCaption');
  const closeBtn = document.getElementById('lightboxClose');
  const prevBtn = document.getElementById('lightboxPrev');
  const nextBtn = document.getElementById('lightboxNext');
  
  if (!grid || !TOUR_DATA.gallery) return;
  
  grid.innerHTML = '';
  
  TOUR_DATA.gallery.forEach((item, idx) => {
    const card = document.createElement('div');
    card.className = 'gallery-card';
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', item.title);
    card.innerHTML = `
      <img src="${item.file}" alt="${item.title}" class="gallery-img" loading="lazy">
      <div class="gallery-info-overlay">
        <div class="gallery-card-title">${item.title}</div>
        <div class="gallery-card-caption">${item.caption}</div>
      </div>
    `;
    card.addEventListener('click', () => openLightbox(idx));
    grid.appendChild(card);
  });
  
  function openLightbox(idx) {
    activePhotoIndex = idx;
    updateLightbox();
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeLightbox() {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  function updateLightbox() {
    const photo = TOUR_DATA.gallery[activePhotoIndex];
    if (photo && modalImg && modalCaption) {
      modalImg.src = photo.file;
      modalImg.alt = photo.title;
      modalCaption.innerHTML = `<strong>${photo.title}</strong> &bull; ${photo.caption} <span style="display:block; font-size:0.8rem; color:#94a3b8; margin-top:4px;">(${activePhotoIndex + 1} / ${TOUR_DATA.gallery.length})</span>`;
    }
  }
  
  function nextPhoto() {
    activePhotoIndex = (activePhotoIndex + 1) % TOUR_DATA.gallery.length;
    updateLightbox();
  }
  
  function prevPhoto() {
    activePhotoIndex = (activePhotoIndex - 1 + TOUR_DATA.gallery.length) % TOUR_DATA.gallery.length;
    updateLightbox();
  }
  
  if (closeBtn) closeBtn.addEventListener('click', closeLightbox);
  if (nextBtn) nextBtn.addEventListener('click', nextPhoto);
  if (prevBtn) prevBtn.addEventListener('click', prevPhoto);
  
  modal.addEventListener('click', (e) => {
    if (e.target === modal) closeLightbox();
  });
  
  document.addEventListener('keydown', (e) => {
    if (!modal.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowRight') nextPhoto();
    if (e.key === 'ArrowLeft') prevPhoto();
  });
}

/* ==========================================================================
   6. INTERACTIVE PACKING CHECKLIST
   ========================================================================== */
function initPackingList() {
  const container = document.getElementById('checklistContainer');
  const countEl = document.getElementById('packedCount');
  if (!container || !TOUR_DATA.packingList) return;
  
  const STORAGE_KEY = 'durrewand_checklist_v1';
  let savedState = {};
  try {
    savedState = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
  } catch (e) {
    savedState = {};
  }
  
  container.innerHTML = '';
  let totalItems = 0;
  
  TOUR_DATA.packingList.forEach(cat => {
    const catCard = document.createElement('div');
    catCard.className = 'checklist-cat-card';
    
    let itemsHtml = '';
    cat.items.forEach(item => {
      totalItems++;
      const isChecked = !!savedState[item.id];
      itemsHtml += `
        <li class="checklist-item ${isChecked ? 'checked' : ''}" data-id="${item.id}">
          <div class="custom-checkbox">
            <i class="fa-solid fa-check" style="${isChecked ? '' : 'display:none;'}"></i>
          </div>
          <div class="item-text">
            ${item.text}
            ${item.required ? '<span class="item-req-tag">Fontos</span>' : ''}
          </div>
        </li>
      `;
    });
    
    catCard.innerHTML = `
      <div class="checklist-cat-header">
        <span>${cat.category}</span>
        <span class="counter cat-counter">0 / ${cat.items.length}</span>
      </div>
      <ul class="checklist-items">
        ${itemsHtml}
      </ul>
    `;
    container.appendChild(catCard);
  });
  
  function updateCounters() {
    let packed = 0;
    document.querySelectorAll('.checklist-cat-card').forEach(card => {
      const items = card.querySelectorAll('.checklist-item');
      let catPacked = 0;
      items.forEach(it => {
        if (it.classList.contains('checked')) {
          catPacked++;
          packed++;
        }
      });
      const catCount = card.querySelector('.cat-counter');
      if (catCount) catCount.textContent = `${catPacked} / ${items.length}`;
    });
    
    if (countEl) countEl.textContent = `${packed} / ${totalItems} becsomagolva`;
  }
  
  container.addEventListener('click', (e) => {
    const itemEl = e.target.closest('.checklist-item');
    if (!itemEl) return;
    
    const id = itemEl.getAttribute('data-id');
    const isNowChecked = !itemEl.classList.contains('checked');
    
    itemEl.classList.toggle('checked', isNowChecked);
    const checkIcon = itemEl.querySelector('.custom-checkbox i');
    if (checkIcon) checkIcon.style.display = isNowChecked ? '' : 'none';
    
    savedState[id] = isNowChecked;
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(savedState));
    } catch (err) {}
    
    updateCounters();
  });
  
  updateCounters();
}

/* ==========================================================================
   7. LIVE WEATHER & METEO API
   ========================================================================== */
async function initLiveWeather() {
  const tempEl = document.getElementById('liveTemp');
  const windEl = document.getElementById('liveWind');
  const descEl = document.getElementById('liveDesc');
  const rainEl = document.getElementById('liveRain');
  
  if (!tempEl) return;
  
  try {
    const url = 'https://api.open-meteo.com/v1/forecast?latitude=47.8577&longitude=15.9751&current=temperature_2m,relative_humidity_2m,apparent_temperature,precipitation,weather_code,wind_speed_10m&timezone=Europe%2FBerlin';
    const res = await fetch(url);
    if (!res.ok) throw new Error('Weather fetch failed');
    
    const data = await res.json();
    const cur = data.current;
    
    if (cur) {
      tempEl.textContent = `${Math.round(cur.temperature_2m)} °C`;
      windEl.textContent = `${Math.round(cur.wind_speed_10m)} km/h`;
      rainEl.textContent = `${cur.precipitation} mm`;
      descEl.textContent = getWeatherDesc(cur.weather_code);
    }
  } catch (err) {
    console.log('Using weather fallback:', err);
    tempEl.textContent = '14 °C';
    windEl.textContent = '12 km/h';
    rainEl.textContent = '0 mm';
    descEl.textContent = 'Részben felhős, kellemes túraidő';
  }
}

function getWeatherDesc(code) {
  const codes = {
    0: 'Tiszta, napos idő',
    1: 'Főként derült',
    2: 'Részben felhős',
    3: 'Borult',
    45: 'Ködös',
    48: 'Zúzmarás köd',
    51: 'Gyenge szitálás',
    61: 'Gyenge eső',
    63: 'Mérsékelt eső',
    65: 'Erős eső',
    71: 'Gyenge havazás',
    80: 'Futó zápor',
    81: 'Mérsékelt zápor',
    82: 'Heves zápor',
    95: 'Zivatar'
  };
  return codes[code] || 'Változékony hegyvidéki idő';
}

/* ==========================================================================
   8. MOBILE DRAWER & NAVIGATION INTERACTIONS
   ========================================================================== */
function initNavigation() {
  const drawer = document.getElementById('mobileDrawer');
  const backdrop = document.getElementById('drawerBackdrop');
  const openBtn = document.getElementById('hamburgerBtn');
  const closeBtn = document.getElementById('drawerCloseBtn');
  const fabMap = document.getElementById('fabMap');
  
  function openDrawer() {
    if (drawer) drawer.classList.add('open');
    if (backdrop) backdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }
  
  function closeDrawer() {
    if (drawer) drawer.classList.remove('open');
    if (backdrop) backdrop.classList.remove('active');
    document.body.style.overflow = '';
  }
  
  if (openBtn) openBtn.addEventListener('click', openDrawer);
  if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
  if (backdrop) backdrop.addEventListener('click', closeDrawer);
  
  document.querySelectorAll('.drawer-link').forEach(link => {
    link.addEventListener('click', closeDrawer);
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer && drawer.classList.contains('open')) {
      closeDrawer();
    }
  });
  
  // Floating Action Button (Return to Map)
  window.addEventListener('scroll', () => {
    if (!fabMap) return;
    if (window.scrollY > 600) {
      fabMap.classList.add('visible');
    } else {
      fabMap.classList.remove('visible');
    }
  });
  
  if (fabMap) {
    fabMap.addEventListener('click', () => {
      const mapSec = document.getElementById('terkep');
      if (mapSec) mapSec.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

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
      toast.style.cssText = 'position:fixed;bottom:calc(64px + env(safe-area-inset-bottom, 0px) + 20px);left:50%;transform:translateX(-50%);z-index:9999;padding:0.75rem 1.25rem;border-radius:12px;background:#0f172a;color:#f8fafc;box-shadow:0 10px 25px rgba(0,0,0,0.5);font-size:0.9rem;font-weight:600;display:flex;align-items:center;gap:0.6rem;max-width:90vw;text-align:center;transition:all 0.3s ease;';
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

