import { Choice, Consequence, Room } from "../game"
import AbabouFajt from "./ababou-fajt"
import { createGameOverRoom } from "../helpers/gameOver"
import battleChoices, { AttacksBattleState, generatePlayerAttacks } from "../helpers/batteChoices"
import ÅterTillSittningslokal from "./åter-till-sittningslokal"

const Integrallösning: Room = ({ player }) => {
  const wrongIntegralSolution = (text: string): Choice => {
    const consequence: Consequence = {
      text: "Det var fel lösning! Inte-graalen exploderar i dina händer och du dör.",
      room: createGameOverRoom(),
    }

    const choices: Choice[] = [
      {
        text: "Ja.",
        onChoose: () => consequence,
      },
      {
        text: "Nej.",
        onChoose: () => ({ room: Integrallösning }),
      },
    ]

    if (player.attributes.includes("tänka logiskt")) {
      return {
        text,
        onChoose: () => ({
          room: () => ({
            text: "Eftersom du är logiskt tänkande funderar du extra noga på om det där verkligen var rätt svar. Är du säker?",
            choices,
          }),
        }),
      }
    }

    if (player.attributes.includes("lösa gåtor")) {
      return {
        text,
        onChoose: () => ({
          room: () => ({
            text: "Eftersom du är bra på att lösa gåtor funderar du extra noga på om det där verkligen var rätt svar. Är du säker?",
            choices,
          }),
        }),
      }
    }

    return {
      text,
      onChoose: () => consequence,
    }
  }

  return {
    text:
      "Dvärgen verkar mycket intresserad.\n\n" +
      "[Slartibartfast]: Inte-graalen kan hjälpa oss se till att vi utvinner nog med energi! Jag heter Slartibartfast förresten.\n\n" +
      "Ni sätter er ner för att försöka lösa integralen som lyder\n\n" +
      "/(π/4)  1     \n" +
      "|     ----- dx\n" +
      "/0    cos x   \n\n" +
      "Vad är värdet av denna integral",
    choices: [
      wrongIntegralSolution("1"),
      wrongIntegralSolution("3 cos(sin(π/8))/2"),
      {
        text: "2 arctanh⁻¹(tan(π/8))",
        onChoose: () => ({
          text: "Det var rätt lösning! Allt fungerar, ni kommer nu att kunna få nog med energi. Just när ni ska jubla hör ni oväsen. Du går ut ur berget för att ta reda på var uppståndelsen beror på.",
          room: AbabouFajt,
        }),
      },
      wrongIntegralSolution("Γ(e)/2"),
      wrongIntegralSolution("Matematik är en illusion, endast gud kan veta svaret."),
    ],
  }
}

const AbabouEnd: Room = () => ({
  text:
    "Väl utanför berget vänder du dig om och ser hur hela berget kollapsar med ett brak. Dvärgarna är utrotade. Ababaou har dykt upp och går fram till dig med ett belåtet uttryck.\n\n" +
    "[Ababou]: Du har räddat Amazonerna och utrotat de fruktansvärda dvärgarna och deras fruktansvärda vetenskap. Nu är det dags för dig att resa hem.\n\n",
  choices: [
    {
      text: "Låt Ababou föra dig tillbaks till sittningen",
      onChoose: () => ({ room: ÅterTillSittningslokal }),
    },
  ],
})

type VetenskapspersonBattleState = AttacksBattleState & {
  stage: "introduction" | "battle"
}

const VetenskapspersonBattle: Room<VetenskapspersonBattleState> = function (args) {
  if (!this.state) {
    this.state = {
      opponentHp: 200,
      opponentName: "Slartibartfast",
      stage: "introduction",
    }
  }

  const state = this.state as VetenskapspersonBattleState

  const introduction = state.stage == "introduction"
  state.stage = "battle"

  const onDefeat = () => ({
    text: "Du har tagit så mycket skada att du dör. Slartibartfast har besegrat dig.",
    room: createGameOverRoom(),
  })

  return {
    text: introduction
      ? "Du gör dig redo för din slutgiltiga strid som ska fria hela lagomgård från dvärgharnas illegala påhitt. Slartibartfast stirrar ned dig och väntar på att du ska göra ditt första drag."
      : "Slartibartfast frustar ursinnigt åt dig. Vad gör du?",
    choices: battleChoices(
      args,
      state,
      generatePlayerAttacks(
        args,
        state,
        () => ({
          text:
            "Plötsligt orkar Slartibartfast inte attackera dig längre. Han sätter sig tungt ner i hörnet av rummet och suckar. Du har besegrat honom, men hur ska du kunna förgöra resten av dvärgarna?\n\n" +
            "Då hör du Ababous röst i ditt huvud: 'Använd satsen!' och plötsligt kommer du ihåg att du har inte-graalen med dig. Du modifierar den till en integral-sats som visar att dvärgarnas boning måste självförstöras om 90 sekunder givet vissa tekniska antaganden, som du hoppas är orelevanta vid denna praktiska tillämpning.",
          choices: [
            {
              text: "Spring ut från berget samma väg som du kom.",
              onChoose: () => ({ room: AbabouEnd }),
            },
          ],
        }),
        [
          {
            onChoose: () => {
              args.player.hp -= 15
              return {
                text: "Dvärghen hugger dig med sin hacka. Du tar 15 hp skada.",
              }
            },
            onDefeat,
          },
        ]
      )
    ),
  }
}

export const VetenskapspersonA: Room = function ({ player }) {
  return {
    text: "En bit in i berget kommer du in i ett laboratorium, En väggen har massa fula tavlor med orangea löv på sig och en annan har en whiteboardtavla med massa ekvationer, de andra har massa dragskåp och någravanliga skåp. Mitt i allt står en dvärg med vilt långt skägg och hår.",
    choices: [
      {
        text: "Attackera dvärghen!",
        onChoose: () => ({
          room: () => ({
            text:
              "Du springer fram för att ha en strid. Den gamla dvärghen vänder sig om och utbrister:\n\n" +
              "[Slartibartfast]: Vad gör du?! Vi är fredliga anarkister som utvecklar vårt samhälle till det bättre med kärnkraft!",
            choices: [
              {
                text: "Säg 'Fuck off' och attackera dvärghen!",
                onChoose: () => ({ room: VetenskapspersonBattle }),
              },
              {
                text: "Be dvärghen berätta mer, för du älskar ju kärnkraft för fan.",
                onChoose: () => ({
                  room: () => ({
                    text: "TODO: Lång dialog som beskriver anarkism",
                    choices: [
                      {
                        text: "Påpeka för dvärghen att du menade om kärnkraften... du har ju den heliga inte-graalen om ni behöver hjä...",
                        onChoose: () => ({
                          room: Integrallösning,
                        }),
                      },
                    ],
                  }),
                }),
              },
            ],
          }),
        }),
      },
      {
        text: "Lägg inte-graalen på ett bord brevid dvärghen.",
        onChoose: () =>
          player.attributes.includes("smyga")
            ? {
                text: "Du lyckas lägga inte-graalen på bordet tack vare dina speciella förmågor. Du springer sedan ut ur berget samma väg du kom.",
                room: AbabouEnd,
              }
            : {
                text: "Du blir upptäckt och måste gå i strid!",
                room: VetenskapspersonBattle,
              },
      },
      {
        text: "Skriv om inte-graalen så den kommer förstöra hela berget och säg till dvärgen att du är där för att hjälpa och kan lösa alla dvärgharnas problem.",
        onChoose: () =>
          player.attributes.includes("lösa gåtor") || player.attributes.includes("tänka logiskt")
            ? {
                text: "Du lyckas lura vetenskapspersonhen att din förändring av integralen är till det bättre, men när han böjer sig ned för att titta på den smiter du ut ur rummet och springer ut ut berget samma väg som du kom.",
                room: AbabouEnd,
              }
            : {
                text:
                  "Vetenskapspersonen avbryter dig och säger att du skrivit fel och att integralen skulle spränga er. Du är inte smart nog att kunna förklara dig ur situationen.\n\n" +
                  "Fan, tänker du, antar att det är dags för strid igen...",
                room: VetenskapspersonBattle,
              },
      },
    ],
  }
}

export const VetenskapspersonB: Room = function () {
  const NuclearRoom: Room = () => ({
    text: "[Slartibartfast] Integralen kan vara till hjälp för att utveckla kärnkraft åt oss dvärghar!",
    choices: [
      {
        text: "Kärnkraft? Nej tack!",
        onChoose: () => ({
          text: "Du ser hur Slartibartfasts ansikte mörknar och han blir fullständigt rasande.",
          room: VetenskapspersonBattle,
        }),
      },
      {
        text: "Okej, då tar vi väll och löser den så att ni kan ha massa energi.",
        onChoose: () => ({ room: Integrallösning }),
      },
    ],
  })

  return {
    text: "Du kommer in i ett laboratorium, En väggen har massa fula tavlor med orangea löv på sig och en annan har en whiteboardtavla med massa ekvationer, de andra har massa dragskåp och någravanliga skåp. Mitt i allt står en dvärg med vilt långt skägg och hår. Du presenterar dig, får veta att dvärghen heter Slartibartfast, och berättar sedan varför du är här...",
    choices: [
      {
        text: "Säg 'Amazonerna ha skickat mig för att döda er, men jag vill inte göra detta. Jag vill stoppa er miljöförstörelse med hjälp av den heliga inte-graalen.'",
        onChoose: () => ({ room: NuclearRoom }),
      },
      {
        text: "Påstå att du kan lösa alla Slartibartfasts problem.",
        onChoose: () => ({
          text:
            "[Slartibartfast]: TODO: Lång dialog som beskriver anarkism.\n\n" +
            "Du säger att vad du menade var att du kan hjälpa Slartibartfast sätta stopp för miljöförstörelsen genom forskning och din inte-graal",
          room: NuclearRoom,
        }),
      },
    ],
  }
}
