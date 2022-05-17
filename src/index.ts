import { resolve } from "path"
import { parseJsonText } from "../node_modules/typescript/lib/typescript"
import Game from "./game"
import LarpDvärgh from "./rooms/larp-dvärgh"
import Sittningslokal from "./rooms/sittningslokal"
import SkogStart from "./rooms/skogStart"
import Träsk from "./rooms/träsk"
import Öken from "./rooms/öken"

type Arguments = {
  letterDelay?: number
  savepointPath?: string
  load?: true
}

function getValue(parts: string[]) {
  if (parts.length < 2) {
    console.error(`Option ${parts[0]} requires a value, i.e. ${parts[0]}=...`)
    process.exit(1)
  }
  return parts[2]
}

const args: Arguments = {}
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
    default:
      console.error(`Invalid option ${parts[0]}`)
      process.exit(1)
  }
}

Game.run({ room: Sittningslokal, savepoints: [SkogStart, Öken, Träsk, LarpDvärgh], ...args })
