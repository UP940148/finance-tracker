/* global gapi, beginLoading */
const fileUploader = document.getElementById('fileUpload');

fileUploader.addEventListener('change', handleFileSelect, false);

function handleFileSelect(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  fileUpload(file);
}

async function fileUpload(file) {
  // ID Token for Authentication
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const data = new FormData();
  data.append('statement', file);
  await fetch('/upload-statement/', {
    headers: { Authorization: 'Bearer ' + idToken },
    credentials: 'same-origin',
    method: 'POST',
    body: data,
  });
  beginLoading();
}
