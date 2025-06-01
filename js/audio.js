// === js/audio.js ===
export const sounds = {
  laser: new Audio('./sounds/sfx_laser1.ogg'),
  explosion: new Audio('./sounds/sfx_lose.ogg'),
  shieldDown: new Audio('./sounds/sfx_shieldDown.ogg'),
  shieldUp: new Audio('./sounds/sfx_shieldUp.ogg'),
};

export function setupAudio() {
  for (let key in sounds) {
    sounds[key].load();
  }
}

export function playSound(name) {
  if (sounds[name]) {
    const s = sounds[name].cloneNode();
    s.play().catch(e => console.warn("Sound error:", e));
  }
}
