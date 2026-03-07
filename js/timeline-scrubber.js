// ============================================================
//  Social Pulse Globe — Timeline Scrubber
//  Shows 2018-2026 historical platform dominance in WAR ROOM
// ============================================================

(function () {
  const YEARS        = window.HistoricalData.YEARS;                // [2018..2026]
  const EVENTS       = window.HistoricalData.TIMELINE_EVENTS;
  const MIN_Y        = YEARS[0];
  const MAX_Y        = YEARS[YEARS.length - 1];

  let currentYear    = MAX_Y;
  let isPlaying      = false;
  let playTimer      = null;
  let eventPopupOpen = false;

  // ── Build timeline DOM (injected when WAR ROOM opens) ─────────────
  function buildUI() {
    if (document.getElementById("tl-bar")) return; // already built

    const bar = document.createElement("div");
    bar.id = "tl-bar";
    bar.setAttribute("aria-label", "Historical timeline scrubber");
    bar.innerHTML = `
      <div class="tl-header">
        <button id="tl-play" class="tl-play-btn" title="Play/Pause timeline">▶ PLAY</button>
        <div class="tl-year-display">
          <span id="tl-year-label">${currentYear}</span>
          <span class="tl-year-sub" id="tl-year-sub">CURRENT DATA</span>
        </div>
        <button id="tl-reset" class="tl-reset-btn" title="Reset to current year">↺ LIVE</button>
      </div>

      <div class="tl-track-wrap">
        <!-- ── Event marker labels (above track) ── -->
        <div class="tl-markers-row" id="tl-markers-row"></div>

        <!-- ── Slider track ── -->
        <div class="tl-track">
          <input type="range" id="tl-slider"
            min="${MIN_Y}" max="${MAX_Y}" value="${currentYear}" step="1"
            aria-label="Year selector">
          <div class="tl-progress" id="tl-progress"></div>
          <!-- event dots injected here -->
          <div class="tl-dots-layer" id="tl-dots-layer"></div>
        </div>

        <!-- ── Year labels below track ── -->
        <div class="tl-year-labels">
          ${YEARS.map(y => `<span class="tl-yl" data-year="${y}">${y}</span>`).join("")}
        </div>
      </div>

      <!-- ── Event popup ── -->
      <div id="tl-event-popup" class="tl-event-popup" aria-hidden="true">
        <button id="tl-ep-close" class="tl-ep-close">✕</button>
        <div id="tl-ep-inner"></div>
      </div>`;

    // Inject into body (not inside #war-room, to allow fixed positioning)
    document.body.appendChild(bar);

    // Build event markers
    buildMarkers();

    // Wire controls
    const slider  = document.getElementById("tl-slider");
    const playBtn = document.getElementById("tl-play");
    const resetBtn= document.getElementById("tl-reset");
    const epClose = document.getElementById("tl-ep-close");

    slider.addEventListener("input",  () => { scrubTo(+slider.value); });
    slider.addEventListener("change", () => { scrubTo(+slider.value); });
    playBtn.addEventListener("click", togglePlay);
    resetBtn.addEventListener("click", resetToLive);
    epClose.addEventListener("click", () => {
      document.getElementById("tl-event-popup").classList.remove("visible");
      eventPopupOpen = false;
    });

    // Update progress fill on load
    updateProgress(currentYear);
  }

  // ── Event markers on slider ────────────────────────────────────────
  function buildMarkers() {
    const dotsLayer   = document.getElementById("tl-dots-layer");
    const markersRow  = document.getElementById("tl-markers-row");
    if (!dotsLayer || !markersRow) return;

    const totalYears  = MAX_Y - MIN_Y;

    EVENTS.forEach(ev => {
      const pct = ((ev.year - MIN_Y) / totalYears) * 100;

      // Dot on track
      const dot = document.createElement("div");
      dot.className = "tl-event-dot";
      dot.style.left = pct + "%";
      dot.title = ev.year + ": " + ev.label;
      dot.dataset.year = ev.year;
      dot.innerHTML = `<span class="tl-dot-pulse"></span>`;
      dot.addEventListener("click", () => openEventPopup(ev));
      dotsLayer.appendChild(dot);

      // Label above track
      const lbl = document.createElement("div");
      lbl.className = "tl-marker-label";
      lbl.style.left = pct + "%";
      lbl.textContent = ev.icon + " " + ev.year;
      lbl.dataset.year = ev.year;
      lbl.addEventListener("click", () => openEventPopup(ev));
      markersRow.appendChild(lbl);
    });
  }

  // ── Event popup ───────────────────────────────────────────────────
  function openEventPopup(ev) {
    const popup = document.getElementById("tl-event-popup");
    const inner = document.getElementById("tl-ep-inner");
    if (!popup || !inner) return;

    inner.innerHTML = `
      <div class="tl-ep-icon">${ev.icon}</div>
      <div class="tl-ep-year">${ev.year}</div>
      <div class="tl-ep-title">${ev.label}</div>
      <div class="tl-ep-detail">${ev.detail}</div>
      <div class="tl-ep-impact">
        <span class="tl-ep-impact-lbl">📊 DATA IMPACT:</span>
        ${ev.impact}
      </div>`;

    popup.classList.add("visible");
    popup.setAttribute("aria-hidden", "false");
    eventPopupOpen = true;

    // Jump globe to that year
    scrubTo(ev.year, true);
    const slider = document.getElementById("tl-slider");
    if (slider) slider.value = ev.year;
  }

  // ── Core scrub ────────────────────────────────────────────────────
  function scrubTo(year, skipSlider) {
    currentYear = year;

    // Update labels
    const lbl = document.getElementById("tl-year-label");
    const sub = document.getElementById("tl-year-sub");
    if (lbl) lbl.textContent = year;
    if (sub) {
      const ev = EVENTS.find(e => e.year === year);
      sub.textContent = ev ? ev.icon + " " + ev.label : (year === MAX_Y ? "CURRENT DATA" : "HISTORICAL · " + year);
    }

    // Highlight year labels
    document.querySelectorAll(".tl-yl").forEach(el => {
      el.classList.toggle("active", +el.dataset.year === year);
    });

    // Highlight event markers
    document.querySelectorAll(".tl-event-dot, .tl-marker-label").forEach(el => {
      el.classList.toggle("tl-ev-active", +el.dataset.year === year);
    });

    // Slider sync
    if (!skipSlider) {
      const s = document.getElementById("tl-slider");
      if (s) s.value = year;
    }

    // Progress bar
    updateProgress(year);

    // Recolor globe
    applyYearToGlobe(year);
  }

  function updateProgress(year) {
    const prog = document.getElementById("tl-progress");
    if (prog) prog.style.width = ((year - MIN_Y) / (MAX_Y - MIN_Y) * 100) + "%";
  }

  // ── Apply historical data to globe ────────────────────────────────
  function applyYearToGlobe(year) {
    if (!window.GlobeModule) return;

    if (year === MAX_Y) {
      // Restore live data
      window.GlobeModule.restoreHistoricalOverride?.();
    } else {
      // Build synthetic data for the year
      const yearData = window.HistoricalData.buildYearData(year);
      window.GlobeModule.applyHistoricalYear?.(yearData);
    }
  }

  // ── Play/Pause ──────────────────────────────────────────────────────
  function togglePlay() {
    isPlaying ? pause() : play();
  }

  function play() {
    isPlaying = true;
    const btn = document.getElementById("tl-play");
    if (btn) btn.textContent = "⏸ PAUSE";

    // If at end, reset to start
    if (currentYear >= MAX_Y) scrubTo(MIN_Y);

    function advance() {
      if (!isPlaying) return;
      const nextYear = currentYear + 1;
      if (nextYear > MAX_Y) {
        pause();
        return;
      }
      scrubTo(nextYear);
      const slider = document.getElementById("tl-slider");
      if (slider) slider.value = nextYear;
      playTimer = setTimeout(advance, 1500);
    }
    playTimer = setTimeout(advance, 1500);
  }

  function pause() {
    isPlaying = false;
    clearTimeout(playTimer);
    playTimer = null;
    const btn = document.getElementById("tl-play");
    if (btn) btn.textContent = "▶ PLAY";
  }

  function resetToLive() {
    pause();
    scrubTo(MAX_Y);
    const slider = document.getElementById("tl-slider");
    if (slider) slider.value = MAX_Y;
    window.GlobeModule?.restoreHistoricalOverride?.();
  }

  // ── Show / hide ─────────────────────────────────────────────────────
  function show() {
    buildUI();
    const bar = document.getElementById("tl-bar");
    if (bar) bar.classList.add("visible");
  }

  function hide() {
    pause();
    const bar = document.getElementById("tl-bar");
    if (bar) bar.classList.remove("visible");
    // Close event popup if open
    document.getElementById("tl-event-popup")?.classList.remove("visible");
    // Always restore live data when leaving WAR ROOM
    window.GlobeModule?.restoreHistoricalOverride?.();
    currentYear = MAX_Y;
  }

  window.TimelineScrubber = { show, hide, scrubTo };

})();


