// Game Object
var DropShoot = DropShoot || {};

DropShoot.GameState = {
     init: function(currentLevel, playerLives) {
        // Create Group for Platforms
        this.platformGroup = this.add.group();
        
        // Set Player Speed
        this.playerSpeed = 150;
        // Set the Bullet Speed
        this.bulletXSpeed = 3;
        
        
        // Var to store Check to see if player is on plaform
        this.onPlatform = false;
        this.readyToFire = false;
        
        // Set the gravity of the game
        this.game.physics.arcade.gravity.y = this.playerSpeed;
         
         // Players Lives
         this.playerLives = playerLives ? playerLives : 3;
         
         // Keep track of number of levels
         this.numLevels = 1;
         // Keep track of the current level
         this.currentLevel = currentLevel;
    },
     create: function() {
         // load the JSON level
        this.loadLevel();  
         
        // Add the player
        this.player = game.add.sprite(this.playerX, this.playerY, 'player');
        this.player.anchor.setTo(0.5);
        // Enable player physics
        this.game.physics.arcade.enable(this.player);
         
         // Set up the UI
         // Style
         var style = {font: '30px Arial', fill: '#fff'};
         //this.scoreLabel = this.add.text(10,20, this.myScore ? this.myScore : '0', style);
         this.livesLabel = this.add.text(420, 20, this.playerLives ? this.playerLives : '3', style);
     },
    // Game Loop
    update: function() {
        // Enable collisions of player and enemies.
        this.game.physics.arcade.collide(this.enemies, this.player, this.killPlayer());
        
        // Set Player Motions
        this.player.body.velocity.y = Math.abs(this.playerSpeed);
        this.player.body.velocity.x = 0;
        this.onPlatform = false;
        // Enable Player Collisions with platforms
        this.game.physics.arcade.collide(this.player, this.platforms, this.movePlayer());
        
         if(!this.onPlatform) {
            this.readyToFire = true;
        }
        
        // IF PLAYER LEAVES BOTTOM OF SCREEN HE SPAWNS AT THE TOP
        if(this.player.y > 320) {
            // Check if the level is completed.
            // If there are no more enemies on the screen. Restart the state.
            if(!this.nextEnemy && this.enemies.length == 0 && !this.nextFlyingEnemy && this.flyingEnemies.length == 0) {
                //Increas to next Level if there is a next level
                if(this.currentLevel < this.numLevels) {
                    this.currentLevel++;
                } else {
                    // Return to level 1
                    this.currentLevel = 1;
                }
                this.game.state.start('Level',true,false, this.playerLives, this.currentLevel);
            }
            this.player.y = 0;
        }
        // If Player hits left side of screen direction changes
        if(this.player.x < 12) {
            this.player.x = 12;
            this.playerSpeed *= -1;
        }
        // If player hits right side of screen direction changes.
        if(this.player.x > 468) {
            this.player.x = 468;
            this.playerSpeed *= -1;
        }
        // Enemies
        // Enable Collision of Enemies and Platform sprites
        this.game.physics.arcade.collide(this.enemies, this.platforms);
        // Enable Collision of Enemies and bullets sprites
        this.enemies.forEach(function(enemy) {
            this.game.physics.arcade.overlap(enemy, this.bullet, this.killEnemy());
        }, this);   
        // FlyingEnemies
        // Enable Collision of Enemies and bullets sprites
        this.flyingEnemies.forEach(function(flyingEnemy) {
            this.game.physics.arcade.overlap(flyingEnemy, this.bullet, this.killFlyingEnemy());
        }, this);
        
        
        //Check if any Emenies Need to be killed
        this.enemies.forEach(function(enemy) {
            if(enemy.health == 0) {
                enemy.destroy();
            }
        }, this)
        
        this.flyingEnemies.forEach(function(flyingEnemy) {
            if(flyingEnemy.health == 0) {
                flyingEnemy.destroy();
            }
        }, this)
        

    },
    movePlayer: function() {
        if(this.game.physics.arcade.collide(this.player, this.platforms)) {
            this.player.body.velocity.x = this.playerSpeed;
            this.onPlatform = true;
            if(this.readyToFire) {
                this.bullet = new DropShoot.PlayerBullet(this.game, this.player.x, this.player.y, this.playerSpeed, this.bulletXSpeed);
                this.game.add.existing(this.bullet);
                this.readyToFire = false;
            }
        }
    },
    killPlayer: function() {
        this.enemies.forEach(function(enemy) {
            if(this.game.physics.arcade.overlap(enemy, this.player)) {
                
              /*  var playerExplosion = this.game.add.emitter(this.player.x, this.player.y, 100);
                    playerExplosion.makeParticles('enemyParticle');
                    playerExplosion.minParticleSpeed.setTo(-200, -200);
                    playerExplosion.maxParticleSpeed.setTo(200, 200);
                    playerExplosion.gravity = 0;
                    playerExplosion.start(true, 500, null, 100); */
                
                this.playerLives -= 1;
                this.livesLabel.text = this.playerLives;
                this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                if(this.playerLives == 0) {
                    this.game.state.start('Level', true, false, this.playerLives);
                }
            }
        }, this);
        
         this.flyingEnemies.forEach(function(flyingEnemy) {
            if(this.game.physics.arcade.overlap(flyingEnemy, this.player)) {
              /*  var playerExplosion = this.game.add.emitter(this.player.x, this.player.y, 100);
                    playerExplosion.makeParticles('enemyParticle');
                    playerExplosion.minParticleSpeed.setTo(-200, -200);
                    playerExplosion.maxParticleSpeed.setTo(200, 200);
                    playerExplosion.gravity = 0;
                    playerExplosion.start(true, 500, null, 100); */
                
                this.playerLives -= 1;
                this.livesLabel.text = this.playerLives;
                this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                if(this.playerLives == 0) {
                    this.game.state.start('Level', true, false, this.playerLives);
                }
            }
        }, this);
        
        this.enemyBullets.forEach(function(ebullet) {
            if(this.game.physics.arcade.collide(ebullet, this.player)) {
                this.playerLives -= 1;
                this.livesLabel.text = this.playerLives;
                this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                if(this.playerLives == 0) {
                    this.game.state.start('Level', true, false, this.playerLives);
                }
            }
        }, this);
        
        this.flyingEnemyBullets.forEach(function(febullet) {
            if(this.game.physics.arcade.collide(febullet, this.player)) {
                this.playerLives -= 1;
                this.livesLabel.text = this.playerLives;
                this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                if(this.playerLives == 0) {
                    this.game.state.start('Level', true, false, this.playerLives);
                }
            }
        }, this);
    },
    gameOver: function() {
        this.game.state.start('Game');
    },
    loadLevel: function() {
        this.currentEnemyIndex = 0;
        this.currentFlyingEnemyIndex = 0;
        
        // Parse the JSON Level File
        this.levelData = JSON.parse(this.game.cache.getText('level' + this.currentLevel));
         
        // Run through Player Data to set player starting position.
        this.levelData.playerData.forEach(function(element) {
            this.playerX = element.x;
            this.playerY = element.y;
        }, this);
        
         //Back Ground
        // Run through backgroundData elements inside the Json File
        this.levelData.backgroundData.forEach(function(element) {
            // Create all the Elements in the Array using x value and y value and the key of the sprite, this case platform you want to use.
            this.background = this.game.add.sprite(element.x, element.y, element.key);
        }, this);
        
        // Enable input on Background
        this.background.inputEnabled = true;
        // Enable input to change character direction
        this.background.events.onInputDown.add(function() {
            this.playerSpeed *= -1;
        }, this);
         
         // Create Platform Group
        // From JSON FIle
        this.platforms = this.add.group();
        this.platforms.enableBody = true;
        // Run through each of the paltformData elements inside the Json File
        this.levelData.platformData.forEach(function(element) {
            // Create all the Elements in the Array using x value and y value and the key of the sprite, this case platform you want to use.
            platform = this.platforms.create(element.x, element.y, element.key).anchor.setTo(0.5);
        }, this);
        
        // Prevent all the items from moving on collioson and being affected by gravity
        this.platforms.setAll('body.immovable', true);
        this.platforms.setAll('body.allowGravity', false);
         
        // Create enemy group
        this.enemies = this.add.group();
        this.enemies.enableBody = true;
        this.enemies.setAll('body.immovable', true);
        
        //Enemy bullets
        this.enemyBullets = this.add.group();
        this.enemyBullets.enableBody = true;
         // Schedule Enemies
        this.scheduleNextEnemy();  
        
        // Create Flying enemy group
        this.flyingEnemies = this.add.group();
        this.flyingEnemies.enableBody = true;
        this.flyingEnemies.setAll('body.immovable', true);
        // Flying Enemy Bullets
        this.flyingEnemyBullets = this.add.group();
        this.flyingEnemyBullets.enableBody = true;
         // Schedule Flying Enemies
        this.scheduleNextFlyingEnemy();
        
    },
    
    // REGULAR ENEMIES
    createEnemy:function(x, y, health, key, scale, range, speed, shoot, time){
        var enemy = this.enemies.getFirstExists(false);
        
        if(!enemy) {
            enemy = new DropShoot.Enemy(this.game, x, y, key, health, this.enemyBullets);
            enemy.anchor.setTo(0.5);
            enemy.sx = enemy.x;
            this.enemies.add(enemy);
        }
        // Reset the enemy.
        enemy.reset(x, y, health, key, scale, range, speed, shoot, time);
    },
    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemyData[this.currentEnemyIndex];
        this.nextEnemy = nextEnemy;
        
        if(nextEnemy) {
            var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemyData[this.currentEnemyIndex - 1].time));
        }   
        
        this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
            // Run through each of the enemyData elements inside the Json File
            this.createEnemy(nextEnemy.x, nextEnemy.y, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.range, nextEnemy.speed, nextEnemy.shoot, nextEnemy.time);
            this.currentEnemyIndex++;
            this.scheduleNextEnemy();
        }, this);
    },
    killEnemy: function() {
        this.enemies.forEach(function(enemy) {
            if(this.game.physics.arcade.overlap(enemy, this.bullet)) {
                enemy.health+= -10;
                if(enemy.health == 0) {
        
                    var enemyExplosion = this.game.add.emitter(enemy.x, enemy.y, 100);
                    enemyExplosion.makeParticles('enemyParticle');
                    enemyExplosion.minParticleSpeed.setTo(-200, -200);
                    enemyExplosion.maxParticleSpeed.setTo(200, 200);
                    enemyExplosion.gravity = 0;
                    enemyExplosion.start(true, 500, null, 100);
                    
                    enemy.enemyTimer.pause();
                    enemy.destroy();
                    
                }
                this.bullet.destroy();
            }
        }, this);
    },
    
    // FLYING ENEMIES
    createFlyingEnemy:function(x, y, health, key, scale, range, speedX, speedY, shoot, time){
        var flyingEnemy = this.flyingEnemies.getFirstExists(false);
        
        if(!flyingEnemy) {
            flyingEnemy = new DropShoot.FlyingEnemy(this.game, x, y, key, health, this.flyingEnemyBullets);
            flyingEnemy.anchor.setTo(0.5);
            this.flyingEnemies.add(flyingEnemy);
        }
        // Reset the enemy.
        flyingEnemy.reset(x, y, health, key, scale, range, speedX, speedY, shoot, time);
    },
    scheduleNextFlyingEnemy: function() {
        var nextFlyingEnemy = this.levelData.flyingEnemyData[this.currentFlyingEnemyIndex];
        this.nextFlyingEnemy = nextFlyingEnemy;
        
        if(nextFlyingEnemy) {
            var nextFlyingTime = 1000 * (nextFlyingEnemy.time - (this.currentFlyingEnemyIndex == 0 ? 0 : this.levelData.flyingEnemyData[this.currentFlyingEnemyIndex - 1].time));
        }
        
        this.nextFlyingEnemyTimer = this.game.time.events.add(nextFlyingTime, function() {
            // Run through each of the enemyData elements inside the Json File
            this.createFlyingEnemy(nextFlyingEnemy.x, nextFlyingEnemy.y, nextFlyingEnemy.health, nextFlyingEnemy.key, nextFlyingEnemy.scale, nextFlyingEnemy.range, nextFlyingEnemy.speedX, nextFlyingEnemy.speedY, nextFlyingEnemy.shoot, nextFlyingEnemy.time);
            this.currentFlyingEnemyIndex++;
            this.scheduleNextFlyingEnemy();
        }, this);
    },
    
    killFlyingEnemy: function() {
        this.flyingEnemies.forEach(function(flyingEnemy) {
            if(this.game.physics.arcade.overlap(flyingEnemy, this.bullet)) {
                flyingEnemy.health+= -10;
                if(flyingEnemy.health == 0) {
        
                    var flyingEnemyExplosion = this.game.add.emitter(flyingEnemy.x, flyingEnemy.y, 100);
                    flyingEnemyExplosion.makeParticles('enemyParticle');
                    flyingEnemyExplosion.minParticleSpeed.setTo(-200, -200);
                    flyingEnemyExplosion.maxParticleSpeed.setTo(200, 200);
                    flyingEnemyExplosion.gravity = 0;
                    flyingEnemyExplosion.start(true, 500, null, 100);
                    
                    flyingEnemy.flyingEnemyTimer.pause();
                    flyingEnemy.destroy();
                    
                }
                this.bullet.destroy();
            }
        }, this);
    } 
};