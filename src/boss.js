let boss = null;
const bossImage = new Image();
bossImage.src = "./Sprites/enemyBlack5.png";
    
let gameStarted = false;
let gameOver = false;
let playerHP = 20;
let meteorHP = 2;
let ammo = 500;
const maxAmmo = 500;
let keys = {};
let shakeTimer = 0;
let score = 0;
let timeLeft = 100; // in seconds
let timerInterval = null;
let timePowerupsSpawned = 0;
let maxTimePowerupsPerLevel = 2; // Change as needed
let flashRed = false;
let flashTimer = 0;
    let level = 1;
    const maxLevel = 6;
    let highScore = localStorage.getItem('highScore') || 0;
    let playerImg = playerImagesByHP[20];
    let BossImg = BossImagesByHP[300];

const bossImage = new Image();
bossImage.src = "./Sprites/enemyBlack5.png";
    
let gameStarted = false;
let gameOver = false;
let playerHP = 20;
let meteorHP = 2;
let ammo = 500;
const maxAmmo = 500;
let keys = {};
let shakeTimer = 0;
let score = 0;
let timeLeft = 100; // in seconds
let timerInterval = null;
let timePowerupsSpawned = 0;
let maxTimePowerupsPerLevel = 2; // Change as needed
let flashRed = false;
let flashTimer = 0;
    let level = 1;
    const maxLevel = 6;
    let highScore = localStorage.getItem('highScore') || 0;
    let playerImg = playerImagesByHP[20];
    let BossImg = BossImagesByHP[300];

function drawBoss() {
  if (!boss) return;

function updateBossImage(bossHP) {
  if (bossHP >= 300) BossImg = BossImagesByHP[300];
  else if (bossHP >= 200) BossImg = BossImagesByHP[200];
  else if (bossHP >= 100) BossImg = BossImagesByHP[100];
  else if (bossHP > 0) BossImg = BossImagesByHP[50];
}