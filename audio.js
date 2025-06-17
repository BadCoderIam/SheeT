// === js/audio.js ===

export function createSound(src) {
    const audio = new Audio(src);
    return () => {
      const sound = audio.cloneNode();
      sound.play().catch(e => console.warn("Sound error:", e));
    };
  }

  export const playLaser = createSound('./sounds/sfx_laser1.ogg');
  export const playExplosion = createSound('./sounds/sfx_lose.ogg');
  export const playShieldDown = createSound('./sounds/sfx_shieldDown.ogg');
  export const playShieldUp = createSound('./sounds/sfx_shieldUp.ogg');

  export function playBackgroundMusic() {
  const music = new Audio('./sounds/Sonic.mp4');
  music.loop = true;
  music.volume = 0.8; // 80% volume
  music.play().catch(e => console.warn("Music playback error:", e));
  return music; // Return so you can pause/stop later
}