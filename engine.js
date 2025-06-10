// engine.js (core game logic)

import { applyGravityPull } from './gravity.js';
import { updateBackground } from './levels.js';
import { updateScore } from './UI.js';
import { baseHp } from './state.js';
import { playerImg, playerImagesByHP, updatePlayerImage, player } from './playerimg.js';
import * as audio from './audio.js';
import { drawBullets, drawEnemyBullets, bullets, bulletImg, upgradedBulletImg, enemyBullets, enemyBulletImg, bulletImageRed, bulletImageGreen, currentBulletImage, setBulletImg } from './Bullets.js';
import {
  meteors,
  setMeteorState,
  spawnMeteor,
  drawMeteors,
  spawnFragments,
  updateMeteorAttacks, 
  checkMeteorCollisions, getScore, getHighScore, setMeteorLevelRef
} from './meteors.js';
import {
  BossImagesByHP,
  bossImage,
  BossImg,
  updateBossImage,
  spawnBoss,
  drawBoss
} from './Boss.js';
import { drawPowerup, drawTimePowerup, upgraded, upgradeEndTime, initPowerups, timePowerup, updatePowerupState } from './powerups.js';


(function () {

let bossWarningActive = false;
let bossWarningStartTime = 0;
let bossSpawnDelayed = false;
let bossWarningOpacity = 0;
let shakeUntil = 0;

const BossImagesByHP = {
  300: new Image(),
  200: new Image(),
  100: new Image(),
  50: new Image()
};

const explosionImg = new Image();
explosionImg.src = "./Sprites/Blank.png";

BossImagesByHP[300].src = "./sprites/enemyGreen5.png";     // Full HP
BossImagesByHP[200].src = "./sprites/enemyblue5.png";     // Slight damage
BossImagesByHP[100].src = "./sprites/enemyRed5.png";        // Heavy damage
BossImagesByHP[50].src = "./sprites/enemyblack5.png";   // Critical


    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
let boss = null;
const bossImage = new Image();
bossImage.src = "./Sprites/enemyBlack5.png";
    
let gameStarted = false;
let level = 1;
let levelRef = { value: level };
let gameOver = false;
let meteorHP = 2;
let ammo = 500;
const maxAmmo = 500;
const ammoState = { ammo, maxAmmo };
let keys = {};
let shakeTimer = 0;
let score = 0;
let timeLeft = 100; // in seconds
let timerInterval = null;
let timePowerupsSpawned = 0;
let maxTimePowerupsPerLevel = 2;
const hudState = { timeLeft, timePowerupsSpawned, maxTimePowerupsPerLevel }; // Change as needed
let flashRed = false;
let flashTimer = 0;

    const maxLevel = 6;
    let highScore = localStorage.getItem('highScore') || 0;
    let BossImg = BossImagesByHP[300];

function updateAmmoDisplay() {
  document.getElementById('ammoDisplay').innerText = `🔫 Ammo: ${ammo}`;
}

const maxHP = 20;
const maxBarWidth = 300;

    
document.addEventListener('keydown', e => {
  keys[e.code] = true;

  if (e.code === "Space" && ammo > 0) {
    if (upgraded) {
      bullets.push({ x: player.x + player.width / 2 - 15, y: player.y, width: 10, height: 20, speed: 8 });
      bullets.push({ x: player.x + player.width / 2 + 5, y: player.y, width: 10, height: 20, speed: 8 });
      ammo -= 2;
    } else {
      bullets.push({ x: player.x + player.width / 2 - 5, y: player.y, width: 10, height: 20, speed: 8 });
      ammo--;
    }

    audio.playLaser();
    updateAmmoDisplay();
  }
});
    

  
function checkUpgradeTimeout() {
  if (upgraded && Date.now() > upgradeEndTime) {
    upgraded = false;
    setBulletImg(false); // switch to default bullet
  }
}
    

    function gameLoop() {
      
      
ctx.clearRect(0, 0, canvas.width, canvas.height);
if (gameOver) return;
handleMovement();
checkCollisions();
checkMeteorCollisions({
  player,
  meteors,
  shakeTimerRef: { value: shakeTimer },
  updateHealthBar,
  updatePlayerImage,
  audio,
  score,
  levelRef,
  setGameOverCallback: () => {
    gameOver = true;
    timerDisplay.classList.remove("pulsing");
  }
});
      drawPlayer();
      updatePowerupState(Date.now());
      drawBullets(ctx, upgraded, currentBulletImage);
      drawPowerup(ctx, canvas, player, ammoState, updateAmmoDisplay, ammo);
      drawTimePowerup(ctx, canvas, player, updateHealthBar, updatePlayerImage, hudState);
      drawMeteors(ctx, baseHp);
      if (level === 6 && !boss) {
  boss = {
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
updateScore(
  levelRef,
  level,
  maxLevel,
  { value: boss }, // boss as a reference
  () => { gameOver = true; timerDisplay.classList.remove("pulsing"); }, // gameOverCallback
  updateBackground,
  { value: timePowerupsSpawned }, // timePowerupsSpawnedRef
  timePowerup,
  canvas,
  bossImage
);
level = levelRef.value;
      boss = drawBoss(
  ctx,
  boss,
  levelRef,
  maxLevel,
  updateBackground,
  timePowerupsSpawned,
  timePowerup,
  canvas,
  explosionImg,
  bullets,
  () => {
    gameOver = true;
    timerDisplay.classList.remove("pulsing");
    document.getElementById("startScreen").style.display = "flex";
    document.getElementById("startScreen").innerHTML =
      `<h1>You Defeated the SheeTy Boss! Good Jeb SheeTy!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><button onclick=\"location.reload()\">Restart</button>`;
  }
);
      applyGravityPull(canvas, player, levelRef.value, updateHealthBar, updatePlayerImage, audio.playShieldDown, val => shakeTimer = val);
      drawEnemyBullets(ctx, player, canvas, shakeTimer, updateHealthBar, updatePlayerImage, audio.playShieldDown, gameOver, score, highScore, level);
requestAnimationFrame(gameLoop);
    }
function drawHealthBar() {
  const barWidth = 200;
  const barHeight = 25;
  const x = 20;
  const y = canvas.height - 50;

  // Background
  ctx.fillStyle = "#222";
  ctx.fillRect(x, y, barWidth, barHeight);

  // Calculate health ratio
  const healthPercent = player.hp / 20;

  // Determine color
  let barColor = "#00ff00"; // Green by default

  if (healthPercent <= 0.35) {
    // Strobe red
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    barColor = strobe ? "#ff0000" : "#880000";
  } else if (healthPercent <= 0.7) {
    barColor = "#ffa500"; // Orange
  }

  // Fill bar
  ctx.fillStyle = barColor;
  ctx.fillRect(x, y, barWidth * healthPercent, barHeight);

  // Border
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 2;
  ctx.strokeRect(x, y, barWidth, barHeight);

  // Text
  ctx.fillStyle = "#ffffff";
  ctx.font = "18px Orbitron";
  ctx.fillText(`HP: ${player.hp}/20`, x + 5, y + 18);
}

    setInterval(() => {
      if (gameStarted) spawnMeteor(player.x, player.y, levelRef);
    }, 1000);

const shootingEnemies = ["enemyGreen2.png", "enemyBlack3.png", "enemyBlack4.png"];


setInterval(() => {
  if (gameStarted && level >= 4) {
    meteors.forEach(m => {
      if (!m.lastShotTime) m.lastShotTime = Date.now();
      if (shootingEnemies.some(name => m.img.src.includes(name))) {
        if (Date.now() - m.lastShotTime > 2000) {
            const dx = (player.x + player.width / 2) - (m.x + m.width / 2);
            const dy = (player.y + player.height / 2) - (m.y + m.height);
            const magnitude = Math.sqrt(dx * dx + dy * dy);
            const speed = 4;
            const vx = (dx / magnitude) * speed;
            const vy = (dy / magnitude) * speed;
          enemyBullets.push({
            x: m.x + m.width / 2 - 4,
            y: m.y + m.height,
            width: 8,
            height: 16,
            vx: vx,
            vy: vy
          });
          m.lastShotTime = Date.now();
          audio.playLaser();
        }
      }
    });
  }
}, 100);
 // check more often, but shoot every 5s per meteor


  document.getElementById("startButton").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  updateBackground(level);
  updateScore(
  level,
  maxLevel,
  { value: boss }, // as a reference
  () => { gameOver = true; timerDisplay.classList.remove("pulsing"); },
  updateBackground,
  { value: timePowerupsSpawned },
  timePowerup,
  canvas,
  bossImage
);
level = levelRef.value;
  startTimer();
  updateAmmoDisplay();
  gameLoop();
};

  
document.addEventListener('keyup', e => {
  keys[e.code] = false;
});

function startTimer() {
  document.getElementById("timerText").innerText = `Time: ${timeLeft}`;
  timerInterval = setInterval(() => {
    if (!gameStarted || gameOver) {
      clearInterval(timerInterval);
      return;
    }

    timeLeft--;
    document.getElementById("timerText").innerText = `Time: ${timeLeft}`;
    const timerDisplay = document.getElementById("timerText");
if (timeLeft <= 15) {
  timerDisplay.classList.add("pulsing");
} else {
  timerDisplay.classList.remove("pulsing");
}

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      timerDisplay.classList.remove("pulsing");
      document.getElementById("startScreen").style.display = "flex";
      document.getElementById("startScreen").innerHTML = `<h1>Time's Up Piece of SHeeT! Game Over!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
    }
  }, 1000);
}
function handleMovement() {
  if (keys["ArrowLeft"] || keys["KeyA"]) player.x -= player.speed;
  if (keys["ArrowRight"] || keys["KeyD"]) player.x += player.speed;
  if (keys["ArrowUp"] || keys["KeyW"]) player.y -= player.speed;
  if (keys["ArrowDown"] || keys["KeyS"]) player.y += player.speed;
  if (player.x < 0) player.x = 0;
  if (player.x + player.width > canvas.width) player.x = canvas.width - player.width;
  if (player.y < 0) player.y = 0;
  if (player.y + player.height > canvas.height) player.y = canvas.height - player.height;
}


function updateHealthBar() {
  const bar = document.getElementById('healthBar');
  const container = document.getElementById('healthBarContainer');
     container.style.display = "flex";
  const percent = Math.max(0, player.hp / maxHP);

  // Update fill bar
  const fillWidth = percent * (maxBarWidth - 10); // subtract padding/margin if needed
  bar.style.width = fillWidth + "px";

  // Update border container width
  const containerWidth = Math.max(percent * maxBarWidth, 50);
  container.style.width = containerWidth + "px";

  // Color logic
  let barColor = "#00ff00";
  if (percent <= 0.35) {
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    barColor = strobe ? "#ff0000" : "#880000";
  } else if (percent <= 0.7) {
    barColor = "#ffa500";
  }

  bar.style.backgroundColor = barColor;
}

function checkCollisions() {
  meteors.forEach((m, mi) => {
    if (
      player.x < m.x + m.width &&
      player.x + player.width > m.x &&
      player.y < m.y + m.height &&
      player.y + player.height > m.y
    ) {
      meteors.splice(mi, 1);
      player.hp--;
      shakeTimer = 120;
      updateHealthBar();
      updatePlayerImage(player);
      audio.playShieldDown();
      if (player.hp <= 0) {
        gameOver = true;
        timerDisplay.classList.remove("pulsing");
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("startScreen").innerHTML = `<h1>Game Over! You Died SheeTy!!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
      }
    }
  });
}

function drawPlayer() {
  let offsetX = 0, offsetY = 0;
  if (shakeTimer > 0) {
    offsetX = Math.random() * 10 - 5;
    offsetY = Math.random() * 10 - 5;
    shakeTimer--;
  }
  const drawX = player.x + offsetX;
  const drawY = player.y + offsetY;

  // Draw the player ship
  ctx.drawImage(playerImg, drawX, drawY, player.width, player.height);
  updateHealthBar();

    // === Layout constants ===
  const iconSize = 16;
  const spacing = 4;
  const hpBarWidth = player.width;
  const hpBarHeight = 10;
  const timeBarHeight = 6;

  // === HP Bar with strobe effect ===
  const hpBarX = drawX + iconSize + spacing;
  const hpBarY = drawY + player.height + spacing;
  const healthPercent = player.hp / 20;

  let barColor = "#00ff00"; // Default: green
  if (healthPercent <= 0.35) {
    const strobe = Math.floor(Date.now() / 100) % 2 === 0;
    barColor = strobe ? "#ff0000" : "#880000";
  } else if (healthPercent <= 0.7) {
    barColor = "#ffa500"; // Orange
  }

  // Background
  ctx.fillStyle = "#222";
  ctx.fillRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

  // Fill
  ctx.fillStyle = barColor;
  ctx.fillRect(hpBarX, hpBarY, hpBarWidth * healthPercent, hpBarHeight);

  // Border
  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(hpBarX, hpBarY, hpBarWidth, hpBarHeight);

  // 🛡️ Icon
  ctx.font = `${iconSize}px Orbitron`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("🛡️", drawX, hpBarY + hpBarHeight);

  // === Time Bar with same styling ===
  const timeBarX = drawX + iconSize + spacing;
  const timeBarY = hpBarY + hpBarHeight + spacing;
  const timePercent = Math.min(timeLeft / 100, 1);

  let timeColor = "#ffcc00";
  if (timeLeft <= 15) {
    const pulse = Math.floor(Date.now() / 250) % 2 === 0;
    timeColor = pulse ? "#ff0000" : "#aa0000";
  }

  ctx.fillStyle = "#222";
  ctx.fillRect(timeBarX, timeBarY, hpBarWidth, timeBarHeight);

  ctx.fillStyle = timeColor;
  ctx.fillRect(timeBarX, timeBarY, hpBarWidth * timePercent, timeBarHeight);

  ctx.strokeStyle = "#fff";
  ctx.lineWidth = 1.5;
  ctx.strokeRect(timeBarX, timeBarY, hpBarWidth, timeBarHeight);

  // ⏱️ Icon
  ctx.font = `${iconSize}px Orbitron`;
  ctx.fillStyle = "#ffffff";
  ctx.fillText("⏱️", drawX, timeBarY + timeBarHeight);
}

function startGame() {
    if (typeof gameLoop === 'function') {
        score = 0;
        level = 0;
        gameOver = false;
        player.hp = 20;
        initPowerups(canvas.width, hudState);
        hudState.timePowerupsSpawned = 0;
        document.getElementById('healthBarContainer').style.display = "flex";
updateHealthBar();
        updateHealthBar();
        updateAmmoDisplay();
        applyGravityPull(canvas, player, levelRef.value, updateHealthBar, updatePlayerImage, audio.playShieldDown, val => shakeTimer = val);
        checkUpgradeTimeout();
        requestAnimationFrame(gameLoop);
    } else {
        console.warn('gameLoop() function not found.');
    }
}


})();
