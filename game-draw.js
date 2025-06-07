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

   const shootingEnemies = ["enemyGreen2.png", "enemyBlack3.png", "enemyBlack4.png"];

function initIntervals() {
  setInterval(() => {
    if (gameStarted) spawnMeteor();
  }, 1000);

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
}
