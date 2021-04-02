const purchasesFunctions = require('./purchases_Functions')

test('should return the correct date', () => {
    const unixTimestamp = Date.now()
    const date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
  
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
  
    testDate = `${dd}/${mm}/${yyyy}`;
    
    expect(purchasesFunctions.unixToDate(unixTimestamp)).toBe(testDate)
})

test('should return the date in yyy/mm/dd format', () => {
    const unixTimestamp = Date.now()
    const date = new Date();
    let dd = date.getDate();
    let mm = date.getMonth() + 1;
    const yyyy = date.getFullYear();
  
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; }
  
    testDate = `${yyyy}-${mm}-${dd}`;
    
    expect(purchasesFunctions.unixToInputDate(unixTimestamp)).toBe(testDate)
})


test('The HTML of newPurchaseTab will be set to "" and the display property of the button will be "block"', () => {

    document.body.innerHTML = `
        <div id='newPurchaseButton'>
            <h2>+ Add New Purchase</h2>
        </div>
        <div id='newPurchaseTab'></div>`

        newPurchaseTab.innerHTML = 'remove';
        newPurchaseButton.style.display = 'none';

    purchasesFunctions.cancelPurchase()

    expect(newPurchaseTab.innerHTML).toBe('');
    expect(newPurchaseButton.style.display).toBe('block')

})

test('Function will capitalise the first letter in the string', () => {
    const str1 = 'testing'
    const str2 = 'Testing'

    expect(purchasesFunctions.capitalizeFirstLetter(str1)).toBe('Testing')
    expect(purchasesFunctions.capitalizeFirstLetter(str2)).toBe('Testing')
    expect(purchasesFunctions.capitalizeFirstLetter(str2)).not.toBe('testing')

})

test('initialise both inputs with the date in format YYYY-MM-DD', () => {

    document.body.innerHTML = `
    <div>
        <p>Select start date: </p>
        <input type='date' id='startDate'>
    </div>
    <div>
        <p>Select end date: </p>
        <input type='date' id='endDate'>
    </div>
    `;

    const today = new Date();
    let dd = today.getDate();
    let mm = today.getMonth() + 1;
    const yyyy = today.getFullYear();
  
    if (dd < 10) { dd = '0' + dd; }
    if (mm < 10) { mm = '0' + mm; } 

    testStartDate = `${yyyy}-${mm}-01`;
    testEndDate = `${yyyy}-${mm}-${dd}`;

    purchasesFunctions.initDate()

    expect(endDateInput.value).toBe(testEndDate);
    expect(startDateInput.value).toBe(testStartDate);

})