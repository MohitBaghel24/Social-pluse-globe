// ============================================================
//  Social Pulse Globe — AI Insight Module (keyless, instant)
//  Generates 2-sentence insights from SOCIAL_DATA locally.
// ============================================================

(function () {
  const CACHE_PREFIX = "spg_insight_";

  // ── Typewriter effect ─────────────────────────────────────────────────
  function typewrite(el, text, speedMs = 22) {
    el.textContent = "";
    el.classList.add("typewriter-active");
    let i = 0;
    const tick = () => {
      if (i < text.length) {
        el.textContent += text[i++];
        setTimeout(tick, speedMs);
      } else {
        el.classList.remove("typewriter-active");
        el.classList.add("typewriter-done");
      }
    };
    tick();
  }

  // ── Skeleton loader ───────────────────────────────────────────────────
  function showSkeleton(container) {
    container.innerHTML = `
      <div class="ai-skeleton">
        <div class="ai-skel-line ai-skel-line--80"></div>
        <div class="ai-skel-line ai-skel-line--100"></div>
        <div class="ai-skel-line ai-skel-line--65"></div>
        <div class="ai-analyzing">
          <span class="ai-pulse-dot"></span>
          <span>Analyzing…</span>
        </div>
      </div>`;
  }

  function showText(container, text) {
    container.innerHTML = `<p id="ai-insight-text" class="ai-insight-text"></p>`;
    typewrite(container.querySelector("#ai-insight-text"), text);
  }

  // ── Local insight generator ───────────────────────────────────────────
  function generateInsight(iso2, data) {
    const sorted = Object.entries(data.platforms || {})
      .filter(([, v]) => v > 0)
      .sort((a, b) => b[1] - a[1]);

    if (!sorted.length) {
      return `${data.name} has emerging social media adoption still gaining momentum. Watch this space as connectivity infrastructure continues to grow.`;
    }

    const [topPlatform, topVal] = sorted[0];
    const [second, secondVal]   = sorted[1] || ["", 0];
    const [third]               = sorted[2] || [""];
    const total                 = sorted.reduce((s, [, v]) => s + v, 0);
    const topShare              = Math.round((topVal / total) * 100);
    const trending              = (data.trending || []).slice(0, 2).join(" and ");

    // Sentence 1 — dominant platform + share
    const s1Options = [
      `${data.name}'s social media landscape is anchored by ${topPlatform} at ${topVal}M users, commanding ${topShare}% of the country's total online social activity.`,
      `With ${topVal}M active users, ${topPlatform} dominates ${data.name}'s digital conversation, capturing roughly ${topShare}% of every social-media minute spent in the country.`,
      `${topPlatform} leads ${data.name}'s social scene with ${topVal}M users — a ${topShare}% market grip that reflects the platform's deep cultural resonance.`,
    ];

    // Sentence 2 — secondary platforms or trending topics
    let s2;
    if (second && secondVal > 0 && trending) {
      s2 = `${second} (${secondVal}M)${third ? ` and ${third}` : ""} round out the top platforms, while trending conversations around ${trending} highlight the country's fast-evolving digital pulse.`;
    } else if (second && secondVal > 0) {
      s2 = `${second} follows with ${secondVal}M users${third ? `, and ${third} makes a strong third` : ""}, painting a diverse multi-platform ecosystem unique to the region.`;
    } else if (trending) {
      s2 = `Trending topics around ${trending} showcase how ${data.name}'s online communities are shaping real-world discourse beyond borders.`;
    } else {
      s2 = `The country's concentrated social graph suggests strong platform loyalty, with users deeply invested in a single digital community rather than spreading attention thin.`;
    }

    const s1 = s1Options[(iso2.charCodeAt(0) + (iso2.charCodeAt(1) || 0)) % s1Options.length];
    return `${s1} ${s2}`;
  }

  // ── Public entry point ────────────────────────────────────────────────
  async function load(iso2, data) {
    const container = document.getElementById("ai-insight-body");
    if (!container) return;

    // Check session cache
    const cacheKey = CACHE_PREFIX + iso2;
    const cached   = sessionStorage.getItem(cacheKey);
    if (cached) { showText(container, cached); return; }

    // Show skeleton for a realistic feel
    showSkeleton(container);
    await new Promise(r => setTimeout(r, 800));

    const text = generateInsight(iso2, data);
    sessionStorage.setItem(cacheKey, text);
    showText(container, text);
  }

  window.AIInsight = { load };
})();


