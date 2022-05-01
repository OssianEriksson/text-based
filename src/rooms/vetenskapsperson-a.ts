import { Choice, Consequence, Room } from "../game";
import VetenskapspersonFajt from "./vetenskapsperson-fajt";
import AbabouFajt from "./ababou-fajt";
import { createGameOverRoom } from "../helpers/gameOver";

const VetenskapspersonA: Room = function ({ player }) {
  const IntegralRoom: Room = () => ({
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
  });

  const AbabouEnd: Room = () => ({
    text:
      "Väl utanför berget vänder du dig om och ser hur hela berget kollapsar med ett brak. Dvärgarna är utrotade. Ababaou har dykt upp och går fram till dig med ett belåtet uttryck.\n\n" +
      "[Ababou]: Du har räddat Amazonerna och utrotat de fruktansvärda dvärgarna och deras fruktansvärda vetenskap. Nu är det dags för dig att resa hem.\n\n" +
      "Plötsligt är du tillbaka i sittningslokalen, nöjd med ditt äventyr. Men dina kamrater på sittningen är mindre nöjda, eftersom du inte varit med och städat...",
    choices: [],
  });

  const wrongIntegralSolution = (text: string): Choice => {
    const consequence: Consequence = {
      text: "Det var fel lösning! Inte-graalen exploderar i dina händer och du dör.",
      room: createGameOverRoom(),
    };

    const choices: Choice[] = [
      {
        text: "Ja.",
        onChoose: () => consequence,
      },
      {
        text: "Nej.",
        onChoose: () => ({ room: IntegralRoom }),
      },
    ];

    if (player.attributes.includes("tänka logiskt")) {
      return {
        text,
        onChoose: () => ({
          room: () => ({
            text: "Eftersom du är logiskt tänkande funderar du extra noga på om det där verkligen var rätt svar. Är du säker?",
            choices,
          }),
        }),
      };
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
      };
    }

    return {
      text,
      onChoose: () => consequence,
    };
  };

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
                onChoose: () => ({ room: VetenskapspersonFajt }),
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
                          room: IntegralRoom,
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
                room: VetenskapspersonFajt,
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
                room: VetenskapspersonFajt,
              },
      },
    ],
  };
};

export default VetenskapspersonA;
