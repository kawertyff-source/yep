// Stickman-style player: movement, dash, projectiles, ultimate (Beam)
import Projectile from "./Projectile.js";
import Beam from "./Beam.js";

export default class Player {
  constructor(x,y){
    this.x = x; this.y = y;
    this.width = 36; this.height = 88;
    this.hp = 200;
    this.energy = 100;
    this.speed = 4.5;
    this.facing = 1;
    this.projectiles = [];
    this.beams = [];
    this.cooldown = 0;
    this.dashCD = 0;
    this.domainActive = false;
    this.domainTimer = 0;
    this.shake = 0;
    this.combo = 0;
    this.trail = []; // for motion blur/dash trail
  }

  regen(dt){
    this.energy += 0.25 * dt;
    if(this.energy > 100) this.energy = 100;
    if(this.cooldown > 0) this.cooldown -= 1 * dt;
    if(this.dashCD > 0) this.dashCD -= 1 * dt;
    if(this.domainTimer > 0){ this.domainTimer -= 1 * dt; if(this.domainTimer <= 0) this.domainActive = false; }
  }

  update(ctrl, boss, dt){
    this.regen(dt);

    // movement
    const dx = ctrl.dx * this.speed * dt;
    const dy = ctrl.dy * this.speed * dt;
    this.x += dx;
    this.y += dy;

    // facing
    if(ctrl.dx < -0.01) this.facing = -1;
    if(ctrl.dx > 0.01) this.facing = 1;

    // clamp Y (simple ground)
    this.y = Math.min(this.y, 520);

    // dash
    if(ctrl.dash && this.dashCD <= 0 && this.energy >= 12){
      const dashVel = 60 * this.facing;
      this.x += dashVel;
      this.trail.push({x:this.x - dashVel/2, y:this.y, t:18});
      this.energy -= 12;
      this.dashCD = 36; // cooldown frames
      this.shake = 8;
    }

    // light attack: spawn short-range projectile / melee
    if(ctrl.light && this.cooldown <= 0 && this.energy >= 5){
      // melee check hits boss
      if(Math.abs(this.x - boss.x) < 110){
        boss.takeDamage(10, (this.facing)*22);
        this.shake = 6;
      }
      this.energy -= 5;
      this.cooldown = 10;
      this.combo++;
    }

    // heavy attack: heavy hit with knockback
    if(ctrl.heavy && this.cooldown <= 0 && this.energy >= 18){
      if(Math.abs(this.x - boss.x) < 150){
        boss.takeDamage(28, (this.facing)*38);
        this.shake = 12;
      }
      this.energy -= 18;
      this.cooldown = 26;
      this.combo = 0;
    }

    // shoot (mapped to light hold) -> ranged projectile
    if(ctrl.shoot && this.energy >= 6){
      // limit rate
      if(!this._lastShoot || performance.now() - this._lastShoot > 140){
        this.projectiles.push(new Projectile(this.x + (this.facing>0?40:-40), this.y - 20, this.facing));
        this._lastShoot = performance.now();
        this.energy -= 6;
      }
    }

    // domain ultimate
    if(ctrl.domain && this.energy >= 100 && !this.domainActive){
      this.domainActive = true;
      this.domainTimer = 260; // frames (~4s)
      this.energy = 0;
      this.shake = 18;
    }

    // update projectiles
    this.projectiles.forEach(p => p.update(boss));
    this.projectiles = this.projectiles.filter(p => p.active);

    // update beams if any
    if(this.beam){
      this.beam.update(boss);
      if(!this.beam.active) this.beam = null;
    }

    // trail update
    this.trail.forEach(t => t.t--);
    this.trail = this.trail.filter(t => t.t > 0);
  }

  takeDamage(amount, knock){
    // simple block / damage mitigation could be added
    this.hp -= amount;
    this.shake = Math.max(this.shake, Math.min(Math.abs(knock)/2, 24));
    // apply knock as displacement
    this.x += knock;
    if(this.hp < 0) this.hp = 0;
  }

  draw(ctx){
    // draw motion trail
    this.trail.forEach(tr => {
      ctx.fillStyle = 'rgba(160, 160, 255, 0.06)';
      ctx.fillRect(tr.x - 24, tr.y - 80, 48, 96);
    });

    // draw projectiles
    this.projectiles.forEach(p => p.draw(ctx));
    if(this.beam) this.beam.draw(ctx);

    // stickman draw (animated)
    ctx.save();
    ctx.translate(this.x, this.y);

    const s = 1.0;
    ctx.strokeStyle = this.domainActive ? '#bb66ff' : '#ffffff';
    ctx.lineWidth = 6;
    ctx.lineCap = 'round';

    // head
    ctx.beginPath();
    ctx.arc(0, -60, 14, 0, Math.PI*2);
    ctx.stroke();

    // body
    ctx.beginPath();
    ctx.moveTo(0,-46);
    ctx.lineTo(0,8);
    ctx.stroke();

    // arms (right arm extends on attack)
    ctx.beginPath();
    ctx.moveTo(0,-30);
    const armX = (this.combo>0) ? 48 * Math.min(1, this.combo/5) : 28;
    ctx.lineTo(armX, -28);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,-30);
    ctx.lineTo(-28, -8);
    ctx.stroke();

    // legs
    ctx.beginPath();
    ctx.moveTo(0,8);
    ctx.lineTo(-22,42);
    ctx.stroke();

    ctx.beginPath();
    ctx.moveTo(0,8);
    ctx.lineTo(22,42);
    ctx.stroke();

    ctx.restore();
  }
}
