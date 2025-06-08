   import { playerImg, playerImagesByHP, updatePlayerImage, player } from './playerimg.js';
   import * as audio from './audio.js';
   
   export function applyGravityPull(canvas, player, level, updateHealthBar, updatePlayerImage, playShieldDown, shakeTimerSetter) {
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;

  if (level === 3 || level === 6) {
    const dx = centerX - (player.x + player.width / 2);
    const dy = centerY - (player.y + player.height / 2);
    const distance = Math.sqrt(dx * dx + dy * dy);

    // Gentle gravity
    const gravityStrength = (level === 6) ? 0.00045 : 0.00025;
    const dirX = dx / distance;
    const dirY = dy / distance;

    // Initialize velocity if not present
    if (player.xVelocity === undefined) player.xVelocity = 0;
    if (player.yVelocity === undefined) player.yVelocity = 0;

    // Apply force
    const pull = Math.min(gravityStrength * distance, 0.5);
    player.xVelocity += dirX * pull;
    player.yVelocity += dirY * pull;

    // Damping and max speed
    player.xVelocity *= 0.85;
    player.yVelocity *= 0.85;
    const maxSpeed = 2;
    player.xVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.xVelocity));
    player.yVelocity = Math.max(-maxSpeed, Math.min(maxSpeed, player.yVelocity));

    // Apply movement
    player.x += player.xVelocity;
    player.y += player.yVelocity;

    // === Burn zone logic ===
    const deathRadius = (level === 6) ? 160 : 140;
    const now = Date.now();

    if (distance < deathRadius) {
      // 💥 Shake effect
      shakeTimerSetter(10);

      // 🔥 Burn damage timer
      if (player.lastGravityDamage === undefined) {
        player.lastGravityDamage = now;
      }

      if (now - player.lastGravityDamage >= 1000) {
        player.hp = Math.max(0, player.hp - 1);
        updateHealthBar();
        updatePlayerImage(player);
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
  const gravityForce = 0.08;

  if (player.xVelocity === undefined) player.xVelocity = 0;

  // Apply rightward gravity
  player.xVelocity += gravityForce;
  player.xVelocity *= 0.95;
  player.x += player.xVelocity;

  // Clamp player inside canvas
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
    shakeTimerSetter(10);

    // Burn damage logic
    if (player.lastGravityDamage === undefined) {
      player.lastGravityDamage = now;
    }

    if (now - player.lastGravityDamage >= burnDamageRate) {
      player.hp = Math.max(0, player.hp - 1);
      updateHealthBar();
      updatePlayerImage(player);
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