// Updated meteors.js

import { player } from './playerimg.js';
import { bullets, enemyBullets } from './Bullets.js';
import * as audio from './audio.js';
import { baseHp, canvas, ctx } from './state.js';


let sharedLevelRef = { value: 1 };
let levelRef = { value: 1 };
export function setMeteorLevelRef(ref) {
  levelRef = ref;
}


export function setLevelRef(ref) {
  sharedLevelRef = ref;
}

let score = 0;
let highScore = 0;

const meteors = [];

const fragmentImg = new Image();
fragmentImg.src = "./Sprites/meteorGrey_tiny1.png";

const brownFragmentImg = new Image();
brownFragmentImg.src = "./Sprites/meteorBrown_tiny1.png";

const explosionImg = new Image();
explosionImg.src = "./Sprites/Blank.png";

const rogueMeteorImage = new Image();
rogueMeteorImage.src = "./Sprites/METEORITE-ELEMENTONLY-s.gif";

const meteorImagesByLevel = {
  1: ["./Sprites/meteorBrown_small2.png", "./Sprites/meteorBrown_big2.png"],
  2: ["./Sprites/meteorGrey_med2.png", "./sprites/meteorGrey_small2.png", "./Sprites/meteorGrey_big1.png"],
  3: ["./Sprites/meteorBrown_med3.png", "./Sprites/meteorBrown_big2.png"],
  4: ["./Sprites/enemyGreen2.png", "./Sprites/enemyBlack3.png"],
  5: ["./Sprites/METEORITE-ELEMENTONLY-s.gif", "./Sprites/enemyBlack4.png"],
  6: ["./Sprites/METEORITE-ELEMENTONLY-s.gif"]
};

const meteorHPByImage = {
  "./Sprites/meteorBrown_small2.png": 2,
  "./Sprites/meteorGrey_small2.png": 3,
  "./Sprites/meteorGrey_med2.png": 3,
  "./Sprites/meteorGrey_big1.png": 4,
  "./Sprites/meteorGrey_tiny1.png": 1,
  "./Sprites/meteorBrown_tiny1.png": 1,
  "./Sprites/meteorBrown_med3.png": 4,
  "./Sprites/meteorBrown_big2.png": 4,
  "./Sprites/enemyGreen2.png": 4,
  "./Sprites/enemyBlack3.png": 4,
  "./Sprites/enemyBlack4.png": 4,
  "./Sprites/METEORITE-ELEMENTONLY-s.gif": 6
};

let gameStarted = false;


export function setMeteorState(_level, _started, _score, _highScore) {
  level = _level;
  gameStarted = _started;
  score = _score;
  highScore = _highScore;
}

export function spawnMeteor(playerX, playerY, levelRef) {
  const availableImages = meteorImagesByLevel[levelRef.value];
  const imgSrc = availableImages[Math.floor(Math.random() * availableImages.length)];
  const baseHp = meteorHPByImage[imgSrc] || 1;
  const hp = baseHp + (levelRef.value - 1);

  const img = new Image();
  img.src = imgSrc;

  let size = Math.random() * 40 + 30;
  let originalHp = hp;

  let x = Math.random() * (canvas.width - size);
  let y = -size;
  let vx = 0;
  let vy = Math.random() * 3 + 1;

  const isRogueMeteor = (levelRef.value >= 3 && levelRef.value <= 6) && Math.random() < 0.1;

  if (isRogueMeteor) {
    size *= 1.5;
    img.src = rogueMeteorImage.src;

    const corner = Math.floor(Math.random() * 4);
    switch (corner) {
      case 0: x = 0; y = 0; break;
      case 1: x = canvas.width - size; y = 0; break;
      case 2: x = 0; y = canvas.height - size; break;
      case 3: x = canvas.width - size; y = canvas.height - size; break;
    }

    const diagSpeed = 2.5;
    switch (corner) {
      case 0: vx = diagSpeed; vy = diagSpeed; break;
      case 1: vx = -diagSpeed; vy = diagSpeed; break;
      case 2: vx = diagSpeed; vy = -diagSpeed; break;
      case 3: vx = -diagSpeed; vy = -diagSpeed; break;
    }
  }

  meteors.push({ x, y, width: size, height: size, speed: vy, vx, vy, hp, img, lastShotTime: Date.now(), isRogue: isRogueMeteor, baseHp: originalHp, });
}

export function drawMeteors(ctx, baseHp) {
  for (let mi = meteors.length - 1; mi >= 0; mi--) {
    const m = meteors[mi];
    m.x += m.vx || 0;
    m.y += m.vy || m.speed || 0;

    if (m.x + m.width < 0 || m.x > canvas.width || m.y + m.height < 0 || m.y > canvas.height) {
      meteors.splice(mi, 1);
      continue;
    }

    ctx.drawImage(m.img, m.x, m.y, m.width, m.height);

    for (let bi = bullets.length - 1; bi >= 0; bi--) {
      const b = bullets[bi];
      if (b.x < m.x + m.width && b.x + b.width > m.x && b.y < m.y + m.height && b.y + b.height > m.y) {
        m.hp--;
        bullets.splice(bi, 1);
        ctx.drawImage(explosionImg, m.x, m.y, m.width, m.height);
        audio.playExplosion();

        if (m.hp <= 0) {
          let meteorPoints = m.isRogue
  ? 15
  : (m.baseHp > 3 ? 10 : m.baseHp > 2 ? 5 : 2);

          if (!m.isRogue) {
            if (m.img.src.includes("meteorGrey_big1.png")) {
              spawnFragments(m.x, m.y, fragmentImg);
            } else if (m.img.src.includes("meteorBrown_big2.png")) {
              spawnFragments(m.x, m.y, brownFragmentImg);
            }
          }

          meteors.splice(mi, 1);
          score += meteorPoints;
        }

        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
        }

        break;
      }
    }
  }
}

function spawnFragments(x, y, fragmentImage) {
  for (let i = 0; i < 3; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 2 + 1;
    meteors.push({
      x, y,
      width: 25, height: 25,
      speed,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      hp: 1,
      img: fragmentImage,
      isFragment: true
    });
  }
}

export function updateMeteorAttacks() {
  const shootingEnemies = ["enemyGreen2.png", "enemyBlack3.png", "enemyBlack4.png"];
  if (gameStarted && level >= 4) {
    meteors.forEach(m => {
      if (!m.lastShotTime) m.lastShotTime = Date.now();
      if (shootingEnemies.some(name => m.img.src.includes(name))) {
        if (Date.now() - m.lastShotTime > 2000) {
          const dx = (player.x + player.width / 2) - (m.x + m.width / 2);
          const dy = (player.y + player.height / 2) - (m.y + m.height);
          const mag = Math.sqrt(dx * dx + dy * dy);
          const speed = 4;
          const vx = (dx / mag) * speed;
          const vy = (dy / mag) * speed;

          enemyBullets.push({
            x: m.x + m.width / 2 - 4,
            y: m.y + m.height,
            width: 8,
            height: 16,
            vx, vy
          });

          m.lastShotTime = Date.now();
          audio.playLaser();
        }
      }
    });
  }
}

export function checkMeteorCollisions({
  player,
  meteors,
  shakeTimerRef,
  updateHealthBar,
  updatePlayerImage,
  audio,
  score,
  levelRef,
  setGameOverCallback
}) {
  meteors.forEach((m, mi) => {
    if (
      player.x < m.x + m.width &&
      player.x + player.width > m.x &&
      player.y < m.y + m.height &&
      player.y + player.height > m.y
    ) {
      meteors.splice(mi, 1);
      player.hp--;
      shakeTimerRef.value = 120; // Access via reference object
      updateHealthBar();
      updatePlayerImage(player);
      audio.playShieldDown();

      if (player.hp <= 0) {
        setGameOverCallback();
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("startScreen").innerHTML = `<h1>Game Over! You Died SheeTy!!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
      }
    }
  });
}


export {
  meteors,
  spawnFragments
};

export function getScore() {
  return score;
}

export function getHighScore() {
  return highScore;
}
