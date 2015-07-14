// Game Object
var DropShoot = DropShoot || {};

DropShoot.FlyingEnemyBullet =  function(game, x, y, fbulletSpeed) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = fbulletSpeed + Math.random() * (600-200);
};

DropShoot.FlyingEnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.FlyingEnemyBullet.prototype.constructor = DropShoot.FlyingEnemy;

DropShoot.FlyingEnemyBullet.prototype.update = function() {
    this.body.allowGravity = false;
    this.body.velocity.y = 0;
    
    if(this.x < 0 || this.x > 480) {
        this.destroy();
    }
};