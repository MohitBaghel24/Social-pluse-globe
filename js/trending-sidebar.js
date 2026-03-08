// ============================================================
//  Social Pulse Globe — Trending Sidebar Module
//  Tabs: Trending Now · Social Buzz · Platform News
//  All data is served from SOCIAL_DATA — no external API calls.
// ============================================================

(function () {

  // ── Static global news pool (shown when country has little data) ───────
  const GLOBAL_NEWS = [
    { title: "TikTok reaches 2 billion monthly active users globally",            flag: "🌍", time: "2h ago",  query: "TikTok 2 billion users" },
    { title: "Meta expands AI features across Facebook, Instagram, WhatsApp",     flag: "🤖", time: "3h ago",  query: "Meta AI features Facebook Instagram" },
    { title: "YouTube Shorts daily views surpass Netflix worldwide",               flag: "▶️", time: "4h ago",  query: "YouTube Shorts surpass Netflix" },
    { title: "WhatsApp rolls out end-to-end encrypted group voice notes",          flag: "💬", time: "5h ago",  query: "WhatsApp encrypted voice notes" },
    { title: "LinkedIn hits 1.1 billion registered members",                       flag: "💼", time: "6h ago",  query: "LinkedIn 1 billion members" },
    { title: "Snapchat introduces AR spatial lenses on iOS 18",                    flag: "👻", time: "7h ago",  query: "Snapchat AR spatial lenses" },
    { title: "X (Twitter) tests 25,000-character long-form posts",                 flag: "✕",  time: "8h ago",  query: "X Twitter long form posts" },
    { title: "Instagram Reels ad revenue exceeds YouTube Shorts for first time",   flag: "📸", time: "9h ago",  query: "Instagram Reels ad revenue YouTube Shorts" },
    { title: "WeChat Pay expands to 12 new countries in Africa and SE Asia",       flag: "⊕", time: "10h ago", query: "WeChat Pay expansion Africa" },
    { title: "Pinterest launches AI-powered shopping curation engine",             flag: "📌", time: "11h ago", query: "Pinterest AI shopping" },
    { title: "Telegram Premium subscribers top 10 million worldwide",              flag: "✈️", time: "12h ago", query: "Telegram Premium 10 million" },
    { title: "Short-form video drives 68% of all mobile social engagement",        flag: "📱", time: "14h ago", query: "short-form video mobile social media" },
    { title: "Social commerce GMV hits $1.3 trillion — led by TikTok Shop",        flag: "🛍️", time: "16h ago", query: "social commerce TikTok Shop GMV" },
    { title: "Gen Z spends avg 8.5 h/day on social apps — new DataReportal",       flag: "📊", time: "18h ago", query: "Gen Z social media hours DataReportal" },
    { title: "BeReal pivots to social aggregator after acquisition",               flag: "📷", time: "20h ago", query: "BeReal social aggregator" },
    { title: "Discord hits 500M registered accounts, monetises communities",        flag: "🎮", time: "22h ago", query: "Discord 500 million accounts" },
  ];

  // ── Helper: build a Google News search URL ──────────────────────────
  function newsUrl(query) {
    return `https://news.google.com/search?q=${encodeURIComponent(query)}&hl=en`;
  }

  // ── State ─────────────────────────────────────────────────────────────
  let currentIso2  = null;
  let currentData  = null;
  let activeTab    = 'stats';

  // ── Tab wiring ────────────────────────────────────────────────────────
  document.querySelectorAll('.ptab').forEach(btn => {
    btn.addEventListener('click', () => switchTab(btn.dataset.tab));
  });

  function switchTab(tabId) {
    activeTab = tabId;
    document.querySelectorAll('.ptab').forEach(b =>
      b.classList.toggle('ptab--active', b.dataset.tab === tabId));
    document.querySelectorAll('.panel-tab-pane').forEach(p =>
      p.classList.toggle('active', p.id === 'tab-' + tabId));

    if (tabId === 'trending') loadTrending();
    if (tabId === 'buzz')     loadBuzz();
    if (tabId === 'platform') loadPlatform();
  }

  // ── Tab 1: Trending Now — from SOCIAL_DATA.trending + global pool ──────
  function loadTrending() {
    const list = document.getElementById('tn-list');
    const load = document.getElementById('tn-loading');
    if (!list) return;
    if (load) load.style.display = 'none';
    list.innerHTML = '';

    const countryName = currentData?.name || '';

    // Country trending topics first (link to Google News with country context)
    const countryTopics = (currentData?.trending || []).map((t, i) => ({
      title: t,
      flag: '🔥',
      time: `${(i + 1) * 2}m ago`,
      local: true,
      url: newsUrl(`${t} ${countryName}`),
    }));
    const globalItems = GLOBAL_NEWS.slice(0, Math.max(0, 10 - countryTopics.length))
      .map(item => ({ ...item, local: false, url: newsUrl(item.query || item.title) }));
    const items = [...countryTopics, ...globalItems];

    items.forEach(item => {
      const card = document.createElement('a');
      card.className = 'tn-card tn-card--link';
      card.href = item.url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.title = 'Open in Google News';
      card.innerHTML = `
        <div class="tn-card-body">
          <div class="tn-content">
            <div class="tn-title" style="color:${item.local ? 'var(--cyan)' : 'var(--text)'}">
              ${item.flag} ${item.title}
              <span class="tn-open-icon">↗</span>
            </div>
            <div class="tn-meta">
              <span class="tn-tag">${item.local ? countryName || 'Local' : 'Global'}</span>
              <span class="tn-time">${item.time}</span>
              <span class="tn-source-badge">Google News</span>
            </div>
          </div>
        </div>`;
      list.appendChild(card);
    });

    if (!items.length) {
      list.innerHTML = '<div class="tab-error">No trending data available for this region.</div>';
    }
  }

  // ── Tab 2: Social Buzz — pills from country trending + sparklines ───────
  function loadBuzz() {
    const pillsEl  = document.getElementById('buzz-pills');
    const sparksEl = document.getElementById('buzz-sparklines');
    if (!pillsEl) return;

    // Build pill list from country trending + platform names
    let terms = [...(currentData?.trending || [])];
    if (currentData?.platforms) {
      Object.keys(currentData.platforms)
        .slice(0, 5)
        .forEach(p => { if (!terms.includes(p)) terms.push(p); });
    }
    if (!terms.length) terms = ['#Technology', '#News', '#Economy', '#Sports', '#Culture'];

    pillsEl.innerHTML = '';
    terms.slice(0, 14).forEach(t => {
      const pill = document.createElement('span');
      pill.className = 'buzz-pill';
      pill.textContent = t.startsWith('#') ? t : '#' + t;
      // Link to a Google search instead of Trends API
      pill.style.cursor = 'pointer';
      pill.addEventListener('click', () => {
        const q = encodeURIComponent(t.replace(/^#/, ''));
        window.open(`https://www.google.com/search?q=${q}+social+media`, '_blank', 'noopener');
      });
      pillsEl.appendChild(pill);
    });

    sparksEl.innerHTML = '';
    terms.slice(0, 8).forEach(t => {
      const wrap = document.createElement('div');
      wrap.className = 'buzz-spark-row';
      const label = document.createElement('span');
      label.className = 'buzz-spark-label';
      label.textContent = t.length > 20 ? t.slice(0, 18) + '…' : t;
      const canvas = document.createElement('canvas');
      canvas.className = 'buzz-spark-canvas';
      canvas.width  = 90;
      canvas.height = 28;
      wrap.appendChild(label);
      wrap.appendChild(canvas);
      sparksEl.appendChild(wrap);
      drawSparkline(canvas);
    });
  }

  function drawSparkline(canvas) {
    const ctx = canvas.getContext('2d');
    const w = canvas.width, h = canvas.height;
    const pts = Array.from({ length: 14 }, (_, i) => {
      const base  = 0.3 + Math.random() * 0.4;
      const spike = i > 10 ? base + Math.random() * 0.5 : base;
      return Math.min(1, spike);
    });
    const grad = ctx.createLinearGradient(0, 0, w, 0);
    grad.addColorStop(0, 'rgba(0,245,255,0.2)');
    grad.addColorStop(1, 'rgba(255,107,53,0.85)');
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    pts.forEach((v, i) => {
      const x = (i / (pts.length - 1)) * w;
      const y = h - v * (h - 4) - 2;
      i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
    });
    ctx.stroke();
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, h);
    fill.addColorStop(0, 'rgba(255,107,53,0.25)');
    fill.addColorStop(1, 'rgba(0,245,255,0.02)');
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // ── Tab 3: Platform News — platform breakdown from SOCIAL_DATA ──────────
  const PLATFORM_URLS = {
    Facebook: 'https://www.facebook.com', Instagram: 'https://www.instagram.com',
    TikTok: 'https://www.tiktok.com', YouTube: 'https://www.youtube.com',
    WhatsApp: 'https://www.whatsapp.com', Twitter: 'https://x.com',
    Snapchat: 'https://www.snapchat.com', LinkedIn: 'https://www.linkedin.com',
    Pinterest: 'https://www.pinterest.com', WeChat: 'https://www.wechat.com',
    Telegram: 'https://telegram.org', Reddit: 'https://www.reddit.com',
    Discord: 'https://discord.com', VK: 'https://vk.com',
    Line: 'https://line.me', Weibo: 'https://weibo.com',
  };

  function loadPlatform() {
    const list = document.getElementById('pn-list');
    const load = document.getElementById('pn-loading');
    if (!list) return;
    if (load) load.style.display = 'none';
    list.innerHTML = '';

    if (!currentData?.platforms) {
      list.innerHTML = '<div class="tab-error">No platform data for this country.</div>';
      return;
    }

    const { PLATFORM_COLORS } = window.SocialData;
    const sorted = Object.entries(currentData.platforms)
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);

    const total = sorted.reduce((s, [, v]) => s + v, 0);

    sorted.forEach(([platform, users], i) => {
      const color = PLATFORM_COLORS[platform] || '#22D3EE';
      const pct   = Math.round((users / total) * 100);
      const url   = PLATFORM_URLS[platform] || `https://www.google.com/search?q=${encodeURIComponent(platform)}+social+media`;
      const card  = document.createElement('a');
      card.className = 'tn-card tn-card--link';
      card.href = url;
      card.target = '_blank';
      card.rel = 'noopener noreferrer';
      card.style.cssText = `border-left: 3px solid ${color}; margin-bottom: 6px; display: block;`;
      card.innerHTML = `
        <div class="tn-card-body" style="padding: 8px 10px;">
          <div class="tn-content">
            <div class="tn-title" style="color:${color}; font-size:0.82rem;">
              #${i + 1} ${platform}
              <span class="tn-open-icon">↗</span>
            </div>
            <div class="tn-meta" style="margin-top:4px;">
              <span class="tn-upvotes" style="color:${color}">${users}M users</span>
              <span class="tn-tag">${pct}% share</span>
            </div>
            <div style="height:4px;border-radius:2px;margin-top:6px;background:rgba(255,255,255,0.08);">
              <div style="height:100%;width:${pct}%;background:${color};border-radius:2px;"></div>
            </div>
          </div>
        </div>`;
      list.appendChild(card);
    });
  }

  // ── Public ────────────────────────────────────────────────────────────
  function load(iso2, data) {
    currentIso2 = iso2;
    currentData = data;
    // Always reset to stats tab on new country open
    switchTab('stats');
  }

  function reset() {
    currentIso2 = null;
    currentData = null;
  }

  window.TrendingSidebar = { load, reset, switchTab };
})();
