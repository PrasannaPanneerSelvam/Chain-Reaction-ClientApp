function createBoard() {
  function createElementWithTag(tag, className, id) {
    const div = document.createElement(tag);

    div.classList.add(className);
    if (id) div.id = id;

    return div;
  }

  const container = document.getElementById('board'),
    rowNo = 8,
    colNo = 8;

  for (let row = 0; row < rowNo; row++) {
    const rowDiv = createElementWithTag('div', 'tile-row');

    for (let col = 0; col < colNo; col++) {
      const tile = createElementWithTag('div', 'tile');
      rowDiv.appendChild(tile);
    }

    container.appendChild(rowDiv);
  }
}

export default createBoard;
