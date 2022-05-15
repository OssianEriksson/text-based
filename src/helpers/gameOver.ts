import { Room, RoomInfo, StateInterface } from "../game"

export default function gameOver(
  args: StateInterface,
  text: string = "Spelet är slut."
): RoomInfo {
  return {
    text,
    choices: [
      {
        text: "Fortsätt från senaste sparpunkten.",
        onChoose: () => ({
          room: "load savepoint"
        }),
      },
      {
        text: "Starta om från början.",
        onChoose: () => ({
          room: "reset"
        }),
      },
    ],
  }
}

export function createGameOverRoom(text?: string): Room {
  return (args) => gameOver(args, text)
}
