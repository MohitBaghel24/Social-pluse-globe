// ============================================================
//  Social Pulse Globe — Platform War Module
//  Auto-cycles platforms, live race-bar leaderboard, Web Audio
// ============================================================

(function () {

  const WAR_PLATFORMS = [
    { key: "Facebook",  label: "Facebook",  icon: "f",  color: "#1877F2" },
    { key: "Instagram", label: "Instagram", icon: "◈",  color: "#E4405F" },
    { key: "YouTube",   label: "YouTube",   icon: "▶",  color: "#FF0000" },
    { key: "TikTok",    label: "TikTok",    icon: "♪",  color: "#69C9D0" },
    { key: "WhatsApp",  label: "WhatsApp",  icon: "✆",  color: "#25D366" },
    { key: "X/Twitter", label: "X",         icon: "✕",  color: "#1DA1F2" },
    { key: "WeChat",    label: "WeChat",    icon: "⊕",  color: "#07C160" },
    { key: "Snapchat",  label: "Snapchat",  icon: "👻", color: "#FFFC00" },
  ];

  let warActive   = false;
  let warIndex    = -1;
  let warInterval = null;
  let speedMs     = 3000;
  let prevRanks   = {};          // key → previous rank (1-based)
  let cycleAnimId = null;
  let cycleStart  = null;
  let audioCtx    = null;

  const warBtn       = document.getElementById("war-btn");
  const warPanel     = document.getElementById("war-panel");
  const leaderboard  = document.getElementById("war-leaderboard");
  const cycleFill    = document.getElementById("war-cycle-fill");

  // Abort silently if critical DOM is missing
  if (!warBtn || !warPanel || !leaderboard || !cycleFill) {
    console.warn("[PlatformWar] Missing DOM elements — module disabled.");
    window.PlatformWar = { start() {}, stop() {} };
    return;
  }

  // ── Global totals per platform ────────────────────────────────────────
  function computeTotals() {
    const { SOCIAL_DATA } = window.SocialData;
    const totals = {};
    WAR_PLATFORMS.forEach(p => { totals[p.key] = 0; });
    Object.values(SOCIAL_DATA).forEach(country => {
      if (!country.platforms) return;
      Object.entries(country.platforms).forEach(([k, v]) => {
        if (totals[k] !== undefined) totals[k] += v;
      });
    });
    return totals;
  }

  function getSorted(totals) {
    return WAR_PLATFORMS
      .map(p => ({ ...p, total: totals[p.key] || 0 }))
      .sort((a, b) => b.total - a.total);
  }

  // ── Web Audio synthesis whoosh ────────────────────────────────────────
  function playWhoosh() {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx  = audioCtx;
      const t    = ctx.currentTime;
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      // High-pass-style whoosh: sweep 700→90 Hz
      osc.type = "sine";
      osc.frequency.setValueAtTime(700, t);
      osc.frequency.exponentialRampToValueAtTime(90, t + 0.38);
      // Envelope: fast attack, slow tail
      gain.gain.setValueAtTime(0.001, t);
      gain.gain.linearRampToValueAtTime(0.22, t + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, t + 0.42);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.44);
    } catch (_) { /* silent fail — audio blocked */ }
  }

  // ── Cycle progress bar (RAF-driven) ──────────────────────────────────
  function startCycleBar() {
    if (cycleAnimId) cancelAnimationFrame(cycleAnimId);
    cycleStart = performance.now();
    function tick(now) {
      if (!warActive) return;
      const pct = Math.min(100, ((now - cycleStart) / speedMs) * 100);
      cycleFill.style.width = pct + "%";
      if (pct < 100) cycleAnimId = requestAnimationFrame(tick);
    }
    cycleAnimId = requestAnimationFrame(tick);
  }

  // ── Leaderboard renderer ──────────────────────────────────────────────
  function renderLeaderboard(sorted, activeKey) {
    const maxTotal = sorted[0]?.total || 1;
    leaderboard.innerHTML = "";

    sorted.forEach((p, i) => {
      const rank = i + 1;
      const prev = prevRanks[p.key];
      let arrowHtml = "";
      if (prev !== undefined && prev !== rank) {
        const delta = Math.abs(prev - rank);
        if (prev > rank) {
          arrowHtml = `<span class="war-arrow war-arrow--up">↑${delta}</span>`;
        } else {
          arrowHtml = `<span class="war-arrow war-arrow--dn">↓${delta}</span>`;
        }
      }

      const barPct = Math.round((p.total / maxTotal) * 100);
      const isActive = p.key === activeKey;

      const totalLabel = p.total >= 1000
        ? (p.total / 1000).toFixed(1) + "B"
        : Math.round(p.total) + "M";

      const row = document.createElement("div");
      row.className = "war-row" + (isActive ? " war-row--active" : "");
      row.style.setProperty("--pc", p.color);

      row.innerHTML = `
        <div class="war-rank-cell">
          <span class="war-rank">#${rank}</span>
          ${arrowHtml}
        </div>
        <span class="war-icon-cell" aria-hidden="true">${p.icon}</span>
        <div class="war-info">
          <div class="war-label-row">
            <span class="war-label">${p.label}</span>
            <span class="war-total">${totalLabel}</span>
          </div>
          <div class="war-bar-track">
            <div class="war-bar-fill" style="width:${barPct}%"></div>
          </div>
        </div>`;

      leaderboard.appendChild(row);
    });

    // Store new ranks for next cycle
    sorted.forEach((p, i) => { prevRanks[p.key] = i + 1; });
  }

  // ── Platform switch step ──────────────────────────────────────────────
  function advance() {
    warIndex = (warIndex + 1) % WAR_PLATFORMS.length;
    const platform = WAR_PLATFORMS[warIndex];
    playWhoosh();
    if (window.SwitcherModule?.activate) window.SwitcherModule.activate(platform.key);
    const sorted = getSorted(computeTotals());
    renderLeaderboard(sorted, platform.key);
    startCycleBar();
    // Notify kill feed
    window.KillFeed?.onWarAdvance?.(platform.key);
  }

  // ── Start / Stop ──────────────────────────────────────────────────────
  function startWar() {
    warActive = true;
    warBtn.classList.add("active");
    warBtn.setAttribute("aria-pressed", "true");
    warPanel.classList.add("open");
    warPanel.setAttribute("aria-hidden", "false");

    // Kick off immediately at index 0
    warIndex = -1;
    prevRanks = {};
    advance();
    warInterval = setInterval(advance, speedMs);

    // Show kill feed
    window.KillFeed?.show?.();
  }

  function stopWar() {
    warActive = false;
    clearInterval(warInterval);
    warInterval = null;
    if (cycleAnimId) cancelAnimationFrame(cycleAnimId);
    cycleAnimId = null;

    warBtn.classList.remove("active");
    warBtn.setAttribute("aria-pressed", "false");
    warPanel.classList.remove("open");
    warPanel.setAttribute("aria-hidden", "true");
    cycleFill.style.width = "0%";
    prevRanks = {};

    // Return globe to ALL view
    if (window.SwitcherModule?.activate) window.SwitcherModule.activate("ALL");

    // Hide kill feed
    window.KillFeed?.hide?.();
  }

  // ── Speed controls ────────────────────────────────────────────────────
  document.querySelectorAll(".war-speed-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      speedMs = parseInt(btn.dataset.ms, 10);
      document.querySelectorAll(".war-speed-btn").forEach(b => b.classList.remove("active"));
      btn.classList.add("active");
      if (warActive) {
        clearInterval(warInterval);
        warInterval = setInterval(advance, speedMs);
        startCycleBar();
      }
    });
  });

  warBtn.addEventListener("click", () => {
    if (warActive) stopWar(); else startWar();
  });

  window.PlatformWar = { start: startWar, stop: stopWar };
})();


