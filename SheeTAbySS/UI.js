// UI.js - handles score display and game over screen

import { getScore, getHighScore } from './meteors.js';
import { updateBackground } from './levels.js';


export const maxHP = 20;
export const maxBarWidth = 300;

export function updateScore(
  levelRef,
  level,
  maxLevel,
  bossRef,
  gameOverCallback,
  updateBackground,
  timePowerupsSpawnedRef,
  timePowerup, 
  canvas,
  bossImage
) {
  const score = getScore();                // ✅ NOW INSIDE FUNCTION
  const highScore = getHighScore();
  let currentLevel = levelRef.value;

  if (score >= currentLevel * 100 && currentLevel < maxLevel) {
    currentLevel++;
    levelRef.value = currentLevel;

    timePowerupsSpawnedRef.value = 0;
    timePowerup.spawnTime = Date.now() + 10000 + Math.random() * 5000;
    updateBackground(currentLevel);

    if (currentLevel === 6) {
      bossRef.value = {
        x: canvas.width / 2 - 100,
        y: 50,
        width: 200,
        height: 200,
        hp: 300,
        dx: 2,
        img: bossImage,
        lastShotTime: Date.now()
      };
    }
  }

  if (score >= 2000 && !bossRef.value) {
    gameOverCallback();
    document.getElementById("startScreen").style.display = "flex";
    document.getElementById("startScreen").innerHTML = `<h1>You WON! Good Jeb SheeTy!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${currentLevel}</p><button onclick="location.reload()">Restart</button>`;
  }

  document.getElementById("scoreDisplay").innerText =
    `Score: ${score} | High Score: ${highScore} | Level: ${currentLevel}`;
}


export function drawHealthBar(canvas, ctx, player) {
  const barWidth = 200;
  const barHeight = 25;
  const x = 20;
  const y = canvas.height - 50;

  // Background
  ctx.fillStyle = "#222";
  ctx.fillRect(x, y, barWidth, barHeight);

  // Calculate health ratio
  const healthPercent = player.hp / 20;

  // Determine color
  let barColor = "#00ff00"; // Green by default

  if (healthPercent <= 0.35) {
    // Strobe red
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    barColor = strobe ? "#ff0000" : "#880000";
  } else if (healthPercent <= 0.7) {
    barColor = "#ffa500"; // Orange
  }

  // Fill bar
  ctx.fillStyle = barColor;
  ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

  // Border
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barWidth, barHeight);

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Orbitron";
  ctx.fillText(`HP: ${player.hp}/20`, x + 5, y + 18);
}



export function updateHealthBar(player, maxHP, maxBarWidth) {
  if (!player || typeof player.hp === 'undefined') return;
  const bar = document.getElementById('healthBar');
  const container = document.getElementById('healthBarContainer');
  const percent = Math.max(0, player.hp / maxHP);

  // Update fill bar
  const fillWidth = percent * (maxBarWidth - 10); // subtract padding/margin if needed
  bar.style.width = fillWidth + "px";

  // Update border container width
  const containerWidth = Math.max(percent * maxBarWidth, 50);
  container.style.width = containerWidth + "px";

  // Color logic
  let barColor = "#00ff00";
  if (percent <= 0.35) {
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    barColor = strobe ? "#ff0000" : "#880000";
  } else if (percent <= 0.7) {
    barColor = "#ffa500";
  }

  bar.style.backgroundColor = barColor;
}