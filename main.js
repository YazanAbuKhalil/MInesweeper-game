const gameBoardEl = document.getElementById("game-board");
const flagButton = document.getElementById("btn-flag");
const timerEl = document.getElementById("timer");


const gameBoard = [];
const rowsNUmber = 10;
const columnsNUmber = 10;
const mines = 10;
const minesLocation = [];

let flagEnable = false;
let gameOver = false;
let numberOfClicks = 0;
let youWin = false;
let interval;



const flagToggle = function() {
    flagEnable = flagEnable ? false : true;
}

const showGameOver = function() {
    gameOver = true;
    clearInterval(interval)
    showMinesOnBoard();
    document.getElementById("MineAudio").play();
}

flagButton.addEventListener("click", flagToggle);

const restartGame = function() {
    gameBoardEl.innerHTML = ""; 
    flagEnable = false;
    gameOver = false;
    numberOfClicks = 0;
    youWin = false;
    gameBoard.length = 0;
    minesLocation.length = 0;
    // minesLocation = [];
    timerEl.textContent = 60;
    playGame();
}

document.querySelector(".btn-retryGame").addEventListener("click", restartGame);


const checkIfCellIsMine = function(row, column) {
    if (row < 0 || row >= rowsNUmber || column < 0 || column >= columnsNUmber ) {
        return 0;
    }


    if (minesLocation.includes(`${row}-${column}`))
        return 1;
    else 
        return 0;
}

const checkNumberOfMines = function(row, column) {
    // check for boundary
    if (row < 0 || row >= rowsNUmber || column < 0 || column >= columnsNUmber) return;


    if (gameBoard[row][column].classList.contains("cell-clicked")) return;

    gameBoard[row][column].classList.add("cell-clicked");
    numberOfClicks += 1;

    let minesCount = 0;

    // check for top 3 cells
    minesCount += checkIfCellIsMine(row - 1, column - 1);
    minesCount += checkIfCellIsMine(row - 1, column);
    minesCount += checkIfCellIsMine(row - 1, column + 1);

    // Check Left and Right
    minesCount += checkIfCellIsMine(row, column - 1);
    minesCount += checkIfCellIsMine(row, column + 1);

    // check for bottom 3 cells 
    minesCount += checkIfCellIsMine(row + 1, column - 1);
    minesCount += checkIfCellIsMine(row + 1, column);
    minesCount += checkIfCellIsMine(row + 1, column + 1);

    if (minesCount > 0) {
        gameBoard[row][column].textContent = minesCount;
        gameBoard[row][column].classList.add(`txt${minesCount}`)
    } else {
        //Top Left
        checkNumberOfMines(row - 1, column - 1);
        //Top
        checkNumberOfMines(row - 1, column);
        // Top right
        checkNumberOfMines(row - 1, column + 1);

        // Left
        checkNumberOfMines(row, column - 1);

        // Right
        checkNumberOfMines(row, column + 1);

        // Bottom Left
        checkNumberOfMines(row + 1, column - 1);
        // Bottom 
        checkNumberOfMines(row + 1, column);
        // Bottom right
        checkNumberOfMines(row + 1, column + 1);
    }

        //check if win
        if (numberOfClicks === rowsNUmber * columnsNUmber - mines) {
            document.getElementById("mines-numbers").textContent = "CLeared";
            youWin = true;
            alert("YOu win");

        }
    

}

const showMinesOnBoard = function() {
    for (let i = 0; i < minesLocation.length; i++) {
        const mineCell = document.getElementById(`${minesLocation[i]}`);
        mineCell.textContent = "💣";
        mineCell.style.backgroundColor = "red";
    }
}

const cellCLick = function(e) {

    if (gameOver || youWin || this.classList.contains("cell-clicked")) return;

    document.getElementById("clickAudio").play();


    // flag case
    if (flagEnable) {
        if (this.textContent === "") this.textContent = "🚩"
        else if (this.textContent === "🚩") this.textContent = "";
        return;
    }

    // check if mine cell
    if (minesLocation.includes(this.id)) {
        showGameOver();
        return;
    }

    // check number of mines surround the cell
    let currentLocation = this.id.split("-");
    let row = +currentLocation[0];
    let column = +currentLocation[1];
    checkNumberOfMines(row, column)
}

const setMines = function() {
    let minesLeft = mines;
    while (minesLeft > 0) {
        let randomRowIndex = Math.trunc(Math.random() * rowsNUmber);
        let randomColumnINdex = Math.trunc(Math.random() * columnsNUmber);
        let id = `${randomRowIndex}-${randomColumnINdex}`;

        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            minesLeft--;
        }
    }
}

const setTimerToGame = function() {
        let time = +timerEl.textContent
        interval = setInterval(function(){
            if (time <= 0) {
                clearInterval(interval);
                showGameOver();
                timerEl.textContent = "Times Out";
                return;
            }
            time--;
            timerEl.textContent = time;
        }, 1000)
}

const playGame = function() {

    if (interval) clearInterval(interval);
    setTimerToGame();

    document.getElementById("mines-numbers").textContent = mines;
    setMines();

    for (let i = 0; i < rowsNUmber; i++) {
        const rows = [];
        for (let j = 0; j < columnsNUmber; j++) {
            const cell = document.createElement("div");
            cell.id = `${i}-${j}`;
            cell.addEventListener("click", cellCLick)
            gameBoardEl.append(cell);
            rows.push(cell);
        }
        gameBoard.push(rows);
    }
    console.log(gameBoard);
}


window.onload = function() {
    playGame();
}