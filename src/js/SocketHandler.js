const targetUrl = 'http://127.0.0.1:5000';

let socket = null,
  game = null;

function updateGame(input) {
  game = input;
}

function sendMoveToServer(row, col) {
  const cellNo = row * 8 + col;
  socket.emit('m', cellNo);
}

function connectInSocket() {
  socket = io(targetUrl);

  // TODO :: Handle errors
  return true;
}

function createRoom(noOfPlayers, respCallback) {
  socket.on('gameDetails', respCallback);
  socket.emit('create-room', noOfPlayers);
}

function joinRoom(roomId, jwt = null, respCallback) {
  socket.on('join-room', roomId, jwt);
}

export { updateGame, sendMoveToServer, connectInSocket, createRoom, joinRoom };
