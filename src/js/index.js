import createNewBoard from './BoardBuilder.js';
import DomHandler from './DomHandler.js';

import {
  updateGame,
  connectInSocket,
  createRoom,
  joinRoom,
} from './SocketHandler.js';

function createOnlineGame(playerId) {
  createNewBoard();
  const GameDom = new DomHandler('board', {
    isOnline: true,
    playerId,
    noOfPlayers: 2,
  });

  return GameDom;
}

function RoomJoiningCallback({ roomDetails, roomId, playerId }) {
  console.log('Room details', roomDetails, roomId, playerId);
  const game = createOnlineGame(playerId);
  updateGame(game);

  // Set user's url with roomid in query parsms
}

function createNewOnlineGame(noOfPlayers) {
  connectInSocket();
  createRoom(noOfPlayers, RoomJoiningCallback);
}

function joinNewOnlineGame(noOfPlayers) {
  connectInSocket();
  joinRoom(noOfPlayers, null, RoomJoiningCallback);
}

window.__createNewOnlineGame = createNewOnlineGame;
window.__joinNewOnlineGame = joinNewOnlineGame;
