var config = {
    type: Phaser.AUTO,
    width: window.innerWidth,
    height: window.innerHeight,
    autoResize: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false,
            gravity: { y: 1000 }
        }
    },
    scene: [{
        preload: preload,
        create: create,
        update: update
    }]
};

var game = new Phaser.Game(config);

var jugador;

var arriba,derecha,izquierda;

const velocidad = 350;
const alturaSalto = -530;

var mapa; 

function preload() {
    this.load.spritesheet('personaje1', 'assets/sprites/personaje1.png', { frameWidth: 57, frameHeight: 62 });

    this.load.tilemapTiledJSON('mapa', 'assets/mapa/mapa.json');
    this.load.image('tiles','assets/mapa/tileSets.png');
}

function create() {
    socket.on('jugador-saltando', () =>{
        console.log('Algún jugador está saltando');
    })

    game.config.backgroundColor.setTo(108, 210, 222);

    mapa = this.make.tilemap({ key: 'mapa' });
    var tilesets = mapa.addTilesetImage('tileSets', 'tiles');

    var nubes = mapa.createDynamicLayer('nubes', tilesets, 0, 0);

    var solidos = mapa.createDynamicLayer('solidos', tilesets, 0, 0);
    solidos.setCollisionByProperty({ solido: true });


    jugador = this.physics.add.sprite(100,100,'personaje1',0);
    jugador.setSize(30,0);

    this.anims.create({
        key: 'caminar',
        frames: this.anims.generateFrameNumbers('personaje1', { start: 1, end: 8 }),
        frameRate: 10
    });

    this.physics.add.collider(jugador, solidos);

    this.cameras.main.setBounds(0, 0, mapa.widthInPixels, mapa.heightInPixels);
    this.cameras.main.startFollow(jugador);

    arriba = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
    izquierda = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
    derecha = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
}

function update() {
    jugador.body.setVelocityX(0);

    if(izquierda.isDown){
        jugador.body.setVelocityX(-velocidad);
        jugador.flipX = true;
    }

    if(derecha.isDown){
        jugador.body.setVelocityX(velocidad);
        jugador.flipX = false;
    }

    if(arriba.isDown && jugador.body.onFloor()){
        jugador.body.setVelocityY(alturaSalto);
        socket.emit('saltar');
    }

    if((izquierda.isDown || derecha.isDown) && jugador.body.onFloor()){
        jugador.anims.play('caminar',true);
    }else if(!jugador.body.onFloor()){
        jugador.setFrame(9);
    }else{
        jugador.setFrame(0);
    }
    
}