// googleAuth.js
import { claimedShip } from './shipSelector.js';
import { setClaimedShip } from './shipSelector.js';

let currentUser = null;
// ✅ Create an object to hold it by reference
export const authState = {
  user: null,
};

export function initializeGoogleSignIn(clientId) {
  google.accounts.id.initialize({
    client_id: clientId,
    callback: handleCredentialResponse,
  });

  google.accounts.id.renderButton(
    document.getElementById("googleLoginButton"),
    { theme: "outline", size: "medium" }
  );
}

function handleCredentialResponse(response) {
  fetch('https://www.sheethole.net/api/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: response.credential }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      authState.user = data.user;  // ✅ Save user info
      document.getElementById('userInfo').innerText = `Welcome, ${data.user.name}!`;

      // ✅ FETCH PREVIOUS CLAIMED SHIPS HERE
      fetch(`https://www.sheethole.net/api/user-claims/${authState.user.id}`)
        .then(res => res.json())
        .then(claimData => {
          if (claimData.success && claimData.claims.length > 0) {
            displayUserClaims(claimData.claims);
          }
        })
        .catch(console.error);
    }
  })
  .catch(console.error);
}

export function getCurrentUser() {
  return currentUser;
}

export function logoutGoogle() {
  google.accounts.id.disableAutoSelect();
  currentUser = null;
}

export function displayUserClaims(claims) {
  const box = document.getElementById('previousClaimsBox');
  const list = document.getElementById('previousClaimsList');

  list.innerHTML = '';
  box.style.display = claims.length ? 'block' : 'none';

  if (claims.length === 0) {
    list.textContent = 'No previous claims found.';
    return;
  }

  const lastThree = claims.slice(0, 3);

  lastThree.forEach(claim => {
    const claimDiv = document.createElement('div');
    claimDiv.style.marginBottom = '0.8rem';
    claimDiv.style.textAlign = 'center';

    claimDiv.innerHTML = `
      <img src="${claim.image_url}" alt="Ship" style="width: 60px; height: 60px;"><br>
      <strong>Ship #${claim.ship_number}</strong> | ${claim.rarity} (${claim.color})<br>
    `;

    const selectButton = document.createElement('button');
    selectButton.textContent = 'Select This Ship';
    selectButton.style.marginTop = '0.3rem';
    selectButton.style.padding = '0.2rem 0.5rem';
    selectButton.style.borderRadius = '6px';
    selectButton.style.border = 'none';
    selectButton.style.backgroundColor = 'gold';
    selectButton.style.color = '#222';
    selectButton.style.cursor = 'pointer';

    selectButton.onclick = () => {
      setClaimedShip({
        shipNum: claim.ship_number,
        rarity: claim.rarity,
        color: claim.color,
        image: claim.image_url
      });

      document.getElementById('claim-button').style.display = 'none';
      document.getElementById('startButton').style.display = 'inline-block';

      console.log('✅ Selected previous claimed ship:', claim);
    };

    claimDiv.appendChild(selectButton);
    list.appendChild(claimDiv);
  });
}
