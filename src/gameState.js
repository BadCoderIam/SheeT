// src/gameState.js

import { updateBackground } from './background.js';
import { updateAmmoDisplay } from './hud.js';
import { drawPowerup, drawTimePowerup } from './powerups.js';
import { updateScore } from './hud.js'; // Move this logic to hud.js if not here yet
import { gameLoop } from './main.js';

export let gameStarted = false;
export let gameOver = false;
export let playerHP = 20;
export let score = 0;
export let timeLeft = 100;
export let level = 1;

export const maxAmmo = 500;
export const maxLevel = 6;
export let ammo = 500;
export let keys = {};
export let shakeTimer = 0;
export let timerInterval = null;
export let timePowerupsSpawned = 0;
export const maxTimePowerupsPerLevel = 2;
export let flashRed = false;
export let flashTimer = 0;

export let highScore = localStorage.getItem('highScore') || 0;

export function startGame() {
  gameStarted = true;
  updateBackground();
  updateScore();
  startTimer();
  updateAmmoDisplay();
  requestAnimationFrame(gameLoop);
}

export function startTimer() {
  document.getElementById("timerText").innerText = `Time: ${timeLeft}`;
  timerInterval = setInterval(() => {
    if (!gameStarted || gameOver) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft--;
    document.getElementById("timerText").innerText = `Time: ${timeLeft}`;

    const timerDisplay = document.getElementById("timerText");
    if (timeLeft <= 15) {
      timerDisplay.classList.add("pulsing");
    } else {
      timerDisplay.classList.remove("pulsing");
    }

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      timerDisplay.classList.remove("pulsing");
      document.getElementById("startScreen").style.display = "flex";
      document.getElementById("startScreen").innerHTML = `
        <h1>Time's Up Piece of SHeeT! Game Over!</h1>
        <p>Score: ${score}</p>
        <p>High Score: ${highScore}</p>
        <p>Level: ${level}</p>
        <button onclick="location.reload()">Restart</button>`;
    }
  }, 1000);
}
