import settings from './settings.json' with {type: 'json'};
import { createAnimations } from "./modules/animations/animations.js";
import { checkControlsP1, checkControlsP2, killTank } from "./modules/controls/controls.js";
import { tankColors } from "./modules/globalFunctions.js";
import { loadAudios, playAudios } from './modules/audio.js';



class gameScene extends Phaser.Scene {
    constructor() {
        super("gameScene")
    }
    preload() {
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


    create() {
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

        function onTankHit(blueTank, redTank) {
            killTank(blueTank, this);
            killTank(redTank, this)

            setTimeout(() => { this.scene.start('menuScene') }, 1500)
        }

        //SETEO TANQUES
        this.blueTank = this.physics.add.sprite(50, config.height - 150, 'blueTank')
        this.blueTank
            .setSize(34, 32) // tama;o del hitbox
            .setOffset(11, 16) //pongo el sprite en el hitbox
            .setScale(1.5)
            .setCollideWorldBounds(true)//hago que no se pueda ir del mapa
            .setGravityY(300)

        this.blueTank.color = tankColors.BLUE
        this.blueTank.speed = settings.speedBlue
        this.blueTank.isDead = false

        this.physics.add.collider(this.blueTank, this.floor)

        this.redTank = this.physics.add.sprite(550, config.height - 150, 'redTank')
        this.redTank
            .setSize(34, 32) // tama;o del hitbox
            .setOffset(11, 16) //pongo el sprite en el hitbox
            .setScale(1.5)
            .setCollideWorldBounds(true)//hago que no se pueda ir del mapa
            .setGravityY(300)
        this.redTank.color = tankColors.RED
        this.redTank.speed = settings.speedRed;
        this.redTank.flipX = true
        this.redTank.isDead = false

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



    update() {
        const { blueTank, redTank } = this
        if (blueTank.isDead || redTank.isDead) return

        checkControlsP1(this) //seteo controles 
        checkControlsP2(this) //seteo controles 
        //muerte por caida 
        if (blueTank.y >= config.height - 40) {
            killTank(blueTank, this);
            blueTank.setCollideWorldBounds(false)
            //salto cuando cae al vacio 
            setTimeout(() => { blueTank.setVelocityY(-300) }, 100)
            //reinicio la escena
            setTimeout(() => { this.scene.start('menuScene') }, 2000)
        }

        if (redTank.y >= config.height - 40) {
            killTank(redTank, this)
            redTank.setCollideWorldBounds(false)
            setTimeout(() => { redTank.setVelocityY(-300) }, 100)

            setTimeout(() => { this.scene.start('menuScene') }, 2000)
        }

    }

}


class menuScene extends Phaser.Scene {
    constructor() {
        super({ key: "menuScene" });
    }

    create() {
        var game = this;
        game.add.text(200, 100, "MENU TANKS TEST", {
            fill: "white",
            fontSize: "32px",
            fontFamily: 'ComicsSans'
        });

        game.add.text(200, 150, "click anywhere to start");
        game.input.on('pointerdown', (pointer) => {
            game.scene.start('gameScene')
        })
    }
}


const config = {//Objeto global que viene en archivo min de Phaser 
    type: Phaser.AUTO, // tipo de renderizado para el juego
    width: 1920,
    height: 1080,
    backgroundColor: '#8AC4FF',
    parent: 'game', //contenedor donde se va a renderizar el juego, es el div que esta en el html
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 200 },
            debug: false
        }
    },
    scene:
        [menuScene, gameScene]

}
const game = new Phaser.Game(config);
