function obstacle(width, height, color, x, y) {
    this.width = width;
    this.height = height;
    this.stepSize = 5;
    this.x = x;
    this.y = y;    
    this.update = function() {
        ctx = myGameArea.context;
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
    }
}


