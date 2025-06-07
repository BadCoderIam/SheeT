function createSound(src) {
    const audio = new Audio(src);
    return () => {
      const sound = audio.cloneNode();
      sound.play().catch(e => console.warn("Sound error:", e));
    };
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