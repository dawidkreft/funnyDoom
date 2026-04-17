// Pre-rendered sprite canvases — cartoon characters drawn with Canvas 2D primitives
// 64×64 RGBA; transparency creates non-rectangular shapes.

const S = 64;

function make() {
  const c = document.createElement('canvas');
  c.width = S; c.height = S;
  return c;
}

function eye(ctx, cx, cy, rx, ry, angle = 0) {
  ctx.fillStyle = '#fff';
  ctx.beginPath();
  ctx.ellipse(cx, cy, rx, ry, angle, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#1a1a2e';
  ctx.beginPath();
  ctx.ellipse(cx + rx * 0.15, cy + ry * 0.1, rx * 0.5, ry * 0.55, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = 'rgba(255,255,255,0.8)';
  ctx.beginPath();
  ctx.ellipse(cx + rx * 0.4, cy - ry * 0.3, rx * 0.2, ry * 0.2, 0, 0, Math.PI * 2);
  ctx.fill();
}

// ── POTATO ────────────────────────────────────────────────────────────────────
function drawPotato() {
  const c = make(); const ctx = c.getContext('2d');
  ctx.fillStyle = 'rgba(0,0,0,0.18)';
  ctx.beginPath(); ctx.ellipse(32, 61, 18, 4, 0, 0, Math.PI*2); ctx.fill();
  ctx.fillStyle = '#c8a44b';
  ctx.beginPath();
  ctx.moveTo(14,42); ctx.bezierCurveTo(10,24,18,8,32,8);
  ctx.bezierCurveTo(46,8,56,20,54,38); ctx.bezierCurveTo(56,52,46,60,32,58);
  ctx.bezierCurveTo(18,60,12,54,14,42); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#8b5e15'; ctx.lineWidth=2.5; ctx.stroke();
  ctx.fillStyle='#b8903a';
  ctx.beginPath(); ctx.ellipse(20,44,4,3,-0.5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(44,36,3,2,0.3,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#5a3a00'; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(16,24); ctx.lineTo(28,28); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(36,28); ctx.lineTo(48,24); ctx.stroke();
  eye(ctx,23,32,7,8,-0.15); eye(ctx,41,32,7,8,0.15);
  ctx.strokeStyle='#5a3a00'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(32,48,9,0.25,Math.PI-0.25); ctx.stroke();
  ctx.strokeStyle='#c8a44b'; ctx.lineWidth=5;
  ctx.beginPath(); ctx.moveTo(14,38); ctx.lineTo(4,30); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(50,38); ctx.lineTo(60,30); ctx.stroke();
  return c;
}

// ── DONUT ─────────────────────────────────────────────────────────────────────
function drawDonut() {
  const c = make(); const ctx = c.getContext('2d');
  ctx.fillStyle='rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(32,60,20,5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#d4854a';
  ctx.beginPath(); ctx.arc(32,32,26,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#a0522d'; ctx.lineWidth=2; ctx.stroke();
  ctx.fillStyle='#ff9fc8';
  ctx.beginPath(); ctx.ellipse(32,29,22,14,0,0,Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation='destination-out';
  ctx.beginPath(); ctx.arc(32,32,10,0,Math.PI*2); ctx.fill();
  ctx.globalCompositeOperation='source-over';
  [['#f44336',19,19,0.4],['#4caf50',38,18,0.2],['#2196f3',45,25,0.7],
   ['#ffeb3b',24,30,0.1],['#9c27b0',41,33,0.5],['#ff5722',29,14,0.9]]
  .forEach(([col,x,y,rot]) => {
    ctx.save(); ctx.translate(x,y); ctx.rotate(rot);
    ctx.fillStyle=col; ctx.fillRect(-5,-1.5,10,3); ctx.restore();
  });
  eye(ctx,24,22,5,6); eye(ctx,40,22,5,6);
  ctx.strokeStyle='#a0522d'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(32,27,6,0.1,Math.PI-0.1); ctx.stroke();
  return c;
}

// ── CACTUS ────────────────────────────────────────────────────────────────────
function drawCactus() {
  const c = make(); const ctx = c.getContext('2d');
  const G='#4caf50', D='#2e7d32';
  ctx.fillStyle='rgba(0,0,0,0.15)';
  ctx.beginPath(); ctx.ellipse(32,62,12,4,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle=G;
  ctx.beginPath(); ctx.roundRect(12,26,10,18,5); ctx.fill();
  ctx.strokeStyle=D; ctx.lineWidth=1.5; ctx.stroke();
  ctx.beginPath(); ctx.roundRect(12,26,18,10,5); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(42,20,10,22,5); ctx.fill(); ctx.stroke();
  ctx.beginPath(); ctx.roundRect(34,20,18,10,5); ctx.fill(); ctx.stroke();
  ctx.fillStyle=G;
  ctx.beginPath(); ctx.roundRect(22,6,20,56,8); ctx.fill();
  ctx.strokeStyle=D; ctx.lineWidth=2; ctx.stroke();
  ctx.strokeStyle='#fff'; ctx.lineWidth=1.5; ctx.lineCap='round';
  [[22,18],[42,14],[22,30],[42,32],[22,44],[42,46]].forEach(([x,y]) => {
    const dx=x<32?-6:6;
    ctx.beginPath(); ctx.moveTo(x,y); ctx.lineTo(x+dx,y-3); ctx.stroke();
  });
  eye(ctx,26,28,4,5); eye(ctx,38,28,4,5);
  ctx.strokeStyle=D; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(32,38,6,0.2,Math.PI-0.2); ctx.stroke();
  return c;
}

// ── FROG (boss) ───────────────────────────────────────────────────────────────
function drawFrog() {
  const c = make(); const ctx = c.getContext('2d');
  const G='#66bb6a', D='#388e3c';
  ctx.fillStyle='rgba(0,0,0,0.2)';
  ctx.beginPath(); ctx.ellipse(32,63,24,6,0,0,Math.PI*2); ctx.fill();
  // back legs
  ctx.fillStyle=G;
  ctx.beginPath(); ctx.ellipse(10,52,10,7,-0.5,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(54,52,10,7,0.5,0,Math.PI*2); ctx.fill();
  // body
  ctx.fillStyle=G;
  ctx.beginPath(); ctx.ellipse(32,36,26,24,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=D; ctx.lineWidth=2; ctx.stroke();
  // belly
  ctx.fillStyle='#a5d6a7';
  ctx.beginPath(); ctx.ellipse(32,40,16,14,0,0,Math.PI*2); ctx.fill();
  // bulging eyes on top
  ctx.fillStyle=G;
  ctx.beginPath(); ctx.ellipse(18,16,10,10,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle=D; ctx.lineWidth=2; ctx.stroke();
  ctx.beginPath(); ctx.ellipse(46,16,10,10,0,0,Math.PI*2); ctx.fill(); ctx.stroke();
  eye(ctx,18,16,6,7); eye(ctx,46,16,6,7);
  // big mouth/smile
  ctx.strokeStyle=D; ctx.lineWidth=3;
  ctx.beginPath(); ctx.arc(32,42,14,0.05,Math.PI-0.05); ctx.stroke();
  // teeth
  ctx.fillStyle='#fff';
  ctx.fillRect(22,42,5,5); ctx.fillRect(30,42,5,5); ctx.fillRect(38,42,5,5);
  // small arms
  ctx.strokeStyle=G; ctx.lineWidth=4; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(8,32); ctx.lineTo(2,24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(56,32); ctx.lineTo(62,24); ctx.stroke();
  return c;
}

// ── CLOUD ─────────────────────────────────────────────────────────────────────
function drawCloud() {
  const c = make(); const ctx = c.getContext('2d');
  ctx.fillStyle='rgba(0,0,0,0.12)';
  ctx.beginPath(); ctx.ellipse(32,60,22,5,0,0,Math.PI*2); ctx.fill();
  // Fluffy cloud shape
  ctx.fillStyle='#e0e0e0';
  ctx.beginPath(); ctx.arc(32,34,20,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(18,38,14,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(46,38,14,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(22,28,12,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(42,28,12,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.arc(32,24,10,0,Math.PI*2); ctx.fill();
  // Sad face
  eye(ctx,24,34,5,6); eye(ctx,40,34,5,6);
  // Tears
  ctx.fillStyle='#90caf9';
  ctx.beginPath(); ctx.ellipse(24,45,2,5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(40,45,2,5,0,0,Math.PI*2); ctx.fill();
  // Sad mouth
  ctx.strokeStyle='#9e9e9e'; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(32,48,8,Math.PI+0.3,-0.3); ctx.stroke();
  return c;
}

// ── PROJECTILE SPRITES ───────────────────────────────────────────────────────

function drawBalloon() {
  const c = make(); const ctx = c.getContext('2d');
  // Gradient balloon
  const g = ctx.createRadialGradient(26,18,2,32,28,20);
  g.addColorStop(0,'#ff8a50'); g.addColorStop(1,'#e64a19');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.ellipse(32,26,18,22,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#bf360c'; ctx.lineWidth=1.5; ctx.stroke();
  // Shine
  ctx.fillStyle='rgba(255,255,255,0.4)';
  ctx.beginPath(); ctx.ellipse(24,18,6,8,-0.3,0,Math.PI*2); ctx.fill();
  // Knot
  ctx.fillStyle='#e64a19';
  ctx.beginPath(); ctx.ellipse(32,49,3,3,0,0,Math.PI*2); ctx.fill();
  // String
  ctx.strokeStyle='#bbb'; ctx.lineWidth=1.5;
  ctx.beginPath();
  ctx.moveTo(32,52); ctx.bezierCurveTo(28,56,36,58,32,62); ctx.stroke();
  return c;
}

function drawIceCream() {
  const c = make(); const ctx = c.getContext('2d');
  // Scoop
  const g = ctx.createRadialGradient(28,22,2,32,26,20);
  g.addColorStop(0,'#81d4fa'); g.addColorStop(1,'#0288d1');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.arc(32,26,20,Math.PI,0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#01579b'; ctx.lineWidth=1.5; ctx.stroke();
  // Frozen sparkles
  ctx.fillStyle='rgba(255,255,255,0.7)';
  [[22,20],[38,18],[32,14],[26,28],[42,28]].forEach(([x,y]) => {
    ctx.beginPath(); ctx.arc(x,y,2,0,Math.PI*2); ctx.fill();
  });
  // Cone
  ctx.fillStyle='#ffe0b2';
  ctx.beginPath(); ctx.moveTo(16,26); ctx.lineTo(32,60); ctx.lineTo(48,26); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#ff8f00'; ctx.lineWidth=1.5; ctx.stroke();
  // Waffle pattern
  ctx.strokeStyle='rgba(255,143,0,0.4)'; ctx.lineWidth=1;
  for(let i=0;i<4;i++){ ctx.beginPath(); ctx.moveTo(18+i*7,26); ctx.lineTo(26+i*6,56); ctx.stroke(); }
  ctx.beginPath(); ctx.moveTo(18,36); ctx.lineTo(46,36); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20,46); ctx.lineTo(44,46); ctx.stroke();
  return c;
}

function drawPlushie() {
  const c = make(); const ctx = c.getContext('2d');
  // Soft bear head
  const g = ctx.createRadialGradient(28,24,2,32,32,24);
  g.addColorStop(0,'#e1bee7'); g.addColorStop(1,'#9c27b0');
  ctx.fillStyle=g;
  // Ears
  ctx.beginPath(); ctx.ellipse(16,16,10,10,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(48,16,10,10,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='#f48fb1';
  ctx.beginPath(); ctx.ellipse(16,16,6,6,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(48,16,6,6,0,0,Math.PI*2); ctx.fill();
  // Head
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.ellipse(32,34,24,22,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#7b1fa2'; ctx.lineWidth=1.5; ctx.stroke();
  // Face
  eye(ctx,23,30,6,7); eye(ctx,41,30,6,7);
  ctx.fillStyle='#f48fb1';
  ctx.beginPath(); ctx.ellipse(32,42,8,5,0,0,Math.PI*2); ctx.fill();
  // Smile
  ctx.strokeStyle='#7b1fa2'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(32,44,5,0.1,Math.PI-0.1); ctx.stroke();
  // Stitch pattern
  ctx.strokeStyle='rgba(255,255,255,0.35)'; ctx.lineWidth=1; ctx.setLineDash([3,3]);
  ctx.beginPath(); ctx.ellipse(32,34,16,14,0,0,Math.PI*2); ctx.stroke();
  ctx.setLineDash([]);
  return c;
}

function drawStink() {
  const c = make(); const ctx = c.getContext('2d');
  // Puffs of toxic gas
  const g = ctx.createRadialGradient(32,32,2,32,32,28);
  g.addColorStop(0,'rgba(178,235,66,0.95)');
  g.addColorStop(0.6,'rgba(130,200,20,0.7)');
  g.addColorStop(1,'rgba(100,150,0,0)');
  ctx.fillStyle=g;
  [[32,32,20],[20,28,14],[44,28,14],[26,42,12],[38,42,12]].forEach(([x,y,r]) => {
    ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill();
  });
  // Toxic face
  ctx.fillStyle='rgba(80,120,0,0.9)';
  ctx.beginPath(); ctx.ellipse(23,30,5,5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(41,30,5,5,0,0,Math.PI*2); ctx.fill();
  ctx.fillStyle='rgba(200,255,50,0.9)';
  ctx.beginPath(); ctx.ellipse(23,30,2.5,2.5,0,0,Math.PI*2); ctx.fill();
  ctx.beginPath(); ctx.ellipse(41,30,2.5,2.5,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='rgba(80,120,0,0.8)'; ctx.lineWidth=2;
  ctx.beginPath(); ctx.arc(32,40,7,0,Math.PI); ctx.stroke();
  // Wiggly lines for smell
  ctx.strokeStyle='rgba(160,220,30,0.5)'; ctx.lineWidth=1.5; ctx.lineCap='round';
  [[24,10],[32,6],[40,10]].forEach(([x,y]) => {
    ctx.beginPath();
    ctx.moveTo(x,y+12); ctx.bezierCurveTo(x-4,y+8,x+4,y+4,x,y); ctx.stroke();
  });
  return c;
}

// ─── Sprite cache ─────────────────────────────────────────────────────────────
let _cache = null;

export function getSprites() {
  if (_cache) return _cache;
  _cache = {
    enemies: {
      potato: drawPotato(),
      donut:  drawDonut(),
      cactus: drawCactus(),
      frog:   drawFrog(),
      cloud:  drawCloud(),
    },
    projectiles: {
      gumgun:  drawBalloon(),
      icer:    drawIceCream(),
      plushie: drawPlushie(),
      stinker: drawStink(),
    },
    pickups: {},
  };
  initPickupSprites(_cache);
  return _cache;
}

export const SPRITE_SIZE = S;

// ─── PICKUP SPRITES ──────────────────────────────────────────────────────────

function drawPickupPizza() {
  const c = make(); const ctx = c.getContext('2d');
  // Crust
  ctx.fillStyle = '#d4a050';
  ctx.beginPath(); ctx.moveTo(32,6); ctx.arc(32,32,28,-(Math.PI*0.5),Math.PI*0.55); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#a0622a'; ctx.lineWidth=2; ctx.stroke();
  // Sauce
  ctx.fillStyle='#e53935';
  ctx.beginPath(); ctx.moveTo(32,12); ctx.arc(32,32,22,-(Math.PI*0.5),Math.PI*0.5); ctx.closePath(); ctx.fill();
  // Cheese
  ctx.fillStyle='#fff176';
  ctx.beginPath(); ctx.moveTo(32,16); ctx.arc(32,32,18,-(Math.PI*0.5),Math.PI*0.42); ctx.closePath(); ctx.fill();
  // Toppings
  [[ 28,28,'#4e342e'],[38,22,'#4e342e'],[32,36,'#e53935'],[42,32,'#4caf50']].forEach(([x,y,col])=>{
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(x,y,3.5,0,Math.PI*2); ctx.fill();
  });
  // Shine
  ctx.fillStyle='rgba(255,255,255,0.25)';
  ctx.beginPath(); ctx.ellipse(24,20,8,5,-0.4,0,Math.PI*2); ctx.fill();
  return c;
}

function drawPickupAmmo() {
  const c = make(); const ctx = c.getContext('2d');
  const balloons = [['#f44336',20,34,12,16],['#2196f3',32,28,11,15],['#ffeb3b',44,34,12,16]];
  balloons.forEach(([col,cx,cy,rx,ry])=>{
    const g=ctx.createRadialGradient(cx-rx*0.25,cy-ry*0.3,2,cx,cy,Math.max(rx,ry));
    const light=col; g.addColorStop(0,'#fff'); g.addColorStop(0.3,light); g.addColorStop(1,light.replace(/[0-9a-f]{2}$/i,'55'));
    ctx.fillStyle=g;
    ctx.beginPath(); ctx.ellipse(cx,cy,rx,ry,0,0,Math.PI*2); ctx.fill();
    ctx.strokeStyle='rgba(0,0,0,0.2)'; ctx.lineWidth=1; ctx.stroke();
    // knot
    ctx.fillStyle=col; ctx.beginPath(); ctx.arc(cx,cy+ry+2,3,0,Math.PI*2); ctx.fill();
    // string
    ctx.strokeStyle='#aaa'; ctx.lineWidth=1.2;
    ctx.beginPath(); ctx.moveTo(cx,cy+ry+5); ctx.lineTo(cx+(cx-32)*0.2,56); ctx.stroke();
  });
  return c;
}

function drawPickupShield() {
  const c = make(); const ctx = c.getContext('2d');
  // Glowing star
  const g=ctx.createRadialGradient(32,32,4,32,32,28);
  g.addColorStop(0,'#fff9c4'); g.addColorStop(0.5,'#ffeb3b'); g.addColorStop(1,'rgba(255,193,7,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
  // Shield shape
  ctx.fillStyle='#ffd600';
  ctx.beginPath();
  ctx.moveTo(32,8); ctx.lineTo(54,18); ctx.lineTo(54,36);
  ctx.bezierCurveTo(54,50,40,58,32,62);
  ctx.bezierCurveTo(24,58,10,50,10,36);
  ctx.lineTo(10,18); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#ff8f00'; ctx.lineWidth=2.5; ctx.stroke();
  // Inner cross emblem
  ctx.strokeStyle='#ff8f00'; ctx.lineWidth=3; ctx.lineCap='round';
  ctx.beginPath(); ctx.moveTo(32,22); ctx.lineTo(32,46); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(20,34); ctx.lineTo(44,34); ctx.stroke();
  // Shine
  ctx.fillStyle='rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.ellipse(24,20,7,5,-0.3,0,Math.PI*2); ctx.fill();
  return c;
}

function drawPickupTurbo() {
  const c = make(); const ctx = c.getContext('2d');
  // Lightning bolt shoes hint (bolt shape)
  const g=ctx.createRadialGradient(32,32,2,32,32,30);
  g.addColorStop(0,'#80d8ff'); g.addColorStop(1,'rgba(33,150,243,0)');
  ctx.fillStyle=g; ctx.fillRect(0,0,S,S);
  // Main bolt
  ctx.fillStyle='#29b6f6';
  ctx.beginPath();
  ctx.moveTo(40,6); ctx.lineTo(24,34); ctx.lineTo(34,34);
  ctx.lineTo(20,58); ctx.lineTo(40,30); ctx.lineTo(30,30);
  ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#0277bd'; ctx.lineWidth=2; ctx.stroke();
  // Shine
  ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.moveTo(38,8); ctx.lineTo(28,28); ctx.lineTo(35,28); ctx.lineTo(30,42);
  ctx.lineTo(38,8); ctx.clip();
  ctx.fillStyle='rgba(255,255,255,0.35)';
  ctx.beginPath(); ctx.ellipse(32,24,6,12,0,0,Math.PI*2); ctx.fill();
  return c;
}

function drawPickupMega() {
  const c = make(); const ctx = c.getContext('2d');
  // Big glowing balloon with star burst
  const g=ctx.createRadialGradient(28,22,2,32,30,26);
  g.addColorStop(0,'#ff8a80'); g.addColorStop(0.7,'#e53935'); g.addColorStop(1,'#b71c1c');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.ellipse(32,28,22,26,0,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#b71c1c'; ctx.lineWidth=2; ctx.stroke();
  // Star rays
  ctx.strokeStyle='rgba(255,235,59,0.8)'; ctx.lineWidth=2; ctx.lineCap='round';
  for(let i=0;i<8;i++){
    const a=i*Math.PI/4;
    ctx.beginPath();
    ctx.moveTo(32+Math.cos(a)*24,28+Math.sin(a)*26);
    ctx.lineTo(32+Math.cos(a)*30,28+Math.sin(a)*32);
    ctx.stroke();
  }
  // '!' on balloon
  ctx.fillStyle='#fff'; ctx.font='bold 22px monospace'; ctx.textAlign='center';
  ctx.fillText('!',32,36); ctx.textAlign='left';
  // Knot + string
  ctx.fillStyle='#e53935'; ctx.beginPath(); ctx.arc(32,55,3.5,0,Math.PI*2); ctx.fill();
  ctx.strokeStyle='#bbb'; ctx.lineWidth=1.5;
  ctx.beginPath(); ctx.moveTo(32,59); ctx.bezierCurveTo(28,61,36,63,32,64); ctx.stroke();
  return c;
}

// Weapon pickups — look like the weapon

function drawPickupIcer() {
  const c = make(); const ctx = c.getContext('2d');
  // Handle
  ctx.fillStyle='#0288d1';
  ctx.beginPath(); ctx.roundRect(6,36,16,10,4); ctx.fill();
  ctx.strokeStyle='#01579b'; ctx.lineWidth=1.5; ctx.stroke();
  // Barrel / main body
  ctx.fillStyle='#4dd0e1';
  ctx.beginPath(); ctx.roundRect(18,26,30,14,5); ctx.fill();
  ctx.strokeStyle='#0097a7'; ctx.lineWidth=1.5; ctx.stroke();
  // Ice crystal nozzle
  ctx.fillStyle='#e0f7fa';
  ctx.beginPath(); ctx.moveTo(48,30); ctx.lineTo(58,33); ctx.lineTo(48,36); ctx.closePath(); ctx.fill();
  // Icy details
  ctx.fillStyle='rgba(255,255,255,0.5)';
  ctx.beginPath(); ctx.roundRect(22,28,8,5,3); ctx.fill();
  // Scoop decoration on top
  const g2=ctx.createRadialGradient(26,20,1,26,20,10);
  g2.addColorStop(0,'#80deea'); g2.addColorStop(1,'#00bcd4');
  ctx.fillStyle=g2;
  ctx.beginPath(); ctx.arc(26,20,10,Math.PI,0); ctx.closePath(); ctx.fill();
  ctx.strokeStyle='#0097a7'; ctx.lineWidth=1; ctx.stroke();
  // Sparkles
  ctx.fillStyle='#fff';
  [[22,16],[30,14],[26,22]].forEach(([x,y])=>{ ctx.beginPath(); ctx.arc(x,y,1.5,0,Math.PI*2); ctx.fill(); });
  return c;
}

function drawPickupStinker() {
  const c = make(); const ctx = c.getContext('2d');
  // Can body
  const g=ctx.createLinearGradient(18,0,46,0);
  g.addColorStop(0,'#558b2f'); g.addColorStop(0.5,'#8bc34a'); g.addColorStop(1,'#558b2f');
  ctx.fillStyle=g;
  ctx.beginPath(); ctx.roundRect(18,16,28,38,6); ctx.fill();
  ctx.strokeStyle='#33691e'; ctx.lineWidth=2; ctx.stroke();
  // Cap/nozzle
  ctx.fillStyle='#9e9e9e';
  ctx.beginPath(); ctx.roundRect(22,10,20,9,4); ctx.fill();
  ctx.strokeStyle='#616161'; ctx.lineWidth=1.5; ctx.stroke();
  // Nozzle tip
  ctx.fillStyle='#757575';
  ctx.beginPath(); ctx.roundRect(28,6,8,6,2); ctx.fill();
  // Label stripes
  ctx.fillStyle='#fff';
  ctx.beginPath(); ctx.roundRect(20,26,24,12,3); ctx.fill();
  ctx.fillStyle='#33691e'; ctx.font='bold 7px monospace'; ctx.textAlign='center';
  ctx.fillText('STINK',32,33); ctx.fillText('💨',32,22); ctx.textAlign='left';
  // Shine
  ctx.fillStyle='rgba(255,255,255,0.3)';
  ctx.beginPath(); ctx.roundRect(20,18,7,14,3); ctx.fill();
  // Green puff above nozzle
  ctx.fillStyle='rgba(139,195,74,0.55)';
  [[32,4,5],[26,2,4],[38,3,4.5]].forEach(([x,y,r])=>{ ctx.beginPath(); ctx.arc(x,y,r,0,Math.PI*2); ctx.fill(); });
  return c;
}

// Patch getSprites to include pickups
const _origGetSprites = getSprites;
// We extend the cache object after the original init
export function initPickupSprites(cache) {
  cache.pickups = {
    pizza:          drawPickupPizza(),
    ammo:           drawPickupAmmo(),
    shield:         drawPickupShield(),
    turbo:          drawPickupTurbo(),
    megaammo:       drawPickupMega(),
    weapon_icer:    drawPickupIcer(),
    weapon_stinker: drawPickupStinker(),
  };
}
