import Game from "./engine/Game.js";

const canvas = document.getElementById("gameCanvas");

function resize(){
  // keep full viewport resolution (highDPI friendly)
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  canvas.width = Math.floor(window.innerWidth * dpr);
  canvas.height = Math.floor(window.innerHeight * dpr);
  canvas.style.width = window.innerWidth + "px";
  canvas.style.height = window.innerHeight + "px";
  const ctx = canvas.getContext("2d");
  ctx.setTransform(dpr,0,0,dpr,0,0);
}

resize();
window.addEventListener("resize", resize);

const game = new Game(canvas);

// optional: expose for debug
window.__GAME__ = game;
