var level = 1;
var playerQuantity = 1;
var score = 0;
var pelotas = '';
var animLeft='';
var jugador= '';
var usandoTeclas=false;
var contPelotas=0;
var laCopa= false;

class MainScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

    preload() {
        this.load.image('fondo', './JS/img/fondo.png');
        this.load.image('platform1', './JS/img/platform1.png');
        this.load.image('platformaCopa', './JS/img/platform1.png');
        this.load.image('tarjeta', './JS/img/roja.png');
        
        this.load.image('ground', './JS/img/platform4.png');
        this.load.image('pelota', './JS/img/pelota.png');
        this.load.image('copa', './JS/img/copa.png');
        this.load.image('bomb', './JS/img/bomb.png');
        this.load.image('controlsPlayer1', './JS/img/player1.png');
        this.load.image('controlsPlayer2', './JS/img/player2.png');
        this.load.audio('bgMusic', './JS/img/Calimba.mp3');
        this.load.audio('SonidoPel', './JS/img/Swoosh.mp3');
        this.load.audio('SonidoTar', './JS/img/Boing.mp3');

        this.load.spritesheet('dude', './JS/img/dude.png', { frameWidth: 32, frameHeight: 48 });
    }

    create() {
        this.add.image(250, 350, 'fondo');
        var platform = this.physics.add.staticGroup();
        platform.create(150, 690, 'ground');
        platform.create(500, 690, 'ground');

        if (level == 1) {
            this.platCopa=this.physics.add.staticImage(320, 150, 'platformaCopa');
            platform.create(-20, 250, 'ground');//arriba 1
            platform.create(450, 370, 'ground');//arriba 2
            platform.create(10, 500, 'ground');//3
            platform.create(320, 590, 'platform1');//pequeño
        }
        //sonidos
        this.sonidoPelota= this.sound.add('SonidoPel');
        this.sonidoTarjeta= this.sound.add('SonidoTar',{ volume: 2.5 });
        this.bgMusic = this.sound.add('bgMusic', { volume: 0.5, loop: true });

        // Reproducir música de fondo
        this.bgMusic.play();

        // Crear al jugador
        this.player = this.physics.add.sprite(900, 500, 'dude').setScale(2);
        this.player.setCollideWorldBounds(true);
        this.player.setBounce(0.2);
        this.player.score = 0;
        this.physics.add.collider(this.player, platform);
        this.physics.add.collider(this.player, this.platCopa);
        
        // Crear y mostrar la barra de vida
        this.life = 5;
        this.lifeBarWidth = 300;
        this.lifeBarHeight = 20;
        this.lifeBar = this.add.graphics();
        this.updateLifeBar();

        // Crear el objeto que reduce la vida
        
        this.tarjetaRoja = this.physics.add.group({
            key: 'tarjeta',
            repeat: 4,
            setXY: { x: 12, y: 0, stepX: 110 }
        });

        this.tarjetaRoja.children.iterate(function (child) {
            child.setCollideWorldBounds(true); 
            child.setScale(0.5);
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        

        this.physics.add.collider(this.tarjetaRoja, platform);
        this.physics.add.overlap(this.player, this.tarjetaRoja, this.reduceLife, null, this);

        // Crear y mostrar el temporizador
        this.timeLeft = 60;
        this.timerText = this.add.text(400, 50, '60', { fontFamily: 'Seymour One', fontSize: '42px', fill: '#000' }).setOrigin(0.5);
        this.pelotaText = this.add.text(95, 20, 'Pelotas: 0', { fontFamily: 'Seymour One', fontSize: '24px', fill: '#000' }).setOrigin(0.5);
        this.txtVida = this.add.text(45, 50, 'Vida', { fontFamily: 'Seymour One', fontSize: '22px', fill: '#000' }).setOrigin(0.5);

        this.timerEvent = this.time.addEvent({
            delay: 1000,
            callback: this.updateTimer,
            callbackScope: this,
            loop: true
        });

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

        // Animaciones táctiles
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
        this.input.on('pointerdown', this.startMove, this);
        this.input.on('pointermove', this.movePlayer, this);
        this.input.on('pointerup', this.stopMove, this);

        this.isMoving = false;
    }

    startMove(pointer) {
        this.isMoving = true;
        usandoTeclas = false;
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
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'leftTactil') {
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

            if (deltaY < -10 && this.player.body.touching.down) {
                // Saltar
                this.player.setVelocityY(-300);
                if (!this.player.anims.isPlaying || this.player.anims.currentAnim.key !== 'turn') {
                    this.player.anims.play('turn');
                }
            }
        }
    }

    stopMove() {
        this.isMoving = false;
        if (!usandoTeclas) {
            this.player.setVelocityX(0);
        }
    }

    updateTimer() {
        this.timeLeft -= 1;
        this.timerText.setText('' + this.timeLeft);

        if (this.timeLeft <= 0) {
            this.time.removeEvent(this.timerEvent);
            this.scene.start('endScene');
        }
    }

    agarroCopa(copa) {
        copa.disableBody(true, true);
        this.scene.start('winScene');
    }

    agarroPelota(player, pelota) {
        pelota.disableBody(true, true);
        this.sonidoPelota.play();
        contPelotas++;
        this.pelotaText.setText('Pelotas: ' + contPelotas);

        if (this.pelotas.countActive(true) === 0 && (contPelotas < 7)) {
            const positions = [];
        
            this.pelotas.children.iterate(function (child) {
                let x, y;
                let tooClose;
        
                do {
                    x = Phaser.Math.Between(0, 450);
                    y = Phaser.Math.Between(0, 500);
                    tooClose = positions.some(pos => Phaser.Math.Distance.Between(x, y, pos.x, pos.y) < 50);
                } while (tooClose);
        
                positions.push({ x, y });
                child.enableBody(true, x, y, true, true);
            });
        
        
        } else if (contPelotas === 9) {
            laCopa = true;
        }
    }

    reduceLife(player, tarjetaRoja) {
        tarjetaRoja.disableBody(true, true);
        this.sonidoTarjeta.play();
        this.life--;
        this.updateLifeBar();

        if (this.life <= 0) {
            this.scene.start('endScene');
        }
    }

    updateLifeBar() {
        this.lifeBar.clear();
        this.lifeBar.fillStyle(0x08ff08, 1); // Color verde en formato hexadecimal
        this.lifeBar.fillRect(10, 70, this.lifeBarWidth * (this.life / 5), this.lifeBarHeight); // Ajusta la posición y dimensiones según sea necesario
    }
    

    update() {
        var tecla = this.input.keyboard.createCursorKeys();
        animLeft = true;

        if (tecla != null && !this.isMoving) {
            usandoTeclas = true;

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
                usandoTeclas = false;
                if (!usandoTeclas) {
                    this.player.setVelocityX(0);
                    this.player.anims.play('turn');
                }
            }

            if (tecla.up.isDown && this.player.body.touching.down) {
                this.player.setVelocityY(-300);
            }
        }

        if (laCopa) {
            this.copa = this.physics.add.sprite(320, 0, 'copa').setScale(1.2);
            this.copa.setCollideWorldBounds(true);
            this.physics.add.collider(this.copa, this.platCopa);
            this.physics.add.overlap(this.player, this.copa, this.agarroCopa, null, this);
            laCopa = false;
        }
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

class WinScene extends Phaser.Scene {
    constructor() {
        super('winScene');
    }

    preload() { 
        this.load.image('ganaste','./JS/img/fondoGanaste.jpg');
    }

    create() {
        this.add.image(250,400,'ganaste');
    }

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

    preload() { 
        this.load.image('fondoGO','./JS/img/gameOver.png');
    }

    create() {
        this.add.image(250,400, 'fondoGO');
    }

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
    scene: [MainScene, Menu, WinScene, ModeScene, ControlsScene, EndScene],
    scale: {
        mode: Phaser.Scale.FIT
    }
}

new Phaser.Game(config);
