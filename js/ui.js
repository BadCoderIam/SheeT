import { GameState } from './state.js';
import { GAME_WIDTH } from './config.js';

export function drawUI(ctx, gameState) {
  ctx.fillStyle = 'white';
  ctx.font = '16px Arial';
  ctx.fillText(`Score: ${gameState.score}`, 10, 20);
  ctx.fillText(`Lives: ${gameState.lives}`, 10, 40);

  if (gameState.waveTextAlpha > 0) {
    ctx.save();
    ctx.globalAlpha = gameState.waveTextAlpha;
    ctx.font = '28px Arial';
    ctx.fillStyle = 'yellow';
    ctx.textAlign = 'center';
    ctx.fillText(`Wave ${gameState.wave}`, GAME_WIDTH / 2, 60);
    ctx.restore();
  }
}

export function drawUI(ctx) {
  const { score, highScore, level } = GameState;
  ctx.fillStyle = 'white';
  ctx.font = '16px Orbitron';
  ctx.fillText(`Score: ${score} | High Score: ${highScore} | Level: ${level}`, 10, 20);
}

export function updateBackground() {
  const { level } = GameState;

  let bg = "./levels/background1.gif";
  if (level >= 2) bg = "./levels/background2.gif";
  if (level >= 3) bg = "./levels/background3.gif";
  if (level >= 4) bg = "./levels/background4.gif";
  if (level >= 5) bg = "./levels/background5.gif";
  if (level >= 6) bg = "./levels/background3.gif";

  document.body.style.backgroundImage = `url('${bg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";
}