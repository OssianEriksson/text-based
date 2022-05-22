import { Choice, Room } from "../game"
import Träsk from "./träsk"
import Öken from "./öken"

const Quebec: Room = function ({ player }) {
  const returnChoice: Choice = {
    text: "Vänd tillbaks och gå därifrån.",
    onChoose: () => ({
      text: "Du lämar slottet bakom dig och återvänder tillbaks till träsket.",
      room: Träsk,
    }),
  }

  const MainConversation: Room = () => ({
    choices: [
      {
        text: "Be om hjälp med att hitta inte-graalen.",
        onChoose: () => ({
          text:
            "Du ropar till soldaten: Gå och säg till din herre att vi har blivit utvalda av Gud till en helig uppgift, och om han vill ge oss mat och rum för natten kan han ansluta sig till oss i vårt sökande efter den heliga inte-graalen!\n\n" +
            "[Soldat]: Tja, jag ska fhråga 'onom jag throhr inthe 'an ehr så sygen, ehh, 'an 'ar redan en sehr dy.\n\n" +
            "Du frågar förvånat om soldaten verkligen är säker på att han redan har en.\n\n" +
            "[Soldat]: Oh ja, den ehr veldigt fin!",
        }),
      },
      {
        text: "Fråga om du kan få passera igenom slottet",
        onChoose: () => ({
          text:
            "[Soldat]: Så klahrt inte, du är lagomgård-typ. Kanske om du kan betala oss i guld, två guldmynt bohrde räcka..." +
            (player.gold < 2 ? `\n\nDu känner efter i dina fickor men du har bara ${player.gold} guldmynt.` : ""),
          room: () => ({
            choices: [
              {
                text: "Fråga vilken typ soldaten är.",
                onChoose: () => ({
                  text:
                    "[Soldat]: Jag ehr Quebecansk! Detta ehr staden Quebec! Vad vi göhr hehr ehr inte ditt phroblem!",
                  room: MainConversation,
                }),
              },
              ...(player.gold >= 2
                ? [
                    {
                      text: "Betala två guldmynt för att passera över lavafloden.",
                      onChoose: () => {
                        player.gold -= 2
                        return {
                          text:
                            "Du visar upp två guldmynt och efter en minut öppnas porten för dig. Efter att du betalat dina två guldmynt blir du ledd genom slottet och sedan utknuffad genom en bakdörr på andra sidan lavafloden. Dörren slås igen med en smäll och det enda ljudet som hörs kommer innifrån Quebec. Du upptar direkt din vandring åt öster.",
                          room: Öken,
                        }
                      },
                    } as Choice,
                  ]
                : []),
              returnChoice,
            ],
          }),
        }),
      },
      returnChoice,
    ],
  })

  const Conversation: Room = () => ({
    text: "[Soldat]: 'allo? Vem ehr det?\n\n" + "En man iförd rustning har dykt upp i en crenel uppe på muren.",
    choices: [
      {
        text: "Fråga vems slott detta är.",
        onChoose: () => ({
          text:
            "Det slipper ur dig att du är Ababou den Ändliges sändebud och att dessa män är dina riddare av den hyperboliska stolen. Du blir förvånad av att du tydligen måste ha tappart bort dina riddare någonstans på vägen... Du återfår dock snabbt fattningen och frågar vems slott detta är?\n\n" +
            "[Soldat]: Detta ehr min 'ehrre Guy de Lombards kybisktiska slott!",
          room: MainConversation,
        }),
      },
      returnChoice,
    ],
  })

  return {
    text:
      "Snart kommer du in i ett område med snårig, nästan bladlös, växtlighet som river i dina kläder och skymmer din sikt. Allt eftersom du kämpar dig igenom snåren hör du dock på avstånd ljudet av något som skulle kunna vara röster, troligtvis människor, men ljudet tycks inte komma från någon bestämd riktining annat än framför dig.\n\n" +
      "Plötsligt börjar snåren ge vika. Du skymtar ett slott som utanför snåren, omgivet av slät mark och med ett stort valv i södra muren. Luften doftar svagt av grus.\n\n" +
      "Du kämpar dig ur de sista snåren och ser nu att slottet ligger i hörnet av en stor stadsmur. Innifrån staden, som tycks vara en bebodd av människor, hörs liv och röster. Slottet verkar däremot övergivet. Dock är det genom slottet din väg måste leda, då ett uppenbart hinder har visat sig ligga i din väg: Från så långt ögat kan nå i söder ringlar sig en lavaflod som sedan löper rakt in under slottet därefter delar sig i tu för att omge resten av staden som en vallgrav. Slottets port som ligger framför dig är stängd.",
    choices: [
      {
        text: "Gå fram till slottsporten och knacka på.",
        onChoose: () => ({
          text: "Du går försiktigt fram mot porten och knackar på.",
          room: () => ({
            text:
              "Innefrån slottet hörs en röst som sipprar ut genom den tjocka ekporten:\n\n" +
              "[Obestämd röst]: Det ehr ingen 'emma!",
            choices: [
              {
                text: "Fråga vem du talar med i så fall.",
                onChoose: () => ({
                  text:
                    "[Ingen 'Emma]: Ehm, mitt namn ehr Ingen 'Emma och jag...\n\n" +
                    "Plötsligt blir er konversation avbruten av någon som ropar uppe från slottsmuren:",
                  room: Conversation,
                }),
              },
              returnChoice,
            ],
          }),
        }),
      },
      {
        text: "Ropa HALLÅ DÄR? över slottsmuren.",
        onChoose: () => ({
          text: "Efter en viss fördröjning hörs en man ropa till svar uppe från slottsmuren:",
          room: Conversation,
        }),
      },
    ],
  }
}

export default Quebec
