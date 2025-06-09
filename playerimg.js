import { canvas } from './canvas.js';

let shakeTimer = 0;
export const playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

export const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 100,
      width: 80,
      height: 80,
      speed: 10,
      hp: 20
    };

playerImagesByHP[20].src = "./sprites/playerShip3_green.png";     // Full HP
playerImagesByHP[15].src = "./sprites/playerShip3_blue.png";     // Slight damage
playerImagesByHP[10].src = "./sprites/playerShip3_orange.png";        // Heavy damage
playerImagesByHP[5].src = "./sprites/playerShip3_red.png";   // Critical

export function updatePlayerImage(player) {
  if (!player || typeof player.hp === 'undefined') return;

  if (player.hp >= 1 && player.hp <= 5) {
    playerImg = playerImagesByHP[5];
  } else if (player.hp > 4 && player.hp <= 10) {
    playerImg = playerImagesByHP[5];
  } else if (player.hp > 10 && player.hp <= 15) {
    playerImg = playerImagesByHP[10];
  } else if (player.hp > 15 && player.hp <= 20) {
    playerImg = playerImagesByHP[15];
  } else if (player.hp > 20) {
    playerImg = playerImagesByHP[20];
  }
}

export function updateHealthBar(player, maxHP) {
  const maxBarWidth = 200; // or whatever width you want
  const bar = document.getElementById('healthBar');
  const container = document.getElementById('healthBarContainer');
  const percent = Math.max(0, player.hp / maxHP);

  const fillWidth = percent * (maxBarWidth - 10);
  bar.style.width = fillWidth + "px";

  const containerWidth = Math.max(percent * maxBarWidth, 50);
  container.style.width = containerWidth + "px";

  let barColor = "#00ff00";
  if (percent <= 0.35) {
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    barColor = strobe ? "#ff0000" : "#880000";
  } else if (percent <= 0.7) {
    barColor = "#ffa500";
  }

  bar.style.backgroundColor = barColor;
}

export let playerImg = playerImagesByHP[20];