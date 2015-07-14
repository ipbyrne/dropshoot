// Game Object
var DropShoot = DropShoot || {};

DropShoot.EnemyBullet =  function(game, x, y, bulletSpeed) {
    Phaser.Sprite.call(this, game, x, y, 'bullet');
    this.anchor.setTo(0.5);
    game.physics.enable(this, Phaser.Physics.ARCADE);
    this.xSpeed = bulletSpeed + Math.random() * (600-200);
};

DropShoot.EnemyBullet.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.EnemyBullet.prototype.constructor = DropShoot.Enemy;

DropShoot.EnemyBullet.prototype.update = function() {
    this.body.allowGravity = false;
    this.body.velocity.y = 0;
    this.body.velocity.x = this.xSpeed;
    
    if(this.x < 0 || this.x > 480) {
        this.destroy();
    }
};