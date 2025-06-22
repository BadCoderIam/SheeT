   import { playerImg, player } from '/playerimg.js';
   import * as audio from '/audio.js';
   import { getLevel, setShakeTimer } from '/state.js';
   import { updateHealthBar, maxHP, maxBarWidth } from '/UI.js';
   
   export function applyGravityPull(canvas, player) {
    const level = getLevel();
    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;

  if (level === 3 || level === 6) {
  const dx = centerX - (player.x + player.width / 2);
  const dy = centerY - (player.y + player.height / 2);
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Avoid divide-by-zero
  if (distance === 0) return;

  const gravityStrength = (level === 6) ? 0.00045 : 0.00025; // MUCH stronger
  const dirX = dx / distance;
  const dirY = dy / distance;

  if (player.xVelocity === undefined) player.xVelocity = 0;
  if (player.yVelocity === undefined) player.yVelocity = 0;

  const pull = Math.min(gravityStrength * distance, 0.5); // allow much stronger pull
  player.xVelocity += dirX * pull;
  player.yVelocity += dirY * pull;

  // Optional: apply mild damping
  player.xVelocity *= 0.9;
  player.yVelocity *= 0.9;

  // Cap speed to keep under control
  const maxSpeed = 3;
  player.xVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.xVelocity));
  player.yVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.yVelocity));

  player.x += player.xVelocity;
  player.y += player.yVelocity;

    // === Burn zone logic ===
    const deathRadius = (level === 6) ? 160 : 140;
    const now = Date.now();

    if (distance < deathRadius) {
      // 💥 Shake effect
      setShakeTimer(100);

      // 🔥 Burn damage timer
      if (player.lastGravityDamage === undefined) {
        player.lastGravityDamage = now;
      }

      if (now - player.lastGravityDamage >= 1000) {
        player.hp = Math.max(0, player.hp - 1);
        updateHealthBar(player, maxHP, maxBarWidth);
        audio.playShieldDown();
        player.lastGravityDamage = now;

        // Optional: Display burn message
        console.log("🔥 Burning in gravity core!");
      }
    } else {
      // Reset burn timer when out of range
      player.lastGravityDamage = undefined;
    }
  }

  // Level 4 rightward gravity
  if (level === 4) {
  const targetX = canvas.width; // pull toward right edge
  const dx = targetX - (player.x + player.width / 2);
  const distance = Math.abs(dx); // distance to the right

  const gravityStrength = .06; // Base strength
  const pull = Math.min(gravityStrength * distance, 1.5); // Cap pull strength

  if (player.xVelocity === undefined) player.xVelocity = 0;

  // Direction is always rightward, so no need to normalize
  player.xVelocity += pull * 0.02; // scaled down for smoother motion

  // Optional damping
  player.xVelocity *= 0.99;

  // Clamp max speed
  const maxSpeed = 7;
  player.xVelocity = Math.min(player.xVelocity, maxSpeed);

  // Apply movement
  player.x += player.xVelocity;

  // Clamp inside canvas
  if (player.x > canvas.width - player.width) {
    player.x = canvas.width - player.width;
    player.xVelocity = 0;
  }

  // === Right-side Burn Zone ===
  const burnZoneStartX = canvas.width / 2; // Starts at the middle
  const burnZoneWidth = canvas.width / 2; // Covers the right half
  const burnDamageRate = 2000; // 2 seconds
  const now = Date.now();

  const playerRight = player.x + player.width;

  if (playerRight > burnZoneStartX) {
    // Shake effect
    setShakeTimer(100);

    // Burn damage logic
    if (player.lastGravityDamage === undefined) {
      player.lastGravityDamage = now;
    }

    if (now - player.lastGravityDamage >= burnDamageRate) {
      player.hp = Math.max(0, player.hp - 1);
      updateHealthBar(player, maxHP, maxBarWidth);
      audio.playShieldDown();
      player.lastGravityDamage = now;

      console.log("🔥 Burning in right-side gravity zone!");
    }
  } else {
    // Reset timer if outside burn zone
    player.lastGravityDamage = undefined;
  }
}

  // Reset velocity outside level 3 or 4
  if (level !== 3 && level !== 4 && level !== 6) {
    player.xVelocity = 0;
    player.yVelocity = 0;
  }
}





