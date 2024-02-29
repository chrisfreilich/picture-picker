import { catsData } from "./data.js"

let emotionSelections = [
    {  emotion: "moody",     selected: false,  available: true },
    {  emotion: "insomniac", selected: false,  available: true },
    {  emotion: "confused",  selected: false,  available: true },
    {  emotion: "sad",       selected: false,  available: true },
    {  emotion: "dominant",  selected: false,  available: true },
    {  emotion: "happy",     selected: false,  available: true },
    {  emotion: "relaxed",   selected: false,  available: true },
    {  emotion: "hungry",    selected: false,  available: true },
    {  emotion: "scared",    selected: false,  available: true },
    {  emotion: "wildcard",  selected: false,  available: true }
]

// Get all the emotion segments
// const confusedEl = document.getElementById('confused')
// const dominantEl = document.getElementById('dominant')
// const happyEl = document.getElementById('happy')
// const relaxedEl = document.getElementById('relaxed')
// const hungryEl = document.getElementById('hungry')
// const scaredEl = document.getElementById('scared')
// const wildcardEl = document.getElementById('wildcard')
// const moodyEl = document.getElementById('moody')
// const insomniacEl = document.getElementById('insomniac')
// const sadEl = document.getElementById('sad')

// Emotion selector pie element handles all clicks for the segments
document.getElementById('emotion-selector').addEventListener('click', handleSelectorClick)

function handleSelectorClick(event) {
    const targetEmotion = event.target.id
    const targetObject = emotionSelections.find(obj => obj.emotion === targetEmotion)
    if (targetObject.selected) {
        targetObject.selected = false
    } else if (targetObject.available) {
        targetObject.selected = true
    }
    calculateAvailableEmotions()
    setEmotionSegmentStyles()
}


function calculateAvailableEmotions() {
    
    // If this function has been called, the emotion selection has changed,
    // so available other emotions are no longer valid. First clear out the
    // available list and find all the selected emotions.
    let selections = []
    for (const emotion of emotionSelections) {  
        emotion.available = false 
        if (emotion.selected) { selections.push(emotion.emotion) }
    }

    // Create a new array of cat memes whose emotionTags contain all of the selected emotions
    const matchingCats = catsData.filter(cat => selections.every(emotion => cat.emotionTags.includes(emotion)))

    // Any emotion we find in matchingCats should be available to select.
    for (const cat of matchingCats) {
        for (const emotion of cat.emotionTags) {
            emotionSelections.find(obj => obj.emotion === emotion).available = true
        }
    }

    // Wildcard is only available if nothing has been selected
    if (selections.length === 0) {
        emotionSelections.find(obj => obj.emotion === 'wildcard').available = true
    }

}

function setEmotionSegmentStyles() {
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
        } else if (!emotion.available) {
            emotionEl.classList.add("unavailable-emotion-segment")
            emotionLabelEl.classList.add("unavailable-emotion-label")
        }
    }
}
