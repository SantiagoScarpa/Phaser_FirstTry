import settings from './settings.json' with {type: 'json'};
import { createAnimations } from "./modules/animations/animations.js";
import { checkControlsP1, checkControlsP2 } from "./modules/controls/controls.js";
import { globals } from "./modules/globalFunctions.js";
import { loadAudios, playAudios } from './modules/audio.js';

const { playAnimation, isTouchingFloor } = globals

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
    console.log(`version ${settings.version}`)
    //mostrar en consola los keycodes
    //console.log(Phaser.Input.Keyboard.KeyCodes)

    //this --> el juego (la instancia de hecho)
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

    this.load.spritesheet(
        'redTank',
        './assets/imgs/sprite/redTank/right_move_red-Sheet.png',
        { frameWidth: 64, frameHeight: 64 }
    )
    this.load.spritesheet(
        'redTankExplotion',
        './assets/imgs/sprite/redTank/right_explode_red-Sheet.png',
        { frameWidth: 64, frameHeight: 64 }
    )

    //cargo suelo
    this.load.spritesheet('floorGrass', './assets/imgs/sprite/ground.png', { frameWidth: 96, frameHeight: 64 })

    //cargo nubes
    this.load.image('cloud6', './assets/imgs/bg_cloud6.png')
    this.load.image('cloud2', './assets/imgs/bg_cloud2.png')
    this.load.image('cloud1', './assets/imgs/bg_cloud01.png')

    loadAudios(this)
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
        .create(500, config.height, 'floorGrass')
        .setTexture('floorGrass', ['1'])

    this.floor
        .create(619, config.height, 'floorGrass')
        .setTexture('floorGrass', ['1'])

    this.floor.children.iterate((child) => {
        child
            .setScale(1.25)
            .refreshBody()
            .setOrigin(0.5, 1)
    })


    //SETEO TANQUES
    this.blueTank = this.physics.add.sprite(50, config.height - 150, 'blueTank')
    this.blueTank
        .setSize(34, 32) // tama;o del hitbox
        .setOffset(11, 16) //pongo el sprite en el hitbox
        .setScale(1.5)
        .refreshBody() //es para sincronizar la posicion y tama;o con el objeto padre
        .setCollideWorldBounds(true)//hago que no se pueda ir del mapa
        .setGravityY(300)

    this.blueTank.speed = settings.speedBlue

    this.physics.add.collider(this.blueTank, this.floor)

    this.redTank = this.physics.add.sprite(550, config.height - 150, 'redTank')
    this.redTank
        .setSize(34, 32) // tama;o del hitbox
        .setOffset(11, 16) //pongo el sprite en el hitbox
        .setScale(1.5)
        //.refreshBody() //es para sincronizar la posicion y tama;o con el objeto padre
        .setCollideWorldBounds(true)//hago que no se pueda ir del mapa
        .setGravityY(300)
    this.redTank.speed = settings.speedRed;
    this.redTank.flipX = true
    this.physics.add.collider(this.redTank, this.floor)

    this.physics.add.collider(this.blueTank, this.redTank, onTankHit, null, this)

    //MUNDO
    //dejo que el tanque siga a la derecha
    this.physics.world.setBounds(0, 0, 2000, config.height)

    this.cameras.main.setBounds(0, 0, 2000, config.height)
    this.cameras.main.startFollow(this.blueTank)

    //creo este objeto para poder interactuar con el teclado 
    this.keys = this.input.keyboard.addKeys('UP,DOWN,LEFT,RIGHT,SPACE,SHIFT,P,W,A,S,D');

    //dejo las animaciones del tanque en un archivo diferente
    createAnimations(this)

}

function onTankHit(blueTank, redTank) {
    // blueTank.isDead = true;
    // redTank.isDead = true
    blueTank.setTexture('blueTankExplotion', 0)
    playAnimation(blueTank, 'blueTank-explode')
    redTank.setTexture('redTankExplotion', 0)
    playAnimation(redTank, 'redTank-explode')

    //playAudios('explotion', this, settings.volume)


    //setTimeout(() => { this.scene.restart() }, 2000)
}

function update() {
    const { blueTank, redTank } = this
    if (blueTank.isDead || redTank.isDead) return

    checkControlsP1(this) //seteo controles 
    checkControlsP2(this) //seteo controles 
    //muerte por caida 
    if (blueTank.y >= config.height - 40) {
        blueTank.isDead = true;
        blueTank.setTexture('blueTankExplotion', 0)
        playAnimation(blueTank, 'blueTank-explode')
        blueTank.setCollideWorldBounds(false)
        playAudios('explotion', this, settings.volume)

        setTimeout(() => { blueTank.setVelocityY(-300) }, 100)
        setTimeout(() => { this.scene.restart() }, 2000)
    }

    if (redTank.y >= config.height - 40) {
        redTank.isDead = true;
        redTank.setTexture('redTankExplotion', 0)
        playAnimation(redTank, 'redTank-explode')
        redTank.setCollideWorldBounds(false)
        playAudios('explotion', this, settings.volume)

        setTimeout(() => { redTank.setVelocityY(-300) }, 100)
        setTimeout(() => { this.scene.restart() }, 2000)
    }

}

