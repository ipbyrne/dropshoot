// Game Object
var DropShoot = DropShoot || {};

// Initate the Phaser Framework
var game = new Phaser.Game(480, 320, Phaser.CANVAS);

// Add the game states
game.state.add('Game', DropShoot.GameState);
game.state.add('Menu', DropShoot.MenuState);
game.state.add('Level', DropShoot.LevelState);
game.state.add('Preload', DropShoot.PreloadState);
game.state.add('Boot', DropShoot.BootState);

// Start the Boot state of the game.
game.state.start('Boot');