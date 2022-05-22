import { Choice, Consequence, Room, RoomInfo } from "../game"
import battleChoices, { BattleState, OpponentAttack } from "../helpers/batteChoices"
import { createGameOverRoom } from "../helpers/gameOver"
import BroKalle from "./bro-kalle"

type State = {
  stage: "introduction" | "battle"
  nextEnemyAttack: "ciliepiska" | "sötvattenmagi"
  againMsg: string
  stillMsg: string
  battle: BattleState
}

const BroToffoleau: Room<State> = function (args) {
  const { player } = args

  if (!this.state) {
    this.state = {
      stage: "introduction",
      nextEnemyAttack: "ciliepiska",
      againMsg: "",
      stillMsg: "",
      battle: {
        opponentHp: 1,
      },
    }
  }

  const state = this.state as State

  const onWin = () => ({
    text: "Du besegrade Toffeldjuret Toffoleau!",
    room: BroKalle,
  })

  const GameOver = createGameOverRoom(
    "Du har tagit så mycket skada att du dör. Toffeldjuret Toffoleau har besegrat dig. Spelet är slut."
  )

  const onDefeat = () => ({ room: GameOver })

  const swimChoice: Choice = {
    text: `Försök simma över ravinen${state.againMsg}.`,
    onChoose: () => {
      const swimDamage: number = 5

      player.hp -= swimDamage
      const consequence: Consequence = {
        text: `Du försöker simma över ravinen${state.againMsg} men du kan inte simma på pålar${state.againMsg}. Du misslyckas och tar ${swimDamage} hp skada${state.againMsg}.`,
        ...(player.hp <= 0 && { room: GameOver }),
      }
      state.againMsg = " igen"
      return consequence
    },
  }

  if (state.stage == "introduction") {
    return {
      text: "Efter att ha lyckats undfly Amöban Möbius fortsätter du din vandring och kommer snabbt fram till en ny bro. Den här gången är det en mycket smal bro i sen gotisk stil som löper över en ravin fylld med vassa pålar. Det finns ingen levande varelse så långt du kan se och ingen annan väg över.",
      choices: [
        {
          text: "Försök gå över bron.",
          onChoose: () => {
            state.stage = "battle"
            return {
              text:
                "Så fort du sätter din fot på den gotiska stenen ser du hur något går mot dig från andra sidan bron. Det är en varelse iklädd svart heltäckande rustning men med tofflor istället för stövlar. Först tror du att det är en ofarlig orc men sen inser du till din stora fasa vad det egentligen är!\n\n" +
                "[Toffeldjuret Toffoleau]: HÅHÅ! Jag är Toffeldjuret Toffoleau, väktare över bro nummer 2, denna bro som du valt att begå. om du andra sidan vill nå måste du besegra mig, sådeså!",
            }
          },
        },
        swimChoice,
      ],
    }
  } else {
    const cilDamage: number = 2e-14
    const waterDamage: number = 3e-14

    let opponentAttack: OpponentAttack
    if (state.nextEnemyAttack == "ciliepiska") {
      opponentAttack = {
        onChoose: () => {
          player.hp -= cilDamage
          return {
            text: `Toffeldjuret Toffoleau använder ciliepiska och piskar dig med sina cilier. Du tar ${cilDamage} hp skada.`,
          }
        },
        onDefeat,
      }
      state.nextEnemyAttack = "sötvattenmagi"
    } else if (state.nextEnemyAttack == "sötvattenmagi") {
      opponentAttack = {
        onChoose: () => {
          player.hp -= waterDamage * 0.01 * player.hp
          return {
            text: `Toffeldjuret Toffoleau använder magi från sötvattensjöar, dess naturliga habitat. Du tar ${waterDamage}% av din nuvarande hp som skada.`,
          }
        },
        onDefeat,
      }
      state.nextEnemyAttack = "ciliepiska"
    }

    const ri: RoomInfo = {
      text: `Toffeldjuret Toffoleau iklädd svart rustning och tofflor står${state.stillMsg} i din väg. Vad gör du?`,
      choices: [
        swimChoice,
        ...battleChoices(args, state.battle, [
          {
            text: "Krossa honom med din tå.",
            onChoose: () => {
              state.battle.opponentHp = 0
              return {
                text:
                  "Toffoleaus rustning är så stor och tung att han inte hinner undvika din tå utan krossas skoningslöst.\n\n" +
                  "[Toffeldjuret Toffoleau]: OH NO! Jag blev krossad av din tå. Du besgrade mig, så vidare du får gå. Hejdå.",
                counter: opponentAttack,
              }
            },
            onWin,
          },
          {
            text: "Förvirra honom genom att citera numerisk-analys-föreläsningar.",
            onChoose: () => ({
              text:
                "Du börjar gå igenom ruskigt förvirrande innehåll från numalgen, men Toffoleau står emot.\n\n" +
                "[Toffeldjuret Toffoleau]: HÅ! Jag kunde spå att numerisk analys du skulle tillgå. Jag har därför kollat på Kopior av föreläsningsanteckningar, håhå. Allt du säger kommer jag förstå!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Förför honom genom att vädja till hans imponerande rustning och spartanska tofflor.",
            onChoose: () => ({
              text: "[Toffeldjuret Toffoleau]: No no no, Amöban Möbius kanske dina trick går på, men ditt smicker biter inte på Toffoleau!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Gå över bron.",
            onChoose: () => ({
              text:
                "Du försöker gå rakt fram, men Toffeldjuret Toffoleau står i din väg och låter dig inte passera.\n\n" +
                "[Toffeldjuret Toffoleau]: Din idiot! Om du förbi mig vill gå måste du försöka hårdare än så!",
              counter: opponentAttack,
            }),
            onWin,
          },
          // {
          //   text: "Attackera med ditt vapen.",
          //   onChoose: () => {
          //     if (player.attributes.includes("fäktning")) {
          //       state.battle.opponentHp = 0
          //       return {
          //         text:
          //           "Tack vare dina episka fäktningsskills lyckas du träffa Toffoleau trots att han är pytteliten. \n\n" +
          //           "[Toffeldjuret Toffoleau]: OH NO! Ditt vapen träffade mig prick på. Jag kan din attack inte emotstå. Du har mig besegrat, jag säger så! Till andra sidan, du får gå.",
          //         counter: opponentAttack,
          //       }
          //     } else {
          //       return {
          //         text:
          //           "Du försöker träffa Toffeldjuret Toffoleau med ditt vapen, men trots rustningen är han för liten för att du ska träffa rätt. \n\n" +
          //           "[Toffeldjuret Toffoleau]: Kom an då! Är du inte bättre än så? Du behöver vara skickligare om du mig ska klå.",
          //         counter: opponentAttack,
          //       }
          //     }
          //   },
          //   onWin,
          // },
          {
            text: "Gå åt höger.",
            onChoose: () => ({
              text:
                "Bron är för smal för att du ska kunna gå åt sidan.\n\n" +
                "[Toffeldjuret Toffoleau]: HÅ HÅ HÅ! Det där kommer inte gå. Om du förbi mig vill nå måste du emot min råa styrka bestå!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Gå åt vänster.",
            onChoose: () => ({
              text:
                "Bron är för smal för att du ska kunna gå åt sidan.\n\n" +
                "[Toffeldjuret Toffoleau]: HÅ HÅ HÅ! Det där kommer inte gå. Om du förbi mig vill nå måste du emot min råa styrka bestå!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Tunnla igenom honom.",
            onChoose: () => ({
              text:
                "Du försöker tunnla igenom Toffoleau, men han är för liten för att du ska kunna fokusera på honom!\n\n" +
                "[Toffeldjuret Toffoleau]: SÅ, du försöker tunnla genom Toffoleau, men det kommer inte gå! I en ärlig duell, du måste mig slå, om du andra sidan vill nå.",
              counter: opponentAttack,
            }),
            onWin,
          },
        ]),
      ],
    }

    state.stillMsg = " fortfarande"

    return ri
  }
}

export default BroToffoleau
