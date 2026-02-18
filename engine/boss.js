// Multi-phase boss with wave attacks and behavior
import Projectile from "./Projectile.js";
import Beam from "./Beam.js";

export default class Boss {
  constructor(x,y){
    this.x = x; this.y = y;
    this.width = 80; this.height = 140;
    this.hp = 900;
    this.phase = 1;
    this.speed = 2.2;
    this.attackCooldown = 0;
    this.projectiles = [];
    this.beamActive = false;
    this.shake = 0;
  }

  takeDamage(amount, knock){
    this.hp -= amount;
    this.x += knock * 0.5;
    this.shake = Math.max(this.shake, Math.min(Math.abs(knock)/2, 30));
    if(this.hp < 0) this.hp = 0;
  }

  update(player, dt){
    // phase escalation
    if(this.hp < 650) this.phase = 2;
    if(this.hp < 300) this.phase = 3;

    // move towards player slowly (phase modifies speed)
    const dist = player.x - this.x;
    if(Math.abs(dist) > 140){
      this.x += Math.sign(dist) * (this.speed * (this.phase===3?1.8:1)) * dt;
    } else {
      // close range behavior
      if(this.attackCooldown <= 0){
        if(this.phase === 1){
          // light bite
          player.takeDamage(8, Math.sign(dist) * 18);
          this.attackCooldown = 40;
        } else if(this.phase === 2){
          // cleave wave shoot
          this.shootWave();
          this.attackCooldown = 80;
        } else {
          // phase 3: aggressive heavy
          this.shootWave(3);
          this.attackCooldown = 36;
        }
      }
    }

    // beams in phase 3: occasional ultimate beam
    if(this.phase === 3 && Math.random() < 0.002 && !this.beamActive){
      this.beamActive = true;
      this.beam = new Beam(this.x + (this.x < player.x ? 40 : -340), this.y - 20, this.x < player.x ? 1 : -1);
    }

    // update projectiles
    this.projectiles.forEach(p => p.update(player));
    this.projectiles = this.projectiles.filter(p => p.active);

    if(this.beamActive && this.beam){
      this.beam.update(player);
      if(!this.beam.active){ this.beamActive = false; this.beam = null; }
    }

    if(this.attackCooldown > 0) this.attackCooldown -= 1 * dt;
  }

  shootWave(count = 1){
    // spawn waves of projectiles in spread
    for(let i=0;i<count;i++){
      const dir = (Math.random()<0.5) ? -1 : 1;
      const px = this.x + (dir>0 ? 40 : -40);
      this.projectiles.push(new Projectile(px, this.y - 30, dir * (4 + Math.random()*3)));
    }
  }

  draw(ctx){
    // boss body with glow according to phase
    ctx.save();
    ctx.translate(this.x, this.y);

    // aura
    if(this.phase >= 2){
      ctx.fillStyle = this.phase === 2 ? 'rgba(180,50,200,0.06)' : 'rgba(200,20,60,0.12)';
      ctx.fillRect(-120, -160, 240, 220);
    }

    // draw projectiles & beam
    this.projectiles.forEach(p => p.draw(ctx));
    if(this.beam) this.beam.draw(ctx);

    // draw boss rectangle
    ctx.fillStyle = this.phase === 3 ? '#440000' : '#aa0000';
    ctx.fillRect(-this.width/2, -this.height/2, this.width, this.height);

    // face indicator
    ctx.fillStyle = '#222';
    ctx.fillRect(-14, -56, 28, 12);

    ctx.restore();
  }
}
