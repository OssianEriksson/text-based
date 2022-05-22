import { Player } from "./player"
import sleep from "./util/sleep"
import { DeepReadonly, Serializable } from "./util/types"
import serialize from "serialize-javascript"
import { writeFile, mkdir } from "fs/promises"
import { createHash } from "crypto"
import { dirname } from "path"

export type RoomInfo = {
  text?: string
  choices: Choice[]
}

export type Room<T extends Serializable = {}> = {
  <U extends T>(this: { state?: U | T }, args: StateInterface): RoomInfo
}

export type Choice = {
  text: string
  onChoose: () => Consequence
}

export type Consequence = {
  text?: string
  room?: Room<Serializable> | "reset" | "load savepoint"
}

type State = {
  room: Room<Serializable>
  states: { [functionSrc: string]: Serializable }
  player: Player
}

export type StateInterface = DeepReadonly<Pick<State, "room">> & Pick<State, "player">

export type GameArgs = {
  room: Room<Serializable>
  savepoints: Room<Serializable>[]
  letterDelay: number
  shouldExit: (input: string) => boolean
  getErrorMessage: (input: string) => string
  savepointLoadErrorMessage: string
  savepointPath: string
  load: boolean
}

namespace Game {
  export async function run({
    room: initialRoom,
    savepoints: preliminarySavepoints,
    letterDelay,
    shouldExit,
    getErrorMessage,
    savepointLoadErrorMessage,
    savepointPath,
    load,
  }: GameArgs) {
    const savepoints = [initialRoom, ...preliminarySavepoints]
    let lastSavepoint: Room<Serializable> | undefined = undefined

    let state: State

    function md5(text: string): string {
      return createHash("md5").update(text).digest("hex")
    }

    async function addSavepoint(): Promise<boolean> {
      const { room, ...serializable } = state
      if (savepoints.includes(room) && lastSavepoint != room) {
        await mkdir(dirname(savepointPath), { recursive: true })
        await writeFile(savepointPath, `module.exports = ${serialize({ room: room.name, ...serializable })}`, {
          encoding: "utf-8",
        })
        lastSavepoint = room
        return true
      }
      return false
    }

    function loadSavepoint(): State | undefined {
      try {
        const { room: roomName, ...serializable } = require(savepointPath)
        const room = savepoints.find((savepoint) => savepoint.name == roomName)
        if (!room) {
          return undefined
        }

        state = { room, ...serializable } as State
        return state
      } catch {
        return undefined
      }
    }

    function reset() {
      state = {
        room: initialRoom,
        states: {},
        player: {
          character: "fysiker",
          attributes: [],
          maxHp: 100,
          hp: 100,
          gold: 0,
          copper: 0,
          healingPotions: 0,
        },
      }
      addSavepoint()
      return state
    }

    if (load) {
      const savepoint = loadSavepoint()
      if (!savepoint) {
        display(savepointLoadErrorMessage)
        return
      }
      state = savepoint
    } else {
      state = reset()
    }

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
      if (state.room != initialRoom && (await addSavepoint())) {
        await display("(Sparpunkt skapad.)")
      }

      const statesKey = md5(serialize(state.room))
      const { choices, ...info }: RoomInfo = state.room.call(
        {
          get state(): Serializable {
            return state.states[statesKey]
          },
          set state(t: Serializable) {
            state.states[statesKey] = t
          },
        },
        {
          ...state,
          reset,
          addSavepoint,
          loadSavepoint,
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

      if (consequence.room == "load savepoint") {
        if (!loadSavepoint()) {
          display(savepointLoadErrorMessage)
        }
      } else if (consequence.room == "reset") {
        reset()
      } else if (consequence.room) {
        state.room = consequence.room
      }
    }
  }
}

export default Game
