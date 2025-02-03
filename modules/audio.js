export const loadAudios = ({ load }) => {
    load.audio('explotion', './assets/sounds/Retro Explosion Short 15.wav')
}

export const playAudios = (id, { sound }, volume) => {
    return sound.add(id, volume).play()
}