const targetUrl =
  document.location.protocol + '//' + document.location.hostname + ':5000';

let socket = null,
  game = null,
  boardActionCallback = () => {};

function updateGame(input) {
  game = input;
  game.setSocketCallback(sendMoveToServer);
  boardActionCallback = game.makeMoveForOthers.bind(game);
}

function sendMoveToServer(row, col) {
  const cellNo = row * 8 + col;
  socket.emit('m', cellNo);
}

function connectInSocket() {
  socket = io(targetUrl);
  socket.on('m', msg => boardActionCallback(msg));

  // TODO :: Handle errors
  return true;
}

function createRoom(noOfPlayers, respCallback) {
  socket.on('gameDetails', respCallback);
  socket.emit('create-room', noOfPlayers);
}

function joinRoom(roomId, jwt, respCallback) {
  socket.on('gameDetails', respCallback);
  socket.emit('join-room', roomId, jwt);
}

export { updateGame, connectInSocket, createRoom, joinRoom };
