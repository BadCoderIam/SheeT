// game.js (module loader)
import './engine.js';
import { applyGravityPull } from './gravity.js';
import { timePowerup, powerup, upgraded, drawTimePowerup, drawPowerup, upgradeEndTime, upgradeEndTime, timePowerupsSpawned, bulletImageRed, upgradedBulletImg, bulletImageGreen, setBulletImg, setBulletImg } from './powerups.js';

window.addEventListener('load', () => {
  const canvas = document.getElementById("gameCanvas");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});
