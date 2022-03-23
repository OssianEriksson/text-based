import { Choice, Room, RoomInfo } from "../game"

type State = {
  emptyCamp: boolean
  canFlee: boolean
  campHasGold: boolean
  firstVisit: boolean
}

const Ni: Room<State> = function ({ visitedRooms, player }) {
  if (!this.state) {
    this.state = {
      emptyCamp: false,
      canFlee: true,
      campHasGold: true,
      firstVisit: true,
    }
  }

  const state = this.state as State

  if (state.emptyCamp) {
    return {
      text: "Du står ensam i Riddarna som säger Nis läger.",
      choices: [
        {
          text: "Sök igenom lägret.",
          onChoose: () => {
            if (state.campHasGold) {
              state.campHasGold = false
              player.gold += 100
              return { text: "Du hittar 100 guldmynt!" }
            } else {
              return { text: "Du hittar ingenting nytt av värde." }
            }
          },
        },
        {
          text: "Gå tillbaks upp ur sänkan.",
          onChoose: () => ({
            text: "Du klättar ur sänkan och går tillbaks in i träsket.",
            room: visitedRooms[visitedRooms.indexOf(Ni) - 1],
          }),
        },
      ],
    }
  }

  const fleeChoice: Choice = {
    text: "Fly från sänkan.",
    onChoose: () => ({
      text: "Du vänder om så snabbt du kan och rusar tillbaks genom dimman. Snart når du kanten på sänkan och klättrar tacksamt upp och går tillbaks in i träsket.",
      room: visitedRooms[visitedRooms.indexOf(Ni) - 1],
    }),
  }

  const ri: RoomInfo = {
    text: state.firstVisit
      ? "Du kommer ned i en dimmig sänka. Dimman är så tjock att solen skymms och det blir märkbart mörkare. Plötsligt tycker du dig se en gestalt röra sig bakom en gren, men den försvinner snabbt ur synhåll. Du har en stark känsla av att någon eller några betraktar dig.\n\n" +
        "Plötsligt står en lång skepnad framför dig.\n\n" +
        "[Riddare som säger Ni]: Vi är riddarna som säger Ni! Ni! Ni! Ni! Vi är väktarna av de heliga orden Ni, Ping, and Nee-womm! \n\n" +
        "[Riddare som säger Ni]: Vi kräver av dig ett offer, du måste hitta en buske åt oss!"
      : "Du befinner dig i Riddarna som säger Nis läger, och riddarna står runt om kring dig. De kräver en buske av dig.",
    choices: [
      {
        text: "Säg att du inte är rädd och kan stå emot deras krafter.",
        onChoose: () => {
          if (player.attributes.includes("vara uthållig")) {
            state.emptyCamp = true
            return {
              text: "Riddarna som säger Ni försöker bryta ned dig genom att ropa Ni upprepade gånger, men du är uthållig och står emot deras krafter. Till slut ger riddarna upp och flyr.",
            }
          }

          state.canFlee = false
          return {
            text: "Riddarna som säger Ni börjar ropa Ni om och om igen och du känner att du inte är uthållig nog att stå emot deras krafter. Du faller ihop skakandes ihop på marken. Du är inte längre stark nog att fly därifrån.",
          }
        },
      },
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

  state.firstVisit = false

  return ri
}

export default Ni