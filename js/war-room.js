// ============================================================
//  Social Pulse Globe — WAR ROOM Module
//  Fullscreen territory dominance dashboard
// ============================================================

(function () {
  const { SOCIAL_DATA, PLATFORM_COLORS } = window.SocialData;

  const WAR_PLATFORMS = [
    { key: "Facebook",  label: "Facebook",  icon: "f",  color: "#1877F2" },
    { key: "YouTube",   label: "YouTube",   icon: "▶",  color: "#FF0000" },
    { key: "WhatsApp",  label: "WhatsApp",  icon: "✆",  color: "#25D366" },
    { key: "Instagram", label: "Instagram", icon: "◈",  color: "#E4405F" },
    { key: "TikTok",    label: "TikTok",    icon: "♪",  color: "#69C9D0" },
    { key: "X/Twitter", label: "X",         icon: "✕",  color: "#1DA1F2" },
    { key: "WeChat",    label: "WeChat",    icon: "⊕",  color: "#07C160" },
    { key: "Snapchat",  label: "Snapchat",  icon: "👻", color: "#FFFC00" },
  ];

  let warRoomActive      = false;
  let feedItems          = [];
  let dominatorCycleIdx  = 0;
  let dominatorInterval  = null;

  // ── Pre-compute territory stats ───────────────────────────────────────
  function computeStats() {
    const kills = {};
    const hp    = {};

    WAR_PLATFORMS.forEach(p => { kills[p.key] = 0; hp[p.key] = 0; });

    const contested = [];

    Object.entries(SOCIAL_DATA).forEach(([iso2, d]) => {
      if (!d.platforms) return;
      const sorted = Object.entries(d.platforms)
        .filter(([,v]) => v > 0)
        .sort((a,b) => b[1] - a[1]);
      if (!sorted.length) return;

      const [topKey, topVal] = sorted[0];
      const second = sorted[1];

      // Kills: which platform dominates this country
      if (kills[topKey] !== undefined) kills[topKey]++;

      // HP: total platform users across all countries
      Object.entries(d.platforms).forEach(([k, v]) => {
        if (hp[k] !== undefined) hp[k] += v;
      });

      // Contested: top two within 10%
      if (second && second[1] / topVal >= 0.90) {
        contested.push({ iso2, name: d.name, p1: topKey, p2: second[0], v1: topVal, v2: second[1] });
      }
    });

    return { kills, hp, contested };
  }

  const stats = computeStats();

  function getSortedFighters() {
    return WAR_PLATFORMS.map(p => ({
      ...p,
      hp:    stats.hp[p.key]    || 0,
      kills: stats.kills[p.key] || 0,
    })).sort((a, b) => b.hp - a.hp);
  }

  const fighters = getSortedFighters();
  const maxHP    = Math.max(...fighters.map(f => f.hp), 1);

  function getGlobalDominator() {
    if (!fighters.length) return WAR_PLATFORMS[0];
    return fighters.reduce((best, f) => f.kills > best.kills ? f : best, fighters[0]);
  }

  // ── Build initial territory feed ──────────────────────────────────────
  function buildInitialFeed() {
    const items = [];

    // Dominance established events
    const countries = Object.entries(SOCIAL_DATA)
      .filter(([, d]) => d.platforms && Object.keys(d.platforms).length)
      .sort(() => Math.random() - 0.5)
      .slice(0, 22);

    countries.forEach(([, d]) => {
      const sorted = Object.entries(d.platforms).sort((a,b) => b[1] - a[1]);
      if (!sorted.length) return;
      const [winner] = sorted[0];
      const runner   = sorted[1]?.[0];
      if (!WAR_PLATFORMS.find(p => p.key === winner)) return;
      items.push({
        type:  "establish",
        msg:   `${winner} controls ${d.name}${runner ? " vs " + runner : ""}`,
        color: PLATFORM_COLORS[winner] || "#fff",
        icon:  "🏴",
        ts:    Date.now() - Math.floor(Math.random() * 3600000),
      });
    });

    // Contested zone alerts
    stats.contested.forEach(c => {
      items.push({
        type:  "contested",
        msg:   `${c.p1} vs ${c.p2} DISPUTED in ${c.name} (${c.v1}M vs ${c.v2}M)`,
        color: "#ffaa00",
        icon:  "⚡",
        ts:    Date.now() - Math.floor(Math.random() * 1800000),
      });
    });

    return items.sort((a, b) => b.ts - a.ts);
  }

  // ── Render functions ──────────────────────────────────────────────────
  function renderDominator() {
    const el = document.getElementById("wr-dominator");
    if (!el) return;
    const dom = getGlobalDominator();
    const hpLabel = dom.hp >= 1000 ? (dom.hp / 1000).toFixed(1) + "B" : Math.round(dom.hp) + "M";
    el.innerHTML = `
      <div class="wr-dom-icon" style="color:${dom.color}">${dom.icon}</div>
      <div class="wr-dom-name" style="color:${dom.color};text-shadow:0 0 30px ${dom.color}88">${dom.label.toUpperCase()}</div>
      <div class="wr-dom-metrics">
        <div class="wr-dom-metric">
          <span class="wr-dom-val">${dom.kills}</span>
          <span class="wr-dom-lbl">TERRITORIES</span>
        </div>
        <div class="wr-dom-divider">|</div>
        <div class="wr-dom-metric">
          <span class="wr-dom-val">${hpLabel}</span>
          <span class="wr-dom-lbl">TOTAL USERS</span>
        </div>
        <div class="wr-dom-divider">|</div>
        <div class="wr-dom-metric">
          <span class="wr-dom-val">${stats.contested.length}</span>
          <span class="wr-dom-lbl">CONTESTED</span>
        </div>
      </div>`;
  }

  function renderScoreboard() {
    const el = document.getElementById("wr-scoreboard");
    if (!el) return;
    el.innerHTML = "";

    fighters.forEach((f, i) => {
      const hpPct  = Math.min(100, Math.round((f.hp / maxHP) * 100));
      const hpLbl  = f.hp >= 1000 ? (f.hp / 1000).toFixed(1) + "B" : Math.round(f.hp) + "M";
      const row    = document.createElement("div");
      row.className = "wr-fighter";
      row.style.setProperty("--pc", f.color);

      // HP color: green → yellow → red based on percentage
      const hpColor = hpPct > 60 ? f.color : hpPct > 30 ? "#ffcc00" : "#ff3030";

      row.innerHTML = `
        <div class="wr-fighter-rank">#${i + 1}</div>
        <div class="wr-fighter-icon">${f.icon}</div>
        <div class="wr-fighter-data">
          <div class="wr-fighter-top">
            <span class="wr-fighter-name">${f.label.toUpperCase()}</span>
            <span class="wr-fighter-kills">☠ ${f.kills}</span>
            <span class="wr-fighter-hp-num" style="color:${hpColor}">${hpLbl}</span>
          </div>
          <div class="wr-hp-track">
            <div class="wr-hp-fill" style="width:${hpPct}%;background:${hpColor};box-shadow:0 0 8px ${hpColor}99"></div>
            <div class="wr-hp-shine"></div>
          </div>
        </div>`;
      el.appendChild(row);
    });
  }

  function renderFeed() {
    const el = document.getElementById("wr-feed");
    if (!el) return;
    el.innerHTML = "";
    feedItems.slice(0, 18).forEach(item => {
      const div = document.createElement("div");
      div.className = "wr-feed-item" + (item.type === "contested" ? " wr-feed-contested" : "") +
                      (item.type === "invasion" ? " wr-feed-invasion" : "");
      div.innerHTML =
        `<span class="wr-feed-icon">${item.icon}</span>` +
        `<span class="wr-feed-txt" style="color:${item.color}">${item.msg}</span>`;
      el.appendChild(div);
    });
  }

  // ── Public: log a territory event (Platform War calls this) ──────────
  function logEvent(platformKey, countryName, prevPlatform) {
    if (!warRoomActive) return;
    const color = PLATFORM_COLORS[platformKey] || "#fff";
    feedItems.unshift({
      type:  "invasion",
      msg:   `${platformKey} annexes ${countryName}${prevPlatform ? " from " + prevPlatform : ""}`,
      color,
      icon:  "⚔",
      ts:    Date.now(),
    });
    if (feedItems.length > 40) feedItems.pop();
    renderFeed();
  }

  // ── Enter / Exit ──────────────────────────────────────────────────────
  function enter() {
    if (warRoomActive) return;
    warRoomActive = true;

    document.body.classList.add("war-room-active");
    const overlay = document.getElementById("war-room");
    overlay.classList.add("open");
    overlay.setAttribute("aria-hidden", "false");

    // Switch globe to territory-dominance coloring
    window.GlobeModule?.setWarRoomMode(true);

    // Render dashboard
    renderDominator();
    renderScoreboard();
    feedItems = buildInitialFeed();
    renderFeed();

    // Slow globe spin
    if (window.GlobeModule?.globeInstance) {
      window.GlobeModule.globeInstance.controls().autoRotateSpeed = 0.3;
    }

    // Show timeline scrubber
    window.TimelineScrubber?.show();
  }

  function exit() {
    if (!warRoomActive) return;
    warRoomActive = false;

    document.body.classList.remove("war-room-active");
    const overlay = document.getElementById("war-room");
    overlay.classList.remove("open");
    overlay.setAttribute("aria-hidden", "true");

    window.GlobeModule?.setWarRoomMode(false);

    // Cleanup timeline + prediction
    window.TimelineScrubber?.hide();
    window.BattlePrediction?.hidePanel();
    window.BattlePrediction?.cleanupTargetEls();

    if (window.GlobeModule?.globeInstance) {
      window.GlobeModule.globeInstance.controls().autoRotateSpeed = 0.6;
    }
  }

  // ── Wire buttons ──────────────────────────────────────────────────────
  const entryBtn = document.getElementById("war-room-btn");
  const exitBtn  = document.getElementById("wr-exit-btn");
  if (entryBtn) entryBtn.addEventListener("click", enter);
  if (exitBtn)  exitBtn.addEventListener("click", exit);

  // Keyboard shortcut: W to toggle
  document.addEventListener("keydown", e => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    if (e.key === "w" || e.key === "W") {
      if (warRoomActive) exit(); else enter();
    }
  });

  window.WarRoomModule = { enter, exit, logEvent };
})();


