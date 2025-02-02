import { createAnimations } from "./animations/animations.js"

const config = {//Objeto global que viene en archivo min de Phaser 
    type: Phaser.AUTO, // tipo de renderizado para el juego
    width: 1028,
    height: 512,
    backgroundColor: '#8AC4FF',
    parent: 'game', //contenedor donde se va a renderizar el juego, es el div que esta en el html
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene: {
        preload, //se ejecuta para precargar recursos del juego
        create, // se ejecuta cuando comienza el juego 
        update // se ejecuta constantemente en cada frame
    }

}

new Phaser.Game(config);

function preload() {
    //mostrar en consola los keycodes
    //console.log(Phaser.Input.Keyboard.KeyCodes)

    //this --> el juego (la instancia de hecho)
    //this.load.image('menu1', 'assets/imgs/cards/cardsAcesDark.png');

    this.load.spritesheet(
        'blueTank',
        './assets/imgs/sprite/blueTank/right_move_blue-Sheet.png',
        { frameWidth: 64, frameHeight: 64 }
    )
    this.load.spritesheet(
        'blueTankExplotion',
        './assets/imgs/sprite/blueTank/right_explode_blue-Sheet.png',
        { frameWidth: 64, frameHeight: 64 }
    )


    //cargo suelo
    this.load.spritesheet('floorGrass', './assets/imgs/sprite/ground.png', { frameWidth: 96, frameHeight: 64 })

    //cargo nubes
    this.load.image('cloud6', './assets/imgs/bg_cloud6.png')
    this.load.image('cloud2', './assets/imgs/bg_cloud2.png')
    this.load.image('cloud1', './assets/imgs/bg_cloud01.png')

    this.load.audio('explotion', './assets/sounds/Retro Explosion Short 15.wav')
}

function create() {
    //se carga como (x, y, id-de-img)
    // this.menu1 = this.add.image(512, 256, 'menu1')
    //.setOrigin(0, 0) 
    //el set origin marca cual es el punto de la imagen que va a tomar como origen
    // 0.5, 0.5 es el default y es el medio 
    //0,0 es la punta de arriba izquierrda
    //1,1 es la punta de abajo derecha
    //0,1 abajo izquierda
    //1,0 arriba derecha
    // .setScale(0.50)

    //AGREGO NUBES
    this.add.image(515, 10, 'cloud6')
        .setOrigin(0, 0)
        .setScale(0.75)
    this.add.image(0, 100, 'cloud2')
        .setOrigin(0, 0)
        .setScale(0.75)

    this.add.image(250, 50, 'cloud1')
        .setOrigin(0, 0)
        .setScale(0.75)


    //SETEO EL PISO
    this.floor = this.physics.add.staticGroup()

    this.floor
        .create(64, config.height, 'floorGrass')

    this.floor
        .create(256, config.height, 'floorGrass')

    this.floor
        .create(500, config.height, 'floorGrass').setTexture('floorGrass', ['1'])


    this.floor.children.iterate((child) => {
        child
            .setScale(1.25)
            .refreshBody()
            .setOrigin(0.5, 1)
    })


    //SETEO TANQUE
    this.blueTank = this.physics.add.sprite(50, config.height - 150, 'blueTank')
    this.blueTank
        .setSize(34, 32) // tama;o del hitbox
        .setOffset(11, 16) //pongo el sprite en el hitbox
        .setScale(1.5)
        .refreshBody() //es para sincronizar la posicion y tama;o con el objeto padre
        .setCollideWorldBounds(true)//hago que no se pueda ir del mapa
        .setGravityY(300)


    this.physics.add.collider(this.blueTank, this.floor)



    //MUNDO
    //dejo que el tanque siga a la derecha
    this.physics.world.setBounds(0, 0, 2000, config.height)

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.blueTank)

    //creo este objeto para poder interactuar con el teclado 
    this.keys = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,SPACE,SHIFT,P');

    //dejo las animaciones del tanque en un archivo diferente
    createAnimations(this)

}

function update() {
    if (this.blueTank.isDead) return
    if (this.keys.LEFT.isDown) {
        this.blueTank.x -= 2
        this.blueTank.flipX = true
        this.blueTank.anims.play('blueTank-move', true)

    } else if (this.keys.RIGHT.isDown) {
        this.blueTank.x += 2
        this.blueTank.flipX = false
        this.blueTank.anims.play('blueTank-move', true)
    } else {
        this.blueTank.anims.play('blueTank-idle', true)
    }

    if (this.keys.UP.isDown && this.blueTank.body.touching.down) {
        this.blueTank.setVelocityY(-100)
    }

    if (this.blueTank.y >= config.height - 60) {
        this.blueTank.isDead = true;
        this.blueTank.setTexture('blueTankExplotion', 0)
        this.blueTank.anims.play('blueTank-explode', true)
        this.blueTank.setCollideWorldBounds(false)
        this.sound.add('explotion', { volume: 0.2 }).play()


        setTimeout(() => { this.blueTank.setVelocityY(-300) }, 100)
        setTimeout(() => { this.scene.restart() }, 2000)
    }

}
