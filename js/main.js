let selectedTheme = 'numbers';
let selectedPlayers = 1;
let selectedGridSize = 4;


function setTheme(clickedButton, theme) 
{
    // Get all buttons in the grid
    const buttons = document.querySelectorAll('.theme-grid button');

    // Remove 'highlighted' class from all buttons
    buttons.forEach(button => {
      button.classList.remove('highlighted');
      button.classList.add('player-button');
    });
  
    // Add 'highlighted' class to the clicked button
    clickedButton.classList.add('highlighted');
    clickedButton.classList.remove('player-button');

    selectedTheme = theme;
}

function setNumOfPlayers(clickedButton, players) 
{
    // Get all buttons in the grid
    const buttons = document.querySelectorAll('.player-grid button');

    // Remove 'highlighted' class from all buttons
    buttons.forEach(button => {
      button.classList.remove('highlighted');
      button.classList.add('player-button');
    });
  
    // Add 'highlighted' class to the clicked button
    clickedButton.classList.add('highlighted');
    clickedButton.classList.remove('player-button');

    selectedPlayers = players;
}

function setGridSize(clickedButton, size) 
{
    // Get all buttons in the grid
    const buttons = document.querySelectorAll('.size-grid button');

    // Remove 'highlighted' class from all buttons
    buttons.forEach(button => {
      button.classList.remove('highlighted');
      button.classList.add('player-button');
    });
  
    // Add 'highlighted' class to the clicked button
    clickedButton.classList.add('highlighted');
    clickedButton.classList.remove('player-button');

    selectedGridSize = size;
}


function startGame() 
{
  // console.log(selectedTheme);
  // console.log(selectedPlayers);
  // console.log(selectedGridSize);

  // Build the game page URL with query parameters
  const gameUrl = `game?theme=${selectedTheme}&gridSize=${selectedGridSize}&players=${selectedPlayers}`;

  // Redirect to the game page
  window.location.href = gameUrl;
}


