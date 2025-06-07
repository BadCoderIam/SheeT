let powerup = {
    x: Math.random() * canvas.width,
    y: -50,
    width: 32,
    height: 32,
    image: new Image(),
    active: false,
    spawnTime: Date.now() + 10000 + Math.random() * 10000
};
powerup.image.src = "./sprites/powerupBlue_bolt.png";

let timePowerupsSpawned = 0;
let maxTimePowerupsPerLevel = 2; // Change as needed
let flashRed = false;
let flashTimer = 0;
    let level = 1;
    const maxLevel = 6;
    let highScore = localStorage.getItem('highScore') || 0;
    let playerImg = playerImagesByHP[20];
    let BossImg = BossImagesByHP[300];

function drawPowerup() {
  const now = Date.now();

function drawTimePowerup() {
  const now = Date.now();

function setBulletImg(upgraded) {
    bulletImage.src = Upgraded ? "./sprites/laserGreen12.png" : "./sprites/laserRed01.png";
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