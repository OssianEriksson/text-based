import Game from "./game"
import Sittningslokal from "./rooms/sittningslokal"

type Arguments = {
  letterDelay?: number
}

const args: Arguments = {}
for (const arg of process.argv.slice(2)) {
  const parts = arg.split("=", 2)
  if (parts.length > 1) {
    switch (parts[0]) {
      case "--letter-delay":
        args.letterDelay = parseInt(parts[1])
        break
    }
  }
}

Game.run({ room: Sittningslokal, letterDelay: args.letterDelay })
