/* global gapi */
// const contentContainer = document.getElementById('subpageContent');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');

const today = new Date();
if (today.getMonth() > 9) {
  startDateInput.value = `${today.getFullYear()}-${today.getMonth() + 1}-01`;
  endDateInput.value = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
} else {
  startDateInput.value = `${today.getFullYear()}-0${today.getMonth() + 1}-01`;
  endDateInput.value = `${today.getFullYear()}-0${today.getMonth() + 1}-${today.getDate()}`;
}

const purchasesContainer = document.getElementById('purchases');

async function beginLoading() {
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;

  const startUnix = startDateInput.valueAsNumber;
  const endUnix = endDateInput.valueAsNumber;
  const response = await fetch(`/user/transactions/${startUnix}/${endUnix}/`, {
    headers: { Authorization: 'Bearer ' + idToken },
    credentials: 'same-origin',
  });

  if (response.status !== 200) {
    console.warn(response);
    return;
  }
  const resData = await response.json();
  console.log(resData);
}

function displayTransaction(transaction) {
  console.log(transaction);
}
