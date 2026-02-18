import Game from "./engine/Game.js";
import UI from "./engine/UI.js";

const canvas = document.getElementById("gameCanvas");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const game = new Game(canvas);
new UI(game);
