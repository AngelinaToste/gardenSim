// mainPage.js
// Overall game controls for saving, updating the day, updating game area, etc 


//import {plant, plantFlower, waterFlower, digFlower, wildPlantGenerator} from "plantingController.js";
import {component} from "./playerController.js";
import {plant, plantFlower, waterFlower, digFlower} from "./plantingController.js";
var gamePiece;
var shadow;
var gameGrid = []; // 2d array containing entries such as [(x, y), plant] or [(x, y), 0]
var scale = 100;
var canvasSize = [1000, 500];
var shadowVisible = true;
var dayCount = 0;
var isDaytime = true;
var dayInterval = 5000; // in miliseconds


function updateDay () {
    dayCount++;
    isDaytime = true;

    gameGrid.forEach((p) => {
        if (p[1] != 0) { p[1].grow(gameGrid);}
    });

}

function startGame() {
    
    shadow = new component("", "", scale, scale, "black", 0, 0, true, scale, myGameArea, shadowVisible, null);
    gamePiece = new component("girlD.png", "girl", scale, scale, "black", 0, 0, false, scale, myGameArea, shadowVisible, shadow);

    // Let k listen for keydown
    document.addEventListener("keydown", function (event) {
        if (event.key === 'W' || event.key === 'w' || event.key === 'ArrowUp') {
            console.log('up');
            moveup();
        }
        else if (event.key === 'S' || event.key === 's' || event.key === 'ArrowDown') {
            console.log('down');
            movedown();
        }
        else if (event.key === 'A' || event.key === 'a' || event.key === 'ArrowLeft') {
            console.log('left');
            moveleft();
        }
        else if (event.key === 'D' || event.key === 'd' || event.key === 'ArrowRight') {
            console.log('right');
            moveright();
        }
        else if (event.key === 'Q' || event.key === 'q') {
            plantFlower(scale, gameGrid, gamePiece);
        }
        else if (event.key === 'E' || event.key === 'e') {
            waterFlower(gamePiece, gameGrid);
        }
        else if (event.key === 'R' || event.key === 'r') {
            digFlower(gamePiece, gameGrid);
        }
    });

    myGameArea.start();
    gameGrid = generateSquareGrid(scale);
    //wildPlantGenerator();

    setInterval(() => {
        updateDay();
        document.getElementById("dayNightDisplay").innerHTML = "Day " + dayCount;
    }, dayInterval); 
    
}

window.addEventListener('load',startGame );

function generateSquareGrid(cellSideLength) {
    var grid = [];
    if (((myGameArea.canvas.width % cellSideLength) != 0) && ((myGameArea.canvas.height % cellSideLength) != 0)){
        console.log("Error: Could not generate a square grid.");
        return [];  // square grid cannot fit evenly in the given area
    }

    // only store top left corner points
    // use side lengths to determine full area when points are accessed later.
    for (var i = 0; i < myGameArea.canvas.width; i += cellSideLength){
        var point;
        var xval, yval;
        xval = i;
        for (var j = 0; j < myGameArea.canvas.height; j += cellSideLength) {
            yval = j;
            point = [xval, yval];
            grid.push([point, 0]); //using 0 as a placeholder to mean no items are attached to this point.
        }
    }
    return grid;
}

export var myGameArea = {
    canvas : document.createElement("canvas"),
    start : function() {
        this.context = this.canvas.getContext("2d");
        this.canvas.width = canvasSize[0];
        this.canvas.height = canvasSize[1];
        document.body.insertBefore(this.canvas, document.body.childNodes[0]);
        this.interval = setInterval(updateGameArea, 20);
    },
    clear : function() {
        this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
}

export function updateGameArea() {
    myGameArea.clear();
    gameGrid.forEach((p) => {
        if (p[1] != 0) { p[1].update(myGameArea);}
    });
    gamePiece.newPos();    
    gamePiece.update();
    if (shadowVisible) { shadow.update(); }
    
}

function moveup() {
    gamePiece.newPos('u'); 
}

function movedown() {
    gamePiece.newPos('d'); 
}

function moveleft() {
    gamePiece.newPos('l'); 
}

function moveright() {
    gamePiece.newPos('r'); 
}


