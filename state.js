// state.js

import { bullets, updateAmmoDisplay } from './Bullets.js';
import * as audio from './audio.js';
import { upgraded } from './powerups.js';
import { player } from './playerimg.js';

export const canvas = document.getElementById("gameCanvas");
export const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

export let timePowerup = {
  x: Math.random() * canvas.width,
  y: -50,
  width: 32,
  height: 32,
  image: new Image(),
  active: false,
  spawnTime: Date.now() + 20000 + Math.random() * 15000 
};
timePowerup.image.src = "./sprites/powerupGreen_star.png";

export const hudState = {
  timeLeft: 100,
  timePowerupsSpawned: 0,
  maxTimePowerupsPerLevel: 3 // or whatever you want
};


export let powerup = {
    x: Math.random() * canvas.width,
    y: -50,
    width: 32,
    height: 32,
    image: new Image(),
    active: false,
    spawnTime: Date.now() + 10000 + Math.random() * 10000
};
powerup.image.src = "./sprites/powerupBlue_bolt.png";


export function getTimeLeft() {
  return hudState.timeLeft;
}
export function setTimeLeft(value) {
  hudState.timeLeft = Math.min(value, 999);
}

export let baseHp = 100;
export function setBaseHp(value) {
  baseHp = value;
}
export let timeLeft = 100; // in seconds
export let timerInterval = null;
export let timePowerupsSpawned = 0;
export let maxTimePowerupsPerLevel = 2; // Change as needed
export let level = 1;
export let backgroundMusic = null;
export let bulletUpgrade = "normal"; // "normal", "double", or "triple"
export const levelRef = { value: level };

export function setLevel(value) {
  level = value;
  levelRef.value = value; // Always keep them in sync
}

export function getLevel() {
  return levelRef.value;
}
export let ammo = 500;
export const maxAmmo = 500;

export function setAmmo(value) {
  ammo = value;
}

export function getAmmo() {
  return ammo;
}
export function getPlayerImageSrc() {
  return playerImg.src;
}

export function stopBackgroundMusic() {
  if (backgroundMusic) {
    backgroundMusic.pause();
    backgroundMusic.currentTime = 0; // Reset to start if needed
  }
}
let keys = {};

document.addEventListener('keyup', e => {
  keys[e.code] = false;
});

document.addEventListener('keydown', e => {
  keys[e.code] = true;

  if (e.code === "Space" && getAmmo() > 0) {
    if (upgraded) {
      const centerX = player.x + player.width / 2;

    bullets.push({ x: centerX - 15, y: player.y, width: 10, height: 20, speed: 8 }); // Left
    // bullets.push({ x: centerX - 0,  y: player.y, width: 10, height: 20, speed: 8 }); // Center
    bullets.push({ x: centerX + 15, y: player.y, width: 10, height: 20, speed: 8 }); // Right

    setAmmo(getAmmo() - 3);
  } else {
    bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20, speed: 8 });
    setAmmo(getAmmo() - 1);
  }

    audio.playLaser();
    updateAmmoDisplay(ammo);
  }
});

export function handleMovement(canvas, player) {
  if (keys["ArrowLeft"] || keys["KeyA"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["KeyD"]) player.x += player.speed;
  if (keys["ArrowUp"] || keys["KeyW"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["KeyS"]) player.y += player.speed;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}
