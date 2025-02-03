export const createAnimations = (game) => {
    //en anims se definen las animaciones que se van utilizar
    game.anims.create({
        key: 'blueTank-move', //id para aumentar las fichas rojas
        frames: game.anims.generateFrameNumbers(
            'blueTank', //indico que spritesheet voy a usar (se definio arriba)
            { start: 0, end: 1 } //indico que imgs del sprite tiene que utilizar para esa animacion 

        ),
        repeat: -1, //establezco cuantas veces se tiene que repetir, -1 es infinito
        frameRate: 12
    })

    game.anims.create({
        key: 'blueTank-idle', //cuando dejo de mover el tanque 
        frames: [{ key: 'blueTank', frame: 0 }]
    })

    game.anims.create({
        key: 'blueTank-explode', //cuando dejo de mover el tanque 
        frames: game.anims.generateFrameNumbers(
            'blueTankExplotion',
            { start: 0, end: 6 }),
        repeat: 0,
        frameRate: 12
    })

    //ANIMACIONES RED TANK
    game.anims.create({
        key: 'redTank-move', //id para aumentar las fichas rojas
        frames: game.anims.generateFrameNumbers(
            'redTank', //indico que spritesheet voy a usar (se definio arriba)
            { start: 0, end: 1 } //indico que imgs del sprite tiene que utilizar para esa animacion 

        ),
        repeat: -1, //establezco cuantas veces se tiene que repetir, -1 es infinito
        frameRate: 12
    })

    game.anims.create({
        key: 'redTank-idle', //cuando dejo de mover el tanque 
        frames: [{ key: 'redTank', frame: 0 }]
    })

    game.anims.create({
        key: 'redTank-explode', //cuando dejo de mover el tanque 
        frames: game.anims.generateFrameNumbers(
            'redTankExplotion',
            { start: 0, end: 6 }),
        repeat: 0,
        frameRate: 12
    })

}