// === js/meteors.js ===
import { GameState } from './state.js';
import {
  explosionImg,
  fragmentImg,
  brownFragmentImg,
  rogueMeteorImage
} from './sprites.js';
import { playSound } from './audio.js';
import { updateBackground } from './ui.js';

const meteorImagesByLevel = {
  1: ["./sprites/meteorBrown_small2.png", "./sprites/meteorBrown_big2.png"],
  2: ["./sprites/meteorGrey_med2.png", "./sprites/meteorGrey_small2.png", "./sprites/meteorGrey_big1.png"],
  3: ["./sprites/meteorBrown_med3.png", "./sprites/meteorBrown_big2.png"],
  4: ["./sprites/enemyGreen2.png", "./sprites/enemyBlack3.png"],
  5: ["./sprites/METEORITE-ELEMENTONLY-s.gif", "./sprites/enemyBlack4.png"],
  6: ["./sprites/METEORITE-ELEMENTONLY-s.gif"]
};

const meteorHPByImage = {
  "./sprites/meteorBrown_small2.png": 2,
  "./sprites/meteorGrey_small2.png": 3,
  "./sprites/meteorGrey_med2.png": 3,
  "./sprites/meteorGrey_big1.png": 4,
  "./sprites/meteorGrey_tiny1.png": 1,
  "./sprites/meteorBrown_tiny1.png": 1,
  "./sprites/meteorBrown_med3.png": 4,
  "./sprites/meteorBrown_big2.png": 4,
  "./sprites/enemyGreen2.png": 4,
  "./sprites/enemyBlack3.png": 4,
  "./sprites/enemyBlack4.png": 4,
  "./sprites/METEORITE-ELEMENTONLY-s.gif": 5
};

export function spawnMeteor() {
  const level = GameState.level;
  const availableImages = meteorImagesByLevel[level];
  const imgSrc = availableImages[Math.floor(Math.random() * availableImages.length)];
  const img = new Image();
  img.src = imgSrc;

  let size = Math.random() * 40 + 30;
  let hp = (meteorHPByImage[imgSrc] || 1) + (level - 1);

  let x = Math.random() * (GameState.canvas.width - size);
  let y = -size;
  let vx = 0;
  let vy = Math.random() * 3 + 1;

  const isRogueMeteor = level >= 3 && Math.random() < 0.1;
  if (isRogueMeteor) {
    img.src = rogueMeteorImage.src;
    size *= 1.5;

    const corner = Math.floor(Math.random() * 4);
    switch (corner) {
      case 0: x = 0; y = 0; break;
      case 1: x = GameState.canvas.width - size; y = 0; break;
      case 2: x = 0; y = GameState.canvas.height - size; break;
      case 3: x = GameState.canvas.width - size; y = GameState.canvas.height - size; break;
    }

    const diagSpeed = 2.5;
    switch (corner) {
      case 0: vx = diagSpeed; vy = diagSpeed; break;
      case 1: vx = -diagSpeed; vy = diagSpeed; break;
      case 2: vx = diagSpeed; vy = -diagSpeed; break;
      case 3: vx = -diagSpeed; vy = -diagSpeed; break;
    }
  }

  GameState.meteors.push({
    x, y, vx, vy,
    width: size,
    height: size,
    speed: vy,
    hp,
    img,
    lastShotTime: Date.now(),
    isRogue: isRogueMeteor
  });
}

export function updateMeteors() {
  const { canvas, bullets, meteors } = GameState;

  for (let mi = meteors.length - 1; mi >= 0; mi--) {
    const m = meteors[mi];
    m.x += m.vx || 0;
    m.y += m.vy || m.speed || 0;

    if (
      m.x + m.width < 0 || m.x > canvas.width ||
      m.y + m.height < 0 || m.y > canvas.height
    ) {
      meteors.splice(mi, 1);
      continue;
    }

    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      if (
        b.x < m.x + m.width &&
        b.x + b.width > m.x &&
        b.y < m.y + m.height &&
        b.y + b.height > m.y
      ) {
        m.hp--;
        bullets.splice(bi, 1);
        GameState.ctx.drawImage(explosionImg, m.x, m.y, m.width, m.height);
        playSound("explosion");

        if (m.hp <= 0) {
          handleMeteorDestruction(m, mi);
        }

        break;
      }
    }
  }
}

function handleMeteorDestruction(m, index) {
  let meteorPoints = m.hp > 4 ? 30 : m.hp > 2 ? 15 : 5;

  if (m.img.src.includes("meteorGrey_big1.png")) {
    spawnFragments(m.x, m.y, fragmentImg);
  } else if (m.img.src.includes("meteorBrown_big2.png")) {
    spawnFragments(m.x, m.y, brownFragmentImg);
  }

  GameState.meteors.splice(index, 1);
  GameState.score += meteorPoints;

  if (GameState.score > GameState.highScore) {
    GameState.highScore = GameState.score;
    localStorage.setItem('highScore', GameState.highScore);
  }

  if (GameState.score >= GameState.level * 100 && GameState.level < GameState.maxLevel) {
    GameState.level++;
    updateBackground();
  }
}

export function drawMeteors() {
  const ctx = GameState.ctx;
  GameState.meteors.forEach(m => {
    ctx.drawImage(m.img, m.x, m.y, m.width, m.height);
  });
}

function spawnFragments(x, y, image) {
  for (let i = 0; i < 3; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = Math.random() * 2 + 1;
    GameState.meteors.push({
      x, y,
      width: 25,
      height: 25,
      speed,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      hp: 1,
      img: image,
      isFragment: true
    });
  }
}