// ============================================================
//  Social Pulse Globe — Side Panel Module (Chart.js)
// ============================================================

(function () {
  const { PLATFORM_COLORS } = window.SocialData;

  let chartInstance = null;
  let currentOpen = null;

  const panel      = document.getElementById("side-panel");
  const closeBtn   = document.getElementById("panel-close");
  const overlay    = document.getElementById("panel-overlay");

  closeBtn.addEventListener("click", close);
  overlay.addEventListener("click", close);

  function open(iso2, data) {
    if (currentOpen === iso2) { close(); return; }
    currentOpen = iso2;

    // Graceful fallback when no social data exists for this country
    if (!data) {
      document.getElementById("panel-flag").src = `https://flagcdn.com/w80/${iso2.toLowerCase()}.png`;
      document.getElementById("panel-flag").alt  = iso2;
      document.getElementById("panel-country").textContent = iso2;
      document.getElementById("panel-total").innerHTML =
        `<span class="total-label" style="color:var(--muted)">No social media data available for this region.</span>`;
      document.getElementById("panel-trending").innerHTML = "";
      document.getElementById("ai-insight-body").textContent = "";
      if (chartInstance) { chartInstance.destroy(); chartInstance = null; }
      document.getElementById("panel-chart").getContext("2d").clearRect(0, 0, 999, 999);
      panel.classList.add("open");
      overlay.classList.add("show");
      return;
    }

    // Flag
    document.getElementById("panel-flag").src = `https://flagcdn.com/w80/${iso2.toLowerCase()}.png`;
    document.getElementById("panel-flag").alt  = data.name;

    // Country name + total
    document.getElementById("panel-country").textContent = data.name;
    document.getElementById("panel-total").innerHTML =
      `<span class="total-num">${data.totalUsers.toLocaleString()}M</span><br/><span class="total-label">Total Social Media Users</span>`;

    // Bar chart
    buildChart(data.platforms);

    // Trending pills
    const pills = document.getElementById("panel-trending");
    pills.innerHTML = data.trending
      .slice(0, 5)
      .map(t => `<span class="trend-pill">${t}</span>`)
      .join("");

    // Slide in
    panel.classList.add("open");
    overlay.classList.add("show");

    // Load trending sidebar data for this country
    if (window.TrendingSidebar) window.TrendingSidebar.load(iso2, data);

    // Hide the globe hover tooltip while panel is open
    const tt = document.getElementById("globe-tooltip");
    if (tt) tt.style.display = "none";

    // AI insight (async, non-blocking)
    const aiBody = document.getElementById("ai-insight-body");
    if (aiBody) aiBody.innerHTML = ""; // clear previous
    if (window.AIInsight) window.AIInsight.load(iso2, data);
  }

  function close() {
    currentOpen = null;
    panel.classList.remove("open");
    overlay.classList.remove("show");
    if (window.TrendingSidebar) window.TrendingSidebar.reset();
    if (window.GlobeModule) {
      window.GlobeModule.resumeRotation?.();
      // Sync mouse-tracking base so globe restarts from current position
      const gm = window.GlobeModule;
      if (gm.syncMouseBase) gm.syncMouseBase();
    }
  }

  function buildChart(platforms) {
    const canvas = document.getElementById("panel-chart");
    const ctx    = canvas.getContext("2d");

    if (chartInstance) { chartInstance.destroy(); chartInstance = null; }

    const sorted  = Object.entries(platforms).sort((a, b) => b[1] - a[1]);
    const labels  = sorted.map(([k]) => k);
    const values  = sorted.map(([, v]) => v);
    const colors  = labels.map(l => PLATFORM_COLORS[l] || PLATFORM_COLORS.Default);

    chartInstance = new Chart(ctx, {
      type: "bar",
      data: {
        labels,
        datasets: [{
          label: "Users (M)",
          data: values,
          backgroundColor: colors.map(c => c + "cc"),
          borderColor: colors,
          borderWidth: 1.5,
          borderRadius: 6,
          borderSkipped: false,
        }],
      },
      options: {
        indexAxis: "y",
        responsive: true,
        maintainAspectRatio: false,
        animation: { duration: 700, easing: "easeOutQuart" },
        plugins: {
          legend: { display: false },
          tooltip: {
            backgroundColor: "rgba(10,10,30,0.9)",
            titleColor: "#00f5ff",
            bodyColor: "#e0e0ff",
            borderColor: "#00f5ff44",
            borderWidth: 1,
            callbacks: {
              label: ctx => ` ${ctx.raw}M users`,
            },
          },
        },
        scales: {
          x: {
            ticks: { color: "#8090b0", font: { size: 11 } },
            grid:  { color: "rgba(0,200,255,0.06)" },
            border: { color: "rgba(0,200,255,0.1)" },
          },
          y: {
            ticks: { color: "#c0d0f0", font: { family: "'DM Sans', sans-serif", size: 12 } },
            grid:  { display: false },
            border: { display: false },
          },
        },
      },
    });
  }

  window.PanelModule = { open, close };
})();


