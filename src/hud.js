function updateAmmoDisplay() {
  document.getElementById('ammoDisplay').innerText = `🔫 Ammo: ${ammo}`;
}

function drawHealthBar() {
  const barWidth = 200;
  const barHeight = 25;
  const x = 20;
  const y = canvas.height - 50;

function updateHealthBar() {
  const bar = document.getElementById('healthBar');
  const container = document.getElementById('healthBarContainer');
  const percent = Math.max(0, playerHP / maxHP);