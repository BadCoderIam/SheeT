
export const playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

playerImagesByHP[20].src = "./sprites/playerShip3_green.png";     // Full HP
playerImagesByHP[15].src = "./sprites/playerShip3_blue.png";     // Slight damage
playerImagesByHP[10].src = "./sprites/playerShip3_orange.png";        // Heavy damage
playerImagesByHP[5].src = "./sprites/playerShip3_red.png";   // Critical

export function updatePlayerImage(player) {
  // Check if the player's HP is between the predefined thresholds
  if (player.hp >= 1 && player.hp <= 5) {
    playerImg = playerImagesByHP[5];
  }
  else if (player.hp > 4 && player.hp <= 10) {
    playerImg = playerImagesByHP[5]; // Critical damage image
  }
  else if (player.hp > 10 && player.hp <= 15) {
    playerImg = playerImagesByHP[10]; // Heavy damage image
  }
  else if (player.hp > 15 && player.hp <= 20) {
    playerImg = playerImagesByHP[15]; // Slight damage image
  }
  else if (player.hp > 20) {
    playerImg = playerImagesByHP[20]; // Full HP image
  }
}

export let playerImg = playerImagesByHP[20];