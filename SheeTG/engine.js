// engine.js (core game logic)

import { applyGravityPull } from '/gravity.js';
import { updateBackground } from '/levels.js';
import { initializeGoogleSignIn, getCurrentUser } from '/googleAuth.js';
import { getSelectedShip, selectedShip } from '/shipSelector.js';
import { updateScore, updateHealthBar, maxBarWidth, maxHP } from '/UI.js';
import { baseHp, handleMovement, getAmmo, setAmmo, maxAmmo, ammo, canvas, ctx, shakeTimer, setShakeTimer, shakeTimerRef, stopBackgroundMusic, level, levelRef, getLevel, setLevel, getTimeLeft, setTimeLeft, timePowerupsSpawned, timePowerup, powerup, hudState } from '/state.js';
import { playerImg, player, setPlayerShipImage } from '/playerimg.js';
import * as audio from '/audio.js';
import { playBackgroundMusic } from '/audio.js';
import { drawPowerup, drawTimePowerup, initPowerups, updatePowerupState, upgraded, upgradeEndTime, checkUpgradeTimeout } from '/powerups.js';
import { bullets, bulletImg, upgradedBulletImg, enemyBullets, enemyBulletImg, bulletImageRed, bulletImageGreen, currentBulletImage, setBulletImg, updateAmmoDisplay } from '/Bullets.js';
import {
  meteors,
  setMeteorState,
  spawnMeteor,
  drawMeteors,
  spawnFragments,
  updateMeteorAttacks, 
  checkMeteorCollisions, getScore, getHighScore, setMeteorLevelRef
} from './meteors.js';


(function () {


const BossImagesByHP = {
  300: new Image(),
  200: new Image(),
  100: new Image(),
  50: new Image()
};


BossImagesByHP[300].src = "./sprites/enemyGreen5.png";     // Full HP
BossImagesByHP[200].src = "./sprites/enemyblue5.png";     // Slight damage
BossImagesByHP[100].src = "./sprites/enemyRed5.png";        // Heavy damage
BossImagesByHP[50].src = "./sprites/enemyblack5.png";   // Critical



let boss = null;
const bossImage = new Image();
bossImage.src = "./Sprites/enemyBlack5.png";
    
let gameStarted = false;
let gameOver = false;
let score = 0;
let timerInterval = null;
let flashRed = false;
let flashTimer = 0;

    const maxLevel = 6;
    let highScore = localStorage.getItem('highScore') || 0;
    let BossImg = BossImagesByHP[300];

    
const fragmentImg = new Image();
fragmentImg.src = "./Sprites/meteorGrey_tiny1.png";
const brownFragmentImg = new Image();
brownFragmentImg.src = "./Sprites/meteorBrown_tiny1.png";
    const explosionImg = new Image();
    explosionImg.src = "./Sprites/Blank.png";

const rogueMeteorImage = new Image();
rogueMeteorImage.src = "./Sprites/METEORITE-ELEMENTONLY-s.gif";
    




    
    


    function drawBullets() {
      bullets.forEach((b, i) => {
        b.y -= b.speed;
        const img = upgraded ? upgradedBulletImg : bulletImg;
        ctx.drawImage(currentBulletImage, b.x, b.y, b.width, b.height);
        if (b.y < 0) bullets.splice(i, 1);
      });
    }
    




function drawBoss() {
  if (!boss) return;

  // Move boss side-to-side
  boss.x += boss.dx;
  if (boss.x < 0 || boss.x + boss.width > canvas.width) boss.dx *= -1;

if (boss) {
  updateBossImage(boss.hp);
  ctx.drawImage(BossImg, boss.x, boss.y, boss.width, boss.height);
  // === Boss Health Bar ===
const barWidth = boss.width;
const barHeight = 10;
const barX = boss.x;
const barY = boss.y - 15; // position above boss
const healthPercent = boss.hp / 300;

// Background
ctx.fillStyle = "#222";
ctx.fillRect(barX, barY, barWidth, barHeight);

// Fill
let barColor = "#00ff00";
if (boss.hp <= 100) {
  barColor = "#ff0000"; // red if critical
} else if (boss.hp <= 200) {
  barColor = "#ffa500"; // orange for mid HP
}

ctx.fillStyle = barColor;
ctx.fillRect(barX, barY, barWidth * healthPercent, barHeight);

// Border
ctx.strokeStyle = "#fff";
ctx.strokeRect(barX, barY, barWidth, barHeight);
}

  // Fire bullets at the player every 1s
  if (Date.now() - boss.lastShotTime > 1000) {
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

  // Bullet collision with boss
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
      score += 1;
      updateScore(
  levelRef,
  level,
  maxLevel,
  { value: boss }, // boss as a reference
  () => { gameOver = true; timerDisplay.classList.remove("pulsing"); }, // gameOverCallback
  updateBackground,
  { value: timePowerupsSpawned }, // timePowerupsSpawnedRef
  timePowerup,
  bossImage
);
      getLevel();
      ctx.drawImage(explosionImg, b.x, b.y, 30, 30);
      audio.playExplosion();

      if (boss.hp <= 0) {
        boss = null;
        gameOver = true;
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("startScreen").innerHTML =
          `<h1>You Defeated the SheeTy Boss! Good Jeb SheeTy!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><button onclick="location.reload()">Restart</button>`;
      }
    }
  }
}

function spawnBoss() {
  boss = {
    x: canvas.width / 2 - 100,
    y: 50,
    width: 200,
    height: 120,
    hp: 300,
    dx: 2,
    lastShotTime: Date.now()
  };
}

    function gameLoop() {
      
      
ctx.clearRect(0, 0, canvas.width, canvas.height);
if (gameOver) return;
handleMovement(canvas, player);
checkCollisions();
checkMeteorCollisions({
  player,
  meteors,
  shakeTimerRef: { value: shakeTimer },
  updateHealthBar,
  audio,
  score,
  levelRef,
  setGameOverCallback: () => {
    gameOver = true;
    timerDisplay.classList.remove("pulsing");
  }
});
      drawPlayer();
      drawBullets();
      drawMeteors(ctx, baseHp);
updateScore(
  levelRef,
  level,
  maxLevel,
  { value: boss }, // boss as a reference
  () => { gameOver = true; timerDisplay.classList.remove("pulsing"); }, // gameOverCallback
  updateBackground,
  { value: timePowerupsSpawned }, // timePowerupsSpawnedRef
  timePowerup,
  bossImage
);
      getLevel();
      if (levelRef.value === 6 && !boss) {
  spawnBoss();
}
      drawBoss();
      applyGravityPull(canvas, player, levelRef, updateHealthBar, audio.playShieldDown, val => shakeTimer = val);
      drawEnemyBullets(ctx, canvas, player);
requestAnimationFrame(gameLoop);
    }

    setInterval(() => {
      if (gameStarted) spawnMeteor(player.x, player.y, levelRef);
    }, 1000);

const shootingEnemies = ["enemyGreen2.png", "enemyBlack3.png", "enemyBlack4.png"];


setInterval(() => {
  if (gameStarted && levelRef.value >= 4) {
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
 // check more often, but shoot every 5s per Enemey

  const startButton = document.getElementById("startButton");

startButton.addEventListener('click', () => {
  const ship = getSelectedShip();  // ✅ Gets the *claimed* ship

  if (ship) {
    setPlayerShipImage(ship.image);

    playerImg.onload = () => {
      document.getElementById("startScreen").style.display = "none";
      document.getElementById('previousClaimsBox').style.display = 'none';
      gameStarted = true;
      playBackgroundMusic();

      updateBackground(level);
      updateScore(
        level,
        maxLevel,
        { value: boss },
        () => { gameOver = true; timerDisplay.classList.remove("pulsing"); stopBackgroundMusic(); },
        updateBackground,
        { value: timePowerupsSpawned },
        timePowerup,
        bossImage
      );

      getLevel();
      startTimer();
      updateAmmoDisplay();
      gameLoop();
    };

    playerImg.onerror = () => {
      alert("Error loading selected ship image. Please refresh and try again.");
    };

  } else {
    alert("No ship selected. Please spin and claim a ship first.");
  }
});


  

function startTimer() {
  document.getElementById("timerText").innerText = `Time: ${getTimeLeft()}`;
  timerInterval = setInterval(() => {
    if (!gameStarted || gameOver) {
      clearInterval(timerInterval);
      return;
    }

    setTimeLeft(getTimeLeft() - 1);
    document.getElementById("timerText").innerText = `Time: ${getTimeLeft()}`;
    const timerDisplay = document.getElementById("timerText");
if (getTimeLeft() <= 15) {
  timerDisplay.classList.add("pulsing");
} else {
  timerDisplay.classList.remove("pulsing");
}

    if (getTimeLeft() <= 0) {
      clearInterval(timerInterval);
      gameOver = true;
      stopBackgroundMusic();
      timerDisplay.classList.remove("pulsing");
      document.getElementById("startScreen").style.display = "flex";
      document.getElementById("startScreen").innerHTML = `<h1>Time's Up Piece of SHeeT! Game Over!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
    }
  }, 1000);
}


function updateBossImage(bossHP) {
  if (bossHP >= 300) BossImg = BossImagesByHP[300];
  else if (bossHP >= 200) BossImg = BossImagesByHP[200];
  else if (bossHP >= 100) BossImg = BossImagesByHP[100];
  else if (bossHP > 0) BossImg = BossImagesByHP[50];
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
      setShakeTimer(120);
      updateHealthBar(player, maxHP, maxBarWidth);
      getSelectedShip();
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
  if (!playerImg || !playerImg.complete) return;
  let offsetX = 0, offsetY = 0;
  if (shakeTimerRef.value > 0) {
    offsetX = Math.random() * 10 - 5;
    offsetY = Math.random() * 10 - 5;
    shakeTimerRef.value--;
  }
  const drawX = player.x + offsetX;
  const drawY = player.y + offsetY;

  // Draw the player ship
  ctx.drawImage(playerImg, drawX, drawY, player.width, player.height);

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
  const timePercent = Math.min(getTimeLeft() / 100, 1);

  let timeColor = "#ffcc00";
  if (getTimeLeft() <= 15) {
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
        initPowerups(canvas.width, hudState, ctx, canvas);
        drawPowerup(ctx, canvas, player);
        drawTimePowerup({
  ctx,
  canvas,
  player,
  level,
  updateHealthBar,
  audio,
  hudState,
  timePowerup,
  maxHP
});
        updateHealthBar(player, maxHP, maxBarWidth);
        updateAmmoDisplay();
        applyGravityPull(canvas, player, level, updateHealthBar, audio.playShieldDown, val => shakeTimer = val);
        checkUpgradeTimeout();
        requestAnimationFrame(gameLoop);
    } else {
        console.warn('gameLoop() function not found.');
    }
}
let originalGameLoop = gameLoop;
gameLoop = function () {
    originalGameLoop();
    drawPowerup(ctx, canvas, player);
    drawTimePowerup({
  ctx,
  canvas,
  player,
  level,
  updateHealthBar,
  audio,
  hudState,
  timePowerup,  // <-- if you're managing it via state
  maxHP
});
    updateHealthBar(player, maxHP, maxBarWidth);
    applyGravityPull(canvas, player, level, updateHealthBar, audio.playShieldDown, val => shakeTimer = val);
    updateAmmoDisplay();
    checkUpgradeTimeout();
};



function drawEnemyBullets(ctx, canvas, player) {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    ctx.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height);

    // Check collision with player
    if (
      b.x < player.x + player.width &&
      b.x + b.width > player.x &&
      b.y < player.y + player.height &&
      b.y + b.height > player.y
    ) {
      enemyBullets.splice(i, 1);
      player.hp--;
      setShakeTimer(120);
      audio.playShieldDown();

      if (player.hp <= 0) {
        gameOver = true;
        stopBackgroundMusic();
        timerDisplay.classList.remove("pulsing");
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("startScreen").innerHTML = `<h1>Game Over! You Died SheeTy!!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
      }
    }

    if (b.y > canvas.height) {
      enemyBullets.splice(i, 1);
    }
  }
}




})();

window.onload = () => {
  initializeGoogleSignIn('475019880749-qdbpinnod6egm4oqltv3qahgtuotlv69.apps.googleusercontent.com', (user) => {
    console.log('Logged in user:', user);
    document.getElementById('userInfo').innerText = `Welcome, ${user.name}!`;
  });
};