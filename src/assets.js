function createSound(src) {
    const audio = new Audio(src);
    return () => {
      const sound = audio.cloneNode();
      sound.play().catch(e => console.warn("Sound error:", e));
    };
  }

playerImagesByHP = {
  20: new Image(),
  15: new Image(),
  10: new Image(),
  5: new Image()
};

BossImagesByHP = {
  300: new Image(),
  200: new Image(),
  100: new Image(),
  50: new Image()
};

bulletImg = new Image();
    bulletImg.src = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAkAAAA2CAYAAAAVvbNoAAACbUlEQVR42nXVQUiTcRjH8adTlyDo1KWLndohcNv7vpuIuxgIeTCQEAyEPOwg4cGDgqAgIuTBYKCQKOZB3d61yGiI4dDEykrNcJTSaMlGlqNmLDVa8vQ+0A8egveFD2Pf/8Pe9/3vHSP6d8RNszdmWYvCNs2JmGm2YI3uVlScjQUCC/FAoPw/6bJOUdPsti3ryI2skzO967w5EK/7+w/319fLz7q6fqLJOkUtax9K+fyfk3KZfxWLJ7qTM52H8vExg+4ylIXfpRKD7jK0A85pGHQnOxDYgqNCgUF3ubsNONzbY9Cd4pa1CqVcjkF3cnZ2GX5kswy6kx0MpuAgk2HQXS58Dr5vbzPoLlswC9/SaQbdZeg+FDY3GXSXoWn4urbGoLvc3T34srrKoLt80ih8Xllh0J2cx3UY8ktLDLrL0B3IpVIMupPzwN+G3fl5Bt3J+WX0w6dkkkF3+Vp64OPsLIPuZBtGF2QSCQbdKWoYHfAhFmPQXX53t2BnaopBdxkKw/vJSQbdZZ9uwrvxcQbdKWYYNyA9Osqguwxdh62REQbdZZ+uwdtIhEF3sn2+q/BmaIhBd7L9/iuwMTjIoLucLgRrAwMMutOMYVTBq74+Bt1pprLSDy97ehh0p2mv9zK86O5m0J2iXu8leN7ZyaA7RX2+i7DS0cGgu1z4BVhub2fQnSY8nvPwtK2NQXcaCwbPwWI4zKA7DXs8ZyDV2sqgO0WITsNCSwuD7vL3cgqeNDcz6E76mG9qYiC3Y66xkcF1KNnQwOA69Li+nsF16FFdHYPr0MPaWgbXoURNTfFBKMTCdSheVdWbqK5medX9Lwgkf09Sr51zAAAALXRFWHRTb2Z0d2FyZQBieS5ibG9vZGR5LmNyeXB0by5pbWFnZS5QTkcyNEVuY29kZXKoBn/uAAAAAElFTkSuQmCC";

upgradedBulletImg = new Image();
const fragmentImg = new Image();
fragmentImg.src = "./Sprites/meteorGrey_tiny1.png";
const brownFragmentImg = new Image();
brownFragmentImg.src = "./Sprites/meteorBrown_tiny1.png";
    upgradedBulletImg.src = "./Sprites/laserGreen12.png";
    const explosionImg = new Image();
    explosionImg.src = "./Sprites/Blank.png";

explosionImg = new Image();
    explosionImg.src = "./Sprites/Blank.png";

rogueMeteorImage = new Image();
rogueMeteorImage.src = "./Sprites/METEORITE-ELEMENTONLY-s.gif";

fragmentImg = new Image();

enemyBulletImg = new Image();
enemyBulletImg.src = "./sprites/laserGreen12.png";