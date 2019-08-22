//This array is used to convert the horizontal letter cells to numerical values for calculating positions
var horizPosToNums = ["", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];


/*
    Implementing MVC
    Model - 
    View - Informs the user of information (hit/miss)
    Controller - 
*/
var model =
{
    gridSize: 10,
    numOfShips: 6,
    shipsSunkPlayer: 0,
    shipsPlayer: [{id: 'oneShip_h', locations: [null], hit: [false]},
            {id: 'oneShip_v', locations: [null], hit: [false]},
            {id: 'twoShip_h', locations: [null, null], hit: [false, false]},
            {id: 'twoShip_v', locations: [null, null], hit: [false, false]},
            {id: 'threeShip_h', locations: [null, null, null], hit: [false, false, false]},
            {id: 'threeShip_v', locations: [null, null, null], hit: [false, false, false]}],

    shipsOpponent: [{id: 'oneShip_h', locations: [null], hit: [false]},
            {id: 'oneShip_v', locations: [null], hit: [false]},
            {id: 'twoShip_h', locations: [null, null], hit: [false, false]},
            {id: 'twoShip_v', locations: [null, null], hit: [false, false]},
            {id: 'threeShip_h', locations: [null, null, null], hit: [false, false, false]},
            {id: 'threeShip_v', locations: [null, null, null], hit: [false, false, false]}],
    
    fire: function(guess){
        for(var i = 0; i < this.shipsPlayer.length; i++)
        {
            var curShip = ships[i];
            var hitIndex = curShip.locations.indexOf(guess);
            if(hitIndex > 0)
            {
                curShip.hit[hitIndex] = true;
                view.showHit(guess);
            }
            else
            {
                view.showMiss(guess);
            }
        }
    },

    isSunk: function(ship){
        for(var i = 0; i < ship.length; i++)
        {
            if(!ship.hits[i])
                return false;
        }
        return true;
    }
}

var view = 
{
    showHit: function(cellNumber){
        var cell = document.getElementById("playerTable").getElementsByClassName(cellNumber)[0];
        cell.style.background = "#";
    },
    showMiss: function(cellNumber){
        var cell = document.getElementById("playerTable").getElementsByClassName(cellNumber)[0];
        cell.style.background = "#";
    },
    showShipSunk: function(){
        
    }
}

var controller =
{
    guessAmount: 0,

    activatePlayerBoard: function(){

    },

    activateOpponentBoard: function(){

    },

    startGame: function(){
        this.activatePlayerBoard();
        this.activateOpponentBoard();
    },

    handleGuess: function(guess){
        model.fire(guess);
        this.guessAmount++;
    }
}


//Primary Functions
function clearGrid()
{
    var threeShipHorizontal = document.getElementById("threeShip_h");
    var threeShipVertical = document.getElementById("threeShip_v");
    var twoShipHorizontal = document.getElementById("twoShip_h");
    var twoShipVertical = document.getElementById("twoShip_v");
    var oneShipHorizontal = document.getElementById("oneShip_h");
    var oneShipVertical = document.getElementById("oneShip_v");

    if(threeShipHorizontal != null)
        threeShipHorizontal.parentElement.removeChild(threeShipHorizontal);

    if(threeShipVertical != null)
        threeShipVertical.parentElement.removeChild(threeShipVertical);

    if(twoShipHorizontal != null)
        twoShipHorizontal.parentElement.removeChild(twoShipHorizontal);

    if(twoShipVertical != null)
        twoShipVertical.parentElement.removeChild(twoShipVertical);

    if(oneShipHorizontal != null)
        oneShipHorizontal.parentElement.removeChild(oneShipHorizontal);

    if(oneShipVertical != null)
        oneShipVertical.parentElement.removeChild(oneShipVertical);
}

function randomizeShipLocations()
{
    clearGrid();

    var setLocations = []; //This will hold all set ship positions from model.ships

    //Create all six ship elements
    var threeShipHorizontal = document.createElement("DIV");
    threeShipHorizontal.setAttribute('id', 'threeShip_h');
    threeShipHorizontal.setAttribute('class', 'shipBlock');

    var twoShipHorizontal = document.createElement("DIV");
    twoShipHorizontal.setAttribute('id', 'twoShip_h');
    twoShipHorizontal.setAttribute('class', 'shipBlock');

    var oneShipHorizontal = document.createElement("DIV");
    oneShipHorizontal.setAttribute('id', 'oneShip_h');
    oneShipHorizontal.setAttribute('class', 'shipBlock');

    var threeShipVertical = document.createElement("DIV");
    threeShipVertical.setAttribute('id', 'threeShip_v');
    threeShipVertical.setAttribute('class', 'shipBlock');

    var twoShipVertical = document.createElement("DIV");
    twoShipVertical.setAttribute('id', 'twoShip_v');
    twoShipVertical.setAttribute('class', 'shipBlock');

    var oneShipVertical = document.createElement("DIV");
    oneShipVertical.setAttribute('id', 'oneShip_v');
    oneShipVertical.setAttribute('class', 'shipBlock');

    //All code below deals with assigning ship locations
    //Three Ship Horizontal (REPEAT THE FOLLOWING FOR THE REST OF THE SHIPS)
    var rand1 = Math.ceil((Math.random() * 7) + 1); //Selects the horizontal letter
    var rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number

    var cellLetter = horizPosToNums[rand1];console.log(cellLetter);
    var cellNumber = rand2;console.log(cellNumber);
    var cellPos = cellLetter + cellNumber;
    //console.log(cellPos);

    var cell = document.getElementsByClassName(cellPos)[0];

    cell.appendChild(threeShipHorizontal);
    var shipToIterate;
    for(var i = 0; i < model.shipsPlayer.length; i++)
    {
        var currentShip = model.shipsPlayer[i];
        if(currentShip.id == "threeShip_h")
        {
            shipToIterate = currentShip;
            break;
        }
    }
    for(var i = 0; i < 3; i++)
    {
        shipToIterate.locations[i] = cellLetter + cellNumber;
        setLocations.push(shipToIterate.locations[i]);
        cellLetter = horizPosToNums[horizPosToNums.indexOf(cellLetter)+1];
    }
    console.log("SET: " + setLocations);
    //console.log(shipToIterate);
    threeShipHorizontal.setAttribute("onmousedown", 'moveShipHorizontal("threeShip_h", 3)');


    //Two Ship Horizontal
    do
    {
        rand1 = Math.ceil((Math.random() * 8) + 1); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[0];
    
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == "twoShip_h")
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < 2; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellLetter = horizPosToNums[horizPosToNums.indexOf(cellLetter)+1];
        }
    }while(shipsCollide(shipToIterate));
    
    //console.log(shipToIterate);
    cell.appendChild(twoShipHorizontal);
    twoShipHorizontal.setAttribute("onmousedown", 'moveShipHorizontal("twoShip_h", 2)');

    //One Ship Horizontal
    do
    {
        rand1 = Math.ceil((Math.random() * 9) + 1); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[0];
    
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == "oneShip_h")
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < 1; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellLetter = horizPosToNums[horizPosToNums.indexOf(cellLetter)+1];
        }
    }while(shipsCollide(shipToIterate));
    
    //console.log(shipToIterate);
    cell.appendChild(oneShipHorizontal);
    oneShipHorizontal.setAttribute("onmousedown", 'moveShipHorizontal("oneShip_h", 1)');


    //Three Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 7) + 1); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() *7); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[0];
    
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == "threeShip_v")
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < 3; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellNumber++;
        }
    }while(shipsCollide(shipToIterate));
    
    //console.log(shipToIterate);
    cell.appendChild(threeShipVertical);
    threeShipVertical.setAttribute("onmousedown", 'moveShipVertical("threeShip_v", 3)');


    //Two Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 7) + 1); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() *8); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[0];
    
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == "twoShip_v")
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < 2; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellNumber++;
        }
    }while(shipsCollide(shipToIterate));
    
    //console.log(shipToIterate);
    cell.appendChild(twoShipVertical);
    twoShipVertical.setAttribute("onmousedown", 'moveShipVertical("twoShip_v", 2)');


    //One Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 7) + 1); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() *9); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[0];
    
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == "oneShip_v")
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < 2; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellNumber++;
        }
    }while(shipsCollide(shipToIterate));
    
    //console.log(shipToIterate);
    cell.appendChild(oneShipVertical);
    oneShipVertical.setAttribute("onmousedown", 'moveShipVertical("oneShip_v", 1)');
}

function moveShipHorizontal(targetID, shipLength)//Triggers using onmousedown event
{
    var clickedShip = document.getElementById(targetID);
    clickedShip.setAttribute('class', 'shipBlockMoving');
    var initialShipParent = clickedShip.parentElement;

    var initialCoords = getShipCoords(initialShipParent, "Horizontal", shipLength);
    console.log(initialCoords);

    //Establish initial and current coordinate values
    var xMouseInitial = event.clientX; 
    var xMouseCurrent = xMouseInitial; 

    var yMouseInitial = event.clientY; 
    var yMouseCurrent = yMouseInitial; 

    console.log("Cell: " + initialCoords[0] + "\nX: " + xMouseCurrent + "\nY: " + yMouseCurrent);

    var currentPrimaryCoord = initialCoords[0];
    //Get current cell coordinates
    var xCellLetter = currentPrimaryCoord.substring(0,1);
    var xCellNum = horizPosToNums.indexOf(xCellLetter); //Convert the letter position to its number position

    var yCellNum = parseInt(initialShipParent.className.substring(1));

    //Begin movement
    document.onmousemove = function()
    {
        xMouseCurrent = event.clientX;
        yMouseCurrent = event.clientY;

        console.log("Cell: " + currentPrimaryCoord + "\nX: " + xMouseCurrent + "\nY: " + yMouseCurrent);

        //Track x-movement
        if(((xMouseCurrent - xMouseInitial) > 30) && xCellNum < 10-shipLength+1)//If mouse is moving right
        {
            xMouseInitial = xMouseCurrent;
            moveRight(clickedShip, shipLength);
            xCellNum++;
        }   
        else if(((xMouseCurrent - xMouseInitial) < -30) && xCellNum > 1)//If mouse is moving left
        {
            xMouseInitial = xMouseCurrent;
            moveLeft(clickedShip, shipLength);
            xCellNum--;
        }  
        
        //Track y-movement
        if((yMouseCurrent - yMouseInitial) > 30 && yCellNum < 10)//If mouse is moving down
        {
            yMouseInitial = yMouseCurrent;
            moveDown(clickedShip, shipLength);
            yCellNum++;
        }
        else if((yMouseCurrent - yMouseInitial) < -30 && yCellNum > 1)//If mouse is moving up
        {
            yMouseInitial = yMouseCurrent;
            moveUp(clickedShip, shipLength);
            yCellNum--;
        }
    }

    //End Movement
    document.onmouseup = function()
    {
        document.onmousemove = null;
        clickedShip.setAttribute('class', 'shipBlock');

        newShipPos = clickedShip.parentElement.className;
        xCellLetter = newShipPos.substring(0, 1);
        xCellNum = horizPosToNums.indexOf(xCellLetter); //Convert the letter position to its number position
        yCellNum = parseInt(newShipPos.substring(1));
        
        var shipToIterate;
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == targetID)
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < shipToIterate.locations.length; i++)
        {
            shipToIterate.locations[i] = xCellLetter + yCellNum;
            xCellLetter = horizPosToNums[horizPosToNums.indexOf(xCellLetter) + 1];
        }
        console.log("ONMOUSEUP: " + shipToIterate.locations);

        if(shipsCollide(shipToIterate))
        {
            console.log("You cannot place ships on the same cell."); //CHANGE THIS TO APPEAR IN A DIV THE USER CAN SEE
            clickedShip.parentElement.removeChild(clickedShip);
            initialShipParent.appendChild(clickedShip);
            shipToIterate.locations = initialCoords;
            console.log("PLACED BACK COORDS: " + shipToIterate.locations);
        }
        else
        {
            setShipCoords(targetID, shipLength);
        }
    }
}

function moveShipVertical(targetID, shipLength)//Triggers using onmousedown event
{
    var clickedShip = document.getElementById(targetID);
    clickedShip.setAttribute('class', 'shipBlockMoving');
    var initialShipParent = clickedShip.parentElement;

    var initialCoords = getShipCoords(initialShipParent, "Vertical", shipLength);
    console.log(initialCoords);

    //Establish initial and current coordinate values
    var xMouseInitial = event.clientX; 
    var xMouseCurrent = xMouseInitial; 

    var yMouseInitial = event.clientY; 
    var yMouseCurrent = yMouseInitial; 

    console.log("Cell: " + initialCoords[0] + "\nX: " + xMouseCurrent + "\nY: " + yMouseCurrent);

    var currentPrimaryCoord = initialCoords[0];
    //Get current cell coordinates
    var xCellLetter = currentPrimaryCoord.substring(0,1);
    var xCellNum = horizPosToNums.indexOf(xCellLetter); //Convert the letter position to its number position

    var yCellNum = parseInt(initialShipParent.className.substring(1));

    //Begin movement
    document.onmousemove = function()
    {
        xMouseCurrent = event.clientX;
        yMouseCurrent = event.clientY;

        console.log("Cell: " + currentPrimaryCoord + "\nX: " + xMouseCurrent + "\nY: " + yMouseCurrent);

        //Track x-movement
        if(((xMouseCurrent - xMouseInitial) > 30) && xCellNum < 10)//If mouse is moving right
        {
            xMouseInitial = xMouseCurrent;
            moveRight(clickedShip, shipLength);
            xCellNum++;
        }   
        else if(((xMouseCurrent - xMouseInitial) < -30) && xCellNum > 1)//If mouse is moving left
        {
            xMouseInitial = xMouseCurrent;
            moveLeft(clickedShip, shipLength);
            xCellNum--;
        }  
        
        //Track y-movement
        if((yMouseCurrent - yMouseInitial) > 30 && yCellNum < 10-shipLength+1)//If mouse is moving down
        {
            yMouseInitial = yMouseCurrent;
            moveDown(clickedShip, shipLength);
            yCellNum++;
        }
        else if((yMouseCurrent - yMouseInitial) < -30 && yCellNum > 1)//If mouse is moving up
        {
            yMouseInitial = yMouseCurrent;
            moveUp(clickedShip, shipLength);
            yCellNum--;
        }
    }

    //End Movement
    document.onmouseup = function()
    {
        document.onmousemove = null;
        clickedShip.setAttribute('class', 'shipBlock');

        newShipPos = clickedShip.parentElement.className;
        xCellLetter = newShipPos.substring(0, 1);
        xCellNum = horizPosToNums.indexOf(xCellLetter); //Convert the letter position to its number position
        yCellNum = parseInt(newShipPos.substring(1));
        
        var shipToIterate;
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var currentShip = model.shipsPlayer[i];
            if(currentShip.id == targetID)
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < shipToIterate.locations.length; i++)
        {
            shipToIterate.locations[i] = xCellLetter + yCellNum;
            yCellNum++;
        }
        console.log("ONMOUSEUP: " + shipToIterate.locations);

        if(shipsCollide(shipToIterate))
        {
            console.log("You cannot place ships on the same cell."); //CHANGE THIS TO APPEAR IN A DIV THE USER CAN SEE
            clickedShip.parentElement.removeChild(clickedShip);
            initialShipParent.appendChild(clickedShip);
            shipToIterate.locations = initialCoords;
            console.log("PLACED BACK COORDS: " + shipToIterate.locations);
        }
        else
        {
            setShipCoords(targetID, shipLength);
        }
    }
}



//Helper Functions
function getShipCoords(shipParent, posOrientation, shipLength) //posOrientation value must be "vertical" or "horizontal"
{
    var initialCoords = [];
    initialCell = shipParent.className; //Returns the letter+number combo EG 'A2'

    initialCellLetter = initialCell.substring(0, 1);
    initialCellNumber = parseInt(initialCell.substring(1));

    initialCoords[0] = initialCell;

    if(posOrientation === "Horizontal")
    {
        for(var i = 1; i < shipLength; i++)
        {
            initialCoords[i] = horizPosToNums[horizPosToNums.indexOf(initialCellLetter) + i] + initialCellNumber;
        }
    }
    else if(posOrientation === "Vertical")
    {
        for(var i = 1; i < shipLength; i++)
        {
            initialCoords[i] = initialCellLetter + (initialCellNumber+1);
            initialCellNumber++;
        }
    }

    return initialCoords;
}

function setShipCoords(targetID, shipLength)//Sets the ship positions within Model.ships
{
    var currentShip = document.getElementById(targetID);
    var currentCell = currentShip.parentElement.className;

    currentCellLetter = currentCell.substring(0, 1);
    currentCellNumber = parseInt(currentCell.substring(1));

    var shipToIterate;
    for(var i = 0; i < model.shipsPlayer.length; i++)
    {
        var currentShip = model.shipsPlayer[i];
        if(currentShip.id == targetID)
        {
            shipToIterate = currentShip;
            break;
        }
    }

    for(var i = 0; i < shipLength; i++)
    {
        shipToIterate.locations[i] = currentCellLetter + currentCellNumber;
        currentCellLetter = horizPosToNums[horizPosToNums.indexOf(currentCellLetter)+1];
    }
    console.log(shipToIterate);
}

function moveRight(ship, shipLength)
{
    var currentShipParent = ship.parentElement;

    var currentPrimaryCell = currentShipParent.className;
    var currentCellLetter = currentPrimaryCell.substring(0, 1);
    var currentCellNumber = currentPrimaryCell.substring(1);

    var newCellLetter = horizPosToNums[horizPosToNums.indexOf(currentCellLetter) + 1];
    var newCell = newCellLetter + currentCellNumber;
    var newShipParent = document.getElementsByClassName(newCell)[0];
    
    currentShipParent.removeChild(ship);
    newShipParent.append(ship);
}

function moveLeft(ship, shipLength)
{
    var currentShipParent = ship.parentElement;

    var currentPrimaryCell = currentShipParent.className;
    var currentCellLetter = currentPrimaryCell.substring(0, 1);
    var currentCellNumber = currentPrimaryCell.substring(1);

    var newCellLetter = horizPosToNums[horizPosToNums.indexOf(currentCellLetter) - 1];
    var newCell = newCellLetter + currentCellNumber;
    var newShipParent = document.getElementsByClassName(newCell)[0];
    
    currentShipParent.removeChild(ship);
    newShipParent.append(ship);
}

function moveDown(ship, shipLength)
{
    var currentShipParent = ship.parentElement;

    var currentPrimaryCell = currentShipParent.className;
    var currentCellLetter = currentPrimaryCell.substring(0, 1);
    var currentCellNumber = parseInt(currentPrimaryCell.substring(1));

    var newCellNumber = currentCellNumber+1;
    var newCell = currentCellLetter + newCellNumber;
    var newShipParent = document.getElementsByClassName(newCell)[0];
    
    currentShipParent.removeChild(ship);
    newShipParent.append(ship);
}

function moveUp(ship, shipLength)
{
    var currentShipParent = ship.parentElement;

    var currentPrimaryCell = currentShipParent.className;
    var currentCellLetter = currentPrimaryCell.substring(0, 1);
    var currentCellNumber = parseInt(currentPrimaryCell.substring(1));

    var newCellNumber = currentCellNumber-1;
    var newCell = currentCellLetter + newCellNumber;
    var newShipParent = document.getElementsByClassName(newCell)[0];
    
    currentShipParent.removeChild(ship);
    newShipParent.append(ship);
}

function shipsCollide(shipToTest)
{
    var shipToIterate;
    for(var i = 0; i < model.shipsPlayer.length; i++)
    {
        shipToIterate = model.shipsPlayer[i];
        console.log(shipToIterate);
        if(shipToIterate.id != shipToTest.id)
        {
            console.log("INSIDE");
            for(var j = 0; j < shipToTest.locations.length; j++)
            {
                console.log("TEST: " + shipToTest.locations[j]);
                console.log("YERR: " + shipToIterate.locations.indexOf(shipToTest.locations[j]));
                if(shipToIterate.locations.indexOf(shipToTest.locations[j]) >= 0)
                {
                    return true;
                }
            }
        }
    }

    return false;
}