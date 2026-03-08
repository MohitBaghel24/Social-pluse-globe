// ============================================================
//  Social Pulse Globe — Globe.gl Module
// ============================================================

(function () {
  const { SOCIAL_DATA, getCountryColor } = window.SocialData;

  let globeInstance  = null;
  let countriesGeoJson = null;
  let autoRotating    = true;
  let hoverCountry    = null;

  // Click-lock state
  let lockedCountry   = null;   // feature being targeted
  let _lockStrokeColor = "rgba(34,211,238,0.18)"; // driven by pulse interval
  let lockPulseInterval = null;
  let lockPulsePhase    = 0;

  // Reticle tracking
  let reticleRAF = null;
  let reticleLat = 0, reticleLng = 0;

  // ── Mouse-follow rotation state ──────────────────────────────────────
  let _mNX = 0, _mNY = 0;           // raw normalised mouse -1…1
  let _smNX = 0, _smNY = 0;         // smoothed values
  let _gfBaseLng = 0;               // accumulated auto-rotate longitude
  let _gfAlt = 2.2;                 // last known altitude
  let _zoomLock = false;            // true while zoom tween is playing
  let _gfLastT  = performance.now();

  document.addEventListener('mousemove', e => {
    _mNX = (e.clientX / window.innerWidth ) * 2 - 1;
    _mNY = (e.clientY / window.innerHeight) * 2 - 1;
  });

  // Custom globe rotation loop — auto-rotate only (no mouse tracking)
  (function gfLoop() {
    requestAnimationFrame(gfLoop);
    if (!globeInstance || _zoomLock || !autoRotating) return;

    const now = performance.now();
    const dt  = Math.min(50, now - _gfLastT) / 16.67;
    _gfLastT  = now;

    // Auto-drift longitude only
    _gfBaseLng += 0.07 * dt;
    const lng = _gfBaseLng % 360;

    globeInstance.pointOfView({ lat: 0, lng, altitude: _gfAlt }, 0);
  })();

  // ── War Room territory mode ──────────────────────────────────────────
  let warRoomActive  = false;
  let contestedPhase = 0;
  let contestedRAF   = null;

  // ── Platform Switcher state ──────────────────────────────────────────
  let activePlatform    = "ALL";
  let currentTransT     = 1;          // 0→1 during transition, 1 = done
  let transitionRAF     = null;
  let transitionStart   = 0;
  const TRANSITION_MS   = 600;
  const transFromColors = new Map();  // feat → rgba string snapshot
  const platformMax     = {};         // platform → max users across dataset

  // ── Colour helpers ───────────────────────────────────────────────────
  function hexToRgb(hex) {
    const h = hex.replace('#','');
    return [
      parseInt(h.slice(0,2), 16),
      parseInt(h.slice(2,4), 16),
      parseInt(h.slice(4,6), 16),
    ];
  }

  function parseRgba(str) {
    if (!str) return [0, 0, 0, 0];
    const m = str.match(/rgba?\((\d+)[,\s]+(\d+)[,\s]+(\d+)(?:[,\s]+([\d.]+))?\)/);
    if (m) return [+m[1], +m[2], +m[3], m[4] !== undefined ? +m[4] : 1];
    if (str.startsWith('#')) { const [r,g,b] = hexToRgb(str); return [r,g,b,1]; }
    return [0, 0, 0, 0];
  }

  function lerpRgba(a, b, t) {
    const pa = parseRgba(a), pb = parseRgba(b);
    const r  = Math.round(pa[0] + (pb[0]-pa[0])*t);
    const g  = Math.round(pa[1] + (pb[1]-pa[1])*t);
    const bl = Math.round(pa[2] + (pb[2]-pa[2])*t);
    const al = (pa[3] + (pb[3]-pa[3])*t).toFixed(2);
    return `rgba(${r},${g},${bl},${al})`;
  }

  // Per-platform choropleth: brand colour scaled by user count
  function getPlatformColor(feat, platform) {
    const { PLATFORM_COLORS } = window.SocialData;
    const data = feat.properties._data;
    if (!data || !data.platforms) return "rgba(14,14,36,0.55)";
    const users = data.platforms[platform] || 0;
    if (!users) return "rgba(14,14,36,0.55)";
    const max = platformMax[platform] || 100;
    const t   = Math.min(1, users / max);
    const hex = PLATFORM_COLORS[platform] || "#22D3EE";
    const [r, g, b] = hexToRgb(hex);
    const bright = 0.28 + t * 0.72;
    const alpha  = (0.12 + t * 0.80).toFixed(2);
    return `rgba(${Math.round(r*bright)},${Math.round(g*bright)},${Math.round(b*bright)},${alpha})`;
  }

  function computePlatformMax() {
    const { SOCIAL_DATA } = window.SocialData;
    Object.values(SOCIAL_DATA).forEach(country => {
      if (!country.platforms) return;
      Object.entries(country.platforms).forEach(([p, v]) => {
        platformMax[p] = Math.max(platformMax[p] || 0, v);
      });
    });
  }

  // ── War Room helpers ─────────────────────────────────────────────────
  function getDominant(feat) {
    const data = feat.properties._data;
    if (!data || !data.platforms) return null;
    const entries = Object.entries(data.platforms).filter(([,v]) => v > 0).sort((a,b) => b[1]-a[1]);
    if (!entries.length) return null;
    return { key: entries[0][0], val: entries[0][1], second: entries[1] || null };
  }

  function isContested(feat) {
    const dom = getDominant(feat);
    if (!dom || !dom.second) return false;
    return dom.second[1] / dom.val >= 0.90;
  }

  function getWarRoomCapColor(feat) {
    const { PLATFORM_COLORS } = window.SocialData;
    if (lockedCountry) {
      if (feat === lockedCountry) return "rgba(255,255,255,0.92)";
      const dom = getDominant(feat);
      if (!dom) return "rgba(14,14,36,0.18)";
      const [r,g,b] = hexToRgb(PLATFORM_COLORS[dom.key] || "#ffffff");
      return `rgba(${Math.round(r*0.3)},${Math.round(g*0.3)},${Math.round(b*0.3)},0.18)`;
    }
    if (hoverCountry && feat === hoverCountry) return "rgba(255,255,255,0.95)";
    const dom = getDominant(feat);
    if (!dom) return "rgba(14,14,36,0.55)";
    const hex1 = PLATFORM_COLORS[dom.key] || "#22D3EE";
    const [r1,g1,b1] = hexToRgb(hex1);
    if (isContested(feat) && dom.second) {
      const hex2 = PLATFORM_COLORS[dom.second[0]] || "#ffffff";
      const [r2,g2,b2] = hexToRgb(hex2);
      const t = (Math.sin(contestedPhase) + 1) / 2;
      return `rgba(${Math.round(r1+(r2-r1)*t)},${Math.round(g1+(g2-g1)*t)},${Math.round(b1+(b2-b1)*t)},0.92)`;
    }
    return `rgba(${Math.round(r1*0.88)},${Math.round(g1*0.88)},${Math.round(b1*0.88)},0.92)`;
  }

  function setWarRoomMode(active) {
    warRoomActive = active;
    if (active) {
      (function animContested() {
        contestedPhase += 0.07;
        if (globeInstance) globeInstance.polygonCapColor(polyColor);
        contestedRAF = requestAnimationFrame(animContested);
      })();
    } else {
      if (contestedRAF) { cancelAnimationFrame(contestedRAF); contestedRAF = null; }
      contestedPhase = 0;
      if (globeInstance) globeInstance.polygonCapColor(polyColor);
    }
  }

  // ── Historical year override (for Timeline Scrubber) ──────────────
  const _origDataMap = new Map(); // iso2 → original _data ref
  let historicalOverrideActive = false;

  function applyHistoricalYear(yearData) {
    if (!countriesGeoJson) return;
    historicalOverrideActive = true;
    countriesGeoJson.features.forEach(f => {
      const iso2 = f.properties._iso2;
      if (!iso2) return;
      // Save original once
      if (!_origDataMap.has(iso2)) _origDataMap.set(iso2, f.properties._data);
      // Apply synthetic historical data
      if (yearData[iso2]) f.properties._data = yearData[iso2];
    });
    // Refresh globe colors
    if (globeInstance) globeInstance.polygonCapColor(polyColor);
  }

  function restoreHistoricalOverride() {
    if (!historicalOverrideActive || !countriesGeoJson) return;
    historicalOverrideActive = false;
    countriesGeoJson.features.forEach(f => {
      const iso2 = f.properties._iso2;
      if (iso2 && _origDataMap.has(iso2)) f.properties._data = _origDataMap.get(iso2);
    });
    if (globeInstance) globeInstance.polygonCapColor(polyColor);
  }

  // Core per-feature cap colour (no transition lerp)
  function computeCapColor(feat) {
    if (warRoomActive) return getWarRoomCapColor(feat);
    if (lockedCountry) {
      if (feat === lockedCountry) return "rgba(255,255,255,0.92)";
      const base = activePlatform === "ALL"
        ? getCountryColor(feat.properties._total)
        : getPlatformColor(feat, activePlatform);
      return base.replace(/rgba\((.*),([^)]+)\)/, (_, rgb) => `rgba(${rgb},0.28)`);
    }
    if (hoverCountry && feat === hoverCountry) return "#22D3EE";
    if (activePlatform !== "ALL") return getPlatformColor(feat, activePlatform);
    return getCountryColor(feat.properties._total);
  }

  // Platform transition: snapshot → animate 0→1 over TRANSITION_MS
  function setPlatform(key) {
    if (key === activePlatform) return;
    // Snapshot current rendered colours
    if (countriesGeoJson) {
      countriesGeoJson.features.forEach(f => transFromColors.set(f, computeCapColor(f)));
    }
    activePlatform = key;
    transitionStart = performance.now();
    currentTransT   = 0;
    if (transitionRAF) cancelAnimationFrame(transitionRAF);
    function step(now) {
      const raw = Math.min(1, (now - transitionStart) / TRANSITION_MS);
      // Ease in-out cubic
      currentTransT = raw < 0.5 ? 4*raw*raw*raw : 1 - Math.pow(-2*raw+2, 3)/2;
      if (globeInstance) globeInstance.polygonCapColor(polyColor);
      if (raw < 1) {
        transitionRAF = requestAnimationFrame(step);
      } else {
        currentTransT = 1;
        transFromColors.clear();
        transitionRAF = null;
      }
    }
    transitionRAF = requestAnimationFrame(step);
  }

  // Tooltip element
  const tooltip = document.getElementById("globe-tooltip");

  async function loadGeoJson() {
    const res = await fetch(
      "https://raw.githubusercontent.com/vasturiano/globe.gl/master/example/datasets/ne_110m_admin_0_countries.geojson"
    );
    return res.json();
  }

  function enrichGeoJson(gj) {
    gj.features.forEach((f) => {
      const iso2 = f.properties.ISO_A2 || f.properties.iso_a2 || "";
      const entry = SOCIAL_DATA[iso2.toUpperCase()];
      f.properties._iso2 = iso2.toUpperCase();
      f.properties._data = entry || null;
      f.properties._total = entry ? entry.totalUsers : 0;
      f.properties._name  = entry ? entry.name : f.properties.ADMIN || iso2;
    });
    return gj;
  }

  function polyColor(feat) {
    const target = computeCapColor(feat);
    if (currentTransT >= 1 || !transFromColors.size) return target;
    const from = transFromColors.get(feat);
    if (!from) return target;
    return lerpRgba(from, target, currentTransT);
  }

  function polySideColor(feat) {
    if (lockedCountry) {
      if (feat === lockedCountry) return "rgba(255,255,255,0.5)";
      return "rgba(4,4,18,0.15)";
    }
    if (hoverCountry && feat === hoverCountry) return "rgba(34,211,238,0.3)";
    return "rgba(10,10,30,0.5)";
  }

  function polyStrokeColor(feat) {
    if (lockedCountry && feat === lockedCountry) return _lockStrokeColor;
    return "rgba(34,211,238,0.18)";
  }

  function polyAltitude(feat) {
    if (lockedCountry) {
      // Reduced altitude so it merges better with the globe surface
      return feat === lockedCountry ? 0.035 : 0.005;
    }
    // Reduced hover altitude for smoother feel
    return hoverCountry && feat === hoverCountry ? 0.025 : 0.008;
  }

  function polyLabel(feat) {
    const d = feat.properties;
    const total = d._total ? `${d._total}M users` : "No data";
    return `<div class="globe-label"><strong>${d._name || d.ADMIN}</strong><br/>${total}</div>`;
  }

  function showTooltip(feat, evt) {
    if (!feat) { tooltip.style.display = "none"; return; }
    // Don't show floating tooltip while side panel is open
    if (document.getElementById("side-panel")?.classList.contains("open")) {
      tooltip.style.display = "none"; return;
    }
    const d = feat.properties;
    let badge = "";
    if (warRoomActive) {
      if (isContested(feat)) {
        badge = `<span class="contested-badge">⚡ CONTESTED</span>`;
      } else {
        const dom = getDominant(feat);
        if (dom) {
          const col = window.SocialData.PLATFORM_COLORS[dom.key] || "#fff";
          badge = `<span class="platform-badge" style="color:${col}">▲ ${dom.key}</span>`;
        }
      }
    }
    tooltip.innerHTML = `<strong>${d._name || d.ADMIN}</strong><span>${d._total ? d._total + "M users" : "No data"}</span>${badge}`;
    tooltip.style.display = "flex";
  }

  function positionTooltip(evt) {
    if (!evt) return;
    const x = evt.clientX + 16;
    const y = evt.clientY - 30;
    tooltip.style.left = Math.min(x, window.innerWidth - 200) + "px";
    tooltip.style.top  = Math.max(y, 4) + "px";
  }

  async function initGlobe() {
    const raw = await loadGeoJson();
    countriesGeoJson = enrichGeoJson(raw);
    computePlatformMax();

    globeInstance = Globe({ animateIn: true })(document.getElementById("globe-container"))
      .globeImageUrl(
        "https://unpkg.com/three-globe/example/img/earth-night.jpg"
      )
      .bumpImageUrl(
        "https://unpkg.com/three-globe/example/img/earth-topology.png"
      )
      .atmosphereColor("#22D3EE")
      .atmosphereAltitude(0.18)
      .backgroundImageUrl(null)
      .backgroundColor("rgba(0,0,0,0)")
      // Polygons
      .polygonsData(countriesGeoJson.features)
      .polygonCapColor(polyColor)
      .polygonSideColor(polySideColor)
      .polygonStrokeColor(polyStrokeColor)
      .polygonAltitude(polyAltitude)
      // Interactions
      .onPolygonHover((feat, prevFeat) => {
        if (lockedCountry) return; // suppress hover while targeting
        hoverCountry = feat || null;
        showTooltip(feat, null);
        document.body.style.cursor = feat ? "pointer" : "default";
        globeInstance
          .polygonCapColor(polyColor)
          .polygonSideColor(polySideColor)
          .polygonAltitude(polyAltitude);
      })
      .onPolygonClick((feat, evt, coords) => {
        if (!feat || lockedCountry) return; // ignore clicks while already animating
        const iso2 = feat.properties._iso2;
        const data = feat.properties._data; // may be null for unconfigured countries
        const countryName = feat.properties._name || feat.properties.ADMIN || iso2 || "Unknown";

        // Show at least the name in the tooltip even if no social data
        if (!data) {
          const tt = document.getElementById("globe-tooltip");
          if (tt) {
            tt.innerHTML = `<strong>${countryName}</strong><span>No data available</span>`;
            tt.style.display = "flex";
            if (evt) {
              tt.style.left = Math.min(evt.clientX + 16, window.innerWidth - 210) + "px";
              tt.style.top  = Math.max(evt.clientY - 30, 4) + "px";
            }
            setTimeout(() => { tt.style.display = "none"; }, 2000);
          }
          return;
        }

        pauseRotation();
        tooltip.style.display = "none";
        _zoomLock = true;

        // ── 1. Target Determination (prioritise click point) ────────
        // Fix: Use the actual clicked coordinate if available, otherwise fallback to centroid
        let targetLat, targetLng;
        if (coords) {
          targetLat = coords.lat;
          targetLng = coords.lng;
        } else {
          const c = computeCentroid(feat);
          targetLat = c.lat;
          targetLng = c.lng;
        }

        // ── 2. Lock state: dim all others, raise selected polygon ────
        lockedCountry = feat;
        globeInstance
          .polygonCapColor(polyColor)
          .polygonSideColor(polySideColor)
          .polygonStrokeColor(polyStrokeColor)
          .polygonAltitude(polyAltitude);

        // ── 3. Pulsing white border on selected country ──────────────
        startLockPulse();

        // ── 4. Show targeting reticle over target ────────────────────
        showReticle(targetLat, targetLng);

        // ── 5. Smooth Zoom Animation ─────────────────────────────────
        // Fix: Use a single smooth tween to avoid "merging" glitches and jerky movement
        globeInstance.pointOfView(
          { lat: targetLat, lng: targetLng, altitude: 1.6 }, 
          1200
        );

        // ── 6. After rotation completes: open panel, clean up ────────
        setTimeout(() => {
          stopLockPulse();
          hideReticle();
          // Sync mouse-tracking base so globe doesn't jump on resume
          const pov = globeInstance.pointOfView();
          _gfBaseLng = pov.lng  || 0;
          _gfAlt     = pov.altitude || 1.6;
          _zoomLock  = false;
          window.PanelModule.open(iso2, data);
        }, 1250);
      });

    // Mouse tracker for tooltip
    document.getElementById("globe-container").addEventListener("mousemove", positionTooltip);

    // Controls — disable built-in autoRotate; our gfLoop handles it
    globeInstance.controls().autoRotate = false;
    globeInstance.controls().enableZoom = true;
    globeInstance.controls().minDistance = 150;
    globeInstance.controls().maxDistance = 700;

    // Cinematic intro: start zoomed out
    _zoomLock = true;
    globeInstance.pointOfView({ altitude: 4 }, 0);
    setTimeout(() => {
      globeInstance.pointOfView({ altitude: 2.2 }, 2800);
      setTimeout(() => {
        // Sync base lng so loop starts from correct position
        const pov = globeInstance.pointOfView();
        _gfBaseLng = pov.lng || 0;
        _gfAlt     = 2.2;
        _zoomLock  = false;
      }, 3000);
    }, 400);

    // Pause mouse-tracking loop on user drag; resume 3 s after release
    globeInstance.controls().addEventListener("start", () => {
      autoRotating = false;
    });
    globeInstance.controls().addEventListener("end", () => {
      setTimeout(() => {
        if (!autoRotating) {
          // Sync base from current OrbitControls position
          const pov = globeInstance.pointOfView();
          _gfBaseLng = pov.lng || 0;
          _gfAlt     = pov.altitude || 2.2;
          _smNX = 0; _smNY = 0; // reset smoothed mouse so no sudden jump
          autoRotating = true;
        }
      }, 3000);
    });

    // Grid overlay rings (fake radar lines using arc polygons)
    addGridOverlay();

    // Expose globals
    function syncMouseBase() {
      const pov = globeInstance.pointOfView();
      _gfBaseLng = pov.lng || 0;
      _gfAlt     = pov.altitude || 2.2;
      _smNX = 0; _smNY = 0;
      _zoomLock  = false;
    }

    window.GlobeModule = { globeInstance, refresh: refreshColors, pauseRotation, resumeRotation, setPlatform, setWarRoomMode, getDominant, isContested, computeCentroid, applyHistoricalYear, restoreHistoricalOverride, setViralArcs, syncMouseBase };
  }

  function refreshColors() {
    if (!globeInstance) return;
    globeInstance
      .polygonCapColor(polyColor)
      .polygonSideColor(polySideColor);
    // Pulse animation
    let alt = 0.03;
    let dir = 1;
    let count = 0;
    const pulse = setInterval(() => {
      count++;
      alt += dir * 0.003;
      if (alt > 0.04) dir = -1;
      if (alt < 0.01) { dir = 1; count += 5; }
      if (count > 30) { clearInterval(pulse); globeInstance.polygonAltitude(0.01); return; }
      globeInstance.polygonAltitude(f => (f.properties._total > 0 ? alt : 0.005));
    }, 80);
  }

  // ── Centroid helper ──────────────────────────────────────────────────
  function computeCentroid(feat) {
    const geom = feat.geometry;
    let ring;
    if (geom.type === "Polygon") {
      ring = geom.coordinates[0];
    } else if (geom.type === "MultiPolygon") {
      // Pick the largest ring (most vertices) as the representative polygon
      let maxLen = 0;
      geom.coordinates.forEach(poly => {
        if (poly[0].length > maxLen) { maxLen = poly[0].length; ring = poly[0]; }
      });
    } else {
      return { lat: 0, lng: 0 };
    }
    let sumLat = 0, sumLng = 0;
    ring.forEach(([lng, lat]) => { sumLng += lng; sumLat += lat; });
    return { lat: sumLat / ring.length, lng: sumLng / ring.length };
  }

  // ── Lock-pulse: pulsing white stroke on locked polygon ──────────────
  function startLockPulse() {
    lockPulsePhase = 0;
    lockPulseInterval = setInterval(() => {
      lockPulsePhase = (lockPulsePhase + 0.22) % (Math.PI * 2);
      const a = (0.5 + 0.5 * Math.sin(lockPulsePhase)).toFixed(2);
      _lockStrokeColor = `rgba(255,255,255,${a})`;
      if (globeInstance) globeInstance.polygonStrokeColor(polyStrokeColor);
    }, 45);
  }

  function stopLockPulse() {
    if (lockPulseInterval) { clearInterval(lockPulseInterval); lockPulseInterval = null; }
    _lockStrokeColor = "rgba(34,211,238,0.18)";
    lockedCountry = null;
    if (globeInstance) {
      globeInstance
        .polygonCapColor(polyColor)
        .polygonSideColor(polySideColor)
        .polygonStrokeColor(polyStrokeColor)
        .polygonAltitude(polyAltitude);
    }
  }

  // ── Reticle: CSS crosshair that tracks the centroid on-screen ───────
  function showReticle(lat, lng) {
    reticleLat = lat; reticleLng = lng;
    const el = document.getElementById("reticle");
    el.className = "locking";
    el.style.display = "block";
    // Initial position
    _placeReticle(el);
    // Track as globe rotates
    function track() {
      if (!el || el.style.display === "none") return;
      _placeReticle(el);
      reticleRAF = requestAnimationFrame(track);
    }
    reticleRAF = requestAnimationFrame(track);
    // Switch to "locked" state mid-way
    setTimeout(() => {
      el.classList.remove("locking");
      el.classList.add("locked");
    }, 750);
  }

  function _placeReticle(el) {
    if (!globeInstance) return;
    const sc = globeInstance.getScreenCoords(reticleLat, reticleLng, 0.01);
    if (sc && sc.x > 0 && sc.x < window.innerWidth && sc.y > 0 && sc.y < window.innerHeight) {
      el.style.left = sc.x + "px";
      el.style.top  = sc.y  + "px";
    }
  }

  function hideReticle() {
    if (reticleRAF) { cancelAnimationFrame(reticleRAF); reticleRAF = null; }
    const el = document.getElementById("reticle");
    if (!el) return;
    el.classList.add("fadeout");
    setTimeout(() => { el.style.display = "none"; el.className = ""; }, 350);
  }

  function pauseRotation() {
    autoRotating = false;
    // controls().autoRotate is intentionally disabled; custom gfLoop checks autoRotating flag
  }

  function resumeRotation() {
    if (globeInstance) {
      const pov = globeInstance.pointOfView();
      _gfBaseLng = pov.lng || 0;
      _gfAlt     = pov.altitude || 2.2;
      _smNX = 0; _smNY = 0;
      _zoomLock  = false;
    }
    autoRotating = true;
  }

  // ── Combined arcs layer: grid + viral tracker ────────────────────────
  let _gridArcs   = [];
  let _viralArcs  = [];

  function buildGridArcs() {
    const arcs = [];
    for (let lat = -60; lat <= 60; lat += 30) {
      for (let lon = -150; lon <= 150; lon += 30) {
        arcs.push({ _type:"grid", startLat:lat, startLng:lon, endLat:lat, endLng:lon+30, color:"rgba(34,211,238,0.06)", stroke:0.25, altitude:0, dashLen:1, dashGap:0, animateMs:0 });
        arcs.push({ _type:"grid", startLat:lat, startLng:lon, endLat:lat+30, endLng:lon, color:"rgba(34,211,238,0.06)", stroke:0.25, altitude:0, dashLen:1, dashGap:0, animateMs:0 });
      }
    }
    return arcs;
  }

  function updateArcsLayer() {
    const all = [..._gridArcs, ..._viralArcs];
    globeInstance
      .arcsData(all)
      .arcColor(d => d.color)
      .arcStroke(d => d.stroke)
      .arcAltitude(d => d.altitude)
      .arcDashLength(d => d._type === "viral" ? 0.35 : d.dashLen)
      .arcDashGap(d => d._type === "viral" ? 0.18 : d.dashGap)
      .arcDashAnimateTime(d => d.animateMs || 0);
  }

  function setViralArcs(arcs) {
    _viralArcs = arcs || [];
    if (globeInstance) updateArcsLayer();
  }

  function addGridOverlay() {
    _gridArcs = buildGridArcs();
    updateArcsLayer();
    // Arc click → Viral Tracker popup
    globeInstance.onArcClick((arc, event) => {
      if (arc._type === "viral" && window.ViralTracker) {
        window.ViralTracker.onArcClick(arc, event.clientX, event.clientY);
      }
    });
  }

  // Boot — GlobeModule is set inside initGlobe() after the instance exists
  // Ensure container has explicit size before init
  const _gc = document.getElementById("globe-container");
  if (_gc) {
    _gc.style.width  = _gc.style.width  || "100%";
    _gc.style.height = _gc.style.height || "100%";
    if (!_gc.offsetHeight) _gc.style.minHeight = "400px";
  }

  function safeInit() {
    try {
      initGlobe().catch(err => {
        console.error("[Social Globe] Globe init failed:", err);
      });
    } catch (err) {
      console.error("[Social Globe] Globe init threw synchronously:", err);
    }
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", safeInit);
  } else {
    safeInit();
  }
})();


