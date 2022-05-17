import { Room } from "../game"

type State = {
  stage: "rot" | "gren" | "jämnat"
  visited: boolean
  riddleTime: boolean
  knocked: boolean
}

const Beztown: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      stage: "rot",
      visited: false,
      riddleTime: false,
      knocked: false,
    }
  } else {
    this.state.visited = true
  }

  const state = this.state as State

  switch (state.stage) {
    case "rot":
      return {
        text: "Plötsligt kommer du fram till ett riktigt enormt träd som utstrålar grönska och utmärkt statsplanering. Du ser Amazoner högt upp i trädet som går omkring och tejpar lådor typ. När du kommer till trädets fot ser du en skylt där det står 'Beztown', dock finns till din stora fasa ingen väg upp. Vad gör du?",
        choices: [
          {
            text: "Börja klättra.",
            onChoose: () => {
              if (player.attributes.includes("vara uthållig") || player.character == "rippad") {
                state.stage = "gren"
                return {
                  text: "Tack vare din magnifika underarmsmuskulatur lyckas du klättra upp för trädet. Starkt jobbat.",
                }
              } else {
                return {
                  text: "Du börjar klättra men får slut på kraft och trillar ner efter bara fem meter. Patetiskt.",
                }
              }
            },
          },
          ...(player.attributes.includes("tunnla")
            ? [
                {
                  text: "Tunnla upp för trädet.",
                  onChoose: () => {
                    state.stage = "gren"
                    return {
                      text: "Du använder dina tunnlingsfärdigheter för att tunnla in i det och tunnla genom träfibrerna hela vägen upp till toppen. Snabbt jobbat!",
                    }
                  },
                },
              ]
            : []),
          ...(player.attributes.includes("räfs den legendariska krattan")
            ? [
                {
                  text: "Kratta trädet",
                  onChoose: () => {
                    state.stage = "jämnat"
                    return {
                      text: "Du använder räfs den legendariska krattan för att kratta Beztown. Det är fruktansvärt effektivt. Med ett kratttag rasar hela trädet och blir till en gigantisk men mycket prydlig hög av löv och grenar. Alla Amazoner som trillat ner från trädet verkar mycket upprörda.",
                    }
                  },
                },
              ]
            : []),
          ...(!state.knocked
            ? [
                {
                  text: "Knacka på.",
                  onChoose: () => {
                    state.riddleTime = true
                    state.knocked = false
                    return {
                      text:
                        "Du knackar på trädet. I början händer ingenting men efter ett tag öppnas en liten lucka och en person tittar ut.\n\n" +
                        "[Gåtfrid den Gåtfulle] Gådag, jag är den gåtfulle gåtfrid. Åm du i detta träd vill kåmma upp måste du svara på min gåtfulla gåta. Sådeså! Jag frågar då dig: Vad är likheten mellan ångår från mat åch en långsträckt höjd?",
                    }
                  },
                },
              ]
            : []),
          ...(state.riddleTime
            ? [
                {
                  text: "Svara: 'Dom består bägge av materia!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle] Åjdå, det blev lite fel där va. Försök igen, eller är du för korkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Det är trivialt!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle] För mig ja, men inte för dig. Försök igen, eller är du för korkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Bägge går att äta!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle] Eh, nej. Inget av dem går att äta. Försök igen, eller är du för korkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Mat ångor är typ moln, höjder är nära moln, där har vi det!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle] Bra gissning, men fel. Försök igen, eller är du för korkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Om du inte släpper in mig kommer jag att åsamka dig allvarlig skada!'",
                  onChoose: () => {
                    state.riddleTime = false
                    return {
                      text:
                        "[Gåtfrid den Gåtfulle] Rätt svar! Likheten är att bägge heter ås! Varsågåd, vällkåmen till Beztåwn.\n\n" +
                        "En stege kommer ner från trädets topp.",
                    }
                  },
                },
              ]
            : []),
          ...(state.knocked && !state.riddleTime
            ? [
                {
                  text: "Klättra upp för stegen.",
                  onChoose: () => {
                    state.riddleTime = true
                    state.knocked = false
                    return {
                      text: "Du börjar klättra upp för stegen och kommer till Beztown.",
                    }
                  },
                },
              ]
            : []),
        ],
      }
    case "gren":
      player.hp -= 5
      return {
        text: "Väl uppe i Beztown blir du slagen av hur vacker staden är och tar 5 hp skada. ",
        choices: [],
      }
    case "jämnat": {
      return { choices: [] } // TODO
    }
  }
}

export default Beztown
