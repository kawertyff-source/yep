export default class UI {

  constructor(game){
    this.game=game;

    document.querySelector(".light").ontouchstart=()=>this.light();
    document.querySelector(".heavy").ontouchstart=()=>this.heavy();
    document.querySelector(".dash").ontouchstart=()=>this.dash();
    document.querySelector(".block").ontouchstart=()=>this.block();
  }

  light(){
    console.log("Light Attack");
  }

  heavy(){
    console.log("Heavy Attack");
  }

  dash(){
    console.log("Dash");
  }

  block(){
    console.log("Block");
  }

}
