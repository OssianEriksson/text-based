import { Player } from "./player"
import sleep from "./util/sleep"
import { DeepReadonly, JSONSerializable } from "./util/types"

export type RoomInfo = {
  text?: string
  choices: Choice[]
}

export type Room<T extends JSONSerializable = {}> = {
  <U extends T>(this: { state?: U | T }, args: StateInterface): RoomInfo
}

export type Choice = {
  text: string
  onChoose: () => Consequence
}

export type Consequence = {
  text?: string
  room?: Room<JSONSerializable>
}

type State = {
  room: Room<JSONSerializable>
  states: { [functionName: string]: JSONSerializable }
  player: Player
}

export type StateInterface = DeepReadonly<Pick<State, "room">> & Pick<State, "player"> & { reset: () => void }

namespace Game {
  export async function run({
    room: initialRoom,
    letterDelay = 5,
    shouldExit = (input) => ["exit", "avsluta"].includes(input),
    getErrorMessage = (input) => `${input} är inte ett tillgängligt val.`,
  }: {
    room: Room<JSONSerializable>
    letterDelay?: number
    shouldExit?: (input: string) => boolean
    getErrorMessage?: (input: string) => string
  }) {
    let state: State

    function reset() {
      state = {
        room: initialRoom,
        states: {},
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

    mainLoop: while (true) {
      const { choices, ...info }: RoomInfo = state.room.call(
        {
          get state(): JSONSerializable {
            return state.states[state.room.name]
          },
          set state(t: JSONSerializable) {
            state.states[state.room.name] = t
          },
        },
        {
          ...state,
          reset,
        } as StateInterface
      )

      await display(info.text)

      if (choices.length == 0) {
        break
      }

      for (let i = 0; i < choices.length; i++) {
        await display(`${i + 1}. ${choices[i].text}`, 1)
      }

      let choice: Choice
      while (true) {
        process.stdout.write("> ")
        const input = await new Promise<string>((resolve) => {
          const listener = (data: Buffer) => {
            process.stdin.removeListener("data", listener)
            resolve(data.toString().trim())
          }
          process.stdin.on("data", listener)
        })

        if (shouldExit(input)) {
          break mainLoop
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
    }
  }
}

export default Game
