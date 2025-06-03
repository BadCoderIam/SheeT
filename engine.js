// engine.js (core game logic)
(function () {


  
  // Load sounds
  function createSound(src) {
    const audio = new Audio(src);
    return () => {
      const sound = audio.cloneNode();
      sound.play().catch(e => console.warn("Sound error:", e));
    };
  }

const playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

playerImagesByHP[20].src = "./sprites/playerShip3_green.png";     // Full HP
playerImagesByHP[15].src = "./sprites/playerShip3_blue.png";     // Slight damage
playerImagesByHP[10].src = "./sprites/playerShip3_orange.png";        // Heavy damage
playerImagesByHP[5].src = "./sprites/playerShip3_red.png";   // Critical

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


  const playLaser = createSound('./sounds/sfx_laser1.ogg');
  const playExplosion = createSound('./sounds/sfx_lose.ogg');
  const playShieldDown = createSound('./sounds/sfx_shieldDown.ogg');
  const playShieldUp = createSound('./sounds/sfx_shieldUp.ogg');
    const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
let boss = null;
const bossImage = new Image();
bossImage.src = "./Sprites/enemyBlack5.png";
    
let gameStarted = false;
let gameOver = false;
let playerHP = 20;
let meteorHP = 2;
let ammo = 500;
const maxAmmo = 500;
let keys = {};
let shakeTimer = 0;
let score = 0;
let timeLeft = 100; // in seconds
let timerInterval = null;
let timePowerupsSpawned = 0;
let maxTimePowerupsPerLevel = 2; // Change as needed
let flashRed = false;
let flashTimer = 0;
    let level = 1;
    const maxLevel = 6;
    let highScore = localStorage.getItem('highScore') || 0;
    let playerImg = playerImagesByHP[20];
    let BossImg = BossImagesByHP[300];

    const bulletImg = new Image();
    bulletImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAA2CAYAAAAVvbNoAAACbUlEQVR42nXVQUiTcRjH8adTlyDo1KWLndohcNv7vpuIuxgIeTCQEAyEPOwg4cGDgqAgIuTBYKCQKOZB3d61yGiI4dDEykrNcJTSaMlGlqNmLDVa8vQ+0A8egveFD2Pf/8Pe9/3vHSP6d8RNszdmWYvCNs2JmGm2YI3uVlScjQUCC/FAoPw/6bJOUdPsti3ryI2skzO967w5EK/7+w/319fLz7q6fqLJOkUtax9K+fyfk3KZfxWLJ7qTM52H8vExg+4ylIXfpRKD7jK0A85pGHQnOxDYgqNCgUF3ubsNONzbY9Cd4pa1CqVcjkF3cnZ2GX5kswy6kx0MpuAgk2HQXS58Dr5vbzPoLlswC9/SaQbdZeg+FDY3GXSXoWn4urbGoLvc3T34srrKoLt80ih8Xllh0J2cx3UY8ktLDLrL0B3IpVIMupPzwN+G3fl5Bt3J+WX0w6dkkkF3+Vp64OPsLIPuZBtGF2QSCQbdKWoYHfAhFmPQXX53t2BnaopBdxkKw/vJSQbdZZ9uwrvxcQbdKWYYNyA9Osqguwxdh62REQbdZZ+uwdtIhEF3sn2+q/BmaIhBd7L9/iuwMTjIoLucLgRrAwMMutOMYVTBq74+Bt1pprLSDy97ehh0p2mv9zK86O5m0J2iXu8leN7ZyaA7RX2+i7DS0cGgu1z4BVhub2fQnSY8nvPwtK2NQXcaCwbPwWI4zKA7DXs8ZyDV2sqgO0WITsNCSwuD7vL3cgqeNDcz6E76mG9qYiC3Y66xkcF1KNnQwOA69Li+nsF16FFdHYPr0MPaWgbXoURNTfFBKMTCdSheVdWbqK5medX9Lwgkf09Sr51zAAAALXRFWHRTb2Z0d2FyZQBieS5ibG9vZGR5LmNyeXB0by5pbWFnZS5QTkcyNEVuY29kZXKoBn/uAAAAAElFTkSuQmCC";

    const upgradedBulletImg = new Image();
const fragmentImg = new Image();
fragmentImg.src = "./Sprites/meteorGrey_tiny1.png";
const brownFragmentImg = new Image();
brownFragmentImg.src = "./Sprites/meteorBrown_tiny1.png";
    upgradedBulletImg.src = "./Sprites/laserGreen12.png";
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

    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 100,
      width: 80,
      height: 80,
      speed: 10
    };

    const bullets = [];
    const meteors = [];

const enemyBullets = [];
const enemyBulletImg = new Image();
enemyBulletImg.src = "./sprites/laserGreen12.png";


    function spawnMeteor(playerX = canvas.width / 2, playerY = canvas.height / 2) {
  const availableImages = meteorImagesByLevel[level];
  const imgSrc = availableImages[Math.floor(Math.random() * availableImages.length)];
  const img = new Image();
  img.src = imgSrc;

  let size = Math.random() * 40 + 30;
  const baseHp = meteorHPByImage[imgSrc] || 1;
  let hp = baseHp + (level - 1);

  let x = Math.random() * (canvas.width - size);
  let y = -size;
  let vx = 0;
  let vy = Math.random() * 3 + 1;

  const isRogueMeteor = (level >= 3 && level <= 6) && Math.random() < 0.1;

  if (isRogueMeteor) {
    size *= 1.5;
    hp *= 1;
    img.src = rogueMeteorImage.src;

    // Spawn from a random corner
    const corner = Math.floor(Math.random() * 4);
    switch (corner) {
      case 0: x = 0; y = 0; break;
      case 1: x = canvas.width - size; y = 0; break;
      case 2: x = 0; y = canvas.height - size; break;
      case 3: x = canvas.width - size; y = canvas.height - size; break;
    }

    // Always move diagonally from the corner
    const diagSpeed = 2.5;
    switch (corner) {
      case 0: vx = diagSpeed; vy = diagSpeed; break;         // Top-left
      case 1: vx = -diagSpeed; vy = diagSpeed; break;        // Top-right
      case 2: vx = diagSpeed; vy = -diagSpeed; break;        // Bottom-left
      case 3: vx = -diagSpeed; vy = -diagSpeed; break;       // Bottom-right
    }
  }

  meteors.push({
    x: x,
    y: y,
    width: size,
    height: size,
    speed: vy, // fallback for old logic
    vx: vx || 0,
    vy: vy || 0,
    hp: hp,
    img: img,
    lastShotTime: Date.now(),
    isRogue: isRogueMeteor
  });
}

    
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

    playLaser();
    updateAmmoDisplay();
  }
});
function updateBackground() {
    let bg = "./levels/background1.gif";
    if (level >= 2) bg = "./levels/background2.gif";
if (level >= 3) bg = "./levels/background3.gif";
if (level >= 4) bg = "./levels/background4.gif";
if (level >= 5) bg = "./levels/background5.gif";
if (level >= 6) bg = "./levels/background3.gif";
    document.body.style.backgroundImage = `url('${bg}')`;
    document.body.style.backgroundSize = "cover";
    document.body.style.backgroundRepeat = "no-repeat";
    document.body.style.backgroundPosition = "center center";
}
    

function updateScore() {
  if (score >= level * 100 && level < maxLevel) {
    level++;
    timePowerupsSpawned = 0;
    timePowerup.spawnTime = Date.now() + 10000 + Math.random() * 5000;
    updateBackground();

    // Spawn boss on level 6
    if (level === 6) {
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
  }


  // Do NOT trigger gameOver here unless score caps out and no boss is expected
  if (score >= 2000 && !boss) {
    gameOver = true;
    document.getElementById("startScreen").style.display = "flex";
    document.getElementById("startScreen").innerHTML = `<h1>You WON! Good Jeb SheeTy!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
  }

  document.getElementById("scoreDisplay").innerText = `Score: ${score} | High Score: ${highScore} | Level: ${level}`;
}

    function drawPlayer() {
      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
    }

    function drawBullets() {
      bullets.forEach((b, i) => {
        b.y -= b.speed;
        const img = upgraded ? upgradedBulletImg : bulletImg;
        ctx.drawImage(bulletImg, b.x, b.y, b.width, b.height);
        if (b.y < 0) bullets.splice(i, 1);
      });
    }
function checkUpgradeTimeout() {
  if (upgraded && Date.now() > upgradeEndTime) {
    upgraded = false;
    setBulletImg(false); // switch to default bullet
  }
}
    
function spawnFragments(x, y, fragmentImage) {
  for (let i = 0; i < 3; i++) {
    const angle = Math.random() * 2 * Math.PI;
    const speed = Math.random() * 2 + 1;
    meteors.push({
      x: x,
      y: y,
      width: 25,
      height: 25,
      speed: speed,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      hp: 1,
      img: fragmentImage,
      isFragment: true
    });
  }
}

function drawMeteors() {
  for (let mi = meteors.length - 1; mi >= 0; mi--) {
    const m = meteors[mi];

    // Update position
    m.x += m.vx || 0;
    m.y += m.vy || m.speed || 0;

    // Remove if off-screen
    if (
      m.x + m.width < 0 || m.x > canvas.width || 
      m.y + m.height < 0 || m.y > canvas.height
    ) {
      meteors.splice(mi, 1);
      continue;
    }

    // Draw meteor
    ctx.drawImage(m.img, m.x, m.y, m.width, m.height);

    // Bullet collision
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
        ctx.drawImage(explosionImg, m.x, m.y, m.width, m.height);
        playExplosion();

        if (m.hp <= 0) {
          let meteorPoints = 0;

          // 🎯 Score logic for rogues
          if (m.isRogue) {
            meteorPoints = 50;
          } else if (m.hp > 3) {
            meteorPoints = 30;
          } else if (m.hp > 2) {
            meteorPoints = 15;
          } else {
            meteorPoints = 5;
          }

          // 🔄 Fragment logic only for regular meteors
          if (!m.isRogue) {
            if (m.img.src.includes("meteorGrey_big1.png")) {
              spawnFragments(m.x, m.y, fragmentImg);
            } else if (m.img.src.includes("meteorBrown_big2.png")) {
              spawnFragments(m.x, m.y, brownFragmentImg);
            }
          }

          meteors.splice(mi, 1);
          score += meteorPoints;
          updateScore();
        }

        if (score > highScore) {
          highScore = score;
          localStorage.setItem('highScore', highScore);
        }

        break;
      }
    }

    // Cleanup fallback
    if (m.y > canvas.height) {
      meteors.splice(mi, 1);
    }
  }
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

    playLaser();
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
      updateScore();
      ctx.drawImage(explosionImg, b.x, b.y, 30, 30);
      playExplosion();

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
    function gameLoop() {
      
      
ctx.clearRect(0, 0, canvas.width, canvas.height);
if (gameOver) return;
handleMovement();
checkCollisions();

      drawPlayer();
      drawBullets();
      drawMeteors();
      drawBoss();
      drawEnemyBullets();
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
  const healthPercent = playerHP / 20;

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
  ctx.fillText(`HP: ${playerHP}/20`, x + 5, y + 18);
}

    setInterval(() => {
      if (gameStarted) spawnMeteor();
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
          playLaser();
        }
      }
    });
  }
}, 100);
 // check more often, but shoot every 5s per meteor


  document.getElementById("startButton").onclick = () => {
  // Insert the legend into the start screen
  document.getElementById("startScreen").innerHTML += `
    <div id="legend">
      <h3>Legend</h3>
      <div class="legend-item"><span class="icon">🛡️</span> = Player Life</div>
      <div class="legend-item"><span class="icon">⏱️</span> = Time Left</div>
      <div class="legend-item"><span class="icon">🔫</span> = Ammo</div>
      <div class="legend-item">
        <img src="./sprites/powerupBlue_bolt.png" class="powerup-icon" /> = Bullet Upgrade +200 Ammo
      </div>
      <div class="legend-item">
        <img src="./sprites/powerupGreen_time.png" class="powerup-icon" /> = +25 Time & +4 Health
      </div>
      <div class="legend-item">
        <img src="./sprites/powerupRed_ammo.png" class="powerup-icon" /> = +100 Ammo
      </div>
    </div>
  `;

  // Now hide the start screen and begin the game
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  updateBackground();
  updateScore();
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

function updateAmmoDisplay() {
  document.getElementById('ammoDisplay').innerText = `🔫 Ammo: ${ammo}`;
}

function updatePlayerImage() {
  // Check if the player's HP is between the predefined thresholds
  if (playerHP >= 1 && playerHP <= 4) {
    playerImg = playerImagesByHP[5];
  }
  else if (playerHP > 4 && playerHP <= 10) {
    playerImg = playerImagesByHP[5]; // Critical damage image
  }
  else if (playerHP > 10 && playerHP <= 15) {
    playerImg = playerImagesByHP[10]; // Heavy damage image
  }
  else if (playerHP > 15 && playerHP <= 20) {
    playerImg = playerImagesByHP[15]; // Slight damage image
  }
  else if (playerHP > 20) {
    playerImg = playerImagesByHP[20]; // Full HP image
  }
}
const maxHP = 20;
const maxBarWidth = 300;

function updateHealthBar() {
  const bar = document.getElementById('healthBar');
  const container = document.getElementById('healthBarContainer');
  const percent = Math.max(0, playerHP / maxHP);

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
      playerHP--;
      shakeTimer = 120;
      updateHealthBar();
      updatePlayerImage();
      playShieldDown();
      if (playerHP <= 0) {
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

    // === Layout constants ===
  const iconSize = 16;
  const spacing = 4;
  const hpBarWidth = player.width;
  const hpBarHeight = 10;
  const timeBarHeight = 6;

  // === HP Bar with strobe effect ===
  const hpBarX = drawX + iconSize + spacing;
  const hpBarY = drawY + player.height + spacing;
  const healthPercent = playerHP / 20;

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
        drawPowerup();
        drawTimePowerup();
        updateHealthBar();
        updateAmmoDisplay();
        checkUpgradeTimeout();
        requestAnimationFrame(gameLoop);
    } else {
        console.warn('gameLoop() function not found.');
    }
}
let originalGameLoop = gameLoop;
gameLoop = function () {
    originalGameLoop();
    drawPowerup();
    drawTimePowerup();
    updateHealthBar();
    updateAmmoDisplay();
    checkUpgradeTimeout();
};

// === Powerup and Bullet Upgrade Logic ===
let timePowerup = {
  x: Math.random() * canvas.width,
  y: -50,
  width: 32,
  height: 32,
  image: new Image(),
  active: false,
  spawnTime: Date.now() + 20000 + Math.random() * 15000 
};
timePowerup.image.src = "./sprites/powerupGreen_star.png";

let powerup = {
    x: Math.random() * canvas.width,
    y: -50,
    width: 32,
    height: 32,
    image: new Image(),
    active: false,
    spawnTime: Date.now() + 10000 + Math.random() * 10000
};
powerup.image.src = "./sprites/powerupBlue_bolt.png";

let upgraded = false;
let upgradeEndTime = 0;

// Update player bullet image function
function setBulletImg(upgraded) {
    bulletImage.src = Upgraded ? "./sprites/laserGreen12.png" : "./sprites/laserRed01.png";
}

// Spawn and draw powerup
function drawPowerup() {
  const now = Date.now();

  // Spawn if time passed and not active
  if (now > powerup.spawnTime && !powerup.active) {
    powerup.x = Math.random() * (canvas.width - powerup.width);
    powerup.y = -50;
    powerup.active = true;
  }

  if (powerup.active) {
    powerup.y += 2;
    ctx.drawImage(powerup.image, powerup.x, powerup.y, powerup.width, powerup.height);

    // Collision with player
    if (
      player.x < powerup.x + powerup.width &&
      player.x + player.width > powerup.x &&
      player.y < powerup.y + powerup.height &&
      player.y + player.height > powerup.y
    ) {
      powerup.active = false;

      // Apply powerup effect
      upgraded = true;
      upgradeEndTime = Date.now() + 10000;
      ammo = Math.min(ammo + 200, maxAmmo);
      updateAmmoDisplay();
      setBulletImage(true);
      playShieldUp();

      // 🔁 Set next spawn time (15–25 seconds later)
      powerup.spawnTime = now + 15000 + Math.random() * 10000;
    }

    // Despawn if off screen
    if (powerup.y > canvas.height) {
      powerup.active = false;

      // 🔁 Set next spawn time (if missed)
      powerup.spawnTime = now + 15000 + Math.random() * 10000;
    }
  }
}

function drawTimePowerup() {
  const now = Date.now();

  // Only spawn if:
  // - Time to spawn has passed
  // - Powerup isn't active
  // - Fewer than the max allowed have spawned this level
  if (
    now > timePowerup.spawnTime &&
    !timePowerup.active &&
    timePowerupsSpawned < maxTimePowerupsPerLevel
  ) {
    timePowerup.x = Math.random() * (canvas.width - timePowerup.width);
    timePowerup.y = -50;
    timePowerup.active = true;
    timePowerupsSpawned++;
  }

  if (timePowerup.active) {
    timePowerup.y += 2;
    ctx.drawImage(timePowerup.image, timePowerup.x, timePowerup.y, timePowerup.width, timePowerup.height);

    // Collision with player
    if (
      player.x < timePowerup.x + timePowerup.width &&
      player.x + player.width > timePowerup.x &&
      player.y < timePowerup.y + timePowerup.height &&
      player.y + player.height > timePowerup.y
    ) {
      timePowerup.active = false;
      timeLeft += 25;
      if (timeLeft > 999) timeLeft = 999;

      playerHP = Math.min(playerHP + 4, 20);
       updateHealthBar();      // Updates HUD
       updatePlayerImage(); 

      const timerDisplay = document.getElementById("timerText");
      timerDisplay.innerText = `Time: ${timeLeft}`;
      timerDisplay.classList.add("flash");
      setTimeout(() => timerDisplay.classList.remove("flash"), 3000);

      playShieldUp();

      // Set a new delayed spawn time (no back-to-back spawn)
      timePowerup.spawnTime = now + 15000 + Math.random() * 10000; // 15–25 sec delay
    }

    // Despawn if off screen
    if (timePowerup.y > canvas.height) {
      timePowerup.active = false;
      // Set delayed spawn time even if missed
      timePowerup.spawnTime = now + 15000 + Math.random() * 10000;
    }
  }
}


function drawEnemyBullets() {
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
      playerHP--;
      shakeTimer = 120;
      updatePlayerImage();
      playShieldDown();

      if (playerHP <= 0) {
        gameOver = true;
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
