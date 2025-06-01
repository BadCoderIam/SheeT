// === collisions.js ===
import { GameState } from './state.js';
import { playSound } from './audio.js';
import { updatePlayerImage, updateHealthBar } from './ui.js'; // if modular

export function checkCollisions() {
  const { player, meteors } = GameState;

  for (let i = meteors.length - 1; i >= 0; i--) {
    const m = meteors[i];
    if (
      player.x < m.x + m.width &&
      player.x + player.width > m.x &&
      player.y < m.y + m.height &&
      player.y + player.height > m.y
    ) {
      meteors.splice(i, 1);
      GameState.playerHP--;
      GameState.shakeTimer = 120;
      updateHealthBar();
      updatePlayerImage();
      playSound("shieldDown");

      if (GameState.playerHP <= 0) {
        GameState.gameOver = true;
        const screen = document.getElementById("startScreen");
        screen.style.display = "flex";
        screen.innerHTML = `<h1>Game Over! You Are SheeTy!!</h1><p>Score: ${GameState.score}</p><p>High Score: ${GameState.highScore}</p><p>Level: ${GameState.level}</p><button onclick="location.reload()">Restart</button>`;
      }
    }
  }
}
