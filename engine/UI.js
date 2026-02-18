export default class UI {

  constructor(game){
    this.game=game;

    this.setupButtons();
    this.setupJoystick();
  }

  setupButtons(){

    document.querySelector(".light").ontouchstart=()=>{
      this.game.player.attack(this.game.enemy,5);
    };

    document.querySelector(".heavy").ontouchstart=()=>{
      this.game.player.attack(this.game.enemy,15);
    };

    document.querySelector(".dash").ontouchstart=()=>{
      this.game.player.dash(1);
    };

    document.querySelector(".block").ontouchstart=()=>{
      this.game.player.blocking=true;
    };

    document.querySelector(".block").ontouchend=()=>{
      this.game.player.blocking=false;
    };
  }

  setupJoystick(){

    const joystick=document.querySelector(".joystick");
    const stick=document.querySelector(".stick");

    joystick.ontouchmove=(e)=>{
      const rect=joystick.getBoundingClientRect();
      const touch=e.touches[0];

      const x=touch.clientX-rect.left-70;
      const y=touch.clientY-rect.top-70;

      stick.style.left=(x+40)+"px";
      stick.style.top=(y+40)+"px";

      this.game.player.move(x/50,y/50);
    };

    joystick.ontouchend=()=>{
      stick.style.left="40px";
      stick.style.top="40px";
    };
  }

}
