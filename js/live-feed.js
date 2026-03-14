// ============================================================
//  Social Pulse Globe — Live Feed Panel
//  Glassmorphism feed panel (bottom-right). No external APIs.
// ============================================================

(function initLiveFeed() {
  const container = document.getElementById('lf-items');
  const countEl   = document.getElementById('lf-count');
  if (!container || !countEl) return; // Module requires both DOM elements

  // ── Static seed headlines (displayed instantly) ───────────────────
  const SEED_ITEMS = [
    { text: 'Meta Q1 revenue beats estimates — AI ad targeting drives record CPMs',         time: 'just now' },
    { text: 'India surpasses 950M social media users — WhatsApp dominant in Tier-3 cities', time: '2m ago'   },
    { text: 'YouTube Shorts hits 100B daily views — monetisation expanded to 90 countries',  time: '5m ago'   },
    { text: 'TikTok US ban enforcement paused — 180M users remain active',                   time: '8m ago'   },
    { text: 'LinkedIn Premium AI coaching reaches 50M paid subscribers globally',             time: '11m ago'  },
  ];

  // ── Live headlines pulled from a static rotating pool ────────────
  let totalCount = 0;

  function createItem(text, time, animate = true) {
    const el = document.createElement('div');
    el.className = 'lf-item';
    if (!animate) el.style.animation = 'none';
    el.innerHTML = `
      <div class="lf-item-dot"></div>
      <div class="lf-item-text">${escapeHtml(text)}</div>
      <div class="lf-item-time">${escapeHtml(time)}</div>`;
    return el;
  }

  function escapeHtml(s) {
    return s.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
  }

  function updateCount() {
    if (countEl) countEl.textContent = totalCount + ' update' + (totalCount === 1 ? '' : 's');
  }

  function prependItem(text, time) {
    const el = createItem(text, time, true);
    container.prepend(el);
    totalCount++;
    // Refresh age labels on older items
    const times = ['just now', '1m ago', '2m ago', '4m ago', '7m ago', '10m ago'];
    Array.from(container.children).forEach((c, i) => {
      const t = c.querySelector('.lf-item-time');
      if (t && times[i]) t.textContent = times[i];
    });
    // Cap at 6 visible items
    while (container.children.length > 6) container.lastChild.remove();
    updateCount();
  }

  // ── Seed with static items (no animation delay) ──────────────────
  SEED_ITEMS.forEach(({ text, time }) => {
    const el = createItem(text, time, false);
    container.appendChild(el);
    totalCount++;
  });
  updateCount();

  // ── Rotating static news pool (no external API calls) ─────────────
  const ROLLING_POOL = [
    'TikTok Shop surpasses $500B GMV in South-East Asia — Q1 2026 report',
    'Meta AI model now powers 40% of ad targeting on Facebook & Instagram',
    'X (Twitter) daily active monetisable users up 22% YoY — Musk memo',
    'YouTube expands 4K HDR Shorts to creators in 50 new markets',
    'WhatsApp Business premium tier hits 200M paying SME subscribers',
    'Snap AR glasses OS boots independently — dev preview released today',
    'Pinterest introduces shoppable AR try-on for fashion & beauty brands',
    'LinkedIn time-on-app grows 34% driven by AI career coaching feature',
    'WeChat introduces blockchain identity wallet for Chinese nationals',
    'Telegram opens P2P ad network to all public channels with >1k subs',
    'BeReal acquired by tech conglomerate — pivots to social aggregator',
    'Discord launches Clips — short-form highlight reels for gaming content',
    'Twitch introduces AI-generated highlights for past broadcast clips',
    'Reddit IPO stock up 18% after record Q4 2025 ad revenue beat',
    'Threads reaches 250M MAU — Meta confirms cross-posting with Instagram',
    'ByteDance files for secondary listing on Hong Kong exchange — sources',
    'Amazon acquires short-video startup Flip for $800M — WSJ',
    'Signal announces paid Premium tier for power-user features',
    'Global social media ad spend to reach $395B in 2026 — GroupM forecast',
    'Apple rolls out ActivityPub support in Messages — open social push begins',
  ];
  let poolIdx = 0;

  function pushLiveItem() {
    const text = ROLLING_POOL[poolIdx % ROLLING_POOL.length];
    poolIdx++;
    prependItem(text, 'just now');
  }

  // Drip one item every ~8 seconds
  setInterval(pushLiveItem, 8000);
})();
