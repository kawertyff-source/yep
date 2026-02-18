export default class Character {

  constructor(x,y,color){
    this.x=x;
    this.y=y;

    this.color=color;

    this.hp=100;
    this.stamina=100;
    this.skill=0;

    this.scale=1;          // ปรับความสูง
    this.thickness=8;      // ความหนาเส้น
    this.punching=false;

    this.speed=4;
  }

  move(dx,dy){
    this.x+=dx*this.speed;
    this.y+=dy*this.speed;
  }

  attack(target,damage){

    if(this.distance(target)<100){
      target.hp-=damage;
      if(target.hp<0) target.hp=0;

      this.punching=true;
      setTimeout(()=>this.punching=false,150);
    }
  }

  distance(target){
    return Math.hypot(this.x-target.x,this.y-target.y);
  }

  draw(ctx){

    ctx.save();
    ctx.strokeStyle=this.color;
    ctx.lineWidth=this.thickness;
    ctx.lineCap="round";

    let s=this.scale;

    // หัว
    ctx.beginPath();
    ctx.arc(this.x,this.y-120*s,25*s,0,Math.PI*2);
    ctx.stroke();

    // ลำตัว
    ctx.beginPath();
    ctx.moveTo(this.x,this.y-95*s);
    ctx.lineTo(this.x,this.y-20*s);
    ctx.stroke();

    // แขนซ้าย
    ctx.beginPath();
    ctx.moveTo(this.x,this.y-80*s);
    ctx.lineTo(this.x-40*s,this.y-60*s);
    ctx.stroke();

    // แขนขวา (ถ้าต่อยให้ยืดออก)
    ctx.beginPath();
    ctx.moveTo(this.x,this.y-80*s);

    if(this.punching){
      ctx.lineTo(this.x+70*s,this.y-80*s);
    }else{
      ctx.lineTo(this.x+40*s,this.y-60*s);
    }

    ctx.stroke();

    // ขาซ้าย
    ctx.beginPath();
    ctx.moveTo(this.x,this.y-20*s);
    ctx.lineTo(this.x-40*s,this.y+60*s);
    ctx.stroke();

    // ขาขวา
    ctx.beginPath();
    ctx.moveTo(this.x,this.y-20*s);
    ctx.lineTo(this.x+40*s,this.y+60*s);
    ctx.stroke();

    ctx.restore();
  }

}
