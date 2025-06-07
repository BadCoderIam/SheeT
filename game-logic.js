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

function initIntervals() {
  setInterval(() => {
  if (gameStarted) spawnMeteor();
}, 1000);

  
}