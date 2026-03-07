// ============================================================
//  Social Pulse Globe — Posts-Per-Second Header Counter
//  Methodology: published DAU × avg daily content actions / 86400
//  Sources: DataReportal 2024, platform earnings calls, SimilarWeb
// ============================================================

(function () {
  // Per-platform estimated content actions per second
  // "Actions" = posts + stories + videos + status updates (not private msgs)
  const PLATFORMS = [
    { key: 'Snapchat',  emoji: '👻', rate: 50926  },  // 4.4 B snaps/day
    { key: 'Facebook',  emoji: '📘', rate: 17361  },  // 1.5 B posts+comments/day
    { key: 'TikTok',    emoji: '🎵', rate: 12037  },  // 1.04 B videos+comments/day
    { key: 'WhatsApp',  emoji: '💬', rate: 11574  },  // 1 B status updates/day
    { key: 'WeChat',    emoji: '🧧', rate: 8680   },  // 750 M moments+comments/day
    { key: 'Instagram', emoji: '📸', rate: 6944   },  // 600 M stories+posts/day
    { key: 'X/Twitter', emoji: '🐦', rate: 5787   },  // 500 M tweets/day
    { key: 'YouTube',   emoji: '▶️', rate: 3472   },  // 300 M uploads+comments/day
    { key: 'LinkedIn',  emoji: '💼', rate: 1157   },  // 100 M posts+reactions/day
    { key: 'Pinterest', emoji: '📌', rate:  694   },  //  60 M pins/day
  ];

  const BASE_TOTAL = PLATFORMS.reduce((s, p) => s + p.rate, 0);

  // ── Mount counter HTML next to header-meta's first child ─────────────
  function init() {
    const headerMeta = document.querySelector('.header-meta');
    if (!headerMeta) return;

    const wrap = document.createElement('div');
    wrap.id = 'posts-counter';
    wrap.innerHTML = `
      <div class="pps-main">
        <span id="pps-number">0</span>
        <span class="pps-unit">POSTS/SEC</span>
      </div>
      <div class="pps-breakdown" id="pps-breakdown"></div>
    `;
    // Insert as first child so it appears at the left edge of header-meta
    headerMeta.insertBefore(wrap, headerMeta.firstChild);

    // ── Ramp-up animation on page load (0 → BASE_TOTAL in ~1.8 s) ──────
    let displayed = 0;
    const step = Math.ceil(BASE_TOTAL / 38);
    const ramp = setInterval(() => {
      displayed = Math.min(displayed + step, BASE_TOTAL);
      setCount(displayed);
      if (displayed >= BASE_TOTAL) clearInterval(ramp);
    }, 48);

    // ── Continuous ±jitter to look live after ramp ───────────────────────
    setInterval(() => {
      const jitter = Math.floor((Math.random() - 0.45) * 480);
      setCount(Math.max(BASE_TOTAL - 1200, BASE_TOTAL + jitter));
    }, 1100);

    // ── Rotating platform breakdown (2 platforms every 2.8 s) ───────────
    let idx = 0;
    PLATFORMS.forEach(p => { p._live = p.rate; });  // init live tracker
    updateBreakdown(idx);
    setInterval(() => {
      idx = (idx + 1) % PLATFORMS.length;
      updateBreakdown(idx);
    }, 2800);
  }

  function setCount(n) {
    const el = document.getElementById('pps-number');
    if (el) el.textContent = n.toLocaleString();
  }

  function updateBreakdown(idx) {
    const el = document.getElementById('pps-breakdown');
    if (!el) return;
    const a = PLATFORMS[idx % PLATFORMS.length];
    const b = PLATFORMS[(idx + 1) % PLATFORMS.length];

    // Smooth live jitter per platform
    [a, b].forEach(p => {
      const drift = Math.floor((Math.random() - 0.5) * 80);
      p._live = Math.max(p.rate - 300, Math.min(p.rate + 300, p._live + drift));
    });

    el.innerHTML =
      `<span class="pps-plat">${a.emoji} ${a.key}: <strong>${a._live.toLocaleString()}/s</strong></span>` +
      `<span class="pps-sep">·</span>` +
      `<span class="pps-plat">${b.emoji} ${b.key}: <strong>${b._live.toLocaleString()}/s</strong></span>`;
  }

  // Wait for DOM ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  window.PostsCounter = { PLATFORMS, BASE_TOTAL };
})();


