import Character from "./Character.js";

export default class Game {

  constructor(canvas){
    this.ctx = canvas.getContext("2d");
    this.canvas = canvas;

    this.player = new Character(400, 500, "cyan");
    this.enemy = new Character(900, 500, "red");

    this.loop();
  }

  update(){

    // ศัตรูเดินเข้าหา
    if(this.enemy.distance(this.player) > 80){
      this.enemy.move(-0.3,0);
    }

    // อัปเดต HP UI
    document.getElementById("playerHP").style.width = this.player.hp+"%";
    document.getElementById("enemyHP").style.width = this.enemy.hp+"%";
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
    requestAnimationFrame(()=>this.loop());
  }

}
