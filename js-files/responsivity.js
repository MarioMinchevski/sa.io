const popUpOverlay = document.querySelector('.pop-up-overlay')
const responsivityModal = document.querySelector('.responsivity-modal')

export function handleResponsiveLayout() {
    const screenWidth = window.innerWidth

    if (screenWidth > 500) {
        popUpOverlay.classList.remove('hidden')
        responsivityModal.classList.remove('hidden')
    } else {
        popUpOverlay.classList.add('hidden')
        responsivityModal.classList.add('hidden')
    }
}

window.addEventListener('resize', handleResponsiveLayout)