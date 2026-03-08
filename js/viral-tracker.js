// ============================================================
//  Social Pulse Globe — VIRAL TRACKER
//  Animated arcs showing viral content migration paths
//  Station dataset: 20 curated viral trend migrations 2020-2026
// ============================================================

(function () {

  // ── Centroids (lat/lng) ──────────────────────────────────────────────
  const C = {
    US:{lat:38,lng:-97},    IN:{lat:20,lng:78},    CN:{lat:35,lng:105},
    BR:{lat:-10,lng:-55},   RU:{lat:60,lng:90},    JP:{lat:36,lng:138},
    DE:{lat:51,lng:10},     GB:{lat:54,lng:-2},    FR:{lat:46,lng:2},
    AU:{lat:-25,lng:134},   CA:{lat:56,lng:-106},  MX:{lat:23,lng:-102},
    KR:{lat:37,lng:128},    ID:{lat:-5,lng:120},   NG:{lat:9,lng:8},
    EG:{lat:26,lng:30},     ZA:{lat:-29,lng:25},   AR:{lat:-34,lng:-64},
    PH:{lat:12,lng:122},    VN:{lat:16,lng:108},   TH:{lat:15,lng:101},
    TR:{lat:39,lng:35},     PL:{lat:52,lng:20},    ES:{lat:40,lng:-4},
    IT:{lat:42,lng:12},     NL:{lat:52,lng:5},     SE:{lat:62,lng:15},
    UA:{lat:49,lng:32},     PK:{lat:30,lng:69},    MY:{lat:4,lng:109},
    SG:{lat:1,lng:104},     SA:{lat:24,lng:45},    TW:{lat:23,lng:121},
    CO:{lat:4,lng:-74},     PE:{lat:-10,lng:-76},  NZ:{lat:-41,lng:174},
    IL:{lat:31,lng:35},     IR:{lat:32,lng:53},
  };

  // ── Country names ────────────────────────────────────────────────────
  const NAMES = {
    US:"USA",IN:"India",CN:"China",BR:"Brazil",RU:"Russia",JP:"Japan",
    DE:"Germany",GB:"UK",FR:"France",AU:"Australia",CA:"Canada",MX:"Mexico",
    KR:"South Korea",ID:"Indonesia",NG:"Nigeria",EG:"Egypt",ZA:"South Africa",
    AR:"Argentina",PH:"Philippines",VN:"Vietnam",TH:"Thailand",TR:"Turkey",
    PL:"Poland",ES:"Spain",IT:"Italy",NL:"Netherlands",SE:"Sweden",
    UA:"Ukraine",PK:"Pakistan",MY:"Malaysia",SG:"Singapore",SA:"Saudi Arabia",
    TW:"Taiwan",CO:"Colombia",PE:"Peru",NZ:"New Zealand",IL:"Israel",IR:"Iran",
  };

  // ── Platform colors ──────────────────────────────────────────────────
  const PC = {
    "TikTok":"#69C9D0","Instagram":"#E4405F","YouTube":"#FF0000",
    "Facebook":"#1877F2","X/Twitter":"#1DA1F2","WhatsApp":"#25D366",
    "Snapchat":"#FFFC00","WeChat":"#07C160",
  };

  // ── 20 curated viral migrations (2020-2026) ──────────────────────────
  // Each migration: trend → array of legs [ { from, to, days } ]
  const MIGRATIONS = [
    {
      id: "t1",
      trend: "Ocean Spray / Fleetwood Mac skateboarding",
      platform: "TikTok",
      year: 2020,
      intensity: 3,
      legs: [
        { from:"US", to:"GB", days:3 },
        { from:"GB", to:"AU", days:5 },
        { from:"AU", to:"CA", days:4 },
        { from:"US", to:"BR", days:7 },
      ],
    },
    {
      id: "t2",
      trend: "Glassmorphism design trend",
      platform: "Instagram",
      year: 2021,
      intensity: 2,
      legs: [
        { from:"US", to:"DE", days:5 },
        { from:"DE", to:"FR", days:3 },
        { from:"FR", to:"IN", days:8 },
        { from:"IN", to:"ID", days:6 },
      ],
    },
    {
      id: "t3",
      trend: "Squid Game costume trend",
      platform: "TikTok",
      year: 2021,
      intensity: 3,
      legs: [
        { from:"KR", to:"US", days:4 },
        { from:"US", to:"GB", days:2 },
        { from:"GB", to:"DE", days:3 },
        { from:"US", to:"BR", days:5 },
        { from:"KR", to:"JP", days:2 },
        { from:"JP", to:"AU", days:4 },
      ],
    },
    {
      id: "t4",
      trend: "Anywhere trend / Doja Cat",
      platform: "TikTok",
      year: 2021,
      intensity: 2,
      legs: [
        { from:"US", to:"NG", days:6 },
        { from:"NG", to:"GH", days:3 },
        { from:"US", to:"GB", days:4 },
        { from:"GB", to:"ZA", days:5 },
      ],
    },
    {
      id: "t5",
      trend: "Ukrainian war fundraising viral posts",
      platform: "Instagram",
      year: 2022,
      intensity: 3,
      legs: [
        { from:"UA", to:"PL", days:1 },
        { from:"PL", to:"DE", days:2 },
        { from:"DE", to:"US", days:2 },
        { from:"US", to:"CA", days:1 },
        { from:"US", to:"AU", days:3 },
        { from:"GB", to:"FR", days:2 },
      ],
    },
    {
      id: "t6",
      trend: "Twitter exodus to Mastodon",
      platform: "X/Twitter",
      year: 2022,
      intensity: 2,
      legs: [
        { from:"US", to:"DE", days:7 },
        { from:"DE", to:"GB", days:4 },
        { from:"GB", to:"FR", days:3 },
        { from:"US", to:"AU", days:6 },
        { from:"CA", to:"NL", days:8 },
      ],
    },
    {
      id: "t7",
      trend: "Wednesday Addams dance challenge",
      platform: "TikTok",
      year: 2022,
      intensity: 3,
      legs: [
        { from:"RO", to:"US", days:5 },
        { from:"US", to:"GB", days:2 },
        { from:"US", to:"MX", days:3 },
        { from:"US", to:"BR", days:4 },
        { from:"GB", to:"IN", days:6 },
        { from:"IN", to:"ID", days:5 },
        { from:"ID", to:"PH", days:3 },
      ],
    },
    {
      id: "t8",
      trend: "Duet with yourself editing style",
      platform: "TikTok",
      year: 2022,
      intensity: 2,
      legs: [
        { from:"US", to:"GB", days:4 },
        { from:"GB", to:"DE", days:5 },
        { from:"DE", to:"PL", days:4 },
        { from:"PL", to:"UA", days:3 },
      ],
    },
    {
      id: "t9",
      trend: "Threads migration wave",
      platform: "Instagram",
      year: 2023,
      intensity: 3,
      legs: [
        { from:"US", to:"BR", days:1 },
        { from:"US", to:"IN", days:1 },
        { from:"US", to:"AU", days:2 },
        { from:"US", to:"GB", days:2 },
        { from:"US", to:"MX", days:3 },
        { from:"BR", to:"AR", days:4 },
        { from:"GB", to:"DE", days:3 },
      ],
    },
    {
      id: "t10",
      trend: "K-pop 'FML' by BTS fan covers",
      platform: "TikTok",
      year: 2023,
      intensity: 2,
      legs: [
        { from:"KR", to:"TH", days:2 },
        { from:"KR", to:"IN", days:3 },
        { from:"KR", to:"US", days:3 },
        { from:"KR", to:"ID", days:2 },
        { from:"KR", to:"PH", days:2 },
      ],
    },
    {
      id: "t11",
      trend: "AI face filter / aging trend",
      platform: "Instagram",
      year: 2023,
      intensity: 2,
      legs: [
        { from:"US", to:"TR", days:4 },
        { from:"TR", to:"SA", days:3 },
        { from:"SA", to:"EG", days:3 },
        { from:"EG", to:"NG", days:5 },
        { from:"US", to:"IN", days:5 },
      ],
    },
    {
      id: "t12",
      trend: "Barbie movie aesthetic wave",
      platform: "Instagram",
      year: 2023,
      intensity: 3,
      legs: [
        { from:"US", to:"GB", days:2 },
        { from:"GB", to:"FR", days:3 },
        { from:"FR", to:"IT", days:2 },
        { from:"US", to:"BR", days:4 },
        { from:"BR", to:"AR", days:3 },
        { from:"US", to:"AU", days:3 },
      ],
    },
    {
      id: "t13",
      trend: "TikTok Shop haul videos",
      platform: "TikTok",
      year: 2023,
      intensity: 2,
      legs: [
        { from:"CN", to:"US", days:5 },
        { from:"CN", to:"MY", days:3 },
        { from:"MY", to:"SG", days:2 },
        { from:"US", to:"GB", days:4 },
        { from:"GB", to:"AU", days:5 },
      ],
    },
    {
      id: "t14",
      trend: "TikTok ban refugee exodus to Xiaohongshu (RedNote)",
      platform: "TikTok",
      year: 2024,
      intensity: 3,
      legs: [
        { from:"US", to:"CN", days:1 },
        { from:"US", to:"CA", days:2 },
        { from:"US", to:"GB", days:3 },
        { from:"US", to:"AU", days:4 },
        { from:"CA", to:"ZA", days:7 },
      ],
    },
    {
      id: "t15",
      trend: "Sabrina Carpenter 'Espresso' dance trend",
      platform: "TikTok",
      year: 2024,
      intensity: 2,
      legs: [
        { from:"US", to:"MX", days:3 },
        { from:"US", to:"GB", days:3 },
        { from:"GB", to:"ES", days:4 },
        { from:"ES", to:"IT", days:3 },
        { from:"MX", to:"CO", days:4 },
        { from:"CO", to:"BR", days:3 },
      ],
    },
    {
      id: "t16",
      trend: "YouTube Shorts creator migration from TikTok",
      platform: "YouTube",
      year: 2024,
      intensity: 3,
      legs: [
        { from:"US", to:"IN", days:6 },
        { from:"US", to:"ID", days:7 },
        { from:"US", to:"BR", days:6 },
        { from:"US", to:"MX", days:5 },
        { from:"IN", to:"PK", days:4 },
        { from:"IN", to:"BD", days:5 },
      ],
    },
    {
      id: "t17",
      trend: "Outfit GRWM (Get Ready With Me) trend",
      platform: "Instagram",
      year: 2024,
      intensity: 2,
      legs: [
        { from:"IN", to:"MY", days:4 },
        { from:"IN", to:"SG", days:5 },
        { from:"IN", to:"US", days:8 },
        { from:"US", to:"GB", days:3 },
        { from:"SG", to:"AU", days:4 },
      ],
    },
    {
      id: "t18",
      trend: "AI-generated image viral challenges",
      platform: "Instagram",
      year: 2025,
      intensity: 2,
      legs: [
        { from:"US", to:"DE", days:5 },
        { from:"DE", to:"FR", days:4 },
        { from:"US", to:"KR", days:6 },
        { from:"KR", to:"JP", days:3 },
        { from:"JP", to:"TW", days:3 },
        { from:"TW", to:"CN", days:5 },
      ],
    },
    {
      id: "t19",
      trend: "Vibe coding / AI developer memes",
      platform: "X/Twitter",
      year: 2025,
      intensity: 2,
      legs: [
        { from:"US", to:"GB", days:2 },
        { from:"GB", to:"DE", days:3 },
        { from:"DE", to:"IN", days:4 },
        { from:"IN", to:"SG", days:3 },
        { from:"SG", to:"AU", days:4 },
      ],
    },
    {
      id: "t20",
      trend: "Instagram Collabs multi-creator posts",
      platform: "Instagram",
      year: 2026,
      intensity: 3,
      legs: [
        { from:"US", to:"MX", days:3 },
        { from:"MX", to:"CO", days:4 },
        { from:"CO", to:"AR", days:4 },
        { from:"AR", to:"BR", days:3 },
        { from:"US", to:"IN", days:5 },
        { from:"IN", to:"ID", days:4 },
      ],
    },
  ];

  // ── State ─────────────────────────────────────────────────────────────
  let trackerActive  = false;
  let activeFilter   = null;   // filter by migration ID, null = all
  let popupArcData   = null;

  // ── Build Globe.gl arc objects for a migration ────────────────────────
  function migrationToArcs(m) {
    const color = PC[m.platform] || "#00f5ff";
    return m.legs
      .filter(leg => C[leg.from] && C[leg.to])
      .map(leg => ({
        _type:      "viral",
        _migId:     m.id,
        _trend:     m.trend,
        _platform:  m.platform,
        _year:      m.year,
        _fromName:  NAMES[leg.from] || leg.from,
        _toName:    NAMES[leg.to]   || leg.to,
        _days:      leg.days,
        _intensity: m.intensity,
        startLat:   C[leg.from].lat,
        startLng:   C[leg.from].lng,
        endLat:     C[leg.to].lat,
        endLng:     C[leg.to].lng,
        color,
        stroke:     0.4 + m.intensity * 0.55,  // 0.95 – 2.05
        altitude:   0.25 + m.intensity * 0.08,
        animateMs:  2800 - (m.intensity - 1) * 400,
      }));
  }

  function buildViralArcs() {
    const migs = activeFilter
      ? MIGRATIONS.filter(m => m.id === activeFilter)
      : MIGRATIONS;
    return migs.flatMap(migrationToArcs);
  }

  // ── Apply / remove viral arcs from globe ──────────────────────────────
  function applyArcs() {
    if (window.GlobeModule?.setViralArcs) {
      window.GlobeModule.setViralArcs(buildViralArcs());
    } else {
      // Globe not ready yet — retry after a short delay
      setTimeout(applyArcs, 600);
    }
  }

  function clearArcs() {
    window.GlobeModule?.setViralArcs?.([]);
  }

  // ── Render sidebar list of migrations ────────────────────────────────
  function renderList() {
    const list = document.getElementById("vt-list");
    if (!list) return;

    list.innerHTML = MIGRATIONS.map(m => {
      const color = PC[m.platform] || "#00f5ff";
      const dots  = "●".repeat(m.intensity) + "○".repeat(3 - m.intensity);
      return `
        <div class="vt-item ${activeFilter === m.id ? "vt-item--active" : ""}"
             data-id="${m.id}" style="--pc:${color}">
          <div class="vt-item-top">
            <span class="vt-platform" style="color:${color}">${m.platform}</span>
            <span class="vt-year">${m.year}</span>
            <span class="vt-intensity">${dots}</span>
          </div>
          <div class="vt-trend">${m.trend}</div>
          <div class="vt-legs">${m.legs.length} jumps · ${m.legs.map(l=>`${NAMES[l.from]||l.from}→${NAMES[l.to]||l.to}`).slice(0,2).join(", ")}…</div>
        </div>`;
    }).join("");

    // Click handlers
    list.querySelectorAll(".vt-item").forEach(el => {
      el.addEventListener("click", () => {
        const id = el.dataset.id;
        if (activeFilter === id) {
          activeFilter = null;
          list.querySelectorAll(".vt-item").forEach(i => i.classList.remove("vt-item--active"));
        } else {
          activeFilter = id;
          list.querySelectorAll(".vt-item").forEach(i =>
            i.classList.toggle("vt-item--active", i.dataset.id === id));
        }
        applyArcs();
      });
    });
  }

  // ── Arc click → popup ───────────────────────────────────────────────
  function showArcPopup(arc, clientX, clientY) {
    const popup = document.getElementById("vt-arc-popup");
    if (!popup) return;
    popup.innerHTML = `
      <button id="vt-arc-close">✕</button>
      <div class="vt-popup-platform" style="color:${arc.color}">${arc._platform} · ${arc._year}</div>
      <div class="vt-popup-trend">"${arc._trend}"</div>
      <div class="vt-popup-route">
        ${arc._fromName} → ${arc._toName}
      </div>
      <div class="vt-popup-days">Reached in <strong>${arc._days} days</strong></div>`;

    // Position near click
    popup.style.left = Math.min(clientX + 12, window.innerWidth - 240) + "px";
    popup.style.top  = Math.max(clientY - 80, 10) + "px";
    popup.classList.add("visible");
    document.getElementById("vt-arc-close")?.addEventListener("click", () =>
      popup.classList.remove("visible"), { once: true });
  }

  window.ViralTracker = {
    isActive: () => trackerActive,
    show() {
      trackerActive = true;
      const panel = document.getElementById("vt-panel");
      panel?.classList.add("visible");
      panel?.setAttribute("aria-hidden", "false");
      renderList();
      applyArcs();
      const btn = document.getElementById("vt-toggle-btn");
      if (btn) btn.setAttribute("aria-pressed", "true");
      btn?.classList.add("active");
    },
    hide() {
      trackerActive = false;
      activeFilter  = null;
      const panel = document.getElementById("vt-panel");
      panel?.classList.remove("visible");
      panel?.setAttribute("aria-hidden", "true");
      clearArcs();
      const btn = document.getElementById("vt-toggle-btn");
      if (btn) btn.setAttribute("aria-pressed", "false");
      btn?.classList.remove("active");
    },
    toggle() {
      trackerActive ? this.hide() : this.show();
    },
    onArcClick(arc, x, y) {
      showArcPopup(arc, x, y);
    },
    MIGRATIONS,
  };

  // ── Wire toggle button + close button ─────────────────────────────
  function wireButtons() {
    document.getElementById("vt-toggle-btn")?.addEventListener("click", () =>
      window.ViralTracker.toggle());
    document.getElementById("vt-close")?.addEventListener("click", () =>
      window.ViralTracker.hide());
  }
  if (document.readyState !== "loading") wireButtons();
  else document.addEventListener("DOMContentLoaded", wireButtons);

})();


