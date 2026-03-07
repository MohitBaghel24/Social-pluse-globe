// ============================================================
//  Social Pulse Globe — Trending Sidebar Module
//  Tabs: Trending Now · Social Buzz · Platform News
// ============================================================

(function () {

  // ── Country → subreddit map ───────────────────────────────────────────
  const SUBREDDITS = {
    US:'news', IN:'india', BR:'brazil', MX:'mexico', GB:'unitedkingdom',
    DE:'germany', FR:'france', IT:'italy', AU:'australia', CA:'canada',
    RU:'russia', JP:'japan', KR:'korea', CN:'China', ID:'indonesia',
    PH:'Philippines', VN:'vietnam', TH:'thailand', TR:'turkey',
    SA:'saudiarabia', NG:'nigeria', EG:'egypt', ZA:'southafrica',
    AR:'argentina', CO:'colombia', UA:'ukraine', PK:'pakistan',
    BD:'bangladesh', MY:'malaysia', PE:'peru', PL:'poland',
    SE:'sweden', NL:'netherlands', ES:'spain', SG:'singapore',
    NZ:'newzealand', TW:'taiwan', IR:'Iran', UA:'ukraine',
  };

  // ── State ─────────────────────────────────────────────────────────────
  let currentIso2  = null;
  let currentData  = null;
  let activeTab    = 'stats';
  let tnLoaded     = false;
  let pnLoaded     = false;
  let buzzLoaded   = false;
  const cache      = {};   // iso2 → {trending, buzz, platform}

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

    if (tabId === 'trending' && !tnLoaded) loadTrending();
    if (tabId === 'buzz'     && !buzzLoaded) loadBuzz();
    if (tabId === 'platform' && !pnLoaded) loadPlatform();
  }

  // ── Utilities ─────────────────────────────────────────────────────────
  function timeAgo(utcSeconds) {
    const diff = Math.floor(Date.now() / 1000) - utcSeconds;
    if (diff < 60)   return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400)return `${Math.floor(diff/3600)}h ago`;
    return `${Math.floor(diff/86400)}d ago`;
  }

  function isBreaking(utcSeconds) {
    return (Date.now() / 1000 - utcSeconds) < 3600;
  }

  function fmtUpvotes(n) {
    if (n >= 1000) return (n/1000).toFixed(1) + 'k';
    return String(n);
  }

  function domainOf(url) {
    try { return new URL(url).hostname.replace('www.', ''); }
    catch { return 'reddit.com'; }
  }

  function faviconUrl(url) {
    try { const u = new URL(url); return `https://www.google.com/s2/favicons?sz=16&domain=${u.hostname}`; }
    catch { return ''; }
  }

  // ── Tab 1: Trending Now (Reddit) ──────────────────────────────────────
  async function loadTrending() {
    tnLoaded = true;
    const list = document.getElementById('tn-list');
    const load = document.getElementById('tn-loading');
    if (!list) return;
    if (load) load.style.display = 'block';
    list.innerHTML = '';

    const key = currentIso2;
    if (cache[key]?.trending) {
      renderCards(list, cache[key].trending);
      if (load) load.style.display = 'none';
      return;
    }

    const sub = SUBREDDITS[key] || 'worldnews';
    const url = `https://www.reddit.com/r/${sub}/hot.json?limit=15&raw_json=1`;

    try {
      const res  = await fetch(url);
      const json = await res.json();
      const posts = (json?.data?.children || []).map(c => c.data).filter(p => !p.stickied);
      cache[key] = cache[key] || {};
      cache[key].trending = posts;
      renderCards(list, posts);
    } catch (e) {
      list.innerHTML = `<div class="tab-error">⚠ Could not load Reddit feed for r/${sub}. Check network.</div>`;
    }
    if (load) load.style.display = 'none';
  }

  function renderCards(container, posts) {
    container.innerHTML = '';
    if (!posts.length) {
      container.innerHTML = '<div class="tab-error">No posts found.</div>';
      return;
    }
    posts.forEach(p => {
      const breaking = isBreaking(p.created_utc);
      const hot      = p.ups >= 10000;
      const thumb    = p.thumbnail && p.thumbnail.startsWith('http') ? p.thumbnail : null;
      const domain   = domainOf(p.url);
      const fav      = faviconUrl(p.url);

      const card = document.createElement('div');
      card.className = 'tn-card';
      card.innerHTML = `
        ${breaking ? '<span class="tn-breaking">BREAKING</span>' : ''}
        <div class="tn-card-body">
          ${thumb ? `<img class="tn-thumb" src="${thumb}" loading="lazy" alt="" />` : ''}
          <div class="tn-content">
            <a class="tn-title" href="${p.url}" target="_blank" rel="noopener">${p.title}</a>
            <div class="tn-meta">
              <span class="tn-source">
                ${fav ? `<img src="${fav}" width="12" height="12" alt="" style="vertical-align:middle;margin-right:3px">` : ''}
                ${domain}
              </span>
              <span class="tn-upvotes">${hot ? '🔥' : '▲'} ${fmtUpvotes(p.ups)}</span>
              <span class="tn-time">${timeAgo(p.created_utc)}</span>
              <span class="tn-tag">Reddit</span>
            </div>
          </div>
        </div>`;
      card.addEventListener('click', e => {
        if (!e.target.closest('a')) window.open(p.permalink ? 'https://reddit.com'+p.permalink : p.url, '_blank');
      });
      container.appendChild(card);
    });
  }

  // ── Tab 2: Social Buzz (Google Trends RSS → fallback) ─────────────────
  async function loadBuzz() {
    buzzLoaded = true;
    const pillsEl  = document.getElementById('buzz-pills');
    const sparksEl = document.getElementById('buzz-sparklines');
    if (!pillsEl) return;

    const key = currentIso2;

    // Try Google Trends RSS (often blocked by CORS — fallback gracefully)
    let terms = [];
    try {
      const rss = await fetch(
        `https://trends.google.com/trends/trendingsearches/daily/rss?geo=${key}&hl=en`,
        { signal: AbortSignal.timeout(4000) }
      );
      const txt  = await rss.text();
      const matches = [...txt.matchAll(/<title><!\[CDATA\[(.*?)\]\]><\/title>/g)];
      terms = matches.slice(1, 14).map(m => m[1]);
    } catch (_) {}

    // Fallback: synthesise from SOCIAL_DATA trending + country name + platform names
    if (!terms.length && currentData?.trending) {
      terms = currentData.trending.slice(0,5).concat(
        Object.keys(currentData.platforms || {}).slice(0,5)
      );
    }
    if (!terms.length) terms = ['#Technology', '#News', '#Economy', '#Sports', '#Culture'];

    // Render pills
    pillsEl.innerHTML = '';
    terms.forEach(t => {
      const pill = document.createElement('a');
      pill.className = 'buzz-pill';
      pill.href = `https://trends.google.com/trends/explore?q=${encodeURIComponent(t)}&geo=${key}`;
      pill.target = '_blank';
      pill.rel = 'noopener';
      pill.textContent = t.startsWith('#') ? t : '#' + t;
      pillsEl.appendChild(pill);
    });

    // Render sparklines
    sparksEl.innerHTML = '';
    terms.slice(0, 8).forEach(t => {
      const wrap = document.createElement('div');
      wrap.className = 'buzz-spark-row';
      const label = document.createElement('span');
      label.className = 'buzz-spark-label';
      label.textContent = t.length > 20 ? t.slice(0,18)+'…' : t;
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
    const pts = Array.from({length: 14}, (_, i) => {
      const base = 0.3 + Math.random() * 0.4;
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

    // Fill area under line
    ctx.lineTo(w, h); ctx.lineTo(0, h); ctx.closePath();
    const fill = ctx.createLinearGradient(0, 0, 0, h);
    fill.addColorStop(0, 'rgba(255,107,53,0.25)');
    fill.addColorStop(1, 'rgba(0,245,255,0.02)');
    ctx.fillStyle = fill;
    ctx.fill();
  }

  // ── Tab 3: Platform News (Reddit country sub, "top" posts) ────────────
  async function loadPlatform() {
    pnLoaded = true;
    const list = document.getElementById('pn-list');
    const load = document.getElementById('pn-loading');
    if (!list) return;
    if (load) load.style.display = 'block';
    list.innerHTML = '';

    const key = currentIso2;
    if (cache[key]?.platform) {
      renderCards(list, cache[key].platform);
      if (load) load.style.display = 'none';
      return;
    }

    const sub = SUBREDDITS[key] || 'worldnews';
    const url = `https://www.reddit.com/r/${sub}/top.json?limit=12&t=day&raw_json=1`;
    try {
      const res  = await fetch(url);
      const json = await res.json();
      const posts = (json?.data?.children || []).map(c => c.data).filter(p => !p.stickied);
      cache[key] = cache[key] || {};
      cache[key].platform = posts;
      renderCards(list, posts);
    } catch {
      list.innerHTML = `<div class="tab-error">⚠ Could not load top posts for r/${sub}.</div>`;
    }
    if (load) load.style.display = 'none';
  }

  // ── Public ────────────────────────────────────────────────────────────
  function load(iso2, data) {
    currentIso2 = iso2;
    currentData = data;
    tnLoaded    = false;
    pnLoaded    = false;
    buzzLoaded  = false;
    // Always reset to stats tab on new country open
    switchTab('stats');
  }

  function reset() {
    currentIso2 = null;
    currentData = null;
  }

  window.TrendingSidebar = { load, reset, switchTab };
})();


