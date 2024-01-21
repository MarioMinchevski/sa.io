'use strict';

import { getCurrentArtist } from './utilities/helper-functions.js';
import { itemsFromLocalStorage } from '../main.js';
import { formatDate, generateDateLabels } from '../js-files/utilities/dates.js';
import { headerNav, navElements, navInnerWrap, navCurrentArtistName, hamburgerIcon, navMenu } from '../js-files/utilities/globals-vars.js';

const numberOfSoldItems = document.querySelector('.sold-items');
const totalItems = document.querySelector('.total-items');
const totalIncome = document.querySelector('.total-income');

const artistInfoChart = document.getElementById('artist-info-chart');
const radioButtons = document.querySelectorAll('input[type="radio"]');

const biddingAmount = document.querySelector('.bidding-amount')
const biddingItemAuthorAndName = document.querySelector('.bidding-item-author-and-name')

let myChart
let highestBid

export function initArtistHomePage() {
    // display addequate nav elemenets 

    navElements.forEach(element => {
        element.style.display = 'none'
    });

    headerNav.style.display = 'block'
    navInnerWrap.style.display = 'block'
    navCurrentArtistName.style.display = 'block'
    hamburgerIcon.style.display = 'flex'
    navMenu.style.display = 'flex'

    // get logged artist and update navbar text 

    const currentArtist = getCurrentArtist()
    navCurrentArtistName.textContent = currentArtist

    const renderTotalItemsSold = () => {

        // get the artist items and filter sold items

        const filteredArtistItems = itemsFromLocalStorage.filter(item => item.artist === currentArtist)
        const soldItems = filteredArtistItems.filter(item => !!item.priceSold)

        totalItems.textContent = filteredArtistItems.length

        let sumOfSoldItems = 0
        let amountOfSoldItems = 0

        // get the sum of the sold items 

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

        // destroy the existing chart objject/instance if there is any

        if (myChart) {
            myChart.destroy()
        }

        // chart setup

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

        // set the default/on load chart view to be 14 days 

        drawChart(myChart, filteredArtistItems, 14)

        // handle the radio button change for the chart

        radioButtons.forEach(radioButton => {
            radioButton.addEventListener('change', function () {
                let days

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

    renderTotalItemsSold()

    // set the default checked radio button

    const fourteenDaysRadioButton = document.getElementById('fourteen-days')
    fourteenDaysRadioButton.checked = true

    // render chart func 

    function drawChart(chart, soldItems = [], daysAgo) {
        const labels = generateDateLabels(daysAgo)
        const chartData = gatherChartData(soldItems, labels)

        chart.data.labels = labels
        chart.data.datasets[0].data = chartData
        chart.update()
    }

    // generate chart data func

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

    // update the currently bidding item box

    const auctioningItemIndex = itemsFromLocalStorage.findIndex(item => item.isAuctioning)

    if (auctioningItemIndex !== -1) {
        highestBid = parseInt(localStorage.getItem('highestBid'))
        biddingAmount.textContent = `$${highestBid}`

        const author = itemsFromLocalStorage[auctioningItemIndex].artist;
        const itemName = itemsFromLocalStorage[auctioningItemIndex].title;

        biddingItemAuthorAndName.classList.remove('hidden')

        biddingItemAuthorAndName.textContent = `${author} - ${itemName}`

        if (!highestBid) {
            biddingAmount.textContent = `no bids yet`
        } else {
            biddingAmount.textContent = `$${highestBid}`
        }

    } else {
        biddingAmount.textContent = 'Currently unavailable'
        biddingItemAuthorAndName.textContent = ''
        biddingItemAuthorAndName.classList.add('hidden')
    }

}



