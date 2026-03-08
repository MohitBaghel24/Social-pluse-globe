// ============================================================
//  Social Pulse Globe — Trending Ticker (static, no API calls)
// ============================================================

(function () {
  const tickerTrack = document.getElementById("ticker-track");
  if (!tickerTrack) return;   // ticker bar not present — abort silently

  function buildFallbackItems() {
    return [
      { title: "Global social media usage hits new record in 2026",            flag: "🌍", label: "World" },
      { title: "AI-generated content surges across all platforms",              flag: "💻", label: "Tech"  },
      { title: "Short-form video dominates mobile engagement",                  flag: "🌍", label: "World" },
      { title: "WhatsApp introduces encrypted group stories",                   flag: "💬", label: "Tech"  },
      { title: "TikTok reaches 2 billion monthly active users",                 flag: "🎵", label: "World" },
      { title: "X/Twitter usage rebounds in Europe and LATAM",                 flag: "🐦", label: "Tech"  },
      { title: "YouTube Shorts surpasses Netflix in daily watch time",          flag: "▶", label: "Tech"  },
      { title: "Instagram rolls out AI avatar DMs globally",                    flag: "📸", label: "Tech"  },
      { title: "Meta reports record ad revenue driven by AI targeting",         flag: "📘", label: "World" },
      { title: "Snapchat AR glasses OS ships to enterprise developers",         flag: "👻", label: "Tech"  },
      { title: "LinkedIn crosses 1.1B registered members milestone",            flag: "💼", label: "World" },
      { title: "BeReal acquisition: platform pivots to social aggregator",      flag: "📷", label: "Tech"  },
      { title: "Pinterest AI shopping engine drives 40% revenue uplift",        flag: "📌", label: "Tech"  },
      { title: "Telegram Premium hits 10M subscribers worldwide",               flag: "✈", label: "World" },
      { title: "Social commerce global GMV forecast at $1.3 trillion for 2026", flag: "🛍", label: "World" },
    ];
  }

  function renderItems(items) {
    // Duplicate for seamless loop
    const all = [...items, ...items];
    tickerTrack.innerHTML = all
      .map(item => `
        <span class="ticker-item">
          <span class="ticker-flag">${item.flag}</span>
          <span class="ticker-label">${item.label}</span>
          <span class="ticker-title">${item.title.length > 90 ? item.title.slice(0, 88) + "\u2026" : item.title}</span>
        </span>
      `)
      .join('<span class="ticker-sep">\u25C6</span>');

    const dur = Math.max(30, items.length * 11);
    tickerTrack.style.animationDuration = `${dur}s`;
  }

  // Render immediately with static items — no network call needed
  renderItems(buildFallbackItems());

  window.TickerModule = { buildFallbackItems };
})();


