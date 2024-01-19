'use strict';

import { helperFuncRenderSelectOptions, setCurrentArtist } from '../js-files/utilities/helper-functions.js'
import { headerNav, navElements, landingPageNavText } from '../js-files/utilities/globals-vars.js'


const artistVisitorSelectionBox = document.querySelector('.artist-visitor-selection-box')
const artistBox = document.querySelector('.artist-box')
const visitorBox = document.querySelector('.visitor-box')

const selectElement = document.querySelector('.choose-artist')
const dropdownArrow = document.querySelector('.dropdown-arrow')

export function initLandingPage() {
    navElements.forEach(element => {
        element.style.display = 'none'
    })
    headerNav.style.display = 'block'
    landingPageNavText.style.display = 'block'

    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(data => {
            const listOfArtistsNames = data.map(item => item.name)
            helperFuncRenderSelectOptions(listOfArtistsNames, selectElement)
        }).catch(err => {
            alert(err)
        })

    selectElement.addEventListener('change', (ev) => {
        setCurrentArtist(ev.currentTarget.value)
        location.hash = '#artist-home-page'
    })

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

    const handleRedirect = (ev) => {
        if (ev.target === artistBox) {
            location.hash = ''
        } else if (ev.target === visitorBox || ev.target.parentElement === visitorBox) {
            location.hash = '#visitor-home-page'
        }
        console.log(ev.target)
    }

    localStorage.removeItem('currentArtist')

    document.addEventListener('click', handleClick);
    artistVisitorSelectionBox.addEventListener('click', handleRedirect)
}
