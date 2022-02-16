import createNewBoard from './BoardBuilder.js';
import DomHandler from './DomHandler.js';

import {
  updateGame,
  sendMoveToServer,
  connectInSocket,
  createRoom,
  joinRoom,
} from './SocketHandler.js';

function createOnlineGame(playerId) {
  createNewBoard();
  const GameDom = new DomHandler('board', {
    isOnline: true,
    playerId,
  });

  return GameDom;
}

function RoomCreationCallback({ roomDetails, roomId, playerId }) {
  console.log('Room id', roomId);
  createOnlineGame(playerId);

  // Set user's url with roomid in query parsms
}

function createNewOnlineGame(noOfPlayers) {
  connectInSocket();
  createRoom(noOfPlayers, RoomCreationCallback);
}

window.__createNewOnlineGame = createNewOnlineGame;
