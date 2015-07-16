// Game Object ********SIDE NOTE******* ALL TIME VALUES IN JSON LEVELS MUST BE IN ORDER **********
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
         
         // Shake World Effect
         this.shakeWorld = 0;
    },
     create: function() {
         // load the JSON level
        this.loadLevel();  
         
        // Add the player
        this.player = game.add.sprite(this.playerX, this.playerY, 'player');
        this.health = 1;
        this.speedBoost = 0;
        this.player.anchor.setTo(0.5);
        // Enable player physics
        this.game.physics.arcade.enable(this.player);
         
         // Set up the UI
         // Style
         var style = {font: '30px Arial', fill: '#fff'};
         //this.scoreLabel = this.add.text(10,20, this.myScore ? this.myScore : '0', style);
         this.livesLabel = this.add.text(420, 20, this.playerLives ? this.playerLives : '3', style);
         this.shieldLabel = this.add.text(30, 20,'0', style);
     },
    // Game Loop
    update: function() {
        
        // SHAKE WORLD ATTEMPED
        if (this.shakeWorld > 0) {
            this.rand1 = this.game.rnd.integerInRange(-3,3);
            this.rand2 = this.game.rnd.integerInRange(-3,3);
            this.game.world.setBounds(this.rand1, this.rand2, this.game.width + this.rand1, this.game.height + this.rand2);
            this.shakeWorld--;
            if (this.shakeWorld == 0) {
                this.game.world.setBounds(0, 0, this.game.width,this.game.height); // normalize after shake?
            }
        }
        
        
        // Enable collisions of player and enemies.
        this.game.physics.arcade.collide(this.enemies, this.player, this.killPlayer());

        
        // Set Player Motions
        if(this.speedBoost == 0) {
            this.player.body.velocity.y = Math.abs(this.playerSpeed);
            this.player.body.velocity.x = 0;
        } else if(this.speedBoost > 0) {
            this.player.body.velocity.y = Math.abs(this.playerSpeed * 2);
            this.player.body.velocity.x = 0;
        }
        this.onPlatform = false;
        // Enable Player Collisions with platforms
        this.game.physics.arcade.collide(this.player, this.platforms, this.movePlayer());
        
         if(!this.onPlatform) {
            this.readyToFire = true;
        }
        
        // IF PLAYER LEAVES BOTTOM OF SCREEN HE SPAWNS AT THE TOP
        if(this.player.y > 320) {
            this.speedBoost-= 1;
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
        
        
        //Check if any Emenies/PowerUps Need to be killed
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
        
        this.shieldPowerUps.forEach(function(shieldPowerUp) {
            if(shieldPowerUp.health == 0) {
                shieldPowerUp.destroy();
            }
        }, this)
        this.speedBoosts.forEach(function(speedBoost) {
            if(speedBoost.health == 0) {
                speedBoost.destroy();
            }
        }, this)
        
        // Set caps for health/shield
        if(this.health > 3) {
            this.health = 1;
        } else if(this.health < 0) {
            this.health = 1
        }
        // Set Speed Boost Cap and Bottom
        if(this.speedBoost < 0) {
            this.speedBoost = 0;
        } else if(this.speedBoost > 4) {
            this.speedBoost = 4;
        }
        // Update UI Text
        this.livesLabel.text = this.playerLives;
        if(this.health == 1) {
            this.shieldLabel.text = 0
        } else if(this.health == 2) {
            this.shieldLabel.text = 1;
        } else if(this.health == 3) {
            this.shieldLabel.text = 2;
        }
        
        // Check for Collisions with Sheild Power up to increase Player Health
        this.shieldPowerUps.forEach(function(shieldPowerUp) {
            if(this.game.physics.arcade.collide(shieldPowerUp, this.player)) {
                var shieldPowerUpExplosion = this.game.add.emitter(shieldPowerUp.x, shieldPowerUp.y, 100);
                    shieldPowerUpExplosion.makeParticles('shieldPowerUpParticle');
                    shieldPowerUpExplosion.minParticleSpeed.setTo(-25, -25);
                    shieldPowerUpExplosion.maxParticleSpeed.setTo(25, 25);
                    shieldPowerUpExplosion.gravity = 0;
                    shieldPowerUpExplosion.start(true, 500, null, 100);
                
                shieldPowerUp.destroy()
                this.health+= 1;
                this.shieldLabel.text = this.health;
            }
        }, this);
        // Check for Collisions with Speed Boost Power Up to increase this.speedBoost
        this.speedBoosts.forEach(function(speedBoost) {
            if(this.game.physics.arcade.collide(speedBoost, this.player)) {
                var speedBoostExplosion = this.game.add.emitter(speedBoost.x, speedBoost.y, 100);
                    speedBoostExplosion.makeParticles('speedBoostParticle');
                    speedBoostExplosion.minParticleSpeed.setTo(-25, -25);
                    speedBoostExplosion.maxParticleSpeed.setTo(25, 25);
                    speedBoostExplosion.gravity = 0;
                    speedBoostExplosion.start(true, 500, null, 100);
                
                speedBoost.destroy()
                this.speedBoost = 4;
            }
        }, this);
    },
    movePlayer: function() {
        if(this.game.physics.arcade.collide(this.player, this.platforms)) {
            if(this.speedBoost == 0) {
                this.player.body.velocity.x = this.playerSpeed;
                this.bulletXSpeed = 3;
            } else if(this.speedBoost > 0) {
                this.player.body.velocity.x = this.playerSpeed *1.5;
                this.bulletXSpeed = 5.5;
            }
            this.onPlatform = true;
            if(this.readyToFire) {
                this.bullet = new DropShoot.PlayerBullet(this.game, this.player.x, this.player.y, this.playerSpeed, this.bulletXSpeed);
                this.game.add.existing(this.bullet);
                this.readyToFire = false;
            }
        }
    },
    /*playerExplosion: function() {
         this.shakeWorld =15;
                    // rest of code here
                    var playerExplosion = this.game.add.emitter(this.player.x, this.player.y, 100);
                    playerExplosion.makeParticles('enemyParticle');
                    playerExplosion.minParticleSpeed.setTo(-100, -100);
                    playerExplosion.maxParticleSpeed.setTo(100, 100);
                    playerExplosion.gravity = 0;
                    playerExplosion.start(true, 500, null, 100); 
        
        if(this.playerLives == 0) {
            this.game.state.start('Level', true, false, this.playerLives);
        }
        this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
    },*/
    killPlayer: function() {
        this.enemies.forEach(function(enemy) {
            if(this.game.physics.arcade.overlap(enemy, this.player)) {
                if(this.health > 1) {
                    this.killEnemy();
                    this.health -= 1;
                } else {
                    this.speedBoost = 0;
                    this.enemies.forEach(function(enemy) {
                        if(enemy.boss == 1) {
                            enemy.x = enemy.sx;
                            enemy.y = enemy.sy;
                            enemy.body.velocity.x = enemy.speed;
                            enemy.health = enemy.startingHealth;
                        }
                    }, this);
                    
                    this.flyingEnemies.forEach(function(flyingEnemy) {
                        if(flyingEnemy.boss == 1) {
                            flyingEnemy.x = flyingEnemy.sx;
                            flyingEnemy.y = flyingEnemy.sy;
                            flyingEnemy.body.velocity.x = flyingEnemy.speed;
                            flyingEnemy.health = flyingEnemy.startingHealth;
                        }
                    }, this);
                    
                    this.killEnemy();
                    this.health-= 1;
                    if(this.health == 0) {
                        this.playerLives -= 1;
                        this.livesLabel.text = this.playerLives;
                        //this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                        if(this.playerLives == 0) {
                            this.game.state.start('Level', true, false, this.playerLives);
                        }
                        this.player.x = this.playerX;
                        this.player.y = this.playerY;
                        this.health = 1;
                        }
                    }
                }
        }, this);
        
         this.flyingEnemies.forEach(function(flyingEnemy) {
            if(this.game.physics.arcade.overlap(flyingEnemy, this.player)) {
                if(this.health > 1) {
                    this.killEnemy();
                    this.health -= 1;
                } else {
                    this.speedBoost = 0;
                    this.enemies.forEach(function(enemy) {
                        if(enemy.boss == 1) {
                            enemy.x = enemy.sx;
                            enemy.y = enemy.sy;
                            enemy.body.velocity.x = enemy.speed;
                            enemy.health = enemy.startingHealth;
                        }
                    }, this);
                    
                    this.flyingEnemies.forEach(function(flyingEnemy) {
                        if(flyingEnemy.boss == 1) {
                            flyingEnemy.x = flyingEnemy.sx;
                            flyingEnemy.y = flyingEnemy.sy;
                            flyingEnemy.body.velocity.x = flyingEnemy.speed;
                            flyingEnemy.health = flyingEnemy.startingHealth;
                        }
                    }, this);
                    
                    this.killEnemy();
                    this.health-= 1;
                    if(this.health == 0) {
                        this.playerLives -= 1;
                        this.livesLabel.text = this.playerLives;
                        //this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                        if(this.playerLives == 0) {
                            this.game.state.start('Level', true, false, this.playerLives);
                        }
                        this.player.x = this.playerX;
                        this.player.y = this.playerY;
                        this.health = 1;
                        }
                    }
                }
        }, this);
        
        this.enemyBullets.forEach(function(ebullet) {
            if(this.game.physics.arcade.collide(ebullet, this.player)) {
                if(this.health > 1) {
                    ebullet.destroy();
                    this.health -= 1;
                } else {
                    this.speedBoost = 0;
                    this.enemies.forEach(function(enemy) {
                        if(enemy.boss == 1) {
                            enemy.x = enemy.sx;
                            enemy.y = enemy.sy;
                            enemy.body.velocity.x = enemy.speed;
                            enemy.health = enemy.startingHealth;
                        }
                    }, this);
                    
                    this.flyingEnemies.forEach(function(flyingEnemy) {
                        if(flyingEnemy.boss == 1) {
                            flyingEnemy.x = flyingEnemy.sx;
                            flyingEnemy.y = flyingEnemy.sy;
                            flyingEnemy.body.velocity.x = flyingEnemy.speed;
                            flyingEnemy.health = flyingEnemy.startingHealth;
                        }
                    }, this);
                    
                    ebullet.destroy();
                    this.health-= 1;
                    if(this.health == 0) {
                        this.playerLives -= 1;
                        this.livesLabel.text = this.playerLives;
                        //this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                        if(this.playerLives == 0) {
                            this.game.state.start('Level', true, false, this.playerLives);
                        }
                        this.player.x = this.playerX;
                        this.player.y = this.playerY;
                        this.health = 1;
                        }
                    }
                }
        }, this);
        
        this.flyingEnemyBullets.forEach(function(febullet) {
            if(this.game.physics.arcade.collide(febullet, this.player)) {
                if(this.health > 1) {
                    febullet.destroy();
                    this.health -= 1;
                } else {
                    this.speedBoost = 0;
                    this.enemies.forEach(function(enemy) {
                        if(enemy.boss == 1) {
                            enemy.x = enemy.sx;
                            enemy.y = enemy.sy;
                            enemy.body.velocity.x = enemy.speed;
                            enemy.health = enemy.startingHealth;
                        }
                    }, this);
                    
                    this.flyingEnemies.forEach(function(flyingEnemy) {
                        if(flyingEnemy.boss == 1) {
                            flyingEnemy.x = flyingEnemy.sx;
                            flyingEnemy.y = flyingEnemy.sy;
                            flyingEnemy.body.velocity.x = flyingEnemy.speed;
                            flyingEnemy.health = flyingEnemy.startingHealth;
                        }
                    }, this);
                    
                   febullet.destroy();
                    this.health-= 1;
                    if(this.health == 0) {
                        this.playerLives -= 1;
                        this.livesLabel.text = this.playerLives;
                        //this.game.state.start('Game', true, false, this.currentLevel, this.playerLives);
                        if(this.playerLives == 0) {
                            this.game.state.start('Level', true, false, this.playerLives);
                        }
                        this.player.x = this.playerX;
                        this.player.y = this.playerY;
                        this.health = 1;
                        }
                    }
                }
        }, this);
    },
    loadLevel: function() {
        this.currentEnemyIndex = 0;
        this.currentFlyingEnemyIndex = 0;
        this.currentShieldPowerUpIndex = 0;
        this.currentSpeedBoostIndex = 0;
        
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
        
        // Create Sheild Power Up Group
        this.shieldPowerUps = this.add.group();
        this.shieldPowerUps.enableBody = true;
        this.shieldPowerUps.setAll('body.immovable', true);
        this.shieldPowerUps.setAll('body.allowGravity', true);
        //Schedule SHeild Power Up
        this.scheduleShieldPowerUp();
        
        // Create SpeedBost Group
        this.speedBoosts = this.add.group();
        this.speedBoosts.enableBody = true;
        this.speedBoosts.setAll('body.immovable', true);
        this.speedBoosts.setAll('body.allowGravity', true);
        //Schedule SHeild Power Up
        this.scheduleSpeedBoost();
        
    },
    
    // REGULAR ENEMIES
    createEnemy:function(x, y, health, key, scale, range, speed, shoot, time, boss){
        var enemy = this.enemies.getFirstExists(false);
        
        if(!enemy) {
            enemy = new DropShoot.Enemy(this.game, x, y, key, health, this.enemyBullets);
            enemy.anchor.setTo(0.5);
            enemy.sx = enemy.x;
            this.enemies.add(enemy);
        }
        // Reset the enemy.
        enemy.reset(x, y, health, key, scale, range, speed, shoot, time, boss);
    },
    scheduleNextEnemy: function() {
        var nextEnemy = this.levelData.enemyData[this.currentEnemyIndex];
        this.nextEnemy = nextEnemy;
        
        if(nextEnemy) {
            var nextTime = 1000 * (nextEnemy.time - (this.currentEnemyIndex == 0 ? 0 : this.levelData.enemyData[this.currentEnemyIndex - 1].time));
        }   
        
        this.nextEnemyTimer = this.game.time.events.add(nextTime, function() {
            // Run through each of the enemyData elements inside the Json File
            this.createEnemy(nextEnemy.x, nextEnemy.y, nextEnemy.health, nextEnemy.key, nextEnemy.scale, nextEnemy.range, nextEnemy.speed, nextEnemy.shoot, nextEnemy.time, nextEnemy.boss);
            this.currentEnemyIndex++;
            this.scheduleNextEnemy();
        }, this);
    },
    killEnemy: function() {
        this.enemies.forEach(function(enemy) {
            if(this.game.physics.arcade.overlap(enemy, this.bullet)) {
                this.shakeWorld = 15;
                enemy.health+= -10;
                if(enemy.health == 0) {
        
                    var enemyExplosion = this.game.add.emitter(enemy.x, enemy.y, 100);
                    enemyExplosion.makeParticles('enemyParticle');
                    enemyExplosion.minParticleSpeed.setTo(-100, -100);
                    enemyExplosion.maxParticleSpeed.setTo(100, 100);
                    enemyExplosion.gravity = 300;
                    enemyExplosion.start(true, 3000, null, 100);
                    
                    enemy.enemyTimer.pause();
                    enemy.destroy();
                    
                }
                this.bullet.destroy();
            }
            if(this.game.physics.arcade.overlap(enemy, this.player) && enemy.boss == 0) {
                this.shakeWorld = 15;
                enemy.health = 0;
                if(enemy.health == 0) {
        
                    var enemyExplosion = this.game.add.emitter(enemy.x, enemy.y, 100);
                    enemyExplosion.makeParticles('enemyParticle');
                    enemyExplosion.minParticleSpeed.setTo(-100, -100);
                    enemyExplosion.maxParticleSpeed.setTo(100, 100);
                    enemyExplosion.gravity = 300;
                    enemyExplosion.start(true, 3000, null, 100);
                    
                    enemy.enemyTimer.pause();
                    enemy.destroy();
                    
                }
            }
        }, this);
    },
    
    // FLYING ENEMIES
    createFlyingEnemy:function(x, y, health, key, scale, range, speedX, speedY, shoot, time, boss){
        var flyingEnemy = this.flyingEnemies.getFirstExists(false);
        
        if(!flyingEnemy) {
            flyingEnemy = new DropShoot.FlyingEnemy(this.game, x, y, key, health, this.flyingEnemyBullets);
            flyingEnemy.anchor.setTo(0.5);
            this.flyingEnemies.add(flyingEnemy);
        }
        // Reset the enemy.
        flyingEnemy.reset(x, y, health, key, scale, range, speedX, speedY, shoot, time, boss);
    },
    scheduleNextFlyingEnemy: function() {
        var nextFlyingEnemy = this.levelData.flyingEnemyData[this.currentFlyingEnemyIndex];
        this.nextFlyingEnemy = nextFlyingEnemy;
        
        if(nextFlyingEnemy) {
            var nextFlyingTime = 1000 * (nextFlyingEnemy.time - (this.currentFlyingEnemyIndex == 0 ? 0 : this.levelData.flyingEnemyData[this.currentFlyingEnemyIndex - 1].time));
        }
        
        this.nextFlyingEnemyTimer = this.game.time.events.add(nextFlyingTime, function() {
            // Run through each of the enemyData elements inside the Json File
            this.createFlyingEnemy(nextFlyingEnemy.x, nextFlyingEnemy.y, nextFlyingEnemy.health, nextFlyingEnemy.key, nextFlyingEnemy.scale, nextFlyingEnemy.range, nextFlyingEnemy.speedX, nextFlyingEnemy.speedY, nextFlyingEnemy.shoot, nextFlyingEnemy.time, nextFlyingEnemy.boss);
            this.currentFlyingEnemyIndex++;
            this.scheduleNextFlyingEnemy();
        }, this);
    },
    
    killFlyingEnemy: function() {
        this.flyingEnemies.forEach(function(flyingEnemy) {
            if(this.game.physics.arcade.overlap(flyingEnemy, this.bullet)) {
                this.shakeWorld = 15;
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
            
            if(this.game.physics.arcade.overlap(flyingEnemy, this.player) && flyingEnemy.boss == 0) {
                this.shakeWorld = 15;
                flyingEnemy.health = 0;
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
            }
        }, this);
    },
    
    // SHIELD POWER UP
    createShieldPowerUp:function(x, y, health, key, scale, range, speedX, speedY, time){
        var shieldPowerUp = this.shieldPowerUps.getFirstExists(false);
        
        if(!shieldPowerUp) {
            shieldPowerUp = new DropShoot.ShieldPowerUp(this.game, x, y, key, health);
            shieldPowerUp.anchor.setTo(0.5);
            this.shieldPowerUps.add(shieldPowerUp);
        }
        // Reset the enemy.
        shieldPowerUp.reset(x, y, health, key, scale, range, speedX, speedY, time);
    },
    scheduleShieldPowerUp: function() {
        var nextShieldPowerUp = this.levelData.shieldPowerUpData[this.currentShieldPowerUpIndex];
        this.nextShieldPowerUp = nextShieldPowerUp;
        
        if(nextShieldPowerUp) {
            var nextShieldTime = 1000 * (nextShieldPowerUp.time - (this.currentShieldPowerUpIndex == 0 ? 0 : this.levelData.shieldPowerUpData[this.currentShieldPowerUpIndex - 1].time));
        }
        
        this.nextShieldPowerUpTimer = this.game.time.events.add(nextShieldTime, function() {
            // Run through each of the enemyData elements inside the Json File
            this.createShieldPowerUp(nextShieldPowerUp.x, nextShieldPowerUp.y, nextShieldPowerUp.health, nextShieldPowerUp.key, nextShieldPowerUp.scale, nextShieldPowerUp.range, nextShieldPowerUp.speedX, nextShieldPowerUp.speedY, nextShieldPowerUp.time);
            this.currentShieldPowerUpIndex++;
            this.scheduleShieldPowerUp();
        }, this);
    },
    
    // SPEED BOOST POWER UP
    createSpeedBoost:function(x, y, health, key, scale, range, speedX, speedY, time){
        var speedBoost = this.speedBoosts.getFirstExists(false);
        
        if(!speedBoost) {
            speedBoost = new DropShoot.SpeedBoost(this.game, x, y, key, health);
            speedBoost.anchor.setTo(0.5);
            this.speedBoosts.add(speedBoost);
        }
        // Reset the enemy.
        speedBoost.reset(x, y, health, key, scale, range, speedX, speedY, time);
    },
    scheduleSpeedBoost: function() {
        var nextSpeedBoost = this.levelData.speedBoostData[this.currentSpeedBoostIndex];
        this.nextSpeedBoost = nextSpeedBoost;
        
        if(nextSpeedBoost) {
            var nextSpeedTime = 1000 * (nextSpeedBoost.time - (this.currentSpeedBoostIndex == 0 ? 0 : this.levelData.speedBoostData[this.currentSpeedBoostIndex - 1].time));
        }
        
        this.nextSpeedBoostTimer = this.game.time.events.add(nextSpeedTime, function() {
            // Run through each of the enemyData elements inside the Json File
            this.createSpeedBoost(nextSpeedBoost.x, nextSpeedBoost.y, nextSpeedBoost.health, nextSpeedBoost.key, nextSpeedBoost.scale, nextSpeedBoost.range, nextSpeedBoost.speedX, nextSpeedBoost.speedY, nextSpeedBoost.time);
            this.currentSpeedBoostIndex++;
            this.scheduleSpeedBoost();
        }, this);
    }
};
