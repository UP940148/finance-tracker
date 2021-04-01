//Object used to store all of the DOM elements
let element = {};


// this is dummy data used for testing purposes. This data would need to be passed on from the database. It needs to be formatted as an array of some kind and in the correct order matching the labels array. The values need to be added up for the month before being added to the array

let data = {
    jan: [1,2,3,4,5,6],
    feb: [123,321,432,111,21,321],
    mar: [223,321,432,111,21,321],
    apr: [323,321,432,111,21,321],
    may: [232,454,543,432,234,322],
    jun: [112,332,112,443,221,32],
    jul: [223,332,12,442,224,543],
    aug: [323,122,334,322,122,343],
    sep: [133,654,223,443,123,43],
    oct: [232,443,433,121,442,453],
    nov: [212,65,232,445,224,212],
    dec: [123,432,454,232,123,43]
}

// Code to set up the doughnut chart that displays the users monthly spending breakdown.
let ctx = document.querySelector('#budget-graph').getContext('2d');
let colour  = ['#FB3640','#3585DD','#C1DD35','#35DDB7','#EE8D11' ];


// Code used construct the doughnut chart.
let monthlyReportChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels = [`Utility Bills `,`Food & Drink `,`Leisure`,`Health `,`Travel `,`Other`],
        datasets: [{
            data: [1,1,1,1,1,1],
            backgroundColor: ['#FB3640','#3585DD','#C1DD35','#35DDB7','#EE8D11']
        }],
    },
    options: {
        responsive: true,
        legend: {
          position: 'bottom'
        },
        tooltips: true
    }
})

//function used to calculate the monthly total spend based on the sum of all the categories
function monthlySpend(arr) {
    let total = 0;
    for (let i = 0; i < arr.length; i++) {
        total += arr[i]
    }

    return total;
}

//Function used to update doughnut chart with correct figures dependant on which month is selected.
function updateChart (piChartData) {
    monthlyReportChart.data.datasets[0].data = piChartData;
    monthlyReportChart.data.labels = [
        `Utility Bills - £${piChartData[0]}`,
        `Food & Drink - £${piChartData[1]}`,
        `Leisure - £${piChartData[2]}`,
        `Health - £${piChartData[3]}`,
        `Travel - £${piChartData[4]}`,
        `Other - £${piChartData[5]}`
    ]
    monthlyReportChart.update();

    element.totalSpend.textContent = `Your Monthly Spend Is - £${monthlySpend(piChartData)}`
    
}

//Function used by event listeners to highlight the month that they are currently viewing the information for
function selectMonth(arr){
    for (let i = 0; i < element.months.length; i++) {
        element.months[i].classList.remove('active-month'); 
    }
} 


// Code to set up the line chart that displays the users yearly spending breakdown.
let ctx2 = document.querySelector('#yearly-spend').getContext('2d');

let yearlyReportChart = new Chart(ctx2, {
    type: 'line',
    data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
        datasets: [{
            data: [
                monthlySpend(data.jan),
                monthlySpend(data.feb),
                monthlySpend(data.mar),
                monthlySpend(data.apr),
                monthlySpend(data.may),
                monthlySpend(data.jun),
                monthlySpend(data.jul),
                monthlySpend(data.aug),
                monthlySpend(data.sep),
                monthlySpend(data.oct),
                monthlySpend(data.nov),
                monthlySpend(data.dec),
            ],
            backgroundColor: '#29a718',
            lineTension : 0,
            fill: false
        }],
    },
    options: {
        responsive: true,
        legend: {
          position: 'bottom'
        }
        
    },
    
})


// Function used to get all of the DOM elements for the budget report page
function domElements() {
    element.months = document.querySelectorAll('.month');

    element.jan = document.querySelector('#january');
    element.feb = document.querySelector('#february');
    element.mar = document.querySelector('#march');
    element.apr = document.querySelector('#april');
    element.may = document.querySelector('#may');
    element.jun = document.querySelector('#june');
    element.jul = document.querySelector('#july');
    element.aug = document.querySelector('#august');
    element.sep = document.querySelector('#september');
    element.oct = document.querySelector('#october');
    element.nov = document.querySelector('#november');
    element.dec = document.querySelector('#december');

    element.totalSpend = document.querySelector('#total-spend');
}

// Function used to prepare all of the event listeners used on the budget report page
function prepareEventListeners() {
    for (let i = 0; i < element.months.length; i++) {
        element.months[i].addEventListener('click', selectMonth);
    }

    element.jan.addEventListener('click', function () {  element.jan.classList.add('active-month'); updateChart(data.jan) })
    element.feb.addEventListener('click', function () {  element.feb.classList.add('active-month'); updateChart(data.feb)})
    element.mar.addEventListener('click', function () {  element.mar.classList.add('active-month'); updateChart(data.mar) })
    element.apr.addEventListener('click', function () {  element.apr.classList.add('active-month'); updateChart(data.apr) })
    element.may.addEventListener('click', function () {  element.may.classList.add('active-month'); updateChart(data.may) })
    element.jun.addEventListener('click', function () {  element.jun.classList.add('active-month'); updateChart(data.jun) })
    element.jul.addEventListener('click', function () {  element.jul.classList.add('active-month'); updateChart(data.jul) })
    element.aug.addEventListener('click', function () {  element.aug.classList.add('active-month'); updateChart(data.aug) })
    element.sep.addEventListener('click', function () {  element.sep.classList.add('active-month'); updateChart(data.sep) })
    element.oct.addEventListener('click', function () {  element.oct.classList.add('active-month'); updateChart(data.oct) })
    element.nov.addEventListener('click', function () {  element.nov.classList.add('active-month'); updateChart(data.nov) })
    element.dec.addEventListener('click', function () {  element.dec.classList.add('active-month'); updateChart(data.dec) })
}


// Function to begin running the other functions once the page has been fully loaded.
function pageLoaded(){
    domElements();
    prepareEventListeners();
    console.log('Page Loaded...');
}

// Event listener used to determine when the page has been fully loaded
window.addEventListener('load', pageLoaded);
