import createNewBoard from './BoardBuilder.js';
import DomHandler from './DomHandler.js';

import {
  updateGame,
  connectInSocket,
  createRoom,
  joinRoom,
} from './SocketHandler.js';

function createNewGame(options) {
  createNewBoard();
  return new DomHandler('board', options);
}

function createOnlineGame(playerId, noOfPlayers = 2) {
  const options = {
    isOnline: true,
    playerId,
    noOfPlayers,
  };

  return createNewGame(options);
}

function createOfflineGame(noOfPlayers) {
  return createNewGame({ noOfPlayers });
}

function formUrl(roomId) {
  return (
    location.origin +
    (location.pathname !== '/' ? location.pathname : '') +
    '?roomId=' +
    roomId
  );
}

function RoomJoiningCallback(responseObject) {
  const { roomDetails, playerId } = responseObject;
  console.log('Room details', responseObject);
  console.log('Room link', formUrl(roomDetails.roomId));
  const game = createOnlineGame(playerId, roomDetails.noOfPlayers);
  updateGame(game);

  // Set user's url with roomid in query parsms
}

function createNewOnlineGame(noOfPlayers) {
  connectInSocket();
  createRoom(noOfPlayers, RoomJoiningCallback);
}

function joinNewOnlineGame(roomId) {
  connectInSocket();
  joinRoom(roomId, null, RoomJoiningCallback);
}

function joinRoomIfPossible() {
  const queryParams = new Proxy(new URLSearchParams(window.location.search), {
    get: (searchParams, prop) => searchParams.get(prop),
  });

  if (!queryParams.roomId) return;
  joinNewOnlineGame(queryParams.roomId);
}

joinRoomIfPossible();

window.__createNewOnlineGame = createNewOnlineGame;
