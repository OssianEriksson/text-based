import { Choice, Room } from "../game"
import Beztown from "./beztown"
import StigISkogen from "./stig-i-skogen"

type State = {
  stage: "introduction" | "speak to amazon"
  isFirstText: boolean
  looked: boolean
  lookedPinne: boolean
  lookedGPS: boolean
  lookedExcalibur: boolean
  talkedToKristin: boolean
  dialogueKratta: Choice[]
  demandKratta: boolean
  choicesKratta: Choice[]
  dialogueBeztown: Choice[]
}

const SkogStart: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      stage: "introduction",
      isFirstText: true,
      looked: false,
      lookedPinne: false,
      lookedGPS: false,
      lookedExcalibur: false,
      talkedToKristin: false,

      dialogueKratta: [
        {
          text: "Varför krattar du?",
          onChoose: () => {
            state.dialogueKratta.shift()
            return { text: "[Kristin den Krattande] Det är min plikt som Amazon!" }
          },
        },

        {
          text: "Men, du krattar ju inte någonting, vad är poängen?",
          onChoose: () => {
            state.dialogueKratta.shift()
            return { text: "[Kristin den Krattande] Det är min plikt som Amazon!" }
          },
        },

        {
          text: "Fast, om du slutade kratta skulle det ju inte göra någon skillnad alls. Så jag förstår inte varför...",
          onChoose: () => {
            state.dialogueKratta.shift()
            return { text: "[Kristin den Krattande] Det är min plikt som Amazon!" }
          },
        },

        {
          text: "Kan jag få din kratta!?",
          onChoose: () => {
            state.demandKratta = true
            return { text: "[Kristin den Krattande] Nej." }
          },
        },
      ],

      demandKratta: false,
      choicesKratta: [
        {
          text: "Förför Kristin för att få tag på krattan.",
          onChoose: () => {
            if (player.attributes.includes("vara uthållig")) {
              player.attributes.push("räfs den legendariska krattan")
              return {
                text:
                  "Kristin blir imponerad av dina krattningsfärdigheter.\n\n" +
                  "[Kristin den Krattande] Åh, sicken uthållighet, sicken teknik. Du är verkligen en äkta krattare. Varsågod, jag överlämnar 'Räfs' den legendariska krattan till dig. Med räfs kan du kratta vad som helst.",
              }
            } else {
              return { text: "[Kristin den Krattande] Ha! Det där biter inte på mig. Du är inte värdig denna kratta" }
            }
          },
        },
        {
          text: "Övertala Kristin att ge dig krattan.",
          onChoose: () => {
            if (player.attributes.includes("lösa gåtor")) {
              player.attributes.push("räfs den legendariska krattan")
              return {
                text:
                  "Kristin blir imponerad av dina krångliga gåtfyllda resonemang.\n\n" +
                  "[Kristin den Krattande] Åh, jag hör att du insett krattningens gåtfulla natur. Du är verkligen en äkta krattare. Varsågod, jag överlämnar 'Räfs' den legendariska krattan till dig. Med räfs kan du kratta vad som helst.",
              }
            } else {
              return { text: "[Kristin den Krattande] Ha! Det där biter inte på mig. Du är inte värdig denna kratta" }
            }
          },
        },
        {
          text: "Använd våld för att få tag på krattan.",
          onChoose: () => {
            if (player.attributes.includes("tunnla")) {
              player.attributes.push("räfs den legendariska krattan")
              return {
                text:
                  "Du tar sats för att attackera Kristin med snubblar och råkar tunnla genom krattan istället. Kristin blir dock imponerad.\n\n" +
                  "[Kristin den Krattande] Åh, bara någon som bemästrat tunnlingens ädla konst kan använda krattan till dess fulla potential. Du är verkligen en äkta krattare. Varsågod, jag överlämnar 'Räfs' den legendariska krattan till dig. Med räfs kan du kratta vad som helst.",
              }
            } else {
              return { text: "[Kristin den Krattande] Ha! Det där biter inte på mig. Du är inte värdig denna kratta" }
            }
          },
        },
        ...(player.attributes.includes("baguette")
          ? [
              {
                text: "Ge baguetten i utbyte mot krattan.",
                onChoose: () => {
                  player.attributes.push("räfs den legendariska krattan")
                  return {
                    text:
                      "Kristin är svag mot baguette då hon inte ätit lunch än.\n\n" +
                      "[Kristin den Krattande] Åh, vad snällt avdig. Du är verkligen en äkta krattare. Varsågod, jag överlämnar 'Räfs' den legendariska krattan till dig. Med räfs kan du kratta vad som helst.",
                  }
                },
              },
            ]
          : []),
      ],

      dialogueBeztown: [
        {
          text: "Jag har fått i uppdrag att hitta Beztown, var är det?",
          onChoose: () => {
            state.dialogueBeztown.shift()
            return {
              text: "[Kristin den Krattande] Ah, om du letar efter Beztown måste du vara hjälten som är sänd för att rädda Lagomgård! Så underbart att du kom, nu är Lagomgård onekligen räddat!",
            }
          },
        },

        {
          text: "Ja, men var är Beztown?",
          onChoose: () => {
            state.dialogueBeztown.shift()
            return {
              text: "[Kristin den Krattande] Ah, Beztown, det är Amazonrikets huvudträd. Om du går dit kommer du förstummas av den magnifika arkitekturen och invånarnas stiliga reflexvästar!",
            }
          },
        },

        {
          text: "Okej, det låter ju fint, men var ligger det?",
          onChoose: () => {
            state.dialogueBeztown.shift()
            return { text: "[Kristin den Krattande] Var ligger vad?" }
          },
        },

        {
          text: "Beztown!!",
          onChoose: () => {
            state.dialogueBeztown.shift()
            return {
              text: "[Kristin den Krattande] Wow, ta det lugnt, du behöver inte skrika. Vad är det du undrar om den ärorika staden Beztown?",
            }
          },
        },

        {
          text: "Jag undrar var Beztown ligger.",
          onChoose: () => {
            state.dialogueBeztown.shift()
            return {
              text: "[Kristin den Krattande] Jaha, varför sa du inte det från början? Det är ju enkelt! Okej, lyssna noga nu. Beztown ligger i utkanten av skogen.",
            }
          },
        },

        {
          text: "Okej, åt vilket håll är skogens utkant?",
          onChoose: () => {
            state.dialogueBeztown.reverse()
            return {
              text: "[Kristin den Krattande] Vad är det för dum fråga? Gå bara rakt i godtycklig riktning så kommer du till någon kant.",
            }
          },
        },

        {
          text: "Men var ligger Beztown?",
          onChoose: () => {
            state.dialogueBeztown.reverse()
            return { text: "[Kristin den Krattande] Jag sa ju det, Beztown ligger i utkanten av skogen" }
          },
        },
      ],
    }
  }

  const state = this.state as State

  let text: string = ""
  let choices: Choice[] = []
  if (state.stage == "introduction") {
    if (state.isFirstText) {
      state.isFirstText = false
      text =
        "Efter den omtumlande resan vaknar du upp i en skog. Du känner inte igen din omgivning och ser dig omkring efter Ababau.\n\n" +
        "[Ababau den ändlige]: Med hjälp av min magnificilienta magi har jag förflyttat dig till landet Lagomgård som står på randen till undergång. Det första du måste göra är att ta dig till staden Beztown. Jag skulle kunna leda dig dit, men jag har ett superviktigt ärende att uträtta, så ses där.\n\n" +
        "Ababau försvinner i ett moln av chokladdoftande ånga. Du står ensam kvar i skogen utan någon aning om vilket håll du ska gå åt. Vad gör du?"
    } else {
      text = "Du står kvar i skogen. Vad gör du?"
    }
    choices = [
      {
        text: "Gå rakt fram i godtycklig riktning",
        onChoose: () => {
          if (player.attributes.includes("GPS")) {
            return {
              text:
                "Du går rakt fram, men tappar snabbt bort dig.\n\n" +
                "Dock har du med dig din GPS och ställer in den på Beztown och fortsätter enligt dess anvisningar genom skogen.",
              room: Beztown,
            }
          } else {
            return {
              text:
                "Du går rakt fram, men tappar snabbt bort dig.\n\n" +
                "[Du] Varför ser alla träd likadana ut? Åh, den där stenen påminner om fem stycken jag passerat tidigare. Ah, det här känns rätt!\n\n" +
                "Du kommer fram till en glänta, men upptäcker snabbt att du är tilbaka där du startade. Attans!",
            }
          }
        },
      },
    ]

    if (!state.looked) {
      choices.push({
        text: "Se dig omkring.",
        onChoose: () => {
          state.looked = true
          return {
            text: "Du ser omkring dig en skog i sorgligt skick. Träden är slokna och har tappat många löv. Bredvid dig på marken ser du tre olika föremål, en pinne, en GPS och det heliga svärdet Excalibur. En bit bort ser du en person som krattar något.",
          }
        },
      })
    } else {
      if (!state.talkedToKristin) {
        choices.push({
          text: "Prata med den krattande personen.",
          onChoose: () => {
            state.stage = "speak to amazon"
            return {
              text:
                "Du går fram till den krattande personen. Du ser att det är en kvinna iklädd arbetskläder med reflexväst.\n\n" +
                "[Kristin den Krattande] Jag är Krattaren Kristin, en Amazon. Mitt jobb är att kratta skogen. Vad vill du?",
            }
          },
        })
      } else {
        choices.push({
          text: "Följ den dolda stigen.",
          onChoose: () => {
            return {
              text: "Du följer den dolda stigen ut ur skogen. Äntligen!",
              room: StigISkogen,
            }
          },
        })
      }

      if (!state.lookedPinne) {
        choices.push({
          text: "Undersök pinne.",
          onChoose: () => {
            state.lookedPinne = true
            return {
              text: "Det är en till synes helt vanlig pinne från en ask, ca. 0.5m lång, 0.01m i diameter och med några kvistar som sticker ut.",
            }
          },
        })
      } else if (!player.attributes.includes("pinne")) {
        choices.push({
          text: "Plocka upp pinnen.",
          onChoose: () => {
            player.attributes.push("pinne")
            return {
              text: "Du plockade upp pinnen.",
            }
          },
        })
      }

      if (!state.lookedGPS) {
        choices.push({
          text: "Undersök GPS.",
          onChoose: () => {
            state.lookedGPS = true
            return {
              text: "Det är en till synes helt vanlig GPS, av okänd anledning har den utmärkt kontakt och visar din exakta psoition.",
            }
          },
        })
      } else if (!player.attributes.includes("GPS")) {
        choices.push({
          text: "Plocka upp GPS.",
          onChoose: () => {
            player.attributes.push("GPS")
            return {
              text: "Du plockade upp GPSen.",
            }
          },
        })
      }

      if (!state.lookedExcalibur) {
        choices.push({
          text: "Undersök Excalibur.",
          onChoose: () => {
            state.lookedExcalibur = true
            return {
              text: "Det är en till synes helt vanlig Excalibur, den strålar helig energi och du känner hur du lätt kan ha ihjäl otaliga Demon lords med den.",
            }
          },
        })
      } else if (!player.attributes.includes("excalibur")) {
        choices.push({
          text: "Plocka upp excalibur.",
          onChoose: () => {
            player.attributes.push("excalibur")
            return {
              text: "Du plockade upp excalibur.",
            }
          },
        })
      }
    }
  } else if (state.stage == "speak to amazon") {
    text = "Vad säger du till Kristin den Krattande?"

    choices = [state.dialogueBeztown[0]]

    if (!player.attributes.includes("räfs den legendariska krattan")) {
      choices.push(state.dialogueKratta[0])

      if (state.demandKratta) {
        choices.push(...state.choicesKratta)
      }
    }

    choices.push({
      text: "Lämna samtalet.",
      onChoose: () => {
        state.talkedToKristin = true
        state.stage = "introduction"
        return {
          text:
            "[Kristin den Krattande] Lycka till på färden, vill du förresten till Beztown ligger det åt det hållet.\n\n" +
            "Kristina pekar mot en dold stig som går genom skogen.",
        }
      },
    })
  }

  return {
    text,
    choices,
    returnChoice: null,
  }
}

export default SkogStart
