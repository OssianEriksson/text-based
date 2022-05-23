import { resolve } from "path"
import Game, { GameArgs } from "./game"
import LarpDvärgh from "./rooms/larp-dvärgh"
import Sittningslokal from "./rooms/sittningslokal"
import SkogStart from "./rooms/skog-start"
import Träsk from "./rooms/träsk"
import Öken from "./rooms/öken"
import Beztown from "./rooms/beztown"
import { VetenskapspersonA, VetenskapspersonB } from "./rooms/vetenskapsperson"
import { createGameOverRoom } from "./helpers/gameOver"
import AbabouFajt from "./rooms/ababou-fajt"

function getValue(parts: string[]) {
  if (parts.length < 2) {
    console.error(`Option ${parts[0]} requires a value, i.e. ${parts[0]}=...`)
    process.exit(1)
  }
  return parts[1]
}

const args: GameArgs = {
  room: Sittningslokal,
  gameOverRoom: createGameOverRoom("Du har tagit så mycket skada att du dör..."),
  savepoints: [SkogStart, Beztown, Träsk, Öken, LarpDvärgh, VetenskapspersonA, VetenskapspersonB, AbabouFajt],
  letterDelay: 5,
  shouldExit: (input) => ["exit", "avsluta"].includes(input),
  shouldRemoteSet: (input) => ["sync"].includes(input),
  shouldRemoteClear: (input) => ["clear"].includes(input),
  getErrorMessage: (input) => `${input} är inte ett tillgängligt val.`,
  savepointLoadErrorMessage: "Kunde inte ladda sparpunkten...",
  savepointPath: resolve("savepoints/savepoint.js"),
  load: false,
  remotePort: -1,
}

for (const arg of process.argv.slice(2)) {
  const parts = arg.split("=", 2)
  switch (parts[0]) {
    case "--letter-delay":
      args.letterDelay = parseInt(getValue(parts))
      break
    case "--savepoint":
      args.savepointPath = resolve(getValue(parts))
      break
    case "--load":
      args.load = true
      break
    case "--port":
      args.remotePort = parseInt(getValue(parts))
      break
    default:
      console.error(`Invalid option ${parts[0]}`)
      process.exit(1)
  }
}

Game.run(args)
