import "./types";

import { Game } from "./game";

import Sittningslokal from "./rooms/sittningslokal";
import GameOver from "./rooms/game-over";

type Arguments = {
  "--letter-delay"?: number;
};

const args: Arguments = Object.fromEntries(
  process.argv.slice(2).map((arg) => {
    const parts = arg.split("=", 2);
    return [parts[0], parts.length < 2 || parts];
  })
);

const game: Game = new Game(Sittningslokal, GameOver);
game.start(args["--letter-delay"]);
