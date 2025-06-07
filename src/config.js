const canvas = document.getElementById("gameCanvas");
    const ctx = canvas.getContext("2d");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
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


const maxHP = 20;

const maxBarWidth = 300;