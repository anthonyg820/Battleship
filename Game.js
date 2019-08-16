//This array is used to convert the horizontal letter cells to numerical values for calculating positions
var horizPosToNums = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];

function moveShip(targetID)
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
}

