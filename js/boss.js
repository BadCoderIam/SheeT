// === js/boss.js ===
import { GameState } from './state.js';

export function drawBoss() {
  const boss = GameState.boss;
  if (!boss) return;

  const ctx = GameState.ctx;
  ctx.fillStyle = 'red';
  ctx.fillRect(boss.x, boss.y, boss.width, boss.height);
}

export function updateBoss() {
  const boss = GameState.boss;
  if (!boss) return;

  boss.x += boss.dx;
  if (boss.x <= 0 || boss.x + boss.width >= GameState.canvas.width) {
    boss.dx *= -1;
  }
}
