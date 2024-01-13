'use strict'

// date labels func for chart 

export function generateDateLabels(daysAgo) {
    const labels = []


    for (let i = 0; i < daysAgo; i++) {

        const now = new Date()

        const date = now.getDate()
        const offsetDate = now.setDate(date - i)


        const formattedDate = formatDate(offsetDate)

        labels.push(formattedDate)
    }

    return labels
}

// date formatter func

export function formatDate(date) {

    return new Date(date).toLocaleDateString('en-gb')
}
