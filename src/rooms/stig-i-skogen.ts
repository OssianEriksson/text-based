import { Choice, Room } from "../game"
import Beztown from "./beztown"

type State = {
  stage: "introduction" | "talk" | "quest"
  visited: boolean
  dialogueQuest: Choice[]
  letatUnderTräd: boolean
  letatUnderStenar: boolean
  letatIGräs: boolean
  stulitGräs: boolean
}

const StigISkogen: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      stage: "introduction",
      visited: false,
      dialogueQuest: [],
      letatUnderTräd: false,
      letatUnderStenar: false,
      letatIGräs: false,
      stulitGräs: false,
    }
  } else {
    this.state.visited = true
  }

  const state = this.state as State

  switch (state.stage) {
    case "introduction":
      return {
        text:
          "Du går genom den ledsna skogen på den lilla stigen och stöter plötsligt på en till Amazon, återigen klädd i arbetskläder med reflexväst. Hon ser djupt besvärad ut och ett stort utropstecken svävar över hennes huvud.",
        choices: [
          {
            text: "Ignorera henne.",
            onChoose: () => ({ room: Beztown }),
          },
          {
            text: "Prata med henne.",
            onChoose: () => {
              state.stage = "talk"
              return {
                text:
                  "Du går fram och pratar med Amazonen.\n\n" +
                  "[Lena den Letande]: Hej, mitt namn är Lena. säg, du råkar inte vara intresserad av en episk quest?",
              }
            },
          },
        ],
      }
    case "talk":
      return {
        text: "Väljer du att acceptera questen: 'INSERT_NAME_OF_QUEST#526'?",
        choices: [
          {
            text: "Ja!",
            onChoose: () => {
              state.stage = "quest"
              return {
                text:
                  "[Lena den Letande] Åh, vad underbart. Jag visste att du var en lättlu- jag menar en pålitlig person.",
              }
            },
          },
          {
            text:
              "Asså, jag vet inte... jag är lite upptagen liksom... har en värld att rädda... en annan gång kanske.",
            onChoose: () => ({
              text:
                "[Lena den Letande]: Okej, vem bryr sig.\n\n" + "Lena fortsätte leta och du går vidare genom skogen",
              room: Beztown,
            }),
          },
          {
            text: "Vad i... vadå 'acceptera quest', och varför har hon ett utropstecken ovanför huvudet!?",
            onChoose: () => {
              state.stage = "quest"
              return {
                text:
                  "[Lena den Letande] Åh, vad underbart. Jag visste att du var en lättlu- jag menar en pålitlig person.\n\n" +
                  "[Du]: Va? Jag sa inte...",
              }
            },
          },
        ],
      }
    case "quest":
      return {
        text:
          "[Lena den Letande]: Jag har tyvärr råkat tappa bort en kraftfull vetenskaplig kvantkristall. Den borde ligga här någonstans. Säg till om du hittar något som utstrålar vetenskaplighet.",

        choices: [
          {
            text: "Leta på stenarna.",
            onChoose: () => {
              return {
                text:
                  "Du letar på stenarna men hittar ingenting.\n\n" +
                  "[Lena den letande]: Fortsätt leta, den måste finnas här någonstans.",
              }
            },
          },
          ...(!state.letatUnderStenar
            ? [
                {
                  text: "Leta under stenarna.",
                  onChoose: () => {
                    player.healingPotions++
                    return {
                      text:
                        "Du letar under stenarna och hittar en helande trolltryck!.\n\n" +
                        "[Lena den letande]: Vackert fynd! Snart hittar vi den!.",
                    }
                  },
                },
              ]
            : []),
          ...(!state.letatUnderTräd
            ? [
                {
                  text: "Leta i träden.",
                  onChoose: () => {
                    return {
                      text:
                        "Du letar i träden men hittar bara löv och arga grävlingar.\n\n" +
                        "[Lena den letande]: Det går ju bra det här, snart hittar vi den.",
                    }
                  },
                },
                {
                  text: "Leta under träden.",
                  onChoose: () => {
                    state.letatUnderTräd = true
                    player.gold += 30
                    return {
                      text:
                        "Du gräver upp alla träd och letar under dem, men hittar bara maskar och 30 guldmynt.\n\n" +
                        "[Lena den letande]: Det går ju bra det här, snart hittar vi den.",
                    }
                  },
                },
              ]
            : []),
          {
            text: "Leta uppe i luften.",
            onChoose: () => {
              return {
                text:
                  "Du försöker leta efter kristallen i luften men ser bara färgglada fåglar.\n\n" +
                  "[Lena den Letande]: Bra initiativ, fortsätt så.",
              }
            },
          },
          {
            text: "Leta i gräset.",
            onChoose: () => {
              return {
                text:
                  "Du försöker letar i gräset men hittar bara insekter och, tja, gräs.\n\n" +
                  "[Lena den Letande]: Var försiktig med gräset! Det är dyrbart.",
              }
            },
          },
          ...(state.letatIGräs && !state.stulitGräs
            ? [
                {
                  text: "Stjäl lite gräs.",
                  onChoose: () => {
                    state.stulitGräs = true
                    player.attributes.push("gräs")
                    return {
                      text: "Du tar lite gräs medan Lena tittar bort.",
                    }
                  },
                },
              ]
            : []),
          {
            text: "Leta i ditt undermedvetna.",
            onChoose: () => {
              return {
                text:
                  "Du gräver i ditt undermetvetna men blir rädd av vad du hittar där.\n\n" +
                  "[Lena den Letande]: Jag... tror inte att kristallen finns där.",
              }
            },
          },
          {
            text: "Peta på utropstecknet över Lenas huvud.",
            onChoose: () => {
              player.copper += 2
              return {
                text:
                  "När du petar på utropstecknet trillar det ner i Lenas huvud.\n\n" +
                  "[Lena den Letande]: AJ! Vad fan... Aha, där är ju kvantkristallen. Det förklarar varför jag inte hittade den. Tack så jättemycket! Här har du för din hjälp.\n\n" +
                  "Du får 2 kopparmynt av Lena som tack för hjälpen.\n\n" +
                  "[Lena den Letande]: Adjö, och lycka till på din färd o noble letare!",
                room: Beztown,
              }
            },
          },
          {
            text: "Begär mer info om kvantkristallen.",
            onChoose: () => {
              return {
                text:
                  "[Lena den Letande]: Den vetenskapliga kvantkristallen består av två delar, en som är lite större och en som är lite mindre. Den är ganska stor och har en tendens att befinna sig i närheten av Amazoner. Dessutom utstrålar den en massa vetenskaplighet.",
              }
            },
          },
        ],
      }
  }
}

export default StigISkogen
