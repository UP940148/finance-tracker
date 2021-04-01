/* global gapi */
// const contentContainer = document.getElementById('subpageContent');
const startDateInput = document.getElementById('startDate');
const endDateInput = document.getElementById('endDate');
const purchasesContainer = document.getElementById('purchases');
const newPurchaseTab = document.getElementById('newPurchaseTab');
const newPurchaseButton = document.getElementById('newPurchaseButton');

const noTransactionsText = document.getElementById('noTransactionsText');
const somethingWrongText = document.getElementById('somethingWrongText');
noTransactionsText.style.display = 'none';
somethingWrongText.style.display = 'none';

function initPage() {
  initDate();
  beginLoading();

  const cancelPurchaseButton = document.getElementById('cancelPurchaseButton');
  cancelPurchaseButton.addEventListener('click', () => {
    newPurchaseTab.style.display = 'none';
    newPurchaseButton.style.display = 'block';
  });

  const submitPurchaseButton = document.getElementById('submitPurchaseButton');
  submitPurchaseButton.addEventListener('click', submitNewPurchase);

  newPurchaseTab.style.display = 'none';
  newPurchaseButton.addEventListener('click', loadNewPurchaseWindow);
  startDateInput.addEventListener('change', beginLoading);
  endDateInput.addEventListener('change', beginLoading);
}

function clearChildren(parent) {
  while (parent.firstChild) {
    parent.removeChild(parent.firstChild);
  }
}

function initDate() {
  // Initialise both input fields with date in format YYYY-MM-DD
  const today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  const yyyy = today.getFullYear();

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }

  startDateInput.value = `${yyyy}-${mm}-01`;
  endDateInput.value = `${yyyy}-${mm}-${dd}`;
}


async function beginLoading() {
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  const startUnix = startDateInput.valueAsNumber;
  const endUnix = endDateInput.valueAsNumber;

  const response = await fetch(`/user/transactions/${startUnix}/${endUnix}/`, {
    headers: { Authorization: 'Bearer ' + idToken },
    credentials: 'same-origin',
  });
  // Reset container
  clearChildren(purchasesContainer);
  // If no transactions found, display message
  if (response.status === 204) {
    noTransactionsText.style.display = 'block';
    somethingWrongText.style.display = 'none';
    return;
  }
  // If error occured, display message
  if (!response.ok) {
    somethingWrongText.style.display = 'block';
    noTransactionsText.style.display = 'none';
    return;
  }
  // If transactions found, hide messages
  noTransactionsText.style.display = 'none';
  somethingWrongText.style.display = 'none';
  const resData = await response.json();
  const transactionList = resData.data;

  // Populate container with more transactions
  transactionList.forEach(transaction => {
    displayTransaction(transaction);
  });
}

function displayTransaction(transaction) {
  // Create container for transaction
  const newTransaction = document.createElement('div');
  newTransaction.classList.add('transaction');
  newTransaction.transactionId = transaction.transactionId;
  // Create preview for the transaction
  const transactionPreview = document.createElement('div');
  transactionPreview.classList.add('transaction-preview', 'flex-container');
  // Date far left
  const transactionDate = document.createElement('h2');
  transactionDate.textContent = unixToDate(transaction.date);
  transactionDate.classList.add('transaction-date');
  // Title centre
  const transactionTitle = document.createElement('h2');
  transactionTitle.textContent = transaction.payee;
  transactionTitle.classList.add('transaction-title');
  // Amount far right
  const transactionPrice = document.createElement('h2');
  transactionPrice.textContent = transaction.amount;
  transactionPrice.classList.add('transaction-price');
  if (transaction.amount >= 0) { transactionPrice.classList.add('income'); }
  if (transaction.amount < 0) { transactionPrice.classList.add('expenditure'); }

  // Main transaction content
  const transactionBody = document.createElement('div');
  transactionBody.classList.add('transaction-body');
  transactionBody.style.display = 'none';
  transactionBody.appendChild(document.createElement('hr'));


  transactionPreview.appendChild(transactionDate);
  transactionPreview.appendChild(transactionTitle);
  transactionPreview.appendChild(transactionPrice);
  newTransaction.appendChild(transactionPreview);
  newTransaction.appendChild(transactionBody);
  purchasesContainer.appendChild(newTransaction);

  // Toggle visibility on click
  transactionPreview.addEventListener('click', () => {
    // Hide all elements then display selected
    if (transactionBody.style.display === 'none') {
      const elementList = document.getElementsByClassName('transaction-body');
      for (const item of elementList) {
        item.style.display = 'none';
      }
      transactionBody.style.display = 'block';
    } else {
      // Hide selected element
      transactionBody.style.display = 'none';
    }
  });
}

function unixToDate(unixTimestamp) {
  const date = new Date(unixTimestamp);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }

  return `${dd}/${mm}/${yyyy}`;
}

function loadNewPurchaseWindow() {
  newPurchaseTab.style.display = 'block';
  newPurchaseButton.style.display = 'none';
}

async function submitNewPurchase() {
  const data = {
    payee: document.getElementById('newPayee').value,
    date: document.getElementById('newDate').valueAsNumber,
    amount: document.getElementById('newAmount').value,
    memo: document.getElementById('newMemo').value,
    address: document.getElementById('newAddress').value,
    category: document.getElementById('newCategory').value,
  };
  if (!data.payee || !data.date || !data.amount) {
    return;
  }
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  await fetch('/transaction/', {
    headers: {
      'Authorization': 'Bearer ' + idToken,
      'Content-Type': 'application/json',
    },
    method: 'POST',
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });

  beginLoading();
}
