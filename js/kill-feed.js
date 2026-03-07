// ============================================================
//  Social Pulse Globe — KILL FEED Overlay (COD-style)
//  Shows last 10 platform eliminations during Platform War
// ============================================================

(function () {
  const { SOCIAL_DATA, PLATFORM_COLORS } = window.SocialData;

  // Platform icon map
  const ICONS = {
    "Facebook":"f","Instagram":"◈","YouTube":"▶","TikTok":"♪",
    "WhatsApp":"✆","X/Twitter":"✕","WeChat":"⊕","Snapchat":"👻",
  };

  const FEED_MAX      = 10;    // max visible entries
  const FADE_DELAY_MS = 4000;  // how long before an entry starts fading

  let audioCtx   = null;
  let entries    = [];        // active feed items (DOM refs)
  let streakKV   = {};        // victimKey → consecutive count
  let lastVictim = null;

  // ── Container ─────────────────────────────────────────────────────────
  const container = document.getElementById("kill-feed");

  // ── Web Audio: elimination "ping" ────────────────────────────────────
  function playPing(pitch = 1) {
    try {
      if (!audioCtx) audioCtx = new (window.AudioContext || window.webkitAudioContext)();
      const ctx = audioCtx;
      const t   = ctx.currentTime;

      // Short metallic tick: osc + tiny white-noise burst
      const osc  = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.setValueAtTime(1200 * pitch, t);
      osc.frequency.exponentialRampToValueAtTime(600 * pitch, t + 0.12);
      gain.gain.setValueAtTime(0.0001, t);
      gain.gain.linearRampToValueAtTime(0.18, t + 0.01);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.16);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(t);
      osc.stop(t + 0.18);

      // Noise burst for metallic feel
      const bufLen = Math.floor(ctx.sampleRate * 0.05);
      const buf = ctx.createBuffer(1, bufLen, ctx.sampleRate);
      const data = buf.getChannelData(0);
      for (let i = 0; i < bufLen; i++) data[i] = Math.random() * 2 - 1;
      const noise  = ctx.createBufferSource();
      const ngain  = ctx.createGain();
      const nhp    = ctx.createBiquadFilter();
      nhp.type  = "highpass";
      nhp.frequency.value = 3000;
      ngain.gain.setValueAtTime(0.05, t);
      ngain.gain.exponentialRampToValueAtTime(0.0001, t + 0.06);
      noise.buffer = buf;
      noise.connect(nhp);
      nhp.connect(ngain);
      ngain.connect(ctx.destination);
      noise.start(t);
    } catch (_) {}
  }

  // ── Streak flash overlay ──────────────────────────────────────────────
  function showStreakFlash(text, color) {
    const el = document.getElementById("kill-streak-flash");
    if (!el) return;
    el.textContent     = text;
    el.style.color     = color;
    el.style.animation = "none";
    // Force reflow
    void el.offsetWidth;
    el.style.animation = "streakFlash 1.8s cubic-bezier(0.22,1,0.36,1) forwards";
  }

  // ── Build a single feed entry element ─────────────────────────────────
  function makeEntry(attacker, victim, country) {
    const atkColor = PLATFORM_COLORS[attacker] || "#00f5ff";
    const vicColor = "rgba(255,255,255,0.22)";
    const atkIcon  = ICONS[attacker] || "◉";
    const vicIcon  = ICONS[victim]   || "◉";
    const flagCode = country.iso2 ? country.iso2.toLowerCase() : "un";

    const el = document.createElement("div");
    el.className = "kf-entry";
    el.innerHTML = `
      <span class="kf-platform kf-atk" style="color:${atkColor};border-color:${atkColor}44">
        <span class="kf-icon">${atkIcon}</span>
        <span class="kf-label">${attacker}</span>
      </span>
      <span class="kf-verb">ELIMINATED</span>
      <span class="kf-platform kf-vic" style="color:${vicColor}">
        <span class="kf-icon">${vicIcon}</span>
        <span class="kf-label kf-vic-lbl">${victim}</span>
      </span>
      <span class="kf-in">in</span>
      <img class="kf-flag" src="https://flagcdn.com/w20/${flagCode}.png"
           onerror="this.style.display='none'" alt="${country.name}">
      <span class="kf-country">${country.name}</span>`;

    return el;
  }

  // ── Push a kill into the feed ─────────────────────────────────────────
  function pushKill(attacker, victim, countryIso2) {
    if (!container || !attacker || !victim || attacker === victim) return;

    const allCountries = Object.entries(SOCIAL_DATA);
    let country;
    if (countryIso2) {
      const d = SOCIAL_DATA[countryIso2];
      country = { iso2: countryIso2, name: d?.name || countryIso2 };
    } else {
      // pick random with some data
      const pool = allCountries.filter(([, d]) => d.platforms);
      const [iso, d] = pool[Math.floor(Math.random() * pool.length)];
      country = { iso2: iso, name: d.name };
    }

    // Streak tracking
    if (victim === lastVictim) {
      streakKV[victim] = (streakKV[victim] || 1) + 1;
    } else {
      streakKV = {};
      streakKV[victim] = 1;
      lastVictim = victim;
    }

    const streak = streakKV[victim];
    const atkColor = PLATFORM_COLORS[attacker] || "#00f5ff";

    // Streak effects
    if (streak === 3) {
      playPing(1.4);
      showStreakFlash("💀 DOMINATED", "#ff2222");
    } else if (streak === 5) {
      playPing(1.7);
      showStreakFlash("🔥 RAMPAGE!", "#ff6600");
    } else if (streak >= 7) {
      playPing(2.0);
      showStreakFlash("⚡ UNSTOPPABLE", "#ffcc00");
    } else {
      playPing();
    }

    // Build and prepend entry
    const el = makeEntry(attacker, victim, country);
    container.prepend(el);
    entries.unshift(el);

    // Trim to max
    while (entries.length > FEED_MAX) {
      const old = entries.pop();
      old?.remove();
    }

    // Auto-fade after FADE_DELAY_MS
    setTimeout(() => {
      el.classList.add("kf-fading");
      setTimeout(() => el.remove(), 600);
    }, FADE_DELAY_MS);
  }

  // ── Pick a "victim" for the current cycle ────────────────────────────
  // Called by platform-war.js each advance step
  function onWarAdvance(newPlatform) {
    if (!newPlatform) return;

    // Find a country not already dominated by newPlatform to make a plausible kill
    const countries = Object.entries(SOCIAL_DATA).filter(([, d]) => d.platforms);
    const candidates = countries.filter(([, d]) => {
      const sorted = Object.entries(d.platforms).sort((a,b) => b[1]-a[1]);
      return sorted.length >= 2 && sorted[0][0] !== newPlatform;
    });

    if (!candidates.length) return;
    const [iso2, data] = candidates[Math.floor(Math.random() * Math.min(candidates.length, 8))];
    const dom = Object.entries(data.platforms).sort((a,b) => b[1]-a[1])[0][0];
    pushKill(newPlatform, dom, iso2);
  }

  // ── Show / hide feed (called on war start/stop) ──────────────────────
  function show() {
    const wrap = document.getElementById("kill-feed-wrap");
    if (wrap) wrap.classList.add("visible");
  }

  function hide() {
    const wrap = document.getElementById("kill-feed-wrap");
    if (wrap) wrap.classList.remove("visible");
    // Clear feed
    if (container) container.innerHTML = "";
    entries    = [];
    streakKV  = {};
    lastVictim = null;
  }

  window.KillFeed = { onWarAdvance, show, hide };
})();


