let element = {};

let ctx = document.querySelector('#budget-graph').getContext('2d');
let labels = [];
let colour  = ['#FB3640','#3585DD','#C1DD35','#35DDB7','#EE8D11' ];

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


// DUMMY DATA
let purchaseSums = [1,2,3,4,5,6];
let purchaseSums2 = [121,32,345,654,234,232];
let purchaseSums3 = [111,222,323,21,343,123];

labels = [
    `Utility Bills `,
    `Food & Drink `,
    `Leisure`,
    `Health `,
    `Travel `,
    `Other `
]

let myChart = new Chart(ctx, {
    type: 'doughnut',
    data: {
        labels: labels,
        datasets: [{
            data: [0,0,0,0,0,0],
            backgroundColor: colour
        }],
    },
    options: {
        responsive: true,
        legend: {
          position: 'bottom'
        }
    }
})


function updateChart (piChartData) {
    console.log(myChart.data.datasets[0].data)
    myChart.data.datasets[0].data = piChartData;
    myChart.update();
    
}

function selectMonth(arr){
    for (let i = 0; i < element.months.length; i++) {
        element.months[i].classList.remove('active-month'); 
    }
} 


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

}




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


//PAGE LOADED FUNCTION 
function pageLoaded(){
    domElements();
    prepareEventListeners();
    console.log('Page Loaded...');
}

window.addEventListener('load', pageLoaded);
