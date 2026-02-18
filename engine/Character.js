export default class Character {

  constructor(x,y,color){
    this.x=x;
    this.y=y;
    this.color=color;
    this.hp=100;
  }

  draw(ctx){

    ctx.fillStyle=this.color;

    // body
    ctx.fillRect(this.x-25,this.y-120,50,120);

    // head
    ctx.beginPath();
    ctx.arc(this.x,this.y-150,35,0,Math.PI*2);
    ctx.fill();

    // legs
    ctx.fillRect(this.x-20,this.y,20,100);
    ctx.fillRect(this.x,this.y,20,100);
  }

}
