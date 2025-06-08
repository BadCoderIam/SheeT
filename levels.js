export function updateBackground(level) {
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