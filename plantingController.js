//plantController.js
// contains plant component object with associated variables and methods
// contains planting actions used by the player
import {myGameArea, updateGameArea} from "./mainPage.js";
export function plant (src, width, height, alt, idChar) {
    this.image = new Image();
    this.image.src = "Images/plant/" + src;
    this.width = width;
    this.height = height;
    this.alt = alt;
    this.x = 0;
    this.y = 0;
    this.growCyclePhaseCount = 0;
    this.maxGrowPhases = 4;
    this.healthPct = 100;
    this.isWatered = false;
    this.isSeed = true;

    this.update = function(myGameArea) {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.setImage = function(newSrc) {
        this.image.src = "Images/plant/" + newSrc;
    };
    this.newPos = function (gamePiece) {
        var shadowPoint = gamePiece.getShadowPoint(); 
        if (gamePiece.shadowVisible && shadowPoint.length != 0){
            this.x = shadowPoint[0];
            this.y = shadowPoint[1];
            return true;
        } else {return false;}
    }
    this.placeSeed = function (gameGrid, gamePiece) {
        var newPosPossible = this.newPos(gamePiece);
        var cellIndex = cellAvailable(this.x, this.y, gameGrid);
        if ( newPosPossible && cellIndex != -1) { // check that the spot for the plant is available
            gameGrid[cellIndex][1] = this;
            this.grow(gameGrid);
        } else {
            alert("You can't plant something here.");
        }
    }
    this.water = function () {
        this.isWatered = true;
        console.log("plant watered");
    }
    this.grow = function (gameGrid) {
        if (this.isSeed) {
            this.setImage(this.alt + this.growCyclePhaseCount + ".png");
            updateGameArea();
            this.isSeed = false;
        } else if ((this.isWatered) && (this.growCyclePhaseCount > this.maxGrowPhases)){
            if (this.healthPct < 100){ this.healthPct += 25;}
            this.isWatered = false;
            updateGameArea();

        } else if ((!this.isWatered) && (this.growCyclePhaseCount > this.maxGrowPhases)){
            if (this.healthPct == 0){ this.die(); }
            this.healthPct -= 25;
            updateGameArea();

        } else if((this.isWatered) && (this.growCyclePhaseCount <= this.maxGrowPhases)){
            if (this.healthPct < 100){ this.healthPct += 25;}
            this.setImage(this.alt + this.growCyclePhaseCount + ".png");
            this.growCyclePhaseCount++;
            this.isWatered = false;
            updateGameArea();
        } else if (!this.isWatered && this.healthPct > 0){
            this.healthPct-=25;
            this.setImage(this.alt + this.growCyclePhaseCount + ".png");
            this.growCyclePhaseCount++;
            if (this.healthPct == 0){ this.die(); }
            updateGameArea();
        }
        else if (this.healthPct == 0){ this.die(); }
        console.log("plant grow phase: ", this.growCyclePhaseCount);
        
    }
    this.die = function () {
        var plantIndex = cellWithPlant(this.x, this.y, gameGrid);
        if (plantIndex != -1){
            gameGrid[plantIndex][1] = 0; // remove the plant from the game
            updateGameArea();
        }
    }
}

export function plantFlower(scale, gameGrid, gamePiece) {
    var flower = new plant("", scale, scale, "sunflower", "f");
    flower.placeSeed(gameGrid, gamePiece);
}

export function waterFlower(gamePiece, gameGrid) {
    //detect if a flower is in the player's "shadow" then
    var shadowPoint = gamePiece.getShadowPoint(); 
    var plantIndex = cellWithPlant(shadowPoint[0], shadowPoint[1], gameGrid);
    if (plantIndex != -1){
        gameGrid[plantIndex][1].water();
    }
}

export function digFlower(gamePiece, gameGrid) {
    //detect if a flower is in the player's "shadow" then
    var shadowPoint = gamePiece.getShadowPoint(); 
    var plantIndex = cellWithPlant(shadowPoint[0], shadowPoint[1], gameGrid);
    if (plantIndex != -1){
        gameGrid[plantIndex][1] = 0;
        updateGameArea();
    }
}

function wildPlantGenerator () {
    //calculate how many wild plants
    var plantNum = 5;

    for (var i = 0; i < plantNum; i++){
        var randCell = Math.floor(Math.random() * (gameGrid.length));
        var wildPlant = new plant("", scale, scale, "wildplant", "f");
        gameGrid[randCell][1] = wildPlant;
        gameGrid[randCell][1].grow(gameGrid);
        gameGrid[randCell][1].update();
    }

}

function cellAvailable (x, y, gameGrid) {
    var cellIndex = gameGrid.findIndex(cell => cell[0][0] === x && cell[0][1] === y);
    if ( cellIndex != -1 && gameGrid[cellIndex][1] == 0) { return cellIndex; }
    return -1;
}

function cellWithPlant (x, y, gameGrid) {
    var cellIndex = gameGrid.findIndex(cell => cell[0][0] === x && cell[0][1] === y);
    if ( cellIndex != -1 && gameGrid[cellIndex][1] != 0) { return cellIndex; }
    return -1;
}
