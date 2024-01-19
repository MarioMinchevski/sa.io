'use strict'

import { headerNav, navElements, navInnerWrap, navAuctionText, popUpOverlay } from '../js-files/utilities/globals-vars.js'
import { itemsFromLocalStorage } from '../main.js'
import { formatSeconds, updateLocalStorage } from './utilities/helper-functions.js'

const auctionWrap = document.querySelector('.auction-wrap')
const noAuction = document.querySelector('.no-auction')
const auctionTimer = document.querySelector('.auction-timer')
const auctionItemContainer = document.querySelector('.auction-item-container')
const biddingInput = document.querySelector('.bidding-input')
const bidBtn = document.querySelector('.bid-btn')

const biddingForm = document.querySelector('.bidding-form')
const highestBidNum = document.querySelector('.highestBidNum')
const yourBids = document.querySelector('.yourBids')
const otherBids = document.querySelector('.otherBids')

const auctionMessage = document.querySelector('.auction-message')
const auctionMessageHeader = document.querySelector('.auction-message__header')
const auctionMessageText = document.querySelector('.auction-message__text')
const auctionBackBtn = document.querySelector('.auctionBackBtn')

let allBids = []
const yourBidsList = JSON.parse(localStorage.getItem('yourBidsList')) || []
const othersBidsList = JSON.parse(localStorage.getItem('othersBidsList')) || []

let highestBid = parseInt(localStorage.getItem('highestBid')) || 0
let intId

// flags to help with timers

let bidMade = false
window.location.hashChanged = false

window.addEventListener('hashchange', function () {
    window.location.hashChanged = true
})

const initialAuctionTime = 10

export function initAuctionPage() {
    // display addequate nav elemenets 

    navElements.forEach(element => {
        element.style.display = 'none'
    })

    headerNav.style.display = 'block'
    navInnerWrap.style.display = 'block'
    navAuctionText.style.display = 'block'

    // update the highest bid on page load if there are any bids

    function updateHighestBid() {
        allBids = [...othersBidsList, ...yourBidsList]

        highestBid = Math.max(...allBids)
        highestBidNum.innerText = `$${highestBid}`

        localStorage.setItem('highestBid', highestBid.toString())
        console.log(`highest bid: ${highestBid}`)
    }

    if (yourBidsList.length > 0 || othersBidsList.length > 0) {
        updateHighestBid()
    }

    // getting the auctioning item with true isAuctioning property from local storage

    const auctioningItemIndex = itemsFromLocalStorage.findIndex(item => item.isAuctioning)

    const initialItemPrice = Math.floor((itemsFromLocalStorage[auctioningItemIndex]?.price || 0) / 2)

    // working or disabled button dependeing if youre logged in as artist or visitor

    if (localStorage.getItem('currentArtist') !== null) {
        bidBtn.textContent = 'Only visitors can bid'
        bidBtn.setAttribute('disabled', 'disabled')
    } else {
        bidBtn.textContent = 'place a bid'
        bidBtn.removeAttribute('disabled')
    }

    // render the auctioning item func

    function renderItemOnAuction(itemImage, artistName, itemPrice, itemTitle, itemDesc) {
        return `<div class="auction-item__img-box">
                    <img src="${itemImage}" alt="auction-image">
                </div>
                <div class="auction-item__text-box">
                    <div class="artist-and-price-container">
                        <h2 class="artist-name">${artistName}</h2>
                        <div class="item-price">
                            <span>$${itemPrice}</span>
                        </div>
                    </div>
                    <h3 class="item-title">${itemTitle}</h3>
                    <p class="item-description">${itemDesc}</p>
                </div>`
    }

    // render the auctioning item HTML if there is an auctioning item or
    // display no auctioning item if there is none 

    function fillAuctionItemContainer() {
        auctionItemContainer.innerHTML = ``
        if (auctioningItemIndex !== -1) {
            auctionItemContainer.innerHTML =
                renderItemOnAuction(itemsFromLocalStorage[auctioningItemIndex].image,
                    itemsFromLocalStorage[auctioningItemIndex].artist,
                    Math.floor(itemsFromLocalStorage[auctioningItemIndex].price / 2),
                    itemsFromLocalStorage[auctioningItemIndex].title,
                    itemsFromLocalStorage[auctioningItemIndex].description)

            noAuction.style.display = 'none'
            initTimer(whenDone)
        } else {
            noAuction.style.display = 'block'
            auctionWrap.style.display = 'none'
        }
    }

    fillAuctionItemContainer()

    // update the bids html on page load

    function updateBidsFromLocalStorage() {
        updateLocalStorage(itemsFromLocalStorage)

        localStorage.setItem('yourBidsList', JSON.stringify(yourBidsList))
        localStorage.setItem('othersBidsList', JSON.stringify(othersBidsList))

        yourBids.innerHTML = yourBidsList.map(bid => `<li>$${bid}<img src="images/bid-icon-left-1.png" alt="bid-icon"></li>`).join('')
        otherBids.innerHTML = othersBidsList.map(bid => `<li><img src="images/bid-icon-right-1.png" alt="bid-icon">$${bid}</li>`).join('')
    }

    updateBidsFromLocalStorage()

    // set error, success and clear funcs for the bidding messages 

    function setBiddingError(input, message) {
        const inputControl = input.parentElement
        const displayMessage = inputControl.querySelector('.message')

        displayMessage.textContent = message
    }

    function setBiddingSuccess(input, message) {
        const inputControl = input.parentElement
        const displayMessage = inputControl.querySelector('.message')

        displayMessage.textContent = message
    }

    function clearBiddingMessage(input) {
        const inputControl = input.parentElement
        const displayMessage = inputControl.querySelector('.message')

        displayMessage.textContent = ''
    }

    // validate the input fields to generate addequate message 

    function validateBiddingInput() {
        const biddingInputValue = parseFloat(biddingInput.value)

        clearBiddingMessage(biddingInput)

        if (isNaN(biddingInputValue)) {
            setBiddingError(biddingInput, 'Please enter a valid number for your bid.')
        } else if (biddingInputValue < initialItemPrice) {
            setBiddingError(biddingInput, 'Bid cannot be lower than initial price!')
        } else if (biddingInputValue <= highestBid) {
            setBiddingError(biddingInput, 'Bid must be higher than the current highest bid.')
        } else {
            setBiddingSuccess(biddingInput, 'Good luck!')
        }
    }



    biddingForm.addEventListener('submit', function (ev) {
        ev.preventDefault()
        validateBiddingInput()

        // conditions in order for the form to be submitted 

        const allGood =
            !isNaN(biddingInput.value) &&
            biddingInput.value > initialItemPrice &&
            biddingInput.value > highestBid

        if (!bidBtn.hasAttribute('disabled')) {

            if (allGood) {
                bidMade = true

                const myBid = biddingInput.value
                yourBidsList.push(+myBid)

                initTimer(whenDone, initialAuctionTime)
                const myBidFormData = new FormData()
                myBidFormData.set('amount', biddingInput.value)

                yourBids.innerHTML += `<li>$${biddingInput.value}</li>`

                fetch('https://projects.brainster.tech/bidding/api', {
                    method: 'POST',
                    body: myBidFormData
                })
                    .then(res => res.json())
                    .then(data => {
                        console.log(data)
                        const isBidding = data.isBidding

                        if (isBidding) {
                            const apiBid = data.bidAmount
                            othersBidsList.push(+apiBid)

                            otherBids.innerHTML += `<li>$${data.bidAmount}</li>`
                            biddingInput.value = data.bidAmount + 50
                            initTimer(whenDone, initialAuctionTime)
                            updateHighestBid()
                        } else {
                            updateBidsFromLocalStorage()
                            initTimer(whenDone, initialAuctionTime)
                            return
                        }
                        updateBidsFromLocalStorage()
                    })

                updateHighestBid()
            } else {
                return
            }
        }
    })

    // timer func 

    function initTimer(whenDone, startingTime = initialAuctionTime) {
        clearInterval(intId)

        // variables to help with non stopping timer if you leave the auction page 

        const storedTimestamp = +(localStorage.getItem("initialTimestamp")) || Date.now()
        const currentTime = Date.now()
        const elapsedTime = Math.floor((currentTime - storedTimestamp) / 1000)

        // set the auction time to localstorage time if there is any or make it
        // the initial auction starting time

        let auctionTime = +(localStorage.getItem("time")) || startingTime

        // set the initial time when the auction starts 

        if (elapsedTime === 0) {
            localStorage.setItem("initialTimestamp", currentTime.toString())
        }

        // adjust the auction time if you leave the auction page

        if (window.location.hashChanged) {
            auctionTime = Math.max(startingTime - elapsedTime, 0)
            window.location.hashChanged = false
        }

        // reset the auction time if you make a bid, also reset the timestamp
        // to a new timestamp 

        if (bidMade) {
            auctionTime = startingTime
            localStorage.setItem("initialTimestamp", currentTime.toString())
        }

        intId = setInterval(function () {

            // ensure auctionTime is never negative

            auctionTime = Math.max(auctionTime - 1, 0)

            // set auction time in local storage

            localStorage.setItem("time", auctionTime.toString())
            auctionTimer.innerText = formatSeconds(auctionTime)

            if (auctionTime === 0) {
                whenDone()
                deleteLocalStorageListsAndTime()
            }
        }, 1000)

        localStorage.removeItem("time")
    }


    function whenDone() {
        clearAuction()
        clearInterval(intId)
    }

    // clear the addequate keys from local storage so you won't
    // have issues if you go for another auction right after

    function deleteLocalStorageListsAndTime() {
        localStorage.removeItem('yourBidsList')
        localStorage.removeItem('othersBidsList')
        localStorage.removeItem('highestBid')
        localStorage.removeItem('startTime')
        localStorage.removeItem('initialTimestamp')
    }

    // generate the result of the auction outcome, update the local storage func

    function clearAuction() {
        updateBidsFromLocalStorage()

        const youWon = yourBidsList[yourBidsList.length - 1] > othersBidsList[othersBidsList.length - 1] || othersBidsList.length === 0

        const youLost = yourBidsList[yourBidsList.length - 1] < othersBidsList[othersBidsList.length - 1]

        itemsFromLocalStorage[auctioningItemIndex].isAuctioning = false
        auctionMessage.classList.remove('hidden')
        popUpOverlay.classList.remove('hidden')
        bidBtn.setAttribute('disabled', 'disabled')

        if (youWon) {
            itemsFromLocalStorage[auctioningItemIndex].priceSold = +yourBidsList[yourBidsList.length - 1]
            itemsFromLocalStorage[auctioningItemIndex].dateSold = new Date().toJSON()

            auctionMessageHeader.innerText = 'Congratulations!'
            auctionMessageText.innerText = `You won the item for the price of $${+yourBidsList[yourBidsList.length - 1]}`

            // custom message if you're logged in as an artist

            if (localStorage.getItem('currentArtist') !== null) {
                auctionMessageHeader.innerText = 'Auction successful!'
                auctionMessageText.innerText = `Item was sold for the price of $${+yourBidsList[yourBidsList.length - 1]}`
            }

        } else if (youLost) {
            itemsFromLocalStorage[auctioningItemIndex].priceSold = +othersBidsList[othersBidsList.length - 1]
            itemsFromLocalStorage[auctioningItemIndex].dateSold = new Date().toJSON()

            auctionMessageHeader.innerText = 'Sorry!'
            auctionMessageText.innerText = `Item was sold to another bidder for the price of $${+othersBidsList[othersBidsList.length - 1]}`

            // custom message if you're logged in as an artist

            if (localStorage.getItem('currentArtist') !== null) {
                auctionMessageHeader.innerText = 'Auction successful!'
                auctionMessageText.innerText = `Item was sold for the price of $${+othersBidsList[othersBidsList.length - 1]}`
            }
        } else {
            auctionMessageHeader.innerText = 'Item was not sold'
            auctionMessageText.innerText = `The item did not receive any bids.`
        }

        updateLocalStorage(itemsFromLocalStorage)
    }

    function handleAuctionBackBtn() {
        auctionMessage.classList.add('hidden')
        popUpOverlay.classList.add('hidden')
    }
    auctionBackBtn.addEventListener('click', handleAuctionBackBtn)
}
