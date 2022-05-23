import { Choice, Room } from "../game"
import Träsk from "./träsk"

type State = {
  emptyCamp: boolean
  canFlee: boolean
  campHasBeenSearched: boolean
  visited: boolean
}

const Ni: Room<State> = function ({ player }) {
  if (!this.state) {
    this.state = {
      emptyCamp: false,
      canFlee: true,
      campHasBeenSearched: true,
      visited: false,
    }
  } else {
    this.state.visited = true
  }

  const state = this.state as State

  if (state.emptyCamp) {
    return {
      text: "Du står ensam i Riddarna som säger Nis läger.",
      choices: [
        {
          text: "Sök igenom lägret.",
          onChoose: () => {
            if (state.campHasBeenSearched) {
              state.campHasBeenSearched = false
              player.gold += 10
              player.healingPotions++
              return { text: "Du hittar 10 guldmynt och en helande trolldryck!" }
            } else {
              return { text: "Du hittar ingenting nytt av värde." }
            }
          },
        },
        {
          text: "Gå tillbaks upp ur sänkan.",
          onChoose: () => ({
            text: "Du klättar ur sänkan och går tillbaks in i träsket.",
            room: Träsk,
          }),
        },
      ],
    }
  }

  const fleeChoice: Choice = {
    text: "Fly från sänkan.",
    onChoose: () => ({
      text:
        "Du vänder om så snabbt du kan och rusar tillbaks genom dimman. Snart når du kanten på sänkan och klättrar tacksamt upp och går tillbaks in i träsket.",
      room: Träsk,
    }),
  }

  return {
    text: state.visited
      ? "Du befinner dig i Riddarna som säger Nis läger, och riddarna står runt om kring dig. De kräver en buske av dig."
      : "Du kommer ned i en dimmig sänka. Dimman är så tjock att solen skymms och det blir märkbart mörkare. Plötsligt tycker du dig se en gestalt röra sig bakom en gren, men den försvinner snabbt ur synhåll. Du har en stark känsla av att någon eller några betraktar dig.\n\n" +
        "Plötsligt står en lång skepnad framför dig.\n\n" +
        "[Riddare som säger Ni]: Vi är riddarna som säger Ni! Ni! Ni! Ni! Vi är väktarna av de heliga orden Ni, Ping, and Nee-womm! \n\n" +
        "[Riddare som säger Ni]: Vi kräver av dig ett offer, du måste hitta en buske åt oss!",
    choices: [
      {
        text: "Säg att du inte är rädd och kan stå emot deras krafter.",
        onChoose: () => {
          if (player.attributes.includes("vara uthållig")) {
            state.emptyCamp = true
            return {
              text:
                "Riddarna som säger Ni försöker bryta ned dig genom att ropa Ni upprepade gånger, men du är uthållig och står emot deras krafter. Till slut ger riddarna upp och flyr.",
            }
          }

          state.canFlee = false
          return {
            text:
              "Riddarna som säger Ni börjar ropa Ni om och om igen och du känner att du inte är uthållig nog att stå emot deras krafter. Du faller ihop skakandes ihop på marken. Du är inte längre stark nog att fly därifrån.",
          }
        },
      },
      ...(player.attributes.includes("gräs")
        ? [
            {
              text: "Ge gräset du stal från Lena den Letande till Riddarna av Ni.",
              onChoose: () => {
                state.emptyCamp = true
                return {
                  text:
                    "Du räcker fram grästuvan du burit med dig från Amazonas.\n\n" +
                    "[Riddare som säger Ni]: Jag har sett bättre, men det får duga. Med denna grästuva ska vi ställa upp i lagomgårds formklippningstävling där den säkert kommer att vinna! Vi ger oss av direkt! Farväl!",
                }
              },
            },
          ]
        : []),
      {
        text: "Gå tillbaks en bit i sänkan och hämta en buske som du såg.",
        onChoose: () => {
          state.emptyCamp = true
          return {
            text:
              "Du bugar dig och säger till riddarna att de är stora och rättvisa och att du ska återvända med en buske åt dem. Du går tillbaks några hundra meter till en fin, död, avbruten buske som du lagt märke till på vägen och tar med den tillbaks till riddarnas läger.\n\n" +
              "[Riddare som säger Ni]: Det är en god buske. Jag gillar speciellt bladen. Med denna buske ska vi ställa upp i lagomgårds formklippningstävling där den säkert kommer att vinna! Vi ger oss av direkt! Farväl!",
          }
        },
      },
      {
        text: "Gå runt Riddaren av Ni.",
        onChoose: () => ({ text: "Du går ett varv kring Riddaren av Ni." }),
      },
      ...(state.canFlee ? [fleeChoice] : []),
    ],
  }
}

export default Ni
