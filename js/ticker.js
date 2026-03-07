// ============================================================
//  Social Pulse Globe — Reddit Trending Ticker Module
// ============================================================

(function () {
  const SUBREDDITS = [
    { sub: "worldnews",  flag: "🌍", label: "World" },
    { sub: "technology", flag: "💻", label: "Tech" },
    { sub: "india",      flag: "🇮🇳", label: "India" },
    { sub: "europe",     flag: "🇪🇺", label: "Europe" },
    { sub: "science",    flag: "🔬", label: "Science" },
  ];

  const tickerTrack = document.getElementById("ticker-track");
  const CACHE_KEY   = "spg_ticker_cache";
  const CACHE_TTL   = 20 * 60 * 1000; // 20 minutes

  async function fetchSubreddit({ sub, flag, label }) {
    try {
      const res  = await fetch(`https://www.reddit.com/r/${sub}/hot.json?limit=6`, {
        headers: { "Accept": "application/json" },
      });
      const json = await res.json();
      return json.data.children
        .map(c => c.data)
        .filter(p => !p.stickied)
        .slice(0, 4)
        .map(p => ({ title: p.title, flag, label, url: `https://reddit.com${p.permalink}` }));
    } catch {
      return [];
    }
  }

  function buildFallbackItems() {
    return [
      { title: "Global social media usage hits new record in 2026", flag: "🌍", label: "World" },
      { title: "AI-generated content surges across all platforms",   flag: "💻", label: "Tech" },
      { title: "Short-form video dominates mobile engagement",       flag: "🌍", label: "World" },
      { title: "WhatsApp introduces encrypted group stories",        flag: "💬", label: "Tech" },
      { title: "TikTok reaches 2 billion monthly active users",      flag: "🎵", label: "World" },
      { title: "X/Twitter usage rebounds in Europe and LATAM",       flag: "🐦", label: "Tech" },
      { title: "YouTube Shorts surpasses Netflix in daily watch time",flag: "▶️", label: "Tech" },
      { title: "Instagram rolls out AI avatar DMs",                  flag: "📸", label: "Tech" },
    ];
  }

  function renderItems(items) {
    // Duplicate for seamless loop
    const all = [...items, ...items];
    tickerTrack.innerHTML = all
      .map(item => `
        <a class="ticker-item" href="${item.url || '#'}" target="_blank" rel="noopener">
          <span class="ticker-flag">${item.flag}</span>
          <span class="ticker-label">${item.label}</span>
          <span class="ticker-title">${item.title.length > 80 ? item.title.slice(0, 80) + "…" : item.title}</span>
        </a>
      `)
      .join('<span class="ticker-sep">◆</span>');

    // Set animation duration based on content width (approx)
    const dur = Math.max(30, items.length * 12);
    tickerTrack.style.animationDuration = `${dur}s`;
  }

  async function load() {
    // Check cache
    try {
      const cached = JSON.parse(localStorage.getItem(CACHE_KEY) || "null");
      if (cached && Date.now() - cached.ts < CACHE_TTL) {
        renderItems(cached.items);
        return;
      }
    } catch { /* ignore */ }

    // Fetch all subreddits in parallel
    const results = await Promise.allSettled(SUBREDDITS.map(fetchSubreddit));
    const items   = results.flatMap(r => r.status === "fulfilled" ? r.value : []);

    if (items.length < 3) {
      renderItems(buildFallbackItems());
      return;
    }

    // Shuffle a bit
    items.sort(() => Math.random() - 0.5);
    renderItems(items);

    try {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ ts: Date.now(), items }));
    } catch { /* quota */ }
  }

  window.TickerModule = { load, buildFallbackItems };
  load();
})();


