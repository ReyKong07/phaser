var level = 1;
var playerQuantity = 1;
var player = '';
var player2 = '';
var pelota = '';

class MainScene extends Phaser.Scene {
    constructor() {
        super('gameScene');
    }

    preload() {
        this.load.image('jungle', '../img/background.png');
        this.load.image('platform1', '../img/platform1.png');
        this.load.image('ground', '../img/platform4.png');
        this.load.image('pelota', '../img/pelota.png');
        this.load.image('bomb', '../img/bomb.png');
        this.load.image('controlsPlayer1', '../img/player1.png');
        this.load.image('controlsPlayer2', '../img/player2.png');

        this.load.spritesheet('dude', '../img/dude.png', { frameWidth: 32, frameHeight: 48 });
        this.load.spritesheet('secondPlayer', '../img/secondPlayer.png', { frameWidth: 32, frameHeight: 48 });
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
        if (level == 2) {
            platform.create(100, 100, 'ground');
            platform.create(1000, 100, 'ground');
            platform.create(500, 360, 'ground');
            platform.create(200, 250, 'ground');
            platform.create(870, 230, 'ground');
        }
        if (level == 3) {
            platform.create(500, 100, 'ground');
            platform.create(30, 100, 'ground');
            platform.create(1000, 100, 'ground');
            platform.create(50, 360, 'ground');
            platform.create(300, 250, 'ground');
            platform.create(560, 400, 'ground');
            platform.create(870, 230, 'ground');
        }

        player = this.physics.add.sprite(900, 300, 'dude').setScale(2);
        player.setCollideWorldBounds(true);
        player.setBounce(0.2);
        this.physics.add.collider(player, platform);

        if (playerQuantity == 2) {
            player2 = this.physics.add.sprite(100, 300, 'secondPlayer');
            player2.setCollideWorldBounds(true);
            player2.setBounce(0.2);
            this.physics.add.collider(player2, platform);
        }

        pelota = this.physics.add.group({
            key: 'pelota',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 90 }
        });
        this.physics.add.collider(pelota, platform);
        pelota.children.iterate(function (child) {
            child.setBounce(0.5);
        });

        /* animaciones */
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
    }

    update() {
        var tecla = this.input.keyboard.createCursorKeys();
        if (tecla.left.isDown) {
            player.setVelocityX(-160);
            player.anims.play('left', true);
        } else if (tecla.right.isDown) {
            player.setVelocityX(160);
            player.anims.play('right', true);
        } else {
            player.setVelocityX(0);
            player.anims.play('turn', true);
        }
        if (tecla.up.isDown && player.body.touching.down) {
            player.setVelocityY(-300);
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
    scene: [MainScene, Menu, LevelScene, ControlsScene, EndScene],
    scale: {
        mode: Phaser.Scale.FIT
    }
}

new Phaser.Game(config);
