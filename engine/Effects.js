// simple particle emitter + screen splash
export default class Effects {
  constructor(){
    this.particles = [];
  }

  spawn(x,y,count = 8, color = 'rgba(180,200,255,0.9)'){
    for(let i=0;i<count;i++){
      this.particles.push({
        x, y,
        vx: (Math.random()-0.5) * 6,
        vy: (Math.random()-0.9) * 6,
        life: 30 + Math.random()*30,
        color
      });
    }
  }

  splash(x,y,intensity=12){
    this.spawn(x,y,intensity,'rgba(255,200,220,0.9)');
  }

  update(dt){
    this.particles.forEach(p=>{
      p.x += p.vx * dt;
      p.y += p.vy * dt;
      p.vy += 0.12 * dt;
      p.life -= 1 * dt;
    });
    this.particles = this.particles.filter(p => p.life > 0);
  }

  draw(ctx){
    this.particles.forEach(p=>{
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      ctx.fillStyle = p.color;
      ctx.beginPath();
      ctx.arc(p.x, p.y, Math.max(1, p.life*0.12), 0, Math.PI*2);
      ctx.fill();
      ctx.restore();
    });
  }
}
