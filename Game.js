//This array is used to convert the horizontal letter cells to numerical values for calculating positions
var horizPosToNums = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

/*function moveShip(targetID)
{
    var clickedShip = document.getElementById(targetID);
    var currentX = 0;
    var shipParent = clickedShip.parentElement;
    //alert(shipParent.className);
    var xCellLetter = shipParent.className.substring(0,1);
    //alert(xCellLetter);

    var xCellNum = horizPosToNums.indexOf(xCellLetter) + 1;
    //alert(xCellNum);
    
    var yCellNum = shipParent.className.substring(1);

    var xMouseInitial = event.clientX; 
    var xMouse = xMouseInitial; 
    console.log(xMouse);

    var curCell = document.getElementsByClassName(xCellLetter + yCellNum)[0];

    document.onmousemove = function()
    {
        xMouse = event.clientX;
        console.log(xMouse);

        if((xMouse - xMouseInitial) > 30)
        {
            curCell.removeChild(curCell.childNodes[0]);

            var newCell = document.getElementsByClassName(horizPosToNums[xCellNum] + yCellNum)[0];
            newCell.appendChild(clickedShip);
            return;
        }
    }

    //alert("The ID clicked is: " + targetID + ".\n The current x-pos is: " + currentX);
}*/

function moveShip(targetID)//Triggers using onmousedown event
{
    var clickedShip = document.getElementById(targetID);
    var shipParent = clickedShip.parentElement;

    clickedShip.style.display = "none";

    //Create a ship copy which will be used to update the actual ship position
    var copyOfClickedShip = clickedShip.cloneNode( true ); 
    copyOfClickedShip.setAttribute( 'id', "cloneShip" );
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
        if(((xMouseCurrent - xMouseInitial) > 30) && xCellNum < 8)//If moving right
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
        curCell.appendChild(clickedShip);
        document.getEl
        clickedShip.style.display = "block";
    }
}

function stopMoveShip() //Triggers using onmouseup event
{
    document.onmousemove = null;
}

