// Game Object
var DropShoot = DropShoot || {};

DropShoot.LevelState = {
    init: function(playerLives, currentLevel) {
        this.thumbRows = 1;
        this.thumbCols = 3;
        this.thumbWidth = 64;
        this.thumbHeight = 64;
        this.thumbSpacing = 8;
        this.levelThumbsGroup = this.add.group();
        
        
        
        this.playerLives = playerLives ? playerLives : 0;
        
        
        var levelThumbsGroup;
        
        if(!localStorage['starsArray']){
            this.starsArray = [0,4,4];
            localStorage['starsArray'] = JSON.stringify(this.starsArray);
        }
        this.starsArray = JSON.parse(localStorage['starsArray']);
        
        this.pages = this.starsArray.length/(this.thumbRows*this.thumbCols);
        
        this.currentPage = 0;
        
        this.levelLength = this.thumbWidth*this.thumbRows+this.thumbSpacing*(this.thumbCols - 1);
        this.levelHeight = this.thumbWidth*this.thumbRows+this.thumbSpacing*(this.thumbCols - 1);
        
    },
    create: function() {
        this.leftArrow = this.game.add.button(50, 420, 'level_arrows', this.arrowClicked).anchor.setTo(0.5);
        this.leftArrow.frame = 0;
        this.leftArrow.alpha = 0.3;
        this.rightArrow = this.game.add.button(270, 420, 'level_arrows', this.arrowClicked).anchor.setTo(0.5);
        this.rightArrow.frame = 1;
        
        for(var l = 0; l < this.pages; l++) {
            this.offsetX = (this.game.width - this.levelLength)/3 - this.game.width * l;
            this.offsetY = (this.game.height - this.levelHeight)/2 + this.game.width * l;
            
            for(var i = 0; i < this.thumbRows; i++) {
                for(var j = 0; j < this.thumbCols; j++) {
                    
                    
                    this.levelNumber = i * this.thumbCols + j + l * (this.thumbRows*this.thumbCols);
                    var levelThumb = this.game.add.button(this.offsetX + j * (this.thumbWidth + this.thumbSpacing), this.offsetY + i * ( this.thumbHeight + this.thumbSpacing), 'levels', this.thumbClicked, this);
                    this.changeThumb(levelThumb);
                    levelThumb.frame = this.starsArray[this.levelNumber];
                    levelThumb.levelNumber = this.levelNumber+1;
                    this.levelThumbsGroup.add(levelThumb);
                    
                    if(this.starsArray[this.levelNumber] < 4) {
                        var style = {font: "18px Arial", fill: '#fff'};
                        
                        this.levelText  = this.game.add.text(levelThumb.x+5, levelThumb.y + 5, this.levelNumber + 1, style);
                        this.levelText.setShadow(2,2, 'rbga(0,0,0,0.5)', 1);
                        this.levelThumbsGroup.add(this.levelText);
                    }
                }
            }
        }
    },
    thumbClicked: function(button) {
        if(button.frame < 4) {
            this.currentLevel = button.levelNumber;
            this.state.start('Game', true, false, this.currentLevel);
        } else {
            var buttonTween = this.game.add.tween(button);
            buttonTween.to({
                    x: button.x + this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                    x: button.x-this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                    x: button.x+this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                    x: button.x-this.thumbWidth/15
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.to({
                    x: button.x
            }, 20, Phaser.Easing.Cubic.None);
            buttonTween.start(); 
     }
    },
    changeThumb: function() {        
     if(this.currentLevel) {
            if(this.playerLives >= 1) {
                // Changes the previous thumbnail to be  eqaul to the PlayerLives
                // If the previous current level frame is less than the player lives just scored
                if(this.starsArray[this.currentLevel-1] < this.playerLives) {
                    // set the frame equal to the players lives.
                    this.starsArray[this.currentLevel-1] = this.playerLives;
                }
                // Sets the next current level frame to 0 if it is at 4(locked screen)
                if(this.starsArray[this.currentLevel] > 3) {
                    this.starsArray[this.currentLevel] = 0;
                }
                // Remove the previous locally stored starsArray
                localStorage.removeItem(this.starsArray);
                // Add new array to the local storage.
                localStorage['starsArray'] = JSON.stringify(this.starsArray);
            }
        }
    }
};