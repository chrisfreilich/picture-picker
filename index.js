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

function calculateAvailableEmotions() {
    return true;
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

setEmotionSegmentStyles()