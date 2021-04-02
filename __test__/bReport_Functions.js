//function used to calculate the monthly total spend based on the sum of all the categories
module.exports.monthlySpend = function(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i]
    }

    return total;
}