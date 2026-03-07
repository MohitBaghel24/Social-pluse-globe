// ============================================================
//  Social Pulse Globe — Animated Star Field (Canvas-based)
// ============================================================

(function initStarField() {
  const canvas = document.getElementById("star-canvas");
  if (!canvas) return;
  const ctx = canvas.getContext("2d");

  let W, H, stars = [], shootingStars = [];
  const STAR_COUNT = 280;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    buildStars();
  }

  function buildStars() {
    stars = Array.from({ length: STAR_COUNT }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      r: Math.random() * 1.6 + 0.2,
      alpha: Math.random() * 0.7 + 0.3,
      speed: Math.random() * 0.3 + 0.05,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      twinkleSpeed: Math.random() * 0.008 + 0.002,
    }));
  }

  function spawnShootingStar() {
    shootingStars.push({
      x: Math.random() * W,
      y: Math.random() * H * 0.5,
      len: Math.random() * 120 + 60,
      speed: Math.random() * 8 + 6,
      alpha: 1,
      angle: Math.PI / 5,
      life: 1,
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    // Nebula glow blobs
    const nebulaData = [
      { x: W * 0.15, y: H * 0.25, r: W * 0.2, c: "rgba(0,80,180,0.06)" },
      { x: W * 0.85, y: H * 0.6,  r: W * 0.18, c: "rgba(0,180,160,0.05)" },
      { x: W * 0.5,  y: H * 0.1,  r: W * 0.12, c: "rgba(120,0,200,0.04)" },
    ];
    nebulaData.forEach(({ x, y, r, c }) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, c);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.beginPath();
      ctx.arc(x, y, r, 0, Math.PI * 2);
      ctx.fill();
    });

    // Stars
    stars.forEach(s => {
      s.alpha += s.twinkleDir * s.twinkleSpeed;
      if (s.alpha > 1)   { s.alpha = 1;   s.twinkleDir = -1; }
      if (s.alpha < 0.1) { s.alpha = 0.1; s.twinkleDir =  1; }

      ctx.beginPath();
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(200,230,255,${s.alpha})`;
      ctx.fill();
    });

    // Shooting stars
    shootingStars = shootingStars.filter(s => s.life > 0);
    shootingStars.forEach(s => {
      const dx = Math.cos(s.angle) * s.speed;
      const dy = Math.sin(s.angle) * s.speed;
      s.x += dx; s.y += dy;
      s.life -= 0.016;
      s.alpha = s.life;

      const grad = ctx.createLinearGradient(s.x, s.y, s.x - Math.cos(s.angle)*s.len, s.y - Math.sin(s.angle)*s.len);
      grad.addColorStop(0, `rgba(255,255,255,${s.alpha})`);
      grad.addColorStop(1, "rgba(255,255,255,0)");
      ctx.beginPath();
      ctx.moveTo(s.x, s.y);
      ctx.lineTo(s.x - Math.cos(s.angle)*s.len, s.y - Math.sin(s.angle)*s.len);
      ctx.strokeStyle = grad;
      ctx.lineWidth = 1.5;
      ctx.stroke();
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener("resize", resize);
  resize();
  draw();

  // Spawn shooting stars periodically
  setInterval(spawnShootingStar, 3500);
  setTimeout(spawnShootingStar, 800);
})();


