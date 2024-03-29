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
    shipsSunkOpponent: 0,
    shipsPlayer: [{id: 'oneShip_h', locations: [null], hit: [false]},
            {id: 'oneShip_v', locations: [null], hit: [false]},
            {id: 'twoShip_h', locations: [null, null], hit: [false, false]},
            {id: 'twoShip_v', locations: [null, null], hit: [false, false]},
            {id: 'threeShip_h', locations: [null, null, null], hit: [false, false, false]},
            {id: 'threeShip_v', locations: [null, null, null], hit: [false, false, false]}],

    shipsOpponent: [{id: 'o_oneShip_h', locations: [null], hit: [false]},
            {id: 'o_oneShip_v', locations: [null], hit: [false]},
            {id: 'o_twoShip_h', locations: [null, null], hit: [false, false]},
            {id: 'o_twoShip_v', locations: [null, null], hit: [false, false]},
            {id: 'o_threeShip_h', locations: [null, null, null], hit: [false, false, false]},
            {id: 'o_threeShip_v', locations: [null, null, null], hit: [false, false, false]}],
    
    opponentGuesses: [],

    opponentCoreGuess: null, //The CoreGuess is the random cell value chosen when the AI isn't already on a path
    opponentNextGuess: null, //Assists in keeping track of the AI's path

    fireAtPlayerRandom: function(){
        console.log("FIRING RANDOMLY");

        var cellPos;
        var cellLetter;
        var cellNumber;

        do{ //Keep trying random cells until it is a cell not already guessed
            var rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
            var rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number

            cellLetter = horizPosToNums[rand1];console.log(cellLetter);
            cellNumber = rand2;console.log(cellNumber);
            
            cellPos = cellLetter + cellNumber;
            console.log("Opponent randomly chose: " + cellPos);
        }while(this.opponentGuesses.indexOf(cellPos) >= 0)

        this.opponentGuesses.push(cellPos); //Add to list of already guessed cells
        
        var nextCellLetter = horizPosToNums[horizPosToNums.indexOf(cellLetter) - 1];
        var nextCellNumber = cellNumber;

        var currentShip;
        for(var i = 0; i < model.shipsPlayer.length; i++)
        {
            currentShip = model.shipsPlayer[i];

            if(currentShip.locations.indexOf(cellPos) >= 0) //If the players ship is hit
            {
                var hitIndex = currentShip.locations.indexOf(cellPos);
                view.showHit(cellPos, "player");
                currentShip.hit[hitIndex] = true;
                console.log(currentShip);

                //Set up the next opponent's turn
                this.opponentCoreGuess = cellPos;
                if(nextCellLetter != null && nextCellLetter != undefined) //If the current guess isn't on the left edge
                    this.opponentNextGuess = nextCellLetter + nextCellNumber; //Make the next guess to the left of the current
                else
                    this.opponentNextGuess = cellLetter + (cellNumber - 1);

                console.log("Opponent's next guess: " + this.opponentNextGuess);

                if(this.isSunk(currentShip))
                {
                    view.showShipSunk("player");
                    this.shipsSunkPlayer++;
                    document.getElementById(currentShip.id).className = "sunkShipBlock";
                    
                    //Restart the AI
                    this.opponentNextGuess = null;
                    this.opponentCoreGuess = null;

                    if(this.checkIfOpponentWon())
                    {
                        var endOfGamePrompt = document.getElementById("endOfGamePrompt");
                        endOfGamePrompt.getElementsByTagName("h2")[0].innerHTML = "OH NO, YOU LOST!";
                        endOfGamePrompt.style.top = "50%";
                    }
                }
                return;
            }
        }
        view.showMiss(cellPos, "player");
    },

    fireAtPlayerLeft: function(directionIteration){
        console.log("FIRING LEFT <" + directionIteration + ">");
        var coreGuessLetter = this.opponentCoreGuess.substring(0, 1);
        var coreGuessNumber = parseInt(this.opponentCoreGuess.substring(1));

        var currentGuessLetter;
        var currentGuessNumber;
        var currentGuess;

        var nextGuessLetter;
        var nextGuessNumber;

        if(directionIteration == 1) //If targeting one cell left of core
        {
            currentGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) - 1];
            currentGuessNumber = coreGuessNumber;
        }
        else if(directionIteration == 2) //If targeting two cells left of core
        {
            currentGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) - 2];
            currentGuessNumber = coreGuessNumber;
        }
        
        currentGuess = currentGuessLetter + currentGuessNumber;
        console.log("The opponent's current guess is: " + currentGuess);
        console.log(this.opponentGuesses.indexOf(currentGuess));

        if(horizPosToNums.indexOf(currentGuessLetter) > 0) //If the current guess is in the A - J bounds
        {
            if(this.opponentGuesses.indexOf(currentGuess) < 0 && !currentGuess.includes("undefined") && currentGuess.substring(1, 2) != "0") //If this guess hasn't been made before, continue with down fire execution
            {
                console.log("GUESS HAS NOT BEEN MADE BEFORE");
                this.opponentGuesses.push(currentGuess); //Add to list of already guessed cells

                var currentShip;
                for(var i = 0; i < model.shipsPlayer.length; i++)
                {
                    currentShip = model.shipsPlayer[i];

                    if(currentShip.locations.indexOf(currentGuess) >= 0) //If the players ship is hit
                    {
                        var hitIndex = currentShip.locations.indexOf(currentGuess);
                        view.showHit(currentGuess, "player");
                        currentShip.hit[hitIndex] = true;
                        console.log(currentShip);

                        //Set up the next opponent's turn
                        if(currentGuessLetter != null && currentGuessLetter != undefined) //If the current guess isn't on the left edge
                        {
                            //Make the next guess two cells to the left of the core
                            nextGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) - 2];
                                
                            nextGuessNumber = currentGuessNumber;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }
                        else //If the current guess is on the left edge
                        {
                            //Make the next guess one to the top of the core
                            nextGuessLetter = currentGuessLetter;
                            nextGuessNumber = coreGuessNumber - 1;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }

                        console.log("Opponent's next guess: " + this.opponentNextGuess);

                        if(this.isSunk(currentShip))
                        {
                            view.showShipSunk("player");
                            this.shipsSunkPlayer++;
                            document.getElementById(currentShip.id).className = "sunkShipBlock";
                            
                            //Restart the AI
                            this.opponentNextGuess = null;
                            this.opponentCoreGuess = null;

                            if(this.checkIfOpponentWon())
                            {
                                var endOfGamePrompt = document.getElementById("endOfGamePrompt");
                                endOfGamePrompt.getElementsByTagName("h2")[0].innerHTML = "OH NO, YOU LOST!";
                                endOfGamePrompt.style.top = "50%";
                            }
                        }
                        return;
                    }
                }
                view.showMiss(currentGuess, "player");
            }
            else //If the guess has been made before, then fire at the top of core
            {
                console.log("BROKE CRITERIA");
                this.fireAtPlayerUp(1);
            }
        }
        else //If the guess is NaN
        {
            console.log("IT WAS NaN");
            this.fireAtPlayerUp(1);
        }
    },

    fireAtPlayerUp: function(directionIteration){
        console.log("FIRING UP <" + directionIteration + ">");
        var coreGuessLetter = this.opponentCoreGuess.substring(0, 1);
        var coreGuessNumber = parseInt(this.opponentCoreGuess.substring(1));

        var currentGuessLetter;
        var currentGuessNumber;
        var currentGuess;

        var nextGuessLetter;
        var nextGuessNumber;

        if(directionIteration == 1) //If targeting one cell up of core
        {
            currentGuessLetter = coreGuessLetter;
            currentGuessNumber = coreGuessNumber - 1;
        }
        else if(directionIteration == 2) //If targeting two cells up of core
        {
            currentGuessLetter = coreGuessLetter;
            currentGuessNumber = coreGuessNumber - 2;
        }
        
        currentGuess = currentGuessLetter + currentGuessNumber;
        console.log("The opponent's current guess is: " + currentGuess);
        console.log(this.opponentGuesses.indexOf(currentGuess));

        if(horizPosToNums.indexOf(currentGuessLetter) > 0) //If the current guess is in the A - J bounds
        {
            if(this.opponentGuesses.indexOf(currentGuess) < 0 && !currentGuess.includes("undefined") && currentGuess.substring(1, 2) != "0") //If this guess hasn't been made before, continue with down fire execution
            {
                console.log("GUESS HAS NOT BEEN MADE BEFORE");
                this.opponentGuesses.push(currentGuess); //Add to list of already guessed cells

                var currentShip;
                for(var i = 0; i < model.shipsPlayer.length; i++)
                {
                    currentShip = model.shipsPlayer[i];

                    if(currentShip.locations.indexOf(currentGuess) >= 0) //If the players ship is hit
                    {
                        var hitIndex = currentShip.locations.indexOf(currentGuess);
                        view.showHit(currentGuess, "player");
                        currentShip.hit[hitIndex] = true;
                        console.log(currentShip);

                        //Set up the next opponent's turn
                        if(currentGuessNumber != null && currentGuessNumber != undefined) //If the current guess isn't on the top edge
                        {
                            //Make the next guess two cells to the top of the core
                            nextGuessLetter = coreGuessLetter;
                                
                            nextGuessNumber = coreGuessNumber - 2;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }
                        else //If the current guess is on the top edge
                        {
                            //Make the next guess one to the right of the core
                            nextGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) + 1];
                            nextGuessNumber = coreGuessNumber;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }

                        console.log("Opponent's next guess: " + this.opponentNextGuess);

                        if(this.isSunk(currentShip))
                        {
                            view.showShipSunk("player");
                            this.shipsSunkPlayer++;
                            document.getElementById(currentShip.id).className = "sunkShipBlock";
                            
                            //Restart the AI
                            this.opponentNextGuess = null;
                            this.opponentCoreGuess = null;

                            if(this.checkIfOpponentWon())
                            {
                                var endOfGamePrompt = document.getElementById("endOfGamePrompt");
                                endOfGamePrompt.getElementsByTagName("h2")[0].innerHTML = "OH NO, YOU LOST!";
                                endOfGamePrompt.style.top = "50%";
                            }
                        }
                        return;
                    }
                }
                view.showMiss(currentGuess, "player");
            }
            else //If the guess has been made before, then fire at the right of core
            {
                console.log("BROKE CRITERIA");
                this.fireAtPlayerRight(1);
            }
        }
        else //If the guess is NaN
        {
            console.log("IT WAS NaN");
            this.fireAtPlayerRight(1);
        }
    },

    fireAtPlayerRight: function(directionIteration){
        console.log("FIRING RIGHT <" + directionIteration + ">");
        var coreGuessLetter = this.opponentCoreGuess.substring(0, 1);
        var coreGuessNumber = parseInt(this.opponentCoreGuess.substring(1));

        var currentGuessLetter;
        var currentGuessNumber;
        var currentGuess;

        var nextGuessLetter;
        var nextGuessNumber;

        if(directionIteration == 1) //If targeting one cell right of core
        {
            currentGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) + 1];
            currentGuessNumber = coreGuessNumber;
        }
        else if(directionIteration == 2) //If targeting two cells right of core
        {
            currentGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) + 2];
            currentGuessNumber = coreGuessNumber;
        }
        
        currentGuess = currentGuessLetter + currentGuessNumber;
        console.log("The opponent's current guess is: " + currentGuess);
        console.log(this.opponentGuesses.indexOf(currentGuess));

        if(horizPosToNums.indexOf(currentGuessLetter) > 0) //If the current guess is in the A - J bounds
        {
            if(this.opponentGuesses.indexOf(currentGuess) < 0 && !currentGuess.includes("undefined") && currentGuess.substring(1, 2) != "0") //If this guess hasn't been made before, continue with down fire execution
            {
                console.log("GUESS HAS NOT BEEN MADE BEFORE");
                this.opponentGuesses.push(currentGuess); //Add to list of already guessed cells

                var currentShip;
                for(var i = 0; i < model.shipsPlayer.length; i++)
                {
                    currentShip = model.shipsPlayer[i];

                    if(currentShip.locations.indexOf(currentGuess) >= 0) //If the players ship is hit
                    {
                        var hitIndex = currentShip.locations.indexOf(currentGuess);
                        view.showHit(currentGuess, "player");
                        currentShip.hit[hitIndex] = true;
                        console.log(currentShip);

                        //Set up the next opponent's turn
                        if(currentGuessLetter != null && currentGuessLetter != undefined) //If the current guess isn't on the right edge
                        {
                            //Make the next guess two cells to the right of the core
                            nextGuessLetter = horizPosToNums[horizPosToNums.indexOf(coreGuessLetter) + 2];
                                
                            nextGuessNumber = currentGuessNumber;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }
                        else //If the current guess is on the right edge
                        {
                            //Make the next guess one to the bottom of the core
                            nextGuessLetter = currentGuessLetter;
                            nextGuessNumber = coreGuessNumber + 1;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }

                        console.log("Opponent's next guess: " + this.opponentNextGuess);

                        if(this.isSunk(currentShip))
                        {
                            view.showShipSunk("player");
                            this.shipsSunkPlayer++;
                            document.getElementById(currentShip.id).className = "sunkShipBlock";
                            
                            //Restart the AI
                            this.opponentNextGuess = null;
                            this.opponentCoreGuess = null;

                            if(this.checkIfOpponentWon())
                            {
                                var endOfGamePrompt = document.getElementById("endOfGamePrompt");
                                endOfGamePrompt.getElementsByTagName("h2")[0].innerHTML = "OH NO, YOU LOST!";
                                endOfGamePrompt.style.top = "50%";
                            }
                        }
                        return;
                    }
                }
                view.showMiss(currentGuess, "player");
            }
            else //If the guess has been made before, then fire at the bottom of core
            {
                console.log("BROKE CRITERIA");
                this.fireAtPlayerDown(1);
            }
        }
        else //If the guess is NaN
        {
            console.log("IT WAS NaN");
            this.fireAtPlayerDown(1);
        }
    },

    fireAtPlayerDown: function(directionIteration){
        console.log("FIRING DOWN <" + directionIteration + ">");
        var coreGuessLetter = this.opponentCoreGuess.substring(0, 1);
        var coreGuessNumber = parseInt(this.opponentCoreGuess.substring(1));

        var currentGuessLetter;
        var currentGuessNumber;
        var currentGuess;

        var nextGuessLetter;
        var nextGuessNumber;

        if(directionIteration == 1) //If targeting one cell down of core
        {
            currentGuessLetter = coreGuessLetter;
            currentGuessNumber = coreGuessNumber + 1;
        }
        else if(directionIteration == 2) //If targeting two cells down of core
        {
            currentGuessLetter = coreGuessLetter;
            currentGuessNumber = coreGuessNumber + 2;
        }
        
        currentGuess = currentGuessLetter + currentGuessNumber;
        console.log("The opponent's current guess is: " + currentGuess);
        console.log(this.opponentGuesses.indexOf(currentGuess));

        if(horizPosToNums.indexOf(currentGuessLetter) > 0) //If the current guess is in the A - J bounds
        {
            if(this.opponentGuesses.indexOf(currentGuess) < 0 && !currentGuess.includes("undefined") && currentGuess.substring(1, 2) != "0") //If this guess hasn't been made before, continue with down fire execution
            {
                console.log("GUESS HAS NOT BEEN MADE BEFORE");
                this.opponentGuesses.push(currentGuess); //Add to list of already guessed cells

                var currentShip;
                for(var i = 0; i < model.shipsPlayer.length; i++)
                {
                    currentShip = model.shipsPlayer[i];

                    if(currentShip.locations.indexOf(currentGuess) >= 0) //If the players ship is hit
                    {
                        var hitIndex = currentShip.locations.indexOf(currentGuess);
                        view.showHit(currentGuess, "player");
                        currentShip.hit[hitIndex] = true;
                        console.log(currentShip);

                        //Set up the next opponent's turn
                        if(currentGuessNumber != null && currentGuessNumber != undefined) //If the current guess isn't on the bottom edge
                        {
                            //Make the next guess two cells to the bottom of the core
                            nextGuessLetter = coreGuessLetter;
                                
                            nextGuessNumber = coreGuessNumber + 2;
                            this.opponentNextGuess = nextGuessLetter + nextGuessNumber; 
                        }
                        else //If the current guess is on the bottom edge
                        {
                            this.fireAtPlayerRandom(); 
                        }

                        console.log("Opponent's next guess: " + this.opponentNextGuess);

                        if(this.isSunk(currentShip))
                        {
                            view.showShipSunk("player");
                            this.shipsSunkPlayer++;
                            document.getElementById(currentShip.id).className = "sunkShipBlock";
                            
                            //Restart the AI
                            this.opponentNextGuess = null;
                            this.opponentCoreGuess = null;

                            if(this.checkIfOpponentWon())
                            {
                                var endOfGamePrompt = document.getElementById("endOfGamePrompt");
                                endOfGamePrompt.getElementsByTagName("h2")[0].innerHTML = "OH NO, YOU LOST!";
                                endOfGamePrompt.style.top = "50%";
                            }
                        }
                        return;
                    }
                }
                view.showMiss(currentGuess, "player");
            }
            else //If the guess has been made before, then fire at random
            {
                console.log("BROKE CRITERIA");
                this.fireAtPlayerRandom();
            }
        }
        else //If the guess is NaN
        {
            console.log("IT WAS NaN");
            this.fireAtPlayerRandom();
        }
    },

    fireAtPlayer: function(){
        /*The opponent fires randomly until it hits. This becomes the core cell. Once it hits, the following turn 
        the AI attempts to hit left, down, right, up of the core cell until it hits again*/

        if(this.opponentNextGuess == null && this.opponentCoreGuess == null) //If its the first turn or the opponent just sunk the player's ship
        {
            this.fireAtPlayerRandom();
        }
        else
        {
            var currentGuess = this.opponentNextGuess;
            var currentGuessLetter = currentGuess.substring(0, 1);
            var currentGuessNumber = currentGuess.substring(1);
            var indexOfCurrentGuessLetter = horizPosToNums.indexOf(currentGuessLetter);
            console.log("Index of current guess letter: " + indexOfCurrentGuessLetter);

            var coreGuessLetter = this.opponentCoreGuess.substring(0, 1);
            var coreGuessNumber = parseInt(this.opponentCoreGuess.substring(1));
            var indexOfCoreGuessLetter = horizPosToNums.indexOf(coreGuessLetter);
            console.log("Index of core guess letter: " + indexOfCoreGuessLetter);


            //AI Movement Logic
            if(indexOfCurrentGuessLetter == (indexOfCoreGuessLetter - 1)) //If its a first left guess
                this.fireAtPlayerLeft(1);
            else if(indexOfCurrentGuessLetter == (indexOfCoreGuessLetter - 2)) //If its a second left guess
                this.fireAtPlayerLeft(2);
            else if(currentGuessNumber == (coreGuessNumber - 1)) //If its a first top guess
                this.fireAtPlayerUp(1);
            else if(currentGuessNumber == (coreGuessNumber - 2)) //If its a second top guess
                this.fireAtPlayerUp(2);
            else if(indexOfCurrentGuessLetter == (indexOfCoreGuessLetter + 1)) //If its a first right guess
                this.fireAtPlayerRight(1);
            else if(indexOfCurrentGuessLetter == (indexOfCoreGuessLetter + 2)) //If its a second right guess
                this.fireAtPlayerRight(2);
            else if(currentGuessNumber == (coreGuessNumber + 1)) //If its a first bottom guess
                this.fireAtPlayerDown(1);
            else if(currentGuessNumber == (coreGuessNumber + 2)) //If its a second bottom guess
                this.fireAtPlayerDown(2);
            else
                this.fireAtPlayerRandom();
        }
    },

    fireAtOpponent: function(guess){
        console.log("The player guessed: " + guess);

        var actionMessage = document.getElementById("actionMessage");

        var currentShip;
        for(var i = 0; i < model.shipsOpponent.length; i++)
        {
            currentShip = model.shipsOpponent[i];

            var guessedCell =  document.getElementsByClassName(guess)[1];

            guessedCell.style.cursor = "default";
            guessedCell.setAttribute('onclick', null);
            
            if(currentShip.locations.indexOf(guess) >= 0) //If the player hits the opponent's ship
            {
                var hitIndex = currentShip.locations.indexOf(guess);
                view.showHit(guess, "opponent");
                currentShip.hit[hitIndex] = true;
                console.log(currentShip);
                
                if(this.isSunk(currentShip))
                {
                    view.showShipSunk("opponent");
                    this.shipsSunkOpponent++;
                    //document.getElementById(currentShip.id).className = "sunkShipBlock";

                    if(this.checkIfPlayerWon())
                    {
                        var endOfGamePrompt = document.getElementById("endOfGamePrompt");
                        endOfGamePrompt.getElementsByTagName("h2")[0].innerHTML = "CONGRATULATIONS, YOU WON!";
                        endOfGamePrompt.style.top = "50%";

                        var victoryBox = document.getElementById("victoryBox");
                        victoryBox.style.top = "100%";
                    }
                }
                return;
            }
        }
        view.showMiss(guess, "opponent");
    },

    isSunk: function(ship){
        for(var i = 0; i < ship.hit.length; i++)
        {
            if(!ship.hit[i])
            {
                console.log("Ship not sunk");
                return false;
            }
        }
        console.log("Ship sunk!");
        return true;
    },

    checkIfPlayerWon: function(){
        if(this.shipsSunkOpponent >= 6)
            return true;

        return false;
    },

    checkIfOpponentWon: function()
    {
        if(this.shipsSunkPlayer >= 6)
            return true;
            
        return false;
    }
}

var view = 
{
    showHit: function(cellLocation, playerOrOpponent){
        if(playerOrOpponent === "player")
            var cell = document.getElementById("playerTable").getElementsByClassName(cellLocation)[0];
        else if(playerOrOpponent === "opponent")
            var cell = document.getElementById("opponentTable").getElementsByClassName(cellLocation)[0];

        var actionMessage = document.getElementById("actionMessage");
        actionMessage.innerHTML = "HIT!";

        cell.style.background = "url(Images/hit.png) no-repeat center";
        cell.style.backgroundSize = "cover";
    },
    showMiss: function(cellLocation, playerOrOpponent){
        if(playerOrOpponent === "player")
            var cell = document.getElementById("playerTable").getElementsByClassName(cellLocation)[0];
        else if(playerOrOpponent === "opponent")
            var cell = document.getElementById("opponentTable").getElementsByClassName(cellLocation)[0]; 

        var actionMessage = document.getElementById("actionMessage");
        actionMessage.innerHTML = "MISS!";

        cell.style.background = "url(Images/miss.png) no-repeat center";
        cell.style.backgroundSize = "50%";
    },
    showShipSunk: function(playerOrOpponent){
        var actionMessage = document.getElementById("actionMessage");

        setTimeout(function()
        {
            if(playerOrOpponent === "opponent")
                actionMessage.innerHTML = "YOU SUNK A BATTLESHIP!";
            else if(playerOrOpponent === "player")
                actionMessage.innerHTML = "YOUR SHIP HAS BEEN SUNK!";
        }, 2000);
    }
}

var controller =
{
    guessAmount: 0,

    activatePlayerBoard: function(){
        var playerBoard = document.getElementById("playerTable");
        playerBoard.style.float = "left";

        var playerShips = playerBoard.getElementsByClassName("shipBlock");
        for(var i = 0; i < playerShips.length; i++)
        {
            playerShips[i].setAttribute('onmousedown', null);
            playerShips[i].style.cursor = "default";
        }

        var allCells = document.getElementById("opponentTable").getElementsByTagName("td");
        //alert(allCells[20].className);
        for(var j = 11; j < allCells.length; j++)
        {
            if(j % 11 != 0)
                allCells[j].setAttribute('onclick', 'controller.handleGuess("' + allCells[j].className + '")');
        }
    },

    activateOpponentBoard: function(){
        var opponentBoard = document.getElementById("opponentTable");
        opponentBoard.style.display = "block";
    },

    startGame: function(){
        this.activatePlayerBoard();
        this.activateOpponentBoard();
        randomizeOpponentShipLocations();

        var gameHolder = document.getElementById("gameHolder");
        var startControls = document.getElementById("startControls");
        var configInstructions = document.getElementById("configureInstructions");
        var turnArea = document.getElementById("turnArea");
        var gridTitles = document.getElementById("gridTitles");
        
        gridTitles.style.display = "block";
        gameHolder.style.height = "420px";
        gameHolder.style.position = "absolute";
        gameHolder.style.top = "50%";
        gameHolder.style.left = "50%";
        gameHolder.style.margin = "-210px 0 0 -500px";
        startControls.style.display = "none";
        configInstructions.style.display = "none";
        turnArea.style.display = "block";

        console.log("Player ships \n");
        console.log(model.shipsPlayer);
        console.log("Opponent ships \n");
        console.log(model.shipsOpponent);

        this.playerTurn();

        /*setTimeout(function()
        {
            document.getElementById("startNotification").style.display = "block";
            document.getElementById("startNotification").style.animation = "startNotificationAnimation 0.5s";
        }, 500);*/
    },

    handleGuess: function(guess){
        model.fireAtOpponent(guess);
        this.guessAmount++;

        if(!model.checkIfPlayerWon() && !model.checkIfOpponentWon())
            controller.opponentTurn();
    },

    playerTurn: function(){
        var opponentTableCover = document.getElementById("opponentTableCover");
        opponentTableCover.style.display = "block";
        opponentTableCover.style.left = "0";
        opponentTableCover.style.right = "auto";
        
            var turnText = document.getElementById("turnArea").getElementsByTagName("h2")[0];
            turnText.innerHTML = "Your turn!";
    
            var turnArrow = document.getElementById("turnArrow");
            turnArrow.style.transform = "rotatex(0deg)";
    
            var actionMessage = document.getElementById("actionMessage");
            actionMessage.innerHTML = "";
    },

    opponentTurn: function(){
        var opponentTableCover = document.getElementById("opponentTableCover");
        opponentTableCover.style.display = "block";
        opponentTableCover.style.left = "auto";
        opponentTableCover.style.right = "0";

        var turnText = document.getElementById("turnArea").getElementsByTagName("h2")[0];
        turnText.innerHTML = "Opponent's turn!";

        var turnArrow = document.getElementById("turnArrow");
        turnArrow.style.transform = "rotateZ(180deg)";

        var actionMessage = document.getElementById("actionMessage");

        setTimeout(function()
        {
            actionMessage.innerHTML = "";
            model.fireAtPlayer();

            if(!model.checkIfPlayerWon() && !model.checkIfOpponentWon())
                controller.playerTurn();
        }, 1250);
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

function randomizePlayerShipLocations()
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
    var rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
    var rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number

    var cellLetter = horizPosToNums[rand1];console.log(cellLetter);
    var cellNumber = rand2;console.log(cellNumber);
    var cellPos = cellLetter + cellNumber;
    //console.log(cellPos);

    var cell = document.getElementsByClassName(cellPos)[0];

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
    cell.appendChild(threeShipHorizontal);
    threeShipHorizontal.setAttribute("onmousedown", 'moveShipHorizontal("threeShip_h", 3)');


    //Two Ship Horizontal
    do
    {
        rand1 = Math.ceil((Math.random() * 9)); //Selects the horizontal letter
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
    }while(shipsCollide(shipToIterate, "player"));
    
    //console.log(shipToIterate);
    cell.appendChild(twoShipHorizontal);
    twoShipHorizontal.setAttribute("onmousedown", 'moveShipHorizontal("twoShip_h", 2)');

    //One Ship Horizontal
    do
    {
        rand1 = Math.ceil((Math.random() * 10)); //Selects the horizontal letter
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
    }while(shipsCollide(shipToIterate, "player"));
    
    //console.log(shipToIterate);
    cell.appendChild(oneShipHorizontal);
    oneShipHorizontal.setAttribute("onmousedown", 'moveShipHorizontal("oneShip_h", 1)');


    //Three Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
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
    }while(shipsCollide(shipToIterate, "player"));
    
    //console.log(shipToIterate);
    cell.appendChild(threeShipVertical);
    threeShipVertical.setAttribute("onmousedown", 'moveShipVertical("threeShip_v", 3)');


    //Two Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
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
    }while(shipsCollide(shipToIterate, "player"));
    
    //console.log(shipToIterate);
    cell.appendChild(twoShipVertical);
    twoShipVertical.setAttribute("onmousedown", 'moveShipVertical("twoShip_v", 2)');


    //One Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
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
        for(var i = 0; i < 1; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellNumber++;
        }
    }while(shipsCollide(shipToIterate, "player"));
    
    //console.log(shipToIterate);
    cell.appendChild(oneShipVertical);
    oneShipVertical.setAttribute("onmousedown", 'moveShipVertical("oneShip_v", 1)');
}



function randomizeOpponentShipLocations()
{
    var setLocations = []; //This will hold all set ship positions from model.ships

    //All code below deals with assigning ship locations
    //Three Ship Horizontal (REPEAT THE FOLLOWING FOR THE REST OF THE SHIPS)
    var rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
    var rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number

    var cellLetter = horizPosToNums[rand1];console.log(cellLetter);
    var cellNumber = rand2;console.log(cellNumber);
    var cellPos = cellLetter + cellNumber;
    //console.log(cellPos);

    var cell = document.getElementsByClassName(cellPos)[1];

    var shipToIterate;
    for(var i = 0; i < model.shipsOpponent.length; i++)
    {
        var currentShip = model.shipsOpponent[i];
        if(currentShip.id == "o_threeShip_h")
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

    //Two Ship Horizontal
    do
    {
        rand1 = Math.ceil((Math.random() * 9)); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[1];
    
        for(var i = 0; i < model.shipsOpponent.length; i++)
        {
            var currentShip = model.shipsOpponent[i];
            if(currentShip.id == "o_twoShip_h")
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
    }while(shipsCollide(shipToIterate, "opponent"));
    
    //console.log(shipToIterate);

    //One Ship Horizontal
    do
    {
        rand1 = Math.ceil((Math.random() * 10)); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() * 10); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[1];
    
        for(var i = 0; i < model.shipsOpponent.length; i++)
        {
            var currentShip = model.shipsOpponent[i];
            if(currentShip.id == "o_oneShip_h")
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
    }while(shipsCollide(shipToIterate, "opponent"));
    
    //console.log(shipToIterate);


    //Three Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() *7); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[1];
    
        for(var i = 0; i < model.shipsOpponent.length; i++)
        {
            var currentShip = model.shipsOpponent[i];
            if(currentShip.id == "o_threeShip_v")
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
    }while(shipsCollide(shipToIterate, "opponent"));
    
    //console.log(shipToIterate);


    //Two Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() *8); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[1];
    
        for(var i = 0; i < model.shipsOpponent.length; i++)
        {
            var currentShip = model.shipsOpponent[i];
            if(currentShip.id == "o_twoShip_v")
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
    }while(shipsCollide(shipToIterate, "opponent"));
    
    //console.log(shipToIterate);


    //One Ship Vertical
    do
    {
        rand1 = Math.ceil((Math.random() * 8)); //Selects the horizontal letter
        rand2 = Math.ceil(Math.random() *9); //Selects the vertical number
    
        cellLetter = horizPosToNums[rand1];console.log(cellLetter);
        cellNumber = rand2;console.log(cellNumber);
        cellPos = cellLetter + cellNumber;
        //console.log(cellPos);
    
        cell = document.getElementsByClassName(cellPos)[1];
    
        for(var i = 0; i < model.shipsOpponent.length; i++)
        {
            var currentShip = model.shipsOpponent[i];
            if(currentShip.id == "o_oneShip_v")
            {
                shipToIterate = currentShip;
                break;
            }
        }
        for(var i = 0; i < 1; i++)
        {
            shipToIterate.locations[i] = cellLetter + cellNumber;
            cellNumber++;
        }
    }while(shipsCollide(shipToIterate, "opponent"));
    
    //console.log(shipToIterate);
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

        if(shipsCollide(shipToIterate, "player"))
        {
            console.log("You cannot place ships on the same cell."); //CHANGE THIS TO APPEAR IN A DIV THE USER CAN SEE
            clickedShip.parentElement.removeChild(clickedShip);
            initialShipParent.appendChild(clickedShip);
            shipToIterate.locations = initialCoords;
            console.log("PLACED BACK COORDS: " + shipToIterate.locations);
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

        newShipPos = clickedShip.parentElement.className; console.log("sadas" + newShipPos);
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

        if(shipsCollide(shipToIterate, "player"))
        {
            console.log("You cannot place ships on the same cell."); //CHANGE THIS TO APPEAR IN A DIV THE USER CAN SEE
            clickedShip.parentElement.removeChild(clickedShip);
            initialShipParent.appendChild(clickedShip);
            shipToIterate.locations = initialCoords;
            console.log("PLACED BACK COORDS: " + shipToIterate.locations);
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

function shipsCollide(shipToTest, playerOrOpponent)
{
    var modelShips = [];
    if(playerOrOpponent == "player")
        modelShips = model.shipsPlayer;
    else if(playerOrOpponent == "opponent")
        modelShips = model.shipsOpponent;

    console.log(playerOrOpponent);
    console.log(shipToTest);
    console.log(modelShips);

    var shipToIterate;
    for(var i = 0; i < modelShips.length; i++)
    {
        shipToIterate = modelShips[i];
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