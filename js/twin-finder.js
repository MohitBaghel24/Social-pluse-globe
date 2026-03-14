// ============================================================
//  Social Pulse Globe — Twin Finder Module
// ============================================================

(function() {
  // ── CONFIG ──────────────────────────────────────────────────────────
  const QUESTIONS = [
    {
      q: "You see a hilarious video. You...",
      options: [
        { text: "Share it immediately to 3+ platforms", scores: { sharing: 3, binge: 2 } },
        { text: "Send it privately to one friend", scores: { privacy: 2, sharing: 1 } },
        { text: "Watch it again, don't share", scores: { addiction: 2, binge: 1 } },
        { text: "Screenshot and move on", scores: { privacy: 3, addiction: 1 } }
      ]
    },
    {
      q: "Your phone hits 20% battery. You feel...",
      options: [
        { text: "Panic — find charger immediately", scores: { addiction: 3 } },
        { text: "Mild anxiety but manageable", scores: { addiction: 2 } },
        { text: "Slightly inconvenienced", scores: { addiction: 1 } },
        { text: "Fine, honestly relieved", scores: { privacy: 1, addiction: 0 } }
      ]
    },
    {
      q: "You post something. You check likes...",
      options: [
        { text: "Every few minutes for the first hour", scores: { addiction: 3, creation: 2 } },
        { text: "Once after 30 minutes", scores: { creation: 2 } },
        { text: "Once the next day", scores: { passive: 2 } },
        { text: "I rarely post", scores: { privacy: 3 } }
      ]
    },
    {
      q: "You're eating alone at a restaurant. You...",
      options: [
        { text: "Immediately open social media", scores: { addiction: 2, binge: 2 } },
        { text: "Post a photo of the food first", scores: { creation: 3, sharing: 2 } },
        { text: "People-watch instead", scores: { passive: 3 } },
        { text: "Enjoy the silence", scores: { privacy: 3 } }
      ]
    },
    {
      q: "Your daily screen time is roughly...",
      options: [
        { text: "6+ hours", scores: { addiction: 3, binge: 3 } },
        { text: "3-5 hours", scores: { addiction: 2, binge: 1 } },
        { text: "1-2 hours", scores: { creation: 2 } },
        { text: "Under 1 hour", scores: { privacy: 3 } }
      ]
    }
  ];

  // Axis order: Sharing, Addiction, Creation, Privacy, Binge
  const TWIN_PROFILES = [
    { country: "India", iso: "IN", flag: "🇮🇳", lat: 28.6, lng: 77.2, profile: { sharing: 3, addiction: 3, creation: 1, privacy: 0, binge: 2 }, traits: ["High Sharing", "Mobile First"] },
    { country: "Brazil", iso: "BR", flag: "🇧🇷", lat: -23.5, lng: -46.6, profile: { sharing: 3, addiction: 2, creation: 2, privacy: 0, binge: 2 }, traits: ["Social Butterfly", "Visual shaper"] },
    { country: "Japan", iso: "JP", flag: "🇯🇵", lat: 35.7, lng: 139.7, profile: { sharing: 0, addiction: 2, creation: 1, privacy: 1, binge: 3 }, traits: ["Passive Observer", "Deep Dive"] },
    { country: "South Korea", iso: "KR", flag: "🇰🇷", lat: 37.6, lng: 126.9, profile: { sharing: 2, addiction: 2, creation: 3, privacy: 1, binge: 2 }, traits: ["Trend Setter", "Creator"] },
    { country: "Indonesia", iso: "ID", flag: "🇮🇩", lat: -6.2, lng: 106.8, profile: { sharing: 1, addiction: 3, creation: 1, privacy: 2, binge: 2 }, traits: ["Private Circles", "High Usage"] },
    { country: "Germany", iso: "DE", flag: "🇩🇪", lat: 52.5, lng: 13.4, profile: { sharing: 0, addiction: 1, creation: 0, privacy: 3, binge: 0 }, traits: ["Privacy First", "Selective"] },
    { country: "USA", iso: "US", flag: "🇺🇸", lat: 40.7, lng: -74.0, profile: { sharing: 2, addiction: 2, creation: 3, privacy: 0, binge: 1 }, traits: ["Influencer", "Visual Storyteller"] },
    { country: "Nigeria", iso: "NG", flag: "🇳🇬", lat: 6.5, lng: 3.4, profile: { sharing: 1, addiction: 2, creation: 1, privacy: 3, binge: 1 }, traits: ["Direct Messaging", "Community"] },
    { country: "Saudi Arabia", iso: "SA", flag: "🇸🇦", lat: 24.7, lng: 46.6, profile: { sharing: 1, addiction: 3, creation: 1, privacy: 1, binge: 3 }, traits: ["Video Binge", "Heavy User"] },
    { country: "United Kingdom", iso: "GB", flag: "🇬🇧", lat: 51.5, lng: -0.1, profile: { sharing: 2, addiction: 1, creation: 1, privacy: 1, binge: 1 }, traits: ["Balanced", "Connector"] }
  ];

  let currentQ = 0;
  let userScores = { sharing: 0, addiction: 0, creation: 0, privacy: 0, binge: 0 };
  let modal, contentArea;

  // ── INIT ─────────────────────────────────────────────────────────────
  function init() {
    // 1. Create DOM Elements
    const btn = document.createElement("div");
    btn.id = "twin-btn";
    btn.innerHTML = "Find Your Twin 🧬";
    btn.onclick = openModal;
    document.body.appendChild(btn);

    modal = document.createElement("div");
    modal.id = "twin-modal";
    modal.innerHTML = `
      <div id="tm-content">
        <div id="tm-close">✕</div>
        <div id="tm-body"></div>
      </div>
    `;
    document.body.appendChild(modal);

    document.getElementById("tm-close").onclick = closeModal;
  }

  function openModal() {
    modal.classList.add("active");
    startQuiz();
  }

  function closeModal() {
    modal.classList.remove("active");
  }

  // ── QUIZ LOGIC ───────────────────────────────────────────────────────
  function startQuiz() {
    currentQ = 0;
    userScores = { sharing: 0, addiction: 0, creation: 0, privacy: 0, binge: 0 };
    renderQuestion(0);
  }

  function renderQuestion(idx) {
    const q = QUESTIONS[idx];
    const pct = ((idx + 1) / QUESTIONS.length) * 100;
    
    // Animate transition
    const body = document.getElementById("tm-body");
    body.innerHTML = `
      <div class="q-progress"><div class="q-bar" style="width:${pct}%"></div></div>
      <div class="q-step">QUESTION ${idx + 1} OF 5</div>
      <div class="q-text">${q.q}</div>
      <div class="q-options">
        ${q.options.map((opt, i) => `
          <div class="q-card" data-idx="${i}">
            <div class="q-idx">${String.fromCharCode(65+i)}</div>
            <div class="q-val">${opt.text}</div>
          </div>
        `).join('')}
      </div>
    `;

    body.querySelectorAll(".q-card").forEach(el => {
      el.onclick = () => handleAnswer(q.options[el.dataset.idx]);
    });
  }

  function handleAnswer(opt) {
    // Accumulate scores
    Object.keys(opt.scores).forEach(k => {
      userScores[k] = (userScores[k] || 0) + opt.scores[k];
    });

    if (currentQ < QUESTIONS.length - 1) {
      currentQ++;
      renderQuestion(currentQ);
    } else {
      showAnalysis();
    }
  }

  // ── ANALYSIS ─────────────────────────────────────────────────────────
  function showAnalysis() {
    const body = document.getElementById("tm-body");
    body.innerHTML = `
      <div class="an-wrap">
        <div class="an-globe">🌍</div>
        <div class="an-text" id="an-status">Analyzing habits...</div>
        <div class="an-flags" id="an-flags"></div>
      </div>
    `;
    
    // Cycle text
    const texts = ["Analyzing habits...", "Comparing 195 countries...", "Eliminating candidates...", "Match found."];
    let tIdx = 0;
    const tInt = setInterval(() => {
      tIdx++;
      if(tIdx < texts.length) document.getElementById("an-status").textContent = texts[tIdx];
    }, 800);

    // Flags animation
    const flags = ["🇺🇸", "🇯🇵", "🇧🇷", "🇩🇪", "🇦🇺"];
    const flagCon = document.getElementById("an-flags");
    let fIdx = 0;
    const fInt = setInterval(() => {
      if (fIdx < flags.length) {
        const s = document.createElement("span");
        s.textContent = flags[fIdx] + " ✗ ";
        s.style.opacity = 0;
        s.style.animation = "fadeIn 0.2s forwards";
        flagCon.appendChild(s);
        fIdx++;
      }
    }, 500);

    setTimeout(() => {
      clearInterval(tInt);
      clearInterval(fInt);
      calculateResult();
    }, 3000);
  }

  // ── RESULT CALCULATION ───────────────────────────────────────────────
  function calculateResult() {
    // Normalize user scores to 0-3 roughly
    // 5 questions, max score per Q is usually 3 for one trait. But mixed.
    // Let's just find the closest profile by vector distance.
    
    let bestDist = Infinity;
    let twin = null;
    let worstDist = -Infinity;
    let shadow = null;

    TWIN_PROFILES.forEach(p => {
      let dist = 0;
      ["sharing", "addiction", "creation", "privacy", "binge"].forEach(k => {
        // userScores max could be around 9-12 depending on answers
        // profile scores are 0-3 relative scaling
        // Let's normalize user scores to 0-3 range roughly
        // Max possible sharing ~9. Max addiction ~9.
        const uVal = (userScores[k] || 0) / 3; 
        const pVal = p.profile[k];
        dist += Math.pow(uVal - pVal, 2);
      });
      dist = Math.sqrt(dist);
      
      if (dist < bestDist) { bestDist = dist; twin = p; }
      if (dist > worstDist) { worstDist = dist; shadow = p; }
    });

    // Match %
    const matchPct = Math.max(10, Math.round(100 - (bestDist * 15)));

    showResultScreen(twin, shadow, matchPct);
  }

  // ── RESULT SCREEN ────────────────────────────────────────────────────
  function showResultScreen(twin, shadow, pct) {
    const body = document.getElementById("tm-body");
    body.innerHTML = `
      <div id="res-card">
        <div class="res-header">YOUR SOCIAL MEDIA DNA</div>
        <div class="res-match">
          <div class="res-side">
            <div class="res-icon">👤</div>
            <div class="res-lbl">YOU</div>
          </div>
          <div class="res-pct">
            <div class="res-pct-val">${pct}%</div>
            <div class="res-bar"><div class="res-fill" style="width:${pct}%"></div></div>
          </div>
          <div class="res-side">
            <div class="res-icon">${twin.flag}</div>
            <div class="res-lbl">TWIN</div>
          </div>
        </div>
        
        <div class="res-info">
          <div class="res-traits">
            <div class="rt-title">SHARED TRAITS</div>
            <ul>
              ${twin.traits.map(t => `<li>${t}</li>`).join('')}
              <li>Primary: ${Object.keys(twin.profile).reduce((a, b) => twin.profile[a] > twin.profile[b] ? a : b)}</li>
            </ul>
            <div class="rt-shadow">
              <span style="color:#ff4f6d">SHADOW TWIN:</span> ${shadow.flag} ${shadow.country}<br/>
              <span style="font-size:0.55rem;opacity:0.6">Your complete opposite score</span>
            </div>
          </div>
          <div class="res-chart">
            <canvas id="radar-chart" width="160" height="160"></canvas>
          </div>
        </div>

        <div class="res-actions">
           <button class="res-btn sec" id="res-save-btn">📥 Save</button>
           <button class="res-btn pri" id="res-globe-btn">🌍 View on Globe</button>
        </div>
        <div class="res-sub" id="res-retry-btn">🔄 Retake Test</div>
      </div>
    `;

    // Wire buttons via event listeners (avoids inline onclick XSS risk)
    document.getElementById('res-save-btn')?.addEventListener('click', () =>
      window.TwinFinder.download(twin.flag, twin.country, pct));
    document.getElementById('res-globe-btn')?.addEventListener('click', () =>
      window.TwinFinder.goto(twin.iso, twin.lat, twin.lng));
    document.getElementById('res-retry-btn')?.addEventListener('click', () =>
      window.TwinFinder.retry());

    // Draw Radar
    setTimeout(() => drawRadar(twin), 50);
  }

  // ── RADAR CHART ──────────────────────────────────────────────────────
  function drawRadar(twin) {
    const ctx = document.getElementById("radar-chart").getContext("2d");
    const axes = ["sharing", "addiction", "creation", "privacy", "binge"];
    const cx = 80, cy = 80, rad = 70;
    
    // Draw Axis
    ctx.strokeStyle = "rgba(255,255,255,0.1)";
    ctx.beginPath();
    for(let i=0; i<5; i++) {
        const ang = (Math.PI * 2 * i) / 5 - Math.PI/2;
        ctx.moveTo(cx, cy);
        ctx.lineTo(cx + Math.cos(ang)*rad, cy + Math.sin(ang)*rad);
    }
    ctx.stroke();

    // Helper to get point
    const getPt = (val, i) => {
        const ang = (Math.PI * 2 * i) / 5 - Math.PI/2;
        const r = (val / 10) * rad; // normalized assuming max 10
        return [cx + Math.cos(ang)*r, cy + Math.sin(ang)*r];
    };

    // Helper draw shape
    const drawShape = (scores, color, maxVal) => {
        ctx.strokeStyle = color;
        ctx.fillStyle = color.replace("1)", "0.2)");
        ctx.beginPath();
        axes.forEach((k, i) => {
            let v = scores[k];
            // Profile is 0-3, User is 0-9. Normalize to 0-10 scale
            if (maxVal === 3) v = v * 3.3; 
            if (maxVal === 9) v = v * 1.0; 
            const [x, y] = getPt(Math.min(10, v), i); // Cap at 10
            if (i===0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
        });
        ctx.closePath();
        ctx.stroke();
        ctx.fillStyle = color.replace("1)", "0.15)");
        ctx.fill();
    };

    // Twin (Cyan)
    drawShape(twin.profile, "rgba(59, 232, 255, 1)", 3);

    // User (Gold)
    drawShape(userScores, "rgba(201, 255, 59, 1)", 9);
  }

  // ── ACTIONS ──────────────────────────────────────────────────────────
  window.TwinFinder = {
    retry: startQuiz,
    goto: (iso, lat, lng) => {
       closeModal();
       if(window.rotateTo) window.rotateTo(lat, lng);
       if(window.SocialData && window.SocialData.SOCIAL_DATA[iso] && window.PanelModule) {
         setTimeout(() => window.PanelModule.open(iso, window.SocialData.SOCIAL_DATA[iso]), 1500);
       }
    },
    download: (flag, country, pct) => {
       const cvs = document.createElement("canvas");
       cvs.width = 1080; cvs.height = 1920;
       const c = cvs.getContext("2d");
       
       // BG
       c.fillStyle = "#03050e";
       c.fillRect(0,0,1080,1920);
       
       // Text
       c.fillStyle = "#ffffff";
       c.font = "bold 60px sans-serif";
       c.textAlign = "center";
       c.fillText("MY SOCIAL PULSE TWIN", 540, 300);
       
       c.font = "300px sans-serif";
       c.fillText(flag, 540, 700);
       
       c.fillStyle = "#c9ff3b";
       c.font = "bold 120px sans-serif";
       c.fillText(country.toUpperCase(), 540, 900);
       
       c.fillStyle = "#3be8ff";
       c.font = "bold 80px sans-serif";
       c.fillText("MATCH: " + pct + "%", 540, 1100);
       
       c.fillStyle = "rgba(255,255,255,0.5)";
       c.font = "40px monospace";
       c.fillText("socialpulse.ai", 540, 1700);

       // Save
       const link = document.createElement("a");
       link.download = "social-twin.png";
       link.href = cvs.toDataURL();
       link.click();
    }
  };

  // Run
  init();

})();
