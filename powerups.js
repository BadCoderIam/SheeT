export let timePowerupsSpawned = 0;
export let maxTimePowerupsPerLevel = 2;

// Correct order of declarations
export const bulletImageRed = new Image();
bulletImageRed.src = "./sprites/laserRed01.png";

export const bulletImageGreen = new Image();
bulletImageGreen.src = "./sprites/laserGreen12.png";

export let currentBulletImage = bulletImageRed;

// Update bullet image
export function setBulletImg(upgraded) {
  currentBulletImage = upgraded ? bulletImageGreen : bulletImageRed;
}

export let timePowerup = {
  x: 0,
  y: -50,
  width: 32,
  height: 32,
  image: new Image(),
  active: false,
  spawnTime: Date.now() + 20000 + Math.random() * 15000 
};

export let powerup = {
  x: 0,
  y: -50,
  width: 32,
  height: 32,
  image: new Image(),
  active: false,
  spawnTime: Date.now() + 10000 + Math.random() * 10000
};

powerup.image.src = "./sprites/powerupBlue_bolt.png";

export let upgraded = false;
export let upgradeEndTime = 0;

// Spawn and draw powerup
export function drawPowerup(ctx, canvas, player, ammo, maxAmmo, updateAmmoDisplay, setBulletImg, playShieldUp) {
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
      setBulletImg(true);
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

export function drawTimePowerup(ctx, canvas, player, timeLeft, updateHealthBar, updatePlayerImage, playShieldUp) {
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
    timePowerup.y += 4;
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

      player.hp = Math.min(player.hp + 4, 20);
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

document.addEventListener('keyup', e => {
  keys[e.code] = false;
});


export function drawBullets(ctx, bullets, canvas, player, ammo, maxAmmo, updateAmmoDisplay, setBulletImg, playShieldUp) {
       if (!Array.isArray(bullets)) {
    console.error('bullets is not an array:', bullets);
    return;
  }

  bullets.forEach((b, i) => {
    b.y -= b.speed;
    ctx.drawImage(currentBulletImage, b.x, b.y, b.width, b.height);
    if (b.y < 0) bullets.splice(i, 1);
  });
}
export function checkUpgradeTimeout() {
  if (upgraded && Date.now() > upgradeEndTime) {
    upgraded = false;
    setBulletImg(false); // switch to default bullet
  }
}

