// === js/state.js ===
export const GameState = {
  canvas: null,
  ctx: null,
  player: null,
  bullets: [],
  meteors: [],
  enemyBullets: [],
  boss: null,
  score: 0,
  level: 1,
  maxLevel: 6,
  highScore: 0,
  gameStarted: false,
  gameOver: false,
  keys: {},
  playerHP: 20,
  shakeTimer: 0,
  upgraded: false,
  upgradeEndTime: 0,
  powerup: null,
};

export function initGameState() {
  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  GameState.canvas = canvas;
  GameState.ctx = ctx;
  GameState.highScore = parseInt(localStorage.getItem('highScore')) || 0;
  GameState.player = {
    x: canvas.width / 2 - 25,
    y: canvas.height - 100,
    width: 60,
    height: 60,
    speed: 10
  };

  // Event Listeners
  document.addEventListener('keydown', e => GameState.keys[e.code] = true);
  document.addEventListener('keyup', e => GameState.keys[e.code] = false);
}
