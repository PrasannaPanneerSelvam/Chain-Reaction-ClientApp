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

class DomHandler {
  #rowNo;
  #colNo;
  #noOfPlayers;

  #boardTiles;
  #board;
  #setBorderColor;

  constructor(boardId) {
    this.#rowNo = 8;
    this.#colNo = 8;
    this.#boardTiles = [];
    this.#noOfPlayers = 4;

    const container = document.getElementById(boardId),
      rowDivs = [...container.getElementsByClassName('tile-row')];

    this.#setBorderColor = color =>
      container.style.setProperty('--tile-border-color', colorMap[color]);

    rowDivs.forEach(rowElem =>
      this.#boardTiles.push([...rowElem.getElementsByClassName('tile')])
    );

    this.#board = new GameEngine(this.#rowNo, this.#colNo, this.#noOfPlayers);
    this.#setClickEvents();
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
      playerOut: playerNumber => console.log(`Player ${playerNumber} lost!`),
      playerWins: playerNumber => console.log(`Player ${playerNumber} wins!!!`),
    };
  }

  #setClickEvents() {
    // TODO :: Set color based on the player's color & turn
    const oolor = 0;

    const uiCbObject = this.#getUICallbacks();

    for (let row = 0; row < this.#rowNo; row++)
      for (let col = 0; col < this.#colNo; col++)
        this.#boardTiles[row][col].addEventListener('click', () =>
          this.#board.addNucleus(row, col, oolor, uiCbObject)
        );
  }
}

export default DomHandler;
