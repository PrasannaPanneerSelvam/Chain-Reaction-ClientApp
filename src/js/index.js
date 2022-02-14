import GameEngine from './GameEngine.js';
import createBoard from './BoardBuilder.js';
import DomHandler from './DomHandler.js';

createBoard();

const GameBoard = new GameEngine();
const GameDom = new DomHandler('board', GameBoard);
