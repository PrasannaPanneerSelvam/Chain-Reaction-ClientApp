const colorMap = ['#ff0000', '#0000ff', '#00ff00', '#ffff00'];

class DomHandler {
  #rowNo;
  #colNo;

  #boardTiles;
  #board;

  constructor(boardId, board) {
    this.#rowNo = 8;
    this.#colNo = 8;
    this.#boardTiles = [];

    const container = document.getElementById(boardId),
      rowDivs = [...container.getElementsByClassName('tile-row')];

    rowDivs.forEach(rowElem =>
      this.#boardTiles.push([...rowElem.getElementsByClassName('tile')])
    );

    this.#board = board;

    this.#setClickEvents();
  }

  #tileUpdate(row, col, value, color) {
    const cell = this.#boardTiles[row][col];

    // Add animation & better view
    cell.innerText = value;
    cell.style.background = colorMap[color] ?? '';
  }

  #setClickEvents() {
    // TODO :: Set color based on the player's color & turn
    const oolor = 0;

    const bindedTileUpdate = this.#tileUpdate.bind(this);

    for (let row = 0; row < this.#rowNo; row++)
      for (let col = 0; col < this.#colNo; col++)
        this.#boardTiles[row][col].addEventListener('click', () =>
          this.#board.addNucleus(row, col, oolor, bindedTileUpdate)
        );
  }
}

export default DomHandler;
