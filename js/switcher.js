// ============================================================
//  Social Pulse Globe — Platform Switcher Toolbar
//  Keyboard shortcuts: 1=All 2=Facebook 3=Instagram 4=YouTube
//                      5=TikTok 6=WhatsApp 7=X 8=WeChat 9=Snapchat
// ============================================================

(function () {
  const PLATFORMS = [
    { key: "ALL",       label: "All",       icon: "🌐", color: "#00f5ff", shortcut: "1" },
    { key: "Facebook",  label: "Facebook",  icon: "📘", color: "#1877F2", shortcut: "2" },
    { key: "Instagram", label: "Instagram", icon: "📸", color: "#E4405F", shortcut: "3" },
    { key: "YouTube",   label: "YouTube",   icon: "▶️", color: "#FF0000", shortcut: "4" },
    { key: "TikTok",    label: "TikTok",    icon: "🎵", color: "#69C9D0", shortcut: "5" },
    { key: "WhatsApp",  label: "WhatsApp",  icon: "💬", color: "#25D366", shortcut: "6" },
    { key: "X/Twitter", label: "X",         icon: "✕",  color: "#1DA1F2", shortcut: "7" },
    { key: "WeChat",    label: "WeChat",    icon: "💚", color: "#07C160", shortcut: "8" },
    { key: "Snapchat",  label: "Snapchat",  icon: "👻", color: "#FFFC00", shortcut: "9" },
  ];

  let activePlatformKey = "ALL";

  // ── Build toolbar ────────────────────────────────────────────────────
  const toolbar = document.getElementById("platform-toolbar");

  PLATFORMS.forEach(({ key, label, icon, color, shortcut }) => {
    const btn = document.createElement("button");
    btn.className  = "plat-btn" + (key === "ALL" ? " active" : "");
    btn.dataset.platform = key;
    btn.title      = `${label} (press ${shortcut})`;
    btn.setAttribute("aria-pressed", key === "ALL" ? "true" : "false");
    btn.style.setProperty("--pc", color);

    btn.innerHTML = `<span class="plat-icon">${icon}</span><span class="plat-label">${label}</span><span class="plat-shortcut">${shortcut}</span>`;

    btn.addEventListener("click", () => activate(key));
    toolbar.appendChild(btn);
  });

  // ── Activate ─────────────────────────────────────────────────────────
  function activate(key) {
    if (key === activePlatformKey) return;
    activePlatformKey = key;

    // Update button states
    toolbar.querySelectorAll(".plat-btn").forEach(b => {
      const isActive = b.dataset.platform === key;
      b.classList.toggle("active", isActive);
      b.setAttribute("aria-pressed", String(isActive));
    });

    // Trigger globe recolor with transition
    if (window.GlobeModule?.setPlatform) {
      window.GlobeModule.setPlatform(key);
    }

    // Update legend label
    const legendTitle = document.querySelector(".legend-title");
    if (legendTitle) {
      const match = PLATFORMS.find(p => p.key === key);
      legendTitle.textContent = key === "ALL"
        ? "Social Media Users"
        : `${match?.label || key} Users`;
    }
  }

  // ── Keyboard shortcuts 1-9 ───────────────────────────────────────────
  document.addEventListener("keydown", (e) => {
    // ignore if user is typing in an input
    if (e.target.tagName === "INPUT" || e.target.tagName === "TEXTAREA") return;
    const idx = parseInt(e.key, 10) - 1;
    if (idx >= 0 && idx < PLATFORMS.length) {
      activate(PLATFORMS[idx].key);
    }
  });

  window.SwitcherModule = { activate, PLATFORMS };
})();


