//locationController.js

function location(src, width, height, alt) {
    this.image = new Image();
    this.image.src = "/Images/location/" + src;
    this.width = width;
    this.height = height;
    this.alt = alt;
    this.x = 0;
    this.y = 0;   
    this.update = function(myGameArea) {
        var ctx = myGameArea.context;
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.setNewLocation = function (x, y) {
        this.x = x;
        this.y = y;
    }
}

export function generateRandomFlowerShopLocation (scale, gameGrid, myGameArea) {
    var randCell = Math.floor(Math.random() * (gameGrid.length));
    var flowerShop = new location("flowerShop.png", scale, scale, "flowerShop");
    var newCoordinates = gameGrid[randCell][0];
    flowerShop.setNewLocation(newCoordinates[0], newCoordinates[1] );
    gameGrid[randCell][1] = flowerShop;
    gameGrid[randCell][1].update(myGameArea);
}