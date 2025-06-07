// src/gameCore.js

// Game-wide state variables
export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

export let gameStarted = false;
export let gameOver = false;
export let level = 1;
export const maxLevel = 6;
export let score = 0;
export let highScore = localStorage.getItem("highScore") || 0;
export let timeLeft = 100;
export let timerInterval = null;
export let keys = {};

// Set up event listeners for key input
document.addEventListener("keydown", (e) => {
  keys[e.code] = true;
});

document.addEventListener("keyup", (e) => {
  keys[e.code] = false;
});

// Update the background image based on level
export function updateBackground() {
  let bg = `./levels/background1.gif`;
  if (level >= 2) bg = `./levels/background2.gif`;
  if (level >= 3) bg = `./levels/background3.gif`;
  if (level >= 4) bg = `./levels/background4.gif`;
  if (level >= 5) bg = `./levels/background5.gif`;
  if (level >= 6) bg = `./levels/background3.gif`;
  document.body.style.backgroundImage = `url('${bg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";
}

// Start game logic when the button is clicked
document.getElementById("startButton").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  updateBackground();
  updateScore();
  startTimer();
  updateAmmoDisplay();
  gameLoop();
};
