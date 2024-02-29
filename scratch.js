function wildcardAnimate(emotion) {
    let animateInterval = 500;
    let nextAnimate = animateInterval
    let animateEl

        setTimeout(() => {
            animateEl = document.getElementById(emotionSelections[i].emotion)
            animateEl.classList.remove('selected-emotion-segment')
        }, nextAnimate + (animateInterval*3))
}