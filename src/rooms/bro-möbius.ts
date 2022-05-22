import { Choice, Room } from "../game"
import gameOver from "../helpers/gameOver"
import BroToffoleau from "./bro-toffoleau"

type State = {
  stage: "introduction" | "troll battle"
  againMsg: string
  stillMsg: string
  opponentAttack: "nothing" | "fagocytos" | "cellgift"
  poisonCount: number
  positionOnBridge: number
}

function concat(a: string, b: string) {
  return (a ? `${a}\n\n` : "") + b
}

const BroMöbius: Room<State> = function (args) {
  const { player } = args

  if (this.state === undefined) {
    this.state = {
      stage: "introduction",
      againMsg: "",
      stillMsg: "",
      opponentAttack: "nothing",
      poisonCount: 0,
      positionOnBridge: 0,
    }
  }

  const state = this.state as State

  if (player.hp <= 0) {
    return gameOver(args, "Du har tagit så mycket skada att du dör. Amöban Möbius har besegrat dig. Spelet är slut.")
  }

  const swimDamage = 5
  const phagocytosisDamage = 2e-14
  const poisonDamage = 1e-14

  const swimChoice: Choice = {
    text: `Försök att simma över ån${state.againMsg}.`,
    onChoose: () => {
      player.hp -= swimDamage
      const text = `Du försöker simma över ån${state.againMsg} men strömmen är för stark${state.againMsg}. Du misslyckas och tar ${swimDamage} hp skada${state.againMsg}.`
      state.againMsg = "igen"
      return { text }
    },
  }

  if (state.stage == "introduction") {
    return {
      text: "Du kommer fram till en kort men bred bro i tidig antik stil med höga marmorkolonner och statyer föreställande lättklädda mikroorganismer. Bron går över en djup och bred å med en stark ström. Det finns ingen levande varelse så långt du kan se och ingen annan väg över.",
      choices: [
        {
          text: "Försök gå över bron.",
          onChoose: () => {
            state.stage = "troll battle"
            return {
              text:
                "Så fort du sätter din fot på den vita marmorn ser du hur något dyker upp från brons undersida och hoppar upp framför dig med ofattbart snabba parkouriga rörelser. Vid första anblick tror du att ett mesigt troll försöker blockera din väg, men när den mystiska varelsen stannat upp ser du till din förskräckelse att det är något mycket värre!\n\n" +
                "[Amöban Möbius]: Jag är Möbius Amöba, du dödade min bror, förbered dig på att dö!",
            }
          },
        },
        swimChoice,
      ],
    }
  }

  let text: string = ""
  if (state.opponentAttack == "nothing") {
    state.opponentAttack = "fagocytos"
  } else if (state.opponentAttack == "fagocytos") {
    player.hp -= phagocytosisDamage
    text = `Amöban Möbius använder fagocytos och fagocyterar en av dina döda hudceller. Du tar ${phagocytosisDamage} hp skada.`
    state.opponentAttack = "cellgift"
  } else if (state.opponentAttack == "cellgift") {
    state.poisonCount = 3
    text = `Amöban Möbius använder cellgift. Du tar ${poisonDamage} hp skada under ${state.poisonCount} rundor.`
    state.opponentAttack = "fagocytos"
  }

  if (state.poisonCount > 0) {
    player.hp -= poisonDamage
    state.poisonCount--
    text = concat(
      text,
      `Du tar ${poisonDamage} hp skada på grund av cellgift. Du är förgiftad i ${state.poisonCount} rund(or|a) till.`
    )
  }

  text = concat(text, `Amöban Möbius står${state.stillMsg} i din väg. Vad gör du? Du har ${player.hp} hp.`)
  state.stillMsg = " forfarande"

  return {
    text,
    choices: [
      {
        text: "Trampa på honom.",
        onChoose: () => ({
          text:
            "Du försöker trampa på Möbius, men han är så liten att han försvinner in i marken under din sko.\n\n" +
            "[Amöban Möbius]: Bra försök, men jag är för snabb och smidig för att träffas av dina attacker. Inse att du är utklassad!",
        }),
      },
      {
        text: "Förvirra honom genom att citera termoföreläsningar.",
        onChoose: () => ({
          text:
            "Du börjar gå igenom ruskigt förvirrande innehåll från termon, men Möbius verkar helt opåverkad.\n\n" +
            "[Amöban Möbius]: HA! Jag förutsåg att du skulle försöka förvirra mig med termoföreläsningar, därför har jag läst in hela förra årets kursinnehåll. Jag förstår allt vad du pratar om!",
        }),
      },
      {
        text: "Förför honom genom att vädja till hans ofattbara storhet och styrka.",
        ...(player.attributes.includes("förföra")
          ? {
              onChoose: () => ({
                text:
                  "[Amöban Möbius]: Åh, jag vet inte, du är inte så dum du heller. Vet du vad, eftersom du är så stilig låter jag dig passera. Ta det försiktigt.\n\n" +
                  "Du känner en rysning genom kroppen när Amöban Möbius skickar en slängkyss åt ditt håll. Efter den svåra och lite obehagliga striden går du vidare genom skogen.\n\n" +
                  "Du besegrade Amöban Möbius!",
                room: BroToffoleau,
              }),
            }
          : {
              onChoose: () => ({
                text: "[Amöban Möbius]: Ah, jag hör att du inser vilken episk krigare jag är. I så fall borde du också inse att du är chanslös. Det är bara att ge upp!",
              }),
            }),
      },
      {
        text: "Gå över bron.",
        ...(state.positionOnBridge != 0
          ? {
              onChoose: () => ({
                text:
                  "Du lyckas gå förbi Möbius som blir skitförbannad.\n\n" +
                  "[Amöban Möbius]: Vänta! Kom tillbaka, din fegis! Jag är inte klar med dig! Kom och slåss som en riktigt eukaryot! Hör du mig? Kom hit du din bakterie!\n\n" +
                  "Du besegrade Amöban Möbius!",
                room: BroToffoleau,
              }),
            }
          : {
              onChoose: () => ({
                text:
                  "Du försöker gå rakt fram, men Amöban Möbius står i din väg och låter dig inte passera.\n\n" +
                  "[Amöban Möbius]: Din idiot! Om du vill ta dig förbi mig måste du försöka hårdare än så!",
              }),
            }),
      },
      {
        text: "Attackera med ditt vapen",
        onChoose: () => ({
          text:
            "Du försöker träffa Amöban Möbius med ditt vapen, men han är så liten att du inte lyckas.\n\n" +
            "[Amöban Möbius]: Dina attacker är lönlösa. Inget vapen kan träffa mig!",
        }),
      },
      {
        text: "Gå åt höger",
        onChoose: () => {
          let text: string
          if (state.positionOnBridge >= 1) {
            text = "Du befinner dig redan på brons högra sida."
          } else {
            state.positionOnBridge++
            text = "Du går åt höger."
          }

          text = concat(
            text,
            "[Amöban Möbius]: Jag förstår, du försöker undvika min attacker men det är lönlöst. Smaka på det här!"
          )
          return { text }
        },
      },
      {
        text: "Gå åt vänster",
        onChoose: () => {
          let text: string
          if (state.positionOnBridge <= -1) {
            text = "Du befinner dig redan på brons vänstra sida."
          } else {
            state.positionOnBridge--
            text = "Du går åt vänster."
          }

          text = concat(
            text,
            "[Amöban Möbius]: Jag förstår, du försöker undvika min attacker men det är lönlöst. Smaka på det här!"
          )
          return { text }
        },
      },
      {
        text: "Tunnla igenom honom.",
        onChoose: () => ({
          text: "Du försöker tunnla igenom Möbius, men han är för liten för att du ska kunna hitta honom!",
        }),
      },
      {
        text: "Insistera på att du inte dödade hans bror.",
        onChoose: () => ({
          text:
            "Du försöker förklara för Möbius att du inte dödat hans bror, men han tror dig inte!\n\n" +
            "[Amöban Möbius]: HA! Försök inte, jag såg minsann hur du skoningslöst trampade ihjäl honom precis innan du klev upp på bron. Jag såg ondskan i dina ögon när du illvilligt klämde livet ur honom!",
        }),
      },
      swimChoice,
    ],
  }
}

export default BroMöbius
