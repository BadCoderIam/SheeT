document.getElementById("startButton").onclick = () => {
  document.getElementById("startScreen").style.display = "none";
  gameStarted = true;
  updateBackground();
  updateScore();
  startTimer();
  updateAmmoDisplay();
  initIntervals();
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