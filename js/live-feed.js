// ============================================================
//  Social Pulse Globe — Live Feed Panel
//  Enterprise design: replaces bottom ticker with a sleek
//  fade-in feed panel (bottom-right, glassmorphism).
// ============================================================

(function initLiveFeed() {
  const container = document.getElementById('lf-items');
  const countEl   = document.getElementById('lf-count');
  if (!container) return;

  // ── Static seed headlines (displayed instantly) ───────────────────
  const SEED_ITEMS = [
    { text: 'Meta Q1 revenue beats estimates — AI ad targeting drives record CPMs',         time: 'just now' },
    { text: 'India surpasses 950M social media users — WhatsApp dominant in Tier-3 cities', time: '2m ago'   },
    { text: 'YouTube Shorts hits 100B daily views — monetisation expanded to 90 countries',  time: '5m ago'   },
    { text: 'TikTok US ban enforcement paused — 180M users remain active',                   time: '8m ago'   },
    { text: 'LinkedIn Premium AI coaching reaches 50M paid subscribers globally',             time: '11m ago'  },
  ];

  // ── Live headlines pulled from Reddit ────────────────────────────
  const SUBREDDITS = [
    { sub: 'worldnews',  label: '🌍' },
    { sub: 'technology', label: '💻' },
    { sub: 'science',    label: '🔬' },
  ];

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

  // ── Fetch live headlines from Reddit ──────────────────────────────
  async function fetchRedditHeadlines() {
    try {
      const src = SUBREDDITS[Math.floor(Math.random() * SUBREDDITS.length)];
      const res  = await fetch(`https://www.reddit.com/r/${src.sub}/hot.json?limit=10`, {
        headers: { Accept: 'application/json' },
      });
      if (!res.ok) return [];
      const json = await res.json();
      return json.data.children
        .map(c => c.data)
        .filter(p => !p.stickied && p.title && p.title.length > 20)
        .slice(0, 3)
        .map(p => `${src.label} ${p.title}`);
    } catch {
      return [];
    }
  }

  // ── Periodic live updates ─────────────────────────────────────────
  let redditQueue = [];

  async function refreshQueue() {
    const headlines = await fetchRedditHeadlines();
    if (headlines.length) redditQueue = headlines;
  }

  function pushLiveItem() {
    if (redditQueue.length > 0) {
      const text = redditQueue.shift();
      prependItem(text, 'just now');
    }
  }

  // Initial fetch then drip one item every ~8 seconds
  refreshQueue();
  setInterval(pushLiveItem, 8000);
  setInterval(refreshQueue, 5 * 60 * 1000); // refresh pool every 5 min
})();
