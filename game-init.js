// engine.js (core game logic)
(function () {


  
  // Load sounds
  function createSound(src) {
    const audio = new Audio(src);
    return () => {
      const sound = audio.cloneNode();
      sound.play().catch(e => console.warn("Sound error:", e));
    };
  }

const playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

playerImagesByHP[20].src = "./sprites/playerShip3_green.png";     // Full HP
playerImagesByHP[15].src = "./sprites/playerShip3_blue.png";     // Slight damage
playerImagesByHP[10].src = "./sprites/playerShip3_orange.png";        // Heavy damage
playerImagesByHP[5].src = "./sprites/playerShip3_red.png";   // Critical

const BossImagesByHP = {
  300: new Image(),
  200: new Image(),
  100: new Image(),
  50: new Image()
};

BossImagesByHP[300].src = "./sprites/enemyGreen5.png";     // Full HP
BossImagesByHP[200].src = "./sprites/enemyblue5.png";     // Slight damage
BossImagesByHP[100].src = "./sprites/enemyRed5.png";        // Heavy damage
BossImagesByHP[50].src = "./sprites/enemyblack5.png";   // Critical


  const playLaser = createSound('./sounds/sfx_laser1.ogg');
  const playExplosion = createSound('./sounds/sfx_lose.ogg');
  const playShieldDown = createSound('./sounds/sfx_shieldDown.ogg');
  const playShieldUp = createSound('./sounds/sfx_shieldUp.ogg');
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

    const bulletImg = new Image();
    bulletImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAA2CAYAAAAVvbNoAAACbUlEQVR42nXVQUiTcRjH8adTlyDo1KWLndohcNv7vpuIuxgIeTCQEAyEPOwg4cGDgqAgIuTBYKCQKOZB3d61yGiI4dDEykrNcJTSaMlGlqNmLDVa8vQ+0A8egveFD2Pf/8Pe9/3vHSP6d8RNszdmWYvCNs2JmGm2YI3uVlScjQUCC/FAoPw/6bJOUdPsti3ryI2skzO967w5EK/7+w/319fLz7q6fqLJOkUtax9K+fyfk3KZfxWLJ7qTM52H8vExg+4ylIXfpRKD7jK0A85pGHQnOxDYgqNCgUF3ubsNONzbY9Cd4pa1CqVcjkF3cnZ2GX5kswy6kx0MpuAgk2HQXS58Dr5vbzPoLlswC9/SaQbdZeg+FDY3GXSXoWn4urbGoLvc3T34srrKoLt80ih8Xllh0J2cx3UY8ktLDLrL0B3IpVIMupPzwN+G3fl5Bt3J+WX0w6dkkkF3+Vp64OPsLIPuZBtGF2QSCQbdKWoYHfAhFmPQXX53t2BnaopBdxkKw/vJSQbdZZ9uwrvxcQbdKWYYNyA9Osqguwxdh62REQbdZZ+uwdtIhEF3sn2+q/BmaIhBd7L9/iuwMTjIoLucLgRrAwMMutOMYVTBq74+Bt1pprLSDy97ehh0p2mv9zK86O5m0J2iXu8leN7ZyaA7RX2+i7DS0cGgu1z4BVhub2fQnSY8nvPwtK2NQXcaCwbPwWI4zKA7DXs8ZyDV2sqgO0WITsNCSwuD7vL3cgqeNDcz6E76mG9qYiC3Y66xkcF1KNnQwOA69Li+nsF16FFdHYPr0MPaWgbXoURNTfFBKMTCdSheVdWbqK5medX9Lwgkf09Sr51zAAAALXRFWHRTb2Z0d2FyZQBieS5ibG9vZGR5LmNyeXB0by5pbWFnZS5QTkcyNEVuY29kZXKoBn/uAAAAAElFTkSuQmCC";

    const upgradedBulletImg = new Image();
const fragmentImg = new Image();
fragmentImg.src = "./Sprites/meteorGrey_tiny1.png";
const brownFragmentImg = new Image();
brownFragmentImg.src = "./Sprites/meteorBrown_tiny1.png";
    upgradedBulletImg.src = "./Sprites/laserGreen12.png";
    const explosionImg = new Image();
    explosionImg.src = "./Sprites/Blank.png";

const rogueMeteorImage = new Image();
rogueMeteorImage.src = "./Sprites/METEORITE-ELEMENTONLY-s.gif";

const meteorImagesByLevel = {
  1: ["./Sprites/meteorBrown_small2.png", "./Sprites/meteorBrown_big2.png"],
  2: ["./Sprites/meteorGrey_med2.png", "./sprites/meteorGrey_small2.png", "./Sprites/meteorGrey_big1.png"],
  3: ["./Sprites/meteorBrown_med3.png", "./Sprites/meteorBrown_big2.png"],
  4: ["./Sprites/enemyGreen2.png", "./Sprites/enemyBlack3.png"],
  5: ["./Sprites/METEORITE-ELEMENTONLY-s.gif", "./Sprites/enemyBlack4.png"],
  6: ["./Sprites/METEORITE-ELEMENTONLY-s.gif"] 
};
const meteorHPByImage = {
  "./Sprites/meteorBrown_small2.png": 2,
  "./Sprites/meteorGrey_small2.png": 3,
  "./Sprites/meteorGrey_med2.png": 3,
  "./Sprites/meteorGrey_big1.png": 4,
  "./Sprites/meteorGrey_tiny1.png": 1,
  "./Sprites/meteorBrown_tiny1.png": 1,
  "./Sprites/meteorBrown_med3.png": 4,
  "./Sprites/meteorBrown_big2.png": 4,
  "./Sprites/enemyGreen2.png": 4,
  "./Sprites/enemyBlack3.png": 4,
  "./Sprites/enemyBlack4.png": 4,
  "./Sprites/METEORITE-ELEMENTONLY-s.gif": 6
};

    const player = {
      x: canvas.width / 2 - 25,
      y: canvas.height - 100,
      width: 80,
      height: 80,
      speed: 10
    };

    const bullets = [];
    const meteors = [];

const enemyBullets = [];
const enemyBulletImg = new Image();
enemyBulletImg.src = "./sprites/laserGreen12.png";