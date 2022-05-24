import { Player } from "./player"
import sleep from "./util/sleep"
import { DeepReadonly, Serializable } from "./util/types"
import serialize from "serialize-javascript"
import { writeFile, mkdir } from "fs/promises"
import { createHash } from "crypto"
import { dirname } from "path"
import http from "http"

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
  gameOverRoom: Room<Serializable>
  savepoints: Room<Serializable>[]
  letterDelay: number
  shouldExit: (input: string) => boolean
  shouldRemoteSet: (input: string) => boolean
  shouldRemoteClear: (input: string) => boolean
  getErrorMessage: (input: string) => string
  savepointLoadErrorMessage: string
  savepointPath: string
  load: boolean
  remotePort: number
}

namespace Game {
  export async function run({
    room: initialRoom,
    gameOverRoom,
    savepoints: preliminarySavepoints,
    letterDelay,
    shouldExit,
    shouldRemoteSet,
    getErrorMessage,
    shouldRemoteClear,
    savepointLoadErrorMessage,
    savepointPath,
    load,
    remotePort,
  }: GameArgs) {
    const savepoints = [initialRoom, ...preliminarySavepoints]
    let lastSavepoint: Room<Serializable> | undefined = undefined
    let totalPushedOutput: string = ""

    let state: State

    function md5(text: string): string {
      return createHash("md5").update(text).digest("hex")
    }

    function remote(method: "push" | "set", stdout: string) {
      if (method == "push") {
        totalPushedOutput += stdout
      }

      if (remotePort > 0) {
        const request = http.request({
          host: "localhost",
          port: remotePort,
          path: `/${method}`,
          method: "post",
          headers: {
            "Content-Type": "application/json",
          },
        })
        request.on("error", () => {})
        request.write(JSON.stringify({ stdout, letterDelay }))
        request.end()
      }
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

    function loadSavepoint(resetHp: boolean = false): State | undefined {
      try {
        const { room: roomName, ...serializable } = require(savepointPath)
        const room = savepoints.find((savepoint) => savepoint.name == roomName)
        if (!room) {
          return undefined
        }

        state = { room, ...serializable } as State
        if (resetHp) {
          state.player.hp = state.player.maxHp
        }
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

    async function display(text?: string, newlines: number = 2) {
      if (typeof text === "string") {
        text += "\n".repeat(newlines)

        remote("push", text)

        let time: number = Date.now()
        for (const letter of text) {
          process.stdout.write(letter)

          time += letterDelay
          const dt = time - Date.now()
          if (dt > 0) {
            await sleep(dt)
          }
        }
      }
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
      remote("set", "")
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
        { ...state, reset } as StateInterface
      )

      await display(info.text)

      if (state.player.hp <= 0) {
        state.room = gameOverRoom
        continue
      }

      if (choices.length == 0) {
        break
      }

      for (let i = 0; i < choices.length; i++) {
        await display(`${i + 1}. ${choices[i].text}`, 1)
      }

      let choice: Choice
      while (true) {
        await display("> ", 0)
        const input = await new Promise<string>((resolve) => {
          const listener = (data: Buffer) => {
            process.stdin.removeListener("data", listener)
            resolve(data.toString().trim())
          }
          process.stdin.on("data", listener)
        })

        remote("push", `${input}\n`)

        if (shouldExit(input)) {
          break mainLoop
        } else if (shouldRemoteSet(input)) {
          remote("set", totalPushedOutput)
          continue
        } else if (shouldRemoteClear(input)) {
          remote("set", "")
          totalPushedOutput = ""
          continue
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
        if (!loadSavepoint(true)) {
          await display(savepointLoadErrorMessage)
        }
      } else if (consequence.room == "reset") {
        reset()
      } else if (consequence.room) {
        state.room = consequence.room
      }
    }

    process.stdin.pause()
  }
}

export default Game
