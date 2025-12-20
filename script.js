
/* GAME STATE VARIABLES */

let score = 0;              // Current player score
let timeLeft = 30;          // Time remaining in seconds
let gameActive = false;     // Whether game is currently running
let moleInterval;           // Interval ID for spawning moles
let timerInterval;          // Interval ID for countdown timer
let currentMoleIndex = -1;  // Index of the cell currently showing a mole

/* DOM ELEMENT REFERENCES */

// Select all game cells
const cells = document.querySelectorAll('.cell');

// Select display elements
const scoreDisplay = document.getElementById('score');
const timerDisplay = document.getElementById('timer');

// Select control elements
const startBtn = document.getElementById('startBtn');
const gameOverMsg = document.getElementById('gameOver');

/*GAME INITIALIZATION*/

/**
 * Initialize the game
 * Sets up all event listeners when the page loads
 */
function initGame() {
    // Add click event listener to each cell
    cells.forEach(cell => {
        cell.addEventListener('click', handleCellClick);
    });
    
    // Add click event listener to start button
    startBtn.addEventListener('click', toggleGame);
}

/**
 * Handle cell click events
 * Checks if a mole is present and updates score accordingly
 * @param {Event} e - Click event object
 */
function handleCellClick(e) {
    // Only process clicks during active game
    if (!gameActive) return;

    // Get the clicked cell and its index
    const clickedCell = e.currentTarget;
    const cellIndex = parseInt(clickedCell.dataset.index);

    // Check if the clicked cell has a mole
    if (cellIndex === currentMoleIndex && clickedCell.classList.contains('mole')) {
        // Successful hit!
        // Increment score
        score++;
        scoreDisplay.textContent = score;

        // Remove mole and add whacked effect
        clickedCell.classList.remove('mole');
        clickedCell.classList.add('whacked');

        // Remove whacked effect after animation completes
        setTimeout(() => {
            clickedCell.classList.remove('whacked');
        }, 300);

        // Clear current mole so new one can appear
        currentMoleIndex = -1;
    }
}

/**
 * Display a mole in a random cell
 * Ensures the mole appears in a different cell from the previous one
 */
function showMole() {
    // Remove mole from previous cell if one exists
    if (currentMoleIndex !== -1) {
        cells[currentMoleIndex].classList.remove('mole');
    }

    // Generate a random cell index
    // Ensure it's different from the current mole position
    let randomIndex;
    do {
        randomIndex = Math.floor(Math.random() * cells.length);
    } while (randomIndex === currentMoleIndex);

    // Update current mole index
    currentMoleIndex = randomIndex;
    
    // Display mole in the new cell
    cells[currentMoleIndex].classList.add('mole');
}

/* ========================================
   TIMER LOGIC
   ======================================== */

/**
 * Start the countdown timer
 * Updates the timer display every second
 * Ends the game when timer reaches zero
 */
function startTimer() {
    timerInterval = setInterval(() => {
        // Decrement time
        timeLeft--;
        
        // Update timer display
        timerDisplay.textContent = timeLeft;

        // Check if time is up
        if (timeLeft <= 0) {
            endGame();
        }
    }, 2300); // Run every 2300ms (2.3 second)
}

/* ==GAME CONTROL FUNCTIONS==*/

/**
 * Start the game
 * Initializes all game variables and starts timers
 */
function startGame() {
    // Reset game state variables
    score = 0;
    timeLeft = 15;
    gameActive = true;
    currentMoleIndex = -1;

    // Update display elements
    scoreDisplay.textContent = score;
    timerDisplay.textContent = timeLeft;
    
    // Hide game over message if visible
    gameOverMsg.classList.remove('show');

    // Update start button
    startBtn.textContent = 'Playing...';
    startBtn.disabled = true;

    // Clear any existing moles from previous game
    cells.forEach(cell => {
        cell.classList.remove('mole', 'whacked');
    });

    // Start the countdown timer
    startTimer();
    
    // Show first mole immediately
    showMole();
    
    // Continue showing moles at regular intervals
    // Moles appear every 800ms (0.8 seconds) for challenging gameplay
    moleInterval = setInterval(showMole, 800);
}

/**
 * End the game
 * Stops all timers and displays final score
 */
function endGame() {
    // Set game as inactive
    gameActive = false;

    // Clear all intervals to stop mole spawning and timer
    clearInterval(moleInterval);
    clearInterval(timerInterval);

    // Remove any remaining moles from the grid
    cells.forEach(cell => {
        cell.classList.remove('mole', 'whacked');
    });

    // Display game over message with final score
    gameOverMsg.textContent = `Game Over! Final Score: ${score}`;
    gameOverMsg.classList.add('show');

    // Update button to allow restart
    startBtn.textContent = 'Play Again';
    startBtn.disabled = false;
}

/**
 * Toggle game state
 * Starts a new game when button is clicked
 */
function toggleGame() {
    // Only start if game is not currently active
    if (!gameActive) {
        startGame();
    }
}

/* INITIALIZE GAME ON PAGE LOAD */

// Call initGame when the page loads
initGame();
