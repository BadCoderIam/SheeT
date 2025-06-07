const playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

function drawPlayer() {
      ctx.drawImage(playerImg, player.x, player.y, player.width, player.height);
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