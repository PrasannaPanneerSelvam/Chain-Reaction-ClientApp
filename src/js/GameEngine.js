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

  constructor() {
    this.#rowNo = 8;
    this.#colNo = 8;

    this.#board = [];

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

  addNucleus(row, col, color, cellUpdateCallback) {
    // Add check for valid row col when exposing api
    const cellColor = this.#board[row][col].color;
    if (cellColor !== -1 && cellColor !== color) return;

    this.#board[row][col].value++;

    cellUpdateCallback = cellUpdateCallback ?? (() => {});

    if (this.#board[row][col].maxValue === this.#board[row][col].value) {
      this.#doChainReaction(row, col, color, cellUpdateCallback);
    } else {
      cellUpdateCallback(row, col, this.#board[row][col].value, color);
    }
  }

  #doChainReaction(inputRow, inputCol, inputColor, cellUpdateCallback) {
    let queue = [[inputRow, inputCol]];

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

        // Adding cells affected by burst
        if (row > 0) newQueue.push([row - 1, col]);
        if (row < this.#rowNo - 1) newQueue.push([row + 1, col]);

        if (col > 0) newQueue.push([row, col - 1]);
        if (col < this.#colNo - 1) newQueue.push([row, col + 1]);
      }

      // Updating adjacent cell affected by burst
      for (let idx = 0; idx < newQueue.length; idx++) {
        const [row, col] = newQueue[idx];
        this.#board[row][col].value++;
        this.#board[row][col].color = inputColor;
      }

      // Updating UI
      for (let idx = 0; idx < queue.length; idx++) {
        const [row, col] = queue[idx];
        cellUpdateCallback(
          row,
          col,
          this.#board[row][col].value,
          this.#board[row][col].color
        );
      }

      queue = newQueue;
    }
  }
}

export default ChainReaction;
