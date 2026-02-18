const canvas = document.getElementById("game");
let ctx = null;

// ===== SAFARI SAFE INIT =====
function initCanvas(){
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext("2d");

  if(!ctx){
    alert("Canvas not supported");
  }
}

window.addEventListener("load", initCanvas);
window.addEventListener("resize", initCanvas);

// ================= PLAYER =================
let player = {
  x: 150,
  y: 300,
  size: 40,
  hp: 100,
  speed: 4
};

// ================= BOSS =================
let boss = {
  x: 600,
  y: 250,
  size: 120,
  hp: 500,
  maxHp: 500,
  phase2: false
};

let moveX = 0;
let moveY = 0;

// ===== FIX TOUCH (Safari สำคัญมาก) =====
const joystick = document.getElementById("joystick");

joystick.addEventListener("touchmove", function(e){
  e.preventDefault();
  let rect = joystick.getBoundingClientRect();
  let touch = e.touches[0];

  let dx = touch.clientX - (rect.left + rect.width/2);
  let dy = touch.clientY - (rect.top + rect.height/2);

  moveX = dx / 40;
  moveY = dy / 40;

}, { passive:false });

joystick.addEventListener("touchend", function(){
  moveX = 0;
  moveY = 0;
}, { passive:false });

// ================= UPDATE =================
function update(){

  if(!ctx) return;

  ctx.clearRect(0,0,canvas.width,canvas.height);

  player.x += moveX * player.speed;
  player.y += moveY * player.speed;

  // กันหลุดจอ
  player.x = Math.max(0, Math.min(canvas.width-player.size, player.x));
  player.y = Math.max(0, Math.min(canvas.height-player.size, player.y));

  // PHASE 2
  if(!boss.phase2 && boss.hp <= boss.maxHp/2){
    boss.phase2 = true;
  }

  // วาด Player
  ctx.fillStyle = "cyan";
  ctx.fillRect(player.x, player.y, player.size, player.size);

  // วาด Boss
  ctx.fillStyle = "white";
  ctx.fillRect(boss.x, boss.y, boss.size, boss.size*1.3);

  ctx.fillRect(boss.x+30, boss.y-70, 60, 60);

  ctx.beginPath();
  ctx.arc(boss.x+60, boss.y-90, 90, 0.3*Math.PI, 0.7*Math.PI);
  ctx.strokeStyle = boss.phase2 ? "purple" : "white";
  ctx.lineWidth = 8;
  ctx.stroke();

  // HP UI
  document.getElementById("playerHP").style.width =
    Math.max(player.hp,0)+"%";

  document.getElementById("bossHP").style.width =
    (boss.hp/boss.maxHp)*100+"%";

  requestAnimationFrame(update);
}

// รอโหลดก่อนเริ่ม
window.onload = function(){
  initCanvas();
  update();
};
