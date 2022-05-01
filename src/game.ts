import { Player } from "./player"
import sleep from "./util/sleep"
import { DeepReadonly } from "./util/types"

export type RoomInfo = {
  text?: string
  choices: Choice[]
}

export type Room<T = undefined> = {
  (this: { state?: T }, args: StateInterface): RoomInfo
}

export type Choice = {
  text: string
  onChoose: () => Consequence
}

export type Consequence = {
  text?: string
  room?: Room<any>
}

type State = {
  room: Room<any>
  visitedRooms: Room<any>[]
  states: Map<Room<any>, unknown>
  player: Player
}

export type StateInterface = DeepReadonly<Pick<State, "room" | "visitedRooms">> &
  Omit<State, "room" | "visitedRooms" | "states"> & { reset: () => void }

namespace Game {
  export async function run({
    room: initialRoom,
    letterDelay = 5,
    shouldExit = (input) => ["exit", "avsluta"].includes(input),
    getErrorMessage = (input) => `${input} är inte ett tillgängligt val.`,
  }: {
    room: Room<any>
    letterDelay?: number
    shouldExit?: (input: string) => boolean
    getErrorMessage?: (input: string) => string
  }) {
    let state: State

    function reset() {
      state = {
        room: initialRoom,
        visitedRooms: [],
        states: new Map<Room<any>, unknown>(),
        player: {
          character: "fysiker",
          attributes: [],
          hp: 100,
          gold: 0,
          copper: 0,
        },
      }
      return state
    }

    state = reset()

    async function display(text?: string, newines: number = 2) {
      if (typeof text === "string") {
        for (const letter of text) {
          process.stdout.write(letter)
          if (letterDelay > 0) {
            await sleep(letterDelay)
          }
        }
        process.stdout.write("\n".repeat(newines))
      }
    }

    async function doRoom<T>(room: Room<T>): Promise<boolean> {
      if (state.visitedRooms.length == 0 || state.visitedRooms[state.visitedRooms.length - 1] != room) {
        state.visitedRooms.push(room)
      }

      const { choices, ...info }: RoomInfo = room.call(
        {
          get state(): T {
            return state.states.get(room) as T
          },
          set state(t: T) {
            state.states.set(room, t)
          },
        },
        {
          ...state,
          reset,
        } as StateInterface
      )

      await display(info.text)

      if (choices.length == 0) {
        return false
      }

      for (let i = 0; i < choices.length; i++) {
        await display(`${i + 1}. ${choices[i].text}`, 1)
      }

      let choice: Choice
      while (true) {
        process.stdout.write("> ")
        const input = await new Promise<string>((resolve) => {
          const listener = (data: Buffer) => {
            process.stdin.removeListener('data', listener)
            resolve(data.toString().trim())
          }
          process.stdin.on("data", listener)
        })

        if (shouldExit(input)) {
          return false
        }

        const i = Number(input)
        if (Number.isInteger(i) && i > 0 && i <= choices.length) {
          choice = choices[i - 1]
          break
        }

        await display(getErrorMessage(input), 1)
      }

      const consequence = choice.onChoose()

      await display("", 1)
      await display(consequence.text)

      if (consequence.room) {
        state.room = consequence.room
      }

      return true
    }

    while (await doRoom(state.room)) {}
  }
}

export default Game
