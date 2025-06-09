// UI.js - handles score display and game over screen

import { getScore, getHighScore } from './meteors.js';
import { updateBackground } from './levels.js';


export function updateScore(
  levelRef,
  level,
  maxLevel,
  bossRef,
  gameOverCallback,
  updateBackground,
  timePowerupsSpawnedRef,
  timePowerup,
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