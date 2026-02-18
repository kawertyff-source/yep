import Character from "./Character.js";

export default class Game {

  constructor(canvas){
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;

    this.player = new Character(300, 500, "blue");
    this.enemy = new Character(900, 500, "red");

    this.loop();
  }

  update(){
    this.enemy.idle();
  }

  draw(){
    this.ctx.clearRect(0,0,this.canvas.width,this.canvas.height);
    this.player.draw(this.ctx);
    this.enemy.draw(this.ctx);
  }

  loop(){
    this.update();
    this.draw();
    requestAnimationFrame(()=>this.loop());
  }

}
