// Handles touch joystick + buttons for mobile and mouse fallback
export default class Controls {
  constructor(){
    this.dx = 0; this.dy = 0;
    this.light = false; this.heavy = false; this.dash = false; this.domain = false;
    this.shoot = false;

    // DOM elements
    this.joy = document.getElementById("joystick");
    this.stick = document.getElementById("stick");
    this.btnLight = document.getElementById("btnLight");
    this.btnHeavy = document.getElementById("btnHeavy");
    this.btnDash = document.getElementById("btnDash");
    this.btnDomain = document.getElementById("btnDomain");

    // joystick touch
    this._bindJoystick();
    this._bindButtons();
  }

  _bindJoystick(){
    if(!this.joy) return;
    const rect = () => this.joy.getBoundingClientRect();
    const center = () => ({x: rect().left + rect().width/2, y: rect().top + rect().height/2});
    const maxDist = 48;

    const onMove = (clientX, clientY) => {
      const c = center();
      let vx = clientX - c.x;
      let vy = clientY - c.y;
      const d = Math.hypot(vx, vy);
      const ratio = Math.min(1, d / maxDist);
      if(d > 0){
        vx = (vx / d) * ratio * maxDist;
        vy = (vy / d) * ratio * maxDist;
      }
      this.stick.style.transform = `translate(${vx}px, ${vy}px)`;
      this.dx = vx / maxDist;
      this.dy = vy / maxDist;
    };

    const reset = () => {
      this.stick.style.transform = `translate(0px, 0px)`;
      this.dx = 0; this.dy = 0;
    };

    this.joy.addEventListener("touchstart", (e)=>{ e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY);}, {passive:false});
    this.joy.addEventListener("touchmove", (e)=>{ e.preventDefault(); onMove(e.touches[0].clientX, e.touches[0].clientY);}, {passive:false});
    this.joy.addEventListener("touchend", (e)=>{ e.preventDefault(); reset();}, {passive:false});

    // mouse fallback
    this.joy.addEventListener("pointerdown", (e)=>{ e.preventDefault(); this.joy.setPointerCapture(e.pointerId); onMove(e.clientX, e.clientY);});
    this.joy.addEventListener("pointermove", (e)=>{ if(e.buttons) onMove(e.clientX, e.clientY);});
    this.joy.addEventListener("pointerup", (e)=>{ reset();});
  }

  _bindButtons(){
    const makeTouchToggle = (el, key) => {
      if(!el) return;
      el.addEventListener("touchstart", (e)=>{ e.preventDefault(); this[key] = true; }, {passive:false});
      el.addEventListener("touchend", (e)=>{ e.preventDefault(); this[key] = false; }, {passive:false});
      // mouse fallback
      el.addEventListener("mousedown", ()=>this[key] = true);
      el.addEventListener("mouseup", ()=>this[key] = false);
      el.addEventListener("mouseleave", ()=>this[key] = false);
    };
    makeTouchToggle(this.btnLight, "light");
    makeTouchToggle(this.btnHeavy, "heavy");
    makeTouchToggle(this.btnDash, "dash");
    makeTouchToggle(this.btnDomain, "domain");
  }
}
