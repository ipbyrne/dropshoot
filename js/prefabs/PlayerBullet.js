// Game Object
var DropShoot = DropShoot || {};

DropShoot.PlayerBullet =  function(game, x, y, direction, speed) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = direction * speed;
};

DropShoot.PlayerBullet.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.PlayerBullet.prototype.constructor = DropShoot.PlayerBullet;

DropShoot.PlayerBullet.prototype.update = function() {
    this.body.velocity.y = 0;
    this.body.velocity.x = this.xSpeed;
    
    if(this.x < 0 || this.x > 480) {
        this.destroy();
    }
};