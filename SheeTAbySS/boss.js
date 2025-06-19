// Boss.js

import { updateScore } from './UI.js';
import { player } from './playerimg.js';
import { enemyBullets } from './Bullets.js';
import * as audio from './audio.js';

export const BossImagesByHP = {
  300: new Image(),
  200: new Image(),
  100: new Image(),
  50: new Image()
};

BossImagesByHP[300].src = "./sprites/enemyGreen5.png";
BossImagesByHP[200].src = "./sprites/enemyblue5.png";
BossImagesByHP[100].src = "./sprites/enemyRed5.png";
BossImagesByHP[50].src = "./sprites/enemyblack5.png";

export const bossImage = new Image();
bossImage.src = "./Sprites/enemyBlack5.png";

export let BossImg = BossImagesByHP[300];

export function updateBossImage(bossHP) {
  if (bossHP >= 300) BossImg = BossImagesByHP[300];
  else if (bossHP >= 200) BossImg = BossImagesByHP[200];
  else if (bossHP >= 100) BossImg = BossImagesByHP[100];
  else if (bossHP > 0) BossImg = BossImagesByHP[50];
}

export function spawnBoss(canvas) {
  return {
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

export function drawBoss(ctx, boss, levelRef, maxLevel, updateBackground, timePowerupsSpawned, timePowerup, canvas, explosionImg, bullets, setGameOver) {
  if (!boss) return;

  // Move boss
  boss.x += boss.dx;
  if (boss.x < 0 || boss.x + boss.width > canvas.width) boss.dx *= -1;

  updateBossImage(boss.hp);
  ctx.drawImage(BossImg, boss.x, boss.y, boss.width, boss.height);

  // Draw HP bar
  const barWidth = boss.width;
  const barHeight = 10;
  const barX = boss.x;
  const barY = boss.y - 15;
  const healthPercent = boss.hp / 300;

  ctx.fillStyle = "#222";
  ctx.fillRect(barX, barY, barWidth, barHeight);

  let barColor = "#00ff00";
  if (boss.hp <= 100) barColor = "#ff0000";
  else if (boss.hp <= 200) barColor = "#ffa500";

  ctx.fillStyle = barColor;
  ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

  ctx.strokeStyle = "#fff";
  ctx.strokeRect(barX, barY, barWidth, barHeight);

  // Fire bullets every 1s
  if (Date.now() - boss.lastShotTime > 1000 && player && player.width && player.height) {
    const dx = (player.x + player.width / 2) - (boss.x + boss.width / 2);
    const dy = (player.y + player.height / 2) - (boss.y + boss.height);
    const mag = Math.sqrt(dx * dx + dy * dy);
    const speed = 4;
    const vx = (dx / mag) * speed;
    const vy = (dy / mag) * speed;

    enemyBullets.push({
      x: boss.x + boss.width / 2 - 5,
      y: boss.y + boss.height,
      width: 10,
      height: 20,
      vx, vy
    });

    audio.playLaser();
    boss.lastShotTime = Date.now();
  }

  // Check bullet collisions
  for (let i = bullets.length - 1; i >= 0; i--) {
    const b = bullets[i];
    if (
      b.x < boss.x + boss.width &&
      b.x + b.width > boss.x &&
      b.y < boss.y + boss.height &&
      b.y + b.height > boss.y
    ) {
      bullets.splice(i, 1);
      boss.hp -= 1;

      updateScore(
        levelRef,
        levelRef.value,
        maxLevel,
        { value: boss },
        setGameOver,
        updateBackground,
        { value: timePowerupsSpawned },
        timePowerup,
        canvas,
        bossImage
      );

      ctx.drawImage(explosionImg, b.x, b.y, 30, 30);
      audio.playExplosion();

      if (boss.hp <= 0) {
        return null; // signal boss defeat
      }
    }
  }

  return boss;
}