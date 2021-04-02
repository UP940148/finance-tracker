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
  if (transaction.amount >= 0) { transactionPrice.textContent = '+'; }
  transactionPrice.textContent += transaction.amount;
  transactionPrice.classList.add('transaction-price');
  if (transaction.amount >= 0) { transactionPrice.classList.add('income'); }
  if (transaction.amount < 0) { transactionPrice.classList.add('expenditure'); }

  // Main transaction content
  const transactionBody = document.createElement('div');
  transactionBody.classList.add('transaction-body');
  transactionBody.style.display = 'none';
  transactionBody.appendChild(document.createElement('hr'));

  const memoItem = document.createElement('h4');
  if (transaction.memo) memoItem.textContent = `"${transaction.memo}"`;
  const addressItem = document.createElement('h4');
  if (transaction.address) addressItem.textContent = 'address: ' + transaction.address;
  const categoryItem = document.createElement('h4');
  categoryItem.style.fontStyle = 'italic';
  if (transaction.category) categoryItem.textContent = 'Category: ' + transaction.category;

  const transactionBodyButtonContainer = document.createElement('div');
  transactionBodyButtonContainer.classList.add('flex-container', 'even-space');
  const editButton = document.createElement('div');
  editButton.id = 'editButton';
  editButton.classList.add('button');
  editButton.textContent = 'Edit';
  const deleteButton = document.createElement('div');
  deleteButton.id = 'deleteButton';
  deleteButton.classList.add('button');
  deleteButton.textContent = 'Delete';

  editButton.addEventListener('click', () => {
    openEditWindow(transaction);
  });

  deleteButton.addEventListener('click', async () => {
    const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
    await fetch(`/transaction/${newTransaction.transactionId}/`, {
      method: 'DELETE',
      headers: { Authorization: 'Bearer ' + idToken },
      credentials: 'same-origin',
    });
    beginLoading();
  });

  transactionPreview.appendChild(transactionDate);
  transactionPreview.appendChild(transactionTitle);
  transactionPreview.appendChild(transactionPrice);

  transactionBodyButtonContainer.appendChild(editButton);
  transactionBodyButtonContainer.appendChild(deleteButton);

  transactionBody.appendChild(memoItem);
  transactionBody.appendChild(addressItem);
  transactionBody.appendChild(categoryItem);
  transactionBody.appendChild(transactionBodyButtonContainer);

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

function unixToInputDate(unixTimestamp) {
  const date = new Date(unixTimestamp);
  let dd = date.getDate();
  let mm = date.getMonth() + 1;
  const yyyy = date.getFullYear();

  if (dd < 10) { dd = '0' + dd; }
  if (mm < 10) { mm = '0' + mm; }

  return `${yyyy}-${mm}-${dd}`;
}

function loadNewPurchaseWindow() {
  const html = `
  <div class='transaction flex-container purchase-form'>
    <span class='center-text'>
      <h3>*Payee:</h3>
      <input type='text' id='newPayee'></input>
    </span>

    <span class='center-text'>
      <h3>*Date:</h3>
      <input type='date' id='newDate'></input>
    </span>

    <span class='center-text'>
      <h3>*Amount:</h3>
      <input type='number' step=0.01 id='newAmount'></input>
    </span>

    <span class='center-text'>
      <h3>Memo:</h3>
      <input type='text' id='newMemo'></input>
    </span>

    <span class='center-text'>
      <h3>Address:</h3>
      <input type='text' id='newAddress'></input>
    </span>

    <span class='center-text'>
      <h3>Category:</h3>
      <input type='text' id='newCategory'></input>
    </span>
  </div>
  <div id='submitPurchaseButton' class='transaction center-text' onclick='submitNewPurchase();'><h3>Finish and submit</h3></div>
  <div id='cancelPurchaseButton' class='transaction center-text' onclick='cancelPurchase();'><h3>Cancel</h3></div>`;
  newPurchaseTab.innerHTML = html;
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

  cancelPurchase();
  beginLoading();
}

function openEditWindow(transaction) {
  const modalContainer = document.getElementById('modal');

  const modalWindow = document.createElement('div');
  modalWindow.id = 'editWindow';
  modalWindow.classList.add('modal-content');
  const modalClose = document.createElement('span');
  modalClose.classList.add('modal-close');
  modalClose.textContent = 'X';

  const modalTitle = document.createElement('div');
  modalTitle.id = 'modalTitle';
  modalTitle.classList.add('center-text');
  modalTitle.innerHTML = '<h1>Edit Transaction</h1>';

  const modalBody = document.createElement('div');
  modalBody.id = 'modalBody';
  const editForm = document.createElement('form');
  editForm.id = 'editForm';

  const editSubmit = document.createElement('button');
  editSubmit.id = 'editSubmit';
  editSubmit.textContent = 'Save Changes';
  editSubmit.addEventListener('click', async () => {
    await submitChanges(transaction.transactionId);
    beginLoading();
    modalContainer.style.display = 'none';
    modalWindow.remove();
  });

  const editHTML = `
    <label for='editPayee'>Payee:*</label>
    <input type='text' id='editPayee' value='${transaction.payee}'required>

    <label for='editDate'>Date:*</label>
    <input type='date' id='editDate' value='${unixToInputDate(transaction.date)}' required>

    <label for='editAmount'>Amount:*</label>
    <input type='number' step=0.01 id='editAmount' value='${transaction.amount}' required>

    <label for='editMemo'>Transaction Note:</label>
    <input type='text' id='editMemo' value='${transaction.memo}'>

    <label for='editAddress'>Address:</label>
    <input type='text' step=0.01 id='editAddress' value='${transaction.address}'>

    <label for='editCategory'>Category:</label>
    <input type='text' id='editCategory' value='${transaction.category}'>
  `;

  editForm.innerHTML = editHTML;

  modalBody.appendChild(editForm);
  modalBody.appendChild(editSubmit);

  modalWindow.appendChild(modalClose);
  modalWindow.appendChild(modalTitle);
  modalWindow.appendChild(modalBody);
  modalContainer.appendChild(modalWindow);

  modalContainer.style.display = 'block';

  window.onclick = function (event) {
    if (event.target === modalContainer || event.target === modalClose) {
      modalContainer.style.display = 'none';
      modalWindow.remove();
    }
  };
}

function cancelPurchase() {
  newPurchaseTab.innerHTML = '';
  newPurchaseButton.style.display = 'block';
}

async function submitChanges(transactionId) {
  const data = {
    payee: document.getElementById('editPayee').value,
    date: document.getElementById('editDate').valueAsNumber,
    amount: document.getElementById('editAmount').value,
    memo: document.getElementById('editMemo').value,
    address: document.getElementById('editAddress').value,
    category: document.getElementById('editCategory').value,
  };
  if (!data.payee || !data.date || !data.amount) {
    return;
  }
  const idToken = gapi.auth2.getAuthInstance().currentUser.get().getAuthResponse().id_token;
  await fetch(`/transaction/${transactionId}/`, {
    headers: {
      'Authorization': 'Bearer ' + idToken,
      'Content-Type': 'application/json',
    },
    method: 'PATCH',
    credentials: 'same-origin',
    body: JSON.stringify(data),
  });
}
