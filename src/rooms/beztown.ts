import { Room } from "../game"
import Träsk from "./träsk"

type MazeRoom = "Klocktorn" | "Fontän" | "Kant" | "Holt"
type Stage = "rot" | "gren" | "jämnat" | "box maze" | "residens" | "waiting" | "beazos" | "epic"

type State = {
  stage: Stage
  firstStageVisit: boolean
  mazeRoom: MazeRoom
  mazeMap: Map<MazeRoom, [MazeRoom, MazeRoom, MazeRoom]>
  visited: boolean
  riddleTime: boolean
  knocked: boolean
  haveBox: boolean
  openedBox: boolean
  foundHouse: boolean
  varvsWalked: number
  askedEpic: boolean
  prevStage: Stage
  förolämpad: boolean
}

const Beztown: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      stage: "rot",
      firstStageVisit: true,
      mazeRoom: "Klocktorn",
      mazeMap: new Map<MazeRoom, [MazeRoom, MazeRoom, MazeRoom]>([
        ["Klocktorn", ["Klocktorn", "Fontän", "Kant"]],
        ["Fontän", ["Fontän", "Klocktorn", "Fontän"]],
        ["Kant", ["Klocktorn", "Kant", "Holt"]],
        ["Holt", ["Kant", "Kant", "Fontän"]],
      ]),
      visited: false,
      riddleTime: false,
      knocked: false,
      haveBox: false,
      openedBox: false,
      foundHouse: false,
      varvsWalked: 0,
      askedEpic: false,
      prevStage: "beazos",
      förolämpad: false,
    }
  } else {
    this.state.visited = true
  }

  const state = this.state as State

  const firstStageVisit = state.firstStageVisit
  state.firstStageVisit = false
  switch (state.stage) {
    case "rot":
      state.firstStageVisit = false
      return {
        text: firstStageVisit
          ? "Plötsligt kommer du fram till ett riktigt enormt träd som utstrålar grönska och utmärkt statsplanering. Du ser Amazoner högt upp i trädet som går omkring och tejpar lådor typ. När du kommer till trädets fot ser du en skylt där det står 'Beztown', dock finns till din stora fasa ingen väg upp. Vad gör du?"
          : "Du står vid foten av ett träd utan väg upp men med en skylt där det står 'Beztown'. Vad gör du?",
        choices: [
          {
            text: "Börja klättra.",
            onChoose: () => {
              if (player.attributes.includes("vara uthållig") || player.character == "rippad") {
                state.firstStageVisit = true
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
                    state.firstStageVisit = true
                    state.stage = "gren"
                    return {
                      text: "Du använder dina tunnlingsfärdigheter för att tunnla in i trädet och tunnla genom träfibrerna hela vägen upp till toppen. Snabbt jobbat!",
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
                    state.firstStageVisit = true
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
                    state.knocked = true
                    return {
                      text:
                        "Du knackar på trädet. I början händer ingenting men efter ett tag öppnas en liten lucka och en person tittar ut.\n\n" +
                        "[Gåtfrid den Gåtfulle]: Gådag, jag är den gåtfulle gåtfrid. Åm du i detta träd vill kåmma upp måste du svara på min gåtfulla gåta. Sådeså! Jag frågar då dig: Vad är likheten mellan ångår från mat åch en långsträckt höjd?",
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
                      text: "[Gåtfrid den Gåtfulle] Åjdå, det blev lite fel där va. Försök igen, eller är du för kårkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Det är trivialt!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle]: För mig ja, men inte för dig. Försök igen, eller är du för kårkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Bägge går att äta!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle]: Eh, nej. Inget av dem går att äta. Försök igen, eller är du för kårkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Mat ångor är typ moln, höjder är nära moln, där har vi det!'",
                  onChoose: () => {
                    return {
                      text: "[Gåtfrid den Gåtfulle]: Bra gissning, men fel. Försök igen, eller är du för kårkad?",
                    }
                  },
                },
                {
                  text: "Svara: 'Om du inte släpper in mig kommer jag att åsamka dig allvarlig skada!'",
                  onChoose: () => {
                    state.riddleTime = false
                    return {
                      text:
                        "[Gåtfrid den Gåtfulle]: Rätt svar! Likheten är att bägge heter ås! Varsågåd, vällkåmen till Beztåwn.\n\n" +
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
      if (firstStageVisit) {
        player.hp -= 5
      }
      return {
        text: firstStageVisit
          ? "Väl uppe i Beztown blir du slagen av hur vacker staden är och tar 5 hp skada. Överallt går amazoner med kartonglådor och du känner att du mest står i vägen. Ingenstans ser du Ababou och amazonerna är för upptagna för att prata med dig. Vad gör du?"
          : "Vad gör du?",

        choices: [
          ...(state.haveBox
            ? !state.openedBox
              ? [
                  {
                    text: "Öppna lådan.",
                    onChoose: () => {
                      state.openedBox = true
                      return {
                        text:
                          "Du begår det förskräckliga brottet att öppna en låda som inte är addresserad till dig! Och vad hittar du däri måntro? En ödla? En dödskalle? En integral? Nej, det är ingen mindre än Ababou den ändlige!\n\n" +
                          "[Ababou den ändlige]: Ah! Där är du ju, jag har väntat dig. Jag har spenderat tiden med att undersöka situationen och det visar sig att Lagomgård är i ännu större fara en jag trodde! Men mer om det senare, nu måste du leverera mig till skogsmästaren Beazos, hon är en kraftfull allierad.",
                      }
                    },
                  },
                ]
              : []
            : [
                {
                  text: "Sno en låda och spring iväg.",
                  onChoose: () => {
                    state.haveBox = true
                    return {
                      text: "Du snor en låda från en förbipasserande amazon och springer iväg. Hon blir upprörd men är för upptagen för att springa efter. Du har dock fortfarande ingen aning om var du är.",
                    }
                  },
                },
              ]),

          ...(state.openedBox
            ? [
                {
                  text: "Följ Ababous anvisningar till Beazos.",
                  onChoose: () => {
                    state.firstStageVisit = true
                    state.stage = "box maze"
                    return {
                      text: "Du går iväg in bland virrvarret av lådbärande amazoner.",
                    }
                  },
                },
                {
                  text: "Fråga vad 'skogmästare' betyder.",
                  onChoose: () => {
                    return {
                      text:
                        "[Ababou den ändlige]: Du förstår Amazonernas samhälle är ett högst decentraliserat sådant, det är så stort att de måste ha flera steg mellan deras högsta råd och de representanter som väljs lokalt. Skogen är uppdelad i biomer, bimoerna i dungor, dunorna i träd och träden i grenar.\n\n" +
                        "[Ababou den ändlige]: Varje gren som är stor nog väljer ett Grenråd som väljer en Talkvinna och en Grenmästare. Rådet väljer senare bort några från sitt eget råd till nästa råd, det vill säga till Trädrådet. Trädrådet väljer en Talkvinna och en trädmästare, och naturligtvis väljer de även några från sitt råd att representera dem i Dungrådet. Dungrådet fungerar likadant och och har en Dungmästare. Biområdet fungerar lite annorlunda i det att de också väljer en representant var till Mångfaldskogsrådet. Mångfaldskogsrådet är idag oviktigt. Men förr användes det för att avgöra svåra beslut i det högsta rådet och var viktigt för att Amazoner i olika biomer inte blev dåligt behandlade på grund av att de tillhörde en mindre biom, som förstås har mindre represenatation i det högsta rådet då de har lägre befolkningsmängd.\n\n" +
                        "[Ababou den ändlige]: Mångfaldskogsrådet har ingen mästare och ingen talkvinna, anledninegn till detta är för att ingen biom skall ses som högre än någon annan (även om det i praktiken finns biomer som ses som bättre än andra) och för att den nordligaste biomen ville att Talkvinnan skulle kallas Tallkvinna som de görs i deras Biområd, Dungråd, Trädråd och Grenråd. Bimoråden väljer hur som helst sina represenatanter till det högsta rådet, Skogsrå't som väljer ens Skogmästare, men ingen Talkvinna, på grund av samma anledning som Mångfaldskogsrådet inte har någon.\n\n" +
                        "[Ababou den ändlige]: Skogmästaren Beazos har bra koll på vad som behöver göras för att stoppa miljöförstörelsen som drabbat skogen, även om Skogsrå't är långsamma på att inse det, så många är från biom som det inte påverkar, men Beazos växte upp här i Beztown och fick genomlida Burukaveels förskräliga styre när hon var ett barn, hon kommer att hjälpa oss att rädda Lagomgård.",
                    }
                  },
                },
              ]
            : []),

          {
            text: "Go with the flow.",
            onChoose: () => {
              if (player.attributes.includes("smyga") || state.haveBox) {
                state.firstStageVisit = true
                state.stage = "box maze"
                return {
                  text: state.haveBox
                    ? "Tack vare lådan smälter du in utan problem. Du lyckas obemärkt gå med i flödet av amazoner."
                    : "Eftersom du är så bra på att stalka lyckas du gå med helt obemärkt. Plötsligt ger någon dig en låda, men du hinner inte fundera över det innan du skjutsas vidare.",
                }
              } else {
                player.hp -= 5
                return {
                  text: "Du försöker följa flödet av amazoner, men alla stannar upp och undrar vad du håller på med. Det sociala trycket tvingar dig att gå till sidan och du tar 5 hp skada från mobbning.",
                }
              }
            },
          },
        ],
      }
    case "box maze":
      var PlaceString = ""

      if (state.mazeRoom == "Klocktorn") {
        PlaceString = "Bredvid dig ser du ett hissnande högt klocktorn! Dock finns ingen väg upp i det..."
      } else if (state.mazeRoom == "Fontän") {
        PlaceString = "Du verkar ha kommit till ett torg med en varaktigt vacker fontän. Det glimmrar sagolikt i den."
      } else if (state.mazeRoom == "Kant") {
        PlaceString =
          "Du går rakt fram när du plötsligt märker att trädet tog slut för 5 steg sedan, varpå du snabbt backar 5 steg innan gravitationen lägger märke till ditt misstag. Du befinner dig uppenbarligen vid trädets kant."
      } else if (state.mazeRoom == "Holt") {
        PlaceString =
          "Plötsligt stöter du på en lång tegelbyggnad med en trappnedgång. Trapporna verkar leda till en skum lokal, men du lyckas inte se in genom de förtäckta fönstren, mycket misstänkt. Dessutom står det 'HOLT' i stora bokstäver på fönstren. Det hela känns en aning bekant."
      }

      return {
        text:
          "Du har helt tappat bort dig i vimlet av amazoner och lådor. Fortfarande med låda i hand ser du dig omkring. " +
          PlaceString,

        choices: [
          {
            text: "Gå åt vänster.",
            onChoose: () => {
              state.mazeRoom = state.mazeMap.get(state.mazeRoom)?.[0] || state.mazeRoom
              return {
                text: "Du går åt vänster.",
              }
            },
          },
          {
            text: "Fortsätt fram.",
            onChoose: () => {
              state.mazeRoom = state.mazeMap.get(state.mazeRoom)?.[1] || state.mazeRoom
              return {
                text: "Du går vidare.",
              }
            },
          },
          {
            text: "Gå åt höger.",
            onChoose: () => {
              state.mazeRoom = state.mazeMap.get(state.mazeRoom)?.[2] || state.mazeRoom
              return {
                text: "Du går åt höger.",
              }
            },
          },
          ...(state.mazeRoom == "Klocktorn"
            ? [
                {
                  text: "Försök klättra upp i tornet",
                  onChoose: () => {
                    if (player.attributes.includes("stege från holt")) {
                      state.foundHouse = true
                      return {
                        text:
                          "Med hjälp av stegen från Holt lyckas du klättra upp till toppen av tornet. Högst upp har du en utmärkt vy över hela trädet. Du njuter i stillsamhet över den underbart vackra utsikten, när Ababou plötsligt dyker upp ur din låda!\n\n" +
                          "[Ababou den ändlige]: Där! Vi ska till det episkt estetiska huset där borta! Där väntar oss en kraftfull allierad. Seså, snabba ryck!\n\n" +
                          "Du har nu fått din destination!",
                      }
                    } else {
                      return {
                        text: "Du försöker klättra upp för tornet, men väggarna är för hala! (Varför är de hala? Läbbigt!) Om du bara hade något att klättra på!",
                      }
                    }
                  },
                },
              ]
            : []),
          ...(state.mazeRoom == "Fontän"
            ? [
                {
                  text: "Bada i fontänen",
                  onChoose: () => {
                    if (player.attributes.includes("snorkel")) {
                      player.attributes.push("punch")
                      return {
                        text: "Med hjälp av snorkeln lyckas du utforska fontänen och hittar... en flaska punch? 'Vad ska jag med den till?' tänker du medan du plockar på dig den.",
                      }
                    } else {
                      player.hp -= 5
                      return {
                        text: "Du försöker bada i fontänen, men eftersom du är så dålig på att bada får du en kallsup och tar 5 hp skada (pga pinsamhet).",
                      }
                    }
                  },
                },
              ]
            : []),
          ...(state.mazeRoom == "Kant"
            ? [
                {
                  text: "Utmana gravitationen!",
                  onChoose: () => {
                    player.attributes.push("snorkel")
                    return {
                      text:
                        "Du utmanar gravitationen.\n\n" +
                        "Gravitationen vinner.\n\n" +
                        "Som tur är landar du på en annan gren 2 meter nedanför. Medan du klättrar upp hittar du förvånansvärt nog en snorkel gömd bland löven. Vad gör den här? Klåfingrig som du är tar du med den.",
                    }
                  },
                },
              ]
            : []),
          ...(state.mazeRoom == "Holt"
            ? [
                {
                  text: "Knacka på.",
                  onChoose: () => {
                    if (player.attributes.includes("punch")) {
                      player.attributes.push("stege från holt")
                      return {
                        text: "Du knackar på, först blir du avvisad men när de känner doften av punch blir du istället varmt välkommen. När du kommer in i den skumma lokalen inser du att folket här faktiskt är konstigare än du någonsin hade kunnat ana! Du försöker artigt slingra dig därifrån, men inte förrän det punchglada folket lyckas tvinga på dig en stege som tack! Väl ute så vilar du någon minut för att återhämta dig från traumat, därefter fortsätter du på jakten efter... något.",
                      }
                    } else {
                      return {
                        text: "Du knackar på, men får till svar att du måste betala 40kr inträde för att komma in. Tyvärr tog du inte med dig några svenska pengar och de accepterar nog inte guldmynt. Hmm, var någonstants skulle du kunna hitta pengar häromkring?",
                      }
                    }
                  },
                },
              ]
            : []),
          ...(state.foundHouse
            ? [
                {
                  text: "Gå till det episka huset.",
                  onChoose: () => {
                    state.firstStageVisit = true
                    state.stage = "residens"
                    return {
                      text: "Med ditt lokalsinne återfått beger du dig mot det episka huset som Ababou pekade ut. Äntligen lyckas du lämna virrvarret av lådbärande amazoner!",
                    }
                  },
                },
              ]
            : []),
        ],
      }
    case "residens":
      return {
        text: firstStageVisit
          ? "Efter ett tag kommer du till en stor och övedrivet episk bygnad där det står 'Skogmästarens residens'. Vad gör du?"
          : "Du står utanför skogmästarens residens. Vad gör du?",

        choices: [
          {
            text: "Gå in.",
            onChoose: () => {
              state.firstStageVisit = true
              state.stage = "waiting"
              return {
                text: "Du går in i den överdrivet episka byggnaden. Inuti finns en massa episka statyer som föreställer strider mot drakar och ondskefulla gudar som förvisas till skumma dimensioner. Du går upp för en underbart episk trappa, därefter fram till en oöverträffbart episk dörr där du ser en ofattbart episk post-it lapp där det står: 'Episkt möte pågår'.",
              }
            },
          },

          {
            text: "Gå ett varv till.",
            onChoose: () => {
              state.varvsWalked += 1

              var extraText = ""

              if (state.varvsWalked == 3) {
                player.attributes.push("silly walk")
                extraText =
                  "Grattis, du har gått runt efter amazoner så mycket att du lärt dig attributen 'silly walk'! "
              }

              return {
                text:
                  extraText +
                  "Du följer efter amazonerna ett varv runt staden. Till slut kommer du dock tillbaka till det episka huset.",
              }
            },
          },
        ],
      }
    case "waiting":
      return {
        text: "Vad gör du?",

        choices: [
          {
            text: "Vänta.",
            onChoose: () => {
              state.firstStageVisit = true
              state.stage = "beazos"
              return {
                text: "Du hinner inte vänta förrän dörren öppnas och en fruktansvärt episk amazon kommer ut!",
              }
            },
          },

          {
            text: "Gå in.",
            onChoose: () => {
              state.firstStageVisit = true
              state.stage = "beazos"
              return {
                text: "Du hinner inte gå in förrän dörren öppnas och en fruktansvärt episk amazon kommer ut!",
              }
            },
          },
        ],
      }
    case "beazos":
      return {
        text: "[Skogmästare Beazos]: Ha! Skogmästaren Beazos är jag! Vad hit dig för, du människa som sorgligt oepisk är?",

        choices: [
          {
            text: "Börja förklara varför du är här.",
            onChoose: () => {
              return {
                text:
                  "Du börjar förklara din situation, men blir snabbt avbruten av Ababou som hoppar fram ur din låda och tar över!\n\n" +
                  "[Ababou den ändlige]: Var hälsad Skogmästare Beazos, jag har kommit med en episk hjälte för att rädda Amazonas från den mörke herrens efterträdare, när hjälten har funnit den heliga inte-graalen skall denne använda inte-graalen för att förgöra det ensammare berget.\n\n" +
                  "[Skogmästare Beazos]: Burukaveels efterträdare dödas skall, du hjälte med min välsignelse för att utrota dvärgharna gå.\n\n" +
                  "[Ababou den ändlige]: Jag skickar dig nu ut ur skogen, när du funnit inte-graalen ta den då till dvärgharnas laboratorium så att den får som störst sprängkraft.\n\n" +
                  "Du känner hur du börjar lösas upp i en vaniljdoftande ånga. Plötsligt materialiseras du i ett träsk med Beztown bakom dig.\n\n" +
                  "Grattis, du är äntligen ute ur skogen!",
                room: Träsk,
              }
            },
          },
          ...(!state.askedEpic
            ? [
                {
                  text: "Be henne att lära dig vara episk.",
                  onChoose: () => {
                    state.askedEpic = true
                    state.prevStage = "beazos"
                    state.firstStageVisit = true
                    state.stage = "epic"
                    return {
                      text: "",
                    }
                  },
                },
              ]
            : []),
          // {
          //   text: "Fråga vad 'skogmästare' betyder.",
          //   onChoose: () => {
          //     return {
          //       text: "INSERT_LÅNG_UTLÄGGNING.",
          //     }
          //   },
          // },
        ],
      }
    case "epic":
      const wrongString =
        "Ack! Fel så har du. Episk att vara dig för är inget!\n\n" + "Du får inte lära dig att vara episk. Snyft."

      return {
        text: firstStageVisit
          ? "Imponerad av Beazos läskigt starka episkhet ber du henne att lära dig alla sina hemligheter.\n\n" +
            "[Skogmästare Beazos]: Ha! Lära dig att episk vara du vill? Välnå, imponerad är jag din fråga så plötslig över! Men lätt det inte blir, dig säga jag må! Att det epsika förstå ligger utmaningen i! Jag säga, lyssna noga nu du! Sju åtta minus gånger plus fem minus 9, vad det blir?"
          : "[Skogmästare Beazos]: Sju åtta minus gånger plus fem minus 9, vad det blir?",

        choices: [
          {
            text: "Tja... -36?",
            onChoose: () => {
              state.firstStageVisit = true
              state.stage = "beazos"
              return {
                text: wrongString,
              }
            },
          },
          {
            text: "Hmm (du kliar din haka)... -14!",
            onChoose: () => {
              state.firstStageVisit = true
              state.stage = "beazos"
              return {
                text: wrongString,
              }
            },
          },
          {
            text: "Det finns bara ett logiskt svar: 4!",
            onChoose: () => {
              player.attributes.push("epic")
              state.firstStageVisit = true
              state.stage = "beazos"
              return {
                text:
                  "[Beazos]: Rätt det helt är! Märktut! Mig du inte besviken gör! Du jag allt jag kan lära ska! Lyssna ihåg kom och!\n\n" +
                  "Beazos lär dig allt om att vara episk!",
              }
            },
          },
          {
            text: "Aha! 60 såklart!",
            onChoose: () => {
              state.firstStageVisit = true
              state.stage = state.prevStage
              return {
                text: wrongString,
              }
            },
          },
        ],
      }
    case "jämnat":
      return {
        text: "Amazonerna verkar upprörda. Vad säger du?",

        choices: [
          {
            text: "Det var inte jag! Jag lovar!",
            onChoose: () => {
              state.förolämpad = true
              return {
                text:
                  "Amazonerna verkar förvånade över ditt svar.\n\n" +
                  "[Arg amazon]: Eh, vi frågade inte om det var du. Det krävs en stor armé eller ett ofattbart finkänsligt massförstörelsevapen för att åstadkomma detta. Idén att du skulle ha förstört Beztown helt själv är fullkomligt löjligt.\n\n" +
                  "Amazonerna skrattar högt.",
              }
            },
          },
          ...(state.förolämpad
            ? [
                {
                  text: "Bli förolämpad och svara att du VISST kan ha förstört Beztown!",
                  onChoose: () => {
                    state.firstStageVisit = true
                    state.stage = "beazos"
                    return {
                      text:
                        "Du framhåller envist att du utan problem kan förstöra 10 Beztowns på en gång. Du är minsann en hjälte som åkallats för att rädda världen, sådeså!\n\n" +
                        "[Arg amazon]: Va! Varför sa du inte att du är hjälten som ska rädda världen? Då måste du genast gå och prata med Skogmästare Beazos! Och när du ändå håller på kan du fånga den ondskefulla fiende som förstörde vår älskade stad!" +
                        "Du beger till Beazos, på vägen får du en mystisk låda av en passerande amazon.",
                    }
                  },
                },
              ]
            : []),
          {
            text: "Skyll ifrån dig",
            onChoose: () => {
              return {
                text:
                  "[Du]: Det var hon!\n\n" +
                  "[Arg amazon]: Aha! Självklart, jag har alltid tyckt att hon varit lite udda. Hon måste vara en spion!\n\n" +
                  "Amazonerna arresterar den du pekade på.\n\n" +
                  "[Arg amazon]: Tack för hjälpen, men det måste vara fler som ligger bakom detta. Vi måste hitta resten av förrövarna!",
              }
            },
          },
          {
            text: "Säg att det hände av sig självt.",
            onChoose: () => {
              return {
                text:
                  "[Arg amazon]: Du menar att vår stad som stod helt stadigt för bara några minuter sedan skulle ha fallit ihop och organiserat sig i en fin hög helt spontant?\n\n" +
                  "Amazonerna verkar inte övertygade.",
              }
            },
          },
          {
            text: "Nu ska vi inte börja lägga skuld på folk va, kan vi inte alla bli vänner och...",
            onChoose: () => {
              return {
                text: "[Arg amazon]: Håll käft!",
              }
            },
          },
        ],
      }
  }
}

export default Beztown
