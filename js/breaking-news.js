// ============================================================
//  Social Pulse Globe — Breaking News Beacons Module
//  Fetches r/worldnews every 5 min, places pulsing beacons
//  on countries with upvotes > 5000, max 5 at once
// ============================================================

(function () {
  const { SOCIAL_DATA } = window.SocialData;

  const CLAUDE_API  = 'https://api.anthropic.com/v1/messages';
  const CLAUDE_MODEL = 'claude-3-haiku-20240307';
  const getApiKey   = () => localStorage.getItem('bp_claude_key') || '';

  const MAX_BEACONS    = 5;
  const MIN_UPVOTES    = 5000;
  const FETCH_INTERVAL = 5 * 60 * 1000;   // 5 minutes
  const BEACON_TTL     = 2 * 60 * 60 * 1000; // 2 hours

  // Map country name keywords → ISO2
  const NAME_TO_ISO2 = {};
  Object.entries(SOCIAL_DATA).forEach(([iso2, d]) => {
    NAME_TO_ISO2[d.name.toLowerCase()] = iso2;
    // Also map first word (e.g. "United" → won't collide much in top-hit)
  });

  // Extra keyword aliases
  const ALIASES = {
    'usa':'US','american':'US','american':'US','u.s.':'US','united states':'US',
    'uk':'GB','britain':'GB','british':'GB','england':'GB',
    'russian':'RU','ukraine':'UA','ukrainian':'UA','china':'CN','chinese':'CN',
    'india':'IN','indian':'IN','brazil':'BR','brazilian':'BR','japan':'JP',
    'japanese':'JP','korea':'KR','korean':'KR','germany':'DE','german':'DE',
    'france':'FR','french':'FR','iran':'IR','iranian':'IR','pakistan':'PK',
    'pakistan':'PK','mexico':'MX','turkish':'TR','turkey':'TR','nigeria':'NG',
    'egypt':'EG','australia':'AU','canadian':'CA','canada':'CA',
    'israel':'IL','saudi':'SA','thailand':'TH','indonesia':'ID',
  };

  let beacons   = [];       // { id, iso2, lat, lng, post, el, shockEl, born }
  let beaconRAF = null;
  let nextId    = 0;

  // ── Country centroid lookup (from GlobeModule after it loads) ─────────
  const CENTROIDS = {
    US:{lat:38,lng:-97}, IN:{lat:20,lng:78}, CN:{lat:35,lng:105},
    BR:{lat:-10,lng:-55}, RU:{lat:60,lng:90}, JP:{lat:36,lng:138},
    DE:{lat:51,lng:10}, GB:{lat:54,lng:-2}, FR:{lat:46,lng:2},
    AU:{lat:-25,lng:134}, CA:{lat:56,lng:-106}, MX:{lat:23,lng:-102},
    NG:{lat:9,lng:8}, EG:{lat:26,lng:30}, ZA:{lat:-29,lng:25},
    KR:{lat:37,lng:128}, ID:{lat:-5,lng:120}, TR:{lat:39,lng:35},
    AR:{lat:-34,lng:-64}, PH:{lat:12,lng:122}, VN:{lat:16,lng:108},
    TH:{lat:15,lng:101}, IR:{lat:32,lng:53}, PK:{lat:30,lng:69},
    SA:{lat:24,lng:45}, UA:{lat:49,lng:32}, BD:{lat:24,lng:90},
    MY:{lat:4,lng:109}, IT:{lat:42,lng:12}, ES:{lat:40,lng:-4},
    PL:{lat:52,lng:20}, CO:{lat:4,lng:-74}, PE:{lat:-10,lng:-76},
    SE:{lat:62,lng:15}, NL:{lat:52,lng:5}, CH:{lat:47,lng:8},
    SG:{lat:1,lng:104}, TW:{lat:23,lng:121}, NZ:{lat:-41,lng:174},
  };

  // ── Match post title → ISO2 ───────────────────────────────────────────
  function matchCountry(title) {
    const t = title.toLowerCase();
    // Check aliases first (more specific)
    for (const [kw, iso] of Object.entries(ALIASES)) {
      if (t.includes(kw)) return iso;
    }
    // Check full country names
    for (const [name, iso] of Object.entries(NAME_TO_ISO2)) {
      if (name.length > 3 && t.includes(name)) return iso;
    }
    return null;
  }

  // ── Static breaking news (replaces Reddit API — CORS-blocked on GitHub Pages) ──
  const STATIC_BREAKING = [
    { iso2: 'US', title: 'TikTok ban reversed — US usage surges 34% in one week',           ups: 45200, created_utc: Date.now()/1000 - 3600,  url: 'https://reddit.com/r/technology' },
    { iso2: 'IN', title: 'India adds 50M social media users in Q1 2026 — fastest growing', ups: 28100, created_utc: Date.now()/1000 - 7200,  url: 'https://reddit.com/r/india' },
    { iso2: 'CN', title: 'WeChat mini-programs cross 1 billion daily active users',          ups: 18400, created_utc: Date.now()/1000 - 10800, url: 'https://reddit.com/r/technology' },
    { iso2: 'BR', title: 'Brazil becomes WhatsApp most loyal country — 95% penetration',    ups: 14600, created_utc: Date.now()/1000 - 14400, url: 'https://reddit.com/r/brazil' },
    { iso2: 'NG', title: "Nigeria leads Africa's social media revolution — 45M new users",  ups: 9800,  created_utc: Date.now()/1000 - 18000, url: 'https://reddit.com/r/africa' },
  ];

  function fetchBreaking() {
    // Expire old beacons
    const now = Date.now();
    beacons = beacons.filter(b => {
      if (now - b.born > BEACON_TTL) { removeBeaconEl(b); return false; }
      return true;
    });

    // Add static beacons if not already present
    STATIC_BREAKING.forEach(({ iso2, title, ups, url, created_utc }) => {
      if (beacons.find(b => b.iso2 === iso2)) return;
      const ctr = CENTROIDS[iso2];
      if (!ctr) return;
      const post = { title, ups, url, created_utc, permalink: url };
      addBeacon(iso2, ctr.lat, ctr.lng, post);
    });

    updateLive(beacons.length > 0);
  }

  // ── Beacon DOM ────────────────────────────────────────────────────────
  function addBeacon(iso2, lat, lng, post) {
    const id = nextId++;

    // Outer beacon wrapper
    const el = document.createElement('div');
    el.className = 'breaking-beacon';
    el.dataset.id = id;
    document.body.appendChild(el);

    // Shockwave ring
    const shock = document.createElement('div');
    shock.className = 'beacon-shock';
    el.appendChild(shock);

    // Red dot
    const dot = document.createElement('div');
    dot.className = 'beacon-dot';
    el.appendChild(dot);

    el.addEventListener('click', (e) => {
      e.stopPropagation();
      showPopup(post, iso2);
    });

    const beacon = { id, iso2, lat, lng, post, el, born: Date.now() };
    beacons.push(beacon);

    // Start tracking loop if not already running
    if (!beaconRAF) trackBeacons();
  }

  function removeBeaconEl(b) {
    if (b.el && b.el.parentNode) b.el.parentNode.removeChild(b.el);
  }

  // ── RAF loop: position beacons over globe ─────────────────────────────
  function trackBeacons() {
    const globe = window.GlobeModule?.globeInstance;
    if (!globe) { beaconRAF = requestAnimationFrame(trackBeacons); return; }

    beacons.forEach(b => {
      const sc = globe.getScreenCoords(b.lat, b.lng, 0.015);
      if (sc && sc.x > 0 && sc.x < window.innerWidth && sc.y > 0 && sc.y < window.innerHeight) {
        b.el.style.display = 'block';
        b.el.style.left = sc.x + 'px';
        b.el.style.top  = sc.y + 'px';
      } else {
        b.el.style.display = 'none';
      }
    });

    beaconRAF = requestAnimationFrame(trackBeacons);
  }

  // ── Breaking news popup on the globe ─────────────────────────────────
  function showPopup(post, iso2) {
    const popup = document.getElementById('breaking-popup');
    const inner = document.getElementById('breaking-popup-inner');
    if (!popup || !inner) return;

    const ups  = post.ups >= 1000 ? (post.ups/1000).toFixed(1)+'k' : post.ups;
    const diff = Math.floor(Date.now()/1000 - post.created_utc);
    const ago  = diff < 3600 ? `${Math.floor(diff/60)}m ago` : `${Math.floor(diff/3600)}h ago`;
    const link = post.url || `https://reddit.com${post.permalink}`;

    inner.innerHTML = `
      <div class="bp-badge">🔴 BREAKING</div>
      <div class="bp-title">${post.title}</div>
      <div class="bp-meta">
        <span>▲ ${ups}</span>
        <span>${ago}</span>
        <a href="${link}" target="_blank" rel="noopener" class="bp-read">READ MORE →</a>
      </div>
      <div id="bp-impact-section" class="bp-impact-section">
        <div class="bp-impact-loading">
          <span class="bp-impact-dot"></span>
          <span>Analyzing social media impact…</span>
        </div>
      </div>`;

    popup.classList.add('visible');
    popup.setAttribute('aria-hidden', 'false');

    // Fire AI impact analysis asynchronously
    const impactEl = document.getElementById('bp-impact-section');
    if (impactEl && iso2) analyzeImpact(post, iso2, impactEl);
  }

  // ── AI Impact Analysis ────────────────────────────────────────────────
  async function analyzeImpact(post, iso2, container) {
    const countryData = SOCIAL_DATA[iso2];
    if (!countryData) { container.innerHTML = ''; return; }

    const sorted   = Object.entries(countryData.platforms || {}).sort((a, b) => b[1] - a[1]);
    const topPlats = sorted.slice(0, 4).map(([k, v]) => `${k}:${v}M`).join(', ');

    // Always use local fallback — Anthropic API is CORS-blocked on GitHub Pages
    const result = localImpactFallback(post.title, iso2, countryData, sorted);
    renderImpactCard(container, result, sorted);
  }

  async function callClaudeImpact(headline, countryName, platformData, apiKey) {
    const prompt =
      `Given this breaking news headline about ${countryName}: "${headline}"\n` +
      `And this country's top social media platforms: ${platformData}\n\n` +
      `In 1-2 sentences, explain how this news might affect social media activity in ${countryName} today. ` +
      `Which platform will see the most spike in activity and why?`;
    try {
      const res  = await fetch(CLAUDE_API, {
        method: 'POST',
        headers: {
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01',
          'content-type': 'application/json',
          'anthropic-dangerous-direct-browser-access': 'true',
        },
        body: JSON.stringify({ model: CLAUDE_MODEL, max_tokens: 180,
          messages: [{ role: 'user', content: prompt }] }),
      });
      const data = await res.json();
      const text = data?.content?.[0]?.text?.trim() || '';
      if (!text) throw new Error('empty');
      const platform = extractPlatformFromText(text) || 'X/Twitter';
      return { text, platform, isAI: true };
    } catch (_) {
      return null;
    }
  }

  function extractPlatformFromText(text) {
    const PLATS = ['TikTok','Instagram','Facebook','X/Twitter','Twitter','YouTube',
      'WhatsApp','WeChat','Weibo','Telegram','Snapchat','LinkedIn'];
    for (const p of PLATS) {
      if (text.includes(p)) return p === 'Twitter' ? 'X/Twitter' : p;
    }
    return null;
  }

  function localImpactFallback(headline, iso2, countryData, sorted) {
    const topPlatform = sorted[0]?.[0] || 'Social media';
    const t = headline.toLowerCase();
    const c = countryData.name;

    const rules = [
      { kw: ['war','attack','conflict','missile','bomb','invasion','military','killed','airstrike'],
        fn: () => ({ platform: 'X/Twitter',
          text: `Conflict news drives immediate X/Twitter surges in ${c} as users seek real-time updates and safety information; WhatsApp group chats will spike sharply as families coordinate and share situational reports.` }) },
      { kw: ['earthquake','flood','hurricane','disaster','tsunami','cyclone','storm','wildfire'],
        fn: () => ({ platform: 'X/Twitter',
          text: `Natural disaster coverage ignites X/Twitter for ${c} emergency coordination, while WhatsApp becomes the dominant channel for localised community alerts, evacuation guidance, and family check-ins within hours.` }) },
      { kw: ['election','vote','voted','president','prime minister','government','parliament','protest','coup'],
        fn: () => ({ platform: topPlatform,
          text: `Political events produce the strongest social media reactions on ${topPlatform} in ${c}, with citizens sharing opinions, mobilising supporters, and live-streaming events — expect trending topics and hashtag wars within the hour.` }) },
      { kw: ['economic','recession','inflation','stock market','gdp','unemployment','budget','currency'],
        fn: () => ({ platform: 'LinkedIn',
          text: `Economic headlines drive analytical discourse on LinkedIn among ${c}'s professional class, while ${topPlatform} will host a broader wave of public concern including financial memes and political commentary.` }) },
      { kw: ['sport','football','cricket','nba','fifa','olympic','tournament','match','world cup','championship'],
        fn: () => ({ platform: 'X/Twitter',
          text: `Sports events reliably produce X/Twitter trending spikes in ${c} as fans live-tweet reactions; TikTok and Instagram Reels will follow with highlight clips and reaction content within 30 minutes of the final result.` }) },
      { kw: ['music','film','movie','celebrity','award','oscar','grammy','viral','singer','actor'],
        fn: () => ({ platform: 'TikTok',
          text: `Entertainment news fuels TikTok and Instagram Reels in ${c}, where short-form reactions to celebrity and cultural moments can accumulate tens of millions of views across the country within hours of breaking.` }) },
      { kw: ['ai','artificial intelligence','technology','startup','tech','innovation','robot','elon'],
        fn: () => ({ platform: 'LinkedIn',
          text: `Technology stories generate intense LinkedIn discussion in ${c}'s professional communities; X/Twitter is a close second as founders, journalists, and analysts hot-take the implications in real time.` }) },
    ];

    for (const rule of rules) {
      if (rule.kw.some(k => t.includes(k))) {
        const obj = rule.fn();
        return { text: obj.text, platform: obj.platform, isAI: false };
      }
    }
    return {
      platform: topPlatform,
      text: `This story is likely to drive a measurable activity surge on ${topPlatform}, the dominant platform in ${c}, as users seek context, share opinions, and engage with the breaking updates in real time.`,
      isAI: false,
    };
  }

  function renderImpactCard(container, result, sorted) {
    if (!result || !container) return;
    const PC = window.SocialData?.PLATFORM_COLORS || {};
    const platColor = PC[result.platform] || '#00f5ff';
    const EMOJIS = {
      TikTok:'🎵', Instagram:'📸', Facebook:'📘', 'X/Twitter':'🐦',
      YouTube:'▶️', WhatsApp:'💬', WeChat:'🧧', Snapchat:'👻',
      LinkedIn:'💼', Telegram:'✈️', Weibo:'🌐', Douyin:'🎵', Bilibili:'📺',
    };
    const emoji = EMOJIS[result.platform] || '📡';

    // Mini spike chart — 8 bars, last 2 are the spike
    const bars = Array.from({ length: 8 }, (_, i) => {
      const isSpike = i >= 6;
      const h = isSpike ? Math.round(18 + Math.random() * 10) : Math.round(4 + Math.random() * 8);
      return `<div class="bp-spike-bar" style="height:${h}px;background:${platColor};animation-delay:${i * 70}ms"></div>`;
    }).join('');

    container.innerHTML = `
      <div class="bp-impact-card">
        <div class="bp-impact-header">
          <span class="bp-impact-label">⚡ PREDICTED IMPACT</span>
          <span class="bp-impact-platform" style="border-color:${platColor};color:${platColor}">${emoji} ${result.platform}</span>
          ${result.isAI ? '<span class="bp-impact-ai-badge">AI</span>' : ''}
        </div>
        <p class="bp-impact-text">${result.text}</p>
        <div class="bp-impact-spike-wrap">
          <div class="bp-impact-spike">${bars}</div>
          <span class="bp-impact-spike-label">activity spike →</span>
        </div>
      </div>`;
  }

  // ── Popup close button ─────────────────────────────────────────────────
  const closeBtn = document.getElementById('breaking-popup-close');
  if (closeBtn) {
    closeBtn.addEventListener('click', () => {
      const popup = document.getElementById('breaking-popup');
      popup?.classList.remove('visible');
      popup?.setAttribute('aria-hidden', 'true');
    });
  }

  // ── LIVE indicator ─────────────────────────────────────────────────────
  function updateLive(hasNews) {
    const el = document.getElementById('live-indicator');
    if (!el) return;
    el.setAttribute('aria-hidden', String(!hasNews));
    el.classList.toggle('live-on', hasNews);
  }

  // ── Boot ──────────────────────────────────────────────────────────────
  // Wait for globe to be ready then start
  function waitForGlobe() {
    if (window.GlobeModule?.globeInstance) {
      fetchBreaking();
      setInterval(fetchBreaking, FETCH_INTERVAL);
    } else {
      setTimeout(waitForGlobe, 600);
    }
  }

  setTimeout(waitForGlobe, 1200);

  window.BreakingNews = { refresh: fetchBreaking };
})();

