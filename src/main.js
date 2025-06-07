// src/main.js
import { startGame } from './gameState.js';

// Setup canvas and start button
window.addEventListener('load', () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const startButton = document.getElementById("startButton");
  if (startButton) {
    startButton.onclick = () => {
      document.getElementById("startScreen").style.display = "none";
      startGame();
    };
  }
});

// The main game loop
export function gameLoop() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  // Assuming these are imported or globally declared
  if (window.gameOver) return;

  ctx.clearRect(0, 0, canvas.width, canvas.height);
  window.handleMovement?.();
  window.checkCollisions?.();
  window.drawPlayer?.();
  window.drawBullets?.();
  window.drawMeteors?.();
  window.drawBoss?.();
  window.drawEnemyBullets?.();
  window.drawPowerup?.();
  window.drawTimePowerup?.();
  window.updateHealthBar?.();
  window.updateAmmoDisplay?.();
  window.checkUpgradeTimeout?.();

  requestAnimationFrame(gameLoop);
}