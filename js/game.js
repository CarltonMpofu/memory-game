let selectedTheme = 'numbers';
let selectedPlayers = 1;
let selectedGridSize = 4;

let myGrid;

let otherID = null;
let promiseRunning = false; 
let totalFound = 0;

let currentTurn = 1;
let playerOneScore = 0;
let playerTwoScore = 0;
let playerThreeScore = 0;
let playerFourScore = 0;

let totalSeconds = 0;
let timerInterval = null;

let playerOneMoves = 0;

let storedBestTime = 0;
let storedBestMoves = 0;

async function getQueryParams() 
{
    // document.getElementById('game-screen').style.display = 'none';
    document.getElementById('loading-screen').style.display = 'flex';

    const urlParams = new URLSearchParams(window.location.search);
    const theme = urlParams.get('theme');
    const gridSize = urlParams.get('gridSize');
    const players = urlParams.get('players');
    
    // console.log('Game Theme:', theme);
    // console.log('Game Grid Size:', gridSize);
    // console.log('Game Players:', players);

    if(theme !== null && gridSize !== null & players !== null)
    {
        selectedTheme = theme;
        selectedPlayers = Number(players);
        selectedGridSize = Number(gridSize);
    }

    // console.log('Theme:', selectedTheme);
    // console.log('Grid Size:', selectedGridSize);
    // console.log('Players:', selectedPlayers);

    getPlayerRecord();
    setParagraphStyle();
    setupModal();


    
    setGridVisibility();
    
    
    setIconVisibility(); 
    
    // Create grid
    myGrid = createObject();
    // console.log('Grid:', myGrid);

    setPlayerGrid();

    startTimer();

    await wait(500)
    document.getElementById('loading-screen').style.display = 'none';
    document.getElementById('game-screen').style.display = 'block';
}
  

window.onload = getQueryParams;
window.onresize = setParagraphStyle;

function setIconVisibility() 
{ // hide or show numbers or icons
    if (selectedTheme === 'numbers') {
        const icons = document.querySelectorAll('.icon');
        icons.forEach(icon => {
            icon.classList.add('hide');
        });
    }

    else {
        const numbers = document.querySelectorAll('.number');
        numbers.forEach(number => {
            number.classList.add('hide');
        });
    }
}

function setGridVisibility() 
{ // hide or show gridContainer
    if (selectedGridSize === 4) {
        const gridContainer4 = document.querySelector('.grid-container-4');
        const gridContainer6 = document.querySelector('.grid-container-6');

        gridContainer4.classList.remove("grid-container-hide");
        gridContainer6.classList.add("grid-container-hide");
    }

    else {
        const gridContainer4 = document.querySelector('.grid-container-4');
        const gridContainer6 = document.querySelector('.grid-container-6');

        gridContainer4.classList.add("grid-container-hide");
        gridContainer6.classList.remove("grid-container-hide");
    }
}

function getPlayerRecord() 
{
    let playerTime = localStorage.getItem('playerTime');
    let playerMoves = localStorage.getItem('playerMoves');
    // console.log(`Player time is ${playerTime}`);
    if (playerTime === null) {
        playerTime = 0;
    }

    storedBestTime = Number(playerTime);


    if (playerMoves === null) {
        playerMoves = 0;
    }

    storedBestMoves = Number(playerMoves);

    // console.log(`Player time ----- ${storedBestTime}`);
}

function setPlayerGrid()
{
    const bottomGrid = document.getElementById('bottom-grid');

    if(selectedPlayers === 3)
    {
        bottomGrid.classList.remove('bottom-grid-4');

        bottomGrid.classList.add('bottom-grid-3');

        const player4 = document.getElementById('player-4');
        player4.classList.add("hide"); 
    }
    else if(selectedPlayers === 2)
    {
        bottomGrid.classList.remove('bottom-grid-4');
        bottomGrid.classList.remove('bottom-grid-3');

        bottomGrid.classList.add('bottom-grid-2');

        const player4 = document.getElementById('player-4');
        const player3 = document.getElementById('player-3');
        player4.classList.add("hide"); 
        player3.classList.add("hide"); 
    }
    else if(selectedPlayers === 1)
    {
        bottomGrid.classList.remove('bottom-grid-4');
        bottomGrid.classList.add('hide');

        const bottomGridOne = document.getElementById('bottom-grid-one');

        bottomGridOne.classList.remove('hide');
        bottomGridOne.classList.add('bottom-grid-2');
    }
}


function createObject() 
{
    let grid = {};
    let availableValues = [];
  
    // Generate possible values based on the theme
    if (selectedTheme === "numbers") 
    {
        if(selectedGridSize === 4)
        {
            availableValues = [1, 2, 3, 4, 5, 6, 7, 8, 8, 7, 6, 5, 4, 3, 2, 1];
        }
        else
        {
            availableValues = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18,
                18, 17, 16, 15, 14, 13, 12, 11, 10, 9, 8, 7, 6, 5, 4, 3, 2, 1];
        }
    } 
    else 
    {
        if(selectedGridSize === 4)
        {
            // console.log("------------------");
            availableValues = ["fa-binoculars", "fa-coffee", "fa-bus", "fa-taxi", "fa-diamond", "fa-envelope", "fa-desktop", "fa-code-fork",
                    "fa-code-fork", "fa-desktop", "fa-envelope", "fa-diamond", "fa-taxi", "fa-bus", "fa-coffee", "fa-binoculars"];
        }
        else
        {
            // console.log("+++++++++++++++++");
            availableValues = ["fa-binoculars", "fa-coffee", "fa-bus", "fa-taxi", "fa-diamond", "fa-envelope", "fa-desktop", "fa-code-fork", "fa-heartbeat",
                    "fa-flask", "fa-gavel", "fa-futbol-o", "fa-dot-circle-o", "fa-globe", "fa-eye", "fa-fire", "fa-headphones", "fa-graduation-cap",
                    "fa-graduation-cap", "fa-headphones", "fa-fire", "fa-eye", "fa-globe", "fa-dot-circle-o", "fa-futbol-o", "fa-gavel", "fa-flask",
                "fa-heartbeat", "fa-code-fork", "fa-desktop", "fa-envelope", "fa-diamond", "fa-taxi", "fa-bus", "fa-coffee", "fa-binoculars"];
        }
    }
  
    // Helper function to pick a random value and remove it from the available array
    function getRandomValue() 
    {
      const randomIndex = Math.floor(Math.random() * availableValues.length);
      const value = availableValues[randomIndex];
      availableValues.splice(randomIndex, 1); // Remove the selected value to avoid duplicate
      return value;
    }
    
    // Generate grid values
    for (let i = 0; i < selectedGridSize * selectedGridSize; i++) 
    {
      grid[i.toString()] = getRandomValue();
    }
  
    return grid;
}
  
// Function that returns a promise that resolves after a given delay
function wait(ms)
{
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function selectButton(buttonID)
{
    // console.log(buttonID);

    // clicked on the same button or waiting to undo selected buttons (not a match)
    if(promiseRunning || otherID === buttonID)
    {
        return;
    }

    const buttonElement = document.getElementById(buttonID);

    let heading;
    let icon;

    heading = buttonElement.querySelector('h2');
    icon = buttonElement.querySelector('i');
    
    
    if(selectedTheme === 'numbers')
    {
        // set button content
        if(selectedGridSize === 4)
        {
            heading.textContent = myGrid[buttonID];
        }
        else
        {
            const idx = Number(buttonID) - 16;
            heading.textContent = myGrid[idx.toString()];
        }
    }
    else
    {
        // set button content
        if(selectedGridSize === 4)
        {
            icon.classList.add(myGrid[buttonID]);
        }
        else
        {
            const idx = Number(buttonID) - 16;
            icon.classList.add(myGrid[idx.toString()]);
        }
    }

    // highlight the button
    buttonElement.classList.add('gi-highlight');
    // remove hover color
    buttonElement.classList.remove('empty');

    if(otherID === null) // first time clicking on the button
    {
        otherID = buttonID;
    }
    else
    {
        let otherButtonValue;
        let buttonValue;

        if(selectedGridSize === 4)
        {
            otherButtonValue = myGrid[otherID];
            buttonValue = myGrid[buttonID];
        }
        else
        {
            const idx = Number(buttonID) - 16;
            const otherIdx = Number(otherID) - 16;
            otherButtonValue = myGrid[otherIdx.toString()];
            buttonValue = myGrid[idx.toString()];
        }

        const otherButtonElement = document.getElementById(otherID);

        if(otherButtonValue === buttonValue) 
        { // matches
            buttonElement.removeAttribute('onclick');
            
            otherButtonElement.removeAttribute('onclick');
            totalFound++;

            adjustPlayerMoves(); 

            adjustPlayerScore();

            buttonElement.classList.add('match-animate');
            otherButtonElement.classList.add('match-animate');

            promiseRunning = true;
            await wait(600);
            promiseRunning = false;

            buttonElement.classList.remove('gi-highlight');
            otherButtonElement.classList.remove('gi-highlight');

            buttonElement.classList.add('gi-match');
            otherButtonElement.classList.add('gi-match');

            // changeTurns();
            checkGameOver();
            otherID = null;
        }
        else 
        { // does not match

            promiseRunning = true;
            await wait(600);
            promiseRunning = false;

            // remove highlight from both button
            buttonElement.classList.remove('gi-highlight');
            otherButtonElement.classList.remove('gi-highlight');

            // Make both buttons hoverable
            buttonElement.classList.add('empty');
            otherButtonElement.classList.add('empty');

            if(selectedTheme === 'numbers')
            {
                heading.textContent = "";
                const otherHeading = otherButtonElement.querySelector('h2');
                otherHeading.textContent = "";
            }
            else
            {
                icon.classList.remove(buttonValue);
                const otherIcon = otherButtonElement.querySelector('i');
                otherIcon.classList.remove(otherButtonValue);
            }
            
            otherID = null;

            adjustPlayerMoves(); 
            changeTurns();
        }
    }
    
}

function adjustPlayerScore() 
{
    let playerH2;
    if (selectedPlayers > 1) 
    {
        switch (currentTurn) 
        {
            case 1:
                playerOneScore++;
                playerH2 = document.querySelector('#player-1 .player-button .player-number h2');
                playerH2.textContent = playerOneScore;
                break;

            case 2:
                playerTwoScore++;
                playerH2 = document.querySelector('#player-2 .player-button .player-number h2');
                playerH2.textContent = playerTwoScore;
                break;

            case 3:
                playerThreeScore++;
                playerH2 = document.querySelector('#player-3 .player-button .player-number h2');
                playerH2.textContent = playerThreeScore;
                break;

            case 4:
                playerFourScore++;
                playerH2 = document.querySelector('#player-4 .player-button .player-number h2');
                playerH2.textContent = playerFourScore;
                break;

            default:
                break;
        }
    }
}

function adjustPlayerMoves() 
{
    let playerH2;
    if (selectedPlayers === 1) 
    {
        playerOneMoves++;
        playerH2 = document.querySelector('#bottom-grid-one #player-2 .player-button .player-number h2');
        playerH2.textContent = playerOneMoves;
    }
}

function changeTurns()
{
    if(selectedPlayers > 1)
    {
        let currentPlayer, nextPlayer;

        let currentPlayerButton, nextPlayerButton;
        let currentPlayeText, nextPlayerText;

        let nextPlayerNumber;

        let totalPlayers = selectedPlayers;

        if(currentTurn + 1 == totalPlayers)
        {
            totalPlayers++;
        }

       
        nextPlayerNumber = (currentTurn + 1) % totalPlayers;
        currentPlayer = document.getElementById(`player-${currentTurn}`);
        nextPlayer = document.getElementById(`player-${nextPlayerNumber}`);

        currentPlayerButton = currentPlayer.querySelector('.player-button');
        nextPlayerButton = nextPlayer.querySelector('.player-button');

        currentPlayeText = currentPlayer.querySelector('.turn-info');
        nextPlayerText = nextPlayer.querySelector('.turn-info');

        currentPlayerButton.classList.remove('gi-highlight');
        nextPlayerButton.classList.add('gi-highlight');

        currentPlayeText.style.display = 'none';
        if (window.innerWidth > 621) 
        {
            console.log("Here");
            nextPlayerText.style.display = 'block';
        }
       

        currentTurn = nextPlayerNumber;   

    }
}

function setupModal()
{
    const modalPlayer1 = document.getElementById('modal-player-1');
    const modalPlayer2 = document.getElementById('modal-player-2');
    const modalPlayer3 = document.getElementById('modal-player-3');
    const modalPlayer4 = document.getElementById('modal-player-4');

    switch (selectedPlayers) 
    {
        case 4:
            modalPlayer1.style.display = "grid";
            modalPlayer2.style.display = "grid";
            modalPlayer3.style.display = "grid";
            modalPlayer4.style.display = "grid";
            break;

        case 3:
            modalPlayer1.style.display = "grid";
            modalPlayer2.style.display = "grid";
            modalPlayer3.style.display = "grid";
            modalPlayer4.style.display = "none";
            break;

        case 2:
            modalPlayer1.style.display = "grid";
            modalPlayer2.style.display = "grid";
            modalPlayer3.style.display = "none";
            modalPlayer4.style.display = "none";
            break;
        case 1:
            modalPlayer1.style.display = "grid";
            modalPlayer2.style.display = "grid";
            modalPlayer3.style.display = "grid";
            modalPlayer4.style.display = "grid";
            break;
    
        default:
            break;
    }
}

async function checkGameOver()
{
    if(totalFound >= ((selectedGridSize * selectedGridSize) / 2)) // Game over
    {
        if(selectedPlayers > 1)
        {
            let gameResult = document.getElementById('player-win-text');

            let playerScores = {
                player1: playerOneScore,
                player2: playerTwoScore,
                player3: playerThreeScore,
                player4: playerFourScore
            };
              
            // Get the values (scores) from the object
            let scores = Object.values(playerScores);
            
            // Find the highest score
            let highestScore = Math.max(...scores);
            
            // Find players with the highest score
            let winners = [];
            for (let player in playerScores) 
            {
                if (playerScores[player] === highestScore) 
                {
                    winners.push(player); // Add player to winners array if they have the highest score
                }
            }

            let sortedByValues = Object.entries(playerScores).sort((a, b) => b[1] - a[1]);

            // Convert the sorted array back to an object 
            let sortedObjectByValues = Object.fromEntries(sortedByValues);

            let playerIdx = 1;
            let playerModal;
            let playerID;

            gameResult.textContent = 'It\'s a tie!'

            for (let player in sortedObjectByValues) 
            {
                playerID = player.charAt(player.length - 1);
                playerModal = document.getElementById(`modal-player-${playerIdx}`); 
                if(playerScores[player] === highestScore)
                {
                    playerModal.querySelector('p').textContent = `Player ${playerID} (Winner!)`;
                    playerModal.classList.add('winner')
                    if(winners.length === 1)
                    {
                        gameResult.textContent = `Player ${playerID} Wins!`
                    }
                }
                else
                {
                    playerModal.querySelector('p').textContent = `Player ${playerID}`;
                }

                playerModal.querySelector('h2').textContent = playerScores[player] + " Pairs";
                
                playerIdx++;
            }
        }
        else
        {
            stopTimer();

            let playerText = document.getElementById("player-win-text");
            playerText.textContent = "You did it!"

            let playerWinMessage = document.getElementById("player-win-message");
            
            let playerModal1 = document.getElementById(`modal-player-${1}`);
            let playerModal2 = document.getElementById(`modal-player-${2}`);
            let playerModal3 = document.getElementById(`modal-player-${3}`);
            let playerModal4 = document.getElementById(`modal-player-${4}`);

            playerModal1.classList.add('store');
            playerModal2.classList.add('store');

            playerModal3.classList.add('mgn');

            /***  Update Player Results ***/

            playerModal3.querySelector('p').textContent = `Time elapsed`;

            let { minutes, seconds } = ConvertSeconds(totalSeconds);

            playerModal3.querySelector('h2').textContent = `${minutes}:${seconds}`;

            playerModal4.querySelector('p').textContent = `Moves Taken`;
            playerModal4.querySelector('h2').textContent = `${playerOneMoves} Moves`;

            /***  Update Player Record  ***/
            let { minutes: storedMinutes, seconds: storedSeconds } = ConvertSeconds(storedBestTime);
            
            // Best time
            if(storedBestTime === 0 || totalSeconds < storedBestTime )
            {
                playerWinMessage.textContent = `Congratulations! New record...`;
                playerModal1.querySelector('p').textContent = `New best time`;
                playerModal1.querySelector('h2').textContent = `${minutes}:${seconds}`;

                playerModal1.classList.add('new');
                localStorage.setItem('playerTime', totalSeconds.toString());

                playerModal3.style.display = 'none';
            }
            else
            {
                playerModal1.querySelector('p').textContent = `Best time`;
                playerModal1.querySelector('h2').textContent = `${storedMinutes}:${storedSeconds}`;

                playerModal3.style.display = 'grid';
            }

            // Best Moves
            if(storedBestMoves === 0 || playerOneMoves < storedBestMoves)
            {
                playerWinMessage.textContent = `Congratulations! New record...`;
                playerModal2.querySelector('p').textContent = `New best moves`;
                playerModal2.querySelector('h2').textContent = `${playerOneMoves} Moves`;

                playerModal2.classList.add('new');
                localStorage.setItem('playerMoves', playerOneMoves.toString());

                playerModal4.style.display = 'none';
            }
            else
            {
                playerModal2.querySelector('p').textContent = `Best moves`;
                playerModal2.querySelector('h2').textContent = `${storedBestMoves} Moves`;

                playerModal4.style.display = 'grid';
            }
        }

        await animateGrid();

        modal.style.display = "block";
    }
}


async function animateGrid() 
{
    let buttons;

    if (selectedGridSize === 4) {
        buttons = document.querySelectorAll(".grid-container-4 button");
    }

    else {
        buttons = document.querySelectorAll(".grid-container-6 button");
    }

    buttons.forEach(button => {
        button.classList.add('win-animate');
    });

    promiseRunning = true;
    await wait(2000);
    promiseRunning = false;

    buttons.forEach(button => {
        button.classList.remove('win-animate');
    });
}

function ConvertSeconds(secondsToConvert) 
{
    let minutes = 0, seconds = 0;
    if(secondsToConvert <= 0)
    {
        minutes = 0;
        seconds = 0;
    }
    else
    {
        minutes = Math.floor(secondsToConvert / 60);
        seconds = secondsToConvert % 60; 
    }
    // console.log(`b min ${minutes} - b sec ${seconds}`);
    
    // Format with leading zeros
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    // console.log(`min ${minutes} - sec ${seconds}`);
    
    return { minutes, seconds };
}

function setParagraphStyle() 
{
    let playerTexts = document.querySelectorAll('.player-text p');
    let turnInfos = document.querySelectorAll('.turn-info');

    if (window.innerWidth <= 621) 
    {
        playerTexts.forEach(playerText => {
            switch (playerText.id) 
            {
                case 'p1':
                    playerText.textContent = 'P1';
                    break;

                    case 'p2':
                    playerText.textContent = 'P2';
                    break;

                    case 'p3':
                    playerText.textContent = 'P3';
                    break;

                    case 'p4':
                    playerText.textContent = 'P4';
                    break;
            
                default:
                    break;
            }
        });

        turnInfos.forEach(turnInfo => {
            turnInfo.style.display = 'none';
        });
        
    } 
    else 
    {
        playerTexts.forEach(playerText => {
            switch (playerText.id) 
            {
                case 'p1':
                    playerText.textContent = 'Player 1';
                    break;

                    case 'p2':
                    playerText.textContent = 'Player 2';
                    break;

                    case 'p3':
                    playerText.textContent = 'Player 3';
                    break;

                    case 'p4':
                    playerText.textContent = 'Player 4';
                    break;
            
                default:
                    break;
            }
        });

        if(selectedPlayers > 1)
        {
            const player = '#player-' + currentTurn + ' .turn-info';
            const playerTurnInfo = document.querySelector(player);

            playerTurnInfo.style.display = 'block';
            
        }
    }
}


/**************************************** Game over modal ****************************************/ 

var modal = document.getElementById("myModal");

var btn = document.getElementById("openModalBtn");

var span = document.getElementsByClassName("close")[0];

// btn.onclick = function() {
//   modal.style.display = "block";
// }

// When the user clicks on <span> (x), close the modal
// span.onclick = function() {
//   modal.style.display = "none";
// }

/**************************************** One player timer ****************************************/ 

function startTimer() 
{
    // If a timer is already running, don't start another one
    if (timerInterval) return;

    timerInterval = setInterval(() => {
    totalSeconds++;

    let minutes = Math.floor(totalSeconds / 60);
    let seconds = totalSeconds % 60;

    // Format with leading zeros
    minutes = minutes < 10 ? `0${minutes}` : minutes;
    seconds = seconds < 10 ? `0${seconds}` : seconds;

    let timerElement = document.querySelector('#bottom-grid-one #player-1 .player-button .player-number h2');


      // Display the timer
      timerElement.textContent = `${minutes}:${seconds}`;
    }, 1000); // Update every 1000ms (1 second)
}

function stopTimer() 
{
    clearInterval(timerInterval);  // Stops the interval
    timerInterval = null;          // Reset the interval ID
}

  
// startTimer();

function ShowMenu()
{
    const modal = document.getElementById("myMenuModal");

    if(selectedPlayers <= 1)
    {
        stopTimer();
    }

    modal.style.display = 'block'
}

function HideMenu()
{
    const modal = document.getElementById("myMenuModal");

    if(selectedPlayers <= 1)
    {
        startTimer();
    }

    modal.style.display = 'none'
}

function Restart() 
{
  // Redirect to the home page
  window.location.href = "home.html"
}

function NewGame() 
{
//   console.log(selectedTheme);
//   console.log(selectedPlayers);
//   console.log(selectedGridSize);

  // Build the game page URL with query parameters
  const gameUrl = `game.html?theme=${selectedTheme}&gridSize=${selectedGridSize}&players=${selectedPlayers}`;

  // Redirect to the game page
  window.location.href = gameUrl;
}