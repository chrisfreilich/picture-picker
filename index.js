import { catsData } from "./data.js"

let emotionSelections = [
    {  emotion: "moody",     selected: false,  available: true },
    {  emotion: "insomniac", selected: false,  available: true },
    {  emotion: "sad",       selected: false,  available: true },
    {  emotion: "confused",  selected: false,  available: true },
    {  emotion: "dominant",  selected: false,  available: true },
    {  emotion: "happy",     selected: false,  available: true },
    {  emotion: "relaxed",   selected: false,  available: true },
    {  emotion: "hungry",    selected: false,  available: true },
    {  emotion: "scared",    selected: false,  available: true },
    {  emotion: "wildcard",  selected: false,  available: true }
]

const gifEl = document.getElementById('gif-only')
const clearBtnEl = document.getElementById('clear')
const emotionSelectorEl = document.getElementById('emotion-selector')
const pickPictureBtnEl = document.getElementById('btn-pick')
const memeContainerEl = document.getElementById('meme-container')
let areGifsAvailable = true;
const drumroll = new Audio('/audio/drumroll.mp3')
drumroll.volume = 0.5

clearBtnEl.addEventListener('click', clearSelections)
emotionSelectorEl.addEventListener('click', handleSelectorClick)
gifEl.addEventListener('click', updateUI)
pickPictureBtnEl.addEventListener('click', producePicture)
memeContainerEl.addEventListener('click', ()=>{ memeContainerEl.style.display = "none"})

function clearSelections() {
    for (const emotion of emotionSelections) {  
        emotion.available = true 
        emotion.selected = false
    } 
    gifEl.checked = false
    setEmotionSegmentStyles()
}

function handleSelectorClick(event) {
    const targetEmotion = event.target.id
    const targetObject = emotionSelections.find(obj => obj.emotion === targetEmotion)
    if (targetObject.selected) {
        targetObject.selected = false
    } else if (targetObject.available) {
        targetObject.selected = true
    }
    updateUI()
}

function updateUI() {
    calculateAvailableEmotions()
    setEmotionSegmentStyles()
}

function calculateAvailableEmotions() {

    areGifsAvailable = false;
    for (const emotion of emotionSelections) {  emotion.available = false }
    
    // Any emotion we find in matchingCats should be available to select.
    let matchingCats = getMatchingCatsArray()
    for (const cat of matchingCats) {
        if ( !gifEl.checked || cat.isGif ) {
            for (const emotion of cat.emotionTags) {
                emotionSelections.find(obj => obj.emotion === emotion).available = true
            }
        }
        // if cat is a GIF, we should allow the GIFs checkbox
        if (cat.isGif) { areGifsAvailable = true }
    }

    // Wildcard choice is only available if nothing has been selected
    if (getSelectedEmotions().length === 0 && !gifEl.checked) {
        emotionSelections.find(obj => obj.emotion === 'wildcard').available = true
    }
}

function setEmotionSegmentStyles() {

    let selectionMade = false

    for (const emotion of emotionSelections) {
        
        const emotionEl = document.getElementById(emotion.emotion)
        const emotionLabelEl = document.getElementById(`${emotion.emotion}-label`)
        
        emotionEl.classList = "pie__segment"
        if (emotionLabelEl.classList.contains('label-text-invert')) {
            emotionLabelEl.classList = 'label-text-invert'
        } else {
            emotionLabelEl.classList = 'label-text'
        }

        if (emotion.selected) { 
            emotionEl.classList.add("selected-emotion-segment") 
            emotionLabelEl.classList.add("selected-emotion-label")
            selectionMade = true
        } else if (!emotion.available) {
            emotionEl.classList.add("unavailable-emotion-segment")
            emotionLabelEl.classList.add("unavailable-emotion-label")
        }
    }

    // Set availability of other UI elements
    clearBtnEl.style.display = selectionMade || gifEl.checked ? "block" : "none"
    pickPictureBtnEl.disabled = !selectionMade
    gifEl.disabled = !areGifsAvailable
    
    if(areGifsAvailable) {
        document.getElementById("gif-label").classList.remove('gif-unavailable')
    } else {
        document.getElementById("gif-label").classList.add('gif-unavailable')
    }

}

function getSelectedEmotions() {
    let selections = []
    for (const emotion of emotionSelections) {  
        if (emotion.selected) { selections.push(emotion.emotion) }
    }
    return selections
}

function getMatchingCatsArray() {
    const selectedEmotionCats = catsData.filter(cat => getSelectedEmotions().every(emotion => cat.emotionTags.includes(emotion)))
    return selectedEmotionCats.filter(cat => !gifEl.checked | cat.isGif)
}

async function producePicture() {

    let wildcard = false

    // If user selected wildcard, choose random emotion and do animation
    let targetObject = emotionSelections.find(obj => obj.emotion === 'wildcard')
    if (targetObject.selected) {
        wildcard = true
        targetObject.selected = false // don't want 'wildcard' as emotion (should be only one chosen, so this cleans out selection)
        targetObject = emotionSelections[Math.floor(Math.random() * 9) + 1]
        drumroll.play()
        await wildcardAnimate(targetObject.emotion)
        const tada = new Audio('/audio/tada.mp3')
        tada.volume = 0.5
        drumroll.pause()
        tada.play()
        targetObject.selected = true
    }

    const catsArray = getMatchingCatsArray()
    const selectedCat = catsArray[Math.floor(Math.random() * catsArray.length)]
    document.getElementById('meme-img').src = `/images/${selectedCat.image}`
    memeContainerEl.style.display = "flex"   
    
    if (wildcard) { updateUI() }
}

function wildcardAnimate(emotion) {
    let animateInterval = 500;
    let nextAnimate = animateInterval
    let animateEl
    let finalPromise

    for (let i = 0; i < 9; i++) {
        setTimeout(() => {
            animateEl = document.getElementById(emotionSelections[i].emotion)
            animateEl.classList.add('selected-emotion-segment')
        }, nextAnimate)
        
        finalPromise = new Promise( (resolve) => {
            setTimeout(() => {
                animateEl = document.getElementById(emotionSelections[i].emotion)
                animateEl.classList.remove('selected-emotion-segment')
                resolve()
            }, nextAnimate + (animateInterval*3))
        })

        nextAnimate += animateInterval
        if(emotionSelections[i].emotion === emotion) { break }
    }

    return finalPromise
}
