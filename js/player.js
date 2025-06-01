// === js/player.js ===
import { GameState } from './state.js';
import { playLaser } from './audio.js'; // Make sure this is exported in audio.js

export function handleMovement() {
  const keys = GameState.keys;
  const player = GameState.player;

  if (keys['ArrowLeft'] || keys['KeyA']) player.x -= player.speed;
  if (keys['ArrowRight'] || keys['KeyD']) player.x += player.speed;
  if (keys['ArrowUp'] || keys['KeyW']) player.y -= player.speed;
  if (keys['ArrowDown'] || keys['KeyS']) player.y += player.speed;
}

export function setupPlayerControls() {
  document.addEventListener('keydown', e => {
    GameState.keys[e.code] = true;

    if (e.code === "Space") {
      const { player, bullets, upgraded } = GameState;

      if (upgraded) {
        // Fire two bullets
        GameState.bullets.push({
          x: player.x + player.width / 2 - 15,
          y: player.y,
          width: 10,
          height: 20,
          speed: 8
        });
        GameState.bullets.push({
          x: player.x + player.width / 2 + 5,
          y: player.y,
          width: 10,
          height: 20,
          speed: 8
        });
      } else {
        // Fire one bullet
        GameState.bullets.push({
          x: player.x + player.width / 2 - 5,
          y: player.y,
          width: 10,
          height: 20,
          speed: 8
        });
      }

      playSound("laser");
    }
  });

  document.addEventListener('keyup', e => {
    GameState.keys[e.code] = false;
  });
}