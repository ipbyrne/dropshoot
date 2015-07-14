// Game Object
var DropShoot = DropShoot || {};

DropShoot.FlyingEnemy = function(game, x, y, key, health, flyingEnemyBullets)  {
    Phaser.Sprite.call(this, game, x, y, key);
    
    this.game = game;
    
    this.health = health;
    
    this.flyingEnemyBullets = flyingEnemyBullets;
    
    this.flyingEnemyTimer = this.game.time.create(false);
    this.flyingEnemyTimer.start();
    
    // Var to turn on off flying enemy shooting. -- false by default
    this.quit = false;
};

DropShoot.FlyingEnemy.prototype = Object.create(Phaser.Sprite.prototype);
DropShoot.FlyingEnemy.prototype.constructor = DropShoot.Enemy;

DropShoot.FlyingEnemy.prototype.update = function() {
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
    
    if(this.x > 42 && this.x < 62) {
        // Shoot is reloaded once enemy passes this point of the screen.
        this.quit = false;
    }
    if(this.x < 12) {
        this.x = 12;
        this.body.velocity.x = this.speedX;
        if(this.speedX < 0) {
            this.body.velocity.x = this.speedX * -1;
        }
        if(this.shooter == 1) {
            this.fbulletSpeed = this.body.velocity.x * 2;
            this.scheduleShooting();
        }
    }
    if(this.x < 440 && this.x > 420) {
        // Shoot is reloaded once enemy passes this point of the screen.
        this.quit = false;
    }
    if(this.x > 468) {
        this.x = 468;
        this.body.velocity.x = this.speedX;
        if(this.speedX > 0) {
            this.body.velocity.x = this.speedX * -1;
        }
        if(this.shooter == 1) {
            this.fbulletSpeed = this.body.velocity.x * 2;
            this.scheduleShooting();
        }
    }
};

DropShoot.FlyingEnemy.prototype.reset = function(x, y, health, key, scale, range, speedX, speedY, shoot,time) {
    Phaser.Sprite.prototype.reset.call(this, x, y, health);
    this.loadTexture(key);
    this.scale.setTo(scale);
    this.speedX = speedX;
    this.speedY = speedY;
    this.shooter = shoot;
    this.body.velocity.x = this.speedX;
    this.body.allowGravity = false;
    this.body.velocity.y = this.speedY;
    this.body.immoveable = true;
    
    this.flyingEnemyTimer.resume();
};

DropShoot.FlyingEnemy.prototype.scheduleShooting = function() {
    this.shoot();
};

DropShoot.FlyingEnemy.prototype.shoot = function() {
    // if this.quit is true, it doesnt run the shoot method.
    if(this.quit) {
        return;
    }
    // if its false it sets it to true and runs the shoot method only once until this.quit is turned back onto false;
    this.quit = true;
    console.log('test');
    var febullet = this.flyingEnemyBullets.getFirstExists(false);
    if(!febullet) {
        febullet = new DropShoot.FlyingEnemyBullet(this.game, this.x, this.y, this.fbulletSpeed);
        febullet.allowGravity = false;
        febullet.immovable = true;
        febullet.body.velocity.x = this.fbulletSpeed;
        this.flyingEnemyBullets.add(febullet);
    } else {
        febullet.reset(this.x, this.y);
    }
};