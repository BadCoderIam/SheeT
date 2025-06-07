export let meteorHP = 2;

export const meteors = [];

export const fragmentImg = new Image();
fragmentImg.src = "./Sprites/meteorGrey_tiny1.png";
export const brownFragmentImg = new Image();
brownFragmentImg.src = "./Sprites/meteorBrown_tiny1.png";
    upgradedBulletImg.src = "./Sprites/laserGreen12.png";
    export const explosionImg = new Image();
    explosionImg.src = "./Sprites/Blank.png";

export const rogueMeteorImage = new Image();
rogueMeteorImage.src = "./Sprites/METEORITE-ELEMENTONLY-s.gif";

export const meteorImagesByLevel = {
  1: ["./Sprites/meteorBrown_small2.png", "./Sprites/meteorBrown_big2.png"],
  2: ["./Sprites/meteorGrey_med2.png", "./sprites/meteorGrey_small2.png", "./Sprites/meteorGrey_big1.png"],
  3: ["./Sprites/meteorBrown_med3.png", "./Sprites/meteorBrown_big2.png"],
  4: ["./Sprites/enemyGreen2.png", "./Sprites/enemyBlack3.png"],
  5: ["./Sprites/METEORITE-ELEMENTONLY-s.gif", "./Sprites/enemyBlack4.png"],
  6: ["./Sprites/METEORITE-ELEMENTONLY-s.gif"] 
};
export const meteorHPByImage = {
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

  export function spawnMeteor(playerX = canvas.width / 2, playerY = canvas.height / 2) {
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

export function spawnFragments(x, y, fragmentImage) {
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

export function drawMeteors() {
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

export function checkCollisions() {
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