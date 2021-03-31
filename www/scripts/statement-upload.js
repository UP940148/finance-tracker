
const fileUploader = document.getElementById('fileUpload');

fileUploader.addEventListener('change', handleFileSelect, false);

function handleFileSelect(e) {
  const file = e.target.files[0];
  const reader = new FileReader();

  reader.readAsDataURL(file);
  console.log(file);
  fileUpload(file);
}

async function fileUpload(file) {
  const data = new FormData();
  data.append('statement', file);
  const response = await fetch(`/upload-statement/${1}`, {
    method: 'POST',
    body: data,
  });

  const resData = await response.json();
  console.log(resData);
}
