import { authState } from './googleAuth.js';
export let selectedShip = null;
export let claimedShip = null;

const spinButton = document.getElementById('spin-button');
const claimButton = document.getElementById('claim-button');
const startButton = document.getElementById('startButton');
const slot = document.getElementById('slot');
const result = document.getElementById('result');

const rarities = [
  { color: 'red', rarity: 'Common', weight: 10 },
  { color: 'green', rarity: 'Uncommon', weight: 6 },
  { color: 'blue', rarity: 'Rare', weight: 3 },
  { color: 'orange', rarity: 'Epic', weight: 1 },
  { color: 'purple', rarity: 'SHEET', weight: 1 }
];

const ships = [];
for (let shipNum = 1; shipNum <= 3; shipNum++) {
  rarities.forEach(r => {
    for (let i = 0; i < r.weight; i++) {
      ships.push({
        image: `./Sprites/playerShip${shipNum}_${r.color}.png`,
        rarity: r.rarity,
        color: r.color,
        shipNum: shipNum
      });
    }
  });
}

function getRandomShip() {
  return ships[Math.floor(Math.random() * ships.length)];
}

function resetSlotBorder() {
  slot.style.borderColor = 'rgba(139, 69, 19, 1)';
  slot.style.boxShadow = 'none';
  slot.style.animation = 'none';
}

function determineResult(finalShip) {
  result.innerHTML = `🎉 You got a <strong style="color:${finalShip.color}">${finalShip.rarity}</strong> Ship <strong>#${finalShip.shipNum}</strong>!`;
  slot.style.borderColor = 'gold';
  claimButton.style.display = 'inline-block';
  selectedShip = finalShip;
  slot.innerHTML = `<img src="${finalShip.image}" style="width:80px;height:auto;">`;
}

function spinSlotMachine() {
  if (spinButton.disabled) return;

  spinButton.disabled = true;
  spinButton.style.opacity = 0.5;
  claimButton.style.display = 'none';
  result.textContent = '';
  resetSlotBorder();

  let spinCount = 0;
  const maxSpins = 50;
  const interval = setInterval(() => {
    const randomShip = getRandomShip();
    slot.innerHTML = `<img src="${randomShip.image}" style="width:80px;height:auto;">`;
    spinCount++;

    if (spinCount >= maxSpins) {
      clearInterval(interval);
      determineResult(getRandomShip());
      spinButton.disabled = false;
      spinButton.style.opacity = 1;
    }
  }, 50);
}

function setStartingImage() {
  slot.style.backgroundColor = 'transparent';
  slot.innerHTML = '';
  resetSlotBorder();
}

// ✅ CLAIM BUTTON: Adds to database


claimButton.addEventListener('click', () => {
  if (selectedShip) {
    claimedShip = selectedShip;

    console.log('authState.user:', authState.user);

    fetch('http://localhost:3000/api/claim-ship', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    googleUserId: authState.user ? authState.user.id : null,
    googleUserName: authState.user ? authState.user.name : null,
    googleUserEmail: authState.user ? authState.user.email : null,
    shipNumber: claimedShip.shipNum,
    rarity: claimedShip.rarity,
    color: claimedShip.color,
    image: claimedShip.image,
    claimedAt: new Date().toISOString()
      })
    })
    .then(res => res.json())
    .then(data => {
      console.log('✅ Claimed ship saved to DB:', data);
    })
    .catch(err => {
      console.error('❌ Error saving claimed ship:', err);
    });

    claimButton.style.display = 'none';
    startButton.style.display = 'inline-block';
  } else {
    alert("No ship selected to claim!");
  }
});

spinButton.addEventListener('click', spinSlotMachine);

setStartingImage();

export function getSelectedShip() {
  return claimedShip;
}
