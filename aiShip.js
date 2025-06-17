// aiShip.js
import { bullets } from './Bullets.js';

export const aiShip = {
  active: false,
  despawning: false,
  x: 0,
  y: 0,
  width: 0,
  height: 0,
  hp: 8,
  angle: 0,            // 🔸 Rotation angle
  scale: 1,            // 🔸 Used to shrink during implosion
  despawnStartTime: null,
  despawnDuration: 1500, // ms
  imploding: false,     // 🔸 Flag for implosion stage
  image: null,
};

export function activateAIShip(player) {
  aiShip.active = true;
  aiShip.x = player.x + player.width + 10;
  aiShip.y = player.y;
  aiShip.width = player.width * 0.5;
  aiShip.height = player.height * 0.5;
  aiShip.hp = 8;
  aiShip.spawnTime = Date.now();
  aiShip.lastFireTime = Date.now();
  aiShip.despawning = false;

  // MATCH SHIP IMAGE (orange variant of current player ship)
  aiShip.image = new Image();
  aiShip.image.src = player.selectedShipImage.replace(/_(red|green|blue|orange)\.png$/, "_orange.png");
}

export function damageAIShip(amount = 1) {
  aiShip.hp -= amount;
  if (aiShip.hp <= 0) startDespawnAIShip();
}

function startDespawnAIShip() {
  aiShip.despawning = true;
  aiShip.despawnStartTime = Date.now();
  aiShip.imploding = false;
}

export function updateAndDrawAIShip(ctx, player, enemies, canvas) {
  if (!aiShip.active) return;

  // Easing follow X
  aiShip.x += ((player.x + player.width + 10) - aiShip.x) * 0.1;

  // Color/appearance (replace with sprite later if desired)
  ctx.fillStyle = aiShip.despawning ? "rgba(0,255,255,0.5)" : "cyan";
  ctx.fillRect(aiShip.x, aiShip.y, aiShip.width, aiShip.height);

  const now = Date.now();

  // Lifetime expiry → begin despawn
  if (!aiShip.despawning && now - aiShip.spawnTime > 20000) {
    startDespawnAIShip();
  }

  // Despawning animation → move upward
  if (aiShip.despawning) {
    aiShip.y -= 4;
    if (aiShip.y + aiShip.height < 0) {
      aiShip.active = false; // Fully despawned
      return;
    }
  }

  // Fire rate control
  if (!aiShip.despawning && now - aiShip.lastFireTime >= aiShip.fireRate) {
    aiShip.lastFireTime = now;

    const target = findClosestEnemy(enemies);
    let bulletX = aiShip.x + aiShip.width / 2 - 5;
    let bulletY = aiShip.y;

    let dx = 0;
    let dy = -8; // Default upward

    if (target) {
      const diffX = (target.x + target.width / 2) - bulletX;
      const diffY = (target.y + target.height / 2) - bulletY;
      const dist = Math.sqrt(diffX * diffX + diffY * diffY);
      dx = (diffX / dist) * 8;
      dy = (diffY / dist) * 8;
    }

    bullets.push({ x: bulletX, y: bulletY, width: 8, height: 16, dx, dy, speed: 8 });
  }
}

function findClosestEnemy(enemies) {
  let closest = null;
  let closestDist = Infinity;

  enemies.forEach(enemy => {
    const dx = (enemy.x + enemy.width / 2) - aiShip.x;
    const dy = (enemy.y + enemy.height / 2) - aiShip.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist < closestDist) {
      closest = enemy;
      closestDist = dist;
    }
  });

  return closest;
}


function updateAndDrawAIShip(ctx, player, canvas) {
  if (!aiShip.active) return;

  const now = Date.now();

  // Follow player unless despawning
  if (!aiShip.despawning) {
    aiShip.x += ((player.x + player.width + 10) - aiShip.x) * 0.1;
    aiShip.y += ((player.y) - aiShip.y) * 0.05;
  }

  if (aiShip.despawning) {
    const elapsed = now - aiShip.despawnStartTime;
    const progress = Math.min(elapsed / aiShip.despawnDuration, 1);

    aiShip.angle += 0.3;      // 🔸 Rotate rapidly
    aiShip.scale = 1 - progress;  // 🔸 Shrink during implosion

    // Spiral toward center
    if (!aiShip.imploding) {
      aiShip.x += Math.sin(elapsed / 100) * 4;
      aiShip.y -= 2;
    } else {
      const centerX = canvas.width / 2;
      const centerY = canvas.height / 2;
      aiShip.x += (centerX - aiShip.x) * 0.1;
      aiShip.y += (centerY - aiShip.y) * 0.1;
    }

    if (progress >= 0.5 && !aiShip.imploding) {
      aiShip.imploding = true; // Switch to implosion phase halfway
    }

    if (progress >= 1) {
      aiShip.active = false;
      return;
    }
  }

  // DRAW WITH ROTATION + SCALING
  ctx.save();
  ctx.translate(aiShip.x + aiShip.width / 2, aiShip.y + aiShip.height / 2);
  ctx.rotate(aiShip.angle);
  ctx.scale(aiShip.scale, aiShip.scale);

  if (aiShip.image && aiShip.image.complete) {
    ctx.drawImage(aiShip.image, -aiShip.width / 2, -aiShip.height / 2, aiShip.width, aiShip.height);
  } else {
    ctx.fillStyle = "orange";
    ctx.fillRect(-aiShip.width / 2, -aiShip.height / 2, aiShip.width, aiShip.height);
  }

  ctx.restore();


  if (!aiShip.despawning && now - aiShip.lastFireTime >= aiShip.fireRate) {
    aiShip.lastFireTime = now;
    const target = findClosestEnemy(enemies);
    let bulletX = aiShip.x + aiShip.width / 2 - 4;
    let bulletY = aiShip.y;
    let dx = 0;
    let dy = -8;

    if (target) {
      const diffX = (target.x + target.width / 2) - bulletX;
      const diffY = (target.y + target.height / 2) - bulletY;
      const dist = Math.sqrt(diffX * diffX + diffY * diffY);
      dx = (diffX / dist) * 8;
      dy = (diffY / dist) * 8;
    }

    bullets.push({ x: bulletX, y: bulletY, width: 8, height: 16, dx, dy, speed: 8 });
  }
}