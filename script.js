const TARGET_URL = "https://www.example.com";
const dpr = Math.max(1, window.devicePixelRatio || 1);
const bgCanvas = document.getElementById("bg");
const taurusCanvas = document.getElementById("taurus");
const goBtn = document.getElementById("go");
function sizeCanvas(c) {
  const w = window.innerWidth;
  const h = window.innerHeight;
  c.width = Math.floor(w * dpr);
  c.height = Math.floor(h * dpr);
  c.style.width = w + "px";
  c.style.height = h + "px";
}
sizeCanvas(bgCanvas);
sizeCanvas(taurusCanvas);
window.addEventListener("resize", () => {
  sizeCanvas(bgCanvas);
  sizeCanvas(taurusCanvas);
  initBackground();
  initTaurus();
});
goBtn.addEventListener("click", () => {
  window.location.href = TARGET_URL;
});
let bgParticles = [];
function initBackground() {
  const w = bgCanvas.width;
  const h = bgCanvas.height;
  const area = w * h;
  const count = Math.max(120, Math.min(300, Math.floor(area / (14000 * dpr))));
  bgParticles = Array.from({ length: count }, () => {
    const speed = 0.05 + Math.random() * 0.12;
    return {
      x: Math.random() * w,
      y: Math.random() * h,
      vx: (Math.random() - 0.5) * speed * dpr,
      vy: (Math.random() - 0.5) * speed * dpr,
      r: 0.6 * dpr + Math.random() * (1.6 * dpr),
      a: 0.15 + Math.random() * 0.15
    };
  });
}
initBackground();
function drawBackground(ctx) {
  ctx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  for (let p of bgParticles) {
    p.x += p.vx;
    p.y += p.vy;
    if (p.x < 0) p.x = bgCanvas.width;
    if (p.x > bgCanvas.width) p.x = 0;
    if (p.y < 0) p.y = bgCanvas.height;
    if (p.y > bgCanvas.height) p.y = 0;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${p.a})`;
    ctx.fill();
  }
}
let taurusPoints = [];
function sampleCircle(cx, cy, r, n) {
  const pts = [];
  for (let i = 0; i < n; i++) {
    const t = (i / n) * Math.PI * 2;
    pts.push([cx + Math.cos(t) * r, cy + Math.sin(t) * r]);
  }
  return pts;
}
function sampleArc(cx, cy, rx, ry, startRad, endRad, n) {
  const pts = [];
  for (let i = 0; i <= n; i++) {
    const t = startRad + (endRad - startRad) * (i / n);
    pts.push([cx + Math.cos(t) * rx, cy + Math.sin(t) * ry]);
  }
  return pts;
}
function initTaurus() {
  const w = taurusCanvas.width;
  const h = taurusCanvas.height;
  const cx = w / 2;
  const cy = h / 2 + 24 * dpr;
  const base = Math.min(w, h) * 0.18;
  const circleR = base;
  const circlePts = sampleCircle(cx, cy, circleR, Math.floor(400 * dpr));
  const hornOffsetY = cy - circleR * 0.9;
  const leftHornCx = cx - circleR * 0.8;
  const rightHornCx = cx + circleR * 0.8;
  const hornRx = circleR * 0.85;
  const hornRy = circleR * 0.55;
  const leftHorn = sampleArc(leftHornCx, hornOffsetY, hornRx, hornRy, Math.PI * 0.55, Math.PI * 1.15, Math.floor(200 * dpr));
  const rightHorn = sampleArc(rightHornCx, hornOffsetY, hornRx, hornRy, Math.PI * -0.15, Math.PI * 0.45, Math.floor(200 * dpr));
  const pts = circlePts.concat(leftHorn).concat(rightHorn);
  taurusPoints = pts.map(([x, y]) => ({
    x,
    y,
    r: 1.3 * dpr + Math.random() * (1.1 * dpr),
    a0: 0.55 + Math.random() * 0.25,
    f: Math.random() * Math.PI * 2,
    s: 0.5 + Math.random() * 1.2
  }));
}
initTaurus();
function drawTaurus(ctx, t) {
  ctx.clearRect(0, 0, taurusCanvas.width, taurusCanvas.height);
  for (let p of taurusPoints) {
    const a = p.a0 * (0.7 + 0.3 * Math.sin(t * 0.001 * p.s + p.f));
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(255,255,255,${a})`;
    ctx.fill();
  }
}
const bgCtx = bgCanvas.getContext("2d");
const taurusCtx = taurusCanvas.getContext("2d");
function frame(ts) {
  drawBackground(bgCtx);
  drawTaurus(taurusCtx, ts);
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
