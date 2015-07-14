// Game Object
var DropShoot = DropShoot || {};

// Set Game configs
DropShoot.BootState = {
    // Initiat the game
    init: function () {
        this.game.stage.backgroundColor = '#fff';
    
        // Scaling Options
        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        
        // Center Game
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        
        // Enable Physiscs 
        this.game.physics.startSystem(Phaser.Physics.ARCADE);
    },
    preload: function() {
        // Assets used in loading screen
    },
    create: function() {
        // Start the preload State
        this.state.start('Preload');
    }
};