import { Choice, Consequence, Room, RoomInfo } from "../game"
import battleChoices, { BattleState, OpponentAttack } from "../helpers/batteChoices"
import { createGameOverRoom } from "../helpers/gameOver"
import Sittningslokal from "./sittningslokal"

type State = {
  stage: "introduction" | "battle"
  nextEnemyAttack: "metanmoln" | "hypertermofil blast"
  againMsg: string
  stillMsg: string
  opponentConfused: boolean
  argumentPath: "before" | "ready" | "last"
  battle: BattleState
}

const BroKalle: Room<State> = function (args) {
  const { player } = args

  if (!this.state) {
    this.state = {
      stage: "introduction",
      nextEnemyAttack: "metanmoln",
      againMsg: "",
      stillMsg: "",
      opponentConfused: false,
      argumentPath: "before",
      battle: {
        opponentHp: 1,
      },
    }
  }

  const state = this.state as State

  const onWin = () => ({
    text: "Du besegrade Arkén Kalle!",
    room: Sittningslokal,
  })

  const GameOver = createGameOverRoom(
    "Du har tagit så mycket skada att du dör. Arkén Kalle har besegrat dig. Spelet är slut."
  )

  const onDefeat = () => ({ room: GameOver })

  const swimChoice: Choice = {
    text: `Försök simma över lavaån${state.againMsg}.`,
    onChoose: () => {
      const swimDamage: number = 5

      player.hp -= swimDamage
      const consequence: Consequence = {
        text: `Du försöker simma över lavaån${state.againMsg} men bränner dig på lavan${state.againMsg}. Du misslyckas och tar ${swimDamage} hp skada${state.againMsg}.`,
        ...(player.hp <= 0 && { room: GameOver }),
      }
      state.againMsg = " igen"
      return consequence
    },
  }

  if (state.stage == "introduction") {
    return {
      text:
        "Duellen mot Toffoleau lämnar dig skakad när du fortsätter genom skogen. Efter ett tag ser du en god och en dålig nyhet. Den goda nyheten är att du ser skogens slut på andra sidan en å, den dåliga är att ån består av lava. Det måste vara en gren av den stora lavaflod du nyligen passerat över.\n\n" +
        "Över lavaån går en lagom bred bro i art nouveau stil. Det finns återigen ingen levande varelse så långt du kan se och ingen annan väg över.",
      choices: [
        swimChoice,
        {
          text: "Försök gå över bron.",
          onChoose: () => {
            state.stage = "battle"
            return {
              text:
                "Så fort du sätter din fot på art nouveau stenen känner du en varm vindpust och med den flyger en ny fiende in som blockerar din väg! Men vad är det för något? Är det en fågel? Är det ett flygplan? Nej, det är något mycket värre\n\n" +
                "[Arkén Kalle]: HEHEHE! Jag är Kalle Arké, väktare av bro nummer 3, denna bro som du här kan se. Du måste besgra mig med, om till andra sidan dig vill bege.",
            }
          },
        },
      ],
    }
  } else {
    const opponentAttack: OpponentAttack = {
      onChoose: () => {
        const metDamage: number = 2e-14
        const termoDamage: number = 3e-14

        let text: string = ""
        if (state.nextEnemyAttack == "metanmoln") {
          player.hp -= metDamage
          text = `Arkén Kalle använder metanmoln och sprutar metan på dig. Du tar ${metDamage} hp skada.`
          state.nextEnemyAttack = "hypertermofil blast"
        } else if (state.nextEnemyAttack == "hypertermofil blast") {
          player.hp -= termoDamage * 0.01 * player.hp
          text = `Arkén Kalle framkallar varmluft från vulkaniska källor, dess naturliga habitat. Du tar ${termoDamage}% av din nuvarande hp som skada.`
          state.nextEnemyAttack = "metanmoln"
        }

        if (state.argumentPath == "before") {
          state.argumentPath = "ready"
        }

        return { text }
      },
      onDefeat,
    }

    const ri: RoomInfo = {
      text: `Arkén Kalle virvlar${state.stillMsg} runt i luften och blockerar din väg${
        state.opponentConfused ? ", märkbart förvirrad" : ""
      }. Vad gör du?`,
      choices: [
        swimChoice,
        ...battleChoices(args, state.battle, [
          {
            text: "Smäll honom med dina händer.",
            onChoose: () => ({
              text:
                "Du försöker smälla till kalle, men han flyger iväg i luftflödet från din hand.\n\n" +
                "[Arkén Kalle]: Det är ingen idé! Jag förutsåg att du skulle försöka smälla mig med dina händer. Du kommer aldrig besegra mig sådär!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Förvirra honom genom att citera _______ linjär-algebra-föreläsning.",
            onChoose: () => {
              if (player.attributes.includes("lösa gåtor")) {
                state.opponentConfused = true
                return {
                  text:
                    "Med dina kunskaper om gåtor börjar du rabbla upp fruktansvärt förvirrande och gåtfulla aspekter av linalgen vilket påverkar Kalle märkbart.\n\n" +
                    "[Arkén Kalle]: Vafalls! Hur kan du ha så djupgående kunskaper om linjär algebra? Det här kom inte på någon av tentorna jag övat på! Jag känner mig helt förvirrad...",
                  counter: opponentAttack,
                }
              } else {
                return {
                  text:
                    "Du börjar rabbla upp förvirrande innehåll du minns från linalgen, men Kalle står emot.\n\n" +
                    "[Arkén Kalle]: HEHE, det är lönlöst. Jag förutsåg att du skulle försöka förvirra mig med linjär algebra, därför har jag övat på inte mindre än 15 gamla linalg-tentor! Det finns inget du kan göra som jag inte redan förutsett!",
                  counter: opponentAttack,
                }
              }
            },
            onWin,
          },
          {
            text: "Förför honom genom att vädja till hans flödande dynamik och heta hypertermofili.",
            onChoose: () => ({
              text: "[Arkén Kalle]: Ah, du tänkte säkert att du kunde förföra mig med dina smickrande vetenskapliga begrepp, men det du inte vet är att jag förutsåg ditt drag och inte låter mig luras! Inse att jag kan alla dina drag!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Gå över bron.",
            onChoose: () => ({
              text:
                "Du försöker gå rakt fram, men Arkén Kalle flyger i din väg och låter dig inte passera.\n\n" +
                "[Arkén Kalle]: HA! Du tänkte visst att du kunde smita förbi mig, men det är precis vad jag räknade ut att du skulle göra. Oavsett hur du rör dig kommer jag flyga i din väg, jag är förberedd på allt du kan komma på!",
              counter: opponentAttack,
            }),
            onWin,
          },
          // {
          //   text: "Attackera med ditt vapen",
          //   onChoose: () => ({
          //     text:
          //       "Du försöker träffa Kalle Arké med ditt vapen, men han flyger runt för snabbt för att du ska kunna träffa. \n\n" +
          //       "[Arkén Kalle]: ",
          //     counter: opponentAttack,
          //   }),
          //   onWin,
          // },
          {
            text: "Gå åt höger",
            onChoose: () => ({
              text:
                "Bron är för smal för att du ska kunna gå åt sidan.\n\n" +
                "[Arkén Kalle]: HÅ HÅ HÅ! Det där kommer inte gå. Om du förbi mig vill nå måste du emot min råa styrka bestå!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Gå åt vänster",
            onChoose: () => ({
              text:
                "Bron är för smal för att du ska kunna gå åt sidan.\n\n" +
                "[Arkén Kalle]: HÅ HÅ HÅ! Det där kommer inte gå. Om du förbi mig vill nå måste du emot min råa styrka bestå!",
              counter: opponentAttack,
            }),
            onWin,
          },
          {
            text: "Tunnla igenom honom.",
            onChoose: () => ({
              text:
                "Du försöker tunnla igenom Kalle, men han är för liten för att du ska kunna fokusera på honom!\n\n" +
                "[Arkén Kalle]: SÅ, du försöker tunnla genom Kalle, men det kommer inte gå! I en ärlig duell, du måste mig slå, om du andra sidan vill nå.",
              counter: opponentAttack,
            }),
            onWin,
          },
          ...(player.attributes.includes("tänka logiskt")
            ? [
                {
                  text: "[Logiskt tänkande]: Vänta lite, en Arké kan väl inte prata!?",
                  onChoose: () => {
                    state.battle.opponentHp = 0

                    return {
                      text: "Du inser att en Arké inte kan prata, än mindre förnimmas på något väsentligt vis och absolut omöjligen blockera din väg! Du bestämmer dig för att ignorera Kalle och gå förbi.",
                      counter: opponentAttack,
                    }
                  },
                  onWin,
                },
              ]
            : []),
          ...(state.argumentPath == "ready"
            ? [
                {
                  text: "Insistera på att han omöjligen kan ha förutsett ALLA dina drag.",
                  onChoose: () => {
                    state.argumentPath = "last"

                    return {
                      text:
                        "Du insisterar på att Kalle inte kan vara så förutseende som han påstår, men han avfärdar dina argument.\n\n" +
                        "[Arkén Kalle]: Var försiktigt, du är minsann inte den första som underskattar min förutseende förmåga. Jag lovar dig, jag kan förutse alla framtida drag i vår duell!",
                      counter: opponentAttack,
                    }
                  },
                  onWin,
                },
              ]
            : []),
          ...(state.argumentPath == "last"
            ? [
                {
                  text: "Om han kan förutse alla drag i duellen borde han också förutse att han kommer dö av ålder innan han hinner åsamka dig någon märkbar skada.",
                  onChoose: () => {
                    state.battle.opponentHp = 0
                    return {
                      text: "[Arkén Kalle]: HAHAHAHAHA... *tänker efter*... fan också. Okej, okej, jag vet när jag har förlorat en duell i logik. Du vinner, stick iväg innan jag ändrar mig.",
                      counter: opponentAttack,
                    }
                  },
                  onWin,
                },
              ]
            : []),
        ]),
      ],
    }

    state.stillMsg = " fortfarande"

    return ri
  }
}

export default BroKalle
