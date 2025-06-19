// googleAuth.js
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
  // Verify on server and get back user data...
  fetch('http://localhost:3000/api/google-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id_token: response.credential }),
  })
  .then(res => res.json())
  .then(data => {
    if (data.success) {
      authState.user = data.user;   // ✅ Set global variable
      document.getElementById('userInfo').innerText = `Welcome, ${data.user.name}!`;
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