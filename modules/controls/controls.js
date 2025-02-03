import { globals } from "../globalFunctions.js";
const { playAnimation, isTouchingFloor } = globals

export function checkControlsP1({ blueTank, keys }) {
    if (keys.LEFT.isDown) {
        blueTank.x -= blueTank.speed
        blueTank.flipX = true
        playAnimation(blueTank, 'blueTank-move')

    } else if (keys.RIGHT.isDown) {
        blueTank.x += blueTank.speed
        blueTank.flipX = false
        playAnimation(blueTank, 'blueTank-move')
    } else {
        playAnimation(blueTank, 'blueTank-idle')
    }

    if (keys.UP.isDown && isTouchingFloor(blueTank)) {
        if (keys.RIGHT.isDown) {
            blueTank.angle = -15
        } else if (keys.LEFT.isDown) {
            blueTank.angle = 15
        }

        blueTank.setVelocityY(-200)

    } else if (blueTank.body.touching.down) {
        blueTank.angle = 0
    }

}
export function checkControlsP2({ redTank, keys }) {
    if (keys.A.isDown) {
        redTank.x -= redTank.speed
        redTank.flipX = true
        playAnimation(redTank, 'redTank-move')

    } else if (keys.D.isDown) {
        redTank.x += redTank.speed
        redTank.flipX = false
        playAnimation(redTank, 'redTank-move')
    } else {
        playAnimation(redTank, 'redTank-idle')
    }

    if (keys.W.isDown && isTouchingFloor(redTank)) {
        if (keys.D.isDown) {
            redTank.angle = -15
        } else if (keys.A.isDown) {
            redTank.angle = 15
        }

        redTank.setVelocityY(-200)

    } else if (redTank.body.touching.down) {
        redTank.angle = 0
    }

}