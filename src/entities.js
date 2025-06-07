// src/entities.js

// This file defines game objects and full logic from engine.js
import { canvas, ctx, gameStarted, gameOver, level, score, highScore, timeLeft } from './gameCore.js';
import { updateScore, updateHealthBar, updateAmmoDisplay, displayEndScreen } from './hud.js';

export const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 80,
  height: 80,
  speed: 10,
};

export const bullets = [];
export const meteors = [];
export const enemyBullets = [];

const playerImg = new Image();
playerImg.src = "./sprites/playerShip3_green.png";

const bulletImg = new Image();
bulletImg.src = "./sprites/laserRed01.png";
const upgradedBulletImg = new Image();
upgradedBulletImg.src = "./sprites/laserGreen12.png";

let upgraded = false;
let upgradeEndTime = 0;

export function drawPlayer() {
  ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
  // Add HUD overlay here like mini health bar and timer icons
}

export function drawBullets() {
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    const img = upgraded ? upgradedBulletImg : bulletImg;
    ctx.drawImage(img, b.x, b.y, b.width, b.height);
    if (b.y < 0) bullets.splice(i, 1);
  });
}

export function checkUpgradeTimeout() {
  if (upgraded && Date.now() > upgradeEndTime) {
    upgraded = false;
    updateAmmoDisplay();
  }
}

// Similar reimplementation needed for:
// - drawMeteors
// - spawnMeteor
// - drawBoss
// - drawEnemyBullets
// - checkCollisions
// - drawPowerup
// - drawTimePowerup

// To keep this file manageable, we recommend placing
// powerups and boss logic in their own modules (like powerups.js, boss.js)
// as your game grows more complex.

// Use this structure as a base and copy over each respective function from engine.js
