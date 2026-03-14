// ============================================================
//  Social Pulse Globe — NEXT BATTLE PREDICTION
//  Uses Claude API (or local fallback) to predict territory shifts
// ============================================================

(function () {
  const { SOCIAL_DATA, PLATFORM_COLORS } = window.SocialData;

  const CLAUDE_API  = "https://api.anthropic.com/v1/messages";
  const MODEL       = "claude-3-haiku-20240307";

  let predictions    = [];
  let countdownTimers= [];
  let targetingRAF   = null;
  let targetCountries= [];
  let apiKey         = localStorage.getItem("bp_claude_key") || "";

  // ── Build context for Claude from live data ────────────────────────
  function buildDataContext() {
    const lines = [];
    Object.entries(SOCIAL_DATA).forEach(([iso2, d]) => {
      if (!d.platforms) return;
      const sorted = Object.entries(d.platforms).sort((a,b) => b[1]-a[1]);
      if (!sorted.length) return;
      const [dom, domV]  = sorted[0];
      const [chal, chalV]= sorted[1] || ["—", 0];
      lines.push(`${d.name}(${iso2}): leader=${dom}(${domV}M), challenger=${chal}(${chalV}M)`);
    });
    return lines.join("\n");
  }

  // ── Local fallback prediction (no API key needed) ──────────────────
  function generateLocalPredictions() {
    const { HISTORICAL_DOMINANT } = window.HistoricalData;
    const candidates = [];

    Object.entries(SOCIAL_DATA).forEach(([iso2, d]) => {
      if (!d.platforms) return;
      const sorted = Object.entries(d.platforms).sort((a,b) => b[1]-a[1]);
      if (sorted.length < 2) return;
      const [dom, domV]   = sorted[0];
      const [chal, chalV] = sorted[1];

      // Momentum: did challenger gain from 2023→2025 historically?
      const dom2023  = HISTORICAL_DOMINANT[2023]?.[iso2];
      const dom2025  = HISTORICAL_DOMINANT[2025]?.[iso2];
      const dom2026  = HISTORICAL_DOMINANT[2026]?.[iso2];

      // If challenger was dominant 2025 and lost, or is gaining
      const ratio = chalV / domV;
      if (ratio < 0.5) return; // too far behind — skip

      // Compute a pseudo-probability
      let prob = Math.round(30 + ratio * 50);
      if (dom2025 === chal) prob = Math.min(92, prob + 20); // challenger was #1 recently
      if (dom2023 === chal) prob = Math.min(88, prob + 12);
      if (dom2026 !== dom)  prob = Math.min(85, prob + 10); // already shifting
      prob = Math.min(91, Math.max(35, prob));

      const reasons = {
        "TikTok":    `${chal} has surged 40%+ YoY among 18–34s in ${d.name}, closing margin rapidly.`,
        "Instagram": `${chal} Reels adoption exploded in ${d.name}; daily active users nearly match ${dom}.`,
        "YouTube":   `${chal} Shorts drove record watch-time in ${d.name}, threatening ${dom}'s lead.`,
        "Facebook":  `${chal} brand recognition & Marketplace growth continue to expand in ${d.name}.`,
        "WhatsApp":  `${chal} messaging dominance is converting to social browsing in ${d.name}.`,
        "Snapchat":  `${chal} AR features are uniquely popular with ${d.name}'s youth demographics.`,
        "X/Twitter": `${chal} remains the go-to real-time platform in ${d.name} despite global decline.`,
      };
      const reason = reasons[chal] || `${chal} is narrowing the gap against ${dom} in ${d.name}.`;

      const months = Math.round(prob > 75 ? 5 + Math.random()*4 : 8 + Math.random()*6);
      const tf = months <= 6 ? `${months} months` : `${months} months`;

      candidates.push({
        country: d.name,
        iso2,
        currentLeader: dom,
        challenger:    chal,
        probability:   prob,
        reason,
        timeframe:     tf,
        _months:       months,
      });
    });

    // Return top 5 by probability
    return candidates.sort((a,b) => b.probability - a.probability).slice(0, 5);
  }

  // ── Claude API call ────────────────────────────────────────────────
  async function fetchClaudePredictions() {
    const systemPrompt = `You are a social media warfare analyst. Given current platform dominance data by country, predict the next 3 "territory shifts" — countries where the dominant platform is likely to change within 12 months. Respond ONLY in valid JSON array (no markdown, no explanation):
[{"country":"CountryName","iso2":"XX","currentLeader":"Platform","challenger":"Platform","probability":73,"reason":"one concise sentence","timeframe":"6-9 months"}]`;

    const userMsg = `Current platform dominance data (format: Country: leader(users M), challenger(users M)):\n${buildDataContext()}\n\nGive me the top 3 most likely territory shifts.`;

    const resp = await fetch(CLAUDE_API, {
      method: "POST",
      headers: {
        "Content-Type":      "application/json",
        "x-api-key":         apiKey,
        "anthropic-version": "2023-06-01",
        "anthropic-dangerous-direct-browser-access": "true",
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 600,
        system:     systemPrompt,
        messages:   [{ role: "user", content: userMsg }],
      }),
    });

    if (!resp.ok) throw new Error(`API ${resp.status}`);
    const json = await resp.json();
    const raw  = json.content?.[0]?.text || "[]";

    // Strip possible markdown code fences
    const cleaned = raw.replace(/```json\s*/g,"").replace(/```\s*/g,"").trim();
    const preds   = JSON.parse(cleaned);

    // Augment with _months from timeframe string
    return preds.map(p => {
      const m = p.timeframe.match(/(\d+)/);
      return { ...p, _months: m ? +m[1] : 9 };
    });
  }

  // ── Render INCOMING ATTACK cards ──────────────────────────────────
  function renderCards(preds) {
    predictions = preds;
    const container = document.getElementById("bp-cards");
    if (!container) return;
    container.innerHTML = "";

    preds.forEach((p, i) => {
      const leaderColor   = PLATFORM_COLORS[p.currentLeader] || "#00f5ff";
      const chalColor     = PLATFORM_COLORS[p.challenger]    || "#ff4444";
      const attackId      = `bp-card-${i}`;

      // Countdown: months → approx seconds for display (just cosmetic)
      const deadlineDays  = p._months * 30;

      const card = document.createElement("div");
      card.className = "bp-card";
      card.id = attackId;
      card.style.setProperty("--chal-color", chalColor);
      card.style.animationDelay = (i * 0.18) + "s";

      card.innerHTML = `
        <div class="bp-card-radar"></div>
        <div class="bp-card-header">
          <span class="bp-card-badge">⚔ INCOMING ATTACK</span>
          <span class="bp-card-prob-num" style="color:${chalColor}">${p.probability}%</span>
        </div>
        <div class="bp-card-country">
          <img class="bp-flag" src="https://flagcdn.com/w40/${(p.iso2||'').toLowerCase()}.png"
               onerror="this.style.display='none'" alt="${p.country}">
          <span class="bp-country-name">${p.country}</span>
        </div>
        <div class="bp-war-line">
          <span class="bp-platform bp-leader" style="color:${leaderColor}">
            ${p.currentLeader} 🏴
          </span>
          <span class="bp-vs">VS</span>
          <span class="bp-platform bp-challenger" style="color:${chalColor}">
            ⚔ ${p.challenger}
          </span>
        </div>
        <div class="bp-prob-track">
          <div class="bp-prob-fill" style="width:0%;background:${chalColor}"></div>
        </div>
        <div class="bp-reason">${p.reason}</div>
        <div class="bp-footer">
          <span class="bp-timeframe">⏱ ${p.timeframe}</span>
          <span class="bp-countdown" id="bp-cd-${i}">T-${deadlineDays}d</span>
        </div>`;

      container.appendChild(card);

      // Animate probability bar
      requestAnimationFrame(() => {
        setTimeout(() => {
          const fill = card.querySelector(".bp-prob-fill");
          if (fill) fill.style.width = p.probability + "%";
        }, 400 + i * 180);
      });
    });

    // Start countdowns
    clearCountdowns();
    preds.forEach((p, i) => startCountdown(p, i));

    // Globe targeting
    startTargeting(preds.map(p => p.iso2).filter(Boolean));
  }

  // ── Countdown timers (cosmetic — count from estimate in days) ─────
  function startCountdown(pred, idx) {
    const el = document.getElementById(`bp-cd-${idx}`);
    if (!el) return;

    let days = pred._months * 30;
    // Fast-tick: subtract 1 day every 4s for dramatic effect
    const t = setInterval(() => {
      days = Math.max(0, days - 1);
      if (el) el.textContent = days > 0 ? `T-${days}d` : "IMMINENT";
      if (days <= 0) clearInterval(t);
    }, 4000);
    countdownTimers.push(t);
  }

  function clearCountdowns() {
    countdownTimers.forEach(t => clearInterval(t));
    countdownTimers = [];
  }

  // ── Globe targeting animation ─────────────────────────────────────
  function startTargeting(iso2List) {
    stopTargeting();
    targetCountries = iso2List;

    function loop() {
      const globe = window.GlobeModule?.globeInstance;
      if (!globe || !targetCountries.length) {
        targetingRAF = requestAnimationFrame(loop);
        return;
      }
      // Use breaking-news beacons style: create/update target overlays
      updateTargetOverlays(globe, targetCountries);
      targetingRAF = requestAnimationFrame(loop);
    }
    targetingRAF = requestAnimationFrame(loop);
  }

  function stopTargeting() {
    if (targetingRAF) { cancelAnimationFrame(targetingRAF); targetingRAF = null; }
    document.querySelectorAll(".bp-target").forEach(el => el.remove());
  }

  // Build per-country centroids for targeting
  const CENTROIDS = {
    US:{lat:38,lng:-97}, IN:{lat:20,lng:78}, CN:{lat:35,lng:105},
    BR:{lat:-10,lng:-55}, RU:{lat:60,lng:90}, JP:{lat:36,lng:138},
    DE:{lat:51,lng:10}, GB:{lat:54,lng:-2}, FR:{lat:46,lng:2},
    AU:{lat:-25,lng:134}, CA:{lat:56,lng:-106}, MX:{lat:23,lng:-102},
    NG:{lat:9,lng:8}, EG:{lat:26,lng:30}, ZA:{lat:-29,lng:25},
    KR:{lat:37,lng:128}, ID:{lat:-5,lng:120}, TR:{lat:39,lng:35},
    AR:{lat:-34,lng:-64}, PH:{lat:12,lng:122}, VN:{lat:16,lng:108},
    TH:{lat:15,lng:101}, IR:{lat:32,lng:53}, PK:{lat:30,lng:69},
    SA:{lat:24,lng:45}, UA:{lat:49,lng:32}, PL:{lat:52,lng:20},
    ES:{lat:40,lng:-4}, IT:{lat:42,lng:12}, NL:{lat:52,lng:5},
    SE:{lat:62,lng:15}, MY:{lat:4,lng:109}, SG:{lat:1,lng:104},
    TW:{lat:23,lng:121}, CO:{lat:4,lng:-74}, PE:{lat:-10,lng:-76},
    NZ:{lat:-41,lng:174}, BD:{lat:24,lng:90},
  };

  const targetEls = {};

  function updateTargetOverlays(globe, iso2List) {
    iso2List.forEach((iso2, idx) => {
      const ctr = CENTROIDS[iso2];
      if (!ctr) return;
      const sc = globe.getScreenCoords(ctr.lat, ctr.lng, 0.015);
      if (!sc) return;

      if (!targetEls[iso2]) {
        const el = document.createElement("div");
        el.className = "bp-target";
        el.dataset.iso2 = iso2;
        el.style.setProperty("--card-idx", idx);
        el.innerHTML = `
          <div class="bp-target-ring bp-target-ring1"></div>
          <div class="bp-target-ring bp-target-ring2"></div>
          <div class="bp-target-cross-h"></div>
          <div class="bp-target-cross-v"></div>`;
        document.body.appendChild(el);
        targetEls[iso2] = el;
      }

      const el = targetEls[iso2];
      const visible = sc.x > 0 && sc.x < window.innerWidth && sc.y > 0 && sc.y < window.innerHeight;
      el.style.display  = visible ? "block" : "none";
      el.style.left = sc.x + "px";
      el.style.top  = sc.y + "px";
    });
  }

  function cleanupTargetEls() {
    Object.values(targetEls).forEach(el => el.remove());
    Object.keys(targetEls).forEach(k => delete targetEls[k]);
  }

  // ── State machine ─────────────────────────────────────────────────
  let panelVisible = false;

  function showPanel() {
    panelVisible = true;
    const panel = document.getElementById("bp-panel");
    if (panel) panel.classList.add("visible");
  }

  function hidePanel() {
    panelVisible = false;
    const panel = document.getElementById("bp-panel");
    if (panel) panel.classList.remove("visible");
    stopTargeting();
    cleanupTargetEls();
    clearCountdowns();
  }

  // ── Run prediction ─────────────────────────────────────────────────
  async function runPrediction() {
    const status = document.getElementById("bp-status");
    if (!status) return; // Status display required
    const keyInput = document.getElementById("bp-key-input");
    if (keyInput) {
      const newKey = keyInput.value.trim();
      if (newKey) { apiKey = newKey; localStorage.setItem("bp_claude_key", newKey); }
    }

    if (status) {
      status.textContent = apiKey ? "🔮 CONSULTING CLAUDE AI..." : "⚙ RUNNING LOCAL ANALYSIS...";
      status.style.display = "block";
    }

    try {
      let preds;
      if (apiKey) {
        try {
          preds = await fetchClaudePredictions();
        } catch (e) {
          console.warn("Claude API failed:", e.message, "— using local fallback");
          if (status) status.textContent = "⚠ API error — using local analysis";
          preds = generateLocalPredictions().slice(0, 3);
        }
      } else {
        preds = generateLocalPredictions().slice(0, 3);
      }

      if (status) status.style.display = "none";
      renderCards(preds);

    } catch (e) {
      if (status) { status.textContent = "❌ Error: " + e.message; }
    }
  }

  // ── Wire "PREDICT" button (built into HTML) ────────────────────────
  function wireButtons() {
    const btn     = document.getElementById("bp-run-btn");
    const closeBtn= document.getElementById("bp-close-btn");
    const openBtn = document.getElementById("bp-open-btn");

    if (btn)     btn.addEventListener("click", runPrediction);
    if (closeBtn)closeBtn.addEventListener("click", hidePanel);
    if (openBtn) openBtn.addEventListener("click", () => {
      showPanel();
      if (!predictions.length) runPrediction();
    });
  }

  // Init on load
  window.addEventListener("DOMContentLoaded", wireButtons);
  // Also try immediately (if DOMContentLoaded already fired)
  if (document.readyState !== "loading") wireButtons();

  window.BattlePrediction = {
    showPanel, hidePanel, runPrediction,
    stopTargeting,
    cleanupTargetEls,
  };

})();


