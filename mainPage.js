// mainPage.js
// Overall game controls for saving, updating the day, updating game area, etc 

import {component} from "./playerController.js";
import {plant, plantFlower, waterFlower, digFlower} from "./plantingController.js";
import {generateRandomFlowerShopLocation} from "./locationController.js";
import {InventoryItem} from "./class/InventoryItemClass.js";

var gamePiece;
var shadow;
var gameGrid = []; // 2d array containing entries such as [(x, y), plant] or [(x, y), 0]
var scale = 100;
var canvasSize = [1000, 500];
var shadowVisible = true;
var dayCount = 0;
var isDaytime = true;
var dayInterval = 60000;

var hotbar = []
    

fetch('config/config.json')
    .then(response => {
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        return response.json();
    })
    .then(config => {
        //console.log("Loaded config:", config);
        dayInterval = config.dayIntervalSec * 1000; // in miliseconds
    })
    .catch(error => {
        console.error("Error loading config.json:", error);
    });





function updateDay () {
    dayCount++;
    isDaytime = true;

    gameGrid.forEach((p) => {
        if (p[1] != 0) {
            try {
                p[1].grow(gameGrid)
            }
            catch {
                //p[1].interact(gameGrid)
            }
        }
    });

}

function startGame() {
    
    shadow = new component("", "", scale, scale, "black", 0, 0, true, scale, myGameArea, shadowVisible, null);
    gamePiece = new component("girlD.png", "girl", scale, scale, "black", 0, 0, false, scale, myGameArea, shadowVisible, shadow);

    // Let k listen for keydown
    document.addEventListener("keydown", function (event) {

        switch (true){
            case event.key == 'ArrowUp': moveup();
                break;
            case event.key == 'ArrowDown': movedown();
                break;
            case event.key == 'ArrowLeft': moveleft();
                break;
            case event.key == 'ArrowRight': moveright();
                break;
            case event.key == 'Q' ||  event.key == 'q': useItem(gamePiece, gameGrid);
                break;
            case  event.key in ['1', '2', '3', '4', '5']: activateItem(event.key, hotbar);
                break; 
        }
    });

    

    setupHotbar();


    myGameArea.start();
    gameGrid = generateSquareGrid(scale);
    generateRandomFlowerShopLocation (scale, gameGrid, myGameArea);
    //wildPlantGenerator();

    setInterval(() => {
        updateDay();
        document.getElementById("dayNightDisplay").innerHTML = "Day " + dayCount;
    }, dayInterval); 

    
}

window.addEventListener('load',startGame );

function setupHotbar() {
    let hotbarItems = [
        document.getElementById("item1"),
        document.getElementById("item2"),
        document.getElementById("item3"),
        document.getElementById("item4"),
        document.getElementById("item5")
    ];

    hotbarItems.forEach(item => {
        if (item.id == "item1"){
            // insert item image
            item.src = "./Images/plant/seeds/sunflowerSeedBag.png";
            item.style.width = "55px";
            item.style.height = "65px";
            item.style.transform = "scale(1.2)";
            item.style.left = "250px";
            item.style.backgroundColor = "white";

            var invItem = new InventoryItem("sunflowerSeedBag", 5, 0, 1);
            hotbar.push(invItem);
            //insert item qty1
            document.getElementById("qty1").innerHTML = invItem.itemQty;
        }
        else if (item.id == "item2"){
            // insert item image
            item.src = "./Images/tool/wateringCan.png";
            item.style.width = "55px";
            item.style.height = "65px";
            item.style.transform = "scale(1.2)";
            item.style.left = "350px";
            item.style.backgroundColor = "white";

            var invItem = new InventoryItem("wateringCan", 0, 1, 2);
            hotbar.push(invItem);
        }
        else if (item.id == "item3"){
            // insert item image
            item.src = "./Images/tool/shovel.png";
            item.style.width = "55px";
            item.style.height = "65px";
            item.style.transform = "scale(1.2)";
            item.style.left = "450px";
            item.style.backgroundColor = "white";

            var invItem = new InventoryItem("shovel", 0, 2, 3);
            hotbar.push(invItem);
        }
    });
    
    
    
}

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

// operation: when true, add items, when false, remove items
function manageQty (operation, activeItem) {
    if (!operation){
        activeItem[0].itemQty = activeItem[0].itemQty-1;
        if ( activeItem[0].itemQty <= 0){
            // clear item image and qty
            document.getElementById("item" + activeItem[0].itemIndex).style.visibility = "hidden";
            document.getElementById("qty" + activeItem[0].itemIndex).style.visibility = "hidden";
            hotbar[activeItem[0].itemIndex - 1].itemActive = false 

        } else {
            document.getElementById("qty" + activeItem[0].itemIndex).innerHTML = activeItem[0].itemQty
        }
    } else {
        activeItem[0].itemQty = activeItem[0].itemQty+1;
        if ( activeItem[0].itemQty == 1){
            // add item image and new qty
            document.getElementById("item" + activeItem[0].itemIndex).style.visibility = "visible";
            document.getElementById("qty" + activeItem[0].itemIndex).style.visibility = "visible";

        } else {
            document.getElementById("qty" + activeItem[0].itemIndex).innerHTML = activeItem[0].itemQty
        }
    }
        
}

    //each index corresponds to the type of item, functionality is listed
    function itemTypeFunctionality (type, scale, gameGrid, gamePiece) {
        switch (type){
            case 0:
                plantFlower(scale, gameGrid, gamePiece) 
                break;
            case 1: 
                waterFlower(gamePiece, gameGrid)
                break;
            case 2:
                digFlower(gamePiece, gameGrid) 
                break;
        }
    }

function useItem( gamePiece, gameGrid ){
    // find currently active item
    const activeItem = hotbar.filter(item => item.itemActive)

    if (activeItem.length == 0){ 
        alert("Please activate a tool using the hotbar keys.");
        return;
    }

    // use the active item by performing its function and lowering qty or item durability?
    if (parseInt(activeItem[0].itemType) == 0){
        manageQty(false, activeItem) //reduce item amoun1t
        if (activeItem[0].itemQty >= 0){ itemTypeFunctionality(parseInt(activeItem[0].itemType), scale, gameGrid, gamePiece)}

    } else {
        itemTypeFunctionality(parseInt(activeItem[0].itemType), scale, gameGrid, gamePiece)
    }

    
}

function activateItem(item, hotbar) {
    
    if (document.getElementById("item" + item).visibility == "hidden"){
        alert("no item found")
        return

    }
    //clear previously active item
    const activeItem = hotbar.filter(item => item.itemActive);
    if (activeItem.length != 0  && (activeItem[0].itemIndex != item.itemIndex)) {
        var j = activeItem[0].itemIndex - 1;
        hotbar[j].itemActive = false;
        //hide box around the item selected
        document.getElementById("item" + activeItem[0].itemIndex).style.border = hotbar[j].itemActive ? "1px solid black" : "0px" ;
    }
    // add new active item
    var i = item - 1;
    //set "active" or inUse Flag
    hotbar[i].itemActive = !(hotbar[i].itemActive);
    //show box around the item selected
    document.getElementById("item" + item).style.border = hotbar[i].itemActive ? "1px solid black" : "0px" ;
    
}

async function saveGameData () {
    const now = new Date();
    let gameData = {
        user: gamePiece,
        shadow: shadow,
        game_grid: gameGrid,
        game_area: myGameArea,
        day: {
                day_count: dayCount,
                day_interval: dayInterval,
            },
        save_datetime: now.toISOString(),
    };
        const a = document.createElement("a");
        const file = new Blob([JSON.stringify(gameData)], { type: 'application/json' });
        a.href = URL.createObjectURL(file);
        a.download = "save.json";
        a.click();
        console.log("saved");
    }

document.addEventListener("DOMContentLoaded", () => {
        const btn = document.getElementById("save-btn");

        btn.addEventListener("click", saveGameData);
    });

function loadGameData () {
    // use info from saved data to populate game
}