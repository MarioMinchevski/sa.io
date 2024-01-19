'use strict'

let currentArtist

// select tag option filler func 

export function helperFuncRenderSelectOptions(arr = [], container) {
    arr.forEach(item => {
        const optionElement = document.createElement('option')
        optionElement.value = item
        optionElement.text = item
        container.add(optionElement)
    })
}

// get and set artists funcs 

export function getCurrentArtist() {
    return currentArtist ?? localStorage.getItem('currentArtist')
}

export function setCurrentArtist(artist) {
    currentArtist = artist
    localStorage.setItem('currentArtist', currentArtist)
}

// local storage updater func

export function updateLocalStorage(arr = []) {
    localStorage.setItem('listedItems', JSON.stringify(arr))
}

// auction timer formater func 

export function formatSeconds(totalSeconds) {
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = totalSeconds % 60

    return `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`
}