//This array is used to convert the horizontal letter cells to numerical values for calculating positions
var horizPosToNums = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];


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

function moveShipHorizontal(targetID, shipLength)//Triggers using onmousedown event
{
    var clickedShip = document.getElementById(targetID);
    var shipParent = clickedShip.parentElement;

    clickedShip.style.display = "none";

    //Create a ship copy which will be used to update the actual ship position
    var copyOfClickedShip = clickedShip.cloneNode( true ); 
    copyOfClickedShip.setAttribute( 'id', targetID);
    copyOfClickedShip.setAttribute( 'class', "shipBlock threeShip" );
    copyOfClickedShip.style.display = "block";
    copyOfClickedShip.onmousedown = null;
    shipParent.appendChild(copyOfClickedShip);

    //Get current cell coordinates
    var xCellLetter = shipParent.className.substring(0,1);
    var xCellNum = horizPosToNums.indexOf(xCellLetter) + 1; //Convert the letter position to its number position

    var yCellNum = parseInt(shipParent.className.substring(1));

    var curCell = shipParent.cloneNode(true);
    curCell.setAttribute('id', 'cloneCell');//This keeps track of the cell the ship is in while being moved

    //Establish initial and current coordinate values
    var xMouseInitial = event.clientX; 
    var xMouseCurrent = xMouseInitial; 

    var yMouseInitial = event.clientY; 
    var yMouseCurrent = yMouseInitial; 
    console.log("x: " + xMouseCurrent + "\n Y: " + yMouseCurrent + "\nCurrent Cell: " + curCell.className + "\nXNUM: " + xCellNum + "\nYNUM: " + yCellNum);

    //Begin movement
    document.onmousemove = function()
    {
        xMouseCurrent = event.clientX;
        yMouseCurrent = event.clientY;
        console.log("x: " + xMouseCurrent + "\n Y: " + yMouseCurrent + "\nCurrent Cell: " + curCell.className + "\nXNUM: " + xCellNum + "\nYNUM: " + yCellNum + "\n cellRead: " + (horizPosToNums[xCellNum - 2] + yCellNum));
        
        //Track x-movement
        if(((xMouseCurrent - xMouseInitial) > 30) && xCellNum < 10-shipLength+1)//If moving right
        {
            xMouseInitial = xMouseCurrent;
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum] + yCellNum)[0];
            newCell.appendChild(copyOfClickedShip);
            xCellNum++;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }
        else if(((xMouseCurrent - xMouseInitial) < -30) && xCellNum > 1)//If moving left
        {
            xMouseInitial = xMouseCurrent;
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum - 2] + yCellNum)[0];
            newCell.appendChild(copyOfClickedShip);
            xCellNum--;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }

        //Track y-movement
        if((yMouseCurrent - yMouseInitial) > 30)
        {
            yMouseInitial = yMouseCurrent;
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum - 1] + (yCellNum+1))[0];
            newCell.appendChild(copyOfClickedShip);
            yCellNum++;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }
        else if((yMouseCurrent - yMouseInitial) < -30)
        {
            yMouseInitial = yMouseCurrent;
            console.log(document.getElementsByClassName(horizPosToNums[xCellNum - 1] + (yCellNum-1))[0]);
            console.log(horizPosToNums[xCellNum - 1] + (yCellNum-1));
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum - 1] + (yCellNum-1))[0];
            newCell.appendChild(copyOfClickedShip);
            yCellNum--;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }
    }
    
    document.onmouseup = function()
    {
        document.onmousemove = null;
        copyOfClickedShip.parentNode.removeChild(copyOfClickedShip);
        clickedShip.style.display = "block";
        if(curCell.className != shipParent.className)
        {
            curCell.appendChild(clickedShip);
            curCellLetter = curCell.className.substring(0, 1);
            curCellNum = parseInt(curCell.className.substring(1));
        }
        else
        {
            shipParent.appendChild(clickedShip);
        }
        
        //Set the ship positions within Model.ships
        var ship;
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var curShip = model.shipsPlayer[i];
            if(curShip.id == targetID)
            {
                ship = curShip;
                break;
            }
        }

        for(var i = 0; i < shipLength; i++)
        {
            ship.locations[i] = curCellLetter + curCellNum;
            curCellLetter = horizPosToNums[horizPosToNums.indexOf(curCellLetter)+1];
        }

        console.log(model.shipsPlayer);
    }
}

function moveShipVertical(targetID, shipLength)//Triggers using onmousedown event
{
    var clickedShip = document.getElementById(targetID);
    var shipParent = clickedShip.parentElement;

    clickedShip.style.display = "none";

    //Create a ship copy which will be used to update the actual ship position
    var copyOfClickedShip = clickedShip.cloneNode( true ); 
    copyOfClickedShip.setAttribute( 'id', targetID);
    copyOfClickedShip.setAttribute( 'class', "shipBlock threeShip" );
    copyOfClickedShip.style.display = "block";
    copyOfClickedShip.onmousedown = null;
    shipParent.appendChild(copyOfClickedShip);

    //Get current cell coordinates
    var xCellLetter = shipParent.className.substring(0,1);
    var xCellNum = horizPosToNums.indexOf(xCellLetter) + 1; //Convert the letter position to its number position

    var yCellNum = parseInt(shipParent.className.substring(1));

    var curCell = shipParent.cloneNode(true);
    curCell.setAttribute('id', 'cloneCell');//This keeps track of the cell the ship is in while being moved

    //Establish initial and current coordinate values
    var xMouseInitial = event.clientX; 
    var xMouseCurrent = xMouseInitial; 

    var yMouseInitial = event.clientY; 
    var yMouseCurrent = yMouseInitial; 
    console.log("x: " + xMouseCurrent + "\n Y: " + yMouseCurrent + "\nCurrent Cell: " + curCell.className + "\nXNUM: " + xCellNum + "\nYNUM: " + yCellNum);

    //Begin movement
    document.onmousemove = function()
    {
        xMouseCurrent = event.clientX;
        yMouseCurrent = event.clientY;
        console.log("x: " + xMouseCurrent + "\n Y: " + yMouseCurrent + "\nCurrent Cell: " + curCell.className + "\nXNUM: " + xCellNum + "\nYNUM: " + yCellNum + "\n cellRead: " + (horizPosToNums[xCellNum - 2] + yCellNum));
        
        //Track x-movement
        if((xMouseCurrent - xMouseInitial) > 30)//If moving right
        {
            xMouseInitial = xMouseCurrent;
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum] + yCellNum)[0];
            newCell.appendChild(copyOfClickedShip);
            xCellNum++;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }
        else if((xMouseCurrent - xMouseInitial) < -30)//If moving left
        {
            xMouseInitial = xMouseCurrent;
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum - 2] + yCellNum)[0];
            newCell.appendChild(copyOfClickedShip);
            xCellNum--;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }

        //Track y-movement
        if((yMouseCurrent - yMouseInitial) > 30 && yCellNum < 10-shipLength+1)
        {
            yMouseInitial = yMouseCurrent;
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum - 1] + (yCellNum+1))[0];
            newCell.appendChild(copyOfClickedShip);
            yCellNum++;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }
        else if((yMouseCurrent - yMouseInitial) < -30 && yCellNum > 1)
        {
            yMouseInitial = yMouseCurrent;
            console.log(document.getElementsByClassName(horizPosToNums[xCellNum - 1] + (yCellNum-1))[0]);
            console.log(horizPosToNums[xCellNum - 1] + (yCellNum-1));
            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum - 1] + (yCellNum-1))[0];
            newCell.appendChild(copyOfClickedShip);
            yCellNum--;
            curCell = document.getElementsByClassName(horizPosToNums[xCellNum-1] + yCellNum)[0]; //Keep track of the current cell
        }
    }
    
    document.onmouseup = function()
    {
        document.onmousemove = null;
        copyOfClickedShip.parentNode.removeChild(copyOfClickedShip);
        clickedShip.style.display = "block";
        if(curCell.className != shipParent.className)
        {
            curCell.appendChild(clickedShip);
            curCellLetter = curCell.className.substring(0, 1);
            curCellNum = parseInt(curCell.className.substring(1));
        }
        else
        {
            shipParent.appendChild(clickedShip);
        }

        //Set the ship positions within Model.ships
        var ship;
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            var curShip = model.shipsPlayer[i];
            if(curShip.id == targetID)
            {
                ship = curShip;
                break;
            }
        }

        for(var i = 0; i < shipLength; i++)
        {
            ship.locations[i] = curCellLetter + curCellNum;
            curCellNum++;
        }

        console.log(model.shipsPlayer);
    }
}



