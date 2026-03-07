// ============================================================
//  Social Pulse Globe — Activity Pulse Module
//  Every 10s: randomly fires "burst" animations on countries,
//  weighted by totalUsers so IN / CN / US burst most often.
// ============================================================

(function () {
  const { SOCIAL_DATA } = window.SocialData;

  // Country centroids (shared with breaking-news.js)
  const CENTROIDS = {
    US:{lat:38,lng:-97},   IN:{lat:20,lng:78},    CN:{lat:35,lng:105},
    BR:{lat:-10,lng:-55},  RU:{lat:60,lng:90},    JP:{lat:36,lng:138},
    DE:{lat:51,lng:10},    GB:{lat:54,lng:-2},     FR:{lat:46,lng:2},
    AU:{lat:-25,lng:134},  CA:{lat:56,lng:-106},   MX:{lat:23,lng:-102},
    NG:{lat:9,lng:8},      EG:{lat:26,lng:30},     ZA:{lat:-29,lng:25},
    KR:{lat:37,lng:128},   ID:{lat:-5,lng:120},    TR:{lat:39,lng:35},
    AR:{lat:-34,lng:-64},  PH:{lat:12,lng:122},    VN:{lat:16,lng:108},
    TH:{lat:15,lng:101},   IR:{lat:32,lng:53},     PK:{lat:30,lng:69},
    SA:{lat:24,lng:45},    UA:{lat:49,lng:32},     BD:{lat:24,lng:90},
    MY:{lat:4,lng:109},    IT:{lat:42,lng:12},     ES:{lat:40,lng:-4},
    PL:{lat:52,lng:20},    CO:{lat:4,lng:-74},     PE:{lat:-10,lng:-76},
    SE:{lat:62,lng:15},    NL:{lat:52,lng:5},      CH:{lat:47,lng:8},
    SG:{lat:1,lng:104},    TW:{lat:23,lng:121},    NZ:{lat:-41,lng:174},
  };

  // Max users in dataset (China: 1050M) used for intensity normalisation
  const MAX_USERS = 1050;

  // Build weighted pool — only countries that have a centroid
  const POOL = Object.entries(SOCIAL_DATA)
    .filter(([iso2, d]) => CENTROIDS[iso2] && d.totalUsers > 0)
    .map(([iso2, d]) => ({ iso2, name: d.name, totalUsers: d.totalUsers, platforms: d.platforms || {} }));

  const TOTAL_WEIGHT = POOL.reduce((s, c) => s + c.totalUsers, 0);

  // ── Weighted random pick ─────────────────────────────────────────────
  function pickCountry() {
    let r = Math.random() * TOTAL_WEIGHT;
    for (const c of POOL) { r -= c.totalUsers; if (r <= 0) return c; }
    return POOL[POOL.length - 1];
  }

  // ── Color = dominant platform brand color ────────────────────────────
  function getDominantColor(c) {
    const PC = window.SocialData.PLATFORM_COLORS;
    const top = Object.entries(c.platforms).sort((a, b) => b[1] - a[1])[0]?.[0];
    return PC?.[top] || '#00f5ff';
  }

  // ── Fire a burst at a country's screen position ──────────────────────
  function triggerBurst(countryOverride) {
    const globe = window.GlobeModule?.globeInstance;
    if (!globe) return;

    const c   = countryOverride || pickCountry();
    const ctr = CENTROIDS[c.iso2];
    if (!ctr) return;

    const sc = globe.getScreenCoords(ctr.lat, ctr.lng, 0.015);
    // Skip countries currently off the visible hemisphere
    if (!sc || sc.x < 20 || sc.x > window.innerWidth - 20 ||
               sc.y < 20 || sc.y > window.innerHeight - 20) return;

    const intensity = Math.min(c.totalUsers / MAX_USERS, 1);  // 0 – 1
    const numRings  = 1 + Math.floor(intensity * 2.4);        // 1 – 3 rings
    const color     = getDominantColor(c);

    // Concentric expanding rings — each staggered by 160ms
    for (let i = 0; i < numRings; i++) {
      const ring = document.createElement('div');
      ring.className = 'activity-burst';
      const size    = Math.round(28 + intensity * 74 + i * 16);
      const opacity = +(0.62 - i * 0.14).toFixed(2);
      ring.style.cssText = `
        left: ${sc.x}px; top: ${sc.y}px;
        --burst-size: ${size}px;
        --burst-color: ${color};
        --burst-opacity: ${opacity};
        animation-delay: ${i * 160}ms;
      `;
      document.body.appendChild(ring);
      setTimeout(() => ring.remove(), 2400 + i * 220);
    }

    // Bright inner flash dot
    const dot = document.createElement('div');
    dot.className = 'activity-burst-dot';
    dot.style.cssText = `left: ${sc.x}px; top: ${sc.y}px; --burst-color: ${color};`;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 800);
  }

  // ── Schedule 2–5 bursts spread over the 10-second window ─────────────
  function scheduleBursts() {
    const count = 2 + Math.floor(Math.random() * 4);
    for (let i = 0; i < count; i++) {
      setTimeout(triggerBurst, i * 900 + Math.random() * 500);
    }
  }

  // First wave after globe is likely ready; then every 10 s
  setTimeout(scheduleBursts, 5000);
  setInterval(scheduleBursts, 10000);

  window.ActivityPulse = { triggerBurst, pickCountry };
})();


