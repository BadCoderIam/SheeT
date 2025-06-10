import * as audio from './audio.js';


export const bullets = [];


 export const bulletImg = new Image();
    bulletImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAA2CAYAAAAVvbNoAAACbUlEQVR42nXVQUiTcRjH8adTlyDo1KWLndohcNv7vpuIuxgIeTCQEAyEPOwg4cGDgqAgIuTBYKCQKOZB3d61yGiI4dDEykrNcJTSaMlGlqNmLDVa8vQ+0A8egveFD2Pf/8Pe9/3vHSP6d8RNszdmWYvCNs2JmGm2YI3uVlScjQUCC/FAoPw/6bJOUdPsti3ryI2skzO967w5EK/7+w/319fLz7q6fqLJOkUtax9K+fyfk3KZfxWLJ7qTM52H8vExg+4ylIXfpRKD7jK0A85pGHQnOxDYgqNCgUF3ubsNONzbY9Cd4pa1CqVcjkF3cnZ2GX5kswy6kx0MpuAgk2HQXS58Dr5vbzPoLlswC9/SaQbdZeg+FDY3GXSXoWn4urbGoLvc3T34srrKoLt80ih8Xllh0J2cx3UY8ktLDLrL0B3IpVIMupPzwN+G3fl5Bt3J+WX0w6dkkkF3+Vp64OPsLIPuZBtGF2QSCQbdKWoYHfAhFmPQXX53t2BnaopBdxkKw/vJSQbdZZ9uwrvxcQbdKWYYNyA9Osqguwxdh62REQbdZZ+uwdtIhEF3sn2+q/BmaIhBd7L9/iuwMTjIoLucLgRrAwMMutOMYVTBq74+Bt1pprLSDy97ehh0p2mv9zK86O5m0J2iXu8leN7ZyaA7RX2+i7DS0cGgu1z4BVhub2fQnSY8nvPwtK2NQXcaCwbPwWI4zKA7DXs8ZyDV2sqgO0WITsNCSwuD7vL3cgqeNDcz6E76mG9qYiC3Y66xkcF1KNnQwOA69Li+nsF16FFdHYPr0MPaWgbXoURNTfFBKMTCdSheVdWbqK5medX9Lwgkf09Sr51zAAAALXRFWHRTb2Z0d2FyZQBieS5ibG9vZGR5LmNyeXB0by5pbWFnZS5QTkcyNEVuY29kZXKoBn/uAAAAAElFTkSuQmCC";

    export const upgradedBulletImg = new Image();
    upgradedBulletImg.src = "./Sprites/laserGreen12.png";

    export const enemyBullets = [];
export const enemyBulletImg = new Image();
enemyBulletImg.src = "./sprites/laserGreen12.png";

export const bulletImageRed = new Image();
bulletImageRed.src = "./sprites/laserRed01.png";

export const bulletImageGreen = new Image();
bulletImageGreen.src = "./sprites/laserGreen12.png";

export let currentBulletImage = bulletImageRed; 

// Update player bullet image function
export function setBulletImg(upgraded) {
    currentBulletImage = upgraded ? bulletImageGreen : bulletImageRed;
}

export function drawBullets(ctx, upgraded) {
  bullets.forEach((b, i) => {
    b.y -= b.speed;
    const img = upgraded ? upgradedBulletImg : bulletImg;
    ctx.drawImage(currentBulletImage, b.x, b.y, b.width, b.height);
    if (b.y < 0) bullets.splice(i, 1);
  });
}

    export function drawEnemyBullets(ctx, player, canvas, shakeTimer, updateHealthBar, updatePlayerImage, gameOver, score, highScore, level) {
  for (let i = enemyBullets.length - 1; i >= 0; i--) {
    const b = enemyBullets[i];
    b.x += b.vx;
    b.y += b.vy;
    ctx.drawImage(enemyBulletImg, b.x, b.y, b.width, b.height);

    // Check collision with player
    if (
      b.x < player.x + player.width &&
      b.x + b.width > player.x &&
      b.y < player.y + player.height &&
      b.y + b.height > player.y
    ) {
      enemyBullets.splice(i, 1);
      player.hp--;
      shakeTimer = 120;
      updatePlayerImage(player);
      audio.playShieldDown();

      if (player.hp <= 0) {
        gameOver = true;
        timerDisplay.classList.remove("pulsing");
        document.getElementById("startScreen").style.display = "flex";
        document.getElementById("startScreen").innerHTML = `<h1>Game Over! You Died SheeTy!!</h1><p>Score: ${score}</p><p>High Score: ${highScore}</p><p>Level: ${level}</p><button onclick="location.reload()">Restart</button>`;
      }
    }

    if (b.y > canvas.height) {
      enemyBullets.splice(i, 1);
    }
  }
}