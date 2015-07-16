// Game Object
var DropShoot = DropShoot || {};

DropShoot.Enemy = function(game, x, y, key, health, enemyBullets)  {
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.game = game;
    
    this.health = health;
    
    this.enemyBullets = enemyBullets;
    this.enemyTimer = this.game.time.create(false);
    this.enemyTimer.start();
    
    
};

DropShoot.Enemy.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.Enemy.prototype.constructor = DropShoot.Enemy;

DropShoot.Enemy.prototype.update = function() {
    
    if(this.body.touching.down) {
        if(this.body.velocity.x > 0 && this.x > this.sx + this.range || this.body.velocity.x < 0 && this.x < this.sx - this.range) {
            this.body.velocity.x *= -1;
            if(this.shooter == 1) {
                this.bulletSpeed = this.body.velocity.x * -1;
                this.scheduleShooting();
            }
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

DropShoot.Enemy.prototype.reset = function(x, y, health, key, scale, range, speed, shoot, time, boss) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.speed = speed;
    this.body.velocity.x = this.speed;
    this.body.immoveable = true;
    this.sx = x;
    this.sy =y;
    this.startingHealth = health;
    this.range = range;
    this.shooter = shoot;
    this.boss = boss;
    this.enemyTimer.resume();
};

DropShoot.Enemy.prototype.scheduleShooting = function() {
    this.shoot();
};

DropShoot.Enemy.prototype.shoot = function() {
    var ebullet = this.enemyBullets.getFirstExists(false);
    if(!ebullet) {
        ebullet = new DropShoot.EnemyBullet(this.game, this.x, this.y, this.bulletSpeed);
        ebullet.allowGravity = false;
        ebullet.immovable = true;
        this.enemyBullets.add(ebullet);
    } else {
        ebullet.reset(this.x, this.y);
    }
};