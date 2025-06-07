const bullets = [];
    const meteors = [];

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

const enemyBullets = [];
const enemyBulletImg = new Image();
enemyBulletImg.src = "./sprites/laserGreen12.png";

function drawEnemyBullets() {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    ctx.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height);

document.addEventListener('keydown', e => {
  keys[e.code] = true;

document.addEventListener('keyup', e => {
  keys[e.code] = false;
});