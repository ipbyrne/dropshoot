// Game Object
var DropShoot = DropShoot || {};

DropShoot.ShieldPowerUp = function(game, x, y, key, health)  {
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.game = game;
    
    this.health = health;
    
    
    this.shieldPowerTimer = this.game.time.create(false);
    this.shieldPowerTimer.start();
};

DropShoot.ShieldPowerUp.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.ShieldPowerUp.prototype.constructor = DropShoot.Enemy;

DropShoot.ShieldPowerUp.prototype.update = function() {
    if(this.y > 320) {
        this.y =320
        this.body.velocity.y = this.speedY;
        if(this.body.velocity.y > 0) {
            this.body.velocity.y = this.speedY *-1;
        }
    }
    
    if(this.y < 12) {
        this.y =12
        this.body.velocity.y = this.speedY;
        if(this.body.velocity.y < 0) {
            this.body.velocity.y = this.speedY * -1;
        }
    }
    
    if(this.x < 12) {
        this.x = 12;
        this.body.velocity.x = this.speedX;
        if(this.speedX < 0) {
            this.body.velocity.x = this.speedX * -1;
        }
    }
    if(this.x > 468) {
        this.x = 468;
        this.body.velocity.x = this.speedX;
        if(this.speedX > 0) {
            this.body.velocity.x = this.speedX * -1;
        }
    }
};

DropShoot.ShieldPowerUp.prototype.reset = function(x, y, health, key, scale, range, speedX, speedY, time) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.speedX = speedX;
    this.speedY = speedY;
    this.body.velocity.x = this.speedX;
    this.body.allowGravity = false;
    this.body.velocity.y = this.speedY;
    this.body.immoveable = true;
    
    this.shieldPowerTimer.resume();
};
