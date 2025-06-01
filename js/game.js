// === js/game.js ===
import { GameState, initGameState } from './state.js';
import { handleMovement } from './player.js';
import { updateMeteors, drawMeteors, spawnMeteor } from './meteors.js';
import { drawBullets, updateBullets } from './bullets.js';
import { drawBoss, updateBoss } from './boss.js';
import { drawPowerup } from './powerups.js';
import { drawEnemyBullets, updateEnemyBullets } from './bullets.js';
import { drawUI } from './ui.js';
import { setupAudio } from './audio.js';
import { GAME_WIDTH } from './config.js';
import { checkCollisions } from './collisions.js';
import { bulletImg, upgradedBulletImg, explosionImg } from './sprites.js';

const urlParams = new URLSearchParams(window.location.search);
const userId = urlParams.get('userId');

fetch(`http://localhost:5000/api/user/${userId}`)
  .then(res => res.json())
  .then(user => {
    GameState.user = user;
    document.getElementById("walletDisplay").textContent = `Logged in as ${user.username}`;
  });


function gameLoop() {
  console.log("Game script loaded!");
  const { ctx, canvas, gameOver } = GameState;

 if (!ctx || !canvas) {
    console.error("Canvas or context not initialized in GameState.");
    return;
 }

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  if (gameOver) return;

  handleMovement();
  checkCollisions();
  updateMeteors();
  updateBullets();
  updateEnemyBullets();
  updateBoss();
  updatePowerup();

  drawMeteors();
  drawBullets();
  drawEnemyBullets();
  drawBoss();
  drawPowerup();
  drawUI();

  requestAnimationFrame(gameLoop);
}

window.onload = () => {
  initGameState();
  setupAudio();
  document.getElementById("startButton").addEventListener("click", () => {
    document.getElementById("startScreen").style.display = "none";
    GameState.gameStarted = true;
    requestAnimationFrame(gameLoop);
     // 🪐 Start meteor spawning
    setInterval(() => {
      if (GameState.gameStarted) spawnMeteor();
    }, 1000);

    // 🔫 Start rogue/enemy meteor shooting
    startMeteorShooting();
  });
}}
