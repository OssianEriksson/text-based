import { resolve } from "path"
import Game from "./game"
import Sittningslokal from "./rooms/sittningslokal"

type Arguments = {
  letterDelay?: number
  savepointPath?: string
  load?: true
}

const args: Arguments = {}
for (const arg of process.argv.slice(2)) {
  const parts = arg.split("=", 2)
  if (parts.length > 1) {
    switch (parts[0]) {
      case "--letter-delay":
        args.letterDelay = parseInt(parts[1])
        break
      case "--savepoint":
        args.savepointPath = resolve(parts[1])
        break
      case "--load":
        args.load = true
        break
    }
  }
}

Game.run({ room: Sittningslokal, savepoints: [], ...args })
