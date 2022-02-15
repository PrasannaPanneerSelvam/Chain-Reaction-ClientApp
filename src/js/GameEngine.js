class Tile {
  constructor() {
    this.maxValue = 4;
    this.value = 0;
    this.color = -1;
  }
}

class ChainReaction {
  #rowNo;
  #colNo;

  #board;
  #playerCells;

  constructor(rowNum, colNum, noOfPlayers) {
    this.#rowNo = rowNum;
    this.#colNo = colNum;

    this.#board = [];
    this.#playerCells = [];

    for (let i = 0; i < noOfPlayers; i++) this.#playerCells.push(0);

    this.#initializeBoard();
  }

  #initializeBoard() {
    for (let row = 0; row < this.#rowNo; row++) {
      const rowArray = [];
      for (let col = 0; col < this.#colNo; col++) {
        const tile = new Tile();

        // Setting proper values for edges & corners
        if (row === 0 || row === this.#rowNo - 1) tile.maxValue--;
        if (col === 0 || col === this.#colNo - 1) tile.maxValue--;

        rowArray.push(tile);
      }
      this.#board.push(rowArray);
    }
  }

  addNucleus(row, col, color, uiUpdateCallbackObject) {
    // Add check for valid row col when exposing api
    const cellColor = this.#board[row][col].color;
    if (cellColor !== -1 && cellColor !== color) return;

    this.#board[row][col].value++;
    this.#board[row][col].color = color;
    this.#playerCells[color] += cellColor === -1;

    if (this.#board[row][col].maxValue === this.#board[row][col].value) {
      this.#doChainReaction(row, col, color, uiUpdateCallbackObject);
    } else {
      uiUpdateCallbackObject.cellUpdateCallback(
        row,
        col,
        this.#board[row][col].value,
        color
      );
    }
  }

  #isGameOver({ playerOut, playerWins }) {
    const gameOverFor = [];
    let livePlayers = [];

    for (let idx = 0; idx < 4; idx++) {
      if (this.#playerCells[idx] === 0) {
        gameOverFor.push(idx);
        this.#playerCells[idx] = -1;
      } else if (this.#playerCells[idx] > 0) {
        livePlayers.push(idx);
      }
    }

    if (livePlayers.length === 1) {
      playerWins(livePlayers[0]);
      return 1;
    }

    if (gameOverFor.length !== 0) gameOverFor.forEach(playerOut);
    return 0;
  }

  #doChainReaction(inputRow, inputCol, inputColor, uiUpdateCallbackObject) {
    let queue = [[inputRow, inputCol]];

    function updateQueuedElementsUI(inputQueue) {
      for (let idx = 0; idx < inputQueue.length; idx++) {
        const [row, col] = inputQueue[idx];
        uiUpdateCallbackObject.cellUpdateCallback(
          row,
          col,
          this.#board[row][col].value,
          this.#board[row][col].color
        );
      }
    }

    // TODO :: Make this recursive with requestAnimation frame
    while (queue.length !== 0) {
      const newQueue = [];
      for (let idx = 0; idx < queue.length; idx++) {
        const [row, col] = queue[idx];

        if (this.#board[row][col].maxValue !== this.#board[row][col].value)
          continue;

        // Updating bursting cell
        this.#board[row][col].value = 0;
        this.#board[row][col].color = -1;
        this.#playerCells[inputColor]--;

        // Adding cells affected by burst
        if (row > 0) newQueue.push([row - 1, col]);
        if (row < this.#rowNo - 1) newQueue.push([row + 1, col]);

        if (col > 0) newQueue.push([row, col - 1]);
        if (col < this.#colNo - 1) newQueue.push([row, col + 1]);
      }

      // Updating adjacent cell affected by burst
      for (let idx = 0; idx < newQueue.length; idx++) {
        const [row, col] = newQueue[idx];

        const currentCellColor = this.#board[row][col].color,
          occupyingNewCell = currentCellColor !== inputColor;

        this.#playerCells[inputColor] += occupyingNewCell;
        if (currentCellColor !== -1)
          this.#playerCells[currentCellColor] -= occupyingNewCell;

        this.#board[row][col].value++;
        this.#board[row][col].color = inputColor;
      }

      // Updating UI
      updateQueuedElementsUI.call(this, queue);

      if (this.#isGameOver(uiUpdateCallbackObject)) {
        queue = [];
        updateQueuedElementsUI.call(this, newQueue);
      } else {
        queue = newQueue;
      }
    }
  }

  callOnCells(color, possibleCellCallback, blockedCellCallback) {
    for (let row = 0; row < this.#rowNo; row++) {
      for (let col = 0; col < this.#colNo; col++) {
        if (
          this.#board[row][col].color === -1 ||
          this.#board[row][col].color === color
        ) {
          possibleCellCallback(row, col);
        } else {
          blockedCellCallback(row, col);
        }
      }
    }
  }
}

export default ChainReaction;
