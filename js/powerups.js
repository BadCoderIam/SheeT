// === Powerup and Bullet Upgrade Logic ===

let powerup = {
    x: Math.random() * GameState.canvas.width,
    y: -50,
    width: 32,
    height: 32,
    image: new Image(),
    active: false,
    spawnTime: Date.now() + 10000 + Math.random() * 10000
};
powerup.image.src = "./sprites/powerupBlue_bolt.png";

let upgraded = false;
let upgradeEndTime = 0;

// Update player bullet image function
export function setBulletImg(upgraded) {
    bulletImage.src = upgraded ? "./sprites/laserGreen12.png" : "./sprites/laserRed01.png";
}

// Spawn and draw powerup
export function drawPowerup() {
    if (Date.now() > powerup.spawnTime && !powerup.active) {
        powerup.x = Math.random() * (GameState.canvas.width - powerup.width);
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
            upgraded = true;
            upgradeEndTime = Date.now() + 10000;  // 10 seconds
            setBulletImg(true);
            playShieldUp();
        }
        // Despawn if off screen
        if (powerup.y > GameState.canvas.height) {
            powerup.active = false;
        }
    }
}
