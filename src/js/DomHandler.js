import GameEngine from './GameEngine.js';

const colorMap = (function () {
  const rootStyles = getComputedStyle(document.body);
  return [1, 2, 3, 4].map(i =>
    rootStyles
      .getPropertyValue('--player-' + i)
      .trim()
      .slice(1, -1)
  );
})();

// Returns one index based values
const { removePlayer, initializePlayers, getCurrentPlayer, updateNextPlayer } =
  (function () {
    let noOfAvailablePlayers, availablePlayers, currentTurn;

    function initializePlayers(input) {
      noOfAvailablePlayers = input;
      availablePlayers = [];
      currentTurn = input - 1; // Hack for starting from first one
      for (let idx = 0; idx < input; idx++) availablePlayers.push(idx);
    }

    function removePlayer(playerNumber) {
      noOfAvailablePlayers--;

      const currentPlayer = availablePlayers[currentTurn];
      availablePlayers = availablePlayers.filter(elem => elem !== playerNumber);
      currentTurn = availablePlayers.indexOf(currentPlayer);
    }

    function getCurrentPlayer() {
      return availablePlayers[currentTurn];
    }

    function updateNextPlayer() {
      currentTurn = (currentTurn + 1) % noOfAvailablePlayers;
      return availablePlayers[currentTurn];
    }

    return {
      removePlayer,
      initializePlayers,
      getCurrentPlayer,
      updateNextPlayer,
    };
  })();

class DomHandler {
  #rowNo;
  #colNo;
  #noOfPlayers;
  #currentTurn;
  #isOnline;
  #thisPlayer;

  #boardTiles;
  #board;
  #clickEnabled;
  #setBorderColor;
  #socketCb;

  constructor(boardId, gameRules = {}) {
    this.#rowNo = 8;
    this.#colNo = 8;
    this.#boardTiles = [];
    this.#clickEnabled = [];
    this.#noOfPlayers = gameRules.noOfPlayers ?? 4;

    this.#isOnline = gameRules.isOnline ?? false;

    // Meant only for online game
    this.#thisPlayer = gameRules.playerId;
    this.#socketCb = gameRules.emitToSocket ?? (() => {});

    const container = document.getElementById(boardId),
      rowDivs = [...container.getElementsByClassName('tile-row')];

    this.#setBorderColor = () =>
      container.style.setProperty(
        '--tile-border-color',
        colorMap[this.#currentTurn]
      );

    rowDivs.forEach(rowElem => {
      this.#boardTiles.push([...rowElem.getElementsByClassName('tile')]);
      this.#clickEnabled.push(new Array(this.#colNo).fill(true));
    });

    this.#board = new GameEngine(this.#rowNo, this.#colNo, this.#noOfPlayers);
    this.#setClickEvents();
    initializePlayers(this.#noOfPlayers);
    this.#changeTurn();
  }

  #tileUpdate(row, col, value, color) {
    const cell = this.#boardTiles[row][col];

    // Add animation & better view
    cell.innerText = value;
    cell.style.background = colorMap[color] ?? '';
  }

  #getUICallbacks() {
    return {
      cellUpdateCallback: this.#tileUpdate.bind(this),
      playerOut: playerNumber => {
        console.log(`Player ${playerNumber} lost!`);
        removePlayer(playerNumber);
      },
      playerWins: playerNumber => console.log(`Player ${playerNumber} wins!!!`),
    };
  }

  #changeTurn() {
    this.#currentTurn = updateNextPlayer();
    this.#setBorderColor();
    this.#blockCells();
  }

  #blockCells() {
    const blockOtherCells = (row, col) => {
        this.#boardTiles[row][col].classList.add('lock-tile');
        this.#clickEnabled[row][col] = false;
      },
      releasePossibleCells = (row, col) => {
        this.#boardTiles[row][col].classList.remove('lock-tile');
        this.#clickEnabled[row][col] = true;
      };

    this.#board.callOnCells(
      this.#currentTurn,
      !this.#isOnline || this.#thisPlayer === this.#currentTurn
        ? releasePossibleCells
        : blockOtherCells,
      blockOtherCells
    );
  }

  #setClickEvents() {
    const uiCbObject = this.#getUICallbacks();

    for (let row = 0; row < this.#rowNo; row++)
      for (let col = 0; col < this.#colNo; col++)
        this.#boardTiles[row][col].addEventListener('click', () => {
          if (!this.#clickEnabled[row][col]) return;

          const success = this.#board.addNucleus(
            row,
            col,
            this.#currentTurn,
            uiCbObject
          );

          if (success) {
            this.#changeTurn();
            this.#socketCb(row, col);
          }
        });
  }

  // API for executing commands from server
  makeMoveForOthers(cellNo) {
    const row = parseInt(cellNo / this.#colNo),
      col = cellNo % this.#colNo;

    const uiCbObject = this.#getUICallbacks();
    const success = this.#board.addNucleus(
      row,
      col,
      this.#currentTurn,
      uiCbObject
    );
    if (success) this.#changeTurn();
  }

  setSocketCallback(cb) {
    if (!cb || cb.constructor !== Function)
      throw new Error('Socket emission callback should be a function');

    this.#socketCb = cb;
  }

  populateBoard(input) {
    this.#board.populateBoard(input, this.#tileUpdate.bind(this));
  }
}

export default DomHandler;
