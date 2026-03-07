// ============================================================
//  Social Pulse Globe — Auto-Refresh Module
// ============================================================

(function () {
  const INTERVAL_MS  = 30 * 60 * 1000;  // 30 minutes
  const TS_KEY       = "spg_last_fetch";

  const tsEl     = document.getElementById("last-updated-text");
  const refreshBtn = document.getElementById("refresh-btn");

  function updateTimestamp() {
    const last = parseInt(localStorage.getItem(TS_KEY) || "0", 10);
    if (!last) { tsEl.textContent = "Just now"; return; }
    const diff = Math.floor((Date.now() - last) / 60000);
    if (diff < 1)   tsEl.textContent = "Just now";
    else if (diff < 60) tsEl.textContent = `${diff} min ago`;
    else tsEl.textContent = `${Math.floor(diff / 60)}h ago`;
  }

  function doRefresh(manual = false) {
    localStorage.setItem(TS_KEY, String(Date.now()));
    updateTimestamp();

    // Refresh globe colours
    if (window.GlobeModule?.refresh) window.GlobeModule.refresh();

    // Refresh ticker
    if (window.TickerModule?.load) window.TickerModule.load();

    if (manual) {
      refreshBtn.classList.add("spinning");
      setTimeout(() => refreshBtn.classList.remove("spinning"), 1800);

      // Toast notification
      showToast("Data refreshed ✓");
    }
  }

  function showToast(msg) {
    const t = document.getElementById("toast");
    t.textContent = msg;
    t.classList.add("show");
    setTimeout(() => t.classList.remove("show"), 2800);
  }

  refreshBtn.addEventListener("click", () => doRefresh(true));

  // Live timestamp counter
  setInterval(updateTimestamp, 30000);

  // Auto-refresh every 30 min
  setInterval(() => doRefresh(false), INTERVAL_MS);

  // On load: refresh if stale (> 30 min since last fetch)
  const last = parseInt(localStorage.getItem(TS_KEY) || "0", 10);
  if (!last || Date.now() - last > INTERVAL_MS) {
    doRefresh(false);
  } else {
    updateTimestamp();
  }

  window.RefreshModule = { doRefresh, showToast };
})();


