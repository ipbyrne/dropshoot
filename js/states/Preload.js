// Game Object
var DropShoot = DropShoot || {};

// Load the Game Assets
DropShoot.PreloadState = {
    preload: function() {
        // Load Game Assets
        this.load.image('platform180', 'assets/images/platform180.png');
        this.load.image('platform120', 'assets/images/platform120.png');
        this.load.image('player', 'assets/images/player.png');
        this.load.image('ground', 'assets/images/ground.png');
        this.load.image('background', 'assets/images/backyard.png');
        this.load.image('bullet', 'assets/images/bullet.png');
        this.load.image('enemy', 'assets/images/enemy.png');
        this.load.image('enemyParticle', 'assets/images/enemyParticle.png');
        
        // Level Select Screen
        this.load.spritesheet('levels', 'assets/images/levels.png', 64, 64);
        this.load.spritesheet('level_arrows', 'assets/images/level_arrows.png', 48, 48);
        
        //Level Data
        this.load.text('level1', 'assets/data/level1.json');
        this.load.text('level2', 'assets/data/level2.json');
        this.load.text('level3', 'assets/data/level3.json');
    },
    create: function() {
        // Start the game state
        this.state.start('Level');
    }
};