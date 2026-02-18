const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// ================= PLAYER =================
let player = {
  x: 200,
  y: canvas.height - 200,
  size: 40,
  hp: 100,
  speed: 4
};

// ================= BOSS =================
let boss = {
  x: canvas.width - 350,
  y: canvas.height - 420,
  hp: 500,
  maxHp: 500,
  size: 140,
  phase2: false,
  auraPulse: 0,
  attackCooldown: 0
};

let moveX = 0;
let moveY = 0;

let projectiles = [];
let screenFlash = 0;

// ================= MOBILE JOYSTICK =================
document.getElementById("joystick").addEventListener("touchmove", e => {
  let touch = e.touches[0];
  moveX = (touch.clientX - 80 - 40) / 40;
  moveY = (touch.clientY - (canvas.height - 80) - 40) / 40;
});

// ================= SKILLS =================
function skill1() { boss.hp -= 20; }
function skill2() { boss.hp -= 40; }
function skill3() { boss.hp -= 70; }

// ================= PHASE CHECK =================
function checkPhase() {
  if (!boss.phase2 && boss.hp <= boss.maxHp / 2) {
    boss.phase2 = true;
    screenFlash = 30;
  }
}

// ================= BOSS AI =================
function bossAI() {

  let speed = boss.phase2 ? 3 : 1.5;

  if (boss.x > player.x) boss.x -= speed;
  if (boss.x < player.x) boss.x += speed;

  if (Math.abs(boss.x - player.x) < 120) {
    player.hp -= boss.phase2 ? 0.6 : 0.2;
  }

  // ยิงพลังใน Phase 2
  if (boss.phase2 && boss.attackCooldown <= 0) {
    projectiles.push({
      x: boss.x,
      y: boss.y,
      vx: (player.x - boss.x) * 0.02,
      vy: (player.y - boss.y) * 0.02
    });
    boss.attackCooldown = 60;
  }

  boss.attackCooldown--;
}

// ================= DRAW PLAYER =================
function drawPlayer() {
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

// ================= DRAW PROJECTILES =================
function drawProjectiles() {
  ctx.fillStyle = "purple";
  projectiles.forEach(p => {
    p.x += p.vx;
    p.y += p.vy;
    ctx.beginPath();
    ctx.arc(p.x, p.y, 8, 0, Math.PI * 2);
    ctx.fill();

    if (Math.abs(p.x - player.x) < 30 &&
        Math.abs(p.y - player.y) < 30) {
      player.hp -= 2;
    }
  });
}

// ================= DRAW BOSS =================
function drawBoss() {

  boss.auraPulse += 0.1;

  // Aura Phase 2
  if (boss.phase2) {
    ctx.beginPath();
    ctx.arc(
      boss.x + 70,
      boss.y - 50,
      160 + Math.sin(boss.auraPulse) * 10,
      0,
      Math.PI * 2
    );
    ctx.strokeStyle = "purple";
    ctx.lineWidth = 5;
    ctx.stroke();
  }

  // Body
  ctx.fillStyle = boss.phase2 ? "#ddd" : "white";
  ctx.fillRect(boss.x, boss.y, boss.size, boss.size * 1.5);

  // Head
  ctx.fillRect(boss.x + 30, boss.y - 90, 80, 80);

  // Horn (Moon)
  ctx.beginPath();
  ctx.arc(boss.x + 70, boss.y - 110, 110, 0.2 * Math.PI, 0.8 * Math.PI);
  ctx.strokeStyle = boss.phase2 ? "purple" : "white";
  ctx.lineWidth = 12;
  ctx.stroke();

  // Eyes
  ctx.fillStyle = boss.phase2 ? "red" : "black";
  ctx.fillRect(boss.x + 50, boss.y - 60, 12, 12);
  ctx.fillRect(boss.x + 80, boss.y - 60, 12, 12);

  // Smile
  ctx.beginPath();
  ctx.arc(boss.x + 70, boss.y - 40, 25, 0, Math.PI);
  ctx.stroke();
}

// ================= SCREEN FLASH =================
function drawFlash() {
  if (screenFlash > 0) {
    ctx.fillStyle = "rgba(255,0,255,0.3)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    screenFlash--;
  }
}

// ================= UPDATE =================
function update() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  player.x += moveX * player.speed;
  player.y += moveY * player.speed;

  checkPhase();
  bossAI();

  drawPlayer();
  drawBoss();
  drawProjectiles();
  drawFlash();

  document.getElementById("playerHP").style.width =
    Math.max(player.hp,0) + "%";

  document.getElementById("bossHP").style.width =
    (boss.hp / boss.maxHp) * 100 + "%";

  requestAnimationFrame(update);
}

update();
