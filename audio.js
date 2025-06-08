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