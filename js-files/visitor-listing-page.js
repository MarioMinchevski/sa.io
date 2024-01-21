import { itemTypes } from '../data/data.js'
import { itemsFromLocalStorage } from '../main.js'
import { helperFuncRenderSelectOptions } from '../js-files/utilities/helper-functions.js'
import { headerNav, navElements, navInnerWrap, auctionIcon, navVisitorPageNavText, ANIMATION_DURATION, ANIMATION_DURATION_ONE } from '../js-files/utilities/globals-vars.js'

const filtersButton = document.querySelector('.filters-button')
const filtersPopUp = document.querySelector('.filters-pop-up')
const listingGallery = document.querySelector('.listing-gallery')

const itemTypeInput = document.querySelector('#item-type')
const itemArtistInput = document.querySelector('#item-artist')
const itemTitleInput = document.querySelector('#item-title')
const itemPriceMinInput = document.querySelector('#price-min')
const itemPriceMaxInput = document.querySelector('#price-max')

const noResultsWrap = document.querySelector('.no-results')
const noResultsToFiltersButton = document.querySelector('#to-filters')
const noResultsToListingButton = document.querySelector('#to-listing')

const filterSubmitButton = document.querySelector('.filters-submit-button')
const closeFiltersButton = document.querySelector('.close-filters-button')
const resetFiltersButton = document.querySelector('.filters-reset-button')

export function initVisitorListingPage() {

    // display addequate nav elemenets 

    navElements.forEach(element => {
        element.style.display = 'none'
    })

    headerNav.style.display = 'block'
    navInnerWrap.style.display = 'block'
    navVisitorPageNavText.style.display = 'block'
    auctionIcon.style.display = 'block'

    // get the artists names from the api, fill the select tag 
    // via helperFunc

    itemTypeInput.innerHTML = ''

    const chooseOption = document.createElement('option')
    chooseOption.value = ''
    chooseOption.text = 'Choose'
    chooseOption.selected = true
    chooseOption.setAttribute('disabled', 'disabled')

    itemTypeInput.add(chooseOption)

    helperFuncRenderSelectOptions(itemTypes, itemTypeInput)

    fetch('https://jsonplaceholder.typicode.com/users')
        .then(res => res.json())
        .then(data => {
            const listOfArtistsNames = data.map(item => item.name)
            helperFuncRenderSelectOptions(listOfArtistsNames, itemArtistInput)
        }).catch(err => {
            alert(err)
        })

    // select arrow func

    const toggleSelectArrow = (ev) => {
        const selectArrow = ev.target.closest('.sel').querySelector('.select-arrow')
        selectArrow.classList.toggle('flip')
    }

    const closeSelectArrow = (ev) => {
        const selectArrow = document.querySelector('.sel .select-arrow')
        const selectElement = document.querySelector('.sel')

        if (!selectElement.contains(ev.target)) {
            selectArrow.classList.remove('flip')
        }
    }

    // show filters pop up button

    const handleFilterButton = () => {
        filtersPopUp.classList.add('show')

        setTimeout(() => {
            listingGallery.classList.add('hidden');
        }, ANIMATION_DURATION);

        setTimeout(() => {
            filtersButton.classList.add('hidden')
        }, ANIMATION_DURATION_ONE);
    }

    // submit filters btn func 

    const handleFilterSubmitButton = () => {
        filtersPopUp.classList.remove('show')

        listingGallery.classList.remove('hidden')
        filtersButton.classList.remove('hidden')

        const itemTypeInputValue = itemTypeInput.value
        const itemArtistInputValue = itemArtistInput.value;
        const itemTitleInputValue = itemTitleInput.value.toLowerCase().trim()
        const itemPriceMinInputValue = +itemPriceMinInput.value
        const itemPriceMaxInputValue = +itemPriceMaxInput.value

        const noInputsFilled =
            itemTypeInputValue === '' &&
            itemArtistInputValue === '' &&
            itemTitleInputValue === '' &&
            (isNaN(itemPriceMinInputValue) || itemPriceMinInputValue <= 0) &&
            (isNaN(itemPriceMaxInputValue) || itemPriceMaxInputValue <= 0)

        if (noInputsFilled) {
            filtersButton.classList.add('hidden')
            noResultsWrap.classList.remove('hidden')
            listingGallery.classList.add('hidden')
            return
        } else {
            const filteredItems = itemsFromLocalStorage.filter(item =>
                item.type.includes(itemTypeInputValue) &&
                item.artist.includes(itemArtistInputValue) &&
                item.title.toLowerCase().includes(itemTitleInputValue) &&
                (
                    (!itemPriceMinInputValue || item.price >= itemPriceMinInputValue) &&
                    (!itemPriceMaxInputValue || item.price < itemPriceMaxInputValue)
                )
            )

            listingGallery.innerHTML = ''

            if (filteredItems.some(item => item.isPublished)) {
                const publishedItems = filteredItems.filter(item => item.isPublished);
                publishedItems.forEach(item => {
                    const itemContent = renderListedItem(item.artist, item.price, item.image, item.title, item.description)
                    listingGallery.innerHTML += itemContent
                })
            } else {
                filtersButton.classList.add('hidden')
                noResultsWrap.classList.remove('hidden')
            }

            itemTypeInput.value = ''
            itemArtistInput.value = ''
            itemTitleInput.value = ''
            itemPriceMinInput.value = ''
            itemPriceMaxInput.value = ''
        }
    }

    // close filters pop up 

    const handleCloseFiltersButton = () => {
        filtersPopUp.classList.remove('show')

        listingGallery.classList.remove('hidden')
        filtersButton.classList.remove('hidden')
    }

    // generate listed item func 

    const renderListedItem = (artistName, itemPrice, itemImage, itemTitle, itemDescription) => {
        return `   <div class="listed-item-container">
                    <div class="listed-item__img-box">
                        <img src="${itemImage}" alt="listed-image">
                    </div>
                    <div class="listed-item__text-box">
                        <div class="artist-and-price-container">
                            <h2 class="artist-name">${artistName}</h2>
                            <div class="item-price">
                                <span>$${itemPrice}</span>
                            </div>
                        </div>
                        <h3 class="item-title">${itemTitle}</h3>
                        <p class="item-description">${itemDescription}</p>
                    </div>
                </div>`
    }

    // fill only published listed items 

    const handleListedItemsRendereing = () => {
        listingGallery.innerHTML = ''

        itemsFromLocalStorage.forEach(item => {
            if (item.isPublished) {
                const itemContent = renderListedItem(item.artist, item.price, item.image, item.title, item.description)
                listingGallery.innerHTML += itemContent
            }
        })
    }

    handleListedItemsRendereing()

    // no results message pop up

    const handleNoResultsToFiltersButton = () => {
        noResultsWrap.classList.add('hidden')
        filtersPopUp.classList.add('show')
        handleListedItemsRendereing()
    }

    const handleNoResultsToListingButton = () => {
        listingGallery.classList.remove('hidden')
        filtersButton.classList.remove('hidden')
        noResultsWrap.classList.add('hidden')
        handleListedItemsRendereing()
    }

    // reset button, shows all published listed items

    function handleResetButton() {
        handleListedItemsRendereing()
        handleCloseFiltersButton()
    }

    // same note for current artist as on landing page

    localStorage.removeItem('currentArtist')

    itemTypeInput.addEventListener('click', toggleSelectArrow)
    itemArtistInput.addEventListener('click', toggleSelectArrow)
    document.addEventListener('click', closeSelectArrow)

    filtersButton.addEventListener('click', handleFilterButton)
    filterSubmitButton.addEventListener('click', handleFilterSubmitButton)
    closeFiltersButton.addEventListener('click', handleCloseFiltersButton)
    resetFiltersButton.addEventListener('click', handleResetButton)

    noResultsToFiltersButton.addEventListener('click', handleNoResultsToFiltersButton)
    noResultsToListingButton.addEventListener('click', handleNoResultsToListingButton)
}