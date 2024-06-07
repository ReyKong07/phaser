var level = 1;
var playerQuantity = 1;
var score = 0;
var pelotas = '';
var animLeft='';
var jugador= '';
var usandoTeclas=false;

class MainScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

    preload() {
        this.load.image('jungle', './JS/img/background.png');
        this.load.image('platform1', './JS/img/platform1.png');
        this.load.image('ground', './JS/img/platform4.png');
        this.load.image('pelota', './JS/img/pelota.png');
        this.load.image('bomb', './JS/img/bomb.png');
        this.load.image('controlsPlayer1', './JS/img/player1.png');
        this.load.image('controlsPlayer2', './JS/img/player2.png');

        this.load.spritesheet('dude', './JS/img/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('secondPlayer', './JS/img/secondPlayer.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(250, 350, 'jungle').setScale(2.2);
        var platform = this.physics.add.staticGroup();
        platform.create(150, 690, 'ground');
        platform.create(500, 690, 'ground');

        if (level == 1) {
            platform.create(450, 320, 'ground');
            platform.create(100, 180, 'ground');
            platform.create(320, 560, 'platform1');
            platform.create(10, 450, 'ground');
        }
       

        jugador=this.player = this.physics.add.sprite(900, 300, 'dude').setScale(2);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.player.score = 0;
        this.physics.add.collider(this.player, platform);

        

        // Crear el grupo de pelotas
        this.pelotas = this.physics.add.group();
        const numPelotas = 3;
        for (let i = 0; i < numPelotas; i++) {
            const x = Phaser.Math.Between(0, 450);
            const y = Phaser.Math.Between(0, 500);
            const pelota = this.pelotas.create(x, y, 'pelota');
            pelota.setBounce(0.5);
        }

        // Configurar colisiones entre pelotas y plataformas
        this.physics.add.collider(this.pelotas, platform);

        // Configurar la superposición entre el jugador y las pelotas
        this.physics.add.overlap(this.player, this.pelotas, this.agarroPelota, null, this);

        // Animaciones
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turn',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });
        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });

        /* animaciones tactiles */
        this.anims.create({
            key: 'leftTactil',
            frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'rightTactil',
            frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'turnTactil',
            frames: [{ key: 'dude', frame: 4 }],
            frameRate: 20
        });

        // Configurar controles táctiles
         // Configurar controles táctiles
         this.input.on('pointerdown', this.startMove, this);
         this.input.on('pointermove', this.movePlayer, this);
         this.input.on('pointerup', this.stopMove, this);
 
         this.isMoving = false;

        
    }

    startMove(pointer) {
        this.isMoving = true;
        usandoTeclas=false;
        
        console.log('se cancelo tecla');
        this.startPointerX = pointer.x;
        this.startPointerY = pointer.y;
        this.movePlayer(pointer);
    }

    movePlayer(pointer) {
        if (this.isMoving) {
            const deltaX = pointer.x - this.startPointerX;
            const deltaY = pointer.y - this.startPointerY;

            if (deltaX < -10 && !usandoTeclas) {
                // Mover izquierda
                this.player.setVelocityX(-160);
                if (!this.player.anims.isPlaying  || this.player.anims.currentAnim.key !== 'leftTactil' ) {
                    this.player.anims.play('leftTactil');
                }
            } else if (deltaX > 10) {
                // Mover derecha
                this.player.setVelocityX(160);
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'rightTactil') {
                    this.player.anims.play('rightTactil');
                }
            } else {
                // Detener movimiento horizontal
                this.player.setVelocityX(0);
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'turnTactil') {
                    this.player.anims.play('turnTactil');
                }
            }
            
        }
    }

    

    stopMove() {
        this.isMoving = false;
        if(!usandoTeclas){

            this.player.setVelocityX(0);
        }
        /* if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'turn') {
            this.player.anims.play('turn');
        } */
    }


   /*  agarroPelota(player, pelota) {
        pelota.disableBody(true, true);
        player.score += 10;

        if (this.pelotas.countActive(true) === 0) {
            this.pelotas.children.iterate(function (child) {
                const x = Phaser.Math.Between(0, 450);
                const y = Phaser.Math.Between(0, 500);
                child.enableBody(true, x, y, true, true);
            });
        }
    } */
    
    update() {
        var tecla = this.input.keyboard.createCursorKeys();
        animLeft=true;

        if (tecla != null && !this.isMoving) {
            usandoTeclas = true;
            console.log('se presiono una tecla');
    
            if (tecla.left.isDown) {
                this.player.setVelocityX(-160);
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'left') {
                    this.player.anims.play('left');
                }
            } else if (tecla.right.isDown) {
                this.player.setVelocityX(160);
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'right') {
                    this.player.anims.play('right');
                }
            } else {
                if (this.player.body.velocity.x === 0) {
                    console.log('entro a cero');
                    if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'turn') {
                        this.player.anims.play('turn');
                    }
                    this.player.setVelocityX(0);
                }
            }
        }/*
        }else{
            console.log('nada');
        }
        
        if (tecla.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-300);
            console.log('update: jumping with keyboard');
        } */
    } 
    
}

class Menu extends Phaser.Scene {
    constructor() {
        super('menuScene');
    }

    preload() { }

    create() { }

    update() { }
}

class LevelScene extends Phaser.Scene {
    constructor() {
        super('levelScene');
    }

    preload() { }

    create() { }

    update() { }
}

class ModeScene extends Phaser.Scene {
    constructor() {
        super('modeScene');
    }

    preload() { }

    create() { }

    update() { }
}

class ControlsScene extends Phaser.Scene {
    constructor() {
        super('controlsScene');
    }

    preload() { }

    create() { }

    update() { }
}

class EndScene extends Phaser.Scene {
    constructor() {
        super('endScene');
    }

    preload() { }

    create() { }

    update() { }
}

const config = {
    type: Phaser.AUTO,
    width: 500,
    height: 700,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: [MainScene, Menu, LevelScene, ModeScene, ControlsScene, EndScene],
    scale: {
        mode: Phaser.Scale.FIT
    }
}

new Phaser.Game(config);


