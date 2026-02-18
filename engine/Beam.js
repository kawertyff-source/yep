export default class Beam {
  constructor(x,y,dir){
    this.x = x; this.y = y;
    this.dir = dir;
    this.timer = 40;
    this.active = true;
  }

  update(target){
    // cylinder-shaped beam hits
    const hitZoneStart = this.x;
    const hitZoneEnd = this.x + (this.dir > 0 ? 1000 : -1000);
    const tx = target.x;
    if((this.dir > 0 && tx > hitZoneStart && tx < hitZoneEnd) || (this.dir < 0 && tx < hitZoneStart && tx > hitZoneEnd)){
      target.takeDamage(30, (this.dir) * 50);
      // degrade target a lot
    }
    this.timer--;
    if(this.timer <= 0) this.active = false;
  }

  draw(ctx){
    ctx.save();
    ctx.fillStyle = 'rgba(180,100,255,0.18)';
    ctx.fillRect(this.x, this.y, 1200 * this.dir, 40);
    // beam core
    ctx.fillStyle = 'rgba(200,150,255,0.9)';
    ctx.fillRect(this.x, this.y+6, 1200 * this.dir, 28);
    ctx.restore();
  }
}
