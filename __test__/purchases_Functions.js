module.exports.initDate = function () {
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

module.exports.unixToDate = function (unixTimestamp) {
    const date = new Date(unixTimestamp);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
  
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
  
    return `${dd}/${mm}/${yyyy}`;
}
  
module.exports.unixToInputDate = function(unixTimestamp) {
    const date = new Date(unixTimestamp);
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
  
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
  
    return `${yyyy}-${mm}-${dd}`;
}
  
module.exports.cancelPurchase = function() {
    newPurchaseTab.innerHTML = '';
    newPurchaseButton.style.display = 'block';
  }

module.exports.capitalizeFirstLetter = function (string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
  
module.exports.initDate = function () {
    // Initialise both input fields with date in format YYYY-MM-DD
    const startDateInput = document.getElementById('startDate');
    const endDateInput = document.getElementById('endDate');
    
    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
  
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
  
    startDateInput.value = `${yyyy}-${mm}-01`;
    endDateInput.value = `${yyyy}-${mm}-${dd}`;
  }