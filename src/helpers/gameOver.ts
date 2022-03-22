import { Room, RoomInfo, StateInterface } from "../game"

export default function gameOver(
  args: StateInterface,
  text: string = "Spelet är slut."
): RoomInfo {
  return {
    text,
    choices: [
      {
        text: "Spela igen",
        onChoose: () => {
          args.reset()
          return {}
        },
      },
    ],
  }
}

export function createGameOverRoom(text?: string): Room {
  return (args) => gameOver(args, text)
}
