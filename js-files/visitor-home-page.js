'use strict'

import { headerNav, navElements, navInnerWrap, auctionIcon, navVisitorPageNavText } from '../js-files/utilities/globals-vars.js'

const carousel = document.querySelector('.carousel')
const testimonialContainer = document.querySelectorAll('.testimonials__inner-container')
const carouselButtonPrev = document.querySelector('.carousel-button-prev')
const carouselButtonNext = document.querySelector('.carousel-button-next')
const allSlideshowImages = document.querySelectorAll('.slideshow-img')

export function initVisitorHomePage() {
    // display addequate nav elemenets 

    navElements.forEach(element => {
        element.style.display = 'none'
    })

    headerNav.style.display = 'block'
    navInnerWrap.style.display = 'block'
    navVisitorPageNavText.style.display = 'block'
    auctionIcon.style.display = 'block'

    // redirection func

    allSlideshowImages.forEach(image => {
        image.addEventListener('click', () => {
            location.hash = '#visitor-listing'
        })
    })

    // carousel func

    let currentIndex = 0

    const handleCarouselNextButton = () => {
        currentIndex = (currentIndex + 1) % testimonialContainer.length
        carousel.style.transform = `translate(-${currentIndex * 100}%)`
    }

    const handleCarouselPrevButton = () => {
        currentIndex = (currentIndex - 1 + testimonialContainer.length) % testimonialContainer.length
        carousel.style.transform = `translate(-${currentIndex * 100}%)`
    }

    // same note for current artist as on landing page

    localStorage.removeItem('currentArtist')

    carouselButtonNext.addEventListener('click', handleCarouselNextButton)
    carouselButtonPrev.addEventListener('click', handleCarouselPrevButton)
}


