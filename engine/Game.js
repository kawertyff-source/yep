const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

function resize() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

// ================= PLAYER =================
let player = {
  x: 150,
  y: canvas.height / 2,
  size: 40,
  hp: 100,
  speed: 4
};

// ================= BOSS =================
let boss = {
  x: canvas.width - 200,
  y: canvas.height / 2 - 100,
  size: 120,
  hp: 500,
  maxHp: 500,
  phase2: false,
  aura: 0,
  cooldown: 0
};

let moveX = 0;
let moveY = 0;
let projectiles = [];
let flash = 0;

// ================= JOYSTICK FIX =================
const joystick = document.getElementById("joystick");

joystick.addEventListener("touchmove", e => {
  e.preventDefault();
  let rect = joystick.getBoundingClientRect();
  let touch = e.touches[0];

  let dx = touch.clientX - (rect.left + rect.width/2);
  let dy = touch.clientY - (rect.top + rect.height/2);

  moveX = dx / 40;
  moveY = dy / 40;
});

joystick.addEventListener("touchend", () => {
  moveX = 0;
  moveY = 0;
});

// ================= SKILLS =================
function skill1(){ boss.hp -= 20; }
function skill2(){ boss.hp -= 40; }
function skill3(){ boss.hp -= 70; }

// ================= PHASE =================
function checkPhase(){
  if(!boss.phase2 && boss.hp <= boss.maxHp/2){
    boss.phase2 = true;
    flash = 25;
  }
}

// ================= AI =================
function bossAI(){

  let speed = boss.phase2 ? 3 : 1.5;

  if(boss.x > player.x) boss.x -= speed;
  if(boss.x < player.x) boss.x += speed;

  if(Math.abs(boss.x - player.x) < 80){
    player.hp -= boss.phase2 ? 0.5 : 0.2;
  }

  if(boss.phase2 && boss.cooldown <= 0){
    projectiles.push({
      x: boss.x,
      y: boss.y,
      vx: (player.x - boss.x) * 0.03,
      vy: (player.y - boss.y) * 0.03
    });
    boss.cooldown = 60;
  }

  boss.cooldown--;
}

// ================= DRAW =================
function drawPlayer(){
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);
}

function drawBoss(){

  boss.aura += 0.1;

  if(boss.phase2){
    ctx.beginPath();
    ctx.arc(boss.x+60, boss.y-40,
      150 + Math.sin(boss.aura)*8,
      0, Math.PI*2);
    ctx.strokeStyle="purple";
    ctx.lineWidth=4;
    ctx.stroke();
  }

  ctx.fillStyle="white";
  ctx.fillRect(boss.x, boss.y, boss.size, boss.size*1.4);

  ctx.fillRect(boss.x+30, boss.y-80, 60, 60);

  ctx.beginPath();
  ctx.arc(boss.x+60, boss.y-100, 100, 0.3*Math.PI, 0.7*Math.PI);
  ctx.strokeStyle=boss.phase2?"purple":"white";
  ctx.lineWidth=10;
  ctx.stroke();

  ctx.fillStyle=boss.phase2?"red":"black";
  ctx.fillRect(boss.x+40, boss.y-60, 10, 10);
  ctx.fillRect(boss.x+70, boss.y-60, 10, 10);
}

function drawProjectiles(){
  ctx.fillStyle="purple";
  projectiles.forEach(p=>{
    p.x+=p.vx;
    p.y+=p.vy;
    ctx.beginPath();
    ctx.arc(p.x,p.y,6,0,Math.PI*2);
    ctx.fill();

    if(Math.abs(p.x-player.x)<30 &&
       Math.abs(p.y-player.y)<30){
      player.hp-=1;
    }
  });
}

function drawFlash(){
  if(flash>0){
    ctx.fillStyle="rgba(255,0,255,0.3)";
    ctx.fillRect(0,0,canvas.width,canvas.height);
    flash--;
  }
}

// ================= UPDATE =================
function update(){

  ctx.clearRect(0,0,canvas.width,canvas.height);

  player.x += moveX * player.speed;
  player.y += moveY * player.speed;

  // กันหลุดจอ
  player.x = Math.max(0, Math.min(canvas.width-player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height-player.size, player.y));

  checkPhase();
  bossAI();

  drawPlayer();
  drawBoss();
  drawProjectiles();
  drawFlash();

  document.getElementById("playerHP").style.width =
    Math.max(player.hp,0)+"%";

  document.getElementById("bossHP").style.width =
    (boss.hp/boss.maxHp)*100+"%";

  requestAnimationFrame(update);
}

update();
