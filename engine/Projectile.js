export default class Projectile {
  constructor(x,y,vel){
    this.x = x; this.y = y;
    this.vx = vel; this.vy = 0;
    this.radius = 10;
    this.active = true;
    this.color = 'cyan';
  }

  update(target){
    this.x += this.vx;
    // hit test
    if(Math.abs(this.x - target.x) < 30 && Math.abs(this.y - target.y) < 80){
      target.takeDamage(12, this.vx*6);
      this.active = false;
    }
    // out of world
    if(this.x < -2000 || this.x > 8000) this.active = false;
  }

  draw(ctx){
    ctx.save();
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI*2);
    ctx.fill();
    ctx.restore();
  }
}
