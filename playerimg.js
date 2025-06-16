import { canvas, ctx } from './state.js';

let shakeTimer = 0;

export const player = {
  x: canvas.width / 2 - 25,
  y: canvas.height - 100,
  width: 80,
  height: 80,
  speed: 10,
  hp: 20,
  maxHP: 20
};

export let playerImg = new Image();

// Set this when the player selects their ship
export function setPlayerShipImage(src) {
  console.log("Setting player ship image to:", src);
  playerImg.onload = () => {
    console.log("Player ship image loaded successfully.");
  };
  playerImg.onerror = () => {
    console.error("Failed to load player ship image:", src);
  };
  playerImg.src = src;
}

// Example: call this when claiming the ship
// setPlayerShipImage('./sprites/playerShip1_red.png');

export function updateHealthBar(player) {
  const maxBarWidth = 200;
  const bar = document.getElementById('healthBar');
  const container = document.getElementById('healthBarContainer');
  const percent = Math.max(0, player.hp / player.maxHP);

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
