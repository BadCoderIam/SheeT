// === js/bullets.js ===
import { GameState } from './state.js';

export function updateBullets() {
  GameState.bullets = GameState.bullets.filter(b => {
    b.y -= b.speed;
    return b.y + b.height > 0;
  });
}

export function drawBullets() {
  const { ctx, bullets, upgraded, bulletImg, upgradedBulletImg } = GameState;

  bullets.forEach((b, i) => {
    const img = upgraded ? upgradedBulletImg : bulletImg;
    ctx.drawImage(img, b.x, b.y, b.width, b.height);
  });
}

export function updateEnemyBullets() {
  GameState.enemyBullets = GameState.enemyBullets.filter(b => {
    b.x += b.vx;
    b.y += b.vy;
    return b.y < GameState.canvas.height;
  });
}

export function drawEnemyBullets() {
  const ctx = GameState.ctx;
  GameState.enemyBullets.forEach(b => {
    ctx.fillStyle = '#0f0';
    ctx.fillRect(b.x, b.y, b.width, b.height);
  });
}