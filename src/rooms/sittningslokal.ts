import { Choice, Consequence, Room, RoomInfo } from "../game"
import { createGameOverRoom } from "../helpers/gameOver"
import { Attribute, Character } from "../player"
import SkogStart from "./skogStart"

type State = {
  stage: "introduction" | "call to action" | "abilities" | "way out"
  denyCount: number
  assignedAttributesCount: 0
  wayOutVisited: boolean
}

const Sittningslokal: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      stage: "introduction",
      denyCount: 0,
      assignedAttributesCount: 0,
      wayOutVisited: false,
    }
  }

  const state = this.state as State

  if (state.stage == "introduction") {
    const choiceScaffolds: {
      [C in Character]: { text: string; hp: number; ababou: string }
    } = {
      matematiker: {
        text: "Jag har mäktiga matteskills, välj mig!",
        ababou: "Ett mattesnille, så makalöst magnifikt!",
        hp: 100,
      },
      fysiker: {
        text: "Jag har fabulösa fyskförmågor, välj mig!",
        ababou: "En fysiker, fantastiskt! Just vad jag förväntade mig!",
        hp: 100,
      },
      programmerare: {
        text: "Jag är påfallande bra på att programera, välj mig!",
        ababou: "En programmerare, det är ju praktiskt taget perfekt!",
        hp: 100,
      },
      rippad: {
        text: "Intellekt? Vem behöver det? Jag är super-ripped, välj mig!",
        ababou: "Jag känner hur dina biceps utstrålar heroism, jag väljer dig!",
        hp: 120,
      },
    }

    return {
      text:
        "Du befinner dig på en sittning med phaddergruppen 256. Det är trevligt men lite tråkigt och du känner hur lusten för ett episkt äventyr bubblar inom dig (eller är det bara förrätten?)\n\n" +
        "Plötsligt dyker en mystisk gubbe upp från tomma intet och börjar prata högt.\n\n" +
        "[Ababau den ändlige]: Mitt namn är Ababau den ändlige. Jag söker någon med ett heroiskt intellekt som kan rädda världen. Finns här någon sådan?",
      choices: Object.entries(choiceScaffolds).map(
        ([character, { text, ababou, hp }]): Choice => ({
          text,
          onChoose: () => {
            player.character = character as Character
            player.hp = hp
            state.stage = "call to action"
            return { text: `[Ababau den ändlige]: ${ababou}` }
          },
        })
      ),
    }
  } else if (state.stage == "call to action") {
    const denialStages: { text: string; choiceText: string }[] = [
      {
        text: "[Ababau den ändlige]: Det heliga riket Lagomgård svävar i stor och omedelbar fara och bara du kan rädda det. Om du gör detta kommer du prisas som episk hjälte till tidens ända och få ett oöverträffbart CV. Vad säger du, vill du joina det hypersfäriska bordet och rädda världen?",
        choiceText: "Mjäh, låter jobbigt. Nån annan får göra det.",
      },
      {
        text: "[Ababau den ändlige]: Va! Men bara du kan göra det! Utan dig kommer Lagomgård att gå under!",
        choiceText: "Njaa, det är nog inget för mig asså. Sorry.",
      },
      {
        text:
          "[Ababau den ändlige]: *Ababau fnyser* Jag förväntade mig mer av dig. Om du inte tänker göra det får jag helt enkelt hitta någon annan. Adjö, din fegis!\n\n" +
          "Ababau den ändlige löses upp i ett moln av jordgubbsdoftande ånga och du glömmer honom snabbt. När sittningen dock är slut och du är på väg ut dyker Ababau den ändlige upp igen utanför dörren.\n\n" +
          "[Ababau den ändlige]: Jag har letat i 300 parallella universum och det finns ingen annan som kan göra det! Du kommer ha flera triljoner liv på ditt samvete om du tackar nej! Du måste säga ja!",
        choiceText: "Nej, jag har tenta snart, det är viktigare. Sluta tjata.",
      },
      {
        text:
          "Du kör iväg Ababau och går hem. När du väl kommit hem och precis öppnat dörren möter du dock Ababau den ändlige i din hall. Hur kom han in där?\n\n" +
          "[Ababau den ändlige]: Snälla, kan du inte rädda Lagomgård? Snälla snälla jättesnälla? Med socker på?",
        choiceText: "Nej, ett nej är ett nej. Försvinn härifrån!",
      },
      {
        text:
          "Efter att du kört iväg den irriterande trollkarlen ännu en gång känner du nöden kalla och försvinner in till in din peronliga porslinstron. Innan du hinner uträtta dina bihov ser du dock två stora lysande ögon stirra in genom badrumsfönstret.\n\n" +
          "[Ababau den ändlige]: Snäääääääääälla!",
        choiceText: "Ring polisen och rapportera att en skum filur stalkar dig.",
      },
    ]

    const denialStage = denialStages[state.denyCount]

    return {
      text: denialStage.text,
      choices: [
        {
          text: "Episkt äventyr? Sign me up!",
          onChoose: () => {
            state.stage = "abilities"
            return {
              text: "[Ababau den ändlige]: Fantastiskt att du ställer upp!",
            }
          },
        },
        {
          text: denialStage.choiceText,
          onChoose: () => {
            state.denyCount++
            if (state.denyCount < denialStages.length) {
              return {}
            }
            return {
              text:
                "Polisen kommer och arresterar Ababau den ändlige som ropar:\n\n" +
                "[Ababau den arresterade]: Inser du vad du har gjort! Nu kommer Lagomgård gå under!",
              room: createGameOverRoom(),
            }
          },
        },
      ],
    }
  } else if (state.stage == "abilities") {
    const abilities: {
      [C in Character]: { assumption: Attribute; options: Attribute[] }
    } = {
      matematiker: {
        assumption: "tänka logiskt",
        options: ["lösa gåtor", "tunnla", "vara uthållig", "smyga"],
      },
      fysiker: {
        assumption: "tunnla",
        options: ["lösa gåtor", "tänka logiskt", "förföra"],
      },
      programmerare: {
        assumption: "lösa gåtor",
        options: ["fajtas", "tunnla", "tänka logiskt", "smyga"],
      },
      rippad: {
        assumption: "fajtas",
        options: ["förföra", "tunnla", "vara uthållig"],
      },
    }

    let { assumption, options } = abilities[player.character]
    options = options.filter((o) => !player.attributes.includes(o))

    function assignAttribute(attr: Attribute) {
      player.attributes.push(attr)
      state.assignedAttributesCount++
    }

    if (state.assignedAttributesCount >= 2) {
      return {
        text: `[Ababau den ändlige]: Jasså, du kan både ${player.attributes.join(
          " och "
        )}. Du råkar inte ha fler förmågor?`,
        choices: options.map((option) => ({
          text: `Jo, jag vet hur man gör för att ${option}.`,
          onChoose: () => {
            assignAttribute(option)
            state.stage = "way out"
            return {
              text: `[Ababau den ändlige]: Du är då rungande lärd, även för att vara ${player.character}. Res dig upp och kom med ut. Vi har stora saker att utföra.`,
            }
          },
        })),
      }
    } else {
      if (state.assignedAttributesCount == 0) {
        assignAttribute(assumption)
      }

      return {
        text: `[Ababau den ändlige]: Så, du säger att du är ${player.character}, då måste du vara duktig på ${assumption}?`,
        choices: options.map((option) => ({
          text: `Ja, och jag har också en del erfarenhet av att ${option}!`,
          onChoose: () => {
            assignAttribute(option)
            return {}
          },
        })),
      }
    }
  } else {
    const ri: RoomInfo = {
      text: state.wayOutVisited
        ? `Du ser att Ababou väntar allt mer otåligt i sittningslokalens dörröppning, men du känner dig ännu inte helt redo att följa honom ut i en helt okänd värld. Du funderar på vad du bör göra med dina sista minuter innan dina äventyr ska ta sin början.`
        : `Du hasar dig upp från sittningsbordet medans du ursäktar dina bordsgrannar, helt i onödan eftersom de i sin ivriga disukssion knappt märkt av Ababou den ändliges märkliga uppdykande. Ababou som redan hunnit ut ur sittningslokalen väntar på dig utanför dörröppningen. Som den ${player.character} du är tänker du pragmatiskt att om man nu ska ge sig ut på ett uppdrag för att rädda ett helt rike kan det vara bra att förbereda sig först på något vis.`,
      choices: [
        {
          text: "Se efter vad som finns kvar att dricka.",
          onChoose: () => ({
            room: () => ({
              text: "Du låter blicken svepa över borden. Din undersökning resulterar i fyndet av flera potentiellt drickbara substanser.",
              choices: [
                {
                  text: "Svep en flaska tabasko.",
                  onChoose: () => {
                    const drinkTabaskoWeak = (): Consequence => {
                      return {
                        text: "Du korkar upp tabaskoflaskan och häller upp innehållet i ett glas. Ababou den ändlige tittar bekymrat på dig från dörröppningen, men säger ingenting. Du tar en klunk och försöker ta en andra men det går inte och du inser att du begått ett stort misstag. Hostande tar du dig själv om bröstet och kollapsar på golvet. Du uppfattar att Ababou håller på att läma sin post vid dörrkarmen för att komma in och hämta dig, men du reser dig stapplande och gestikulerar åt honom att stanna där han står.",
                        room: Sittningslokal,
                      }
                    }

                    if (player.character == "rippad") {
                      return {
                        text: "För en så rippad individ som du är en flaska tabasko ingen match. Tvärt om känner du dig mer styrkt än förut.",
                        room: Sittningslokal,
                      }
                    } else if (player.attributes.includes("tänka logiskt")) {
                      return {
                        room: () => ({
                          text: "Eftersom du är logiskt tänkande funderar du en extra gång över om tabasko verkligen är nyttigt för dig.",
                          choices: [
                            {
                              text: "Drick tabaskon.",
                              onChoose: drinkTabaskoWeak,
                            },
                            {
                              text: "Avstå från tabaskon.",
                              onChoose: () => ({
                                room: Sittningslokal,
                              }),
                            },
                          ],
                        }),
                      }
                    }

                    return drinkTabaskoWeak()
                  },
                },
                {
                  text: "Drick en Trocadero.",
                  onChoose: () => ({
                    text: 'Drickan får dig att känna dig helt sockrig och god inombords. Tänderna nästan klibbar mot varandra på helt rätt sätt. "Trocadero sitter alltid fint" ropar du över rummet till Ababou som nickar instämmande.',
                  }),
                },
                {
                  text: "Drick en Trocadero Zero.",
                  onChoose: () => ({
                    text: "Den magra utvattnade blaskan ålar sig ned i strupen på dig och lämnar dig torr och sträv i halsen. Om detta är Trocadero, tänker du, hur magra upplevelser får man då inte av Coca-Cola och andra mineralvatten?",
                  }),
                },
              ],
            }),
          }),
        },
        ...(!player.attributes.includes("baguette")
          ? [
              {
                text: "Leta efter möjliga vapen i rummet",
                onChoose: () => {
                  player.attributes.push("baguette")
                  return {
                    text: "Du hittar en baguette!",
                  }
                },
              },
            ]
          : []),
        // {
        //   text: "Fråga någon vid bordet om de har något de vill byta mot resten av din sittningmat.",
        //   action: () => {
        //     /* */
        //   },
        // },
        {
          text: "Följ med Ababau",
          onChoose: () => {
            return {
              text: "Du följer med Ababau på en episk resa genom tid och rum!",
              room: SkogStart,
            }
          },
        },
      ],
    }

    state.wayOutVisited = true

    return ri
  }
}

export default Sittningslokal
