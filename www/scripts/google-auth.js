/*global gapi*/

let userProfile;

async function onSignIn(googleUser) {
  userProfile = googleUser.getBasicProfile();

  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  // Check if user has profile in the database
  let response = await fetch('/user/', {
    headers: { Authorization: 'Bearer ' + idToken },
    credentials: 'same-origin',
  });

  // If user profile not found, create one
  if (response.status === 404) {
    const data = {
      name: userProfile.getGivenName(),
      email: userProfile.getEmail(),
    };
    response = await fetch('/user/', {
      headers: {
        'Authorization': 'Bearer ' + idToken,
        'Content-Type': 'application/json',
      },
      credentials: 'same-origin',
      method: 'POST',
      body: JSON.stringify(data),
    });
    const resData = await response.json();
    console.log(resData);
  }
  // Redirect to dashboard if on sign in page
  if (window.location.pathname === '/signInPage.html') {
    window.location.href = '/dashboard.html';
  }
}

async function signOut() {
  await gapi.auth2.getAuthInstance().signOut();
  window.location.href = '/';
}
