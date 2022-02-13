import "./types"

import { Game } from "./game";

import Sittningslokal from "./rooms/sittningslokal";
import GameOver from "./rooms/game-over";

const game: Game = new Game(Sittningslokal, GameOver);
game.start();
