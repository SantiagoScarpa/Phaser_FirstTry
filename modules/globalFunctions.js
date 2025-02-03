export const globals = {
    //creo estas funciones para centralizar las llamadas a las funciones de Phaser. 
    //no optimiza pero el codigo queda mas limpio 
    playAnimation: (obj, animName) => { obj.anims.play(animName, true) },
    isTouchingFloor: (obj) => { return obj.body.touching.down },

}

export const tankColors = {
    BLUE: 1,
    RED: 2
}