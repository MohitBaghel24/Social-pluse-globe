# 🌍 Social Pulse Globe

> **Real-Time 3D Social Media World Intelligence Map**  
> An interactive globe that visualises social media platform dominance, viral trends, platform wars, and historical data across 50+ countries — with zero backend, zero build step, pure HTML / CSS / JavaScript.

---

## 📋 Table of Contents

1. [Live Demo](#-live-demo)
2. [Project Overview](#-project-overview)
3. [Features](#-features)
4. [Tech Stack & Dependencies](#-tech-stack--dependencies)
5. [Project Structure](#-project-structure)
6. [Data Sources](#-data-sources)
7. [External APIs Used](#-external-apis-used)
8. [Module Architecture](#-module-architecture)
9. [Algorithm Breakdown — How Everything Works](#-algorithm-breakdown--how-everything-works)
   - [Globe Rendering Algorithm](#1-globe-rendering-algorithm)
   - [Country Colour-Coding Algorithm](#2-country-colour-coding-algorithm)
   - [Platform War Engine](#3-platform-war-engine)
   - [Viral Tracker: Arc Migration Algorithm](#4-viral-tracker-arc-migration-algorithm)
   - [Battle Prediction Algorithm (Local AI)](#5-battle-prediction-algorithm-local-ai)
   - [Historical Timeline Scrubber](#6-historical-timeline-scrubber)
   - [Breaking News Beacons](#7-breaking-news-beacons)
   - [Activity Pulse Bursts](#8-activity-pulse-bursts)
   - [Twin Finder (Social DNA Quiz)](#9-twin-finder-social-dna-quiz)
   - [AI Insight Generator](#10-ai-insight-generator)
   - [Posts-Per-Second Counter](#11-posts-per-second-counter)
   - [Kill Feed Engine](#12-kill-feed-engine)
   - [Trending Sidebar](#13-trending-sidebar)
   - [Star Field Canvas](#14-star-field-canvas)
10. [Data Flow Diagram](#-data-flow-diagram)
11. [Script Load Order](#-script-load-order)
12. [Local Development](#-local-development)
13. [Deployment](#-deployment)
14. [Browser Compatibility](#-browser-compatibility)
15. [Security Notes](#-security-notes)
16. [Git History & Key Releases](#-git-history--key-releases)

---

## 🚀 Live Demo

Open `index.html` in any modern browser, or serve with:

```bash
python3 -m http.server 8000
# → http://localhost:8000
```

---

## 🔭 Project Overview

Social Pulse Globe renders a WebGL-powered 3D Earth with every country coloured by its dominant social media platform. The experience is built as a **single-page application with no backend** — all computation runs client-side, all static data is bundled directly in `js/data.js`, and all external calls are read-only public endpoints.

```
┌─────────────────────────────────────────────────────┐
│               Browser (Client Only)                 │
│                                                     │
│  index.html  ←→  js/*.js  ←→  css/styles.css       │
│      ↕                                              │
│  globe.gl (WebGL / Three.js)                        │
│  Chart.js (Canvas charts)                           │
│      ↕                                              │
│  External (read-only, no auth required)             │
│  • Reddit JSON API (breaking news)                  │
│  • ipapi.co (geolocation)                           │
│  • flagcdn.com (flag images)                        │
│  • Google Fonts (typography)                        │
└─────────────────────────────────────────────────────┘
```

---

## ✨ Features

| Feature | Module | Description |
|---------|--------|-------------|
| **3D Interactive Globe** | `globe.js` | WebGL earth — click any country to open its stats |
| **Platform Dominance Colours** | `globe.js` + `data.js` | Each country coloured by its #1 social platform |
| **Country Stats Panel** | `panel.js` | Slide-in panel with Chart.js bar chart, trending topics, AI insight |
| **Platform War** | `platform-war.js` | Simulated real-time battle between platforms for territory |
| **Kill Feed** | `kill-feed.js` | Twitch-style feed of platform territory takeovers |
| **War Room** | `war-room.js` | Immersive full-screen military-UI dashboard |
| **Viral Tracker** | `viral-tracker.js` | Animated arc paths showing viral content migrations 2020–2026 |
| **Timeline Scrubber** | `timeline-scrubber.js` | Scrub the globe back to any year 2018–2026 |
| **Battle Prediction** | `battle-prediction.js` | Local AI predicts next platform territory shifts with % probability |
| **Breaking News Beacons** | `breaking-news.js` | Pulsing map pins on countries mentioned in /r/worldnews |
| **Activity Pulse** | `activity-pulse.js` | Periodic burst animation on countries — sized by user count |
| **Twin Finder** | `twin-finder.js` | 5-question quiz matching your social habits to a country's profile |
| **Live Feed** | `live-feed.js` | Bottom-right glassmorphism panel with rolling news headlines |
| **Posts Counter** | `posts-counter.js` | Animated real-time posts-per-second counter |
| **AI Insight** | `ai-insight.js` | Locally generated 2-sentence insight per country, typewriter effect |
| **Trending Sidebar** | `trending-sidebar.js` | Tabs: Trending Now / Social Buzz / Platform News per country |
| **Historical Data** | `historical-data.js` | 2018–2026 dominant-platform dataset per country per year |
| **Ticker Bar** | `ticker.js` | Scrolling bottom news ticker with static curated items |
| **Platform Switcher** | `switcher.js` | 9-button dock to filter globe by platform (+ keyboard 1–9) |
| **Stats Bar** | `index.html` | Dynamic global user count, penetration %, avg screen time |
| **Star Field** | `stars.js` | Canvas 2D animated star background with shooting stars |
| **Custom Cursor** | `index.html` | Lerp ring cursor with interactive hover states |
| **Geolocation Banner** | `index.html` | Auto-detects user country and offers to open its stats |
| **Refresh** | `refresh.js` | Manual + auto-refresh (30 min) with toast notification |

---

## 🛠 Tech Stack & Dependencies

### Core Libraries (CDN — no npm required)

| Library | Version | CDN URL | Purpose |
|---------|---------|---------|---------|
| **globe.gl** | 2.27.2 | `cdn.jsdelivr.net/npm/globe.gl@2.27.2` | WebGL 3D globe (wraps Three.js internally) |
| **Chart.js** | 4.4.0 | `cdn.jsdelivr.net/npm/chart.js@4.4.0` | Bar chart in the country stats panel |

### Fonts (Google Fonts)

| Font | Weights | Usage |
|------|---------|-------|
| **DM Sans** | 300, 400, 500 | All UI text |
| **DM Mono** | 300, 400, 500 | Numbers, counters, code-style labels |

### No Build Tools

- No Webpack, Vite, Rollup, or Babel
- No Node.js runtime required
- No TypeScript
- Run directly from the filesystem or any static HTTP server

---

## 📁 Project Structure

```
social-pulse-globe/
│
├── index.html                  # Main entry point — all HTML structure, inline scripts
├── pulse.html                  # Alternate/experimental view
├── index_threejs_backup.html   # Backup of earlier Three.js-direct implementation
│
├── css/
│   └── styles.css              # All styles (~4,400 lines) — no preprocessor
│
└── js/
    ├── data.js                 # 📊 Static dataset (771 lines) — 50+ countries × platforms
    ├── globe.js                # 🌍 Globe init, country colours, click handling, arc layers
    ├── panel.js                # 📋 Side panel: Chart.js, tab switching, country info
    ├── platform-war.js         # ⚔️  Simulated platform battle engine + leaderboard
    ├── kill-feed.js            # ☠️  Platform territory takeover kill feed
    ├── war-room.js             # 🎖️  WAR ROOM full-screen overlay + keyboard shortcut W
    ├── viral-tracker.js        # 📡 Viral migration arcs (20 curated 2020–2026 trends)
    ├── timeline-scrubber.js    # 🕐 Year slider (2018–2026) with play/pause
    ├── battle-prediction.js    # 🔮 Local AI prediction engine + optional Claude API
    ├── breaking-news.js        # 📰 Static breaking news beacons on globe
    ├── activity-pulse.js       # 💥 Periodic burst animation on countries
    ├── twin-finder.js          # 🧬 Social DNA quiz → matched country twin
    ├── live-feed.js            # 📺 Rolling live feed panel (bottom-right)
    ├── posts-counter.js        # 🔢 Posts-per-second animated counter
    ├── ai-insight.js           # 🤖 Local AI insight generator (no API calls)
    ├── trending-sidebar.js     # 🔥 3-tab sidebar: news / buzz / platforms
    ├── historical-data.js      # 📅 Historical dominant platform 2018–2026 dataset
    ├── ticker.js               # 📢 Bottom news ticker — static headlines
    ├── switcher.js             # 🎛️  Platform filter dock (9 platforms, keyboard 1–9)
    ├── refresh.js              # 🔄 Refresh button + auto-refresh every 30 min
    └── stars.js                # ✨ Canvas star field with shooting stars + nebula
```

---

## 📊 Data Sources

### Primary Dataset — `js/data.js`

All social media user statistics are **manually curated static data** bundled directly in the app. No live database queries.

| Data Field | Source | Update Frequency |
|------------|--------|-----------------|
| Platform monthly active users (MAU) per country | [DataReportal Digital Reports](https://datareportal.com) | Manually updated ~monthly |
| Total social media users per country | [DataReportal](https://datareportal.com) + [WordPopulationReview](https://worldpopulationreview.com) | Manually updated |
| Trending topics per country | Curated manually | Static per release |
| Platform colours | Official brand guidelines | Static |

**Countries covered (50+):**

```
US, IN, CN, BR, ID, PH, VN, MX, BD, PK, NG, TH, RU, TR, JP,
DE, GB, FR, AU, CA, KR, EG, ZA, AR, UA, PL, ES, IT, NL, SE,
SA, IR, TW, CO, PE, NZ, IL, MY, SG, SG, TH, VN, IQ, ET, GH...
```

**Data structure per country:**

```javascript
// Example entry from data.js
US: {
  name: "United States",
  totalUsers: 302,           // millions of social media users
  platforms: {
    YouTube:   238,          // MAU in millions
    Facebook:  179,
    Instagram: 143,
    TikTok:    113,
    WhatsApp:   79,
    Snapchat:  106,
    "X/Twitter": 95,
    LinkedIn:   87,
    Pinterest:  84,
  },
  trending: [                // top hashtags / topics in this country
    "#SuperBowl2026", "AI Act", "TechLayoffs", "NASA Artemis", "ElectionPoll"
  ],
}
```

**Platform colour map** (used for globe colouring, charts, all UI):

```javascript
PLATFORM_COLORS = {
  Facebook:    "#1877F2",
  YouTube:     "#FF0000",
  Instagram:   "#E4405F",
  TikTok:      "#69C9D0",
  WhatsApp:    "#25D366",
  "X/Twitter": "#1DA1F2",
  WeChat:      "#07C160",
  Snapchat:    "#FFFC00",
  LinkedIn:    "#0A66C2",
  Telegram:    "#2AABEE",
  Pinterest:   "#E60023",
  Default:     "#4fffb0",
}
```

### Historical Dataset — `js/historical-data.js`

Dominant platform per country per year going back to 2018:

```
2018 → 2019 → 2020 → 2021 → 2022 → 2023 → 2024 → 2025 → 2026
```

**Source:** Compiled from:
- DataReportal annual digital reports (2018–2026)
- Statista platform-by-country MAU estimates
- Wikipedia "Timeline of social media" article
- Platform investor reports (Meta, Alphabet, ByteDance, Snap)

### Viral Tracker Dataset — `js/viral-tracker.js`

20 hand-curated viral content migrations (2020–2026), each describing a real trend that spread between countries via social media, with:
- Origin country and destination countries
- Travel speed in days per hop
- Platform it occurred on
- Intensity score (1–3)

**Sources:** TikTok trend timelines, academic social media spread papers, news archive research.

---

## 🌐 External APIs Used

### 1. Reddit JSON API — Breaking News Beacons

| Property | Value |
|----------|-------|
| **Endpoint** | `https://www.reddit.com/r/worldnews/top.json?limit=25&t=day` |
| **Authentication** | None — public endpoint |
| **CORS** | Reddit serves `Access-Control-Allow-Origin: *` |
| **Rate limit** | ~60 requests/min (well within 5-min poll interval) |
| **Used in** | `js/breaking-news.js` |
| **Fallback** | 5-item `STATIC_BREAKING` array if fetch fails or CORS is blocked |

**What it does:**

```
Fetches top /r/worldnews posts → filters posts with upvotes > 5,000
→ matches post title against a 200+ keyword → ISO2 country code map
→ places a pulsing beacon on that country on the globe
→ clicking beacon opens impact analysis card (local AI, no API key)
```

### 2. ipapi.co — Geolocation

| Property | Value |
|----------|-------|
| **Endpoint** | `https://ipapi.co/json/` |
| **Authentication** | None — free tier (1,000 requests/day) |
| **CORS** | Allowed |
| **Timeout** | 4,000 ms (AbortSignal) |
| **Used in** | `index.html` inline script |
| **Fallback** | Silent — banner simply doesn't appear |

**What it does:**

```
Fetches user's country code from their IP address
→ displays "📍 Your country: X — View Stats" banner
→ clicking banner opens that country's panel on the globe
→ banner auto-dismisses after 12 seconds
```

### 3. flagcdn.com — Country Flag Images

| Property | Value |
|----------|-------|
| **Base URL** | `https://flagcdn.com/w80/{iso2_lowercase}.png` |
| **Authentication** | None — public CDN |
| **Used in** | `js/panel.js`, `js/battle-prediction.js` |
| **Fallback** | `onerror="this.style.display='none'"` — image hides if not found |

### 4. Google Fonts — Typography

| Property | Value |
|----------|-------|
| **URL** | `https://fonts.googleapis.com/css2?family=DM+Sans...` |
| **Authentication** | None |
| **Used in** | `index.html` `<head>` |
| **Fallback** | System sans-serif if blocked |

### 5. Google News — Trending Sidebar Links (navigation only)

| Property | Value |
|----------|-------|
| **URL pattern** | `https://news.google.com/search?q={query}&hl=en` |
| **Method** | Not fetched — opens in new tab via `<a target="_blank">` |
| **Used in** | `js/trending-sidebar.js` |
| **Note** | No data is fetched; links are constructed for user navigation |

### 6. Anthropic Claude API — Battle Prediction (Optional)

| Property | Value |
|----------|-------|
| **Endpoint** | `https://api.anthropic.com/v1/messages` |
| **Model** | `claude-3-haiku-20240307` |
| **Authentication** | User-provided API key (stored in `localStorage`) |
| **CORS** | Requires `anthropic-dangerous-direct-browser-access: true` header |
| **Used in** | `js/battle-prediction.js` |
| **Fallback** | Full local algorithm — Claude is **never required** |
| **Key storage** | `localStorage.getItem("bp_claude_key")` — never sent to any server |

**When is Claude called?**  
Only if:
1. The user pastes their own Claude API key into the Battle Prediction panel input
2. The user clicks "⚡ ANALYZE"

If no key is provided, the **local prediction algorithm** runs automatically.

---

## 🏗 Module Architecture

Each JavaScript file is wrapped in an **IIFE** (Immediately Invoked Function Expression) and exposes a `window.*` public API for cross-module communication:

```
window.SocialData          → { SOCIAL_DATA, PLATFORM_COLORS }
window.GlobeModule         → { globeInstance, refresh, setPlatform, setWarRoomMode,
                               setViralArcs, applyHistoricalYear,
                               restoreHistoricalOverride, pauseRotation,
                               resumeRotation, syncMouseBase, getDominant,
                               isContested, computeCentroid }
window.PanelModule         → { open(iso2, data), close() }
window.HistoricalData      → { TIMELINE_EVENTS, HISTORICAL_DOMINANT,
                               buildYearData(year), getDominantForYear(iso2,year),
                               YEARS }
window.WarRoomModule       → { enter(), exit(), logEvent(text) }
window.TimelineScrubber    → { show(), hide(), scrubTo(year) }
window.BattlePrediction    → { showPanel(), hidePanel(), runPrediction(),
                               stopTargeting(), cleanupTargetEls() }
window.KillFeed            → { onWarAdvance(event), show(), hide() }
window.PlatformWar         → { start(), stop() }
window.ViralTracker        → { show(), hide(), toggle(), onArcClick(arc,x,y),
                               isActive(), MIGRATIONS }
window.TrendingSidebar     → { load(iso2, data), reset(), switchTab(tabId) }
window.AIInsight           → { load(iso2, data) }
window.PostsCounter        → { (internal — mounts itself) }
window.SwitcherModule      → { activate(platformKey), PLATFORMS }
window.RefreshModule       → { doRefresh(), showToast(msg) }
window.TickerModule        → { buildFallbackItems() }
window.ActivityPulse       → { triggerBurst(countryObj), pickCountry() }
window.TwinFinder          → { retry(), goto(iso,lat,lng), download(flag,country,pct) }
```

---

## 🧮 Algorithm Breakdown — How Everything Works

### 1. Globe Rendering Algorithm

**File:** `js/globe.js`

```
INIT (on window.load):
  1. Read #globe-container dimensions (clientWidth × clientHeight)
  2. Create Globe.gl instance with:
       - glowColor: rgba(0,200,255,0.15)
       - backgroundColor: rgba(0,0,0,0)  ← transparent (canvas shows through)
       - showAtmosphere: true
  3. Load GeoJSON countries topology (built into globe.gl)
  4. Assign polygon colour per country:
       → call getCountryColor(iso2)
       → find country in SOCIAL_DATA
       → sort platforms by MAU descending
       → return PLATFORM_COLORS[platforms[0].name]
       → if not found: interpolate #1a2540 (low) → #2a3f6f (medium) based on totalUsers
  5. Set polygon altitude = isContested ? 0.018 : 0.008
       (contested = top-2 platforms within 15% of each other)
  6. Wire country hover → show tooltip (country name + dominant platform)
  7. Wire country click → zoom camera (1200ms) → open PanelModule after 1250ms

REFRESH:
  Rebuilds polygon data arrays → globe.gl transitions colours smoothly
```

### 2. Country Colour-Coding Algorithm

**File:** `js/globe.js` — `getCountryColor(iso2)`

```
Input: ISO2 country code (e.g. "US", "IN", "CN")

1. Look up SOCIAL_DATA[iso2]
2. IF no data → return fallback grey #1a2540
3. Get platforms array sorted by MAU descending
4. IF no platforms → interpolate grey by totalUsers:
     normalised = totalUsers / MAX_USERS (1050M China)
     return lerp(#1a2540 → #2a3f6f, normalised)
5. dominant = platforms[0].name
6. return PLATFORM_COLORS[dominant] + "cc"  (80% opacity for polygon fill)

Output: hex colour string
```

**Contested country detection** (raised altitude, flashing):

```
isContested(iso2):
  sorted = platforms sorted by MAU descending
  IF sorted.length < 2: return false
  ratio = sorted[1].MAU / sorted[0].MAU
  return ratio >= 0.85  (challenger within 15% of leader)
```

### 3. Platform War Engine

**File:** `js/platform-war.js`

```
STATE:
  WAR_PLATFORMS = [YouTube, Facebook, Instagram, TikTok,
                   WhatsApp, X/Twitter, Snapchat, WeChat]
  Each platform has: territory (0–100), hp (0–100), streak

ADVANCE() — called every N ms (default 3000ms, configurable 1×/2×/3×):
  1. Pick attacker: random weighted by territory (bigger = more powerful)
  2. Pick defender: different platform, weighted by territory
  3. Compute attack power:
       base = attacker.territory × 0.8 + Random(0,20)
       critChance = 0.12 → if crit: power × 1.5, emit CRITICAL_HIT event
  4. Compute defend power:
       base = defender.territory × 0.6 + Random(0,15)
  5. damage = max(1, attackPower - defendPower)
  6. defender.hp -= damage
  7. IF defender.hp <= 0:
       → territory transfer: defender loses 5–15 territory points
       → attacker gains those points (capped at 100)
       → KillFeed.onWarAdvance({attacker, defender, country, type})
       → attacker.streak++
       → IF attacker.streak >= 3: "KILLING SPREE" kill-streak flash
  8. Update leaderboard DOM sorted by territory descending
  9. Animate cycle progress bar

RENDER LEADERBOARD:
  Sort platforms by territory descending
  Emit colour-coded bars with HP%, territory%, streak indicators
```

### 4. Viral Tracker: Arc Migration Algorithm

**File:** `js/viral-tracker.js`

```
DATASET:
  20 MIGRATIONS, each with:
    - trend name (e.g. "Squid Game costume trend")
    - platform
    - year (2020–2026)
    - intensity (1, 2, or 3)
    - legs: [{ from: ISO2, to: ISO2, days: N }]

BUILD ARCS():
  For each migration (or just the active-filtered one):
    For each leg:
      filter out legs where C[from] or C[to] centroid is missing
      build arc object:
        startLat/Lng = C[leg.from]
        endLat/Lng   = C[leg.to]
        color        = PLATFORM_COLORS[migration.platform]
        stroke       = 0.4 + intensity × 0.55   → 0.95 to 2.05
        altitude     = 0.25 + intensity × 0.08  → 0.33 to 0.49
        animateMs    = 2800 − (intensity−1)×400  → 2000 to 2800ms

APPLY ARCS():
  Call GlobeModule.setViralArcs(arcs)
  → globe.gl renders animated dashed arcs between country centroids
  → arcs animate as a "travelling dot" along the path

USER INTERACTION:
  Click trend item in sidebar → set activeFilter = migration.id → rebuild arcs
  Click arc on globe → globe fires onArcClick → showArcPopup(arc, x, y)
  Popup shows: platform · year · "TrendName" · Route · "Reached in N days"
```

### 5. Battle Prediction Algorithm (Local AI)

**File:** `js/battle-prediction.js` — `generateLocalPredictions()`

```
For each country in SOCIAL_DATA:
  1. Sort platforms by MAU → identify [leader, challenger]
  2. Skip if challenger MAU < 50% of leader MAU (ratio < 0.5)
  3. Compute base probability:
       prob = 30 + (chalMAU/leadMAU) × 50   → range ~30–80
  4. Apply historical momentum bonuses:
       +20 if challenger was #1 in HISTORICAL_DOMINANT[2025]
       +12 if challenger was #1 in HISTORICAL_DOMINANT[2023]
       +10 if current leader ≠ 2026 dominant (already shifting)
  5. Clamp: prob = min(91, max(35, prob))
  6. Generate reason string from a platform-keyed reasons map
  7. Compute timeframe:
       months = prob > 75 ? rand(5,9) : rand(8,14)

OUTPUT: Top 5 predictions sorted by probability descending

DISPLAY:
  Render "INCOMING ATTACK" cards with:
    - Probability % + animated fill bar
    - Leader vs Challenger platform names + brand colours
    - Reason text
    - Countdown timer (1 simulated day per 4 real seconds — cosmetic)
    - Globe targeting reticle overlay on predicted countries (RAF loop)
```

**Optional Claude API path:**

```
If user provides API key:
  Build context: all 50+ countries → "Country: leader(NM), challenger(NM)"
  Send to claude-3-haiku with system prompt asking for top 3 JSON predictions
  Parse JSON response → augment with _months
  Fallback to local algorithm if API fails
```

### 6. Historical Timeline Scrubber

**File:** `js/timeline-scrubber.js`

```
SETUP:
  Uses YEARS = [2018, 2019, ..., 2026] from HistoricalData
  Injects #tl-bar DOM into document.body (fixed position, appears in War Room)

SCRUB TO YEAR:
  1. currentYear = selected year
  2. Update year label + sub-label (event name if year has a key event)
  3. Highlight active year label + event dots on slider
  4. Update progress bar fill: (year - 2018) / (2026 - 2018) × 100%
  5. Call applyYearToGlobe(year)

APPLY YEAR TO GLOBE:
  IF year == 2026 (current):
    GlobeModule.restoreHistoricalOverride()  → live data
  ELSE:
    yearData = HistoricalData.buildYearData(year)
    GlobeModule.applyHistoricalYear(yearData)

BUILD YEAR DATA (in historical-data.js):
  For each ISO2 in SOCIAL_DATA:
    dominant = HISTORICAL_DOMINANT[year][iso2]
               (falls back to previous years if missing)
    Build synthetic platforms object:
      dominant platform MAU = max(real_MAU, 15M)
      other platforms = real_MAU × 0.45
      ensure dominant clearly wins (add +8 if needed)
    Return full override dataset

PLAY MODE:
  Advance year by +1 every 1500ms
  Stop at MAX_Y (2026)
  Event dots clickable → jump to that year + open popup with event detail
```

### 7. Breaking News Beacons

**File:** `js/breaking-news.js`

```
STARTUP:
  Wait for GlobeModule.globeInstance to be available (1200ms retry loop)
  Immediately render 5 static STATIC_BREAKING headlines as beacons
  Schedule Reddit fetch every 5 minutes

FETCH PIPELINE (Reddit → Globe):
  1. GET https://www.reddit.com/r/worldnews/top.json?limit=25&t=day
  2. Filter posts: upvotes > 5,000
  3. For each post title:
       Scan against NAME_TO_ISO2 keyword map (200+ country name variants)
       → e.g. "United States" | "America" | "US" → "US"
  4. Deduplicate by ISO2 (max 1 beacon per country)
  5. Limit to MAX_BEACONS = 5
  6. TTL: each beacon expires after 2 hours

BEACON RENDERING (RAF loop):
  Every animation frame:
    For each active beacon:
      sc = globe.getScreenCoords(lat, lng, 0.015)
      IF visible (sc.x/y within viewport):
        position <div class="beacon"> at sc.x, sc.y
        beacon pulses via CSS animation

USER INTERACTION:
  Click beacon → open impact card showing:
    - headline text
    - platform most likely to spike (from localImpactFallback)
    - 1–2 sentence analysis

LOCAL IMPACT FALLBACK ALGORITHM:
  Match headline keywords to categories:
    war/conflict    → X/Twitter + WhatsApp
    natural disaster → X/Twitter + WhatsApp
    election/protest → topPlatform for that country
    economic news   → LinkedIn + topPlatform
    sports          → topPlatform
    entertainment   → topPlatform
    technology      → YouTube + tech platform
    default         → topPlatform
```

### 8. Activity Pulse Bursts

**File:** `js/activity-pulse.js`

```
POOL BUILDING:
  Filter SOCIAL_DATA to countries that have a centroid in CENTROIDS map
  Build weighted pool: weight = totalUsers

WEIGHTED RANDOM PICK:
  r = Math.random() × TOTAL_WEIGHT
  Walk pool subtracting weights until r ≤ 0
  → Countries with more users (CN=1050M, IN=900M) burst more often

BURST ANIMATION:
  Every 10 seconds: schedule 2–5 bursts spread over 10s window
  For each burst:
    1. Pick country (or use provided override)
    2. Get screen coords from globe.getScreenCoords(lat, lng, 0.015)
    3. Skip if coords out of viewport (country on hidden hemisphere)
    4. intensity = min(totalUsers / 1050, 1)   → 0.0 to 1.0
    5. numRings  = 1 + floor(intensity × 2.4)  → 1 to 3 rings
    6. color     = PLATFORM_COLORS[dominant platform]
    7. Create <div class="activity-burst"> per ring:
         size    = 28 + intensity×74 + ringIndex×16
         opacity = 0.62 − ringIndex×0.14
         animationDelay = ringIndex × 160ms
         → append to body, remove after 2400ms + offset
    8. Flash dot: <div class="activity-burst-dot"> → remove after 800ms

First burst fires 5s after page load (globe settles)
Then every 10s thereafter
```

### 9. Twin Finder (Social DNA Quiz)

**File:** `js/twin-finder.js`

```
QUIZ (5 questions):
  Each question has 4 options
  Each option awards scores on axes:
    { sharing, addiction, creation, privacy, binge }

SCORING:
  Accumulate scores across 5 answers

MATCHING ALGORITHM:
  TWIN_PROFILES: 10 countries with profile vectors on same 5 axes

  For each profile P:
    For each axis k:
      uVal = userScores[k] / 3         (normalize user ~0-9 to ~0-3 range)
      pVal = P.profile[k]              (already 0-3)
      dist += (uVal - pVal)²
    dist = √dist

  bestMatch  = profile with minimum dist
  shadowTwin = profile with maximum dist

  matchPct = max(10, round(100 - bestDist × 15))

RESULT SCREEN:
  Show twin flag, country, traits, shadow twin
  Render radar chart (Canvas 2D):
    Twin profile in cyan  (rgba(59,232,255,1))
    User profile in gold  (rgba(201,255,59,1))
    5 axes drawn as pentagon

ACTIONS:
  "View on Globe" → close modal → rotateTo(lat,lng) → PanelModule.open(iso2, data)
  "Save"          → generate 1080×1920 canvas image → download as PNG
  "Retake"        → reset scores → restart quiz
```

### 10. AI Insight Generator

**File:** `js/ai-insight.js`

```
No API calls — entirely local

ALGORITHM:
  Input: iso2 code + country social data

  1. Check sessionStorage for cached insight (key = "ai_insight_" + iso2)
     → if found: skip generation, show cached text immediately

  2. Compute stats:
       topPlatform   = platforms sorted by MAU desc → [0].name
       totalUsers    = data.totalUsers
       globalRank    = rank of this country's totalUsers in full dataset
       penetration   = totalUsers / (country population estimate × 0.001)
       domRatio      = topPlatform MAU / totalUsers × 100

  3. Select sentence templates:
       Pool of 40+ template strings covering:
         government bans, mobile-first growth, cross-cultural exchange,
         youth demographics, dark social (WhatsApp), video dominance,
         geopolitical influence, diaspora connectivity, etc.

  4. Pick templates probabilistically based on:
       topPlatform type (video → YouTube templates, messaging → WhatsApp templates)
       domRatio (high dominance vs contested → different template pool)
       totalUsers magnitude (large country → scale-specific templates)

  5. Inject real values (country name, platform name, user count, %)

  6. Render with typewriter effect (4ms per character)

  7. Cache result in sessionStorage

Fallback: skeleton loading animation while computing
```

### 11. Posts-Per-Second Counter

**File:** `js/posts-counter.js`

```
BASE DATA:
  From SOCIAL_DATA: sum all platforms' MAU across all countries
  BASE_TOTAL ≈ 120,592 (raw sum — intentionally approximate)

STARTUP RAMP (0 → BASE_TOTAL in ~1.8s):
  RAF loop at 60fps
  increment = BASE_TOTAL / (1.8 × 60) per frame
  Format: toLocaleString('en-US')     → adds comma separators
  Mount to: .header-meta element OR hidden div if not found

JITTER (ongoing):
  Every 1100ms:
    delta = random ±480
    current += delta
    clamp to [BASE_TOTAL × 0.97, BASE_TOTAL × 1.03]

PPS BRIDGE (in index.html):
  setInterval every 400ms:
    read #pps-number textContent
    write to #hdr-pps-val  (header chip)
    write to #tkr-pps       (ticker bar right-side stat)
```

### 12. Kill Feed Engine

**File:** `js/kill-feed.js`

```
AUTO-SHOW: appears 4 seconds after page load (window.load)

AUTO-SIM POOL:
  35 template events covering all 8 platform combinations
  e.g. { attacker:"TikTok", defender:"Facebook", country:"Brazil",
          verb:"ANNEXED", region:"South America", type:"TAKEOVER" }

AUTO-TICK (every 6200ms):
  Pick random event from pool
  pushKill({ attacker, defender, country, type })

pushKill(event):
  1. Build kill card HTML:
       [attacker colour] attacker VERB [defender colour] defender
       in [country] · timestamp
  2. Prepend to #kill-feed
  3. Trim to max 10 entries (remove oldest)
  4. Auto-fade entry after 4 seconds (CSS opacity transition)
  5. Update kill streak tracking:
       IF same attacker 3× in a row → flash "KILLING SPREE: platform"

KILL STREAK FLASH (#kill-streak-flash):
  Appears for 2 seconds with bounce-in animation
  Shows: "🔥 KILLING SPREE: [platform] — [N] kills"
```

### 13. Trending Sidebar

**File:** `js/trending-sidebar.js`

```
TRIGGERED: when PanelModule.open(iso2, data) is called

THREE TABS:

TAB 1 — "Trending Now":
  Source: data.trending array (from SOCIAL_DATA) + GLOBAL_NEWS pool (16 items)
  Algorithm:
    Fill first N slots with country-specific trending topics
    Link each to: Google News search for "{topic} {countryName}"
    Fill remaining slots (up to 10) from global pool
    Render as clickable cards that open Google News in new tab

TAB 2 — "Social Buzz":
  Pills: data.trending topics + top 5 platform names
  Each pill links to: google.com/search?q={topic}+social+media
  Sparklines: 14-point pseudo-random time series per topic
    - Base value 0.3–0.7
    - Spike at points 10–14 (simulating trend surge)
    - Rendered on Canvas 2D (90×28px each)
    - Gradient: cyan → orange stroke, transparent fill

TAB 3 — "Platform News":
  Source: data.platforms sorted by MAU descending
  Each platform = a card linking to its official website
  Shows: rank, MAU in millions, % market share, colour-coded bar
```

### 14. Star Field Canvas

**File:** `js/stars.js`

```
STARS (280 count):
  Each star: { x, y, r (0.2–1.8), alpha (0.3–1.0), twinkleDir, twinkleSpeed }
  Each frame: alpha += twinkleDir × twinkleSpeed → clamp [0.1, 1.0] → reverse dir

NEBULA BLOBS (3 fixed):
  Radial gradient overlays at:
    - Top-left: blue rgba(0,80,180,0.06)
    - Bottom-right: teal rgba(0,180,160,0.05)
    - Top-center: purple rgba(120,0,200,0.04)

SHOOTING STARS (every 3.5s):
  Spawn at random top-50% position
  Angle: π/5 (downward-right diagonal)
  Speed: 6–14 px/frame
  Trail: linear gradient (white → transparent) of length 60–180px
  Life: decrements 0.016/frame (dies in ~62 frames ≈ 1 second)

RESIZE: canvas redraws to full window on resize event
```

---

## 🔄 Data Flow Diagram

```
                         ┌────────────────────┐
                         │    data.js         │
                         │  SOCIAL_DATA       │
                         │  PLATFORM_COLORS   │
                         └────────┬───────────┘
                                  │ window.SocialData
                    ┌─────────────┼──────────────┐
                    ▼             ▼              ▼
              ┌──────────┐ ┌──────────┐ ┌────────────────┐
              │ globe.js │ │ panel.js │ │historical-data │
              │          │ │          │ │    .js         │
              │ WebGL    │ │ Chart.js │ │ 2018-2026 data │
              │ Polygons │ │ Bar Chart│ └───────┬────────┘
              └────┬─────┘ └────┬─────┘         │
                   │ click       │ open           │ buildYearData
                   └─────────┬──┘                │
                             ▼                   ▼
                    ┌─────────────────┐   ┌──────────────────┐
                    │ trending-       │   │ timeline-        │
                    │ sidebar.js      │   │ scrubber.js      │
                    └─────────────────┘   └──────────────────┘
                                                  │ applyHistoricalYear
                                                  ▼
                                          window.GlobeModule

         ┌────────────────────────────────────────────────────────┐
         │                External Data Flows                     │
         │                                                        │
         │  Reddit API ──→ breaking-news.js ──→ globe beacons     │
         │  ipapi.co   ──→ index.html       ──→ geo banner        │
         │  flagcdn.com──→ panel.js         ──→ flag image        │
         │  Claude API ──→ battle-pred.js   ──→ prediction cards  │
         │   (optional,    (fallback: local    (local always works)│
         │   user-key)      algorithm)                            │
         └────────────────────────────────────────────────────────┘

         ┌────────────────────────────────────────────────────────┐
         │               Internal Simulation Loops                │
         │                                                        │
         │  platform-war.js  → setInterval(3000ms) → advance()   │
         │  kill-feed.js     → setInterval(6200ms) → pushKill()  │
         │  activity-pulse.js→ setInterval(10000ms)→ burst()     │
         │  posts-counter.js → RAF + setInterval(1100ms)         │
         │  live-feed.js     → setInterval(8000ms) → push item   │
         │  stars.js         → RAF (60fps)                       │
         │  breaking-news.js → setInterval(300000ms)→ fetch()    │
         │  refresh.js       → setInterval(1800000ms)→ refresh() │
         └────────────────────────────────────────────────────────┘
```

---

## 📜 Script Load Order

Scripts are loaded in dependency order at the bottom of `<body>`:

```html
<!-- 1. Data first — all modules depend on window.SocialData -->
<script src="js/data.js"></script>

<!-- 2. Pure visuals — no dependencies -->
<script src="js/stars.js"></script>

<!-- 3. Globe — depends on data.js -->
<script src="js/globe.js"></script>

<!-- 4. UI panels — depend on globe.js + data.js -->
<script src="js/panel.js"></script>
<script src="js/ticker.js"></script>
<script src="js/refresh.js"></script>
<script src="js/switcher.js"></script>
<script src="js/ai-insight.js"></script>

<!-- 5. Historical data — needed by timeline + war room -->
<script src="js/historical-data.js"></script>

<!-- 6. War Room features — depend on historical-data.js -->
<script src="js/war-room.js"></script>
<script src="js/timeline-scrubber.js"></script>
<script src="js/battle-prediction.js"></script>

<!-- 7. Feed/overlay modules -->
<script src="js/kill-feed.js"></script>
<script src="js/viral-tracker.js"></script>
<script src="js/posts-counter.js"></script>
<script src="js/activity-pulse.js"></script>

<!-- 8. Panel content modules — depend on panel.js being wired -->
<script src="js/trending-sidebar.js"></script>
<script src="js/breaking-news.js"></script>
<script src="js/live-feed.js"></script>

<!-- 9. Platform mechanics -->
<script src="js/platform-war.js"></script>
<script src="js/twin-finder.js"></script>

<!-- 10. Inline scripts — run after all modules are set up -->
<script>
  initStats();         // compute global user totals
  initGeolocation();   // fetch ipapi.co
  // cursor, UTC clock, PPS bridge, nav, refresh timer...
</script>
```

---

## 💻 Local Development

```bash
# Clone the repo
git clone https://github.com/MohitBaghel24/Social-pluse-globe.git
cd social-pulse-globe

# Serve (any static server works)
python3 -m http.server 8000
# OR
npx serve .
# OR
php -S localhost:8000

# Open in browser
open http://localhost:8000
```

> ⚠️ **Must use a server** — `file://` URLs will trigger CORS errors on the Reddit API fetch and flag CDN. `python3 -m http.server` is the simplest option.

### Optional: Claude API for Battle Prediction

1. Get an API key from [console.anthropic.com](https://console.anthropic.com)
2. Open the app → click **WAR ROOM** → click **🔮 NEXT BATTLE PREDICTION**
3. Paste your key in the input field → click **⚡ ANALYZE**
4. Key is saved in `localStorage` — never transmitted to any server other than Anthropic

---

## 🚢 Deployment

The project is a **static site** — deploy to any host that serves HTML:

| Platform | Steps |
|----------|-------|
| **GitHub Pages** | Push to `main` → Settings → Pages → Source: `main` / `root` |
| **Netlify** | Drag the folder into [app.netlify.com](https://app.netlify.com) |
| **Vercel** | `vercel` CLI in project root |
| **Cloudflare Pages** | Connect repo → build command: (none) → root dir: `.` |

---

## 🌐 Browser Compatibility

| Browser | Support | Notes |
|---------|---------|-------|
| Chrome 90+ | ✅ Full | Recommended |
| Firefox 88+ | ✅ Full | |
| Safari 15+ | ✅ Full | |
| Edge 90+ | ✅ Full | |
| Mobile Chrome | ✅ Full | |
| Mobile Safari | ✅ Full | |
| IE / Legacy | ❌ None | Uses ES2020+, CSS custom properties, optional chaining |

**WebGL required** — globe.gl uses Three.js WebGL renderer. Devices without GPU acceleration will show a blank globe container.

---

## 🔒 Security Notes

- **No user data is collected** — the app has no login, no account, no analytics
- **No credentials in code** — the Claude API key is stored only in the user's own `localStorage` and sent only directly to `api.anthropic.com`
- **External calls are read-only** — Reddit JSON API, ipapi.co, flagcdn.com are all GET requests with no auth and no side effects
- **XSS protection** — all user-facing dynamic text goes through `escapeHtml()` before being injected as `innerHTML`
- **CORS** — Reddit, ipapi.co, flagcdn.com all set `Access-Control-Allow-Origin: *`

---

## 📌 Git History & Key Releases

| Commit | Description |
|--------|-------------|
| `a88b3df` | 10-bug fix pass: globe init timing, CORS APIs, ticker CSS, PPS locale, kill feed auto-show |
| `92ddbc1` | Mobile layout fixes: loader, dock, header, geo-banner, globe height |
| `05ce882` | Mobile master layout: z-index stack, bottom sheet, dock single-row, globe centering |
| `025cce2` | Revert mobile changes (reverted 05ce882 + 92ddbc1) |
| `b649570` | Full code audit — 10 bugs fixed (twin-finder dead, GH arc, UA dupe, Claude dead code, etc.) |

---

## 👤 Author

**Mohit Baghel**  
GitHub: [@MohitBaghel24](https://github.com/MohitBaghel24)  
Repository: [Social-pluse-globe](https://github.com/MohitBaghel24/Social-pluse-globe)

---

*Last updated: March 2026*
