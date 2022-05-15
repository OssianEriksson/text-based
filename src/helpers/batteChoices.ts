import { Choice, Room, StateInterface } from "../game"
import { Serializable } from "../util/types"

export type BattleState = {
  opponentHp: number
}

export type AttacksBattleState = BattleState & { opponentName: string }

export type PlayerAttack = {
  text: string
  onChoose: () => {
    text: string
    counter: OpponentAttack
  }
  onWin: () => {
    text?: string
    room: Room<Serializable>
  }
}

export type OpponentAttack = {
  onChoose: () => {
    text: string
  }
  onDefeat: () => {
    text?: string
    room: Room<Serializable>
  }
}

function concat(a?: string, b?: string) {
  return (a ? `${a}\n\n` : "") + b || ""
}

export function generatePlayerAttacks(
  args: StateInterface,
  state: AttacksBattleState,
  NextRoom: Room<Serializable>,
  counters: OpponentAttack[]
): PlayerAttack[] {
  const randomCounter = () => counters[Math.floor(Math.random() * counters.length)]

  const onWin = () => ({
    text: `Du besegrade ${state.opponentName}!`,
    room: NextRoom,
  })

  return [
    ...(args.player.attributes.includes("baguette")
      ? [
          {
            text: `Slå ${state.opponentName} med baguetten.`,
            onChoose: () => ({
              text: `ERROR 404: "${state.opponentName} med baguetten" not found\n\n`,
              counter: randomCounter(),
            }),
            onWin,
          },
        ]
      : []),
    {
      text: `Banka på ${state.opponentName} med dina knytnävar`,
      onChoose: () => {
        const fajtas = args.player.attributes.includes("fajtas")
        const rippad = args.player.character == "rippad"

        let text: string
        if (fajtas) {
          if (rippad) {
            state.opponentHp -= 20
            text = "Du gör hela 20 hp skada då du är både rippad och bra på att fajtas!"
          } else {
            state.opponentHp -= 15
            text = "Du gör 15 hp skada eftersom du är bra på att fajtas!"
          }
        } else {
          if (rippad) {
            state.opponentHp -= 15
            text = "Du gör 15 hp skada eftersom du är rippad!"
          } else {
            state.opponentHp -= 10
            text = "Du gör 10 hp skada!"
          }
        }

        return {
          text,
          counter: randomCounter(),
        }
      },
      onWin,
    },
    ...(args.player.attributes.includes("excalibur")
      ? [
          {
            text: `Hugg ${state.opponentName} med excalibur!`,
            onChoose: () => {
              state.opponentHp -= 30
              return {
                text: "Du gör 30 hp skada!",
                counter: randomCounter(),
              }
            },
            onWin,
          },
        ]
      : []),
    ...(args.player.attributes.includes("pinne")
      ? [
          {
            text: `Peta på ${state.opponentName} med din pinne!`,
            onChoose: () => {
              state.opponentHp -= 45
              return {
                text: "Pinnen gör 45 hp skada!",
                counter: randomCounter(),
              }
            },
            onWin,
          },
        ]
      : []),
    ...(args.player.attributes.includes("räfs den legendariska krattan")
      ? [
          {
            text: `Kratta ${state.opponentName} med räfs den legendariska krattan!`,
            onChoose: () => ({
              text:
                "Räfs den legendariska krattan kan kratta allt!\n\n" +
                `Du krattar en snygg mittbena på ${state.opponentName}`,
              counter: randomCounter(),
            }),
            onWin,
          },
        ]
      : []),
  ]
}

export default function battleChoices(args: StateInterface, state: BattleState, attacks: PlayerAttack[]): Choice[] {
  return attacks.map(
    (attack): Choice => ({
      text: attack.text,
      onChoose: () => {
        const consequence = attack.onChoose()
        if (state.opponentHp <= 0) {
          const win = attack.onWin()
          return {
            text: concat(consequence.text, win.text),
            room: win.room,
          }
        }

        const counter = consequence.counter.onChoose()
        if (args.player.hp <= 0) {
          const defeat = consequence.counter.onDefeat()
          return {
            text: concat(consequence.text, concat(counter.text, defeat.text)),
            room: defeat.room,
          }
        }

        return {
          text: concat(consequence.text, counter.text),
        }
      },
    })
  )
}
