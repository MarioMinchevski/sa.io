'use strict';

import { helperFuncRenderSelectOptions, setCurrentArtist } from '../js-files/utilities/helper-functions.js'
import { headerNav, navElements, landingPageNavText } from '../js-files/utilities/globals-vars.js'


const artistVisitorSelectionBox = document.querySelector('.artist-visitor-selection-box')
const artistBox = document.querySelector('.artist-box')
const visitorBox = document.querySelector('.visitor-box')

const selectElement = document.querySelector('.choose-artist')
const dropdownArrow = document.querySelector('.dropdown-arrow')

export function initLandingPage() {
    // display addequate nav elemenets 

    navElements.forEach(element => {
        element.style.display = 'none'
    })
    headerNav.style.display = 'block'
    landingPageNavText.style.display = 'block'

    // get the artists names from the api, fill the select tag 
    // via helperFunc

    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(data => {
            const listOfArtistsNames = data.map(item => item.name)
            helperFuncRenderSelectOptions(listOfArtistsNames, selectElement)
        }).catch(err => {
            alert(err)
        })

    selectElement.addEventListener('change', (ev) => {
        // set current artist using helperFunc

        setCurrentArtist(ev.currentTarget.value)
        location.hash = '#artist-home-page'
    })

    // select arrow func

    const handleClick = (ev) => {
        if (
            ev.target === selectElement ||
            ev.target === dropdownArrow
        ) {
            dropdownArrow.classList.toggle('flip')
        } else if (
            !selectElement.contains(ev.target) &&
            !dropdownArrow.contains(ev.target)
        ) {
            dropdownArrow.classList.remove('flip')
        }
    }

    // rederecting func

    const handleRedirect = (ev) => {
        if (ev.target === artistBox) {
            location.hash = ''
        } else if (ev.target === visitorBox || ev.target.parentElement === visitorBox) {
            location.hash = '#visitor-home-page'
        }
    }

    // remove current artist, so if you were logged as an artist 
    // that started the auction, go back to home pageand the log
    //  as a visitor, the auction button will be not disabled 

    localStorage.removeItem('currentArtist')

    document.addEventListener('click', handleClick);
    artistVisitorSelectionBox.addEventListener('click', handleRedirect)
}
