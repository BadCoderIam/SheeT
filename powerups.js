// powerup.js

import * as audio from './audio.js';
import { bullets, bulletImg, upgradedBulletImg, enemyBullets, enemyBulletImg, bulletImageRed, bulletImageGreen, currentBulletImage, setBulletImg, updateAmmoDisplay } from './Bullets.js';
import { baseHp,  getAmmo, setAmmo, maxAmmo, level, timeLeft, timerInterval, timePowerupsSpawned, canvas, ctx, timePowerup, powerup, hudState } from './state.js';
import { player } from './playerimg.js';
import { updateScore, updateHealthBar, maxHP } from './UI.js';
export let upgraded = false;
export let upgradeEndTime = 0;


// Must be called at game start
export function initPowerups(canvas, ctx, canvasWidth, hudState) {
  hudState.timePowerupsSpawned = 0;
  powerup.spawnTime = Date.now() + 10000 + Math.random() * 10000;
  powerup.x = Math.random() * (canvasWidth - powerup.width);

  timePowerup.spawnTime = Date.now() + 20000 + Math.random() * 15000;
  timePowerup.x = Math.random() * (canvasWidth - timePowerup.width);
}

export function drawPowerup(ctx, canvas, player) {
  const now = Date.now();

  if (now > powerup.spawnTime && !powerup.active) {
    powerup.x = Math.random() * (canvas.width - powerup.width);
    powerup.y = -50;
    powerup.active = true;
  }

  if (powerup.active) {
    powerup.y += 2;
    if (powerup.image) {
    ctx.drawImage(powerup.image, powerup.x, powerup.y, powerup.width, powerup.height);
    }
    if (
      player.x < powerup.x + powerup.width &&
      player.x + player.width > powerup.x &&
      player.y < powerup.y + powerup.height &&
      player.y + player.height > powerup.y
    ) {
      powerup.active = false;
      upgraded = true;
      upgradeEndTime = now + 10000;

      setAmmo(Math.min(getAmmo() + 200, maxAmmo));
      setBulletImg(true);
      updateAmmoDisplay();
      audio.playShieldUp();

      powerup.spawnTime = now + 10000 + Math.random() * 10000;
    }

    if (powerup.y > canvas.height) {
      powerup.active = false;
      powerup.spawnTime = now + 10000 + Math.random() * 10000;
    }
  }
}

export function checkUpgradeTimeout() {
  if (upgraded && Date.now() > upgradeEndTime) {
    upgraded = false;
    setBulletImg(false); // switch to default bullet
  }
}

export function updatePowerupState(now) {
  if (upgraded && now >= upgradeEndTime) {
    upgraded = false;
    setBulletImg(false); // Set back to bulletImageRed
  }
}

export function drawTimePowerup(options) {
  const { ctx, canvas, player, level, updateHealthBar, audio, hudState, timePowerup, maxHP } = options;
  const now = Date.now();

  if (
    now > timePowerup.spawnTime &&
    !timePowerup.active &&
    hudState.timePowerupsSpawned < hudState.maxTimePowerupsPerLevel
  ) {
    timePowerup.x = Math.random() * (canvas.width - timePowerup.width);
    timePowerup.y = -50;
    timePowerup.active = true;
    hudState.timePowerupsSpawned++;
  }

  if (timePowerup.active) {
    timePowerup.y += 4;
    if (timePowerup.image) {
    ctx.drawImage(timePowerup.image, timePowerup.x, timePowerup.y, timePowerup.width, timePowerup.height);
    }
    if (
      player.x < timePowerup.x + timePowerup.width &&
      player.x + player.width > timePowerup.x &&
      player.y < timePowerup.y + timePowerup.height &&
      player.y + player.height > timePowerup.y
    ) {
      timePowerup.active = false;
      hudState.timeLeft = Math.min(hudState.timeLeft + 25, 999);
      player.hp = Math.min(player.hp + 4, 20);
      updateHealthBar(player, maxHP);

      const timerDisplay = document.getElementById("timerText");
      timerDisplay.innerText = `Time: ${hudState.timeLeft}`;
      timerDisplay.classList.add("flash");
      setTimeout(() => timerDisplay.classList.remove("flash"), 3000);

      audio.playShieldUp();
      timePowerup.spawnTime = now + 10000 + Math.random() * 10000;
    }

    if (timePowerup.y > canvas.height) {
      timePowerup.active = false;
      timePowerup.spawnTime = now + 10000 + Math.random() * 10000;
    }
  }
}