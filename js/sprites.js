// === js/sprites.js ===

// Player images by HP
export const playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

playerImagesByHP[20].src = "./sprites/playerShip3_green.png";
playerImagesByHP[15].src = "./sprites/playerShip3_blue.png";
playerImagesByHP[10].src = "./sprites/playerShip3_orange.png";
playerImagesByHP[5].src = "./sprites/playerShip3_red.png";

// Boss images by HP
export const bossImagesByHP = {
  300: new Image(),
  200: new Image(),
  100: new Image(),
  50: new Image()
};

bossImagesByHP[300].src = "./sprites/enemyGreen5.png";
bossImagesByHP[200].src = "./sprites/enemyblue5.png";
bossImagesByHP[100].src = "./sprites/enemyRed5.png";
bossImagesByHP[50].src = "./sprites/enemyblack5.png";

// Bullet images
export const bulletImg = new Image();
bulletImg.src = "./sprites/laserRed01.png";

export const upgradedBulletImg = new Image();
upgradedBulletImg.src = "./sprites/laserGreen12.png";

export const enemyBulletImg = new Image();
enemyBulletImg.src = "./sprites/laserGreen12.png";

// Explosion image
export const explosionImg = new Image();
explosionImg.src = "./sprites/explosion.png"; // replace with correct path or base64 if needed

// Fragment images
export const fragmentImg = new Image();
fragmentImg.src = "./sprites/meteorGrey_tiny1.png";

export const brownFragmentImg = new Image();
brownFragmentImg.src = "./sprites/meteorBrown_tiny1.png";

// Rogue meteor image
export const rogueMeteorImage = new Image();
rogueMeteorImage.src = "./sprites/METEORITE-ELEMENTONLY-s.gif";
