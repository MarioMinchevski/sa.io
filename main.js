'use strict'

import { items } from './data/data.js'
import { initLandingPage } from './js-files/landing-page.js'
import { initVisitorHomePage } from './js-files/visitor-home-page.js'
import { initVisitorListingPage } from './js-files/visitor-listing-page.js'
import { initArtistHomePage } from './js-files/artist-home-page.js'
import { initArtistItemsPage } from './js-files/artist-items-page.js'
import { initAuctionPage } from './js-files/auction-page.js'
import { hamburgerIcon, navMenu } from './js-files/utilities/globals-vars.js'

function setItemsInLocalStorage() {
    localStorage.setItem('listedItems', JSON.stringify(items))
}

if (!localStorage.getItem("listedItems")) {
    setItemsInLocalStorage(items);
}

let storedItems = localStorage.getItem('listedItems');
export const itemsFromLocalStorage = storedItems ? JSON.parse(storedItems) : []

// handle navmenu visibility on hash change

hamburgerIcon.addEventListener('click', () => {
    navMenu.classList.toggle('active');
})

window.addEventListener('hashchange', () => {
    if (navMenu.classList.contains('active')) {
        navMenu.classList.remove('active');
    }
})

// router func 

const handleRouter = () => {
    let hash = location.hash

    if (hash === '') {
        hash = '#home'
    }

    const allPages = document.querySelectorAll('.page')

    allPages.forEach(page => {
        page.style.display = 'none'
    })

    document.querySelector(hash).style.display = 'block'

    switch (hash) {
        case '#home':
            initLandingPage()
            break;

        case '#visitor-home-page':
            initVisitorHomePage()
            break;

        case '#visitor-listing':
            initVisitorListingPage()
            break;

        case '#artist-home-page':
            initArtistHomePage()
            break;

        case '#artist-items-page':
            initArtistItemsPage()
            break;

        case '#auction-page':
            initAuctionPage()
            break;
    }
}

window.addEventListener('hashchange', handleRouter)
window.addEventListener('load', handleRouter)

