'use strict'

import { itemTypes } from '../data/data.js'
import { helperFuncRenderSelectOptions, updateLocalStorage } from '../js-files/utilities/helper-functions.js'
import { formatDate } from './utilities/dates.js'
import { getCurrentArtist } from './utilities/helper-functions.js'
import { itemsFromLocalStorage } from '../main.js'
import { navElements, navInnerWrap, navCurrentArtistName, hamburgerIcon, navMenu, ANIMATION_DURATION, popUpOverlay } from '../js-files/utilities/globals-vars.js'

const artistItemsContainer = document.querySelector('.artist-items-container')
const addNewItemBox = document.querySelector('.add-new-item')
const addNewItemPopUp = document.querySelector('.add-new-item-pop-up')

const isPublishedInput = document.querySelector('#isPublished')
const newItemTitleInput = document.querySelector('#newItemTitle')
const newItemDescInput = document.querySelector('#newItemDesc')
const newItemTypeInput = document.querySelector('#newItemType')
const newItemPriceInput = document.querySelector('#newItemPrice')
const newItemImgUrlInput = document.querySelector('#newItemImgUrl')

const addAndSaveBtn = document.querySelector('.add-save-btn')
const cancelBtn = document.querySelector('.cancel-btn')

const confirmDeleteBtn = document.querySelector('#confirm-delete')
const cancelDeleteBtn = document.querySelector('#cancel-delete')
const deleteConfirmationPopUp = document.querySelector('.delete-confirmation-pop-up')



let itemIdToDelete
let itemIdToEdit = -1

export function initArtistItemsPage() {

    // display addequate nav elemenets 

    navElements.forEach(element => {
        element.style.display = 'none'
    })

    navInnerWrap.style.display = 'block'
    navCurrentArtistName.style.display = 'block'
    hamburgerIcon.style.display = 'flex'
    navMenu.style.display = 'flex'

    // render item type options in select element

    helperFuncRenderSelectOptions(itemTypes, newItemTypeInput)

    // get the current artist from local storage

    const currentArtist = getCurrentArtist()
    navCurrentArtistName.textContent = currentArtist

    navCurrentArtistName.textContent = currentArtist

    // fill the items container func

    function fillItemsContainer() {
        const itemsFromCurrentArtist = itemsFromLocalStorage.filter(item => item.artist === currentArtist)
        artistItemsContainer.innerHTML = ''

        console.log(itemsFromCurrentArtist)

        itemsFromCurrentArtist.forEach(item => {
            renderArtistItem(item.id, item.image, item.title, item.dateCreated, item.price, item.description, item.isPublished)
        })
    }

    fillItemsContainer()

    // render an item card func

    function renderArtistItem(id, image, title, date, price, desc, isPublished) {
        const artistItem = document.createElement('div')
        artistItem.classList.add('artist-item')

        artistItem.setAttribute('id', id)

        // item content 

        const itemInfo = document.createElement('div')
        itemInfo.classList.add('item-info')

        const itemImg = document.createElement('img')
        itemImg.classList.add('item-img')
        itemImg.setAttribute('alt', 'item-img')
        itemImg.src = image

        const itemHeader = document.createElement('div')
        itemHeader.classList.add('item-info-header')

        const itemTitleAndDate = document.createElement('div')
        itemTitleAndDate.classList.add('title-and-date')

        const itemTitle = document.createElement('h2')
        itemTitle.textContent = title

        const itemDateCreated = document.createElement('p')
        itemDateCreated.classList.add('item-date')
        itemDateCreated.textContent = formatDate(date)

        const itemPrice = document.createElement('span')
        itemPrice.classList.add('item-price')
        itemPrice.textContent = `$${price}`

        const itemDesc = document.createElement('p')
        itemDesc.classList.add('artist-item-description')
        itemDesc.textContent = desc

        const btnContainer = document.createElement('div')
        btnContainer.classList.add('item-buttons')

        // item buttons 

        const auctionBtn = document.createElement('button')
        auctionBtn.classList.add('item-btn', 'auction-btn')
        auctionBtn.textContent = 'Send to Auction'

        const publishBtn = document.createElement('button')

        if (isPublished === true) {
            publishBtn.textContent = 'Unpublish'
            publishBtn.classList.add('item-btn', 'unpublish-btn')
        } else {
            publishBtn.textContent = 'Publish'
            publishBtn.classList.add('item-btn', 'publish-btn')
        }

        const removeBtn = document.createElement('button')
        removeBtn.classList.add('item-btn', 'remove-btn')
        removeBtn.textContent = 'Remove'

        const editBtn = document.createElement('button')
        editBtn.classList.add('item-btn', 'edit-btn')
        editBtn.textContent = 'Edit'

        itemTitleAndDate.append(itemTitle, itemDateCreated)
        itemHeader.append(itemTitleAndDate, itemPrice)
        itemInfo.append(itemHeader, itemDesc)
        btnContainer.append(auctionBtn, publishBtn, removeBtn, editBtn)

        artistItem.append(itemImg, itemInfo, btnContainer)
        artistItemsContainer.appendChild(artistItem)

        removeBtn.addEventListener('click', () => handleRemoveBtn(id))
        publishBtn.addEventListener('click', () => handlePublishBtn(id))
        editBtn.addEventListener('click', () => handleEditBtn(id))
    }

    // add new item button func

    function handleAddNewItemButton() {
        addNewItemPopUp.classList.add('show')

        setTimeout(() => {
            artistItemsContainer.classList.add('hidden');
            addNewItemBox.classList.add('hidden')
        }, ANIMATION_DURATION);
    }

    // cancel and close add new item pop up button func

    function handleCancelButton() {
        addNewItemPopUp.classList.remove('show')

        artistItemsContainer.classList.remove('hidden');
        addNewItemBox.classList.remove('hidden')

        newItemTitleInput.value = ''
        newItemDescInput.value = ''
        newItemTypeInput.value = ''
        newItemPriceInput.value = ''
        newItemImgUrlInput.value = ''
        isPublishedInput.checked = true

        itemIdToEdit = -1;
    }

    // set error func for missing/blank fields

    function setError(input, message) {
        const inputControl = input.parentElement
        const displayMessage = inputControl.querySelector('.message')

        displayMessage.textContent = message
    }

    // item buttons funcs and events 

    function handleAddAndSaveBtn() {
        const newItemTitleInputValue = newItemTitleInput.value.trim()
        const newItemDescInputValue = newItemDescInput.value.trim()
        const newItemTypeInputValue = newItemTypeInput.value
        const newItemPriceInputValue = newItemPriceInput.value.trim()
        const newItemImgUrlInputValue = newItemImgUrlInput.value.trim()

        if (newItemTitleInputValue === '') {
            setError(newItemTitleInput, 'Field cannot be empty')
        }

        if (newItemTypeInputValue === '') {
            setError(newItemTypeInput, 'Please choose a type')
        }

        if (newItemPriceInputValue === '') {
            setError(newItemPriceInput, 'Field cannot be empty')
        }

        if (newItemImgUrlInputValue === '' && !camImage.src) {
            setError(newItemImgUrlInput, 'Enter an URL or take a screenshot')
        }

        if (newItemImgUrlInputValue !== '' && camImage.src) {
            setError(newItemImgUrlInput, 'Enter URL or screenshot only')
        }

        const allGood =
            newItemTitleInputValue !== '' &&
            newItemTypeInputValue !== '' &&
            newItemPriceInputValue !== '' &&
            (newItemImgUrlInputValue !== '' || camImage.src)

        // An item is being edited

        if (itemIdToEdit !== -1) {
            if (allGood) {
                itemsFromLocalStorage[itemIdToEdit].title = newItemTitleInputValue
                itemsFromLocalStorage[itemIdToEdit].description = newItemDescInputValue
                itemsFromLocalStorage[itemIdToEdit].type = newItemTypeInputValue
                itemsFromLocalStorage[itemIdToEdit].image = newItemImgUrlInputValue !== '' ? newItemImgUrlInputValue : camImage.src
                itemsFromLocalStorage[itemIdToEdit].price = +newItemPriceInputValue
                itemsFromLocalStorage[itemIdToEdit].isPublished = isPublishedInput.checked

                updateLocalStorage(itemsFromLocalStorage)
                fillItemsContainer()

                addNewItemPopUp.classList.remove('show')

                artistItemsContainer.classList.remove('hidden');
                addNewItemBox.classList.remove('hidden')

                newItemTitleInput.value = ''
                newItemDescInput.value = ''
                newItemTypeInput.value = ''
                newItemPriceInput.value = ''
                newItemImgUrlInput.value = ''
                isPublishedInput.checked = true

                itemIdToEdit = -1;
                console.log(itemsFromLocalStorage)
            }
        }

        // A new item is being added

        else {
            if (allGood) {
                const newItem = {
                    "id": '',
                    "title": newItemTitleInputValue,
                    "description": newItemDescInputValue,
                    "type": newItemTypeInputValue,
                    "image": newItemImgUrlInputValue !== '' ? newItemImgUrlInputValue : camImage.src,
                    "price": +newItemPriceInputValue,
                    "artist": localStorage.getItem('currentArtist'),
                    "dateCreated": Date.now(),
                    "isPublished": isPublishedInput.checked,
                    "isAuctioning": false,
                    "dateSold": null,
                    "priceSold": null
                }

                itemsFromLocalStorage.push(newItem)
                itemsFromLocalStorage.forEach((item, index) => {
                    item.id = index + 1
                })

                updateLocalStorage(itemsFromLocalStorage)
                fillItemsContainer()

                addNewItemPopUp.classList.remove('show')

                artistItemsContainer.classList.remove('hidden');
                addNewItemBox.classList.remove('hidden')

                newItemTitleInput.value = ''
                newItemDescInput.value = ''
                newItemTypeInput.value = ''
                newItemPriceInput.value = ''
                newItemImgUrlInput.value = ''
                isPublishedInput.checked = true

                itemIdToEdit = -1;

                camImage.removeAttribute('src')
                snapshotBoxInnerWrap.classList.remove('hidden')

                console.log(itemsFromLocalStorage)
            }
        }
    }

    function handleRemoveBtn(id) {
        itemIdToDelete = id

        popUpOverlay.classList.remove('hidden')
        deleteConfirmationPopUp.classList.remove('hidden')
    }

    function handleConfirmRemoveBtn() {
        let indexToRemove = itemsFromLocalStorage.findIndex(item => item.id === itemIdToDelete)
        itemsFromLocalStorage.splice(indexToRemove, 1)

        updateLocalStorage(itemsFromLocalStorage)
        fillItemsContainer()

        popUpOverlay.classList.add('hidden')
        deleteConfirmationPopUp.classList.add('hidden')
    }

    function handleCancelRemoveBtn() {
        popUpOverlay.classList.add('hidden')
        deleteConfirmationPopUp.classList.add('hidden')
    }

    function handlePublishBtn(id) {
        const indexToPublishOrUnpublish = itemsFromLocalStorage.findIndex(item => item.id === id)

        if (itemsFromLocalStorage[indexToPublishOrUnpublish].isPublished === true) {
            itemsFromLocalStorage[indexToPublishOrUnpublish].isPublished = false
        } else {
            itemsFromLocalStorage[indexToPublishOrUnpublish].isPublished = true
        }

        updateLocalStorage(itemsFromLocalStorage)
        fillItemsContainer()
    }

    function handleEditBtn(id) {
        const editingIndex = itemsFromLocalStorage.findIndex(item => item.id === id)
        itemIdToEdit = editingIndex

        addNewItemPopUp.classList.add('show')

        setTimeout(() => {
            artistItemsContainer.classList.add('hidden');
            addNewItemBox.classList.add('hidden')
        }, ANIMATION_DURATION);

        newItemTitleInput.value = itemsFromLocalStorage[itemIdToEdit].title
        newItemDescInput.value = itemsFromLocalStorage[itemIdToEdit].description
        newItemTypeInput.value = itemsFromLocalStorage[itemIdToEdit].type
        newItemPriceInput.value = itemsFromLocalStorage[itemIdToEdit].price
        newItemImgUrlInput.value = itemsFromLocalStorage[itemIdToEdit].image
        isPublishedInput.checked = itemsFromLocalStorage[itemIdToEdit].isPublished

        if (newItemImgUrlInput.value.includes('data:image/png;base64')) {
            const image = newItemImgUrlInput.value
            camImage.src = image

            snapshotBoxInnerWrap.style.display = 'none'
            newItemImgUrlInput.value = ''
        }

        addAndSaveBtn.textContent = 'Save'
    }

    // item type select input arrow flip functions 

    const toggleSelectArrow = (ev) => {
        const selectArrow = ev.target.closest('label').querySelector('.select-arrow')
        selectArrow.classList.toggle('flip')
    }

    const closeSelectArrow = (ev) => {
        const selectArrow = document.querySelector('#newItemType + .select-arrow');
        const selectElement = document.querySelector('#newItemType');

        if (!selectElement.contains(ev.target)) {
            selectArrow.classList.remove('flip');
        }
    }

    // SNAPSHOT SECTION

    // cam snapshot vars

    const snapshotBox = document.querySelector('.snapshot-box')
    const snapshotPopUp = document.querySelector('.snapshot-pop-up')
    const backToAddNewItem = document.querySelector('.backToAddNewItem')
    const realTimeCam = document.querySelector('.realTimeCam')
    const realTimeCamCanvas = document.querySelector('.realTimeCamCanvas')
    const captureRealTimeCamBtn = document.querySelector('.captureRealTimeCamBtn')

    const snapshotBoxInnerWrap = document.querySelector('.snapshot-box__inner-wrap')
    const camImage = document.querySelector('#camImage')

    const trashIcon = document.querySelector('.trash-icon')

    // cam snapshot vars

    function handleToCamBtn() {
        snapshotPopUp.classList.add('show')

        if (snapshotPopUp.classList.contains('hidden')) {
            snapshotPopUp.classList.remove('hidden')
        }

        setTimeout(() => {
            addNewItemPopUp.classList.add('hidden')
            addNewItemPopUp.classList.remove('show')
            artistItemsContainer.classList.add('hidden');
            addNewItemBox.classList.add('hidden')
        }, ANIMATION_DURATION);

        navigator.mediaDevices.getUserMedia({
            video: {
                facingMode: { ideal: 'environment' }
            }
        }).then(stream => {
            realTimeCam.srcObject = stream
        })

        realTimeCam.addEventListener('canplay', function () {
            realTimeCamCanvas.width = realTimeCam.videoWidth
            realTimeCamCanvas.height = realTimeCam.videoHeight
        })
    }

    function handleBackToAddNewItem() {

        if (addNewItemPopUp.classList.contains('hidden')) {
            addNewItemPopUp.classList.remove('hidden')
        }

        setTimeout(() => {
            addNewItemPopUp.classList.add('show')

            snapshotPopUp.classList.remove('show')

            artistItemsContainer.classList.add('hidden');
            addNewItemBox.classList.add('hidden')
        }, ANIMATION_DURATION);
    }

    function handleCaptureRealTimeCamBtn() {
        const ctx = realTimeCamCanvas.getContext('2d')
        ctx.drawImage(realTimeCam, 0, 0)

        const imgUrl = realTimeCamCanvas.toDataURL('image/png')
        snapshotBoxInnerWrap.classList.add('hidden')

        camImage.src = imgUrl
        handleBackToAddNewItem()

        // stop cam record after screenshot is taken

        const camLiveVideo = realTimeCam.srcObject
        const tracks = camLiveVideo.getTracks()
        tracks.forEach(track => track.stop())

        updateTrashIconVisibility();

        console.log(!!camImage.src)
    }

    // trash-icon func, to delete snapshot if needed

    function handleTrashIcon(ev) {
        ev.stopPropagation()

        camImage.removeAttribute('src')
        snapshotBoxInnerWrap.classList.remove('hidden')

        updateTrashIconVisibility();
    }

    function updateTrashIconVisibility() {
        if (!camImage.src) {
            trashIcon.style.display = 'none';
        } else {
            trashIcon.style.display = 'block';
        }
    }

    updateTrashIconVisibility();

    // event listeners 

    newItemTypeInput.addEventListener('click', toggleSelectArrow)
    document.addEventListener('click', closeSelectArrow)

    addNewItemBox.addEventListener('click', handleAddNewItemButton)
    cancelBtn.addEventListener('click', handleCancelButton)

    confirmDeleteBtn.addEventListener('click', handleConfirmRemoveBtn)
    cancelDeleteBtn.addEventListener('click', handleCancelRemoveBtn)
    addAndSaveBtn.addEventListener('click', handleAddAndSaveBtn)

    snapshotBox.addEventListener('click', handleToCamBtn)
    backToAddNewItem.addEventListener('click', handleBackToAddNewItem)
    captureRealTimeCamBtn.addEventListener('click', handleCaptureRealTimeCamBtn)

    trashIcon.addEventListener('click', handleTrashIcon)
}
