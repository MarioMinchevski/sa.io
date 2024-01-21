import { items } from "./data.js";

function getRandomIntInclusive(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function getRandomDateAndTime() {
    const thisYear = new Date().getFullYear()

    const thisMonth = new Date().getMonth()
    const randomMonth = getRandomIntInclusive(thisMonth - 3, thisMonth)

    const thisDate = new Date().getDate()
    const randomDate = getRandomIntInclusive(1, thisDate)

    const dateCreated = new Date()

    const setYear = dateCreated.setFullYear(thisYear)
    const setMonth = new Date(setYear).setMonth(randomMonth)
    const setDate = new Date(setMonth).setDate(randomDate)

    const setHours = new Date(setDate).setHours(getRandomIntInclusive(0, 23))
    const setMinutes = new Date(setHours).setMinutes(getRandomIntInclusive(0, 59))
    const setSeconds = new Date(setMinutes).setSeconds(getRandomIntInclusive(0, 59))
    const setMiliseconds = new Date(setSeconds).setMilliseconds(getRandomIntInclusive(0, 999))

    return setMiliseconds
}

const titles = [
    'Whispers of Timelessness',
    'Emerald Dreamscape',
    'Melancholic Symphony',
    'Serendipitous Serenity',
    'Aurora Borealis Reverie',
    'Ethereal Enchantment',
    'Dancing Shadows of Chaos',
    'Luminescent Reverberation',
    'Vibrant Echoes of Silence',
    'Enigmatic Euphoria'
];

function randomDateAfterGivenDate(givenDate) {
    const today = new Date();
    const todayMilliseconds = today.getTime();
    const givenDateMilliseconds = new Date(givenDate).getTime();

    const maxDifferenceMilliseconds = todayMilliseconds - givenDateMilliseconds;
    const randomMillisecondsToAdd = Math.floor(Math.random() * maxDifferenceMilliseconds) + 1;
    const newDateMilliseconds = givenDateMilliseconds + randomMillisecondsToAdd;

    const newDate = new Date(newDateMilliseconds);

    return newDate;
}


export const finalItems = items.map((item, idx) => {

    const dateCreated = new Date(getRandomDateAndTime()).toISOString()
    const price = getRandomIntInclusive(300, 3000)
    return {
        ...item,
        title: titles[getRandomIntInclusive(0, titles.length - 1)],
        image: `https://source.unsplash.com/800x600/?art[${idx}]`,
        isPublished: getRandomIntInclusive(0, 1) === 0,
        dateCreated,
        dateSold: new Date(randomDateAfterGivenDate(dateCreated)).toISOString(),
        price,
        priceSold: price + getRandomIntInclusive(200, 2000)
    }
})
