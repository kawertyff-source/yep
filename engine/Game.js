import Character from "./Character.js";

export default class Game {

  constructor(canvas){

    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");

    this.state = "PLAY";
    this.shake = 0;

    this.player = new Character(350, 500, "red");
    this.enemy  = new Character(900, 500, "cyan");

    this.player.scale = 1.1;
    this.enemy.scale = 1;

    this.lastTime = 0;

    requestAnimationFrame(this.loop.bind(this));
  }

  /* ========================= */
  /*          UPDATE           */
  /* ========================= */

  update(delta){

    if(this.state !== "PLAY") return;

    this.player.regen();
    this.enemy.regen();

    // AI Behavior
    this.enemyAI();

    // ตรวจชนระยะใกล้
    this.handleCombat();

    // เช็คแพ้ชนะ
    if(this.player.hp <= 0){
      this.state = "END";
      console.log("YOU LOSE");
    }

    if(this.enemy.hp <= 0){
      this.state = "END";
      console.log("YOU WIN");
    }

    // อัปเดต UI
    this.updateUI();

    // ลดแรงสั่นจอ
    if(this.shake > 0){
      this.shake -= delta * 0.02;
      if(this.shake < 0) this.shake = 0;
    }
  }

  /* ========================= */
  /*          AI SYSTEM        */
  /* ========================= */

  enemyAI(){

    const dist = this.enemy.distance(this.player);

    // เดินเข้า
    if(dist > 120){
      this.enemy.move(-0.6,0);
    }

    // โจมตีสุ่ม
    if(dist < 120 && Math.random() < 0.02){
      this.enemy.attack(this.player, 10);
      this.shake = 10;
    }

    // บล็อกสุ่ม
    this.enemy.blocking = Math.random() < 0.01;
  }

  /* ========================= */
  /*       COMBAT CHECK        */
  /* ========================= */

  handleCombat(){

    // Knockback effect
    if(this.player.knockback > 0){
      this.player.x += this.player.knockback;
      this.player.knockback -= 1;
    }

    if(this.enemy.knockback > 0){
      this.enemy.x += this.enemy.knockback;
      this.enemy.knockback -= 1;
    }
  }

  /* ========================= */
  /*          DRAW             */
  /* ========================= */

  draw(){

    const ctx = this.ctx;

    ctx.save();

    // Camera shake
    if(this.shake > 0){
      ctx.translate(
        (Math.random()-0.5)*this.shake,
        (Math.random()-0.5)*this.shake
      );
    }

    ctx.clearRect(0,0,this.canvas.width,this.canvas.height);

    // พื้น
    ctx.fillStyle = "#111";
    ctx.fillRect(0, this.canvas.height-100, this.canvas.width, 100);

    // ตัวละคร
    this.player.draw(ctx);
    this.enemy.draw(ctx);

    ctx.restore();

    // END TEXT
    if(this.state === "END"){
      ctx.fillStyle = "white";
      ctx.font = "50px Arial";
      ctx.textAlign = "center";
      ctx.fillText(
        this.player.hp <= 0 ? "YOU LOSE" : "YOU WIN",
        this.canvas.width/2,
        this.canvas.height/2
      );
    }
  }

  /* ========================= */
  /*          UI UPDATE        */
  /* ========================= */

  updateUI(){

    const pHP = document.getElementById("playerHP");
    const eHP = document.getElementById("enemyHP");
    const skill = document.getElementById("skillPercent");

    if(pHP) pHP.style.width = this.player.hp + "%";
    if(eHP) eHP.style.width = this.enemy.hp + "%";
    if(skill) skill.innerText = Math.floor(this.player.skill) + "%";
  }

  /* ========================= */
  /*          LOOP             */
  /* ========================= */

  loop(time){

    const delta = time - this.lastTime;
    this.lastTime = time;

    this.update(delta);
    this.draw();

    requestAnimationFrame(this.loop.bind(this));
  }

}
