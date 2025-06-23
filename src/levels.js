import { getLevel } from './state.js';

export function updateBackground() {
  const level = getLevel();
  let bg = "/Levels/Background1.gif";

  if (level >= 6) bg = "/Levels/background3.gif";
  else if (level >= 5) bg = "/Levels/background5.gif";
  else if (level >= 4) bg = "/Levels/background4.gif";
  else if (level >= 3) bg = "/Levels/background3.gif";
  else if (level >= 2) bg = "/Levels/Background2.gif";

  document.body.style.backgroundImage = `url('${bg}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundPosition = "center center";
}
