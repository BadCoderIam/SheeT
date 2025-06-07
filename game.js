// game.js (entry point)
import './src/config.js';
import './src/assets.js';
import './src/input.js';
import './src/player.js';
import './src/meteors.js';
import './src/bullets.js';
import './src/boss.js';
import './src/powerups.js';
import './src/hud.js';
import './src/background.js';
import './src/collision.js';
import './src/gameState.js';
import './src/utils.js';
import './src/main.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
