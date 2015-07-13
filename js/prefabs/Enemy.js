// Game Object
var DropShoot = DropShoot || {};

DropShoot.Enemy = function(game, x, y, key, health)  {
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.game = game;
    
    this.health = health;
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
};

DropShoot.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.Enemy.prototype.constructor = DropShoot.Enemy;

DropShoot.Enemy.prototype.update = function() {
    
    if(this.body.touching.down) {
        if(this.body.velocity.x > 0 && this.x > this.sx + this.range || this.body.velocity.x < 0 && this.x < this.sx - this.range) {
            this.body.velocity.x *= -1;
        }
    } 
    
    
    if(this.y > 320) {
        this.y = 0;
        this.body.velocity.x = this.speed;
        this.sx = this.x;
    }
    if(this.x < 12) {
            this.x = 12;
            this.body.velocity.x = this.speed;
        }
        if(this.x > 468) {
            this.x = 468;
            this.body.velocity.x = this.speed * -1;
        }
    
};

DropShoot.Enemy.prototype.reset = function(x, y, health, key, scale, range, speed,time) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.speed = speed;
    this.body.velocity.x = this.speed;
    this.body.immoveable = true;
    this.sx = x;
    this.range = range;
};