// Update bars / messages
export default class UI {
  constructor(player, boss){
    this.player = player;
    this.boss = boss;
    this.playerHP = document.getElementById("playerHP");
    this.bossHP = document.getElementById("bossHP");
    this.energyVal = document.getElementById("energyVal");
    this.messages = document.getElementById("messages");
    this._msgTimer = 0;
  }

  update(){
    if(this.playerHP) this.playerHP.style.width = Math.max(0, (this.player.hp / 200) * 100) + "%";
    if(this.bossHP) this.bossHP.style.width = Math.max(0, (this.boss.hp / 900) * 100) + "%";
    if(this.energyVal) this.energyVal.innerText = Math.floor(this.player.energy);

    // messages (e.g. domain on)
    if(this.player.domainActive && this._msgTimer <= 0){
      this.showMessage("DOMAIN ACTIVATED");
    }
    if(this._msgTimer > 0) this._msgTimer--;
  }

  showMessage(text, time = 140){
    if(this.messages) this.messages.innerText = text;
    this._msgTimer = time;
    setTimeout(()=>{ if(this._msgTimer === 0 && this.messages) this.messages.innerText = ""; }, time*16);
  }
}
