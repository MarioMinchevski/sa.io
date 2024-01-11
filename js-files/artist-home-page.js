'use strict';

import { getCurrentArtist } from './utilities/helper-functions.js';
import { itemsFromLocalStorage } from '../main.js';
import { formatDate, generateDateLabels } from '../js-files/utilities/dates.js';
import { navElements, navInnerWrap, navCurrentArtistName, hamburgerIcon, navMenu } from '../js-files/utilities/globals-vars.js';

const numberOfSoldItems = document.querySelector('.sold-items');
const totalItems = document.querySelector('.total-items');
const totalIncome = document.querySelector('.total-income');

const artistInfoChart = document.getElementById('artist-info-chart');
const radioButtons = document.querySelectorAll('input[type="radio"]');

let myChart

export function initArtistHomePage() {
    navElements.forEach(element => {
        element.style.display = 'none'
    });

    navInnerWrap.style.display = 'block'
    navCurrentArtistName.style.display = 'block'
    hamburgerIcon.style.display = 'flex'
    navMenu.style.display = 'flex'

    const currentArtist = getCurrentArtist()
    navCurrentArtistName.textContent = currentArtist

    const renderTotalItemsSold = () => {
        const filteredArtistItems = itemsFromLocalStorage.filter(item => item.artist === currentArtist)
        const soldItems = filteredArtistItems.filter(item => !!item.priceSold)

        totalItems.textContent = filteredArtistItems.length

        let sumOfSoldItems = 0
        let amountOfSoldItems = 0

        for (let i = 0; i < filteredArtistItems.length; i++) {
            const item = filteredArtistItems[i]

            const priceSold = item.priceSold || 0
            sumOfSoldItems += priceSold

            if (item.dateSold) {
                amountOfSoldItems++
            }
        }

        totalIncome.textContent = `$${sumOfSoldItems}`
        numberOfSoldItems.textContent = amountOfSoldItems

        // Destroy the existing Chart instance

        if (myChart) {
            myChart.destroy()
        }

        myChart = new Chart(artistInfoChart, {
            type: 'bar',
            data: {
                labels: generateDateLabels(14),
                datasets: [{
                    label: 'amount',
                    data: gatherChartData(soldItems, generateDateLabels(14)),
                    borderWidth: 1,
                    backgroundColor: '#a16a5e',
                    hoverBackgroundColor: '#d54c2e'
                }]
            },
            options: {
                scales: {
                    x: {
                        grid: {
                            display: false
                        }
                    },
                    y: {
                        grid: {
                            display: false
                        }
                    }
                },
                indexAxis: 'y',
            },
        });

        drawChart(myChart, filteredArtistItems, 14)

        radioButtons.forEach(radioButton => {
            radioButton.addEventListener('change', function () {
                let days;

                switch (this.id) {
                    case 'seven-days':
                        days = 7;
                        break;
                    case 'fourteen-days':
                        days = 14;
                        break;
                    case 'thirty-days':
                        days = 30;
                        break;
                }
                drawChart(myChart, filteredArtistItems, days)
            })
        })
    }

    renderTotalItemsSold();

    const fourteenDaysRadioButton = document.getElementById('fourteen-days')
    fourteenDaysRadioButton.checked = true;
}

function drawChart(chart, soldItems = [], daysAgo) {
    const labels = generateDateLabels(daysAgo)
    const chartData = gatherChartData(soldItems, labels)

    chart.data.labels = labels
    chart.data.datasets[0].data = chartData
    chart.update()
}

function gatherChartData(soldItems, labels) {
    const chartData = labels.map(label => {
        let sum = 0

        soldItems.forEach(item => {
            if (label === formatDate(item.dateSold)) {
                sum += item.priceSold
            }
        });
        return sum
    });

    return chartData
}

