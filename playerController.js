//playerController.js
// contains player component object with associated variables and methods
export function component(src, alt, width, height, color, x, y, isOutlined, scale, myGameArea, shadowVisible, shadow) {
    this.image = new Image();
    src == "" ? this.image.src = "" : this.image.src = "Images/player/" + src;
    this.alt = alt;
    this.width = width;
    this.height = height;
    this.stepSize = scale;
    this.x = x;
    this.y = y;
    this.isOutlined = isOutlined;
    this.lastDirectionChar = "";
    this.shadowVisible = shadowVisible;

    this.update = function() {
        var ctx = myGameArea.context;
        if (this.isOutlined) { 
            ctx.strokeRect(this.x, this.y, this.width, this.height);
        }  
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }
    this.setImage = function(newSrc) {
        this.image.src = "Images/player/" + newSrc;
    };
    this.newPos = function (directionChar) { // direction chars: u, d, l, r
        switch (directionChar){
            case 'u':
                if (this.y - this.stepSize >= 0){
                    this.y -= this.stepSize;
                }
                this.lastDirectionChar = directionChar;
                this.setImage(this.alt + directionChar.toUpperCase() + ".png");
                var shadowPoint = this.getShadowPoint();
                if (shadowPoint.length != 0){
                    this.shadowVisible = true;
                    shadow.x = shadowPoint[0];
                    shadow.y = shadowPoint[1];
                } else {
                    this.shadowVisible = false;
                }
                break;
            case 'd':
                if (this.y + this.stepSize < myGameArea.canvas.height){
                    this.y += this.stepSize;
                }
                this.lastDirectionChar = directionChar;
                this.setImage(this.alt + directionChar.toUpperCase() + ".png");
                var shadowPoint = this.getShadowPoint();
                if (shadowPoint.length != 0){
                    this.shadowVisible = true;
                    shadow.x = shadowPoint[0];
                    shadow.y = shadowPoint[1];
                } else {
                    this.shadowVisible = false;
                }
                break;
            case 'l':
                if (this.x - this.stepSize >= 0){
                    this.x -= this.stepSize;
                }
                this.lastDirectionChar = directionChar;
                this.setImage(this.alt + directionChar.toUpperCase() + ".png");
                var shadowPoint = this.getShadowPoint();
                if (shadowPoint.length != 0){
                    shadowVisible = true;
                    shadow.x = shadowPoint[0];
                    shadow.y = shadowPoint[1];
                } else {
                    shadowVisible = false;
                }
                break;
            case 'r':
                if (this.x + this.stepSize < myGameArea.canvas.width){
                    this.x += this.stepSize;
                }
                this.lastDirectionChar = directionChar;
                this.setImage(this.alt + directionChar.toUpperCase() + ".png");
                var shadowPoint = this.getShadowPoint();
                if (shadowPoint.length != 0){
                    shadowVisible = true;
                    shadow.x = shadowPoint[0];
                    shadow.y = shadowPoint[1];
                } else {
                    shadowVisible = false;
                }
                break;
        }
    }
    this.getShadowPoint = function () {
       switch (this.lastDirectionChar){
            case 'u': // place it above the character
                if (this.y - this.height >= 0){
                    return [this.x, this.y - this.height];
                } 
                else { return []; }
                break;
            case 'd': // place it below the character
                if (this.y + this.height < myGameArea.canvas.height){
                    return [this.x, this.y + this.height];
                }
                else { return []; }
                break;
            case 'l':
                if (this.x - this.width >= 0){
                    return [this.x - this.width, this.y];
                }
                else { return []; }
                break;
            case 'r':
                if (this.x + this.width < myGameArea.canvas.width){
                    return [this.x + this.width, this.y];
                }
                else { return []; }
                break;
        }
    } 
}


