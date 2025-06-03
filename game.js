// game.js (module loader)
import './engine.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
