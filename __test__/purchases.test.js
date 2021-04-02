const purchasesFunctions = require('./purchases_Functions')

test('Will initialise the input fields with the correct date format.', () => {

})

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

