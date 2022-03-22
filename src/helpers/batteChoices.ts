import { Choice, Room, StateInterface } from "../game"

export type BattleState = {
  opponentHp: number
}

export type PlayerAttack = {
  text: string
  onChoose: () => {
    text: string
    counter: OpponentAttack
  }
  onWin: () => {
    text?: string
    room: Room<any>
  }
}

export type OpponentAttack = {
  onChoose: () => {
    text: string
  }
  onDefeat: () => {
    text?: string
    room: Room<any>
  }
}

function concat(a?: string, b?: string) {
  return (a ? `${a}\n\n` : "") + b || ""
}

export default function battleChoices(
  args: StateInterface,
  state: BattleState,
  attacks: PlayerAttack[]
): Choice[] {
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
